import InputField from "@/components/input-field";
import {formatMask, parseCidr, parseMask} from "@/lib/converter";
import {useState} from "react";

export default function MaskSection() {
	const [mask, setMask] = useState("");
	const [cidr, setCidr] = useState("");
	const [maskInvalid, setMaskInvalid] = useState(false);
	const [cidrInvalid, setCidrInvalid] = useState(false);

	const hasInvalid = maskInvalid || cidrInvalid;

	function handleMaskChange(raw: string) {
		if (raw.trim() === "") {
			setMask("");
			setCidr("");
			setMaskInvalid(false);
			setCidrInvalid(false);
			return;
		}

		setMask(raw);

		const prefix = parseMask(raw);

		if (prefix === null) {
			setMaskInvalid(true);
			return;
		}

		setMaskInvalid(false);
		setCidrInvalid(false);
		setCidr(`/${prefix}`);
	}

	function handleCidrChange(raw: string) {
		if (raw.trim() === "") {
			setMask("");
			setCidr("");
			setMaskInvalid(false);
			setCidrInvalid(false);
			return;
		}

		setCidr(raw);

		const prefix = parseCidr(raw);

		if (prefix === null) {
			setCidrInvalid(true);
			return;
		}

		setCidrInvalid(false);
		setMaskInvalid(false);
		setMask(formatMask(prefix));
	}

	function handleMaskBlur() {
		if (mask.trim() === "") return;

		const prefix = parseMask(mask);
		if (prefix === null) return;

		// Canonicalize the mask on blur, so padded octets like 255.000128.0.0000 become 255.128.0.0
		setMask(formatMask(prefix));
	}

	return (
		<section aria-labelledby="mask-heading" className="flex flex-col gap-4 bg-black/30 p-4 sm:p-5 border border-border rounded-xl">
			<div className="flex flex-col gap-1">
				<h2 id="mask-heading" className="font-medium text-lg">
					Subnet Mask
				</h2>
				<p className="text-muted-foreground text-sm leading-relaxed">Both fields hold the same mask in a different representation.</p>
			</div>

			<div className="gap-4 grid sm:grid-cols-2">
				<InputField id="mask-decimal" label="Mask (decimal)" placeholder="255.255.255.0" value={mask} invalid={maskInvalid} hintId="mask-hint" onValueChange={handleMaskChange} onBlur={handleMaskBlur} copy />
				<InputField id="mask-cidr" label="Mask (CIDR)" placeholder="/24" value={cidr} invalid={cidrInvalid} hintId="mask-hint" onValueChange={handleCidrChange} copy />
			</div>

			<p id="mask-hint" className={hasInvalid ? "text-destructive text-sm" : "text-muted-foreground text-sm"}>
				{hasInvalid ? "Enter a mask with contiguous bits, for example 255.255.255.0, or a CIDR prefix between /0 and /32." : "Type in either field to convert the mask to the other representation."}
			</p>
		</section>
	);
}
