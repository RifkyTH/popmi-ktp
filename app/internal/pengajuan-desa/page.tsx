"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DESA_LIST } from "@/lib/mock-data/desa"
import {
  FilePlus,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  Clock,
  Search,
  Filter,
  Download,
  X,
  Send,
} from "lucide-react"
import { cn } from "@/lib/utils"

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
    status: "proses",
    catatan: "Sedang dalam verifikasi berkas oleh Kasi Ekbang",
  },
  {
    id: "PD002",
    desa: "Tajur Biru",
    jenis: "Rekomendasi ADD Bulan Agustus",
    tanggal: "2026-08-24",
    dokumen: "ADD_TajurBiru_Agustus.pdf",
    status: "disetujui",
    catatan: "Surat Rekomendasi No 142.1/CMT-TP/008/2026 telah terbit",
  },
  {
    id: "PD003",
    desa: "Pulau Batang",
    jenis: "Pemberhentian Perangkat Desa",
    tanggal: "2026-08-20",
    dokumen: "Usulan_Pemberhentian_Kaur.pdf",
    status: "ditolak",
    catatan: "Dokumen berita acara musyawarah desa belum dilampirkan",
  },
  {
    id: "PD004",
    desa: "Temiang",
    jenis: "Rekomendasi Tunda Salur ADD",
    tanggal: "2026-08-18",
    dokumen: "Tunda_Salur_ADD_Temiang.pdf",
    status: "disetujui",
    catatan: "Dokumen verifikasi lengkap dan disahkan Camat",
  },
]

