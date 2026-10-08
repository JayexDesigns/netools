import TLDR from "@/components/tldr";

const CHARACTERISTICS = ["Show/manipulate routing, devices, policy routing, and tunnels."];

const MANUAL_URL = "https://manned.org/ip.8";

const EXAMPLES = [
	{description: "List interfaces with detailed info:", command: "ip address"},
	{description: "List interfaces with brief network layer info:", command: "ip -brief address"},
	{description: "List interfaces with brief link layer info:", command: "ip -brief link"},
	{description: "Display the routing table:", command: "ip route"},
	{description: "Show neighbors (ARP table):", command: "ip neighbor"},
	{description: "Make an interface up/down:", command: "sudo ip link set ethX up|down"},
	{description: "Add/Delete an IP address to an interface:", command: "sudo ip address add|delete ip_address/mask dev ethX"},
	{description: "Add a default route:", command: "sudo ip route add default via ip_address dev ethX"}
];

export default function TLDRip() {
	return <TLDR command="ip" characteristics={CHARACTERISTICS} manualURL={MANUAL_URL} examples={EXAMPLES} />;
}
