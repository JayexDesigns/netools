import InlineCode from "@/components/inline-code";
import UriSection from "@/components/uri-section";
import {decodeUri, decodeUriComponent, encodeUri, encodeUriComponent} from "@/lib/converter";

export default function URLEncoderDecoder() {
	return (
		<div className="isolate relative min-h-dvh overflow-x-clip text-foreground">
			<main className="relative mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-24 max-w-5xl">
				<header className="flex flex-col gap-5">
					<h1 className="font-heading font-bold text-3xl sm:text-4xl tracking-tight">URL Encoder/Decoder</h1>

					<p className="text-muted-foreground leading-relaxed">
						Encode or decode a URI by typing in either field of a section, the other one follows. The Entire URI section keeps separators like <InlineCode>/</InlineCode> and <InlineCode>?</InlineCode> as they are, while the URI Component section escapes everything outside the unreserved set. Example: <InlineCode className="whitespace-nowrap">example.com/hello world</InlineCode> ⇄ <InlineCode className="whitespace-nowrap">example.com/hello%20world</InlineCode> for the entire URI or ⇄ <InlineCode className="whitespace-nowrap">example.com%2Fhello%20world</InlineCode> for a component.
					</p>
				</header>

				<div className="flex flex-col gap-6 mt-8">
					<UriSection id="uri" title="Entire URI" description="Both fields hold the same URI, the encoded one only escapes the characters that are not allowed in a URI, so separators like /, ? and & are kept." invalidHint="Enter a percent-encoded URI where every % escape is followed by two hexadecimal digits, for example %20." decodedPlaceholder="example.com/hello world" encodedPlaceholder="example.com/hello%20world" encode={encodeUri} decode={decodeUri} />
					<UriSection id="uri-component" title="URI Component" description="Both fields hold the same value, the encoded one escapes every character outside the unreserved set, so the result is safe to embed inside another URI, for example as a query parameter value." invalidHint="Enter a percent-encoded component where every % escape is followed by two hexadecimal digits, for example %20." decodedPlaceholder="example.com/hello world" encodedPlaceholder="example.com%2Fhello%20world" encode={encodeUriComponent} decode={decodeUriComponent} />
				</div>
			</main>
		</div>
	);
}
