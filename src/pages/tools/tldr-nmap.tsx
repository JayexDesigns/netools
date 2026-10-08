import TLDR from "@/components/tldr";

const CHARACTERISTICS = ["Network exploration tool and security/port scanner."];

const MANUAL_URL = "https://nmap.org/book/man.html";

const EXAMPLES = [
	{description: "Scan the top 1000 ports of a remote host with various [v]erbosity levels:", command: "nmap -v1|2|3 ip_or_hostname"},
	{description: "Run a ping sweep over an entire [s]ub[n]et or individual hosts very aggressively:", command: "nmap -T5 -sn 192.168.0.0/24|ip_or_hostname1,ip_or_hostname2,..."},
	{description: "Enable OS detection, version detection, script scanning, and traceroute of hosts from a file:", command: "sudo nmap -A -iL path/to/file.txt"},
	{description: "Scan a specific list of [p]orts (use -p- for all ports from 1 to 65535):", command: "nmap -p port1,port2,... ip_or_host1,ip_or_host2,..."},
	{description: "Perform service and version detection of the top 1000 ports using default NSE scripts, writing results (-oA) to output files:", command: "nmap -sC -sV -oA top-1000-ports ip_or_host1,ip_or_host2,..."},
	{description: "Scan target(s) carefully using default and safe NSE scripts:", command: 'nmap --script "default and safe" ip_or_host1,ip_or_host2,...'},
	{description: "Scan for web servers running on standard [p]orts 80 and 443 using all available http-* NSE scripts:", command: 'nmap --script "http-*" ip_or_host1,ip_or_host2,... -p 80,443'},
	{description: "Attempt evading IDS/IPS detection by using an extremely slow scan (-T0), [D]ecoy source addresses, [f]ragmented packets, random data, and other methods:", command: "sudo nmap -T0 -D decoy_ip1,decoy_ip2,... --source-port 53 -f --data-length 16 -Pn ip_or_host"}
];

export default function TLDRnmap() {
	return <TLDR command="nmap" characteristics={CHARACTERISTICS} manualURL={MANUAL_URL} examples={EXAMPLES} />;
}
