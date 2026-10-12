import {Button} from "@/components/ui/button";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/components/ui/drawer";
import {ScrollArea} from "@/components/ui/scroll-area";
import {toolLabel, toolSections, type ToolSection} from "@/data/tools";
import {Link} from "@tanstack/react-router";
import {cn} from "cn";
import {ChevronDownIcon, MenuIcon, XIcon} from "lucide-react";
import {useState} from "react";

function SectionCollapsible({section}: {section: ToolSection}) {
	const [open, setOpen] = useState(true);

	return (
		<Collapsible open={open} onOpenChange={setOpen}>
			<CollapsibleTrigger className={cn("flex justify-between items-center gap-2 hover:bg-muted/50 focus-visible:bg-muted/50 px-3 py-2 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/30 w-full font-medium text-sm transition-colors", open && "bg-muted/50")}>
				{section.title}
				<ChevronDownIcon className={cn("ml-auto size-4 text-muted-foreground transition-transform duration-300 shrink-0", open && "rotate-180")} />
			</CollapsibleTrigger>
			<CollapsibleContent className="data-closed:animate-out data-open:animate-in duration-200 data-open:fade-in-0 data-closed:fade-out-0">
				<div className="flex flex-col gap-0.5 ml-5 pb-1 pl-2 border-border border-l">
					{section.tools.map(tool => {
						const Icon = tool.icon;

						return (
							<DrawerClose nativeButton={false} key={tool.url} render={<Link to={tool.url} />} className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:bg-muted font-medium text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/30 [&_svg:not([class*='size-'])]:size-4">
								<Icon aria-hidden />
								{toolLabel(section, tool.name)}
							</DrawerClose>
						);
					})}
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}

export function MobileNav({className}: {className?: string}) {
	return (
		<Drawer swipeDirection="right">
			<DrawerTrigger
				render={
					<Button variant="ghost" size="icon" className={className} aria-label="Open navigation menu">
						<MenuIcon className="size-5" />
					</Button>
				}
			/>
			<DrawerContent>
				<DrawerClose render={<Button variant="ghost" size="icon-sm" className="top-3 right-3 absolute bg-secondary" aria-label="Close navigation menu" />}>
					<XIcon />
				</DrawerClose>
				<DrawerHeader>
					<DrawerTitle>Tools</DrawerTitle>
					<DrawerDescription className="sr-only">Browse the tools by section</DrawerDescription>
				</DrawerHeader>
				<ScrollArea className="flex-1 px-4 pt-1 pb-4 min-h-0">
					<div className="flex flex-col gap-1">
						{toolSections.map(section => (
							<SectionCollapsible key={section.id} section={section} />
						))}
					</div>
				</ScrollArea>
			</DrawerContent>
		</Drawer>
	);
}
