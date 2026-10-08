import TLDR from "@/components/tldr";

const CHARACTERISTICS = ["DNS lookup utility."];

const MANUAL_URL = "https://manned.org/dig";

const EXAMPLES = [
	{description: "Look up the IP(s) associated with a hostname (A records):", command: "dig +short example.com"},
	{description: "Get a detailed answer for a given domain (A records):", command: "dig +noall +answer example.com"},
	{description: "Query a specific DNS record type associated with a given domain name:", command: "dig +short example.com A|MX|TXT|CNAME|NS"},
	{description: "Specify an alternate DNS server to query and optionally use DNS over TLS (DoT):", command: "dig +tls @1.1.1.1|8.8.8.8|9.9.9.9|... example.com"},
	{description: "Perform a reverse DNS lookup on an IP address (PTR record):", command: "dig -x 8.8.8.8"},
	{description: "Find authoritative name servers for the zone and display SOA records:", command: "dig +nssearch example.com"},
	{description: "Perform iterative queries and display the entire trace path to resolve a domain name:", command: "dig +trace example.com"},
	{description: "Query a DNS server over a non-standard [p]ort using the TCP protocol:", command: "dig +tcp -p port @dns_server_ip example.com"}
];

export default function TLDRdig() {
	return <TLDR command="dig" characteristics={CHARACTERISTICS} manualURL={MANUAL_URL} examples={EXAMPLES} />;
}
