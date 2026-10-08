import TLDR from "@/components/tldr";

const CHARACTERISTICS = ["Secure copy. Copy files between hosts using Secure Copy Protocol over SSH."];

const MANUAL_URL = "https://man.openbsd.org/scp";

const EXAMPLES = [
	{description: "Copy a local file to a remote host:", command: "scp path/to/local_file remote_host:path/to/remote_file"},
	{description: "Use a specific port when connecting to the remote host:", command: "scp -P port path/to/local_file remote_host:path/to/remote_file"},
	{description: "Copy a file from a remote host to a local directory:", command: "scp remote_host:path/to/remote_file path/to/local_directory"},
	{description: "Recursively copy the contents of a directory from a remote host to a local directory:", command: "scp -r remote_host:path/to/remote_directory path/to/local_directory"},
	{description: "Copy a file between two remote hosts transferring through the local host:", command: "scp -3 host1:path/to/remote_file host2:path/to/remote_directory"},
	{description: "Use a specific username when connecting to the remote host:", command: "scp path/to/local_file remote_username@remote_host:path/to/remote_directory"},
	{description: "Use a specific SSH private key for authentication with the remote host:", command: "scp -i ~/.ssh/private_key path/to/local_file remote_host:path/to/remote_file"},
	{description: "Use a specific proxy when connecting to the remote host:", command: "scp -J proxy_username@proxy_host path/to/local_file remote_host:path/to/remote_file"}
];

export default function TLDRscp() {
	return <TLDR command="scp" characteristics={CHARACTERISTICS} manualURL={MANUAL_URL} examples={EXAMPLES} />;
}
