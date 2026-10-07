import {Header} from "@/components/header";
import {ThemeProvider} from "@/components/theme-provider";
import LandingPage from "@/pages/landing/landing-page";
import NotFound from "@/pages/not-found";
import TLDR from "@/pages/tools/tldr";
import {Outlet, createRootRoute, createRoute, createRouter} from "@tanstack/react-router";

const rootRoute = createRootRoute({
	component: () => (
		<ThemeProvider defaultTheme="dark" storageKey="theme">
			<Header />
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

const tldrRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/tldr",
	component: TLDR
});

const routeTree = rootRoute.addChildren([indexRoute, tldrRoute]);

const router = createRouter({routeTree});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

export default router;
