import StatusClassSection from "@/components/http/status-class-section";
import InlineCode from "@/components/inline-code";
import {httpStatusClasses} from "@/data/http-status-codes";

export default function HttpStatusCodes() {
	const total = httpStatusClasses.reduce((sum, statusClass) => sum + statusClass.codes.length, 0);

	return (
		<div className="isolate relative min-h-dvh overflow-x-clip text-foreground">
			<main className="relative mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-24 max-w-5xl">
				<header className="flex flex-col gap-5">
					<h1 className="font-heading font-bold text-3xl sm:text-4xl tracking-tight">HTTP Status Codes</h1>

					<p className="text-muted-foreground leading-relaxed">
						All {total} status codes an HTTP server can answer with, from the registered IANA list, grouped by the class of their first digit: informational, success, redirection, client error and server error. Every class starts open, click a header to fold it away. Example: <InlineCode>404</InlineCode> means the server understood the request but the resource is not there.
					</p>
				</header>

				<div className="flex flex-col gap-4 mt-8">
					{httpStatusClasses.map(statusClass => (
						<StatusClassSection key={statusClass.id} statusClass={statusClass} />
					))}
				</div>
			</main>
		</div>
	);
}
