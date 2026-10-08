import TLDR from "@/components/tldr";

const CHARACTERISTICS: string[] = ["Download files from the Web. Supports HTTP, HTTPS, and FTP."];

const MANUAL_URL = "https://www.gnu.org/software/wget/manual/wget.html";

const EXAMPLES: {description: string; command: string}[] = [
	{description: 'Download the contents of a URL to a file (named "foo" in this case):', command: "wget https://example.com/foo"},
	{description: "Download the contents of a URL to a specific file:", command: "wget --output-document path/to/file https://example.com/foo"},
	{description: "Download a single web page and all its resources with 3-second intervals between requests (scripts, stylesheets, images, etc.):", command: "wget --page-requisites --convert-links --wait 3 https://example.com/some_page.html"},
	{description: "Download all listed files within a directory and its sub-directories (does not download embedded page elements):", command: "wget --mirror --no-parent https://example.com/some_path/"},
	{description: "Limit the download speed and the number of connection retries:", command: "wget --limit-rate 300k --tries 100 https://example.com/some_path/"},
	{description: "Download a file from an HTTP server using Basic Auth (also works for FTP):", command: "wget --user username --password password https://example.com"},
	{description: "Continue an incomplete download:", command: "wget --continue https://example.com"},
	{description: "Download all URLs stored in a text file to a specific directory:", command: "wget --directory-prefix path/to/directory --input-file path/to/URLs.txt"}
];

export default function TLDRwget() {
	return <TLDR command="wget" characteristics={CHARACTERISTICS} manualURL={MANUAL_URL} examples={EXAMPLES} />;
}
