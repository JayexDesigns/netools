import {Button} from "@/components/ui/button";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {toast} from "@/components/ui/toast";
import bash from "@shikijs/langs/bash";
import monokai from "@shikijs/themes/monokai";
import {CheckIcon, CopyIcon} from "lucide-react";
import {useEffect, useMemo, useState} from "react";
import {createHighlighterCoreSync} from "shiki/core";
import {createJavaScriptRegexEngine} from "shiki/engine/javascript";

type CodeBlockProps = {
	code: string;
	lang?: string;
};

const highlighter = createHighlighterCoreSync({
	langs: [bash],
	themes: [monokai],
	engine: createJavaScriptRegexEngine({forgiving: true})
});

export default function CodeBlock({code, lang = "bash"}: CodeBlockProps) {
	const [copied, setCopied] = useState(false);

	const highlighted = useMemo(() => {
		try {
			return highlighter.codeToHtml(code, {lang, theme: monokai, rootStyle: false});
		} catch {
			// Unknown language or unsupported pattern: show the plain code instead.
			return null;
		}
	}, [code, lang]);

	useEffect(() => {
		if (!copied) return;

		const timeout = window.setTimeout(() => setCopied(false), 2000);

		return () => window.clearTimeout(timeout);
	}, [copied]);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
		} catch {
			toast.add({
				type: "error",
				description: "Could not copy code block's content"
			});
		}
	};

	return (
		<div className="bg-muted/40 dark:bg-black/30 border border-border rounded-xl overflow-hidden">
			<div className="flex justify-between items-center px-3 py-1.5 border-border border-b">
				<span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">{lang}</span>
				<Button variant="ghost" size="icon-xs" onClick={handleCopy} aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"} className="dark:hover:bg-muted/40 text-muted-foreground hover:text-foreground">
					{copied ? <CheckIcon className="text-primary" /> : <CopyIcon />}
				</Button>
			</div>

			<ScrollArea>
				<div className="p-4 text-sm w-max min-w-full">{highlighted ? <div dangerouslySetInnerHTML={{__html: highlighted}} /> : <pre className="whitespace-pre">{code}</pre>}</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	);
}
