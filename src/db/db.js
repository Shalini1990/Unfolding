import Dexie from 'dexie'

const db = new Dexie('unfolding_db')

db.version(1).stores({
  // User preferences (key/value pairs)
  settings:           '++id, key',

  // Daily intentions set each morning
  daily_intentions:   '++id, date',

  // Historical record of past intentions
  intentions_history: '++id, date',

  // Evening reflection entries
  reflection_entries: '++id, date',

  // Thoughts parked mid-day to revisit later
  parking_lot:        '++id, createdAt',

  // Kind words / affirmations collected by the user
  kind_words:         '++id, createdAt',

  // Log of daily spark interactions
  spark_log:          '++id, date',

  // Library of sparks (prompts, quotes, exercises)
  spark_library:      '++id, category',

  // Algorithm state for adaptive spark selection
  spark_algorithm:    '++id',

  // Archive of clarity moments / breakthroughs
  clarity_archive:    '++id, date',

  // Things the user has chosen to release / let go of
  releases:           '++id, date',

  // The user's north star (core values / long-term vision)
  north_star:         '++id',

  // Weekly cartoon / visual summaries
  week_cartoons:      '++id, weekStart',

  // Library of cartoon assets
  cartoon_library:    '++id, category',

  // Quotes and short wisdom pieces
  quote_data:         '++id, category',

  // Intention set the evening before for tomorrow
  tomorrow_intention: '++id, date',
})

export default db
