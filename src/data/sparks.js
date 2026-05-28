// 10 easy · 8 medium · 6 hard per type × 5 types = 120 tasks
// id is stable — used to track "shown in last 30 days" in spark_log

export const SPARK_LIBRARY = [

  // ══════════════════════════════════════════════════════════
  // NOVELTY
  // ══════════════════════════════════════════════════════════

  // easy (10)
  { id: 1,  type: 'novelty', difficulty: 'easy', text: "Open a random Wikipedia article and read it for three minutes." },
  { id: 2,  type: 'novelty', difficulty: 'easy', text: "Try holding your pen in your non-dominant hand for the next five minutes." },
  { id: 3,  type: 'novelty', difficulty: 'easy', text: "Explore one room as if you're seeing it for the first time. Find three things you've never paid attention to." },
  { id: 4,  type: 'novelty', difficulty: 'easy', text: "Listen to one song from a genre you never usually play." },
  { id: 5,  type: 'novelty', difficulty: 'easy', text: "Pick up an object near you and imagine its entire journey — from raw material to your hands." },
  { id: 6,  type: 'novelty', difficulty: 'easy', text: "Change one small thing about how you normally make your morning drink." },
  { id: 7,  type: 'novelty', difficulty: 'easy', text: "Find something in your surroundings that begins with each letter of your first name." },
  { id: 8,  type: 'novelty', difficulty: 'easy', text: "Read the first paragraph of a book you've never opened before." },
  { id: 41, type: 'novelty', difficulty: 'easy', text: "Take your usual route somewhere but pay attention to one thing you've never noticed before — a sign, a plant, a shadow." },
  { id: 42, type: 'novelty', difficulty: 'easy', text: "Try writing with your eyes closed for 60 seconds. Read it back." },

  // medium (8)
  { id: 51, type: 'novelty', difficulty: 'medium', text: "Take a completely different route somewhere you go regularly. Spend at least 15 minutes exploring." },
  { id: 52, type: 'novelty', difficulty: 'medium', text: "Try a food or drink you've never had before today." },
  { id: 53, type: 'novelty', difficulty: 'medium', text: "Watch a short documentary about something you know nothing about." },
  { id: 54, type: 'novelty', difficulty: 'medium', text: "Go somewhere nearby that you've passed many times but never actually visited." },
  { id: 55, type: 'novelty', difficulty: 'medium', text: "Start a conversation with a stranger today — at a café, a shop, on a walk. Learn one genuine thing about them." },
  { id: 56, type: 'novelty', difficulty: 'medium', text: "Spend one hour this evening without any screens. Notice what naturally fills the space." },
  { id: 57, type: 'novelty', difficulty: 'medium', text: "Visit a bookshop, library, or market and let something unexpected catch your eye. Follow it." },
  { id: 58, type: 'novelty', difficulty: 'medium', text: "Try a physical activity you've never done — even if only for 10 minutes." },

  // hard (6)
  { id: 91, type: 'novelty', difficulty: 'hard', text: "Plan and take a solo trip to somewhere you've never been — even if it's just a nearby neighbourhood." },
  { id: 92, type: 'novelty', difficulty: 'hard', text: "Sign up for a class, workshop, or event happening in the next two weeks." },
  { id: 93, type: 'novelty', difficulty: 'hard', text: "Reach out to someone you admire but don't know. Write one honest, specific message." },
  { id: 94, type: 'novelty', difficulty: 'hard', text: "Do something today that genuinely makes you nervous. Stay with the discomfort for a few minutes." },
  { id: 95, type: 'novelty', difficulty: 'hard', text: "Spend a full morning doing something completely outside your normal routine." },
  { id: 96, type: 'novelty', difficulty: 'hard', text: "Say yes to an invitation or opportunity you'd normally quietly decline." },

  // ══════════════════════════════════════════════════════════
  // CREATIVE
  // ══════════════════════════════════════════════════════════

  // easy (10)
  { id: 9,  type: 'creative', difficulty: 'easy', text: "Write three words that describe how you feel right now — without using any emotion words." },
  { id: 10, type: 'creative', difficulty: 'easy', text: "Sketch something you can see from where you're sitting. Two minutes, no judgement." },
  { id: 11, type: 'creative', difficulty: 'easy', text: "Pick a colour and find five things around you that match it." },
  { id: 12, type: 'creative', difficulty: 'easy', text: "Write one sentence that describes today before it's happened." },
  { id: 13, type: 'creative', difficulty: 'easy', text: "Hum or sing along to whatever song is in your head right now. Let it out for 30 seconds." },
  { id: 14, type: 'creative', difficulty: 'easy', text: "Rearrange three objects on your desk into a small arrangement. Make it feel intentional." },
  { id: 15, type: 'creative', difficulty: 'easy', text: "Write a two-word description of today's weather. Make it poetic." },
  { id: 16, type: 'creative', difficulty: 'easy', text: "Doodle freely for 60 seconds — no plan, no goal, no looking back." },
  { id: 43, type: 'creative', difficulty: 'easy', text: "Write a three-line poem about whatever is in front of you right now. No pressure on the quality." },
  { id: 44, type: 'creative', difficulty: 'easy', text: "Draw a self-portrait in under 60 seconds without lifting your pen." },

  // medium (8)
  { id: 59, type: 'creative', difficulty: 'medium', text: "Write a paragraph describing your day as if it were a scene in a novel." },
  { id: 60, type: 'creative', difficulty: 'medium', text: "Take five photos today around a single theme — shadow, texture, reflection, or colour." },
  { id: 61, type: 'creative', difficulty: 'medium', text: "Rewrite the chorus of any song you know using your week as inspiration." },
  { id: 62, type: 'creative', difficulty: 'medium', text: "Spend 15 minutes making something out of whatever is near you — no buying anything." },
  { id: 63, type: 'creative', difficulty: 'medium', text: "Write a list of 10 questions you'd genuinely love answered — any scale, any domain." },
  { id: 64, type: 'creative', difficulty: 'medium', text: "Write a letter to yourself from a year ago — one honest paragraph." },
  { id: 65, type: 'creative', difficulty: 'medium', text: "Create a rough mood board or collage — physical or digital — of how you want this week to feel." },
  { id: 66, type: 'creative', difficulty: 'medium', text: "Find a strong memory and describe it in vivid sensory detail, as if writing it for someone else." },

  // hard (6)
  { id: 97,  type: 'creative', difficulty: 'hard', text: "Spend 30 minutes on a creative project you've been putting off — writing, drawing, music, anything." },
  { id: 98,  type: 'creative', difficulty: 'hard', text: "Share something you made with one real person and ask for their honest reaction." },
  { id: 99,  type: 'creative', difficulty: 'hard', text: "Start something new from scratch with no specific outcome in mind — a project, a piece of writing, a plan." },
  { id: 100, type: 'creative', difficulty: 'hard', text: "Write honestly about something you've been afraid to write about. Keep it private if you need to." },
  { id: 101, type: 'creative', difficulty: 'hard', text: "Make something you've never made before — a recipe, a piece of art, a piece of writing. See it through." },
  { id: 102, type: 'creative', difficulty: 'hard', text: "Commit an hour this evening to making something with your hands. Nothing digital." },

  // ══════════════════════════════════════════════════════════
  // MASTERY
  // ══════════════════════════════════════════════════════════

  // easy (10)
  { id: 17, type: 'mastery', difficulty: 'easy', text: "Learn one new word today — in English or any language — and use it in a sentence." },
  { id: 18, type: 'mastery', difficulty: 'easy', text: "Watch a 3-minute how-to video about something you've never tried." },
  { id: 19, type: 'mastery', difficulty: 'easy', text: "Read one paragraph from something you've been meaning to get to." },
  { id: 20, type: 'mastery', difficulty: 'easy', text: "Solve one small puzzle today — a crossword clue, a Wordle, a riddle. Just one." },
  { id: 21, type: 'mastery', difficulty: 'easy', text: "Learn the name of one thing you see every day but never knew what it was called." },
  { id: 22, type: 'mastery', difficulty: 'easy', text: "Write down three things you're genuinely good at. Be honest." },
  { id: 23, type: 'mastery', difficulty: 'easy', text: "Read about the origin of one word you use all the time." },
  { id: 24, type: 'mastery', difficulty: 'easy', text: "Learn a simple magic trick you can do with objects near you." },
  { id: 45, type: 'mastery', difficulty: 'easy', text: "Find one shortcut or hidden feature in an app or tool you use every day." },
  { id: 46, type: 'mastery', difficulty: 'easy', text: "Read about one person who is excellent at something you're curious about." },

  // medium (8)
  { id: 67, type: 'mastery', difficulty: 'medium', text: "Spend 20 minutes going deeper on something you half-know but keep meaning to learn properly." },
  { id: 68, type: 'mastery', difficulty: 'medium', text: "Teach yourself one practical skill from a tutorial — a folding technique, a keyboard shortcut, a cooking method." },
  { id: 69, type: 'mastery', difficulty: 'medium', text: "Read a short article completely outside your usual domain. Summarise what you learned out loud." },
  { id: 70, type: 'mastery', difficulty: 'medium', text: "Learn five useful words in any language you don't currently speak." },
  { id: 71, type: 'mastery', difficulty: 'medium', text: "Watch a talk or essay on an idea that genuinely challenges how you usually think." },
  { id: 72, type: 'mastery', difficulty: 'medium', text: "Identify one specific knowledge gap you want to close and write down one concrete first step." },
  { id: 73, type: 'mastery', difficulty: 'medium', text: "Spend 15 minutes learning something only because you're curious about it — no usefulness required." },
  { id: 74, type: 'mastery', difficulty: 'medium', text: "Find an expert in something you respect and spend 15 minutes reading or watching their work." },

  // hard (6)
  { id: 103, type: 'mastery', difficulty: 'hard', text: "Spend an hour on something you keep avoiding because you feel unqualified. Start anyway." },
  { id: 104, type: 'mastery', difficulty: 'hard', text: "Take on a challenge that stretches a real skill — write something, build something, solve something." },
  { id: 105, type: 'mastery', difficulty: 'hard', text: "Identify a belief you hold about your own abilities and actively look for evidence that challenges it." },
  { id: 106, type: 'mastery', difficulty: 'hard', text: "Find an expert you can ask one specific, well-prepared question. Do it today." },
  { id: 107, type: 'mastery', difficulty: 'hard', text: "Set one concrete learning goal for this month and write down the first three steps." },
  { id: 108, type: 'mastery', difficulty: 'hard', text: "Sign up for something that forces you to learn alongside other people — a course, a group, a club." },

  // ══════════════════════════════════════════════════════════
  // SOCIAL
  // ══════════════════════════════════════════════════════════

  // easy (10)
  { id: 25, type: 'social', difficulty: 'easy', text: "Send a genuine thank-you message to someone who helped you recently." },
  { id: 26, type: 'social', difficulty: 'easy', text: "Text someone you've been meaning to reach out to — just to say hello." },
  { id: 27, type: 'social', difficulty: 'easy', text: "Think of a compliment you could give someone today, and look for the right moment." },
  { id: 28, type: 'social', difficulty: 'easy', text: "Write down the name of someone who's been kind to you this week. Let yourself feel the warmth." },
  { id: 29, type: 'social', difficulty: 'easy', text: "Share something positive — a song, an article, a thought — with one person today." },
  { id: 30, type: 'social', difficulty: 'easy', text: "Smile at the next person you pass. A real one." },
  { id: 31, type: 'social', difficulty: 'easy', text: "Remember a conversation that made you laugh. Sit with that memory for 30 seconds." },
  { id: 32, type: 'social', difficulty: 'easy', text: "Ask someone how they're really doing today. Then actually listen." },
  { id: 47, type: 'social', difficulty: 'easy', text: "Leave a genuinely helpful review for a local place, creator, or product you love." },
  { id: 48, type: 'social', difficulty: 'easy', text: "Think of one person who deserves to hear something good today. Send it." },

  // medium (8)
  { id: 75, type: 'social', difficulty: 'medium', text: "Have a genuinely curious conversation — ask three questions you'd never normally ask." },
  { id: 76, type: 'social', difficulty: 'medium', text: "Reach out to someone you've lost touch with. A real message, not just a like." },
  { id: 77, type: 'social', difficulty: 'medium', text: "Do something unexpectedly kind for someone today without explaining why." },
  { id: 78, type: 'social', difficulty: 'medium', text: "Tell someone something specific you appreciate about them — out loud, not over text." },
  { id: 79, type: 'social', difficulty: 'medium', text: "Have a meal or coffee with someone you care about — phones put away." },
  { id: 80, type: 'social', difficulty: 'medium', text: "Write a message to someone who shaped how you think. Send it today." },
  { id: 81, type: 'social', difficulty: 'medium', text: "Suggest or plan something you'll do together with someone this week." },
  { id: 82, type: 'social', difficulty: 'medium', text: "Check in on someone who might be finding things hard right now. Just listen." },

  // hard (6)
  { id: 109, type: 'social', difficulty: 'hard', text: "Have a conversation you've been putting off. Say the honest thing." },
  { id: 110, type: 'social', difficulty: 'hard', text: "Organise something for a group of people — even a small, informal one." },
  { id: 111, type: 'social', difficulty: 'hard', text: "Apologise to someone you owe one to." },
  { id: 112, type: 'social', difficulty: 'hard', text: "Be fully present with someone you care about for a full hour — nothing else." },
  { id: 113, type: 'social', difficulty: 'hard', text: "Ask someone for help with something you'd normally handle entirely on your own." },
  { id: 114, type: 'social', difficulty: 'hard', text: "Tell someone something genuinely vulnerable. Something real." },

  // ══════════════════════════════════════════════════════════
  // SENSORY
  // ══════════════════════════════════════════════════════════

  // easy (10)
  { id: 33, type: 'sensory', difficulty: 'easy', text: "Step outside for 60 seconds. Notice three things you can hear." },
  { id: 34, type: 'sensory', difficulty: 'easy', text: "Close your eyes and focus entirely on what you can smell for 30 seconds." },
  { id: 35, type: 'sensory', difficulty: 'easy', text: "Take five slow, deliberate breaths — in for four counts, out for six." },
  { id: 36, type: 'sensory', difficulty: 'easy', text: "Eat or drink something slowly today and notice every flavour and texture." },
  { id: 37, type: 'sensory', difficulty: 'easy', text: "Feel the texture of three different surfaces near you." },
  { id: 38, type: 'sensory', difficulty: 'easy', text: "Sit in natural light for two minutes without looking at your phone." },
  { id: 39, type: 'sensory', difficulty: 'easy', text: "Notice the weight of your own body — where you feel it pressing against your chair or the floor." },
  { id: 40, type: 'sensory', difficulty: 'easy', text: "Hold something cold and something warm. Feel the contrast and let yourself just notice." },
  { id: 49, type: 'sensory', difficulty: 'easy', text: "Place your hands in cold water for 30 seconds. Just notice the sensation without labelling it." },
  { id: 50, type: 'sensory', difficulty: 'easy', text: "Notice your posture right now. Adjust it slowly, deliberately. Take one full breath." },

  // medium (8)
  { id: 83, type: 'sensory', difficulty: 'medium', text: "Take a 15-minute walk with no headphones. Let your senses lead." },
  { id: 84, type: 'sensory', difficulty: 'medium', text: "Sit outside for 10 minutes and just watch what happens — no agenda, no phone." },
  { id: 85, type: 'sensory', difficulty: 'medium', text: "Cook or prepare something by hand. Give your full attention to every texture, sound, and smell." },
  { id: 86, type: 'sensory', difficulty: 'medium', text: "Find a quiet place and sit in silence for five minutes. Notice what surfaces without trying to stop it." },
  { id: 87, type: 'sensory', difficulty: 'medium', text: "Stretch slowly for 10 minutes and pay attention to exactly what your body is telling you." },
  { id: 88, type: 'sensory', difficulty: 'medium', text: "Treat your next shower or bath as a sensory ritual — not something to get through." },
  { id: 89, type: 'sensory', difficulty: 'medium', text: "Eat one full meal today without multitasking. Just eat." },
  { id: 90, type: 'sensory', difficulty: 'medium', text: "Lie on the floor for five minutes. Feel the ground beneath you. Watch your breathing." },

  // hard (6)
  { id: 115, type: 'sensory', difficulty: 'hard', text: "Spend at least two hours outside — no phone, no destination, no agenda." },
  { id: 116, type: 'sensory', difficulty: 'hard', text: "Do a complete one-hour body scan or mindfulness practice from start to finish." },
  { id: 117, type: 'sensory', difficulty: 'hard', text: "Take a cold shower. Stay under the cold water for a full two minutes." },
  { id: 118, type: 'sensory', difficulty: 'hard', text: "Go for a long, slow walk of at least an hour with nowhere specific to be." },
  { id: 119, type: 'sensory', difficulty: 'hard', text: "Sleep tonight with your phone in a different room." },
  { id: 120, type: 'sensory', difficulty: 'hard', text: "Commit to one hour of deep, phone-free focus on a single physical task — cooking, building, cleaning." },
]

