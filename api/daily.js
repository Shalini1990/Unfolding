// Generates a daily quote and spark task via Groq.
// Called once per day from HomeScreen when today's content hasn't been set yet.
// Falls back gracefully — the client uses static pools if this endpoint fails.

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL    = 'llama-3.3-70b-versatile'

const SYSTEM_PROMPT = `You generate daily content for Unfolding, a calm personal wellness app for daily reflection and intention-setting.

Return ONLY valid JSON — no markdown, no explanation, nothing else.

Generate:
1. "quote": A short, original, thought-provoking sentence (under 20 words) about self-awareness, growth, or intentional living. Avoid clichés. Write as if speaking directly to the reader.
2. "spark": A small, concrete, doable action for today. One sentence. Should take 5–30 minutes. Must be one of these types: novelty, connection, creativity, mindfulness, movement. Make it specific enough to actually do, not vague advice.
3. "spark_type": The type from the list above.

Example output:
{"quote":"The version of you that knows what to do has always been there — just waiting to be heard.","spark":"Write down three things that felt true about you as a child that still feel true today.","spark_type":"mindfulness"}`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY not set' })
  }

  try {
    const response = await fetch(GROQ_URL, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model:       MODEL,
        messages:    [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user',   content: 'Generate today\'s quote and spark.' },
        ],
        max_tokens:  200,
        temperature: 0.9,
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.error?.message || `Groq error (${response.status})`)
    }

    const data    = await response.json()
    const content = data.choices?.[0]?.message?.content ?? ''

    const parsed = JSON.parse(content)
    if (!parsed.quote || !parsed.spark || !parsed.spark_type) {
      throw new Error('Incomplete response from AI')
    }

    res.status(200).json(parsed)
  } catch (err) {
    console.error('daily.js error:', err)
    res.status(500).json({ error: err.message || 'Generation failed' })
  }
}
