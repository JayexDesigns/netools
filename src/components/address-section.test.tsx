// @vitest-environment jsdom
import AddressSection from "@/components/address-section";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {describe, expect, it} from "vitest";

const field = (label: string) => screen.getByLabelText(label) as HTMLInputElement;

describe("AddressSection", () => {
	it("converts a typed decimal address into every other representation", async () => {
		const user = userEvent.setup();
		render(<AddressSection />);

		await user.type(field("Decimal"), "192.168.1.10");

		expect(field("Binary").value).toBe("11000000.10101000.00000001.00001010");
		expect(field("Hexadecimal").value).toBe("C0.A8.01.0A");
		expect(field("Octal").value).toBe("300.250.1.12");
		expect(field("Integer").value).toBe("3232235786");
		expect(screen.getByText("Type in any field to convert the address to the other representations.")).toBeInTheDocument();
	});

	it("converts a typed octal address into the others", async () => {
		const user = userEvent.setup();
		render(<AddressSection />);

		await user.type(field("Octal"), "300.250.1.12");

		expect(field("Decimal").value).toBe("192.168.1.10");
		expect(field("Binary").value).toBe("11000000.10101000.00000001.00001010");
		expect(field("Integer").value).toBe("3232235786");
	});

	it("converts a typed integer into the dotted notations", async () => {
		const user = userEvent.setup();
		render(<AddressSection />);

		await user.type(field("Integer"), "134744072");

		expect(field("Decimal").value).toBe("8.8.8.8");
		expect(field("Hexadecimal").value).toBe("08.08.08.08");
		expect(field("Octal").value).toBe("10.10.10.10");
	});

	it("flags the field that cannot be parsed while the others keep their values", async () => {
		const user = userEvent.setup();
		render(<AddressSection />);

		await user.type(field("Decimal"), "192.168.1.10");
		await user.type(field("Decimal"), "x");

		expect(field("Decimal").ariaInvalid).toBe("true");
		expect(field("Binary").ariaInvalid).toBe("false");

		// The other fields keep their last valid values until the address parses again
		expect(field("Binary").value).toBe("11000000.10101000.00000001.00001010");
		expect(screen.getByText("Enter the address in the form you are editing, for example 192.168.1.10 or 3232235786.")).toBeInTheDocument();
	});

	it("drops the invalid state as soon as the field parses again", async () => {
		const user = userEvent.setup();
		render(<AddressSection />);

		await user.type(field("Binary"), "11000000.10101000.00000001.00001011");
		expect(field("Decimal").value).toBe("192.168.1.11");

		await user.clear(field("Binary"));
		await user.type(field("Binary"), "999");

		expect(field("Binary").ariaInvalid).toBe("true");
		expect(screen.getByText("Enter the address in the form you are editing, for example 192.168.1.10 or 3232235786.")).toBeInTheDocument();

		await user.clear(field("Binary"));
		await user.type(field("Binary"), "00000000.00000000.00000000.00000001");

		expect(field("Binary").ariaInvalid).toBe("false");
		expect(field("Decimal").value).toBe("0.0.0.1");
	});

	it("flags an integer outside the 32-bit range while keeping the octets of the last valid value", async () => {
		const user = userEvent.setup();
		render(<AddressSection />);

		await user.type(field("Integer"), "4294967296");

		expect(field("Integer").ariaInvalid).toBe("true");
		// The last digit makes the number overflow, but every shorter prefix of it was a valid address
		expect(field("Decimal").value).toBe("25.153.153.153");
		expect(screen.getByText("Enter the address in the form you are editing, for example 192.168.1.10 or 3232235786.")).toBeInTheDocument();
	});

	it("clears every field when one of them is emptied", async () => {
		const user = userEvent.setup();
		render(<AddressSection />);

		await user.type(field("Hexadecimal"), "C0.A8.01.0A");
		expect(field("Decimal").value).toBe("192.168.1.10");

		await user.clear(field("Hexadecimal"));

		expect(field("Decimal").value).toBe("");
		expect(field("Binary").value).toBe("");
		expect(field("Octal").value).toBe("");
		expect(field("Integer").value).toBe("");
	});

	it("canonicalizes the edited field once it loses focus", async () => {
		const user = userEvent.setup();
		render(<AddressSection />);

		await user.type(field("Decimal"), "001.002.003.004");
		expect(field("Decimal").value).toBe("001.002.003.004");
		expect(field("Integer").value).toBe("16909060");

		await user.tab();

		expect(field("Decimal").value).toBe("1.2.3.4");
		expect(field("Octal").value).toBe("1.2.3.4");
		expect(field("Hexadecimal").value).toBe("01.02.03.04");
	});
});
