import ColorSelect from "@/components/diagram/color-select";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {categories, categoryInfo, devices, nodeColor, type DeviceKind, type DiagramNode, type NodePatch} from "@/lib/diagram";

type NodeInspectorProps = {
	node: DiagramNode;
	/** Keeps the field ids unique when two inspectors are mounted at once */
	idPrefix?: string;
	onPatch: (patch: NodePatch) => void;
	onDelete: () => void;
};

export default function NodeInspector({node, idPrefix = "diagram", onPatch, onDelete}: NodeInspectorProps) {
	const category = categoryInfo(node.data.category);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<p className="text-muted-foreground text-xs">Node properties</p>
				<h3 className="font-medium text-lg">{node.data.name.trim() === "" ? "Untitled node" : node.data.name}</h3>
			</div>

			<div className="flex items-center gap-2 bg-black/20 px-2.5 py-2 border border-border rounded-lg text-xs">
				<span className="rounded-full size-2" style={{backgroundColor: nodeColor(node.data)}} />
				<span className="text-muted-foreground">{category.label} category</span>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor={`${idPrefix}-node-name`}>Name</Label>
				<Input id={`${idPrefix}-node-name`} value={node.data.name} placeholder="e.g. Core Router" onChange={event => onPatch({name: event.target.value})} />
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor={`${idPrefix}-node-description`}>Description</Label>
				<Textarea id={`${idPrefix}-node-description`} value={node.data.description} placeholder="e.g. Main gateway, 192.168.1.1" onChange={event => onPatch({description: event.target.value})} className="min-h-16" />
			</div>

			<div className="flex flex-col gap-2">
				<Label>Device type</Label>
				<Select value={node.data.kind} onValueChange={value => onPatch({kind: value as DeviceKind})}>
					<SelectTrigger className="w-full" aria-label="Device type">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{categories.map(categoryGroup => (
							<SelectGroup key={categoryGroup.id}>
								<SelectLabel>{categoryGroup.label}</SelectLabel>
								{devices
									.filter(device => device.category === categoryGroup.id)
									.map(device => (
										<SelectItem key={device.kind} value={device.kind}>
											{device.label}
										</SelectItem>
									))}
							</SelectGroup>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor={`${idPrefix}-node-color`}>Color</Label>
				<ColorSelect id={`${idPrefix}-node-color`} value={node.data.color ?? null} automaticColor={category.color} automaticLabel={`Category default`} onValueChange={value => onPatch({color: value ?? undefined})} />
			</div>

			<Button type="button" variant="destructive" onClick={onDelete}>
				Delete node
			</Button>
		</div>
	);
}
