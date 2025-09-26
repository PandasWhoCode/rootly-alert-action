import * as core from '@actions/core'
import { createAlert } from './alert.js'
import { getAlertUrgencyId } from './alertUrgency.js'
import { getServiceId } from './service.js'
import { getGroupId } from './group.js'
import { getEnvironmentId } from './environment.js'
import { createLabelsFromString } from './label.js'
import {
  createEmptyNotificationTarget,
  NotificationTarget,
  setNotificationTarget
} from './notificationTarget.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // Get the action's inputs
    const apiKey = core.getInput('api_key') // apiKey is required, never logged.
    const summary = core.getInput('summary')
    const details = core.getInput('details')
    const setAsNoise = core.getInput('set_as_noise') === 'true'
    const notificationTargetType = core.getInput('notification_target_type')
    const notificationTargetVal = core.getInput('notification_target')
    const alertUrgency = core.getInput('alert_urgency')
    const externalId = core.getInput('external_id')
    const externalUrl = core.getInput('external_url')
    const services = core.getInput('services').split(',')
    const groups = core.getInput('groups').split(',')
    const labels = createLabelsFromString(core.getInput('labels'))
    const environments = core.getInput('environments').split(',')
    const dedupKey = core.getInput('deduplication_key')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Api Key Length: ${apiKey.length}`) // Do not log the actual API key
    core.debug(`Summary: ${summary}`)
    core.debug(`Details: ${details}`)
    core.debug(`Set as noise: ${setAsNoise}`)
    core.debug(`Notification target type: ${notificationTargetType}`)
    core.debug(`Notification target: ${notificationTargetVal}`)
    core.debug(`Alert urgency: ${alertUrgency}`)
    core.debug(`External ID: ${externalId}`)
    core.debug(`External URL: ${externalUrl}`)
    core.debug(`Services: ${services}`)
    core.debug(`Groups: ${groups}`)
    core.debug(`Labels: ${labels}`)
    core.debug(`Environments: ${environments}`)
    core.debug(`Deduplication Key: ${dedupKey}`)

    // Set up service IDs
    const serviceIds: string[] = []
    for (const service of services) {
      if (service !== '') {
        const serviceId = await getServiceId(service, apiKey)
        serviceIds.push(serviceId)
      }
    }

    // Grab the alert urgency ID
    let alertUrgencyId: string = ''
    if (alertUrgency !== '') {
      alertUrgencyId = await getAlertUrgencyId(alertUrgency, apiKey)
    } else {
      // Default to 'high' if not provided
      alertUrgencyId = await getAlertUrgencyId('High', apiKey)
    }

    // Set up group IDs (used for alert groups)
    // check if groups are provided, if not, use an empty array
    const alertGroupIds: string[] = []
    for (const group of groups) {
      if (group !== '') {
        const groupId = await getGroupId(group, apiKey)
        alertGroupIds.push(groupId)
      }
    }

    // Set up environment IDs
    const environmentIds: string[] = []
    for (const environment of environments) {
      if (environment !== '') {
        const environmentId = await getEnvironmentId(environment, apiKey)
        environmentIds.push(environmentId)
      }
    }

    // Create notificationTarget
    const notificationTarget: NotificationTarget =
      createEmptyNotificationTarget()
    if (notificationTargetType !== '' && notificationTargetVal !== '') {
      await setNotificationTarget(
        notificationTarget,
        notificationTargetType,
        notificationTargetVal,
        apiKey
      )
    }
    core.debug(
      `Notification target: {type: ${notificationTarget.type} , id: ${notificationTarget.id} }`
    )

    // Create the alert
    const alertId = await createAlert(
      apiKey,
      summary,
      details,
      setAsNoise,
      notificationTarget,
      alertUrgencyId,
      externalId,
      externalUrl,
      serviceIds,
      alertGroupIds,
      labels,
      environmentIds,
      dedupKey
    )

    // Debug log the created alert ID
    core.debug(`Created Alert ID: ${alertId}`)

    // Set outputs for other workflow steps to use
    core.setOutput('alert-id', alertId)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
