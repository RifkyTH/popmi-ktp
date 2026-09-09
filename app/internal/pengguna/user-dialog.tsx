"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Eye, EyeOff, UserPlus, Pencil } from "lucide-react"
import type { UserRole } from "@/lib/auth"
import { tambahPengguna, editPengguna } from "./actions"
import { DESA_LIST } from "@/lib/mock-data/desa"

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "camat", label: "Camat" },
  { value: "kasi", label: "Kasi Pemerintahan" },
  { value: "staf", label: "Staf Administrasi" },
  { value: "operator_desa", label: "Operator Desa" },
  { value: "petugas", label: "Petugas Pengaduan" },
]

type PenggunaData = {
  id: string
  nama: string
  username: string
  role: UserRole
  jabatan: string
  desa?: string | null
}

interface UserDialogProps {
  mode: "tambah" | "edit"
  pengguna?: PenggunaData
  onClose: () => void
  onSuccess: () => void
}

export function UserDialog({ mode, pengguna, onClose, onSuccess }: UserDialogProps) {
  const [nama, setNama] = useState(pengguna?.nama ?? "")
  const [username, setUsername] = useState(pengguna?.username ?? "")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>(pengguna?.role ?? "staf")
  const [jabatan, setJabatan] = useState(pengguna?.jabatan ?? "")
  const [desa, setDesa] = useState(pengguna?.desa ?? "")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const needsDesa = role === "operator_desa"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (mode === "tambah" && !password) {
      setError("Password wajib diisi untuk pengguna baru.")
      return
    }
    if (needsDesa && !desa) {
      setError("Desa wajib diisi untuk Operator Desa.")
      return
    }

    setLoading(true)
    try {
      if (mode === "tambah") {
        await tambahPengguna({ nama, username, password, role, jabatan, desa: needsDesa ? desa : undefined })
      } else if (pengguna) {
        await editPengguna(pengguna.id, { nama, role, jabatan, desa: needsDesa ? desa : undefined, password: password || undefined })
      }
      onSuccess()
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {mode === "tambah" ? (
              <UserPlus className="w-5 h-5 text-hijau" />
            ) : (
              <Pencil className="w-5 h-5 text-hijau" />
            )}
            <h2 className="font-bold text-teks text-base">
              {mode === "tambah" ? "Tambah Pengguna Baru" : "Edit Pengguna"}
            </h2>
          </div>
          <button onClick={onClose} className="text-teks/40 hover:text-teks/70 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-xs font-bold text-teks/60 uppercase tracking-wider mb-1.5">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="cth. Ahmad Fauzi, S.Sos"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning"
            />
          </div>

          {/* Username — hanya di mode tambah */}
          {mode === "tambah" && (
            <div>
              <label className="block text-xs font-bold text-teks/60 uppercase tracking-wider mb-1.5">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, "_"))}
                placeholder="cth. ahmad_fauzi"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-kuning"
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-teks/60 uppercase tracking-wider mb-1.5">
              Password {mode === "edit" && <span className="text-teks/40 font-normal normal-case">(kosongkan jika tidak diubah)</span>}
              {mode === "tambah" && <span className="text-red-500"> *</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "tambah" ? "Masukkan password" : "Isi untuk ganti password"}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-kuning"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-teks/40 hover:text-teks/70"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-bold text-teks/60 uppercase tracking-wider mb-1.5">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning bg-white"
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Jabatan */}
          <div>
            <label className="block text-xs font-bold text-teks/60 uppercase tracking-wider mb-1.5">
              Jabatan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={jabatan}
              onChange={(e) => setJabatan(e.target.value)}
              placeholder="cth. Staf Administrasi"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning"
            />
          </div>

          {/* Desa — hanya untuk operator_desa */}
          {needsDesa && (
            <div>
              <label className="block text-xs font-bold text-teks/60 uppercase tracking-wider mb-1.5">
                Desa <span className="text-red-500">*</span>
              </label>
              <select
                value={desa}
                onChange={(e) => setDesa(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning bg-white"
              >
                <option value="">Pilih Desa...</option>
                {DESA_LIST.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2.5">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Menyimpan..." : mode === "tambah" ? "Tambah Pengguna" : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
