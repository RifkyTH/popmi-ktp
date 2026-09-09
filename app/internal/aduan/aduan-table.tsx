"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, Pencil, Trash2, Plus, Search, Filter, AlertTriangle, X, Check } from "lucide-react"
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

const statusColors: Record<StatusPengaduan, string> = {
  masuk: "bg-gray-100 text-gray-700",
  verifikasi: "bg-blue-100 text-blue-700",
  proses: "bg-orange-100 text-orange-700",
  selesai: "bg-green-100 text-green-700",
  ditolak: "bg-red-100 text-red-700",
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
  const [searchTerm, setSearchTerm] = useState("")
  const [kategoriFilter, setKategoriFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

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

  // Filtering
  const filteredData = initialData.filter((p) => {
    const matchSearch =
      searchTerm === "" ||
      p.tiket.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.desa.toLowerCase().includes(searchTerm.toLowerCase())

    const matchKategori = kategoriFilter === "" || p.kategori === kategoriFilter
    const matchStatus = statusFilter === "" || p.status === statusFilter

    return matchSearch && matchKategori && matchStatus
  })

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
    <div className="space-y-4">
      {/* Top Filter & Actions */}
      <div className="bg-white p-4 rounded-xl border border-kuning-muda shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex flex-1 flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari tiket, nama, judul, desa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kuning"
            />
          </div>

          <select
            value={kategoriFilter}
            onChange={(e) => setKategoriFilter(e.target.value)}
            className="text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kuning bg-white"
          >
            <option value="">Semua Kategori</option>
            {Object.entries(KATEGORI_LABELS).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kuning bg-white"
          >
            <option value="">Semua Status</option>
            {Object.entries(STATUS_PENGADUAN_LABELS).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {initialData.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteAllOpen(true)}
              className="text-merah border-merah/20 hover:bg-merah/10"
            >
              <Trash2 className="w-4 h-4 mr-1.5" /> Hapus Semua
            </Button>
          )}

          <Button size="sm" onClick={handleOpenCreate}>
            <Plus className="w-4 h-4 mr-1.5" /> Tambah Aduan
          </Button>
        </div>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-xl border border-kuning-muda overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-krem/30 text-left">
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-teks/50">Tiket & Tanggal</th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-teks/50">Pelapor</th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-teks/50">Kategori & Judul</th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-teks/50">Lokasi / Desa</th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-teks/50">Status</th>
                <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-teks/50">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((p) => (
                <tr key={p.id} className="hover:bg-krem/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-mono text-xs font-bold text-hijau mb-1">{p.tiket}</div>
                    <div className="text-xs text-teks/60">
                      {new Date(p.tanggal_masuk).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-teks">{p.nama}</div>
                    <div className="text-xs text-teks/60 mt-0.5">{p.kontak}</div>
                  </td>
                  <td className="px-5 py-4 max-w-[250px]">
                    <span
                      className={cn(
                        "inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-1.5",
                        KATEGORI_COLORS[p.kategori as KategoriPengaduan] || "bg-gray-100 text-gray-800"
                      )}
                    >
                      {KATEGORI_LABELS[p.kategori as KategoriPengaduan] || p.kategori}
                    </span>
                    <div className="font-medium text-teks truncate" title={p.judul}>
                      {p.judul}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-teks/80">{p.desa}</td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap",
                        statusColors[p.status as StatusPengaduan] || "bg-gray-100 text-gray-700"
                      )}
                    >
                      {STATUS_PENGADUAN_LABELS[p.status as StatusPengaduan] || p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link href={`/internal/aduan/${p.tiket}`}>
                        <button
                          title="Lihat / Tindak Lanjut"
                          className="p-1.5 rounded-lg border border-gray-200 text-teks/70 hover:bg-gray-50 hover:text-hijau transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>

                      <button
                        title="Edit Pengaduan"
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg border border-gray-200 text-teks/70 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        title="Hapus Pengaduan"
                        onClick={() => handleOpenDelete(p)}
                        className="p-1.5 rounded-lg border border-gray-200 text-teks/70 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-teks/50">
                    {searchTerm || kategoriFilter || statusFilter
                      ? "Tidak ada pengaduan yang cocok dengan filter pencarian."
                      : "Belum ada pengaduan masyarakat yang masuk."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
