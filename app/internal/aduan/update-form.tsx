"use client"

import { useState } from "react"
import { STATUS_PENGADUAN_LABELS, StatusPengaduan } from "@/lib/mock-data/pengaduan"
import { Button } from "@/components/ui/button"
import { updateStatusAduan } from "./actions"

export function UpdateAduanForm({ 
  tiket, 
  currentStatus, 
  currentRespon = "",
  userName = "Admin"
}: { 
  tiket: string
  currentStatus: string
  currentRespon?: string
  userName?: string
}) {
  // Berikan opsi semua status yang relevan, supaya admin bisa bebas mengupdate
  const options = [
    { value: "verifikasi", label: "Verifikasi Laporan" },
    { value: "proses", label: "Sedang Diproses" },
    { value: "selesai", label: "Selesai / Ditutup" },
    { value: "ditolak", label: "Laporan Ditolak" },
  ].filter(opt => opt.value !== currentStatus)

  // Default state haruslah opsi pertama yang tersedia (bukan currentStatus yang tidak ada di list)
  const [status, setStatus] = useState<string>(options.length > 0 ? options[0].value : "")
  const [catatan, setCatatan] = useState(currentRespon)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!status) return
    setLoading(true)
    try {
      await updateStatusAduan(tiket, status, catatan, userName)
      alert("Status berhasil diupdate!")
    } catch (error) {
      alert("Gagal mengupdate status")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (options.length === 0) return (
    <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-sm font-medium">
      Aduan ini sudah berstatus {STATUS_PENGADUAN_LABELS[currentStatus as StatusPengaduan]}.
    </div>
  )

  return (
    <form onSubmit={onSubmit} className="bg-white border border-kuning-muda rounded-xl p-5 space-y-4">
      <h3 className="font-serif font-bold text-hijau">Update Status Aduan</h3>
      
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-teks/50 mb-1.5">Ubah Status Ke</label>
        <select 
          required
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-kuning"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-teks/50 mb-1.5">Tanggapan Petugas (Publik)</label>
        <textarea 
          required
          rows={3}
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          placeholder="Tuliskan respon atau tindakan yang diambil..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-kuning"
        />
        <p className="text-[10px] text-teks/50 mt-1">Tanggapan ini akan bisa dilihat oleh pelapor di halaman publik.</p>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </form>
  )
}
