// Rend les SVG d'icône en PNG via Chromium (rendu fidèle des dégradés,
// contrairement à certains rasteriseurs SVG qui les rendaient en noir).
// Usage : node scripts/gen-icons.mjs
import { chromium } from 'playwright-core'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dir = dirname(fileURLToPath(import.meta.url))
const ICONS = resolve(__dir, '../public/icons')

const JOBS = [
  { svg: 'icon.svg',          out: 'icon-192.png', size: 192 },
  { svg: 'icon.svg',          out: 'icon-512.png', size: 512 },
  { svg: 'icon-maskable.svg', out: 'icon-512-maskable.png', size: 512 },
  { svg: 'icon-apple.svg',    out: 'icon-180.png', size: 180 }, // apple-touch-icon (opaque)
]

const b = await chromium.launch()
for (const j of JOBS) {
  const svg = readFileSync(resolve(ICONS, j.svg), 'utf8')
  const page = await b.newPage({ viewport: { width: j.size, height: j.size }, deviceScaleFactor: 1 })
  // Fond transparent : les coins arrondis / hors-globe restent transparents.
  await page.setContent(
    `<!doctype html><html><body style="margin:0"><div style="width:${j.size}px;height:${j.size}px">${svg}</div></body></html>`,
    { waitUntil: 'networkidle' }
  )
  // Force la taille du SVG au viewport.
  await page.evaluate((s) => {
    const el = document.querySelector('svg')
    el.setAttribute('width', s); el.setAttribute('height', s)
  }, j.size)
  await page.screenshot({ path: resolve(ICONS, j.out), omitBackground: true })
  await page.close()
  console.log('✓', j.out, `(${j.size}px)`)
}
await b.close()
console.log('Icônes générées →', ICONS)
