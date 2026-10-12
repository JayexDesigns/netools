import CardSection from "@/components/card-section";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {HTTP_METHODS, type HttpMethod} from "@/lib/curl";

type RequestSectionProps = {
	method: HttpMethod;
	url: string;
	onMethodChange: (method: HttpMethod) => void;
	onUrlChange: (url: string) => void;
};

export default function RequestSection({method, url, onMethodChange, onUrlChange}: RequestSectionProps) {
	return (
		<CardSection id="request" title="Request" description="Pick the HTTP method and enter the full URL of the endpoint, including its scheme, for example https://api.example.com/users.">
			<div className="flex sm:flex-row flex-col gap-2 sm:gap-3">
				<Select value={method} onValueChange={value => onMethodChange(value as HttpMethod)}>
					<SelectTrigger className="w-full sm:w-28" aria-label="HTTP method">
						<SelectValue />
					</SelectTrigger>

					<SelectContent>
						{HTTP_METHODS.map(option => (
							<SelectItem key={option} value={option}>
								{option}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<div className="flex flex-col flex-1 gap-1.5">
					<Input id="curl-url" type="text" inputMode="url" autoComplete="off" spellCheck={false} placeholder="https://api.example.com/users" value={url} onChange={event => onUrlChange(event.target.value)} aria-label="Request URL" className="h-8 font-mono" />
				</div>
			</div>
		</CardSection>
	);
}
