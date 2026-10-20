import {generateId} from "@/lib/id";
import type {Connection, Edge, Node, XYPosition} from "@xyflow/react";
import {Activity, Box, Boxes, Camera, Cloud, Cpu, Database, Globe, HardDrive, Laptop, LockKeyhole, Monitor, Network, Phone, Printer, RadioReceiver, Router, ScrollText, Server, ServerCog, Share2, Shield, ShieldAlert, Ship, Shuffle, Smartphone, Tablet, User, Wifi, type LucideIcon} from "lucide-react";
import type {CSSProperties} from "react";

export type DiagramCategory = "network" | "security" | "compute" | "virtualization" | "cloud" | "iot" | "endpoints" | "monitoring";

export type DeviceKind = "router" | "switch" | "access-point" | "modem" | "firewall" | "vpn" | "ids-ips" | "proxy" | "load-balancer" | "server" | "nas" | "database" | "storage" | "container" | "virtual-machine" | "kubernetes" | "internet" | "cloud-gateway" | "cdn" | "object-storage" | "external-client" | "printer" | "ip-camera" | "voip-phone" | "phone" | "laptop" | "tablet" | "desktop-pc" | "monitoring-server" | "log-server" | "snmp-collector";

export type DiagramNodeData = {
	name: string;
	description: string;
	kind: DeviceKind;
	category: DiagramCategory;
	color?: string;
};

export type DiagramNode = Node<DiagramNodeData, "device">;
export type DiagramEdge = Edge;
export type EdgeStyle = "smoothstep" | "step" | "straight" | "bezier";

export type DiagramSelection = {kind: "node"; id: string} | {kind: "edge"; id: string} | null;

export type NodePatch = Partial<DiagramNodeData>;
export type EdgePatch = {
	label?: string;
	color?: string;
	type?: EdgeStyle;
	animated?: boolean;
};

export const DEVICE_DRAG_MIME = "application/x-netools-device";

export const categories: {id: DiagramCategory; label: string; color: string}[] = [
	{id: "network", label: "Network", color: "#0ea5e9"},
	{id: "security", label: "Security", color: "#f43f5e"},
	{id: "compute", label: "Compute & storage", color: "#8b5cf6"},
	{id: "virtualization", label: "Virtualization", color: "#6366f1"},
	{id: "cloud", label: "Cloud & external", color: "#10b981"},
	{id: "iot", label: "IoT & peripherals", color: "#84cc16"},
	{id: "endpoints", label: "End-user devices", color: "#f59e0b"},
	{id: "monitoring", label: "Monitoring & management", color: "#f97316"}
];

export type DeviceDefinition = {
	kind: DeviceKind;
	label: string;
	category: DiagramCategory;
	Icon: LucideIcon;
};

