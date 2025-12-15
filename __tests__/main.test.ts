/**
 * Unit tests for the action's main functionality, src/main.ts
 */
import { jest } from "@jest/globals";
import * as core from "../__fixtures__/core.js";

// Mock all the dependencies
const mockCreateAlert = jest.fn();
const mockGetAlertUrgencyId = jest.fn();
const mockGetServiceId = jest.fn();
const mockGetGroupId = jest.fn();
const mockGetEnvironmentId = jest.fn();
const mockCreateLabelsFromString = jest.fn();
const mockCreateNotificationTarget = jest.fn();

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule("@actions/core", () => core);
jest.unstable_mockModule("../src/alert.js", () => ({
	createAlert: mockCreateAlert,
}));
jest.unstable_mockModule("../src/alertUrgency.js", () => ({
	getAlertUrgencyId: mockGetAlertUrgencyId,
}));
jest.unstable_mockModule("../src/service.js", () => ({
	getServiceId: mockGetServiceId,
}));
jest.unstable_mockModule("../src/group.js", () => ({
	getGroupId: mockGetGroupId,
}));
jest.unstable_mockModule("../src/environment.js", () => ({
	getEnvironmentId: mockGetEnvironmentId,
}));
jest.unstable_mockModule("../src/label.js", () => ({
	createLabelsFromString: mockCreateLabelsFromString,
}));
jest.unstable_mockModule("../src/notificationTarget.js", () => ({
	createNotificationTarget: mockCreateNotificationTarget,
}));

// The module being tested should be imported dynamically
const { run } = await import("../src/main.js");

