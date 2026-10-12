import PartsSection from "@/components/jwt/parts-section";
import SignatureSection from "@/components/jwt/signature-section";
import TokenSection from "@/components/jwt/token-section";
import InlineCode from "@/components/inline-code";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {algorithmInfo, isJwtAlgorithm, parseJsonObject, parseJwt, signJwt, verifyJwt, type JwtAlgorithm, type JwtMode, type JwtParseError, type VerifyState} from "@/lib/jwt";
import {useRef, useState} from "react";

const UNSIGNED_MESSAGE = "Tokens with alg none carry no signature and are rejected by most services.";

const MODE_DESCRIPTIONS: Record<JwtMode, string> = {
	decode: "Paste a token to fill in the header and payload below, then enter the key to check its signature.",
	encode: "Edit the header and payload below to rebuild the token, signed with the algorithm and key you select."
};

export default function JwtEncoderDecoder() {
	const [mode, setMode] = useState<JwtMode>("decode");
	const [token, setToken] = useState("");
	const [tokenError, setTokenError] = useState<JwtParseError | null>(null);
	const [headerText, setHeaderText] = useState("");
	const [payloadText, setPayloadText] = useState("");
	const [jsonError, setJsonError] = useState<"header" | "payload" | null>(null);
	const [alg, setAlg] = useState<JwtAlgorithm>("HS256");
	const [signingKey, setSigningKey] = useState("");
	const [signError, setSignError] = useState<string | null>(null);
	const [verifyState, setVerifyState] = useState<VerifyState>({status: "unchecked", message: null});
	// Monotonic ids so a slow signature or check can never overwrite the result of a newer edit
	const signId = useRef(0);
	const verifyId = useRef(0);

	// Checks the current token against the selected algorithm and key, keeping only the newest run's answer
	async function runVerify(rawToken: string, nextAlg: JwtAlgorithm, nextKey: string) {
		const id = ++verifyId.current;
		const info = algorithmInfo(nextAlg);

		if (rawToken.trim() === "") {
			setVerifyState({status: "unchecked", message: null});
			return;
		}

		const parsed = parseJwt(rawToken);
		if ("error" in parsed) {
			// The token section already names the segment that failed to parse
			setVerifyState({status: "unchecked", message: "The token cannot be decoded, fix it in the token section."});
			return;
		}

		if (info.kind === "none") {
			setVerifyState({status: "unsigned", message: UNSIGNED_MESSAGE});
			return;
		}

		if (parsed.jwt.signature === "") {
			setVerifyState({status: "unsigned", message: "The token has no signature."});
			return;
		}

		if (nextKey.trim() === "") {
			setVerifyState({status: "unchecked", message: `Enter the ${info.kind === "HMAC" ? "secret" : "public key"} to verify the signature.`});
			return;
		}

		setVerifyState({status: "checking", message: null});

		const result = await verifyJwt(rawToken, nextAlg, nextKey);
		if (id !== verifyId.current) return;

		if (result.valid) setVerifyState({status: "valid", message: null});
		else if (result.kind === "signature") setVerifyState({status: "invalid", message: result.message});
		else if (result.kind === "key") setVerifyState({status: "unchecked", message: result.message});
		else setVerifyState({status: "unchecked", message: null});
	}

	// Re-encodes the edited header/payload and signs them, then checks the fresh token
	// The token is updated even when signing fails so an edit is never silently dropped
	async function recompute(header: Record<string, unknown>, payload: Record<string, unknown>, nextAlg: JwtAlgorithm, nextKey: string) {
		const id = ++signId.current;
		const result = await signJwt(header, payload, nextAlg, nextKey);
		if (id !== signId.current) return;

		setToken(result.token);
		setTokenError(null);
		setSignError(result.error);
		await runVerify(result.token, nextAlg, nextKey);
	}

	// Treats a token as the source of truth: refreshes the parts and algorithm from it and checks its signature
	function adoptToken(raw: string) {
		// An adopted token wins over any re-encode still in flight
		signId.current++;
		setToken(raw);
		setSignError(null);

		if (raw.trim() === "") {
			setTokenError(null);
			void runVerify(raw, alg, signingKey);
			return;
		}

		const parsed = parseJwt(raw);
		if ("error" in parsed) {
			setTokenError(parsed.error);
			void runVerify(raw, alg, signingKey);
			return;
		}

		setTokenError(null);
		setJsonError(null);
		setHeaderText(JSON.stringify(parsed.jwt.header, null, 2));
		setPayloadText(JSON.stringify(parsed.jwt.payload, null, 2));

		// Follow the alg the token declares so verification starts on the right algorithm
		const declared = parsed.jwt.header.alg;
		const nextAlg = typeof declared === "string" && isJwtAlgorithm(declared) ? declared : alg;
		setAlg(nextAlg);
		void runVerify(raw, nextAlg, signingKey);
	}

	function handleTokenChange(raw: string) {
		if (mode !== "decode") return;
		adoptToken(raw);
	}

	function handleModeChange(next: JwtMode) {
		if (next === mode) return;
		setMode(next);

		if (next === "decode") {
			// The token becomes the source of truth, exactly as if it had just been pasted
			adoptToken(token);
			return;
		}

		// Encoding makes the parts the source of truth: sign them while the token has no usable signature yet
		const header = parseJsonObject(headerText);
		const payload = parseJsonObject(payloadText);
		if (header === null || payload === null) return;

		const parsed = parseJwt(token);
		if ("error" in parsed || parsed.jwt.signature === "") void recompute(header, payload, alg, signingKey);
	}

	function handlePartChange(which: "header" | "payload", raw: string) {
		if (mode !== "encode") return;

		if (which === "header") setHeaderText(raw);
		else setPayloadText(raw);

		const header = parseJsonObject(which === "header" ? raw : headerText);
		const payload = parseJsonObject(which === "payload" ? raw : payloadText);

		if (header === null) {
			setJsonError("header");
			return;
		}
		if (payload === null) {
			setJsonError("payload");
			return;
		}

		setJsonError(null);
		void recompute(header, payload, alg, signingKey);
	}

	function handleAlgChange(nextAlg: JwtAlgorithm) {
		setAlg(nextAlg);

		if (mode === "decode") {
			// Decoding never edits the token, only re-checks it with the newly selected algorithm
			void runVerify(token, nextAlg, signingKey);
			return;
		}

		const header = parseJsonObject(headerText);
		const payload = parseJsonObject(payloadText);
		if (header === null || payload === null) return;

		// The select is the source of truth, rewrite the header's alg claim so the token never lies
		header.alg = nextAlg;
		setHeaderText(JSON.stringify(header, null, 2));
		void recompute(header, payload, nextAlg, signingKey);
	}

	function handleSigningKeyChange(raw: string) {
		setSigningKey(raw);

		if (mode === "decode") {
			// Decoding only verifies, a pasted signature is never replaced by the typed key
			void runVerify(token, alg, raw);
			return;
		}

		const header = parseJsonObject(headerText);
		const payload = parseJsonObject(payloadText);
		if (header === null || payload === null) return;

		const parsed = parseJwt(token);
		const needsSignature = "error" in parsed || parsed.jwt.signature === "";

		if (needsSignature) {
			// A token without a signature is signed as soon as a key is available
			void recompute(header, payload, alg, raw);
		} else {
			// A pasted signature is left untouched so checking it can still fail against the typed key
			void runVerify(token, alg, raw);
		}
	}

	const headerObject = parseJsonObject(headerText);
	const declaredAlg = headerObject !== null && typeof headerObject.alg === "string" ? headerObject.alg : null;
	const mismatch = declaredAlg !== null && declaredAlg !== alg ? `The header declares ${declaredAlg} while ${alg} is selected, the token is ${mode === "encode" ? "signed" : "checked"} with ${alg}.` : null;

	return (
		<div className="isolate relative min-h-dvh overflow-x-clip text-foreground">
			<main className="relative mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-24 max-w-5xl">
				<header className="flex flex-col gap-5">
					<h1 className="font-heading font-bold text-3xl sm:text-4xl tracking-tight">JWT Encoder/Decoder</h1>

					<p className="text-muted-foreground leading-relaxed">
						Decode, build and sign JSON Web Tokens: paste one to split it into its header, payload and signature, or flip the switch below to Encode and rebuild it from edited parts with HS256, RS256, ES256 and friends. Example: <InlineCode className="whitespace-nowrap">eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0MiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</InlineCode>. Everything runs in your browser, the token and any key you enter never leave your device.
					</p>
				</header>

				<div className="flex flex-col gap-6 mt-8">
					<div className="flex flex-wrap justify-between items-center gap-x-6 gap-y-2">
						<div className="flex items-center gap-3">
							<Label htmlFor="jwt-mode" className={mode === "decode" ? "text-foreground" : "text-muted-foreground"}>
								Decode
							</Label>
							<Switch id="jwt-mode" checked={mode === "encode"} onCheckedChange={checked => handleModeChange(checked ? "encode" : "decode")} aria-label="Switch between decoding and encoding a token" />
							<Label htmlFor="jwt-mode" className={mode === "encode" ? "text-foreground" : "text-muted-foreground"}>
								Encode
							</Label>
						</div>

						<p className="text-muted-foreground text-sm">{MODE_DESCRIPTIONS[mode]}</p>
					</div>

					{mode === "decode" && <TokenSection mode={mode} token={token} error={tokenError} onTokenChange={handleTokenChange} />}
					<PartsSection mode={mode} headerText={headerText} payloadText={payloadText} jsonError={jsonError} onHeaderChange={value => handlePartChange("header", value)} onPayloadChange={value => handlePartChange("payload", value)} />
					<SignatureSection mode={mode} alg={alg} signingKey={signingKey} verifyState={verifyState} signError={mode === "encode" ? signError : null} mismatch={mismatch} onAlgChange={handleAlgChange} onSigningKeyChange={handleSigningKeyChange} />
					{mode === "encode" && <TokenSection mode={mode} token={token} error={tokenError} onTokenChange={handleTokenChange} />}
				</div>
			</main>
		</div>
	);
}
