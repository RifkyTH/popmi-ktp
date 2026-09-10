"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Search,
  FileText,
  FilePlus,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Printer,
  ChevronRight,
  ChevronLeft,
  Building2,
  Inbox,
  Send,
  Calendar,
  Layers,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteButton } from "./delete-button"
import { DeleteAllButton } from "./delete-all-button"
import { JENIS_SURAT_LABELS, StatusSurat, JenisSurat } from "@/lib/mock-data/surat"
import { cn } from "@/lib/utils"

export interface RealSuratItem {
  id: string
  nomor: string
  jenis: JenisSurat | string
  judul: string
  pemohon: string
  desa?: string | null
  tanggal_buat: string
  tanggal_terbit?: string | null
  status: StatusSurat | string
  dibuat_oleh?: string | null
  diverifikasi_oleh?: string | null
  disetujui_oleh?: string | null
}

const PALETTE_JENIS: Record<string, string> = {
  rekomendasi_dd: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rekomendasi_add: "bg-sky-50 text-sky-700 border-sky-200",
  tunda_salur_add: "bg-red-50 text-red-700 border-red-200",
  dispensasi_nikah: "bg-amber-50 text-amber-700 border-amber-200",
  bbm_jbkp: "bg-teal-50 text-teal-700 border-teal-200",
  bbm_jbt: "bg-cyan-50 text-cyan-700 border-cyan-200",
  ahli_waris: "bg-purple-50 text-purple-700 border-purple-200",
  pemberhentian_perangkat: "bg-orange-50 text-orange-700 border-orange-200",
}

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; dotClass: string; icon: any }
> = {
  draf: {
    label: "Draf Awal",
    badgeClass: "bg-gray-100 text-gray-700 border-gray-200/80",
    dotClass: "bg-gray-400",
    icon: FileText,
  },
  verifikasi: {
    label: "Verifikasi Kasi",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200/80",
    dotClass: "bg-blue-500",
    icon: Clock,
  },
  menunggu_ttd: {
    label: "Menunggu TTD Camat",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200/80",
    dotClass: "bg-amber-500",
    icon: AlertCircle,
  },
  terbit: {
    label: "Terbit & Sah",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    dotClass: "bg-emerald-500",
    icon: CheckCircle2,
  },
  terkirim: {
    label: "Diarsipkan",
    badgeClass: "bg-teal-50 text-teal-700 border-teal-200/80",
    dotClass: "bg-teal-500",
    icon: Send,
  },
}

const DESA_LIST = ["Temiang", "Tajur Biru", "Pulau Batang"]

