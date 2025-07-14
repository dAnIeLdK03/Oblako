import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a simple SVG icon generator
function generateSVGIcon(size) {
  const radius = size * 0.15;
  const sunX = size * 0.5;
  const sunY = size * 0.35;
  const cloudY = size * 0.65;
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#74b9ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0984e3;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad1)"/>
  
  <!-- Sun -->
  <circle cx="${sunX}" cy="${sunY}" r="${radius}" fill="#fff" opacity="0.9"/>
  
  <!-- Sun rays -->
  <g stroke="#fff" stroke-width="${size * 0.02}" opacity="0.6">
    ${Array.from({length: 8}, (_, i) => {
      const angle = (i * Math.PI) / 4;
      const startX = sunX + Math.cos(angle) * radius;
      const startY = sunY + Math.sin(angle) * radius;
      const endX = sunX + Math.cos(angle) * (radius + size * 0.08);
      const endY = sunY + Math.sin(angle) * (radius + size * 0.08);
      return `<line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}"/>`;
    }).join('')}
  </g>
  
  <!-- Cloud -->
  <g fill="#fff" opacity="0.7">
    <circle cx="${sunX}" cy="${cloudY}" r="${size * 0.12}"/>
    <circle cx="${sunX + size * 0.08}" cy="${cloudY}" r="${size * 0.1}"/>
    <circle cx="${sunX - size * 0.08}" cy="${cloudY}" r="${size * 0.1}"/>
    <circle cx="${sunX + size * 0.04}" cy="${cloudY - size * 0.05}" r="${size * 0.08}"/>
    <circle cx="${sunX - size * 0.04}" cy="${cloudY - size * 0.05}" r="${size * 0.08}"/>
  </g>
  
  <!-- Decorative elements -->
  <circle cx="${sunX - size * 0.15}" cy="${sunY - size * 0.1}" r="${size * 0.03}" fill="#fff" opacity="0.6"/>
  <circle cx="${sunX + size * 0.2}" cy="${sunY + size * 0.05}" r="${size * 0.025}" fill="#fff" opacity="0.6"/>
</svg>`;
}

// Icon sizes from manifest.json
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Ensure icons directory exists
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate all icons
iconSizes.forEach(size => {
  const svgContent = generateSVGIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`Generated: ${filename}`);
});

console.log('\nAll SVG icons generated successfully!');
console.log('You can convert these to PNG using online tools or image editing software.');
console.log('For now, the SVG icons will work for most PWA purposes.'); 