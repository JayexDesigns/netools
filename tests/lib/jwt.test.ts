import {beforeAll, describe, expect, it} from "vitest";
import {algorithmInfo, base64UrlDecode, base64UrlEncode, claimRows, claimStatus, isJwtAlgorithm, parseErrorMessage, parseJwt, parseJsonObject, signJwt, verifyJwt} from "@/lib/jwt";

// The default token shown on jwt.io, signed with the secret "your-256-bit-secret"
const JWT_IO_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
const JWT_IO_SECRET = "your-256-bit-secret";

// Wraps DER bytes as the PEM block the key helpers expect
function toPem(der: ArrayBuffer, label: string): string {
	let binary = "";
	for (const byte of new Uint8Array(der)) binary += String.fromCharCode(byte);

	const body = btoa(binary).replace(/(.{64})/g, "$1\n");
	return `-----BEGIN ${label}-----\n${body}\n-----END ${label}-----`;
}

describe("base64UrlEncode and base64UrlDecode", () => {
	it("encodes a string as unpadded base64url", () => {
		expect(base64UrlEncode('{"alg":"HS256"}')).toBe("eyJhbGciOiJIUzI1NiJ9");
		expect(base64UrlEncode("f")).toBe("Zg");
	});

	it("maps the base64 characters that are unsafe in a URL", () => {
		expect(base64UrlEncode(new Uint8Array([251, 255]))).toBe("-_8");
		expect(base64UrlDecode("-_8")).toEqual(new Uint8Array([251, 255]));
	});

	it("round-trips strings and bytes", () => {
		const text = '{"sub":"1234567890","name":"John Doe","iat":1516239022}';
		expect(new TextDecoder().decode(base64UrlDecode(base64UrlEncode(text))!)).toBe(text);

		const bytes = new Uint8Array([0, 1, 127, 128, 255]);
		expect(base64UrlDecode(base64UrlEncode(bytes))).toEqual(bytes);
	});

	it("rejects malformed base64url", () => {
		expect(base64UrlDecode("ab!c")).toBeNull();
		expect(base64UrlDecode("a")).toBeNull();
		expect(base64UrlDecode("ab=c")).toBeNull();
		expect(base64UrlDecode("ab+/")).toBeNull();
	});
});

