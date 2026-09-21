<script setup>
import { computed } from 'vue'
import { products, transactions } from '../services/dataStore'

const totalProduk = computed(() => products.value.length)
const totalTransaksi = computed(() => transactions.value.length)
const totalPendapatan = computed(() =>
  transactions.value.reduce((jumlah, t) => jumlah + t.total_harga, 0)
)

function formatRupiah(angka) {
  return 'Rp ' + angka.toLocaleString('id-ID')
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm text-gray-500">Total Produk</p>
        <p class="text-3xl font-bold mt-2">{{ totalProduk }}</p>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm text-gray-500">Total Transaksi</p>
        <p class="text-3xl font-bold mt-2">{{ totalTransaksi }}</p>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm text-gray-500">Total Pendapatan</p>
        <p class="text-3xl font-bold mt-2">{{ formatRupiah(totalPendapatan) }}</p>
      </div>
    </div>
  </div>
</template>