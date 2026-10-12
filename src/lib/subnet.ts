import {cidrToMask, formatAddress, parseAddress} from "@/lib/converter";

// Matches a plain IPv4 address with an optional CIDR mask (0-32)
export const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\/(?:3[0-2]|[12]?\d))?$/;

export type SubnetRow = {
	label: string;
	value: string | null;
	// Can be null if the current input can't map to a value
	binary: string | null;
	// Can be null if the current value can't or shouldn't have a binary representation
};

type SpecialPurposeBlock = {
	start: number;
	end: number;
	prefix: number;
	name: string;
};

// IANA IPv4 Special-Purpose Address Registry
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
	const start = parseAddress(address, "decimal");
	if (start === null) throw new Error(`Invalid special-purpose address: ${address}`);
	const subnetMask = cidrToMask(prefixLength);

	return {start, end: (start | (~subnetMask >>> 0)) >>> 0, prefix: prefixLength, name};
});

// Name of the IANA special-purpose space the given range belongs to
// Suffixed with "(partially)" when the range only overlaps the space instead of being fully inside it
// Or `null` when there is no match
function specialPurpose(rangeStart: number, rangeEnd: number) {
	let bestBlock: SpecialPurposeBlock | null = null;
	let bestOverlap = 0;

	for (const block of SPECIAL_PURPOSE_BLOCKS) {
		if (block.start > rangeEnd || block.end < rangeStart) continue;

		// A block fully containing the range overlaps it entirely
		// So the widest overlap means the closest fit and the most specific block breaks ties (so 0.0.0.0/32 beats 0.0.0.0/8)
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

export function calculateSubnet(input: string): SubnetRow[] | null {
	const trimmed = input.trim();

	if (!IPV4_REGEX.test(trimmed)) return null;

	const [address, mask = "32"] = trimmed.split("/");
	const prefixLength = Number(mask);
	// The regex above already guarantees a valid dotted decimal address
	const ip = parseAddress(address, "decimal");
	if (ip === null) return null;

	const subnetMask = cidrToMask(prefixLength);
	const wildcardMask = ~subnetMask >>> 0;
	const network = (ip & subnetMask) >>> 0;
	// Networks longer than /30 (point-to-point /31 and host /32) have no broadcast address
	const hasBroadcast = prefixLength <= 30;
	const broadcast = (network | wildcardMask) >>> 0;
	const size = 2 ** (32 - prefixLength);
	const lastAddress = (network + size - 1) >>> 0;
	// Only assignable addresses: everything between the network and broadcast ones
	const hosts = hasBroadcast ? size - 2 : size;
	const firstHost = hasBroadcast ? network + 1 : network;
	const lastHost = hasBroadcast ? broadcast - 1 : lastAddress;

	return [
		{label: "Network Address", value: formatAddress(network, "decimal"), binary: formatAddress(network, "binary")},
		{label: "Broadcast Address", value: hasBroadcast ? formatAddress(broadcast, "decimal") : null, binary: hasBroadcast ? formatAddress(broadcast, "binary") : null},
		{label: "Network Mask", value: formatAddress(subnetMask, "decimal"), binary: formatAddress(subnetMask, "binary")},
		{label: "Network Mask (CIDR)", value: `/${prefixLength}`, binary: null},
		{label: "Wildcard Mask", value: formatAddress(wildcardMask, "decimal"), binary: formatAddress(wildcardMask, "binary")},
		{label: "Network Size", value: size.toLocaleString("en-US"), binary: null},
		{label: "Available Hosts", value: hosts.toLocaleString("en-US"), binary: null},
		{label: "Host Address Range", value: `${formatAddress(firstHost, "decimal")} - ${formatAddress(lastHost, "decimal")}`, binary: `${formatAddress(firstHost, "binary")} - ${formatAddress(lastHost, "binary")}`},
		{label: "IP Class", value: ipClass((ip >>> 24) & 255), binary: null},
		{label: "IANA Special Purpose", value: specialPurpose(network, lastAddress), binary: null}
	];
}
