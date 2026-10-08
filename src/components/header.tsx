import {NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger} from "@/components/ui/navigation-menu";
import {Separator} from "@/components/ui/separator";
import {GithubDark} from "@/components/ui/svgs/githubDark";
import {GithubLight} from "@/components/ui/svgs/githubLight";
import {Link} from "@tanstack/react-router";
import {Network} from "lucide-react";

const GITHUB_URL = "https://github.com/JayexDesigns";

export function Header() {
	return (
		<header className="top-4 left-1/2 z-50 fixed bg-background/40 shadow-lg backdrop-blur-none border rounded-2xl w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2">
			<div className="flex justify-between items-center px-4 h-14">
				<Link to="/" aria-label="Back to home" className="flex items-center rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/30">
					<Network className="size-6" />
				</Link>

				<div className="flex items-center gap-2">
					<NavigationMenu align="end">
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuLink className="hover:bg-primary-300/20 focus:bg-primary-300/20" render={<Link to="/" />} closeOnClick>
									Mock 1
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuTrigger className="data-open:bg-primary-300/20 data-open:hover:bg-primary-300/20 data-popup-open:bg-primary-300/20 data-popup-open:hover:bg-primary-300/20 data-open:focus:bg-primary-300/20 data-popup-open:focus:bg-primary-300/20 hover:bg-primary-300/20 focus:bg-primary-300/20">TLDR</NavigationMenuTrigger>
								<NavigationMenuContent className="flex flex-col px-3 py-2">
									<NavigationMenuLink render={<Link to="/tldr-curl" />} closeOnClick>
										curl
									</NavigationMenuLink>
									<NavigationMenuLink render={<Link to="/tldr-curl" />} closeOnClick>
										TLDR 2
									</NavigationMenuLink>
								</NavigationMenuContent>
							</NavigationMenuItem>
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
