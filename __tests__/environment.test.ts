/**
 * Unit tests for the environment functionality, src/environment.ts
 */
import { jest } from "@jest/globals";

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Import the module being tested
const { getEnvironmentId } = await import("../src/environment.js");

describe("environment.ts", () => {
	const mockApiKey = "test-api-key";
	const mockEnvironmentName = "production";

	beforeEach(() => {
		jest.clearAllMocks();

		// Mock successful API response
		mockFetch.mockResolvedValue({
			ok: true,
			json: jest.fn().mockResolvedValue({
				data: [
					{
						id: "env-123",
					},
				],
			}),
		});
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("Successfully retrieves environment ID", async () => {
		const result = await getEnvironmentId(mockEnvironmentName, mockApiKey);

		expect(result).toBe("env-123");
		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.rootly.com/v1/environments?filter%5Bname%5D=production",
			{
				method: "GET",
				headers: { Authorization: `Bearer ${mockApiKey}` },
			},
		);
	});

	it("Properly encodes environment name with special characters", async () => {
		const envWithSpaces = "staging environment";
		await getEnvironmentId(envWithSpaces, mockApiKey);

		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.rootly.com/v1/environments?filter%5Bname%5D=staging%20environment",
			expect.any(Object),
		);
	});

	it("Handles HTTP error responses", async () => {
		mockFetch.mockResolvedValue({
			ok: false,
			status: 404,
			statusText: "Not Found",
		});

		const consoleSpy = jest.spyOn(console, "error").mockImplementation();

		const result = await getEnvironmentId(mockEnvironmentName, mockApiKey);

		expect(result).toBe("");
		expect(consoleSpy).toHaveBeenCalled();

		consoleSpy.mockRestore();
	});

	it("Handles network errors", async () => {
		const networkError = new Error("Network error");
		mockFetch.mockRejectedValue(networkError);

		const consoleSpy = jest.spyOn(console, "error").mockImplementation();

		const result = await getEnvironmentId(mockEnvironmentName, mockApiKey);

		expect(result).toBe("");
		expect(consoleSpy).toHaveBeenCalledWith(networkError);

		consoleSpy.mockRestore();
	});

	it("Returns first environment when multiple results", async () => {
		mockFetch.mockResolvedValue({
			ok: true,
			json: jest.fn().mockResolvedValue({
				data: [{ id: "env-first" }, { id: "env-second" }],
			}),
		});

		const result = await getEnvironmentId(mockEnvironmentName, mockApiKey);

		expect(result).toBe("env-first");
	});

	it("Uses correct API endpoint format", async () => {
		await getEnvironmentId("test-env", mockApiKey);

		expect(mockFetch).toHaveBeenCalledWith(
			expect.stringContaining("/v1/environments?filter%5Bname%5D="),
			expect.any(Object),
		);
	});
});
