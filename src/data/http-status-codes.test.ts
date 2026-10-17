import {describe, expect, it} from "vitest";
import {httpStatusClasses} from "@/data/http-status-codes";

const ALL_CODES = httpStatusClasses.flatMap(statusClass => statusClass.codes);

describe("httpStatusClasses", () => {
	it("groups every code into its class by first digit", () => {
		expect(httpStatusClasses.map(statusClass => statusClass.id)).toEqual(["1xx", "2xx", "3xx", "4xx", "5xx"]);

		for (const statusClass of httpStatusClasses) {
			const digit = Number(statusClass.id[0]);
			for (const status of statusClass.codes) expect(Math.floor(status.code / 100)).toBe(digit);
		}
	});

	it("lists every code registered by IANA plus the teapot", () => {
		expect(ALL_CODES).toHaveLength(63);
		expect(ALL_CODES.some(status => status.code === 418)).toBe(true);
	});

	it("lists the codes of each class in ascending order without duplicates", () => {
		for (const statusClass of httpStatusClasses) {
			const codes = statusClass.codes.map(status => status.code);
			expect(codes).toEqual([...codes].sort((a, b) => a - b));
		}

		const codes = ALL_CODES.map(status => status.code);
		expect(new Set(codes).size).toBe(codes.length);
	});

	it("fills in the well-known codes with their reason phrases", () => {
		const byCode = new Map(ALL_CODES.map(status => [status.code, status.reason]));

		expect(byCode.get(200)).toBe("OK");
		expect(byCode.get(204)).toBe("No Content");
		expect(byCode.get(301)).toBe("Moved Permanently");
		expect(byCode.get(304)).toBe("Not Modified");
		expect(byCode.get(400)).toBe("Bad Request");
		expect(byCode.get(401)).toBe("Unauthorized");
		expect(byCode.get(403)).toBe("Forbidden");
		expect(byCode.get(404)).toBe("Not Found");
		expect(byCode.get(418)).toBe("I'm a teapot");
		expect(byCode.get(429)).toBe("Too Many Requests");
		expect(byCode.get(500)).toBe("Internal Server Error");
		expect(byCode.get(502)).toBe("Bad Gateway");
		expect(byCode.get(503)).toBe("Service Unavailable");
		expect(byCode.get(504)).toBe("Gateway Timeout");
	});

	it("describes every code in plain words", () => {
		for (const status of ALL_CODES) {
			expect(status.reason.trim()).not.toBe("");
			expect(status.description.trim().length).toBeGreaterThan(10);
		}
	});
});