export default function PengajuanDesaPage() {
  const [list, setList] = useState<PengajuanDesa[]>(INITIAL_PENGAJUAN)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState("")
  const [desaFilter, setDesaFilter] = useState("semua")
  const [statusFilter, setStatusFilter] = useState("semua")

  const [jenis, setJenis] = useState("")
  const [desa, setDesa] = useState("")
  const [keterangan, setKeterangan] = useState("")

  function handleCreate() {
    if (!jenis || !desa) return
    const newRecord: PengajuanDesa = {
      id: `PD00${list.length + 1}`,
      desa,
      jenis,
      tanggal: new Date().toISOString().split("T")[0],
      dokumen: `Permohonan_${desa.replace(/\s+/g, "")}_${Date.now().toString().slice(-4)}.pdf`,
      status: "diajukan",
      catatan: keterangan || "Permohonan baru masuk meja pelayanan",
    }
    setList([newRecord, ...list])
    setShowModal(false)
    setJenis("")
    setDesa("")
    setKeterangan("")
  }

  const filteredList = list.filter((item) => {
    const matchSearch =
      item.desa.toLowerCase().includes(search.toLowerCase()) ||
      item.jenis.toLowerCase().includes(search.toLowerCase()) ||
      item.dokumen.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase())
    const matchDesa = desaFilter === "semua" || item.desa === desaFilter
    const matchStatus = statusFilter === "semua" || item.status === statusFilter
    return matchSearch && matchDesa && matchStatus
  })

  // KPI Metrics
  const total = list.length
  const proses = list.filter((i) => i.status === "proses" || i.status === "diajukan").length
  const disetujui = list.filter((i) => i.status === "disetujui").length
  const ditolak = list.filter((i) => i.status === "ditolak").length

  return (
    <div className="space-y-6 max-w-7xl pb-12">
      {/* Header GovTech */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Hubungan Antar Lembaga · Pemerintahan Desa
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2F4A3C] tracking-tight">
              Pengajuan Dari Desa
            </h1>
            <p className="text-sm text-gray-600 mt-1 max-w-3xl">
              Portal permohonan rekomendasi Dana Desa (DD), ADD, dan tata kelola perangkat desa dari Pemerintah Desa Temiang, Tajur Biru, dan Pulau Batang.
            </p>
          </div>

          <Button
            onClick={() => setShowModal(true)}
            className="bg-[#2F4A3C] hover:bg-[#23382d] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm self-start sm:self-auto shrink-0"
          >
            <FilePlus className="w-4 h-4 mr-2" /> Ajukan Permohonan Baru
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Total Permohonan</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{total}</p>
          <span className="text-[11px] text-gray-500 mt-1 block">3 Desa di Temiang Pesisir</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700">Sedang Diproses</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-800 mt-2">{proses}</p>
          <span className="text-[11px] text-amber-600 mt-1 block">Meja Verifikasi Kasi</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700">Disetujui & Terbit</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-800 mt-2">{disetujui}</p>
          <span className="text-[11px] text-emerald-600 mt-1 block">Rekomendasi Camat Sah</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700">Perlu Perbaikan</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-700">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-800 mt-2">{ditolak}</p>
          <span className="text-[11px] text-rose-600 mt-1 block">Syarat Belum Terpenuhi</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari desa, jenis permohonan, atau berkas..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={desaFilter}
            onChange={(e) => setDesaFilter(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 bg-white"
          >
            <option value="semua">Semua Desa (3)</option>
            {DESA_LIST.map((d) => (
              <option key={d} value={d}>
                Desa {d}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 bg-white"
          >
            <option value="semua">Semua Status</option>
            <option value="diajukan">Diajukan</option>
            <option value="proses">Dalam Proses</option>
            <option value="disetujui">Disetujui</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>
      </div>

      {/* Tabel Permohonan */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-gray-200/80 text-gray-500 uppercase tracking-wider font-bold text-[11px]">
              <tr>
                <th className="px-5 py-3.5">ID & Tanggal</th>
                <th className="px-5 py-3.5">Desa Pemohon</th>
                <th className="px-5 py-3.5">Jenis Permohonan</th>
                <th className="px-5 py-3.5">Dokumen Lampiran</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Catatan Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    Tidak ada data pengajuan permohonan desa yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono font-bold text-gray-900">{item.id}</span>
                      <span className="text-[11px] text-gray-500 block mt-0.5">{item.tanggal}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-[#2F4A3C] font-bold text-xs">
                          {item.desa[0]}
                        </div>
                        <span className="font-semibold text-gray-900">Desa {item.desa}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-800">{item.jenis}</td>
                    <td className="px-5 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono text-[11px] hover:bg-emerald-50 hover:text-emerald-800 transition-colors cursor-pointer">
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="truncate max-w-[160px]">{item.dokumen}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider",
                          item.status === "disetujui"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : item.status === "ditolak"
                            ? "bg-rose-50 text-rose-800 border border-rose-200"
                            : item.status === "proses"
                            ? "bg-blue-50 text-blue-800 border border-blue-200"
                            : "bg-slate-100 text-slate-800 border border-slate-200"
                        )}
                      >
                        {item.status === "disetujui" && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {item.status === "ditolak" && <XCircle className="w-3 h-3 text-rose-600" />}
                        {item.status === "proses" && <AlertCircle className="w-3 h-3 text-blue-600" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600 max-w-xs">
                      <p className="line-clamp-2">{item.catatan || "-"}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ajukan Rekomendasi */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-[#2F4A3C]">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#2F4A3C]">Ajukan Permohonan Desa</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Pilih Desa Pemohon <span className="text-red-500">*</span>
                </label>
                <select
                  value={desa}
                  onChange={(e) => setDesa(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 bg-white"
                >
                  <option value="">Pilih Desa...</option>
                  {DESA_LIST.map((d) => (
                    <option key={d} value={d}>
                      Desa {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Jenis Permohonan / Rekomendasi <span className="text-red-500">*</span>
                </label>
                <select
                  value={jenis}
                  onChange={(e) => setJenis(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 bg-white"
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
                <label className="block font-semibold text-gray-700 mb-1">
                  Unggah Berkas Lampiran (.pdf) <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:bg-emerald-50 file:text-emerald-800 file:font-semibold cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Catatan / Keterangan Tambahan
                </label>
                <textarea
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  rows={2}
                  placeholder="cth: Dokumen berita acara dan print out rekening terlampir lengkap"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowModal(false)}
                className="text-xs font-semibold rounded-xl border-gray-300"
              >
                Batal
              </Button>
              <Button
                size="sm"
                onClick={handleCreate}
                disabled={!jenis || !desa}
                className="bg-[#2F4A3C] hover:bg-[#23382d] text-white text-xs font-semibold px-4 rounded-xl disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" /> Kirim Permohonan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
