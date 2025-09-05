import { createApp } from 'vue'
import App from './App.vue'

// Supabase client
import { createClient } from '@supabase/supabase-js'

// Init Supabase client once
const supabaseUrl = 'https://YOUR-PROJECT.supabase.co'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
