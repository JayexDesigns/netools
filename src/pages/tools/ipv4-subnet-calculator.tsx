import InlineCode from "@/components/inline-code";
import InputField from "@/components/input-field";
import SubnetTable from "@/components/subnet-table";
import {calculateSubnet} from "@/lib/subnet";
import {useState} from "react";

export default function IPv4SubnetCalculator() {
	const [address, setAddress] = useState("");

	const rows = calculateSubnet(address);
	const isInvalid = address.trim().length > 0 && rows === null;

	return (
		<div className="isolate relative min-h-dvh overflow-x-clip text-foreground">
			<main className="relative mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-24 max-w-5xl">
				<header className="flex flex-col gap-5">
					<h1 className="font-heading font-bold text-3xl sm:text-4xl tracking-tight">IPv4 Subnet Calculator</h1>

					<p className="text-muted-foreground leading-relaxed">
						Enter an IPv4 address with an optional CIDR mask to calculate its network details, for example <InlineCode>192.168.1.10/24</InlineCode>.
					</p>
				</header>

				<section className="flex flex-col gap-8 mt-8">
					<div className="flex flex-col gap-3">
						<InputField id="ipv4-address" label="Address" placeholder="192.168.1.10/24" value={address} invalid={isInvalid} hintId="ipv4-address-hint" onValueChange={setAddress} />
						<p id="ipv4-address-hint" className={isInvalid ? "text-destructive text-sm" : "text-muted-foreground text-sm"}>
							{isInvalid ? "Enter a valid IPv4 address with an optional CIDR mask, for example 192.168.1.10/24" : "The CIDR mask is optional and defaults to /32."}
						</p>
					</div>

					{rows && <SubnetTable rows={rows} />}
				</section>
			</main>
		</div>
	);
}
