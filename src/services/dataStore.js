import { ref } from 'vue'

export const products = ref([
  { id: 1, nama_produk: 'Kopi Arabika 250g', harga: 55000, stok: 20, created_at: '2026-09-01' },
  { id: 2, nama_produk: 'Teh Hijau 100g', harga: 32000, stok: 35, created_at: '2026-09-03' },
  { id: 3, nama_produk: 'Gula Aren 500g', harga: 28000, stok: 12, created_at: '2026-09-10' },
])

export const transactions = ref([])