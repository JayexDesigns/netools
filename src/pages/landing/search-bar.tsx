import {Input} from "@/components/ui/input";
import {SearchIcon, XIcon} from "lucide-react";

type SearchBarProps = {
	value: string;
	onValueChange: (value: string) => void;
};

export default function SearchBar({value, onValueChange}: SearchBarProps) {
	return (
		<div className="relative">
			<SearchIcon aria-hidden className="top-1/2 left-6 absolute size-5 text-white/50 -translate-y-1/2 pointer-events-none" />
			<Input type="text" value={value} onChange={event => onValueChange(event.target.value)} aria-label="Search tools by name" placeholder="Search for a tool by name..." className="bg-white/8 pr-14 pl-16 focus-visible:border-transparent rounded-full ring-1 ring-white/10 focus-visible:ring-primary-400/50 h-14 text-white placeholder:text-white/40 text-base md:text-base" />
			{value.length > 0 && (
				<button type="button" onClick={() => onValueChange("")} aria-label="Clear search" className="top-1/2 right-5 absolute p-1 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-primary-400/50 text-white/50 hover:text-white transition-colors -translate-y-1/2">
					<XIcon className="size-4" />
				</button>
			)}
		</div>
	);
}
