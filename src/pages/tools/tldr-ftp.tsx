import TLDR from "@/components/tldr";

const CHARACTERISTICS = ["Tools to interact with a server via File Transfer Protocol."];

const MANUAL_URL = "https://manned.org/ftp";

const EXAMPLES = [
	{description: "Connect to an FTP server and run in interactive mode:", command: "ftp ftp.example.com"},
	{description: "Connect to an FTP server specifying its IP address and port:", command: "ftp ip_address port"},
	{description: "Switch to binary transfer mode (graphics, compressed files, etc.):", command: "binary"},
	{description: "Transfer multiple files without prompting for confirmation on every file:", command: "prompt off"},
	{description: "Download multiple files (glob expression):", command: "mget *.png"},
	{description: "Upload multiple files (glob expression):", command: "mput *.zip"},
	{description: "Delete multiple files on the remote server:", command: "mdelete *.txt"},
	{description: "Rename a file on the remote server:", command: "rename original_filename new_filename"}
];

export default function TLDRftp() {
	return <TLDR command="ftp" characteristics={CHARACTERISTICS} manualURL={MANUAL_URL} examples={EXAMPLES} />;
}
