<script setup>
import { toasts, removeToast } from '../services/toast'
</script>

<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
    <div
      v-for="t in toasts"
      :key="t.id"
      :class="t.type === 'success' ? 'bg-green-600' : 'bg-red-600'"
      class="text-white px-4 py-3 rounded shadow-lg flex items-center gap-3 min-w-64"
    >
      <span class="flex-1">{{ t.message }}</span>
      <button @click="removeToast(t.id)" class="text-xl leading-none">×</button>
    </div>
  </div>
</template>