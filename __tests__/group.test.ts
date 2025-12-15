/**
 * Unit tests for the group functionality, src/group.ts
 */
import { jest } from "@jest/globals";

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Import the module being tested
const { getGroupId } = await import("../src/group.js");

describe("group.ts", () => {
	const mockApiKey = "test-api-key";
	const mockGroupName = "test-group";

	beforeEach(() => {
		jest.clearAllMocks();

		// Mock successful API response
		mockFetch.mockResolvedValue({
			ok: true,
			json: jest.fn().mockResolvedValue({
				data: [
					{
						id: "group-123",
					},
				],
			}),
		});
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("Successfully retrieves group ID", async () => {
		const result = await getGroupId(mockGroupName, mockApiKey);

		expect(result).toBe("group-123");
		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.rootly.com/v1/alert_groups?include=test-group",
			{
				method: "GET",
				headers: { Authorization: `Bearer ${mockApiKey}` },
			},
		);
	});

	it("Properly encodes group name with special characters", async () => {
		const groupWithSpaces = "my alert group";
		await getGroupId(groupWithSpaces, mockApiKey);

		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.rootly.com/v1/alert_groups?include=my%20alert%20group",
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

		const result = await getGroupId(mockGroupName, mockApiKey);

		expect(result).toBe("");
		expect(consoleSpy).toHaveBeenCalled();

		consoleSpy.mockRestore();
	});

	it("Handles network errors", async () => {
		const networkError = new Error("Network error");
		mockFetch.mockRejectedValue(networkError);

		const consoleSpy = jest.spyOn(console, "error").mockImplementation();

		const result = await getGroupId(mockGroupName, mockApiKey);

		expect(result).toBe("");
		expect(consoleSpy).toHaveBeenCalledWith(networkError);

		consoleSpy.mockRestore();
	});

	it("Returns first group when multiple results", async () => {
		mockFetch.mockResolvedValue({
			ok: true,
			json: jest.fn().mockResolvedValue({
				data: [{ id: "group-first" }, { id: "group-second" }],
			}),
		});

		const result = await getGroupId(mockGroupName, mockApiKey);

		expect(result).toBe("group-first");
	});

	it("Uses correct API endpoint format", async () => {
		await getGroupId("test-group", mockApiKey);

		expect(mockFetch).toHaveBeenCalledWith(
			expect.stringContaining("/v1/alert_groups?include="),
			expect.any(Object),
		);
	});
});
