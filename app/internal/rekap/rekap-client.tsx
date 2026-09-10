"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts"
import {
  FileText,
  CheckCircle2,
  Clock,
  Printer,
  Calendar,
  Building2,
  ArrowUpRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { JENIS_SURAT_LABELS, STATUS_LABELS, StatusSurat, JenisSurat } from "@/lib/mock-data/surat"
import { cn } from "@/lib/utils"

export interface RealSuratItem {
  id: string
  nomor: string
  jenis: JenisSurat
  judul: string
  pemohon: string
  desa?: string | null
  tanggal_buat: string
  tanggal_terbit?: string | null
  status: StatusSurat
  dibuat_oleh?: string | null
  diverifikasi_oleh?: string | null
}

const NAMA_BULAN = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
]

const PALETTE_JENIS: Record<string, string> = {
  rekomendasi_dd: "#059669",
  rekomendasi_add: "#0284C7",
  tunda_salur_add: "#DC2626",
  dispensasi_nikah: "#D9A400",
  bbm_jbkp: "#2F4A3C",
  bbm_jbt: "#0D9488",
  ahli_waris: "#7C3AED",
  pemberhentian_perangkat: "#EA580C",
}

const statusBadgeColors: Record<StatusSurat, string> = {
  draf: "bg-gray-100 text-gray-700 border-gray-200",
  verifikasi: "bg-blue-50 text-blue-700 border-blue-200",
  menunggu_ttd: "bg-amber-50 text-amber-700 border-amber-200",
  terbit: "bg-emerald-50 text-emerald-700 border-emerald-200",
  terkirim: "bg-teal-50 text-teal-700 border-teal-200",
}

function ModernBarTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, item: any) => sum + (Number(item.value) || 0), 0)
    return (
      <div className="bg-gray-900/95 backdrop-blur text-white text-xs rounded-xl p-3 shadow-xl border border-gray-700 space-y-1.5 min-w-[170px]">
        <div className="flex items-center justify-between border-b border-gray-700 pb-1.5 mb-1">
          <span className="font-bold text-gray-200">Bulan {label}</span>
          <span className="text-[10px] text-gray-400 font-mono">Total: {total}</span>
        </div>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-300 truncate max-w-[120px]">{entry.name}</span>
            </div>
            <span className="font-bold font-mono">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

function ModernPieTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className="bg-gray-900/95 backdrop-blur text-white text-xs rounded-xl p-2.5 shadow-xl border border-gray-700 min-w-[150px]">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.payload.color }} />
          <span className="font-bold text-gray-200 truncate">{data.name}</span>
        </div>
        <div className="flex items-center justify-between text-gray-300 pt-1 border-t border-gray-700">
          <span>Jumlah Surat:</span>
          <span className="font-bold text-white font-mono">{data.value}</span>
        </div>
      </div>
    )
  }
  return null
}

