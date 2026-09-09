"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { hapusPengaduan } from "./actions"

export function DeleteDetailAduanButton({ id, tiket }: { id: string; tiket: string }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      await hapusPengaduan(id)
      router.push("/internal/aduan")
      router.refresh()
    } catch (err: any) {
      alert("Gagal menghapus pengaduan: " + (err?.message || "Terjadi kesalahan"))
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-merah border-merah/20 hover:bg-merah/10"
      >
        <Trash2 className="w-4 h-4 mr-1.5" /> Hapus Aduan
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-merah mb-3">
              <div className="p-2.5 bg-red-100 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-teks">Hapus Pengaduan?</h3>
                <p className="text-xs text-teks/60">Tindakan ini tidak dapat dibatalkan.</p>
              </div>
            </div>

            <p className="text-sm text-teks/80 my-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
              Apakah Anda yakin ingin menghapus aduan dengan tiket{" "}
              <strong className="text-hijau">[{tiket}]</strong> beserta seluruh riwayat penanganannya?
            </p>

            <div className="flex justify-end gap-2.5 mt-5">
              <Button variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
                Batal
              </Button>
              <Button
                onClick={handleDelete}
                disabled={loading}
                className="bg-merah hover:bg-red-700 text-white"
              >
                {loading ? "Menghapus..." : "Ya, Hapus Aduan"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
