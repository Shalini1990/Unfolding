// Week Cartoon — SVG illustrations with 7 colourable partitions
// Parts are ordered back-to-front (index 0 = sky/background, 6 = foreground detail).
// Each day that partition fills with its colour; unfilled = outline only.

export const WEEK_PALETTE = [
  '#E8A0A0', '#E8C87A', '#8DC49E', '#88B4D8', '#A88EC8',
  '#E8A87E', '#C0A0C8', '#7EC8C0', '#F0C8A0', '#A0C8A0',
  '#D4A0B8', '#B8D4E8', '#E8D488', '#A0B8D4', '#D4C8A0',
  '#B4D4A8', '#D4A8C8', '#A8C4D4', '#E8B4A0', '#B4A8D4',
  '#C8D4A0',
]

export function pickWeekColors() {
  const pool = [...WEEK_PALETTE]
  const picked = []
  for (let i = 0; i < 7; i++) {
    const idx = Math.floor(Math.random() * pool.length)
    picked.push(pool.splice(idx, 1)[0])
  }
  return picked
}

export const CARTOONS = [

  // ─────────────────────────────────────────────
  // 0 · Garden
  // ─────────────────────────────────────────────
  {
    name: 'Garden',
    viewBox: '0 0 280 180',
    base: [],
    parts: [
      // 0 Mon — sky
      { type: 'rect', x: 0, y: 0, width: 280, height: 118 },
      // 1 Tue — lawn
      { type: 'rect', x: 0, y: 118, width: 280, height: 62 },
      // 2 Wed — garden path (tapering trapezoid)
      { type: 'polygon', points: '108,118 172,118 190,180 90,180' },
      // 3 Thu — left tree (triangle + trunk)
      { type: 'path', d: 'M 40,45 L 62,108 L 52,108 L 52,118 L 28,118 L 28,108 L 18,108 Z' },
      // 4 Fri — right tree
      { type: 'path', d: 'M 240,45 L 262,108 L 252,108 L 252,118 L 228,118 L 228,108 L 218,108 Z' },
      // 5 Sat — flower bed (centre)
      { type: 'ellipse', cx: 140, cy: 116, rx: 30, ry: 15 },
      // 6 Sun — sun
      { type: 'circle', cx: 238, cy: 36, r: 27 },
    ],
  },

  // ─────────────────────────────────────────────
  // 1 · Mountain
  // ─────────────────────────────────────────────
  {
    name: 'Mountain',
    viewBox: '0 0 280 180',
    base: [],
    parts: [
      // 0 Mon — sky
      { type: 'rect', x: 0, y: 0, width: 280, height: 148 },
      // 1 Tue — sun
      { type: 'circle', cx: 42, cy: 36, r: 26 },
      // 2 Wed — left mountain
      { type: 'polygon', points: '0,148 68,50 140,148' },
      // 3 Thu — right mountain
      { type: 'polygon', points: '140,148 212,50 280,148' },
      // 4 Fri — centre peak (tallest, renders over others)
      { type: 'polygon', points: '78,148 140,18 202,148' },
      // 5 Sat — valley / ground
      { type: 'path', d: 'M0,148 Q70,136 140,142 Q210,148 280,136 L280,180 L0,180 Z' },
      // 6 Sun — snow cap on centre peak
      { type: 'polygon', points: '120,62 140,18 160,62' },
    ],
  },

  // ─────────────────────────────────────────────
  // 2 · House
  // ─────────────────────────────────────────────
  {
    name: 'House',
    viewBox: '0 0 280 195',
    base: [],
    parts: [
      // 0 Mon — wall
      { type: 'rect', x: 62, y: 106, width: 156, height: 89 },
      // 1 Tue — roof
      { type: 'polygon', points: '55,109 140,28 225,109' },
      // 2 Wed — chimney
      { type: 'rect', x: 175, y: 22, width: 20, height: 72 },
      // 3 Thu — door
      { type: 'rect', x: 112, y: 129, width: 36, height: 66, rx: 4 },
      // 4 Fri — left window
      { type: 'rect', x: 72, y: 120, width: 28, height: 22, rx: 3 },
      // 5 Sat — right window
      { type: 'rect', x: 180, y: 120, width: 28, height: 22, rx: 3 },
      // 6 Sun — front lawn
      { type: 'ellipse', cx: 140, cy: 192, rx: 65, ry: 9 },
    ],
  },

  // ─────────────────────────────────────────────
  // 3 · Ocean
  // ─────────────────────────────────────────────
  {
    name: 'Ocean',
    viewBox: '0 0 280 180',
    base: [],
    parts: [
      // 0 Mon — sky
      { type: 'rect', x: 0, y: 0, width: 280, height: 95 },
      // 1 Tue — sun
      { type: 'circle', cx: 55, cy: 46, r: 30 },
      // 2 Wed — horizon sea strip
      { type: 'rect', x: 0, y: 90, width: 280, height: 22 },
      // 3 Thu — mid waves
      { type: 'path', d: 'M0,112 Q35,104 70,112 Q105,120 140,112 Q175,104 210,112 Q245,120 280,112 L280,133 L0,133 Z' },
      // 4 Fri — near waves
      { type: 'path', d: 'M0,133 Q35,124 70,133 Q105,142 140,133 Q175,124 210,133 Q245,142 280,133 L280,154 L0,154 Z' },
      // 5 Sat — beach
      { type: 'rect', x: 0, y: 154, width: 280, height: 26 },
      // 6 Sun — rocks on beach
      { type: 'path', d: 'M14,154 Q22,142 30,154 Z M50,154 Q62,140 74,154 Z M205,154 Q218,141 232,154 Z M248,154 Q258,143 268,154 Z' },
    ],
  },

  // ─────────────────────────────────────────────
  // 4 · Forest
  // ─────────────────────────────────────────────
  {
    name: 'Forest',
    viewBox: '0 0 280 180',
    base: [],
    parts: [
      // 0 Mon — night sky
      { type: 'rect', x: 0, y: 0, width: 280, height: 155 },
      // 1 Tue — moon
      { type: 'circle', cx: 238, cy: 38, r: 24 },
      // 2 Wed — far tree silhouette
      { type: 'path', d: 'M0,155 L0,110 L18,92 L36,110 L54,90 L72,110 L90,96 L108,110 L126,92 L144,110 L162,94 L180,110 L198,90 L216,110 L234,94 L252,110 L270,90 L280,102 L280,155 Z' },
      // 3 Thu — mid tree silhouette (taller)
      { type: 'path', d: 'M0,155 L0,120 L22,100 L44,120 L66,96 L88,120 L110,102 L132,120 L154,96 L176,120 L198,102 L220,120 L242,96 L264,120 L280,108 L280,155 Z' },
      // 4 Fri — left foreground tree
      { type: 'path', d: 'M 42,42 L 64,112 L 54,112 L 54,155 L 30,155 L 30,112 L 20,112 Z' },
      // 5 Sat — right foreground tree
      { type: 'path', d: 'M 238,42 L 260,112 L 250,112 L 250,155 L 226,155 L 226,112 L 216,112 Z' },
      // 6 Sun — forest floor
      { type: 'path', d: 'M0,155 Q70,148 140,152 Q210,156 280,148 L280,180 L0,180 Z' },
    ],
  },

  // ─────────────────────────────────────────────
  // 5 · Snowy
  // ─────────────────────────────────────────────
  {
    name: 'Snowy',
    viewBox: '0 0 280 180',
    base: [
      // Stars always visible in the night sky
      { type: 'circle', cx: 28,  cy: 22, r: 2   },
      { type: 'circle', cx: 82,  cy: 12, r: 1.5 },
      { type: 'circle', cx: 135, cy: 28, r: 2   },
      { type: 'circle', cx: 188, cy: 14, r: 1.5 },
      { type: 'circle', cx: 225, cy: 30, r: 2   },
      { type: 'circle', cx: 260, cy: 18, r: 1.5 },
    ],
    parts: [
      // 0 Mon — night sky
      { type: 'rect', x: 0, y: 0, width: 280, height: 148 },
      // 1 Tue — snowy ground
      { type: 'path', d: 'M0,148 Q140,138 280,148 L280,180 L0,180 Z' },
      // 2 Wed — left layered fir tree
      { type: 'path', d: 'M55,148 L38,128 L72,128 Z M55,128 L36,108 L74,108 Z M55,108 L38,90 L72,90 Z M55,90 L44,78 L66,78 Z' },
      // 3 Thu — right layered fir tree
      { type: 'path', d: 'M225,148 L208,128 L242,128 Z M225,128 L206,108 L244,108 Z M225,108 L208,90 L242,90 Z M225,90 L214,78 L236,78 Z' },
      // 4 Fri — snowman lower body
      { type: 'circle', cx: 140, cy: 155, r: 26 },
      // 5 Sat — snowman torso
      { type: 'circle', cx: 140, cy: 120, r: 19 },
      // 6 Sun — snowman head
      { type: 'circle', cx: 140, cy: 93,  r: 14 },
    ],
  },

  // ─────────────────────────────────────────────
  // 6 · Desert
  // ─────────────────────────────────────────────
  {
    name: 'Desert',
    viewBox: '0 0 280 180',
    base: [],
    parts: [
      // 0 Mon — sky
      { type: 'rect', x: 0, y: 0, width: 280, height: 122 },
      // 1 Tue — sun
      { type: 'circle', cx: 205, cy: 44, r: 32 },
      // 2 Wed — far dune
      { type: 'path', d: 'M0,122 Q70,98 140,112 Q210,126 280,105 L280,145 L0,145 Z' },
      // 3 Thu — near left dune
      { type: 'path', d: 'M0,168 Q55,128 112,158 L112,180 L0,180 Z' },
      // 4 Fri — near right dune
      { type: 'path', d: 'M168,156 Q225,126 280,165 L280,180 L168,180 Z' },
      // 5 Sat — left cactus (trunk + two arms as compound path)
      { type: 'path', d: 'M58,75 h14 v70 h-14 Z M38,108 h20 v18 h-20 Z M72,100 h20 v18 h-20 Z' },
      // 6 Sun — right cactus
      { type: 'path', d: 'M203,85 h14 v60 h-14 Z M183,115 h20 v18 h-20 Z M217,108 h20 v18 h-20 Z' },
    ],
  },

  // ─────────────────────────────────────────────
  // 7 · Rooftop
  // ─────────────────────────────────────────────
  {
    name: 'Rooftop',
    viewBox: '0 0 280 180',
    base: [
      // Railing posts along rooftop edge
      { type: 'rect', x:  10, y: 148, width: 4, height: 16 },
      { type: 'rect', x:  28, y: 148, width: 4, height: 16 },
      { type: 'rect', x:  46, y: 148, width: 4, height: 16 },
      { type: 'rect', x: 230, y: 148, width: 4, height: 16 },
      { type: 'rect', x: 248, y: 148, width: 4, height: 16 },
      { type: 'rect', x: 266, y: 148, width: 4, height: 16 },
      // Railing top rail
      { type: 'rect', x: 6, y: 148, width: 270, height: 4 },
    ],
    parts: [
      // 0 Mon — night sky
      { type: 'rect', x: 0, y: 0, width: 280, height: 148 },
      // 1 Tue — moon
      { type: 'circle', cx: 238, cy: 36, r: 25 },
      // 2 Wed — far city skyline
      { type: 'path', d: 'M0,132 L0,115 L18,115 L18,100 L38,100 L38,88 L55,88 L55,100 L75,100 L75,112 L98,112 L98,95 L115,95 L115,82 L132,82 L132,95 L150,95 L150,108 L168,108 L168,92 L185,92 L185,105 L205,105 L205,118 L225,118 L225,108 L242,108 L242,120 L260,120 L260,112 L280,112 L280,132 Z' },
      // 3 Thu — near city skyline (taller)
      { type: 'path', d: 'M0,148 L0,128 L28,128 L28,112 L55,112 L55,130 L82,130 L82,115 L112,115 L112,128 L145,128 L145,115 L175,115 L175,130 L205,130 L205,115 L232,115 L232,128 L258,128 L258,115 L280,115 L280,148 Z' },
      // 4 Fri — rooftop floor
      { type: 'rect', x: 0, y: 148, width: 280, height: 32 },
      // 5 Sat — chimney cluster
      { type: 'path', d: 'M52,148 h8 v-32 h-8 Z M65,148 h6 v-24 h-6 Z M75,148 h8 v-28 h-8 Z' },
      // 6 Sun — water tower (barrel + conical roof)
      { type: 'path', d: 'M208,148 h32 v-36 h-32 Z M205,112 L224,97 L243,112 Z' },
    ],
  },

  // ─────────────────────────────────────────────
  // 8 · River
  // ─────────────────────────────────────────────
  {
    name: 'River',
    viewBox: '0 0 280 180',
    base: [],
    parts: [
      // 0 Mon — sky
      { type: 'rect', x: 0, y: 0, width: 280, height: 92 },
      // 1 Tue — sun
      { type: 'circle', cx: 48, cy: 42, r: 28 },
      // 2 Wed — far bank with treeline
      { type: 'path', d: 'M0,92 Q70,80 140,86 Q210,92 280,80 L280,110 L0,110 Z' },
      // 3 Thu — river water
      { type: 'rect', x: 0, y: 110, width: 280, height: 45 },
      // 4 Fri — near left bank
      { type: 'path', d: 'M0,155 Q38,146 76,155 L76,180 L0,180 Z' },
      // 5 Sat — near right bank
      { type: 'path', d: 'M204,155 Q242,146 280,155 L280,180 L204,180 Z' },
      // 6 Sun — stone arch bridge
      { type: 'path', d: 'M76,155 Q140,112 204,155 L204,165 Q140,128 76,165 Z' },
    ],
  },

  // ─────────────────────────────────────────────
  // 9 · Rainy Window
  // ─────────────────────────────────────────────
  // The window frame is partition 0 (evenodd path with pane holes).
  // Each day one element fills: frame → panes → sill → plant → candle.
  {
    name: 'RainyWindow',
    viewBox: '0 0 280 180',
    base: [
      // Rain streaks on glass (always visible)
      { type: 'line', x1:  38, y1: 18, x2:  35, y2: 40 },
      { type: 'line', x1:  62, y1: 25, x2:  59, y2: 48 },
      { type: 'line', x1:  88, y1: 16, x2:  85, y2: 38 },
      { type: 'line', x1: 108, y1: 30, x2: 105, y2: 55 },
      { type: 'line', x1: 170, y1: 20, x2: 167, y2: 44 },
      { type: 'line', x1: 195, y1: 32, x2: 192, y2: 58 },
      { type: 'line', x1: 218, y1: 18, x2: 215, y2: 42 },
      { type: 'line', x1: 244, y1: 28, x2: 241, y2: 54 },
    ],
    parts: [
      // 0 Mon — window frame (evenodd punches out the 4 glass panes + cross bars)
      { type: 'path', fillRule: 'evenodd',
        d: 'M0,0 h280 v180 h-280 Z M16,16 h114 v82 h-114 Z M150,16 h114 v82 h-114 Z M16,114 h114 v50 h-114 Z M150,114 h114 v50 h-114 Z' },
      // 1 Tue — top-left pane
      { type: 'rect', x: 16, y: 16, width: 114, height: 82 },
      // 2 Wed — top-right pane
      { type: 'rect', x: 150, y: 16, width: 114, height: 82 },
      // 3 Thu — bottom-left pane
      { type: 'rect', x: 16, y: 114, width: 114, height: 50 },
      // 4 Fri — bottom-right pane
      { type: 'rect', x: 150, y: 114, width: 114, height: 50 },
      // 5 Sat — plant on sill
      { type: 'ellipse', cx: 65, cy: 155, rx: 24, ry: 16 },
      // 6 Sun — candle glow (warm circle)
      { type: 'circle', cx: 220, cy: 158, r: 14 },
    ],
  },

  // ─────────────────────────────────────────────
  // 10 · Meadow
  // ─────────────────────────────────────────────
  {
    name: 'Meadow',
    viewBox: '0 0 280 180',
    base: [],
    parts: [
      // 0 Mon — sky
      { type: 'rect', x: 0, y: 0, width: 280, height: 108 },
      // 1 Tue — cloud
      { type: 'path', d: 'M 50,54 Q50,36 70,36 Q74,24 90,28 Q96,14 112,20 Q126,10 140,22 Q154,14 162,28 Q178,24 182,40 Q198,42 198,56 Q200,65 182,66 L 54,66 Q40,65 50,54 Z' },
      // 2 Wed — distant hills
      { type: 'path', d: 'M0,108 Q70,86 140,96 Q210,108 280,90 L280,120 L0,120 Z' },
      // 3 Thu — meadow field
      { type: 'rect', x: 0, y: 120, width: 280, height: 60 },
      // 4 Fri — left wildflower strip (wavy bumps)
      { type: 'path', d: 'M0,145 Q12,130 24,145 Q36,130 48,145 Q60,130 72,145 Q84,130 96,145 L96,180 L0,180 Z' },
      // 5 Sat — right wildflower strip
      { type: 'path', d: 'M184,145 Q196,130 208,145 Q220,130 232,145 Q244,130 256,145 Q268,130 280,145 L280,180 L184,180 Z' },
      // 6 Sun — centre flower path
      { type: 'path', d: 'M96,145 Q112,128 128,145 Q144,128 160,145 Q176,128 184,145 L184,180 L96,180 Z' },
    ],
  },

  // ─────────────────────────────────────────────
  // 11 · Aurora
  // ─────────────────────────────────────────────
  {
    name: 'Aurora',
    viewBox: '0 0 280 180',
    base: [
      // Static stars (always visible in the dark sky)
      { type: 'circle', cx:  24, cy: 18, r: 2   },
      { type: 'circle', cx:  68, cy:  8, r: 1.5 },
      { type: 'circle', cx: 115, cy: 24, r: 2   },
      { type: 'circle', cx: 162, cy: 10, r: 1.5 },
      { type: 'circle', cx: 210, cy: 26, r: 2   },
      { type: 'circle', cx: 255, cy: 14, r: 1.5 },
      { type: 'circle', cx: 140, cy: 38, r: 1.5 },
    ],
    parts: [
      // 0 Mon — deep night sky
      { type: 'rect', x: 0, y: 0, width: 280, height: 148 },
      // 1 Tue — aurora band 1 (lowest, widest)
      { type: 'path', d: 'M0,88 Q70,68 140,74 Q210,80 280,70 Q278,90 210,94 Q140,98 70,90 Q8,84 0,88 Z' },
      // 2 Wed — aurora band 2 (mid)
      { type: 'path', d: 'M20,66 Q90,46 160,52 Q230,58 265,48 Q262,66 195,70 Q120,74 50,66 Q20,64 20,66 Z' },
      // 3 Thu — aurora band 3 (uppermost, narrow)
      { type: 'path', d: 'M40,46 Q110,28 180,35 Q240,40 256,34 Q252,48 186,52 Q115,56 48,48 Q36,46 40,46 Z' },
      // 4 Fri — pine tree silhouette (foreground, covers aurora base)
      { type: 'path', d: 'M0,148 L0,108 L18,90 L36,108 L54,88 L72,108 L90,95 L108,108 L126,90 L144,108 L162,92 L180,108 L198,88 L216,108 L234,92 L252,108 L270,90 L280,102 L280,148 Z' },
      // 5 Sat — snow ground
      { type: 'path', d: 'M0,148 Q140,138 280,148 L280,180 L0,180 Z' },
      // 6 Sun — bright star / moon accent
      { type: 'circle', cx: 55, cy: 28, r: 10 },
    ],
  },

]

// Pick a cartoon different from last week's
export function pickCartoon(lastId) {
  const ids = CARTOONS.map((_, i) => i).filter(i => i !== lastId)
  return ids[Math.floor(Math.random() * ids.length)]
}
