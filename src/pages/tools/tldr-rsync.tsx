import TLDR from "@/components/tldr";

const CHARACTERISTICS = ["Transfer files either to or from a remote host (but not between two remote hosts), by default using SSH."];

const MANUAL_URL = "https://download.samba.org/pub/rsync/rsync.1";

const EXAMPLES = [
	{description: "Transfer a file (use --dry-run to simulate the transfer):", command: "rsync path/to/source path/to/destination"},
	{description: "Use archive mode (recursively copy directories, copy symlinks without resolving, and preserve permissions, ownership, and modification times):", command: "rsync --archive path/to/source path/to/destination"},
	{description: "Compress the data as it is sent to the destination, display verbose and human-readable progress, and keep partially transferred files if interrupted:", command: "rsync --compress --verbose --human-readable --partial --progress path/to/source path/to/destination"},
	{description: "Recursively copy directories and ensure each file is fully committed to disk rather than remaining in RAM:", command: "rsync --recursive --fsync path/to/source path/to/destination"},
	{description: "Transfer directory contents, but not the directory itself:", command: "rsync --recursive path/to/source/ path/to/destination"},
	{description: "Use archive mode, resolve symlinks, and skip files that are newer on the destination:", command: "rsync --archive --update --copy-links path/to/source path/to/destination"},
	{description: "Transfer a directory from a remote host running rsyncd and delete files on the destination that do not exist on the source:", command: "rsync --recursive --delete rsync://host:path/to/source path/to/destination"},
	{description: "Transfer a file over SSH using a different port than the default (22) and show global progress:", command: "rsync --rsh 'ssh -p port' --info=progress2 host:path/to/source path/to/destination"}
];

export default function TLDRrsync() {
	return <TLDR command="rsync" characteristics={CHARACTERISTICS} manualURL={MANUAL_URL} examples={EXAMPLES} />;
}
