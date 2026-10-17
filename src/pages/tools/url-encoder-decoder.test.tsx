// @vitest-environment jsdom
import URLEncoderDecoder from "@/pages/tools/url-encoder-decoder";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {describe, expect, it} from "vitest";

// The page holds two independent sections, each with its own Decoded and Encoded pair
const fields = () => ({
	uriDecoded: screen.getAllByLabelText("Decoded")[0] as HTMLInputElement,
	uriEncoded: screen.getAllByLabelText("Encoded")[0] as HTMLInputElement,
	componentDecoded: screen.getAllByLabelText("Decoded")[1] as HTMLInputElement,
	componentEncoded: screen.getAllByLabelText("Encoded")[1] as HTMLInputElement
});

describe("URLEncoderDecoder", () => {
	it("encodes an entire URI keeping its separators", async () => {
		const user = userEvent.setup();
		render(<URLEncoderDecoder />);

		await user.type(screen.getAllByLabelText("Decoded")[0], "example.com/hello world?x=a&y=b");

		const {uriEncoded} = fields();
		expect(uriEncoded.value).toBe("example.com/hello%20world?x=a&y=b");
	});

	it("encodes a URI component escaping every separator", async () => {
		const user = userEvent.setup();
		render(<URLEncoderDecoder />);

		await user.type(screen.getAllByLabelText("Decoded")[1], "example.com/hello world");

		const {componentEncoded} = fields();
		expect(componentEncoded.value).toBe("example.com%2Fhello%20world");
	});

	it("decodes a percent-encoded URI typed in the encoded field", async () => {
		const user = userEvent.setup();
		render(<URLEncoderDecoder />);

		await user.type(screen.getAllByLabelText("Encoded")[0], "example.com/hello%20world");

		const {uriDecoded} = fields();
		expect(uriDecoded.value).toBe("example.com/hello world");
	});

	it("marks a malformed percent escape and recovers when it is fixed", async () => {
		const user = userEvent.setup();
		render(<URLEncoderDecoder />);

		const {uriEncoded, uriDecoded} = fields();

		await user.type(uriEncoded, "%ZZ");
		expect(uriEncoded.ariaInvalid).toBe("true");
		expect(screen.getByText("Enter a percent-encoded URI where every % escape is followed by two hexadecimal digits, for example %20.")).toBeInTheDocument();
		expect(uriDecoded.value).toBe("");

		await user.clear(uriEncoded);
		await user.type(uriEncoded, "%20");
		expect(uriEncoded.ariaInvalid).toBe("false");
		expect(uriDecoded.value).toBe(" ");
	});

	it("keeps the two sections independent", async () => {
		const user = userEvent.setup();
		render(<URLEncoderDecoder />);

		await user.type(screen.getAllByLabelText("Decoded")[0], "a b");

		const {uriEncoded, componentEncoded} = fields();
		expect(uriEncoded.value).toBe("a%20b");
		expect(componentEncoded.value).toBe("");
	});
});
