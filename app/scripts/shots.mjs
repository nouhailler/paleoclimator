// Capture des captures d'écran de l'app (cadre téléphone) pour le README.
// Usage : node scripts/shots.mjs  (le serveur dev doit tourner sur :5173)
import { chromium } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dir = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dir, '../docs/screenshots')
const BASE = 'http://localhost:5173/'

// Écran mobile façon Pixel/Redmi. DPR 2 pour du net.
const VIEWPORT = { width: 412, height: 892 }

// Écrans à capturer : le state `screen` est piloté par setState.
// On force l'écran en cliquant l'entrée de menu correspondante puis on capture.
const SHOTS = [
  { file: 'home.png',       label: 'Frise des ères' },
  { file: 'atlas.png',      label: 'Atlas mondial' },
  { file: 'scientists.png', label: 'Portraits de scientifiques' },
  { file: 'globe.png',      label: 'Globe 3D' },
  { file: 'timemachine.png',label: 'Time-Machine' },
  { file: 'simulator.png',  label: 'Simulateur climatique' },
]

// Sélectionne un écran : on clique l'entrée de nav (le tiroir est dans le DOM,
// juste translaté hors écran — le clic natif déclenche quand même le onClick React).
async function goScreen(page, label) {
  const ok = await page.evaluate((lbl) => {
    const el = [...document.querySelectorAll('div')].find(d => d.textContent.trim() === lbl && d.offsetParent !== null || d.textContent.trim() === lbl)
    if (!el) return false
    el.click()
    return true
  }, label)
  if (!ok) throw new Error('Entrée de menu introuvable : ' + label)
  await page.waitForTimeout(700)
  // ramène le scroll en haut
  await page.evaluate(() => { const s = document.querySelector('div[style*="overflow-y"]'); if (s) s.scrollTop = 0 })
  await page.waitForTimeout(200)
}

const b = await chromium.launch()
const ctx = await b.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 })
const page = await ctx.newPage()
await page.goto(BASE, { waitUntil: 'networkidle', timeout: 20000 })
await page.waitForTimeout(800)

for (const s of SHOTS) {
  await goScreen(page, s.label)
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${OUT}/${s.file}` })
  console.log('✓', s.file)
}

await b.close()
console.log('Terminé →', OUT)
