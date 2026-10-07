import type {Tool} from "@/data/tools";
import {Link} from "@tanstack/react-router";

type ToolCardProps = {
	tool: Tool;
};

export default function ToolCard({tool}: ToolCardProps) {
	const Icon = tool.icon;

	return (
		<Link to="/tldr-curl">
			<article className="group flex flex-col gap-4 bg-white/4 hover:bg-white/[0.07] p-5 rounded-3xl ring-1 ring-white/10 hover:ring-primary-400/40 transition-all hover:-translate-y-0.5">
				<div className="flex justify-center items-center bg-primary-500/15 group-hover:bg-primary-500/25 rounded-2xl ring-1 ring-primary-400/30 size-11 text-primary-300 transition-colors">
					<Icon aria-hidden className="size-5" />
				</div>
				<div className="space-y-1.5">
					<h3 className="font-heading font-semibold text-white text-base">{tool.name}</h3>
					<p className="text-white/50 text-sm leading-relaxed">{tool.description}</p>
				</div>
			</article>
		</Link>
	);
}
