"use client"

import { useState } from "react"
import { PENGADUAN_DATA, KATEGORI_LABELS, STATUS_PENGADUAN_LABELS, Pengaduan, StatusPengaduan } from "@/lib/mock-data/pengaduan"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, Edit3, CheckCircle, Clock } from "lucide-react"

export default function PetugasDashboardPage() {
  const [reports, setReports] = useState<Pengaduan[]>(PENGADUAN_DATA)
  const [filter, setFilter] = useState<string>("semua")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newStatus, setNewStatus] = useState<StatusPengaduan>("masuk")
  const [newResponse, setNewResponse] = useState("")

  const filteredReports = filter === "semua"
    ? reports
    : reports.filter((r) => r.status === filter)

  function handleSaveEdit(id: string) {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: newStatus,
              responPetugas: newResponse || r.responPetugas,
              tanggalUpdate: new Date().toISOString().split("T")[0],
            }
          : r
      )
    )
    setEditingId(null)
  }

  function startEdit(report: Pengaduan) {
    setEditingId(report.id)
    setNewStatus(report.status)
    setNewResponse(report.responPetugas || "")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <PageHeader
        title="Dashboard Petugas Pengaduan"
        subtitle="Kelola laporan masyarakat, ubah status, dan berikan respon resmi"
      />

      {/* Filter and stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-kuning-muda p-4 rounded-xl shadow-sm">
        <div className="flex gap-2">
          {["semua", "masuk", "verifikasi", "proses", "selesai"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors border ${
                filter === status
                  ? "bg-hijau text-white border-hijau"
                  : "bg-krem/30 text-teks/70 border-kuning-muda hover:bg-krem hover:text-hijau"
              }`}
            >
              {status === "semua" ? "Semua Laporan" : STATUS_PENGADUAN_LABELS[status as StatusPengaduan]}
            </button>
          ))}
        </div>
        <div className="text-xs text-teks/50 font-medium">
          Menampilkan {filteredReports.length} Laporan
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-wrap justify-between items-start gap-2 border-b pb-3 border-gray-50">
                <div>
                  <span className="font-mono font-bold text-hijau text-sm mr-2">{report.tiket}</span>
                  <span className="text-xs bg-kuning-muda text-teks/80 px-2 py-0.5 rounded font-medium border border-kuning/20">
                    {KATEGORI_LABELS[report.kategori]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-teks/50">{report.tanggalMasuk}</span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      report.status === "selesai"
                        ? "bg-green-100 text-green-800"
                        : report.status === "proses"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {STATUS_PENGADUAN_LABELS[report.status]}
                  </span>
                </div>
              </div>

              {editingId === report.id ? (
                // Edit Form
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-teks/60 mb-1.5">
                        Ubah Status Laporan
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as StatusPengaduan)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kuning"
                      >
                        {["masuk", "verifikasi", "proses", "selesai"].map((s) => (
                          <option key={s} value={s}>{STATUS_PENGADUAN_LABELS[s as StatusPengaduan]}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-teks/60 mb-1.5">
                      Berikan Respon / Tindak Lanjut Resmi
                    </label>
                    <textarea
                      rows={3}
                      value={newResponse}
                      onChange={(e) => setNewResponse(e.target.value)}
                      placeholder="Tuliskan respon resmi tindak lanjut untuk warga pelapor..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kuning resize-none"
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-1">
                    <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                      Batal
                    </Button>
                    <Button size="sm" onClick={() => handleSaveEdit(report.id)}>
                      Simpan Perubahan
                    </Button>
                  </div>
                </div>
              ) : (
                // Display Details
                <div className="space-y-3 pt-1">
                  <div>
                    <h4 className="font-bold text-base text-teks">{report.judul}</h4>
                    <p className="text-xs text-teks/70 mt-1 leading-relaxed">{report.deskripsi}</p>
                  </div>
                  {report.lokasi && (
                    <p className="text-xs text-teks/50">📍 Lokasi: {report.lokasi} (Desa {report.desa})</p>
                  )}
                  {report.responPetugas && (
                    <div className="bg-kuning-muda/30 border border-kuning-muda/60 rounded-xl p-3.5 mt-2 space-y-1">
                      <p className="text-xs font-bold text-hijau">Tanggapan Resmi:</p>
                      <p className="text-xs text-teks/80 leading-relaxed">{report.responPetugas}</p>
                    </div>
                  )}
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(report)} className="gap-1.5">
                      <Edit3 className="w-3.5 h-3.5" /> Tanggapi & Ubah Status
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
