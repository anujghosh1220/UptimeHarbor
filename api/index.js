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
  try { const p = new URL(url); return p.protocol === 'http:' || p.protocol === 'https:' } catch { return false }
}

function isSafeUrl(url) {
  try {
    const p = new URL(url); const h = p.hostname.toLowerCase()
    if (BLOCKED_HOSTS.has(h)) return false
    if (h.startsWith('[') && h.endsWith(']')) return false
    for (const r of PRIVATE_IP_RANGES) if (r.test(h)) return false
    if (h === 'metadata.google.internal') return false
    return true
  } catch { return false }
}

function resolveAndValidateUrl(url) {
  return new Promise(r => {
    if (!isValidUrl(url)) return r({ valid: false, error: 'Invalid URL. Only HTTP and HTTPS are supported' })
    if (!isSafeUrl(url)) return r({ valid: false, error: 'URL points to private, loopback, or blocked address' })
    try {
      const p = new URL(url)
      dns.lookup(p.hostname, { all: true }, (e, a) => {
        if (e) return r({ valid: false, error: 'DNS resolution failed' })
        for (const addr of a) {
          for (const rg of PRIVATE_IP_RANGES) if (rg.test(addr.address)) return r({ valid: false, error: 'DNS resolves to private or blocked address' })
        }
        r({ valid: true })
      })
    } catch { r({ valid: false, error: 'Invalid URL' }) }
  })
}

async function performHealthCheck(websiteId, url, timeoutMs = 5000) {
  const start = Date.now()
  try {
    const res = await axios.get(url, { timeout: timeoutMs, maxRedirects: 3, validateStatus: () => true, headers: { 'User-Agent': 'UptimeHarbor/1.0' } })
    const lat = Date.now() - start; const up = res.status >= 200 && res.status < 400
    return { id: randomUUID(), websiteId, status: up ? 'up' : 'down', statusCode: res.status, latency: lat, error: up ? undefined : 'HTTP ' + res.status, timestamp: new Date().toISOString() }
  } catch (e) {
    const lat = Date.now() - start; let err = 'Connection error'
    if (e.code === 'ECONNABORTED' || e.message?.includes('timeout')) err = 'Request timeout'
    else if (e.code === 'ENOTFOUND' || e.code === 'EAI_AGAIN') err = 'DNS resolution failed'
    else if (e.code === 'ECONNREFUSED') err = 'Connection refused'
    else if (e.code === 'ERR_NETWORK') err = 'Network error'
    else if (e.response) err = 'HTTP ' + e.response.status
    return { id: randomUUID(), websiteId, status: 'down', latency: lat, error: err, timestamp: new Date().toISOString() }
  }
}

let websites = new Map()
let checks = new Map()
let incidents = new Map()
let activeIncidents = new Map()

function reset() { websites.clear(); checks.clear(); incidents.clear(); activeIncidents.clear() }

function toJSON(obj) { try { return JSON.parse(JSON.stringify(obj)) } catch { return obj } }

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

async function handler(req, res) {
  setCors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  const url = req.url || ''
  try {
    if (url === '/api/stats' && req.method === 'GET') {
      const all = Array.from(websites.values()); let ic = 0
      for (const s of incidents.values()) ic += s.length
      return res.status(200).json({ total: all.length, healthy: all.filter(w => w.status === 'up').length, failing: all.filter(w => w.status === 'down').length, incidents: ic })
    }
    if (url === '/api/websites' && req.method === 'GET') return res.status(200).json(Array.from(websites.values()))
    if (url === '/api/websites' && req.method === 'POST') {
      const body = req.body || {}; const u = body.url
      if (!u) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'URL is required' } })
      const v = await resolveAndValidateUrl(u); if (!v.valid) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: v.error } })
      const id = randomUUID(); const now = new Date().toISOString()
      const w = { id, url: u, name: body.name || u, checkInterval: body.checkInterval || 300, enabled: true, createdAt: now, updatedAt: now }
      websites.set(id, w); checks.set(id, []); incidents.set(id, []); return res.status(201).json(w)
    }
    const m1 = url.match(/^\/api\/websites\/([^/]+)$/); if (m1 && req.method === 'GET') { const w = websites.get(m1[1]); if (!w) return res.status(404).json({ error: { code: 'NOT_FOUND' } }); return res.status(200).json(w) }
    const m2 = url.match(/^\/api\/websites\/([^/]+)\/history$/); if (m2 && req.method === 'GET') { return res.status(200).json((checks.get(m2[1]) || []).slice(-50)) }
    const m3 = url.match(/^\/api\/websites\/([^/]+)\/check$/); if (m3 && req.method === 'POST') {
      const w = websites.get(m3[1]); if (!w) return res.status(404).json({ error: { code: 'NOT_FOUND' } })
      const r = await performHealthCheck(w.id, w.url, 5000)
      const h = checks.get(w.id) || []; h.push(r); if (h.length > 100) h.splice(0, h.length - 100); checks.set(w.id, h)
      w.lastCheck = r.timestamp; w.status = r.status; w.latency = r.latency; w.updatedAt = r.timestamp; websites.set(w.id, w)
      const si = incidents.get(w.id) || []
      if (r.status === 'down') {
        if (!activeIncidents.has(w.id)) { const inc = { id: randomUUID(), websiteId: w.id, startedAt: r.timestamp, reason: r.error || 'Site unreachable' }; si.push(inc); activeIncidents.set(w.id, inc.id); incidents.set(w.id, si) }
      } else if (r.status === 'up') {
        if (activeIncidents.has(w.id)) { const iid = activeIncidents.get(w.id); const inc = si.find(x => x.id === iid); if (inc && !inc.resolvedAt) { inc.resolvedAt = r.timestamp; inc.duration = new Date(r.timestamp).getTime() - new Date(inc.startedAt).getTime(); activeIncidents.delete(w.id) } }
      }
      return res.status(200).json(r)
    }
    if (url === '/api/incidents' && req.method === 'GET') { const all = []; for (const s of incidents.values()) all.push(...s); all.sort((a,b)=>b.startedAt.localeCompare(a.startedAt)); return res.status(200).json(all.slice(0,100)) }
    return res.status(404).json({ error: { code: 'NOT_FOUND' } })
  } catch (e) {
    return res.status(500).json({ error: { code: 'INTERNAL', message: 'Internal error' } })
  }
}

module.exports = { handler, reset }
