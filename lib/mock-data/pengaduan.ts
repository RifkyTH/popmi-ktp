export type StatusPengaduan = "masuk" | "verifikasi" | "proses" | "selesai" | "ditolak"
export type KategoriPengaduan = "infrastruktur" | "lingkungan" | "pelayanan" | "sosial" | "keamanan" | "lainnya"

export type Pengaduan = {
  id: string
  tiket: string
  nama: string
  kontak: string
  kategori: KategoriPengaduan
  judul: string
  deskripsi: string
  desa: string
  lokasi?: string
  foto?: string
  tanggalMasuk: string
  tanggalUpdate: string
  status: StatusPengaduan
  petugasTerkait?: string
  responPetugas?: string
  riwayat: {
    status: StatusPengaduan
    oleh: string
    tanggal: string
    catatan?: string
  }[]
}

export const KATEGORI_LABELS: Record<KategoriPengaduan, string> = {
  infrastruktur: "Infrastruktur",
  lingkungan: "Lingkungan",
  pelayanan: "Pelayanan Publik",
  sosial: "Bantuan Sosial",
  keamanan: "Keamanan & Ketertiban",
  lainnya: "Lainnya",
}

export const KATEGORI_COLORS: Record<KategoriPengaduan, string> = {
  infrastruktur: "bg-red-100 text-red-800",
  lingkungan: "bg-green-100 text-green-800",
  pelayanan: "bg-blue-100 text-blue-800",
  sosial: "bg-orange-100 text-orange-800",
  keamanan: "bg-purple-100 text-purple-800",
  lainnya: "bg-gray-100 text-gray-800",
}

export const STATUS_PENGADUAN_LABELS: Record<StatusPengaduan, string> = {
  masuk: "Menunggu Verifikasi",
  verifikasi: "Terverifikasi",
  proses: "Sedang Diproses",
  selesai: "Selesai",
  ditolak: "Ditolak",
}

export const PENGADUAN_DATA: Pengaduan[] = [
  {
    id: "P001",
    tiket: "TP-2026-00121",
    nama: "Maimunah binti Saleh",
    kontak: "08123456789",
    kategori: "infrastruktur",
    judul: "Jalan rusak parah di depan SDN 001 Temiang",
    deskripsi: "Jalan di depan SDN 001 Temiang sudah berlubang besar dan membahayakan warga serta murid sekolah. Kondisi semakin parah setelah hujan lebat minggu lalu.",
    desa: "Temiang",
    lokasi: "Jl. Sekolah, depan SDN 001 Temiang",
    tanggalMasuk: "2026-08-20",
    tanggalUpdate: "2026-08-22",
    status: "proses",
    petugasTerkait: "Reni Wulandari",
    responPetugas: "Laporan telah diteruskan ke Dinas PU untuk penjadwalan perbaikan.",
    riwayat: [
      { status: "masuk", oleh: "Sistem", tanggal: "2026-08-20 10:15", catatan: "Pengaduan diterima" },
      { status: "verifikasi", oleh: "Reni Wulandari", tanggal: "2026-08-21 09:00", catatan: "Telah diverifikasi kebenarannya" },
      { status: "proses", oleh: "Reni Wulandari", tanggal: "2026-08-22 14:00", catatan: "Diteruskan ke Dinas PU Kabupaten" },
    ],
  },
  {
    id: "P002",
    tiket: "TP-2026-00122",
    nama: "Hendri Kurniawan",
    kontak: "08987654321",
    kategori: "lingkungan",
    judul: "Sampah menumpuk di Pantai Pasir Panjang",
    deskripsi: "Sudah lebih dari 2 minggu sampah menumpuk di area Pantai Pasir Panjang, belum ada petugas yang membersihkan. Mohon segera ditangani.",
    desa: "Pasir Panjang",
    lokasi: "Pantai Pasir Panjang",
    tanggalMasuk: "2026-08-22",
    tanggalUpdate: "2026-08-23",
    status: "verifikasi",
    petugasTerkait: "Reni Wulandari",
    riwayat: [
      { status: "masuk", oleh: "Sistem", tanggal: "2026-08-22 08:30", catatan: "Pengaduan diterima" },
      { status: "verifikasi", oleh: "Reni Wulandari", tanggal: "2026-08-23 10:00", catatan: "Sedang diverifikasi" },
    ],
  },
  {
    id: "P003",
    tiket: "TP-2026-00123",
    nama: "Siti Aisyah",
    kontak: "08234567890",
    kategori: "pelayanan",
    judul: "Pelayanan KTP lama, tidak ada kepastian",
    deskripsi: "Sudah 3 bulan mengurus KTP di Dukcapil tapi belum selesai dan tidak ada kejelasan kapan jadi. Mohon bantuan dari kecamatan.",
    desa: "Duara",
    tanggalMasuk: "2026-08-24",
    tanggalUpdate: "2026-08-24",
    status: "masuk",
    riwayat: [
      { status: "masuk", oleh: "Sistem", tanggal: "2026-08-24 14:00", catatan: "Pengaduan diterima, menunggu verifikasi" },
    ],
  },
  {
    id: "P004",
    tiket: "TP-2026-00120",
    nama: "Ahmad Basri",
    kontak: "08345678901",
    kategori: "infrastruktur",
    judul: "Lampu penerangan jalan mati di Gg. Manggis",
    deskripsi: "Lampu penerangan jalan di Gang Manggis sudah 1 bulan mati, berbahaya untuk warga yang pulang malam.",
    desa: "Sungai Buluh",
    lokasi: "Gang Manggis, Sungai Buluh",
    tanggalMasuk: "2026-08-18",
    tanggalUpdate: "2026-08-25",
    status: "selesai",
    petugasTerkait: "Reni Wulandari",
    responPetugas: "Lampu telah diperbaiki oleh PLN pada tanggal 25 Agustus 2026.",
    riwayat: [
      { status: "masuk", oleh: "Sistem", tanggal: "2026-08-18 19:00" },
      { status: "verifikasi", oleh: "Reni Wulandari", tanggal: "2026-08-19 08:00" },
      { status: "proses", oleh: "Reni Wulandari", tanggal: "2026-08-20 10:00", catatan: "Koordinasi dengan PLN" },
      { status: "selesai", oleh: "Reni Wulandari", tanggal: "2026-08-25 16:00", catatan: "Lampu sudah diperbaiki PLN" },
    ],
  },
  {
    id: "P005",
    tiket: "TP-2026-00125",
    nama: "Nurhasanah",
    kontak: "08456789012",
    kategori: "sosial",
    judul: "Warga tidak mampu belum dapat bantuan PKH",
    deskripsi: "Ada keluarga Pak Salim yang sangat tidak mampu tapi tidak terdaftar PKH. Mohon dapat dibantu untuk pendataan.",
    desa: "Penuba",
    tanggalMasuk: "2026-08-26",
    tanggalUpdate: "2026-08-26",
    status: "masuk",
    riwayat: [
      { status: "masuk", oleh: "Sistem", tanggal: "2026-08-26 09:00", catatan: "Pengaduan diterima" },
    ],
  },
]
