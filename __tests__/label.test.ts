/**
 * Unit tests for the label functionality, src/label.ts
 */
import { jest } from '@jest/globals'

// Import the module being tested
const { createLabelsFromString } = await import('../src/label.js')

describe('label.ts', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Successfully creates labels from valid string', () => {
    const labelString = 'env:production,team:backend,version:1.0'
    const result = createLabelsFromString(labelString)

    expect(result).toEqual([
      { key: 'env', value: 'production' },
      { key: 'team', value: 'backend' },
      { key: 'version', value: '1.0' }
    ])
  })

  it('Handles single label pair', () => {
    const labelString = 'environment:staging'
    const result = createLabelsFromString(labelString)

    expect(result).toEqual([{ key: 'environment', value: 'staging' }])
  })

  it('Trims whitespace from keys and values', () => {
    const labelString = ' env : production , team : backend '
    const result = createLabelsFromString(labelString)

    expect(result).toEqual([
      { key: 'env', value: 'production' },
      { key: 'team', value: 'backend' }
    ])
  })

  it('Handles empty string input', () => {
    const labelString = ''
    const result = createLabelsFromString(labelString)

    expect(result).toEqual([])
  })

  it('Handles malformed label pairs', () => {
    const labelString = 'env:production,invalid-label,team:backend'
    const result = createLabelsFromString(labelString)

    expect(result).toEqual([
      { key: 'env', value: 'production' },
      { key: 'invalid-label', value: '' },
      { key: 'team', value: 'backend' }
    ])
  })

  it('Handles labels with colons in values', () => {
    const labelString = 'url:https://example.com,time:12:30:45'
    const result = createLabelsFromString(labelString)

    expect(result).toEqual([
      { key: 'url', value: 'https' },
      { key: 'time', value: '12' }
    ])
  })

  it('Handles labels with empty values', () => {
    const labelString = 'env:,team:backend,empty:'
    const result = createLabelsFromString(labelString)

    expect(result).toEqual([
      { key: 'env', value: '' },
      { key: 'team', value: 'backend' },
      { key: 'empty', value: '' }
    ])
  })

  it('Handles labels with special characters', () => {
    const labelString = 'app-name:my-app,version:v1.2.3-beta'
    const result = createLabelsFromString(labelString)

    expect(result).toEqual([
      { key: 'app-name', value: 'my-app' },
      { key: 'version', value: 'v1.2.3-beta' }
    ])
  })

  it('Handles undefined key in label pair', () => {
    const result = createLabelsFromString(':value1,key2:value2')
    expect(result).toEqual([
      { key: '', value: 'value1' },
      { key: 'key2', value: 'value2' }
    ])
  })
})
