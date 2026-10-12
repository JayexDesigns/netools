import CardSection from "@/components/card-section";
import CopyButton from "@/components/copy-button";
import {Badge} from "@/components/ui/badge";
import {Label} from "@/components/ui/label";
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table";
import {Textarea} from "@/components/ui/textarea";
import {CLAIM_LABELS, claimRows, claimStatus, parseJsonObject, type ClaimStatus, type JwtMode} from "@/lib/jwt";
import {cn} from "cn";

type PartsSectionProps = {
	mode: JwtMode;
	headerText: string;
	payloadText: string;
	jsonError: "header" | "payload" | null;
	onHeaderChange: (value: string) => void;
	onPayloadChange: (value: string) => void;
};

const STATUS_LABELS: Record<ClaimStatus, string> = {
	"expired": "Expired",
	"not-yet-valid": "Not yet valid",
	"valid": "Valid",
	"no-exp": "No expiry claim"
};

const STATUS_VARIANTS: Record<ClaimStatus, "default" | "outline" | "destructive"> = {
	"expired": "destructive",
	"not-yet-valid": "destructive",
	"valid": "default",
	"no-exp": "outline"
};

export default function PartsSection({mode, headerText, payloadText, jsonError, onHeaderChange, onPayloadChange}: PartsSectionProps) {
	const readOnly = mode === "decode";

	const description = readOnly ? "The header and payload decoded from the token above, displayed as plain JSON." : "Both parts are JSON objects encoded as base64url. Edit either one and the token below is rebuilt and re-signed with the algorithm and key in the signature section.";

	const hint = readOnly ? (jsonError === null ? "These fields mirror the token above, switch to Encode to edit them and rebuild it." : "These parts do not match the token above, paste a valid token to refresh them.") : jsonError === "header" ? 'The header must be a JSON object, for example {"alg": "HS256", "typ": "JWT"}. Fix it to update the token.' : jsonError === "payload" ? 'The payload must be a JSON object, for example {"sub": "42"}. Fix it to update the token.' : "Both fields must be JSON objects. Edits are encoded into the token and signed with the key below.";

	const payload = parseJsonObject(payloadText);
	const rows = payload === null ? [] : claimRows(payload);
	const status = payload === null ? "no-exp" : claimStatus(payload);

	return (
		<CardSection id="jwt-parts" title="Header & payload" description={description}>
			<div className="gap-4 grid sm:grid-cols-2">
				<div className="flex flex-col gap-2">
					<Label htmlFor="jwt-header-input" className="text-muted-foreground">
						Header
					</Label>
					<Textarea id="jwt-header-input" spellCheck={false} autoComplete="off" readOnly={readOnly} placeholder='{"alg": "HS256", "typ": "JWT"}' value={headerText} aria-invalid={jsonError === "header"} aria-describedby="jwt-parts-hint" onChange={event => onHeaderChange(event.target.value)} className={cn("min-h-32 font-mono md:text-sm", readOnly && "cursor-default")} />
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="jwt-payload-input" className="text-muted-foreground">
						Payload
					</Label>
					<Textarea id="jwt-payload-input" spellCheck={false} autoComplete="off" readOnly={readOnly} placeholder='{"sub": "42", "name": "Ada", "exp": 1893456000}' value={payloadText} aria-invalid={jsonError === "payload"} aria-describedby="jwt-parts-hint" onChange={event => onPayloadChange(event.target.value)} className={cn("min-h-32 font-mono md:text-sm", readOnly && "cursor-default")} />
				</div>
			</div>

			<p id="jwt-parts-hint" className={jsonError === null ? "text-muted-foreground text-sm" : "text-destructive text-sm"}>
				{hint}
			</p>

			<div className="flex flex-col gap-3 pt-4 border-border border-t">
				<div className="flex justify-between items-center gap-2">
					<span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Registered claims</span>
					{payload !== null && <Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>}
				</div>

				{rows.length > 0 ? (
					<div className="border border-border rounded-xl overflow-hidden">
						<Table>
							<TableBody>
								{rows.map(row => (
									<TableRow key={row.label}>
										<TableCell className="w-16 font-medium text-muted-foreground">{row.label}</TableCell>
										<TableCell className="break-all whitespace-normal">
											<div className="flex justify-end items-center gap-1.5">
												<span className={cn("font-mono text-sm", row.destructive && "text-destructive")}>{row.value}</span>
												<CopyButton value={row.value} label={`${row.label} claim`} className="bg-transparent hover:bg-muted border border-input text-foreground" />
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				) : (
					<p className="text-muted-foreground text-sm">{payload === null ? "Claims show up here once the payload is valid JSON." : `No registered claim (${CLAIM_LABELS.join(", ")}) in this payload.`}</p>
				)}
			</div>
		</CardSection>
	);
}
