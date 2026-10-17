export interface Website {
  id: string
  url: string
  name?: string
  checkInterval: number
  enabled: boolean
  lastCheck?: string
  status?: 'up' | 'down'
  latency?: number
  createdAt: string
  updatedAt: string
}

export interface CheckResult {
  id: string
  websiteId: string
  status: 'up' | 'down'
  statusCode?: number
  latency: number
  error?: string
  timestamp: string
}

export interface Incident {
  id: string
  websiteId: string
  startedAt: string
  resolvedAt?: string
  duration?: number
  reason: string
}
