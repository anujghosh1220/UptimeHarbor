export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

const BLOCKED_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '169.254.169.254',
])

export function isSafeInternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname.toLowerCase()
    if (BLOCKED_HOSTS.has(hostname)) return false
    if (hostname.startsWith('10.') || hostname.startsWith('192.168.') || hostname.startsWith('172.')) {
      const parts = hostname.split('.')
      if (hostname.startsWith('172.')) {
        const second = parseInt(parts[1])
        if (second >= 16 && second <= 31) return false
      } else {
        return false
      }
    }
    return true
  } catch {
    return false
  }
}
