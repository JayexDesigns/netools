// Notations an IPv4 address can be written in, in the order they are displayed
export type AddressBase = "decimal" | "binary" | "hex" | "octal";

const RADIX: Record<AddressBase, number> = {decimal: 10, binary: 2, hex: 16, octal: 8};

// Characters a single octet can use in each notation (values above 255 are rejected later)
const OCTET_CHARS: Record<AddressBase, RegExp> = {
	decimal: /^[0-9]+$/,
	binary: /^[01]+$/,
	hex: /^[0-9a-fA-F]+$/,
	octal: /^[0-7]+$/
};

const OCTET_FORMAT: Record<AddressBase, (octet: number) => string> = {
	decimal: octet => octet.toString(),
	binary: octet => octet.toString(2).padStart(8, "0"),
	hex: octet => octet.toString(16).padStart(2, "0").toUpperCase(),
	octal: octet => octet.toString(8)
};

// Parses a dotted IPv4 address in the given notation (`192.168.1.10`, `11000000.10101000.00000001.00001010`, `C0.A8.01.0A` or `300.250.1.12`)
// Into its 32-bit value, or `null` when the input is not valid in that notation
export function parseAddress(input: string, base: AddressBase): number | null {
	const parts = input.trim().split(".");
	if (parts.length !== 4) return null;

	let value = 0;

	for (const part of parts) {
		if (!OCTET_CHARS[base].test(part)) return null;

		const octet = Number.parseInt(part, RADIX[base]);
		if (octet > 255) return null;

		value = ((value << 8) | octet) >>> 0;
	}

	return value;
}

// Formats a 32-bit value as a dotted IPv4 address in the given notation
// For example `3232235786` -> `192.168.1.10` in decimal or `C0.A8.01.0A` in hex
export function formatAddress(value: number, base: AddressBase): string {
	return [24, 16, 8, 0].map(shift => OCTET_FORMAT[base]((value >>> shift) & 255)).join(".");
}

// Parses the plain integer form of an address, the 32-bit number the dotted notations are built from
// For example `3232235786` for `192.168.1.10`, or null when it is not a whole number in the 0-4294967295 range
export function parseIntegerAddress(input: string): number | null {
	const trimmed = input.trim();
	if (!/^\d+$/.test(trimmed)) return null;

	const value = Number(trimmed);
	return value <= 0xffffffff ? value : null;
}

// Formats a 32-bit value as its plain integer form, without dots or any other separator
// For example `3232235786` for `192.168.1.10`
export function formatIntegerAddress(value: number): string {
	return value.toString();
}

// Numeric subnet mask for a CIDR prefix length (0-32)
// For example `16` -> `4294901760`, which is `255.255.0.0` in dotted decimal
export function cidrToMask(prefix: number): number {
	return prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
}

// Dotted decimal subnet mask for a CIDR prefix length (0-32)
// For example `24` -> `255.255.255.0`
export function formatMask(prefix: number): string {
	return formatAddress(cidrToMask(prefix), "decimal");
}

// Parses a dotted decimal subnet mask (for example `255.255.255.0`)
// Into its CIDR prefix length, or `null` when the octets do not form a contiguous mask (so `255.0.255.0` is rejected)
export function parseMask(input: string): number | null {
	const mask = parseAddress(input, "decimal");
	if (mask === null) return null;

	let prefix = 0;
	while (prefix < 32 && ((mask >>> (31 - prefix)) & 1) === 1) prefix++;

	return mask === cidrToMask(prefix) ? prefix : null;
}

// Parses a CIDR prefix length (for example `/24`; the slash is optional)
// Into a number from 0 to 32, or `null` when it is not a valid prefix length (leading zeros like `/01` are rejected)
export function parseCidr(input: string): number | null {
	const digits = input.trim().replace(/^\//, "");
	if (!/^(?:\d|[12]\d|3[0-2])$/.test(digits)) return null;

	return Number(digits);
}

// Percent-encodes an entire URI, only the characters that are not allowed in a URI are escaped so separators like /, ? and & are kept
// For example `example.com/hello world` -> `example.com/hello%20world`
export function encodeUri(input: string): string {
	return encodeURI(input);
}

// Decodes a percent-encoded entire URI back into its plain form
// For example `example.com/hello%20world` -> `example.com/hello world`, or `null` when an escape is malformed like `%2` or `%ZZ`
export function decodeUri(input: string): string | null {
	try {
		return decodeURI(input);
	} catch {
		return null;
	}
}

// Percent-encodes a URI component, every character outside the unreserved set is escaped so the result is safe to embed inside a URI
// For example `example.com/hello world` -> `example.com%2Fhello%20world`
export function encodeUriComponent(input: string): string {
	return encodeURIComponent(input);
}

// Decodes a percent-encoded URI component back into its plain form
// For example `example.com%2Fhello%20world` -> `example.com/hello world`, or `null` when an escape is malformed like `%2` or `%ZZ`
export function decodeUriComponent(input: string): string | null {
	try {
		return decodeURIComponent(input);
	} catch {
		return null;
	}
}
