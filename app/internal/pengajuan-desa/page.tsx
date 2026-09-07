"use client"

import { useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FilePlus, FileText, CheckCircle2, XCircle, AlertCircle } from "lucide-react"

type PengajuanDesa = {
  id: string
  desa: string
  jenis: string
  tanggal: string
  dokumen: string
  status: "diajukan" | "proses" | "disetujui" | "ditolak"
  catatan?: string
}

const INITIAL_PENGAJUAN: PengajuanDesa[] = [
  {
    id: "PD001",
    desa: "Temiang",
    jenis: "Rekomendasi DD Tahap II",
    tanggal: "2026-08-25",
    dokumen: "Permohonan_DD_Temiang_T2.pdf",
    status: "proses"
  },
  {
    id: "PD002",
    desa: "Pasir Panjang",
    jenis: "Rekomendasi ADD Agustus",
    tanggal: "2026-08-24",
    dokumen: "ADD_PasirPanjang_Agustus.pdf",
    status: "disetujui",
    catatan: "Surat Rekomendasi No 142.1/CMT-TP/008/2026 sudah terbit"
  },
  {
    id: "PD003",
    desa: "Duara",
    jenis: "Pemberhentian Perangkat Desa",
    tanggal: "2026-08-20",
    dokumen: "Usulan_Pemberhentian_Kaur.pdf",
    status: "ditolak",
    catatan: "Dokumen berita acara musyawarah desa belum dilampirkan"
  }
]

export default function PengajuanDesaPage() {
  const [list, setList] = useState<PengajuanDesa[]>(INITIAL_PENGAJUAN)
  const [showModal, setShowModal] = useState(false)
  const [jenis, setJenis] = useState("")
  const [desa, setDesa] = useState("")

  function handleCreate() {
    if (!jenis || !desa) return
    const newRecord: PengajuanDesa = {
      id: `PD00${list.length + 1}`,
      desa,
      jenis,
      tanggal: new Date().toISOString().split("T")[0],
      dokumen: "Dokumen_Lampiran.pdf",
      status: "diajukan"
    }
    setList([newRecord, ...list])
    setShowModal(false)
    setJenis("")
    setDesa("")
  }

  return (
    <div>
      <PageHeader
        title="Pengajuan Dari Desa"
        subtitle="Portal desa untuk memohon rekomendasi DD/ADD dan pemberhentian perangkat"
      >
        <Button onClick={() => setShowModal(true)}>
          <FilePlus className="w-4 h-4" />
          Ajukan Permohonan Baru
        </Button>
      </PageHeader>

      <div className="bg-white rounded-xl border border-kuning-muda overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-krem">
              <tr className="border-b border-kuning-muda text-left">
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-teks/50">Desa</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-teks/50">Jenis Permohonan</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-teks/50">Tanggal</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-teks/50">Dokumen Lampiran</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-teks/50">Status</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-teks/50">Tindak Lanjut / Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {list.map((item) => (
                <tr key={item.id} className="hover:bg-krem/60 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-teks">Desa {item.desa}</td>
                  <td className="px-5 py-3.5 font-medium">{item.jenis}</td>
                  <td className="px-5 py-3.5 text-teks/60 text-xs">{item.tanggal}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-hijau hover:underline cursor-pointer flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {item.dokumen}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        item.status === "disetujui"
                          ? "bg-green-100 text-green-800"
                          : item.status === "ditolak"
                          ? "bg-red-100 text-red-800"
                          : item.status === "proses"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.status === "disetujui" && <CheckCircle2 className="w-3 h-3" />}
                      {item.status === "ditolak" && <XCircle className="w-3 h-3" />}
                      {item.status === "proses" && <AlertCircle className="w-3 h-3" />}
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-teks/70">
                    {item.catatan || <span className="text-teks/30">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold font-serif text-hijau">Ajukan Rekomendasi Desa</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-teks/60 mb-1">
                  Desa Pengaju
                </label>
                <select
                  value={desa}
                  onChange={(e) => setDesa(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kuning"
                >
                  <option value="">Pilih Desa...</option>
                  <option value="Temiang">Temiang</option>
                  <option value="Pasir Panjang">Pasir Panjang</option>
                  <option value="Duara">Duara</option>
                  <option value="Penuba">Penuba</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-teks/60 mb-1">
                  Jenis Pengajuan
                </label>
                <select
                  value={jenis}
                  onChange={(e) => setJenis(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kuning"
                >
                  <option value="">Pilih Jenis...</option>
                  <option value="Rekomendasi DD Tahap I">Rekomendasi DD Tahap I</option>
                  <option value="Rekomendasi DD Tahap II">Rekomendasi DD Tahap II</option>
                  <option value="Rekomendasi ADD Bulanan">Rekomendasi ADD Bulanan</option>
                  <option value="Rekomendasi Tunda Salur ADD">Rekomendasi Tunda Salur ADD</option>
                  <option value="Pemberhentian Perangkat Desa">Pemberhentian Perangkat Desa</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-teks/60 mb-1">
                  Unggah Dokumen Permohonan (.pdf)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-kuning-muda file:text-teks"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Batal
              </Button>
              <Button onClick={handleCreate}>
                Kirim Pengajuan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
