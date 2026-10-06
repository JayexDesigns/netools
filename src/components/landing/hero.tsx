export default function Hero() {
	return (
		<section aria-labelledby="hero-title" className="flex flex-col items-center px-6 pt-28 sm:pt-36 pb-26 text-center">
			<span className="inline-flex items-center bg-black/30 backdrop-blur-sm px-5 py-2 border border-primary-400/40 rounded-full ring-4 ring-primary-500/10 font-medium text-white text-sm lg:text-lg">Netools</span>

			<h1 id="hero-title" className="mt-7 max-w-3xl font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-balance tracking-tight">
				Networking Tools, All in One Place
			</h1>

			<p className="mt-5 max-w-2xl text-white/60 text-base sm:text-lg text-pretty leading-relaxed">Netools is a free collection of network utilities that run directly in your browser.</p>
		</section>
	);
}
