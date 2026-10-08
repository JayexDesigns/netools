import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import type {ToolSection as ToolSectionData} from "@/data/tools";
import ToolCard from "@/pages/landing/tool-card";
import {cn} from "cn";
import {ChevronDownIcon} from "lucide-react";

type ToolSectionProps = {
	section: ToolSectionData;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export default function ToolSection({section, open, onOpenChange}: ToolSectionProps) {
	return (
		<Collapsible open={open} onOpenChange={onOpenChange} className="w-full">
			<CollapsibleTrigger className="flex items-center gap-4 w-full text-left transition-colors cursor-pointer">
				<span className="min-w-0 font-heading font-semibold text-white text-base sm:text-lg truncate">{section.title}</span>
				<span className="ml-auto text-white/50 text-sm whitespace-nowrap">{section.tools.length} tools</span>
				<ChevronDownIcon aria-hidden className={cn("size-5 text-white/60 transition-transform duration-300 shrink-0", open && "rotate-180")} />
			</CollapsibleTrigger>

			<CollapsibleContent className="pt-4 data-closed:animate-out data-open:animate-in duration-200 data-open:fade-in-0 data-closed:fade-out-0">
				<div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
					{section.tools.map(tool => (
						<ToolCard key={tool.url} tool={tool} />
					))}
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