export function RekapClient({ initialSurat }: { initialSurat: RealSuratItem[] }) {
  const [selectedYear, setSelectedYear] = useState<string>("2026")
  const [selectedStatus, setSelectedStatus] = useState<string>("semua")

  const filteredSurat = useMemo(() => {
    return initialSurat.filter((item) => {
      const year = item.tanggal_buat ? item.tanggal_buat.split("-")[0] : "2026"
      const matchYear = selectedYear === "semua" || year === selectedYear
      const matchStatus =
        selectedStatus === "semua" ||
        (selectedStatus === "selesai" && (item.status === "terbit" || item.status === "terkirim")) ||
        (selectedStatus === "proses" && (item.status === "draf" || item.status === "verifikasi" || item.status === "menunggu_ttd"))
      return matchYear && matchStatus
    })
  }, [initialSurat, selectedYear, selectedStatus])

  const totalSurat = filteredSurat.length
  const suratSelesai = filteredSurat.filter((s) => s.status === "terbit" || s.status === "terkirim").length
  const suratProses = filteredSurat.filter((s) => s.status === "draf" || s.status === "verifikasi" || s.status === "menunggu_ttd").length
  const persentaseSelesai = totalSurat > 0 ? Math.round((suratSelesai / totalSurat) * 100) : 0

  const now = new Date()
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  const suratBulanIni = initialSurat.filter((s) => s.tanggal_buat?.startsWith(currentMonthPrefix)).length

  const monthlyData = useMemo(() => {
    return NAMA_BULAN.map((namaBulan, idx) => {
      const monthNumber = String(idx + 1).padStart(2, "0")
      const monthPrefix = selectedYear === "semua" ? "" : `${selectedYear}-${monthNumber}`

      const suratDiBulan = initialSurat.filter((s) => {
        if (!s.tanggal_buat) return false
        if (selectedYear === "semua") {
          return s.tanggal_buat.split("-")[1] === monthNumber
        }
        return s.tanggal_buat.startsWith(monthPrefix)
      })

      const desaCount = suratDiBulan.filter((s) => ["rekomendasi_dd", "rekomendasi_add", "tunda_salur_add"].includes(s.jenis)).length
      const nikahCount = suratDiBulan.filter((s) => s.jenis === "dispensasi_nikah").length
      const bbmCount = suratDiBulan.filter((s) => ["bbm_jbkp", "bbm_jbt"].includes(s.jenis)).length
      const lainnyaCount = suratDiBulan.filter((s) => ["ahli_waris", "pemberhentian_perangkat"].includes(s.jenis)).length

      return {
        name: namaBulan,
        "Rekomendasi Desa": desaCount,
        "Dispensasi Nikah": nikahCount,
        "Rekomendasi BBM": bbmCount,
        "Layanan Lainnya": lainnyaCount,
        total: suratDiBulan.length,
      }
    })
  }, [initialSurat, selectedYear])

  const pieData = useMemo(() => {
    const counts: Record<string, number> = {}
    filteredSurat.forEach((s) => {
      counts[s.jenis] = (counts[s.jenis] || 0) + 1
    })

    const entries = Object.keys(counts).map((jenisKey) => {
      const label = JENIS_SURAT_LABELS[jenisKey as JenisSurat] || jenisKey
      const color = PALETTE_JENIS[jenisKey] || "#64748B"
      return {
        name: label,
        key: jenisKey,
        value: counts[jenisKey],
        color,
        percentage: totalSurat > 0 ? Math.round((counts[jenisKey] / totalSurat) * 100) : 0,
      }
    })

    return entries.sort((a, b) => b.value - a.value)
  }, [filteredSurat, totalSurat])

  const desaData = useMemo(() => {
    const officialDesa = ["Temiang", "Tajur Biru", "Pulau Batang"]

    const rows = officialDesa.map((namaDesa) => {
      const suratDesa = filteredSurat.filter((s) => {
        const d = (s.desa || "").toLowerCase()
        return d.includes(namaDesa.toLowerCase())
      })

      const dd = suratDesa.filter((s) => s.jenis === "rekomendasi_dd").length
      const add = suratDesa.filter((s) => s.jenis === "rekomendasi_add" || s.jenis === "tunda_salur_add").length
      const nikah = suratDesa.filter((s) => s.jenis === "dispensasi_nikah").length
      const bbm = suratDesa.filter((s) => s.jenis === "bbm_jbkp" || s.jenis === "bbm_jbt").length
      const lainnya = suratDesa.filter((s) => s.jenis === "ahli_waris" || s.jenis === "pemberhentian_perangkat").length
      const total = suratDesa.length

      return {
        desa: `Desa ${namaDesa}`,
        tipe: "Desa Administratif",
        dd,
        add,
        nikah,
        bbm,
        lainnya,
        total,
        percentage: totalSurat > 0 ? Math.round((total / totalSurat) * 100) : 0,
      }
    })

    const suratUmum = filteredSurat.filter((s) => {
      if (!s.desa) return true
      const d = s.desa.toLowerCase()
      return !officialDesa.some((od) => d.includes(od.toLowerCase()))
    })

    const ddUmum = suratUmum.filter((s) => s.jenis === "rekomendasi_dd").length
    const addUmum = suratUmum.filter((s) => s.jenis === "rekomendasi_add" || s.jenis === "tunda_salur_add").length
    const nikahUmum = suratUmum.filter((s) => s.jenis === "dispensasi_nikah").length
    const bbmUmum = suratUmum.filter((s) => s.jenis === "bbm_jbkp" || s.jenis === "bbm_jbt").length
    const lainnyaUmum = suratUmum.filter((s) => s.jenis === "ahli_waris" || s.jenis === "pemberhentian_perangkat").length
    const totalUmum = suratUmum.length

    rows.push({
      desa: "Pelayanan Warga Langsung",
      tipe: "Pemohon Individu / Perorangan",
      dd: ddUmum,
      add: addUmum,
      nikah: nikahUmum,
      bbm: bbmUmum,
      lainnya: lainnyaUmum,
      total: totalUmum,
      percentage: totalSurat > 0 ? Math.round((totalUmum / totalSurat) * 100) : 0,
    })

    return rows
  }, [filteredSurat, totalSurat])

  const handlePrint = () => {
    window.print()
  }
  return (
    <div className="space-y-6 pb-12 print:p-0">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:border-none print:shadow-none print:p-0">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Data Real-Time Terhubung
            </span>
            <span className="text-xs text-teks/50 hidden sm:inline">• Terakhir sinkron: hari ini</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold font-serif text-hijau tracking-tight">
            Rekapitulasi & Statistik Pelayanan
          </h1>
          <p className="text-xs sm:text-sm text-teks/60 mt-0.5">
            Laporan agregasi data pelayanan administrasi Kecamatan Temiang Pesisir, Kab. Lingga
          </p>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2.5 print:hidden">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1">
            <button
              onClick={() => setSelectedYear("2026")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer",
                selectedYear === "2026"
                  ? "bg-white text-hijau shadow-xs"
                  : "text-teks/60 hover:text-teks"
              )}
            >
              Tahun 2026
            </button>
            <button
              onClick={() => setSelectedYear("semua")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer",
                selectedYear === "semua"
                  ? "bg-white text-hijau shadow-xs"
                  : "text-teks/60 hover:text-teks"
              )}
            >
              Semua Tahun
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="border-gray-200 text-teks hover:bg-gray-50 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5 text-teks/70" />
            Cetak Laporan
          </Button>
        </div>
      </div>

      {/* 4 KPI Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-xs hover:shadow-sm transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 opacity-60" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Total Surat Masuk</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-serif text-hijau">{totalSurat}</span>
              <span className="text-xs text-teks/50 font-medium">berkas terdaftar</span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-teks/60">
              <span>Bulan berjalan:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                +{suratBulanIni} bulan ini
              </span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-xs hover:shadow-sm transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-0 opacity-60" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Selesai & Diterbitkan</span>
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-serif text-blue-700">{suratSelesai}</span>
              <span className="text-xs text-teks/50 font-medium">surat sah</span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-teks/60">
              <span>Tingkat keberhasilan:</span>
              <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                {persentaseSelesai}% tuntas
              </span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-xs hover:shadow-sm transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-0 opacity-60" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Dalam Proses / TTD</span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-serif text-amber-600">{suratProses}</span>
              <span className="text-xs text-teks/50 font-medium">antrean aktif</span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-teks/60">
              <span>Status antrean:</span>
              <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                {suratProses > 0 ? "Perlu tindakan" : "Semua tuntas"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-xs hover:shadow-sm transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -z-0 opacity-60" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Cakupan Wilayah</span>
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-serif text-purple-700">3</span>
              <span className="text-xs text-teks/50 font-medium">desa terlayani</span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-teks/60">
              <span>Kecamatan:</span>
              <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                Temiang Pesisir
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Bar Chart: Tren Bulanan */}
        <Card className="lg:col-span-2 rounded-2xl border border-gray-200/80 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-lg font-bold font-serif text-hijau">
                  Tren Pelayanan Surat per Bulan ({selectedYear === "semua" ? "Semua Tahun" : selectedYear})
                </CardTitle>
                <CardDescription className="text-xs text-teks/60 mt-0.5">
                  Grafik volume pengajuan berkas berdasarkan kategori layanan
                </CardDescription>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-teks/60 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg print:hidden">
                <Calendar className="w-3.5 h-3.5 text-teks/40" />
                <span>Data Real dari Sistem</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B", fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<ModernBarTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: "12px", fontSize: "11px" }}
                  />
                  <Bar
                    dataKey="Rekomendasi Desa"
                    fill="#059669"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                  <Bar
                    dataKey="Dispensasi Nikah"
                    fill="#D9A400"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                  <Bar
                    dataKey="Rekomendasi BBM"
                    fill="#2F4A3C"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                  <Bar
                    dataKey="Layanan Lainnya"
                    fill="#7C3AED"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 2. Donut Chart: Komposisi Jenis Surat */}
        <Card className="rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold font-serif text-hijau">
              Proporsi Jenis Surat
            </CardTitle>
            <CardDescription className="text-xs text-teks/60 mt-0.5">
              Distribusi berdasarkan kategori surat yang terbit
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 flex flex-col items-center justify-center flex-1">
            {pieData.length > 0 ? (
              <>
                <div className="h-48 w-full relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip content={<ModernPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Central Metric */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold font-serif text-hijau">{totalSurat}</span>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-teks/40">Surat</span>
                  </div>
                </div>

                {/* Custom Modern Legend List */}
                <div className="w-full space-y-2 mt-3 pt-3 border-t border-gray-100 text-xs">
                  {pieData.map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-0.5">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-teks/70 truncate text-[11px]">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-bold text-teks font-mono text-[11px]">{item.value}</span>
                        <span className="text-[10px] text-teks/40 font-medium">({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-xs text-teks/40 italic">
                Belum ada data surat yang terdaftar
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Table: Rekapitulasi Pelayanan per Desa */}
      <Card className="rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-lg font-bold font-serif text-hijau flex items-center gap-2">
                <Building2 className="w-5 h-5 text-hijau" />
                Rekapitulasi Pelayanan per Wilayah / Desa
              </CardTitle>
              <CardDescription className="text-xs text-teks/60 mt-0.5">
                Data real pelayanan administrasi berdasarkan 3 desa definitif di Kecamatan Temiang Pesisir
              </CardDescription>
            </div>
            <div className="text-xs text-teks/50 font-medium">
              Total Berkas: <strong className="text-hijau font-bold">{totalSurat}</strong> Surat
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80 text-left text-[11px] uppercase tracking-wider text-teks/50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 font-bold">Wilayah / Desa</th>
                  <th className="px-4 py-3 font-bold text-center">Dana Desa (DD)</th>
                  <th className="px-4 py-3 font-bold text-center">Alokasi Dana Desa (ADD)</th>
                  <th className="px-4 py-3 font-bold text-center">Dispensasi Nikah</th>
                  <th className="px-4 py-3 font-bold text-center">Rekomendasi BBM</th>
                  <th className="px-4 py-3 font-bold text-center">Lainnya</th>
                  <th className="px-5 py-3 font-bold text-center">Total Berkas</th>
                  <th className="px-5 py-3 font-bold text-center">Porsi Layanan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {desaData.map((row, i) => (
                  <tr key={i} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-teks text-xs sm:text-sm">{row.desa}</p>
                      <p className="text-[11px] text-teks/40">{row.tipe}</p>
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono text-xs">
                      {row.dd > 0 ? <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded">{row.dd}</span> : "-"}
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono text-xs">
                      {row.add > 0 ? <span className="px-2 py-0.5 bg-sky-50 text-sky-700 font-bold rounded">{row.add}</span> : "-"}
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono text-xs">
                      {row.nikah > 0 ? <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-bold rounded">{row.nikah}</span> : "-"}
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono text-xs">
                      {row.bbm > 0 ? <span className="px-2 py-0.5 bg-teal-50 text-teal-700 font-bold rounded">{row.bbm}</span> : "-"}
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono text-xs">
                      {row.lainnya > 0 ? <span className="px-2 py-0.5 bg-purple-50 text-purple-700 font-bold rounded">{row.lainnya}</span> : "-"}
                    </td>
                    <td className="px-5 py-3.5 text-center font-bold text-hijau font-mono text-sm">
                      {row.total}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 max-w-[120px] mx-auto">
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-hijau h-full rounded-full transition-all"
                            style={{ width: `${row.percentage}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-teks/60 min-w-[28px]">
                          {row.percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50/90 font-bold text-xs text-teks border-t border-gray-200">
                <tr>
                  <td className="px-5 py-3">TOTAL KESELURUHAN</td>
                  <td className="px-4 py-3 text-center font-mono">
                    {desaData.reduce((acc, r) => acc + r.dd, 0)}
                  </td>
                  <td className="px-4 py-3 text-center font-mono">
                    {desaData.reduce((acc, r) => acc + r.add, 0)}
                  </td>
                  <td className="px-4 py-3 text-center font-mono">
                    {desaData.reduce((acc, r) => acc + r.nikah, 0)}
                  </td>
                  <td className="px-4 py-3 text-center font-mono">
                    {desaData.reduce((acc, r) => acc + r.bbm, 0)}
                  </td>
                  <td className="px-4 py-3 text-center font-mono">
                    {desaData.reduce((acc, r) => acc + r.lainnya, 0)}
                  </td>
                  <td className="px-5 py-3 text-center font-mono text-sm text-hijau font-extrabold">
                    {totalSurat}
                  </td>
                  <td className="px-5 py-3 text-center font-mono text-teks/50">
                    100%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Surat Table: Drill-down feature */}
      <Card className="rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden print:hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold font-serif text-hijau">
                Daftar Berkas Terkini
              </CardTitle>
              <CardDescription className="text-xs text-teks/60 mt-0.5">
                Transaksi surat terbaru yang terekam di database sistem SILAT-TP
              </CardDescription>
            </div>
            <Link href="/internal/surat">
              <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 cursor-pointer">
                Buka Semua Surat <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {initialSurat.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50/70 text-left text-[11px] uppercase tracking-wider text-teks/50 border-y border-gray-100">
                  <tr>
                    <th className="px-5 py-2.5 font-bold">Nomor Surat</th>
                    <th className="px-5 py-2.5 font-bold">Jenis Layanan</th>
                    <th className="px-5 py-2.5 font-bold">Pemohon / Desa</th>
                    <th className="px-5 py-2.5 font-bold">Tanggal Dibuat</th>
                    <th className="px-5 py-2.5 font-bold text-center">Status</th>
                    <th className="px-5 py-2.5 font-bold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {initialSurat.slice(0, 5).map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3 font-mono font-medium text-teks">{s.nomor}</td>
                      <td className="px-5 py-3 text-teks font-medium">
                        {JENIS_SURAT_LABELS[s.jenis] || s.jenis}
                      </td>
                      <td className="px-5 py-3 text-teks/80">
                        {s.pemohon} {s.desa ? `(${s.desa})` : ""}
                      </td>
                      <td className="px-5 py-3 text-teks/60">{s.tanggal_buat}</td>
                      <td className="px-5 py-3 text-center">
                        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border", statusBadgeColors[s.status])}>
                          {STATUS_LABELS[s.status] || s.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <Link href={`/internal/surat/${s.id}`}>
                          <Button size="sm" variant="outline" className="h-7 px-2.5 text-[11px] border-gray-200 hover:bg-gray-50 text-teks cursor-pointer">
                            Detail
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-teks/40 italic">
              Belum ada surat yang terdaftar di database
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
