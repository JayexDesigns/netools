import CopyButton from "@/components/copy-button";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import bash from "@shikijs/langs/bash";
import monokai from "@shikijs/themes/monokai";
import {useMemo} from "react";
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
	const highlighted = useMemo(() => {
		try {
			return highlighter.codeToHtml(code, {lang, theme: monokai, rootStyle: false});
		} catch {
			// Unknown language or unsupported pattern: show the plain code instead
			return null;
		}
	}, [code, lang]);

	return (
		<div className="bg-muted/40 dark:bg-black/30 border border-border rounded-xl overflow-hidden">
			<div className="flex justify-between items-center px-3 py-1.5 border-border border-b">
				<span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">{lang}</span>
				<CopyButton value={code} label="code block's content" />
			</div>

			<ScrollArea>
				<div className="p-4 w-max min-w-full text-sm">{highlighted ? <div dangerouslySetInnerHTML={{__html: highlighted}} /> : <pre className="whitespace-pre">{code}</pre>}</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	);
}
