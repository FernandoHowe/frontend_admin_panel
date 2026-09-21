<script setup>
import { ref, computed, watch } from 'vue'
import { products, transactions } from '../services/dataStore'
import { showToast } from '../services/toast'

const form = ref({ produk_id: '', qty: 1 })
const errorMessage = ref('')
const editId = ref(null)

const produkDipilih = computed(() =>
  products.value.find((p) => p.id === form.value.produk_id)
)

const totalHarga = computed(() => {
  if (!produkDipilih.value || !form.value.qty) return 0
  return produkDipilih.value.harga * form.value.qty
})

const riwayat = computed(() => [...transactions.value].reverse())
const keyword = ref('')

const filteredRiwayat = computed(() => {
  const k = keyword.value.trim().toLowerCase()
  return riwayat.value.filter(
    (t) =>
      t.nama_produk.toLowerCase().includes(k) ||
      t.tanggal_transaksi.includes(k)
  )
})

const perPage = 5
const currentPage = ref(1)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredRiwayat.value.length / perPage))
)

const pagedRiwayat = computed(() => {
  const awal = (currentPage.value - 1) * perPage
  return filteredRiwayat.value.slice(awal, awal + perPage)
})

watch(keyword, () => {
  currentPage.value = 1
})

watch(totalPages, (baru) => {
  if (currentPage.value > baru) currentPage.value = baru
})

function formatRupiah(angka) {
  return 'Rp ' + angka.toLocaleString('id-ID')
}

function resetForm() {
  form.value = { produk_id: '', qty: 1 }
  editId.value = null
  errorMessage.value = ''
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

  const transaksiLama = editId.value
    ? transactions.value.find((t) => t.id === editId.value)
    : null

  const stokTersedia =
    produk.stok +
    (transaksiLama && transaksiLama.produk_id === produk.id ? transaksiLama.qty : 0)

  if (qty > stokTersedia) {
    errorMessage.value = `Stok tidak cukup. Stok tersedia: ${stokTersedia}`
    showToast(`Stok tidak cukup. Stok tersedia: ${stokTersedia}`, 'error')
    return
  }

  if (transaksiLama) {
    const produkLama = products.value.find((p) => p.id === transaksiLama.produk_id)
    if (produkLama) produkLama.stok += transaksiLama.qty

    transaksiLama.produk_id = produk.id
    transaksiLama.nama_produk = produk.nama_produk
    transaksiLama.qty = qty
    transaksiLama.total_harga = totalHarga.value

    produk.stok -= qty
    showToast('Transaksi berhasil diperbarui')
  } else {
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
    currentPage.value = 1
    keyword.value = ''
    showToast('Transaksi berhasil disimpan')
  }

  resetForm()
}

function editTransaksi(t) {
  form.value = { produk_id: t.produk_id, qty: t.qty }
  editId.value = t.id
  errorMessage.value = ''
}

function hapusTransaksi(id) {
  if (confirm('Yakin ingin menghapus transaksi ini?')) {
    const t = transactions.value.find((item) => item.id === id)
    const produk = products.value.find((p) => p.id === t.produk_id)
    if (produk) produk.stok += t.qty

    transactions.value = transactions.value.filter((item) => item.id !== id)
    if (editId.value === id) resetForm()
    showToast('Transaksi berhasil dihapus')
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Transaksi</h1>

    <form
      @submit.prevent="simpanTransaksi"
      class="bg-white rounded-lg shadow p-4 mb-6"
    >
      <h2 class="font-semibold mb-3">
        {{ editId ? 'Edit Transaksi' : 'Tambah Transaksi' }}
      </h2>

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
              :disabled="p.stok === 0 && p.id !== form.produk_id"
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

      <div class="flex gap-2">
        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {{ editId ? 'Simpan Perubahan' : 'Simpan Transaksi' }}
        </button>

        <button
          v-if="editId"
          type="button"
          @click="resetForm"
          class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Batal
        </button>
      </div>
    </form>

    <input
      v-model="keyword"
      type="text"
      placeholder="Cari produk atau tanggal (contoh: 2026-09-21)..."
      class="w-full md:w-96 border rounded px-3 py-2 mb-4 bg-white"
    />

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
            <th class="px-4 py-3">Aksi</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(t, index) in pagedRiwayat" :key="t.id" class="border-b">
            <td class="px-4 py-3">{{ (currentPage - 1) * perPage + index + 1 }}</td>
            <td class="px-4 py-3">{{ t.tanggal_transaksi }}</td>
            <td class="px-4 py-3">{{ t.nama_produk }}</td>
            <td class="px-4 py-3">{{ t.qty }}</td>
            <td class="px-4 py-3">{{ formatRupiah(t.total_harga) }}</td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <button
                  @click="editTransaksi(t)"
                  class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  @click="hapusTransaksi(t.id)"
                  class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Hapus
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="filteredRiwayat.length === 0">
            <td colspan="6" class="px-4 py-6 text-center text-gray-500">
              {{ keyword ? 'Transaksi tidak ditemukan' : 'Belum ada transaksi' }}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 p-4">
        <p class="text-sm text-gray-500">
          Menampilkan
          {{ filteredRiwayat.length ? (currentPage - 1) * perPage + 1 : 0 }}-{{ Math.min(currentPage * perPage, filteredRiwayat.length) }}
          dari {{ filteredRiwayat.length }} transaksi
        </p>

        <div class="flex items-center gap-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sebelumnya
          </button>

          <span class="text-sm">Halaman {{ currentPage }} dari {{ totalPages }}</span>

          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  </div>
</template>