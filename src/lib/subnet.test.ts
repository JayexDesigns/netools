import {describe, expect, it} from "vitest";
import {calculateSubnet, createSubnet, hostsToPrefix, prefixCapacity, type SubnetRow} from "@/lib/subnet";

// Indexes the rows of a calculated subnet by their label for readable assertions
function rowsByLabel(rows: SubnetRow[]): Record<string, SubnetRow> {
	return Object.fromEntries(rows.map(row => [row.label, row]));
}

describe("calculateSubnet", () => {
	it("calculates every field of a /24 network", () => {
		const rows = rowsByLabel(calculateSubnet("192.168.1.10/24")!);

		expect(rows["Network Address"].value).toBe("192.168.1.0");
		expect(rows["Broadcast Address"].value).toBe("192.168.1.255");
		expect(rows["Network Mask"].value).toBe("255.255.255.0");
		expect(rows["Network Mask (CIDR)"].value).toBe("/24");
		expect(rows["Wildcard Mask"].value).toBe("0.0.0.255");
		expect(rows["Network Size"].value).toBe("256");
		expect(rows["Available Hosts"].value).toBe("254");
		expect(rows["Host Address Range"].value).toBe("192.168.1.1 - 192.168.1.254");
		expect(rows["IP Class"].value).toBe("C");
		expect(rows["IANA Special Purpose"].value).toBe("Private-Use");
	});

	it("provides the binary form where it makes sense", () => {
		const rows = rowsByLabel(calculateSubnet("192.168.1.10/24")!);

		expect(rows["Network Address"].binary).toBe("11000000.10101000.00000001.00000000");
		expect(rows["Network Mask"].binary).toBe("11111111.11111111.11111111.00000000");
		expect(rows["Host Address Range"].binary).toBe("11000000.10101000.00000001.00000001 - 11000000.10101000.00000001.11111110");
		expect(rows["Network Mask (CIDR)"].binary).toBeNull();
		expect(rows["Available Hosts"].binary).toBeNull();
	});

	it("defaults to /32 when the address carries no mask", () => {
		const rows = rowsByLabel(calculateSubnet("10.0.0.5")!);

		expect(rows["Network Address"].value).toBe("10.0.0.5");
		expect(rows["Network Mask (CIDR)"].value).toBe("/32");
		expect(rows["Network Mask"].value).toBe("255.255.255.255");
		expect(rows["Network Size"].value).toBe("1");
		expect(rows["Available Hosts"].value).toBe("1");
		expect(rows["Host Address Range"].value).toBe("10.0.0.5 - 10.0.0.5");
	});

	it("ignores surrounding whitespace", () => {
		expect(calculateSubnet("  192.168.1.10/24  ")).not.toBeNull();
	});

	it("gives a /31 two usable addresses and no broadcast (RFC 3021)", () => {
		const rows = rowsByLabel(calculateSubnet("10.0.0.0/31")!);

		expect(rows["Broadcast Address"].value).toBeNull();
		expect(rows["Network Size"].value).toBe("2");
		expect(rows["Available Hosts"].value).toBe("2");
		expect(rows["Host Address Range"].value).toBe("10.0.0.0 - 10.0.0.1");
	});

	it("gives a /30 four addresses and two usable ones", () => {
		const rows = rowsByLabel(calculateSubnet("192.168.1.0/30")!);

		expect(rows["Broadcast Address"].value).toBe("192.168.1.3");
		expect(rows["Available Hosts"].value).toBe("2");
		expect(rows["Host Address Range"].value).toBe("192.168.1.1 - 192.168.1.2");
	});

	it("spans the whole address space at /0", () => {
		const rows = rowsByLabel(calculateSubnet("0.0.0.0/0")!);

		expect(rows["Network Address"].value).toBe("0.0.0.0");
		expect(rows["Broadcast Address"].value).toBe("255.255.255.255");
		expect(rows["Network Mask"].value).toBe("0.0.0.0");
		expect(rows["Wildcard Mask"].value).toBe("255.255.255.255");
		expect(rows["Network Size"].value).toBe("4,294,967,296");
		expect(rows["Available Hosts"].value).toBe("4,294,967,294");
		expect(rows["Host Address Range"].value).toBe("0.0.0.1 - 255.255.255.254");
	});

	it("rounds the network down to the closest boundary below the address", () => {
		const rows = rowsByLabel(calculateSubnet("10.20.30.40/16")!);

		expect(rows["Network Address"].value).toBe("10.20.0.0");
		expect(rows["Broadcast Address"].value).toBe("10.20.255.255");
	});

	it("names the address class of the input", () => {
		const classOf = (input: string) => rowsByLabel(calculateSubnet(input)!)["IP Class"].value;

		expect(classOf("1.2.3.4")).toBe("A");
		expect(classOf("127.0.0.1")).toBe("A");
		expect(classOf("128.1.1.1")).toBe("B");
		expect(classOf("191.255.255.255")).toBe("B");
		expect(classOf("192.168.1.1")).toBe("C");
		expect(classOf("223.255.255.255")).toBe("C");
		expect(classOf("224.0.0.1")).toBe("D (Multicast)");
		expect(classOf("239.1.1.1")).toBe("D (Multicast)");
		expect(classOf("240.0.0.1")).toBe("E (Reserved)");
		expect(classOf("255.255.255.255")).toBe("E (Reserved)");
	});

	describe("IANA special purpose lookup", () => {
		const specialOf = (input: string) => rowsByLabel(calculateSubnet(input)!)["IANA Special Purpose"].value;

		it("names the special-purpose space the network falls in", () => {
			expect(specialOf("10.1.2.3")).toBe("Private-Use");
			expect(specialOf("172.16.0.1")).toBe("Private-Use");
			expect(specialOf("172.31.255.254")).toBe("Private-Use");
			expect(specialOf("192.168.1.10/16")).toBe("Private-Use");
			expect(specialOf("100.64.0.1")).toBe("Shared Address Space");
			expect(specialOf("127.0.0.1")).toBe("Loopback");
			expect(specialOf("169.254.1.1")).toBe("Link Local");
			expect(specialOf("192.0.2.10")).toBe("Documentation (TEST-NET-1)");
			expect(specialOf("198.51.100.7")).toBe("Documentation (TEST-NET-2)");
			expect(specialOf("203.0.113.7")).toBe("Documentation (TEST-NET-3)");
			expect(specialOf("198.18.0.1")).toBe("Benchmarking");
			expect(specialOf("0.0.0.0/32")).toBe("This host on this network");
			expect(specialOf("255.255.255.255")).toBe("Limited Broadcast");
		});

		it("marks a network that only overlaps a special-purpose space as partial", () => {
			expect(specialOf("192.168.0.0/15")).toBe("Private-Use (partially)");
			expect(specialOf("172.16.0.0/11")).toBe("Private-Use (partially)");
			expect(specialOf("100.64.0.0/9")).toBe("Shared Address Space (partially)");
		});

		it("returns null for ordinary address space", () => {
			expect(specialOf("8.8.8.8")).toBeNull();
			expect(specialOf("1.1.1.1/8")).toBeNull();
			expect(specialOf("172.32.0.1")).toBeNull();
			expect(specialOf("100.128.0.1")).toBeNull();
		});
	});

	it("rejects inputs that are not an IPv4 address with an optional mask", () => {
		expect(calculateSubnet("")).toBeNull();
		expect(calculateSubnet("   ")).toBeNull();
		expect(calculateSubnet("999.1.1.1")).toBeNull();
		expect(calculateSubnet("192.168.1")).toBeNull();
		expect(calculateSubnet("192.168.1.1.1")).toBeNull();
		expect(calculateSubnet("192.168.1.1/33")).toBeNull();
		expect(calculateSubnet("192.168.1.1/")).toBeNull();
		expect(calculateSubnet("192.168.1.1/24/8")).toBeNull();
		expect(calculateSubnet("192.168.1.1/01")).toBeNull();
		expect(calculateSubnet("abc")).toBeNull();
		expect(calculateSubnet("::1")).toBeNull();
		expect(calculateSubnet("192.168.1.256")).toBeNull();
	});
});

