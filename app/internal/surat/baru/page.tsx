"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { JENIS_SURAT_LABELS, JenisSurat, NOMOR_FORMAT, generateNomorSurat, ROMAN_MONTHS } from "@/lib/mock-data/surat"
import { DESA_LIST } from "@/lib/mock-data/desa"
import { ChevronRight, ChevronLeft, FileText, Check, Fuel, Building2, HeartHandshake, FileCheck2, Sparkles, CheckCircle2, Info, ArrowRight, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { buatSuratBaru } from "../actions"
import { generateSuratHTML } from "@/lib/mock-data/generate-surat"
import Image from "next/image"

const STEPS = [
  { no: 1, label: "Pilih Format Naskah", deskripsi: "Tentukan jenis surat dinas" },
  { no: 2, label: "Lengkapi Formulir", deskripsi: "Input rincian data permohonan" },
  { no: 3, label: "Pratinjau & Draf", deskripsi: "Tinjau cetak e-TEPI & simpan" },
]

const JENIS_SURAT_META: Record<JenisSurat, {
  kategori: "bbm" | "desa" | "warga"
  kategoriLabel: string
  deskripsi: string
}> = {
  dispensasi_nikah: {
    kategori: "warga",
    kategoriLabel: "Layanan Warga",
    deskripsi: "Dispensasi nikah bagi calon pengantin dengan waktu pendaftaran kurang dari 10 hari kerja (pengantar N1-N4).",
  },
  bbm_jbkp: {
    kategori: "bbm",
    kategoriLabel: "Pelayanan BBM",
    deskripsi: "Rekomendasi pembelian Pertalite (JBKP) bagi nelayan pesisir, armada transportasi umum & usaha mikro.",
  },
  bbm_jbt: {
    kategori: "bbm",
    kategoriLabel: "Pelayanan BBM",
    deskripsi: "Rekomendasi pembelian Minyak Tanah / Bio Solar (JBT) untuk kebutuhan penerangan rumah tangga & usaha.",
  },
  rekomendasi_dd: {
    kategori: "desa",
    kategoriLabel: "Pemerintahan Desa",
    deskripsi: "Rekomendasi pencairan Dana Desa (DD) per tahap berdasarkan hasil verifikasi dokumen laporan realisasi.",
  },
  rekomendasi_add: {
    kategori: "desa",
    kategoriLabel: "Pemerintahan Desa",
    deskripsi: "Rekomendasi pencairan Alokasi Dana Desa (ADD) bulanan bagi operasional dan siltap perangkat desa.",
  },
  tunda_salur_add: {
    kategori: "desa",
    kategoriLabel: "Pemerintahan Desa",
    deskripsi: "Rekomendasi penyaluran kurang bayar atau tunda salur ADD tahun anggaran berjalan.",
  },
  ahli_waris: {
    kategori: "warga",
    kategoriLabel: "Layanan Warga",
    deskripsi: "Surat keterangan penetapan ahli waris sah untuk keperluan hukum, perbankan, dan administrasi kependudukan.",
  },
  pemberhentian_perangkat: {
    kategori: "desa",
    kategoriLabel: "Pemerintahan Desa",
    deskripsi: "Rekomendasi persetujuan atas usulan pemberhentian / pengangkatan perangkat desa oleh Kepala Desa.",
  },
}

const FORM_FIELDS: Record<JenisSurat, { label: string; key: string; type: string; required: boolean; options?: string[]; section?: string; placeholder?: string }[]> = {
  dispensasi_nikah: [
    // Calon Suami
    { label: "Nama Calon Suami", key: "namaSuami", type: "text", required: true, section: "Data Calon Suami" },
    { label: "Tempat Lahir", key: "tempatLahirSuami", type: "text", required: true, section: "Data Calon Suami" },
    { label: "Tanggal Lahir", key: "tanggalLahirSuami", type: "date", required: true, section: "Data Calon Suami" },
    { label: "Jenis Kelamin", key: "jkSuami", type: "select", required: true, options: ["Laki-laki", "Perempuan"], section: "Data Calon Suami" },
    { label: "Agama", key: "agamaSuami", type: "select", required: true, options: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"], section: "Data Calon Suami" },
    { label: "Status Perkawinan", key: "statusSuami", type: "select", required: true, options: ["Jejaka", "Duda Mati", "Duda Cerai"], section: "Data Calon Suami" },
    { label: "Pekerjaan", key: "pekerjaanSuami", type: "select", required: true, options: ["Belum/Tidak Bekerja", "Mengurus Rumah Tangga", "Pelajar/Mahasiswa", "PNS", "PPPK", "TNI", "POLRI", "Karyawan Swasta", "Karyawan BUMN", "Wiraswasta", "Petani/Pekebun", "Nelayan", "Pedagang", "Buruh Harian Lepas", "Lainnya"], section: "Data Calon Suami" },
    { label: "Alamat Calon Suami", key: "alamatSuami", type: "textarea", required: true, section: "Data Calon Suami" },
    // Calon Istri
    { label: "Nama Calon Istri", key: "namaIstri", type: "text", required: true, section: "Data Calon Istri" },
    { label: "Tempat Lahir", key: "tempatLahirIstri", type: "text", required: true, section: "Data Calon Istri" },
    { label: "Tanggal Lahir", key: "tanggalLahirIstri", type: "date", required: true, section: "Data Calon Istri" },
    { label: "Jenis Kelamin", key: "jkIstri", type: "select", required: true, options: ["Perempuan", "Laki-laki"], section: "Data Calon Istri" },
    { label: "Agama", key: "agamaIstri", type: "select", required: true, options: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"], section: "Data Calon Istri" },
    { label: "Status Perkawinan", key: "statusIstri", type: "select", required: true, options: ["Perawan", "Janda Mati", "Janda Cerai"], section: "Data Calon Istri" },
    { label: "Pekerjaan", key: "pekerjaanIstri", type: "select", required: true, options: ["Belum/Tidak Bekerja", "Mengurus Rumah Tangga", "Pelajar/Mahasiswa", "PNS", "PPPK", "TNI", "POLRI", "Karyawan Swasta", "Karyawan BUMN", "Wiraswasta", "Petani/Pekebun", "Nelayan", "Pedagang", "Buruh Harian Lepas", "Lainnya"], section: "Data Calon Istri" },
    { label: "Alamat Calon Istri", key: "alamatIstri", type: "textarea", required: true, section: "Data Calon Istri" },
    // Pernikahan / Desa
    { label: "Desa/Kelurahan Pengantar N1-N4", key: "desaPengantar", type: "select", required: true, options: DESA_LIST, section: "Rencana Pernikahan" },
    { label: "Tanggal Surat N1-N4", key: "tanggalSuratDesa", type: "date", required: true, section: "Rencana Pernikahan" },
    { label: "Tanggal Rencana Akad Nikah", key: "tanggalNikah", type: "date", required: true, section: "Rencana Pernikahan" },
    { label: "Tempat Akad Nikah", key: "tempatNikah", type: "text", required: true, section: "Rencana Pernikahan" },
  ],
  bbm_jbkp: [
    { label: "Nomor Urut Surat", key: "nomorUrut", type: "text", required: false, section: "Identitas Pemohon" },
    { label: "Nama Pemohon", key: "pemohon", type: "text", required: true, section: "Identitas Pemohon" },
    { label: "NIK", key: "nik", type: "text", required: true, section: "Identitas Pemohon" },
    { label: "Desa", key: "desa", type: "select", required: true, options: DESA_LIST, section: "Identitas Pemohon" },
    { label: "Alamat", key: "alamat", type: "text", required: true, section: "Identitas Pemohon" },
    { label: "Nama Usaha (jika ada)", key: "namaUsaha", type: "text", required: false, section: "Identitas Pemohon" },
    { label: "Jenis Usaha", key: "jenisUsaha", type: "text", required: false, section: "Identitas Pemohon" },
    { label: "Sektor Konsumen Pengguna", key: "sektor", type: "select", required: true, options: ["Sarana Transportasi Umum", "Nelayan", "Usaha Mikro Kecil", "Rumah Tangga"], section: "Detail BBM" },
    { label: "Alokasi Volume (Liter/Bulan)", key: "volume", type: "number", required: true, section: "Detail BBM" },
    { label: "Alat Pembelian", key: "alatPembelian", type: "select", required: true, options: ["DRUM", "Jerigen Plastik", "Drum Besi", "Tangki Portable"], section: "Detail BBM" },
    { label: "Jangka Waktu (s.d. tanggal)", key: "jangkaWaktu", type: "date", required: true, section: "Detail BBM" },
    { label: "Tempat Pengambilan", key: "tempatPengambilan", type: "text", required: true, section: "Detail BBM" },
    { label: "Nomor Penyalur", key: "nomorPenyalur", type: "text", required: true, section: "Detail BBM" },
    { label: "Alamat Penyalur", key: "alamatPenyalur", type: "text", required: true, section: "Detail BBM" },
  ],
  bbm_jbt: [
    { label: "Nomor Urut Surat", key: "nomorUrut", type: "text", required: false, section: "Identitas Pemohon" },
    { label: "Nama Pemohon", key: "pemohon", type: "text", required: true, section: "Identitas Pemohon" },
    { label: "NIK", key: "nik", type: "text", required: true, section: "Identitas Pemohon" },
    { label: "Desa", key: "desa", type: "select", required: true, options: DESA_LIST, section: "Identitas Pemohon" },
    { label: "Alamat Lengkap", key: "alamat", type: "text", required: true, section: "Identitas Pemohon" },
    { label: "Nama Usaha (jika ada)", key: "namaUsaha", type: "text", required: false, section: "Identitas Pemohon" },
    { label: "Jenis Usaha", key: "jenisUsaha", type: "text", required: false, section: "Identitas Pemohon" },
    { label: "Jenis BBM Tertentu", key: "jenisBBM", type: "select", required: true, options: ["Minyak Tanah", "Bio Solar"], section: "Detail BBM" },
    { label: "Jumlah Rumah Tangga (KK)", key: "jumlahRumahTangga", type: "number", required: false, section: "Detail BBM" },
    { label: "Jumlah Usaha Mikro", key: "jumlahUsahaMikro", type: "number", required: false, section: "Detail BBM" },
    { label: "Kebutuhan Rumah Tangga (Liter/Bulan)", key: "kebutuhanRumahTangga", type: "number", required: false, section: "Detail BBM" },
    { label: "Kebutuhan Usaha Mikro (Liter/Bulan)", key: "kebutuhanUsahaMikro", type: "number", required: false, section: "Detail BBM" },
    { label: "Total Alokasi Volume (Liter/Bulan)", key: "volume", type: "number", required: true, section: "Detail BBM" },
    { label: "Alat Pembelian", key: "alatPembelian", type: "select", required: true, options: ["Drum Besi", "Dirigen Plastik", "Jerigen", "Tangki Portable"], section: "Detail BBM" },
    { label: "Jangka Waktu (s.d. tanggal)", key: "jangkaWaktu", type: "date", required: true, section: "Detail BBM" },
    { label: "Tempat Pengambilan", key: "tempatPengambilan", type: "text", required: true, section: "Detail BBM" },
    { label: "Nomor Penyalur", key: "nomorPenyalur", type: "text", required: true, section: "Detail BBM" },
    { label: "Alamat Penyalur", key: "alamatPenyalur", type: "text", required: true, section: "Detail BBM" },
  ],
  rekomendasi_dd: [
    { label: "Nama Desa", key: "desa", type: "select", required: true, options: DESA_LIST, section: "Identitas Desa" },
    { label: "Kepala Desa", key: "kepalaDesa", type: "text", required: true, section: "Identitas Desa" },
    { label: "Tahap Pencairan Dana Desa", key: "tahap", type: "select", required: true, options: ["Tahap I", "Tahap II", "Tahap III"], section: "Detail Dana" },
    { label: "Tahun Anggaran", key: "tahun", type: "text", required: true, section: "Detail Dana" },
    { label: "Tanggal Verifikasi", key: "tanggalVerifikasi", type: "date", required: true, section: "Detail Dana" },
    { label: "Catatan Verifikasi / Keterangan", key: "keterangan", type: "textarea", required: false, section: "Detail Dana" },
  ],
  rekomendasi_add: [
    { label: "Nama Desa", key: "desa", type: "select", required: true, options: DESA_LIST, section: "Identitas Desa" },
    { label: "Kepala Desa", key: "kepalaDesa", type: "text", required: true, section: "Identitas Desa" },
    { label: "Bulan Pengajuan ADD", key: "bulan", type: "select", required: true, options: ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"], section: "Detail ADD" },
    { label: "Tahun Anggaran", key: "tahun", type: "text", required: true, section: "Detail ADD" },
    { label: "Tanggal Verifikasi", key: "tanggalVerifikasi", type: "date", required: true, section: "Detail ADD" },
    { label: "Nomor Surat Permohonan Kepala Desa", key: "nomorSuratDesa", type: "text", required: false, section: "Detail ADD" },
    { label: "Catatan Verifikasi / Keterangan", key: "keterangan", type: "textarea", required: false, section: "Detail ADD" },
    { label: "a. Surat Permohonan Kepala Desa", key: "cekA", type: "checkbox", required: false, section: "Kelengkapan Dokumen" },
    { label: "b. FotoCopy Print Out Buku Rekening Pemerintah Desa", key: "cekB", type: "checkbox", required: false, section: "Kelengkapan Dokumen" },
    { label: "c. FotoCopy NPWP Pemerintah Desa", key: "cekC", type: "checkbox", required: false, section: "Kelengkapan Dokumen" },
    { label: "d. Laporan Realisasi penggunaan ADD Bulan sebelumnya (penggunaan Dana minimal 75%)", key: "cekD", type: "checkbox", required: false, section: "Kelengkapan Dokumen" },
  ],
  tunda_salur_add: [
    { label: "Nama Desa", key: "desa", type: "select", required: true, options: DESA_LIST, section: "Identitas Desa" },
    { label: "Kepala Desa", key: "kepalaDesa", type: "text", required: true, section: "Identitas Desa" },
    { label: "Bulan ADD yang Ditunda Salur", key: "bulan", type: "select", required: true, options: ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"], section: "Detail Tunda Salur" },
    { label: "Tahun Anggaran", key: "tahun", type: "text", required: true, section: "Detail Tunda Salur" },
    { label: "Tanggal Verifikasi", key: "tanggalVerifikasi", type: "date", required: true, section: "Detail Tunda Salur" },
    { label: "Catatan Verifikasi", key: "keterangan", type: "textarea", required: false, section: "Detail Tunda Salur" },
    { label: "1. Surat Permohonan Kepala Desa", key: "cek1", type: "checkbox", required: false, section: "Kelengkapan Dokumen" },
    { label: "2. Foto Copy Buku Bank / Print Rekening Pemerintah Desa", key: "cek2", type: "checkbox", required: false, section: "Kelengkapan Dokumen" },
    { label: "3. Foto Copy NPWP Pemerintah Desa", key: "cek3", type: "checkbox", required: false, section: "Kelengkapan Dokumen" },
    { label: "4. Surat Pernyataan TanggungJawab Mutlak Atas Penggunaan Dana kurang bayar ADD", key: "cek4", type: "checkbox", required: false, section: "Kelengkapan Dokumen" },
    { label: "5. APBDesa Perubahan Anggaran", key: "cek5", type: "checkbox", required: false, section: "Kelengkapan Dokumen" },
    { label: "6. Laporan Realisasi Anggaran Tahun Anggaran", key: "cek6", type: "checkbox", required: false, section: "Kelengkapan Dokumen" },
    { label: "7. Laporan Realisasi ADD Tunda Salur Bulan Sebelumnya", key: "cek7", type: "checkbox", required: false, section: "Kelengkapan Dokumen" },
  ],
  ahli_waris: [
    // Data Pewaris (Almarhum/Almarhumah)
    { label: "Nama Almarhum/Almarhumah", key: "pewaris", type: "text", required: true, section: "Data Pewaris" },
    { label: "NIK Almarhum/Almarhumah", key: "nikPewaris", type: "text", required: true, section: "Data Pewaris" },
    { label: "Tempat Lahir Almarhum", key: "tempatLahirPewaris", type: "text", required: false, section: "Data Pewaris" },
    { label: "Tanggal Lahir Almarhum", key: "tanggalLahirPewaris", type: "date", required: false, section: "Data Pewaris" },
    { label: "Jenis Kelamin Almarhum", key: "jkPewaris", type: "select", required: false, options: ["Laki-Laki", "Perempuan"], section: "Data Pewaris" },
    { label: "Agama Almarhum", key: "agamaPewaris", type: "select", required: false, options: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"], section: "Data Pewaris" },
    { label: "Pekerjaan Almarhum", key: "pekerjaanPewaris", type: "text", required: false, section: "Data Pewaris" },
    { label: "Alamat Almarhum", key: "alamatPewaris", type: "text", required: false, section: "Data Pewaris" },
    { label: "Desa Terakhir Almarhum", key: "desa", type: "select", required: true, options: DESA_LIST, section: "Data Pewaris" },
    // Data Ahli Waris (Pemohon)
    { label: "Nama Ahli Waris Utama (Pemohon)", key: "pemohon", type: "text", required: true, section: "Data Ahli Waris" },
    { label: "NIK Pemohon", key: "nikPemohon", type: "text", required: true, section: "Data Ahli Waris" },
    { label: "Tempat Lahir Pemohon", key: "tempatLahirPemohon", type: "text", required: false, section: "Data Ahli Waris" },
    { label: "Tanggal Lahir Pemohon", key: "tanggalLahirPemohon", type: "date", required: false, section: "Data Ahli Waris" },
    { label: "Jenis Kelamin Pemohon", key: "jkPemohon", type: "select", required: false, options: ["Laki-Laki", "Perempuan"], section: "Data Ahli Waris" },
    { label: "Agama Pemohon", key: "agamaPemohon", type: "select", required: false, options: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"], section: "Data Ahli Waris" },
    { label: "Pekerjaan Pemohon", key: "pekerjaanPemohon", type: "text", required: false, section: "Data Ahli Waris" },
    { label: "Alamat Pemohon", key: "alamatPemohon", type: "text", required: false, section: "Data Ahli Waris" },
    { label: "Hubungan dengan Almarhum", key: "hubungan", type: "select", required: true, options: ["Suami", "Istri", "Anak Kandung", "Orang Tua", "Saudara Kandung"], section: "Data Ahli Waris" },
    { label: "Daftar Seluruh Ahli Waris (Nama – Hubungan)", key: "daftarAhliWaris", type: "textarea", required: true, section: "Data Ahli Waris" },
    // Saksi-saksi
    { label: "Nama Saksi 1 (beserta jabatan/ket.)", key: "saksi1", type: "text", required: false, section: "Saksi-saksi", placeholder: "cth: ARIANTO (Ketua RT 006)" },
    { label: "Nama Saksi 2 (beserta jabatan/ket.)", key: "saksi2", type: "text", required: false, section: "Saksi-saksi", placeholder: "cth: ISLAN (Ketua RW 003)" },
  ],

  pemberhentian_perangkat: [
    { label: "Nama Desa", key: "desa", type: "select", required: true, options: DESA_LIST, section: "Identitas Desa" },
    { label: "Nomor Surat Permohonan Kepala Desa", key: "nomorSuratDesa", type: "text", required: true, section: "Identitas Desa", placeholder: "cth: 140/DS-PL.B/IV/2026/046" },
    { label: "Tanggal Surat Permohonan Kepala Desa", key: "tanggalSuratDesa", type: "date", required: true, section: "Identitas Desa" },
    { label: "Jabatan Perangkat yang Diberhentikan", key: "jabatan", type: "text", required: true, section: "Data Perangkat", placeholder: "cth: Kasi Pemerintahan" },
  ],
}

export default function BuatSuratPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [jenis, setJenis] = useState<JenisSurat | null>(null)
  const [kategoriFilter, setKategoriFilter] = useState<"semua" | "bbm" | "desa" | "warga">("semua")
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (jenis) {
      setFormData(prev => ({
        ...prev,
        nomorUrut: prev.nomorUrut || (jenis === "bbm_jbt" ? "0039" : "039"),
        nomorBulan: prev.nomorBulan || ROMAN_MONTHS[new Date().getMonth()],
        nomorTahun: prev.nomorTahun || new Date().getFullYear().toString()
      }))
    }
  }, [jenis])

  const jenisList = Object.keys(JENIS_SURAT_LABELS) as JenisSurat[]
  const filteredJenisList = jenisList.filter((key) => {
    if (kategoriFilter === "semua") return true
    return JENIS_SURAT_META[key]?.kategori === kategoriFilter
  })

  const rawFields = jenis ? FORM_FIELDS[jenis] : []
  const fields = [...rawFields]
  if (jenis && !fields.find(f => f.key === "nomorUrut")) {
    fields.unshift({
      label: "Nomor Urut Surat",
      key: "nomorUrut",
      type: "text",
      required: false,
      section: fields[0]?.section || "Identitas Pemohon"
    })
  }

  // Group fields by section
  const sections = fields.reduce<Record<string, typeof fields>>((acc, field) => {
    const section = field.section || "Umum"
    if (!acc[section]) acc[section] = []
    acc[section].push(field)
    return acc
  }, {})

  function handleFieldChange(key: string, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSimpan() {
    setSaving(true)
    try {
      if (jenis) {
        await buatSuratBaru(jenis, formData)
      }
      router.push("/internal/surat")
      router.refresh()
    } catch (e) {
      console.error(e)
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Header GovTech */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/70">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Pelayanan Naskah Dinas · Kecamatan Temiang Pesisir
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2F4A3C] tracking-tight">
          Buat Surat & Rekomendasi Baru
        </h1>
        <p className="text-sm text-gray-600 mt-1 max-w-3xl">
          Pilih format naskah dinas resmi, lengkapi atribut permohonan, dan lakukan validasi pratinjau sebelum diajukan ke meja verifikasi Kasi dan tanda tangan Camat.
        </p>
      </div>

      {/* Stepper Indikator */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {STEPS.map((s, i) => {
            const isDone = i < step
            const isActive = i === step
            return (
              <div
                key={s.no}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all",
                  isActive
                    ? "bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/10"
                    : isDone
                    ? "bg-slate-50/70 border-slate-200/80"
                    : "bg-white border-transparent opacity-60"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0 transition-colors",
                    isDone
                      ? "bg-[#2F4A3C] text-white"
                      : isActive
                      ? "bg-[#D9A400] text-gray-900 shadow-sm"
                      : "bg-gray-100 text-gray-500"
                  )}
                >
                  {isDone ? <Check className="w-4 h-4 text-white" /> : s.no}
                </div>
                <div className="min-w-0">
                  <p className={cn("text-xs font-bold leading-none truncate", isActive ? "text-[#2F4A3C]" : "text-gray-700")}>
                    {s.label}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5 truncate">{s.deskripsi}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step 0: Pilih Format Naskah */}
      {step === 0 && (
        <div className="space-y-6">
          {/* Filter Kategori */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setKategoriFilter("semua")}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                kategoriFilter === "semua"
                  ? "bg-[#2F4A3C] text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-600 hover:text-emerald-700"
              )}
            >
              Semua Format ({jenisList.length})
            </button>
            <button
              onClick={() => setKategoriFilter("bbm")}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
                kategoriFilter === "bbm"
                  ? "bg-[#2F4A3C] text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-600 hover:text-emerald-700"
              )}
            >
              <Fuel className="w-3.5 h-3.5" /> Pelayanan BBM (2)
            </button>
            <button
              onClick={() => setKategoriFilter("desa")}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
                kategoriFilter === "desa"
                  ? "bg-[#2F4A3C] text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-600 hover:text-emerald-700"
              )}
            >
              <Building2 className="w-3.5 h-3.5" /> Pemerintahan Desa (4)
            </button>
            <button
              onClick={() => setKategoriFilter("warga")}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
                kategoriFilter === "warga"
                  ? "bg-[#2F4A3C] text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-600 hover:text-emerald-700"
              )}
            >
              <HeartHandshake className="w-3.5 h-3.5" /> Layanan Warga (2)
            </button>
          </div>

          {/* Grid Format Surat */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {filteredJenisList.map((key) => {
              const meta = JENIS_SURAT_META[key]
              const isSelected = jenis === key
              return (
                <div
                  key={key}
                  onClick={() => setJenis(key)}
                  className={cn(
                    "p-5 rounded-2xl border-2 text-left transition-all cursor-pointer relative flex flex-col justify-between group",
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20"
                      : "border-gray-200/90 bg-white hover:border-emerald-400 hover:shadow-sm"
                  )}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                            meta.kategori === "bbm"
                              ? "bg-amber-100 text-amber-800"
                              : meta.kategori === "desa"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-800"
                          )}
                        >
                          {meta.kategori === "bbm" ? (
                            <Fuel className="w-5 h-5" />
                          ) : meta.kategori === "desa" ? (
                            <Building2 className="w-5 h-5" />
                          ) : (
                            <HeartHandshake className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <span
                            className={cn(
                              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                              meta.kategori === "bbm"
                                ? "bg-amber-100/80 text-amber-800"
                                : meta.kategori === "desa"
                                ? "bg-emerald-100/80 text-emerald-800"
                                : "bg-blue-100/80 text-blue-800"
                            )}
                          >
                            {meta.kategoriLabel}
                          </span>
                        </div>
                      </div>

                      {isSelected ? (
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-emerald-400 shrink-0" />
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-gray-900 leading-snug group-hover:text-emerald-800 transition-colors">
                      {JENIS_SURAT_LABELS[key]}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                      {meta.deskripsi}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-gray-500 truncate max-w-[240px]">
                      {generateNomorSurat(key, 39)}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Pilih Format <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Navigasi Lanjut */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-gray-600 text-center sm:text-left">
              {jenis ? (
                <span>
                  Format dipilih: <strong className="text-[#2F4A3C]">{JENIS_SURAT_LABELS[jenis]}</strong>
                </span>
              ) : (
                <span className="text-gray-400">Silakan klik salah satu format naskah di atas untuk melanjutkan.</span>
              )}
            </div>

            <Button
              onClick={() => jenis && setStep(1)}
              disabled={!jenis}
              className="bg-[#2F4A3C] hover:bg-[#23382d] text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-sm disabled:opacity-40"
            >
              Lanjutkan ke Formulir Data <ChevronRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 1: Isi Data */}
      {step === 1 && jenis && (
        <div className="space-y-6">
          {/* Banner Format Aktif */}
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  {JENIS_SURAT_META[jenis]?.kategoriLabel}
                </span>
                <h2 className="text-sm font-bold text-[#2F4A3C] mt-0.5">
                  {JENIS_SURAT_LABELS[jenis]}
                </h2>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep(0)}
              className="text-xs font-medium border-emerald-300 text-emerald-800 hover:bg-emerald-100/60 rounded-xl"
            >
              Ganti Format Naskah
            </Button>
          </div>

          {/* Formulir Bagian-Bagian */}
          <div className="space-y-6">
            {Object.entries(sections).map(([sectionName, sectionFields]) => (
              <div
                key={sectionName}
                className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 space-y-4"
              >
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D9A400]" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#2F4A3C]">
                    {sectionName}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sectionFields.map((field) => (
                    <div
                      key={field.key}
                      className={cn((field.type === "textarea" || field.type === "checkbox") && "sm:col-span-2")}
                    >
                      {field.type !== "checkbox" && (
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                      )}

                      {field.key === "nomorUrut" ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {jenis === "bbm_jbkp" || jenis === "bbm_jbt" ? (
                            <>
                              <input
                                type="text"
                                value={formData.nomorUrut || ""}
                                onChange={(e) =>
                                  handleFieldChange("nomorUrut", e.target.value.replace(/\D/g, "").slice(0, jenis === "bbm_jbt" ? 4 : 3))
                                }
                                className="w-[76px] border border-gray-300 rounded-xl px-2.5 py-2 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 font-mono text-center"
                                placeholder={jenis === "bbm_jbt" ? "0039" : "039"}
                              />
                              <div className="border border-gray-200 rounded-xl px-3 py-2 text-xs bg-slate-50 text-gray-600 font-mono">
                                / TEMIANG PESISIR / 21 / 21.04 / {jenis === "bbm_jbkp" ? "TRANS / JBKP" : "RT-MIKRO / JBT"} /
                              </div>
                              <select
                                value={formData.nomorBulan || ROMAN_MONTHS[new Date().getMonth()]}
                                onChange={(e) => handleFieldChange("nomorBulan", e.target.value)}
                                className="w-[76px] border border-gray-300 rounded-xl px-2.5 py-2 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 font-mono bg-white text-center cursor-pointer"
                              >
                                {ROMAN_MONTHS.map((m) => (
                                  <option key={m} value={m}>
                                    {m}
                                  </option>
                                ))}
                              </select>
                              <div className="border border-gray-200 rounded-xl px-2 py-2 text-xs bg-slate-50 text-gray-500 font-mono">
                                /
                              </div>
                              <select
                                value={formData.nomorTahun || new Date().getFullYear().toString()}
                                onChange={(e) => handleFieldChange("nomorTahun", e.target.value)}
                                className="w-[88px] border border-gray-300 rounded-xl px-2.5 py-2 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 font-mono bg-white text-center cursor-pointer"
                              >
                                {["2024", "2025", "2026", "2027", "2028", "2029", "2030"].map((y) => (
                                  <option key={y} value={y}>
                                    {y}
                                  </option>
                                ))}
                              </select>
                            </>
                          ) : (
                            <>
                              <div className="border border-gray-200 rounded-xl px-3 py-2 text-xs bg-slate-50 text-gray-700 font-mono font-medium whitespace-nowrap">
                                {NOMOR_FORMAT[jenis] || "451.1/CMT-TP"}/
                              </div>
                              <select
                                value={formData.nomorBulan || ROMAN_MONTHS[new Date().getMonth()]}
                                onChange={(e) => handleFieldChange("nomorBulan", e.target.value)}
                                className="w-[72px] border border-gray-300 rounded-xl px-2 py-2 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 font-mono bg-white text-center cursor-pointer"
                              >
                                {ROMAN_MONTHS.map((m) => (
                                  <option key={m} value={m}>
                                    {m}
                                  </option>
                                ))}
                              </select>
                              <div className="border border-gray-200 rounded-xl px-2 py-2 text-xs bg-slate-50 text-gray-500 font-mono">
                                /
                              </div>
                              <select
                                value={formData.nomorTahun || new Date().getFullYear().toString()}
                                onChange={(e) => handleFieldChange("nomorTahun", e.target.value)}
                                className="w-[84px] border border-gray-300 rounded-xl px-2.5 py-2 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 font-mono bg-white text-center cursor-pointer"
                              >
                                {["2024", "2025", "2026", "2027", "2028", "2029", "2030"].map((y) => (
                                  <option key={y} value={y}>
                                    {y}
                                  </option>
                                ))}
                              </select>
                              <div className="border border-gray-200 rounded-xl px-2 py-2 text-xs bg-slate-50 text-gray-500 font-mono">
                                /
                              </div>
                              <input
                                type="text"
                                value={formData.nomorUrut || ""}
                                onChange={(e) => handleFieldChange("nomorUrut", e.target.value.replace(/\D/g, "").slice(0, 4))}
                                className="w-[76px] border border-gray-300 rounded-xl px-2.5 py-2 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 font-mono text-center"
                                placeholder="001"
                              />
                            </>
                          )}
                        </div>
                      ) : field.type === "select" ? (
                        <select
                          value={formData[field.key] || ""}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 bg-white"
                          required={field.required}
                        >
                          <option value="">Pilih opsi...</option>
                          {field.options?.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      ) : field.type === "checkbox" ? (
                        <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-colors">
                          <input
                            type="checkbox"
                            checked={formData[field.key] === "true"}
                            onChange={(e) => handleFieldChange(field.key, e.target.checked ? "true" : "false")}
                            className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-emerald-700 cursor-pointer flex-shrink-0"
                          />
                          <span className="text-xs text-gray-800 font-medium leading-relaxed">{field.label}</span>
                        </label>
                      ) : field.type === "textarea" ? (
                        <textarea
                          value={formData[field.key] || ""}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          rows={3}
                          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 resize-none"
                          required={field.required}
                        />
                      ) : (
                        <input
                          type={field.type}
                          value={formData[field.key] || ""}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          placeholder={field.placeholder || ""}
                          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                          required={field.required}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Navigasi Formulir */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(0)}
              className="text-xs font-semibold rounded-xl border-gray-300"
            >
              <ChevronLeft className="w-4 h-4 mr-1.5" /> Kembali ke Format
            </Button>
            <Button
              onClick={() => setStep(2)}
              className="bg-[#2F4A3C] hover:bg-[#23382d] text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-sm"
            >
              Pratinjau Dokumen <ChevronRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Pratinjau & Simpan */}
      {step === 2 && jenis && (
        <div className="space-y-6">
          {/* Ringkasan Metadata Naskah */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#D9A400]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#2F4A3C]">
                Ringkasan Berkas Naskah Dinas
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-gray-500 block text-[11px]">Format Surat</span>
                <span className="font-bold text-gray-900 mt-0.5 block truncate">
                  {JENIS_SURAT_LABELS[jenis]}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-gray-500 block text-[11px]">Nomor Surat Sementara</span>
                <span className="font-bold font-mono text-emerald-800 mt-0.5 block truncate">
                  {generateNomorSurat(jenis, formData.nomorUrut ? formData.nomorUrut : 39, formData.nomorBulan, formData.nomorTahun)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-gray-500 block text-[11px]">Pemohon / Atas Nama</span>
                <span className="font-bold text-gray-900 mt-0.5 block truncate">
                  {formData.pemohon || formData.namaPemohon || formData.pewaris || formData.namaSuami || "Pemohon"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-gray-500 block text-[11px]">Wilayah / Desa</span>
                <span className="font-bold text-gray-900 mt-0.5 block truncate">
                  Desa {formData.desa || formData.desaPengantar || "Temiang"}
                </span>
              </div>
            </div>
          </div>

          {/* Iframe Pratinjau Dokumen e-TEPI */}
          <div className="bg-white rounded-2xl border border-gray-300 shadow-md overflow-hidden">
            <div className="bg-slate-100 px-4 py-2.5 text-xs text-slate-600 font-medium border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="ml-2 font-mono text-[11px] text-slate-500">
                  Pratinjau Cetak e-TEPI (Kecamatan Temiang Pesisir)
                </span>
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Dokumen Resmi
              </span>
            </div>

            <iframe
              srcDoc={generateSuratHTML({
                id: "DRAF",
                nomor: generateNomorSurat(jenis, formData.nomorUrut ? formData.nomorUrut : 39, formData.nomorBulan, formData.nomorTahun),
                jenis: jenis,
                judul: JENIS_SURAT_LABELS[jenis],
                pemohon: formData.pemohon || formData.namaPemohon || formData.pewaris || formData.namaSuami || "Pemohon",
                desa: formData.desa || formData.desaPengantar || "-",
                tanggal_buat: new Date().toISOString(),
                status: "draf",
                dibuat_oleh: "Sistem",
                data_form: formData,
              } as any)}
              className="w-full h-[640px] border-0"
              title="Preview Cetak Surat"
            />
          </div>

          {/* Alert Panduan Simpan Draf */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3 shadow-sm">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Ketentuan Penerbitan Dokumen:</p>
              <p className="mt-0.5 text-amber-800/90 leading-relaxed">
                Naskah dinas akan disimpan sebagai <strong>Draf</strong>. Berkas ini selanjutnya akan diverifikasi oleh Kasi terkait, dan diteruskan ke Camat Temiang Pesisir untuk pembubuhan tanda tangan elektronik resmi sebelum dapat dicetak dan didistribusikan.
              </p>
            </div>
          </div>

          {/* Aksi Simpan */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              disabled={saving}
              className="text-xs font-semibold rounded-xl border-gray-300"
            >
              <ChevronLeft className="w-4 h-4 mr-1.5" /> Kembali ke Formulir
            </Button>
            <Button
              onClick={handleSimpan}
              disabled={saving}
              className="bg-[#2F4A3C] hover:bg-[#23382d] text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-sm"
            >
              {saving ? "Menyimpan Draf..." : "Simpan sebagai Draf Naskah"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
