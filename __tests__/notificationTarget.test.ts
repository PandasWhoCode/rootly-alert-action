/**
 * Unit tests for the notification target functionality, src/notificationTarget.ts
 */
import { jest } from '@jest/globals'

// Mock all the dependency functions
const mockGetUserId = jest.fn()
const mockGetServiceId = jest.fn()
const mockGetEscalationPolicyId = jest.fn()
const mockGetGroupId = jest.fn()

// Mock the dependencies
jest.unstable_mockModule('../src/service.js', () => ({
  getServiceId: mockGetServiceId
}))
jest.unstable_mockModule('../src/group.js', () => ({
  getGroupId: mockGetGroupId
}))
jest.unstable_mockModule('../src/escalationPolicy.js', () => ({
  getEscalationPolicyId: mockGetEscalationPolicyId
}))
jest.unstable_mockModule('../src/user.js', () => ({
  getUserId: mockGetUserId
}))

// Import the module being tested
const { createNotificationTarget } =
  await import('../src/notificationTarget.js')

describe('notificationTarget.ts', () => {
  const mockTargetName = 'test-target'
  const mockApiKey = 'test-api-key'

  beforeEach(() => {
    jest.clearAllMocks()

    // Set up default mock return values
    mockGetUserId.mockResolvedValue('user-123')
    mockGetServiceId.mockResolvedValue('service-456')
    mockGetEscalationPolicyId.mockResolvedValue('policy-789')
    mockGetGroupId.mockResolvedValue('group-101')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Creates User notification target', async () => {
    const result = await createNotificationTarget(
      'user',
      mockTargetName,
      mockApiKey
    )

    expect(result).toEqual({
      id: 'user-123',
      type: 'User'
    })
    expect(mockGetUserId).toHaveBeenCalledWith(mockTargetName, mockApiKey)
  })

  it('Creates Service notification target', async () => {
    const result = await createNotificationTarget(
      'service',
      mockTargetName,
      mockApiKey
    )

    expect(result).toEqual({
      id: 'service-456',
      type: 'Service'
    })
    expect(mockGetServiceId).toHaveBeenCalledWith(mockTargetName, mockApiKey)
  })

  it('Creates EscalationPolicy notification target', async () => {
    const result = await createNotificationTarget(
      'escalationpolicy',
      mockTargetName,
      mockApiKey
    )

    expect(result).toEqual({
      id: 'policy-789',
      type: 'EscalationPolicy'
    })
    expect(mockGetEscalationPolicyId).toHaveBeenCalledWith(
      mockTargetName,
      mockApiKey
    )
  })

  it('Creates Group notification target', async () => {
    const result = await createNotificationTarget(
      'group',
      mockTargetName,
      mockApiKey
    )

    expect(result).toEqual({
      id: 'group-101',
      type: 'Group'
    })
    expect(mockGetGroupId).toHaveBeenCalledWith(mockTargetName, mockApiKey)
  })

  it('Handles case insensitive type matching for User', async () => {
    const result = await createNotificationTarget(
      'USER',
      mockTargetName,
      mockApiKey
    )

    expect(result).toEqual({
      id: 'user-123',
      type: 'User'
    })
  })

  it('Handles case insensitive type matching for Service', async () => {
    const result = await createNotificationTarget(
      'SERVICE',
      mockTargetName,
      mockApiKey
    )

    expect(result).toEqual({
      id: 'service-456',
      type: 'Service'
    })
  })

  it('Handles case insensitive type matching for EscalationPolicy', async () => {
    const result = await createNotificationTarget(
      'ESCALATIONPOLICY',
      mockTargetName,
      mockApiKey
    )

    expect(result).toEqual({
      id: 'policy-789',
      type: 'EscalationPolicy'
    })
  })

  it('Handles case insensitive type matching for Group', async () => {
    const result = await createNotificationTarget(
      'GROUP',
      mockTargetName,
      mockApiKey
    )

    expect(result).toEqual({
      id: 'group-101',
      type: 'Group'
    })
  })

  it('Throws error for invalid notification target type', async () => {
    await expect(
      createNotificationTarget('invalid', mockTargetName, mockApiKey)
    ).rejects.toThrow('Invalid notification target type')
  })

  it('Throws error for empty notification target type', async () => {
    await expect(
      createNotificationTarget('', mockTargetName, mockApiKey)
    ).rejects.toThrow('Invalid notification target type')
  })

  it('Passes target name correctly to underlying functions', async () => {
    const customTargetName = 'custom-target-name'

    await createNotificationTarget('user', customTargetName, mockApiKey)
    expect(mockGetUserId).toHaveBeenCalledWith(customTargetName, mockApiKey)

    await createNotificationTarget('service', customTargetName, mockApiKey)
    expect(mockGetServiceId).toHaveBeenCalledWith(customTargetName, mockApiKey)

    await createNotificationTarget(
      'escalationpolicy',
      customTargetName,
      mockApiKey
    )
    expect(mockGetEscalationPolicyId).toHaveBeenCalledWith(
      customTargetName,
      mockApiKey
    )

    await createNotificationTarget('group', customTargetName, mockApiKey)
    expect(mockGetGroupId).toHaveBeenCalledWith(customTargetName, mockApiKey)
  })
})
