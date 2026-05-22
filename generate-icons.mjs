// Generates placeholder solid-colour PNG icons for the PWA manifest.
// Run once: node generate-icons.mjs
import zlib from 'zlib'
import fs from 'fs'

function crc32(buf) {
  let crc = 0xffffffff
  for (const b of buf) {
    crc ^= b
    for (let i = 0; i < 8; i++) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeStr = Buffer.from(type)
  const payload = Buffer.concat([typeStr, data])
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(payload))
  return Buffer.concat([len, typeStr, data, crcBuf])
}

function makePNG(size, r, g, b) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8  // bit depth
  ihdr[9] = 2  // RGB

  const rowSize = 1 + size * 3
  const raw = Buffer.alloc(size * rowSize)
  for (let y = 0; y < size; y++) {
    raw[y * rowSize] = 0
    for (let x = 0; x < size; x++) {
      const i = y * rowSize + 1 + x * 3
      raw[i] = r
      raw[i + 1] = g
      raw[i + 2] = b
    }
  }
  const compressed = zlib.deflateSync(raw)

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// Dusk indigo: #4F46E5 = rgb(79, 70, 229)
fs.writeFileSync('public/icons/icon-192.png', makePNG(192, 79, 70, 229))
fs.writeFileSync('public/icons/icon-512.png', makePNG(512, 79, 70, 229))
console.log('Icons created: public/icons/icon-192.png and icon-512.png')
