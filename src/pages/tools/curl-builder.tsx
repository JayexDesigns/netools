import AuthSection from "@/components/curl/auth-section";
import BodySection from "@/components/curl/body-section";
import OutputSection from "@/components/curl/output-section";
import PairsSection from "@/components/curl/pairs-section";
import RequestSection from "@/components/curl/request-section";
import {buildCurlCommand, type ApiKeyLocation, type AuthType, type BodyType, type HttpMethod, type Pair} from "@/lib/curl";
import {useState} from "react";

export default function CurlBuilder() {
	const [method, setMethod] = useState<HttpMethod>("GET");
	const [url, setUrl] = useState("");
	const [params, setParams] = useState<Pair[]>([]);
	const [headers, setHeaders] = useState<Pair[]>([]);
	const [bodyType, setBodyType] = useState<BodyType>("none");
	const [jsonBody, setJsonBody] = useState("");
	const [rawBody, setRawBody] = useState("");
	const [formBody, setFormBody] = useState<Pair[]>([]);
	const [authType, setAuthType] = useState<AuthType>("none");
	const [basicUsername, setBasicUsername] = useState("");
	const [basicPassword, setBasicPassword] = useState("");
	const [bearerToken, setBearerToken] = useState("");
	const [apiKeyName, setApiKeyName] = useState("");
	const [apiKeyValue, setApiKeyValue] = useState("");
	const [apiKeyLocation, setApiKeyLocation] = useState<ApiKeyLocation>("header");

	const command = buildCurlCommand({
		method,
		url,
		params,
		headers,
		bodyType,
		jsonBody,
		rawBody,
		formBody,
		authType,
		basicUsername,
		basicPassword,
		bearerToken,
		apiKeyName,
		apiKeyValue,
		apiKeyLocation
	});

	return (
		<div className="isolate relative min-h-dvh overflow-x-clip text-foreground">
			<main className="relative mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-24 max-w-5xl">
				<header className="flex flex-col gap-5">
					<h1 className="font-heading font-bold text-3xl sm:text-4xl tracking-tight">Curl Builder</h1>

					<p className="text-muted-foreground leading-relaxed">
						Build a curl command without touching the terminal: enter a URL, then add query parameters, headers, a body and authorization options in their own sections. Example result:{" "}
						<code className="bg-muted px-1.5 py-0.5 border border-border rounded-md font-mono text-[0.85em] text-foreground">
							curl -X POST 'https://api.example.com/users' -H 'Content-Type: application/json' --data-raw '{"{"}"name": "Ada"{"}"}'
						</code>
						.
					</p>
				</header>

				<div className="flex flex-col gap-6 mt-8">
					<RequestSection method={method} url={url} onMethodChange={setMethod} onUrlChange={setUrl} />
					<PairsSection id="params" title="Query parameters" description="Each enabled parameter is appended to the URL with its value URL-encoded." label="Query parameter" placeholderKey="page" placeholderValue="1" pairs={params} onChange={setParams} />
					<PairsSection id="headers" title="Headers" description="Each enabled header is added to the command with a -H flag." label="Header" placeholderKey="Accept" placeholderValue="application/json" pairs={headers} onChange={setHeaders} />
					<BodySection bodyType={bodyType} jsonBody={jsonBody} rawBody={rawBody} formBody={formBody} onBodyTypeChange={setBodyType} onJsonBodyChange={setJsonBody} onRawBodyChange={setRawBody} onFormBodyChange={setFormBody} />
					<AuthSection authType={authType} basicUsername={basicUsername} basicPassword={basicPassword} bearerToken={bearerToken} apiKeyName={apiKeyName} apiKeyValue={apiKeyValue} apiKeyLocation={apiKeyLocation} onAuthTypeChange={setAuthType} onBasicUsernameChange={setBasicUsername} onBasicPasswordChange={setBasicPassword} onBearerTokenChange={setBearerToken} onApiKeyNameChange={setApiKeyName} onApiKeyValueChange={setApiKeyValue} onApiKeyLocationChange={setApiKeyLocation} />
					<OutputSection command={command} isReady={url.trim() !== ""} />
				</div>
			</main>
		</div>
	);
}
