import fs from 'fs';
import zlib from 'zlib';

// Create a high-res RGBA PNG (width: 480, height: 120) with Maslow SA Sdn Bhd logo
const width = 480;
const height = 120;
const buffer = Buffer.alloc(height * (1 + width * 4));

// Fill background: transparent (or clean white/gradient)
// Let's create an elegant white/transparent banner with the maroon/terracotta logo mark and typography
for (let y = 0; y < height; y++) {
  const rowStart = y * (1 + width * 4);
  buffer[rowStart] = 0; // Filter type 0 (None)
  for (let x = 0; x < width; x++) {
    const px = rowStart + 1 + x * 4;
    // Default transparent
    buffer[px] = 0;
    buffer[px + 1] = 0;
    buffer[px + 2] = 0;
    buffer[px + 3] = 0;
  }
}

// Function to set pixel
function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  const px = y * (1 + width * 4) + 1 + x * 4;
  buffer[px] = r;
  buffer[px + 1] = g;
  buffer[px + 2] = b;
  buffer[px + 3] = a;
}

// Draw rounded rectangle for emblem
// Emblem from x: 10 to 90, y: 20 to 100
const radius = 18;
for (let y = 20; y <= 100; y++) {
  for (let x = 10; x <= 90; x++) {
    // Check rounded corners
    const dx = Math.max(10 + radius - x, 0, x - (90 - radius));
    const dy = Math.max(20 + radius - y, 0, y - (100 - radius));
    if (dx * dx + dy * dy <= radius * radius) {
      // Gradient from #A14646 (161, 70, 70) to #DA6556 (218, 101, 86)
      const t = (x - 10 + y - 20) / 160;
      const r = Math.round(161 + t * (218 - 161));
      const g = Math.round(70 + t * (101 - 70));
      const b = Math.round(70 + t * (86 - 70));
      setPixel(x, y, r, g, b, 255);
    }
  }
}

// Let's draw an inner diamond / pyramid motif (representing Maslow's hierarchy of needs)
// Center at x: 50, y: 60
for (let y = 35; y <= 85; y++) {
  const halfW = (y - 35) * 0.7;
  for (let x = Math.round(50 - halfW); x <= Math.round(50 + halfW); x++) {
    // Draw stepped tiers of pyramid
    if (y === 50 || y === 65 || y === 78) continue; // tier dividers
    setPixel(x, y, 255, 255, 255, 230);
  }
}

// Encode PNG chunk
function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4);
  data.copy(chunk, 8);

  let crc = 0xffffffff;
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
  }
  for (let i = 4; i < 8 + len; i++) {
    crc = crcTable[(crc ^ chunk[i]) & 0xff] ^ (crc >>> 8);
  }
  chunk.writeInt32BE((crc ^ 0xffffffff) | 0, 8 + len);
  return chunk;
}

const compressed = zlib.deflateSync(buffer);

// PNG Signature
const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

// IHDR
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8; // Bit depth
ihdr[9] = 6; // Color type (RGBA)
ihdr[10] = 0; // Compression
ihdr[11] = 0; // Filter
ihdr[12] = 0; // Interlace

const pngChunks = [
  signature,
  makeChunk('IHDR', ihdr),
  makeChunk('IDAT', compressed),
  makeChunk('IEND', Buffer.alloc(0))
];

const pngBuffer = Buffer.concat(pngChunks);

if (!fs.existsSync('public/assets')) {
  fs.mkdirSync('public/assets', { recursive: true });
}

fs.writeFileSync('public/assets/maslow-logo.png', pngBuffer);
console.log('Generated public/assets/maslow-logo.png successfully! Size:', pngBuffer.length);
