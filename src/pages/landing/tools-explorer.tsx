import {Button} from "@/components/ui/button";
import {toolSections} from "@/data/tools";
import SearchBar from "@/pages/landing/search-bar";
import ToolSection from "@/pages/landing/tool-section";
import {SearchIcon} from "lucide-react";
import {useEffect, useMemo, useState} from "react";

export default function ToolsExplorer() {
	const [query, setQuery] = useState("");
	const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

	// Re-open every section while searching so matches are never hidden.
	useEffect(() => {
		if (query.trim().length > 0) {
			setCollapsedSections({});
		}
	}, [query]);

	const sections = useMemo(() => {
		const term = query.trim().toLowerCase();

		if (term.length === 0) return toolSections;

		return toolSections
			.map(section => ({
				...section,
				tools: section.tools.filter(tool => tool.name.toLowerCase().includes(term))
			}))
			.filter(section => section.tools.length > 0);
	}, [query]);

	const toggleSection = (id: string, open: boolean) => {
		setCollapsedSections(previous => ({...previous, [id]: !open}));
	};

	return (
		<section id="tools" aria-label="Tools" className="mx-auto pb-16 w-full scroll-mt-16">
			<div className="space-y-10">
				<SearchBar value={query} onValueChange={setQuery} />

				{sections.length === 0 ? (
					<div className="flex flex-col items-center bg-white/4 px-6 py-14 rounded-4xl ring-1 ring-white/10 text-center">
						<SearchIcon aria-hidden className="size-6 text-white/40" />
						<p className="mt-4 font-heading font-semibold text-white text-base">No tools found</p>
						<p className="mt-1 max-w-sm text-white/50 text-sm">Nothing matches “{query.trim()}”. Try a different tool name.</p>
						<Button onClick={() => setQuery("")} className="bg-white hover:bg-white/90 mt-5 px-5 focus-visible:border-transparent rounded-full focus-visible:ring-white/40 h-9 text-black">
							Clear search
						</Button>
					</div>
				) : (
					sections.map(section => <ToolSection key={section.id} section={section} open={!collapsedSections[section.id]} onOpenChange={open => toggleSection(section.id, open)} />)
				)}
			</div>
		</section>
	);
}
