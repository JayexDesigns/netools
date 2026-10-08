import TLDR from "@/components/tldr";

const CHARACTERISTICS = ["Redirect I/O into a network stream through this versatile tool."];

const MANUAL_URL = "https://manned.org/nc";

const EXAMPLES = [
	{description: "Start a [l]istener on the specified TCP [p]ort and send a file into it:", command: "nc < filename -l -p port"},
	{description: "Connect to a target listener on the specified port and receive a file from it:", command: "nc host port > received_filename"},
	{description: "Scan the open TCP ports of a specified host:", command: "nc -v -z -w timeout_in_seconds host start_port-end_port"},
	{description: "Start a [l]istener on the specified TCP [p]ort and provide your local shell access to the connected party (this is dangerous and can be abused):", command: "nc -l -p port -e shell_executable"},
	{description: "Connect to a target listener and provide your local shell access to the remote party (this is dangerous and can be abused):", command: "nc host port -e shell_executable"},
	{description: "Act as a proxy and forward data from a local TCP port to the given remote host:", command: "nc -l -p local_port | nc host remote_port"},
	{description: "Send an HTTP GET request:", command: 'echo -e "GET / HTTP/1.1\\nHost: host\\n\\n" | nc host 80'}
];

export default function TLDRnc() {
	return <TLDR command="nc" characteristics={CHARACTERISTICS} manualURL={MANUAL_URL} examples={EXAMPLES} />;
}
