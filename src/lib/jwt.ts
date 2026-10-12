// JSON Web Token encoding, decoding, signing and verification
// Everything runs locally: tokens are parsed with base64url/JSON helpers and signatures are computed
// with the Web Crypto API, so no token or key ever reaches the network

// Algorithms a JWT can be signed with, in the order they are displayed
export const JWT_ALGORITHMS = [
	{value: "HS256", label: "HS256 (HMAC SHA-256)", kind: "HMAC", hash: "SHA-256"},
	{value: "HS384", label: "HS384 (HMAC SHA-384)", kind: "HMAC", hash: "SHA-384"},
	{value: "HS512", label: "HS512 (HMAC SHA-512)", kind: "HMAC", hash: "SHA-512"},
	{value: "RS256", label: "RS256 (RSA PKCS#1 SHA-256)", kind: "RSA", hash: "SHA-256"},
	{value: "RS384", label: "RS384 (RSA PKCS#1 SHA-384)", kind: "RSA", hash: "SHA-384"},
	{value: "RS512", label: "RS512 (RSA PKCS#1 SHA-512)", kind: "RSA", hash: "SHA-512"},
	{value: "ES256", label: "ES256 (ECDSA P-256 SHA-256)", kind: "ECDSA", hash: "SHA-256", curve: "P-256"},
	{value: "ES384", label: "ES384 (ECDSA P-384 SHA-384)", kind: "ECDSA", hash: "SHA-384", curve: "P-384"},
	{value: "ES512", label: "ES512 (ECDSA P-521 SHA-512)", kind: "ECDSA", hash: "SHA-512", curve: "P-521"},
	{value: "none", label: "none (unsigned)", kind: "none", hash: ""}
] as const;

export type JwtAlgorithm = (typeof JWT_ALGORITHMS)[number]["value"];
export type AlgorithmInfo = (typeof JWT_ALGORITHMS)[number];

// Looks up an algorithm's metadata, falls back to the first entry so callers never see undefined
export function algorithmInfo(alg: JwtAlgorithm): AlgorithmInfo {
	return JWT_ALGORITHMS.find(entry => entry.value === alg) ?? JWT_ALGORITHMS[0];
}

// Narrows a raw string to a supported algorithm, used to read the alg claim of a pasted token
export function isJwtAlgorithm(value: string): value is JwtAlgorithm {
	return JWT_ALGORITHMS.some(entry => entry.value === value);
}

export function isWebCryptoAvailable(): boolean {
	return typeof crypto !== "undefined" && Boolean(crypto.subtle);
}

const SECURE_CONTEXT_MESSAGE = "Signing and verification need the Web Crypto API, which browsers only expose in a secure context (HTTPS or localhost). Decoding still works.";

export type JwtHeader = Record<string, unknown>;
export type JwtPayload = Record<string, unknown>;

export type ParsedJwt = {
	raw: string;
	header: JwtHeader;
	payload: JwtPayload;
	// Signature segment, empty for unsigned tokens
	signature: string;
	// The ASCII string the signature is computed over: b64(header) + "." + b64(payload)
	signingInput: string;
};

export type JwtParseError = "segments" | "header" | "payload" | "signature";

const PARSE_ERRORS: Record<JwtParseError, string> = {
	segments: "A JWT is three dot-separated segments: header.payload.signature.",
	header: "Segment 1 is not a base64url-encoded JSON object.",
	payload: "Segment 2 is not a base64url-encoded JSON object.",
	signature: "Segment 3 is not valid base64url."
};

export function parseErrorMessage(error: JwtParseError): string {
	return PARSE_ERRORS[error];
}

