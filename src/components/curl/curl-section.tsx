import type {ReactNode} from "react";

type CurlSectionProps = {
	id: string;
	title: string;
	description: string;
	children: ReactNode;
};

export default function CurlSection({id, title, description, children}: CurlSectionProps) {
	return (
		<section aria-labelledby={`${id}-heading`} className="flex flex-col gap-4 bg-muted/40 dark:bg-black/30 p-4 sm:p-5 border border-border rounded-xl">
			<div className="flex flex-col gap-1">
				<h2 id={`${id}-heading`} className="font-medium text-lg">
					{title}
				</h2>
				<p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
			</div>

			{children}
		</section>
	);
}
