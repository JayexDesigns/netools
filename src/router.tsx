import {Header} from "@/components/header";
import {ThemeProvider} from "@/components/theme-provider";
import {Toaster} from "@/components/ui/toast";
import LandingPage from "@/pages/landing/landing-page";
import NotFound from "@/pages/not-found";
import TLDRCurl from "@/pages/tools/tldr-curl";
import {Outlet, createRootRoute, createRoute, createRouter} from "@tanstack/react-router";

const rootRoute = createRootRoute({
	component: () => (
		<ThemeProvider defaultTheme="dark" storageKey="theme">
			<Header />
			<Toaster />
			<Outlet />
		</ThemeProvider>
	),
	notFoundComponent: NotFound
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: LandingPage
});

const tldrCurlRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/tldr-curl",
	component: TLDRCurl
});

const routeTree = rootRoute.addChildren([indexRoute, tldrCurlRoute]);

const router = createRouter({
	routeTree,
	// Fade pages in/out on navigation with the View Transition API, styled by the `page-fade` rules in index.css.
	defaultViewTransition: {types: ["page-fade"]}
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

export default router;
