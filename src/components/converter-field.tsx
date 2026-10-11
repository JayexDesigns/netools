import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

type ConverterFieldProps = {
	id: string;
	label: string;
	placeholder: string;
	value: string;
	invalid: boolean;
	onValueChange: (value: string) => void;
	// Id of the hint describing the expected format.
	hintId?: string;
};

export default function ConverterField({id, label, placeholder, value, invalid, onValueChange, hintId}: ConverterFieldProps) {
	return (
		<div className="flex flex-col gap-1.5">
			<Label htmlFor={id} className="text-muted-foreground">{label}</Label>
			<Input id={id} type="text" autoComplete="off" spellCheck={false} placeholder={placeholder} value={value} aria-invalid={invalid} aria-describedby={hintId} onChange={event => onValueChange(event.target.value)} className="font-mono" />
		</div>
	);
}
