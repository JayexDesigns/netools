import DiagramWorkspace from "@/components/diagram/workspace";

export default function NetworkDiagramCanvas() {
	return (
		<div className="isolate relative min-h-dvh overflow-x-clip text-foreground">
			<main className="relative mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-24 max-w-400">
				<header className="flex flex-col gap-5">
					<h1 className="font-heading font-bold text-3xl sm:text-4xl tracking-tight">Network Diagram Canvas</h1>

					<p className="text-muted-foreground leading-relaxed">Draw a network topology: drag devices from the palette onto the canvas, connect them by dragging from one handle to another, and click a node or a connection to edit its name, description, type, color, line style and animation. Everything runs locally, nothing is uploaded, and the finished diagram can be exported as a PNG image.</p>
				</header>

				<div className="mt-8">
					<DiagramWorkspace />
				</div>
			</main>
		</div>
	);
}
