import BackgroundGlow from "@/components/background-glow";
import {Header} from "@/components/header";
import {ThemeProvider} from "@/components/theme-provider";
import {Toaster} from "@/components/ui/toast";
import LandingPage from "@/pages/landing/landing-page";
import NotFound from "@/pages/not-found";
import {Outlet, createRootRoute, createRoute, createRouter, lazyRouteComponent} from "@tanstack/react-router";

const rootRoute = createRootRoute({
	component: () => (
		<ThemeProvider defaultTheme="dark" storageKey="theme">
			<Header />
			<Toaster />
			<BackgroundGlow />
			<Outlet />
		</ThemeProvider>
	),
	notFoundComponent: NotFound
});

/*
	Tool pages are code-split so the phone only downloads and parses a tool's own chunk
	(plus its libraries, e.g. React Flow for the diagram) when that tool is opened,
	instead of shipping every tool in the single entry bundle.
*/
const routeTree = rootRoute.addChildren([
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/",
		component: LandingPage
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/network-diagram-canvas",
		component: lazyRouteComponent(() => import("@/pages/tools/network-diagram-canvas"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/curl-builder",
		component: lazyRouteComponent(() => import("@/pages/tools/curl-builder"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/jwt-encoder-decoder",
		component: lazyRouteComponent(() => import("@/pages/tools/jwt-encoder-decoder"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/url-encoder-decoder",
		component: lazyRouteComponent(() => import("@/pages/tools/url-encoder-decoder"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/http-status-codes",
		component: lazyRouteComponent(() => import("@/pages/tools/http-status-codes"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/ipv4-subnet-calculator",
		component: lazyRouteComponent(() => import("@/pages/tools/ipv4-subnet-calculator"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/ipv4-subnet-creator",
		component: lazyRouteComponent(() => import("@/pages/tools/ipv4-subnet-creator"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/ipv4-address-converter",
		component: lazyRouteComponent(() => import("@/pages/tools/ipv4-address-converter"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-arp",
		component: lazyRouteComponent(() => import("@/pages/tools/tldr-arp"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-curl",
		component: lazyRouteComponent(() => import("@/pages/tools/tldr-curl"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-dig",
		component: lazyRouteComponent(() => import("@/pages/tools/tldr-dig"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-ftp",
		component: lazyRouteComponent(() => import("@/pages/tools/tldr-ftp"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-ip",
		component: lazyRouteComponent(() => import("@/pages/tools/tldr-ip"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-iperf3",
		component: lazyRouteComponent(() => import("@/pages/tools/tldr-iperf3"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-iw",
		component: lazyRouteComponent(() => import("@/pages/tools/tldr-iw"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-mtr",
		component: lazyRouteComponent(() => import("@/pages/tools/tldr-mtr"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-nc",
		component: lazyRouteComponent(() => import("@/pages/tools/tldr-nc"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-networkctl",
		component: lazyRouteComponent(() => import("@/pages/tools/tldr-networkctl"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-nmap",
		component: lazyRouteComponent(() => import("@/pages/tools/tldr-nmap"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-ping",
		component: lazyRouteComponent(() => import("@/pages/tools/tldr-ping"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-route",
		component: lazyRouteComponent(() => import("@/pages/tools/tldr-route"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-rsync",
		component: lazyRouteComponent(() => import("@/pages/tools/tldr-rsync"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-scp",
		component: lazyRouteComponent(() => import("@/pages/tools/tldr-scp"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-sftp",
		component: lazyRouteComponent(() => import("@/pages/tools/tldr-sftp"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-ss",
		component: lazyRouteComponent(() => import("@/pages/tools/tldr-ss"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-ssh",
		component: lazyRouteComponent(() => import("@/pages/tools/tldr-ssh"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-tcpdump",
		component: lazyRouteComponent(() => import("@/pages/tools/tldr-tcpdump"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-traceroute",
		component: lazyRouteComponent(() => import("@/pages/tools/tldr-traceroute"))
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-wget",
		component: lazyRouteComponent(() => import("@/pages/tools/tldr-wget"))
	})
]);

const router = createRouter({
	routeTree,
	// Fade pages in/out on navigation with the View Transition API, styled by the `page-fade` rules in index.css
	defaultViewTransition: {types: ["page-fade"]}
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

export default router;
