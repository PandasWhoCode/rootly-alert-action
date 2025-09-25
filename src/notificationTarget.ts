import { getServiceId } from './service.js'
import { getGroupId } from './group.js'
import { getEscalationPolicyId } from './escalationPolicy.js'
import { getUserId } from './user.js'

/**
 *
 */
export type NotificationTarget = {
  id: string
  type: string
}

/**
 * Create an empty notification target.
 * @returns {NotificationTarget} An empty notification target.
 */
export function createEmptyNotificationTarget(): NotificationTarget {
  return { id: '', type: '' }
}

/**
 * Check if a notification target is empty.
 * @param target
 */
export function isEmptyNotificationTarget(target: NotificationTarget): boolean {
  return target.id === '' && target.type === ''
}

/**
 * Update an existing notification target object with ID and type.
 * @param target - The notification target to update.
 * @param type - The type of notification target.
 * @param targetName - The name of the notification target.
 * @param apiKey - The API key to use for authentication.
 */
export async function setNotificationTarget(
  target: NotificationTarget,
  type: string,
  targetName: string,
  apiKey: string
) {
  if (type.toLowerCase() === 'user') {
    target.id = await getUserId(targetName, apiKey)
    target.type = 'User'
  } else if (type.toLowerCase() === 'service') {
    target.id = await getServiceId(targetName, apiKey)
    target.type = 'Service'
  } else if (type.toLowerCase() === 'escalationpolicy') {
    target.id = await getEscalationPolicyId(targetName, apiKey)
    target.type = 'EscalationPolicy'
  } else if (type.toLowerCase() === 'group') {
    target.id = await getGroupId(targetName, apiKey)
    target.type = 'Group'
  } else {
    throw new Error('Invalid notification target type')
  }
}

/**
 * Update an existing notification target object with ID only.
 * @param target - The notification target to update.
 * @param targetName - The name of the notification target.
 * @param apiKey - The API key to use for authentication.
 */
export async function setNotificationTargetId(
  target: NotificationTarget,
  targetName: string,
  apiKey: string
) {
  if (target.type.toLowerCase() === 'user') {
    target.id = await getUserId(targetName, apiKey)
  } else if (target.type.toLowerCase() === 'service') {
    target.id = await getServiceId(targetName, apiKey)
  } else if (target.type.toLowerCase() === 'escalationpolicy') {
    target.id = await getEscalationPolicyId(targetName, apiKey)
  } else if (target.type.toLowerCase() === 'group') {
    target.id = await getGroupId(targetName, apiKey)
  } else {
    throw new Error('Invalid notification target type')
  }
}

/**
 * Create a notification target using the Rootly REST API.
 *
 * @param {'User' | 'Service' | 'EscalationPolicy' | 'Group'} type - The type of notification target to create.
 * @param {string} targetName - The name of the notification target to create.
 * @param apiKey - The API key to use for authentication.
 * @returns {NotificationTarget} The created notification target.
 */
export async function createNotificationTarget(
  type: string,
  targetName: string,
  apiKey: string
): Promise<NotificationTarget> {
  if (type.toLowerCase() === 'user') {
    return { id: await getUserId(targetName, apiKey), type: 'User' }
  } else if (type.toLowerCase() === 'service') {
    return { id: await getServiceId(targetName, apiKey), type: 'Service' }
  } else if (type.toLowerCase() === 'escalationpolicy') {
    return {
      id: await getEscalationPolicyId(targetName, apiKey),
      type: 'EscalationPolicy'
    }
  } else if (type.toLowerCase() === 'group') {
    return { id: await getGroupId(targetName, apiKey), type: 'Group' }
  } else {
    throw new Error('Invalid notification target type')
  }
}
