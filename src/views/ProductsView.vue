<script setup>
import { ref } from 'vue'
import { products } from '../services/dataStore.js'

const form = ref({ nama_produk: '', harga: '', stok: '' })
const editId = ref(null)
const errorMessage = ref('')

function formatRupiah(angka) {
  return 'Rp ' + angka.toLocaleString('id-ID')
}

function resetForm() {
  form.value = { nama_produk: '', harga: '', stok: '' }
  editId.value = null
  errorMessage.value = ''
}

function simpanProduk() {
  const { nama_produk, harga, stok } = form.value

  if (!nama_produk.trim() || harga === '' || stok === '' || harga < 0 || stok < 0) {
    errorMessage.value = 'Semua field wajib diisi dan tidak boleh negatif'
    return
  }

  if (editId.value) {
    const produk = products.value.find((p) => p.id === editId.value)
    produk.nama_produk = nama_produk
    produk.harga = harga
    produk.stok = stok
  } else {
    const idBaru = products.value.length
      ? Math.max(...products.value.map((p) => p.id)) + 1
      : 1

    products.value.push({
      id: idBaru,
      nama_produk,
      harga,
      stok,
      created_at: new Date().toISOString().slice(0, 10),
    })
  }

  resetForm()
}

function editProduk(produk) {
  form.value = {
    nama_produk: produk.nama_produk,
    harga: produk.harga,
    stok: produk.stok,
  }
  editId.value = produk.id
  errorMessage.value = ''
}

function hapusProduk(id) {
  if (confirm('Yakin ingin menghapus produk ini?')) {
    products.value = products.value.filter((p) => p.id !== id)
    if (editId.value === id) resetForm()
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Master Produk</h1>

    <form
      @submit.prevent="simpanProduk"
      class="bg-white rounded-lg shadow p-4 mb-6"
    >
      <h2 class="font-semibold mb-3">
        {{ editId ? 'Edit Produk' : 'Tambah Produk' }}
      </h2>

      <p v-if="errorMessage" class="text-red-500 text-sm mb-3">
        {{ errorMessage }}
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block mb-1 text-sm font-medium">Nama Produk</label>
          <input
            v-model="form.nama_produk"
            type="text"
            class="w-full border rounded px-3 py-2"
            placeholder="Contoh: Kopi Robusta"
          />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Harga</label>
          <input
            v-model.number="form.harga"
            type="number"
            min="0"
            class="w-full border rounded px-3 py-2"
            placeholder="50000"
          />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Stok</label>
          <input
            v-model.number="form.stok"
            type="number"
            min="0"
            class="w-full border rounded px-3 py-2"
            placeholder="10"
          />
        </div>
      </div>

      <div class="flex gap-2">
        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {{ editId ? 'Simpan Perubahan' : 'Tambah' }}
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

    <div class="bg-white rounded-lg shadow overflow-x-auto">
      <table class="w-full text-left">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-4 py-3">No</th>
            <th class="px-4 py-3">Nama Produk</th>
            <th class="px-4 py-3">Harga</th>
            <th class="px-4 py-3">Stok</th>
            <th class="px-4 py-3">Dibuat</th>
            <th class="px-4 py-3">Aksi</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(produk, index) in products" :key="produk.id" class="border-b">
            <td class="px-4 py-3">{{ index + 1 }}</td>
            <td class="px-4 py-3">{{ produk.nama_produk }}</td>
            <td class="px-4 py-3">{{ formatRupiah(produk.harga) }}</td>
            <td class="px-4 py-3">{{ produk.stok }}</td>
            <td class="px-4 py-3">{{ produk.created_at }}</td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <button
                  @click="editProduk(produk)"
                  class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  @click="hapusProduk(produk.id)"
                  class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Hapus
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="products.length === 0">
            <td colspan="6" class="px-4 py-6 text-center text-gray-500">
              Belum ada produk
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>