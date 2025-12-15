import type { ApiPostResponse } from "./apiResponse.js";
import { addNonEmptyArray } from "./arrayOps.js";
import * as core from "@actions/core";
import type { Label } from "./label.js";
import type { NotificationTarget } from "./notificationTarget.js";

/**
 * Create an alert using the Rootly REST API.
 *
 * @param {string} apiKey - The API key to use for authentication.
 * @param {string} summary - The summary of the alert.
 * @param {string} description - The details of the alert.
 * @param {boolean} setAsNoise - A boolean to determine if the alert is noise (default is false).
 * @param {NotificationTarget} notificationTarget - The type of notification target for the alert.
 * @param {'low' | 'medium' | 'high'} alertUrgency - The urgency of the alert (default is 'high').
 * @param {string} externalId - The external ID of the alert (optional).
 * @param {string} externalUrl - The external URL of the alert (optional).
 * @param {string[]} serviceIds - The IDs of the services to create the alert for.
 * @param {string[]} groupIds - The IDs of the groups to create the alert for.
 * @param {Label[]} labels - The labels to create the alert for.
 * @param {string[]} environmentIds - The IDs of the environments to create the alert for.
 * @param {string} dedupKey - The deduplication key for the alert (optional).
 * @returns {string} The ID of the alert.
 *
 */
export async function createAlert(
	apiKey: string, // apiKey is required, this is the bearer token for authentication
	summary: string, // summary is required, this is a brief summary of the alert
	description: string, // details is required, this is a detailed description of the alert
	setAsNoise: boolean, // noise is optional, this is a boolean to determine if the alert is noise
	notificationTarget: NotificationTarget, // notificationTarget is required, this is the type of notification target for the alert
	alertUrgency: string, // alertUrgency is required, this is the urgency of the alert, default is 'high'
	externalId?: string, // externalId is optional, this is the external ID field for the alert
	externalUrl?: string, // externalUrl is optional, this is the external URL field for the alert
	serviceIds?: string[], // serviceIds is optional, this is an array of service IDs associated with the alert
	groupIds?: string[], // groupIds is optional, this is an array of Alert Group IDs associated with the alert
	labels?: Label[], // labels is optional, this is an array of labels associated with the alert
	environmentIds?: string[], // environmentIds is optional, this is an array of environment IDs associated with the alert
	dedupKey?: string,
): Promise<string> {
	const url = "https://api.rootly.com/v1/alerts";
	const attributes: Record<string, string | string[] | boolean> = {
		source: "api",
		summary: summary,
		description: description,
		noise: setAsNoise ? "noise" : "not_noise",
		status: "triggered",
		notification_target_type: notificationTarget.type,
		notification_target_id: notificationTarget.id,
		alert_urgency_id: alertUrgency,
	};

	// Only add externalId and externalUrl if they are provided and not empty
	if (externalId && externalId !== "") {
		attributes["external_id"] = externalId;
	}
	if (externalUrl && externalUrl !== "") {
		attributes["external_url"] = externalUrl;
	}

	addNonEmptyArray(serviceIds, "service_ids", attributes);
	addNonEmptyArray(groupIds, "group_ids", attributes);
	addNonEmptyArray(labels, "labels", attributes);
	addNonEmptyArray(environmentIds, "environment_ids", attributes);

	// Add deduplication key if provided
	if (dedupKey && dedupKey !== "") {
		attributes["deduplication_key"] = dedupKey;
	}

	const alertBody = JSON.stringify({
		data: {
			type: "alerts",
			attributes,
		},
	});

	const options = {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/vnd.api+json",
		},
		body: alertBody,
	};

	try {
		const response = await fetch(url, options);

		if (!response.ok) {
			throw new Error(
				`HTTP error! status: ${response.status} ${response.statusText}`,
			);
		}

		const data = (await response.json()) as ApiPostResponse;
		return data.data.id;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		core.error(errorMessage);
		core.debug(`Alert Body:\n${alertBody}`);
		return "";
	}
}
