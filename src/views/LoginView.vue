<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref('')

function handleLogin() {
  if (username.value === 'nando' && password.value === '12345') {
    localStorage.setItem('token', 'token-dummy')
    router.push('/')
  } else {
    errorMessage.value = 'Salah coy'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form
      @submit.prevent="handleLogin"
      class="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
    >
      <h1 class="text-2xl font-bold mb-6 text-center">Login Admin</h1>

      <p v-if="errorMessage" class="text-red-500 text-sm mb-4">
        {{ errorMessage }}
      </p>

      <label class="block mb-1 text-sm font-medium">Username</label>
      <input
        v-model="username"
        type="text"
        class="w-full border rounded px-3 py-2 mb-4"
        placeholder="admin"
      />

      <label class="block mb-1 text-sm font-medium">Password</label>
      <input
        v-model="password"
        type="password"
        class="w-full border rounded px-3 py-2 mb-6"
        placeholder="••••••••"
      />

      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Login
      </button>
    </form>
  </div>
</template>