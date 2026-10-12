import CardSection from "@/components/card-section";
import CopyButton from "@/components/copy-button";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {parseErrorMessage, type JwtMode, type JwtParseError} from "@/lib/jwt";
import {cn} from "cn";

type TokenSectionProps = {
	mode: JwtMode;
	token: string;
	error: JwtParseError | null;
	onTokenChange: (value: string) => void;
};

export default function TokenSection({mode, token, error, onTokenChange}: TokenSectionProps) {
	const readOnly = mode === "encode";
	const hint = error !== null ? parseErrorMessage(error) : readOnly ? "The token is rebuilt here as you edit the header and payload below." : "Paste a JWT to decode its header and payload below, or flip the switch above to Encode to build one.";

	return (
		<CardSection id="jwt-token" title="Token" description={readOnly ? "The encoded result of the parts below, updated as you edit them." : "Paste a compact JSON Web Token here to split it into its parts."}>
			<div className="flex flex-col gap-2">
				<div className="flex justify-between items-center">
					<Label htmlFor="jwt-token-input" className="text-muted-foreground">
						Token
					</Label>
					<CopyButton value={token} label="token" disabled={token.trim() === ""} className="bg-transparent hover:bg-muted border border-input text-foreground" />
				</div>

				<Textarea id="jwt-token-input" spellCheck={false} autoComplete="off" readOnly={readOnly} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" value={token} aria-invalid={error !== null} aria-describedby="jwt-token-hint" onChange={event => onTokenChange(event.target.value)} className={cn("min-h-24 font-mono md:text-sm", readOnly && "cursor-default")} />
			</div>

			<p id="jwt-token-hint" className={error === null ? "text-muted-foreground text-sm" : "text-destructive text-sm"}>
				{hint}
			</p>
		</CardSection>
	);
}
