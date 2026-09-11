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
  published?: boolean
  is_headline?: boolean
  view_count?: number
}

export const KATEGORI_LABELS: Record<KategoriInfo, string> = {
  pengumuman: "Pengumuman",
  berita: "Berita",
  program: "Program Pemerintah",
  jadwal: "Jadwal Pelayanan",
  kesehatan: "Kesehatan",
  pendidikan: "Pendidikan",
}

export const FOTO_PRESETS = [
  {
    label: "Pelayanan Administrasi & Kantor Camat",
    url: "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=70&w=720&auto=format&fit=crop",
    kategori: "jadwal",
  },
  {
    label: "Musrenbang & Rapat Koordinasi Kecamatan",
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=70&w=720&auto=format&fit=crop",
    kategori: "pengumuman",
  },
  {
    label: "Penyaluran Bantuan Sosial & BLT",
    url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=70&w=720&auto=format&fit=crop",
    kategori: "program",
  },
  {
    label: "Posyandu & Pelayanan Kesehatan",
    url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=70&w=720&auto=format&fit=crop",
    kategori: "kesehatan",
  },
  {
    label: "Gotong Royong & Lingkungan Pesisir",
    url: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?q=70&w=720&auto=format&fit=crop",
    kategori: "berita",
  },
  {
    label: "Pendidikan & Beasiswa Siswa",
    url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=70&w=720&auto=format&fit=crop",
    kategori: "pendidikan",
  },
]

