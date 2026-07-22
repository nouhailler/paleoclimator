import React from "react"
import { css } from "./css"
import ImageSlot from "./ImageSlot.jsx"

// Généré depuis le markup du prototype (Paleoclim.dc.html) via transform.js.
// Traduction fidèle : sc-if -> ternaire, sc-for -> .map, {{x}} -> {v.x} (ou alias de boucle).
export function renderApp(v, self) {
  return (
  <div style={css(`height:100%;display:flex;flex-direction:column;background:#eef4f7;font-family:'IBM Plex Sans',system-ui,sans-serif;color:#0f2c3c;position:relative;overflow:hidden`)}>

    
    <div style={css(`flex-shrink:0;padding:14px 18px 12px;background:linear-gradient(180deg,#0c2534 0%,#123246 100%);color:#eaf3f7`)}>
      <div style={css(`display:flex;align-items:center;justify-content:space-between`)}>
        <div style={css(`display:flex;align-items:center;gap:11px`)}>
          <div onClick={v.toggleMenu} style={css(`width:26px;height:26px;display:flex;flex-direction:column;justify-content:center;gap:4px;cursor:pointer;flex-shrink:0`)}>
            <div style={css(`width:19px;height:2px;background:#eaf3f7;border-radius:2px`)}></div>
            <div style={css(`width:19px;height:2px;background:#eaf3f7;border-radius:2px`)}></div>
            <div style={css(`width:19px;height:2px;background:#eaf3f7;border-radius:2px`)}></div>
          </div>
          <div style={css(`width:26px;height:26px;border-radius:6px;background:#eaf3f7;display:flex;align-items:center;justify-content:center;flex-shrink:0`)}>
            <div style={css(`width:13px;height:13px;border-radius:50%;background:linear-gradient(135deg,#6fb2d1,#123246)`)}></div>
          </div>
          <div>
            <div style={css(`font-family:'Spectral',serif;font-size:17px;font-weight:600;line-height:1;letter-spacing:0.2px`)}>Paléoclimat</div>
            <div style={css(`font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:#8fb4c6;margin-top:3px`)}>Archives du climat terrestre</div>
          </div>
        </div>
        <div style={css(`display:flex;align-items:center;gap:8px`)}>
          <div onClick={v.openHelp} style={css(`width:26px;height:26px;border-radius:50%;border:1px solid rgba(143,180,198,0.45);display:flex;align-items:center;justify-content:center;font-family:'Spectral',serif;font-size:15px;font-weight:600;color:#eaf3f7;cursor:pointer;flex-shrink:0`)} title="Aide sur cet écran">?</div>
          <div style={css(`display:flex;align-items:center;gap:5px;font-size:9.5px;color:#8fb4c6;border:1px solid rgba(143,180,198,0.35);border-radius:20px;padding:5px 9px`)}>
            <div style={css(`width:6px;height:6px;border-radius:50%;background:#5ecfa6`)}></div>Hors-ligne
          </div>
        </div>
      </div>
    </div>

    
    <div ref={self.scrollRef} style={css(`flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch`)}>

      
      { v.isHome ? (<>
      <div style={css(`padding:16px 16px 26px`)}>
        <div style={css(`font-family:'Spectral',serif;font-size:21px;font-weight:600;line-height:1.15;margin-bottom:4px`)}>Une frise de 4 milliards d'années</div>
        <div style={css(`font-size:12.5px;line-height:1.5;color:#4d6c7d;margin-bottom:16px`)}>Explorez les grands régimes climatiques de la Terre, des serres sans glace aux Terres « boule de neige ». Touchez une ère. Les outils d'analyse sont dans le menu ☰.</div>

        { (v.eras || []).map((era, __k1) => (<React.Fragment key={__k1}>
          <div onClick={era.open} style={css(`display:flex;flex-direction:column;margin-bottom:9px;border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 1px 2px rgba(15,44,60,0.06),0 8px 20px rgba(15,44,60,0.05);cursor:pointer;border:1px solid #e0eaef`)}>
            <div style={css(`position:relative;height:78px;overflow:hidden`)}>
              <img src={era.img} alt={'Paléoenvironnement — ' + era.name} loading="lazy" style={css(`width:100%;height:100%;object-fit:cover;display:block`)} />
              <div style={css(`position:absolute;left:0;right:0;bottom:0;height:22px;background:linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,0.9))`)}></div>
            </div>
            <div style={css(`display:flex;gap:0`)}>
            <div style={css(`width:8px;flex-shrink:0;background:${era.color}`)}></div>
            <div style={css(`flex:1;padding:13px 14px;min-width:0`)}>
              <div style={css(`display:flex;align-items:baseline;justify-content:space-between;gap:8px`)}>
                <div style={css(`font-family:'Spectral',serif;font-size:16px;font-weight:600;color:#0f2c3c`)}>{era.name}</div>
                <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:10px;color:#6b8898;white-space:nowrap`)}>{era.span}</div>
              </div>
              <div style={css(`font-size:11.5px;line-height:1.45;color:#4d6c7d;margin-top:5px`)}>{era.tag}</div>
              <div style={css(`display:flex;gap:14px;margin-top:9px`)}>
                <div>
                  <div style={css(`font-size:8.5px;letter-spacing:0.6px;text-transform:uppercase;color:#8aa5b3`)}>CO₂ atm.</div>
                  <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:500;color:#0f2c3c;margin-top:2px`)}>{era.co2}</div>
                </div>
                <div>
                  <div style={css(`font-size:8.5px;letter-spacing:0.6px;text-transform:uppercase;color:#8aa5b3`)}>Régime</div>
                  <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:500;color:#0f2c3c;margin-top:2px`)}>{era.regime}</div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </React.Fragment>)) }

        <div style={css(`margin-top:6px;padding:13px 15px;border-radius:12px;background:#dfeef4;border:1px dashed #a9cdda`)}>
          <div style={css(`font-size:11px;line-height:1.5;color:#345a6c`)}><span style={css(`font-weight:600`)}>Note.</span> Échelle temporelle non linéaire. Données CO₂ d'après proxies (paléosols, δ¹¹B) et carottes de glace pour le Quaternaire.</div>
        </div>
      </div>
      </>) : null }

      
      { v.isEra ? (<>
      <div>
        <div style={css(`padding:16px 16px 14px;background:${v.era.wash}`)}>
          <div onClick={v.goHome} style={css(`font-size:11px;color:#38617a;font-weight:500;margin-bottom:12px;cursor:pointer`)}>‹ Frise des ères</div>
          <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:1px;color:#5c7d8e;text-transform:uppercase`)}>{v.era.span}</div>
          <div style={css(`font-family:'Spectral',serif;font-size:26px;font-weight:600;line-height:1.1;margin-top:4px`)}>{v.era.name}</div>
          <div style={css(`font-size:13px;line-height:1.5;color:#3a5a6b;margin-top:8px`)}>{v.era.tag}</div>
        </div>

        <div style={css(`padding:16px`)}>
          
          <div style={css(`display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:18px`)}>
            <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:10px;padding:11px 10px`)}>
              <div style={css(`font-size:8px;letter-spacing:0.6px;text-transform:uppercase;color:#8aa5b3`)}>CO₂ atm.</div>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:14px;font-weight:500;margin-top:4px;color:#0f2c3c`)}>{v.era.co2}</div>
            </div>
            <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:10px;padding:11px 10px`)}>
              <div style={css(`font-size:8px;letter-spacing:0.6px;text-transform:uppercase;color:#8aa5b3`)}>T° globale</div>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:14px;font-weight:500;margin-top:4px;color:#0f2c3c`)}>{v.era.temp}</div>
            </div>
            <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:10px;padding:11px 10px`)}>
              <div style={css(`font-size:8px;letter-spacing:0.6px;text-transform:uppercase;color:#8aa5b3`)}>Calottes</div>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:14px;font-weight:500;margin-top:4px;color:#0f2c3c`)}>{v.era.ice}</div>
            </div>
          </div>

          
          <div style={css(`height:150px;border-radius:12px;margin-bottom:18px;overflow:hidden;position:relative;border:1px solid #dbe7ec`)}>
            <img src={v.era.img} alt={'Reconstitution paléoenvironnement — ' + v.era.name} style={css(`width:100%;height:100%;object-fit:cover;display:block`)} />
            <div style={css(`position:absolute;left:8px;bottom:8px;font-family:'IBM Plex Mono',monospace;font-size:9.5px;color:#33505f;background:rgba(255,255,255,0.82);padding:4px 8px;border-radius:5px`)}>reconstitution paléoenvironnement — {v.era.name}</div>
          </div>

          <div style={css(`font-family:'Spectral',serif;font-size:15px;font-weight:600;margin-bottom:7px`)}>Climat & contexte</div>
          <div style={css(`font-size:13px;line-height:1.6;color:#33505f;margin-bottom:18px`)}>{v.era.body}</div>

          <div style={css(`font-family:'Spectral',serif;font-size:15px;font-weight:600;margin-bottom:9px`)}>Sous-périodes</div>
          <div style={css(`display:flex;flex-wrap:wrap;gap:7px;margin-bottom:18px`)}>
            { (v.era.subperiods || []).map((sp, __k1) => (<React.Fragment key={__k1}>
              <div style={css(`background:${v.era.wash};border:1px solid #dbe7ec;border-radius:8px;padding:7px 11px`)}>
                <div style={css(`font-size:12px;font-weight:600;color:#0f2c3c`)}>{sp.name}</div>
                <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:9.5px;color:#6b8898;margin-top:2px`)}>{sp.span}</div>
              </div>
            </React.Fragment>)) }
          </div>

          <div style={css(`font-family:'Spectral',serif;font-size:15px;font-weight:600;margin-bottom:9px`)}>Événements marquants</div>
          { (v.era.events || []).map((ev, __k1) => (<React.Fragment key={__k1}>
            <div style={css(`display:flex;gap:11px;padding:10px 0;border-top:1px solid #e4edf1`)}>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:10.5px;color:${v.era.color};font-weight:500;width:74px;flex-shrink:0;padding-top:1px`)}>{ev.when}</div>
              <div style={css(`font-size:12px;line-height:1.45;color:#33505f`)}>{ev.what}</div>
            </div>
          </React.Fragment>)) }

          <div style={css(`font-family:'Spectral',serif;font-size:15px;font-weight:600;margin:22px 0 4px`)}>Indicateurs paléoclimatiques</div>
          <div style={css(`font-size:11px;color:#6b8898;margin-bottom:6px`)}>Proxies utilisés pour reconstruire climat & CO₂ de cette ère.</div>
          { (v.era.proxies || []).map((px, __k1) => (<React.Fragment key={__k1}>
            <div style={css(`display:flex;gap:10px;padding:9px 0;border-top:1px solid #e4edf1;align-items:flex-start`)}>
              <div style={css(`width:6px;height:6px;border-radius:50%;background:${v.era.color};margin-top:6px;flex-shrink:0`)}></div>
              <div style={css(`font-size:12px;line-height:1.45;color:#33505f`)}>{px}</div>
            </div>
          </React.Fragment>)) }

          <div onClick={v.goData} style={css(`margin-top:22px;padding:14px;border-radius:12px;background:#0f2c3c;color:#eaf3f7;display:flex;align-items:center;justify-content:space-between;cursor:pointer`)}>
            <div>
              <div style={css(`font-size:13px;font-weight:600`)}>Explorer les carottes de glace</div>
              <div style={css(`font-size:10.5px;color:#9cc0d0;margin-top:2px`)}>800 000 ans de CO₂ et température</div>
            </div>
            <div style={css(`font-size:18px;color:#6fb2d1`)}>→</div>
          </div>
        </div>
      </div>
      </>) : null }

      
      { v.isData ? (<>
      <div style={css(`padding:16px 16px 30px`)}>
        <div style={css(`font-family:'Spectral',serif;font-size:21px;font-weight:600;line-height:1.15`)}>EPICA Dome C · Vostok</div>
        <div style={css(`font-size:12px;line-height:1.5;color:#4d6c7d;margin-top:5px;margin-bottom:16px`)}>Enregistrement composite des carottes de glace antarctiques. Faites glisser pour lire les valeurs à un âge donné.</div>

        
        <div style={css(`display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px`)}>
          <div style={css(`background:#0f2c3c;border-radius:10px;padding:11px 10px;color:#eaf3f7`)}>
            <div style={css(`font-size:8px;letter-spacing:0.6px;text-transform:uppercase;color:#8fb4c6`)}>Âge</div>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:14px;font-weight:500;margin-top:4px`)}>{v.scrubAgeTxt}</div>
          </div>
          <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:10px;padding:11px 10px`)}>
            <div style={css(`font-size:8px;letter-spacing:0.6px;text-transform:uppercase;color:#8aa5b3`)}>CO₂</div>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:14px;font-weight:500;margin-top:4px;color:#1d6f96`)}>{v.scrubCo2} ppm</div>
          </div>
          <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:10px;padding:11px 10px`)}>
            <div style={css(`font-size:8px;letter-spacing:0.6px;text-transform:uppercase;color:#8aa5b3`)}>ΔT°</div>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:14px;font-weight:500;margin-top:4px;color:#b5654a`)}>{v.scrubTempTxt}</div>
          </div>
        </div>

        
        <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:12px;padding:12px 12px 8px;margin-bottom:12px`)}>
          <div style={css(`display:flex;justify-content:space-between;align-items:center;margin-bottom:4px`)}>
            <div style={css(`font-size:11px;font-weight:600;color:#1d6f96`)}>CO₂ atmosphérique (ppm)</div>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:9px;color:#8aa5b3`)}>180 – 300</div>
          </div>
          <svg viewBox="0 0 320 118" style={css(`width:100%;display:block`)}>
            <line x1="30" y1="94" x2="310" y2="94" stroke="#eef3f6" strokeWidth="1" />
            <line x1="30" y1="57" x2="310" y2="57" stroke="#eef3f6" strokeWidth="1" />
            <line x1="30" y1="20" x2="310" y2="20" stroke="#eef3f6" strokeWidth="1" />
            <path d={v.co2Area} fill="#1d6f96" fillOpacity="0.08" />
            <path d={v.co2Path} fill="none" stroke="#1d6f96" strokeWidth="1.8" strokeLinejoin="round" />
            <line x1={v.scrubX} y1="10" x2={v.scrubX} y2="105" stroke="#0f2c3c" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx={v.scrubX} cy={v.co2MarkY} r="4" fill="#fff" stroke="#1d6f96" strokeWidth="2" />
            <text x="30" y="112" fontFamily="'IBM Plex Mono',monospace" fontSize="8" fill="#8aa5b3">800 ka</text>
            <text x="290" y="112" fontFamily="'IBM Plex Mono',monospace" fontSize="8" fill="#8aa5b3">0</text>
          </svg>
        </div>

        
        <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:12px;padding:12px 12px 8px;margin-bottom:16px`)}>
          <div style={css(`display:flex;justify-content:space-between;align-items:center;margin-bottom:4px`)}>
            <div style={css(`font-size:11px;font-weight:600;color:#b5654a`)}>Anomalie de température (°C)</div>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:9px;color:#8aa5b3`)}>−9 … +2</div>
          </div>
          <svg viewBox="0 0 320 118" style={css(`width:100%;display:block`)}>
            <line x1="30" y1="94" x2="310" y2="94" stroke="#eef3f6" strokeWidth="1" />
            <line x1="30" y1="49" x2="310" y2="49" stroke="#f2e4de" strokeWidth="1" />
            <line x1="30" y1="20" x2="310" y2="20" stroke="#eef3f6" strokeWidth="1" />
            <path d={v.tempPath} fill="none" stroke="#b5654a" strokeWidth="1.8" strokeLinejoin="round" />
            <line x1={v.scrubX} y1="10" x2={v.scrubX} y2="105" stroke="#0f2c3c" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx={v.scrubX} cy={v.tempMarkY} r="4" fill="#fff" stroke="#b5654a" strokeWidth="2" />
            <text x="30" y="112" fontFamily="'IBM Plex Mono',monospace" fontSize="8" fill="#8aa5b3">800 ka</text>
            <text x="290" y="112" fontFamily="'IBM Plex Mono',monospace" fontSize="8" fill="#8aa5b3">aujourd'hui</text>
          </svg>
        </div>

        
        <input type="range" min="0" max="800" step="20" value={v.age} onChange={v.onScrub} onInput={v.onScrub} style={css(`width:100%;accent-color:#1d6f96;margin-bottom:18px`)} />

        <div style={css(`padding:13px 15px;border-radius:12px;background:#12303f;color:#dce9ef`)}>
          <div style={css(`font-size:11px;letter-spacing:0.6px;text-transform:uppercase;color:#7fa8bc;margin-bottom:6px`)}>Repère actuel</div>
          <div style={css(`font-size:12.5px;line-height:1.55`)}>Le CO₂ mesuré en 2024 atteint <span style={css(`font-family:'IBM Plex Mono',monospace;color:#8fd0b4;font-weight:500`)}>≈ 422 ppm</span> — bien au-delà du maximum interglaciaire naturel de <span style={css(`font-family:'IBM Plex Mono',monospace;color:#fff`)}>~300 ppm</span> des 800 derniers millénaires.</div>
        </div>
      </div>
      </>) : null }

      
      { v.isTM ? (<>
      <div style={css(`padding:14px 14px 30px`)}>
        <div style={css(`font-family:'Spectral',serif;font-size:21px;font-weight:600;line-height:1.15`)}>Time-Machine</div>
        <div style={css(`font-size:11.5px;line-height:1.5;color:#4d6c7d;margin-top:5px`)}>Chronologie interactive. Faites glisser le curseur pour synchroniser les quatre indicateurs à une même date.</div>

        <div style={css(`display:flex;gap:6px;margin-top:12px;margin-bottom:12px`)}>
          <div onClick={v.setFull} style={v.rangeFullStyle}>4,5 Ga · Temps profond</div>
          <div onClick={v.setPhan} style={v.rangePhanStyle}>541 Ma · Phanérozoïque</div>
        </div>

        <div style={css(`background:#0f2c3c;border-radius:12px;padding:12px 13px;color:#eaf3f7;margin-bottom:12px`)}>
          <div style={css(`display:flex;justify-content:space-between;align-items:baseline`)}>
            <div style={css(`font-family:'Spectral',serif;font-size:19px;font-weight:600`)}>{v.tmAgeTxt}</div>
            <div style={css(`font-size:10px;color:#8fb4c6;font-family:'IBM Plex Mono',monospace`)}>{v.tmEra}</div>
          </div>
          <div style={css(`display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:6px;margin-top:11px`)}>
            <div><div style={css(`font-size:7.5px;letter-spacing:.4px;text-transform:uppercase;color:#7fa8bc`)}>Temp.</div><div style={css(`font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:#e79b7e;margin-top:2px`)}>{v.tmTempTxt}</div></div>
            <div><div style={css(`font-size:7.5px;letter-spacing:.4px;text-transform:uppercase;color:#7fa8bc`)}>CO₂</div><div style={css(`font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:#7fc1e0;margin-top:2px`)}>{v.tmCo2Txt}</div></div>
            <div><div style={css(`font-size:7.5px;letter-spacing:.4px;text-transform:uppercase;color:#7fa8bc`)}>Mer</div><div style={css(`font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:#8fd0b4;margin-top:2px`)}>{v.tmSeaTxt}</div></div>
            <div><div style={css(`font-size:7.5px;letter-spacing:.4px;text-transform:uppercase;color:#7fa8bc`)}>Genres</div><div style={css(`font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:#c8b6e6;margin-top:2px`)}>{v.tmBioTxt}</div></div>
          </div>
        </div>

        <div style={css(`position:relative;height:28px`)}>
          <div style={css(`position:absolute;left:2.5%;right:1.9%;top:15px;height:1px;background:#cfe0e8`)}></div>
          <div style={css(`position:absolute;top:2px;bottom:0;left:${v.tmScrubPct}%;width:1px;background:#0f2c3c`)}></div>
          { (v.tmEvents || []).map((ev, __k1) => (<React.Fragment key={__k1}>
            <div onClick={ev.open} title={ev.title} style={css(`position:absolute;top:8px;left:${ev.leftPct}%;transform:translateX(-50%);width:13px;height:13px;border-radius:50%;background:${ev.color};border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.3);cursor:pointer`)}></div>
          </React.Fragment>)) }
        </div>

        <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:12px;padding:8px 10px 4px;margin-bottom:8px`)}>
          <div style={css(`display:flex;justify-content:space-between;margin-bottom:1px`)}>
            <div style={css(`font-size:10px;font-weight:600;color:#d97a52`)}>Température globale (°C)</div>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:8px;color:#8aa5b3`)}>5 – 28</div>
          </div>
          <svg viewBox="0 0 320 82" style={css(`width:100%;display:block`)}>
            <path d={v.tmTempPath} fill="none" stroke="#d97a52" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"></path>
            <line x1={v.tmScrubX} y1="8" x2={v.tmScrubX} y2="74" stroke="#0f2c3c" strokeWidth="1" strokeDasharray="3 3"></line>
            <circle cx={v.tmScrubX} cy={v.tmTempMarkY} r="3.5" fill="#fff" stroke="#d97a52" strokeWidth="2"></circle>
          </svg>
        </div>

        <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:12px;padding:8px 10px 4px;margin-bottom:8px`)}>
          <div style={css(`display:flex;justify-content:space-between;margin-bottom:1px`)}>
            <div style={css(`font-size:10px;font-weight:600;color:#1d6f96`)}>CO₂ atmosphérique (ppm, log)</div>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:8px;color:#8aa5b3`)}>150 – 30 000</div>
          </div>
          <svg viewBox="0 0 320 82" style={css(`width:100%;display:block`)}>
            <path d={v.tmCo2Path} fill="none" stroke="#1d6f96" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"></path>
            <line x1={v.tmScrubX} y1="8" x2={v.tmScrubX} y2="74" stroke="#0f2c3c" strokeWidth="1" strokeDasharray="3 3"></line>
            <circle cx={v.tmScrubX} cy={v.tmCo2MarkY} r="3.5" fill="#fff" stroke="#1d6f96" strokeWidth="2"></circle>
          </svg>
        </div>

        <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:12px;padding:8px 10px 4px;margin-bottom:8px`)}>
          <div style={css(`display:flex;justify-content:space-between;margin-bottom:1px`)}>
            <div style={css(`font-size:10px;font-weight:600;color:#2f9e6f`)}>Niveau marin relatif (m)</div>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:8px;color:#8aa5b3`)}>−130 – +260</div>
          </div>
          <svg viewBox="0 0 320 82" style={css(`width:100%;display:block`)}>
            <path d={v.tmSeaPath} fill="none" stroke="#2f9e6f" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"></path>
            <line x1={v.tmScrubX} y1="8" x2={v.tmScrubX} y2="74" stroke="#0f2c3c" strokeWidth="1" strokeDasharray="3 3"></line>
            <circle cx={v.tmScrubX} cy={v.tmSeaMarkY} r="3.5" fill="#fff" stroke="#2f9e6f" strokeWidth="2"></circle>
          </svg>
        </div>

        <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:12px;padding:8px 10px 4px;margin-bottom:8px`)}>
          <div style={css(`display:flex;justify-content:space-between;margin-bottom:1px`)}>
            <div style={css(`font-size:10px;font-weight:600;color:#7d5bb0`)}>Biodiversité marine (genres)</div>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:8px;color:#8aa5b3`)}>0 – 3000</div>
          </div>
          <svg viewBox="0 0 320 82" style={css(`width:100%;display:block`)}>
            <path d={v.tmBioPath} fill="none" stroke="#7d5bb0" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"></path>
            <line x1={v.tmScrubX} y1="8" x2={v.tmScrubX} y2="74" stroke="#0f2c3c" strokeWidth="1" strokeDasharray="3 3"></line>
            <circle cx={v.tmScrubX} cy={v.tmBioMarkY} r="3.5" fill="#fff" stroke="#7d5bb0" strokeWidth="2"></circle>
          </svg>
        </div>

        <input type="range" min="0" max="1000" step="1" value={v.tmScrub} onChange={v.onTmScrub} onInput={v.onTmScrub} style={css(`width:100%;accent-color:#1d6f96;margin-top:4px`)} />
        <div style={css(`display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;font-size:9px;color:#8aa5b3;margin-top:2px`)}>
          <span>{v.tmLeftLabel}</span><span>aujourd'hui</span>
        </div>

        <div style={css(`margin-top:14px;padding:11px 13px;border-radius:10px;background:#eef4f7;border:1px solid #dbe7ec;font-size:10px;line-height:1.55;color:#5b7688`)}>Touchez un point coloré pour ouvrir l'événement. CO₂ en échelle logarithmique. Reconstruction composite schématique d'après Veizer (δ¹⁸O), Zachos, GEOCARB, Sepkoski et le composite EPICA.</div>
      </div>
      </>) : null }

      
      { v.isMaps ? (<>
      <div style={css(`padding:14px 14px 30px`)}>
        <div style={css(`font-family:'Spectral',serif;font-size:21px;font-weight:600;line-height:1.15`)}>Cartes paléo · Avant / Après</div>
        <div style={css(`font-size:11.5px;line-height:1.5;color:#4d6c7d;margin-top:5px`)}>Glissez le curseur pour comparer le monde actuel à sa configuration passée. Déplacez le repère pour marquer votre région.</div>

        <div style={css(`display:flex;gap:6px;margin-top:12px;margin-bottom:12px`)}>
          <div onClick={v.setPangea} style={v.periodPangeaStyle}>Pangée<br />250 Ma</div>
          <div onClick={v.setCret} style={v.periodCretStyle}>Crétacé<br />90 Ma</div>
          <div onClick={v.setLgm} style={v.periodLgmStyle}>Dern. glaciation<br />21 ka</div>
        </div>

        <div ref={v.cmpRef} style={css(`position:relative;width:100%;height:224px;border-radius:14px;overflow:hidden;border:1px solid #cfe0e8;background:#dbe7ec;touch-action:none`)}>
          <ImageSlot ph="Déposez une carte du monde ACTUELLE" fill />
          <div style={v.overlayClipStyle}>
            <div style={v.slotPangeaStyle}><ImageSlot ph="Carte de la Pangée (≈250 Ma)" fill /></div>
            <div style={v.slotCretStyle}><ImageSlot ph="Carte du Crétacé (≈90 Ma)" fill /></div>
            <div style={v.slotLgmStyle}><ImageSlot ph="Calottes au dernier max. glaciaire (≈21 ka)" fill /></div>
          </div>

          <div style={css(`position:absolute;top:8px;left:8px;z-index:14;font-family:'IBM Plex Mono',monospace;font-size:9px;color:#fff;background:rgba(15,44,60,0.72);padding:3px 8px;border-radius:20px;pointer-events:none`)}>{v.mapPeriodLabel}</div>
          <div style={css(`position:absolute;top:8px;right:8px;z-index:14;font-family:'IBM Plex Mono',monospace;font-size:9px;color:#fff;background:rgba(15,44,60,0.72);padding:3px 8px;border-radius:20px;pointer-events:none`)}>Aujourd'hui</div>

          <div style={v.handleStyle}></div>
          <div style={v.handleGripStyle}>⟷</div>

          <div onPointerDown={v.onPinDown} onPointerMove={v.onPinMove} onPointerUp={v.onPinUp} style={v.pinStyle}>
            <div style={css(`background:#0f2c3c;color:#eaf3f7;font-size:9.5px;font-weight:600;padding:3px 7px;border-radius:6px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.3);margin-bottom:2px`)}>{v.pinLabel}</div>
            <div style={css(`width:14px;height:14px;border-radius:50% 50% 50% 0;background:#d97a52;border:2px solid #fff;transform:rotate(-45deg);box-shadow:0 2px 5px rgba(0,0,0,.35)`)}></div>
          </div>
        </div>

        <input type="range" min="0" max="100" step="1" value={v.reveal} onChange={v.onReveal} onInput={v.onReveal} style={css(`width:100%;accent-color:#1d6f96;margin-top:10px`)} />
        <div style={css(`display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;font-size:9px;color:#8aa5b3;margin-top:2px`)}>
          <span>{v.mapPeriodLabel}</span><span>aujourd'hui</span>
        </div>

        <div style={css(`margin-top:14px;background:#fff;border:1px solid #e0eaef;border-radius:12px;padding:13px 14px`)}>
          <div style={css(`display:flex;align-items:baseline;justify-content:space-between;gap:8px`)}>
            <div style={css(`font-family:'Spectral',serif;font-size:16px;font-weight:600`)}>{v.mapPeriodLabel}</div>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:10px;color:#6b8898`)}>{v.mapPeriodAge}</div>
          </div>
          <div style={css(`font-size:12.5px;line-height:1.55;color:#33505f;margin-top:8px`)}>{v.mapPeriodNote}</div>
        </div>

        <div style={css(`margin-top:12px;background:#eef4f7;border:1px solid #dbe7ec;border-radius:12px;padding:13px 14px`)}>
          <div style={css(`font-size:9px;letter-spacing:.6px;text-transform:uppercase;color:#8aa5b3`)}>Votre repère</div>
          <input value={v.pinLabel} onChange={v.onPinLabel} onInput={v.onPinLabel} placeholder="Nom de votre région" style={css(`width:100%;margin-top:6px;padding:9px 11px;border:1px solid #cfe0e8;border-radius:9px;font-family:'IBM Plex Sans',sans-serif;font-size:13px;color:#0f2c3c;background:#fff;outline:none`)} />
          <div style={css(`font-size:12px;line-height:1.55;color:#33505f;margin-top:9px`)}>Il y a {v.mapPeriodAge}, « {v.pinLabel} » {v.mapPinNote}</div>
        </div>

        <div style={css(`margin-top:12px;padding:11px 13px;border-radius:10px;background:#12303f;color:#dce9ef;font-size:10px;line-height:1.55`)}>Déposez vos propres cartes dans les cadres (glisser-déposer) — par exemple les reconstructions PALEOMAP / C. R. Scotese. La correspondance exacte du repère dépend de la carte fournie ; le texte reste indicatif.</div>
      </div>
      </>) : null }

      
      { v.isGlobe ? (<>
      <div style={css(`padding:14px 14px 30px`)}>
        <div style={css(`font-family:'Spectral',serif;font-size:21px;font-weight:600;line-height:1.15`)}>Globe 3D · Tectonique</div>
        <div style={css(`font-size:11.5px;line-height:1.5;color:#4d6c7d;margin-top:5px`)}>Manipulez la Terre en 3D — glissez pour la faire tourner, molette ou pincez pour zoomer — et suivez la dérive des continents et des océans à travers les âges.</div>

        <div style={css(`margin-top:12px;background:#fff;border:1px solid #e0eaef;border-radius:12px;padding:11px 12px`)}>
          <div style={css(`font-size:9px;letter-spacing:.6px;text-transform:uppercase;color:#8aa5b3;margin-bottom:6px`)}>Où étiez-vous ? · recherche de lieu</div>
          <div style={css(`position:relative`)}>
            <input value={v.geoQ} onInput={v.onGeoQ} placeholder="Ville, ou « latitude, longitude »" style={css(`width:100%;padding:9px 11px;border:1px solid #cfe0e8;border-radius:9px;font-family:'IBM Plex Sans',sans-serif;font-size:13px;color:#0f2c3c;background:#fff;outline:none`)} />
            { v.geoHasResults ? (<>
            <div style={css(`margin-top:6px;border:1px solid #e4edf1;border-radius:9px;overflow:hidden`)}>
              { (v.geoResults || []).map((gr, __k1) => (<React.Fragment key={__k1}>
                <div onClick={gr.pick} style={css(`display:flex;align-items:baseline;justify-content:space-between;gap:8px;padding:9px 11px;border-top:1px solid #eef3f6;cursor:pointer`)}>
                  <div style={css(`font-size:13px;color:#0f2c3c`)}>{gr.name}</div>
                  <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:9px;color:#8aa5b3;white-space:nowrap`)}>{gr.sub}</div>
                </div>
              </React.Fragment>)) }
            </div>
            </>) : null }
            { v.geoNoResults ? (<>
            <div style={css(`margin-top:6px;font-size:11px;color:#8aa5b3;padding:2px 2px`)}>Aucun lieu trouvé. Essayez une grande ville, ou saisissez « 48.8, 2.3 ».</div>
            </>) : null }
          </div>
          { v.geoActive ? (<>
          <div style={css(`display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:9px;background:#eef4f7;border:1px solid #dbe7ec;border-radius:9px;padding:8px 11px`)}>
            <div style={css(`display:flex;align-items:center;gap:8px;min-width:0;flex:1`)}>
              <div style={css(`width:10px;height:10px;border-radius:50%;background:#e2653f;border:2px solid #fff;box-shadow:0 0 0 1px #e2653f;flex-shrink:0`)}></div>
              <div style={css(`font-size:12.5px;font-weight:600;color:#0f2c3c;white-space:nowrap;overflow:hidden;text-overflow:ellipsis`)}>{v.geoName}</div>
            </div>
            <div onClick={v.clearGeo} style={css(`font-size:11px;color:#38617a;cursor:pointer;flex-shrink:0`)}>effacer ✕</div>
          </div>
          </>) : null }
        </div>

        <div style={css(`display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin:12px 0`)}>
          { (v.globeChips || []).map((gc, __k1) => (<React.Fragment key={__k1}>
            <div onClick={gc.go} style={gc.style}>{gc.label}<br />{gc.age}</div>
          </React.Fragment>)) }
        </div>

        <div style={css(`position:relative;width:100%;height:340px;border-radius:16px;overflow:hidden;border:1px solid #123246;background:radial-gradient(circle at 50% 38%,#123a52 0%,#0a1e2b 62%,#06131c 100%);touch-action:none`)}>
          <div ref={v.globeRef} style={css(`position:absolute;inset:0;touch-action:none`)}></div>
          <div style={css(`position:absolute;top:8px;left:8px;font-family:'IBM Plex Mono',monospace;font-size:9px;color:#cfe4ef;background:rgba(6,19,28,0.6);padding:3px 8px;border-radius:20px;pointer-events:none`)}>{v.globeLabel} · {v.globeAge}</div>
          <div onClick={v.toggleGlobeRotate} style={css(`position:absolute;top:8px;right:8px;font-family:'IBM Plex Mono',monospace;font-size:9px;color:#fff;background:rgba(6,19,28,0.6);padding:4px 9px;border-radius:20px;cursor:pointer;border:1px solid rgba(143,180,198,0.4)`)}>{v.globeRotateLabel}</div>
          <div style={css(`position:absolute;bottom:8px;left:0;right:0;text-align:center;font-family:'IBM Plex Mono',monospace;font-size:8.5px;color:rgba(207,228,239,0.7);pointer-events:none`)}>glisser · tourner  —  pincer · zoomer</div>
          <div style={v.globeLoadingStyle}>Chargement du globe…</div>
        </div>

        <input type="range" min="0" max={v.globeMax} step="1" value={v.globePeriod} onChange={v.onGlobeScrub} onInput={v.onGlobeScrub} style={css(`width:100%;accent-color:#1d6f96;margin-top:12px`)} />
        <div style={css(`display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;font-size:9px;color:#8aa5b3;margin-top:2px`)}>
          <span>plus ancien</span><span>actuel</span>
        </div>

        <div style={css(`margin-top:14px;background:#fff;border:1px solid #e0eaef;border-radius:12px;padding:13px 14px`)}>
          <div style={css(`display:flex;align-items:baseline;justify-content:space-between;gap:8px`)}>
            <div style={css(`font-family:'Spectral',serif;font-size:16px;font-weight:600`)}>{v.globeLabel}</div>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:10px;color:#6b8898`)}>{v.globeAge}</div>
          </div>
          <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:9.5px;color:#5c7d8e;text-transform:uppercase;letter-spacing:.5px;margin-top:3px`)}>{v.globeEra}</div>
          <div style={css(`font-size:12.5px;line-height:1.55;color:#33505f;margin-top:9px`)}>{v.globeNote}</div>
          <div style={css(`display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px`)}>
            <div style={css(`background:#eef4f7;border:1px solid #dbe7ec;border-radius:9px;padding:9px 10px`)}>
              <div style={css(`font-size:8px;letter-spacing:.6px;text-transform:uppercase;color:#8aa5b3`)}>Océan dominant</div>
              <div style={css(`font-size:12px;font-weight:600;color:#0f2c3c;margin-top:3px`)}>{v.globeOcean}</div>
            </div>
            <div style={css(`background:#eef4f7;border:1px solid #dbe7ec;border-radius:9px;padding:9px 10px`)}>
              <div style={css(`font-size:8px;letter-spacing:.6px;text-transform:uppercase;color:#8aa5b3`)}>Niveau marin</div>
              <div style={css(`font-size:12px;font-weight:600;color:#0f2c3c;margin-top:3px`)}>{v.globeSea}</div>
            </div>
          </div>
        </div>

        { v.geoActive ? (<>
        <div style={css(`margin-top:12px;background:#0f2c3c;color:#eaf3f7;border-radius:12px;padding:13px 14px`)}>
          <div style={css(`display:flex;align-items:baseline;justify-content:space-between;gap:8px`)}>
            <div style={css(`font-family:'Spectral',serif;font-size:16px;font-weight:600`)}>{v.geoName}</div>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:10px;color:#8fb4c6`)}>{v.globeAge}</div>
          </div>
          <div style={css(`display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:11px`)}>
            <div><div style={css(`font-size:7.5px;letter-spacing:.5px;text-transform:uppercase;color:#7fa8bc`)}>Position actuelle</div><div style={css(`font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:#eaf3f7;margin-top:3px`)}>{v.geoNowTxt}</div></div>
            <div><div style={css(`font-size:7.5px;letter-spacing:.5px;text-transform:uppercase;color:#7fa8bc`)}>Paléolatitude estimée</div><div style={css(`font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:#e79b7e;margin-top:3px`)}>{v.geoPaleoLatTxt}</div></div>
          </div>
          <div style={css(`font-size:12px;line-height:1.55;color:#cfe0e8;margin-top:11px`)}>{v.geoNarrative}</div>
        </div>
        </>) : null }

        <div style={css(`margin-top:12px;padding:11px 13px;border-radius:10px;background:#12303f;color:#dce9ef;font-size:10px;line-height:1.55`)}>Reconstitution schématique des paléocontinents (contours simplifiés, à visée pédagogique). La paléoposition est une <b>estimation</b> par plaque tectonique — modèles de référence : PALEOMAP (C. R. Scotese) et GPlates.</div>
      </div>
      </>) : null }

      
      { v.isHist ? (<>
      <div style={css(`padding:14px 14px 30px`)}>
        <div style={css(`font-family:'Spectral',serif;font-size:21px;font-weight:600;line-height:1.15`)}>Climat historique · 1421–2008</div>
        <div style={css(`font-size:11.5px;line-height:1.5;color:#4d6c7d;margin-top:5px`)}>Six siècles de climat, du Petit Âge glaciaire au réchauffement actuel. Glissez le curseur pour lire température, précipitations et pression une année donnée.</div>

        <div style={css(`background:#0f2c3c;border-radius:12px;padding:12px 13px;color:#eaf3f7;margin:14px 0 12px`)}>
          <div style={css(`display:flex;justify-content:space-between;align-items:baseline`)}>
            <div style={css(`font-family:'Spectral',serif;font-size:24px;font-weight:600`)}>{v.histYear}</div>
            <div style={css(`font-size:9.5px;color:#8fb4c6;font-family:'IBM Plex Mono',monospace;text-align:right;max-width:56%;line-height:1.3`)}>{v.histEraTxt}</div>
          </div>
          <div style={css(`display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:11px`)}>
            <div><div style={css(`font-size:7.5px;letter-spacing:.4px;text-transform:uppercase;color:#7fa8bc`)}>Temp. anomalie</div><div style={css(`font-family:'IBM Plex Mono',monospace;font-size:12px;color:#e79b7e;margin-top:3px`)}>{v.histTempTxt}</div></div>
            <div><div style={css(`font-size:7.5px;letter-spacing:.4px;text-transform:uppercase;color:#7fa8bc`)}>Précip.</div><div style={css(`font-family:'IBM Plex Mono',monospace;font-size:12px;color:#7fc1e0;margin-top:3px`)}>{v.histPrecTxt}</div></div>
            <div><div style={css(`font-size:7.5px;letter-spacing:.4px;text-transform:uppercase;color:#7fa8bc`)}>Pression</div><div style={css(`font-family:'IBM Plex Mono',monospace;font-size:12px;color:#b9a4e6;margin-top:3px`)}>{v.histPresTxt}</div></div>
          </div>
        </div>

        <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:12px;padding:8px 10px 4px;margin-bottom:8px`)}>
          <div style={css(`display:flex;justify-content:space-between;margin-bottom:1px`)}>
            <div style={css(`font-size:10px;font-weight:600;color:#d97a52`)}>Température — anomalie (°C)</div>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:8px;color:#8aa5b3`)}>−0,9 … +0,7</div>
          </div>
          <svg viewBox="0 0 320 90" style={css(`width:100%;display:block`)}>
            <line x1="30" y1="45" x2="310" y2="45" stroke="#f2e4de" strokeWidth="1"></line>
            <path d={v.histTempPath} fill="none" stroke="#d97a52" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"></path>
            <line x1={v.histScrubX} y1="10" x2={v.histScrubX} y2="82" stroke="#0f2c3c" strokeWidth="1" strokeDasharray="3 3"></line>
            <circle cx={v.histScrubX} cy={v.histTempMarkY} r="3" fill="#d97a52" stroke="#fff" strokeWidth="1.4"></circle>
          </svg>
        </div>

        <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:12px;padding:8px 10px 4px;margin-bottom:8px`)}>
          <div style={css(`display:flex;justify-content:space-between;margin-bottom:1px`)}>
            <div style={css(`font-size:10px;font-weight:600;color:#1d6f96`)}>Précipitations — indice (% vs XXᵉ s.)</div>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:8px;color:#8aa5b3`)}>−10 … +8</div>
          </div>
          <svg viewBox="0 0 320 90" style={css(`width:100%;display:block`)}>
            <line x1="30" y1="45" x2="310" y2="45" stroke="#e6eef2" strokeWidth="1"></line>
            <path d={v.histPrecPath} fill="none" stroke="#1d6f96" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"></path>
            <line x1={v.histScrubX} y1="10" x2={v.histScrubX} y2="82" stroke="#0f2c3c" strokeWidth="1" strokeDasharray="3 3"></line>
            <circle cx={v.histScrubX} cy={v.histPrecMarkY} r="3" fill="#1d6f96" stroke="#fff" strokeWidth="1.4"></circle>
          </svg>
        </div>

        <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:12px;padding:8px 10px 4px;margin-bottom:8px`)}>
          <div style={css(`display:flex;justify-content:space-between;margin-bottom:1px`)}>
            <div style={css(`font-size:10px;font-weight:600;color:#7d5bb0`)}>Pression au niveau de la mer (hPa, anomalie)</div>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:8px;color:#8aa5b3`)}>−2 … +2</div>
          </div>
          <svg viewBox="0 0 320 90" style={css(`width:100%;display:block`)}>
            <line x1="30" y1="45" x2="310" y2="45" stroke="#ece6f4" strokeWidth="1"></line>
            <path d={v.histPresPath} fill="none" stroke="#7d5bb0" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"></path>
            <line x1={v.histScrubX} y1="10" x2={v.histScrubX} y2="82" stroke="#0f2c3c" strokeWidth="1" strokeDasharray="3 3"></line>
            <circle cx={v.histScrubX} cy={v.histPresMarkY} r="3" fill="#7d5bb0" stroke="#fff" strokeWidth="1.4"></circle>
          </svg>
        </div>

        <input type="range" min="1421" max="2008" step="1" value={v.histYear} onChange={v.onHistScrub} onInput={v.onHistScrub} style={css(`width:100%;accent-color:#1d6f96;margin-top:4px`)} />
        <div style={css(`display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;font-size:9px;color:#8aa5b3;margin-top:2px`)}>
          <span>1421</span><span>Petit Âge glaciaire</span><span>2008</span>
        </div>

        <div style={css(`font-family:'Spectral',serif;font-size:15px;font-weight:600;margin:18px 0 8px`)}>Repères historiques</div>
        { (v.histEvents || []).map((he, __k1) => (<React.Fragment key={__k1}>
          <div onClick={he.go} style={css(`display:flex;gap:11px;padding:10px 0;border-top:1px solid #e4edf1;cursor:pointer`)}>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:10.5px;color:#b5654a;font-weight:500;width:70px;flex-shrink:0;padding-top:1px`)}>{he.y}</div>
            <div style={css(`font-size:12px;line-height:1.45;color:#33505f`)}>{he.t}</div>
          </div>
        </React.Fragment>)) }

        <div style={css(`margin-top:16px;padding:11px 13px;border-radius:10px;background:#12303f;color:#dce9ef;font-size:10px;line-height:1.55`)}>Sources : reconstructions multiproxy (type PAGES 2k, Mann et al.) avant 1850, puis mesures instrumentales (HadCRUT / GISTEMP). Précipitations et pression : indices reconstruits, à visée pédagogique.</div>
      </div>
      </>) : null }

      
      { v.isStory ? (<>
      <div style={css(`padding:14px 14px 30px`)}>
        <div style={css(`font-family:'Spectral',serif;font-size:21px;font-weight:600;line-height:1.15`)}>Mode Histoire · Climat & sociétés</div>
        <div style={css(`font-size:11.5px;line-height:1.5;color:#4d6c7d;margin-top:5px`)}>Quand le climat vacille, les sociétés vacillent. Parcourez des épisodes où refroidissements, sécheresses et éruptions ont pesé sur les récoltes, les famines et la mortalité.</div>

        <div style={css(`display:flex;gap:6px;margin:13px 0 4px;flex-wrap:wrap`)}>
          { (v.storyChips || []).map((sc, __k1) => (<React.Fragment key={__k1}>
            <div onClick={sc.go} style={sc.style}>{sc.label}</div>
          </React.Fragment>)) }
        </div>

        <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:14px;overflow:hidden;margin-top:10px`)}>
          <div style={css(`padding:14px 15px 13px;background:${v.storyWash}`)}>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:10px;color:#8a5a3f;letter-spacing:.4px`)}>{v.storyPeriod}</div>
            <div style={css(`font-family:'Spectral',serif;font-size:19px;font-weight:600;line-height:1.15;margin-top:3px;color:#1c1410`)}>{v.storyTitle}</div>
            <div style={css(`font-size:12px;line-height:1.5;color:#4a3b32;margin-top:6px`)}>{v.storyRegion}</div>
          </div>

          <div style={css(`display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#e8eef1`)}>
            <div style={css(`background:#fff;padding:11px 13px`)}>
              <div style={css(`font-size:7.5px;letter-spacing:.5px;text-transform:uppercase;color:#8aa5b3`)}>Signal climatique</div>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:14px;color:#d97a52;margin-top:4px`)}>{v.storyClimate}</div>
            </div>
            <div style={css(`background:#fff;padding:11px 13px`)}>
              <div style={css(`font-size:7.5px;letter-spacing:.5px;text-transform:uppercase;color:#8aa5b3`)}>Impact humain</div>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:14px;color:#7d5bb0;margin-top:4px`)}>{v.storyImpact}</div>
            </div>
          </div>

          <div style={css(`padding:13px 15px 6px`)}>
            <div style={css(`display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px`)}>
              <div style={css(`font-size:10px;font-weight:600;color:#33505f`)}>Récoltes vs mortalité (indices)</div>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:8px;color:#8aa5b3`)}>— récoltes   — mortalité</div>
            </div>
            <svg viewBox="0 0 320 96" style={css(`width:100%;display:block`)}>
              <line x1="8" y1="48" x2="312" y2="48" stroke="#eef3f6" strokeWidth="1"></line>
              <path d={v.storyHarvestPath} fill="none" stroke="#5a9e5e" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"></path>
              <path d={v.storyMortPath} fill="none" stroke="#c0504d" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"></path>
            </svg>
          </div>

          <div style={css(`padding:6px 15px 15px`)}>
            <div style={css(`font-size:12.5px;line-height:1.6;color:#33505f`)}>{v.storyNarrative}</div>
            <div style={css(`margin-top:11px;padding:10px 12px;background:#f4f1ec;border-radius:9px;border-left:3px solid #b5654a`)}>
              <div style={css(`font-size:8px;letter-spacing:.5px;text-transform:uppercase;color:#8a5a3f`)}>Chaîne causale</div>
              <div style={css(`font-size:11.5px;line-height:1.55;color:#4a3b32;margin-top:4px`)}>{v.storyChain}</div>
            </div>
            { v.storyHasHist ? (<>
            <div onClick={v.storyGoHist} style={css(`display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:11px;padding:10px 12px;background:#eef4f7;border:1px solid #dbe7ec;border-radius:9px;cursor:pointer`)}>
              <div style={css(`font-size:11.5px;color:#1d6f96;font-weight:600`)}>↗ Voir {v.storyHistYear} sur les courbes climatiques</div>
              <div style={css(`font-size:13px;color:#1d6f96`)}>›</div>
            </div>
            </>) : null }
          </div>
        </div>

        <div style={css(`display:flex;justify-content:space-between;gap:10px;margin-top:12px`)}>
          <div onClick={v.storyPrev} style={v.storyPrevStyle}>‹ Précédent</div>
          <div onClick={v.storyNext} style={v.storyNextStyle}>Suivant ›</div>
        </div>

        <div style={css(`margin-top:16px;padding:11px 13px;border-radius:10px;background:#12303f;color:#dce9ef;font-size:10px;line-height:1.55`)}>La corrélation climat-société est réelle mais rarement une cause unique : guerres, épidémies et fragilités politiques amplifient les chocs climatiques. Chiffres indicatifs, synthétisés à partir de la littérature en histoire du climat (Le Roy Ladurie, Parker, Büntgen et al.).</div>
      </div>
      </>) : null }

      
      { v.isProxies ? (<>
      <div style={css(`padding:14px 14px 30px`)}>

        { v.proxyOpen ? (<>
        <div>
          <div onClick={v.backToGallery} style={css(`font-size:11px;color:#38617a;font-weight:500;margin-bottom:12px;cursor:pointer`)}>‹ Galerie de proxies</div>
          <div style={css(`font-family:'Spectral',serif;font-size:22px;font-weight:600;line-height:1.1;color:${v.pvColor}`)}>{v.pvLabel}</div>
          <div style={css(`font-size:12.5px;line-height:1.55;color:#33505f;margin-top:8px`)}>{v.pvWhat}</div>

          <div style={v.diagramCardStyle}>
            <div>{v.proxyDiagram}</div>
          </div>

          <div onClick={v.playProxy} style={css(`text-align:center;padding:12px;border-radius:11px;background:#0f2c3c;color:#eaf3f7;font-size:13px;font-weight:600;cursor:pointer;margin-bottom:8px`)}>{v.playBtnLabel}</div>

          <div style={css(`display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px`)}>
            <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:10px;padding:10px 12px`)}>
              <div style={css(`font-size:8px;letter-spacing:.5px;text-transform:uppercase;color:#8aa5b3`)}>Enregistre</div>
              <div style={css(`font-size:11.5px;line-height:1.4;color:#0f2c3c;margin-top:3px`)}>{v.pvRecords}</div>
            </div>
            <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:10px;padding:10px 12px`)}>
              <div style={css(`font-size:8px;letter-spacing:.5px;text-transform:uppercase;color:#8aa5b3`)}>Portée</div>
              <div style={css(`font-size:11.5px;line-height:1.4;color:#0f2c3c;margin-top:3px`)}>{v.pvReach}</div>
            </div>
          </div>

          <div style={css(`font-family:'Spectral',serif;font-size:15px;font-weight:600;margin-bottom:4px`)}>De la formation à l'analyse</div>
          <div style={css(`font-size:10.5px;color:#6b8898;margin-bottom:6px`)}>Lancez la formation pour dérouler les étapes.</div>
          { (v.proxySteps || []).map((st, __k1) => (<React.Fragment key={__k1}>
            <div style={st.style}>
              <div style={st.dotStyle}>{st.num}</div>
              <div style={css(`flex:1`)}>
                <div style={css(`font-size:12.5px;font-weight:600;color:#0f2c3c`)}>{st.t}</div>
                <div style={css(`font-size:11.5px;line-height:1.45;color:#4d6c7d;margin-top:1px`)}>{st.d}</div>
              </div>
            </div>
          </React.Fragment>)) }

          <div style={css(`margin-top:16px;background:#12303f;border-radius:12px;padding:13px 14px;color:#dce9ef`)}>
            <div style={css(`font-size:9px;letter-spacing:.6px;text-transform:uppercase;color:#7fa8bc;margin-bottom:5px`)}>Signal isotopique</div>
            <div style={css(`font-size:13px;font-weight:600;color:#fff`)}>{v.pvSignal}</div>
            <div style={css(`font-size:12px;line-height:1.55;margin-top:4px`)}>{v.pvSignalNote}</div>
          </div>

          <div style={css(`font-family:'Spectral',serif;font-size:15px;font-weight:600;margin:16px 0 6px`)}>Le saviez-vous</div>
          { (v.pvFacts || []).map((f, __k1) => (<React.Fragment key={__k1}>
            <div style={css(`display:flex;gap:9px;padding:8px 0;border-top:1px solid #e4edf1;align-items:flex-start`)}>
              <div style={css(`width:6px;height:6px;border-radius:50%;background:${v.pvColor};margin-top:6px;flex-shrink:0`)}></div>
              <div style={css(`font-size:12px;line-height:1.5;color:#33505f`)}>{f}</div>
            </div>
          </React.Fragment>)) }
        </div>
        </>) : null }

        { v.proxyGallery ? (<>
        <div>
          <div style={css(`font-family:'Spectral',serif;font-size:21px;font-weight:600;line-height:1.15`)}>Comment sait-on ?</div>
          <div style={css(`font-size:11.5px;line-height:1.5;color:#4d6c7d;margin-top:5px`)}>Le climat passé ne se mesure pas directement : on lit des <em>proxies</em>, des archives naturelles. Choisissez-en une pour voir sa formation et son analyse.</div>
          <div style={css(`display:flex;flex-direction:column;gap:11px;margin-top:16px`)}>
            { (v.galleryCards || []).map((c, __k1) => (<React.Fragment key={__k1}>
              <div onClick={c.open} style={css(`display:flex;gap:0;border-radius:14px;overflow:hidden;background:#fff;border:1px solid #e0eaef;box-shadow:0 1px 2px rgba(15,44,60,0.06),0 8px 20px rgba(15,44,60,0.05);cursor:pointer`)}>
                <div style={css(`width:60px;flex-shrink:0;background:${c.color};display:flex;align-items:center;justify-content:center`)}>
                  <div style={css(`width:26px;height:26px;border-radius:50%;background:${c.accent};opacity:.9`)}></div>
                </div>
                <div style={css(`flex:1;padding:13px 14px;min-width:0`)}>
                  <div style={css(`font-family:'Spectral',serif;font-size:16px;font-weight:600;color:#0f2c3c`)}>{c.label}</div>
                  <div style={css(`font-size:11px;line-height:1.4;color:#4d6c7d;margin-top:3px`)}>{c.records}</div>
                  <div style={css(`display:inline-flex;align-items:center;gap:5px;margin-top:8px;font-size:11px;font-weight:600;color:${c.color}`)}>Explorer →</div>
                </div>
              </div>
            </React.Fragment>)) }
          </div>
        </div>
        </>) : null }

      </div>
      </>) : null }

      
      { v.isExtremes ? (<>
      <div style={css(`padding:14px 14px 30px`)}>

        { v.exList ? (<>
        <div>
          <div style={css(`font-family:'Spectral',serif;font-size:21px;font-weight:600;line-height:1.15`)}>Événements extrêmes</div>
          <div style={css(`font-size:11.5px;line-height:1.5;color:#4d6c7d;margin-top:5px`)}>Les grandes crises du système climatique terrestre. Touchez une fiche pour ses causes, conséquences, durée et preuves géologiques.</div>
          <div style={css(`display:flex;flex-direction:column;gap:11px;margin-top:16px`)}>
            { (v.exCards || []).map((c, __k1) => (<React.Fragment key={__k1}>
              <div onClick={c.open} style={css(`border-radius:14px;overflow:hidden;background:#fff;border:1px solid #e0eaef;box-shadow:0 1px 2px rgba(15,44,60,0.06),0 8px 20px rgba(15,44,60,0.05);cursor:pointer;display:flex;gap:0`)}>
                <div style={css(`width:8px;flex-shrink:0;background:${c.color}`)}></div>
                <div style={css(`flex:1;padding:13px 14px;min-width:0`)}>
                  <div style={css(`display:flex;align-items:baseline;justify-content:space-between;gap:8px`)}>
                    <div style={css(`font-family:'Spectral',serif;font-size:16px;font-weight:600;color:#0f2c3c`)}>{c.name}</div>
                    <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:10px;color:#6b8898;white-space:nowrap`)}>{c.when}</div>
                  </div>
                  <div style={css(`font-size:10px;color:${c.color};font-weight:600;text-transform:uppercase;letter-spacing:.4px;margin-top:4px`)}>{c.cat}</div>
                  <div style={css(`font-size:11.5px;line-height:1.45;color:#4d6c7d;margin-top:6px`)}>{c.summary}</div>
                </div>
              </div>
            </React.Fragment>)) }
          </div>
        </div>
        </>) : null }

        { v.exOpen ? (<>
        <div>
          <div onClick={v.backToExList} style={css(`font-size:11px;color:#38617a;font-weight:500;margin-bottom:12px;cursor:pointer`)}>‹ Événements extrêmes</div>
          <div style={v.exBadgeStyle}>{v.exCat}</div>
          <div style={css(`font-family:'Spectral',serif;font-size:23px;font-weight:600;line-height:1.1;margin-top:9px;color:${v.exColor}`)}>{v.exName}</div>
          <div style={css(`font-size:13px;line-height:1.55;color:#33505f;margin-top:8px`)}>{v.exSummary}</div>

          <div style={css(`display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px;margin-bottom:8px`)}>
            <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:10px;padding:10px 12px`)}>
              <div style={css(`font-size:8px;letter-spacing:.5px;text-transform:uppercase;color:#8aa5b3`)}>Datation</div>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:12px;color:#0f2c3c;margin-top:3px`)}>{v.exWhen}</div>
            </div>
            <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:10px;padding:10px 12px`)}>
              <div style={css(`font-size:8px;letter-spacing:.5px;text-transform:uppercase;color:#8aa5b3`)}>Période</div>
              <div style={css(`font-size:11.5px;line-height:1.35;color:#0f2c3c;margin-top:3px`)}>{v.exEra}</div>
            </div>
          </div>
          <div style={css(`background:#12303f;border-radius:10px;padding:11px 13px;color:#dce9ef;margin-bottom:16px`)}>
            <div style={css(`font-size:8px;letter-spacing:.5px;text-transform:uppercase;color:#7fa8bc`)}>Durée</div>
            <div style={css(`font-size:12.5px;line-height:1.5;margin-top:3px`)}>{v.exDur}</div>
          </div>

          <div style={css(`font-family:'Spectral',serif;font-size:15px;font-weight:600;margin-bottom:6px`)}>Causes</div>
          { (v.exCauses || []).map((it, __k1) => (<React.Fragment key={__k1}>
            <div style={css(`display:flex;gap:9px;padding:8px 0;border-top:1px solid #e4edf1;align-items:flex-start`)}>
              <div style={css(`width:6px;height:6px;border-radius:50%;background:${v.exColor};margin-top:6px;flex-shrink:0`)}></div>
              <div style={css(`font-size:12.5px;line-height:1.5;color:#33505f`)}>{it}</div>
            </div>
          </React.Fragment>)) }

          <div style={css(`font-family:'Spectral',serif;font-size:15px;font-weight:600;margin:16px 0 6px`)}>Conséquences</div>
          { (v.exConsequences || []).map((it, __k1) => (<React.Fragment key={__k1}>
            <div style={css(`display:flex;gap:9px;padding:8px 0;border-top:1px solid #e4edf1;align-items:flex-start`)}>
              <div style={css(`width:6px;height:6px;border-radius:50%;background:${v.exColor};margin-top:6px;flex-shrink:0`)}></div>
              <div style={css(`font-size:12.5px;line-height:1.5;color:#33505f`)}>{it}</div>
            </div>
          </React.Fragment>)) }

          <div style={css(`font-family:'Spectral',serif;font-size:15px;font-weight:600;margin:16px 0 6px`)}>Preuves géologiques</div>
          <div style={css(`background:#eef4f7;border:1px solid #dbe7ec;border-radius:12px;padding:6px 14px 10px`)}>
            { (v.exProofs || []).map((it, __k1) => (<React.Fragment key={__k1}>
              <div style={css(`display:flex;gap:9px;padding:8px 0;align-items:flex-start`)}>
                <div style={css(`font-size:11px;flex-shrink:0;margin-top:2px`)}>🔬</div>
                <div style={css(`font-size:12px;line-height:1.5;color:#33505f`)}>{it}</div>
              </div>
            </React.Fragment>)) }
          </div>
        </div>
        </>) : null }

      </div>
      </>) : null }

      
      { v.isArchives ? (<>
      <div style={css(`padding:14px 14px 30px`)}>

        { v.archiveList ? (<>
        <div>
          <div style={css(`font-family:'Spectral',serif;font-size:21px;font-weight:600;line-height:1.15`)}>Archives climatiques</div>
          <div style={css(`font-size:11.5px;line-height:1.5;color:#4d6c7d;margin-top:5px;margin-bottom:16px`)}>Les enregistreurs naturels du climat passé. Touchez une archive pour voir comment elle se forme, ce qu'elle mesure, sa précision et jusqu'où elle remonte.</div>

          { (v.archiveCards || []).map((a, __k1) => (<React.Fragment key={__k1}>
            <div onClick={a.open} style={css(`display:flex;gap:0;margin-bottom:9px;border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 1px 2px rgba(15,44,60,0.06),0 8px 20px rgba(15,44,60,0.05);cursor:pointer;border:1px solid #e0eaef`)}>
              <div style={css(`width:44px;flex-shrink:0;background:${a.wash};display:flex;align-items:center;justify-content:center;font-size:19px;color:${a.color}`)}>{a.icon}</div>
              <div style={css(`flex:1;padding:12px 14px;min-width:0`)}>
                <div style={css(`font-family:'Spectral',serif;font-size:15.5px;font-weight:600;color:#0f2c3c`)}>{a.name}</div>
                <div style={css(`font-size:11.5px;line-height:1.4;color:#4d6c7d;margin-top:3px`)}>{a.tag}</div>
              </div>
              <div style={css(`display:flex;align-items:center;padding-right:14px;font-size:16px;color:#6fb2d1;flex-shrink:0`)}>→</div>
            </div>
          </React.Fragment>)) }
        </div>
        </>) : null }

        { v.ar ? (<>
        <div>
          <div onClick={v.backToArchives} style={css(`font-size:11px;color:#38617a;font-weight:500;margin-bottom:12px;cursor:pointer`)}>‹ Toutes les archives</div>
          <div style={css(`display:flex;align-items:center;gap:12px;margin-bottom:16px`)}>
            <div style={css(`width:52px;height:52px;flex-shrink:0;border-radius:13px;background:${v.ar.wash};display:flex;align-items:center;justify-content:center;font-size:24px;color:${v.ar.color}`)}>{v.ar.icon}</div>
            <div style={css(`min-width:0`)}>
              <div style={css(`font-family:'Spectral',serif;font-size:22px;font-weight:600;line-height:1.1;color:#0f2c3c`)}>{v.ar.name}</div>
              <div style={css(`font-size:12px;line-height:1.4;color:#4d6c7d;margin-top:3px`)}>{v.ar.tag}</div>
            </div>
          </div>

          <div style={css(`border-left:3px solid ${v.ar.color};background:${v.ar.wash};border-radius:0 12px 12px 0;padding:12px 14px;margin-bottom:11px`)}>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:1.2px;text-transform:uppercase;color:${v.ar.color};font-weight:600`)}>Comment elle se forme</div>
            <div style={css(`font-size:12.5px;line-height:1.55;color:#33505f;margin-top:6px`)}>{v.ar.forme}</div>
          </div>

          <div style={css(`border-left:3px solid ${v.ar.color};background:${v.ar.wash};border-radius:0 12px 12px 0;padding:12px 14px;margin-bottom:11px`)}>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:1.2px;text-transform:uppercase;color:${v.ar.color};font-weight:600`)}>Ce qu'elle mesure</div>
            <div style={css(`font-size:12.5px;line-height:1.55;color:#33505f;margin-top:6px`)}>{v.ar.mesure}</div>
          </div>

          <div style={css(`display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:14px`)}>
            <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:12px;padding:12px 13px`)}>
              <div style={css(`font-size:8.5px;letter-spacing:0.7px;text-transform:uppercase;color:#8aa5b3`)}>Précision</div>
              <div style={css(`font-size:12px;line-height:1.45;color:#0f2c3c;margin-top:6px`)}>{v.ar.precision}</div>
            </div>
            <div style={css(`background:#0f2c3c;border-radius:12px;padding:12px 13px;color:#eaf3f7`)}>
              <div style={css(`font-size:8.5px;letter-spacing:0.7px;text-transform:uppercase;color:#8fb4c6`)}>Remonte jusqu'à</div>
              <div style={css(`font-size:12px;line-height:1.45;margin-top:6px`)}>{v.ar.reach}</div>
            </div>
          </div>
        </div>
        </>) : null }

      </div>
      </>) : null }

      
      { v.isSpecies ? (<>
      <div style={css(`padding:14px 14px 30px`)}>

        { v.speciesList ? (<>
        <div>
          <div style={css(`font-family:'Spectral',serif;font-size:21px;font-weight:600;line-height:1.15`)}>Espèces indicatrices</div>
          <div style={css(`font-size:11.5px;line-height:1.5;color:#4d6c7d;margin-top:5px;margin-bottom:16px`)}>Des espèces fossiles dont la présence témoigne d'un climat, d'un âge ou d'un milieu précis. Touchez une espèce pour son époque, son climat, son régime et sa répartition.</div>

          { (v.speciesCards || []).map((s, __k1) => (<React.Fragment key={__k1}>
            <div onClick={s.open} style={css(`display:flex;gap:0;margin-bottom:9px;border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 1px 2px rgba(15,44,60,0.06),0 8px 20px rgba(15,44,60,0.05);cursor:pointer;border:1px solid #e0eaef`)}>
              <div style={css(`width:48px;flex-shrink:0;background:${s.wash};display:flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-size:15px;font-weight:600;color:${s.color}`)}>{s.icon}</div>
              <div style={css(`flex:1;padding:12px 14px;min-width:0`)}>
                <div style={css(`font-family:'Spectral',serif;font-size:15.5px;font-weight:600;color:#0f2c3c`)}>{s.name}</div>
                <div style={css(`font-size:11.5px;line-height:1.4;color:#4d6c7d;margin-top:3px`)}>{s.tag}</div>
              </div>
              <div style={css(`display:flex;align-items:center;padding-right:14px;font-size:16px;color:#6fb2d1;flex-shrink:0`)}>→</div>
            </div>
          </React.Fragment>)) }
        </div>
        </>) : null }

        { v.sp ? (<>
        <div>
          <div onClick={v.backToSpecies} style={css(`font-size:11px;color:#38617a;font-weight:500;margin-bottom:12px;cursor:pointer`)}>‹ Toutes les espèces</div>
          <div style={css(`display:flex;align-items:center;gap:12px;margin-bottom:16px`)}>
            <div style={css(`width:56px;height:56px;flex-shrink:0;border-radius:14px;background:${v.sp.wash};display:flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-size:19px;font-weight:600;color:${v.sp.color}`)}>{v.sp.icon}</div>
            <div style={css(`min-width:0`)}>
              <div style={css(`font-family:'Spectral',serif;font-size:22px;font-weight:600;line-height:1.1;color:#0f2c3c`)}>{v.sp.name}</div>
              <div style={css(`font-size:12px;line-height:1.4;color:#4d6c7d;margin-top:3px`)}>{v.sp.tag}</div>
            </div>
          </div>

          <div style={css(`display:flex;flex-direction:column;gap:1px;background:#e4edf1;border:1px solid #e0eaef;border-radius:12px;overflow:hidden;margin-bottom:12px`)}>
            <div style={css(`background:#fff;padding:11px 14px`)}>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:8.5px;letter-spacing:1px;text-transform:uppercase;color:${v.sp.color};font-weight:600`)}>Époque</div>
              <div style={css(`font-size:12.5px;line-height:1.5;color:#33505f;margin-top:4px`)}>{v.sp.epoque}</div>
            </div>
            <div style={css(`background:#fff;padding:11px 14px`)}>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:8.5px;letter-spacing:1px;text-transform:uppercase;color:${v.sp.color};font-weight:600`)}>Climat</div>
              <div style={css(`font-size:12.5px;line-height:1.5;color:#33505f;margin-top:4px`)}>{v.sp.climat}</div>
            </div>
            <div style={css(`background:#fff;padding:11px 14px`)}>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:8.5px;letter-spacing:1px;text-transform:uppercase;color:${v.sp.color};font-weight:600`)}>Température</div>
              <div style={css(`font-size:12.5px;line-height:1.5;color:#33505f;margin-top:4px`)}>{v.sp.temperature}</div>
            </div>
            <div style={css(`background:#fff;padding:11px 14px`)}>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:8.5px;letter-spacing:1px;text-transform:uppercase;color:${v.sp.color};font-weight:600`)}>Alimentation</div>
              <div style={css(`font-size:12.5px;line-height:1.5;color:#33505f;margin-top:4px`)}>{v.sp.alimentation}</div>
            </div>
            <div style={css(`background:#fff;padding:11px 14px`)}>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:8.5px;letter-spacing:1px;text-transform:uppercase;color:${v.sp.color};font-weight:600`)}>Répartition</div>
              <div style={css(`font-size:12.5px;line-height:1.5;color:#33505f;margin-top:4px`)}>{v.sp.repartition}</div>
            </div>
          </div>

          <div style={css(`border-left:3px solid ${v.sp.color};background:${v.sp.wash};border-radius:0 12px 12px 0;padding:12px 14px`)}>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:1.2px;text-transform:uppercase;color:${v.sp.color};font-weight:600`)}>Ce qu'elle indique</div>
            <div style={css(`font-size:12.5px;line-height:1.55;color:#33505f;margin-top:6px`)}>{v.sp.indice}</div>
          </div>
        </div>
        </>) : null }

      </div>
      </>) : null }

      
      { v.isSimulator ? (<>
      <div style={css(`padding:14px 14px 30px`)}>
        <div style={css(`font-family:'Spectral',serif;font-size:21px;font-weight:600;line-height:1.15`)}>Simulateur climatique</div>
        <div style={css(`font-size:11.5px;line-height:1.5;color:#4d6c7d;margin-top:5px;margin-bottom:14px`)}>Réglez les forçages du système Terre et observez la réponse du climat. Modèle pédagogique simplifié (bilan radiatif + rétroactions), pas une projection.</div>

        <div style={css(`background:#0f2c3c;border-radius:16px;padding:16px 16px 14px;color:#eaf3f7;margin-bottom:16px`)}>
          <div style={css(`margin-bottom:8px`)}>{v.simGlobe}</div>
          <div style={css(`text-align:center;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#8fb4c6`)}>{v.simClimLabel}</div>
          <div style={css(`display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:12px`)}>
            <div style={css(`background:rgba(143,180,198,0.12);border-radius:10px;padding:10px 8px;text-align:center`)}>
              <div style={css(`font-size:8px;letter-spacing:.5px;text-transform:uppercase;color:#7fa8bc`)}>Température</div>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:17px;font-weight:500;margin-top:3px`)}>{v.simTTxt}</div>
              <div style={css(`font-size:8.5px;color:#8fb4c6;margin-top:2px`)}>{v.simDeltaTxt}</div>
            </div>
            <div style={css(`background:rgba(143,180,198,0.12);border-radius:10px;padding:10px 8px;text-align:center`)}>
              <div style={css(`font-size:8px;letter-spacing:.5px;text-transform:uppercase;color:#7fa8bc`)}>Glaciers</div>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:17px;font-weight:500;margin-top:3px`)}>{v.simIceTxt}</div>
              <div style={css(`font-size:8.5px;color:#8fb4c6;margin-top:2px`)}>{v.simIceLabel}</div>
            </div>
            <div style={css(`background:rgba(143,180,198,0.12);border-radius:10px;padding:10px 8px;text-align:center`)}>
              <div style={css(`font-size:8px;letter-spacing:.5px;text-transform:uppercase;color:#7fa8bc`)}>Niveau marin</div>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:17px;font-weight:500;margin-top:3px`)}>{v.simSeaTxt}</div>
              <div style={css(`font-size:8.5px;color:#8fb4c6;margin-top:2px`)}>{v.simSeaLabel}</div>
            </div>
          </div>
        </div>

        <div style={css(`display:flex;justify-content:space-between;align-items:center;margin-bottom:10px`)}>
          <div style={css(`font-family:'Spectral',serif;font-size:15px;font-weight:600`)}>Forçages</div>
          <div onClick={v.resetSim} style={css(`font-size:10.5px;color:#2f7ca0;font-weight:600;cursor:pointer`)}>↺ Réinitialiser</div>
        </div>

        <div style={css(`margin-bottom:15px`)}>
          <div style={css(`display:flex;justify-content:space-between;align-items:baseline`)}><div style={css(`font-size:12px;font-weight:600;color:#0f2c3c`)}>CO₂ atmosphérique</div><div style={css(`font-family:'IBM Plex Mono',monospace;font-size:12px;color:#2f7ca0`)}>{v.simCo2Txt}</div></div>
          <div style={css(`font-size:10px;color:#8aa5b3;margin-bottom:3px`)}>Gaz à effet de serre · préindustriel ≈ 280 ppm</div>
          <input type="range" min="100" max="2000" step="10" value={v.simCo2Val} onChange={v.onSimCo2} onInput={v.onSimCo2} style={css(`width:100%;accent-color:#2f7ca0`)} />
        </div>
        <div style={css(`margin-bottom:15px`)}>
          <div style={css(`display:flex;justify-content:space-between;align-items:baseline`)}><div style={css(`font-size:12px;font-weight:600;color:#0f2c3c`)}>Activité solaire</div><div style={css(`font-family:'IBM Plex Mono',monospace;font-size:12px;color:#2f7ca0`)}>{v.simSolarTxt}</div></div>
          <div style={css(`font-size:10px;color:#8aa5b3;margin-bottom:3px`)}>Luminosité du Soleil · actuel = 100 % (jeune Soleil ≈ 75 %)</div>
          <input type="range" min="80" max="120" step="0.5" value={v.simSolarVal} onChange={v.onSimSolar} onInput={v.onSimSolar} style={css(`width:100%;accent-color:#2f7ca0`)} />
        </div>
        <div style={css(`margin-bottom:15px`)}>
          <div style={css(`display:flex;justify-content:space-between;align-items:baseline`)}><div style={css(`font-size:12px;font-weight:600;color:#0f2c3c`)}>Volcanisme (aérosols)</div><div style={css(`font-family:'IBM Plex Mono',monospace;font-size:12px;color:#2f7ca0`)}>{v.simVolcTxt}</div></div>
          <div style={css(`font-size:10px;color:#8aa5b3;margin-bottom:3px`)}>Aérosols sulfatés réfléchissants → refroidissement · fond ≈ 1</div>
          <input type="range" min="0" max="10" step="0.5" value={v.simVolcVal} onChange={v.onSimVolc} onInput={v.onSimVolc} style={css(`width:100%;accent-color:#2f7ca0`)} />
        </div>
        <div style={css(`margin-bottom:15px`)}>
          <div style={css(`display:flex;justify-content:space-between;align-items:baseline`)}><div style={css(`font-size:12px;font-weight:600;color:#0f2c3c`)}>Inclinaison de l'axe</div><div style={css(`font-family:'IBM Plex Mono',monospace;font-size:12px;color:#2f7ca0`)}>{v.simOblTxt}</div></div>
          <div style={css(`font-size:10px;color:#8aa5b3;margin-bottom:3px`)}>Obliquité · plus forte → pôles plus chauds, moins de glace</div>
          <input type="range" min="22" max="25" step="0.05" value={v.simOblVal} onChange={v.onSimObl} onInput={v.onSimObl} style={css(`width:100%;accent-color:#2f7ca0`)} />
        </div>

        <div style={css(`margin-bottom:6px`)}>
          <div style={css(`display:flex;justify-content:space-between;align-items:baseline`)}><div style={css(`font-size:12px;font-weight:600;color:#0f2c3c`)}>Position des continents</div></div>
          <div style={css(`font-size:10px;color:#8aa5b3;margin-bottom:6px`)}>{v.simContDesc} — géographie et circulation océanique</div>
          <div style={css(`display:flex;gap:6px`)}>
            <div onClick={v.setContOcean} style={v.contOceanStyle}>Pôles<br />océaniques</div>
            <div onClick={v.setContDispersed} style={v.contDispersedStyle}>Dispersés<br />(actuel)</div>
            <div onClick={v.setContPangea} style={v.contPangeaStyle}>Super-<br />continent</div>
            <div onClick={v.setContPolar} style={v.contPolarStyle}>Continent<br />polaire</div>
          </div>
        </div>

        <div style={css(`margin-top:16px;padding:12px 14px;border-radius:11px;background:#eef4f7;border:1px solid #dbe7ec;font-size:11px;line-height:1.55;color:#33505f`)}><strong>Comment lire.</strong> La température combine le forçage du CO₂ (≈ 3 °C par doublement), la luminosité solaire, le refroidissement volcanique, la géographie et l'obliquité. Glaciers et niveau marin en découlent : plus il fait froid (et plus une terre occupe les pôles), plus la glace s'étend et plus la mer baisse.</div>
      </div>
      </>) : null }

      
      { v.isExtinct ? (<>
      <div style={css(`padding:14px 14px 30px`)}>

        { v.extinctList ? (<>
        <div>
          <div style={css(`font-family:'Spectral',serif;font-size:21px;font-weight:600;line-height:1.15`)}>Espèces disparues</div>
          <div style={css(`font-size:11.5px;line-height:1.5;color:#4d6c7d;margin-top:5px;margin-bottom:16px`)}>Chaque fiche relie une espèce à son climat : son passeport thermique, ses adaptations, et pourquoi elle a disparu — ou survécu. Touchez une carte.</div>
          <div style={css(`display:flex;flex-direction:column;gap:11px`)}>
            { (v.extinctCards || []).map((e, __k1) => (<React.Fragment key={__k1}>
              <div onClick={e.open} style={css(`display:flex;gap:13px;align-items:center;background:#fff;border:1px solid #e0eaef;border-radius:14px;padding:13px 14px;cursor:pointer;box-shadow:0 1px 2px rgba(15,44,60,0.05),0 8px 20px rgba(15,44,60,0.04)`)}>
                <div style={css(`width:52px;height:52px;flex-shrink:0;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:27px;background:${e.wash}`)}>{e.emoji}</div>
                <div style={css(`min-width:0;flex:1`)}>
                  <div style={css(`display:flex;align-items:center;gap:7px`)}>
                    <div style={css(`font-family:'Spectral',serif;font-size:16px;font-weight:600;color:#0f2c3c`)}>{e.name}</div>
                    <div style={e.badgeStyle}>{e.badge}</div>
                  </div>
                  <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:9.5px;color:${e.accent};margin-top:2px;font-style:italic`)}>{e.taxon}</div>
                  <div style={css(`font-size:11.5px;color:#5b7688;margin-top:4px;line-height:1.4`)}>{e.period} · {e.dates}</div>
                </div>
                <div style={css(`font-size:16px;color:#b7c6cd;flex-shrink:0`)}>›</div>
              </div>
            </React.Fragment>)) }
          </div>
          <div style={css(`margin-top:16px;padding:11px 13px;border-radius:10px;background:#12303f;color:#dce9ef;font-size:10px;line-height:1.55`)}>Datations et valeurs climatiques sont des ordres de grandeur issus de la littérature paléontologique, à visée pédagogique. Illustrations à déposer par l'utilisateur.</div>
        </div>
        </>) : null }

        { v.extinctDetail ? (<>
        <div>
          <div onClick={v.backToExtinct} style={css(`font-size:11px;color:#38617a;font-weight:500;margin-bottom:12px;cursor:pointer`)}>‹ Toutes les espèces</div>

          
          <div style={css(`height:186px;border-radius:16px;overflow:hidden;background:${v.ex2.wash};position:relative;border:1px solid #e0eaef`)}>
            <ImageSlot ph="{{ ex2.ph }}" fill />
            <div style={css(`position:absolute;top:10px;right:10px;${v.ex2.badgeStyle}`)}>{v.ex2.badge}</div>
          </div>
          <div style={css(`display:flex;align-items:center;gap:11px;margin-top:12px`)}>
            <div style={css(`font-size:30px`)}>{v.ex2.emoji}</div>
            <div>
              <div style={css(`font-family:'Spectral',serif;font-size:23px;font-weight:600;line-height:1.05;color:#0f2c3c`)}>{v.ex2.name}</div>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:11px;color:${v.ex2.accent};margin-top:3px;font-style:italic`)}>« {v.ex2.tagline} »</div>
            </div>
          </div>

          
          <div style={css(`display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:16px`)}>
            <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:10px;padding:10px 11px`)}>
              <div style={css(`font-size:7.5px;letter-spacing:.5px;text-transform:uppercase;color:#8aa5b3`)}>Période</div>
              <div style={css(`font-size:11px;font-weight:600;color:#0f2c3c;margin-top:4px;line-height:1.25`)}>{v.ex2.period}</div>
            </div>
            <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:10px;padding:10px 11px`)}>
              <div style={css(`font-size:7.5px;letter-spacing:.5px;text-transform:uppercase;color:#8aa5b3`)}>Datation</div>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:10.5px;color:#0f2c3c;margin-top:4px;line-height:1.25`)}>{v.ex2.dates}</div>
            </div>
            <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:10px;padding:10px 11px`)}>
              <div style={css(`font-size:7.5px;letter-spacing:.5px;text-transform:uppercase;color:#8aa5b3`)}>Durée de l'espèce</div>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:10.5px;color:#0f2c3c;margin-top:4px;line-height:1.25`)}>{v.ex2.lifespan}</div>
            </div>
          </div>

          
          <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:12px;padding:12px 13px 9px;margin-top:8px`)}>
            <div style={css(`font-size:10px;font-weight:600;color:#33505f;margin-bottom:8px`)}>Position dans le temps profond</div>
            <div style={css(`position:relative;height:14px;border-radius:7px;background:linear-gradient(90deg,#e7eef2,#d6e3ea)`)}>
              <div style={v.ex2.tlBarStyle}></div>
              { (v.ex2.tlTicks || []).map((t, __k1) => (<React.Fragment key={__k1}>
                <div title={t.label} style={t.style}></div>
              </React.Fragment>)) }
            </div>
            <div style={css(`display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;font-size:8px;color:#8aa5b3;margin-top:4px`)}>
              <span>Précambrien</span><span>Paléoz.</span><span>Méso.</span><span>Cénoz. · auj.</span>
            </div>
            <div style={css(`font-size:9.5px;color:#8aa5b3;margin-top:6px`)}>▸ barre colorée = durée de l'espèce · repères = grandes glaciations</div>
          </div>

          
          <div style={css(`font-family:'Spectral',serif;font-size:15px;font-weight:600;margin:18px 0 8px`)}>Passeport climatique</div>
          <div style={css(`display:flex;flex-direction:column;gap:1px;background:#e4edf1;border:1px solid #e0eaef;border-radius:12px;overflow:hidden`)}>
            <div style={css(`background:#fff;padding:10px 13px;display:flex;justify-content:space-between;gap:10px`)}><span style={css(`font-size:11.5px;color:#5b7688`)}>🌡️ Température</span><span style={css(`font-family:'IBM Plex Mono',monospace;font-size:11px;color:#0f2c3c;text-align:right`)}>{v.ex2.climTemp}</span></div>
            <div style={css(`background:#fff;padding:10px 13px;display:flex;justify-content:space-between;gap:10px`)}><span style={css(`font-size:11.5px;color:#5b7688`)}>🌍 Type de climat</span><span style={css(`font-family:'IBM Plex Mono',monospace;font-size:11px;color:#0f2c3c;text-align:right`)}>{v.ex2.climType}</span></div>
            <div style={css(`background:#fff;padding:10px 13px;display:flex;justify-content:space-between;gap:10px`)}><span style={css(`font-size:11.5px;color:#5b7688`)}>💧 Précipitations</span><span style={css(`font-family:'IBM Plex Mono',monospace;font-size:11px;color:#0f2c3c;text-align:right`)}>{v.ex2.climPrec}</span></div>
            <div style={css(`background:#fff;padding:10px 13px;display:flex;justify-content:space-between;gap:10px`)}><span style={css(`font-size:11.5px;color:#5b7688`)}>🫧 Atmosphère</span><span style={css(`font-family:'IBM Plex Mono',monospace;font-size:11px;color:#0f2c3c;text-align:right`)}>{v.ex2.climCo2}</span></div>
          </div>

          <div style={css(`background:${v.ex2.wash};border-radius:12px;padding:12px 13px;margin-top:8px`)}>
            <div style={css(`font-size:8px;letter-spacing:.5px;text-transform:uppercase;color:${v.ex2.accent};font-weight:600`)}>🗺️ Répartition géographique</div>
            <div style={css(`display:flex;flex-wrap:wrap;gap:6px;margin-top:8px`)}>
              { (v.ex2.geoChips || []).map((g, __k1) => (<React.Fragment key={__k1}>
                <div style={css(`font-size:11px;color:#33505f;background:#fff;border:1px solid rgba(15,44,60,0.08);border-radius:20px;padding:4px 11px`)}>{g}</div>
              </React.Fragment>)) }
            </div>
            <div style={css(`font-size:11px;line-height:1.5;color:#4a5b64;margin-top:9px`)}>{v.ex2.geoNote}</div>
          </div>

          
          <div style={css(`font-family:'Spectral',serif;font-size:15px;font-weight:600;margin:18px 0 8px`)}>Adaptations au climat</div>
          <div style={css(`display:flex;flex-direction:column;gap:8px`)}>
            { (v.ex2.adaptRows || []).map((a, __k1) => (<React.Fragment key={__k1}>
              <div style={css(`display:flex;gap:11px;background:#fff;border:1px solid #e0eaef;border-radius:11px;padding:11px 13px`)}>
                <div style={css(`font-size:20px;flex-shrink:0;line-height:1.2`)}>{a.ic}</div>
                <div>
                  <div style={css(`font-size:12.5px;font-weight:600;color:#0f2c3c`)}>{a.ti}</div>
                  <div style={css(`font-size:11.5px;line-height:1.5;color:#5b7688;margin-top:2px`)}>{a.tx}</div>
                </div>
              </div>
            </React.Fragment>)) }
          </div>
          <div style={css(`font-size:11.5px;line-height:1.5;color:#5b7688;margin-top:8px;padding:0 2px`)}>🍽️ <b style={css(`color:#33505f`)}>Régime :</b> {v.ex2.diet}</div>

          
          <div style={v.ex2.fateHeadStyle}>
            <div style={css(`font-family:'Spectral',serif;font-size:16px;font-weight:600`)}>{v.ex2.fateTitle}</div>
            <div style={css(`font-size:12px;line-height:1.55;margin-top:5px;opacity:.92`)}>{v.ex2.fateIntro}</div>
          </div>

          { v.ex2.isExtinctFate ? (<>
          <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:12px;padding:13px 14px;margin-top:8px`)}>
            <div style={css(`font-size:8px;letter-spacing:.5px;text-transform:uppercase;color:#8aa5b3;margin-bottom:9px`)}>📉 Causes principales</div>
            <div style={css(`display:flex;flex-direction:column;gap:9px`)}>
              { (v.ex2.causeRows || []).map((c, __k1) => (<React.Fragment key={__k1}>
                <div>
                  <div style={css(`display:flex;justify-content:space-between;font-size:11px;color:#33505f;margin-bottom:3px`)}><span>{c.label}</span><span style={css(`font-family:'IBM Plex Mono',monospace;color:${c.color}`)}>{c.pctTxt}</span></div>
                  <div style={css(`height:7px;border-radius:4px;background:#eef3f6;overflow:hidden`)}><div style={c.barStyle}></div></div>
                </div>
              </React.Fragment>)) }
            </div>
          </div>
          </>) : null }

          { v.ex2.isSurvivedFate ? (<>
          <div style={css(`display:flex;flex-direction:column;gap:8px;margin-top:8px`)}>
            { (v.ex2.factorRows || []).map((f, __k1) => (<React.Fragment key={__k1}>
              <div style={css(`display:flex;gap:11px;background:#fff;border:1px solid #e0eaef;border-radius:11px;padding:11px 13px`)}>
                <div style={css(`font-size:19px;flex-shrink:0;line-height:1.2`)}>{f.ic}</div>
                <div><div style={css(`font-size:12.5px;font-weight:600;color:#0f2c3c`)}>{f.ti}</div><div style={css(`font-size:11.5px;line-height:1.5;color:#5b7688;margin-top:2px`)}>{f.tx}</div></div>
              </div>
            </React.Fragment>)) }
            <div style={css(`background:#e4f0ec;border-radius:11px;padding:11px 13px`)}>
              <div style={css(`font-size:8px;letter-spacing:.5px;text-transform:uppercase;color:#3a8f7a;font-weight:600`)}>🦕 Descendants modernes</div>
              <div style={css(`font-size:12.5px;line-height:1.5;color:#33505f;margin-top:5px`)}>{v.ex2.descendants}</div>
            </div>
          </div>
          </>) : null }

          <div style={css(`margin-top:9px;padding:11px 13px;background:#f4f1ec;border-radius:10px;border-left:3px solid ${v.ex2.accent}`)}>
            <div style={css(`font-size:8px;letter-spacing:.5px;text-transform:uppercase;color:#8a5a3f`)}>💡 Le déclencheur</div>
            <div style={css(`font-family:'Spectral',serif;font-size:13.5px;line-height:1.5;color:#4a3b32;margin-top:5px;font-style:italic`)}>« {v.ex2.trigger} »</div>
          </div>

          
          <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:12px;padding:12px 13px 8px;margin-top:8px`)}>
            <div style={css(`font-size:10px;font-weight:600;color:#33505f`)}>Abondance de la population (relative)</div>
            <svg viewBox="0 0 320 80" style={css(`width:100%;display:block;margin-top:4px`)}>
              <line x1="8" y1="70" x2="312" y2="70" stroke="#eef3f6" strokeWidth="1"></line>
              <path d={v.ex2.popArea} fill={v.ex2.accent} fillOpacity="0.10"></path>
              <path d={v.ex2.popPath} fill="none" stroke={v.ex2.accent} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"></path>
            </svg>
            <div style={css(`font-size:10px;line-height:1.5;color:#8aa5b3;margin-top:2px`)}>{v.ex2.popNote}</div>
          </div>

          
          <div style={css(`font-family:'Spectral',serif;font-size:15px;font-weight:600;margin:18px 0 8px`)}>Preuves fossiles & données</div>
          <div style={css(`background:${v.ex2.wash};border-radius:12px;padding:12px 13px`)}>
            <div style={css(`font-size:8px;letter-spacing:.5px;text-transform:uppercase;color:${v.ex2.accent};font-weight:600`)}>📍 Sites majeurs</div>
            <div style={css(`display:flex;flex-wrap:wrap;gap:6px;margin-top:8px`)}>
              { (v.ex2.siteChips || []).map((s, __k1) => (<React.Fragment key={__k1}>
                <div onClick={s.go} title="Situer sur la carte des sites" style={css(`display:flex;align-items:center;gap:5px;font-size:11px;color:#33505f;background:#fff;border:1px solid rgba(15,44,60,0.08);border-radius:20px;padding:4px 11px;cursor:pointer`)}>📍 {s.label}</div>
              </React.Fragment>)) }
            </div>
            <div style={css(`font-size:10px;color:${v.ex2.accent};margin-top:9px;font-weight:600`)}>↳ Touchez un site pour le situer sur la carte des sites →</div>
          </div>
          <div style={css(`display:flex;flex-direction:column;gap:1px;background:#e4edf1;border:1px solid #e0eaef;border-radius:12px;overflow:hidden;margin-top:8px`)}>
            { (v.ex2.specimenRows || []).map((sp, __k1) => (<React.Fragment key={__k1}>
              <div style={css(`background:#fff;padding:10px 13px;display:flex;justify-content:space-between;gap:10px;align-items:baseline`)}>
                <span style={css(`font-size:12px;font-weight:600;color:#0f2c3c`)}>{sp.nm}</span>
                <span style={css(`font-size:10.5px;color:#8aa5b3;text-align:right`)}>{sp.dt}</span>
              </div>
            </React.Fragment>)) }
          </div>

          { v.ex2.hasDeextinct ? (<>
          <div style={css(`margin-top:8px;padding:11px 13px;background:#eef4f7;border:1px solid #dbe7ec;border-radius:11px`)}>
            <div style={css(`font-size:8px;letter-spacing:.5px;text-transform:uppercase;color:#2f7ca0;font-weight:600`)}>🧬 Projets de dé-extinction</div>
            <div style={css(`font-size:11.5px;line-height:1.55;color:#33505f;margin-top:5px`)}>{v.ex2.deextinct}</div>
          </div>
          </>) : null }

          
          <div style={css(`margin-top:14px;padding:13px 14px;background:#12303f;color:#eaf3f7;border-radius:12px`)}>
            <div style={css(`font-size:8px;letter-spacing:.5px;text-transform:uppercase;color:#8fb4c6;font-weight:600`)}>💡 Leçon paléoclimatique</div>
            <div style={css(`font-family:'Spectral',serif;font-size:14px;line-height:1.55;margin-top:6px`)}>{v.ex2.lesson}</div>
          </div>

          
          <div style={css(`font-family:'Spectral',serif;font-size:15px;font-weight:600;margin:18px 0 8px`)}>Le saviez-vous ?</div>
          <div style={css(`display:flex;flex-direction:column;gap:8px`)}>
            { (v.ex2.factList || []).map((fa, __k1) => (<React.Fragment key={__k1}>
              <div style={css(`display:flex;gap:9px;background:#fbf9f4;border:1px solid #efe9dc;border-radius:11px;padding:11px 13px`)}>
                <div style={css(`font-size:15px;flex-shrink:0`)}>💡</div>
                <div style={css(`font-size:12px;line-height:1.55;color:#4a3b32`)}>{fa}</div>
              </div>
            </React.Fragment>)) }
          </div>
        </div>
        </>) : null }

      </div>
      </>) : null }

      
      { v.isFossils ? (<>
      <div style={css(`padding:14px 14px 30px`)}>

        { v.fossilList ? (<>
        <div>
          <div style={css(`font-family:'Spectral',serif;font-size:21px;font-weight:600;line-height:1.15`)}>Galerie des fossiles</div>
          <div style={css(`font-size:11.5px;line-height:1.5;color:#4d6c7d;margin-top:5px;margin-bottom:16px`)}>Chaque fossile est une fenêtre sur un environnement disparu. Touchez une fiche pour son âge, sa localisation, son milieu de vie et le climat qu'il révèle.</div>

          <div style={css(`display:grid;grid-template-columns:1fr 1fr;gap:11px`)}>
            { (v.fossilCards || []).map((f, __k1) => (<React.Fragment key={__k1}>
              <div onClick={f.open} style={css(`border-radius:13px;overflow:hidden;background:#fff;box-shadow:0 1px 2px rgba(15,44,60,0.06),0 8px 20px rgba(15,44,60,0.05);cursor:pointer;border:1px solid #e0eaef`)}>
                <div style={css(`height:104px;background:${f.wash};position:relative`)}>
                  <ImageSlot ph="{{ f.ph }}" fill />
                </div>
                <div style={css(`padding:9px 11px 11px`)}>
                  <div style={css(`font-family:'Spectral',serif;font-size:14px;font-weight:600;color:#0f2c3c;line-height:1.15`)}>{f.name}</div>
                  <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:9px;color:#6b8898;margin-top:4px`)}>{f.age}</div>
                </div>
              </div>
            </React.Fragment>)) }
          </div>
        </div>
        </>) : null }

        { v.fo ? (<>
        <div>
          <div onClick={v.backToFossils} style={css(`font-size:11px;color:#38617a;font-weight:500;margin-bottom:12px;cursor:pointer`)}>‹ Tous les fossiles</div>
          <div style={css(`height:200px;border-radius:16px;overflow:hidden;background:${v.fo.wash};position:relative;border:1px solid #e0eaef;margin-bottom:14px`)}>
            <ImageSlot ph="{{ fo.ph }}" fill />
          </div>
          <div style={css(`font-family:'Spectral',serif;font-size:23px;font-weight:600;line-height:1.1;color:#0f2c3c`)}>{v.fo.name}</div>
          <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:10.5px;color:${v.fo.color};margin-top:4px;margin-bottom:14px`)}>{v.fo.taxon}</div>

          <div style={css(`display:flex;flex-direction:column;gap:1px;background:#e4edf1;border:1px solid #e0eaef;border-radius:12px;overflow:hidden`)}>
            <div style={css(`background:#fff;padding:11px 14px`)}>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:8.5px;letter-spacing:1px;text-transform:uppercase;color:${v.fo.color};font-weight:600`)}>Âge</div>
              <div style={css(`font-size:12.5px;line-height:1.5;color:#33505f;margin-top:4px`)}>{v.fo.age}</div>
            </div>
            <div style={css(`background:#fff;padding:11px 14px`)}>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:8.5px;letter-spacing:1px;text-transform:uppercase;color:${v.fo.color};font-weight:600`)}>Localisation</div>
              <div style={css(`font-size:12.5px;line-height:1.5;color:#33505f;margin-top:4px`)}>{v.fo.loc}</div>
            </div>
            <div style={css(`background:#fff;padding:11px 14px`)}>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:8.5px;letter-spacing:1px;text-transform:uppercase;color:${v.fo.color};font-weight:600`)}>Environnement</div>
              <div style={css(`font-size:12.5px;line-height:1.5;color:#33505f;margin-top:4px`)}>{v.fo.env}</div>
            </div>
          </div>

          <div style={css(`border-left:3px solid ${v.fo.color};background:${v.fo.wash};border-radius:0 12px 12px 0;padding:12px 14px;margin-top:12px`)}>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:1.2px;text-transform:uppercase;color:${v.fo.color};font-weight:600`)}>Climat</div>
            <div style={css(`font-size:12.5px;line-height:1.55;color:#33505f;margin-top:6px`)}>{v.fo.clim}</div>
          </div>
        </div>
        </>) : null }

      </div>
      </>) : null }

      
      { v.isGlaciations ? (<>
      <div style={css(`padding:14px 14px 30px`)}>
        <div style={css(`font-family:'Spectral',serif;font-size:21px;font-weight:600;line-height:1.15`)}>Les grandes glaciations</div>
        <div style={css(`font-size:11.5px;line-height:1.5;color:#4d6c7d;margin-top:5px;margin-bottom:16px`)}>Cinq grands épisodes glaciaires sur 2,6 milliards d'années. Touchez une bande de l'axe pour explorer sa cause, son extension et ses preuves géologiques.</div>

        <div style={css(`display:flex;gap:0;margin-bottom:20px`)}>
          <div style={css(`width:38px;flex-shrink:0;display:flex;flex-direction:column;justify-content:space-between;font-family:'IBM Plex Mono',monospace;font-size:8.5px;color:#8aa5b3;text-align:right;padding-right:7px;height:300px`)}>
            <div>2600<br />Ma</div><div>1950</div><div>1300</div><div>650</div><div>0<br />auj.</div>
          </div>
          <div style={css(`width:14px;flex-shrink:0;position:relative;height:300px;background:linear-gradient(180deg,#dce7ec,#eef4f7);border-radius:5px`)}>
            { (v.glacBands || []).map((g, __k1) => (<React.Fragment key={__k1}>
              <div onClick={g.open} style={g.bandStyle}></div>
            </React.Fragment>)) }
          </div>
          <div style={css(`flex:1;position:relative;height:300px`)}>
            { (v.glacBands || []).map((g, __k1) => (<React.Fragment key={__k1}>
              <div onClick={g.open} style={g.labelStyle}>{g.name}</div>
            </React.Fragment>)) }
          </div>
        </div>

        <div>
          <div style={css(`height:170px;border-radius:16px;overflow:hidden;background:${v.glac.wash};position:relative;border:1px solid #e0eaef;margin-bottom:14px`)}>
            <ImageSlot ph="Déposez une carte de l'extension des glaces" fill />
          </div>
          <div style={css(`display:flex;align-items:baseline;justify-content:space-between;gap:10px`)}>
            <div style={css(`font-family:'Spectral',serif;font-size:20px;font-weight:600;line-height:1.1;color:#0f2c3c`)}>{v.glac.name}</div>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:9.5px;color:${v.glac.color};white-space:nowrap`)}>{v.glac.period}</div>
          </div>
          <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:11px;color:#6b8898;margin-top:5px;margin-bottom:14px`)}>{v.glac.span} · {v.glac.dur}</div>

          <div style={css(`display:flex;flex-direction:column;gap:1px;background:#e4edf1;border:1px solid #e0eaef;border-radius:12px;overflow:hidden`)}>
            <div style={css(`background:#fff;padding:11px 14px`)}>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:8.5px;letter-spacing:1px;text-transform:uppercase;color:${v.glac.color};font-weight:600`)}>Localisation des dépôts</div>
              <div style={css(`font-size:12.5px;line-height:1.5;color:#33505f;margin-top:4px`)}>{v.glac.loc}</div>
            </div>
            <div style={css(`background:#fff;padding:11px 14px`)}>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:8.5px;letter-spacing:1px;text-transform:uppercase;color:${v.glac.color};font-weight:600`)}>Extension des glaces</div>
              <div style={css(`font-size:12.5px;line-height:1.5;color:#33505f;margin-top:4px`)}>{v.glac.extent}</div>
            </div>
          </div>

          <div style={css(`border-left:3px solid ${v.glac.color};background:${v.glac.wash};border-radius:0 12px 12px 0;padding:12px 14px;margin-top:12px`)}>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:1.2px;text-transform:uppercase;color:${v.glac.color};font-weight:600`)}>Cause</div>
            <div style={css(`font-size:12.5px;line-height:1.55;color:#33505f;margin-top:6px`)}>{v.glac.cause}</div>
          </div>
          <div style={css(`border-left:3px solid ${v.glac.color};background:${v.glac.wash};border-radius:0 12px 12px 0;padding:12px 14px;margin-top:11px`)}>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:1.2px;text-transform:uppercase;color:${v.glac.color};font-weight:600`)}>Preuves géologiques</div>
            <div style={css(`font-size:12.5px;line-height:1.55;color:#33505f;margin-top:6px`)}>{v.glac.evidence}</div>
          </div>
        </div>
      </div>
      </>) : null }

      
      { v.isCores ? (<>
      <div style={css(`padding:14px 14px 30px`)}>
        <div style={css(`font-family:'Spectral',serif;font-size:21px;font-weight:600;line-height:1.15`)}>Forages célèbres</div>
        <div style={css(`font-size:11.5px;line-height:1.5;color:#4d6c7d;margin-top:5px;margin-bottom:14px`)}>Les grandes carottes de glace qui ont écrit l'histoire du climat. Touchez une épingle pour voir sa profondeur, son âge maximal et ses découvertes.</div>

        <div style={css(`position:relative;width:100%;aspect-ratio:2 / 1;border-radius:12px;overflow:hidden;border:1px solid #cfe0e8;background:#dbe7ec;margin-bottom:12px`)}>
          <ImageSlot ph="Déposez une carte du monde (projection équirectangulaire)" fill />
          { (v.corePins || []).map((c, __k1) => (<React.Fragment key={__k1}>
            <div onClick={c.open} title={c.name} style={c.pinStyle}></div>
          </React.Fragment>)) }
        </div>

        <div style={css(`display:flex;gap:6px;margin-bottom:16px`)}>
          { (v.corePins || []).map((c, __k1) => (<React.Fragment key={__k1}>
            <div onClick={c.open} style={c.chipStyle}>{c.name}</div>
          </React.Fragment>)) }
        </div>

        <div style={css(`display:flex;align-items:baseline;justify-content:space-between;gap:10px`)}>
          <div style={css(`font-family:'Spectral',serif;font-size:20px;font-weight:600;line-height:1.1;color:#0f2c3c`)}>{v.core.name}</div>
        </div>
        <div style={css(`font-size:11.5px;color:#6b8898;margin-top:4px;margin-bottom:14px`)}>{v.core.region} · {v.core.loc}</div>

        <div style={css(`display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:12px`)}>
          <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:12px;padding:12px 13px`)}>
            <div style={css(`font-size:8.5px;letter-spacing:0.7px;text-transform:uppercase;color:#8aa5b3`)}>Profondeur</div>
            <div style={css(`font-size:12.5px;line-height:1.45;color:#0f2c3c;margin-top:6px`)}>{v.core.depth}</div>
          </div>
          <div style={css(`background:#0f2c3c;border-radius:12px;padding:12px 13px;color:#eaf3f7`)}>
            <div style={css(`font-size:8.5px;letter-spacing:0.7px;text-transform:uppercase;color:#8fb4c6`)}>Âge maximal</div>
            <div style={css(`font-size:12.5px;line-height:1.45;margin-top:6px`)}>{v.core.maxage}</div>
          </div>
        </div>

        <div style={css(`border-left:3px solid ${v.core.color};background:${v.core.wash};border-radius:0 12px 12px 0;padding:12px 14px;background:#eef4f7`)}>
          <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:1.2px;text-transform:uppercase;color:${v.core.color};font-weight:600`)}>Découvertes majeures</div>
          <div style={css(`font-size:12.5px;line-height:1.55;color:#33505f;margin-top:6px`)}>{v.core.finds}</div>
        </div>
      </div>
      </>) : null }

      
      { v.isOverlay ? (<>
      <div style={css(`padding:14px 14px 30px`)}>
        <div style={css(`font-family:'Spectral',serif;font-size:21px;font-weight:600;line-height:1.15`)}>Superposition de données</div>
        <div style={css(`font-size:11.5px;line-height:1.5;color:#4d6c7d;margin-top:5px`)}>Vraies séries archivées au NOAA, superposées sur 800 ka (chaque courbe normalisée dans sa propre bande). Faites glisser une courbe pour aligner les événements.</div>

        <div style={css(`display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;margin-bottom:12px`)}>
          { (v.dsChips || []).map((c, __k1) => (<React.Fragment key={__k1}>
            <div onClick={c.toggle} style={c.style}>
              <div style={c.dotStyle}></div>{c.label}
            </div>
          </React.Fragment>)) }
        </div>

        <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:12px;padding:12px 10px 8px`)}>
          <svg viewBox="0 0 320 200" style={css(`width:100%;display:block`)}>
            <line x1="30" y1="6" x2="30" y2="192" stroke="#eef3f6" strokeWidth="1"></line>
            <line x1="30" y1="65" x2="310" y2="65" stroke="#f4f7f9" strokeWidth="1"></line>
            <line x1="30" y1="130" x2="310" y2="130" stroke="#f4f7f9" strokeWidth="1"></line>
            { (v.overlayCurves || []).map((cv, __k1) => (<React.Fragment key={__k1}>
              <path d={cv.path} fill="none" stroke={cv.color} strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round"></path>
            </React.Fragment>)) }
            <text x="30" y="199" fontFamily="'IBM Plex Mono',monospace" fontSize="8" fill="#8aa5b3">800 ka</text>
            <text x="290" y="199" fontFamily="'IBM Plex Mono',monospace" fontSize="8" fill="#8aa5b3">0</text>
          </svg>
        </div>

        <div style={css(`margin-top:14px;background:#eef4f7;border:1px solid #dbe7ec;border-radius:12px;padding:13px 14px`)}>
          <div style={css(`font-size:9px;letter-spacing:.6px;text-transform:uppercase;color:#8aa5b3;margin-bottom:7px`)}>Corrélation visuelle · décaler une courbe</div>
          <div style={css(`display:flex;gap:6px;margin-bottom:11px`)}>
            { (v.shiftOptions || []).map((o, __k1) => (<React.Fragment key={__k1}>
              <div onClick={o.pick} style={o.style}>{o.label}</div>
            </React.Fragment>)) }
          </div>
          <div style={css(`display:flex;align-items:center;justify-content:space-between;margin-bottom:4px`)}>
            <div style={css(`font-size:11.5px;color:#33505f`)}>Décalage de <strong>{v.shiftLabel}</strong></div>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:12px;color:#0f2c3c`)}>{v.shiftTxt}</div>
          </div>
          <input type="range" min="-100" max="100" step="2" value={v.shiftKa} onChange={v.onShift} onInput={v.onShift} style={css(`width:100%;accent-color:#1d6f96`)} />
          <div style={css(`display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;font-size:9px;color:#8aa5b3;margin-top:2px`)}>
            <span>−100 ka</span><span>+100 ka</span>
          </div>
          <div onClick={v.resetShift} style={css(`margin-top:10px;text-align:center;padding:9px;border-radius:9px;background:#fff;border:1px solid #cfe0e8;font-size:12px;font-weight:600;color:#38617a;cursor:pointer`)}>Réinitialiser l'alignement</div>
        </div>

        <div style={css(`margin-top:12px;padding:11px 13px;border-radius:10px;background:#12303f;color:#dce9ef;font-size:10.5px;line-height:1.55`)}>Astuce : gardez le δ¹⁸O LR04 comme référence, puis décalez le niveau marin ou le CO₂ pour faire coïncider les terminaisons glaciaires — le principe du « wiggle matching » utilisé pour caler les archives entre elles. Ici les trois séries partagent déjà l'échelle d'âge : un décalage nul est le meilleur alignement.</div>

        <div style={css(`margin-top:12px;font-size:10px;line-height:1.5;color:#8aa5b3`)}>Sources NOAA NCEI Paleoclimatology : composite CO₂ antarctique (Bereiter et al. 2015, étude 17975), niveau marin (Spratt & Lisiecki 2016, étude 19982), δ¹⁸O benthique LR04 (Lisiecki & Raymo 2005). Séries ré-échantillonnées à 20 ka et normalisées pour la superposition ; le niveau marin 720–800 ka est lissé.</div>
      </div>
      </>) : null }

      
      { v.isCalc ? (<>
      <div style={css(`padding:14px 14px 30px`)}>
        <div style={css(`font-family:'Spectral',serif;font-size:21px;font-weight:600;line-height:1.15`)}>Calculateur δ¹⁸O → T°</div>
        <div style={css(`font-size:11.5px;line-height:1.5;color:#4d6c7d;margin-top:5px`)}>Entrez le δ¹⁸O mesuré sur la calcite du foraminifère et celui de l'eau de mer, choisissez l'équation/l'espèce, et obtenez la température de l'eau à l'époque.</div>

        <div style={css(`display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px`)}>
          <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:11px;padding:11px 12px`)}>
            <div style={css(`font-size:9px;letter-spacing:.4px;text-transform:uppercase;color:#8aa5b3`)}>δ¹⁸O calcite</div>
            <div style={css(`font-size:9px;color:#8aa5b3;margin-bottom:5px`)}>‰ VPDB</div>
            <input type="number" step="0.1" value={v.dCalcite} onChange={v.onDCalcite} onInput={v.onDCalcite} style={css(`width:100%;padding:9px 10px;border:1px solid #cfe0e8;border-radius:8px;font-family:'IBM Plex Mono',monospace;font-size:15px;color:#0f2c3c;outline:none`)} />
          </div>
          <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:11px;padding:11px 12px`)}>
            <div style={css(`font-size:9px;letter-spacing:.4px;text-transform:uppercase;color:#8aa5b3`)}>δ¹⁸O eau de mer</div>
            <div style={css(`font-size:9px;color:#8aa5b3;margin-bottom:5px`)}>‰ VSMOW</div>
            <input type="number" step="0.1" value={v.dWater} onChange={v.onDWater} onInput={v.onDWater} style={css(`width:100%;padding:9px 10px;border:1px solid #cfe0e8;border-radius:8px;font-family:'IBM Plex Mono',monospace;font-size:15px;color:#0f2c3c;outline:none`)} />
          </div>
        </div>

        <div style={css(`margin-top:12px;background:#0f2c3c;border-radius:14px;padding:16px 18px;color:#eaf3f7`)}>
          <div style={css(`display:flex;justify-content:space-between;align-items:flex-end`)}>
            <div>
              <div style={css(`font-size:9px;letter-spacing:.5px;text-transform:uppercase;color:#7fa8bc`)}>Température de l'eau</div>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:38px;font-weight:500;line-height:1.05;margin-top:2px`)}>{v.tempTxt}</div>
            </div>
            <div style={css(`text-align:right`)}>
              <div style={css(`font-size:9px;letter-spacing:.5px;text-transform:uppercase;color:#7fa8bc`)}>Δ (calcite−eau)</div>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:15px;margin-top:3px;color:#c6dbe6`)}>{v.deltaTxt}</div>
            </div>
          </div>
          { v.calcValid ? (<>
            <div style={css(`margin-top:10px;font-size:11.5px;line-height:1.5;color:#c6dbe6;border-top:1px solid rgba(143,180,198,0.25);padding-top:9px`)}>{v.tempInterp}</div>
          </>) : null }
          { v.calcInvalid ? (<>
            <div style={css(`margin-top:10px;font-size:11.5px;color:#e79b7e`)}>Entrez deux valeurs numériques.</div>
          </>) : null }
          <div style={css(`margin-top:10px;font-family:'IBM Plex Mono',monospace;font-size:10.5px;color:#8fb4c6`)}>{v.eqFormula}  ·  Δ = δc − (δw − 0,27)</div>
        </div>

        <div style={css(`font-family:'Spectral',serif;font-size:15px;font-weight:600;margin:18px 0 8px`)}>Équation / espèce</div>
        { (v.eqCards || []).map((e, __k1) => (<React.Fragment key={__k1}>
          <div onClick={e.pick} style={e.style}>
            <div style={css(`display:flex;align-items:baseline;gap:8px`)}>
              <div style={css(`width:13px;height:13px;border-radius:50%;flex-shrink:0;border:2px solid #1d6f96;background:#fff;position:relative;margin-top:2px`)}>
                { e.active ? (<><div style={css(`position:absolute;inset:2px;border-radius:50%;background:#1d6f96`)}></div></>) : null }
              </div>
              <div style={css(`flex:1`)}>
                <div style={css(`font-size:13px;font-weight:600;color:#0f2c3c`)}>{e.species}</div>
                <div style={css(`font-size:11px;line-height:1.4;color:#4d6c7d;margin-top:2px`)}>{e.detail}</div>
                <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:10.5px;color:#1d6f96;margin-top:5px`)}>{e.formula}</div>
              </div>
            </div>
          </div>
        </React.Fragment>)) }

        <div style={css(`margin-top:12px;padding:12px 14px;border-radius:11px;background:#eef4f7;border:1px solid #dbe7ec;font-size:11px;line-height:1.55;color:#33505f`)}>
          <strong>Conventions.</strong> δc en ‰ VPDB (calcite), δw en ‰ VSMOW (eau) ; la correction d'échelle −0,27‰ convertit VSMOW→VPDB. Le δ¹⁸O de l'eau reflète le volume de glace global (≈ 0‰ actuel, jusqu'à +1‰ au dernier maximum glaciaire).
        </div>
        <div style={css(`margin-top:8px;font-size:10px;line-height:1.5;color:#8aa5b3`)}>Réf. : Shackleton (1974) ; O'Neil et al. (1969) ; Erez & Luz (1983) ; Bemis et al. (1998).</div>
      </div>
      </>) : null }

      
      { v.isMilank ? (<>
      <div style={css(`padding:14px 14px 30px`)}>
        <div style={css(`font-family:'Spectral',serif;font-size:21px;font-weight:600;line-height:1.15`)}>Bac à sable orbital</div>
        <div style={css(`font-size:11.5px;line-height:1.5;color:#4d6c7d;margin-top:5px`)}>Modifiez les paramètres orbitaux de la Terre et observez en direct l'insolation reçue selon la latitude — le moteur des cycles glaciaires.</div>

        <div style={css(`display:flex;gap:6px;margin-top:12px;margin-bottom:8px`)}>
          <div onClick={v.setSummer} style={v.seasonSummerStyle}>Solstice<br />juin</div>
          <div onClick={v.setEquinox} style={v.seasonEquinoxStyle}>Équinoxe<br />mars</div>
          <div onClick={v.setWinter} style={v.seasonWinterStyle}>Solstice<br />déc.</div>
        </div>

        <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:12px;padding:12px 12px 8px`)}>
          <div style={css(`display:flex;justify-content:space-between;align-items:center;margin-bottom:4px`)}>
            <div style={css(`font-size:11px;font-weight:600;color:#c25a3a`)}>Insolation journalière — {v.seasonName}</div>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:9px;color:#8aa5b3`)}>W/m²</div>
          </div>
          <svg viewBox="0 0 320 168" style={css(`width:100%;display:block`)}>
            <line x1="34" y1="152" x2="312" y2="152" stroke="#e0eaef" strokeWidth="1"></line>
            <line x1="34" y1="82" x2="312" y2="82" stroke="#f4f7f9" strokeWidth="1"></line>
            <line x1="34" y1="12" x2="312" y2="12" stroke="#f4f7f9" strokeWidth="1"></line>
            <line x1="173" y1="12" x2="173" y2="152" stroke="#eef3f6" strokeWidth="1"></line>
            <path d={v.insoArea} fill="#c25a3a" fillOpacity="0.10"></path>
            <path d={v.insoPath} fill="none" stroke="#c25a3a" strokeWidth="2" strokeLinejoin="round"></path>
            <line x1={v.x65} y1="12" x2={v.x65} y2="152" stroke="#1d6f96" strokeWidth="1" strokeDasharray="3 3"></line>
            <circle cx={v.x65} cy={v.y65} r="4" fill="#fff" stroke="#1d6f96" strokeWidth="2"></circle>
            <text x="34" y="164" fontFamily="'IBM Plex Mono',monospace" fontSize="8" fill="#8aa5b3">90°S</text>
            <text x="168" y="164" fontFamily="'IBM Plex Mono',monospace" fontSize="8" fill="#8aa5b3">Éq.</text>
            <text x="300" y="164" fontFamily="'IBM Plex Mono',monospace" fontSize="8" fill="#8aa5b3">90°N</text>
            <text x={v.x65} y="10" textAnchor="middle" fontFamily="'IBM Plex Mono',monospace" fontSize="8" fill="#1d6f96">65°N</text>
          </svg>
        </div>

        <div style={css(`display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px`)}>
          <div style={css(`background:#0f2c3c;border-radius:11px;padding:12px 13px;color:#eaf3f7`)}>
            <div style={css(`font-size:8.5px;letter-spacing:.5px;text-transform:uppercase;color:#7fa8bc`)}>Insolation 65°N</div>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:19px;margin-top:3px`)}>{v.inso65Txt}</div>
          </div>
          <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:11px;padding:12px 13px`)}>
            <div style={css(`font-size:8.5px;letter-spacing:.5px;text-transform:uppercase;color:#8aa5b3`)}>vs orbite actuelle</div>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:19px;margin-top:3px;color:${v.inso65DeltaColor}`)}>{v.inso65DeltaTxt}</div>
          </div>
        </div>

        <div style={css(`margin-top:16px`)}>
          <div style={css(`display:flex;justify-content:space-between;align-items:baseline`)}>
            <div style={css(`font-size:12px;font-weight:600;color:#0f2c3c`)}>Excentricité</div>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:12px;color:#1d6f96`)}>{v.eccTxt}</div>
          </div>
          <div style={css(`font-size:10px;color:#8aa5b3;margin-bottom:3px`)}>Forme de l'orbite · cycles ~100 & 400 ka</div>
          <input type="range" min="0" max="6" step="0.05" value={v.eccVal} onChange={v.onEcc} onInput={v.onEcc} style={css(`width:100%;accent-color:#c25a3a`)} />
        </div>
        <div style={css(`margin-top:14px`)}>
          <div style={css(`display:flex;justify-content:space-between;align-items:baseline`)}>
            <div style={css(`font-size:12px;font-weight:600;color:#0f2c3c`)}>Obliquité</div>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:12px;color:#1d6f96`)}>{v.oblTxt}</div>
          </div>
          <div style={css(`font-size:10px;color:#8aa5b3;margin-bottom:3px`)}>Inclinaison de l'axe · cycle ~41 ka (22,1°–24,5°)</div>
          <input type="range" min="22" max="24.5" step="0.01" value={v.oblVal} onChange={v.onObl} onInput={v.onObl} style={css(`width:100%;accent-color:#c25a3a`)} />
        </div>
        <div style={css(`margin-top:14px`)}>
          <div style={css(`display:flex;justify-content:space-between;align-items:baseline`)}>
            <div style={css(`font-size:12px;font-weight:600;color:#0f2c3c`)}>Précession (périhélie)</div>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:12px;color:#1d6f96`)}>{v.precTxt}</div>
          </div>
          <div style={css(`font-size:10px;color:#8aa5b3;margin-bottom:3px`)}>Saison au plus près du Soleil · cycle ~21 ka</div>
          <input type="range" min="0" max="360" step="1" value={v.precVal} onChange={v.onPrec} onInput={v.onPrec} style={css(`width:100%;accent-color:#c25a3a`)} />
        </div>

        <div onClick={v.resetOrbit} style={css(`margin-top:16px;text-align:center;padding:10px;border-radius:9px;background:#fff;border:1px solid #cfe0e8;font-size:12px;font-weight:600;color:#38617a;cursor:pointer`)}>Rétablir l'orbite actuelle</div>

        <div style={css(`margin-top:14px;padding:12px 14px;border-radius:11px;background:#eef4f7;border:1px solid #dbe7ec;font-size:11px;line-height:1.55;color:#33505f`)}>Une faible insolation d'été à 65°N laisse survivre la neige de l'hiver précédent : c'est le déclencheur classique des glaciations (hypothèse de Milankovitch). Excentricité et précession n'agissent qu'ensemble ; l'obliquité contrôle le contraste pôles–équateur.</div>
        <div style={css(`margin-top:8px;font-size:10px;line-height:1.5;color:#8aa5b3`)}>Insolation calculée par la formule journalière standard (constante solaire 1361 W/m²). Les valeurs orbitales par défaut correspondent à l'actuel (e≈0,0167 ; obliquité 23,44° ; périhélie ≈283°).</div>
      </div>
      </>) : null }

      
      { v.isGlossary ? (<>
      <div style={css(`padding:14px 14px 30px`)}>
        <div style={css(`font-family:'Spectral',serif;font-size:21px;font-weight:600;line-height:1.15`)}>Glossaire du jargon</div>
        <div style={css(`font-size:11.5px;line-height:1.5;color:#4d6c7d;margin-top:5px`)}>Les termes qui reviennent dans les articles de paléoclimatologie, expliqués simplement.</div>

        <input value={v.glossQ} onChange={v.onGlossQ} onInput={v.onGlossQ} placeholder="Rechercher un terme…" style={css(`width:100%;margin-top:14px;padding:11px 13px;border:1px solid #cfe0e8;border-radius:10px;font-family:'IBM Plex Sans',sans-serif;font-size:13px;color:#0f2c3c;background:#fff;outline:none`)} />

        <div style={css(`display:flex;flex-wrap:wrap;gap:6px;margin-top:10px`)}>
          { (v.glossCatChips || []).map((c, __k1) => (<React.Fragment key={__k1}>
            <div onClick={c.pick} style={c.style}>{c.label}</div>
          </React.Fragment>)) }
        </div>

        <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:10px;color:#8aa5b3;margin-top:12px;margin-bottom:4px`)}>{v.glossCount} terme(s)</div>

        <div style={css(`display:flex;flex-direction:column;gap:9px`)}>
          { (v.glossTerms || []).map((g, __k1) => (<React.Fragment key={__k1}>
            <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:11px;padding:12px 14px`)}>
              <div style={css(`display:flex;align-items:baseline;justify-content:space-between;gap:8px`)}>
                <div style={css(`font-family:'Spectral',serif;font-size:15px;font-weight:600;color:#0f2c3c`)}>{g.term}</div>
                <div style={css(`font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.4px;color:#1d6f96;background:#eef6fa;padding:3px 8px;border-radius:20px;white-space:nowrap;flex-shrink:0`)}>{g.cat}</div>
              </div>
              <div style={css(`font-size:12.5px;line-height:1.55;color:#42586a;margin-top:6px`)}>{g.def}</div>
            </div>
          </React.Fragment>)) }
        </div>

        { v.glossEmpty ? (<>
          <div style={css(`text-align:center;padding:30px 20px;color:#8aa5b3;font-size:12.5px`)}>Aucun terme ne correspond. Essayez un autre mot-clé.</div>
        </>) : null }
      </div>
      </>) : null }

      
      { v.isSites ? (<>
      <div style={css(`padding:14px 14px 30px`)}>
        <div style={css(`font-family:'Spectral',serif;font-size:21px;font-weight:600;line-height:1.15`)}>Carte des sites proxy</div>
        <div style={css(`font-size:11.5px;line-height:1.5;color:#4d6c7d;margin-top:5px`)}>Les lieux où l'on peut « voir » le paléoclimat : carottes de glace, varves, tillites, limites d'extinction, gisements fossiles. Touchez une épingle — ou ajoutez la vôtre.</div>

        <div style={css(`display:flex;gap:6px;overflow-x:auto;margin-top:12px;margin-bottom:10px;padding-bottom:2px`)}>
          { (v.siteCatChips || []).map((c, __k1) => (<React.Fragment key={__k1}>
            <div onClick={c.pick} style={c.style}>{c.label}</div>
          </React.Fragment>)) }
        </div>

        <div ref={v.mapRef} onClick={v.onMapTap} style={css(`position:relative;width:100%;aspect-ratio:2 / 1;border-radius:12px;overflow:hidden;border:1px solid #cfe0e8;background:#dbe7ec;cursor:${v.mapCursor}`)}>
          <ImageSlot ph="Déposez une carte du monde (projection équirectangulaire)" fill />
          { (v.mapPins || []).map((p, __k1) => (<React.Fragment key={__k1}>
            <div onClick={p.open} title={p.name} style={p.pinStyle}></div>
          </React.Fragment>)) }
        </div>

        <div onClick={v.toggleAdd} style={v.addBtnStyle}>{v.addBtnLabel}</div>
        <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:10px;color:#8aa5b3;margin-top:8px`)}>{v.siteCount} site(s) affiché(s)</div>

        <div style={css(`margin-top:12px;background:#fff;border:1px solid #e0eaef;border-radius:11px;padding:11px 13px`)}>
          <div style={css(`font-size:9px;letter-spacing:.5px;text-transform:uppercase;color:#8aa5b3;margin-bottom:8px`)}>Légende</div>
          <div style={css(`display:flex;flex-wrap:wrap;gap:8px 14px`)}>
            { (v.legendItems || []).map((l, __k1) => (<React.Fragment key={__k1}>
              <div style={css(`display:flex;align-items:center;gap:6px`)}>
                <div style={css(`width:10px;height:10px;border-radius:50%;background:${l.color};flex-shrink:0`)}></div>
                <div style={css(`font-size:11px;color:#42586a`)}>{l.label}</div>
              </div>
            </React.Fragment>)) }
          </div>
        </div>

        <div style={css(`margin-top:12px;padding:11px 13px;border-radius:10px;background:#12303f;color:#dce9ef;font-size:10.5px;line-height:1.55`)}>Déposez une carte du monde en projection équirectangulaire pour un positionnement fidèle des épingles (longitude −180→180, latitude 90→−90). Les sites proposés sont réels ; vos ajouts restent sur cet appareil.</div>
      </div>
      </>) : null }

      { v.isAtlas ? (<>
      <div style={css(`padding:14px 14px 30px`)}>

        { v.atlasList ? (<>
        <div>
          <div style={css(`font-family:'Spectral',serif;font-size:21px;font-weight:600;line-height:1.15`)}>Atlas mondial des sites</div>
          <div style={css(`font-size:11.5px;line-height:1.5;color:#4d6c7d;margin-top:5px;margin-bottom:12px`)}>Sept grandes régions du globe, sept archives du climat : de la glace polaire au plancher océanique. Touchez une épingle ou une carte pour découvrir ce que chaque région nous apprend.</div>

          <div style={css(`position:relative;width:100%;aspect-ratio:2 / 1;border-radius:12px;overflow:hidden;border:1px solid #cfe0e8;background:#dbe7ec`)}>
            <ImageSlot ph="Déposez une carte du monde (projection équirectangulaire)" fill />
            { (v.atlasPins || []).map((p, __k1) => (<React.Fragment key={__k1}>
              <div onClick={p.open} title={p.name} style={p.pinStyle}>{p.emoji}</div>
            </React.Fragment>)) }
          </div>

          <div style={css(`display:flex;flex-direction:column;gap:11px;margin-top:14px`)}>
            { (v.atlasCards || []).map((r, __k1) => (<React.Fragment key={__k1}>
              <div onClick={r.open} style={css(`display:flex;gap:13px;align-items:center;background:#fff;border:1px solid #e0eaef;border-radius:14px;padding:13px 14px;cursor:pointer;box-shadow:0 1px 2px rgba(15,44,60,0.05),0 8px 20px rgba(15,44,60,0.04)`)}>
                <div style={css(`width:52px;height:52px;flex-shrink:0;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:27px;background:${r.wash}`)}>{r.emoji}</div>
                <div style={css(`min-width:0;flex:1`)}>
                  <div style={css(`font-family:'Spectral',serif;font-size:16px;font-weight:600;color:#0f2c3c`)}>{r.name}</div>
                  <div style={css(`font-size:11.5px;color:${r.color};margin-top:2px;line-height:1.35;font-style:italic`)}>{r.tagline}</div>
                  <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:9.5px;color:#8aa5b3;margin-top:4px`)}>{r.coords} · {r.timespan}</div>
                </div>
                <div style={css(`font-size:16px;color:#b7c6cd;flex-shrink:0`)}>›</div>
              </div>
            </React.Fragment>)) }
          </div>
          <div style={css(`margin-top:16px;padding:11px 13px;border-radius:10px;background:#12303f;color:#dce9ef;font-size:10px;line-height:1.55`)}>Déposez une carte du monde en projection équirectangulaire pour un positionnement fidèle des épingles. Régions et faits sont réels, à visée pédagogique.</div>
        </div>
        </>) : null }

        { v.atlasDetail ? (<>
        <div>
          <div onClick={v.backToAtlas} style={css(`font-size:11px;color:#38617a;font-weight:500;margin-bottom:12px;cursor:pointer`)}>‹ Tout l'atlas</div>

          <div style={css(`height:170px;border-radius:16px;overflow:hidden;background:${v.at2.wash};position:relative;border:1px solid #e0eaef`)}>
            <ImageSlot ph={v.at2.ph} fill />
            <div style={css(`position:absolute;top:12px;left:12px;font-size:34px`)}>{v.at2.emoji}</div>
          </div>
          <div style={css(`margin-top:12px`)}>
            <div style={css(`font-family:'Spectral',serif;font-size:24px;font-weight:600;line-height:1.05;color:#0f2c3c`)}>{v.at2.name}</div>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:11px;color:${v.at2.color};margin-top:3px;font-style:italic`)}>« {v.at2.tagline} »</div>
            <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:10px;color:#8aa5b3;margin-top:4px`)}>{v.at2.coords}</div>
          </div>

          <div style={css(`font-size:13px;line-height:1.6;color:#33505f;margin-top:12px`)}>{v.at2.intro}</div>

          <div style={css(`display:grid;grid-template-columns:1fr;gap:8px;margin-top:14px`)}>
            <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:10px;padding:10px 12px`)}>
              <div style={css(`font-size:7.5px;letter-spacing:.5px;text-transform:uppercase;color:#8aa5b3`)}>Profondeur temporelle</div>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:11px;color:#0f2c3c;margin-top:4px;line-height:1.3`)}>{v.at2.timespan}</div>
            </div>
          </div>

          <div style={css(`background:${v.at2.wash};border-radius:12px;padding:12px 13px;margin-top:8px`)}>
            <div style={css(`font-size:8px;letter-spacing:.5px;text-transform:uppercase;color:${v.at2.color};font-weight:600`)}>🔬 Proxies & archives</div>
            <div style={css(`display:flex;flex-wrap:wrap;gap:6px;margin-top:8px`)}>
              { (v.at2.proxies || []).map((p, __k1) => (<React.Fragment key={__k1}>
                <div style={css(`font-size:11px;color:#33505f;background:#fff;border:1px solid rgba(15,44,60,0.08);border-radius:20px;padding:4px 11px`)}>{p}</div>
              </React.Fragment>)) }
            </div>
          </div>

          <div style={css(`font-family:'Spectral',serif;font-size:15px;font-weight:600;margin:18px 0 8px`)}>Ce que révèle cette région</div>
          <div style={css(`display:flex;flex-direction:column;gap:8px`)}>
            { (v.at2.revealRows || []).map((a, __k1) => (<React.Fragment key={__k1}>
              <div style={css(`display:flex;gap:11px;background:#fff;border:1px solid #e0eaef;border-radius:11px;padding:11px 13px`)}>
                <div style={css(`font-size:20px;flex-shrink:0;line-height:1.2`)}>{a.ic}</div>
                <div>
                  <div style={css(`font-size:12.5px;font-weight:600;color:#0f2c3c`)}>{a.ti}</div>
                  <div style={css(`font-size:11.5px;line-height:1.5;color:#5b7688;margin-top:2px`)}>{a.tx}</div>
                </div>
              </div>
            </React.Fragment>)) }
          </div>

          <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:12px;padding:12px 13px;margin-top:8px`)}>
            <div style={css(`font-size:8px;letter-spacing:.5px;text-transform:uppercase;color:#8aa5b3;margin-bottom:8px`)}>✦ À retenir</div>
            <div style={css(`display:flex;flex-direction:column;gap:6px`)}>
              { (v.at2.facts || []).map((f, __k1) => (<React.Fragment key={__k1}>
                <div style={css(`font-size:11.5px;line-height:1.45;color:#4a5b64;padding-left:14px;position:relative`)}><span style={css(`position:absolute;left:0;color:${v.at2.color}`)}>▸</span>{f}</div>
              </React.Fragment>)) }
            </div>
          </div>

          <div onClick={v.at2.goSites} style={css(`margin-top:14px;text-align:center;padding:12px;border-radius:11px;background:#0f2c3c;color:#eaf3f7;font-size:12.5px;font-weight:600;cursor:pointer`)}>📍 Voir les sites proxy de la région →</div>
        </div>
        </>) : null }

      </div>
      </>) : null }

      { v.isScientists ? (<>
      <div style={css(`padding:14px 14px 30px`)}>

        { v.sciList ? (<>
        <div>
          <div style={css(`font-family:'Spectral',serif;font-size:21px;font-weight:600;line-height:1.15`)}>Portraits de scientifiques</div>
          <div style={css(`font-size:11.5px;line-height:1.5;color:#4d6c7d;margin-top:5px;margin-bottom:16px`)}>Les figures qui ont bâti la paléoclimatologie, d'Agassiz à Jouzel. Touchez un portrait pour sa biographie, ses contributions et son héritage.</div>
          <div style={css(`display:flex;flex-direction:column;gap:11px`)}>
            { (v.sciCards || []).map((s, __k1) => (<React.Fragment key={__k1}>
              <div onClick={s.open} style={css(`display:flex;gap:13px;align-items:center;background:#fff;border:1px solid #e0eaef;border-radius:14px;padding:13px 14px;cursor:pointer;box-shadow:0 1px 2px rgba(15,44,60,0.05),0 8px 20px rgba(15,44,60,0.04)`)}>
                <div style={css(`width:52px;height:52px;flex-shrink:0;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Spectral',serif;font-size:19px;font-weight:600;color:#fff;background:${s.color}`)}>{s.initials}</div>
                <div style={css(`min-width:0;flex:1`)}>
                  <div style={css(`font-family:'Spectral',serif;font-size:16px;font-weight:600;color:#0f2c3c`)}>{s.name}</div>
                  <div style={css(`font-size:11.5px;color:${s.color};margin-top:2px;line-height:1.35;font-style:italic`)}>{s.tagline}</div>
                  <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:9.5px;color:#8aa5b3;margin-top:4px`)}>{s.years} · {s.field}</div>
                </div>
                <div style={css(`font-size:16px;color:#b7c6cd;flex-shrink:0`)}>›</div>
              </div>
            </React.Fragment>)) }
          </div>
          <div style={css(`margin-top:16px;padding:11px 13px;border-radius:10px;background:#12303f;color:#dce9ef;font-size:10px;line-height:1.55`)}>Notices biographiques synthétiques, à visée pédagogique. Déposez un portrait dans le cadre de chaque fiche.</div>
        </div>
        </>) : null }

        { v.sciDetail ? (<>
        <div>
          <div onClick={v.backToScientists} style={css(`font-size:11px;color:#38617a;font-weight:500;margin-bottom:12px;cursor:pointer`)}>‹ Tous les portraits</div>

          <div style={css(`height:186px;border-radius:16px;overflow:hidden;background:${v.sc2.wash};position:relative;border:1px solid #e0eaef`)}>
            <ImageSlot ph={v.sc2.ph} fill />
          </div>
          <div style={css(`display:flex;align-items:center;gap:12px;margin-top:12px`)}>
            <div style={css(`width:54px;height:54px;flex-shrink:0;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Spectral',serif;font-size:20px;font-weight:600;color:#fff;background:${v.sc2.color}`)}>{v.sc2.initials}</div>
            <div style={css(`min-width:0`)}>
              <div style={css(`font-family:'Spectral',serif;font-size:23px;font-weight:600;line-height:1.05;color:#0f2c3c`)}>{v.sc2.name}</div>
              <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:11px;color:${v.sc2.color};margin-top:3px`)}>{v.sc2.years}</div>
            </div>
          </div>

          <div style={css(`display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px`)}>
            <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:10px;padding:10px 11px`)}>
              <div style={css(`font-size:7.5px;letter-spacing:.5px;text-transform:uppercase;color:#8aa5b3`)}>Origine</div>
              <div style={css(`font-size:11px;font-weight:600;color:#0f2c3c;margin-top:4px;line-height:1.25`)}>{v.sc2.nat}</div>
            </div>
            <div style={css(`background:#fff;border:1px solid #e0eaef;border-radius:10px;padding:10px 11px`)}>
              <div style={css(`font-size:7.5px;letter-spacing:.5px;text-transform:uppercase;color:#8aa5b3`)}>Domaine</div>
              <div style={css(`font-size:11px;font-weight:600;color:#0f2c3c;margin-top:4px;line-height:1.25`)}>{v.sc2.field}</div>
            </div>
          </div>

          <div style={css(`background:${v.sc2.wash};border-radius:12px;padding:12px 13px;margin-top:8px`)}>
            <div style={css(`font-size:8px;letter-spacing:.5px;text-transform:uppercase;color:${v.sc2.color};font-weight:600`)}>★ Œuvre clé</div>
            <div style={css(`font-size:12.5px;color:#33505f;margin-top:6px;line-height:1.4;font-style:italic`)}>{v.sc2.keyWork}</div>
          </div>

          <div style={css(`font-family:'Spectral',serif;font-size:15px;font-weight:600;margin:18px 0 8px`)}>Biographie</div>
          { (v.sc2.bioParas || []).map((p, __k1) => (<React.Fragment key={__k1}>
            <div style={css(`font-size:13px;line-height:1.65;color:#33505f;margin-bottom:9px`)}>{p}</div>
          </React.Fragment>)) }

          <div style={css(`font-family:'Spectral',serif;font-size:15px;font-weight:600;margin:14px 0 8px`)}>Contributions majeures</div>
          <div style={css(`display:flex;flex-direction:column;gap:8px`)}>
            { (v.sc2.contribRows || []).map((c, __k1) => (<React.Fragment key={__k1}>
              <div style={css(`display:flex;gap:11px;background:#fff;border:1px solid #e0eaef;border-radius:11px;padding:11px 13px`)}>
                <div style={css(`font-size:20px;flex-shrink:0;line-height:1.2`)}>{c.ic}</div>
                <div>
                  <div style={css(`font-size:12.5px;font-weight:600;color:#0f2c3c`)}>{c.ti}</div>
                  <div style={css(`font-size:11.5px;line-height:1.5;color:#5b7688;margin-top:2px`)}>{c.tx}</div>
                </div>
              </div>
            </React.Fragment>)) }
          </div>

          <div style={css(`background:#12303f;color:#dce9ef;border-radius:12px;padding:13px 14px;margin-top:14px`)}>
            <div style={css(`font-size:8px;letter-spacing:.5px;text-transform:uppercase;color:#8fb4c6;font-weight:600;margin-bottom:6px`)}>⚑ Héritage</div>
            <div style={css(`font-size:12.5px;line-height:1.6`)}>{v.sc2.legacy}</div>
          </div>

          { v.sc2.hasNote ? (<>
          <div style={css(`background:#f7ece8;color:#7a3b28;border-radius:10px;padding:10px 13px;margin-top:8px;font-size:11px;line-height:1.5`)}>⚠︎ {v.sc2.note}</div>
          </>) : null }

          <div onClick={v.sc2.goLink} style={css(`margin-top:14px;text-align:center;padding:12px;border-radius:11px;background:#0f2c3c;color:#eaf3f7;font-size:12.5px;font-weight:600;cursor:pointer`)}>{v.sc2.linkLabel} →</div>
        </div>
        </>) : null }

      </div>
      </>) : null }

    </div>


    <div style={css(`flex-shrink:0;display:flex;background:#fff;border-top:1px solid #dbe7ec;box-shadow:0 -2px 12px rgba(15,44,60,0.06);padding-bottom:env(safe-area-inset-bottom);z-index:30`)}>
      { (v.bottomCats || []).map((c, __k1) => (<React.Fragment key={__k1}>
        <div onClick={c.open} style={c.style}>
          <div style={c.iconStyle}>{c.icon}</div>
          <div style={c.labelStyle}>{c.label}</div>
        </div>
      </React.Fragment>)) }
    </div>


    <div onClick={v.closeCatSheet} style={v.catScrimStyle}></div>
    <div style={v.catSheetStyle}>
      <div style={css(`padding:16px 18px 10px;display:flex;align-items:center;justify-content:space-between`)}>
        <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#8fb4c6;font-weight:600`)}>{v.catSheetTitle}</div>
        <div onClick={v.closeCatSheet} style={css(`width:26px;height:26px;border-radius:50%;border:1px solid rgba(143,180,198,0.4);display:flex;align-items:center;justify-content:center;font-size:14px;color:#eaf3f7;cursor:pointer`)}>✕</div>
      </div>
      <div style={css(`padding:2px 10px 22px;overflow-y:auto`)}>
        { (v.catSheetItems || []).map((nav, __k1) => (<React.Fragment key={__k1}>
          <div onClick={nav.go} style={nav.style}>
            <div style={nav.iconStyle}>{nav.icon}</div>
            <div style={css(`min-width:0`)}>
              <div style={css(`font-size:13.5px;font-weight:600;color:#eaf3f7;line-height:1.15`)}>{nav.label}</div>
              <div style={css(`font-size:10px;color:#8fb4c6;margin-top:2px`)}>{nav.sub}</div>
            </div>
          </div>
        </React.Fragment>)) }
      </div>
    </div>


    { v.siteOpen ? (<>
    <div onClick={v.closeSite} style={css(`position:absolute;inset:0;background:rgba(8,24,34,0.55);z-index:50`)}></div>
    <div style={css(`position:absolute;left:0;right:0;bottom:0;z-index:51;background:#fff;border-radius:18px 18px 0 0;padding:16px 18px 24px;box-shadow:0 -8px 30px rgba(0,0,0,0.28)`)}>
      <div style={css(`width:40px;height:4px;border-radius:2px;background:#d4e0e6;margin:0 auto 14px`)}></div>
      <div style={css(`display:flex;align-items:center;gap:10px`)}>
        <div style={css(`width:14px;height:14px;border-radius:50%;background:${v.siteColor};border:2px solid #fff;box-shadow:0 0 0 1px #d4e0e6;flex-shrink:0`)}></div>
        <div style={css(`font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:${v.siteColor}`)}>{v.siteCat2}</div>
      </div>
      { v.siteIsUser ? (<>
        <input value={v.siteName} onChange={v.onSiteName} onInput={v.onSiteName} style={css(`width:100%;margin-top:8px;padding:8px 10px;border:1px solid #cfe0e8;border-radius:8px;font-family:'Spectral',serif;font-size:18px;font-weight:600;color:#0f2c3c;outline:none`)} />
        <textarea onChange={v.onSiteDesc} onInput={v.onSiteDesc} placeholder="Décrivez ce site…" style={css(`width:100%;margin-top:8px;padding:9px 11px;border:1px solid #cfe0e8;border-radius:8px;font-family:'IBM Plex Sans',sans-serif;font-size:13px;line-height:1.5;color:#33505f;outline:none;resize:vertical;min-height:64px`)}>{v.siteDesc}</textarea>
      </>) : null }
      { v.siteReadonly ? (<>
        <div style={css(`font-family:'Spectral',serif;font-size:20px;font-weight:700;margin-top:8px;line-height:1.15`)}>{v.siteName}</div>
        <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:11px;color:#6b8898;margin-top:3px`)}>{v.siteRegion} · {v.siteCoords}</div>
        <div style={css(`font-size:13px;line-height:1.6;color:#33505f;margin-top:11px`)}>{v.siteDesc}</div>
      </>) : null }
      <div onClick={v.closeSite} style={css(`margin-top:16px;text-align:center;padding:11px;border-radius:10px;background:#0f2c3c;color:#eaf3f7;font-size:13px;font-weight:600;cursor:pointer`)}>Fermer</div>
    </div>
    </>) : null }

    
    <div onClick={v.closeMenu} style={v.menuScrimStyle}></div>
    <div style={v.menuPanelStyle}>
      <div style={css(`padding:20px 18px 16px;border-bottom:1px solid rgba(143,180,198,0.2)`)}>
        <div style={css(`font-family:'Spectral',serif;font-size:18px;font-weight:600;color:#eaf3f7`)}>Paléoclimat</div>
        <div style={css(`font-size:9.5px;letter-spacing:1.4px;text-transform:uppercase;color:#8fb4c6;margin-top:4px`)}>Archives du climat terrestre</div>
      </div>
      <div style={css(`flex:1;padding:10px 10px;overflow-y:auto`)}>
        { (v.navGroups || []).map((grp, __k1) => (<React.Fragment key={__k1}>
          <div style={css(`padding:14px 8px 6px 11px;font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:#5f829a;font-weight:600`)}>{grp.title}</div>
          { (grp.items || []).map((nav, __k2) => (<React.Fragment key={__k2}>
            <div onClick={nav.go} style={nav.style}>
              <div style={nav.iconStyle}>{nav.icon}</div>
              <div style={css(`min-width:0`)}>
                <div style={css(`font-size:13.5px;font-weight:600;color:#eaf3f7;line-height:1.15`)}>{nav.label}</div>
                <div style={css(`font-size:10px;color:#8fb4c6;margin-top:2px`)}>{nav.sub}</div>
              </div>
            </div>
          </React.Fragment>)) }
        </React.Fragment>)) }
      </div>
      <div style={css(`padding:14px 18px;border-top:1px solid rgba(143,180,198,0.2);display:flex;align-items:center;gap:8px`)}>
        <div style={css(`width:7px;height:7px;border-radius:50%;background:#5ecfa6`)}></div>
        <div style={css(`font-size:10.5px;color:#8fb4c6`)}>Disponible hors-ligne · PWA</div>
      </div>
    </div>

    
    <div onClick={v.closeHelp} style={v.helpScrimStyle}></div>
    <div style={v.helpSheetStyle}>
      <div style={css(`flex-shrink:0;padding:16px 18px 12px;border-bottom:1px solid #e8eef1;display:flex;align-items:flex-start;justify-content:space-between;gap:12px`)}>
        <div>
          <div style={css(`font-size:9px;letter-spacing:1.4px;text-transform:uppercase;color:#8aa5b3;font-weight:600`)}>Aide · cet écran</div>
          <div style={css(`font-family:'Spectral',serif;font-size:19px;font-weight:600;color:#0f2c3c;line-height:1.15;margin-top:3px`)}>{v.helpTitle}</div>
        </div>
        <div onClick={v.closeHelp} style={css(`width:30px;height:30px;flex-shrink:0;border-radius:50%;background:#eef4f7;display:flex;align-items:center;justify-content:center;font-size:16px;color:#4d6c7d;cursor:pointer`)}>✕</div>
      </div>
      <div style={css(`flex:1;overflow-y:auto;padding:16px 18px 26px`)}>
        <div style={css(`border-left:3px solid #2f7ca0;background:#eef4f7;border-radius:0 12px 12px 0;padding:12px 14px;margin-bottom:16px`)}>
          <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:1.2px;text-transform:uppercase;color:#2f7ca0;font-weight:600`)}>Pourquoi cet écran</div>
          <div style={css(`font-size:13px;line-height:1.6;color:#33505f;margin-top:6px`)}>{v.helpWhy}</div>
        </div>
        <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:1.2px;text-transform:uppercase;color:#8aa5b3;font-weight:600;margin-bottom:9px`)}>Repères & astuces</div>
        { (v.helpTips || []).map((tip, __k1) => (<React.Fragment key={__k1}>
          <div style={css(`display:flex;gap:10px;margin-bottom:10px;align-items:flex-start`)}>
            <div style={css(`width:6px;height:6px;border-radius:50%;background:#6fb2d1;margin-top:6px;flex-shrink:0`)}></div>
            <div style={css(`font-size:12.5px;line-height:1.55;color:#33505f`)}>{tip}</div>
          </div>
        </React.Fragment>)) }
      </div>
    </div>

    
    { v.evtOpen ? (<>
    <div onClick={v.closeEvt} style={css(`position:absolute;inset:0;background:rgba(8,24,34,0.55);z-index:50`)}></div>
    <div style={css(`position:absolute;left:0;right:0;bottom:0;z-index:51;background:#fff;border-radius:18px 18px 0 0;padding:16px 18px 24px;box-shadow:0 -8px 30px rgba(0,0,0,0.28)`)}>
      <div style={css(`width:40px;height:4px;border-radius:2px;background:#d4e0e6;margin:0 auto 14px`)}></div>
      <div style={css(`display:inline-block;font-family:'IBM Plex Mono',monospace;font-size:8.5px;letter-spacing:.6px;text-transform:uppercase;color:#fff;background:${v.evtColor};padding:3px 9px;border-radius:20px`)}>{v.evtCat}</div>
      <div style={css(`font-family:'Spectral',serif;font-size:19px;font-weight:600;margin-top:9px;line-height:1.2`)}>{v.evtTitle}</div>
      <div style={css(`font-family:'IBM Plex Mono',monospace;font-size:11px;color:#6b8898;margin-top:4px`)}>Il y a {v.evtAgeTxt}</div>
      <div style={css(`font-size:13px;line-height:1.6;color:#33505f;margin-top:11px`)}>{v.evtBody}</div>
      <div onClick={v.closeEvt} style={css(`margin-top:16px;text-align:center;padding:11px;border-radius:10px;background:#0f2c3c;color:#eaf3f7;font-size:13px;font-weight:600;cursor:pointer`)}>Fermer</div>
    </div>
    </>) : null }

  </div>

  )
}