export const devices: DeviceDefinition[] = [
	{kind: "router", label: "Router", category: "network", Icon: Router},
	{kind: "switch", label: "Switch", category: "network", Icon: Network},
	{kind: "access-point", label: "Access Point", category: "network", Icon: Wifi},
	{kind: "modem", label: "Modem / ONT", category: "network", Icon: Router},
	{kind: "firewall", label: "Firewall", category: "security", Icon: Shield},
	{kind: "vpn", label: "VPN Gateway", category: "security", Icon: LockKeyhole},
	{kind: "ids-ips", label: "IDS / IPS", category: "security", Icon: ShieldAlert},
	{kind: "proxy", label: "Proxy Server", category: "security", Icon: Shuffle},
	{kind: "load-balancer", label: "Load Balancer", category: "security", Icon: Network},
	{kind: "server", label: "Server", category: "compute", Icon: Server},
	{kind: "nas", label: "NAS", category: "compute", Icon: ServerCog},
	{kind: "database", label: "Database", category: "compute", Icon: Database},
	{kind: "storage", label: "Storage", category: "compute", Icon: HardDrive},
	{kind: "container", label: "Container", category: "virtualization", Icon: Boxes},
	{kind: "virtual-machine", label: "Virtual Machine", category: "virtualization", Icon: Cpu},
	{kind: "kubernetes", label: "Kubernetes Cluster", category: "virtualization", Icon: Ship},
	{kind: "internet", label: "Internet", category: "cloud", Icon: Globe},
	{kind: "cloud-gateway", label: "Cloud Gateway", category: "cloud", Icon: Cloud},
	{kind: "cdn", label: "CDN", category: "cloud", Icon: Share2},
	{kind: "object-storage", label: "Object Storage", category: "cloud", Icon: Box},
	{kind: "external-client", label: "External Client", category: "cloud", Icon: User},
	{kind: "printer", label: "Printer", category: "iot", Icon: Printer},
	{kind: "ip-camera", label: "IP Camera", category: "iot", Icon: Camera},
	{kind: "voip-phone", label: "VoIP Phone", category: "iot", Icon: Phone},
	{kind: "phone", label: "Phone", category: "endpoints", Icon: Smartphone},
	{kind: "laptop", label: "Laptop", category: "endpoints", Icon: Laptop},
	{kind: "tablet", label: "Tablet", category: "endpoints", Icon: Tablet},
	{kind: "desktop-pc", label: "Desktop PC", category: "endpoints", Icon: Monitor},
	{kind: "monitoring-server", label: "Monitoring Server", category: "monitoring", Icon: Activity},
	{kind: "log-server", label: "Log Server", category: "monitoring", Icon: ScrollText},
	{kind: "snmp-collector", label: "SNMP Collector", category: "monitoring", Icon: RadioReceiver}
];

export const paletteColors: {name: string; value: string}[] = [
	{name: "Slate", value: "#64748b"},
	{name: "Gray", value: "#6b7280"},
	{name: "Zinc", value: "#71717a"},
	{name: "Neutral", value: "#737373"},
	{name: "Stone", value: "#78716c"},
	{name: "Red", value: "#ef4444"},
	{name: "Orange", value: "#f97316"},
	{name: "Amber", value: "#f59e0b"},
	{name: "Yellow", value: "#eab308"},
	{name: "Lime", value: "#84cc16"},
	{name: "Green", value: "#22c55e"},
	{name: "Emerald", value: "#10b981"},
	{name: "Teal", value: "#14b8a6"},
	{name: "Cyan", value: "#06b6d4"},
	{name: "Sky", value: "#0ea5e9"},
	{name: "Blue", value: "#3b82f6"},
	{name: "Indigo", value: "#6366f1"},
	{name: "Violet", value: "#8b5cf6"},
	{name: "Purple", value: "#a855f7"},
	{name: "Fuchsia", value: "#d946ef"},
	{name: "Pink", value: "#ec4899"},
	{name: "Rose", value: "#f43f5e"}
];

export const edgeStyleOptions: {value: EdgeStyle; label: string}[] = [
	{value: "smoothstep", label: "Right angle (smooth)"},
	{value: "step", label: "Right angle (sharp)"},
	{value: "straight", label: "Straight"},
	{value: "bezier", label: "Curved"}
];

export const DEFAULT_EDGE_COLOR = "#64748b";

export const edgeLabelStyle: CSSProperties = {fill: "var(--muted-foreground)", fontSize: 12};

// Rounded semi-transparent chip behind edge labels, so they stay readable over the line
export const edgeLabelBg: {labelShowBg: boolean; labelBgStyle: CSSProperties; labelBgPadding: [number, number]; labelBgBorderRadius: number} = {
	labelShowBg: true,
	labelBgStyle: {fill: "var(--card)", fillOpacity: 0.9},
	labelBgPadding: [6, 4],
	labelBgBorderRadius: 6
};

export function categoryInfo(category: DiagramCategory) {
	return categories.find(item => item.id === category) ?? categories[0];
}

export function deviceDefinition(kind: DeviceKind): DeviceDefinition {
	return devices.find(device => device.kind === kind) ?? devices[0];
}

export function isDeviceKind(value: string): value is DeviceKind {
	return devices.some(device => device.kind === value);
}

export function nodeColor(data: DiagramNodeData): string {
	return data.color ?? categoryInfo(data.category).color;
}

