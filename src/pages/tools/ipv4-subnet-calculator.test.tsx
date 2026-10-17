// @vitest-environment jsdom
import IPv4SubnetCalculator from "@/pages/tools/ipv4-subnet-calculator";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {describe, expect, it} from "vitest";

describe("IPv4SubnetCalculator", () => {
	it("calculates the network details of an address with a mask", async () => {
		const user = userEvent.setup();
		render(<IPv4SubnetCalculator />);

		await user.type(screen.getByLabelText("Address"), "192.168.1.10/24");

		expect(screen.getByText("192.168.1.0")).toBeInTheDocument();
		expect(screen.getByText("192.168.1.255")).toBeInTheDocument();
		expect(screen.getByText("255.255.255.0")).toBeInTheDocument();
		expect(screen.getByText("/24")).toBeInTheDocument();
		expect(screen.getByText("0.0.0.255")).toBeInTheDocument();
		expect(screen.getByText("256")).toBeInTheDocument();
		expect(screen.getByText("254")).toBeInTheDocument();
		expect(screen.getByText("192.168.1.1 - 192.168.1.254")).toBeInTheDocument();
		expect(screen.getByText("C")).toBeInTheDocument();
		expect(screen.getByText("Private-Use")).toBeInTheDocument();
	});

	it("defaults the mask to /32", async () => {
		const user = userEvent.setup();
		render(<IPv4SubnetCalculator />);

		await user.type(screen.getByLabelText("Address"), "10.0.0.5");

		expect(screen.getByText("/32")).toBeInTheDocument();
		expect(screen.getByText("10.0.0.5")).toBeInTheDocument();
		// A /32 holds one address, both the size and the usable hosts rows say 1
		expect(screen.getAllByText("1")).toHaveLength(2);
		// ...and it has no broadcast address, the row shows the em dash
		expect(screen.getByText("—")).toBeInTheDocument();
	});

	it("toggles a row between dotted decimal and binary", async () => {
		const user = userEvent.setup();
		render(<IPv4SubnetCalculator />);

		await user.type(screen.getByLabelText("Address"), "192.168.1.10/24");

		await user.click(screen.getByRole("button", {name: "Show Network Address in binary"}));

		expect(screen.getByText("11000000.10101000.00000001.00000000")).toBeInTheDocument();
		expect(screen.queryByText("192.168.1.0")).toBeNull();

		await user.click(screen.getByRole("button", {name: "Show Network Address in dotted decimal"}));

		expect(screen.getByText("192.168.1.0")).toBeInTheDocument();
	});

	it("flags an invalid address and hides the table", async () => {
		const user = userEvent.setup();
		render(<IPv4SubnetCalculator />);

		const address = screen.getByLabelText("Address") as HTMLInputElement;

		await user.type(address, "192.168.1.10/24");
		expect(screen.getByText("Network Address")).toBeInTheDocument();

		await user.clear(address);
		await user.type(address, "999.168.1.10");

		expect(address.ariaInvalid).toBe("true");
		expect(screen.getByText("Enter a valid IPv4 address with an optional CIDR mask, for example 192.168.1.10/24")).toBeInTheDocument();
		expect(screen.queryByText("Network Address")).toBeNull();

		await user.clear(address);
		expect(screen.queryByText("Network Address")).toBeNull();
		expect(screen.getByText("The CIDR mask is optional and defaults to /32.")).toBeInTheDocument();
	});
});
