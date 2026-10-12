import CodeBlock from "@/components/code-block";
import CurlSection from "@/components/curl/curl-section";

type OutputSectionProps = {
	command: string;
	isReady: boolean;
};

export default function OutputSection({command, isReady}: OutputSectionProps) {
	return (
		<CurlSection id="output" title="cURL command" description="The command updates as you fill in the sections above.">
			{isReady ? <CodeBlock code={command} /> : <p className="text-muted-foreground text-sm">Enter a URL to generate the command.</p>}
		</CurlSection>
	);
}