export function edgeColor(edge: DiagramEdge): string {
	return typeof edge.style?.stroke === "string" ? edge.style.stroke : DEFAULT_EDGE_COLOR;
}

export function edgeText(edge: DiagramEdge): string {
	return typeof edge.label === "string" ? edge.label : "";
}

export function edgeLineType(edge: DiagramEdge): EdgeStyle {
	return edgeStyleOptions.some(option => option.value === edge.type) ? (edge.type as EdgeStyle) : "smoothstep";
}

export function createNode(kind: DeviceKind, position: XYPosition): DiagramNode {
	const definition = deviceDefinition(kind);

	return {
		id: generateId(),
		type: "device",
		position,
		data: {name: definition.label, description: "", kind, category: definition.category}
	};
}

export function createEdge(connection: Connection): DiagramEdge {
	return {
		id: generateId(),
		...connection,
		label: "New connection",
		type: "smoothstep",
		...edgeLabelBg,
		labelStyle: edgeLabelStyle,
		style: {stroke: DEFAULT_EDGE_COLOR, strokeWidth: 2}
	};
}

export const sampleNodes: DiagramNode[] = [
	{id: "sample-internet", type: "device", position: {x: 300, y: 20}, data: {name: "Internet", description: "ISP uplink", kind: "internet", category: "cloud"}},
	{id: "sample-router", type: "device", position: {x: 300, y: 160}, data: {name: "Core Router", description: "192.168.1.1", kind: "router", category: "network"}},
	{id: "sample-firewall", type: "device", position: {x: 300, y: 300}, data: {name: "Perimeter Firewall", description: "192.168.1.254", kind: "firewall", category: "security"}},
	{id: "sample-switch", type: "device", position: {x: 300, y: 440}, data: {name: "Managed Switch", description: "192.168.1.2", kind: "switch", category: "network"}},
	{id: "sample-database", type: "device", position: {x: 620, y: 580}, data: {name: "Database", description: "192.168.1.20", kind: "database", category: "compute"}},
	{id: "sample-load-balancer", type: "device", position: {x: 300, y: 580}, data: {name: "Load Balancer", description: "192.168.1.100", kind: "load-balancer", category: "security"}},
	{id: "sample-web-1", type: "device", position: {x: 100, y: 720}, data: {name: "Web Server 1", description: "192.168.1.10", kind: "server", category: "compute"}},
	{id: "sample-web-2", type: "device", position: {x: 300, y: 720}, data: {name: "Web Server 2", description: "192.168.1.11", kind: "server", category: "compute"}},
	{id: "sample-web-3", type: "device", position: {x: 500, y: 720}, data: {name: "Web Server 3", description: "192.168.1.12", kind: "server", category: "compute"}}
];

function sampleEdge(id: string, source: string, target: string, label: string, color: string, animated = false): DiagramEdge {
	return {
		id,
		source,
		target,
		label,
		type: "smoothstep",
		animated,
		...edgeLabelBg,
		labelStyle: edgeLabelStyle,
		style: {stroke: color, strokeWidth: 2}
	};
}

export const sampleEdges: DiagramEdge[] = [sampleEdge("sample-edge-wan", "sample-internet", "sample-router", "WAN", categoryInfo("cloud").color, true), sampleEdge("sample-edge-gi1", "sample-router", "sample-firewall", "", categoryInfo("network").color), sampleEdge("sample-edge-gi2", "sample-firewall", "sample-switch", "", categoryInfo("security").color), sampleEdge("sample-edge-lb", "sample-switch", "sample-load-balancer", "", categoryInfo("network").color), sampleEdge("sample-edge-web1", "sample-load-balancer", "sample-web-1", "", categoryInfo("compute").color), sampleEdge("sample-edge-web2", "sample-load-balancer", "sample-web-2", "", categoryInfo("compute").color), sampleEdge("sample-edge-web3", "sample-load-balancer", "sample-web-3", "", categoryInfo("compute").color), sampleEdge("sample-edge-db", "sample-switch", "sample-database", "", categoryInfo("compute").color)];
