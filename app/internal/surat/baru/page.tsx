"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { JENIS_SURAT_LABELS, JenisSurat, NOMOR_FORMAT, generateNomorSurat, ROMAN_MONTHS } from "@/lib/mock-data/surat"
import { DESA_LIST } from "@/lib/mock-data/desa"
import { ChevronRight, ChevronLeft, FileText, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { buatSuratBaru } from "../actions"
import { generateSuratHTML } from "@/lib/mock-data/generate-surat"
import Image from "next/image"

const STEPS = ["Pilih Jenis Surat", "Isi Data", "Pratinjau & Simpan"]

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
    <div>
      <PageHeader
        title="Buat Surat Baru"
        subtitle="Isi formulir sesuai jenis surat yang dipilih"
      />

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-7">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={cn(
              "flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0",
              i < step ? "bg-hijau text-white" : i === step ? "bg-kuning text-teks" : "bg-gray-200 text-gray-500"
            )}>
              {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={cn("text-sm font-medium hidden sm:block", i === step ? "text-teks" : "text-teks/50")}>{s}</span>
            {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-kuning-muda">
        {/* Step 1: Pilih Jenis */}
        {step === 0 && (
          <div className="p-6">
            <h2 className="text-lg font-bold font-serif text-hijau mb-4">Pilih Jenis Surat/Rekomendasi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {jenisList.map((key) => (
                <button
                  key={key}
                  onClick={() => setJenis(key)}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all",
                    jenis === key
                      ? "border-kuning bg-kuning-muda"
                      : "border-gray-200 hover:border-kuning-muda hover:bg-krem"
                  )}
                >
                  <FileText className={cn("w-5 h-5 mt-0.5 shrink-0", jenis === key ? "text-kuning" : "text-gray-400")} />
                  <div>
                    <p className="font-semibold text-sm text-teks">{JENIS_SURAT_LABELS[key]}</p>
                    <p className="text-xs text-teks/50 mt-0.5 font-mono truncate max-w-[200px]" title={generateNomorSurat(key as JenisSurat, 39)}>{generateNomorSurat(key as JenisSurat, 39)}</p>
                  </div>
                  {jenis === key && <Check className="w-4 h-4 text-kuning ml-auto shrink-0" />}
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={() => jenis && setStep(1)} disabled={!jenis}>
                Lanjut <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Isi Data */}
        {step === 1 && jenis && (
          <div className="p-6">
            <h2 className="text-lg font-bold font-serif text-hijau mb-1">Isi Data Surat</h2>
            <p className="text-sm text-teks/60 mb-6">{JENIS_SURAT_LABELS[jenis]}</p>

            <div className="space-y-6">
              {Object.entries(sections).map(([sectionName, sectionFields]) => (
                <div key={sectionName}>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-hijau mb-3 pb-1 border-b border-kuning-muda">{sectionName}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sectionFields.map((field) => (
                      <div key={field.key} className={cn((field.type === "textarea" || field.type === "checkbox") && "sm:col-span-2")}>
                        {field.type !== "checkbox" && (
                          <label className="block text-xs font-semibold text-teks/60 mb-1.5">
                            {field.label} {field.required && <span className="text-merah">*</span>}
                          </label>
                        )}
                        {field.key === "nomorUrut" ? (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {jenis === "bbm_jbkp" || jenis === "bbm_jbt" ? (
                              <>
                                <input
                                  type="text"
                                  value={formData.nomorUrut || ""}
                                  onChange={(e) => handleFieldChange("nomorUrut", e.target.value.replace(/\D/g, '').slice(0, jenis === "bbm_jbt" ? 4 : 3))}
                                  className="w-[72px] border border-gray-200 rounded-lg px-2 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning font-mono text-center"
                                  placeholder={jenis === "bbm_jbt" ? "0039" : "039"}
                                />
                                <div className="border border-gray-200 rounded-lg px-2 py-2.5 text-sm bg-gray-50 text-gray-500 font-mono">
                                  / TEMIANG PESISIR / 21 / 21.04 / {jenis === "bbm_jbkp" ? "TRANS / JBKP" : "RT-MIKRO / JBT"} /
                                </div>
                                <select
                                  value={formData.nomorBulan || ROMAN_MONTHS[new Date().getMonth()]}
                                  onChange={(e) => handleFieldChange("nomorBulan", e.target.value)}
                                  className="w-[72px] border border-gray-200 rounded-lg px-2 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning font-mono bg-white text-center appearance-none cursor-pointer"
                                >
                                  {ROMAN_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <div className="border border-gray-200 rounded-lg px-2 py-2.5 text-sm bg-gray-50 text-gray-500 font-mono">
                                  /
                                </div>
                              </>
                            ) : (
                              <>
                                {/* template: prefix otomatis */}
                                <div className="border border-gray-200 rounded-lg px-2.5 py-2.5 text-sm bg-gray-50 text-gray-700 font-mono font-medium whitespace-nowrap">
                                  {NOMOR_FORMAT[jenis] || "451.1/CMT-TP"}/
                                </div>
                                {/* dropdown bulan (romawi) */}
                                <select
                                  value={formData.nomorBulan || ROMAN_MONTHS[new Date().getMonth()]}
                                  onChange={(e) => handleFieldChange("nomorBulan", e.target.value)}
                                  className="w-[68px] border border-gray-200 rounded-lg px-2 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning font-mono bg-white text-center appearance-none cursor-pointer"
                                >
                                  {ROMAN_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <div className="border border-gray-200 rounded-lg px-2 py-2.5 text-sm bg-gray-50 text-gray-500 font-mono">/</div>
                                {/* dropdown tahun */}
                                <select
                                  value={formData.nomorTahun || new Date().getFullYear().toString()}
                                  onChange={(e) => handleFieldChange("nomorTahun", e.target.value)}
                                  className="w-[84px] border border-gray-200 rounded-lg px-2 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning font-mono bg-white text-center appearance-none cursor-pointer"
                                >
                                  {['2024','2025','2026','2027','2028','2029','2030'].map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                                <div className="border border-gray-200 rounded-lg px-2 py-2.5 text-sm bg-gray-50 text-gray-500 font-mono">/</div>
                                {/* manual urut */}
                                <input
                                  type="text"
                                  value={formData.nomorUrut || ""}
                                  onChange={(e) => handleFieldChange("nomorUrut", e.target.value.replace(/\D/g, '').slice(0, 4))}
                                  className="w-[72px] border border-gray-200 rounded-lg px-2 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning font-mono text-center"
                                  placeholder="001"
                                />
                              </>
                            )}
                            {/* Untuk BBM: tahun di akhir */}
                            {(jenis === "bbm_jbkp" || jenis === "bbm_jbt") && (
                              <select
                                value={formData.nomorTahun || new Date().getFullYear().toString()}
                                onChange={(e) => handleFieldChange("nomorTahun", e.target.value)}
                                className="w-[84px] border border-gray-200 rounded-lg px-2 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning font-mono bg-white text-center appearance-none cursor-pointer"
                              >
                                {['2024','2025','2026','2027','2028','2029','2030'].map(y => <option key={y} value={y}>{y}</option>)}
                              </select>
                            )}
                          </div>
                        ) : field.type === "select" ? (
                          <select
                            value={formData[field.key] || ""}
                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning bg-white"
                            required={field.required}
                          >
                            <option value="">Pilih...</option>
                            {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : field.type === "checkbox" ? (
                          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-kuning hover:bg-kuning/5 transition-colors">
                            <input
                              type="checkbox"
                              checked={formData[field.key] === "true"}
                              onChange={(e) => handleFieldChange(field.key, e.target.checked ? "true" : "false")}
                              className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-hijau cursor-pointer flex-shrink-0"
                            />
                            <span className="text-sm text-teks font-medium leading-snug">{field.label}</span>
                          </label>
                        ) : field.type === "textarea" ? (
                          <textarea
                            value={formData[field.key] || ""}
                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                            rows={3}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning resize-none"
                            required={field.required}
                          />
                        ) : (
                          <input
                            type={field.type}
                            value={formData[field.key] || ""}
                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                            placeholder={field.placeholder || ""}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning"
                            required={field.required}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setStep(0)}>
                <ChevronLeft className="w-4 h-4" /> Kembali
              </Button>
              <Button onClick={() => setStep(2)}>
                Pratinjau <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 2 && jenis && (
          <div className="p-6">
            <h2 className="text-lg font-bold font-serif text-hijau mb-4">Pratinjau Draf Surat</h2>
            
            <div className="border border-gray-300 rounded-lg overflow-hidden mb-6 bg-white shadow-sm">
              <div className="bg-gray-50 px-3 py-1.5 text-xs text-gray-500 font-medium border-b flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block" /> Pratinjau Tampilan Cetak (PDF e-TEPI Style)
              </div>
              
              <iframe
                srcDoc={generateSuratHTML({
                  id: "DRAF",
                  nomor: generateNomorSurat(jenis, formData.nomorUrut ? formData.nomorUrut : 39, formData.nomorBulan, formData.nomorTahun),
                  jenis: jenis,
                  judul: JENIS_SURAT_LABELS[jenis],
                  pemohon: formData.pemohon || formData.namaPemohon || "Pemohon",
                  desa: formData.desa || "-",
                  tanggal_buat: new Date().toISOString(),
                  status: "draf",
                  dibuat_oleh: "Sistem",
                  data_form: formData
                } as any)}
                className="w-full h-[600px] border-0"
                title="Preview Cetak Surat"
              />
            </div>

            <div className="bg-kuning-muda border border-kuning/30 rounded-lg p-3 text-sm text-teks/70 mb-4">
              <strong>Catatan:</strong> Surat akan disimpan sebagai <em>Draf</em>. Selanjutnya Kasi akan memverifikasi sebelum diteruskan ke Camat untuk ditandatangani.
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ChevronLeft className="w-4 h-4" /> Kembali
              </Button>
              <Button onClick={handleSimpan} disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan sebagai Draf"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
