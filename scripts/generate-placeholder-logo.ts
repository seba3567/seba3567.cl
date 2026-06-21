import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#6ee7b7"/>
      <stop offset="0.5" stop-color="#10b981"/>
      <stop offset="1" stop-color="#059669"/>
    </linearGradient>
  </defs>
  <path d="M256 40 L440 100 L440 280 Q440 400 256 472 Q72 400 72 280 L72 100 Z" fill="url(#g)" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
  <g transform="translate(256 280)" fill="#0a0a0a">
    <path d="M-60 -20 Q-60 -32 -48 -32 L-12 -32 Q0 -32 0 -20 L0 0 Q0 12 -12 12 L-28 12 L-12 32 Q0 44 12 32 L28 12 L40 24 Q40 32 32 32 L0 32 Q-40 32 -60 0 Z" transform="rotate(-30) scale(1.1)"/>
  </g>
  <g transform="translate(330 200)" fill="#0a0a0a">
    <rect x="-32" y="-7" width="64" height="14" rx="2" transform="rotate(45)"/>
    <rect x="-7" y="-32" width="14" height="64" rx="2" transform="rotate(45)"/>
  </g>
</svg>`;

await sharp(Buffer.from(svg))
	.png()
	.toFile('static/assets/icono.png');

console.log('placeholder icono.png generated');