describe("parseJwt", () => {
	it("parses the header, payload and signing input of a known token", () => {
		const parsed = parseJwt(JWT_IO_TOKEN);
		if ("error" in parsed) throw new Error(parsed.error);

		expect(parsed.jwt.header).toEqual({alg: "HS256", typ: "JWT"});
		expect(parsed.jwt.payload).toEqual({sub: "1234567890", name: "John Doe", iat: 1516239022});
		expect(parsed.jwt.signature).toBe("SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
		expect(parsed.jwt.signingInput).toBe(`${JWT_IO_TOKEN.split(".")[0]}.${JWT_IO_TOKEN.split(".")[1]}`);
	});

	it("keeps the token as written, only trimming its ends", () => {
		const parsed = parseJwt(`  ${JWT_IO_TOKEN}  `);
		if ("error" in parsed) throw new Error(parsed.error);
		expect(parsed.jwt.raw).toBe(JWT_IO_TOKEN);
	});

	it("accepts an unsigned token with an empty signature segment", () => {
		const header = base64UrlEncode('{"alg":"none"}');
		const payload = base64UrlEncode('{"sub":"me"}');

		const parsed = parseJwt(`${header}.${payload}.`);
		if ("error" in parsed) throw new Error(parsed.error);
		expect(parsed.jwt.signature).toBe("");
		expect(parsed.jwt.payload).toEqual({sub: "me"});
	});

	it("names the first segment that is invalid", () => {
		const header = base64UrlEncode('{"alg":"HS256"}');
		const payload = base64UrlEncode('{"sub":"me"}');

		expect(parseJwt("only.two")).toEqual({error: "segments"});
		expect(parseJwt("only")).toEqual({error: "segments"});
		expect(parseJwt(`not json.${payload}.sig`)).toEqual({error: "header"});
		expect(parseJwt(`${header}.W10.sig`)).toEqual({error: "payload"});
		expect(parseJwt(`${header}.${payload}.not!base64`)).toEqual({error: "signature"});
	});

	it("keeps a human-readable message for every parse error", () => {
		for (const error of ["segments", "header", "payload", "signature"] as const) {
			expect(parseErrorMessage(error).length).toBeGreaterThan(10);
		}
	});
});

describe("parseJsonObject", () => {
	it("accepts objects and rejects everything else", () => {
		expect(parseJsonObject('{"a":1}')).toEqual({a: 1});
		expect(parseJsonObject("{}")).toEqual({});
		expect(parseJsonObject("[]")).toBeNull();
		expect(parseJsonObject('"a string"')).toBeNull();
		expect(parseJsonObject("42")).toBeNull();
		expect(parseJsonObject("{broken")).toBeNull();
	});
});

describe("claimStatus", () => {
	const now = 1700000000000;

	it("reports an expired token", () => {
		expect(claimStatus({exp: 1600000000}, now)).toBe("expired");
		expect(claimStatus({exp: 1700000000}, now)).toBe("expired");
	});

	it("reports a token that is not valid yet", () => {
		expect(claimStatus({nbf: 1800000000}, now)).toBe("not-yet-valid");
	});

	it("reports a token inside its validity window", () => {
		expect(claimStatus({exp: 1800000000}, now)).toBe("valid");
		expect(claimStatus({nbf: 1600000000, exp: 1800000000}, now)).toBe("valid");
	});

	it("reports a token with no exp claim", () => {
		expect(claimStatus({}, now)).toBe("no-exp");
		expect(claimStatus({sub: "me"}, now)).toBe("no-exp");
	});
});

describe("claimRows", () => {
	const now = 1516239022000;

	it("formats the registered claims of a payload in display order", () => {
		const rows = claimRows({exp: 1893456000, iss: "auth.example", sub: "user-1", iat: 1516239022}, now);

		expect(rows.map(row => row.label)).toEqual(["iss", "sub", "iat", "exp"]);
		expect(rows[0].value).toBe("auth.example");
		expect(rows[1].value).toBe("user-1");
		expect(rows[2].value).toContain("2018");
		expect(rows[3].value).toContain("2030");
	});

	it("only highlights the time claims that broke their window", () => {
		const expired = claimRows({exp: 1500000000, iat: 1516239022}, now);
		expect(expired.find(row => row.label === "exp")!.destructive).toBe(true);
		expect(expired.find(row => row.label === "iat")!.destructive).toBe(false);

		const early = claimRows({nbf: 1600000000}, now);
		expect(early[0].destructive).toBe(true);
	});

	it("renders claims that are not time claims as their JSON form", () => {
		const rows = claimRows({aud: ["a", "b"], iss: 42}, now);

		expect(rows.find(row => row.label === "aud")!.value).toBe('["a","b"]');
		expect(rows.find(row => row.label === "iss")!.value).toBe("42");
		expect(rows.every(row => !row.destructive)).toBe(true);
	});

	it("skips claims the payload does not carry", () => {
		expect(claimRows({sub: "only"}, now).map(row => row.label)).toEqual(["sub"]);
		expect(claimRows({}, now)).toEqual([]);
	});
});

describe("algorithmInfo and isJwtAlgorithm", () => {
	it("looks up the metadata of every supported algorithm", () => {
		expect(algorithmInfo("HS256").kind).toBe("HMAC");
		expect(algorithmInfo("RS512").kind).toBe("RSA");
		expect(algorithmInfo("none").kind).toBe("none");

		const es256 = algorithmInfo("ES256");
		expect("curve" in es256 ? es256.curve : "").toBe("P-256");
	});

	it("narrows raw strings to supported algorithms", () => {
		expect(isJwtAlgorithm("HS256")).toBe(true);
		expect(isJwtAlgorithm("none")).toBe(true);
		expect(isJwtAlgorithm("HS1")).toBe(false);
		expect(isJwtAlgorithm("")).toBe(false);
	});
});

describe("signJwt and verifyJwt with HS256", () => {
	const header = {alg: "HS256", typ: "JWT"};
	const payload = {sub: "1234567890", name: "John Doe"};

	it("verifies the well-known jwt.io token with its secret", async () => {
		await expect(verifyJwt(JWT_IO_TOKEN, "HS256", JWT_IO_SECRET)).resolves.toEqual({valid: true, message: null});
	});

	it("signs a token that verifies back with the same secret", async () => {
		const signed = await signJwt(header, payload, "HS256", "s3cret");

		expect(signed.signed).toBe(true);
		expect(signed.error).toBeNull();
		expect(signed.token.split(".")).toHaveLength(3);
		await expect(verifyJwt(signed.token, "HS256", "s3cret")).resolves.toEqual({valid: true, message: null});
	});

	it("rejects a token signed with a different secret", async () => {
		const signed = await signJwt(header, payload, "HS256", "s3cret");
		const result = await verifyJwt(signed.token, "HS256", "wrong");

		expect(result.valid).toBe(false);
		if (!result.valid) expect(result.kind).toBe("signature");
	});

	it("rejects a tampered payload", async () => {
		const signed = await signJwt(header, payload, "HS256", "s3cret");
		const parts = signed.token.split(".");
		const tampered = `${parts[0]}.${base64UrlEncode('{"sub":"admin"}')}.${parts[2]}`;

		const result = await verifyJwt(tampered, "HS256", "s3cret");
		expect(result.valid).toBe(false);
	});

	it("rejects a token checked against a different algorithm", async () => {
		const signed = await signJwt(header, payload, "HS256", "s3cret");
		const result = await verifyJwt(signed.token, "HS512", "s3cret");

		expect(result.valid).toBe(false);
	});

	it("refuses to sign without a secret but still returns the token", async () => {
		const result = await signJwt(header, payload, "HS256", "   ");

		expect(result.signed).toBe(false);
		expect(result.token.startsWith(`${base64UrlEncode(JSON.stringify(header))}.`)).toBe(true);
		expect(result.error).toContain("secret");
	});

	it("reports the parse error of a malformed token", async () => {
		const result = await verifyJwt("not.a.token!!", "HS256", "s3cret");

		expect(result.valid).toBe(false);
		if (!result.valid) expect(result.kind).toBe("token");
	});

	it("asks for a key when verifying with an empty one", async () => {
		const result = await verifyJwt(JWT_IO_TOKEN, "HS256", "");

		expect(result.valid).toBe(false);
		if (!result.valid) expect(result.kind).toBe("key");
	});
});

describe("signJwt and verifyJwt with alg none", () => {
	it("builds an unsigned token that verifies as none", async () => {
		const signed = await signJwt({alg: "none"}, {sub: "me"}, "none", "");

		expect(signed.token.endsWith(".")).toBe(true);
		expect(signed.signed).toBe(false);
		expect(signed.error).toBeNull();
		await expect(verifyJwt(signed.token, "none", "")).resolves.toEqual({valid: true, message: null});
	});

	it("rejects a signed token checked as none and an unsigned token checked with an algorithm", async () => {
		const signed = await signJwt({alg: "HS256"}, {sub: "me"}, "HS256", "s3cret");
		const asNone = await verifyJwt(signed.token, "none", "");
		expect(asNone.valid).toBe(false);
		if (!asNone.valid) expect(asNone.kind).toBe("signature");

		const unsigned = await signJwt({alg: "none"}, {sub: "me"}, "none", "");
		const asHs256 = await verifyJwt(unsigned.token, "HS256", "s3cret");
		expect(asHs256.valid).toBe(false);
		if (!asHs256.valid) expect(asHs256.message).toContain("no signature");
	});
});

describe("signJwt and verifyJwt with RSA and ECDSA", () => {
	let rsaPrivate = "";
	let rsaPublic = "";
	let otherRsaPublic = "";
	let ecPrivate = "";
	let ecPublic = "";

	beforeAll(async () => {
		const rsa = (await crypto.subtle.generateKey({name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256"}, true, ["sign", "verify"])) as CryptoKeyPair;
		const otherRsa = (await crypto.subtle.generateKey({name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256"}, true, ["sign", "verify"])) as CryptoKeyPair;
		const ec = (await crypto.subtle.generateKey({name: "ECDSA", namedCurve: "P-256"}, true, ["sign", "verify"])) as CryptoKeyPair;

		rsaPrivate = toPem(await crypto.subtle.exportKey("pkcs8", rsa.privateKey), "PRIVATE KEY");
		rsaPublic = toPem(await crypto.subtle.exportKey("spki", rsa.publicKey), "PUBLIC KEY");
		otherRsaPublic = toPem(await crypto.subtle.exportKey("spki", otherRsa.publicKey), "PUBLIC KEY");
		ecPrivate = toPem(await crypto.subtle.exportKey("pkcs8", ec.privateKey), "PRIVATE KEY");
		ecPublic = toPem(await crypto.subtle.exportKey("spki", ec.publicKey), "PUBLIC KEY");
	}, 30000);

	it("signs and verifies an RS256 token", async () => {
		const signed = await signJwt({alg: "RS256"}, {sub: "rsa"}, "RS256", rsaPrivate);

		expect(signed.signed).toBe(true);
		await expect(verifyJwt(signed.token, "RS256", rsaPublic)).resolves.toEqual({valid: true, message: null});

		const wrongKey = await verifyJwt(signed.token, "RS256", otherRsaPublic);
		expect(wrongKey.valid).toBe(false);
	});

	it("signs and verifies an ES256 token", async () => {
		const signed = await signJwt({alg: "ES256"}, {sub: "ecdsa"}, "ES256", ecPrivate);

		expect(signed.signed).toBe(true);
		await expect(verifyJwt(signed.token, "ES256", ecPublic)).resolves.toEqual({valid: true, message: null});
	});

	it("refuses to sign with a public key or an unsupported private key format", async () => {
		const publicResult = await signJwt({alg: "RS256"}, {sub: "x"}, "RS256", rsaPublic);
		expect(publicResult.signed).toBe(false);
		expect(publicResult.error).toContain("public key");

		const garbage = await signJwt({alg: "RS256"}, {sub: "x"}, "RS256", "not a key at all");
		expect(garbage.signed).toBe(false);
		expect(garbage.error).toBeTruthy();
	});

	it("refuses to verify with a private key", async () => {
		const result = await verifyJwt(JWT_IO_TOKEN, "RS256", rsaPrivate);

		expect(result.valid).toBe(false);
		if (!result.valid) expect(result.message).toContain("private key");
	});
});
