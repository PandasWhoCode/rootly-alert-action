import type { ApiResponse } from './apiResponse.js'
import * as core from '@actions/core'

/**
 * Get the Escalation Policy ID using the Rootly REST API.
 *
 * @param {string} policy - The name of the escalation policy.
 * @param {string} apiKey - The API key to use for authentication.
 * @returns {string} The ID of the policy.
 */
export async function getEscalationPolicyId(
  policy: string,
  apiKey: string
): Promise<string> {
  const apiPolicyName = encodeURIComponent(policy)
  const url =
    'https://api.rootly.com/v1/escalation_policies?filter%5Bname%5D=' +
    apiPolicyName
  const options = {
    method: 'GET',
    headers: { Authorization: `Bearer ${apiKey}` }
  }

  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} ${response.statusText}`
      )
    }
    const data = (await response.json()) as ApiResponse

    if (!data.data || data.data.length === 0) {
      core.warning(`Escalation policy '${policy}' not found`)
      return ''
    }

    return data.data[0].id
  } catch (error) {
    console.error(error)
    return ''
  }
}
