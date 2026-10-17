import EdgeInspector from "@/components/diagram/edge-inspector";
import NodeInspector from "@/components/diagram/node-inspector";
import {Button} from "@/components/ui/button";
import type {DiagramEdge, DiagramNode, EdgePatch, NodePatch} from "@/lib/diagram";
import {NetworkIcon, XIcon} from "lucide-react";

type InspectorProps = {
	node?: DiagramNode;
	edge?: DiagramEdge;
	/** Keeps the field ids unique when the desktop panel and the drawer are both mounted */
	idPrefix?: string;
	onNodePatch: (patch: NodePatch) => void;
	onEdgePatch: (patch: EdgePatch) => void;
	onDeleteNode: () => void;
	onDeleteEdge: () => void;
	/** Rendered as a close button, used by the mobile drawer */
	onClose?: () => void;
};

function EmptyInspector() {
	return (
		<div className="flex flex-col items-center gap-2 py-16 text-center">
			<NetworkIcon className="size-8 text-muted-foreground" aria-hidden />
			<h3 className="font-medium text-lg">Properties</h3>
			<p className="text-muted-foreground text-sm leading-relaxed">Select a node or a connection on the canvas to edit its properties.</p>
		</div>
	);
}

export default function Inspector({node, edge, idPrefix = "diagram", onNodePatch, onEdgePatch, onDeleteNode, onDeleteEdge, onClose}: InspectorProps) {
	return (
		<div className="flex flex-col gap-4">
			{onClose && (
				<div className="flex justify-end -mt-1 -mb-1">
					<Button type="button" variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close properties">
						<XIcon />
					</Button>
				</div>
			)}

			{node ? <NodeInspector node={node} idPrefix={idPrefix} onPatch={onNodePatch} onDelete={onDeleteNode} /> : edge ? <EdgeInspector edge={edge} idPrefix={idPrefix} onPatch={onEdgePatch} onDelete={onDeleteEdge} /> : <EmptyInspector />}
		</div>
	);
}
