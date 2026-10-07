import BackgroundGlow from "@/components/background-glow";
import Hero from "@/pages/landing/hero";
import ToolsExplorer from "@/pages/landing/tools-explorer";

export default function LandingPage() {
	return (
		<div className="isolate relative min-h-screen overflow-x-clip text-white">
			<BackgroundGlow />
			<div className="relative flex flex-col min-h-screen">
				<Hero />
				<ToolsExplorer />
			</div>
		</div>
	);
}
