import {useMemo} from "react";

// mulberry32: a tiny deterministic PRNG so the same seed always yields the same grain
function mulberry32(seed: number) {
	let state = seed >>> 0;
	return () => {
		state = (state + 0x6d2b79f5) | 0;
		let t = Math.imul(state ^ (state >>> 15), 1 | state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function noiseTile(tileSize: number, seed: number, baseFrequency: number, intensity: number) {
	const random = mulberry32(seed);
	const canvas = document.createElement("canvas");
	canvas.width = tileSize;
	canvas.height = tileSize;
	const context = canvas.getContext("2d");
	if (!context) return "";
	const pixels = context.createImageData(tileSize, tileSize);
	for (let i = 0; i < pixels.data.length; i += 4) {
		pixels.data[i] = 255;
		pixels.data[i + 1] = 255;
		pixels.data[i + 2] = 255;
		pixels.data[i + 3] = random() < baseFrequency ? Math.round(random() * intensity * 255) : 0;
	}
	context.putImageData(pixels, 0, 0);
	return `url("${canvas.toDataURL()}")`;
}

export default function BackgroundGlow({
	intensity = 0.7, // 0 to 1, strength of the noise
	noiseOpacity = 0.7, // 0 to 1, overall transparency of the noise layer
	baseFrequency = 0.7, // 0 to 1, how much of the tile is covered by specks
	seed = 1, // change for a different noise pattern
	tileSize = 512 // px, size of the repeating noise tile
}) {
	const noiseUrl = useMemo(() => noiseTile(tileSize, seed, baseFrequency, intensity), [intensity, baseFrequency, seed, tileSize]);

	return (
		<div className="top-0 -z-10 absolute bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,var(--color-primary-900)_0%,var(--color-background)_100%)] lg:bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,var(--color-primary-900)_0%,var(--color-background)_100%)] w-full min-h-dvh overflow-hidden pointer-events-none select-none">
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
