// Matches a plain IPv4 address with an optional CIDR mask (0-32).
export const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\/(?:3[0-2]|[12]?\d))?$/;

export type SubnetRow = {
	label: string;
	// Formatted value, `null` when the field does not exist for this prefix length.
	value: string | null;
	// Binary representation of the value, `null` when the field has no binary toggle.
	binary: string | null;
};

type SpecialPurposeBlock = {
	start: number;
	end: number;
	prefix: number;
	name: string;
};

// IANA IPv4 Special-Purpose Address Registry.
const SPECIAL_PURPOSE_TABLE: [cidr: string, name: string][] = [
	["0.0.0.0/8", "This network"],
	["0.0.0.0/32", "This host on this network"],
	["10.0.0.0/8", "Private-Use"],
	["100.64.0.0/10", "Shared Address Space"],
	["127.0.0.0/8", "Loopback"],
	["169.254.0.0/16", "Link Local"],
	["172.16.0.0/12", "Private-Use"],
	["192.0.0.0/24", "IETF Protocol Assignments"],
	["192.0.0.0/29", "IPv4 Service Continuity Prefix"],
	["192.0.0.8/32", "IPv4 dummy address"],
	["192.0.0.9/32", "Port Control Protocol Anycast"],
	["192.0.0.10/32", "Traversal Using Relays around NAT Anycast"],
	["192.0.0.170/32", "NAT64/DNS64 Discovery"],
	["192.0.0.171/32", "NAT64/DNS64 Discovery"],
	["192.0.2.0/24", "Documentation (TEST-NET-1)"],
	["192.31.196.0/24", "AS112-v4"],
	["192.52.193.0/24", "AMT"],
	["192.88.99.0/24", "Deprecated (6to4 Relay Anycast)"],
	["192.88.99.2/32", "6a44-relay anycast address"],
	["192.168.0.0/16", "Private-Use"],
	["192.175.48.0/24", "Direct Delegation AS112 Service"],
	["198.18.0.0/15", "Benchmarking"],
	["198.51.100.0/24", "Documentation (TEST-NET-2)"],
	["203.0.113.0/24", "Documentation (TEST-NET-3)"],
	["240.0.0.0/4", "Reserved"],
	["255.255.255.255/32", "Limited Broadcast"]
];

function toIPv4(value: number) {
	return [24, 16, 8, 0].map(shift => ((value >>> shift) & 255).toString()).join(".");
}

function toBinary(value: number) {
	return [24, 16, 8, 0].map(shift => ((value >>> shift) & 255).toString(2).padStart(8, "0")).join(".");
}

function toInt(address: string) {
	return address.split(".").reduce((acc, octet) => ((acc << 8) | Number(octet)) >>> 0, 0);
}

function ipClass(firstOctet: number) {
	if (firstOctet <= 127) return "A";
	if (firstOctet <= 191) return "B";
	if (firstOctet <= 223) return "C";
	if (firstOctet <= 239) return "D (Multicast)";
	return "E (Reserved)";
}

const SPECIAL_PURPOSE_BLOCKS: SpecialPurposeBlock[] = SPECIAL_PURPOSE_TABLE.map(([cidr, name]) => {
	const [address, prefix] = cidr.split("/");
	const prefixLength = Number(prefix);
	const start = toInt(address);
	const subnetMask = prefixLength === 0 ? 0 : (0xffffffff << (32 - prefixLength)) >>> 0;

	return {start, end: (start | (~subnetMask >>> 0)) >>> 0, prefix: prefixLength, name};
});

/**
 * Name of the IANA special-purpose space the given range belongs to, suffixed
 * with "(partially)" when the range only overlaps the space instead of being
 * fully inside it, or `null` when there is no match.
 *
 * The space sharing the most addresses with the range wins, with the most
 * specific space breaking ties (so 0.0.0.0/32 beats 0.0.0.0/8).
 */
function specialPurpose(rangeStart: number, rangeEnd: number) {
	let bestBlock: SpecialPurposeBlock | null = null;
	let bestOverlap = 0;

	for (const block of SPECIAL_PURPOSE_BLOCKS) {
		if (block.start > rangeEnd || block.end < rangeStart) continue;

		// A block fully containing the range overlaps it entirely, so the
		// widest overlap means the closest fit and the most specific block
		// breaks ties (so 0.0.0.0/32 beats 0.0.0.0/8).
		const overlap = Math.min(block.end, rangeEnd) - Math.max(block.start, rangeStart) + 1;

		if (bestBlock === null || overlap > bestOverlap || (overlap === bestOverlap && block.prefix > bestBlock.prefix)) {
			bestBlock = block;
			bestOverlap = overlap;
		}
	}

	if (bestBlock === null) return null;

	const contained = bestBlock.start <= rangeStart && bestBlock.end >= rangeEnd;

	return contained ? bestBlock.name : `${bestBlock.name} (partially)`;
}

/**
 * Validates an IPv4 address with an optional CIDR mask (defaults to /32) and
 * returns the rows to display, or `null` when the input is not valid.
 */
export function calculateSubnet(input: string): SubnetRow[] | null {
	const trimmed = input.trim();

	if (!IPV4_REGEX.test(trimmed)) return null;

	const [address, mask = "32"] = trimmed.split("/");
	const prefixLength = Number(mask);
	const octets = address.split(".").map(Number);

	const ip = octets.reduce((acc, octet) => ((acc << 8) | octet) >>> 0, 0);
	const subnetMask = prefixLength === 0 ? 0 : (0xffffffff << (32 - prefixLength)) >>> 0;
	const wildcardMask = ~subnetMask >>> 0;
	const network = (ip & subnetMask) >>> 0;
	// Networks longer than /30 (point-to-point /31 and host /32) have no broadcast address.
	const hasBroadcast = prefixLength <= 30;
	const broadcast = (network | wildcardMask) >>> 0;
	const size = 2 ** (32 - prefixLength);
	const lastAddress = (network + size - 1) >>> 0;
	// Only assignable addresses: everything between the network and broadcast ones.
	const hosts = hasBroadcast ? size - 2 : size;
	const firstHost = hasBroadcast ? network + 1 : network;
	const lastHost = hasBroadcast ? broadcast - 1 : lastAddress;

	return [
		{label: "Network Address", value: toIPv4(network), binary: toBinary(network)},
		{label: "Broadcast Address", value: hasBroadcast ? toIPv4(broadcast) : null, binary: hasBroadcast ? toBinary(broadcast) : null},
		{label: "Network Mask", value: toIPv4(subnetMask), binary: toBinary(subnetMask)},
		{label: "Network Mask (CIDR)", value: `/${prefixLength}`, binary: null},
		{label: "Wildcard Mask", value: toIPv4(wildcardMask), binary: toBinary(wildcardMask)},
		{label: "Network Size", value: size.toLocaleString("en-US"), binary: null},
		{label: "Available Hosts", value: hosts.toLocaleString("en-US"), binary: null},
		{label: "Address Range", value: `${toIPv4(firstHost)} - ${toIPv4(lastHost)}`, binary: `${toBinary(firstHost)} - ${toBinary(lastHost)}`},
		{label: "IP Class", value: ipClass(octets[0]), binary: null},
		{label: "IANA Special Purpose", value: specialPurpose(network, lastAddress), binary: null}
	];
}
