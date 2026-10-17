import InputField from "@/components/input-field";
import {formatAddress, formatIntegerAddress, parseAddress, parseIntegerAddress, type AddressBase} from "@/lib/converter";
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
	// The integer field holds the address as one number instead of four octets, so it keeps its own state
	const [integer, setInteger] = useState("");
	const [integerInvalid, setIntegerInvalid] = useState(false);

	const hasInvalid = integerInvalid || FIELDS.some(field => invalid[field.base]);

	function clearAll() {
		setValues(EMPTY_VALUES);
		setInvalid(NO_INVALID);
		setInteger("");
		setIntegerInvalid(false);
	}

	// Rewrites the four octet fields from a parsed address, the edited field is kept as typed until it loses focus
	function applyAddress(parsed: number, typed?: {base: AddressBase; raw: string}) {
		const next = {...EMPTY_VALUES};
		for (const field of FIELDS) next[field.base] = typed && field.base === typed.base ? typed.raw : formatAddress(parsed, field.base);

		setValues(next);
		setInteger(formatIntegerAddress(parsed));
		setInvalid(NO_INVALID);
		setIntegerInvalid(false);
	}

	function handleChange(base: AddressBase, raw: string) {
		if (raw.trim() === "") {
			clearAll();
			return;
		}

		const parsed = parseAddress(raw, base);

		if (parsed === null) {
			// Keep the other fields as they are until the address parses again
			setValues(previous => ({...previous, [base]: raw}));
			setInvalid(previous => ({...previous, [base]: true}));
			return;
		}

		applyAddress(parsed, {base, raw});
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

	function handleIntegerChange(raw: string) {
		if (raw.trim() === "") {
			clearAll();
			return;
		}

		setInteger(raw);

		const parsed = parseIntegerAddress(raw);

		if (parsed === null) {
			// Keep the octet fields as they are until the integer parses again
			setIntegerInvalid(true);
			return;
		}

		// The integer is the edited field, so every octet field is rewritten in canonical form
		applyAddress(parsed);
	}

	function handleIntegerBlur() {
		if (integer.trim() === "") return;

		const parsed = parseIntegerAddress(integer);
		if (parsed === null) return;

		// Canonicalize the integer on blur, so padded numbers like 03232235786 become 3232235786
		setInteger(formatIntegerAddress(parsed));
	}

	return (
		<section aria-labelledby="address-heading" className="flex flex-col gap-4 bg-black/30 p-4 sm:p-5 border border-border rounded-xl">
			<div className="flex flex-col gap-1">
				<h2 id="address-heading" className="font-medium text-lg">
					Address
				</h2>
				<p className="text-muted-foreground text-sm leading-relaxed">Every field holds the same address in a different representation, the four octets or the single number they stand for.</p>
			</div>

			<div className="flex flex-col gap-4">
				{FIELDS.map(field => (
					<InputField key={field.base} id={field.id} label={field.label} placeholder={field.placeholder} value={values[field.base]} invalid={invalid[field.base]} hintId="address-hint" onValueChange={value => handleChange(field.base, value)} onBlur={() => handleBlur(field.base)} copy />
				))}

				<InputField id="address-integer" label="Integer" placeholder="3232235786" value={integer} invalid={integerInvalid} hintId="address-hint" onValueChange={handleIntegerChange} onBlur={handleIntegerBlur} copy />
			</div>

			<p id="address-hint" className={hasInvalid ? "text-destructive text-sm" : "text-muted-foreground text-sm"}>
				{hasInvalid ? "Enter the address in the form you are editing, for example 192.168.1.10 or 3232235786." : "Type in any field to convert the address to the other representations."}
			</p>
		</section>
	);
}
