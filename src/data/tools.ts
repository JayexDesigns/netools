import {IconError404, IconHttpGet, IconHttpPost, IconTopologyStar3} from "@tabler/icons-react";
import type {LucideIcon} from "lucide-react";
import {ArrowLeftRight, ArrowRightLeft, Cable, Calculator, Copy, FolderSync, Gauge, Globe, KeyRound, Layers, Link2, MapPin, Network, Package, Radar, Route, Router, Rows3, ScanSearch, Shield, ShieldCheck, Terminal, Timer, Waypoints, Wifi} from "lucide-react";

export type Tool = {
	url: string;
	name: string;
	description: string;
	icon: LucideIcon;
};

export type ToolSection = {
	id: string;
	title: string;
	tools: Tool[];
};

// Strip the section title prefix on tools when it matches
export function toolLabel(section: ToolSection, name: string) {
	return name.startsWith(`${section.title} `) ? name.slice(section.title.length + 1) : name;
}

export const toolSections: ToolSection[] = [
	{
		id: "development",
		title: "Development",
		tools: [
			{url: "/network-diagram-canvas", name: "Network Diagram Canvas", description: "Draw a network topology on a drag-and-drop canvas: add devices by category, connect them, edit their properties and export the diagram as a PNG.", icon: IconTopologyStar3},
			{url: "/curl-builder", name: "Curl Builder", description: "Build a curl command from a URL, query parameters, headers, a request body and authorization options.", icon: Terminal},
			{url: "/jwt-encoder-decoder", name: "JWT Encoder/Decoder", description: "Decode, build and sign JSON Web Tokens with HMAC, RSA or ECDSA keys, checking signatures and claim expiry entirely in the browser.", icon: ShieldCheck},
			{url: "/url-encoder-decoder", name: "URL Encoder/Decoder", description: "Convert a URI between plain text and percent-encoded form, for example example.com/hello world ⇄ example.com/hello%20world.", icon: Link2},
			{url: "/http-status-codes", name: "HTTP Status Codes", description: "Look up every registered HTTP status code with its reason phrase and a plain explanation, grouped by class in collapsible sections.", icon: IconError404}
		]
	},
	{
		id: "ipv4",
		title: "IPv4",
		tools: [
			{url: "/ipv4-subnet-calculator", name: "IPv4 Subnet Calculator", description: "Calculate the network address, broadcast address, masks, size, host range, class and purpose of an IPv4 address.", icon: Calculator},
			{url: "/ipv4-subnet-creator", name: "IPv4 Subnet Creator", description: "Create the smallest subnet that fits the amount of hosts you need around a base IPv4 address, moved to the closest network when the address is not aligned.", icon: Layers},
			{url: "/ipv4-address-converter", name: "IPv4 Address Converter", description: "Convert an IPv4 address between decimal, binary, hexadecimal and octal notation and a subnet mask between dotted decimal and CIDR.", icon: ArrowRightLeft}
		]
	},
	{
		id: "tldr",
		title: "TLDR",
		tools: [
			{url: "/tldr-curl", name: "TLDR curl", description: "A simplified manual with usage examples for the curl command.", icon: IconHttpPost},
			{url: "/tldr-wget", name: "TLDR wget", description: "A simplified manual with usage examples for the wget command.", icon: IconHttpGet},
			{url: "/tldr-ip", name: "TLDR ip", description: "A simplified manual with usage examples for the ip command.", icon: Network},
			{url: "/tldr-route", name: "TLDR route", description: "A simplified manual with usage examples for the route command.", icon: Route},
			{url: "/tldr-ping", name: "TLDR ping", description: "A simplified manual with usage examples for the ping command.", icon: Radar},
			{url: "/tldr-traceroute", name: "TLDR traceroute", description: "A simplified manual with usage examples for the traceroute command.", icon: Waypoints},
			{url: "/tldr-dig", name: "TLDR dig", description: "A simplified manual with usage examples for the dig command.", icon: Globe},
			{url: "/tldr-nc", name: "TLDR nc", description: "A simplified manual with usage examples for the nc command.", icon: Cable},
			{url: "/tldr-ssh", name: "TLDR ssh", description: "A simplified manual with usage examples for the ssh command.", icon: KeyRound},
			{url: "/tldr-scp", name: "TLDR scp", description: "A simplified manual with usage examples for the scp command.", icon: Copy},
			{url: "/tldr-ftp", name: "TLDR ftp", description: "A simplified manual with usage examples for the ftp command.", icon: ArrowLeftRight},
			{url: "/tldr-sftp", name: "TLDR sftp", description: "A simplified manual with usage examples for the sftp command.", icon: Shield},
			{url: "/tldr-rsync", name: "TLDR rsync", description: "A simplified manual with usage examples for the rsync command.", icon: FolderSync},
			{url: "/tldr-nmap", name: "TLDR nmap", description: "A simplified manual with usage examples for the nmap command.", icon: ScanSearch},
			{url: "/tldr-iperf3", name: "TLDR iperf3", description: "A simplified manual with usage examples for the iperf3 command.", icon: Gauge},
			{url: "/tldr-tcpdump", name: "TLDR tcpdump", description: "A simplified manual with usage examples for the tcpdump command.", icon: Package},
			{url: "/tldr-arp", name: "TLDR arp", description: "A simplified manual with usage examples for the arp command.", icon: MapPin},
			{url: "/tldr-networkctl", name: "TLDR networkctl", description: "A simplified manual with usage examples for the networkctl command.", icon: Router},
			{url: "/tldr-ss", name: "TLDR ss", description: "A simplified manual with usage examples for the ss command.", icon: Rows3},
			{url: "/tldr-iw", name: "TLDR iw", description: "A simplified manual with usage examples for the iw command.", icon: Wifi},
			{url: "/tldr-mtr", name: "TLDR mtr", description: "A simplified manual with usage examples for the mtr command.", icon: Timer}
		]
	}
];
