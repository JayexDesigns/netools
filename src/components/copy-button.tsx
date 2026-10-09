import {Button} from "@/components/ui/button";
import {toast} from "@/components/ui/toast";
import {cn} from "cn";
import {CheckIcon, CopyIcon} from "lucide-react";
import {useEffect, useState} from "react";

type CopyButtonProps = {
	value: string;
	label?: string;
	className?: string;
};

export default function CopyButton({value, label = "value", className}: CopyButtonProps) {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;

		const timeout = window.setTimeout(() => setCopied(false), 2000);

		return () => window.clearTimeout(timeout);
	}, [copied]);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
		} catch {
			toast.add({
				type: "error",
				description: `Could not copy ${label} to the clipboard`
			});
		}
	};

	return (
		<Button variant="ghost" size="icon-xs" onClick={handleCopy} aria-label={copied ? "Copied to clipboard" : `Copy ${label} to clipboard`} className={cn("dark:hover:bg-muted/40 text-muted-foreground hover:text-foreground", className)}>
			{copied ? <CheckIcon className="text-primary" /> : <CopyIcon />}
		</Button>
	);
}
