"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { JENIS_SURAT_LABELS, JenisSurat, DESA_LIST as DESA_LIST_TYPE } from "@/lib/mock-data/surat"
import { DESA_LIST } from "@/lib/mock-data/desa"
import { ChevronLeft, Save, Eye } from "lucide-react"
import Link from "next/link"
import { editSurat } from "../../actions"
import { generateSuratHTML } from "@/lib/mock-data/generate-surat"
import { generateNomorSurat } from "@/lib/mock-data/surat"

const FORM_FIELDS: Record<string, { label: string; key: string; type: string; required: boolean; options?: string[]; section?: string; placeholder?: string }[]> = {
  dispensasi_nikah: [
    { label: "Nama Calon Suami", key: "namaSuami", type: "text", required: true, section: "Data Calon Suami" },
    { label: "Tempat Lahir", key: "tempatLahirSuami", type: "text", required: true, section: "Data Calon Suami" },
    { label: "Tanggal Lahir", key: "tanggalLahirSuami", type: "date", required: true, section: "Data Calon Suami" },
    { label: "Jenis Kelamin", key: "jkSuami", type: "select", required: true, options: ["Laki-laki", "Perempuan"], section: "Data Calon Suami" },
    { label: "Agama", key: "agamaSuami", type: "select", required: true, options: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"], section: "Data Calon Suami" },
    { label: "Status Perkawinan", key: "statusSuami", type: "select", required: true, options: ["Jejaka", "Duda Mati", "Duda Cerai"], section: "Data Calon Suami" },
    { label: "Pekerjaan", key: "pekerjaanSuami", type: "select", required: true, options: ["Belum/Tidak Bekerja", "Mengurus Rumah Tangga", "Pelajar/Mahasiswa", "PNS", "PPPK", "TNI", "POLRI", "Karyawan Swasta", "Karyawan BUMN", "Wiraswasta", "Petani/Pekebun", "Nelayan", "Pedagang", "Buruh Harian Lepas", "Lainnya"], section: "Data Calon Suami" },
    { label: "Alamat Calon Suami", key: "alamatSuami", type: "textarea", required: true, section: "Data Calon Suami" },
    { label: "Nama Calon Istri", key: "namaIstri", type: "text", required: true, section: "Data Calon Istri" },
    { label: "Tempat Lahir", key: "tempatLahirIstri", type: "text", required: true, section: "Data Calon Istri" },
    { label: "Tanggal Lahir", key: "tanggalLahirIstri", type: "date", required: true, section: "Data Calon Istri" },
    { label: "Jenis Kelamin", key: "jkIstri", type: "select", required: true, options: ["Perempuan", "Laki-laki"], section: "Data Calon Istri" },
    { label: "Agama", key: "agamaIstri", type: "select", required: true, options: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"], section: "Data Calon Istri" },
    { label: "Status Perkawinan", key: "statusIstri", type: "select", required: true, options: ["Perawan", "Janda Mati", "Janda Cerai"], section: "Data Calon Istri" },
    { label: "Pekerjaan", key: "pekerjaanIstri", type: "select", required: true, options: ["Belum/Tidak Bekerja", "Mengurus Rumah Tangga", "Pelajar/Mahasiswa", "PNS", "PPPK", "TNI", "POLRI", "Karyawan Swasta", "Karyawan BUMN", "Wiraswasta", "Petani/Pekebun", "Nelayan", "Pedagang", "Buruh Harian Lepas", "Lainnya"], section: "Data Calon Istri" },
    { label: "Alamat Calon Istri", key: "alamatIstri", type: "textarea", required: true, section: "Data Calon Istri" },
    { label: "Desa/Kelurahan Pengantar N1-N4", key: "desaPengantar", type: "select", required: true, options: DESA_LIST, section: "Rencana Pernikahan" },
    { label: "Tanggal Surat N1-N4", key: "tanggalSuratDesa", type: "date", required: true, section: "Rencana Pernikahan" },
    { label: "Tanggal Rencana Akad Nikah", key: "tanggalNikah", type: "date", required: true, section: "Rencana Pernikahan" },
    { label: "Tempat Akad Nikah", key: "tempatNikah", type: "text", required: true, section: "Rencana Pernikahan" },
  ],
  bbm_jbkp: [
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
    { label: "Nama Pemohon", key: "pemohon", type: "text", required: true, section: "Identitas Pemohon" },
    { label: "NIK", key: "nik", type: "text", required: true, section: "Identitas Pemohon" },
    { label: "Desa", key: "desa", type: "select", required: true, options: DESA_LIST, section: "Identitas Pemohon" },
    { label: "Alamat Lengkap", key: "alamat", type: "text", required: true, section: "Identitas Pemohon" },
    { label: "Jenis BBM Tertentu", key: "jenisBBM", type: "select", required: true, options: ["Minyak Tanah", "Bio Solar"], section: "Detail BBM" },
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
  ],
  tunda_salur_add: [
    { label: "Nama Desa", key: "desa", type: "select", required: true, options: DESA_LIST, section: "Identitas Desa" },
    { label: "Kepala Desa", key: "kepalaDesa", type: "text", required: true, section: "Identitas Desa" },
    { label: "Bulan ADD yang Ditunda Salur", key: "bulan", type: "select", required: true, options: ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"], section: "Detail Tunda Salur" },
    { label: "Tahun Anggaran", key: "tahun", type: "text", required: true, section: "Detail Tunda Salur" },
    { label: "Tanggal Verifikasi", key: "tanggalVerifikasi", type: "date", required: true, section: "Detail Tunda Salur" },
    { label: "Catatan Verifikasi", key: "keterangan", type: "textarea", required: false, section: "Detail Tunda Salur" },
  ],
  ahli_waris: [
    { label: "Nama Almarhum/Almarhumah", key: "pewaris", type: "text", required: true, section: "Data Pewaris" },
    { label: "NIK Almarhum/Almarhumah", key: "nikPewaris", type: "text", required: true, section: "Data Pewaris" },
    { label: "Tempat Lahir Almarhum", key: "tempatLahirPewaris", type: "text", required: false, section: "Data Pewaris" },
    { label: "Tanggal Lahir Almarhum", key: "tanggalLahirPewaris", type: "date", required: false, section: "Data Pewaris" },
    { label: "Jenis Kelamin Almarhum", key: "jkPewaris", type: "select", required: false, options: ["Laki-Laki", "Perempuan"], section: "Data Pewaris" },
    { label: "Agama Almarhum", key: "agamaPewaris", type: "select", required: false, options: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"], section: "Data Pewaris" },
    { label: "Pekerjaan Almarhum", key: "pekerjaanPewaris", type: "text", required: false, section: "Data Pewaris" },
    { label: "Alamat Almarhum", key: "alamatPewaris", type: "text", required: false, section: "Data Pewaris" },
    { label: "Desa Terakhir Almarhum", key: "desa", type: "select", required: true, options: DESA_LIST, section: "Data Pewaris" },
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

interface EditSuratClientProps {
  suratId: string
  jenis: JenisSurat
  nomor: string
  initialData: Record<string, string>
}

export default function EditSuratClient({ suratId, jenis, nomor, initialData }: EditSuratClientProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Record<string, string>>(initialData)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const fields = FORM_FIELDS[jenis] || []
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
      await editSurat(suratId, formData)
      router.push(`/internal/surat/${suratId}`)
      router.refresh()
    } catch (e) {
      console.error(e)
      setSaving(false)
    }
  }

  const previewHTML = showPreview ? generateSuratHTML({
    id: suratId,
    nomor,
    jenis,
    judul: JENIS_SURAT_LABELS[jenis] || jenis,
    pemohon: formData.pemohon || formData.namaSuami || "Pemohon",
    desa: formData.desa || "-",
    tanggal_buat: new Date().toISOString(),
    status: "draf",
    dibuat_oleh: "Sistem",
    data_form: formData,
  } as any) : ""

  return (
    <div>
      <PageHeader
        title={`Edit: ${JENIS_SURAT_LABELS[jenis] || jenis}`}
        subtitle={`Nomor: ${nomor}`}
      >
        <Link href={`/internal/surat/${suratId}`}>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
            <ChevronLeft className="w-4 h-4" /> Batal
          </button>
        </Link>
      </PageHeader>

      <div className="bg-white rounded-xl border border-kuning-muda p-6 mb-5">
        <div className="space-y-6">
          {Object.entries(sections).map(([sectionName, sectionFields]) => (
            <div key={sectionName}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-hijau mb-3 pb-1 border-b border-kuning-muda">{sectionName}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sectionFields.map((field) => (
                  <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                    <label className="block text-xs font-semibold text-teks/60 mb-1.5">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === "select" ? (
                      <select
                        value={formData[field.key] || ""}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning bg-white"
                      >
                        <option value="">Pilih...</option>
                        {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        value={formData[field.key] || ""}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        rows={3}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning resize-none"
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.key] || ""}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder || ""}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-8 gap-3 flex-wrap">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Eye className="w-4 h-4" /> {showPreview ? "Sembunyikan" : "Pratinjau"}
          </button>
          <Button onClick={handleSimpan} disabled={saving}>
            <Save className="w-4 h-4" />
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </div>

      {showPreview && (
        <div className="bg-white rounded-xl border border-kuning-muda overflow-hidden mb-5">
          <div className="bg-gray-50 px-3 py-1.5 text-xs text-gray-500 font-medium border-b flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block" /> Pratinjau
          </div>
          <iframe
            srcDoc={previewHTML}
            className="w-full h-[600px] border-0"
            title="Preview Edit Surat"
          />
        </div>
      )}
    </div>
  )
}
