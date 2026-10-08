import TLDR from "@/components/tldr";

const CHARACTERISTICS = ["Show and manipulate your system's ARP cache."];

const MANUAL_URL = "https://manned.org/arp.8";

const EXAMPLES = [
	{description: "Show the current ARP table:", command: "arp"},
	{description: "Show [a]lternative BSD style output format with on fixed columns:", command: "arp -a"},
	{description: "[d]elete a specific entry:", command: "sudo arp -d address"},
	{description: "[s]et up a new entry in the ARP table:", command: "sudo arp -s address mac_address"}
];

export default function TLDRarp() {
	return <TLDR command="arp" characteristics={CHARACTERISTICS} manualURL={MANUAL_URL} examples={EXAMPLES} />;
}
