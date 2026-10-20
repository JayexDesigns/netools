import {sampleEdges, sampleNodes, type DiagramNode} from "@/lib/diagram";
import {describe, expect, it} from "vitest";

// Approximate rendered device-card size (w-40 = 160px wide, ~100px tall)
const NODE_WIDTH = 160;
const NODE_HEIGHT = 100;

function nodeById(id: string): DiagramNode {
	const node = sampleNodes.find(item => item.id === id);
	expect(node, `missing sample node "${id}"`).toBeDefined();
	return node!;
}

function hasEdge(source: string, target: string): boolean {
	return sampleEdges.some(edge => edge.source === source && edge.target === target);
}

describe("sample diagram topology", () => {
	it("references only existing nodes from its edges", () => {
		const ids = new Set(sampleNodes.map(node => node.id));

		for (const edge of sampleEdges) {
			expect(ids.has(edge.source), `edge "${edge.id}" source`).toBe(true);
			expect(ids.has(edge.target), `edge "${edge.id}" target`).toBe(true);
		}
	});

	it("places the firewall inline between the core router and the core switch", () => {
		expect(hasEdge("sample-router", "sample-firewall")).toBe(true);
		expect(hasEdge("sample-firewall", "sample-switch")).toBe(true);

		// The router and the switch must not be wired in parallel anymore
		expect(hasEdge("sample-router", "sample-switch")).toBe(false);
		expect(hasEdge("sample-switch", "sample-router")).toBe(false);
	});

	it("has the firewall vertically between the router and the switch", () => {
		const router = nodeById("sample-router").position;
		const firewall = nodeById("sample-firewall").position;
		const switchNode = nodeById("sample-switch").position;

		expect(firewall.x).toBe(router.x);
		expect(switchNode.x).toBe(router.x);
		expect(router.y).toBeLessThan(firewall.y);
		expect(firewall.y).toBeLessThan(switchNode.y);
	});

	it("feeds three web servers through a single load balancer", () => {
		const balancers = sampleNodes.filter(node => node.data.kind === "load-balancer");
		const servers = sampleNodes.filter(node => node.data.kind === "server");

		expect(balancers).toHaveLength(1);
		expect(servers).toHaveLength(3);

		const balancerId = balancers[0].id;
		expect(hasEdge("sample-switch", balancerId)).toBe(true);

		for (const server of servers) {
			expect(hasEdge(balancerId, server.id), `load balancer -> ${server.data.name}`).toBe(true);
		}
	});

	it("keeps a squareish bounding box", () => {
		const xs = sampleNodes.map(node => node.position.x);
		const ys = sampleNodes.map(node => node.position.y);
		const width = Math.max(...xs) + NODE_WIDTH - Math.min(...xs);
		const height = Math.max(...ys) + NODE_HEIGHT - Math.min(...ys);
		const ratio = width / height;

		expect(ratio).toBeGreaterThan(0.6);
		expect(ratio).toBeLessThan(1.6);
	});
});