export function DaftarSuratClient({ initialSurat }: { initialSurat: RealSuratItem[] }) {
  const [activeTab, setActiveTab] = useState<string>("semua")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDesa, setSelectedDesa] = useState("")
  const [selectedJenis, setSelectedJenis] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const counts = useMemo(() => {
    return {
      total: initialSurat.length,
      draf: initialSurat.filter((s) => s.status === "draf").length,
      verifikasi: initialSurat.filter((s) => s.status === "verifikasi").length,
      menunggu_ttd: initialSurat.filter((s) => s.status === "menunggu_ttd").length,
      terbitSah: initialSurat.filter((s) => s.status === "terbit" || s.status === "terkirim").length,
      terkirim: initialSurat.filter((s) => s.status === "terkirim").length,
    }
  }, [initialSurat])

  const filteredSurat = useMemo(() => {
    return initialSurat.filter((s) => {
      if (activeTab === "draf" && s.status !== "draf") return false
      if (activeTab === "verifikasi" && s.status !== "verifikasi") return false
      if (activeTab === "menunggu_ttd" && s.status !== "menunggu_ttd") return false
      if (activeTab === "terbit" && s.status !== "terbit") return false
      if (activeTab === "terkirim" && s.status !== "terkirim") return false

      const q = searchTerm.toLowerCase().trim()
      if (q) {
        const matchNomor = s.nomor?.toLowerCase().includes(q)
        const matchPemohon = s.pemohon?.toLowerCase().includes(q)
        const matchJudul = s.judul?.toLowerCase().includes(q)
        const matchDesa = s.desa?.toLowerCase().includes(q)
        const matchMaker = s.dibuat_oleh?.toLowerCase().includes(q)
        if (!matchNomor && !matchPemohon && !matchJudul && !matchDesa && !matchMaker) {
          return false
        }
      }

      if (selectedDesa && s.desa !== selectedDesa) return false
      if (selectedJenis && s.jenis !== selectedJenis) return false

      return true
    })
  }, [initialSurat, activeTab, searchTerm, selectedDesa, selectedJenis])

  const totalPages = Math.ceil(filteredSurat.length / itemsPerPage) || 1
  const paginatedSurat = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredSurat.slice(start, start + itemsPerPage)
  }, [filteredSurat, currentPage])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setActiveTab("semua")
    setSearchTerm("")
    setSelectedDesa("")
    setSelectedJenis("")
    setCurrentPage(1)
  }

  const isFiltered = searchTerm || selectedDesa || selectedJenis || activeTab !== "semua"

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-teks/50">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sistem Tata Naskah Dinas
            </span>
            <span>•</span>
            <span>Kecamatan Temiang Pesisir</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold font-serif text-hijau tracking-tight">
            Daftar Surat & Pelayanan
          </h1>
          <p className="text-xs sm:text-sm text-teks/60 mt-0.5">
            Pantau pergerakan pengajuan, verifikasi teknis, disposisi, hingga pengesahan berkas
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <DeleteAllButton />
          <Link href="/internal/surat/baru">
            <Button className="bg-hijau hover:bg-hijau/90 text-white shadow-sm text-xs font-semibold cursor-pointer">
              <FilePlus className="w-4 h-4 mr-1.5" />
              Buat Surat Baru
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Total Pengajuan</span>
            <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-serif text-hijau">{counts.total}</p>
          <p className="text-xs text-teks/50 mt-1">seluruh berkas tercatat</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Proses Verifikasi</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-serif text-blue-700">{counts.draf + counts.verifikasi}</p>
          <p className="text-xs text-teks/50 mt-1">
            {counts.draf} draf • {counts.verifikasi} kasi
          </p>
        </div>

        <div className={cn(
          "bg-white rounded-2xl border p-5 shadow-xs transition-all",
          counts.menunggu_ttd > 0 ? "border-amber-300 bg-amber-50/20 ring-1 ring-amber-200" : "border-gray-200/80"
        )}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Menunggu TTD Camat</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-serif text-amber-700">{counts.menunggu_ttd}</p>
          <p className="text-xs text-amber-700/80 font-medium mt-1">
            {counts.menunggu_ttd > 0 ? "butuh tanda tangan Camat" : "semua telah ditandatangani"}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Surat Terbit & Sah</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-serif text-emerald-700">{counts.terbitSah}</p>
          <p className="text-xs text-teks/50 mt-1">dokumen siap cetak & arsip</p>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-3 shadow-sm flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => handleTabChange("semua")}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
            activeTab === "semua"
              ? "bg-hijau text-white shadow-xs"
              : "text-teks/70 hover:bg-gray-100 hover:text-teks"
          )}
        >
          Semua Dokumen ({counts.total})
        </button>
        <button
          onClick={() => handleTabChange("draf")}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
            activeTab === "draf"
              ? "bg-gray-800 text-white shadow-xs"
              : "text-teks/70 hover:bg-gray-100 hover:text-teks"
          )}
        >
          Draf ({counts.draf})
        </button>
        <button
          onClick={() => handleTabChange("verifikasi")}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
            activeTab === "verifikasi"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-teks/70 hover:bg-blue-50 hover:text-blue-700"
          )}
        >
          Verifikasi Kasi ({counts.verifikasi})
        </button>
        <button
          onClick={() => handleTabChange("menunggu_ttd")}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
            activeTab === "menunggu_ttd"
              ? "bg-amber-600 text-white shadow-xs"
              : "text-teks/70 hover:bg-amber-50 hover:text-amber-700"
          )}
        >
          {counts.menunggu_ttd > 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />}
          Menunggu TTD Camat ({counts.menunggu_ttd})
        </button>
        <button
          onClick={() => handleTabChange("terbit")}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
            activeTab === "terbit"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-teks/70 hover:bg-emerald-50 hover:text-emerald-700"
          )}
        >
          Terbit & Sah ({initialSurat.filter((s) => s.status === "terbit").length})
        </button>
        <button
          onClick={() => handleTabChange("terkirim")}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
            activeTab === "terkirim"
              ? "bg-teal-600 text-white shadow-xs"
              : "text-teks/70 hover:bg-teal-50 hover:text-teal-700"
          )}
        >
          Diarsipkan ({counts.terkirim})
        </button>
      </div>

      {/* Search & Dropdown Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-teks/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Cari nomor surat, nama pemohon, perihal, operator..."
            className="w-full text-xs sm:text-sm pl-9 pr-4 py-2 bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedDesa}
            onChange={(e) => {
              setSelectedDesa(e.target.value)
              setCurrentPage(1)
            }}
            className="text-xs sm:text-sm bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2 text-teks focus:outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau cursor-pointer"
          >
            <option value="">Semua Wilayah Desa</option>
            {DESA_LIST.map((desa) => (
              <option key={desa} value={desa}>
                Desa {desa}
              </option>
            ))}
          </select>

          <select
            value={selectedJenis}
            onChange={(e) => {
              setSelectedJenis(e.target.value)
              setCurrentPage(1)
            }}
            className="text-xs sm:text-sm bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2 text-teks focus:outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau max-w-[210px] cursor-pointer"
          >
            <option value="">Semua Jenis Surat</option>
            {Object.keys(JENIS_SURAT_LABELS).map((key) => (
              <option key={key} value={key}>
                {JENIS_SURAT_LABELS[key as JenisSurat]}
              </option>
            ))}
          </select>

          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset Filter
            </Button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold font-serif text-lg text-hijau tracking-tight">
              Tabel Dokumen Surat & Rekomendasi
            </h2>
            <p className="text-xs text-teks/50 mt-0.5">
              Menampilkan {filteredSurat.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredSurat.length)} dari {filteredSurat.length} surat
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/70 text-left text-[11px] uppercase tracking-wider text-teks/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5 font-bold">Nomor & Tanggal</th>
                <th className="px-6 py-3.5 font-bold">Jenis Pelayanan</th>
                <th className="px-6 py-3.5 font-bold">Pemohon / Desa</th>
                <th className="px-6 py-3.5 font-bold">Status Alur</th>
                <th className="px-6 py-3.5 font-bold">Operator</th>
                <th className="px-6 py-3.5 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedSurat.map((s) => {
                const conf = STATUS_CONFIG[s.status] || STATUS_CONFIG.draf
                const StatusIcon = conf.icon
                const canPrint = s.status === "terbit" || s.status === "terkirim"

                return (
                  <tr key={s.id} className="hover:bg-emerald-50/20 transition-colors">
                    {/* Nomor & Tanggal */}
                    <td className="px-6 py-4">
                      <p className="font-mono text-xs font-bold text-teks">{s.nomor}</p>
                      <p className="text-[11px] text-teks/40 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-teks/30" />
                        {s.tanggal_buat}
                      </p>
                    </td>

                    {/* Jenis Dokumen */}
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
                          PALETTE_JENIS[s.jenis] || "bg-gray-100 text-gray-700 border-gray-200"
                        )}
                      >
                        {JENIS_SURAT_LABELS[s.jenis as JenisSurat] ?? s.jenis}
                      </span>
                    </td>

                    {/* Pemohon / Desa */}
                    <td className="px-6 py-4 text-xs">
                      <p className="font-semibold text-teks">{s.pemohon}</p>
                      {s.desa ? (
                        <p className="text-[11px] text-teks/50 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-teks/40" />
                          Desa {s.desa}
                        </p>
                      ) : (
                        <p className="text-[11px] text-teks/40 mt-0.5">Pelayanan Langsung</p>
                      )}
                    </td>

                    {/* Status Alur */}
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                          conf.badgeClass
                        )}
                      >
                        <span className={cn("w-1.5 h-1.5 rounded-full", conf.dotClass)} />
                        <StatusIcon className="w-3.5 h-3.5" />
                        {conf.label}
                      </span>
                    </td>

                    {/* Operator */}
                    <td className="px-6 py-4 text-xs text-teks/60">
                      <p className="font-medium text-teks/80">{s.dibuat_oleh || "Sistem"}</p>
                      {s.diverifikasi_oleh && (
                        <p className="text-[10px] text-blue-600/80 mt-0.5">
                          Verif: {s.diverifikasi_oleh}
                        </p>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {canPrint && (
                          <Link
                            href={`/internal/surat/${s.id}/cetak`}
                            target="_blank"
                            title="Cetak Salinan Resmi PDF"
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Printer className="w-3 h-3" />
                            Cetak
                          </Link>
                        )}
                        <Link
                          href={`/internal/surat/${s.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-hijau hover:text-hijau/80 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Detail &rarr;
                        </Link>
                        <DeleteButton id={s.id} />
                      </div>
                    </td>
                  </tr>
                )
              })}

              {paginatedSurat.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-teks/40">
                      <Inbox className="w-10 h-10 mb-2 opacity-30 text-teks" />
                      <p className="text-sm font-semibold text-teks/70">Tidak ada berkas surat ditemukan</p>
                      <p className="text-xs text-teks/40 mt-1 max-w-sm">
                        {isFiltered
                          ? "Coba ubah kata kunci pencarian atau reset filter untuk melihat dokumen lainnya."
                          : "Belum ada dokumen surat yang dibuat di sistem."}
                      </p>
                      {isFiltered && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleResetFilters}
                          className="mt-3 text-xs cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3 mr-1.5" />
                          Reset Filter
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredSurat.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-teks/50">
              Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, filteredSurat.length)} sampai{" "}
              {Math.min(currentPage * itemsPerPage, filteredSurat.length)} dari {filteredSurat.length} total surat
            </p>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="text-xs h-8 px-2.5 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                Sebelumnya
              </Button>

              <span className="text-xs font-semibold px-2.5 text-teks/70">
                Halaman {currentPage} dari {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage >= totalPages}
                className="text-xs h-8 px-2.5 disabled:opacity-40 cursor-pointer"
              >
                Selanjutnya
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
