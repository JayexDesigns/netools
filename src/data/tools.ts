import type {LucideIcon} from "lucide-react";
// import {Binary, Cable, Gauge, Globe, KeyRound, Network, Radar, Route, Router, Server, Shield, Terminal, Timer, Waypoints, Wifi} from "lucide-react";
import {IconHttpGet} from "@tabler/icons-react";

export type Tool = {
	id: string;
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
		tools: [{id: "tldr-curl", name: "TLDR curl", description: "A simplified manual with usage examples for the curl command.", icon: IconHttpGet}]
	}
];
