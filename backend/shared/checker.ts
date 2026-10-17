import axios from 'axios'
import { CheckResult } from '../shared/types'
import { randomUUID } from 'crypto'

export async function performHealthCheck(
  websiteId: string,
  url: string,
  timeoutMs: number = 5000
): Promise<CheckResult> {
  const startTime = Date.now()
  const timeout = timeoutMs
  
  try {
    const response = await axios.get(url, {
      timeout,
      maxRedirects: 3,
      validateStatus: () => true,
      headers: {
        'User-Agent': 'UptimeHarbor/1.0',
      },
    })
    const latency = Date.now() - startTime
    const isUp = response.status >= 200 && response.status < 400
    return {
      id: randomUUID(),
      websiteId,
      status: isUp ? 'up' : 'down',
      statusCode: response.status,
      latency,
      error: isUp ? undefined : `HTTP ${response.status}`,
      timestamp: new Date().toISOString(),
    }
  } catch (error: any) {
    const latency = Date.now() - startTime
    let errorReason = 'Connection error'
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      errorReason = 'Request timeout'
    } else if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
      errorReason = 'DNS resolution failed'
    } else if (error.code === 'ECONNREFUSED') {
      errorReason = 'Connection refused'
    } else if (error.code === 'ERR_NETWORK') {
      errorReason = 'Network error'
    } else if (error.response) {
      const status = error.response.status
      errorReason = `HTTP ${status}`
    }
    return {
      id: randomUUID(),
      websiteId,
      status: 'down',
      latency,
      error: errorReason,
      timestamp: new Date().toISOString(),
    }
  }
}
