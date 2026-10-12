import ConverterField from "@/components/converter-field";
import {useState} from "react";

type UriSectionProps = {
	id: string;
	title: string;
	description: string;
	invalidHint: string;
	decodedPlaceholder: string;
	encodedPlaceholder: string;
	encode: (value: string) => string;
	decode: (value: string) => string | null;
};

export default function UriSection({id, title, description, invalidHint, decodedPlaceholder, encodedPlaceholder, encode, decode}: UriSectionProps) {
	const [decoded, setDecoded] = useState("");
	const [encoded, setEncoded] = useState("");
	const [encodedInvalid, setEncodedInvalid] = useState(false);

	function handleDecodedChange(raw: string) {
		setDecoded(raw);
		setEncoded(encode(raw));
		setEncodedInvalid(false);
	}

	function handleEncodedChange(raw: string) {
		setEncoded(raw);

		const plain = decode(raw);

		if (plain === null) {
			setEncodedInvalid(true);
			return;
		}

		setDecoded(plain);
		setEncodedInvalid(false);
	}

	return (
		<section aria-labelledby={`${id}-heading`} className="flex flex-col gap-4 bg-muted/40 dark:bg-black/30 p-4 sm:p-5 border border-border rounded-xl">
			<div className="flex flex-col gap-1">
				<h2 id={`${id}-heading`} className="font-medium text-lg">
					{title}
				</h2>
				<p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
			</div>

			<div className="gap-4 grid sm:grid-cols-2">
				<ConverterField id={`${id}-decoded`} label="Decoded" placeholder={decodedPlaceholder} value={decoded} invalid={false} hintId={`${id}-hint`} onValueChange={handleDecodedChange} copy />
				<ConverterField id={`${id}-encoded`} label="Encoded" placeholder={encodedPlaceholder} value={encoded} invalid={encodedInvalid} hintId={`${id}-hint`} onValueChange={handleEncodedChange} copy />
			</div>

			<p id={`${id}-hint`} className={encodedInvalid ? "text-destructive text-sm" : "text-muted-foreground text-sm"}>
				{encodedInvalid ? invalidHint : "Type in either field to convert the value to the other representation."}
			</p>
		</section>
	);
}
