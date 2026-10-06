import BackgroundGlow from "@/components/background-glow";
import {buttonVariants} from "@/components/ui/button";
import {Link} from "@tanstack/react-router";
import {ArrowRight} from "lucide-react";

export default function NotFound() {
	return (
		<>
			<BackgroundGlow />
			<main className="flex flex-col justify-center items-center gap-4 min-h-screen text-foreground">
				<p className="font-heading font-semibold text-6xl">404</p>
				<p className="text-muted-foreground">This page could not be found.</p>
				<Link to="/" className={buttonVariants({variant: "default", size: "lg"})}>
					Back to home <ArrowRight />
				</Link>
			</main>
		</>
	);
}