export const INFORMASI_DATA: Informasi[] = [
  {
    id: "I001",
    slug: "musyawarah-perencanaan-pembangunan-2026",
    kategori: "pengumuman",
    judul: "Undangan Musyawarah Perencanaan Pembangunan Kecamatan 2026",
    ringkasan: "Seluruh kepala desa dan tokoh masyarakat diundang hadir dalam Musrenbang Kecamatan Temiang Pesisir.",
    isi: `Bersama ini kami mengundang seluruh kepala desa, tokoh masyarakat, dan perwakilan warga untuk hadir dalam:

**Musyawarah Perencanaan Pembangunan (Musrenbang) Kecamatan Temiang Pesisir Tahun 2026**

**Hari/Tanggal:** Rabu, 10 September 2026
**Waktu:** 08.30 WIB — selesai
**Tempat:** Aula Kantor Kecamatan Temiang Pesisir (Desa Tajur Biru)

Agenda:
1. Pembukaan resmi oleh Camat Temiang Pesisir (HENDRA, S.STP)
2. Paparan usulan pembangunan dari masing-masing desa binaan (Desa Tajur Biru, Desa Temiang, dan Desa Pulau Batang)
3. Sinkronisasi usulan prioritas sarana prasarana perikanan, sanitasi air bersih, dan kelistrikan pesisir
4. Penetapan dokumen usulan prioritas kecamatan untuk diajukan ke Bapelitbang Kabupaten Lingga

Kehadiran Bapak/Ibu sangat kami harapkan demi kemajuan pembangunan wilayah kepulauan Temiang Pesisir.`,
    tanggal: "2026-08-20",
    penulis: "Sekretariat Kecamatan",
    gambar: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=70&w=720&auto=format&fit=crop",
    published: true,
    is_headline: true,
    view_count: 342,
  },
  {
    id: "I002",
    slug: "program-bantuan-langsung-tunai-2026",
    kategori: "program",
    judul: "Informasi Penyaluran Bantuan Langsung Tunai (BLT) 2026",
    ringkasan: "Jadwal dan syarat penyaluran BLT untuk warga kurang mampu di Kecamatan Temiang Pesisir.",
    isi: `Penyaluran Bantuan Langsung Tunai (BLT) Dana Desa Tahun 2026 akan dilaksanakan melalui kantor desa masing-masing dengan pengawasan tim verifikator kecamatan.

**Jadwal Penyaluran:**
- **Desa Tajur Biru:** Senin, 8 September 2026 (Kantor Desa Tajur Biru)
- **Desa Temiang:** Selasa, 9 September 2026 (Gedung Serbaguna Temiang)
- **Desa Pulau Batang:** Kamis, 11 September 2026 (Balai Pertemuan Warga Pulau Batang)

**Syarat Pengambilan:**
- KTP-el asli dan fotokopi
- Kartu Keluarga (KK) asli dan fotokopi
- Surat undangan resmi penerima dari Pemerintah Desa

Bagi warga lansia atau sakit yang berhalangan hadir langsung ke lokasi, petugas didampingi aparatur desa akan melakukan kunjungan jemput bola ke rumah warga.`,
    tanggal: "2026-08-25",
    penulis: "Kasi Kesejahteraan Sosial",
    gambar: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=70&w=720&auto=format&fit=crop",
    published: true,
    is_headline: true,
    view_count: 512,
  },
  {
    id: "I003",
    slug: "jadwal-pelayanan-kecamatan-2026",
    kategori: "jadwal",
    judul: "Jadwal Pelayanan Terpadu Paten Kecamatan Temiang Pesisir",
    ringkasan: "Jam dan hari pelayanan resmi administrasi serta perekaman KTP-el untuk masyarakat.",
    isi: `Kecamatan Temiang Pesisir berkomitmen memberikan pelayanan prima bagi seluruh warga di 3 desa wilayah pulau. Jadwal pelayanan resmi kantor kecamatan:

**Hari Senin — Kamis:** 08.00 — 16.00 WIB
**Hari Jumat:** 08.00 — 11.30 WIB (Istirahat Shalat Jumat)
**Sabtu — Minggu & Libur Nasional:** Tutup

**Layanan yang tersedia di Loket Terpadu:**
- Perekaman dan pencetakan KTP-el serta pengantar KK
- Legalisasi dan surat keterangan dispensasi nikah
- Rekomendasi BBM Bersubsidi Nelayan (JBKP/JBT)
- Verifikasi rekomendasi pencairan Dana Desa & ADD
- Konsultasi dan pelaporan aspirasi pengaduan warga

Seluruh pelayanan administrasi di Kantor Camat Temiang Pesisir bebas pungutan biaya (GRATIS).`,
    tanggal: "2026-08-28",
    penulis: "Admin Pelayanan",
    gambar: "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=70&w=720&auto=format&fit=crop",
    published: true,
    is_headline: true,
    view_count: 678,
  },
  {
    id: "I004",
    slug: "gotong-royong-kebersihan-pesisir-2026",
    kategori: "berita",
    judul: "Gotong Royong Massal Kebersihan Pesisir Pantai & Dermaga",
    ringkasan: "Aparatur kecamatan bersama warga dan nelayan bersihkan pesisir pantai serentak di 3 desa.",
    isi: `Dalam rangka menjaga kelestarian ekosistem bahari dan kebersihan lingkungan pesisir, Pemerintah Kecamatan Temiang Pesisir menggelar aksi gotong royong massal di sepanjang pesisir pantai dan dermaga pelabuhan.

Kegiatan ini dipimpin langsung oleh Camat Temiang Pesisir dan diikuti oleh jajaran aparatur kecamatan, perangkat desa, Babinsa, Bhabinkamtibmas, serta ratusan warga lokal.

Fokus kegiatan meliputi pengumpulan sampah plastik di pesisir dermaga Desa Tajur Biru, perbaikan jembatan tambatan perahu nelayan di Desa Temiang, serta pembersihan saluran air drainase di Pulau Batang.

"Kebersihan pesisir adalah cerminan martabat kepulauan kita. Semangat gotong royong ini harus senantiasa kita jaga bersama," tegas Camat HENDRA, S.STP dalam sambutannya.`,
    tanggal: "2026-08-29",
    penulis: "Humas Kecamatan",
    gambar: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?q=70&w=720&auto=format&fit=crop",
    published: true,
    is_headline: true,
    view_count: 420,
  },
  {
    id: "I005",
    slug: "kegiatan-posyandu-september-2026",
    kategori: "kesehatan",
    judul: "Jadwal Posyandu Balita dan Lansia September 2026",
    ringkasan: "Pelaksanaan Posyandu Balita dan Lansia se-Kecamatan Temiang Pesisir bulan September 2026.",
    isi: `Posyandu Balita dan Lansia se-Kecamatan Temiang Pesisir bulan September 2026 dilaksanakan bekerjasama dengan Puskesmas dan kader PKK desa:

**Jadwal Kegiatan Posyandu:**
- **Desa Tajur Biru:** Selasa, 2 September 2026 (Pustu Tajur Biru)
- **Desa Temiang:** Kamis, 4 September 2026 (Poskesdes Temiang)
- **Desa Pulau Batang:** Sabtu, 6 September 2026 (Balai Warga Pulau Batang)

**Layanan yang tersedia:**
✓ Penimbangan berat badan & pengukuran tinggi balita (Pencegahan Stunting)
✓ Imunisasi dasar lengkap balita
✓ Pemeriksaan tensi darah dan gula darah gratis untuk lansia
✓ Konsultasi gizi ibu hamil & pemberian makanan tambahan (PMT)
✓ Pembagian vitamin A dan obat-obatan esensial

Bawa buku KIA/KMS saat berkunjung ke posyandu.`,
    tanggal: "2026-08-27",
    penulis: "Petugas Kesehatan Kecamatan",
    gambar: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=70&w=720&auto=format&fit=crop",
    published: true,
    is_headline: false,
    view_count: 289,
  },
  {
    id: "I006",
    slug: "penerimaan-siswa-baru-smp-2026",
    kategori: "pendidikan",
    judul: "Informasi Program Beasiswa Pelajar Berprestasi Kepulauan 2026",
    ringkasan: "Pemerintah daerah membuka pendaftaran beasiswa dan bantuan transportasi sekolah antar-pulau.",
    isi: `Pemerintah Kabupaten Lingga bersama Pemerintah Kecamatan Temiang Pesisir membuka pendaftaran Program Beasiswa Pelajar Berprestasi dan Subsidi Transportasi Laut bagi siswa yang menempuh pendidikan antar-pulau:

**Periode Pendaftaran:** 1 — 20 September 2026

**Persyaratan Dokumen:**
- Surat keterangan aktif sekolah dari kepala sekolah bersangkutan
- Salinan rapor semester terakhir dengan nilai rata-rata memuaskan
- Fotokopi KK & KTP orang tua berdomisili sah di Kecamatan Temiang Pesisir
- Surat rekomendasi dari Kepala Desa setempat

Pengumpulan berkas dapat diserahkan langsung ke Bagian Kesejahteraan Sosial Kantor Camat Temiang Pesisir setiap jam kerja.`,
    tanggal: "2026-08-26",
    penulis: "Kecamatan Temiang Pesisir",
    gambar: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=70&w=720&auto=format&fit=crop",
    published: true,
    is_headline: false,
    view_count: 310,
  },
]

