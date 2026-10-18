import {describe, expect, it, vi} from "vitest";
import {generateId} from "@/lib/id";

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe("generateId", () => {
	it("returns a version-4 UUID", () => {
		expect(generateId()).toMatch(UUID_V4);
	});

	it("returns unique ids", () => {
		const ids = new Set(Array.from({length: 500}, () => generateId()));
		expect(ids.size).toBe(500);
	});

	it("falls back to a manual v4 UUID when crypto.randomUUID is missing", () => {
		// Simulates an insecure context (plain http on a phone), where only getRandomValues survives
		const original = globalThis.crypto;
		vi.stubGlobal("crypto", {
			getRandomValues: (array: Uint8Array<ArrayBuffer>) => original.getRandomValues(array)
		});

		try {
			const ids = Array.from({length: 100}, () => generateId());

			for (const id of ids) expect(id).toMatch(UUID_V4);
			expect(new Set(ids).size).toBe(100);
		} finally {
			vi.unstubAllGlobals();
		}
	});
});
