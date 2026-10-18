import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, {reactCompilerPreset} from "@vitejs/plugin-react";
import path from "path";
import {defineConfig} from "vite";

// https://vite.dev/config/
export default defineConfig({
	// The Docker image serves the app from /, but GitHub Pages serves project pages from /<repo>/,
	// so the deploy workflow sets BASE_PATH to make every emitted URL carry that prefix; the router
	// reads the same value through import.meta.env.BASE_URL to know what to strip
	base: process.env.BASE_PATH ?? "/",
	plugins: [react(), babel({presets: [reactCompilerPreset()]}), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(import.meta.dirname, "./src")
		}
	},
	server: {
		host: "0.0.0.0",
		allowedHosts: true
	}
});