describe("main.ts", () => {
	beforeEach(() => {
		// Reset all mocks
		jest.clearAllMocks();

		// Set up default mock implementations
		core.getInput.mockImplementation((name: string) => {
			const inputs: Record<string, string> = {
				api_key: "test-api-key",
				summary: "Test Alert Summary",
				details: "Test Alert Details",
				set_as_noise: "false",
				notification_target_type: "User",
				notification_target: "test-user",
				alert_urgency: "High",
				external_id: "ext-123",
				external_url: "https://example.com",
				deduplication_key: "",
				services: "service1,service2",
				groups: "group1",
				labels: "env:prod,team:backend",
				environments: "production",
			};
			return inputs[name] || "";
		});

		mockCreateAlert.mockResolvedValue("alert-123");
		mockGetAlertUrgencyId.mockResolvedValue("urgency-456");
		mockGetServiceId.mockResolvedValue("service-789");
		mockGetGroupId.mockResolvedValue("group-101");
		mockGetEnvironmentId.mockResolvedValue("env-202");
		mockCreateLabelsFromString.mockReturnValue([
			{ key: "env", value: "prod" },
			{ key: "team", value: "backend" },
		]);
		mockCreateNotificationTarget.mockResolvedValue({
			id: "user-303",
			type: "User",
		});
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("Successfully creates an alert with all inputs", async () => {
		await run();

		// Verify all the expected function calls
		expect(mockGetServiceId).toHaveBeenCalledWith("service1", "test-api-key");
		expect(mockGetServiceId).toHaveBeenCalledWith("service2", "test-api-key");
		expect(mockGetAlertUrgencyId).toHaveBeenCalledWith("High", "test-api-key");
		expect(mockGetGroupId).toHaveBeenCalledWith("group1", "test-api-key");
		expect(mockGetEnvironmentId).toHaveBeenCalledWith(
			"production",
			"test-api-key",
		);
		expect(mockCreateLabelsFromString).toHaveBeenCalledWith(
			"env:prod,team:backend",
		);
		expect(mockCreateNotificationTarget).toHaveBeenCalledWith(
			"User",
			"test-user",
			"test-api-key",
		);

		expect(mockCreateAlert).toHaveBeenCalledWith(
			"test-api-key",
			"Test Alert Summary",
			"Test Alert Details",
			false,
			{ id: "user-303", type: "User" },
			"urgency-456",
			"ext-123",
			"https://example.com",
			["service-789", "service-789"],
			["group-101"],
			[
				{ key: "env", value: "prod" },
				{ key: "team", value: "backend" },
			],
			["env-202"],
			"",
		);

		// Verify output is set
		expect(core.setOutput).toHaveBeenCalledWith("alert-id", "alert-123");
	});

	it("Uses default urgency when not provided", async () => {
		core.getInput.mockImplementation((name: string) => {
			if (name === "alert_urgency") return "";
			return name === "api_key" ? "test-api-key" : "test-value";
		});

		await run();

		expect(mockGetAlertUrgencyId).toHaveBeenCalledWith("High", "test-api-key");
	});

	it("Handles empty service list", async () => {
		core.getInput.mockImplementation((name: string) => {
			if (name === "services") return "";
			return name === "api_key" ? "test-api-key" : "test-value";
		});

		await run();

		expect(mockGetServiceId).not.toHaveBeenCalled();
		expect(mockCreateAlert).toHaveBeenCalledWith(
			expect.any(String),
			expect.any(String),
			expect.any(String),
			expect.any(Boolean),
			expect.any(Object),
			expect.any(String),
			expect.any(String),
			expect.any(String),
			[],
			expect.any(Array),
			expect.any(Array),
			expect.any(Array),
			expect.any(String),
		);
	});

	it("Handles set_as_noise as true", async () => {
		core.getInput.mockImplementation((name: string) => {
			if (name === "set_as_noise") return "true";
			return name === "api_key" ? "test-api-key" : "test-value";
		});

		await run();

		expect(mockCreateAlert).toHaveBeenCalledWith(
			expect.any(String),
			expect.any(String),
			expect.any(String),
			true,
			expect.any(Object),
			expect.any(String),
			expect.any(String),
			expect.any(String),
			expect.any(Array),
			expect.any(Array),
			expect.any(Array),
			expect.any(Array),
			expect.any(String),
		);
	});

	it("Handles empty groups list", async () => {
		core.getInput.mockImplementation((name: string) => {
			if (name === "groups") return "";
			return name === "api_key" ? "test-api-key" : "test-value";
		});

		await run();

		expect(mockGetGroupId).not.toHaveBeenCalled();
	});

	it("Handles empty environments list", async () => {
		core.getInput.mockImplementation((name: string) => {
			if (name === "environments") return "";
			return name === "api_key" ? "test-api-key" : "test-value";
		});

		await run();

		expect(mockGetEnvironmentId).not.toHaveBeenCalled();
	});

	it("Sets failed status when an error occurs", async () => {
		const testError = new Error("Test error message");
		mockCreateAlert.mockRejectedValue(testError);

		await run();

		expect(core.setFailed).toHaveBeenCalledWith("Test error message");
	});

	it("Logs debug information", async () => {
		await run();

		expect(core.debug).toHaveBeenCalledWith("Api Key Length: 12");
		expect(core.debug).toHaveBeenCalledWith("Summary: Test Alert Summary");
		expect(core.debug).toHaveBeenCalledWith("Details: Test Alert Details");
		expect(core.debug).toHaveBeenCalledWith("Deduplication Key: ");
		expect(core.debug).toHaveBeenCalledWith("Created Alert ID: alert-123");
	});

	it("Handles empty dedup key", async () => {
		core.getInput.mockImplementation((name: string) => {
			if (name === "deduplication_key") return "";
			return name === "api_key" ? "test-api-key" : "test-value";
		});

		await run();

		expect(mockCreateAlert).toHaveBeenCalledWith(
			expect.any(String),
			expect.any(String),
			expect.any(String),
			expect.any(Boolean),
			expect.any(Object),
			expect.any(String),
			expect.any(String),
			expect.any(String),
			expect.any(Array),
			expect.any(Array),
			expect.any(Array),
			expect.any(Array),
			"",
		);
	});

	it("Handles non-Error exceptions", async () => {
		const nonErrorException = "String error";
		mockCreateAlert.mockRejectedValue(nonErrorException);

		await run();

		// When error is not an Error instance, setFailed should not be called
		expect(core.setFailed).not.toHaveBeenCalled();
	});
});
