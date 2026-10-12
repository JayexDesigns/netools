import AddressSection from "@/components/address-section";
import InlineCode from "@/components/inline-code";
import MaskSection from "@/components/mask-section";

export default function IPv4AddressConverter() {
	return (
		<div className="isolate relative min-h-dvh overflow-x-clip text-foreground">
			<main className="relative mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-24 max-w-5xl">
				<header className="flex flex-col gap-5">
					<h1 className="font-heading font-bold text-3xl sm:text-4xl tracking-tight">IPv4 Address Converter</h1>

					<p className="text-muted-foreground leading-relaxed">
						Convert an IPv4 address between decimal, binary, hexadecimal and octal notation, and a subnet mask between dotted decimal and CIDR, for example <InlineCode>192.168.1.10</InlineCode> ⇄ <InlineCode>C0.A8.01.0A</InlineCode> or <InlineCode>255.255.255.0</InlineCode> ⇄ <InlineCode>/24</InlineCode>.
					</p>
				</header>

				<div className="flex flex-col gap-6 mt-8">
					<AddressSection />
					<MaskSection />
				</div>
			</main>
		</div>
	);
}
