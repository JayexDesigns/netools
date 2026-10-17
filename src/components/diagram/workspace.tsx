import DeviceNode from "@/components/diagram/device-node";
import DevicePalette from "@/components/diagram/device-palette";
import Inspector from "@/components/diagram/inspector";
import {Button} from "@/components/ui/button";
import {Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle} from "@/components/ui/drawer";
import {toast} from "@/components/ui/toast";
import {createEdge, createNode, DEFAULT_EDGE_COLOR, DEVICE_DRAG_MIME, deviceDefinition, edgeLabelBg, edgeLabelStyle, isDeviceKind, sampleEdges, sampleNodes, type DeviceKind, type DiagramEdge, type DiagramNode, type DiagramSelection, type EdgePatch, type NodePatch} from "@/lib/diagram";
import {addEdge, Background, BackgroundVariant, Controls, ReactFlow, reconnectEdge, useEdgesState, useNodesState, type Connection, type NodeTypes, type ReactFlowInstance} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {toPng} from "html-to-image";
import {DownloadIcon, PaletteIcon, Trash2Icon} from "lucide-react";
import {useRef, useState, type CSSProperties} from "react";

const nodeTypes: NodeTypes = {device: DeviceNode};

const defaultEdgeOptions = {
	type: "smoothstep",
	...edgeLabelBg,
	labelStyle: edgeLabelStyle,
	style: {stroke: DEFAULT_EDGE_COLOR, strokeWidth: 2}
};

const flowThemeVars = {
	"--xy-controls-button-background-color": "var(--card)",
	"--xy-controls-button-background-color-hover": "var(--muted)",
	"--xy-controls-button-border-color": "var(--border)",
	"--xy-controls-button-color": "var(--foreground)",
	"--xy-controls-box-shadow-default": "none"
} as CSSProperties;

