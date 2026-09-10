"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  X,
  Check,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  RotateCcw,
  Building2,
  Phone,
  Calendar,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Sparkles,
  Send,
  Layers,
  ShieldAlert
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  STATUS_PENGADUAN_LABELS, 
  KATEGORI_LABELS, 
  KATEGORI_COLORS, 
  StatusPengaduan, 
  KategoriPengaduan 
} from "@/lib/mock-data/pengaduan"
import { cn } from "@/lib/utils"
import { tambahPengaduan, editPengaduan, hapusPengaduan, hapusSemuaPengaduan } from "./actions"

const DESA_OPTIONS = [
  "Temiang",
  "Tajur Biru",
  "Pulau Batang",
  "Duara",
  "Pasir Panjang",
  "Sungai Buluh",
  "Lainnya",
]

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; dotClass: string; icon: any }
> = {
  masuk: {
    label: "Menunggu Respon",
    badgeClass: "bg-gray-100 text-gray-700 border-gray-200/80",
    dotClass: "bg-gray-400",
    icon: Inbox,
  },
  verifikasi: {
    label: "Verifikasi Lapangan",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200/80",
    dotClass: "bg-blue-500",
    icon: Clock,
  },
  proses: {
    label: "Sedang Ditindak",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200/80",
    dotClass: "bg-amber-500",
    icon: AlertCircle,
  },
  selesai: {
    label: "Selesai Ditangani",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    dotClass: "bg-emerald-500",
    icon: CheckCircle2,
  },
  ditolak: {
    label: "Tidak Dapat Diproses",
    badgeClass: "bg-red-50 text-red-700 border-red-200/80",
    dotClass: "bg-red-500",
    icon: XCircle,
  },
}

interface PengaduanItem {
  id: string
  tiket: string
  nama: string
  kontak: string
  kategori: string
  judul: string
  deskripsi: string
  desa: string
  lokasi: string | null
  status: string
  tanggal_masuk: string
  tanggal_update?: string
}

