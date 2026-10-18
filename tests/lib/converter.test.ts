import {describe, expect, it} from "vitest";
import {cidrToMask, decodeUri, decodeUriComponent, encodeUri, encodeUriComponent, formatAddress, formatIntegerAddress, formatMask, parseAddress, parseCidr, parseIntegerAddress, parseMask, type AddressBase} from "@/lib/converter";

const ALL_BASES: AddressBase[] = ["decimal", "binary", "hex", "octal"];

// The same address written in each of the four dotted notations and as a plain integer
const KNOWN_ADDRESS = {
	value: 3232235786,
	decimal: "192.168.1.10",
	binary: "11000000.10101000.00000001.00001010",
	hex: "C0.A8.01.0A",
	octal: "300.250.1.12"
};

describe("parseAddress", () => {
	it("parses a dotted decimal address", () => {
		expect(parseAddress("192.168.1.10", "decimal")).toBe(KNOWN_ADDRESS.value);
		expect(parseAddress("0.0.0.0", "decimal")).toBe(0);
		expect(parseAddress("255.255.255.255", "decimal")).toBe(0xffffffff);
	});

	it("parses binary, hexadecimal and octal notations to the same value", () => {
		expect(parseAddress(KNOWN_ADDRESS.binary, "binary")).toBe(KNOWN_ADDRESS.value);
		expect(parseAddress(KNOWN_ADDRESS.hex, "hex")).toBe(KNOWN_ADDRESS.value);
		expect(parseAddress(KNOWN_ADDRESS.octal, "octal")).toBe(KNOWN_ADDRESS.value);
	});

	it("accepts lowercase hex and padded octets", () => {
		expect(parseAddress("c0.a8.01.0a", "hex")).toBe(KNOWN_ADDRESS.value);
		expect(parseAddress("192.168.001.010", "decimal")).toBe(KNOWN_ADDRESS.value);
	});

	it("ignores surrounding whitespace", () => {
		expect(parseAddress("  192.168.1.10  ", "decimal")).toBe(KNOWN_ADDRESS.value);
	});

	it("rejects an address that is not split into four octets", () => {
		expect(parseAddress("192.168.1", "decimal")).toBeNull();
		expect(parseAddress("192.168.1.1.1", "decimal")).toBeNull();
		expect(parseAddress("", "decimal")).toBeNull();
	});

	it("rejects octets above 255 in every notation", () => {
		expect(parseAddress("256.0.0.1", "decimal")).toBeNull();
		expect(parseAddress("999.999.999.999", "decimal")).toBeNull();
		expect(parseAddress("1.1.1.100000000", "binary")).toBeNull();
		expect(parseAddress("100.0.0.1", "hex")).toBeNull();
		expect(parseAddress("400.0.0.1", "octal")).toBeNull();
	});

	it("rejects characters that do not belong to the notation", () => {
		expect(parseAddress("192.168.1.A", "decimal")).toBeNull();
		expect(parseAddress("192.168.1.2", "binary")).toBeNull();
		expect(parseAddress("192.168.1.GG", "hex")).toBeNull();
		expect(parseAddress("192.168.1.8", "octal")).toBeNull();
		expect(parseAddress("192.168.1.-1", "decimal")).toBeNull();
	});
});

describe("formatAddress", () => {
	it("formats a value in every notation", () => {
		expect(formatAddress(KNOWN_ADDRESS.value, "decimal")).toBe(KNOWN_ADDRESS.decimal);
		expect(formatAddress(KNOWN_ADDRESS.value, "binary")).toBe(KNOWN_ADDRESS.binary);
		expect(formatAddress(KNOWN_ADDRESS.value, "hex")).toBe(KNOWN_ADDRESS.hex);
		expect(formatAddress(KNOWN_ADDRESS.value, "octal")).toBe(KNOWN_ADDRESS.octal);
	});

	it("pads binary and hex octets to their full width", () => {
		expect(formatAddress(0x01020304, "binary")).toBe("00000001.00000010.00000011.00000100");
		expect(formatAddress(0x01020304, "hex")).toBe("01.02.03.04");
		expect(formatAddress(0x01020304, "octal")).toBe("1.2.3.4");
	});

	it("round-trips through parseAddress in every notation", () => {
		for (const base of ALL_BASES) {
			expect(parseAddress(formatAddress(KNOWN_ADDRESS.value, base), base)).toBe(KNOWN_ADDRESS.value);
			expect(parseAddress(formatAddress(0, base), base)).toBe(0);
			expect(parseAddress(formatAddress(0xffffffff, base), base)).toBe(0xffffffff);
		}
	});
});

