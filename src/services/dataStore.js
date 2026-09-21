import { ref } from 'vue'

// ===== DATA PRODUK =====
const namaProduk = ['Kopi Arabika', 'Teh Hijau', 'Gula Aren', 'Susu Bubuk', 'Roti Tawar', 'Mie Instan', 'Keripik Singkong', 'Coklat Batang', 'Madu Hutan', 'Sirup Markisa']
const hargaProduk = [55000, 32000, 28000, 45000, 18000, 3500, 15000, 22000, 75000, 30000]
const stokProduk = [20, 35, 12, 50, 8, 100, 0, 25, 15, 40]

const ukuranProduk = ['100g', '250g', '500g']
const pengaliHarga = [1, 2, 4]

const jumlahProduk = namaProduk.length * ukuranProduk.length
const hariIni = new Date().toISOString().slice(0, 10)
const produkAwal = []

for (let i = 0; i < jumlahProduk; i++) {
  const posisiNama = i % namaProduk.length
  const posisiUkuran = Math.floor(i / namaProduk.length)

  produkAwal.push({
    id: i + 1,
    nama_produk: `${namaProduk[posisiNama]} ${ukuranProduk[posisiUkuran]}`,
    harga: hargaProduk[posisiNama] * pengaliHarga[posisiUkuran],
    stok: stokProduk[posisiNama],
    created_at: hariIni,
  })
}

// ===== DATA TRANSAKSI =====
const idProduk = [1, 4, 8, 12, 15, 19, 23, 28]
const qtyTransaksi = [2, 1, 5, 3, 2, 4, 1, 6]
const transaksiAwal = []

for (let i = 0; i < idProduk.length; i++) {
  const produk = produkAwal.find((p) => p.id === idProduk[i])

  transaksiAwal.push({
    id: i + 1,
    tanggal_transaksi: hariIni,
    produk_id: produk.id,
    nama_produk: produk.nama_produk,
    qty: qtyTransaksi[i],
    total_harga: produk.harga * qtyTransaksi[i],
  })
}

export const products = ref(produkAwal)
export const transactions = ref(transaksiAwal)