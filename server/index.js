import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(express.json())

// ── Storage ──────────────────────────────────────────────────────────────────
// Production: PostgreSQL (Railway provides DATABASE_URL)
// Development: local JSON file fallback

const LOCAL_FILE = path.join(__dirname, 'wallet.json')

function readLocal() {
  try {
    return JSON.parse(fs.readFileSync(LOCAL_FILE, 'utf8'))
  } catch {
    return { cardIds: [], entries: {} }
  }
}

function writeLocal(data) {
  fs.writeFileSync(LOCAL_FILE, JSON.stringify(data, null, 2))
}

let pool = null

async function initDb() {
  if (!process.env.DATABASE_URL) return
  const { default: pg } = await import('pg')
  pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })
  await pool.query(`
    CREATE TABLE IF NOT EXISTS wallet (
      id INTEGER PRIMARY KEY,
      data JSONB NOT NULL DEFAULT '{}'
    )
  `)
  await pool.query(
    `INSERT INTO wallet (id, data) VALUES (1, '{"cardIds":[],"entries":{}}') ON CONFLICT DO NOTHING`
  )
  console.log('Connected to PostgreSQL')
}

async function getWallet() {
  if (pool) {
    const res = await pool.query('SELECT data FROM wallet WHERE id = 1')
    return res.rows[0]?.data || { cardIds: [], entries: {} }
  }
  return readLocal()
}

async function setWallet(data) {
  if (pool) {
    await pool.query('UPDATE wallet SET data = $1 WHERE id = 1', [data])
  } else {
    writeLocal(data)
  }
}

// ── API Routes ────────────────────────────────────────────────────────────────
app.get('/api/wallet', async (req, res) => {
  try {
    const data = await getWallet()
    res.json(data)
  } catch (err) {
    console.error('GET /api/wallet error:', err)
    res.status(500).json({ error: 'Failed to load wallet' })
  }
})

app.post('/api/wallet', async (req, res) => {
  try {
    await setWallet(req.body)
    res.json({ ok: true })
  } catch (err) {
    console.error('POST /api/wallet error:', err)
    res.status(500).json({ error: 'Failed to save wallet' })
  }
})

// ── Static Frontend (production) ──────────────────────────────────────────────
const distPath = path.join(__dirname, '../dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Card IQ server running on port ${PORT}`))
  })
  .catch(err => {
    console.error('DB init failed:', err)
    process.exit(1)
  })
