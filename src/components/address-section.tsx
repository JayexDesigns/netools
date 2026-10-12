import ConverterField from "@/components/converter-field";
import {formatAddress, parseAddress, type AddressBase} from "@/lib/converter";
import {useState} from "react";

const FIELDS: {base: AddressBase; id: string; label: string; placeholder: string}[] = [
	{base: "decimal", id: "address-decimal", label: "Decimal", placeholder: "192.168.1.10"},
	{base: "binary", id: "address-binary", label: "Binary", placeholder: "11000000.10101000.00000001.00001010"},
	{base: "hex", id: "address-hex", label: "Hexadecimal", placeholder: "C0.A8.01.0A"},
	{base: "octal", id: "address-octal", label: "Octal", placeholder: "300.250.1.12"}
];

const EMPTY_VALUES: Record<AddressBase, string> = {decimal: "", binary: "", hex: "", octal: ""};
const NO_INVALID: Record<AddressBase, boolean> = {decimal: false, binary: false, hex: false, octal: false};

export default function AddressSection() {
	const [values, setValues] = useState(EMPTY_VALUES);
	const [invalid, setInvalid] = useState(NO_INVALID);

	const hasInvalid = FIELDS.some(field => invalid[field.base]);

	function handleChange(base: AddressBase, raw: string) {
		if (raw.trim() === "") {
			setValues(EMPTY_VALUES);
			setInvalid(NO_INVALID);
			return;
		}

		const parsed = parseAddress(raw, base);

		if (parsed === null) {
			// Keep the other fields as they are until the address parses again
			setValues(previous => ({...previous, [base]: raw}));
			setInvalid(previous => ({...previous, [base]: true}));
			return;
		}

		// A valid address rewrites every field, keeping the edited one as typed until it loses focus
		const next = {...EMPTY_VALUES};
		for (const field of FIELDS) next[field.base] = field.base === base ? raw : formatAddress(parsed, field.base);

		setValues(next);
		setInvalid(NO_INVALID);
	}

	function handleBlur(base: AddressBase) {
		const raw = values[base];
		if (raw.trim() === "") return;

		const parsed = parseAddress(raw, base);
		if (parsed === null) return;

		// Canonicalize the edited field, the other three already hold canonical values
		const canonical = formatAddress(parsed, base);
		if (canonical !== raw) setValues(previous => ({...previous, [base]: canonical}));
	}

	return (
		<section aria-labelledby="address-heading" className="flex flex-col gap-4 bg-muted/40 dark:bg-black/30 p-4 sm:p-5 border border-border rounded-xl">
			<div className="flex flex-col gap-1">
				<h2 id="address-heading" className="font-medium text-lg">
					Address
				</h2>
				<p className="text-muted-foreground text-sm leading-relaxed">Every field holds the same address in a different notation.</p>
			</div>

			<div className="flex flex-col gap-4">
				{FIELDS.map(field => (
					<ConverterField key={field.base} id={field.id} label={field.label} placeholder={field.placeholder} value={values[field.base]} invalid={invalid[field.base]} hintId="address-hint" onValueChange={value => handleChange(field.base, value)} onBlur={() => handleBlur(field.base)} copy />
				))}
			</div>

			<p id="address-hint" className={hasInvalid ? "text-destructive text-sm" : "text-muted-foreground text-sm"}>
				{hasInvalid ? "Enter a dotted IPv4 address that is valid in the notation you are editing, for example 192.168.1.10." : "Type in any field to convert the address to the other notations."}
			</p>
		</section>
	);
}
