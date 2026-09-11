"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  BookOpen,
  Search,
  FileText,
  MessageSquareWarning,
  Newspaper,
  Settings,
  Users,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Video,
  Image as ImageIcon,
  Sliders,
  Printer,
  QrCode,
  ExternalLink,
  Sparkles,
  Filter,
  Info,
  AlertTriangle,
  Lightbulb,
  Building2,
  MapPin,
  Archive,
  BarChart3,
  UserCheck,
  Lock,
  Layers,
  HelpCircle,
  Clock,
  Compass,
  Check,
  Copy,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Tab Categories
type CategoryKey =
  | "semua"
  | "ringkasan"
  | "peran"
  | "surat"
  | "aduan"
  | "informasi"
  | "hero"
  | "publik"
  | "faq"

interface GuideItem {
  id: string
  category: CategoryKey
  title: string
  subtitle: string
  badge: string
  icon: React.ElementType
  targetRole?: string
  linkHref?: string
  linkLabel?: string
  content: {
    overview: string
    steps?: { title: string; desc: string; tip?: string }[]
    notes?: string[]
    warning?: string
    specifications?: { key: string; value: string }[]
  }
}

const GUIDES_DATA: GuideItem[] = [
  // 1. RINGKASAN
  {
    id: "arsitektur-sistem",
    category: "ringkasan",
    title: "Mengenal Sistem POPMI KTP & Alur Kerja Terpadu",
    subtitle: "Prinsip arsitektur integrasi antara portal warga dan ruang kerja aparatur",
    badge: "Arsitektur Sistem",
    icon: Compass,
    content: {
      overview:
        "POPMI KTP (Portal Pelayanan dan Pengaduan Masyarakat Terpadu Kecamatan Temiang Pesisir) adalah ekosistem digital dua pilar (Public-Facing Portal dan Internal Administration Dashboard) yang dirancang untuk memodernisasi tata kelola administrasi naskah dinas serta transparansi penanganan aspirasi warga di wilayah pesisir dan pulau-pulau Kabupaten Lingga.",
      steps: [
        {
          title: "Pilar 1: Portal Publik (/publik)",
          desc: "Halaman muka ramah warga yang dapat diakses dari smartphone maupun komputer tanpa perlu login. Berisi formulir aduan masyarakat ber-tiket unik, pengecekan progres laporan real-time, peta GIS sebaran titik aduan tiap desa, etalase transparansi statistik, serta Pusat Informasi & Berita resmi kecamatan.",
        },
        {
          title: "Pilar 2: Portal Internal Pegawai (/internal)",
          desc: "Ruang kerja terotentikasi aman khusus aparatur kecamatan. Digunakan untuk manajemen agenda surat masuk/keluar, verifikasi draf surat berjenjang, otorisasi pimpinan dengan QR Code resmi, penerusan disposisi aduan ke lapangan, serta penerbitan rilis berita publik.",
        },
        {
          title: "Jalur Integrasi Data (Zero-Delay)",
          desc: "Setiap laporan yang dikirim warga di portal publik langsung masuk ke antrean verifikasi internal aduan. Begitu petugas menindaklanjuti dan mengunggah foto bukti penyelesaian di internal, warga langsung dapat melihat progresnya di halaman cek tiket publik.",
        },
      ],
      notes: [
        "Aplikasi berjalan di atas arsitektur Next.js Modern dengan penyimpanan basis data terkelola Supabase Cloud.",
        "Sistem menerapkan Role-Based Access Control (RBAC) ketat untuk menjaga integritas data kependudukan dan kerahasiaan naskah dinas.",
      ],
    },
  },

  // 2. PERAN
  {
    id: "panduan-peran",
    category: "peran",
    title: "Matriks Kewenangan & Tanggung Jawab Sesuai Jabatan (Role)",
    subtitle: "Daftar hak akses dan tugas pokok masing-masing akun pengguna di sistem",
    badge: "Manajemen Akun",
    icon: Users,
    linkHref: "/internal/pengguna",
    linkLabel: "Buka Manajemen Pengguna",
    content: {
      overview:
        "Setiap aparatur memiliki akun dengan hak akses yang disesuaikan dengan struktur organisasi Kecamatan Temiang Pesisir. Hal ini memastikan setiap keputusan, disposisi, dan publikasi tercatat jejak auditnya.",
      steps: [
        {
          title: "Super Administrator",
          desc: "Memiliki kendali teknis penuh: mengelola akun semua pegawai (/internal/pengguna), konfigurasi sistem & background video hero beranda (/internal/pengaturan), audit log aktivitas, backup database, serta seluruh modul operasional surat dan aduan.",
          tip: "Hak akses tertinggi, gunakan akun ini dengan penuh kehati-hatian.",
        },
        {
          title: "Admin",
          desc: "Membantu superadmin dalam pemeliharaan sistem harian, penataan modul operasional surat, aduan, publikasi berita, dan pemantauan rekapitulasi statistik.",
        },
        {
          title: "Camat (Pimpinan Kecamatan)",
          desc: "Otorisasi final penandatanganan surat rekomendasi/keterangan dinas, pemberian lembar disposisi instruksi kepada Sekretaris dan Kepala Seksi, serta monitoring dashboard eksekutif kecepatan respon aduan warga.",
        },
        {
          title: "Sekretaris Camat (Sekcam)",
          desc: "Pemeriksaan administratif tata naskah dinas surat keluar sebelum diajukan ke Camat, koordinasi lintas seksi, serta pengawasan tindak lanjut aduan masyarakat berkategori mendesak.",
        },
        {
          title: "Kepala Seksi (Kasi Pem / Ekbang / Kesos)",
          desc: "Verifikasi kelayakan berkas teknis permohonan surat rekomendasi masyarakat (surat usaha, domisili, rekomendasi kegiatan), disposisi penugasan kepada staf/petugas lapangan, dan konfirmasi penyelesaian aduan.",
        },
        {
          title: "Staf / Operator",
          desc: "Penyusunan konseptor draf surat baru (/internal/surat/baru), pengarsipan naskah, serta input publikasi rilis berita, pengumuman, dan foto slide show beranda (/internal/informasi).",
        },
        {
          title: "Petugas Lapangan",
          desc: "Menerima disposisi aduan warga (/internal/aduan), turun ke lokasi kejadian untuk verifikasi lapangan, memperbarui catatan status, dan mengunggah foto bukti penyelesaian.",
        },
      ],
      notes: [
        "Jika ada pergantian pejabat atau mutasi staf, Superadmin dapat mengubah role atau membuat akun baru di menu Manajemen Pengguna.",
        "Setiap pegawai diwajibkan melengkapi nama lengkap berserta gelar dan memperbarui kata sandi secara berkala di menu 'Profil Saya'.",
      ],
    },
  },

  // 3. TATA KELOLA SURAT
  {
    id: "pembuatan-surat-baru",
    category: "surat",
    title: "Penyusunan & Pembuatan Draf Surat Baru",
    subtitle: "Langkah konseptor membuat naskah dinas, penomoran otomatis, dan lampiran syarat",
    badge: "Modul Surat",
    icon: FileText,
    linkHref: "/internal/surat/baru",
    linkLabel: "Buat Surat Sekarang",
    content: {
      overview:
        "Modul pembuatan surat memungkinkan Staf atau Kasi menyusun surat keterangan dan rekomendasi resmi kecamatan dengan format standar pemerintah, penomoran terstruktur otomatis, serta pencatatan pemohon yang rapi.",
      steps: [
        {
          title: "1. Pilih Jenis Format Surat",
          desc: "Buka menu 'Buat Surat Baru'. Pilih jenis surat yang dibutuhkan: Surat Rekomendasi Umum, Surat Keterangan Usaha (SKU), Surat Keterangan Domisili, Surat Keterangan Tidak Mampu (SKTM), Surat Keterangan Ahli Waris, atau Surat Tugas.",
        },
        {
          title: "2. Masukkan Data Pemohon & Penerima",
          desc: "Ketik NIK, Nama Lengkap Pemohon, Alamat Lengkap/Desa asal (Pulau Temiang, Tajur Biru, dll.), Pekerjaan, dan data pendukung lainnya sesuai KTP/KK pemohon.",
        },
        {
          title: "3. Penomoran Surat Otomatis",
          desc: "Sistem secara cerdas menyusun nomor agenda dinas sesuai kode klasifikasi kearsipan resmi Pemerintah Kabupaten Lingga dan kode wilayah Kecamatan Temiang Pesisir.",
          tip: "Nomor dapat disesuaikan secara manual jika dibutuhkan penyesuaian khusus dengan agenda fisik.",
        },
        {
          title: "4. Isi Perihal & Ringkasan Keperluan",
          desc: "Tuliskan tujuan permohonan surat secara jelas dan padat pada kolom yang disediakan.",
        },
        {
          title: "5. Unggah Berkas Persyaratan (PDF / Foto)",
          desc: "Lampirkan berkas kelengkapan dari desa (Surat Pengantar RT/Kades, scan KTP, KK, dsb.) sebagai dokumen pendukung verifikasi pimpinan.",
        },
        {
          title: "6. Simpan Sebagai Draf atau Ajukan Verifikasi",
          desc: "Pilih 'Simpan Draf' jika masih ingin diedit kembali, atau pilih 'Ajukan Verifikasi' agar berkas langsung masuk ke antrean telaah Kepala Seksi / Sekcam.",
        },
      ],
      notes: [
        "Seluruh proses penyusunan tersimpan otomatis ke database tanpa resiko naskah hilang.",
        "Draf yang sudah diajukan akan berstatus 'Menunggu Verifikasi'.",
      ],
    },
  },
  {
    id: "alur-disposisi-cetak-qr",
    category: "surat",
    title: "Alur Verifikasi, Otorisasi Pimpinan, & Cetak Kop QR Code",
    subtitle: "Mekanisme approval berjenjang, penandatanganan elektronik, dan validasi keaslian surat",
    badge: "Otorisasi & Cetak",
    icon: QrCode,
    linkHref: "/internal/surat",
    linkLabel: "Lihat Daftar Surat",
    content: {
      overview:
        "POPMI KTP menerapkan sistem verifikasi berjenjang (Four-Eye Principle) demi menjaga akuntabilitas administrasi pemerintahan kecamatan sebelum surat resmi dicetak dan diserahkan kepada masyarakat.",
      steps: [
        {
          title: "Tahap 1: Verifikasi Teknis oleh Kepala Seksi (Kasi)",
          desc: "Kasi yang membidangi (Pemerintahan / Ekbang / Kesos) membuka detail surat di /internal/surat/[id]. Memeriksa keabsahan berkas permohonan dari desa. Kasi dapat memberikan paraf persetujuan atau mengembalikan naskah ke staf dengan catatan perbaikan.",
        },
        {
          title: "Tahap 2: Telaah Administratif oleh Sekretaris Camat",
          desc: "Sekcam meneliti format tata naskah dinas, nomor klasifikasi, ejaan nama pemohon, serta kejelasan isi. Bila lengkap, Sekcam menyetujui dan meneruskan ke meja digital Camat.",
        },
        {
          title: "Tahap 3: Persetujuan Akhir (Approval) oleh Camat",
          desc: "Camat meninjau lembar disposisi digital dan memberikan persetujuan final (*Disetujui*). Pada tahap ini, status surat berubah menjadi 'Selesai' dan siap diterbitkan.",
        },
        {
          title: "Tahap 4: Cetak Naskah Dinas Standar Resmi (/cetak)",
          desc: "Klik tombol 'Cetak Surat'. Sistem otomatis merender format cetak naskah resmi berstandar Pemkab Lingga: Kop resmi lambang daerah, garis ganda pembatas, isi surat tertata proporsional, serta tanda tangan pimpinan.",
        },
        {
          title: "Fitur QR Code Validasi Digital Anti-Pemalsuan",
          desc: "Setiap surat hasil cetak dilengkapi QR Code otentikasi unik di samping tanda tangan. Siapapun (warga, perbankan, instansi lain) dapat memindai QR Code tersebut menggunakan kamera smartphone untuk memverifikasi secara langsung bahwa surat tersebut sah terdaftar di database resmi Kecamatan Temiang Pesisir.",
          tip: "QR Code memuat tautan verifikasi enkripsi yang tidak dapat dimanipulasi.",
        },
      ],
      notes: [
        "Surat dapat langsung dicetak ke printer fisik (kertas A4 / F4) atau disimpan sebagai dokumen PDF dengan memilih opsi 'Save as PDF' pada dialog print peramban.",
        "Surat yang telah selesai otomatis masuk ke modul 'Arsip Surat' (/internal/arsip) untuk pencarian jangka panjang.",
      ],
    },
  },

  // 4. PENGADUAN WARGA
  {
    id: "penanganan-aduan-internal",
    category: "aduan",
    title: "Mekanisme Penerimaan & Penanganan Aduan Warga",
    subtitle: "SOP respon cepat aduan, koordinasi tim lapangan, unggah foto bukti, dan penyelesaian",
    badge: "Layanan Aduan",
    icon: MessageSquareWarning,
    linkHref: "/internal/aduan",
    linkLabel: "Buka Aduan Masyarakat",
    content: {
      overview:
        "Layanan aduan masyarakat adalah garis terdepan kepedulian aparatur terhadap kendala riil warga di desa dan pulau. Seluruh proses penanganan harus dilakukan secara transparan, terukur, dan bertanggung jawab.",
      steps: [
        {
          title: "1. Notifikasi Laporan Masuk di Dashboard",
          desc: "Setiap ada pengaduan baru dari warga via portal publik, status awalnya adalah 'Menunggu'. Petugas/Admin dapat menyaring berdasarkan kategori (Infrastruktur, Kebersihan, Pelayanan Publik, Bencana Alam, Pelanggaran, dll.) atau asal desa pelapor.",
        },
        {
          title: "2. Telaah Awal & Verifikasi Kebenaran Laporan",
          desc: "Buka detail aduan (/internal/aduan/[tiket]). Periksa isi laporan, lokasi desa yang disebutkan, serta foto bukti awal yang dilampirkan warga. Pastikan laporan tidak mengandung unsur SARA atau fitnah.",
        },
        {
          title: "3. Pembaruan Status: 'Sedang Diproses'",
          desc: "Saat tim atau Seksi terkait mulai menindaklanjuti (misal: koordinasi dengan Kades, pengecekan tiang lampu roboh, perbaikan jalan dermaga), ubah status aduan menjadi 'Diproses'. Masukkan catatan petugas agar warga mengetahui langkah yang sedang diambil.",
          tip: "Warga yang mengecek tiketnya akan langsung melihat status berubah menjadi warna biru/amber yang menandakan laporannya didengar.",
        },
        {
          title: "4. Tindak Lanjut Lapangan & Dokumentasi Bukti",
          desc: "Petugas lapangan menyelesaikan permasalahan secara fisik di lapangan dan mengambil foto hasil penanganan nyata (foto sesudah penanganan / after).",
        },
        {
          title: "5. Penyelesaian Tuntas & Unggah Foto Bukti",
          desc: "Kembali ke sistem, unggah foto bukti penyelesaian kerja lapangan, ketik penjelasan tuntas pada kolom respon resmi petugas, lalu ubah status menjadi 'Selesai'.",
        },
        {
          title: "Opsi Penolakan dengan Alasan Terverifikasi",
          desc: "Bila laporan bukan merupakan kewenangan kecamatan (misal: wewenang kementerian/swasta tertentu) atau laporan fiktif, petugas dapat memilih status 'Ditolak' dengan wajib menyertakan alasan tertulis yang santun dan edukatif.",
        },
      ],
      notes: [
        "Aparatur berkomitmen merespons aduan masuk dalam batas waktu standar pelayanan (SLA) maksimal 2x24 jam.",
        "Identitas warga yang memilih opsi 'Anonim' di portal publik terenkripsi dan dijaga kerahasiaannya oleh sistem demi perlindungan pelapor.",
      ],
    },
  },

  // 5. PUBLIKASI INFORMASI & SLIDE SHOW
  {
    id: "manajemen-informasi-berita",
    category: "informasi",
    title: "Pengelolaan Informasi, Rilis Berita, & Foto Kegiatan",
    subtitle: "Panduan bagi Staf untuk mempublikasikan artikel resmi desa dan kecamatan",
    badge: "Publikasi Informasi",
    icon: Newspaper,
    linkHref: "/internal/informasi",
    linkLabel: "Buka Pusat Publikasi",
    content: {
      overview:
        "Menu Publikasi & Berita (/internal/informasi) dirancang khusus agar Staf dan Admin kecamatan dapat secara mandiri mengabarkan program kerja, penyaluran bantuan, jadwal pelayanan keliling, dan rilis pengumuman resmi kepada seluruh warga.",
      steps: [
        {
          title: "1. Buka Menu 'Publikasi & Berita' (/internal/informasi)",
          desc: "Klik tombol '+ Tambah Informasi Baru' di pojok kanan atas untuk membuka jendela formulir publikasi.",
        },
        {
          title: "2. Masukkan Judul & Kategori Informasi",
          desc: "Buat judul yang informatif dan formal (misal: 'Jadwal Pelayanan Perekaman KTP Keliling Desa Tajur Biru'). Pilih kategori yang sesuai: Berita, Pengumuman, Program Pemerintah, Jadwal Pelayanan, Kesehatan, atau Pendidikan.",
        },
        {
          title: "3. Tulis Ringkasan (Lead) & Isi Lengkap Artikel",
          desc: "Tulis ringkasan singkat 1-2 kalimat pada kolom 'Ringkasan Singkat' (ini akan tampil di kartu preview beranda publik). Lalu tuliskan rincian isi berita secara lengkap dan jelas.",
        },
        {
          title: "4. Lampirkan Foto Cover Kegiatan",
          desc: "Anda memiliki 2 cara mudah menyertakan foto dokumentasi resmi: (A) Upload foto langsung dari komputer/smartphone Anda (sistem otomatis mengompres ukuran gambar agar cepat dimuat), ATAU (B) Pilih 1-klik dari 'Preset Koleksi Foto Resmi' yang sudah disediakan (Pelayanan Camat, Musrenbang, Bansos BLT, Posyandu, Gotong Royong Pesisir, Pendidikan).",
          tip: "Foto lanskap (16:9 atau 4:3) menghasilkan tampilan kartu berita yang paling proporsional.",
        },
        {
          title: "5. Pengaturan Status Terbit / Draf",
          desc: "Aktifkan sakelar 'Terbitkan Segera' agar langsung tampil di portal publik, atau matikan untuk menyimpannya sebagai draf internal yang dapat ditinjau kembali nanti.",
        },
      ],
      notes: [
        "Setiap artikel otomatis mendapatkan tautan ramah SEO (slug) dan langsung muncul di galeri /publik/informasi.",
        "Anda dapat mengedit atau menghapus informasi kapan saja melalui tombol aksi di tabel.",
      ],
    },
  },
  {
    id: "headline-slideshow-carousel",
    category: "informasi",
    title: "Mengatur Foto Slide Show (Carousel) Beranda Utama",
    subtitle: "Cara menjadikan berita penting sebagai etalase unggulan di beranda publik",
    badge: "Hero Carousel",
    icon: Sparkles,
    linkHref: "/internal/informasi",
    linkLabel: "Atur Bintang Headline",
    content: {
      overview:
        "Beranda publik dilengkapi carousel foto slide show otomatis (5.5 detik per slide) dengan tombol navigasi, dot pagination, dan penghitung slide elegan. Staf dapat memilih artikel mana saja yang tampil di carousel tersebut hanya dengan satu klik!",
      steps: [
        {
          title: "1. Buka Tabel Publikasi (/internal/informasi)",
          desc: "Perhatikan kolom 'Slide Show' pada tabel daftar artikel.",
        },
        {
          title: "2. Klik Ikon Bintang Emas",
          desc: "Cukup klik ikon bintang pada baris artikel yang ingin ditampilkan di slide show beranda: Bintang Kuning/Emas = Aktif sebagai headline beranda publik; Bintang Abu-Abu = Hanya tampil di katalog berita biasa.",
          tip: "Disarankan mengaktifkan 3 sampai 5 artikel berita penting dengan foto terbaik untuk pengalaman visual pengunjung yang optimal.",
        },
        {
          title: "3. Efek Langsung di Beranda Publik",
          desc: "Buka halaman /publik. Artikel yang Anda tandai bintang akan langsung berputar secara mulus di carousel foto slide show lengkap dengan judul besar, tanggal terbit, dan tombol baca.",
        },
      ],
      notes: [
        "Jika tidak ada artikel yang ditandai bintang, sistem secara pintar akan menampilkan 4 artikel terbitan terbaru sebagai cadangan otomatis.",
        "Slide show otomatis menjeda putaran (pause on hover) saat kursor pengunjung diarahkan ke slide foto agar teks mudah dibaca.",
      ],
    },
  },

  // 6. PENGATURAN HERO & ANIMASI
  {
    id: "pengaturan-hero-background",
    category: "hero",
    title: "Konfigurasi Background Animasi Hero (Video & Gambar)",
    subtitle: "Panduan Superadmin mengatur media gerak, slider 0-100%, dan warna teks dinamis",
    badge: "Khusus Superadmin",
    icon: Video,
    linkHref: "/internal/pengaturan",
    linkLabel: "Buka Pengaturan Hero",
    content: {
      overview:
        "Superadmin memiliki keleluasaan penuh mengubah latar belakang area Hero Beranda Publik (/publik) menggunakan video gerak, foto pemandangan, atau animasi aura gradien. Semua kontrol dapat disimulasikan secara instan lewat Live Preview sebelum disimpan.",
      steps: [
        {
          title: "1. Upload File Video atau Animasi Baru",
          desc: "Di menu /internal/pengaturan bagian 1, klik area upload. Pilih file video MP4/WebM atau gambar animasi GIF/WebP dari laptop Anda. File otomatis tersimpan ke server lokal dan langsung aktif sebagai preview.",
        },
        {
          title: "2. Atau Gunakan Preset Video Lautan HD Lokal",
          desc: "Pilih preset 'Lautan & Ombak Pesisir Kepulauan (Video Loop HD)'. Video ombak laut ini di-host secara mandiri di server lokal (/videos/hero-oceans.mp4) sehingga tidak bergantung pada internet luar dan tidak terblokir.",
        },
        {
          title: "3. Atur Ketebalan Penutup Latar (Slider 0% - 100%)",
          desc: "Gunakan slider fleksibel untuk menentukan tingkat transparansi lapisan penutup: 0% = Video/gambar tampil 100% tanpa penutup sama sekali; 25% - 45% = Efek transparan seimbang (ombak terlihat hidup); 75% - 100% = Penutup tebal untuk fokus teks maksimal. Tersedia tombol cepat: [0%] [25%] [50%] [75%] [100%].",
        },
        {
          title: "4. Pilih Tema Penutup (Light / Forest / Dark)",
          desc: "Tersedia 3 pilihan nuansa: 'Putih Bersih' (cerah minimalis), 'Hijau Hutan' (khas warna resmi hijau Lingga #2F4A3C), atau 'Gelap Malam' (hitam sinematik mewah).",
        },
        {
          title: "5. Penyesuaian Warna Teks Dinamis (Auto / Putih / Hijau)",
          desc: "Pilih mode tampilan warna teks judul & isi: (A) '⚡ Auto' (Sangat Direkomendasikan): Teks otomatis cerdas beralih menjadi putih bercahaya dan berbayang tebal saat latar belakang gelap atau opasitas < 55%; (B) '⚪ Putih': Memaksa teks selalu putih bersih; (C) '🟢 Hijau': Memaksa teks menggunakan warna hijau tua resmi.",
          tip: "Gunakan '⚡ Auto' atau '⚪ Putih' jika menggunakan video laut dengan opasitas tipis agar teks judul tidak tenggelam.",
        },
        {
          title: "6. Atur Efek Blur Latar Belakang",
          desc: "Pilih antara 'Tajam (0px)' untuk memperlihatkan detail ombak/foto, 'Halus (2px)' untuk nuansa estetik lembut, atau 'Sedang (4px)' untuk memburamkan latar belakang.",
        },
        {
          title: "7. Tinjau Pratinjau Langsung & Simpan",
          desc: "Cek tampilan di kotak 'Pratinjau Tampilan Hero'. Jika sudah puas, klik tombol hijau besar 'Terapkan Background ke Portal Publik'.",
        },
      ],
      specifications: [
        { key: "Format Video", value: "MP4 (Codec H.264) atau WebM" },
        { key: "Resolusi Ideal", value: "1920x1080 (Full HD) atau 1280x720 (HD)" },
        { key: "Rasio Aspek", value: "16:9 Landscape" },
        { key: "Durasi Video", value: "5 sampai 15 detik looping mulus" },
        { key: "Ukuran File Disarankan", value: "Di bawah 10 MB (Optimal 3 - 8 MB)" },
        { key: "Audio / Suara", value: "Wajib Muted (Tanpa audio) agar autoplay browser jalan" },
      ],
      notes: [
        "Perubahan background langsung aktif seketika di seluruh peramban warga tanpa perlu me-restart server.",
        "Jika sewaktu-waktu ingin mematikan animasi, matikan sakelar 'Status Background Animasi' di bagian atas panel.",
      ],
    },
  },

  // 7. PORTAL PUBLIK
  {
    id: "panduan-portal-publik",
    category: "publik",
    title: "Eksplorasi Fitur & Navigasi Portal Publik Warga",
    subtitle: "Memahami seluruh layanan digital yang disediakan untuk masyarakat umum",
    badge: "Layanan Warga",
    icon: Building2,
    linkHref: "/publik",
    linkLabel: "Kunjungi Portal Publik",
    content: {
      overview:
        "Portal Publik Kecamatan Temiang Pesisir (/publik) menyajikan kemudahan akses pelayanan berbasis mobile-first, ringan diakses di pulau-pulau dengan jaringan terbatas, serta mengedepankan prinsip transparansi data.",
      steps: [
        {
          title: "Hero Banner & Pencarian Cepat Tiket",
          desc: "Pengunjung dapat langsung mengetikkan kode tiket mereka di kotak pencarian beranda tanpa harus membuka menu lain. Begitu klik 'Cek Progres', status penanganan langsung ditampilkan.",
        },
        {
          title: "4 Kartu Akses Cepat (3D Isometrik GovTech)",
          desc: "Empat pintu masuk utama pelayanan: (1) Lapor Permasalahan -> langsung ke form buat pengaduan; (2) Pantau Tiket Real-Time -> lacak progres tiket; (3) Peta Sebaran Laporan -> peta spasial desa; (4) Transparansi & Statistik -> grafik akuntabilitas.",
        },
        {
          title: "Hero Carousel Slide Show Berita",
          desc: "Etalase visual kegiatan pimpinan dan rilis program unggulan yang diatur langsung oleh staf melalui menu publikasi internal.",
        },
        {
          title: "Counter Statistik Interaktif (Live)",
          desc: "Menampilkan akumulasi angka total aduan masuk, laporan yang sedang menunggu verifikasi, sedang diproses di lapangan, dan laporan yang tuntas diselesaikan 100%.",
        },
        {
          title: "Peta Interaktif Sebaran GIS (/publik/peta)",
          desc: "Menampilkan peta sebaran titik pengaduan di desa-desa Kecamatan Temiang Pesisir. Membantu warga dan aparatur memetakan wilayah mana yang membutuhkan atensi fasilitas fisik.",
        },
        {
          title: "Pusat Bantuan & Kontak Kecamatan (/publik/kontak)",
          desc: "Menampilkan alamat kantor camat, jam pelayanan tatap muka, nomor hotline WhatsApp pengaduan, dan peta lokasi kantor.",
        },
      ],
      notes: [
        "Warga tidak diwajibkan mendaftar akun untuk membuat aduan atau membaca informasi, demi meruntuhkan batasan birokrasi digital.",
      ],
    },
  },

  // 8. FAQ
  {
    id: "faq-troubleshooting",
    category: "faq",
    title: "Tanya Jawab (FAQ) & Solusi Masalah Operasional",
    subtitle: "Jawaban atas pertanyaan yang paling sering diajukan seputar penggunaan aplikasi",
    badge: "Bantuan Cepat",
    icon: HelpCircle,
    content: {
      overview:
        "Berikut adalah rangkuman solusi kendala teknis dan pertanyaan umum aparatur dalam mengoperasikan sistem POPMI KTP sehari-hari.",
      steps: [
        {
          title: "Warga melapor lupa nomor tiket aduan, bagaimana mencarinya?",
          desc: "Petugas dapat membuka menu /internal/aduan, lalu gunakan kolom pencarian untuk mengetikkan nama pelapor, nomor HP, atau kata kunci judul laporan yang diingat warga. Nomor tiket dapat dilihat di kolom pertama tabel.",
        },
        {
          title: "Bagaimana cara memperkecil ukuran video sebelum diupload ke hero?",
          desc: "Gunakan situs kompresi gratis seperti FreeConvert.com, TinyWow.com, atau software CapCut/HandBrake. Pilih resolusi 1080p atau 720p, matikan audio, dan atur target bitrate sekitar 2.500 kbps agar file di bawah 10 MB.",
        },
        {
          title: "Mengapa video tidak memutar otomatis di peramban tertentu?",
          desc: "Peramban modern (Google Chrome, Apple Safari) secara ketat memblokir autoplay video jika video memiliki audio aktif. Sistem telah menyetel video ke mode 'Muted' (senyap) secara otomatis agar selalu berputar mulus.",
        },
        {
          title: "Bagaimana jika saya lupa kata sandi akun internal?",
          desc: "Hubungi Super Administrator instansi. Superadmin dapat mereset kata sandi Anda dalam hitungan detik melalui menu /internal/pengguna.",
        },
        {
          title: "Apakah surat yang sudah disetujui masih bisa diedit?",
          desc: "Surat yang telah disetujui Camat berstatus 'Disetujui' dan terkunci demi keamanan hukum. Jika terdapat kekeliruan fatal, draf dapat dibatalkan atau dibuatkan revisi naskah baru oleh staf konseptor.",
        },
        {
          title: "Bagaimana cara mencetak panduan ini menjadi dokumen fisik atau PDF?",
          desc: "Klik tombol 'Cetak Panduan Lengkap' di sudut kanan atas halaman ini. Peramban akan membuka dialog cetak yang sudah dioptimasi khusus untuk kertas dokumen dan PDF.",
        },
      ],
      notes: [
        "Untuk dukungan teknis lanjutan atau permohonan penambahan modul baru, silakan menghubungi Tim Pengembang Sistem Informasi Kecamatan.",
      ],
    },
  },
]

