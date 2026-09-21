<script setup>
import { ref, computed } from 'vue'
import { products, transactions } from '../services/dataStore'

const form = ref({ produk_id: '', qty: 1 })
const errorMessage = ref('')

const produkDipilih = computed(() =>
  products.value.find((p) => p.id === form.value.produk_id)
)

const totalHarga = computed(() => {
  if (!produkDipilih.value || !form.value.qty) return 0
  return produkDipilih.value.harga * form.value.qty
})

const riwayat = computed(() => [...transactions.value].reverse())

function formatRupiah(angka) {
  return 'Rp ' + angka.toLocaleString('id-ID')
}

function simpanTransaksi() {
  const produk = produkDipilih.value
  const qty = form.value.qty

  if (!produk) {
    errorMessage.value = 'Pilih produk terlebih dahulu'
    return
  }

  if (!Number.isInteger(qty) || qty < 1) {
    errorMessage.value = 'Qty harus berupa angka bulat minimal 1'
    return
  }

  if (qty > produk.stok) {
    errorMessage.value = `Stok tidak cukup. Stok tersedia: ${produk.stok}`
    return
  }

  const idBaru = transactions.value.length
    ? Math.max(...transactions.value.map((t) => t.id)) + 1
    : 1

  transactions.value.push({
    id: idBaru,
    tanggal_transaksi: new Date().toISOString().slice(0, 10),
    produk_id: produk.id,
    nama_produk: produk.nama_produk,
    qty,
    total_harga: totalHarga.value,
  })

  produk.stok -= qty

  form.value = { produk_id: '', qty: 1 }
  errorMessage.value = ''
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Transaksi</h1>

    <form
      @submit.prevent="simpanTransaksi"
      class="bg-white rounded-lg shadow p-4 mb-6"
    >
      <h2 class="font-semibold mb-3">Tambah Transaksi</h2>

      <p v-if="errorMessage" class="text-red-500 text-sm mb-3">
        {{ errorMessage }}
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block mb-1 text-sm font-medium">Produk</label>
          <select v-model="form.produk_id" class="w-full border rounded px-3 py-2">
            <option value="" disabled>-- Pilih produk --</option>
            <option
              v-for="p in products"
              :key="p.id"
              :value="p.id"
              :disabled="p.stok === 0"
            >
              {{ p.nama_produk }} (stok: {{ p.stok }})
            </option>
          </select>
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Qty</label>
          <input
            v-model.number="form.qty"
            type="number"
            min="1"
            class="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Total Harga</label>
          <div class="w-full border rounded px-3 py-2 bg-gray-50 font-semibold">
            {{ formatRupiah(totalHarga) }}
          </div>
        </div>
      </div>

      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Simpan Transaksi
      </button>
    </form>

    <div class="bg-white rounded-lg shadow overflow-x-auto">
      <h2 class="font-semibold p-4 pb-0">Riwayat Transaksi</h2>

      <table class="w-full text-left">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-4 py-3">No</th>
            <th class="px-4 py-3">Tanggal</th>
            <th class="px-4 py-3">Produk</th>
            <th class="px-4 py-3">Qty</th>
            <th class="px-4 py-3">Total Harga</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(t, index) in riwayat" :key="t.id" class="border-b">
            <td class="px-4 py-3">{{ index + 1 }}</td>
            <td class="px-4 py-3">{{ t.tanggal_transaksi }}</td>
            <td class="px-4 py-3">{{ t.nama_produk }}</td>
            <td class="px-4 py-3">{{ t.qty }}</td>
            <td class="px-4 py-3">{{ formatRupiah(t.total_harga) }}</td>
          </tr>

          <tr v-if="transactions.length === 0">
            <td colspan="5" class="px-4 py-6 text-center text-gray-500">
              Belum ada transaksi
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>