import CopyButton from "@/components/copy-button";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {Label} from "@/components/ui/label";
import type {FocusEvent} from "react";

type InputFieldProps = {
	id: string;
	label: string;
	placeholder: string;
	value: string;
	invalid: boolean;
	onValueChange: (value: string) => void;
	hintId?: string;
	type?: "text" | "password" | "url";
	// Shows a copy button inside the input, empty fields have nothing to copy so their button is disabled
	copy?: boolean;
	// Called when the field loses focus, used to rewrite the value in its canonical form once the user is done typing
	onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
};

export default function InputField({id, label, placeholder, value, invalid, onValueChange, hintId, type = "text", copy = false, onBlur}: InputFieldProps) {
	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor={id} className="text-muted-foreground">
				{label}
			</Label>
			<InputGroup className="has-[[data-slot=input-group-control]:focus-visible]:border-transparent ring-1 ring-white/10 has-[[data-slot=input-group-control]:focus-visible]:ring-primary-400/50">
				<InputGroupInput id={id} type={type} autoComplete="off" spellCheck={false} placeholder={placeholder} value={value} aria-invalid={invalid} aria-describedby={hintId} onChange={event => onValueChange(event.target.value)} onBlur={onBlur} className="font-mono" />
				{copy && (
					<InputGroupAddon align="inline-end">
						<CopyButton value={value} label={label} disabled={value.trim() === ""} className="bg-transparent dark:hover:bg-muted text-foreground" />
					</InputGroupAddon>
				)}
			</InputGroup>
		</div>
	);
}
