import CardSection from "@/components/card-section";
import CodeBlock from "@/components/code-block";

type OutputSectionProps = {
	command: string;
	isReady: boolean;
};

export default function OutputSection({command, isReady}: OutputSectionProps) {
	return (
		<CardSection id="output" title="cURL command" description="The command updates as you fill in the sections above.">
			{isReady ? <CodeBlock code={command} /> : <p className="text-muted-foreground text-sm">Enter a URL to generate the command.</p>}
		</CardSection>
	);
}
