import TLDR from "@/components/tldr";

const CHARACTERISTICS = ["Send ICMP ECHO_REQUEST packets to network hosts."];

const MANUAL_URL = "https://manned.org/ping";

const EXAMPLES = [
	{description: "Ping a host with IP 10.0.0.1 (Note: 10.0.0.1 can be shortened to 10.1):", command: "ping 10.0.0.1"},
	{description: "Ping a host only a specific number of times:", command: "ping -c count host"},
	{description: "Ping host, specifying the interval in seconds between requests (default is 1 second):", command: "ping -i seconds host"},
	{description: "Ping host without trying to look up symbolic names for addresses:", command: "ping -n host"},
	{description: "Ping host and ring the bell when a packet is received (if your terminal supports it):", command: "ping -a host"},
	{description: "Also display a message if no response was received:", command: "ping -O host"},
	{description: "Ping a host with specific [c]ount of pings, per-packet time to [W]ait for a response, and total [w]ait time limit of the entire ping run:", command: "ping -c count -W seconds -w seconds host"},
	{description: "Ping all IPv6 local network hosts:", command: "ping -6 ff02::1%eth0"}
];

export default function TLDRping() {
	return <TLDR command="ping" characteristics={CHARACTERISTICS} manualURL={MANUAL_URL} examples={EXAMPLES} />;
}
