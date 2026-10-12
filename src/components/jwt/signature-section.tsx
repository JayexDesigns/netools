import CardSection from "@/components/card-section";
import ConverterField from "@/components/converter-field";
import {Badge} from "@/components/ui/badge";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {JWT_ALGORITHMS, algorithmInfo, type JwtAlgorithm, type JwtMode, type VerifyState} from "@/lib/jwt";

type SignatureSectionProps = {
	mode: JwtMode;
	alg: JwtAlgorithm;
	signingKey: string;
	verifyState: VerifyState;
	signError: string | null;
	mismatch: string | null;
	onAlgChange: (alg: JwtAlgorithm) => void;
	onSigningKeyChange: (value: string) => void;
};

const STATUS_LABELS: Record<VerifyState["status"], string> = {
	unchecked: "Not checked",
	checking: "Checking…",
	valid: "Verified",
	invalid: "Invalid",
	unsigned: "Unsigned"
};

const STATUS_VARIANTS: Record<VerifyState["status"], "default" | "outline" | "destructive"> = {
	unchecked: "outline",
	checking: "outline",
	valid: "default",
	invalid: "destructive",
	unsigned: "destructive"
};

const STATUS_FALLBACKS: Record<VerifyState["status"], string> = {
	unchecked: "Paste or build a token to verify its signature.",
	checking: "Checking the signature…",
	valid: "The signature matches the selected algorithm and key.",
	invalid: "",
	unsigned: ""
};

export default function SignatureSection({mode, alg, signingKey, verifyState, signError, mismatch, onAlgChange, onSigningKeyChange}: SignatureSectionProps) {
	const info = algorithmInfo(alg);
	const status = verifyState.status;
	const signing = mode === "encode";

	// The most actionable message wins: a header that lies about its alg, then a failed signature, then the check result
	const message = mismatch ?? signError ?? verifyState.message ?? STATUS_FALLBACKS[status];
	const destructive = mismatch !== null || signError !== null || status === "invalid" || status === "unsigned";

	return (
		<CardSection id="jwt-signature" title="Signature" description={signing ? "Pick the algorithm and enter the key to sign with: an HMAC secret or a PKCS#8 private key. Signing runs locally through the Web Crypto API, the key never leaves the browser." : "Pick the algorithm to check the token against and enter the key: the HMAC secret or an SPKI public key. Verification runs locally through the Web Crypto API, the key never leaves the browser."}>
			<div className="flex flex-wrap justify-between items-end gap-4">
				<div className="flex flex-col gap-2">
					<Label htmlFor="jwt-algorithm" className="text-muted-foreground">
						Algorithm
					</Label>
					<Select value={alg} onValueChange={value => onAlgChange(value as JwtAlgorithm)}>
						<SelectTrigger id="jwt-algorithm" className="w-full sm:w-72" aria-label="JWT algorithm">
							<SelectValue />
						</SelectTrigger>

						<SelectContent>
							{JWT_ALGORITHMS.map(option => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex flex-col items-end gap-2">
					<span className="text-muted-foreground text-sm">Signature</span>
					<Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>
				</div>
			</div>

			{info.kind === "none" ? (
				<p className="text-muted-foreground text-sm">Tokens with alg none carry no signature, so no key is needed.</p>
			) : info.kind === "HMAC" ? (
				<ConverterField id="jwt-secret" label="Secret" placeholder="your-256-bit-secret" value={signingKey} invalid={false} hintId="jwt-signature-hint" onValueChange={onSigningKeyChange} type="password" copy />
			) : (
				<div className="flex flex-col gap-2">
					<Label htmlFor="jwt-key-input" className="text-muted-foreground">
						{info.kind === "RSA" ? "RSA key (PEM)" : "EC key (PEM)"}
					</Label>
					<Textarea id="jwt-key-input" spellCheck={false} autoComplete="off" placeholder="-----BEGIN PRIVATE KEY-----" value={signingKey} aria-describedby="jwt-signature-hint" onChange={event => onSigningKeyChange(event.target.value)} className="min-h-28 font-mono md:text-sm" />
					<p className="text-muted-foreground text-sm">{signing ? "Paste the PKCS#8 private key (or an HMAC secret above) to sign with, as a PEM block or bare base64 DER." : "Paste the SPKI public key (or the HMAC secret above) the token was signed with, as a PEM block or bare base64 DER."}</p>
				</div>
			)}

			<p id="jwt-signature-hint" className={destructive ? "text-destructive text-sm" : "text-muted-foreground text-sm"}>
				{message}
			</p>
		</CardSection>
	);
}
