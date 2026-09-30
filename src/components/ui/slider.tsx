import {Slider as SliderPrimitive} from "@base-ui/react/slider";
import {cn} from "cn";

function Slider({className, defaultValue, value, min = 0, max = 100, ...props}: SliderPrimitive.Root.Props) {
	const _values = Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max];

	return (
		<SliderPrimitive.Root className={cn("data-horizontal:w-full data-vertical:h-full", className)} data-slot="slider" defaultValue={defaultValue} value={value} min={min} max={max} thumbAlignment="edge" {...props}>
			<SliderPrimitive.Control className="relative flex data-vertical:flex-col items-center data-disabled:opacity-50 w-full data-vertical:w-auto data-vertical:h-full data-vertical:min-h-40 touch-none select-none">
				<SliderPrimitive.Track data-slot="slider-track" className="relative bg-input/90 rounded-2xl data-horizontal:w-full data-vertical:w-1 data-horizontal:h-1 data-vertical:h-full overflow-hidden select-none grow">
					<SliderPrimitive.Indicator data-slot="slider-range" className="bg-primary data-vertical:w-full data-horizontal:h-full select-none" />
				</SliderPrimitive.Track>
				{Array.from({length: _values.length}, (_, index) => (
					<SliderPrimitive.Thumb data-slot="slider-thumb" key={index} className="block bg-white not-dark:bg-clip-padding disabled:opacity-50 shadow-md rounded-2xl focus-visible:outline-hidden ring-1 ring-black/10 hover:ring-4 hover:ring-ring/30 focus-visible:ring-4 focus-visible:ring-ring/30 size-4 transition-[color,box-shadow] duration-200 disabled:pointer-events-none select-none shrink-0" />
				))}
			</SliderPrimitive.Control>
		</SliderPrimitive.Root>
	);
}

export {Slider};
