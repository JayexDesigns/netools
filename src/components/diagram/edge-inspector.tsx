import ColorSelect from "@/components/diagram/color-select";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Switch} from "@/components/ui/switch";
import {edgeColor, edgeLineType, edgeStyleOptions, edgeText, type DiagramEdge, type EdgePatch, type EdgeStyle} from "@/lib/diagram";

type EdgeInspectorProps = {
	edge: DiagramEdge;
	/** Keeps the field ids unique when two inspectors are mounted at once */
	idPrefix?: string;
	onPatch: (patch: EdgePatch) => void;
	onDelete: () => void;
};

export default function EdgeInspector({edge, idPrefix = "diagram", onPatch, onDelete}: EdgeInspectorProps) {
	const label = edgeText(edge);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<p className="text-muted-foreground text-xs">Connection properties</p>
				<h3 className="font-medium text-lg">{label.trim() === "" ? "Untitled connection" : label}</h3>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor={`${idPrefix}-edge-name`}>Name</Label>
				<Input id={`${idPrefix}-edge-name`} value={label} placeholder="e.g. WAN, Gi0/1" onChange={event => onPatch({label: event.target.value})} />
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor={`${idPrefix}-edge-color`}>Line color</Label>
				<ColorSelect id={`${idPrefix}-edge-color`} value={edgeColor(edge)} showAutomatic={false} automaticColor={edgeColor(edge)} automaticLabel="Line color" onValueChange={value => onPatch({color: value ?? edgeColor(edge)})} />
			</div>

			<div className="flex flex-col gap-2">
				<Label>Line style</Label>
				<Select value={edgeLineType(edge)} onValueChange={value => onPatch({type: value as EdgeStyle})}>
					<SelectTrigger className="w-full" aria-label="Line style">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{edgeStyleOptions.map(option => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex justify-between items-center gap-3 py-3 border-border border-y">
				<div className="flex flex-col gap-1">
					<Label htmlFor={`${idPrefix}-edge-animated`}>Animated line</Label>
					<p className="text-muted-foreground text-xs">Show movement along this connection</p>
				</div>
				<Switch id={`${idPrefix}-edge-animated`} checked={edge.animated === true} onCheckedChange={checked => onPatch({animated: checked})} />
			</div>

			<Button type="button" variant="destructive" onClick={onDelete}>
				Delete connection
			</Button>
		</div>
	);
}
