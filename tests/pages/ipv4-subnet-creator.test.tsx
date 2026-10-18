// @vitest-environment jsdom
import IPv4SubnetCreator from "@/pages/tools/ipv4-subnet-creator";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {describe, expect, it} from "vitest";

const baseField = () => screen.getByLabelText("Base IP") as HTMLInputElement;
const hostsField = () => screen.getByLabelText("Hosts") as HTMLInputElement;

async function fill(user: ReturnType<typeof userEvent.setup>, base: string, hosts: string) {
	await user.type(baseField(), base);
	await user.type(hostsField(), hosts);
}

describe("IPv4SubnetCreator", () => {
	it("builds the smallest subnet that fits the hosts and moves an unaligned base down", async () => {
		const user = userEvent.setup();
		render(<IPv4SubnetCreator />);

		await fill(user, "192.168.1.10", "30");

		expect(screen.getByText("192.168.1.10 is not the first address of a /27, so the closest network that still contains it is 192.168.1.0/27.")).toBeInTheDocument();
		expect(screen.getByText("192.168.1.0")).toBeInTheDocument();
		expect(screen.getByText("/27")).toBeInTheDocument();
		expect(screen.getByText("255.255.255.224")).toBeInTheDocument();
		expect(screen.getByText("32")).toBeInTheDocument();
	});

	it("keeps a base address that already sits on a network boundary", async () => {
		const user = userEvent.setup();
		render(<IPv4SubnetCreator />);

		await fill(user, "192.168.1.64", "30");

		expect(screen.queryByText(/is not the first address/)).toBeNull();
		expect(screen.getByText("192.168.1.64")).toBeInTheDocument();
		expect(screen.getByText("/27")).toBeInTheDocument();
	});

	it("builds a /31 and a /32 for two and one hosts", async () => {
		const user = userEvent.setup();
		render(<IPv4SubnetCreator />);

		await fill(user, "10.0.0.5", "2");

		expect(screen.getByText("/31")).toBeInTheDocument();
		expect(screen.getByText("10.0.0.4")).toBeInTheDocument();

		await user.clear(hostsField());
		await user.type(hostsField(), "1");

		expect(screen.getByText("/32")).toBeInTheDocument();
		expect(screen.getByText("10.0.0.5")).toBeInTheDocument();
	});

	it("flags a base address that carries a mask", async () => {
		const user = userEvent.setup();
		render(<IPv4SubnetCreator />);

		await fill(user, "1.2.3.4/24", "30");

		expect(baseField().ariaInvalid).toBe("true");
		expect(hostsField().ariaInvalid).toBe("false");
		expect(screen.getByText("Enter a plain IPv4 address without a mask, for example 192.168.1.10.")).toBeInTheDocument();
		expect(screen.queryByText(/is not the first address/)).toBeNull();
	});

	it("flags a host count that is not a plain number in range", async () => {
		const user = userEvent.setup();
		render(<IPv4SubnetCreator />);

		await fill(user, "192.168.1.1", "0");

		expect(hostsField().ariaInvalid).toBe("true");
		expect(baseField().ariaInvalid).toBe("false");
		expect(screen.getByText("Enter a whole number of hosts between 1 and 4,294,967,294.")).toBeInTheDocument();

		await user.clear(hostsField());
		await user.type(hostsField(), "30");

		expect(hostsField().ariaInvalid).toBe("false");
		expect(screen.getByText("/27")).toBeInTheDocument();
	});
});
