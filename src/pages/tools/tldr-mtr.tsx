import TLDR from "@/components/tldr";

const CHARACTERISTICS = ["Matt's Traceroute: combined traceroute and ping tool."];

const MANUAL_URL = "https://manned.org/mtr";

const EXAMPLES = [
	{description: "Traceroute to a host and continuously ping all intermediary hops:", command: "mtr example.com"},
	{description: "Disable IP address and host name mapping:", command: "mtr --no-dns example.com"},
	{description: "Generate output after pinging each hop 10 times:", command: "mtr --report-wide example.com"},
	{description: "Force IPv4 or IPv6:", command: "mtr -4 example.com"},
	{description: "Wait for a given time (in seconds) before sending another packet to the same hop:", command: "mtr --interval 10 example.com"},
	{description: "Display the Autonomous System Number (ASN) for each hop:", command: "mtr --aslookup example.com"},
	{description: "Display both IP address and reverse DNS name:", command: "mtr --show-ips example.com"}
];

export default function TLDRmtr() {
	return <TLDR command="mtr" characteristics={CHARACTERISTICS} manualURL={MANUAL_URL} examples={EXAMPLES} />;
}
