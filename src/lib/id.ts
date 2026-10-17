/*
	Crypto.randomUUID is only exposed in secure contexts, so the app has to fall back to a
	manual version-4 UUID when it is served over plain http, which is the usual way a phone
	reaches a dev or preview server on the local network.
*/
export function generateId(): string {
	if (typeof crypto.randomUUID === "function") return crypto.randomUUID();

	// getRandomValues stays available outside secure contexts
	const bytes = crypto.getRandomValues(new Uint8Array(16));
	bytes[6] = (bytes[6] & 0x0f) | 0x40;
	bytes[8] = (bytes[8] & 0x3f) | 0x80;
	const hex = [...bytes].map(byte => byte.toString(16).padStart(2, "0")).join("");
	return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
