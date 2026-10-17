import * as dns from 'dns/promises'

const BLOCKED_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '0:0:0:0:0:0:0:1',
  '169.254.169.254',
])

const PRIVATE_IP_RANGES = [
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^127\./,
  /^169\.254\./,
  /^::1$/,
  /^fc00:/i,
  /^fd00:/i,
  /^fe80:/i,
]

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname.toLowerCase()
    
    if (BLOCKED_HOSTS.has(hostname)) return false
    if (hostname.startsWith('[') && hostname.endsWith(']')) {
      return false
    }
    for (const range of PRIVATE_IP_RANGES) {
      if (range.test(hostname)) return false
    }
    if (hostname === 'metadata.google.internal') return false
    return true
  } catch {
    return false
  }
}

export async function resolveAndValidateUrl(url: string): Promise<{ valid: boolean; error?: string }> {
  try {
    if (!isValidUrl(url)) return { valid: false, error: 'Invalid URL. Only HTTP and HTTPS are supported' }
    if (!isSafeUrl(url)) return { valid: false, error: 'URL points to private, loopback, or blocked address' }
    const parsed = new URL(url)
    try {
      const addresses = await dns.lookup(parsed.hostname, { all: true })
      for (const addr of addresses) {
        const ip = addr.address
        for (const range of PRIVATE_IP_RANGES) {
          if (range.test(ip)) {
            return { valid: false, error: 'DNS resolves to private or blocked address' }
          }
        }
      }
    } catch (err) {
      return { valid: false, error: 'DNS resolution failed' }
    }
    return { valid: true }
  } catch (err) {
    return { valid: false, error: 'Invalid URL' }
  }
}
