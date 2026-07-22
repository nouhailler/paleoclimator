import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Paléoclim — PWA hors-ligne de paléoclimatologie.
// Le service worker précache tout l'app-shell : aucune dépendance réseau à l'exécution.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/icon-180.png', 'fonts/**/*'],
      manifest: {
        name: 'Paléoclim — Archives du climat terrestre',
        short_name: 'Paléoclim',
        description: "Histoire du climat terrestre sur 4,5 milliards d'années : ères, proxies, espèces, outils d'analyse.",
        lang: 'fr',
        theme_color: '#0c2534',
        background_color: '#eef4f7',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,woff,woff2}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: '/index.html',
      },
    }),
  ],
})
