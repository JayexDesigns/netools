import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

type ConverterFieldProps = {
	id: string;
	label: string;
	placeholder: string;
	value: string;
	invalid: boolean;
	onValueChange: (value: string) => void;
	hintId?: string;
	type?: "text" | "password" | "url";
};

export default function ConverterField({id, label, placeholder, value, invalid, onValueChange, hintId, type = "text"}: ConverterFieldProps) {
	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor={id} className="text-muted-foreground">
				{label}
			</Label>
			<Input id={id} type={type} autoComplete="off" spellCheck={false} placeholder={placeholder} value={value} aria-invalid={invalid} aria-describedby={hintId} onChange={event => onValueChange(event.target.value)} className="focus-visible:border-transparent ring-1 ring-white/10 focus-visible:ring-primary-400/50 font-mono" />
		</div>
	);
}
