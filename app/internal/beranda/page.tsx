import Link from "next/link"
import { cookies } from "next/headers"
import { getSessionFromCookie } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/server"
import { JENIS_SURAT_LABELS, STATUS_LABELS, StatusSurat, JenisSurat } from "@/lib/mock-data/surat"
import { Button } from "@/components/ui/button"
import {
  FilePlus,
  Clock,
  FileCheck,
  FileText,
  Send,
  ArrowRight,
  TrendingUp,
  Building2,
  BarChart3,
  Archive,
  MessageSquareWarning,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

export const revalidate = 0

const statusColors: Record<StatusSurat, string> = {
  draf: "bg-gray-100 text-gray-700 border-gray-200",
  verifikasi: "bg-blue-50 text-blue-700 border-blue-200",
  menunggu_ttd: "bg-amber-50 text-amber-700 border-amber-200",
  terbit: "bg-emerald-50 text-emerald-700 border-emerald-200",
  terkirim: "bg-teal-50 text-teal-700 border-teal-200",
}

export default async function BerandaPage() {
  const cookieStore = await cookies()
  const user = getSessionFromCookie(cookieStore.get("silat_session")?.value)
  const supabase = await createServiceClient()

  // Fetch recent 7 surat
  const { data: suratList } = await supabase
    .from("surat")
    .select("id, nomor, jenis, pemohon, desa, tanggal_buat, status, dibuat_oleh")
    .order("tanggal_buat", { ascending: false })
    .limit(7)

  // Fetch counts by status
  const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`

  const { count: totalSemua } = await supabase
    .from("surat")
    .select("*", { count: "exact", head: true })

  const { count: totalBulanIni } = await supabase
    .from("surat")
    .select("*", { count: "exact", head: true })
    .gte("tanggal_buat", `${currentMonth}-01`)

  const { count: draftCount } = await supabase
    .from("surat")
    .select("*", { count: "exact", head: true })
    .eq("status", "draf")

  const { count: verifikasiCount } = await supabase
    .from("surat")
    .select("*", { count: "exact", head: true })
    .eq("status", "verifikasi")

  const { count: menungguCount } = await supabase
    .from("surat")
    .select("*", { count: "exact", head: true })
    .eq("status", "menunggu_ttd")

  const { count: terbitCount } = await supabase
    .from("surat")
    .select("*", { count: "exact", head: true })
    .in("status", ["terbit", "terkirim"])

  const { count: aduanCount } = await supabase
    .from("pengaduan")
    .select("*", { count: "exact", head: true })
    .eq("status", "menunggu")

  const counts = {
    total: totalSemua ?? 0,
    bulanIni: totalBulanIni ?? 0,
    draf: draftCount ?? 0,
    verifikasi: verifikasiCount ?? 0,
    menunggu_ttd: menungguCount ?? 0,
    terbit: terbitCount ?? 0,
    aduanMenunggu: aduanCount ?? 0,
  }

  const surat = suratList || []

  const todayStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  const rateSelesai = counts.total > 0 ? Math.round((counts.terbit / counts.total) * 100) : 0

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Executive Greeting Hero */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-emerald-50 rounded-full blur-2xl -z-0 opacity-70 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-teks/50">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Sistem Aktif & Terintegrasi
              </span>
              <span>•</span>
              <span>{todayStr}</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold font-serif text-hijau tracking-tight">
              Selamat Datang, {user?.nama || "Aparatur Kecamatan"}
            </h1>
            <p className="text-xs sm:text-sm text-teks/60 mt-0.5">
              {user?.jabatan || "Pemerintah Kecamatan Temiang Pesisir"} — Panel kendali pelayanan administrasi terpadu
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/internal/surat/baru">
              <Button className="bg-hijau hover:bg-hijau/90 text-white shadow-xs text-xs sm:text-sm cursor-pointer">
                <FilePlus className="w-4 h-4 mr-2" />
                Buat Surat Baru
              </Button>
            </Link>
            <Link href="/internal/rekap">
              <Button variant="outline" className="border-gray-200 text-teks hover:bg-gray-50 text-xs sm:text-sm cursor-pointer">
                <BarChart3 className="w-4 h-4 mr-1.5 text-teks/70" />
                Statistik
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Priority Alert (Jika ada antrean TTD Camat atau Verifikasi) */}
      {(counts.menunggu_ttd > 0 || counts.verifikasi > 0) && (
        <div className="bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-amber-950">
                Antrean Berkas Perlu Tindakan Segera
              </p>
              <p className="text-xs text-amber-800/80 mt-0.5">
                Terdapat <strong className="font-semibold text-amber-900">{counts.menunggu_ttd} berkas</strong> menunggu tanda tangan Camat dan <strong className="font-semibold text-amber-900">{counts.verifikasi} berkas</strong> menunggu verifikasi.
              </p>
            </div>
          </div>
          <Link href="/internal/surat">
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs whitespace-nowrap shadow-xs cursor-pointer">
              Tinjau Sekarang <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* 3. 4 Executive KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Bulan Ini */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-sm transition-all relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Total Bulan Ini</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-serif text-hijau">{counts.bulanIni}</span>
            <span className="text-xs text-teks/50 font-medium">berkas</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-teks/60">
            <span>Total keseluruhan:</span>
            <span className="font-bold text-teks font-mono">{counts.total} surat</span>
          </div>
        </div>

        {/* Card 2: Menunggu TTD Camat */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-sm transition-all relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Menunggu TTD Camat</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-serif text-orange-600">{counts.menunggu_ttd}</span>
            <span className="text-xs text-teks/50 font-medium">siap diterbitkan</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-teks/60">
            <span>Status verifikasi:</span>
            <span className="font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md text-[11px]">
              {counts.menunggu_ttd > 0 ? "Perlu TTD" : "Nihil antrean"}
            </span>
          </div>
        </div>

        {/* Card 3: Menunggu Verifikasi */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-sm transition-all relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Tahap Verifikasi Kasi</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-serif text-blue-600">{counts.verifikasi}</span>
            <span className="text-xs text-teks/50 font-medium">berkas diperiksa</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-teks/60">
            <span>Draf belum diajukan:</span>
            <span className="font-bold text-teks font-mono">{counts.draf} draf</span>
          </div>
        </div>

        {/* Card 4: Selesai & Terbit */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-sm transition-all relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Surat Sah Terbit</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-serif text-teal-700">{counts.terbit}</span>
            <span className="text-xs text-teks/50 font-medium">surat sah</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-teks/60">
            <span>Tingkat ketuntasan:</span>
            <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md text-[11px]">
              {rateSelesai}% tuntas
            </span>
          </div>
        </div>
      </div>

      {/* 4. Quick Nav Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/internal/surat/baru"
          className="bg-white p-4 rounded-xl border border-gray-200/80 hover:border-hijau/40 hover:shadow-xs transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <FilePlus className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-teks group-hover:text-hijau transition-colors">Buat Surat Baru</p>
            <p className="text-[11px] text-teks/50">8 Format Pelayanan</p>
          </div>
        </Link>

        <Link
          href="/internal/arsip"
          className="bg-white p-4 rounded-xl border border-gray-200/80 hover:border-hijau/40 hover:shadow-xs transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Archive className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-teks group-hover:text-hijau transition-colors">Arsip Digital</p>
            <p className="text-[11px] text-teks/50">{counts.terbit} Dokumen Sah</p>
          </div>
        </Link>

        <Link
          href="/internal/rekap"
          className="bg-white p-4 rounded-xl border border-gray-200/80 hover:border-hijau/40 hover:shadow-xs transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-teks group-hover:text-hijau transition-colors">Rekap & Statistik</p>
            <p className="text-[11px] text-teks/50">Grafik & Peta Desa</p>
          </div>
        </Link>

        <Link
          href="/internal/aduan"
          className="bg-white p-4 rounded-xl border border-gray-200/80 hover:border-hijau/40 hover:shadow-xs transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <MessageSquareWarning className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-teks group-hover:text-hijau transition-colors">Aduan Warga</p>
            <p className="text-[11px] text-teks/50">
              {counts.aduanMenunggu > 0 ? `${counts.aduanMenunggu} Belum Ditinjau` : "Aspirasi Masyarakat"}
            </p>
          </div>
        </Link>
      </div>

      {/* 5. Recent Surat Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold font-serif text-lg text-hijau tracking-tight">
              Aktivitas Pelayanan Surat Terkini
            </h2>
            <p className="text-xs text-teks/50 mt-0.5">
              Daftar transaksi berkas administrasi terbaru yang masuk ke sistem
            </p>
          </div>
          <Link
            href="/internal/surat"
            className="inline-flex items-center gap-1 text-xs font-semibold text-hijau hover:text-emerald-700 transition-colors"
          >
            Lihat semua berkas <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/70 text-left text-[11px] uppercase tracking-wider text-teks/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 font-bold">Nomor Surat</th>
                <th className="px-6 py-3 font-bold">Jenis Layanan</th>
                <th className="px-6 py-3 font-bold">Pemohon / Desa</th>
                <th className="px-6 py-3 font-bold">Tanggal Pengajuan</th>
                <th className="px-6 py-3 font-bold text-center">Status Alur</th>
                <th className="px-6 py-3 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {surat.map((s) => (
                <tr key={s.id} className="hover:bg-emerald-50/20 transition-colors">
                  <td className="px-6 py-3.5 font-mono text-xs font-semibold text-teks">
                    {s.nomor}
                  </td>
                  <td className="px-6 py-3.5 text-xs font-medium text-teks">
                    {JENIS_SURAT_LABELS[s.jenis as JenisSurat] ?? s.jenis}
                  </td>
                  <td className="px-6 py-3.5 text-xs text-teks/80">
                    <span className="font-semibold text-teks">{s.pemohon}</span>
                    {s.desa && (
                      <span className="block text-[11px] text-teks/40">Desa {s.desa}</span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-xs text-teks/60">
                    {s.tanggal_buat}
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
                        statusColors[s.status as StatusSurat] ?? "bg-gray-100 text-gray-700"
                      )}
                    >
                      {STATUS_LABELS[s.status as StatusSurat] ?? s.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <Link href={`/internal/surat/${s.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-3 text-[11px] border-gray-200 hover:bg-gray-50 text-teks cursor-pointer"
                      >
                        Detail Disposisi
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {surat.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs text-teks/40 italic">
                    Belum ada surat yang terdaftar di database.
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

