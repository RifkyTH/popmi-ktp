"use client"

import { useState, useTransition } from "react"
import { Settings2, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ubahVerifikator } from "@/app/internal/surat/actions"

type PenggunaOption = {
  id: string
  nama: string
  jabatan: string
  ttd_url: string | null
}

type Props = {
  suratId: string
  slot: "jubir" | "zakaria"
  slotLabel: string
  currentNama: string
  penggunaList: PenggunaOption[]
}

export function UbahVerifikatorForm({ suratId, slot, slotLabel, currentNama, penggunaList }: Props) {
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState("")
  const [pesan, setPesan] = useState<{ tipe: "sukses" | "error"; teks: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedId) return
    setPesan(null)
    startTransition(async () => {
      try {
        await ubahVerifikator(suratId, slot, selectedId)
        setPesan({ tipe: "sukses", teks: "Penandatangan berhasil diubah" })
        setOpen(false)
        setSelectedId("")
      } catch (err: any) {
        setPesan({ tipe: "error", teks: err.message || "Gagal mengubah penandatangan" })
      }
    })
  }

  const selectedUser = penggunaList.find((u) => u.id === selectedId)

  return (
    <div className="mt-2">
      {!open ? (
        <button
          type="button"
          onClick={() => { setOpen(true); setPesan(null) }}
          className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
        >
          <Settings2 className="w-3 h-3" />
          Ubah Penandatangan
        </button>
      ) : (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-blue-800">Ubah Penandatangan {slotLabel}</p>
            <button
              type="button"
              onClick={() => { setOpen(false); setPesan(null); setSelectedId("") }}
              className="text-[11px] text-blue-500 hover:text-blue-700"
            >
              Batal
            </button>
          </div>
          <p className="text-[11px] text-blue-600/80">
            Saat ini: <strong>{currentNama}</strong>. Pilih pengguna lain untuk menggantikannya.
            {" "}Jika pengguna belum upload TTD, kolom tanda tangan akan kosong.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full text-xs border border-blue-300 rounded-lg px-2.5 py-2 bg-white text-teks focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">-- Pilih Pengguna --</option>
              {penggunaList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nama} ({u.jabatan}){u.ttd_url ? " ✓ TTD" : " – belum ada TTD"}
                </option>
              ))}
            </select>

            {selectedUser && (
              <div className="flex items-center gap-2 text-[11px] text-blue-700 bg-white rounded-lg px-2.5 py-1.5 border border-blue-200">
                <span className={selectedUser.ttd_url ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>
                  {selectedUser.ttd_url ? "✓ Sudah ada TTD" : "⚠ Belum ada TTD"}
                </span>
                <span className="text-blue-500">—</span>
                <span>{selectedUser.nama}</span>
              </div>
            )}

            <Button
              type="submit"
              size="sm"
              disabled={!selectedId || isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium"
            >
              {isPending ? (
                <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Menyimpan...</>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </form>

          {pesan && (
            <div className={`flex items-center gap-1.5 text-xs rounded-lg px-2.5 py-2 ${
              pesan.tipe === "sukses"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}>
              {pesan.tipe === "sukses"
                ? <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
              {pesan.teks}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
