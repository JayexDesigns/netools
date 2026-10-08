import TLDR from "@/components/tldr";

const CHARACTERISTICS = ["Query the status of network links. Manage the network configuration using systemd-networkd."];

const MANUAL_URL = "https://www.freedesktop.org/software/systemd/man/latest/networkctl.html";

const EXAMPLES = [
	{description: "List existing links with their status:", command: "networkctl"},
	{description: "Show an overall network status:", command: "networkctl status"},
	{description: "Bring network devices up:", command: "sudo networkctl up interface1 interface2 ..."},
	{description: "Bring network devices down:", command: "sudo networkctl down interface1 interface2 ..."},
	{description: "Renew dynamic configurations (e.g. IP addresses received from a DHCP server):", command: "sudo networkctl renew interface1 interface2 ..."},
	{description: "Reload configuration files (.netdev and .network):", command: "sudo networkctl reload"},
	{description: "Reconfigure network interfaces (if you edited the config, you need to call networkctl reload first):", command: "sudo networkctl reconfigure interface1 interface2 ..."}
];

export default function TLDRnetworkctl() {
	return <TLDR command="networkctl" characteristics={CHARACTERISTICS} manualURL={MANUAL_URL} examples={EXAMPLES} />;
}
