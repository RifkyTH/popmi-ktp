"use client"

import { useState, useTransition, useId } from "react"
import {
  Informasi,
  KategoriInfo,
  KATEGORI_LABELS,
  FOTO_PRESETS,
} from "@/lib/mock-data/informasi"
import {
  simpanInformasi,
  hapusInformasi,
  toggleStatusPublikasi,
  toggleStatusHeadline,
} from "@/lib/actions/informasi"
import { User } from "@/lib/auth"
import {
  Newspaper,
  Plus,
  Search,
  SlidersHorizontal,
  Calendar,
  User as UserIcon,
  CheckCircle2,
  XCircle,
  Star,
  Eye,
  Edit3,
  Trash2,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Loader2,
  X,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowUpRight,
  Filter,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function InformasiClient({
  initialData,
  currentUser,
}: {
  initialData: Informasi[]
  currentUser: User | null
}) {
  const [dataList, setDataList] = useState<Informasi[]>(initialData)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedKategori, setSelectedKategori] = useState<string>("semua")
  const [statusFilter, setStatusFilter] = useState<"semua" | "terbit" | "draf" | "headline">("semua")
  const [isPending, startTransition] = useTransition()

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Informasi | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Form State
  const [formJudul, setFormJudul] = useState("")
  const [formKategori, setFormKategori] = useState<KategoriInfo>("pengumuman")
  const [formRingkasan, setFormRingkasan] = useState("")
  const [formIsi, setFormIsi] = useState("")
  const [formTanggal, setFormTanggal] = useState("")
  const [formPenulis, setFormPenulis] = useState("")
  const [formGambar, setFormGambar] = useState("")
  const [formPublished, setFormPublished] = useState(true)
  const [formIsHeadline, setFormIsHeadline] = useState(false)

  // Stats calculation
  const totalCount = dataList.length
  const publishedCount = dataList.filter((d) => d.published !== false).length
  const draftCount = dataList.filter((d) => d.published === false).length
  const headlineCount = dataList.filter((d) => d.is_headline).length

  // Filtered list
  const filteredList = dataList.filter((item) => {
    const matchesSearch =
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ringkasan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.penulis.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesKategori =
      selectedKategori === "semua" || item.kategori === selectedKategori

    let matchesStatus = true
    if (statusFilter === "terbit") matchesStatus = item.published !== false
    if (statusFilter === "draf") matchesStatus = item.published === false
    if (statusFilter === "headline") matchesStatus = Boolean(item.is_headline)

    return matchesSearch && matchesKategori && matchesStatus
  })

  const openCreateModal = () => {
    setEditingItem(null)
    setFormJudul("")
    setFormKategori("pengumuman")
    setFormRingkasan("")
    setFormIsi("")
    setFormTanggal(new Date().toISOString().split("T")[0])
    setFormPenulis(currentUser ? `${currentUser.nama}` : "Admin Kecamatan")
    setFormGambar("")
    setFormPublished(true)
    setFormIsHeadline(false)
    setFeedbackMsg(null)
    setIsModalOpen(true)
  }

  const openEditModal = (item: Informasi) => {
    setEditingItem(item)
    setFormJudul(item.judul)
    setFormKategori(item.kategori)
    setFormRingkasan(item.ringkasan)
    setFormIsi(item.isi)
    setFormTanggal(item.tanggal || new Date().toISOString().split("T")[0])
    setFormPenulis(item.penulis)
    setFormGambar(item.gambar || "")
    setFormPublished(item.published !== false)
    setFormIsHeadline(Boolean(item.is_headline))
    setFeedbackMsg(null)
    setIsModalOpen(true)
  }

  // Handle Photo File Upload to base64 Data URL with canvas compression
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const MAX_WIDTH = 1280
        const scaleSize = MAX_WIDTH / img.width
        const width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width
        const height = img.width > MAX_WIDTH ? img.height * scaleSize : img.height

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0, width, height)
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.82)
        setFormGambar(compressedDataUrl)
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formJudul.trim() || !formIsi.trim()) {
      setFeedbackMsg({ type: "error", text: "Judul dan isi informasi wajib diisi!" })
      return
    }

    setIsSaving(true)
    setFeedbackMsg(null)

    try {
      await simpanInformasi({
        id: editingItem?.id,
        judul: formJudul.trim(),
        kategori: formKategori,
        ringkasan: formRingkasan.trim() || formJudul.trim(),
        isi: formIsi.trim(),
        tanggal: formTanggal,
        penulis: formPenulis.trim(),
        gambar: formGambar.trim() || undefined,
        published: formPublished,
        is_headline: formIsHeadline,
      })

      // Update local state optimistically
      const updatedSlug = editingItem
        ? editingItem.slug
        : formJudul.toLowerCase().replace(/[^a-z0-9]+/g, "-")

      const newItem: Informasi = {
        id: editingItem?.id || `I-LOCAL-${Date.now()}`,
        slug: updatedSlug,
        judul: formJudul.trim(),
        kategori: formKategori,
        ringkasan: formRingkasan.trim() || formJudul.trim(),
        isi: formIsi.trim(),
        tanggal: formTanggal,
        penulis: formPenulis.trim(),
        gambar: formGambar.trim() || undefined,
        published: formPublished,
        is_headline: formIsHeadline,
      }

      if (editingItem) {
        setDataList((prev) => prev.map((item) => (item.id === editingItem.id ? newItem : item)))
      } else {
        setDataList((prev) => [newItem, ...prev])
      }

      setIsModalOpen(false)
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err?.message || "Gagal menyimpan informasi." })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string, judul: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus informasi "${judul}"?`)) return

    startTransition(async () => {
      try {
        await hapusInformasi(id)
        setDataList((prev) => prev.filter((item) => item.id !== id))
      } catch (err: any) {
        alert("Gagal menghapus: " + err?.message)
      }
    })
  }

  const handleTogglePublish = async (id: string, currentStatus: boolean | undefined) => {
    const nextStatus = currentStatus === false ? true : false
    startTransition(async () => {
      try {
        await toggleStatusPublikasi(id, nextStatus)
        setDataList((prev) =>
          prev.map((item) => (item.id === id ? { ...item, published: nextStatus } : item))
        )
      } catch (err: any) {
        alert("Gagal mengubah status publikasi: " + err?.message)
      }
    })
  }

  const handleToggleHeadline = async (id: string, currentHeadline: boolean | undefined) => {
    const nextHeadline = !currentHeadline
    startTransition(async () => {
      try {
        await toggleStatusHeadline(id, nextHeadline)
        setDataList((prev) =>
          prev.map((item) => (item.id === id ? { ...item, is_headline: nextHeadline } : item))
        )
      } catch (err: any) {
        alert("Gagal mengubah status slide show: " + err?.message)
      }
    })
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#2F4A3C]/10 text-[#2F4A3C]">
              <Newspaper className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold font-serif text-[#2F4A3C]">
              Manajemen Publikasi &amp; Berita
            </h1>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            Kelola pengumuman resmi, berita kecamatan, agenda pelayanan, dan foto dokumentasi kegiatan untuk ditampilkan di portal publik POPMI KTP.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/publik/informasi"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-[#2F4A3C] hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Portal Publik</span>
          </Link>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2F4A3C] hover:bg-[#23382D] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D9A400]" />
            <span>Tambah Informasi Baru</span>
          </button>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Publikasi</p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">{totalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Terbit ke Publik</p>
            <p className="text-2xl font-bold text-emerald-700 mt-0.5">{publishedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">Tampil Slide Show</p>
            <p className="text-2xl font-bold text-amber-600 mt-0.5">{headlineCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Draf Internal</p>
            <p className="text-2xl font-bold text-slate-600 mt-0.5">{draftCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul, kata kunci, penulis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#2F4A3C] bg-slate-50/50"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setStatusFilter("semua")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors",
                statusFilter === "semua"
                  ? "bg-[#2F4A3C] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              Semua ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter("terbit")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors",
                statusFilter === "terbit"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              Terbit ({publishedCount})
            </button>
            <button
              onClick={() => setStatusFilter("headline")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1",
                statusFilter === "headline"
                  ? "bg-amber-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              <Star className="w-3 h-3 fill-current" />
              <span>Slide Show ({headlineCount})</span>
            </button>
            <button
              onClick={() => setStatusFilter("draf")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors",
                statusFilter === "draf"
                  ? "bg-slate-700 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              Draf ({draftCount})
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Kategori:
          </span>
          <button
            onClick={() => setSelectedKategori("semua")}
            className={cn(
              "px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors",
              selectedKategori === "semua"
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            Semua Kategori
          </button>
          {(Object.keys(KATEGORI_LABELS) as KategoriInfo[]).map((kat) => (
            <button
              key={kat}
              onClick={() => setSelectedKategori(kat)}
              className={cn(
                "px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors",
                selectedKategori === kat
                  ? "bg-[#2F4A3C] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {KATEGORI_LABELS[kat]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {filteredList.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Tidak ada informasi yang cocok</p>
            <p className="text-xs text-slate-400">Coba ubah kata kunci pencarian atau filter kategori di atas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10.5px]">
                  <th className="py-3 px-4 w-28">Foto Cover</th>
                  <th className="py-3 px-4 min-w-[240px]">Judul &amp; Ringkasan</th>
                  <th className="py-3 px-4 w-32">Kategori</th>
                  <th className="py-3 px-4 w-36">Tanggal &amp; Penulis</th>
                  <th className="py-3 px-4 w-28 text-center">Status</th>
                  <th className="py-3 px-4 w-28 text-center">Slide Show</th>
                  <th className="py-3 px-4 w-28 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Thumbnail */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="w-20 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative shrink-0">
                        {item.gambar ? (
                          <img
                            src={item.gambar}
                            alt={item.judul}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 text-[10px]">
                            <ImageIcon className="w-4 h-4 mb-0.5" />
                            <span>No foto</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Judul & Ringkasan */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-800 text-sm hover:text-[#2F4A3C] transition-colors line-clamp-1 block">
                          {item.judul}
                        </span>
                        <p className="text-slate-500 line-clamp-2 text-xs leading-relaxed">
                          {item.ringkasan}
                        </p>
                        <div className="pt-0.5">
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            slug: {item.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Kategori */}
                    <td className="py-3.5 px-4 align-top">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#2F4A3C]/10 text-[#2F4A3C] border border-[#2F4A3C]/20">
                        {KATEGORI_LABELS[item.kategori] || item.kategori}
                      </span>
                    </td>

                    {/* Tanggal & Penulis */}
                    <td className="py-3.5 px-4 align-top text-slate-600">
                      <div className="space-y-1">
                        <span className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {item.tanggal}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-500 line-clamp-1">
                          <UserIcon className="w-3 h-3 text-slate-400" />
                          {item.penulis}
                        </span>
                      </div>
                    </td>

                    {/* Status Terbit */}
                    <td className="py-3.5 px-4 align-top text-center">
                      <button
                        onClick={() => handleTogglePublish(item.id, item.published)}
                        disabled={isPending}
                        title="Klik untuk ubah status publikasi"
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer shadow-2xs",
                          item.published !== false
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                        )}
                      >
                        {item.published !== false ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Terbit</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-400" />
                            <span>Draf</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Headline Slide Show */}
                    <td className="py-3.5 px-4 align-top text-center">
                      <button
                        onClick={() => handleToggleHeadline(item.id, item.is_headline)}
                        disabled={isPending}
                        title="Klik untuk tampilkan / sembunyikan di slide show beranda"
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer shadow-2xs",
                          item.is_headline
                            ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                            : "bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100"
                        )}
                      >
                        <Star
                          className={cn(
                            "w-3 h-3",
                            item.is_headline ? "fill-amber-500 text-amber-500" : "text-slate-300"
                          )}
                        />
                        <span>{item.is_headline ? "Aktif" : "Mati"}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 align-top text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/publik/informasi/${item.slug}`}
                          target="_blank"
                          title="Lihat di Portal Publik"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#2F4A3C] hover:bg-slate-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openEditModal(item)}
                          title="Edit Informasi"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.judul)}
                          title="Hapus Informasi"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog Form (Tambah / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 my-8 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#2F4A3C]/10 text-[#2F4A3C]">
                  <Newspaper className="w-4 h-4" />
                </span>
                <h3 className="font-serif font-bold text-base text-[#2F4A3C]">
                  {editingItem ? "Edit Informasi / Berita" : "Tambah Informasi & Berita Baru"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              {feedbackMsg && (
                <div
                  className={cn(
                    "p-3 rounded-xl border flex items-center gap-2",
                    feedbackMsg.type === "error"
                      ? "bg-rose-50 border-rose-200 text-rose-700"
                      : "bg-emerald-50 border-emerald-200 text-emerald-700"
                  )}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{feedbackMsg.text}</span>
                </div>
              )}

              {/* Judul & Kategori */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    Judul Informasi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Undangan Musrenbang Kecamatan Temiang Pesisir 2026"
                    value={formJudul}
                    onChange={(e) => setFormJudul(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2F4A3C] text-xs font-semibold text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Kategori</label>
                  <select
                    value={formKategori}
                    onChange={(e) => setFormKategori(e.target.value as KategoriInfo)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2F4A3C] text-xs font-semibold text-slate-800 bg-white"
                  >
                    {(Object.keys(KATEGORI_LABELS) as KategoriInfo[]).map((kat) => (
                      <option key={kat} value={kat}>
                        {KATEGORI_LABELS[kat]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tanggal & Penulis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Tanggal Publikasi</label>
                  <input
                    type="date"
                    value={formTanggal}
                    onChange={(e) => setFormTanggal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2F4A3C] text-xs text-slate-800 bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Nama Penulis / Instansi</label>
                  <input
                    type="text"
                    placeholder="Contoh: Sekretariat Kecamatan / Hj. Siti Rahayu, S.Sos"
                    value={formPenulis}
                    onChange={(e) => setFormPenulis(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2F4A3C] text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Foto Dokumentasi & Presets */}
              <div className="space-y-2.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#2F4A3C]" />
                    <span>Foto Cover / Dokumentasi Kegiatan</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Format: JPG, PNG, WebP (Rasio 16:9 disarankan)</span>
                </div>

                {/* Upload or URL input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <label className="flex items-center justify-center gap-2 px-4 py-2.5 border border-dashed border-[#2F4A3C]/40 rounded-xl bg-white hover:bg-slate-50 cursor-pointer transition-all text-[#2F4A3C] font-semibold text-xs shadow-2xs">
                    <Upload className="w-4 h-4" />
                    <span>Upload Foto Dari Perangkat</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="url"
                    placeholder="Atau tempel URL gambar (https://...)"
                    value={formGambar}
                    onChange={(e) => setFormGambar(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2F4A3C] bg-white text-xs"
                  />
                </div>

                {/* Presets quick selection */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                    Atau Pilih Dari Koleksi Foto Resmi Kecamatan:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {FOTO_PRESETS.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setFormGambar(preset.url)}
                        className={cn(
                          "flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all",
                          formGambar === preset.url
                            ? "border-[#2F4A3C] bg-emerald-50 text-[#2F4A3C] font-bold"
                            : "border-slate-200 bg-white hover:border-slate-300 text-slate-600"
                        )}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-8 h-8 rounded object-cover shrink-0"
                        />
                        <span className="text-[10px] line-clamp-1 leading-tight">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview Image */}
                {formGambar && (
                  <div className="mt-3 relative w-full h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group">
                    <img
                      src={formGambar}
                      alt="Preview Cover"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormGambar("")}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors"
                      title="Hapus Foto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/60 text-white text-[10px] backdrop-blur-xs font-semibold">
                      Preview Foto Siap Ditampilkan
                    </div>
                  </div>
                )}
              </div>

              {/* Ringkasan */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Ringkasan Singkat (Lead / Excerpt)</label>
                <textarea
                  rows={2}
                  placeholder="Ringkasan 1-2 kalimat untuk tampilan kartu dan banner slide show..."
                  value={formRingkasan}
                  onChange={(e) => setFormRingkasan(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2F4A3C] text-xs text-slate-800"
                />
              </div>

              {/* Isi Lengkap */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center gap-1">
                  Isi Informasi Lengkap <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Tuliskan isi pengumuman/berita lengkap. Mendukung pemisahan baris dan format markdown..."
                  value={formIsi}
                  onChange={(e) => setFormIsi(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2F4A3C] text-xs text-slate-800 leading-relaxed font-mono"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formPublished}
                    onChange={(e) => setFormPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2F4A3C] focus:ring-[#2F4A3C]"
                  />
                  <div>
                    <span className="font-bold text-slate-800 block">Publikasikan ke Portal Warga</span>
                    <span className="text-[11px] text-slate-500">Artikel akan langsung dapat dibaca oleh masyarakat</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsHeadline}
                    onChange={(e) => setFormIsHeadline(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <span className="font-bold text-amber-800 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>Tampilkan di Hero Slide Show</span>
                    </span>
                    <span className="text-[11px] text-slate-500">Akan tampil di banner utama beranda portal publik</span>
                  </div>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#2F4A3C] hover:bg-[#23382D] text-white font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D9A400]" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#D9A400]" />
                      <span>{editingItem ? "Simpan Perubahan" : "Terbitkan Informasi"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
