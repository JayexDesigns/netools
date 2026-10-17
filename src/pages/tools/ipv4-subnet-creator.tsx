import InputField from "@/components/input-field";
import InlineCode from "@/components/inline-code";
import SubnetTable from "@/components/subnet-table";
import {createSubnet} from "@/lib/subnet";
import {useState} from "react";

export default function IPv4SubnetCreator() {
	const [base, setBase] = useState("");
	const [hosts, setHosts] = useState("");

	// Both inputs are needed before anything can be built, and only one of them can be wrong at a time
	const created = base.trim() === "" || hosts.trim() === "" ? null : createSubnet(base, hosts);
	const baseInvalid = created !== null && "error" in created && created.error === "base";
	const hostsInvalid = created !== null && "error" in created && created.error === "hosts";
	const subnet = created !== null && !("error" in created) ? created : null;

	return (
		<div className="isolate relative min-h-dvh overflow-x-clip text-foreground">
			<main className="relative mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-24 max-w-5xl">
				<header className="flex flex-col gap-5">
					<h1 className="font-heading font-bold text-3xl sm:text-4xl tracking-tight">IPv4 Subnet Creator</h1>

					<p className="text-muted-foreground leading-relaxed">
						Tell the tool where you want to start and how many hosts you need: it picks the smallest subnet that fits them and places your address inside it, as its network address when the address is already aligned or as the closest network that still contains it otherwise. Example: <InlineCode>192.168.1.10</InlineCode> with <InlineCode>30</InlineCode> hosts becomes <InlineCode>192.168.1.0/27</InlineCode>.
					</p>
				</header>

				<section className="gap-4 grid grid-cols-1 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] mt-8">
					<div className="flex flex-col gap-3">
						<InputField id="ipv4-base" label="Base IP" placeholder="192.168.1.10" value={base} invalid={baseInvalid} hintId="ipv4-base-hint" onValueChange={setBase} />
						<p id="ipv4-base-hint" className={baseInvalid ? "text-destructive text-sm" : "text-muted-foreground text-sm"}>{baseInvalid ? "Enter a plain IPv4 address without a mask, for example 192.168.1.10." : "Where the subnet should start, it becomes the network address or the closest one that still contains it."}</p>
					</div>

					<div className="flex flex-col gap-3">
						<InputField id="ipv4-hosts" label="Hosts" placeholder="30" value={hosts} invalid={hostsInvalid} hintId="ipv4-hosts-hint" onValueChange={setHosts} />
						<p id="ipv4-hosts-hint" className={hostsInvalid ? "text-destructive text-sm" : "text-muted-foreground text-sm"}>{hostsInvalid ? "Enter a whole number of hosts between 1 and 4,294,967,294." : "How many addresses must fit, a /31 and a /32 count as 2 and 1 hosts."}</p>
					</div>
				</section>

				{subnet && (
					<section className="flex flex-col gap-4 mt-8">
						{subnet.adjusted && <p className="text-muted-foreground text-sm leading-relaxed">{base.trim()} is not the first address of a /{subnet.prefix}, so the closest network that still contains it is {subnet.network}/{subnet.prefix}.</p>}
						<SubnetTable rows={subnet.rows} />
					</section>
				)}
			</main>
		</div>
	);
}
