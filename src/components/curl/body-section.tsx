import CardSection from "@/components/card-section";
import PairsTable from "@/components/curl/pairs-table";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {BODY_TYPES, isValidJson, type BodyType, type Pair} from "@/lib/curl";

type BodySectionProps = {
	bodyType: BodyType;
	jsonBody: string;
	rawBody: string;
	formBody: Pair[];
	onBodyTypeChange: (bodyType: BodyType) => void;
	onJsonBodyChange: (jsonBody: string) => void;
	onRawBodyChange: (rawBody: string) => void;
	onFormBodyChange: (formBody: Pair[]) => void;
};

export default function BodySection({bodyType, jsonBody, rawBody, formBody, onBodyTypeChange, onJsonBodyChange, onRawBodyChange, onFormBodyChange}: BodySectionProps) {
	const jsonInvalid = bodyType === "json" && !isValidJson(jsonBody);

	return (
		<CardSection id="body" title="Body" description="Choose how the request body is encoded and fill it in. JSON and raw bodies use --data-raw, while form fields use one --data-urlencode flag per field.">
			<div className="flex flex-col gap-3">
				<Select value={bodyType} onValueChange={value => onBodyTypeChange(value as BodyType)}>
					<SelectTrigger className="w-full sm:w-40" aria-label="Body type">
						<SelectValue />
					</SelectTrigger>

					<SelectContent>
						{BODY_TYPES.map(option => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{bodyType === "json" && (
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="curl-json-body" className="text-muted-foreground">
							JSON payload
						</Label>
						<Textarea id="curl-json-body" spellCheck={false} placeholder='{"name": "Ada", "role": "admin"}' value={jsonBody} aria-invalid={jsonInvalid} aria-describedby="curl-body-hint" onChange={event => onJsonBodyChange(event.target.value)} className="min-h-32 font-mono" />
					</div>
				)}

				{bodyType === "raw" && (
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="curl-raw-body" className="text-muted-foreground">
							Raw payload
						</Label>
						<Textarea id="curl-raw-body" spellCheck={false} placeholder="name=Ada&amp;role=admin" value={rawBody} aria-describedby="curl-body-hint" onChange={event => onRawBodyChange(event.target.value)} className="min-h-32 font-mono" />
					</div>
				)}

				{bodyType === "form" && <PairsTable label="Form field" placeholderKey="name" placeholderValue="Ada" pairs={formBody} onChange={onFormBodyChange} />}

				{bodyType === "none" && <p className="text-muted-foreground text-sm">The request is sent without a body.</p>}

				{bodyType === "json" && (
					<p id="curl-body-hint" className={jsonInvalid ? "text-destructive text-sm" : "text-muted-foreground text-sm"}>
						{jsonInvalid ? "The payload is not valid JSON. Fix it to include it in the command." : "A Content-Type: application/json header is added automatically unless you set your own."}
					</p>
				)}

				{bodyType === "raw" && (
					<p id="curl-body-hint" className="text-muted-foreground text-sm">
						The payload is sent as-is. Set the Content-Type header yourself if the endpoint requires one.
					</p>
				)}
			</div>
		</CardSection>
	);
}