describe("prefixCapacity", () => {
	it("counts 1 and 2 hosts for /32 and /31", () => {
		expect(prefixCapacity(32)).toBe(1);
		expect(prefixCapacity(31)).toBe(2);
	});

	it("reserves the network and broadcast addresses of longer subnets", () => {
		expect(prefixCapacity(30)).toBe(2);
		expect(prefixCapacity(29)).toBe(6);
		expect(prefixCapacity(27)).toBe(30);
		expect(prefixCapacity(24)).toBe(254);
		expect(prefixCapacity(16)).toBe(65534);
		expect(prefixCapacity(0)).toBe(4294967294);
	});
});

describe("hostsToPrefix", () => {
	it("picks the shortest prefix that fits the hosts", () => {
		expect(hostsToPrefix(1)).toBe(32);
		expect(hostsToPrefix(2)).toBe(31);
		expect(hostsToPrefix(3)).toBe(29);
		expect(hostsToPrefix(30)).toBe(27);
		expect(hostsToPrefix(31)).toBe(26);
		expect(hostsToPrefix(254)).toBe(24);
		expect(hostsToPrefix(255)).toBe(23);
		expect(hostsToPrefix(65536)).toBe(15);
		expect(hostsToPrefix(4294967294)).toBe(0);
	});

	it("rejects amounts that no subnet can hold", () => {
		expect(hostsToPrefix(0)).toBeNull();
		expect(hostsToPrefix(-5)).toBeNull();
		expect(hostsToPrefix(4294967295)).toBeNull();
		expect(hostsToPrefix(2.5)).toBeNull();
		expect(hostsToPrefix(Number.NaN)).toBeNull();
	});
});

