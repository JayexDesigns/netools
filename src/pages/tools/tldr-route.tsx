import TLDR from "@/components/tldr";

const CHARACTERISTICS = ["Show and manipulate the route table."];

const MANUAL_URL = "https://manned.org/route";

const EXAMPLES = [
	{description: "Display the information of route table:", command: "route -n"},
	{description: "Add route rule:", command: "sudo route add -net ip_address netmask netmask_address gw gw_address"},
	{description: "Delete route rule:", command: "sudo route del -net ip_address netmask netmask_address dev gw_address"}
];

export default function TLDRroute() {
	return <TLDR command="route" characteristics={CHARACTERISTICS} manualURL={MANUAL_URL} examples={EXAMPLES} />;
}
