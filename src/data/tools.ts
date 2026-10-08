import type {LucideIcon} from "lucide-react";
// import {Binary, Cable, Gauge, Globe, KeyRound, Network, Radar, Route, Router, Server, Shield, Terminal, Timer, Waypoints, Wifi} from "lucide-react";
import {IconHttpGet} from "@tabler/icons-react";

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

export const toolSections: ToolSection[] = [
	{
		id: "tldr",
		title: "TLDR",
		tools: [
			{url: "/tldr-curl", name: "TLDR curl", description: "A simplified manual with usage examples for the curl command.", icon: IconHttpGet},
			{url: "/tldr-ip", name: "TLDR ip", description: "A simplified manual with usage examples for the ip command.", icon: IconHttpGet},
			{url: "/tldr-route", name: "TLDR route", description: "A simplified manual with usage examples for the route command.", icon: IconHttpGet},
			{url: "/tldr-ping", name: "TLDR ping", description: "A simplified manual with usage examples for the ping command.", icon: IconHttpGet},
			{url: "/tldr-traceroute", name: "TLDR traceroute", description: "A simplified manual with usage examples for the traceroute command.", icon: IconHttpGet},
			{url: "/tldr-dig", name: "TLDR dig", description: "A simplified manual with usage examples for the dig command.", icon: IconHttpGet},
			{url: "/tldr-nc", name: "TLDR nc", description: "A simplified manual with usage examples for the nc command.", icon: IconHttpGet},
			{url: "/tldr-ssh", name: "TLDR ssh", description: "A simplified manual with usage examples for the ssh command.", icon: IconHttpGet},
			{url: "/tldr-scp", name: "TLDR scp", description: "A simplified manual with usage examples for the scp command.", icon: IconHttpGet},
			{url: "/tldr-ftp", name: "TLDR ftp", description: "A simplified manual with usage examples for the ftp command.", icon: IconHttpGet},
			{url: "/tldr-sftp", name: "TLDR sftp", description: "A simplified manual with usage examples for the sftp command.", icon: IconHttpGet},
			{url: "/tldr-rsync", name: "TLDR rsync", description: "A simplified manual with usage examples for the rsync command.", icon: IconHttpGet},
			{url: "/tldr-nmap", name: "TLDR nmap", description: "A simplified manual with usage examples for the nmap command.", icon: IconHttpGet},
			{url: "/tldr-iperf3", name: "TLDR iperf3", description: "A simplified manual with usage examples for the iperf3 command.", icon: IconHttpGet},
			{url: "/tldr-tcpdump", name: "TLDR tcpdump", description: "A simplified manual with usage examples for the tcpdump command.", icon: IconHttpGet},
			{url: "/tldr-arp", name: "TLDR arp", description: "A simplified manual with usage examples for the arp command.", icon: IconHttpGet},
			{url: "/tldr-networkctl", name: "TLDR networkctl", description: "A simplified manual with usage examples for the networkctl command.", icon: IconHttpGet},
			{url: "/tldr-ss", name: "TLDR ss", description: "A simplified manual with usage examples for the ss command.", icon: IconHttpGet},
			{url: "/tldr-iw", name: "TLDR iw", description: "A simplified manual with usage examples for the iw command.", icon: IconHttpGet},
			{url: "/tldr-mtr", name: "TLDR mtr", description: "A simplified manual with usage examples for the mtr command.", icon: IconHttpGet}
		]
	}
];
