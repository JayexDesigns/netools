import path from "path";
import {defineConfig} from "vitest/config";

// Standalone Vitest config: the app's Vite config pulls in the React compiler Babel plugin and Tailwind,
// neither of which belongs in a test run, so tests only need the `@` path alias
export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(import.meta.dirname, "./src")
		}
	},
	test: {
		// Globals let @testing-library/react hook its automatic cleanup into afterEach
		globals: true,
		// All tests live in tests/, mirroring the structure of src/
		include: ["tests/**/*.test.{ts,tsx}"],
		setupFiles: ["./tests/setup.ts"],
		// Library and data tests run on node, component tests opt into jsdom with a `@vitest-environment jsdom` docblock
		environment: "node"
	}
});
