"use client"

import { useState, useTransition } from "react"
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
} from "lucide-react"

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
  super_admin: "bg-purple-100 text-purple-800",
  admin: "bg-blue-100 text-blue-800",
  camat: "bg-green-100 text-green-800",
  sekretaris: "bg-indigo-100 text-indigo-800",
  kasi_pem: "bg-teal-100 text-teal-800",
  kasi_ekbang: "bg-orange-100 text-orange-800",
  kasi_kesos: "bg-pink-100 text-pink-800",
  kasi: "bg-teal-100 text-teal-800",
  kasi_ekobang: "bg-orange-100 text-orange-800",
  kasi_kessos: "bg-pink-100 text-pink-800",
  staf: "bg-gray-100 text-gray-700",
  petugas: "bg-yellow-100 text-yellow-800",
}

export function PenggunaClient({ penggunaList }: { penggunaList: Pengguna[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState("")
  const [dialog, setDialog] = useState<{ open: boolean; mode: "tambah" | "edit"; pengguna?: Pengguna }>({
    open: false,
    mode: "tambah",
  })
  const [confirmDelete, setConfirmDelete] = useState<Pengguna | null>(null)

  const filtered = penggunaList.filter(
    (p) =>
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.username.toLowerCase().includes(search.toLowerCase()) ||
      p.jabatan.toLowerCase().includes(search.toLowerCase())
  )

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
    <>
      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Pengguna", value: penggunaList.length, color: "text-hijau" },
          { label: "Aktif", value: penggunaList.filter((p) => p.aktif).length, color: "text-green-600" },
          { label: "Nonaktif", value: penggunaList.filter((p) => !p.aktif).length, color: "text-red-500" },
          { label: "Role", value: new Set(penggunaList.map((p) => p.role)).size, color: "text-blue-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-kuning-muda p-4 shadow-sm">
            <p className="text-xs text-teks/50 font-medium">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-kuning-muda p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-0 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teks/40" />
          <input
            type="text"
            placeholder="Cari nama, username, jabatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-kuning"
          />
        </div>
        <Button
          onClick={() => setDialog({ open: true, mode: "tambah" })}
          className="gap-2 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Tambah Pengguna
        </Button>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-xl border border-kuning-muda shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-teks/40 space-y-2">
            <Users className="w-10 h-10 mx-auto text-teks/20" />
            <p className="font-semibold text-sm">
              {search ? "Tidak ada pengguna yang cocok" : "Belum ada pengguna"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Pengguna", "Username", "Role", "Jabatan / Desa", "Status", "Aksi"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-teks/50"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => (
                  <tr key={p.id} className={`transition-colors hover:bg-gray-50/60 ${!p.aktif ? "opacity-60" : ""}`}>
                    {/* Nama + Avatar */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-hijau/10 flex items-center justify-center text-hijau text-xs font-bold shrink-0">
                          {p.nama.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-semibold text-teks">{p.nama}</span>
                      </div>
                    </td>
                    {/* Username */}
                    <td className="px-4 py-3.5">
                      <code className="text-xs bg-gray-100 text-teks/70 px-1.5 py-0.5 rounded font-mono">
                        {p.username}
                      </code>
                    </td>
                    {/* Role */}
                    <td className="px-4 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${ROLE_COLORS[p.role as UserRole] ?? "bg-gray-100 text-gray-700"}`}>
                        {ROLE_LABELS[p.role as UserRole] ?? p.role}
                      </span>
                    </td>
                    {/* Jabatan + Desa */}
                    <td className="px-4 py-3.5">
                      <p className="text-teks/80">{p.jabatan}</p>
                      {p.desa && <p className="text-xs text-teks/40 mt-0.5">Desa {p.desa}</p>}
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          p.aktif
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${p.aktif ? "bg-green-500" : "bg-red-400"}`} />
                        {p.aktif ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    {/* Aksi */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setDialog({ open: true, mode: "edit", pengguna: p })}
                          title="Edit"
                          className="p-1.5 rounded-lg text-teks/40 hover:text-hijau hover:bg-hijau/10 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleAktif(p)}
                          disabled={isPending}
                          title={p.aktif ? "Nonaktifkan" : "Aktifkan"}
                          className={`p-1.5 rounded-lg transition-colors ${
                            p.aktif
                              ? "text-teks/40 hover:text-orange-600 hover:bg-orange-50"
                              : "text-teks/40 hover:text-green-600 hover:bg-green-50"
                          }`}
                        >
                          {p.aktif ? <ShieldOff className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => setConfirmDelete(p)}
                          title="Hapus"
                          className="p-1.5 rounded-lg text-teks/40 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
    </>
  )
}