describe("parseIntegerAddress and formatIntegerAddress", () => {
	it("parses a plain 32-bit number", () => {
		expect(parseIntegerAddress("3232235786")).toBe(KNOWN_ADDRESS.value);
		expect(parseIntegerAddress("0")).toBe(0);
		expect(parseIntegerAddress("4294967295")).toBe(0xffffffff);
	});

	it("ignores surrounding whitespace and padded zeros", () => {
		expect(parseIntegerAddress("  3232235786  ")).toBe(KNOWN_ADDRESS.value);
		expect(parseIntegerAddress("03232235786")).toBe(KNOWN_ADDRESS.value);
	});

	it("rejects numbers outside the 32-bit range and non-integers", () => {
		expect(parseIntegerAddress("4294967296")).toBeNull();
		expect(parseIntegerAddress("-1")).toBeNull();
		expect(parseIntegerAddress("1.5")).toBeNull();
		expect(parseIntegerAddress("1e9")).toBeNull();
		expect(parseIntegerAddress("abc")).toBeNull();
		expect(parseIntegerAddress("")).toBeNull();
	});

	it("formats a value back to its plain integer form", () => {
		expect(formatIntegerAddress(KNOWN_ADDRESS.value)).toBe("3232235786");
		expect(formatIntegerAddress(0)).toBe("0");
	});
});

describe("cidrToMask and formatMask", () => {
	it("builds the dotted decimal mask for each prefix length", () => {
		expect(formatMask(0)).toBe("0.0.0.0");
		expect(formatMask(8)).toBe("255.0.0.0");
		expect(formatMask(9)).toBe("255.128.0.0");
		expect(formatMask(16)).toBe("255.255.0.0");
		expect(formatMask(24)).toBe("255.255.255.0");
		expect(formatMask(30)).toBe("255.255.255.252");
		expect(formatMask(32)).toBe("255.255.255.255");
	});

	it("returns the numeric mask", () => {
		expect(cidrToMask(24)).toBe(0xffffff00);
		expect(cidrToMask(0)).toBe(0);
		expect(cidrToMask(32)).toBe(0xffffffff);
	});
});

describe("parseMask", () => {
	it("parses every contiguous mask back to its prefix length", () => {
		for (let prefix = 0; prefix <= 32; prefix++) {
			expect(parseMask(formatMask(prefix))).toBe(prefix);
		}
	});

	it("rejects masks whose bits are not contiguous", () => {
		expect(parseMask("255.0.255.0")).toBeNull();
		expect(parseMask("255.255.255.1")).toBeNull();
		expect(parseMask("255.255.0.255")).toBeNull();
	});

	it("rejects malformed addresses", () => {
		expect(parseMask("256.255.255.0")).toBeNull();
		expect(parseMask("255.255.0")).toBeNull();
		expect(parseMask("")).toBeNull();
	});
});

describe("parseCidr", () => {
	it("parses a prefix length with or without the slash", () => {
		expect(parseCidr("/24")).toBe(24);
		expect(parseCidr("24")).toBe(24);
		expect(parseCidr("/0")).toBe(0);
		expect(parseCidr("/32")).toBe(32);
		expect(parseCidr("  /16  ")).toBe(16);
	});

	it("rejects out-of-range and malformed prefix lengths", () => {
		expect(parseCidr("/33")).toBeNull();
		expect(parseCidr("/-1")).toBeNull();
		expect(parseCidr("/01")).toBeNull();
		expect(parseCidr("/246")).toBeNull();
		expect(parseCidr("/")).toBeNull();
		expect(parseCidr("abc")).toBeNull();
		expect(parseCidr("")).toBeNull();
	});
});

describe("encodeUri and decodeUri", () => {
	it("escapes only the characters that are not allowed in a URI", () => {
		expect(encodeUri("example.com/hello world")).toBe("example.com/hello%20world");
		expect(encodeUri("example.com/search?q=net tools&lang=en")).toBe("example.com/search?q=net%20tools&lang=en");
	});

	it("round-trips a URI", () => {
		expect(decodeUri(encodeUri("https://example.com/a path/ünïcode?x=1 2"))).toBe("https://example.com/a path/ünïcode?x=1 2");
	});

	it("decodes percent escapes", () => {
		expect(decodeUri("example.com/hello%20world")).toBe("example.com/hello world");
	});

	it("returns null for malformed escapes", () => {
		expect(decodeUri("example.com/hello%2")).toBeNull();
		expect(decodeUri("example.com/%ZZ")).toBeNull();
	});
});

describe("encodeUriComponent and decodeUriComponent", () => {
	it("escapes every character outside the unreserved set", () => {
		expect(encodeUriComponent("example.com/hello world")).toBe("example.com%2Fhello%20world");
		expect(encodeUriComponent("a b+c/d")).toBe("a%20b%2Bc%2Fd");
	});

	it("round-trips a component", () => {
		expect(decodeUriComponent(encodeUriComponent("net tools & more?x=1"))).toBe("net tools & more?x=1");
	});

	it("returns null for malformed escapes", () => {
		expect(decodeUriComponent("%2")).toBeNull();
		expect(decodeUriComponent("%GG")).toBeNull();
	});
});
