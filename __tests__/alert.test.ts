/**
 * Unit tests for the alert functionality, src/alert.ts
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock @actions/core
jest.unstable_mockModule('@actions/core', () => core)

// Mock arrayOps
const mockAddNonEmptyArray = jest.fn()
jest.unstable_mockModule('../src/arrayOps.js', () => ({
  addNonEmptyArray: mockAddNonEmptyArray
}))

// Import the module being tested
const { createAlert } = await import('../src/alert.js')

describe('alert.ts', () => {
  const mockApiKey = 'test-api-key'
  const mockSummary = 'Test Alert Summary'
  const mockDescription = 'Test Alert Description'
  const mockNotificationTarget = { id: 'user-123', type: 'User' }
  const mockAlertUrgencyId = 'urgency-456'

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock successful API response
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: {
          id: 'alert-789'
        }
      })
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Successfully creates an alert with required parameters', async () => {
    const result = await createAlert(
      mockApiKey,
      mockSummary,
      mockDescription,
      false,
      mockNotificationTarget,
      mockAlertUrgencyId
    )

    expect(result).toBe('alert-789')
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/alerts',
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: `Bearer ${mockApiKey}`,
          'Content-Type': 'application/vnd.api+json'
        },
        body: expect.stringContaining(mockSummary)
      })
    )
  })

  it('Creates alert with noise flag set to true', async () => {
    await createAlert(
      mockApiKey,
      mockSummary,
      mockDescription,
      true,
      mockNotificationTarget,
      mockAlertUrgencyId
    )

    const callArgs = mockFetch.mock.calls[0]
    const requestBody = JSON.parse(callArgs[1].body)

    expect(requestBody.data.attributes.noise).toBe(true)
  })

  it('Includes optional parameters when provided', async () => {
    const externalId = 'ext-123'
    const externalUrl = 'https://example.com'
    const serviceIds = ['service-1', 'service-2']
    const groupIds = ['group-1']
    const labels = [{ key: 'env', value: 'prod' }]
    const environmentIds = ['env-1']

    await createAlert(
      mockApiKey,
      mockSummary,
      mockDescription,
      false,
      mockNotificationTarget,
      mockAlertUrgencyId,
      externalId,
      externalUrl,
      serviceIds,
      groupIds,
      labels,
      environmentIds
    )

    const callArgs = mockFetch.mock.calls[0]
    const requestBody = JSON.parse(callArgs[1].body)

    expect(requestBody.data.attributes.external_id).toBe(externalId)
    expect(requestBody.data.attributes.external_url).toBe(externalUrl)
    expect(mockAddNonEmptyArray).toHaveBeenCalledWith(
      serviceIds,
      'service_ids',
      expect.any(Object)
    )
    expect(mockAddNonEmptyArray).toHaveBeenCalledWith(
      groupIds,
      'group_ids',
      expect.any(Object)
    )
    expect(mockAddNonEmptyArray).toHaveBeenCalledWith(
      [{ key: 'env', value: 'prod' }],
      'labels',
      expect.any(Object)
    )
    expect(mockAddNonEmptyArray).toHaveBeenCalledWith(
      environmentIds,
      'environment_ids',
      expect.any(Object)
    )
  })

  it('Excludes empty optional parameters', async () => {
    await createAlert(
      mockApiKey,
      mockSummary,
      mockDescription,
      false,
      mockNotificationTarget,
      mockAlertUrgencyId,
      '', // empty externalId
      '' // empty externalUrl
    )

    const callArgs = mockFetch.mock.calls[0]
    const requestBody = JSON.parse(callArgs[1].body)

    expect(requestBody.data.attributes.external_id).toBeUndefined()
    expect(requestBody.data.attributes.external_url).toBeUndefined()
  })

  it('Handles HTTP error responses', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request'
    })

    const result = await createAlert(
      mockApiKey,
      mockSummary,
      mockDescription,
      false,
      mockNotificationTarget,
      mockAlertUrgencyId
    )

    expect(result).toBe('')
    expect(core.error).toHaveBeenCalled()
  })

  it('Handles network errors', async () => {
    const networkError = new Error('Network error')
    mockFetch.mockRejectedValue(networkError)

    const result = await createAlert(
      mockApiKey,
      mockSummary,
      mockDescription,
      false,
      mockNotificationTarget,
      mockAlertUrgencyId
    )

    expect(result).toBe('')
    expect(core.error).toHaveBeenCalledWith(networkError.message)
  })

  it('Logs debug information', async () => {
    await createAlert(
      mockApiKey,
      mockSummary,
      mockDescription,
      false,
      mockNotificationTarget,
      mockAlertUrgencyId
    )

    expect(core.debug).toHaveBeenCalledWith(
      expect.stringContaining('Alert Body:')
    )
  })

  it('Sets correct request attributes', async () => {
    await createAlert(
      mockApiKey,
      mockSummary,
      mockDescription,
      false,
      mockNotificationTarget,
      mockAlertUrgencyId
    )

    const callArgs = mockFetch.mock.calls[0]
    const requestBody = JSON.parse(callArgs[1].body)

    expect(requestBody.data.type).toBe('alerts')
    expect(requestBody.data.attributes.source).toBe('api')
    expect(requestBody.data.attributes.summary).toBe(mockSummary)
    expect(requestBody.data.attributes.description).toBe(mockDescription)
    expect(requestBody.data.attributes.status).toBe('triggered')
    expect(requestBody.data.attributes.notification_target_type).toBe(
      mockNotificationTarget.type
    )
    expect(requestBody.data.attributes.notification_target_id).toBe(
      mockNotificationTarget.id
    )
    expect(requestBody.data.attributes.alert_urgency_id).toBe(
      mockAlertUrgencyId
    )
  })

  it('Includes deduplication key when provided', async () => {
    const dedupKey = 'test-dedup-key'

    await createAlert(
      mockApiKey,
      mockSummary,
      mockDescription,
      false,
      mockNotificationTarget,
      mockAlertUrgencyId,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      dedupKey
    )

    const callArgs = mockFetch.mock.calls[0]
    const requestBody = JSON.parse(callArgs[1].body)

    expect(requestBody.data.attributes.deduplication_key).toBe(dedupKey)
  })

  it('Excludes deduplication key when empty', async () => {
    await createAlert(
      mockApiKey,
      mockSummary,
      mockDescription,
      false,
      mockNotificationTarget,
      mockAlertUrgencyId,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      ''
    )

    const callArgs = mockFetch.mock.calls[0]
    const requestBody = JSON.parse(callArgs[1].body)

    expect(requestBody.data.attributes.deduplication_key).toBeUndefined()
  })
})
