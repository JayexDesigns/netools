import LogoWhite from "@/assets/logo-white.svg";
import {NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger} from "@/components/ui/navigation-menu";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import {GithubDark} from "@/components/ui/svgs/githubDark";
import {GithubLight} from "@/components/ui/svgs/githubLight";
import {toolSections, type ToolSection} from "@/data/tools";
import {Link} from "@tanstack/react-router";

const GITHUB_URL = "https://github.com/JayexDesigns";

// Strip the section title prefix on tools when it matches
function toolLabel(section: ToolSection, name: string) {
	return name.startsWith(`${section.title} `) ? name.slice(section.title.length + 1) : name;
}

function SectionMenu({section}: {section: ToolSection}) {
	return (
		<NavigationMenuItem>
			<NavigationMenuTrigger className="data-open:bg-primary-300/20 data-open:hover:bg-primary-300/20 data-popup-open:bg-primary-300/20 data-popup-open:hover:bg-primary-300/20 data-open:focus:bg-primary-300/20 data-popup-open:focus:bg-primary-300/20 hover:bg-primary-300/20 focus:bg-primary-300/20">{section.title}</NavigationMenuTrigger>
			<NavigationMenuContent className="flex flex-col px-3 py-2">
				<ScrollArea className="flex flex-col has-data-[slot=scroll-area-scrollbar]:pr-3 max-h-[min(28rem,70vh)]">
					{section.tools.map(tool => {
						const Icon = tool.icon;

						return (
							<NavigationMenuLink key={tool.url} className="in-data-[slot=navigation-menu-content]:px-3.5" render={<Link to={tool.url} />} closeOnClick>
								<Icon aria-hidden />
								{toolLabel(section, tool.name)}
							</NavigationMenuLink>
						);
					})}
				</ScrollArea>
			</NavigationMenuContent>
		</NavigationMenuItem>
	);
}

export function Header() {
	return (
		<header className="top-4 left-1/2 z-50 fixed bg-background/40 shadow-lg backdrop-blur-none border rounded-2xl w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2">
			<div className="flex justify-between items-center px-4 h-14">
				<Link to="/" aria-label="Back to home" className="flex items-center rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/30">
					<img src={LogoWhite} className="size-8" />
				</Link>

				<div className="flex items-center gap-2">
					<NavigationMenu align="end">
						<NavigationMenuList>
							{toolSections.map(section => (
								<SectionMenu key={section.id} section={section} />
							))}
						</NavigationMenuList>
					</NavigationMenu>

					<Separator orientation="vertical" />

					<a href={GITHUB_URL} target="_blank" rel="noreferrer noopener" aria-label="GitHub profile" className="flex justify-center items-center p-2 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/30 text-muted-foreground hover:text-foreground transition-colors">
						<GithubLight className="dark:hidden size-5" />
						<GithubDark className="hidden dark:block size-5" />
					</a>
				</div>
			</div>
		</header>
	);
}
