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
  targetName: string
): Promise<NotificationTarget> {
  if (type.lowerCase() === 'user') {
    return { id: await getUserId(targetName), type: 'User' }
  } else if (type.lowerCase() === 'service') {
    return { id: await getServiceId(targetName), type: 'Service' }
  } else if (type.lowerCase() === 'escalationpolicy') {
    return {
      id: await getEscalationPolicyId(targetName),
      type: 'EscalationPolicy'
    }
  } else if (type.lowerCase() === 'group') {
    return { id: await getGroupId(targetName), type: 'Group' }
  } else {
    throw new Error('Invalid notification target type')
  }
}
