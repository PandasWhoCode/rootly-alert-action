/**
 * Unit tests for the alert urgency functionality, src/alertUrgency.ts
 */
import { jest } from '@jest/globals'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

// Import the module being tested
const { getAlertUrgencyId } = await import('../src/alertUrgency.js')

describe('alertUrgency.ts', () => {
  const mockApiKey = 'test-api-key'
  const mockAlertUrgency = 'High'

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock successful API response
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [
          {
            id: 'urgency-123'
          }
        ]
      })
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Successfully retrieves alert urgency ID', async () => {
    const result = await getAlertUrgencyId(mockAlertUrgency, mockApiKey)

    expect(result).toBe('urgency-123')
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/alert_urgencies?filter%5Bname%5D=High',
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${mockApiKey}` }
      }
    )
  })

  it('Properly encodes alert urgency name with special characters', async () => {
    const urgencyWithSpaces = 'Very High'
    await getAlertUrgencyId(urgencyWithSpaces, mockApiKey)

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.rootly.com/v1/alert_urgencies?filter%5Bname%5D=Very%20High',
      expect.any(Object)
    )
  })

  it('Handles HTTP error responses', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    })

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const result = await getAlertUrgencyId(mockAlertUrgency, mockApiKey)

    expect(result).toBe('')
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('Handles network errors', async () => {
    const networkError = new Error('Network error')
    mockFetch.mockRejectedValue(networkError)

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const result = await getAlertUrgencyId(mockAlertUrgency, mockApiKey)

    expect(result).toBe('')
    expect(consoleSpy).toHaveBeenCalledWith(networkError)

    consoleSpy.mockRestore()
  })

  it('Returns first alert urgency when multiple results', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ id: 'urgency-first' }, { id: 'urgency-second' }]
      })
    })

    const result = await getAlertUrgencyId(mockAlertUrgency, mockApiKey)

    expect(result).toBe('urgency-first')
  })

  it('Uses correct API endpoint format', async () => {
    await getAlertUrgencyId('Medium', mockApiKey)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/alert_urgencies?filter%5Bname%5D='),
      expect.any(Object)
    )
  })
})
