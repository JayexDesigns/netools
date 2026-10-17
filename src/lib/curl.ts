import {generateId} from "@/lib/id";

export const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"] as const;

export type HttpMethod = (typeof HTTP_METHODS)[number];

export const BODY_TYPES = [
	{value: "none", label: "None"},
	{value: "json", label: "JSON"},
	{value: "form", label: "Form data"},
	{value: "raw", label: "Raw text"}
] as const;

export type BodyType = (typeof BODY_TYPES)[number]["value"];

export const AUTH_TYPES = [
	{value: "none", label: "None"},
	{value: "basic", label: "Basic auth"},
	{value: "bearer", label: "Bearer token"},
	{value: "api-key", label: "API key"}
] as const;

export type AuthType = (typeof AUTH_TYPES)[number]["value"];

export const API_KEY_LOCATIONS = [
	{value: "header", label: "Header"},
	{value: "query", label: "Query parameter"}
] as const;

export type ApiKeyLocation = (typeof API_KEY_LOCATIONS)[number]["value"];

export type Pair = {
	id: string;
	enabled: boolean;
	key: string;
	value: string;
};

export type CurlRequest = {
	method: HttpMethod;
	url: string;
	params: Pair[];
	headers: Pair[];
	bodyType: BodyType;
	jsonBody: string;
	rawBody: string;
	formBody: Pair[];
	authType: AuthType;
	basicUsername: string;
	basicPassword: string;
	bearerToken: string;
	apiKeyName: string;
	apiKeyValue: string;
	apiKeyLocation: ApiKeyLocation;
};

export function createPair(): Pair {
	return {id: generateId(), enabled: true, key: "", value: ""};
}

// Wraps a value in single quotes so the shell passes it to curl untouched, escaping any embedded quote
function shellQuote(value: string): string {
	return `'${value.replaceAll("'", "'\\''")}'`;
}

function activePairs(pairs: Pair[]): Pair[] {
	return pairs.filter(pair => pair.enabled && pair.key.trim() !== "");
}

function encodeQuery(params: {key: string; value: string}[]): string {
	return params.map(param => `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`).join("&");
}

export function isValidJson(body: string): boolean {
	if (body.trim() === "") return true;

	try {
		JSON.parse(body);
		return true;
	} catch {
		return false;
	}
}

export function buildCurlCommand(request: CurlRequest): string {
	const parts = ["curl"];

	if (request.method !== "GET") parts.push(`-X ${request.method}`);

	// Query parameters, plus the API key when it is configured to travel in the query string
	const params = activePairs(request.params).map(pair => ({key: pair.key.trim(), value: pair.value}));

	if (request.authType === "api-key" && request.apiKeyLocation === "query" && request.apiKeyName.trim() !== "") {
		params.push({key: request.apiKeyName.trim(), value: request.apiKeyValue});
	}

	const baseUrl = request.url.trim();
	const queryString = encodeQuery(params);
	const url = queryString === "" ? baseUrl : `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}${queryString}`;
	if (url !== "") parts.push(shellQuote(url));

	for (const header of activePairs(request.headers)) {
		parts.push(`-H ${shellQuote(`${header.key.trim()}: ${header.value}`)}`);
	}

	if (request.authType === "basic" && request.basicUsername.trim() !== "") {
		parts.push(`-u ${shellQuote(`${request.basicUsername}:${request.basicPassword}`)}`);
	}

	if (request.authType === "bearer" && request.bearerToken.trim() !== "") {
		parts.push(`-H ${shellQuote(`Authorization: Bearer ${request.bearerToken}`)}`);
	}

	if (request.authType === "api-key" && request.apiKeyLocation === "header" && request.apiKeyName.trim() !== "") {
		parts.push(`-H ${shellQuote(`${request.apiKeyName}: ${request.apiKeyValue}`)}`);
	}

	if (request.bodyType === "json" && request.jsonBody.trim() !== "") {
		// Only add the content type header when the user has not set their own header
		const hasContentType = activePairs(request.headers).some(pair => pair.key.trim().toLowerCase() === "content-type");
		if (!hasContentType) parts.push(`-H ${shellQuote("Content-Type: application/json")}`);
		parts.push(`--data-raw ${shellQuote(request.jsonBody)}`);
	}

	if (request.bodyType === "raw" && request.rawBody.trim() !== "") {
		parts.push(`--data-raw ${shellQuote(request.rawBody)}`);
	}

	if (request.bodyType === "form") {
		for (const field of activePairs(request.formBody)) {
			parts.push(`--data-urlencode ${shellQuote(`${field.key.trim()}=${field.value}`)}`);
		}
	}

	// One line for simple commands, one flag per line with continuations for everything else
	if (parts.length <= 2) return parts.join(" ");
	return parts.map((part, index) => (index === parts.length - 1 ? part : `${part} \\`)).join("\n");
}
