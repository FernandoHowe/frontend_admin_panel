import { ref } from 'vue'

export const toasts = ref([])
let nextId = 1

export function showToast(message, type = 'success') {
  const id = nextId++
  toasts.value.push({ id, message, type })
  setTimeout(() => removeToast(id), 3000)
}

export function removeToast(id) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}