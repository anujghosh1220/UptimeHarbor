import express from 'express'
import cors from 'cors'
import { randomUUID } from 'crypto'
import { resolveAndValidateUrl } from '../shared/validation.ts'
import { performHealthCheck } from '../shared/checker.ts'
import { Website, CheckResult, Incident } from '../shared/types.ts'

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

const websites = new Map<string, Website>()
const checks = new Map<string, CheckResult[]>()
const incidents = new Map<string, Incident[]>()
const activeIncidents = new Map<string, string>()

app.get('/api/stats', (req, res) => {
  const allWebsites = Array.from(websites.values())
  res.json({ total: allWebsites.length, healthy: allWebsites.filter(w => w.status === 'up').length, failing: allWebsites.filter(w => w.status === 'down').length, incidents: Array.from(incidents.values()).reduce((acc, cur) => acc + cur.length, 0) })
})

app.get('/api/websites', (req, res) => res.json(Array.from(websites.values())))
app.get('/api/incidents', (req, res) => {
  const all: Incident[] = []
  for (const siteIncidents of incidents.values()) all.push(...siteIncidents)
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
  const website: Website = { id, url, name: name || url, checkInterval, enabled: true, createdAt: now, updatedAt: now }
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
      const incident: Incident = { id: randomUUID(), websiteId: website.id, startedAt: result.timestamp, reason: result.error || 'Site unreachable' }
      siteIncidents.push(incident)
      activeIncidents.set(website.id, incident.id)
      incidents.set(website.id, siteIncidents)
    }
  } else if (result.status === 'up') {
    if (activeIncidents.has(website.id)) {
      const incidentId = activeIncidents.get(website.id)!
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log('UptimeHarbor API listening on port ' + PORT))
