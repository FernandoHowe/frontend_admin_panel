<script setup>
import { ref } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Navbar from '../components/Navbar.vue'

const sidebarOpen = ref(false)
</script>

<template>
  <div class="flex min-h-screen bg-gray-100">
    <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="flex-1 flex flex-col min-w-0">
      <Navbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>