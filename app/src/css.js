// Convertit une chaîne CSS inline ("color:#fff;font-size:12px") en objet de style React.
// Permet de porter le markup du prototype quasi verbatim (React refuse les strings sur `style`).
// Mémoïsé : les chaînes statiques ne sont parsées qu'une fois.
const cache = new Map()

function toCamel(prop) {
  if (prop.startsWith('--')) return prop // custom properties : inchangées
  return prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

export function css(str) {
  if (str == null || str === '') return undefined
  if (typeof str === 'object') return str // déjà un objet
  const hit = cache.get(str)
  if (hit) return hit

  const out = {}
  // Découpe sur ';' hors parenthèses (préserve rgba(), linear-gradient(), calc()…).
  let depth = 0
  let start = 0
  const parts = []
  for (let i = 0; i < str.length; i++) {
    const ch = str[i]
    if (ch === '(') depth++
    else if (ch === ')') depth--
    else if (ch === ';' && depth === 0) {
      parts.push(str.slice(start, i))
      start = i + 1
    }
  }
  parts.push(str.slice(start))

  for (const part of parts) {
    const idx = part.indexOf(':')
    if (idx === -1) continue
    const prop = part.slice(0, idx).trim()
    const val = part.slice(idx + 1).trim()
    if (!prop) continue
    out[toCamel(prop)] = val
  }
  cache.set(str, out)
  return out
}
