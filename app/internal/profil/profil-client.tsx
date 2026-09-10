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
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Profil Pengguna"
        subtitle="Kelola informasi identitas, foto profil, dan spesimen tanda tangan digital Anda"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Kartu Foto & Identitas */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-kuning-muda shadow-sm">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-base text-hijau">Foto Profil</CardTitle>
              <CardDescription className="text-xs">Foto akan tampil di menu dan dokumen</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-2">
              {/* Avatar bulat */}
              <div className="relative group">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-hijau flex items-center justify-center text-white text-3xl font-bold">
                  {fotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={fotoUrl} alt={user.nama} className="w-full h-full object-cover" />
                  ) : (
                    <span>{inisial}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fotoInputRef.current?.click()}
                  disabled={uploadingFoto}
                  className="absolute bottom-0 right-0 p-2 bg-kuning hover:bg-kuning/90 text-teks rounded-full shadow-lg border-2 border-white transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
                  title="Ganti Foto"
                >
                  {uploadingFoto ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                </button>
              </div>

              <input
                ref={fotoInputRef}
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="hidden"
              />

              <div className="mt-4 text-center">
                <h3 className="font-bold text-base text-teks">{user.nama}</h3>
                <p className="text-xs text-teks/60 mt-0.5">@{user.username}</p>
                <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-hijau/10 text-hijau capitalize">
                    {user.role.replace("_", " ")}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                    {user.jabatan}
                  </span>
                </div>
              </div>

              {/* Tombol Aksi Foto */}
              <div className="mt-5 w-full flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fotoInputRef.current?.click()}
                  disabled={uploadingFoto}
                  className="w-full text-xs"
                >
                  {uploadingFoto ? (
                    <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Mengunggah...</>
                  ) : (
                    <><Camera className="w-3.5 h-3.5 mr-1.5" /> Ganti Foto Profil</>
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
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Hapus Foto
                  </Button>
                )}
              </div>

              {/* Feedback Notif Foto */}
              {pesanFoto && (
                <div className={`mt-3 w-full p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                  pesanFoto.tipe === "sukses" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {pesanFoto.tipe === "sukses" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{pesanFoto.teks}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Tanda Tangan Digital & Spesimen */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-kuning-muda shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base text-hijau flex items-center gap-2">
                    <PenTool className="w-4 h-4" /> Tanda Tangan Digital
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Spesimen tanda tangan digital yang digunakan saat menandatangani dokumen dan berita acara
                  </CardDescription>
                </div>
                {ttdUrl ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-800">
                    <ShieldCheck className="w-3.5 h-3.5" /> Terdaftar
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                    Belum Ada TTD
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preview Area TTD */}
              {ttdUrl ? (
                <div className="border-2 border-dashed border-green-300 rounded-xl p-6 bg-gradient-to-b from-green-50/30 to-white flex flex-col items-center justify-center">
                  <p className="text-[11px] font-bold text-teks/50 uppercase tracking-widest mb-3">
                    Pratinjau Tanda Tangan Digital Anda
                  </p>
                  
                  {/* Kotak TTD dengan latar transparan/kertas */}
                  <div className="relative p-4 bg-white border border-gray-200 rounded-lg shadow-inner max-w-sm w-full flex items-center justify-center min-h-[120px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ttdUrl}
                      alt="Tanda Tangan Digital"
                      className="max-h-24 max-w-full object-contain mix-blend-multiply"
                    />
                  </div>

                  <div className="mt-3 text-center">
                    <p className="text-xs font-bold text-teks">{user.nama}</p>
                    <p className="text-[11px] text-teks/60">{user.jabatan}</p>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50/50 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                    <PenTool className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-sm text-teks">Belum Ada Tanda Tangan</h4>
                  <p className="text-xs text-teks/60 max-w-xs mt-1">
                    Unggah tanda tangan digital Anda untuk dapat menandatangani dokumen secara otomatis.
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

              {/* Petunjuk format */}
              <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-3 text-xs text-blue-900 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" /> Panduan Unggah Tanda Tangan:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-blue-800/80 pl-1">
                  <li>Disarankan format <strong>PNG dengan latar belakang transparan</strong> untuk hasil cetak dokumen yang rapi.</li>
                  <li>Jika menggunakan foto/scan, pastikan tanda tangan dibuat di atas <strong>kertas putih polos bersih</strong>.</li>
                </ul>
              </div>

              {/* Tombol Unggah / Ganti */}
              <div className="pt-2 flex items-center gap-3">
                <Button
                  type="button"
                  onClick={() => ttdInputRef.current?.click()}
                  disabled={uploadingTtd}
                  className="bg-hijau hover:bg-hijau/90 text-white text-xs font-medium"
                >
                  {uploadingTtd ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mengunggah...</>
                  ) : ttdUrl ? (
                    <><UploadCloud className="w-4 h-4 mr-2" /> Ganti Tanda Tangan</>
                  ) : (
                    <><UploadCloud className="w-4 h-4 mr-2" /> Unggah Tanda Tangan Digital</>
                  )}
                </Button>

                {ttdUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleHapusTtd}
                    disabled={uploadingTtd}
                    className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Hapus TTD
                  </Button>
                )}
              </div>

              {/* Feedback Notif TTD */}
              {pesanTtd && (
                <div className={`mt-3 p-3 rounded-lg text-xs flex items-center gap-2 ${
                  pesanTtd.tipe === "sukses" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {pesanTtd.tipe === "sukses" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{pesanTtd.teks}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}