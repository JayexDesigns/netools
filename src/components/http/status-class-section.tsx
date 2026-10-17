import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import type {HttpStatusClass} from "@/data/http-status-codes";
import {cn} from "cn";
import {ChevronDownIcon} from "lucide-react";
import {useState} from "react";

type StatusClassSectionProps = {
	statusClass: HttpStatusClass;
};

export default function StatusClassSection({statusClass}: StatusClassSectionProps) {
	// Every class starts expanded, the reader can fold away the ones they do not need
	const [open, setOpen] = useState(true);

	return (
		<Collapsible open={open} onOpenChange={setOpen} className="bg-black/30 border border-border rounded-xl overflow-hidden">
			<CollapsibleTrigger className="flex items-center gap-3 hover:bg-white/[0.03] focus-visible:bg-white/[0.03] px-4 sm:px-5 py-4 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/30 w-full text-left cursor-pointer transition-colors">
				<span className="font-medium text-lg">
					{statusClass.range} {statusClass.title}
				</span>
				<span className="text-muted-foreground text-sm whitespace-nowrap">{statusClass.codes.length} codes</span>
				<ChevronDownIcon aria-hidden className={cn("ml-auto size-5 text-muted-foreground transition-transform duration-300 shrink-0", open && "rotate-180")} />
			</CollapsibleTrigger>

			<CollapsibleContent className="px-4 sm:px-5 pb-4 data-closed:animate-out data-open:animate-in duration-200 data-open:fade-in-0 data-closed:fade-out-0">
				<p className="text-muted-foreground text-sm leading-relaxed">{statusClass.description}</p>

				<Table className="mt-3">
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className="pl-0 w-16">Code</TableHead>
							<TableHead className="min-w-36">Reason</TableHead>
							<TableHead>Description</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{statusClass.codes.map(status => (
							<TableRow key={status.code}>
								<TableCell className="pl-0 align-top font-mono font-medium text-primary-700 dark:text-primary-300">{status.code}</TableCell>
								<TableCell className="align-top font-medium">{status.reason}</TableCell>
								<TableCell className="align-top whitespace-normal text-muted-foreground leading-relaxed">{status.description}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CollapsibleContent>
		</Collapsible>
	);
}
