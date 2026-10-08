import TLDR from "@/components/tldr";

const CHARACTERISTICS = ["Transfers data from or to a server.", "Supports most protocols, including HTTP, HTTPS, FTP, SCP, etc."];

const MANUAL_URL = "https://curl.se/docs/manpage.html";

const EXAMPLES = [
	{
		description: "Make an HTTP GET request and dump the contents in stdout:",
		command: "curl https://example.com"
	},
	{
		description: "Make an HTTP GET request, follow any 3xx redirects, and dump the reply headers and contents to stdout:",
		command: "curl --location --dump-header - https://example.com"
	},
	{
		description: "Download a file, saving the output under the filename indicated by the URL:",
		command: "curl --remote-name https://example.com/filename.zip"
	},
	{
		description: "Send form-encoded data (POST request of type `application/x-www-form-urlencoded`). Use `--data @file_name` or `--data @'-'` to read from stdin:",
		command: "curl --request POST --data 'name=bob' http://example.com/form"
	},
	{
		description: "Send a request with an extra header, using a custom HTTP method and over a proxy (such as BurpSuite), ignoring insecure self-signed certificates:",
		command: "curl --insecure --proxy http://127.0.0.1:8080 --header 'Authorization: Bearer token' --request GET|PUT|POST|DELETE|PATCH|... https://example.com"
	},
	{
		description: "Send data in JSON format, specifying the appropriate `Content-Type` header:",
		command: `curl --data '{"name":"bob"}' --header 'Content-Type: application/json' http://example.com/users/1234`
	},
	{
		description: "Pass client certificate and private key for the request, skipping certificate validation:",
		command: "curl --cert client.pem --key key.pem --insecure https://example.com"
	},
	{
		description: "Resolve a hostname to a custom IP address, with verbose output (similar to editing the `/etc/hosts` file for custom DNS resolution):",
		command: "curl --verbose --resolve example.com:80:127.0.0.1 http://example.com"
	}
];

export default function TLDRCurl() {
	return <TLDR command="curl" characteristics={CHARACTERISTICS} manualURL={MANUAL_URL} examples={EXAMPLES} />;
}
