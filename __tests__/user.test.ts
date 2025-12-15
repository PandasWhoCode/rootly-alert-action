/**
 * Unit tests for the user functionality, src/user.ts
 */
import { jest } from "@jest/globals";
import * as core from "../__fixtures__/core.js";

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock @actions/core
jest.unstable_mockModule("@actions/core", () => core);

// Import the module being tested
const { getUserId } = await import("../src/user.js");

describe("user.ts", () => {
	const mockApiKey = "test-api-key";
	const mockUserEmail = "test@example.com";

	beforeEach(() => {
		jest.clearAllMocks();

		// Mock successful API response
		mockFetch.mockResolvedValue({
			ok: true,
			json: jest.fn().mockResolvedValue({
				data: [
					{
						id: "user-123",
					},
				],
			}),
		});
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("Successfully retrieves user ID", async () => {
		const result = await getUserId(mockUserEmail, mockApiKey);

		expect(result).toBe("user-123");
		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.rootly.com/v1/users?filter%5Bemail%5D=test%40example.com",
			{
				method: "GET",
				headers: { Authorization: `Bearer ${mockApiKey}` },
			},
		);
	});

	it("Properly encodes user email with special characters", async () => {
		const emailWithPlus = "test+tag@example.com";
		await getUserId(emailWithPlus, mockApiKey);

		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.rootly.com/v1/users?filter%5Bemail%5D=test%2Btag%40example.com",
			expect.any(Object),
		);
	});

	it("Handles user not found", async () => {
		mockFetch.mockResolvedValue({
			ok: true,
			json: jest.fn().mockResolvedValue({
				data: [],
			}),
		});

		const result = await getUserId(mockUserEmail, mockApiKey);

		expect(result).toBe("");
		expect(core.warning).toHaveBeenCalledWith(
			`User '${mockUserEmail}' not found`,
		);
	});

	it("Handles undefined data response", async () => {
		mockFetch.mockResolvedValue({
			ok: true,
			json: jest.fn().mockResolvedValue({
				data: undefined,
			}),
		});

		const result = await getUserId(mockUserEmail, mockApiKey);

		expect(result).toBe("");
		expect(core.warning).toHaveBeenCalledWith(
			`User '${mockUserEmail}' not found`,
		);
	});

	it("Handles HTTP error responses", async () => {
		mockFetch.mockResolvedValue({
			ok: false,
			status: 401,
			statusText: "Unauthorized",
		});

		const consoleSpy = jest.spyOn(console, "error").mockImplementation();

		const result = await getUserId(mockUserEmail, mockApiKey);

		expect(result).toBe("");
		expect(consoleSpy).toHaveBeenCalled();

		consoleSpy.mockRestore();
	});

	it("Handles network errors", async () => {
		const networkError = new Error("Network error");
		mockFetch.mockRejectedValue(networkError);

		const consoleSpy = jest.spyOn(console, "error").mockImplementation();

		const result = await getUserId(mockUserEmail, mockApiKey);

		expect(result).toBe("");
		expect(consoleSpy).toHaveBeenCalledWith(networkError);

		consoleSpy.mockRestore();
	});

	it("Returns first user when multiple results", async () => {
		mockFetch.mockResolvedValue({
			ok: true,
			json: jest.fn().mockResolvedValue({
				data: [{ id: "user-first" }, { id: "user-second" }],
			}),
		});

		const result = await getUserId(mockUserEmail, mockApiKey);

		expect(result).toBe("user-first");
	});

	it("Uses correct API endpoint format", async () => {
		await getUserId("admin@company.com", mockApiKey);

		expect(mockFetch).toHaveBeenCalledWith(
			expect.stringContaining("/v1/users?filter%5Bemail%5D="),
			expect.any(Object),
		);
	});
});
