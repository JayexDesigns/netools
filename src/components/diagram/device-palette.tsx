import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {DEVICE_DRAG_MIME, categories, devices, type DeviceKind} from "@/lib/diagram";
import {cn} from "cn";
import {ChevronDownIcon} from "lucide-react";
import {useRef, useState} from "react";

type PaletteItemProps = {
	kind: DeviceKind;
	label: string;
	Icon: (typeof devices)[number]["Icon"];
	color: string;
	/**
		HTML5 drag is unreliable on touch, so it is turned off once a touch starts:
		a draggable element would swallow the tap that is supposed to add the device
	*/
	draggable: boolean;
	onDragStart: (kind: DeviceKind, event: React.DragEvent<HTMLElement>) => void;
	onDragEnd: () => void;
	onPick: (kind: DeviceKind) => void;
};

function PaletteItem({kind, label, Icon, color, draggable, onDragStart, onDragEnd, onPick}: PaletteItemProps) {
	return (
		<button type="button" draggable={draggable} aria-label={`Add ${label} to the canvas`} className="flex items-center gap-2.5 bg-background/60 hover:bg-muted px-2.5 py-2 border border-border rounded-lg w-full text-sm text-left transition-colors cursor-grab active:cursor-grabbing select-none" onDragStart={event => onDragStart(kind, event)} onDragEnd={onDragEnd} onClick={() => onPick(kind)}>
			<Icon className="size-4 shrink-0" style={{color}} aria-hidden />
			<span className="overflow-hidden text-ellipsis whitespace-nowrap">{label}</span>
		</button>
	);
}

type CategoryGroupProps = {
	category: (typeof categories)[number];
	draggable: boolean;
	dragHandlers: Pick<PaletteItemProps, "onDragStart" | "onDragEnd" | "onPick">;
};

function CategoryGroup({category, draggable, dragHandlers}: CategoryGroupProps) {
	const [open, setOpen] = useState(true);
	const categoryDevices = devices.filter(device => device.category === category.id);

	return (
		<Collapsible open={open} onOpenChange={setOpen}>
			<CollapsibleTrigger className="flex items-center gap-2 px-2 py-1.5 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/30 w-full font-medium text-muted-foreground hover:text-foreground text-sm transition-colors">
				<span className="rounded-full size-2" style={{backgroundColor: category.color}} />
				{category.label}
				<span className="ml-auto text-xs">{categoryDevices.length}</span>
				<ChevronDownIcon className={cn("size-4 transition-transform duration-300 shrink-0", open && "rotate-180")} />
			</CollapsibleTrigger>

			<CollapsibleContent className="flex flex-col gap-1.5 pt-1.5 pb-1 pl-3 data-closed:animate-out data-open:animate-in duration-200 data-open:fade-in-0 data-closed:fade-out-0">
				{categoryDevices.map(device => (
					<PaletteItem key={device.kind} kind={device.kind} label={device.label} Icon={device.Icon} color={category.color} draggable={draggable} {...dragHandlers} />
				))}
			</CollapsibleContent>
		</Collapsible>
	);
}

type DevicePaletteProps = {
	onAddDevice: (kind: DeviceKind) => void;
};

export default function DevicePalette({onAddDevice}: DevicePaletteProps) {
	// Taps that finish a drag would otherwise also fire a click, adding a second node
	const dragEndedAt = useRef(0);
	// Touch has no reliable HTML5 drag, so items stop being draggable after the first touch
	const [touchInput, setTouchInput] = useState(false);

	function handleDragStart(kind: DeviceKind, event: React.DragEvent<HTMLElement>) {
		event.dataTransfer.setData(DEVICE_DRAG_MIME, kind);
		event.dataTransfer.effectAllowed = "move";
	}

	return (
		<div
			className="flex flex-col gap-2"
			onPointerDownCapture={event => {
				if (event.pointerType === "touch") setTouchInput(true);
			}}>
			<div className="flex flex-col gap-1">
				<h3 className="font-medium text-sm">Device palette</h3>
				<p className="text-muted-foreground text-xs leading-relaxed">Drag a device onto the canvas, or tap it to add it in the middle.</p>
			</div>

			<div className="flex flex-col gap-3 mt-2">
				{categories.map(category => (
					<CategoryGroup
						key={category.id}
						category={category}
						draggable={!touchInput}
						dragHandlers={{
							onDragStart: handleDragStart,
							onDragEnd: () => {
								dragEndedAt.current = Date.now();
							},
							onPick: kind => {
								if (Date.now() - dragEndedAt.current < 400) return;
								onAddDevice(kind);
							}
						}}
					/>
				))}
			</div>
		</div>
	);
}
