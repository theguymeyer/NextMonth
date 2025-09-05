import { createApp } from 'vue'
import App from './App.vue'

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}

// Handle PWA install prompt
let deferredPrompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e
  const btn = document.getElementById('installBtn')
  btn.hidden = false
  btn.onclick = async () => {
    btn.hidden = true
    await deferredPrompt.prompt()
    deferredPrompt = null
  }
})

createApp(App).mount('#app')
