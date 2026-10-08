import TLDR from "@/components/tldr";

const CHARACTERISTICS = ["Dump traffic on a network."];

const MANUAL_URL = "https://www.tcpdump.org/manpages/tcpdump.1.html";

const EXAMPLES = [
	{description: "List available network interfaces:", command: "tcpdump --list-interfaces"},
	{description: "Capture the traffic of a specific interface:", command: "sudo tcpdump --interface eth0"},
	{description: "Capture all TCP traffic showing contents ([A]SCII) in console:", command: "sudo tcpdump -A tcp"},
	{description: "Capture the traffic from or to a host:", command: "sudo tcpdump host www.example.com"},
	{description: "Capture the traffic from a specific interface, source, destination, and destination port:", command: "sudo tcpdump --interface eth0 src 192.168.1.1 and dst 192.168.1.2 and dst port 80"},
	{description: "Capture the traffic of a network:", command: "sudo tcpdump net 192.168.1.0/24"},
	{description: "Capture all traffic except traffic over port 22 and [w]rite to a dump file:", command: "sudo tcpdump -w path/to/dumpfile.pcap port not 22"},
	{description: "Read from a given dump file:", command: "tcpdump -r path/to/dumpfile.pcap"}
];

export default function TLDRtcpdump() {
	return <TLDR command="tcpdump" characteristics={CHARACTERISTICS} manualURL={MANUAL_URL} examples={EXAMPLES} />;
}
