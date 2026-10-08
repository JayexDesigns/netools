import TLDR from "@/components/tldr";

const CHARACTERISTICS = ["Secure Shell is a protocol used to securely log onto remote systems. It can be used for logging or executing commands on a remote server."];

const MANUAL_URL = "https://man.openbsd.org/ssh";

const EXAMPLES = [
	{description: "Connect to a remote server:", command: "ssh username@remote_host"},
	{description: "Connect to a remote server with a specific [i]dentity (private key):", command: "ssh username@remote_host -i path/to/key_file"},
	{description: "Connect to a remote server with IP 10.0.0.1 and using a specific [p]ort (Note: 10.0.0.1 can be shortened to 10.1):", command: "ssh username@10.0.0.1 -p 2222"},
	{description: "Run a command on a remote server with a [t]ty allocation allowing interaction with the remote command:", command: "ssh username@remote_host -t command command_arguments"},
	{description: "SSH tunneling: [D]ynamic port forwarding (SOCKS proxy on localhost:1080):", command: "ssh username@remote_host -D 1080"},
	{description: "SSH tunneling: Forward a specific port (localhost:9999 to example.org:80) along with disabling pseudo-[T]ty allocation and executio[N] of remote commands:", command: "ssh username@remote_host -L 9999:example.org:80 -N -T"},
	{description: "SSH [J]umping: Connect through a jumphost to a remote server (Multiple jump hops may be specified separated by comma characters):", command: "ssh username@remote_host -J username@jump_host"},
	{description: "Close a hanged session:", command: "<Enter><~><.>"}
];

export default function TLDRssh() {
	return <TLDR command="ssh" characteristics={CHARACTERISTICS} manualURL={MANUAL_URL} examples={EXAMPLES} />;
}