export function PanduanClient() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("semua")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>("arsitektur-sistem")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Filter guides based on search & category
  const filteredGuides = useMemo(() => {
    return GUIDES_DATA.filter((guide) => {
      const matchCategory =
        activeCategory === "semua" || guide.category === activeCategory

      const q = searchQuery.toLowerCase().trim()
      if (!q) return matchCategory

      const matchSearch =
        guide.title.toLowerCase().includes(q) ||
        guide.subtitle.toLowerCase().includes(q) ||
        guide.badge.toLowerCase().includes(q) ||
        guide.content.overview.toLowerCase().includes(q) ||
        guide.content.steps?.some(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.desc.toLowerCase().includes(q) ||
            (s.tip && s.tip.toLowerCase().includes(q))
        ) ||
        guide.content.notes?.some((n) => n.toLowerCase().includes(q))

      return matchCategory && matchSearch
    })
  }, [activeCategory, searchQuery])

  // Toggle accordion
  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  // Handle print
  const handlePrint = () => {
    window.print()
  }

  // Handle copy text link
  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/internal/panduan#${id}`
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const categoryTabs = [
    { key: "semua" as CategoryKey, label: "Semua Panduan", count: GUIDES_DATA.length },
    { key: "ringkasan" as CategoryKey, label: "Arsitektur & Alur", count: 1 },
    { key: "peran" as CategoryKey, label: "Matriks Peran (Role)", count: 1 },
    { key: "surat" as CategoryKey, label: "Tata Kelola Surat", count: 2 },
    { key: "aduan" as CategoryKey, label: "Pengaduan Warga", count: 1 },
    { key: "informasi" as CategoryKey, label: "Publikasi & Berita", count: 2 },
    { key: "hero" as CategoryKey, label: "Pengaturan Hero Media", count: 1 },
    { key: "publik" as CategoryKey, label: "Portal Warga", count: 1 },
    { key: "faq" as CategoryKey, label: "FAQ & Tips", count: 1 },
  ]

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-teks/50 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <BookOpen className="w-3.5 h-3.5" />
              Buku Panduan Operasional & Dokumentasi Sistem
            </span>
            <span>•</span>
            <span>Kecamatan Temiang Pesisir</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[#2F4A3C] tracking-tight">
            Pusat Panduan &amp; Standard Operating Procedure (SOP)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Petunjuk lengkap pengoperasian fitur portal internal dan publik POPMI KTP.
            Temukan langkah verifikasi surat, penanganan aduan, publikasi berita, hingga pengaturan video hero.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak / Simpan PDF</span>
          </button>
          <Link href="/internal/beranda">
            <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2F4A3C] hover:bg-[#23382D] text-white text-xs font-semibold transition-colors shadow-xs">
              <span>Ke Beranda Internal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>

      {/* 2. Interactive Search & Stats Quick Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
        {/* Live Search Bar */}
        <div className="lg:col-span-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ketik kata kunci (contoh: upload video, nomor tiket, disposisi, draf surat, bintang slide show, role)..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200/90 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2F4A3C]/20 focus:border-[#2F4A3C] shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-400 hover:text-slate-600"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Quick Result Counter Badge */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-3 px-4 shadow-xs flex items-center justify-between text-xs text-slate-600">
          <span className="font-medium">Total Topik Ditemukan:</span>
          <span className="px-2.5 py-1 rounded-full bg-[#2F4A3C]/10 text-[#2F4A3C] font-bold">
            {filteredGuides.length} Modul Panduan
          </span>
        </div>
      </div>

      {/* 3. Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {categoryTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveCategory(tab.key)}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer",
              activeCategory === tab.key
                ? "bg-[#2F4A3C] text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
            )}
          >
            <span>{tab.label}</span>
            <span
              className={cn(
                "px-1.5 py-0.2 rounded-full text-[10px]",
                activeCategory === tab.key
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-500"
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 4. Guide List (Expandable Cards) */}
      {filteredGuides.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-base text-slate-800">
            Panduan Tidak Ditemukan
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Tidak ada panduan yang cocok dengan kata kunci &quot;{searchQuery}&quot;. Coba gunakan kata kunci lain seperti &quot;surat&quot;, &quot;aduan&quot;, atau &quot;video&quot;.
          </p>
          <button
            onClick={() => {
              setSearchQuery("")
              setActiveCategory("semua")
            }}
            className="px-4 py-2 rounded-xl bg-[#2F4A3C] text-white text-xs font-semibold"
          >
            Reset Pencarian
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGuides.map((guide) => {
            const isExpanded = expandedId === guide.id
            const Icon = guide.icon

            return (
              <div
                key={guide.id}
                id={guide.id}
                className={cn(
                  "bg-white rounded-2xl border transition-all overflow-hidden",
                  isExpanded
                    ? "border-[#2F4A3C]/40 shadow-md ring-1 ring-[#2F4A3C]/10"
                    : "border-slate-200/80 hover:border-slate-300 shadow-xs"
                )}
              >
                {/* Header Clickable Row */}
                <div
                  onClick={() => handleToggle(guide.id)}
                  className="p-5 sm:p-6 flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none bg-gradient-to-r from-white via-slate-50/30 to-white hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div
                      className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-2xs",
                        isExpanded
                          ? "bg-[#2F4A3C] text-[#D9A400]"
                          : "bg-emerald-50 text-[#2F4A3C]"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 border border-emerald-200/40">
                          {guide.badge}
                        </span>
                        {guide.targetRole && (
                          <span className="text-[10px] font-semibold text-slate-500">
                            • {guide.targetRole}
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif font-bold text-base sm:text-lg text-[#2F4A3C] leading-snug">
                        {guide.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 sm:line-clamp-none">
                        {guide.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopyLink(guide.id)
                      }}
                      title="Salin tautan topik ini"
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors hidden sm:inline-flex"
                    >
                      {copiedId === guide.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200",
                        isExpanded ? "bg-[#2F4A3C]/10 text-[#2F4A3C] rotate-180" : "text-slate-400"
                      )}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Body Content (Shown when expanded) */}
                {isExpanded && (
                  <div className="p-6 pt-2 border-t border-slate-100 space-y-6 animate-in fade-in-50 duration-200">
                    {/* Overview Box */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-xs sm:text-sm text-slate-700 leading-relaxed flex items-start gap-3">
                      <Info className="w-5 h-5 text-[#2F4A3C] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">{guide.content.overview}</p>
                      </div>
                    </div>

                    {/* Step-by-Step Instructions */}
                    {guide.content.steps && guide.content.steps.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#2F4A3C]" />
                          <span>Tahapan &amp; Prosedur Pelaksanaan:</span>
                        </h4>

                        <div className="space-y-2.5">
                          {guide.content.steps.map((step, idx) => (
                            <div
                              key={idx}
                              className="p-4 rounded-xl border border-slate-200/70 hover:border-slate-300 bg-white space-y-1.5 transition-colors"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="w-6 h-6 rounded-full bg-[#2F4A3C] text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-2xs">
                                  {idx + 1}
                                </span>
                                <h5 className="font-semibold text-xs sm:text-sm text-slate-800">
                                  {step.title}
                                </h5>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-600 pl-8 leading-relaxed">
                                {step.desc}
                              </p>
                              {step.tip && (
                                <div className="ml-8 mt-2 p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/60 text-amber-900 text-xs flex items-start gap-2">
                                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                  <span>
                                    <strong>Tips:</strong> {step.tip}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Technical Specifications Table (If Available) */}
                    {guide.content.specifications && (
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Sliders className="w-4 h-4 text-[#2F4A3C]" />
                          <span>Spesifikasi Teknis yang Direkomendasikan:</span>
                        </h4>
                        <div className="rounded-xl border border-slate-200 overflow-hidden">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                              <tr>
                                <th className="p-3">Parameter</th>
                                <th className="p-3">Rekomendasi Terbaik</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {guide.content.specifications.map((spec, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/60">
                                  <td className="p-3 font-semibold text-slate-700">{spec.key}</td>
                                  <td className="p-3 text-slate-600">{spec.value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Important Notes */}
                    {guide.content.notes && guide.content.notes.length > 0 && (
                      <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-xs text-emerald-900 space-y-1.5">
                        <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                          <ShieldCheck className="w-4 h-4 text-emerald-700" /> Catatan Penting:
                        </span>
                        <ul className="list-disc list-inside space-y-1 pl-1 text-emerald-800/90 leading-relaxed">
                          {guide.content.notes.map((note, idx) => (
                            <li key={idx}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Direct Quick Link to Feature */}
                    {guide.linkHref && (
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <span className="text-xs text-slate-500">
                          Ingin langsung mencoba fitur ini?
                        </span>
                        <Link href={guide.linkHref}>
                          <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2F4A3C] hover:bg-[#23382D] text-white text-xs font-semibold transition-all shadow-2xs">
                            <span>{guide.linkLabel || "Buka Halaman"}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-[#D9A400]" />
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* 5. Support & Contact Strip */}
      <div className="bg-gradient-to-r from-[#2F4A3C] to-[#1f3328] rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-serif font-bold text-lg text-[#D9A400]">
            Butuh Bimbingan Teknis Tambahan?
          </h3>
          <p className="text-xs text-white/80 max-w-xl leading-relaxed">
            Jika terdapat alur kerja yang membutuhkan penyesuaian khusus atau kendala teknis yang belum tercakup pada panduan ini, hubungi Administrator Sistem Kecamatan Temiang Pesisir.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/internal/profil">
            <button className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors">
              Profil &amp; Keamanan Akun
            </button>
          </Link>
          <Link href="/internal/pengaturan">
            <button className="px-4 py-2.5 rounded-xl bg-[#D9A400] hover:bg-[#c49300] text-[#2F4A3C] text-xs font-bold transition-colors shadow-xs">
              Pengaturan Sistem
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
