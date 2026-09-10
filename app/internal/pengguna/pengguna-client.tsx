"use client"

import { useState, useTransition, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { UserDialog } from "./user-dialog"
import { toggleAktifPengguna, hapusPengguna } from "./actions"
import { useRouter } from "next/navigation"
import type { UserRole } from "@/lib/auth"
import {
  UserPlus,
  Pencil,
  ShieldOff,
  ShieldCheck,
  Trash2,
  Search,
  Users,
  Building2,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  UserCheck
} from "lucide-react"
import { cn } from "@/lib/utils"

type Pengguna = {
  id: string
  nama: string
  username: string
  role: UserRole
  jabatan: string
  desa?: string | null
  aktif: boolean
  created_at: string
}

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  camat: "Camat",
  sekretaris: "Sekretaris",
  kasi_pem: "Kasi Pem",
  kasi_ekbang: "Kasi Ekbang",
  kasi_kesos: "Kasi Kesos",
  kasi: "Kasi Pemerintahan",
  kasi_ekobang: "Kasi Ekobang",
  kasi_kessos: "Kasi Kessos",
  staf: "Staf",
  petugas: "Petugas",
}

const ROLE_COLORS: Record<UserRole, string> = {
  super_admin: "bg-purple-50 text-purple-700 border-purple-200/80",
  admin: "bg-blue-50 text-blue-700 border-blue-200/80",
  camat: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
  sekretaris: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
  kasi_pem: "bg-teal-50 text-teal-700 border-teal-200/80",
  kasi_ekbang: "bg-amber-50 text-amber-700 border-amber-200/80",
  kasi_kesos: "bg-pink-50 text-pink-700 border-pink-200/80",
  kasi: "bg-teal-50 text-teal-700 border-teal-200/80",
  kasi_ekobang: "bg-amber-50 text-amber-700 border-amber-200/80",
  kasi_kessos: "bg-pink-50 text-pink-700 border-pink-200/80",
  staf: "bg-gray-100 text-gray-700 border-gray-200/80",
  petugas: "bg-orange-50 text-orange-700 border-orange-200/80",
}

