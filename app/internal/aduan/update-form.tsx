"use client"

import { useState } from "react"
import { STATUS_PENGADUAN_LABELS, StatusPengaduan } from "@/lib/mock-data/pengaduan"
import { Button } from "@/components/ui/button"
import { updateStatusAduan } from "./actions"
import { CheckCircle2, Send, Clock, ShieldCheck, Loader2 } from "lucide-react"

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
  const options = [
    { value: "verifikasi", label: "Verifikasi Laporan" },
    { value: "proses", label: "Sedang Ditindaklanjuti" },
    { value: "selesai", label: "Selesai Ditangani" },
    { value: "ditolak", label: "Laporan Ditolak" },
  ].filter(opt => opt.value !== currentStatus)

  const [status, setStatus] = useState<string>(options.length > 0 ? options[0].value : "")
  const [catatan, setCatatan] = useState(currentRespon)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!status) return
    setLoading(true)
    try {
      await updateStatusAduan(tiket, status, catatan, userName)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 4000)
    } catch (error) {
      alert("Gagal mengupdate status aduan.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (options.length === 0) return (
    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-5 rounded-2xl text-xs font-medium space-y-1">
      <div className="flex items-center gap-2 font-bold text-sm">
        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Aduan Telah Ditangani
      </div>
      <p className="text-emerald-700">Laporan ini sudah berstatus final: <strong>{STATUS_PENGADUAN_LABELS[currentStatus as StatusPengaduan]}</strong>.</p>
    </div>
  )

  return (
    <form onSubmit={onSubmit} className="bg-white border border-gray-200/80 rounded-2xl p-6 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-[#2F4A3C]">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#2F4A3C]">Tindak Lanjut Petugas</h3>
          <p className="text-[11px] text-gray-500">Perbarui tahapan penanganan laporan warga</p>
        </div>
      </div>
      
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Ubah Status Tindak Lanjut</label>
        <select 
          required
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 bg-white"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Tanggapan Resmi Petugas (Publik)</label>
        <textarea 
          required
          rows={3}
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          placeholder="Tuliskan tindakan, hasil peninjauan lapangan, atau catatan tindak lanjut..."
          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 resize-none"
        />
        <p className="text-[10px] text-gray-500 mt-1">Tanggapan ini langsung dapat dilacak oleh pelapor pada portal pengaduan publik.</p>
      </div>

      {success && (
        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Status aduan berhasil diperbarui dan disinkronkan.</span>
        </div>
      )}

      <Button 
        type="submit" 
        disabled={loading} 
        className="w-full bg-[#2F4A3C] hover:bg-[#23382d] text-white text-xs font-semibold py-2.5 rounded-xl shadow-sm"
      >
        {loading ? (
          <><Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> Menyimpan Pembaruan...</>
        ) : (
          <><Send className="w-3.5 h-3.5 mr-2" /> Simpan & Publikasikan Tanggapan</>
        )}
      </Button>
    </form>
  )
}
