import { chromium } from 'playwright-core'
const OUT = process.argv[2]
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: 412, height: 900 }, deviceScaleFactor: 2 })
const p = await ctx.newPage()
await p.goto('http://localhost:5173/', { waitUntil:'networkidle', timeout:20000 })
async function menu(){ await p.evaluate(()=>{ const bg=document.querySelector('div[style*="flex-direction: column"][style*="cursor: pointer"]'); if(bg) bg.click() }); await p.waitForTimeout(280) }
async function nav(l){ await p.evaluate((l)=>{ const el=[...document.querySelectorAll('div')].find(d=>d.textContent.trim()===l); if(el) el.click() }, l); await p.waitForTimeout(650) }
async function openCard(txt){ await p.evaluate((txt)=>{ const c=[...document.querySelectorAll('div')].find(d=>d.textContent.trim().startsWith(txt)); if(c){ let n=c; while(n && !(n.getAttribute('style')||'').includes('cursor: pointer')) n=n.parentElement; if(n) n.click(); } }, txt); await p.waitForTimeout(600) }
await menu(); await nav('Atlas mondial'); await p.screenshot({ path: OUT+'/w-atlas.png' })
await openCard('Sahara'); await p.screenshot({ path: OUT+'/w-region.png' })
await menu(); await nav('Portraits de scientifiques'); await p.screenshot({ path: OUT+'/w-sci.png' })
await openCard('Claude Lorius'); await p.screenshot({ path: OUT+'/w-scidetail.png' })
await menu(); await nav('Les grandes glaciations'); await p.waitForTimeout(400); await p.screenshot({ path: OUT+'/w-glac.png' })
await menu(); await nav('Glossaire du jargon'); await p.waitForTimeout(300); await openCard('Cycles de Milankovitch'); await p.screenshot({ path: OUT+'/w-gloss.png' })
await b.close(); console.log('ok')
