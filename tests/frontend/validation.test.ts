import { describe, it, expect } from 'vitest'
import { isValidUrl, isSafeInternalUrl } from '../../frontend/src/utils/validation'

describe('URL validation', () => {
  it('validates correct URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true)
    expect(isValidUrl('http://example.com')).toBe(true)
  })
  
  it('rejects invalid URLs', () => {
    expect(isValidUrl('not-a-url')).toBe(false)
    expect(isValidUrl('ftp://example.com')).toBe(false)
  })
  
  it('rejects localhost', () => {
    expect(isSafeInternalUrl('http://localhost:8080')).toBe(false)
    expect(isSafeInternalUrl('http://127.0.0.1')).toBe(false)
  })
})
