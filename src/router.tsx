import BackgroundGlow from "@/components/background-glow";
import {Header} from "@/components/header";
import {ThemeProvider} from "@/components/theme-provider";
import {Toaster} from "@/components/ui/toast";
import LandingPage from "@/pages/landing/landing-page";
import NotFound from "@/pages/not-found";
import CurlBuilder from "@/pages/tools/curl-builder";
import IPv4AddressConverter from "@/pages/tools/ipv4-address-converter";
import IPv4SubnetCalculator from "@/pages/tools/ipv4-subnet-calculator";
import TLDRarp from "@/pages/tools/tldr-arp";
import TLDRcurl from "@/pages/tools/tldr-curl";
import TLDRdig from "@/pages/tools/tldr-dig";
import TLDRftp from "@/pages/tools/tldr-ftp";
import TLDRip from "@/pages/tools/tldr-ip";
import TLDRiperf3 from "@/pages/tools/tldr-iperf3";
import TLDRiw from "@/pages/tools/tldr-iw";
import TLDRmtr from "@/pages/tools/tldr-mtr";
import TLDRnc from "@/pages/tools/tldr-nc";
import TLDRnetworkctl from "@/pages/tools/tldr-networkctl";
import TLDRnmap from "@/pages/tools/tldr-nmap";
import TLDRping from "@/pages/tools/tldr-ping";
import TLDRroute from "@/pages/tools/tldr-route";
import TLDRrsync from "@/pages/tools/tldr-rsync";
import TLDRscp from "@/pages/tools/tldr-scp";
import TLDRsftp from "@/pages/tools/tldr-sftp";
import TLDRss from "@/pages/tools/tldr-ss";
import TLDRssh from "@/pages/tools/tldr-ssh";
import TLDRtcpdump from "@/pages/tools/tldr-tcpdump";
import TLDRtraceroute from "@/pages/tools/tldr-traceroute";
import TLDRwget from "@/pages/tools/tldr-wget";
import {Outlet, createRootRoute, createRoute, createRouter} from "@tanstack/react-router";

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

const routeTree = rootRoute.addChildren([
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/",
		component: LandingPage
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/curl-builder",
		component: CurlBuilder
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/ipv4-subnet-calculator",
		component: IPv4SubnetCalculator
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/ipv4-address-converter",
		component: IPv4AddressConverter
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-arp",
		component: TLDRarp
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-curl",
		component: TLDRcurl
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-dig",
		component: TLDRdig
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-ftp",
		component: TLDRftp
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-ip",
		component: TLDRip
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-iperf3",
		component: TLDRiperf3
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-iw",
		component: TLDRiw
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-mtr",
		component: TLDRmtr
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-nc",
		component: TLDRnc
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-networkctl",
		component: TLDRnetworkctl
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-nmap",
		component: TLDRnmap
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-ping",
		component: TLDRping
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-route",
		component: TLDRroute
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-rsync",
		component: TLDRrsync
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-scp",
		component: TLDRscp
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-sftp",
		component: TLDRsftp
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-ss",
		component: TLDRss
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-ssh",
		component: TLDRssh
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-tcpdump",
		component: TLDRtcpdump
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-traceroute",
		component: TLDRtraceroute
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/tldr-wget",
		component: TLDRwget
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