// Legacy pick function — still usable as a fallback
// New code should use pickSparkAdaptive from sparkAlgorithm.js
const TYPE_ROTATION_BY_DAY = {
  0: ['creative', 'sensory', 'novelty', 'social', 'mastery'],   // Sunday
  1: ['novelty', 'creative', 'mastery', 'social', 'sensory'],   // Monday
  2: ['mastery', 'novelty', 'creative', 'sensory', 'social'],   // Tuesday
  3: ['creative', 'mastery', 'novelty', 'social', 'sensory'],   // Wednesday
  4: ['sensory', 'novelty', 'creative', 'mastery', 'social'],   // Thursday
  5: ['social', 'novelty', 'creative', 'mastery', 'sensory'],   // Friday
  6: ['creative', 'sensory', 'novelty', 'social', 'mastery'],   // Saturday
}

export function pickSpark(recentlyShownIds = []) {
  const dayOfWeek = new Date().getDay()
  const typeOrder = TYPE_ROTATION_BY_DAY[dayOfWeek]
  const easyOnly  = SPARK_LIBRARY.filter(s => s.difficulty === 'easy')
  const available = easyOnly.filter(s => !recentlyShownIds.includes(s.id))
  const pool      = available.length > 0 ? available : easyOnly

  for (const type of typeOrder) {
    const group = pool.filter(s => s.type === type)
    if (group.length > 0) return group[Math.floor(Math.random() * group.length)]
  }
  return pool[Math.floor(Math.random() * pool.length)]
}
