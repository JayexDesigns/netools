import TLDR from "@/components/tldr";

const CHARACTERISTICS = ["Print the route packets trace to network host."];

const MANUAL_URL = "https://manned.org/traceroute";

const EXAMPLES = [
	{description: "Traceroute to a host:", command: "traceroute example.com"},
	{description: "Disable IP address and host name mapping:", command: "traceroute -n example.com"},
	{description: "Specify wait time in seconds for response:", command: "traceroute --wait 0.5 example.com"},
	{description: "Specify number of queries per hop:", command: "traceroute --queries 5 example.com"},
	{description: "Specify size in bytes of probing packet:", command: "traceroute example.com 42"},
	{description: "Determine the MTU to the destination:", command: "traceroute --mtu example.com"},
	{description: "Use ICMP instead of UDP for tracerouting:", command: "traceroute --icmp example.com"}
];

export default function TLDRtraceroute() {
	return <TLDR command="traceroute" characteristics={CHARACTERISTICS} manualURL={MANUAL_URL} examples={EXAMPLES} />;
}
