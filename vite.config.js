import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'lit-vendor': ['lit', 'lit-element-state'],
          'router-vendor': ['@vaadin/router'],
          'ui-vendor': ['@floating-ui/dom', 'cropperjs']
        }
      }
    }
  },
  plugins: [VitePWA({
    registerType: 'prompt',
    injectRegister: false,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'Wishlist Website - Free Online Wishlist Maker',
      short_name: 'Wishlist Website',
      description: 'Create and share wishlists for birthdays, Christmas, weddings and more. Free online wishlist maker with group sharing, gift coordination, privacy controls, and Amazon import. Perfect for families, couples, and event planning.',
      theme_color: '#4f46e5',
      background_color: '#ffffff',
      categories: ['lifestyle', 'shopping', 'social'],
      lang: 'en-US',
      share_target: {
        action: '/add-item',
        method: 'GET',
        params: {
          title: 'title',
          text: 'text',
          url: 'url'
        }
      }
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
})

