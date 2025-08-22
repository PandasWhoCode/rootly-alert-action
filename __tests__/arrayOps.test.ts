/**
 * Unit tests for the array operations functionality, src/arrayOps.ts
 */
import { jest } from '@jest/globals'

// Import the module being tested
const { addNonEmptyArray } = await import('../src/arrayOps.js')
import type { Label } from '../src/label.js'

describe('arrayOps.ts', () => {
  let attributes: Record<string, string | string[] | boolean | Label[]>

  beforeEach(() => {
    attributes = {}
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Adds non-empty array to attributes', () => {
    const testArray = ['item1', 'item2', 'item3']

    addNonEmptyArray(testArray, 'test_key', attributes)

    expect(attributes['test_key']).toEqual(['item1', 'item2', 'item3'])
  })

  it('Filters out empty strings from array', () => {
    const testArray = ['item1', '', 'item2', '   ', 'item3']

    addNonEmptyArray(testArray, 'test_key', attributes)

    expect(attributes['test_key']).toEqual(['item1', 'item2', 'item3'])
  })

  it('Does not add attribute when array is undefined', () => {
    addNonEmptyArray(undefined, 'test_key', attributes)

    expect(attributes['test_key']).toBeUndefined()
  })

  it('Does not add attribute when array is empty', () => {
    addNonEmptyArray([], 'test_key', attributes)

    expect(attributes['test_key']).toBeUndefined()
  })

  it('Does not add attribute when all items are empty strings', () => {
    const testArray = ['', '   ', '\t', '\n']

    addNonEmptyArray(testArray, 'test_key', attributes)

    expect(attributes['test_key']).toBeUndefined()
  })

  it('Trims whitespace when checking for empty strings', () => {
    const testArray = ['  item1  ', '\titem2\t', '\nitem3\n']

    addNonEmptyArray(testArray, 'test_key', attributes)

    expect(attributes['test_key']).toEqual([
      '  item1  ',
      '\titem2\t',
      '\nitem3\n'
    ])
  })

  it('Handles mixed empty and non-empty items', () => {
    const testArray = ['valid1', '', 'valid2', '   ', 'valid3', '\t\n']

    addNonEmptyArray(testArray, 'test_key', attributes)

    expect(attributes['test_key']).toEqual(['valid1', 'valid2', 'valid3'])
  })

  it('Uses correct attribute key', () => {
    const testArray = ['item1', 'item2']
    const customKey = 'custom_attribute_key'

    addNonEmptyArray(testArray, customKey, attributes)

    expect(attributes[customKey]).toEqual(['item1', 'item2'])
    expect(attributes['test_key']).toBeUndefined()
  })

  it('Does not modify original array', () => {
    const testArray = ['item1', '', 'item2']
    const originalArray = [...testArray]

    addNonEmptyArray(testArray, 'test_key', attributes)

    expect(testArray).toEqual(originalArray)
  })

  it('Handles array with single valid item', () => {
    const testArray = ['single-item']

    addNonEmptyArray(testArray, 'test_key', attributes)

    expect(attributes['test_key']).toEqual(['single-item'])
  })

  it('Handles array with single empty item', () => {
    const testArray = ['']

    addNonEmptyArray(testArray, 'test_key', attributes)

    expect(attributes['test_key']).toBeUndefined()
  })

  it('Does not overwrite existing attributes', () => {
    attributes['existing_key'] = 'existing_value'
    const testArray = ['item1', 'item2']

    addNonEmptyArray(testArray, 'test_key', attributes)

    expect(attributes['existing_key']).toBe('existing_value')
    expect(attributes['test_key']).toEqual(['item1', 'item2'])
  })

  // Label-specific tests
  it('Adds non-empty Label array to attributes', () => {
    const testLabels: Label[] = [
      { key: 'env', value: 'prod' },
      { key: 'team', value: 'backend' }
    ]

    addNonEmptyArray(testLabels, 'labels', attributes)

    expect(attributes['labels']).toEqual([
      { key: 'env', value: 'prod' },
      { key: 'team', value: 'backend' }
    ])
  })

  it('Filters out Labels with empty keys or values', () => {
    const testLabels: Label[] = [
      { key: 'env', value: 'prod' },
      { key: '', value: 'backend' },
      { key: 'team', value: '' },
      { key: '  ', value: '  ' },
      { key: 'valid', value: 'value' }
    ]

    addNonEmptyArray(testLabels, 'labels', attributes)

    expect(attributes['labels']).toEqual([
      { key: 'env', value: 'prod' },
      { key: 'valid', value: 'value' }
    ])
  })

  it('Does not add labels attribute when all Labels are empty', () => {
    const testLabels: Label[] = [
      { key: '', value: 'value' },
      { key: 'key', value: '' },
      { key: '  ', value: '  ' }
    ]

    addNonEmptyArray(testLabels, 'labels', attributes)

    expect(attributes['labels']).toBeUndefined()
  })
})
