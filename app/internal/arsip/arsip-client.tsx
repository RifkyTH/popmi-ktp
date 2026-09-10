"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Search,
  Printer,
  Archive,
  Calendar,
  Filter,
  CheckCircle2,
  FileText,
  Building2,
  Download,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RotateCcw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { JENIS_SURAT_LABELS, JenisSurat } from "@/lib/mock-data/surat"
import { cn } from "@/lib/utils"

export interface RealArsipItem {
  id: string
  nomor: string
  jenis: JenisSurat
  judul: string
  pemohon: string
  desa?: string | null
  tanggal_buat: string
  tanggal_terbit?: string | null
  status: string
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

export function ArsipClient({ initialArsip }: { initialArsip: RealArsipItem[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedJenis, setSelectedJenis] = useState("")

  const filteredArsip = useMemo(() => {
    return initialArsip.filter((item) => {
      const q = searchTerm.toLowerCase().trim()
      const matchSearch =
        !q ||
        item.nomor.toLowerCase().includes(q) ||
        item.pemohon.toLowerCase().includes(q) ||
        item.judul.toLowerCase().includes(q) ||
        (item.desa && item.desa.toLowerCase().includes(q))

      const itemDate = item.tanggal_terbit || item.tanggal_buat || ""
      const matchYear = !selectedYear || itemDate.startsWith(selectedYear)

      const matchJenis = !selectedJenis || item.jenis === selectedJenis

      return matchSearch && matchYear && matchJenis
    })
  }, [initialArsip, searchTerm, selectedYear, selectedJenis])

  const totalArsip = initialArsip.length
  const now = new Date()
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  const arsipBulanIni = initialArsip.filter((s) => {
    const d = s.tanggal_terbit || s.tanggal_buat || ""
    return d.startsWith(currentMonthPrefix)
  }).length

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-teks/50">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Repositori Dokumen Resmi
            </span>
            <span>•</span>
            <span>Kecamatan Temiang Pesisir</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold font-serif text-hijau tracking-tight">
            Arsip Digital Surat & Rekomendasi
          </h1>
          <p className="text-xs sm:text-sm text-teks/60 mt-0.5">
            Database berkas pelayanan yang telah sah diterbitkan dan ditandatangani Camat
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="border-gray-200 text-teks hover:bg-gray-50 text-xs shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5 text-teks/70" />
            Cetak Daftar Arsip
          </Button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Total Arsip Terbit</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Archive className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-serif text-hijau">{totalArsip}</p>
          <p className="text-xs text-teks/50 mt-1">dokumen sah tersimpan</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Terbit Bulan Ini</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-serif text-blue-700">{arsipBulanIni}</p>
          <p className="text-xs text-teks/50 mt-1">berkas disahkan bulan ini</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Otentikasi Camat</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-serif text-teal-700">100%</p>
          <p className="text-xs text-teks/50 mt-1">keabsahan digital terverifikasi</p>
        </div>
      </div>

      {/* Interactive Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-teks/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nomor surat, nama pemohon, perihal, atau desa..."
            className="w-full text-xs sm:text-sm pl-9 pr-4 py-2 bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="text-xs sm:text-sm bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2 text-teks focus:outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau cursor-pointer"
          >
            <option value="">Semua Tahun</option>
            <option value="2026">Tahun 2026</option>
            <option value="2025">Tahun 2025</option>
          </select>

          <select
            value={selectedJenis}
            onChange={(e) => setSelectedJenis(e.target.value)}
            className="text-xs sm:text-sm bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2 text-teks focus:outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau max-w-[200px] cursor-pointer"
          >
            <option value="">Semua Jenis Layanan</option>
            {Object.keys(JENIS_SURAT_LABELS).map((key) => (
              <option key={key} value={key}>
                {JENIS_SURAT_LABELS[key as JenisSurat]}
              </option>
            ))}
          </select>

          {(searchTerm || selectedYear || selectedJenis) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("")
                setSelectedYear("")
                setSelectedJenis("")
              }}
              className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Table Arsip */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold font-serif text-lg text-hijau tracking-tight">
              Daftar Dokumen Arsip Sah
            </h2>
            <p className="text-xs text-teks/50 mt-0.5">
              Menampilkan {filteredArsip.length} dari {totalArsip} berkas resmi
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/70 text-left text-[11px] uppercase tracking-wider text-teks/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5 font-bold">Nomor Surat Resmi</th>
                <th className="px-6 py-3.5 font-bold">Jenis Dokumen</th>
                <th className="px-6 py-3.5 font-bold">Pemohon / Desa</th>
                <th className="px-6 py-3.5 font-bold">Tanggal Pengesahan</th>
                <th className="px-6 py-3.5 font-bold">Disahkan Oleh</th>
                <th className="px-6 py-3.5 font-bold text-right">Aksi Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredArsip.map((surat) => (
                <tr key={surat.id} className="hover:bg-emerald-50/20 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-teks">
                    {surat.nomor}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
                        PALETTE_JENIS[surat.jenis] || "bg-gray-100 text-gray-700 border-gray-200"
                      )}
                    >
                      {JENIS_SURAT_LABELS[surat.jenis as JenisSurat] ?? surat.jenis}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-teks/80">
                    <span className="font-semibold text-teks">{surat.pemohon}</span>
                    {surat.desa && (
                      <span className="block text-[11px] text-teks/40">Desa {surat.desa}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-teks/60">
                    {surat.tanggal_terbit || surat.tanggal_buat}
                  </td>
                  <td className="px-6 py-4 text-xs text-teks/70">
                    <span className="font-medium text-hijau flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {surat.disetujui_oleh || "Camat Temiang Pesisir"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/internal/surat/${surat.id}/cetak`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-hijau hover:text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100 rounded-lg transition-colors"
                      >
                        <Printer className="w-3 h-3" />
                        Cetak PDF
                      </Link>
                      <Link
                        href={`/internal/surat/${surat.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-teks/60 hover:text-teks hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Detail
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredArsip.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs text-teks/40 italic">
                    {searchTerm || selectedYear || selectedJenis
                      ? "Tidak ada arsip surat yang sesuai dengan kata kunci pencarian."
                      : "Belum ada arsip surat resmi yang diterbitkan."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
