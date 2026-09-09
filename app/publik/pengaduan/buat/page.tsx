"use client"

import { useState, useRef } from "react"
import { DESA_LIST } from "@/lib/mock-data/desa"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { generateTiketPengaduan } from "@/lib/nomor-surat"
import { CheckCircle2, Copy, FileText, ClipboardCheck, ImageIcon, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { simpanPengaduan } from "../actions"
import { compressImage } from "@/lib/utils/compress-image"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"

export default function BuatPengaduanPage() {
  const [nama, setNama] = useState("")
  const [kontak, setKontak] = useState("")
  const [desa, setDesa] = useState("")
  const [kategori, setKategori] = useState("")
  const [judul, setJudul] = useState("")
  const [deskripsi, setDeskripsi] = useState("")
  const [lokasi, setLokasi] = useState("")

  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const [ticket, setTicket] = useState("")
  const [copied, setCopied] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      setUploadError("File harus berupa gambar (JPG, PNG, dll)")
      return
    }

    // Validasi ukuran max 10MB sebelum kompresi
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Ukuran file maksimal 10MB")
      return
    }

    setUploadError(null)
    setFotoFile(file)

    // Buat preview URL
    const previewUrl = URL.createObjectURL(file)
    setFotoPreview(previewUrl)
  }

  function handleHapusFoto() {
    setFotoFile(null)
    if (fotoPreview) {
      URL.revokeObjectURL(fotoPreview)
      setFotoPreview(null)
    }
    if (fileInputRef.current) fileInputRef.current.value = ""
    setUploadError(null)
  }

  async function uploadFoto(tiket: string): Promise<string | null> {
    if (!fotoFile) return null

    setUploading(true)
    try {
      // Kompresi gambar sebelum upload
      const compressed = await compressImage(fotoFile, 1200, 0.82)

      const supabase = createClient()
      const ext = "jpg"
      const fileName = `${tiket}-${Date.now()}.${ext}`
      const filePath = `pengaduan/${fileName}`

      const { error: uploadErr } = await supabase.storage
        .from("pengaduan-foto")
        .upload(filePath, compressed, {
          contentType: "image/jpeg",
          upsert: false,
        })

      if (uploadErr) {
        setUploadError(`Gagal upload foto: ${uploadErr.message}`)
        return null
      }

      // Ambil public URL
      const { data: urlData } = supabase.storage
        .from("pengaduan-foto")
        .getPublicUrl(filePath)

      return urlData.publicUrl
    } catch (err) {
      setUploadError("Terjadi kesalahan saat memproses foto")
      return null
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const generatedTicket = generateTiketPengaduan()

      // Upload foto jika ada
      let fotoUrl: string | null = null
      if (fotoFile) {
        fotoUrl = await uploadFoto(generatedTicket)
        // Jika upload gagal, hentikan submit
        if (uploadError) {
          setSubmitting(false)
          return
        }
      }

      await simpanPengaduan({
        tiket: generatedTicket,
        nama,
        kontak,
        desa,
        kategori,
        judul,
        deskripsi,
        lokasi,
        foto_url: fotoUrl || undefined,
      })

      setTicket(generatedTicket)
    } catch (err) {
      setError("Terjadi kesalahan saat mengirim laporan. Silakan coba lagi.")
    } finally {
      setSubmitting(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(ticket)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (ticket) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="w-16 h-16 text-green-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-serif font-bold text-hijau">Laporan Berhasil Terkirim</h1>
          <p className="text-sm text-teks/70">
            Terima kasih atas laporan Anda. Laporan Anda telah tersimpan dengan nomor tiket berikut:
          </p>
        </div>

        <div className="bg-white border-2 border-kuning rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 shadow-md max-w-sm mx-auto">
          <span className="text-xs uppercase tracking-widest font-bold text-teks/50">Nomor Tiket Anda</span>
          <span className="text-3xl font-mono font-bold text-hijau tracking-wider">{ticket}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-kuning font-bold hover:underline"
          >
            {copied ? (
              <>
                <ClipboardCheck className="w-3.5 h-3.5" /> Disalin ke clipboard
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Salin Tiket
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-teks/50 max-w-sm mx-auto">
          Simpan baik-baik nomor tiket ini. Anda dapat menggunakannya untuk memantau proses tindak lanjut dari petugas kami pada halaman pantau aduan.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <Link href={`/publik/pengaduan/${ticket}`}>
            <Button>
              Pantau Detail Laporan
            </Button>
          </Link>
          <Link href="/publik">
            <Button variant="outline">
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <PageHeader
        title="Buat Pengaduan Masyarakat"
        subtitle="Laporkan permasalahan di sekitar Anda agar segera ditindaklanjuti"
      />

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-kuning-muda p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nama */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-teks/60 mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama Anda"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning"
            />
          </div>

          {/* Nomor HP */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-teks/60 mb-1.5">
              Nomor WhatsApp / HP
            </label>
            <input
              type="tel"
              required
              value={kontak}
              onChange={(e) => setKontak(e.target.value)}
              placeholder="Contoh: 0812xxxxxxxx"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning"
            />
          </div>

          {/* Desa */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-teks/60 mb-1.5">
              Lokasi Desa
            </label>
            <select
              required
              value={desa}
              onChange={(e) => setDesa(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning"
            >
              <option value="">Pilih Desa...</option>
              {DESA_LIST.map((d) => (
                <option key={d} value={d}>Desa {d}</option>
              ))}
            </select>
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-teks/60 mb-1.5">
              Kategori Permasalahan
            </label>
            <select
              required
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning"
            >
              <option value="">Pilih Kategori...</option>
              <option value="infrastruktur">Infrastruktur (Jalan, Jembatan, Lampu)</option>
              <option value="lingkungan">Lingkungan (Sampah, Sungai, Pantai)</option>
              <option value="pelayanan">Pelayanan Publik (KTP, Dokumen)</option>
              <option value="sosial">Bantuan Sosial (PKH, BLT)</option>
              <option value="keamanan">Keamanan &amp; Ketertiban</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        {/* Judul */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-teks/60 mb-1.5">
            Judul Singkat Laporan
          </label>
          <input
            type="text"
            required
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="Tuliskan inti masalah secara singkat"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning"
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-teks/60 mb-1.5">
            Rincian Deskripsi Pengaduan
          </label>
          <textarea
            required
            rows={5}
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Tuliskan secara lengkap detail kejadian, kondisi, dan keluhan Anda"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning resize-none"
          />
        </div>

        {/* Detail Lokasi */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-teks/60 mb-1.5">
            Detail Lokasi Fisik / Landmark (Opsional)
          </label>
          <input
            type="text"
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            placeholder="Contoh: Depan SD, Sebelah mushola..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning"
          />
        </div>

        {/* Foto */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-teks/60 mb-1.5">
            Lampirkan Foto Bukti Fisik (Opsional)
          </label>

          {fotoPreview ? (
            /* Preview foto yang dipilih */
            <div className="relative rounded-xl overflow-hidden border border-kuning-muda bg-krem">
              <Image
                src={fotoPreview}
                alt="Preview foto bukti"
                width={800}
                height={400}
                className="w-full max-h-64 object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={handleHapusFoto}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow text-red-600 transition-colors"
                title="Hapus foto"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="px-3 py-2 flex items-center gap-2 text-xs text-teks/60 bg-white border-t border-kuning-muda">
                <ImageIcon className="w-3.5 h-3.5 text-hijau" />
                <span className="truncate max-w-xs">{fotoFile?.name}</span>
                <span className="ml-auto text-teks/40 shrink-0">
                  {fotoFile ? `${(fotoFile.size / 1024).toFixed(0)} KB` : ""}
                </span>
              </div>
              <div className="px-3 pb-2 text-[10px] text-teks/40">
                Foto akan dikompresi otomatis sebelum diunggah
              </div>
            </div>
          ) : (
            /* Input file */
            <label className="flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed border-kuning rounded-xl px-4 py-8 cursor-pointer bg-krem/30 hover:bg-krem/60 transition-colors">
              <ImageIcon className="w-8 h-8 text-kuning/60" />
              <span className="text-sm font-semibold text-teks/60">Klik untuk pilih foto</span>
              <span className="text-xs text-teks/40">JPG, PNG, WEBP — maks. 10MB (dikompresi otomatis)</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFotoChange}
              />
            </label>
          )}

          {uploadError && (
            <p className="mt-1.5 text-xs text-red-600 font-medium">{uploadError}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            disabled={submitting || uploading}
            className="w-full py-3.5 text-xs font-bold tracking-wider uppercase"
          >
            {submitting || uploading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {uploading ? "Mengunggah Foto..." : "Mengirim Laporan..."}
              </span>
            ) : (
              "Kirim Pengaduan Sekarang"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
