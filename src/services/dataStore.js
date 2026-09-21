import { ref } from 'vue'

const namaProduk = ['Kopi Arabika', 'Teh Hijau', 'Gula Aren', 'Susu Bubuk', 'Roti Tawar', 'Mie Instan', 'Keripik Singkong', 'Coklat Batang', 'Madu Hutan', 'Sirup Markisa']
const hargaProduk = [55000, 32000, 28000, 45000, 18000, 3500, 15000, 22000, 75000, 30000]
const stokProduk = [20, 35, 12, 50, 8, 100, 0, 25, 15, 40]

const ukuranProduk = ['100g', '250g', '500g']
const pengaliHarga = [1, 2, 4]

const jumlah = namaProduk.length * ukuranProduk.length
const hariIni = new Date().toISOString().slice(0, 10)
const dataAwal = []

for (let i = 0; i < jumlah; i++) {
  const posisiNama = i % namaProduk.length
  const posisiUkuran = Math.floor(i / namaProduk.length)

  dataAwal.push({
    id: i + 1,
    nama_produk: `${namaProduk[posisiNama]} ${ukuranProduk[posisiUkuran]}`,
    harga: hargaProduk[posisiNama] * pengaliHarga[posisiUkuran],
    stok: stokProduk[posisiNama],
    created_at: hariIni,
  })
}

export const products = ref(dataAwal)
export const transactions = ref([])