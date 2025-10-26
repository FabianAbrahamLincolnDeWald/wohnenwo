// scripts/generate-placeholders.mjs
import fs from "node:fs/promises";
import sharp from "sharp";

const files = [
  {
    out: "public/images/dienst-wirkung/hero/hero-bg.webp",
    w: 1800,
    h: 1000,
    color: "#ef4444", // rot
    label: "HERO 1800×1000"
  },
  {
    out: "public/images/dienst-wirkung/cards/card-1.webp",
    w: 800,
    h: 500,
    color: "#3b82f6", // blau
    label: "CARD 800×500"
  },
  {
    out: "public/images/dienst-wirkung/overlays/overlay-vision.webp",
    w: 1200,
    h: 800,
    color: "#10b981", // grün
    label: "OVERLAY 1200×800"
  },
];

const svg = (w, h, color, text) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <rect width="100%" height="100%" fill="${color}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
        font-size="${Math.round(Math.min(w, h) / 15)}" fill="white" opacity="0.9">
    ${text}
  </text>
</svg>
`;

async function main() {
  for (const f of files) {
    const svgBuf = Buffer.from(svg(f.w, f.h, f.color, f.label));
    const webp = await sharp(svgBuf).webp({ quality: 80 }).toBuffer();
    await fs.writeFile(f.out, webp);
    console.log("✓ wrote", f.out);
  }

  // Simple Logo (SVG)
  const logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 32">
  <rect x="1" y="1" width="118" height="30" rx="6" fill="none" stroke="#111" stroke-width="2"/>
  <text x="60" y="21" font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="14" text-anchor="middle" fill="#111">WohnenWo</text>
</svg>`;
  await fs.writeFile("public/images/brand/logos/wohnenwo-logo.svg", logoSvg);
  console.log("✓ wrote public/images/brand/logos/wohnenwo-logo.svg");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
