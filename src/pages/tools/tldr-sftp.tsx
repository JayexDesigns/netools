import TLDR from "@/components/tldr";

const CHARACTERISTICS = ["Secure File Transfer Program. Interactive program to copy files between hosts over SSH. For non-interactive file transfers, see scp or rsync."];

const MANUAL_URL = "https://manned.org/sftp";

const EXAMPLES = [
	{description: "Connect to a remote server and enter an interactive command mode:", command: "sftp remote_user@remote_host"},
	{description: "Connect using an alternate port:", command: "sftp -P remote_port remote_user@remote_host"},
	{description: "Connect using a predefined host (in ~/.ssh/config):", command: "sftp host"},
	{description: "[Interactive] Transfer remote file to the local system:", command: "get path/to/remote_file"},
	{description: "[Interactive] Transfer local file to the remote system:", command: "put path/to/local_file"},
	{description: "[Interactive] Transfer remote directory to the local system recursively (works with put too):", command: "get -R path/to/remote_directory"},
	{description: "[Interactive] Get list of files on local machine:", command: "lls"},
	{description: "[Interactive] Get a list of files on the remote machine:", command: "ls"}
];

export default function TLDRsftp() {
	return <TLDR command="sftp" characteristics={CHARACTERISTICS} manualURL={MANUAL_URL} examples={EXAMPLES} />;
}