export function AduanTable({ initialData }: { initialData: PengaduanItem[] }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>("semua")
  const [searchTerm, setSearchTerm] = useState("")
  const [kategoriFilter, setKategoriFilter] = useState("")
  const [desaFilter, setDesaFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<PengaduanItem | null>(null)

  // Form States
  const [formData, setFormData] = useState({
    nama: "",
    kontak: "",
    kategori: "infrastruktur",
    desa: "Temiang",
    lokasi: "",
    judul: "",
    deskripsi: "",
    status: "masuk",
  })
  const [loading, setLoading] = useState(false)

  // KPI Counts
  const counts = useMemo(() => {
    return {
      total: initialData.length,
      masuk: initialData.filter((p) => p.status === "masuk").length,
      verifikasi: initialData.filter((p) => p.status === "verifikasi").length,
      proses: initialData.filter((p) => p.status === "proses").length,
      selesai: initialData.filter((p) => p.status === "selesai").length,
      ditolak: initialData.filter((p) => p.status === "ditolak").length,
      pending: initialData.filter((p) => p.status === "masuk" || p.status === "verifikasi").length,
    }
  }, [initialData])

  // Filtering
  const filteredData = useMemo(() => {
    return initialData.filter((p) => {
      // Tab filter
      if (activeTab === "masuk" && p.status !== "masuk") return false
      if (activeTab === "verifikasi" && p.status !== "verifikasi") return false
      if (activeTab === "proses" && p.status !== "proses") return false
      if (activeTab === "selesai" && p.status !== "selesai") return false
      if (activeTab === "ditolak" && p.status !== "ditolak") return false

      // Search filter
      const q = searchTerm.toLowerCase().trim()
      if (q) {
        const matchTiket = p.tiket.toLowerCase().includes(q)
        const matchNama = p.nama.toLowerCase().includes(q)
        const matchKontak = p.kontak.toLowerCase().includes(q)
        const matchJudul = p.judul.toLowerCase().includes(q)
        const matchDeskripsi = p.deskripsi.toLowerCase().includes(q)
        const matchDesa = p.desa.toLowerCase().includes(q)
        const matchLokasi = p.lokasi ? p.lokasi.toLowerCase().includes(q) : false
        if (!matchTiket && !matchNama && !matchKontak && !matchJudul && !matchDeskripsi && !matchDesa && !matchLokasi) {
          return false
        }
      }

      // Kategori filter
      if (kategoriFilter && p.kategori !== kategoriFilter) return false

      // Desa filter
      if (desaFilter && p.desa !== desaFilter) return false

      return true
    })
  }, [initialData, activeTab, searchTerm, kategoriFilter, desaFilter])

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredData.slice(start, start + itemsPerPage)
  }, [filteredData, currentPage])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setActiveTab("semua")
    setSearchTerm("")
    setKategoriFilter("")
    setDesaFilter("")
    setCurrentPage(1)
  }

  const isFiltered = searchTerm || kategoriFilter || desaFilter || activeTab !== "semua"


  // Open Create Modal
  function handleOpenCreate() {
    setFormData({
      nama: "",
      kontak: "",
      kategori: "infrastruktur",
      desa: "Temiang",
      lokasi: "",
      judul: "",
      deskripsi: "",
      status: "masuk",
    })
    setIsCreateOpen(true)
  }

  // Open Edit Modal
  function handleOpenEdit(item: PengaduanItem) {
    setSelectedItem(item)
    setFormData({
      nama: item.nama,
      kontak: item.kontak,
      kategori: item.kategori,
      desa: item.desa,
      lokasi: item.lokasi || "",
      judul: item.judul,
      deskripsi: item.deskripsi,
      status: item.status,
    })
    setIsEditOpen(true)
  }

  // Open Delete Modal
  function handleOpenDelete(item: PengaduanItem) {
    setSelectedItem(item)
    setIsDeleteOpen(true)
  }

  // Submit Create
  async function handleSubmitCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await tambahPengaduan(formData)
      setIsCreateOpen(false)
      router.refresh()
    } catch (err: any) {
      alert("Gagal menambahkan pengaduan: " + (err?.message || "Terjadi kesalahan"))
    } finally {
      setLoading(false)
    }
  }

  // Submit Edit
  async function handleSubmitEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedItem) return
    setLoading(true)
    try {
      await editPengaduan(selectedItem.id, formData)
      setIsEditOpen(false)
      router.refresh()
    } catch (err: any) {
      alert("Gagal memperbarui pengaduan: " + (err?.message || "Terjadi kesalahan"))
    } finally {
      setLoading(false)
    }
  }

  // Submit Delete
  async function handleConfirmDelete() {
    if (!selectedItem) return
    setLoading(true)
    try {
      await hapusPengaduan(selectedItem.id)
      setIsDeleteOpen(false)
      router.refresh()
    } catch (err: any) {
      alert("Gagal menghapus pengaduan: " + (err?.message || "Terjadi kesalahan"))
    } finally {
      setLoading(false)
    }
  }

  // Submit Delete All
  async function handleConfirmDeleteAll() {
    setLoading(true)
    try {
      await hapusSemuaPengaduan()
      setIsDeleteAllOpen(false)
      router.refresh()
    } catch (err: any) {
      alert("Gagal menghapus semua pengaduan: " + (err?.message || "Terjadi kesalahan"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-teks/50">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Layanan Aspirasi & Pengaduan Warga
            </span>
            <span>•</span>
            <span>Kecamatan Temiang Pesisir</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold font-serif text-hijau tracking-tight">
            Pengaduan & Aspirasi Masyarakat
          </h1>
          <p className="text-xs sm:text-sm text-teks/60 mt-0.5">
            Saluran penanganan aspirasi, keluhan fasilitas umum, dan laporan warga 3 desa
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {initialData.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteAllOpen(true)}
              className="text-xs text-red-600 border-red-200 hover:bg-red-50 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Hapus Semua
            </Button>
          )}

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="bg-hijau hover:bg-hijau/90 text-white shadow-sm text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Catat Aduan Baru
          </Button>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Total Aduan Masuk</span>
            <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-serif text-hijau">{counts.total}</p>
          <p className="text-xs text-teks/50 mt-1">keseluruhan laporan warga</p>
        </div>

        <div className={cn(
          "bg-white rounded-2xl border p-5 shadow-xs transition-all",
          counts.pending > 0 ? "border-amber-300 bg-amber-50/20 ring-1 ring-amber-200" : "border-gray-200/80"
        )}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Menunggu Verifikasi</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-serif text-amber-700">{counts.pending}</p>
          <p className="text-xs text-amber-700/80 font-medium mt-1">
            {counts.masuk} masuk • {counts.verifikasi} verifikasi
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Sedang Ditindaklanjuti</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-serif text-blue-700">{counts.proses}</p>
          <p className="text-xs text-teks/50 mt-1">dalam penanganan tim kecamatan</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Selesai Ditangani</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-serif text-emerald-700">{counts.selesai}</p>
          <p className="text-xs text-teks/50 mt-1">aspirasi tuntas terselesaikan</p>
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
          Semua Aduan ({counts.total})
        </button>
        <button
          onClick={() => handleTabChange("masuk")}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
            activeTab === "masuk"
              ? "bg-gray-800 text-white shadow-xs"
              : "text-teks/70 hover:bg-gray-100 hover:text-teks"
          )}
        >
          Menunggu ({counts.masuk})
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
          Verifikasi ({counts.verifikasi})
        </button>
        <button
          onClick={() => handleTabChange("proses")}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
            activeTab === "proses"
              ? "bg-amber-600 text-white shadow-xs"
              : "text-teks/70 hover:bg-amber-50 hover:text-amber-700"
          )}
        >
          Diproses ({counts.proses})
        </button>
        <button
          onClick={() => handleTabChange("selesai")}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
            activeTab === "selesai"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-teks/70 hover:bg-emerald-50 hover:text-emerald-700"
          )}
        >
          Selesai ({counts.selesai})
        </button>
        {counts.ditolak > 0 && (
          <button
            onClick={() => handleTabChange("ditolak")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
              activeTab === "ditolak"
                ? "bg-red-600 text-white shadow-xs"
                : "text-teks/70 hover:bg-red-50 hover:text-red-700"
            )}
          >
            Ditolak ({counts.ditolak})
          </button>
        )}
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
            placeholder="Cari nomor tiket, nama warga, isi keluhan, patokan lokasi..."
            className="w-full text-xs sm:text-sm pl-9 pr-4 py-2 bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={desaFilter}
            onChange={(e) => {
              setDesaFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="text-xs sm:text-sm bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2 text-teks focus:outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau cursor-pointer"
          >
            <option value="">Semua Wilayah Desa</option>
            {DESA_OPTIONS.map((d) => (
              <option key={d} value={d}>
                Desa {d}
              </option>
            ))}
          </select>

          <select
            value={kategoriFilter}
            onChange={(e) => {
              setKategoriFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="text-xs sm:text-sm bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2 text-teks focus:outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau max-w-[210px] cursor-pointer"
          >
            <option value="">Semua Kategori</option>
            {Object.entries(KATEGORI_LABELS).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
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
              Daftar Laporan & Keluhan Warga
            </h2>
            <p className="text-xs text-teks/50 mt-0.5">
              Menampilkan {filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length} laporan
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/70 text-left text-[11px] uppercase tracking-wider text-teks/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5 font-bold">Tiket & Tanggal</th>
                <th className="px-6 py-3.5 font-bold">Pelapor & Kontak</th>
                <th className="px-6 py-3.5 font-bold">Kategori & Masalah</th>
                <th className="px-6 py-3.5 font-bold">Lokasi / Desa</th>
                <th className="px-6 py-3.5 font-bold">Status Penanganan</th>
                <th className="px-6 py-3.5 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.map((p) => {
                const conf = STATUS_CONFIG[p.status] || STATUS_CONFIG.masuk
                const StatusIcon = conf.icon

                return (
                  <tr key={p.id} className="hover:bg-emerald-50/20 transition-colors">
                    {/* Tiket & Tanggal */}
                    <td className="px-6 py-4">
                      <p className="font-mono text-xs font-bold text-hijau">{p.tiket}</p>
                      <p className="text-[11px] text-teks/40 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-teks/30" />
                        {new Date(p.tanggal_masuk).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </td>

                    {/* Pelapor & Kontak */}
                    <td className="px-6 py-4 text-xs">
                      <p className="font-semibold text-teks">{p.nama}</p>
                      <p className="text-[11px] text-teks/50 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-emerald-600/70" />
                        {p.kontak}
                      </p>
                    </td>

                    {/* Kategori & Masalah */}
                    <td className="px-6 py-4 max-w-[260px]">
                      <span
                        className={cn(
                          "inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border mb-1",
                          KATEGORI_COLORS[p.kategori as KategoriPengaduan] || "bg-gray-100 text-gray-800 border-gray-200"
                        )}
                      >
                        {KATEGORI_LABELS[p.kategori as KategoriPengaduan] || p.kategori}
                      </span>
                      <p className="font-medium text-teks truncate" title={p.judul}>
                        {p.judul}
                      </p>
                      <p className="text-[11px] text-teks/40 line-clamp-1 mt-0.5" title={p.deskripsi}>
                        {p.deskripsi}
                      </p>
                    </td>

                    {/* Lokasi / Desa */}
                    <td className="px-6 py-4 text-xs">
                      <p className="font-medium text-teks flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-teks/40" />
                        Desa {p.desa}
                      </p>
                      {p.lokasi && (
                        <p className="text-[11px] text-teks/50 line-clamp-1 mt-0.5" title={p.lokasi}>
                          {p.lokasi}
                        </p>
                      )}
                    </td>

                    {/* Status Penanganan */}
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

                    {/* Aksi */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/internal/aduan/${p.tiket}`}
                          title="Lihat Detail & Tindak Lanjut"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-hijau hover:text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          Detail
                        </Link>

                        <button
                          title="Ubah Data / Status"
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg border border-gray-200 text-teks/60 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          title="Hapus Aduan"
                          onClick={() => handleOpenDelete(p)}
                          className="p-1.5 rounded-lg border border-gray-200 text-teks/60 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-teks/40">
                      <Inbox className="w-10 h-10 mb-2 opacity-30 text-teks" />
                      <p className="text-sm font-semibold text-teks/70">Tidak ada pengaduan ditemukan</p>
                      <p className="text-xs text-teks/40 mt-1 max-w-sm">
                        {isFiltered
                          ? "Coba ubah kata kunci pencarian atau reset filter untuk melihat laporan lainnya."
                          : "Belum ada laporan pengaduan masyarakat yang tercatat."}
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
        {filteredData.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-teks/50">
              Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)} sampai{" "}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length} total laporan
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


      {/* MODAL: TAMBAH PENGADUAN */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-krem/40">
              <div>
                <h3 className="font-serif font-bold text-hijau text-lg">Catat Pengaduan Baru</h3>
                <p className="text-xs text-teks/60">Input aspirasi atau keluhan warga secara langsung</p>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCreate} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-teks/70 mb-1">
                    Nama Pelapor <span className="text-merah">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kuning"
                    placeholder="Nama lengkap warga"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teks/70 mb-1">
                    Kontak / WhatsApp <span className="text-merah">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.kontak}
                    onChange={(e) => setFormData({ ...formData, kontak: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kuning"
                    placeholder="cth: 081234567890"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teks/70 mb-1">
                    Desa Asal <span className="text-merah">*</span>
                  </label>
                  <select
                    value={formData.desa}
                    onChange={(e) => setFormData({ ...formData, desa: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kuning bg-white"
                  >
                    {DESA_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teks/70 mb-1">
                    Kategori <span className="text-merah">*</span>
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kuning bg-white"
                  >
                    {Object.entries(KATEGORI_LABELS).map(([k, label]) => (
                      <option key={k} value={k}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-teks/70 mb-1">Lokasi Kejadian / Patokan</label>
                <input
                  type="text"
                  value={formData.lokasi}
                  onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kuning"
                  placeholder="cth: Depan SDN 001 Temiang / Dermaga Pasir Panjang"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-teks/70 mb-1">
                  Judul Pengaduan <span className="text-merah">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kuning"
                  placeholder="Ringkasan masalah secara singkat"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-teks/70 mb-1">
                  Rincian / Isi Pengaduan <span className="text-merah">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kuning resize-none"
                  placeholder="Jelaskan secara detail keluhan atau permasalahan..."
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} disabled={loading}>
                  Batal
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Menyimpan..." : "Simpan Pengaduan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PENGADUAN */}
      {isEditOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-krem/40">
              <div>
                <h3 className="font-serif font-bold text-hijau text-lg">Edit Pengaduan</h3>
                <p className="text-xs text-teks/60">Tiket: {selectedItem.tiket}</p>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-teks/70 mb-1">
                    Nama Pelapor <span className="text-merah">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kuning"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teks/70 mb-1">
                    Kontak / WhatsApp <span className="text-merah">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.kontak}
                    onChange={(e) => setFormData({ ...formData, kontak: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kuning"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teks/70 mb-1">Desa Asal</label>
                  <select
                    value={formData.desa}
                    onChange={(e) => setFormData({ ...formData, desa: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kuning bg-white"
                  >
                    {DESA_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teks/70 mb-1">Kategori</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kuning bg-white"
                  >
                    {Object.entries(KATEGORI_LABELS).map(([k, label]) => (
                      <option key={k} value={k}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-teks/70 mb-1">Status Pengaduan</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kuning bg-white"
                >
                  {Object.entries(STATUS_PENGADUAN_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-teks/70 mb-1">Lokasi Kejadian / Patokan</label>
                <input
                  type="text"
                  value={formData.lokasi}
                  onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kuning"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-teks/70 mb-1">
                  Judul Pengaduan <span className="text-merah">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kuning"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-teks/70 mb-1">
                  Rincian / Isi Pengaduan <span className="text-merah">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kuning resize-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={loading}>
                  Batal
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI HAPUS SINGLE */}
      {isDeleteOpen && selectedItem && (
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
              Apakah Anda yakin ingin menghapus aduan{" "}
              <strong className="text-hijau">[{selectedItem.tiket}]</strong> &quot;{selectedItem.judul}&quot; dari{" "}
              <strong>{selectedItem.nama}</strong>?
            </p>

            <div className="flex justify-end gap-2.5 mt-5">
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={loading}>
                Batal
              </Button>
              <Button
                onClick={handleConfirmDelete}
                disabled={loading}
                className="bg-merah hover:bg-red-700 text-white"
              >
                {loading ? "Menghapus..." : "Ya, Hapus Aduan"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI HAPUS SEMUA */}
      {isDeleteAllOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-merah mb-3">
              <div className="p-2.5 bg-red-100 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-teks">Hapus Seluruh Pengaduan?</h3>
                <p className="text-xs text-teks/60">PERINGATAN: Semua data aduan akan dihapus permanen.</p>
              </div>
            </div>

            <p className="text-sm text-teks/80 my-4 bg-red-50 p-3 rounded-xl border border-red-200 text-merah">
              Tindakan ini akan menghapus <strong>{initialData.length}</strong> laporan pengaduan beserta seluruh
              riwayat penanganannya.
            </p>

            <div className="flex justify-end gap-2.5 mt-5">
              <Button variant="outline" onClick={() => setIsDeleteAllOpen(false)} disabled={loading}>
                Batal
              </Button>
              <Button
                onClick={handleConfirmDeleteAll}
                disabled={loading}
                className="bg-merah hover:bg-red-700 text-white"
              >
                {loading ? "Menghapus Semua..." : "Hapus Semua Aduan"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
