export type KategoriInfo = "pengumuman" | "berita" | "program" | "jadwal" | "kesehatan" | "pendidikan"

export type Informasi = {
  id: string
  slug: string
  kategori: KategoriInfo
  judul: string
  ringkasan: string
  isi: string
  tanggal: string
  penulis: string
  gambar?: string
}

export const INFORMASI_DATA: Informasi[] = [
  {
    id: "I001",
    slug: "jadwal-pelayanan-kecamatan-2026",
    kategori: "jadwal",
    judul: "Jadwal Pelayanan Kecamatan Temiang Pesisir",
    ringkasan: "Jam dan hari pelayanan resmi Kecamatan Temiang Pesisir untuk masyarakat.",
    isi: `Kecamatan Temiang Pesisir melayani masyarakat pada jam kerja resmi sebagai berikut:

**Hari Senin — Kamis:** 08.00 — 16.00 WIB
**Hari Jumat:** 08.00 — 11.30 WIB
**Sabtu — Minggu:** Libur

Pelayanan yang tersedia:
- Surat keterangan dan rekomendasi
- Legalisasi dokumen
- Konsultasi administrasi kependudukan
- Pengajuan dispensasi nikah

Untuk keperluan mendesak, hubungi kantor kecamatan melalui nomor telepon yang tertera.`,
    tanggal: "2026-01-02",
    penulis: "Admin Kecamatan",
  },
  {
    id: "I002",
    slug: "musyawarah-perencanaan-pembangunan-2026",
    kategori: "pengumuman",
    judul: "Undangan Musyawarah Perencanaan Pembangunan Kecamatan 2026",
    ringkasan: "Seluruh kepala desa dan tokoh masyarakat diundang hadir dalam Musrenbang Kecamatan Temiang Pesisir.",
    isi: `Bersama ini kami mengundang seluruh kepala desa, tokoh masyarakat, dan perwakilan warga untuk hadir dalam:

**Musyawarah Perencanaan Pembangunan (Musrenbang) Kecamatan Temiang Pesisir Tahun 2026**

**Hari/Tanggal:** Rabu, 10 September 2026
**Waktu:** 08.30 WIB — selesai
**Tempat:** Aula Kantor Kecamatan Temiang Pesisir

Agenda:
1. Pembukaan oleh Camat
2. Paparan usulan pembangunan dari masing-masing desa
3. Prioritisasi usulan
4. Penetapan usulan prioritas kecamatan

Kehadiran Bapak/Ibu sangat kami harapkan. Konfirmasi kehadiran kepada sekretariat kecamatan.`,
    tanggal: "2026-08-20",
    penulis: "Sekretariat Kecamatan",
  },
  {
    id: "I003",
    slug: "program-bantuan-langsung-tunai-2026",
    kategori: "program",
    judul: "Informasi Penyaluran Bantuan Langsung Tunai (BLT) 2026",
    ringkasan: "Jadwal dan syarat penyaluran BLT untuk warga kurang mampu di Kecamatan Temiang Pesisir.",
    isi: `Penyaluran Bantuan Langsung Tunai (BLT) Tahun 2026 akan dilaksanakan melalui kantor desa masing-masing.

**Jadwal Penyaluran:**
- Desa Temiang: Selasa, 5 September 2026
- Desa Pasir Panjang: Rabu, 6 September 2026
- Desa Duara: Kamis, 7 September 2026
- Desa Sungai Buluh: Jumat, 8 September 2026
- Desa Penuba & Penuba Timur: Senin, 11 September 2026
- Desa Berindat & Air Glubi: Selasa, 12 September 2026

**Syarat Pengambilan:**
- KTP asli dan fotokopi
- KK asli dan fotokopi
- Surat keterangan dari kepala desa (bagi penerima baru)

Informasi lebih lanjut hubungi kantor desa masing-masing.`,
    tanggal: "2026-08-25",
    penulis: "Kasi Kesejahteraan Sosial",
  },
  {
    id: "I004",
    slug: "kegiatan-posyandu-september-2026",
    kategori: "kesehatan",
    judul: "Jadwal Posyandu Balita dan Lansia September 2026",
    ringkasan: "Pelaksanaan Posyandu Balita dan Lansia se-Kecamatan Temiang Pesisir bulan September 2026.",
    isi: `Posyandu Balita dan Lansia se-Kecamatan Temiang Pesisir bulan September 2026 dilaksanakan sesuai jadwal berikut:

**Posyandu Balita:**
- Desa Temiang: Selasa, 3 September 2026 pukul 08.00 WIB
- Desa Pasir Panjang: Kamis, 5 September 2026 pukul 08.00 WIB
- Desa Duara: Selasa, 10 September 2026 pukul 08.00 WIB

**Posyandu Lansia:**
- Semua desa: Minggu ke-3, jadwal menyusul per desa

Layanan yang tersedia:
✓ Penimbangan bayi & balita
✓ Imunisasi
✓ Pemeriksaan tekanan darah (lansia)
✓ Konsultasi gizi
✓ Vitamin A & obat gratis`,
    tanggal: "2026-08-27",
    penulis: "Petugas Kesehatan Kecamatan",
  },
  {
    id: "I005",
    slug: "penerimaan-siswa-baru-smp-2026",
    kategori: "pendidikan",
    judul: "Informasi Penerimaan Siswa Baru SMP/MTs Tahun Ajaran 2026/2027",
    ringkasan: "Pendaftaran siswa baru SMP/MTs di wilayah Kecamatan Temiang Pesisir dibuka mulai awal September.",
    isi: `Pendaftaran siswa baru untuk jenjang SMP/MTs Tahun Ajaran 2026/2027 di wilayah Kecamatan Temiang Pesisir dibuka pada:

**Periode Pendaftaran:** 1 — 15 September 2026

**Persyaratan:**
- Ijazah/SKHUN SD/MI asli dan fotokopi
- Akta kelahiran
- Kartu Keluarga
- Pas foto 3x4 (2 lembar)

Pendaftaran dilakukan langsung ke sekolah tujuan. Warga yang membutuhkan bantuan surat keterangan dari kecamatan dapat menghubungi sekretariat kecamatan pada jam kerja.`,
    tanggal: "2026-08-26",
    penulis: "Kecamatan Temiang Pesisir",
  },
]