describe("createSubnet", () => {
	it("moves an unaligned address down to the closest network", () => {
		const result = createSubnet("192.168.1.10", "30") as Exclude<ReturnType<typeof createSubnet>, {error: string}>;

		expect(result.adjusted).toBe(true);
		expect(result.network).toBe("192.168.1.0");
		expect(result.prefix).toBe(27);

		const rows = rowsByLabel(result.rows);
		expect(rows["Network Address"].value).toBe("192.168.1.0");
		expect(rows["Network Mask (CIDR)"].value).toBe("/27");
		expect(rows["Available Hosts"].value).toBe("30");
	});

	it("keeps an address that already sits on a network boundary", () => {
		const result = createSubnet("192.168.1.64", "30") as Exclude<ReturnType<typeof createSubnet>, {error: string}>;

		expect(result.adjusted).toBe(false);
		expect(result.network).toBe("192.168.1.64");
		expect(result.prefix).toBe(27);
	});

	it("builds /32, /31 and /29 subnets for 1, 2 and 3 hosts", () => {
		const one = createSubnet("10.0.0.5", "1") as Exclude<ReturnType<typeof createSubnet>, {error: string}>;
		expect(one.prefix).toBe(32);
		expect(one.network).toBe("10.0.0.5");
		expect(one.adjusted).toBe(false);

		const two = createSubnet("10.0.0.5", "2") as Exclude<ReturnType<typeof createSubnet>, {error: string}>;
		expect(two.prefix).toBe(31);
		expect(two.network).toBe("10.0.0.4");
		expect(two.adjusted).toBe(true);

		const three = createSubnet("10.0.0.5", "3") as Exclude<ReturnType<typeof createSubnet>, {error: string}>;
		expect(three.prefix).toBe(29);
		expect(three.network).toBe("10.0.0.0");
		expect(three.adjusted).toBe(true);
	});

	it("builds huge subnets for huge host counts", () => {
		const many = createSubnet("8.8.8.8", "65536") as Exclude<ReturnType<typeof createSubnet>, {error: string}>;
		expect(many.prefix).toBe(15);
		expect(many.network).toBe("8.8.0.0");
		expect(many.adjusted).toBe(true);

		const all = createSubnet("1.2.3.4", "4294967294") as Exclude<ReturnType<typeof createSubnet>, {error: string}>;
		expect(all.prefix).toBe(0);
		expect(all.network).toBe("0.0.0.0");
		expect(all.adjusted).toBe(true);
	});

	it("rejects a base address that is masked or malformed", () => {
		expect(createSubnet("192.168.1.1/24", "30")).toEqual({error: "base"});
		expect(createSubnet("999.1.1.1", "30")).toEqual({error: "base"});
		expect(createSubnet("not an ip", "30")).toEqual({error: "base"});
	});

	it("rejects a host count that is not a plain whole number in range", () => {
		expect(createSubnet("192.168.1.1", "0")).toEqual({error: "hosts"});
		expect(createSubnet("192.168.1.1", "-3")).toEqual({error: "hosts"});
		expect(createSubnet("192.168.1.1", "1,000")).toEqual({error: "hosts"});
		expect(createSubnet("192.168.1.1", "01")).toEqual({error: "hosts"});
		expect(createSubnet("192.168.1.1", "30 hosts")).toEqual({error: "hosts"});
		expect(createSubnet("192.168.1.1", "2.5")).toEqual({error: "hosts"});
		expect(createSubnet("192.168.1.1", "4294967295")).toEqual({error: "hosts"});
	});
});