// Decodes a base64 (or base64url when `urlSafe`) string into its bytes, or null when the input is malformed
function decodeBase64(input: string, urlSafe: boolean): Uint8Array<ArrayBuffer> | null {
	const body = input.replace(/=+$/, "");
	const alphabet = urlSafe ? /^[A-Za-z0-9_-]+$/ : /^[A-Za-z0-9+/]+$/;
	if (body !== "" && !alphabet.test(body)) return null;

	const normalized = urlSafe ? body.replaceAll("-", "+").replaceAll("_", "/") : body;
	const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));

	let binary: string;
	try {
		binary = atob(normalized + padding);
	} catch {
		return null;
	}

	const bytes = new Uint8Array(binary.length);
	for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
	return bytes;
}

// Encodes a string (UTF-8) or raw bytes as base64url without padding
// For example `{"alg":"HS256"}` -> `eyJhbGciOiJIUzI1NiJ9`
export function base64UrlEncode(input: string | Uint8Array): string {
	const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;

	let binary = "";
	for (let index = 0; index < bytes.length; index++) binary += String.fromCharCode(bytes[index]);

	return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

// Decodes a base64url string back into its bytes, or null when a character or the padding is malformed
export function base64UrlDecode(input: string): Uint8Array<ArrayBuffer> | null {
	return decodeBase64(input, true);
}

// Parses base64url-encoded JSON into an object, or null when it is not an object (arrays and scalars are rejected)
function decodeJsonObject(segment: string): JwtHeader | null {
	const bytes = base64UrlDecode(segment);
	if (bytes === null) return null;

	let value: unknown;
	try {
		value = JSON.parse(new TextDecoder().decode(bytes));
	} catch {
		return null;
	}

	if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
	return value as JwtHeader;
}

// Parses a compact JWT into its header, payload and signature, or names the first segment that is invalid
export function parseJwt(token: string): {jwt: ParsedJwt} | {error: JwtParseError} {
	const raw = token.trim();
	const parts = raw.split(".");
	if (parts.length !== 3) return {error: "segments"};

	const header = decodeJsonObject(parts[0]);
	if (header === null) return {error: "header"};

	const payload = decodeJsonObject(parts[1]);
	if (payload === null) return {error: "payload"};

	// Unsigned tokens keep an empty third segment, anything else must be valid base64url
	if (parts[2] !== "" && base64UrlDecode(parts[2]) === null) return {error: "signature"};

	return {jwt: {raw, header, payload, signature: parts[2], signingInput: `${parts[0]}.${parts[1]}`}};
}

// Parses free-form JSON text into an object, or null when it is not an object (used to validate the edited header/payload)
export function parseJsonObject(text: string): JwtHeader | null {
	let value: unknown;
	try {
		value = JSON.parse(text);
	} catch {
		return null;
	}

	if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
	return value as JwtHeader;
}

// Thrown by the key helpers so callers can tell a friendly key problem from an unexpected failure
class KeyError extends Error {}

function keyErrorMessage(error: unknown, fallback: string): string {
	return error instanceof KeyError ? error.message : fallback;
}

const PEM_PATTERN = /-----BEGIN ([A-Za-z0-9 ]+)-----\s*([\s\S]*?)\s*-----END [A-Za-z0-9 ]+-----/;

// Extracts the DER bytes from a PEM block or a bare base64 DER blob
function keyDer(input: string): Uint8Array<ArrayBuffer> {
	const trimmed = input.trim();
	const match = PEM_PATTERN.exec(trimmed);

	if (match === null) {
		const bare = trimmed.replaceAll(/\s/g, "");
		const der = decodeBase64(bare, false);
		if (der === null) throw new KeyError("The key is not a valid PEM block or base64 DER key.");
		return der;
	}

	const der = decodeBase64(match[2].replaceAll(/\s/g, ""), false);
	if (der === null) throw new KeyError("The base64 body of the PEM block is malformed.");
	return der;
}

// Rejects key types Web Crypto cannot read before importKey produces an opaque DOMException
function checkKeyLabel(label: string, usage: "sign" | "verify"): void {
	if (usage === "sign") {
		if (label === "PUBLIC KEY" || label === "RSA PUBLIC KEY") throw new KeyError("That is a public key, paste the PKCS#8 private key to sign.");
		if (label === "RSA PRIVATE KEY") throw new KeyError("PKCS#1 private keys are not supported, convert it with openssl pkcs8 -topk8 -in old.pem -out new.pem.");
		if (label === "EC PRIVATE KEY") throw new KeyError("SEC1 private keys are not supported, convert it with openssl pkcs8 -topk8 -in old.pem -out new.pem.");
		return;
	}

	if (label === "PRIVATE KEY" || label === "RSA PRIVATE KEY" || label === "EC PRIVATE KEY") throw new KeyError("That is a private key, paste the public key (-----BEGIN PUBLIC KEY-----) to verify.");
}

// Algorithms that actually use a key, alg none never reaches the crypto helpers
type SignableAlgorithm = Exclude<AlgorithmInfo, {kind: "none"}>;

// Reads the algorithm's key: the raw UTF-8 bytes of an HMAC secret, or the DER of an SPKI/PKCS#8 PEM
async function importAlgorithmKey(info: SignableAlgorithm, source: string, usage: "sign" | "verify"): Promise<CryptoKey> {
	if (info.kind === "HMAC") {
		return crypto.subtle.importKey("raw", new TextEncoder().encode(source), {name: "HMAC", hash: info.hash}, false, [usage]);
	}

	const label = PEM_PATTERN.exec(source.trim())?.[1] ?? "";
	checkKeyLabel(label, usage);

	const der = keyDer(source);
	const format = usage === "sign" ? "pkcs8" : "spki";

	if (info.kind === "RSA") return crypto.subtle.importKey(format, der, {name: "RSASSA-PKCS1-v1_5", hash: info.hash}, false, [usage]);
	return crypto.subtle.importKey(format, der, {name: "ECDSA", namedCurve: info.curve}, false, [usage]);
}

// Parameters for sign/verify, HMAC and RSA take plain algorithm names while ECDSA also carries the hash
function signatureParams(info: SignableAlgorithm): AlgorithmIdentifier | EcdsaParams {
	if (info.kind === "ECDSA") return {name: "ECDSA", hash: info.hash};
	if (info.kind === "RSA") return {name: "RSASSA-PKCS1-v1_5"};
	return {name: "HMAC"};
}

export type SignResult = {
	// Always the re-encoded token, its signature segment is empty when signing was not possible
	token: string;
	signed: boolean;
	// Human-readable reason the signature could not be computed, null on success (or for alg none)
	error: string | null;
};

// Encodes a header and payload into a compact JWT and signs it with the selected algorithm
// The token is returned even when signing fails so edits are never silently dropped
export async function signJwt(header: JwtHeader, payload: JwtPayload, alg: JwtAlgorithm, source: string): Promise<SignResult> {
	const info = algorithmInfo(alg);
	const signingInput = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}`;

	if (info.kind === "none") return {token: `${signingInput}.`, signed: false, error: null};
	if (source.trim() === "") return {token: `${signingInput}.`, signed: false, error: `Enter the ${info.kind === "HMAC" ? "secret" : "private key"} to sign with ${alg}.`};
	if (!isWebCryptoAvailable()) return {token: `${signingInput}.`, signed: false, error: SECURE_CONTEXT_MESSAGE};

	try {
		const key = await importAlgorithmKey(info, source, "sign");
		const signature = await crypto.subtle.sign(signatureParams(info), key, new TextEncoder().encode(signingInput));
		return {token: `${signingInput}.${base64UrlEncode(new Uint8Array(signature))}`, signed: true, error: null};
	} catch (error) {
		return {token: `${signingInput}.`, signed: false, error: keyErrorMessage(error, `The token could not be signed with ${alg}.`)};
	}
}

export type VerifyResult =
	| {valid: true; message: null}
	// kind tells apart a bad key (shown as "not checked") from a signature that simply does not match
	| {valid: false; kind: "token" | "key" | "signature"; message: string};

// Verifies a compact JWT against the selected algorithm and key
// The algorithm comes from the UI, never from the token header, so an alg swap cannot re-target the check
export async function verifyJwt(token: string, alg: JwtAlgorithm, source: string): Promise<VerifyResult> {
	const parsed = parseJwt(token);
	if ("error" in parsed) return {valid: false, kind: "token", message: parseErrorMessage(parsed.error)};

	const info = algorithmInfo(alg);
	if (info.kind === "none") {
		return parsed.jwt.signature === ""
			? {valid: true, message: null}
			: {valid: false, kind: "signature", message: "The token carries a signature but the algorithm is none."};
	}

	if (parsed.jwt.signature === "") return {valid: false, kind: "signature", message: "The token has no signature."};
	if (source.trim() === "") return {valid: false, kind: "key", message: `Enter the ${info.kind === "HMAC" ? "secret" : "public key"} to verify the signature.`};
	if (!isWebCryptoAvailable()) return {valid: false, kind: "key", message: SECURE_CONTEXT_MESSAGE};

	const signature = base64UrlDecode(parsed.jwt.signature);
	if (signature === null) return {valid: false, kind: "signature", message: PARSE_ERRORS.signature};

	try {
		const key = await importAlgorithmKey(info, source, "verify");
		// Web Crypto returns ECDSA signatures as raw r||s, which is exactly the format RFC 7518 requires
		const valid = await crypto.subtle.verify(signatureParams(info), key, signature, new TextEncoder().encode(parsed.jwt.signingInput));
		return valid ? {valid: true, message: null} : {valid: false, kind: "signature", message: "The signature does not match this key and algorithm."};
	} catch (error) {
		return {valid: false, kind: "key", message: keyErrorMessage(error, "The key could not be read, paste a PEM (PKCS#8 to sign, SPKI to verify) or base64 DER key.")};
	}
}

export type ClaimStatus = "expired" | "not-yet-valid" | "valid" | "no-exp";

// Claims shown in the summary table, in display order
export const CLAIM_LABELS = ["iss", "sub", "aud", "iat", "nbf", "exp"] as const;

const TIME_CLAIMS: ReadonlySet<string> = new Set(["iat", "nbf", "exp"]);

// Whether the exp/nbf window of a payload has passed, based on the current time
export function claimStatus(payload: JwtPayload, now = Date.now()): ClaimStatus {
	const exp = typeof payload.exp === "number" ? payload.exp : null;
	const nbf = typeof payload.nbf === "number" ? payload.nbf : null;

	if (exp !== null && now >= exp * 1000) return "expired";
	if (nbf !== null && now < nbf * 1000) return "not-yet-valid";
	if (exp !== null) return "valid";
	return "no-exp";
}

export type ClaimRow = {
	label: string;
	value: string;
	// Claims outside their validity window are highlighted in the destructive color
	destructive: boolean;
};

// Formats the registered claims of a payload for display: time claims become local dates, everything else its JSON form
export function claimRows(payload: JwtPayload, now = Date.now()): ClaimRow[] {
	return CLAIM_LABELS.filter(label => payload[label] !== undefined).map(label => {
		const value = payload[label];

		if (TIME_CLAIMS.has(label) && typeof value === "number") {
			const time = value * 1000;
			return {
				label,
				value: new Date(time).toLocaleString(),
				destructive: (label === "exp" && now >= time) || (label === "nbf" && now < time)
			};
		}

		return {label, value: typeof value === "string" ? value : JSON.stringify(value) ?? String(value), destructive: false};
	});
}

export type VerifyState = {
	status: "unchecked" | "checking" | "valid" | "invalid" | "unsigned";
	message: string | null;
};

// Which direction the page is flowing: decoding reads a token into its parts, encoding builds a token from its parts
export type JwtMode = "decode" | "encode";
