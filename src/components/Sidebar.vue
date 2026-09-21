<script setup>
defineProps({ open: Boolean })
defineEmits(['close'])
</script>

<template>
  <div
    v-if="open"
    @click="$emit('close')"
    class="fixed inset-0 bg-black/50 z-30 md:hidden"
  ></div>

  <aside
    :class="open ? 'translate-x-0' : '-translate-x-full'"
    class="fixed inset-y-0 left-0 z-40 w-64 shrink-0 bg-gray-800 text-white p-4 transition-transform duration-200 md:static md:translate-x-0 md:min-h-screen"
  >
    <h2 class="text-xl font-bold mb-6">Admin Panel</h2>

    <nav class="flex flex-col gap-2">
      <RouterLink
        to="/"
        @click="$emit('close')"
        class="px-3 py-2 rounded hover:bg-gray-700"
        exact-active-class="bg-gray-700"
      >
        Dashboard
      </RouterLink>

      <RouterLink
        to="/products"
        @click="$emit('close')"
        class="px-3 py-2 rounded hover:bg-gray-700"
        exact-active-class="bg-gray-700"
      >
        Master Produk
      </RouterLink>

      <RouterLink
        to="/transactions"
        @click="$emit('close')"
        class="px-3 py-2 rounded hover:bg-gray-700"
        exact-active-class="bg-gray-700"
      >
        Transaksi
      </RouterLink>
    </nav>
  </aside>
</template>