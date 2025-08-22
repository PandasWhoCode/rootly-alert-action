/**
 * Unit tests for the escalation policy functionality, src/escalationPolicy.ts
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock @actions/core
jest.unstable_mockModule('@actions/core', () => core)

// Import the module being tested
const { getEscalationPolicyId } = await import('../src/escalationPolicy.js')

describe('escalationPolicy.ts', () => {
  const mockApiKey = 'test-api-key'
  const mockPolicyName = 'test-policy'

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock successful API response
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [
          {
            id: 'policy-123'
          }
        ]
      })
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Successfully retrieves escalation policy ID', async () => {
    const result = await getEscalationPolicyId(mockPolicyName, mockApiKey)

    expect(result).toBe('policy-123')
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/escalation_policies?filter%5Bname%5D=test-policy',
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${mockApiKey}` }
      }
    )
  })

  it('Properly encodes policy name with special characters', async () => {
    const policyWithSpaces = 'my escalation policy'
    await getEscalationPolicyId(policyWithSpaces, mockApiKey)

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/escalation_policies?filter%5Bname%5D=my%20escalation%20policy',
      expect.any(Object)
    )
  })

  it('Handles policy not found', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: []
      })
    })

    const result = await getEscalationPolicyId(mockPolicyName, mockApiKey)

    expect(result).toBe('')
    expect(core.warning).toHaveBeenCalledWith(
      `Escalation policy '${mockPolicyName}' not found`
    )
  })

  it('Handles undefined data response', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: undefined
      })
    })

    const result = await getEscalationPolicyId(mockPolicyName, mockApiKey)

    expect(result).toBe('')
    expect(core.warning).toHaveBeenCalledWith(
      `Escalation policy '${mockPolicyName}' not found`
    )
  })

  it('Handles HTTP error responses', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized'
    })

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const result = await getEscalationPolicyId(mockPolicyName, mockApiKey)

    expect(result).toBe('')
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('Handles network errors', async () => {
    const networkError = new Error('Network error')
    mockFetch.mockRejectedValue(networkError)

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const result = await getEscalationPolicyId(mockPolicyName, mockApiKey)

    expect(result).toBe('')
    expect(consoleSpy).toHaveBeenCalledWith(networkError)

    consoleSpy.mockRestore()
  })

  it('Returns first policy when multiple results', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: 'policy-first' }, { id: 'policy-second' }]
      })
    })

    const result = await getEscalationPolicyId(mockPolicyName, mockApiKey)

    expect(result).toBe('policy-first')
  })

  it('Uses correct API endpoint format', async () => {
    await getEscalationPolicyId('test-policy', mockApiKey)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/escalation_policies?filter%5Bname%5D='),
      expect.any(Object)
    )
  })
})
