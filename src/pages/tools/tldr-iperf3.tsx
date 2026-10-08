import TLDR from "@/components/tldr";

const CHARACTERISTICS = ["Traffic generator for testing network bandwidth."];

const MANUAL_URL = "https://iperf.fr/iperf-doc.php";

const EXAMPLES = [
	{description: "Run iperf3 as a server:", command: "iperf3 --server"},
	{description: "Run an iperf3 server on a specific port:", command: "iperf3 --server --port port"},
	{description: "Start bandwidth test:", command: "iperf3 --client server_ip"},
	{description: "Run iperf3 in multiple parallel streams:", command: "iperf3 --client server_ip --parallel streams"},
	{description: "Run the test in reverse direction (server sends data to client):", command: "iperf3 --client server_ip --reverse"},
	{description: "Set the duration of the test:", command: "iperf3 --client server_ip --time seconds"}
];

export default function TLDRiperf3() {
	return <TLDR command="iperf3" characteristics={CHARACTERISTICS} manualURL={MANUAL_URL} examples={EXAMPLES} />;
}
