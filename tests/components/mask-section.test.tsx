// @vitest-environment jsdom
import MaskSection from "@/components/mask-section";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {describe, expect, it} from "vitest";

const field = (label: string) => screen.getByLabelText(label) as HTMLInputElement;

describe("MaskSection", () => {
	it("converts a typed dotted decimal mask into its CIDR prefix", async () => {
		const user = userEvent.setup();
		render(<MaskSection />);

		await user.type(field("Mask (decimal)"), "255.255.255.0");

		expect(field("Mask (CIDR)").value).toBe("/24");
		expect(screen.getByText("Type in either field to convert the mask to the other representation.")).toBeInTheDocument();
	});

	it("converts a typed CIDR prefix into its dotted decimal mask", async () => {
		const user = userEvent.setup();
		render(<MaskSection />);

		await user.type(field("Mask (CIDR)"), "/16");

		expect(field("Mask (decimal)").value).toBe("255.255.0.0");
	});

	it("handles the shortest and longest prefixes", async () => {
		const user = userEvent.setup();
		render(<MaskSection />);

		await user.type(field("Mask (CIDR)"), "/0");
		expect(field("Mask (decimal)").value).toBe("0.0.0.0");

		await user.clear(field("Mask (CIDR)"));
		await user.type(field("Mask (CIDR)"), "/32");
		expect(field("Mask (decimal)").value).toBe("255.255.255.255");
	});

	it("rejects a mask whose bits are not contiguous", async () => {
		const user = userEvent.setup();
		render(<MaskSection />);

		await user.type(field("Mask (decimal)"), "255.0.255.0");

		expect(field("Mask (decimal)").ariaInvalid).toBe("true");
		expect(field("Mask (CIDR)").value).toBe("");
		expect(screen.getByText("Enter a mask with contiguous bits, for example 255.255.255.0, or a CIDR prefix between /0 and /32.")).toBeInTheDocument();
	});

	it("rejects a prefix length outside 0-32", async () => {
		const user = userEvent.setup();
		render(<MaskSection />);

		await user.type(field("Mask (CIDR)"), "/33");

		expect(field("Mask (CIDR)").ariaInvalid).toBe("true");
		expect(screen.getByText("Enter a mask with contiguous bits, for example 255.255.255.0, or a CIDR prefix between /0 and /32.")).toBeInTheDocument();

		await user.clear(field("Mask (CIDR)"));
		await user.type(field("Mask (CIDR)"), "/24");

		expect(field("Mask (CIDR)").ariaInvalid).toBe("false");
		expect(field("Mask (decimal)").value).toBe("255.255.255.0");
	});

	it("clears both fields when one of them is emptied", async () => {
		const user = userEvent.setup();
		render(<MaskSection />);

		await user.type(field("Mask (decimal)"), "255.255.255.0");
		await user.clear(field("Mask (decimal)"));

		expect(field("Mask (decimal)").value).toBe("");
		expect(field("Mask (CIDR)").value).toBe("");
	});

	it("canonicalizes a padded mask once it loses focus", async () => {
		const user = userEvent.setup();
		render(<MaskSection />);

		await user.type(field("Mask (decimal)"), "255.000128.0.0000");
		expect(field("Mask (decimal)").value).toBe("255.000128.0.0000");
		expect(field("Mask (CIDR)").value).toBe("/9");

		await user.tab();

		expect(field("Mask (decimal)").value).toBe("255.128.0.0");
	});
});
