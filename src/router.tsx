import {Header} from "@/components/header";
import {ThemeProvider} from "@/components/theme-provider";
import {Toaster} from "@/components/ui/toast";
import LandingPage from "@/pages/landing/landing-page";
import NotFound from "@/pages/not-found";
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

const tldrArpRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/tldr-arp",
	component: TLDRarp
});

const tldrCurlRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/tldr-curl",
	component: TLDRcurl
});

const tldrDigRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/tldr-dig",
	component: TLDRdig
});

const tldrFtpRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/tldr-ftp",
	component: TLDRftp
});

const tldrIpRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/tldr-ip",
	component: TLDRip
});

const tldrIperf3Route = createRoute({
	getParentRoute: () => rootRoute,
	path: "/tldr-iperf3",
	component: TLDRiperf3
});

const tldrIwRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/tldr-iw",
	component: TLDRiw
});

const tldrMtrRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/tldr-mtr",
	component: TLDRmtr
});

const tldrNcRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/tldr-nc",
	component: TLDRnc
});

const tldrNetworkctlRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/tldr-networkctl",
	component: TLDRnetworkctl
});

const tldrNmapRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/tldr-nmap",
	component: TLDRnmap
});

const tldrPingRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/tldr-ping",
	component: TLDRping
});

const tldrRouteRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/tldr-route",
	component: TLDRroute
});

const tldrRsyncRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/tldr-rsync",
	component: TLDRrsync
});

const tldrScpRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/tldr-scp",
	component: TLDRscp
});

const tldrSftpRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/tldr-sftp",
	component: TLDRsftp
});

const tldrSsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/tldr-ss",
	component: TLDRss
});

const tldrSshRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/tldr-ssh",
	component: TLDRssh
});

const tldrTcpdumpRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/tldr-tcpdump",
	component: TLDRtcpdump
});

const tldrTracerouteRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/tldr-traceroute",
	component: TLDRtraceroute
});

const routeTree = rootRoute.addChildren([indexRoute, tldrArpRoute, tldrCurlRoute, tldrDigRoute, tldrFtpRoute, tldrIpRoute, tldrIperf3Route, tldrIwRoute, tldrMtrRoute, tldrNcRoute, tldrNetworkctlRoute, tldrNmapRoute, tldrPingRoute, tldrRouteRoute, tldrRsyncRoute, tldrScpRoute, tldrSftpRoute, tldrSsRoute, tldrSshRoute, tldrTcpdumpRoute, tldrTracerouteRoute]);

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