export default function DiagramWorkspace() {
	const [nodes, setNodes, onNodesChange] = useNodesState<DiagramNode>(sampleNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState<DiagramEdge>(sampleEdges);
	const [selection, setSelection] = useState<DiagramSelection>(null);
	const [exporting, setExporting] = useState(false);
	const [paletteOpen, setPaletteOpen] = useState(false);
	const [propertiesOpen, setPropertiesOpen] = useState(false);
	const [clearOpen, setClearOpen] = useState(false);
	const flowRef = useRef<ReactFlowInstance<DiagramNode, DiagramEdge> | null>(null);
	const canvasRef = useRef<HTMLDivElement>(null);
	// Tap-added nodes drift slightly so several of them never stack exactly
	const tapCounter = useRef(0);
	// Phones pan a cramped canvas, so rendering only what is on screen keeps them smooth
	const [touchInput, setTouchInput] = useState(false);

	const selectedNode = selection?.kind === "node" ? nodes.find(node => node.id === selection.id) : undefined;
	const selectedEdge = selection?.kind === "edge" ? edges.find(edge => edge.id === selection.id) : undefined;

	/*
		React Flow re-emits onSelectionChange whenever its internal store syncs, not only when the
		selection really changes, so the state must keep its reference for an unchanged selection:
		fresh objects here would feed a render back into a new event and never settle.
	*/
	function applySelection(next: DiagramSelection) {
		setSelection(current => {
			if (current === next) return current;
			if (current === null || next === null) return next;
			return current.kind === next.kind && current.id === next.id ? current : next;
		});
	}

	// Below lg the inspector lives in a drawer, so picking something opens it
	function openPropertiesOnMobile() {
		if (window.matchMedia("(max-width: 1023px)").matches) setPropertiesOpen(true);
	}

	function appendNode(kind: DeviceKind, position: {x: number; y: number}) {
		const node = createNode(kind, position);
		setNodes(current => [...current, node]);
		applySelection({kind: "node", id: node.id});
	}

	function handleSelectionChange({nodes: selectedNodes, edges: selectedEdges}: {nodes: DiagramNode[]; edges: DiagramEdge[]}) {
		if (selectedNodes.length === 1 && selectedEdges.length === 0) applySelection({kind: "node", id: selectedNodes[0].id});
		else if (selectedEdges.length === 1 && selectedNodes.length === 0) applySelection({kind: "edge", id: selectedEdges[0].id});
		else if (selectedNodes.length === 0 && selectedEdges.length === 0) applySelection(null);
	}

	function handleConnect(connection: Connection) {
		setEdges(current => addEdge(createEdge(connection), current));
	}

	function handleReconnect(oldEdge: DiagramEdge, newConnection: Connection) {
		setEdges(current => reconnectEdge(oldEdge, newConnection, current));
	}

	// Dropping a palette item adds the device where it lands on the canvas
	function handleDrop(event: React.DragEvent<HTMLDivElement>) {
		event.preventDefault();
		const kind = event.dataTransfer.getData(DEVICE_DRAG_MIME);
		const instance = flowRef.current;
		if (!isDeviceKind(kind) || !instance) return;
		appendNode(kind, instance.screenToFlowPosition({x: event.clientX, y: event.clientY}));
	}

	// Tapping a palette item adds the device in the middle of the visible canvas
	function handleAddDevice(kind: DeviceKind) {
		const container = canvasRef.current;
		const instance = flowRef.current;
		const offset = tapCounter.current++ % 5;

		if (container && instance) {
			const rect = container.getBoundingClientRect();
			appendNode(kind, instance.screenToFlowPosition({x: rect.left + rect.width / 2 + offset * 28, y: rect.top + rect.height / 2 + offset * 28}));
		} else {
			appendNode(kind, {x: offset * 28, y: offset * 28});
		}

		setPaletteOpen(false);
	}

	function handleNodePatch(patch: NodePatch) {
		if (selection?.kind !== "node") return;

		setNodes(current =>
			current.map(node => {
				if (node.id !== selection.id) return node;
				const data = {...node.data, ...patch};
				// Changing the type moves the node to the type's category, so an automatic color follows
				if (patch.kind !== undefined) data.category = deviceDefinition(patch.kind).category;
				return {...node, data};
			})
		);
	}

	function handleEdgePatch(patch: EdgePatch) {
		if (selection?.kind !== "edge") return;

		setEdges(current =>
			current.map(edge => {
				if (edge.id !== selection.id) return edge;
				const next: DiagramEdge = {...edge};
				if (patch.label !== undefined) next.label = patch.label;
				if (patch.color !== undefined) next.style = {...edge.style, stroke: patch.color, strokeWidth: 2};
				if (patch.type !== undefined) next.type = patch.type;
				if (patch.animated !== undefined) next.animated = patch.animated;
				return next;
			})
		);
	}

	function handleDeleteNode() {
		if (selection?.kind !== "node") return;
		const id = selection.id;
		setNodes(current => current.filter(node => node.id !== id));
		setEdges(current => current.filter(edge => edge.source !== id && edge.target !== id));
		applySelection(null);
	}

	function handleDeleteEdge() {
		if (selection?.kind !== "edge") return;
		const id = selection.id;
		setEdges(current => current.filter(edge => edge.id !== id));
		applySelection(null);
	}

	// Empties the canvas once the user confirms in the clear dialog
	function handleClear() {
		setNodes([]);
		setEdges([]);
		applySelection(null);
		setClearOpen(false);
	}

	// Fits the diagram in view and screenshots the canvas without the editing affordances
	async function handleExport() {
		const container = canvasRef.current;
		const instance = flowRef.current;
		if (!container || !instance || exporting) return;

		if (nodes.length === 0) {
			toast.add({type: "error", description: "Add at least one device to the canvas before exporting."});
			return;
		}

		setExporting(true);
		try {
			await instance.fitView({padding: 0.2, duration: 0});
			// Two frames so the re-rendered viewport is painted before it is captured
			await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

			const dataUrl = await toPng(container, {
				backgroundColor: getComputedStyle(container).backgroundColor,
				cacheBust: true,
				pixelRatio: 2,
				// The filter also receives text nodes, which have no classList
				filter: node => !(node instanceof Element) || (!node.classList.contains("react-flow__controls") && !node.classList.contains("react-flow__attribution") && !node.classList.contains("react-flow__handle"))
			});

			// The link has to live in the document for Safari/iOS to honor the download
			const link = document.createElement("a");
			link.download = "network-diagram.png";
			link.href = dataUrl;
			document.body.append(link);
			link.click();
			link.remove();
		} catch (error) {
			console.error("PNG export failed:", error);
			toast.add({type: "error", description: "The PNG could not be exported, please try again."});
		} finally {
			setExporting(false);
		}
	}

	const inspector = <Inspector node={selectedNode} edge={selectedEdge} idPrefix="panel" onNodePatch={handleNodePatch} onEdgePatch={handleEdgePatch} onDeleteNode={handleDeleteNode} onDeleteEdge={handleDeleteEdge} />;

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-2">
				<Button type="button" variant="outline" className="lg:hidden" onClick={() => setPaletteOpen(true)}>
					<PaletteIcon /> Devices
				</Button>
				<Dialog open={clearOpen} onOpenChange={setClearOpen}>
					<DialogTrigger
						render={
							<Button type="button" variant="outline" disabled={nodes.length === 0 && edges.length === 0}>
								<Trash2Icon /> Clear
							</Button>
						}
					/>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Clear the canvas?</DialogTitle>
							<DialogDescription>
								This removes all {nodes.length} {nodes.length === 1 ? "device" : "devices"} and {edges.length} {edges.length === 1 ? "connection" : "connections"} from the diagram. It cannot be undone.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
							<Button type="button" variant="destructive" onClick={handleClear}>
								<Trash2Icon /> Clear canvas
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
				<Button type="button" onClick={handleExport} disabled={exporting}>
					<DownloadIcon /> {exporting ? "Exporting…" : "Export PNG"}
				</Button>
			</div>

			<div className="gap-3 grid lg:grid-cols-[280px_minmax(0,1fr)_280px] lg:h-160">
				<div className="hidden lg:block bg-black/30 p-3 border border-border rounded-xl lg:min-h-0 overflow-y-auto">
					<DevicePalette onAddDevice={handleAddDevice} />
				</div>

				<div
					ref={canvasRef}
					className="relative bg-background border border-border rounded-xl h-105 sm:h-135 lg:h-auto lg:min-h-0 overflow-hidden"
					onDrop={handleDrop}
					onPointerDownCapture={event => {
						if (event.pointerType === "touch") setTouchInput(true);
					}}
					onDragOver={event => {
						event.preventDefault();
						event.dataTransfer.dropEffect = "move";
					}}>
					<ReactFlow<DiagramNode, DiagramEdge>
						nodes={nodes}
						edges={edges}
						nodeTypes={nodeTypes}
						style={flowThemeVars}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onConnect={handleConnect}
						onReconnect={handleReconnect}
						onSelectionChange={handleSelectionChange}
						onNodeClick={openPropertiesOnMobile}
						onEdgeClick={openPropertiesOnMobile}
						onInit={instance => {
							flowRef.current = instance;
						}}
						defaultEdgeOptions={defaultEdgeOptions}
						fitView
						fitViewOptions={{padding: 0.2}}
						colorMode="system"
						minZoom={0.2}
						maxZoom={2}
						// Culling keeps panning cheap on phones; the export needs every element mounted
						onlyRenderVisibleElements={touchInput && !exporting}
						deleteKeyCode={["Backspace", "Delete"]}>
						<Background variant={BackgroundVariant.Dots} gap={20} size={1} />
						<Controls showInteractive={false} />
					</ReactFlow>
				</div>

				<div className="hidden lg:block bg-black/30 p-4 border border-border rounded-xl lg:min-h-0 overflow-y-auto">{inspector}</div>
			</div>

			<Drawer open={paletteOpen} onOpenChange={setPaletteOpen} swipeDirection="down" showSwipeHandle>
				<DrawerContent className="max-h-[80dvh]">
					<DrawerHeader>
						<DrawerTitle>Add devices</DrawerTitle>
						<DrawerDescription>Tap a device to add it in the middle of the canvas.</DrawerDescription>
					</DrawerHeader>
					<div className="px-4 pt-2 pb-6 min-h-0 overflow-y-auto overscroll-contain">
						<DevicePalette onAddDevice={handleAddDevice} />
					</div>
				</DrawerContent>
			</Drawer>

			<Drawer open={propertiesOpen} onOpenChange={setPropertiesOpen} swipeDirection="down" showSwipeHandle>
				<DrawerContent className="max-h-[80dvh]">
					<DrawerHeader>
						<DrawerTitle>Properties</DrawerTitle>
						<DrawerDescription>Edit the selected node or connection.</DrawerDescription>
					</DrawerHeader>
					<div className="px-4 pt-2 pb-6 min-h-0 overflow-y-auto overscroll-contain">
						<Inspector node={selectedNode} edge={selectedEdge} idPrefix="drawer" onNodePatch={handleNodePatch} onEdgePatch={handleEdgePatch} onDeleteNode={handleDeleteNode} onDeleteEdge={handleDeleteEdge} onClose={() => setPropertiesOpen(false)} />
					</div>
				</DrawerContent>
			</Drawer>
		</div>
	);
}
