import TLDR from "@/components/tldr";

const CHARACTERISTICS = ["Show and manipulate wireless devices."];

const MANUAL_URL = "https://wireless.docs.kernel.org/en/latest/en/users/documentation/iw.html";

const EXAMPLES = [
	{description: "Scan for available wireless networks:", command: "iw dev wlanX scan"},
	{description: "Join an open wireless network:", command: "iw dev wlanX connect ssid"},
	{description: "Close the current connection:", command: "iw dev wlanX disconnect"},
	{description: "Show information about the current connection:", command: "iw dev wlanX link"},
	{description: "List all physical and logical wireless network interfaces:", command: "iw dev"},
	{description: "List all wireless capabilities for all physical hardware interfaces:", command: "iw phy"},
	{description: "List the kernel's current wireless regulatory domain information:", command: "iw reg get"},
	{description: "Display help:", command: "iw help"}
];

export default function TLDRiw() {
	return <TLDR command="iw" characteristics={CHARACTERISTICS} manualURL={MANUAL_URL} examples={EXAMPLES} />;
}
