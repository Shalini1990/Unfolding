export const FALLBACK_QUOTES = [
  "Focus on what's in your hands today. Everything else is noise.",
  "You don't need permission to be yourself. You never did.",
  "Your life is yours to write. Cross out what no longer fits. Add what does.",
  "Knowing why you react the way you do is already half the work.",
  "One step. Just the next one. The whole staircase comes after.",
  "You can't change yesterday. You can change what you do in the next hour.",
  "The most authentic version of you is also the most powerful one.",
  "Self-awareness isn't self-criticism. It's just paying honest attention.",
  "Every chapter of your life doesn't have to follow from the last one.",
  "Worry is energy. Point it at something you can actually move.",
  "Being yourself requires no effort. Performing someone else does.",
  "Small, consistent actions rewrite who you are more surely than big gestures.",
  "Notice what drains you. Notice what fills you. Act on what you learn.",
  "You are not the sum of your worst days. You are what you do next.",
  "Control the inputs. Let go of the outcomes.",
  "Your story doesn't have a fixed ending. That's a feature, not a bug.",
  "The clearer you are about who you are, the less you need others to define you.",
  "One decision at a time. One morning at a time. One version of yourself at a time.",
  "Not everything deserves your energy. Choose carefully what gets it.",
  "You're allowed to outgrow old versions of yourself. That's not inconsistency — it's growth.",
  "Pause before you react. That pause is where your power lives.",
  "The edit is part of the writing. You're always allowed to revise.",
  "Be honest with yourself first. Everything else gets easier after that.",
  "Progress on one small thing today is still progress.",
  "What would the most grounded version of you do right now?",
  "You don't have to solve everything at once. Pick one thread and pull.",
  "The life you want is built from ordinary days lived with intention.",
  "Your values don't shift with other people's opinions. Trust them.",
  "Redirect your attention to what's moveable. That's where the leverage is.",
  "The next right thing is usually smaller and simpler than you think.",
]

export function pickQuote(shownQuotes = [], blockedQuotes = []) {
  const all = FALLBACK_QUOTES.filter(q => !blockedQuotes.includes(q))
  const available = all.filter(q => !shownQuotes.includes(q))
  const pool = available.length > 0 ? available : all
  return pool[Math.floor(Math.random() * pool.length)]
}
