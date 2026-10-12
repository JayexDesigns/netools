import ConverterField from "@/components/converter-field";
import CurlSection from "@/components/curl/curl-section";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {API_KEY_LOCATIONS, AUTH_TYPES, type ApiKeyLocation, type AuthType} from "@/lib/curl";

type AuthSectionProps = {
	authType: AuthType;
	basicUsername: string;
	basicPassword: string;
	bearerToken: string;
	apiKeyName: string;
	apiKeyValue: string;
	apiKeyLocation: ApiKeyLocation;
	onAuthTypeChange: (authType: AuthType) => void;
	onBasicUsernameChange: (basicUsername: string) => void;
	onBasicPasswordChange: (basicPassword: string) => void;
	onBearerTokenChange: (bearerToken: string) => void;
	onApiKeyNameChange: (apiKeyName: string) => void;
	onApiKeyValueChange: (apiKeyValue: string) => void;
	onApiKeyLocationChange: (apiKeyLocation: ApiKeyLocation) => void;
};

export default function AuthSection({authType, basicUsername, basicPassword, bearerToken, apiKeyName, apiKeyValue, apiKeyLocation, onAuthTypeChange, onBasicUsernameChange, onBasicPasswordChange, onBearerTokenChange, onApiKeyNameChange, onApiKeyValueChange, onApiKeyLocationChange}: AuthSectionProps) {
	return (
		<CurlSection id="auth" title="Authorization" description="Add credentials to the command, either with -u for basic auth or with an Authorization or API key header.">
			<div className="flex flex-col gap-3">
				<Select value={authType} onValueChange={value => onAuthTypeChange(value as AuthType)}>
					<SelectTrigger className="w-full sm:w-44" aria-label="Authorization type">
						<SelectValue />
					</SelectTrigger>

					<SelectContent>
						{AUTH_TYPES.map(option => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{authType === "basic" && (
					<div className="gap-3 grid grid-cols-1 sm:grid-cols-2">
						<ConverterField id="curl-basic-username" label="Username" placeholder="admin" value={basicUsername} invalid={false} onValueChange={onBasicUsernameChange} />
						<ConverterField id="curl-basic-password" label="Password" placeholder="s3cret" value={basicPassword} invalid={false} onValueChange={onBasicPasswordChange} type="password" />
					</div>
				)}

				{authType === "bearer" && <ConverterField id="curl-bearer-token" label="Token" placeholder="eyJhbGciOiJIUzI1NiIs..." value={bearerToken} invalid={false} onValueChange={onBearerTokenChange} type="password" />}

				{authType === "api-key" && (
					<div className="flex flex-col gap-3">
						<div className="gap-3 grid grid-cols-1 sm:grid-cols-2">
							<ConverterField id="curl-api-key-name" label="Key name" placeholder="X-API-Key" value={apiKeyName} invalid={false} onValueChange={onApiKeyNameChange} />
							<ConverterField id="curl-api-key-value" label="Key value" placeholder="my-secret-key" value={apiKeyValue} invalid={false} onValueChange={onApiKeyValueChange} type="password" />
						</div>

						<div className="flex flex-col gap-1.5">
							<Label className="text-muted-foreground">Send in</Label>

							<Select value={apiKeyLocation} onValueChange={value => onApiKeyLocationChange(value as ApiKeyLocation)}>
								<SelectTrigger className="w-full sm:w-44" aria-label="API key location">
									<SelectValue />
								</SelectTrigger>

								<SelectContent>
									{API_KEY_LOCATIONS.map(option => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				)}

				{authType === "none" && <p className="text-muted-foreground text-sm">The command is generated without credentials.</p>}
			</div>
		</CurlSection>
	);
}
