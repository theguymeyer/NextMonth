<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabaseClient' // central client

// reactive state
const session = ref(null)
const email = ref('')
const password = ref('')

const emit = defineEmits(['updateUsername'])

onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  session.value = data.session

  supabase.auth.onAuthStateChange((_event, newSession) => {
    session.value = newSession
    emit('updateUsername', newSession?.user?.email || '')
  })
})

async function signUp() {
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })
  if (error) alert(error.message)
}

async function signIn() {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  if (error) alert(error.message)
}

async function signOut() {
  await supabase.auth.signOut()
}
</script>

<template>
  <section class="card">
    <template v-if="!session">
      <h2>Login / Signup</h2>
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <div class="row">
        <button @click="signIn">Sign in</button>
        <button @click="signUp">Sign up</button>
      </div>
    </template>

    <template v-else>
      <h2>Welcome</h2>
      <p>{{ session.user.email }}</p>
      <button @click="signOut">Sign out</button>
    </template>
  </section>
</template>