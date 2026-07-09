// Tiny local AI proxy — keeps the Gemini API key server-side only.
// Run with: npm run server (separate from the Vite dev server).
import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5179
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = 'gemini-2.5-flash'

// Mirrors the real category names in src/data.js (CATEGORIES). Kept as a
// plain static list here — server/index.js runs under plain Node ESM, which
// can't follow data.js's Vite-only JSON import, so we don't import it
// directly; update this list if categories change in data.js.
const CATEGORY_NAMES = [
  'Domestic Spares (Membrane, Pumps, Filter Cartridge, Cabinets)',
  'Industrial Spares (Membrane, Filters Housing, High Pressure Pump, Dosing Pump)',
  'Domestic Systems (RO+UV+TDS purifiers for homes)',
  'Industrial Systems (high-capacity RO plants, 1000-15000 LPH)',
  'Domestic Brands', 'Industrial Brands',
  'Water Softeners', 'Cooling RO', 'Water ATM',
  'Commercial Systems', 'Bottling Plant', 'Water Treatment', 'ETP/STP/ZLD',
]
const TAGLINE = "Romegamart: India's 1st and largest B2B Marketplace for the RO Industry — connecting manufacturers, dealers, distributors, retailers, and technicians."

const catalogueSummary = CATEGORY_NAMES.map((c) => `- ${c}`).join('\n')

const SYSTEM_CONTEXT =
  "You are AquaBot, the friendly AI assistant for Romegamart — \"" + TAGLINE + '". ' +
  'You are warm, enthusiastic and concise — like a knowledgeable RO industry colleague, not a generic bot. ' +
  'Reply in 2-4 short sentences.\n\n' +
  'IMPORTANT — language: reply in the SAME script and language the user wrote in.\n' +
  '- If they write in Devanagari (Hindi script, e.g. "आरओ झिल्ली क्या है"), reply ENTIRELY in Devanagari Hindi.\n' +
  '- If they write in Hinglish / Roman Hindi (Hindi words in English letters, e.g. "RO membrane kya hai"), reply in friendly Hinglish (Roman script).\n' +
  '- If they write in English, reply in English.\n' +
  'You are fluent in all three. Never switch the user to a different script than they used.\n\n' +
  'KEY COMPANY FACTS (these are ON-TOPic — always answer questions about them directly and proudly, ' +
  'never deflect):\n' +
  '- Owner / founder of Romegamart: Mr. Pramod Bajaj.\n' +
  '- Sahyogi / Maintainer of Romegamart: Mr. Bharat Sharma.\n' +
  '- Romegamart is a product of the company "Sara Aqua Soft".\n' +
  'So if someone asks "owner kaun hai", "maalik kaun hai", "who owns this", "kis company ka product hai", ' +
  '"sanchalak kaun hai", "maintainer kaun hai", etc., answer with these facts.\n\n' +
  'Our real product categories on Romegamart:\n' + catalogueSummary + '\n\n' +
  'Stay on the topic of RO/water-purification products, the Romegamart marketplace, its owner/company, ' +
  "or these categories. Only if asked something totally unrelated (e.g. cricket, movies) should you " +
  'politely say it is outside what you help with and suggest browsing the categories above.'

// Streams the answer back as plain text chunks (no JSON envelope) so the
// client can render tokens as they arrive, like a real chat reply.
app.post('/api/ask', async (req, res) => {
  const { query } = req.body || {}
  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'Missing "query" in request body.' })
  }
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not set on the server. Add it to .env and restart the server.' })
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`
    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${SYSTEM_CONTEXT}\n\nUser question: ${query.trim()}` }] }],
      }),
    })

    if (!upstream.ok || !upstream.body) {
      const errData = await upstream.json().catch(() => ({}))
      console.error('Gemini API error:', errData)
      return res.status(upstream.status || 502).json({ error: errData?.error?.message || 'Gemini API request failed.' })
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache')

    const reader = upstream.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let gotAnyText = false

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      const lines = buffer.split('\n')
      buffer = lines.pop() // keep the last (possibly incomplete) line for next round

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const jsonStr = line.slice(6).trim()
        if (!jsonStr) continue
        try {
          const parsed = JSON.parse(jsonStr)
          const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text
          if (text) { gotAnyText = true; res.write(text) }
        } catch {
          // partial/malformed SSE chunk — skip it, next chunk usually completes it
        }
      }
    }

    if (!gotAnyText) res.write("Sorry, I couldn't generate a reply for that — please try rephrasing.")
    res.end()
  } catch (err) {
    console.error('AI proxy stream error:', err)
    if (!res.headersSent) res.status(500).json({ error: 'Could not reach the AI service.' })
    else res.end()
  }
})

app.listen(PORT, () => {
  console.log(`AquaBot AI proxy running at http://localhost:${PORT}`)
  if (!GEMINI_API_KEY) console.warn('Warning: GEMINI_API_KEY is not set — /api/ask will return an error until it is.')
})
