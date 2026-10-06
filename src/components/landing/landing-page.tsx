import BackgroundGlow from "@/components/landing/background-glow";
import Hero from "@/components/landing/hero";
import ToolsExplorer from "@/components/landing/tools-explorer";

export default function LandingPage() {
	return (
		<div className="isolate relative min-h-screen overflow-x-clip text-white">
			<BackgroundGlow />
			<div className="z-10 relative flex flex-col min-h-screen">
				<Hero />
				<ToolsExplorer />
			</div>
		</div>
	);
}
