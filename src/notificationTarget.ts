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
 * Create a notification target using the Rootly REST API.
 *
 * @param {'User' | 'Service' | 'EscalationPolicy' | 'Group'} type - The type of notification target to create.
 * @param {string} targetName - The name of the notification target to create.
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
