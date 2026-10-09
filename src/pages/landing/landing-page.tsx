import BackgroundGlow from "@/components/background-glow";
import Hero from "@/pages/landing/hero";
import ToolsExplorer from "@/pages/landing/tools-explorer";

export default function LandingPage() {
	return (
		<div className="isolate relative overflow-x-clip text-white">
			<BackgroundGlow />
			<div className="relative flex flex-col mx-auto px-4 sm:px-6 max-w-6xl min-h-dvh">
				<Hero />
				<ToolsExplorer />
			</div>
		</div>
	);
}
