const express = require('express')
const cors = require('cors')
const { randomUUID } = require('crypto')
const axios = require('axios')
const dns = require('dns')

const BLOCKED_HOSTS = new Set([
  'localhost', '127.0.0.1', '0.0.0.0', '::1', '0:0:0:0:0:0:0:1', '169.254.169.254'
])
const PRIVATE_IP_RANGES = [
  /^10\./, /^192\.168\./, /^172\.(1[6-9]|2[0-9]|3[0-1])\./, /^127\./, /^169\.254\./, /^::1$/, /^fc00:/i, /^fd00:/i, /^fe80:/i
]

function isValidUrl(url) {
  try { const parsed = new URL(url); return parsed.protocol === 'http:' || parsed.protocol === 'https:' } catch { return false }
}

function isSafeUrl(url) {
  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname.toLowerCase()
    if (BLOCKED_HOSTS.has(hostname)) return false
    if (hostname.startsWith('[') && hostname.endsWith(']')) return false
    for (const r of PRIVATE_IP_RANGES) if (r.test(hostname)) return false
    if (hostname === 'metadata.google.internal') return false
    return true
  } catch { return false }
}

function resolveAndValidateUrl(url) {
  return new Promise((resolve) => {
    if (!isValidUrl(url)) return resolve({ valid: false, error: 'Invalid URL. Only HTTP and HTTPS are supported' })
    if (!isSafeUrl(url)) return resolve({ valid: false, error: 'URL points to private, loopback, or blocked address' })
    try {
      const parsed = new URL(url)
      dns.lookup(parsed.hostname, { all: true }, (err, addresses) => {
        if (err) return resolve({ valid: false, error: 'DNS resolution failed' })
        for (const addr of addresses) {
          const ip = addr.address
          for (const r of PRIVATE_IP_RANGES) if (r.test(ip)) return resolve({ valid: false, error: 'DNS resolves to private or blocked address' })
        }
        resolve({ valid: true })
      })
    } catch { resolve({ valid: false, error: 'Invalid URL' }) }
  })
}

async function performHealthCheck(websiteId, url, timeoutMs = 5000) {
  const startTime = Date.now()
  try {
    const response = await axios.get(url, { timeout: timeoutMs, maxRedirects: 3, validateStatus: () => true, headers: { 'User-Agent': 'UptimeHarbor/1.0' } })
    const latency = Date.now() - startTime
    const isUp = response.status >= 200 && response.status < 400
    return { id: randomUUID(), websiteId, status: isUp ? 'up' : 'down', statusCode: response.status, latency, error: isUp ? undefined : 'HTTP ' + response.status, timestamp: new Date().toISOString() }
  } catch (error) {
    const latency = Date.now() - startTime
    let errorReason = 'Connection error'
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) errorReason = 'Request timeout'
    else if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') errorReason = 'DNS resolution failed'
    else if (error.code === 'ECONNREFUSED') errorReason = 'Connection refused'
    else if (error.code === 'ERR_NETWORK') errorReason = 'Network error'
    else if (error.response) errorReason = 'HTTP ' + error.response.status
    return { id: randomUUID(), websiteId, status: 'down', latency, error: errorReason, timestamp: new Date().toISOString() }
  }
}

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

const websites = new Map()
const checks = new Map()
const incidents = new Map()
const activeIncidents = new Map()

app.get('/api/stats', (req, res) => {
  const allWebsites = Array.from(websites.values())
  let incidentsCount = 0
  for (const s of incidents.values()) incidentsCount += s.length
  res.json({ total: allWebsites.length, healthy: allWebsites.filter(w => w.status === 'up').length, failing: allWebsites.filter(w => w.status === 'down').length, incidents: incidentsCount })
})
app.get('/api/websites', (req, res) => res.json(Array.from(websites.values())))
app.get('/api/incidents', (req, res) => {
  const all = []
  for (const s of incidents.values()) all.push(...s)
  all.sort((a, b) => b.startedAt.localeCompare(a.startedAt))
  res.json(all.slice(0, 100))
})
app.get('/api/websites/:id', (req, res) => {
  const w = websites.get(req.params.id)
  if (!w) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Website not found' } })
  res.json(w)
})
app.get('/api/websites/:id/history', (req, res) => res.json((checks.get(req.params.id) || []).slice(-50)))

app.post('/api/websites', async (req, res) => {
  const { url, name, checkInterval = 300 } = req.body
  if (!url) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'URL is required' } })
  const v = await resolveAndValidateUrl(url)
  if (!v.valid) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: v.error } })
  const id = randomUUID()
  const now = new Date().toISOString()
  const website = { id, url, name: name || url, checkInterval, enabled: true, createdAt: now, updatedAt: now }
  websites.set(id, website); checks.set(id, []); incidents.set(id, [])
  res.status(201).json(website)
})

app.post('/api/websites/:id/check', async (req, res) => {
  const website = websites.get(req.params.id)
  if (!website) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Website not found' } })
  const result = await performHealthCheck(website.id, website.url, 5000)
  const history = checks.get(website.id) || []
  history.push(result)
  if (history.length > 100) history.splice(0, history.length - 100)
  checks.set(website.id, history)
  website.lastCheck = result.timestamp
  website.status = result.status
  website.latency = result.latency
  website.updatedAt = result.timestamp
  websites.set(website.id, website)
  const siteIncidents = incidents.get(website.id) || []
  if (result.status === 'down') {
    if (!activeIncidents.has(website.id)) {
      const incident = { id: randomUUID(), websiteId: website.id, startedAt: result.timestamp, reason: result.error || 'Site unreachable' }
      siteIncidents.push(incident)
      activeIncidents.set(website.id, incident.id)
      incidents.set(website.id, siteIncidents)
    }
  } else if (result.status === 'up') {
    if (activeIncidents.has(website.id)) {
      const incidentId = activeIncidents.get(website.id)
      const incident = siteIncidents.find(i => i.id === incidentId)
      if (incident && !incident.resolvedAt) {
        incident.resolvedAt = result.timestamp
        incident.duration = new Date(result.timestamp).getTime() - new Date(incident.startedAt).getTime()
        activeIncidents.delete(website.id)
      }
    }
  }
  res.json(result)
})

app.put('/api/websites/:id', (req, res) => {
  const website = websites.get(req.params.id)
  if (!website) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Website not found' } })
  const { name, checkInterval, enabled } = req.body
  if (name !== undefined) website.name = name
  if (checkInterval !== undefined) website.checkInterval = checkInterval
  if (enabled !== undefined) website.enabled = enabled
  website.updatedAt = new Date().toISOString()
  websites.set(website.id, website)
  res.json(website)
})

app.delete('/api/websites/:id', (req, res) => {
  const existed = websites.delete(req.params.id)
  checks.delete(req.params.id)
  incidents.delete(req.params.id)
  activeIncidents.delete(req.params.id)
  if (!existed) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Website not found' } })
  res.status(204).send()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log('UptimeHarbor API listening on port ' + PORT))
