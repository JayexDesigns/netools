import {describe, expect, it} from "vitest";
import {HTTP_METHODS, buildCurlCommand, createPair, isValidJson, type CurlRequest} from "@/lib/curl";

// A plain GET request with no extras, tests override only what they exercise
const BASE: CurlRequest = {
	method: "GET",
	url: "https://example.com",
	params: [],
	headers: [],
	bodyType: "none",
	jsonBody: "",
	rawBody: "",
	formBody: [],
	authType: "none",
	basicUsername: "",
	basicPassword: "",
	bearerToken: "",
	apiKeyName: "",
	apiKeyValue: "",
	apiKeyLocation: "header"
};

const pair = (key: string, value: string, enabled = true) => ({id: key + value, enabled, key, value});

describe("buildCurlCommand", () => {
	it("builds a single-line command for a plain GET", () => {
		expect(buildCurlCommand(BASE)).toBe("curl 'https://example.com'");
	});

	it("adds -X only for methods other than GET", () => {
		expect(buildCurlCommand({...BASE, method: "POST"})).toBe("curl \\\n-X POST \\\n'https://example.com'");
		expect(buildCurlCommand({...BASE, method: "DELETE"})).toContain("-X DELETE");
		for (const method of HTTP_METHODS) {
			const command = buildCurlCommand({...BASE, method});
			expect(command.includes("-X")).toBe(method !== "GET");
		}
	});

	it("appends encoded query parameters to the URL", () => {
		const command = buildCurlCommand({...BASE, params: [pair("q", "net tools"), pair("page", "2")]});
		expect(command).toBe("curl 'https://example.com?q=net%20tools&page=2'");
	});

	it("joins query parameters with & when the URL already has a query string", () => {
		const command = buildCurlCommand({...BASE, url: "https://example.com?x=1", params: [pair("q", "a")]});
		expect(command).toBe("curl 'https://example.com?x=1&q=a'");
	});

	it("skips disabled parameters and parameters without a key", () => {
		const command = buildCurlCommand({...BASE, params: [pair("kept", "1"), pair("off", "2", false), pair("", "3")]});
		expect(command).toBe("curl 'https://example.com?kept=1'");
	});

	it("adds headers, shell-quoted so embedded quotes survive", () => {
		const command = buildCurlCommand({...BASE, headers: [pair("Accept", "application/json"), pair("X-Note", "it's fine")]});
		expect(command).toContain("-H 'Accept: application/json'");
		expect(command).toContain("-H 'X-Note: it'\\''s fine'");
	});

	it("adds basic auth as -u, only when a username is set", () => {
		const command = buildCurlCommand({...BASE, authType: "basic", basicUsername: "user", basicPassword: "pa ss"});
		expect(command).toContain("-u 'user:pa ss'");

		expect(buildCurlCommand({...BASE, authType: "basic"})).not.toContain("-u");
	});

	it("adds bearer auth as an Authorization header, only when a token is set", () => {
		const command = buildCurlCommand({...BASE, authType: "bearer", bearerToken: "abc.def"});
		expect(command).toContain("-H 'Authorization: Bearer abc.def'");

		expect(buildCurlCommand({...BASE, authType: "bearer"})).not.toContain("Authorization");
	});

	it("travels an API key in a header or in the query string", () => {
		const header = buildCurlCommand({...BASE, authType: "api-key", apiKeyName: "X-API-Key", apiKeyValue: "123"});
		expect(header).toContain("-H 'X-API-Key: 123'");
		expect(header).not.toContain("?");

		const query = buildCurlCommand({...BASE, authType: "api-key", apiKeyLocation: "query", apiKeyName: "api_key", apiKeyValue: "1 2"});
		expect(query).toBe("curl 'https://example.com?api_key=1%202'");

		expect(buildCurlCommand({...BASE, authType: "api-key"})).toBe("curl 'https://example.com'");
	});

	it("adds the JSON content type unless the user set their own", () => {
		const automatic = buildCurlCommand({...BASE, bodyType: "json", jsonBody: '{"a":1}'});
		expect(automatic).toContain("-H 'Content-Type: application/json'");
		expect(automatic).toContain("--data-raw '{\"a\":1}'");

		const custom = buildCurlCommand({...BASE, bodyType: "json", jsonBody: '{"a":1}', headers: [pair("content-type", "application/merge-patch+json")]});
		expect(custom.match(/Content-Type/gi)).toHaveLength(1);
	});

	it("ignores an empty JSON body", () => {
		expect(buildCurlCommand({...BASE, bodyType: "json", jsonBody: "   "})).toBe("curl 'https://example.com'");
	});

	it("sends a raw body with --data-raw", () => {
		const command = buildCurlCommand({...BASE, bodyType: "raw", rawBody: "hello world"});
		expect(command).toContain("--data-raw 'hello world'");
	});

	it("sends every form field with --data-urlencode", () => {
		const command = buildCurlCommand({...BASE, bodyType: "form", formBody: [pair("user", "jay ex"), pair("role", "admin")]});
		expect(command).toContain("--data-urlencode 'user=jay ex'");
		expect(command).toContain("--data-urlencode 'role=admin'");
	});

	it("builds one flag per line with continuations once the command grows", () => {
		const command = buildCurlCommand({
			...BASE,
			method: "POST",
			headers: [pair("Accept", "application/json")],
			bodyType: "json",
			jsonBody: '{"a":1}'
		});

		expect(command).toBe(["curl \\", "-X POST \\", "'https://example.com' \\", "-H 'Accept: application/json' \\", "-H 'Content-Type: application/json' \\", "--data-raw '{\"a\":1}'"].join("\n"));
	});
});

describe("isValidJson", () => {
	it("accepts valid JSON and empty bodies", () => {
		expect(isValidJson("")).toBe(true);
		expect(isValidJson("   ")).toBe(true);
		expect(isValidJson('{"a":1}')).toBe(true);
		expect(isValidJson("[1, 2]")).toBe(true);
		expect(isValidJson('"a string"')).toBe(true);
	});

	it("rejects malformed JSON", () => {
		expect(isValidJson("{a:1}")).toBe(false);
		expect(isValidJson("{\"a\":")).toBe(false);
		expect(isValidJson("undefined")).toBe(false);
	});
});

describe("createPair", () => {
	it("creates an enabled empty pair", () => {
		expect(createPair()).toMatchObject({enabled: true, key: "", value: ""});
	});

	it("gives every pair a unique id", () => {
		const ids = new Set(Array.from({length: 50}, () => createPair().id));
		expect(ids.size).toBe(50);
	});
});
