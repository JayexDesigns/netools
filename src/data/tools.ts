import type {LucideIcon} from "lucide-react";
import {Binary, Cable, Gauge, Globe, KeyRound, Network, Radar, Route, Router, Server, Shield, Terminal, Timer, Waypoints, Wifi} from "lucide-react";

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

const MOCK_DESCRIPTION = "Placeholder description for this mock tool.";

export const toolSections: ToolSection[] = [
	{
		id: "mock-section-1",
		title: "Mock Section 1",
		tools: [
			{id: "mock-tool-1", name: "Mock Tool 1", description: MOCK_DESCRIPTION, icon: Network},
			{id: "mock-tool-2", name: "Mock Tool 2", description: MOCK_DESCRIPTION, icon: Globe},
			{id: "mock-tool-3", name: "Mock Tool 3", description: MOCK_DESCRIPTION, icon: Shield},
			{id: "mock-tool-4", name: "Mock Tool 4", description: MOCK_DESCRIPTION, icon: Terminal},
			{id: "mock-tool-5", name: "Mock Tool 5", description: MOCK_DESCRIPTION, icon: Radar}
		]
	},
	{
		id: "mock-section-2",
		title: "Mock Section 2",
		tools: [
			{id: "mock-tool-6", name: "Mock Tool 6", description: MOCK_DESCRIPTION, icon: Wifi},
			{id: "mock-tool-7", name: "Mock Tool 7", description: MOCK_DESCRIPTION, icon: Server},
			{id: "mock-tool-8", name: "Mock Tool 8", description: MOCK_DESCRIPTION, icon: Router},
			{id: "mock-tool-9", name: "Mock Tool 9", description: MOCK_DESCRIPTION, icon: Cable},
			{id: "mock-tool-10", name: "Mock Tool 10", description: MOCK_DESCRIPTION, icon: Route}
		]
	},
	{
		id: "mock-section-3",
		title: "Mock Section 3",
		tools: [
			{id: "mock-tool-11", name: "Mock Tool 11", description: MOCK_DESCRIPTION, icon: KeyRound},
			{id: "mock-tool-12", name: "Mock Tool 12", description: MOCK_DESCRIPTION, icon: Timer},
			{id: "mock-tool-13", name: "Mock Tool 13", description: MOCK_DESCRIPTION, icon: Waypoints},
			{id: "mock-tool-14", name: "Mock Tool 14", description: MOCK_DESCRIPTION, icon: Binary},
			{id: "mock-tool-15", name: "Mock Tool 15", description: MOCK_DESCRIPTION, icon: Gauge}
		]
	}
];
