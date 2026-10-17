import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger} from "@/components/ui/select";
import {paletteColors} from "@/lib/diagram";
import {cn} from "cn";

const AUTOMATIC_VALUE = "automatic";

type ColorSelectProps = {
	id?: string;
	/** null selects the automatic option, which follows the given color */
	value: string | null;
	/** Color shown while the automatic option is selected */
	automaticColor: string;
	/** Label of the automatic option, shown in the trigger and the list */
	automaticLabel: string;
	/** Hide the automatic option, for editors where a fixed color is required */
	showAutomatic?: boolean;
	onValueChange: (value: string | null) => void;
	className?: string;
};

function Swatch({color}: {color: string}) {
	return <span aria-hidden className="border border-border rounded-full size-3.5 shrink-0" style={{backgroundColor: color}} />;
}

export default function ColorSelect({id, value, automaticColor, automaticLabel, showAutomatic = true, onValueChange, className}: ColorSelectProps) {
	const currentName = paletteColors.find(color => color.value === value)?.name ?? value ?? "";

	return (
		<Select value={value ?? AUTOMATIC_VALUE} onValueChange={next => onValueChange(next === AUTOMATIC_VALUE ? null : next)}>
			<SelectTrigger id={id} className={cn("w-full", className)}>
				<span className="flex items-center gap-2">
					<Swatch color={value ?? automaticColor} />
					{value === null ? automaticLabel : currentName}
				</span>
			</SelectTrigger>

			<SelectContent>
				<SelectGroup>
					{showAutomatic && (
						<SelectItem value={AUTOMATIC_VALUE}>
							<span className="flex items-center gap-2">
								<Swatch color={automaticColor} />
								{automaticLabel}
							</span>
						</SelectItem>
					)}
					{paletteColors.map(color => (
						<SelectItem key={color.value} value={color.value}>
							<span className="flex items-center gap-2">
								<Swatch color={color.value} />
								{color.name}
							</span>
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
