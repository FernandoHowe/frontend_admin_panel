<script setup>
import { useRouter } from 'vue-router'

defineEmits(['toggle-sidebar'])

const router = useRouter()

function logout() {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<template>
  <header class="bg-white shadow px-6 py-4 flex justify-between items-center">
    <div class="flex items-center gap-3">
      <button
        @click="$emit('toggle-sidebar')"
        class="md:hidden text-2xl leading-none"
        aria-label="Buka menu"
      >
        ☰
      </button>
      <h1 class="font-semibold">Manajemen Penjualan</h1>
    </div>

    <button
      @click="logout"
      class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Logout
    </button>
  </header>
</template>