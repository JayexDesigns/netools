import CardSection from "@/components/card-section";
import InputField from "@/components/input-field";
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
		<CardSection id={id} title={title} description={description}>
			<div className="gap-4 grid sm:grid-cols-2">
				<InputField id={`${id}-decoded`} label="Decoded" placeholder={decodedPlaceholder} value={decoded} invalid={false} hintId={`${id}-hint`} onValueChange={handleDecodedChange} copy />
				<InputField id={`${id}-encoded`} label="Encoded" placeholder={encodedPlaceholder} value={encoded} invalid={encodedInvalid} hintId={`${id}-hint`} onValueChange={handleEncodedChange} copy />
			</div>

			<p id={`${id}-hint`} className={encodedInvalid ? "text-destructive text-sm" : "text-muted-foreground text-sm"}>
				{encodedInvalid ? invalidHint : "Type in either field to convert the value to the other representation."}
			</p>
		</CardSection>
	);
}
