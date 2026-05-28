// Uses Groq (Llama 3.1 70B) — completely free tier, no credit card required.
// Free limits: 30 req/min, 6,000 tokens/min — plenty for a personal app.
// Get your key at console.groq.com → API Keys.
// Set GROQ_API_KEY in Vercel → Settings → Environment Variables.

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL    = 'llama-3.3-70b-versatile'

const MODE_GUIDE = `
The six modes:
- Untangle: Break down an overwhelming task into manageable steps
- Decide: Lay out options clearly and surface what matters most
- Unstuck: Diagnose what's blocking progress and find one concrete next step
- Vent and Solve: Lead with listening; shift to solutions only if the user wants
- Reframe: Find a more helpful angle on a difficult situation
- Prepare: Think through a hard conversation or event before it happens

Tag → mode hints (if a parking lot tag was provided):
- Worry or Low mood → prefer Reframe or Vent and Solve
- Decision → prefer Decide
- Idea → prefer Untangle
- Anger → prefer Reframe or Vent and Solve
- Dreams → prefer Untangle or Reframe
`

function buildSystem(tag, northStar, confirmedMode, profile) {
  const profileLines = profile ? [
    profile.name ? `User's name: ${profile.name}` : '',
    profile.age  ? `User's age: ${profile.age}`   : '',
    profile.sex  ? `User's sex: ${profile.sex}`   : '',
  ].filter(Boolean) : []

  const ctx = [
    ...profileLines,
    northStar     ? `User's north star: ${northStar}` : '',
    tag           ? `Parking lot tag: ${tag}`          : '',
    confirmedMode ? `Current mode: ${confirmedMode}`   : '',
  ].filter(Boolean).join('\n')

  return `You are a compassionate, focused thinking partner inside the Unfolding daily reflection app. Your role is to help users work through thoughts, feelings, and decisions with warmth and brevity.

CRITICAL FORMATTING RULES:
- Keep every response SHORT — 2–4 sentences max. This is a mobile chat interface.
- No bullet lists. No markdown. Conversational tone only.
- Never repeat what the user just said back to them.

SESSION PHASES:

Opening (your FIRST response to any conversation):
Read the user's situation carefully. Then:
1. Acknowledge in exactly one sentence.
2. On its own line, output exactly: MODE: [one of the six mode names]
3. One sentence describing how you'll approach it, then your first question.

Example first response:
"That sounds like a lot to carry.
MODE: Vent and Solve
I want to make sure you feel heard first — do you want to get it all out, or are you looking to figure out what to do next?"

Continuing the conversation:
- Ask ONE question at a time. Wait for the answer before going deeper.
- Vent and Solve: open with pure empathy. Only pivot to solutions after the user signals they're ready.
- If the user seems distressed, acknowledge their feelings fully before any problem-solving.
- After 4–5 exchanges, start wrapping toward a clarity card.
- If the user says they're ready to wrap up, generate the clarity card immediately.

Generating the clarity card:
When the session reaches a natural close, end your response with exactly this on its own line (no spaces around the colon, valid JSON only, nothing after it):
CLARITY_CARD:{"title":"...","summary":["...","...","..."],"mode":"...","next_step":"..."}

Title must be exactly one of:
- "What you decided" (Decide)
- "Your next step" (Untangle or Unstuck)
- "A new way to see it" (Reframe)
- "What you're preparing for" (Prepare)
- "What you needed to say" (Vent and Solve)

Summary: 3–4 short sentences. Write as "You..." — second person, plain language, actionable.

next_step: One short, concrete sentence the person can actually do tomorrow. Write it as a direct instruction starting with a verb — e.g. "Send that message to your manager about the timeline." or "Set aside 20 minutes tomorrow to write down the three options." It must stand alone and make sense without reading the rest of the card.

${MODE_GUIDE}

User context:
${ctx || 'No additional context provided.'}
`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages, tag, northStar, confirmedMode, profile } = req.body

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return res.status(500).json({
      error: 'GROQ_API_KEY is not set. Add it in Vercel → Settings → Environment Variables.',
    })
  }

  // Groq uses the standard OpenAI message format — system + user/assistant turns
  const groqMessages = [
    { role: 'system', content: buildSystem(tag, northStar, confirmedMode, profile) },
    ...messages.map(m => ({ role: m.role, content: m.content })),
  ]

  try {
    const response = await fetch(GROQ_URL, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model:      MODEL,
        messages:   groqMessages,
        max_tokens: 512,
        temperature: 0.75,
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.error?.message || `Groq API error (${response.status})`)
    }

    const data    = await response.json()
    const content = data.choices?.[0]?.message?.content ?? ''

    res.status(200).json({ content })
  } catch (err) {
    console.error('Groq API error:', err)
    res.status(500).json({ error: err.message || 'Something went wrong' })
  }
}
