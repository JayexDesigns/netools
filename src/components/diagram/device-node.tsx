import {deviceDefinition, nodeColor, type DiagramNode} from "@/lib/diagram";
import {Handle, Position, type NodeProps} from "@xyflow/react";
import type {CSSProperties} from "react";

// The base stylesheet sets a fixed 6px handle, so the size has to win with `important`
const handleClass = "size-2.5!";

function DiagramHandle({position, type, id, color}: {position: Position; type: "source" | "target"; id?: string; color: string}) {
	return <Handle id={id} type={type} position={position} className={handleClass} style={{"backgroundColor": color, "--xy-handle-border-color": "var(--background)"} as CSSProperties} />;
}

export default function DeviceNode({data, selected}: NodeProps<DiagramNode>) {
	const definition = deviceDefinition(data.kind);
	const Icon = definition.Icon;
	const color = nodeColor(data);

	return (
		<div className={`w-40 rounded-xl border border-border border-t-2 bg-card text-card-foreground shadow-sm ${selected ? "ring-2 ring-ring/50" : ""}`}>
			<DiagramHandle position={Position.Top} type="target" color={color} />
			<DiagramHandle position={Position.Left} id="left" type="target" color={color} />

			<div className="flex flex-col items-center gap-1 px-3 pt-3 pb-2 text-center">
				<Icon className="size-6" style={{color}} aria-hidden />
				<p className="w-full overflow-hidden font-medium text-sm text-ellipsis whitespace-nowrap">{data.name}</p>
				{data.description.trim() !== "" && <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug wrap-anywhere">{data.description}</p>}
			</div>

			<DiagramHandle position={Position.Bottom} type="source" color={color} />
			<DiagramHandle position={Position.Right} id="right" type="source" color={color} />
		</div>
	);
}
