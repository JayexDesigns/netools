import TLDR from "@/components/tldr";

const CHARACTERISTICS = ["Utility to investigate sockets."];

const MANUAL_URL = "https://manned.org/ss";

const EXAMPLES = [
	{description: "Show all TCP/UDP/RAW/UNIX sockets:", command: "ss --all --tcp|--udp|--raw|--unix"},
	{description: "Filter TCP sockets by states, only/exclude:", command: "ss state|exclude bucket|big|connected|synchronized|..."},
	{description: "Show all TCP sockets connected to the local HTTPS port (443):", command: "ss --tcp src :443"},
	{description: "Show all TCP sockets listening on the local 8080 port:", command: "ss --listening --tcp src :8080"},
	{description: "Show all TCP sockets along with processes connected to a remote SSH port:", command: "ss --processes --tcp dst :ssh"},
	{description: "Show all UDP sockets connected on specific source and destination ports:", command: "ss --udp 'sport == :source_port and dport == :destination_port'"},
	{description: "Show all TCP IPv4 sockets locally connected on the subnet 192.168.0.0/16:", command: "ss --ipv4 --tcp src 192.168/16"},
	{description: "Kill IPv4 or IPv6 Socket Connection with a specific destination IP and port:", command: "ss --kill dst ip_address dport = port"}
];

export default function TLDRss() {
	return <TLDR command="ss" characteristics={CHARACTERISTICS} manualURL={MANUAL_URL} examples={EXAMPLES} />;
}
