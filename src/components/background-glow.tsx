import {useMemo} from "react";

export default function BackgroundGlow({
	intensity = 0.7, // 0 to 1, strength of the noise
	noiseOpacity = 0.6, // 0 to 1, overall transparency of the noise layer
	baseFrequency = 0.7, // higher = finer grain
	seed = 1, // change for a different noise pattern
	tileSize = 512 // px, size of the repeating noise tile
}) {
	const noiseUrl = useMemo(() => {
		const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${tileSize}' height='${tileSize}'>` + `<filter id='n' x='0' y='0' width='100%' height='100%'>` + `<feTurbulence type='fractalNoise' baseFrequency='${baseFrequency}' numOctaves='3' seed='${seed}' stitchTiles='stitch'/>` + `<feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ${intensity * 2} 0 0 0 0'/>` + `</filter>` + `<rect width='100%' height='100%' filter='url(#n)'/>` + `</svg>`;
		return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
	}, [intensity, baseFrequency, seed, tileSize]);

	return (
		<div className="top-0 -z-10 absolute bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,var(--color-primary-800)_0%,var(--color-background)_100%)] lg:bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,var(--color-primary-800)_0%,var(--color-background)_100%)] w-full min-h-dvh overflow-hidden pointer-events-none select-none">
			<div
				aria-hidden="true"
				className="absolute inset-0 bg-background pointer-events-none"
				style={{
					opacity: noiseOpacity,
					maskImage: noiseUrl,
					WebkitMaskImage: noiseUrl,
					maskSize: `${tileSize}px ${tileSize}px`,
					WebkitMaskSize: `${tileSize}px ${tileSize}px`,
					maskRepeat: "repeat",
					WebkitMaskRepeat: "repeat"
				}}
			/>
		</div>
	);
}
