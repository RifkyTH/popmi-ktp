"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { DESA_LIST } from "@/lib/mock-data/desa"
import { generateTiketPengaduan } from "@/lib/nomor-surat"
import {
  CheckCircle2,
  Copy,
  FileText,
  ClipboardCheck,
  ImageIcon,
  X,
  Loader2,
  Navigation2,
  MapPin,
  CheckCircle,
  Send,
} from "lucide-react"
import { simpanPengaduan } from "../actions"
import { compressImage } from "@/lib/utils/compress-image"
import { createClient } from "@/lib/supabase/client"

export default function BuatPengaduanPage() {
  const [nama, setNama] = useState("")
  const [kontak, setKontak] = useState("")
  const [desa, setDesa] = useState("")
  const [kategori, setKategori] = useState("")
  const [judul, setJudul] = useState("")
  const [deskripsi, setDeskripsi] = useState("")
  const [lokasi, setLokasi] = useState("")

  // GPS state
  const [gpsLat, setGpsLat] = useState<number | null>(null)
  const [gpsLng, setGpsLng] = useState<number | null>(null)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [gpsError, setGpsError] = useState<string | null>(null)

  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const [ticket, setTicket] = useState("")
  const [copied, setCopied] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleAmbilGPS() {
    if (!navigator.geolocation) {
      setGpsError("Browser Anda tidak mendukung GPS")
      return
    }
    setGpsLoading(true)
    setGpsError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLat(pos.coords.latitude)
        setGpsLng(pos.coords.longitude)
        setGpsLoading(false)
      },
      (err) => {
        setGpsLoading(false)
        if (err.code === 1) setGpsError("Izin lokasi ditolak. Aktifkan GPS di browser Anda.")
        else if (err.code === 2) setGpsError("Lokasi tidak tersedia. Pastikan GPS aktif.")
        else setGpsError("Gagal mendapatkan lokasi. Coba lagi.")
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  function handleHapusGPS() {
    setGpsLat(null)
    setGpsLng(null)
    setGpsError(null)
  }

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
        lat: gpsLat ?? undefined,
        lng: gpsLng ?? undefined,
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
      <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
        {/* Receipt Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-md relative overflow-hidden text-center space-y-6">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#2F4A3C] via-[#D9A400] to-[#10B981]" />

          {/* Success Icon */}
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D9A400]">
              Tanda Bukti Registrasi Aduan
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F4A3C]">
              Laporan Berhasil Diterima
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Terima kasih atas partisipasi Anda. Laporan telah masuk ke sistem antrean pelayanan Kecamatan Temiang Pesisir.
            </p>
          </div>

          {/* Ticket Card */}
          <div className="bg-slate-50/80 border-2 border-dashed border-[#D9A400]/60 rounded-2xl p-5 max-w-sm mx-auto space-y-2">
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
              Nomor Tiket Resmi Anda
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-[#2F4A3C] tracking-wider">
              {ticket}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2F4A3C] hover:text-[#D9A400] bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs transition-colors"
            >
              {copied ? (
                <>
                  <ClipboardCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Berhasil Disalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Salin Nomor Tiket</span>
                </>
              )}
            </button>
          </div>

          {/* Guidelines */}
          <div className="text-left bg-emerald-50/60 rounded-xl p-4 border border-emerald-100 text-xs text-emerald-900 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-emerald-800">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              Langkah Selanjutnya:
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              1. Simpan nomor tiket ini untuk pengecekan berkala.<br />
              2. Petugas kecamatan akan menelaah laporan Anda dalam 1×24 jam kerja.<br />
              3. Status penanganan dan foto tindak lanjut dapat dilihat langsung pada menu Lacak Aduan.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link href={`/publik/pengaduan/${ticket}`} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-[#2F4A3C] hover:bg-[#23382D] text-white font-bold px-6 py-3 rounded-xl border border-[#D9A400]/40 shadow-sm text-xs uppercase tracking-wider transition-all">
                Pantau Detail Laporan Ini
              </button>
            </Link>
            <Link href="/publik" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold px-6 py-3 rounded-xl shadow-2xs text-xs uppercase tracking-wider transition-all">
                Kembali ke Beranda
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D9A400]/40 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D9A400]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F4A3C]">
            Layanan Posko Pengaduan Online
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F4A3C]">
          Sampaikan Pengaduan Masyarakat
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Laporkan kendala fasilitas umum, layanan kependudukan, bansos, atau kebersihan di wilayah Temiang Pesisir.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bagian 1: Identitas Pelapor */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#2F4A3C] text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="font-serif font-bold text-[#2F4A3C] text-base">
                Identitas Pelapor
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Kerahasiaan data terjamin</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nama */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Lengkap Sesuai KTP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Muhammad Yusuf"
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F4A3C]/20 focus:border-[#2F4A3C] transition-all bg-slate-50/50 focus:bg-white"
              />
            </div>

            {/* Nomor HP */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nomor WhatsApp / HP Aktif <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={kontak}
                onChange={(e) => setKontak(e.target.value)}
                placeholder="Contoh: 0812xxxxxxxx"
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F4A3C]/20 focus:border-[#2F4A3C] transition-all bg-slate-50/50 focus:bg-white"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Digunakan untuk konfirmasi &amp; notifikasi perkembangan laporan
              </p>
            </div>
          </div>
        </div>

        {/* Bagian 2: Lokasi & Kategori Permasalahan */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#2F4A3C] text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="font-serif font-bold text-[#2F4A3C] text-base">
                Wilayah &amp; Kategori
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Kecamatan Temiang Pesisir</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Desa */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Pilih Wilayah Desa <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={desa}
                onChange={(e) => setDesa(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F4A3C]/20 focus:border-[#2F4A3C] transition-all bg-slate-50/50 focus:bg-white"
              >
                <option value="">-- Pilih Salah Satu Desa --</option>
                {DESA_LIST.map((d) => (
                  <option key={d} value={d}>
                    Desa {d} {d === "Tajur Biru" ? "(Ibu Kota Kecamatan)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kategori Permasalahan <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F4A3C]/20 focus:border-[#2F4A3C] transition-all bg-slate-50/50 focus:bg-white"
              >
                <option value="">-- Pilih Kategori --</option>
                <option value="infrastruktur">Infrastruktur (Jalan, Jembatan, Pelabuhan, Lampu)</option>
                <option value="lingkungan">Lingkungan (Sampah, Kebersihan Pantai, Drainase)</option>
                <option value="pelayanan">Pelayanan Publik (KTP, KK, Administrasi Surat)</option>
                <option value="sosial">Bantuan Sosial (PKH, BLT, Perlindungan Warga)</option>
                <option value="keamanan">Ketertiban &amp; Keamanan Pesisir</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          {/* Patokan Lokasi Fisik */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Patokan Lokasi Fisik / Landmark
            </label>
            <input
              type="text"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              placeholder="Contoh: Samping Mushola Al-Ikhlas RT 02 / Dekat Pelabuhan Tajur Biru"
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F4A3C]/20 focus:border-[#2F4A3C] transition-all bg-slate-50/50 focus:bg-white"
            />
          </div>

          {/* GPS Geolocation Module */}
          <div className="pt-1">
            <div className="rounded-xl border border-slate-200/80 p-3.5 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Navigation2 className="w-3.5 h-3.5 text-[#2F4A3C]" />
                  Akurasi Koordinat GPS
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Gunakan GPS perangkat untuk menyematkan titik presisi laporan di peta kecamatan.
                </p>
              </div>

              <div className="shrink-0">
                {gpsLat && gpsLng ? (
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-xs font-mono font-semibold text-emerald-800">
                      {gpsLat.toFixed(5)}, {gpsLng.toFixed(5)}
                    </span>
                    <button
                      type="button"
                      onClick={handleHapusGPS}
                      className="text-emerald-700 hover:text-red-600 p-0.5"
                      title="Hapus koordinat"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleAmbilGPS}
                    disabled={gpsLoading}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2F4A3C] bg-white border border-slate-300 hover:border-[#2F4A3C] px-3 py-2 rounded-lg shadow-2xs transition-all disabled:opacity-60"
                  >
                    {gpsLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D9A400]" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-[#D9A400]" />
                    )}
                    {gpsLoading ? "Mendeteksi Posisi..." : "Ambil Lokasi GPS Saya"}
                  </button>
                )}
              </div>
            </div>
            {gpsError && (
              <p className="mt-1.5 text-xs text-red-600 font-medium">{gpsError}</p>
            )}
          </div>
        </div>

        {/* Bagian 3: Detail Aduan & Lampiran Foto */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#2F4A3C] text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h2 className="font-serif font-bold text-[#2F4A3C] text-base">
                Rincian Laporan &amp; Bukti
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Deskripsi akurat membantu percepatan</span>
          </div>

          {/* Judul Singkat */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Judul Pokok Pengaduan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Lampu Penerangan Jalan Rusak di Dusun II"
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F4A3C]/20 focus:border-[#2F4A3C] transition-all bg-slate-50/50 focus:bg-white font-medium"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Uraian Lengkap Kejadian / Kondisi <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jelaskan kronologi, kondisi kerusakan, dampak terhadap warga, serta harapan tindak lanjut..."
              className="w-full border border-slate-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F4A3C]/20 focus:border-[#2F4A3C] transition-all bg-slate-50/50 focus:bg-white resize-none leading-relaxed"
            />
          </div>

          {/* Lampiran Foto */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Lampirkan Foto Bukti Fisik (Opsional)
            </label>

            {fotoPreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <Image
                  src={fotoPreview}
                  alt="Preview foto bukti"
                  width={800}
                  height={400}
                  className="w-full max-h-72 object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={handleHapusFoto}
                  className="absolute top-3 right-3 bg-white/95 hover:bg-white rounded-full p-2 shadow-md text-red-600 transition-colors"
                  title="Ganti atau hapus foto"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="px-4 py-2.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-2 truncate">
                    <ImageIcon className="w-4 h-4 text-[#2F4A3C]" />
                    <span className="truncate max-w-xs font-medium">{fotoFile?.name}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {fotoFile ? `${(fotoFile.size / 1024).toFixed(0)} KB (Auto-compressed)` : ""}
                  </span>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed border-slate-300 hover:border-[#D9A400] rounded-2xl p-6 sm:p-8 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-all text-center group">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-[#D9A400] group-hover:scale-105 transition-all shadow-2xs">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-[#2F4A3C]">
                    Klik untuk memilih foto bukti
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Format JPG, PNG, WEBP — sistem otomatis mengompresi gambar untuk menghemat kuota
                  </p>
                </div>
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
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs sm:text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Tombol Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting || uploading}
            className="w-full bg-[#2F4A3C] hover:bg-[#23382D] text-white font-bold py-4 rounded-xl border border-[#D9A400]/40 shadow-md text-xs uppercase tracking-wider transition-all hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting || uploading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#D9A400]" />
                {uploading ? "Mengompresi & Mengunggah Foto..." : "Menerbitkan Tiket Laporan..."}
              </span>
            ) : (
              <>
                <Send className="w-4 h-4 text-[#D9A400]" />
                Kirim Pengaduan ke Kantor Camat
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-slate-400 mt-2.5">
            Laporan Anda akan tercatat resmi dalam sistem pengawasan publik Kecamatan Temiang Pesisir
          </p>
        </div>
      </form>
    </div>
  )
}
