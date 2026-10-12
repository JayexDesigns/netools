import CodeBlock from "@/components/code-block";
import InlineCode from "@/components/inline-code";
import {ExternalLinkIcon} from "lucide-react";

function formatDescription(description: string) {
	return description.split("`").map((segment, index) => (index % 2 === 1 ? <InlineCode key={index}>{segment}</InlineCode> : segment));
}

type tldrProps = {
	command: string;
	characteristics: string[];
	manualURL?: string;
	examples: {
		description: string;
		command: string;
	}[];
};

export default function TLDR({command, characteristics, manualURL, examples}: tldrProps) {
	return (
		<div className="isolate relative min-h-dvh overflow-x-clip text-foreground">
			<main className="relative mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-24 max-w-6xl">
				<header className="flex flex-col gap-5">
					<div className="flex items-center gap-2.5">
						<h1 className="font-heading font-bold text-3xl sm:text-4xl tracking-tight">TLDR {command}</h1>
					</div>

					<p>
						A simplified manual with usage examples for the <InlineCode className="whitespace-nowrap">{command}</InlineCode> command.
					</p>

					<ul className="flex flex-col gap-1.5 pl-5 text-muted-foreground marker:text-primary-500 text-sm leading-relaxed list-disc">
						{characteristics.map((characteristic, index) => (
							<li key={index}>{characteristic}</li>
						))}
						{manualURL && (
							<li>
								More information:{" "}
								<a href={manualURL} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 font-medium text-primary hover:underline underline-offset-4 break-all">
									{manualURL}
									<ExternalLinkIcon aria-hidden="true" className="size-3.5 shrink-0" />
								</a>
							</li>
						)}
					</ul>
				</header>

				<section className="flex flex-col gap-5 mt-12">
					<div className="flex items-center gap-4">
						<h2 className="font-heading font-semibold text-lg">Examples</h2>
						<span aria-hidden="true" className="flex-1 bg-border h-px" />
					</div>

					<ol className="flex flex-col gap-6">
						{examples.map((example, index) => (
							<li key={example.command} className="flex flex-col gap-3">
								<div className="flex items-start gap-3">
									<span aria-hidden="true" className="flex justify-center items-center bg-primary-500/15 rounded-full ring-1 ring-primary-400/30 size-6 font-semibold text-primary-300 text-xs shrink-0">
										{index + 1}
									</span>
									<p className="text-foreground/80 text-sm leading-relaxed">{formatDescription(example.description)}</p>
								</div>
								<CodeBlock code={example.command} />
							</li>
						))}
					</ol>
				</section>
			</main>
		</div>
	);
}
