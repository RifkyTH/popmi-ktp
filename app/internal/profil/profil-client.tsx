"use client"

import { useState, useRef } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Camera, Trash2, UploadCloud, CheckCircle2, AlertCircle, Loader2, PenTool, ShieldCheck, UserCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { compressImage } from "@/lib/utils/compress-image"
import { simpanFotoProfil, hapusFotoProfil, simpanTtdProfil, hapusTtdProfil } from "./actions"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/auth"

export function ProfilClient({ user }: { user: User }) {
  const router = useRouter()
  
  // State Foto
  const [fotoUrl, setFotoUrl] = useState<string | null>(user.foto_url || null)
  const [uploadingFoto, setUploadingFoto] = useState(false)
  const [pesanFoto, setPesanFoto] = useState<{ tipe: "sukses" | "error"; teks: string } | null>(null)
  const fotoInputRef = useRef<HTMLInputElement>(null)

  // State TTD
  const [ttdUrl, setTtdUrl] = useState<string | null>(user.ttd_url || null)
  const [uploadingTtd, setUploadingTtd] = useState(false)
  const [pesanTtd, setPesanTtd] = useState<{ tipe: "sukses" | "error"; teks: string } | null>(null)
  const ttdInputRef = useRef<HTMLInputElement>(null)

  const inisial = user.nama
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  // Handle Upload Foto Profil
  async function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingFoto(true)
    setPesanFoto(null)

    try {
      const compressed = await compressImage(file, 800, 0.85)
      const supabase = createClient()
      const ext = compressed.name.split(".").pop() || "jpg"
      const filePath = `profil/${user.id}_${Date.now()}.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from("pengaduan-foto")
        .upload(filePath, compressed, {
          contentType: "image/jpeg",
          upsert: true,
        })

      if (uploadErr) throw new Error(uploadErr.message)

      const { data: urlData } = supabase.storage
        .from("pengaduan-foto")
        .getPublicUrl(filePath)

      await simpanFotoProfil(user.id, urlData.publicUrl)
      setFotoUrl(urlData.publicUrl)
      setPesanFoto({ tipe: "sukses", teks: "Foto profil berhasil diperbarui" })
      router.refresh()
    } catch (err: any) {
      setPesanFoto({ tipe: "error", teks: err.message || "Gagal mengunggah foto profil" })
    } finally {
      setUploadingFoto(false)
      if (fotoInputRef.current) fotoInputRef.current.value = ""
    }
  }

  // Handle Hapus Foto Profil
  async function handleHapusFoto() {
    if (!confirm("Yakin ingin menghapus foto profil?")) return
    setUploadingFoto(true)
    setPesanFoto(null)
    try {
      await hapusFotoProfil(user.id)
      setFotoUrl(null)
      setPesanFoto({ tipe: "sukses", teks: "Foto profil berhasil dihapus" })
      router.refresh()
    } catch (err: any) {
      setPesanFoto({ tipe: "error", teks: err.message || "Gagal menghapus foto profil" })
    } finally {
      setUploadingFoto(false)
    }
  }

  // Handle Upload TTD Digital
  async function handleTtdChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingTtd(true)
    setPesanTtd(null)

    try {
      let fileToUpload: File = file
      const isPng = file.type === "image/png"
      
      // Jika bukan PNG, kompresi
      if (!isPng) {
        fileToUpload = await compressImage(file, 1000, 0.9)
      }

      const supabase = createClient()
      const ext = isPng ? "png" : "jpg"
      const filePath = `ttd/${user.id}_${Date.now()}.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from("pengaduan-foto")
        .upload(filePath, fileToUpload, {
          contentType: isPng ? "image/png" : "image/jpeg",
          upsert: true,
        })

      if (uploadErr) throw new Error(uploadErr.message)

      const { data: urlData } = supabase.storage
        .from("pengaduan-foto")
        .getPublicUrl(filePath)

      await simpanTtdProfil(user.id, urlData.publicUrl)
      setTtdUrl(urlData.publicUrl)
      setPesanTtd({ tipe: "sukses", teks: "Tanda tangan digital berhasil disimpan" })
      router.refresh()
    } catch (err: any) {
      setPesanTtd({ tipe: "error", teks: err.message || "Gagal mengunggah tanda tangan digital" })
    } finally {
      setUploadingTtd(false)
      if (ttdInputRef.current) ttdInputRef.current.value = ""
    }
  }

  // Handle Hapus TTD Digital
  async function handleHapusTtd() {
    if (!confirm("Yakin ingin menghapus tanda tangan digital Anda?")) return
    setUploadingTtd(true)
    setPesanTtd(null)
    try {
      await hapusTtdProfil(user.id)
      setTtdUrl(null)
      setPesanTtd({ tipe: "sukses", teks: "Tanda tangan digital berhasil dihapus" })
      router.refresh()
    } catch (err: any) {
      setPesanTtd({ tipe: "error", teks: err.message || "Gagal menghapus tanda tangan" })
    } finally {
      setUploadingTtd(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl pb-10">
      {/* Header GovTech */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/70">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Portal Identitas Aparatur · Kecamatan Temiang Pesisir
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2F4A3C] tracking-tight">
          Profil & Spesimen Tanda Tangan
        </h1>
        <p className="text-sm text-gray-600 mt-1 max-w-3xl">
          Kelola data aparatur pemerintahan, foto identitas resmi kedinasan, dan spesimen tanda tangan elektronik untuk pengesahan berkas serta surat rekomendasi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Kartu Identitas Aparatur (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
            {/* Banner Atas Kartu */}
            <div className="bg-gradient-to-r from-[#2F4A3C] via-[#3d5e4d] to-[#2F4A3C] p-5 text-white">
              {/* Header Baris Identitas & Verifikasi (Tidak Menimpa) */}
              <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-white/10">
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold tracking-widest text-[#D9A400] uppercase truncate">
                    Aparatur Sipil Negara
                  </p>
                  <h2 className="text-xs font-semibold text-white/90 tracking-wide uppercase truncate">
                    Pemerintah Kab. Lingga
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-white/15 backdrop-blur-sm text-white border border-white/25 shrink-0">
                  <ShieldCheck className="w-3 h-3 text-[#D9A400]" /> Terverifikasi
                </span>
              </div>

              {/* Avatar Bulat dengan Ring */}
              <div className="mt-5 mb-2 flex justify-center">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-[#2F4A3C] flex items-center justify-center text-white text-3xl font-bold ring-4 ring-emerald-400/30 transition-transform duration-200 group-hover:scale-[1.02]">
                    {fotoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={fotoUrl} alt={user.nama} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-serif tracking-tight">{inisial}</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => fotoInputRef.current?.click()}
                    disabled={uploadingFoto}
                    className="absolute bottom-0 right-0 p-2.5 bg-[#D9A400] hover:bg-[#c49300] text-gray-900 rounded-full shadow-lg border-2 border-white transition-transform active:scale-90 cursor-pointer disabled:opacity-50"
                    title="Ganti Foto Profil"
                  >
                    {uploadingFoto ? (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-900" />
                    ) : (
                      <Camera className="w-4 h-4 text-gray-900" />
                    )}
                  </button>
                </div>
              </div>

              <input
                ref={fotoInputRef}
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="hidden"
              />
            </div>

            {/* Nama & Role */}
            <div className="p-5 text-center border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900 tracking-tight">{user.nama}</h3>
              <p className="text-xs font-mono text-gray-500 mt-0.5">@{user.username}</p>

              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#2F4A3C]/10 text-[#2F4A3C] capitalize">
                  {user.role.replace("_", " ")}
                </span>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {user.jabatan}
                </span>
              </div>
            </div>

            {/* Aksi Foto */}
            <div className="p-4 bg-slate-50/70 border-b border-gray-100 space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fotoInputRef.current?.click()}
                disabled={uploadingFoto}
                className="w-full text-xs font-medium border-gray-300 hover:border-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 bg-white"
              >
                {uploadingFoto ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Mengunggah Foto...
                  </>
                ) : (
                  <>
                    <Camera className="w-3.5 h-3.5 mr-1.5" /> Ganti Foto Profil
                  </>
                )}
              </Button>

              {fotoUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleHapusFoto}
                  disabled={uploadingFoto}
                  className="w-full text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Hapus Foto Profil
                </Button>
              )}

              {pesanFoto && (
                <div
                  className={`mt-2 p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                    pesanFoto.tipe === "sukses"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  {pesanFoto.tipe === "sukses" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  )}
                  <span>{pesanFoto.teks}</span>
                </div>
              )}
            </div>

            {/* Rincian Atribut Kedinasan */}
            <div className="p-5 space-y-3.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Instansi / Satuan</span>
                <span className="font-semibold text-gray-800 text-right">Kecamatan Temiang Pesisir</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Penugasan Wilayah</span>
                <span className="font-semibold text-gray-800">
                  {user.desa ? `Desa ${user.desa}` : "Kantor Camat Induk"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Hak Akses Sistem</span>
                <span className="font-semibold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {user.role}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-gray-500 font-medium">ID Aparatur</span>
                <span className="font-mono text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {user.id.slice(0, 8)}...
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Spesimen TTD & Keamanan (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Kartu Utama TTD */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-[#2F4A3C]">
                    <PenTool className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-bold text-[#2F4A3C]">
                    Spesimen Tanda Tangan Digital (TTD-E)
                  </h2>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Spesimen tanda tangan resmi yang terintegrasi langsung pada pengesahan surat & verifikasi berkas.
                </p>
              </div>

              <div>
                {ttdUrl ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Spesimen Terdaftar Sah
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Belum Ada Tanda Tangan
                  </span>
                )}
              </div>
            </div>

            {/* Kanvas Pratinjau Spesimen */}
            <div className="relative rounded-2xl border-2 border-dashed border-emerald-300/80 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:14px_14px] bg-slate-50/70 p-6 sm:p-8 flex flex-col items-center justify-center overflow-hidden">
              <div className="w-full flex justify-between items-center mb-4 text-[10px] font-mono uppercase tracking-widest text-gray-400">
                <span>KEABSAHAN RESMI</span>
                <span>KECAMATAN TEMIANG PESISIR</span>
              </div>

              {ttdUrl ? (
                <div className="w-full max-w-sm flex flex-col items-center">
                  {/* Kotak Putih TTD */}
                  <div className="w-full bg-white border border-gray-200 rounded-xl shadow-md p-4 min-h-[140px] flex items-center justify-center relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ttdUrl}
                      alt="Spesimen Tanda Tangan Digital"
                      className="max-h-28 max-w-full object-contain mix-blend-multiply transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>

                  {/* Format Nama Kedinasan Bawah TTD */}
                  <div className="mt-3.5 text-center">
                    <div className="w-44 h-0.5 bg-gray-800 mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-gray-900 tracking-wide">{user.nama}</p>
                    <p className="text-[11px] font-medium text-gray-600">{user.jabatan}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Kecamatan Temiang Pesisir</p>
                  </div>
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center text-center max-w-sm">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 mb-3">
                    <PenTool className="w-7 h-7 text-gray-300" />
                  </div>
                  <h4 className="font-semibold text-sm text-gray-800">
                    Spesimen Tanda Tangan Belum Diunggah
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Dokumen rekomendasi dan surat dispensasi memerlukan spesimen tanda tangan Anda untuk proses pengesahan otomatis.
                  </p>
                </div>
              )}

              {/* Input file TTD (hidden) */}
              <input
                ref={ttdInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleTtdChange}
                className="hidden"
              />
            </div>

            {/* Panduan Unggah */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs text-slate-700 space-y-2">
              <p className="font-bold text-[#2F4A3C] flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#D9A400]" />
                Ketentuan & Panduan Unggah Spesimen:
              </p>
              <ul className="space-y-1.5 text-[11px] text-slate-600 pl-6 list-disc">
                <li>
                  Gunakan format <strong>PNG dengan latar belakang transparan</strong> untuk hasil cetak dokumen e-TEPI yang paling tajam dan presisi.
                </li>
                <li>
                  Jika mengambil foto dari kertas, pastikan tanda tangan menggunakan <strong>tinta hitam pekat</strong> di atas <strong>kertas putih bersih tanpa lipatan</strong>.
                </li>
                <li>
                  Spesimen ini akan disinkronkan secara realtime ke seluruh draf surat dan dokumen resmi yang membutuhkan paraf atau tanda tangan Anda.
                </li>
              </ul>
            </div>

            {/* Tombol Aksi TTD */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onClick={() => ttdInputRef.current?.click()}
                disabled={uploadingTtd}
                className="bg-[#2F4A3C] hover:bg-[#23382d] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm"
              >
                {uploadingTtd ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mengunggah Spesimen...
                  </>
                ) : ttdUrl ? (
                  <>
                    <UploadCloud className="w-4 h-4 mr-2" /> Ganti Spesimen Tanda Tangan
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4 mr-2" /> Unggah Spesimen Tanda Tangan
                  </>
                )}
              </Button>

              {ttdUrl && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleHapusTtd}
                  disabled={uploadingTtd}
                  className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 rounded-xl"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Hapus Spesimen
                </Button>
              )}
            </div>

            {/* Pesan Feedback TTD */}
            {pesanTtd && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  pesanTtd.tipe === "sukses"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {pesanTtd.tipe === "sukses" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                )}
                <span>{pesanTtd.teks}</span>
              </div>
            )}
          </div>

          {/* Kartu Informasi Keamanan & Enkripsi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-700 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Enkripsi & Keamanan Sesi</h4>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                  Autentikasi dilindungi token sesi HttpOnly dengan enkripsi standar pemerintah daerah.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Hak Akses Jabatan</h4>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                  Tanda tangan Anda hanya dapat dibubuhkan pada surat yang sesuai dengan tupoksi wewenang.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}