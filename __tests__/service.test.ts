/**
 * Unit tests for the service functionality, src/service.ts
 */
import { jest } from "@jest/globals";
import * as core from "../__fixtures__/core.js";

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock @actions/core
jest.unstable_mockModule("@actions/core", () => core);

// Import the module being tested
const { getServiceId } = await import("../src/service.js");

describe("service.ts", () => {
	const mockApiKey = "test-api-key";
	const mockServiceName = "test-service";

	beforeEach(() => {
		jest.clearAllMocks();

		// Mock successful API response
		mockFetch.mockResolvedValue({
			ok: true,
			json: jest.fn().mockResolvedValue({
				data: [
					{
						id: "service-123",
					},
				],
			}),
		});
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("Successfully retrieves service ID", async () => {
		const result = await getServiceId(mockServiceName, mockApiKey);

		expect(result).toBe("service-123");
		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.rootly.com/v1/services?filter%5Bname%5D=test-service",
			{
				method: "GET",
				headers: { Authorization: `Bearer ${mockApiKey}` },
			},
		);
	});

	it("Properly encodes service name with special characters", async () => {
		const serviceWithSpaces = "my service name";
		await getServiceId(serviceWithSpaces, mockApiKey);

		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.rootly.com/v1/services?filter%5Bname%5D=my%20service%20name",
			expect.any(Object),
		);
	});

	it("Handles service not found", async () => {
		mockFetch.mockResolvedValue({
			ok: true,
			json: jest.fn().mockResolvedValue({
				data: [],
			}),
		});

		const result = await getServiceId(mockServiceName, mockApiKey);

		expect(result).toBe("");
		expect(core.warning).toHaveBeenCalledWith(
			`Service '${mockServiceName}' not found`,
		);
	});

	it("Handles undefined data response", async () => {
		mockFetch.mockResolvedValue({
			ok: true,
			json: jest.fn().mockResolvedValue({
				data: undefined,
			}),
		});

		const result = await getServiceId(mockServiceName, mockApiKey);

		expect(result).toBe("");
		expect(core.warning).toHaveBeenCalledWith(
			`Service '${mockServiceName}' not found`,
		);
	});

	it("Handles HTTP error responses", async () => {
		mockFetch.mockResolvedValue({
			ok: false,
			status: 401,
			statusText: "Unauthorized",
		});

		const consoleSpy = jest.spyOn(console, "error").mockImplementation();

		const result = await getServiceId(mockServiceName, mockApiKey);

		expect(result).toBe("");
		expect(consoleSpy).toHaveBeenCalled();

		consoleSpy.mockRestore();
	});

	it("Handles network errors", async () => {
		const networkError = new Error("Network error");
		mockFetch.mockRejectedValue(networkError);

		const consoleSpy = jest.spyOn(console, "error").mockImplementation();

		const result = await getServiceId(mockServiceName, mockApiKey);

		expect(result).toBe("");
		expect(consoleSpy).toHaveBeenCalledWith(networkError);

		consoleSpy.mockRestore();
	});

	it("Returns first service when multiple results", async () => {
		mockFetch.mockResolvedValue({
			ok: true,
			json: jest.fn().mockResolvedValue({
				data: [{ id: "service-first" }, { id: "service-second" }],
			}),
		});

		const result = await getServiceId(mockServiceName, mockApiKey);

		expect(result).toBe("service-first");
	});

	it("Uses correct API endpoint format", async () => {
		await getServiceId("api-service", mockApiKey);

		expect(mockFetch).toHaveBeenCalledWith(
			expect.stringContaining("/v1/services?filter%5Bname%5D="),
			expect.any(Object),
		);
	});
});