export function PenggunaClient({ penggunaList }: { penggunaList: Pengguna[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [activeTab, setActiveTab] = useState<string>("semua")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [dialog, setDialog] = useState<{ open: boolean; mode: "tambah" | "edit"; pengguna?: Pengguna }>({
    open: false,
    mode: "tambah",
  })
  const [confirmDelete, setConfirmDelete] = useState<Pengguna | null>(null)

  // KPI Counts
  const counts = useMemo(() => {
    return {
      total: penggunaList.length,
      aktif: penggunaList.filter((p) => p.aktif).length,
      nonaktif: penggunaList.filter((p) => !p.aktif).length,
      roles: new Set(penggunaList.map((p) => p.role)).size,
    }
  }, [penggunaList])

  // Filtering
  const filtered = useMemo(() => {
    return penggunaList.filter((p) => {
      // Tab Category
      if (activeTab === "pimpinan" && p.role !== "camat" && p.role !== "sekretaris") return false
      if (
        activeTab === "kasi" &&
        !["kasi_pem", "kasi_ekbang", "kasi_kesos", "kasi", "kasi_ekobang", "kasi_kessos"].includes(p.role)
      )
        return false
      if (activeTab === "pelaksana" && p.role !== "staf" && p.role !== "petugas") return false
      if (activeTab === "admin" && p.role !== "super_admin" && p.role !== "admin") return false

      // Search
      const q = search.toLowerCase().trim()
      if (q) {
        const matchNama = p.nama.toLowerCase().includes(q)
        const matchUser = p.username.toLowerCase().includes(q)
        const matchJab = p.jabatan.toLowerCase().includes(q)
        const matchDesa = p.desa ? p.desa.toLowerCase().includes(q) : false
        if (!matchNama && !matchUser && !matchJab && !matchDesa) return false
      }

      // Role Filter
      if (roleFilter && p.role !== roleFilter) return false

      // Status Filter
      if (statusFilter === "aktif" && !p.aktif) return false
      if (statusFilter === "nonaktif" && p.aktif) return false

      return true
    })
  }, [penggunaList, activeTab, search, roleFilter, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1
  const paginatedPengguna = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filtered.slice(start, start + itemsPerPage)
  }, [filtered, currentPage])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setActiveTab("semua")
    setSearch("")
    setRoleFilter("")
    setStatusFilter("")
    setCurrentPage(1)
  }

  const isFiltered = search || roleFilter || statusFilter || activeTab !== "semua"

  function handleSuccess() {
    startTransition(() => router.refresh())
  }

  async function handleToggleAktif(p: Pengguna) {
    startTransition(async () => {
      await toggleAktifPengguna(p.id, !p.aktif)
      router.refresh()
    })
  }

  async function handleHapus(p: Pengguna) {
    startTransition(async () => {
      await hapusPengguna(p.id)
      setConfirmDelete(null)
      router.refresh()
    })
  }


  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-teks/50">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Otoritas & Akses Pengguna
            </span>
            <span>•</span>
            <span>Kecamatan Temiang Pesisir</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold font-serif text-hijau tracking-tight">
            Manajemen Pengguna & Otoritas Sistem
          </h1>
          <p className="text-xs sm:text-sm text-teks/60 mt-0.5">
            Kelola hak akses aparatur, verifikator teknis, administrator, dan operator desa
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => setDialog({ open: true, mode: "tambah" })}
            className="bg-hijau hover:bg-hijau/90 text-white shadow-sm text-xs font-semibold cursor-pointer"
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            Tambah Pengguna Baru
          </Button>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Total Aparatur</span>
            <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-serif text-hijau">{counts.total}</p>
          <p className="text-xs text-teks/50 mt-1">seluruh akun terdaftar</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Akun Aktif</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-serif text-emerald-700">{counts.aktif}</p>
          <p className="text-xs text-teks/50 mt-1">memiliki hak akses aktif</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Akun Nonaktif</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-serif text-red-600">{counts.nonaktif}</p>
          <p className="text-xs text-teks/50 mt-1">akses dibekukan sementara</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Variasi Role</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-serif text-blue-700">{counts.roles}</p>
          <p className="text-xs text-teks/50 mt-1">level otorisasi berbeda</p>
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
          Semua Pengguna ({counts.total})
        </button>
        <button
          onClick={() => handleTabChange("pimpinan")}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
            activeTab === "pimpinan"
              ? "bg-emerald-700 text-white shadow-xs"
              : "text-teks/70 hover:bg-emerald-50 hover:text-emerald-800"
          )}
        >
          Pimpinan & Camat ({penggunaList.filter((p) => p.role === "camat" || p.role === "sekretaris").length})
        </button>
        <button
          onClick={() => handleTabChange("kasi")}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
            activeTab === "kasi"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-teks/70 hover:bg-blue-50 hover:text-blue-700"
          )}
        >
          Verifikator & Kasi (
          {
            penggunaList.filter((p) =>
              ["kasi_pem", "kasi_ekbang", "kasi_kesos", "kasi", "kasi_ekobang", "kasi_kessos"].includes(p.role)
            ).length
          }
          )
        </button>
        <button
          onClick={() => handleTabChange("pelaksana")}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
            activeTab === "pelaksana"
              ? "bg-amber-600 text-white shadow-xs"
              : "text-teks/70 hover:bg-amber-50 hover:text-amber-700"
          )}
        >
          Pelaksana & Staf ({penggunaList.filter((p) => p.role === "staf" || p.role === "petugas").length})
        </button>
        <button
          onClick={() => handleTabChange("admin")}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
            activeTab === "admin"
              ? "bg-purple-700 text-white shadow-xs"
              : "text-teks/70 hover:bg-purple-50 hover:text-purple-700"
          )}
        >
          Administrator ({penggunaList.filter((p) => p.role === "super_admin" || p.role === "admin").length})
        </button>
      </div>

      {/* Toolbar Search & Selects */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-teks/40" />
          <input
            type="text"
            placeholder="Cari nama, username, jabatan, wilayah desa..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full text-xs sm:text-sm pl-9 pr-4 py-2 bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="text-xs sm:text-sm bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2 text-teks focus:outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau max-w-[200px] cursor-pointer"
          >
            <option value="">Semua Otoritas (Role)</option>
            {Object.entries(ROLE_LABELS).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="text-xs sm:text-sm bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2 text-teks focus:outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="aktif">Hanya Aktif</option>
            <option value="nonaktif">Hanya Nonaktif</option>
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

      {/* Tabel Pengguna */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold font-serif text-lg text-hijau tracking-tight">
              Daftar Aparatur & Pengguna Sistem
            </h2>
            <p className="text-xs text-teks/50 mt-0.5">
              Menampilkan {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filtered.length)} dari {filtered.length} pengguna
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/70 text-left text-[11px] uppercase tracking-wider text-teks/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5 font-bold">Aparatur / Nama</th>
                <th className="px-6 py-3.5 font-bold">Username Akun</th>
                <th className="px-6 py-3.5 font-bold">Otoritas (Role)</th>
                <th className="px-6 py-3.5 font-bold">Jabatan & Wilayah</th>
                <th className="px-6 py-3.5 font-bold">Status Akun</th>
                <th className="px-6 py-3.5 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedPengguna.map((p) => (
                <tr key={p.id} className={cn("hover:bg-emerald-50/20 transition-colors", !p.aktif && "opacity-60 bg-gray-50/40")}>
                  {/* Nama + Avatar */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-hijau/10 text-hijau border border-hijau/20 flex items-center justify-center text-xs font-bold shrink-0">
                        {p.nama.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-teks block">{p.nama}</span>
                        <span className="text-[10px] text-teks/40">ID: {p.id.substring(0, 8)}...</span>
                      </div>
                    </div>
                  </td>

                  {/* Username */}
                  <td className="px-6 py-4">
                    <code className="text-xs bg-gray-100 text-teks/80 px-2 py-0.5 rounded-md font-mono border border-gray-200/60">
                      @{p.username}
                    </code>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <span className={cn("text-[11px] px-2.5 py-0.5 rounded-full font-bold border", ROLE_COLORS[p.role as UserRole] ?? "bg-gray-100 text-gray-700 border-gray-200")}>
                      {ROLE_LABELS[p.role as UserRole] ?? p.role}
                    </span>
                  </td>

                  {/* Jabatan + Desa */}
                  <td className="px-6 py-4 text-xs">
                    <p className="font-medium text-teks">{p.jabatan}</p>
                    {p.desa ? (
                      <p className="text-[11px] text-teks/50 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-teks/40" />
                        Desa {p.desa}
                      </p>
                    ) : (
                      <p className="text-[11px] text-teks/40 mt-0.5">Kecamatan Temiang Pesisir</p>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border",
                        p.aktif
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                          : "bg-red-50 text-red-600 border-red-200/80"
                      )}
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full", p.aktif ? "bg-emerald-500 animate-pulse" : "bg-red-400")} />
                      {p.aktif ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>

                  {/* Aksi */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setDialog({ open: true, mode: "edit", pengguna: p })}
                        title="Edit Data & Role"
                        className="p-1.5 rounded-lg border border-gray-200 text-teks/60 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleAktif(p)}
                        disabled={isPending}
                        title={p.aktif ? "Nonaktifkan Akses" : "Aktifkan Akses"}
                        className={cn(
                          "p-1.5 rounded-lg border border-gray-200 transition-colors cursor-pointer",
                          p.aktif
                            ? "text-teks/60 hover:text-amber-600 hover:bg-amber-50"
                            : "text-teks/60 hover:text-emerald-600 hover:bg-emerald-50"
                        )}
                      >
                        {p.aktif ? <ShieldOff className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(p)}
                        title="Hapus Akun"
                        className="p-1.5 rounded-lg border border-gray-200 text-teks/60 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedPengguna.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-teks/40">
                      <Users className="w-10 h-10 mb-2 opacity-30 text-teks" />
                      <p className="text-sm font-semibold text-teks/70">Tidak ada pengguna ditemukan</p>
                      <p className="text-xs text-teks/40 mt-1 max-w-sm">
                        {isFiltered
                          ? "Coba ubah kata kunci pencarian atau reset filter untuk melihat akun pengguna lainnya."
                          : "Belum ada akun pengguna yang terdaftar."}
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
        {filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-teks/50">
              Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, filtered.length)} sampai{" "}
              {Math.min(currentPage * itemsPerPage, filtered.length)} dari {filtered.length} total pengguna
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


      {/* Dialog Tambah/Edit */}
      {dialog.open && (
        <UserDialog
          mode={dialog.mode}
          pengguna={dialog.pengguna}
          onClose={() => setDialog({ open: false, mode: "tambah" })}
          onSuccess={handleSuccess}
        />
      )}

      {/* Konfirmasi Hapus */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-teks text-base">Hapus Pengguna?</h3>
              <p className="text-sm text-teks/60 mt-1">
                Akun <strong>{confirmDelete.nama}</strong> ({confirmDelete.username}) akan dihapus permanen dan tidak bisa dipulihkan.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setConfirmDelete(null)} className="flex-1">
                Batal
              </Button>
              <Button
                onClick={() => handleHapus(confirmDelete)}
                disabled={isPending}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white border-red-600"
              >
                {isPending ? "Menghapus..." : "Ya, Hapus"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
