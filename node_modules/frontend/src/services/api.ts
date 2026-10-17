import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
})

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

export const websitesApi = {
  list: () => api.get<Website[]>('/websites'),
  get: (id: string) => api.get<Website>(`/websites/${id}`),
  create: (data: { url: string; name?: string; checkInterval?: number }) => 
    api.post<Website>('/websites', data),
  update: (id: string, data: Partial<Website>) => 
    api.put<Website>(`/websites/${id}`, data),
  delete: (id: string) => api.delete(`/websites/${id}`),
  check: (id: string) => api.post<CheckResult>(`/websites/${id}/check`),
  history: (id: string) => api.get<CheckResult[]>(`/websites/${id}/history`),
}

export const incidentsApi = {
  list: () => api.get<Incident[]>('/incidents'),
}

export const statsApi = {
  get: () => api.get('/stats'),
}
