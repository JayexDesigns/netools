import {cn} from "cn";
import type {ComponentProps} from "react";

export default function InlineCode({className, ...props}: ComponentProps<"code">) {
	return <code {...props} className={cn("bg-muted px-1.5 py-0.5 border border-border rounded-md font-mono text-[0.85em] text-foreground", className)} />;
}
