import { createServiceClient } from "@/lib/supabase/server"
import { STATUS_PENGADUAN_LABELS, KATEGORI_LABELS } from "@/lib/mock-data/pengaduan"
import { DESA_LIST } from "@/lib/mock-data/desa"
import { BarChart3, CheckCircle2, Clock, MessageSquare, ShieldCheck, MapPin, Building2, TrendingUp } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function TransparansiPage() {
  const supabase = await createServiceClient()
  const { data: pengaduanList } = await supabase
    .from("pengaduan")
    .select("kategori, desa, status")

  const data = pengaduanList || []
  const total = data.length
  const selesai = data.filter((p) => p.status === "selesai").length
  const proses = data.filter((p) => p.status === "proses").length
  const masuk = data.filter((p) => p.status === "masuk" || p.status === "verifikasi").length
  const rateSelesai = total > 0 ? Math.round((selesai / total) * 100) : 0

  // Calculate stats by Category
  const categoryStats = Object.keys(KATEGORI_LABELS).map((key) => {
    const count = data.filter((p) => p.kategori === key).length
    return {
      kategori: KATEGORI_LABELS[key as keyof typeof KATEGORI_LABELS],
      jumlah: count,
      persentase: total > 0 ? Math.round((count / total) * 100) : 0,
    }
  }).sort((a, b) => b.jumlah - a.jumlah)

  // Calculate stats by authentic Desa
  const allDesas = Array.from(new Set([...DESA_LIST, ...data.map((d) => d.desa).filter(Boolean)]))
  const desaStats = allDesas.map((desa) => {
    const count = data.filter((p) => p.desa === desa).length
    return {
      desa,
      jumlah: count,
      persentase: total > 0 ? Math.round((count / total) * 100) : 0,
    }
  }).sort((a, b) => b.jumlah - a.jumlah)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D9A400]/40 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9A400]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F4A3C]">
              Keterbukaan Informasi Publik (KIP)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F4A3C]">
            Transparansi &amp; Statistik Pelayanan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
            Data terbuka kinerja penanganan pengaduan dan aspirasi masyarakat secara real-time di Kecamatan Temiang Pesisir.
          </p>
        </div>

        <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl shadow-2xs shrink-0 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Tingkat Penyelesaian: {rateSelesai}%</span>
        </div>
      </div>

      {/* KPI Stats Counter */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#2F4A3C]" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Masuk</span>
            <MessageSquare className="w-4 h-4 text-[#2F4A3C]" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#2F4A3C]">{total}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Laporan masyarakat</span>
        </div>

        {/* Tuntas / Selesai */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Tuntas Ditangani</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-serif font-bold text-emerald-700">{selesai}</p>
          <span className="text-[11px] text-emerald-600/80 mt-1 block">{rateSelesai}% dari total aduan</span>
        </div>

        {/* Proses */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Dalam Tindak Lanjut</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-serif font-bold text-blue-700">{proses}</p>
          <span className="text-[11px] text-blue-600/80 mt-1 block">Investigasi &amp; pekerjaan lapangan</span>
        </div>

        {/* Menunggu */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Menunggu Validasi</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-serif font-bold text-amber-600">{masuk}</p>
          <span className="text-[11px] text-amber-600/80 mt-1 block">Antrean verifikasi petugas</span>
        </div>
      </div>

      {/* Detail Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Breakdown by Category */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-serif font-bold text-[#2F4A3C] text-base">
                Sebaran Kategori Masalah
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Rincian jenis laporan yang diadukan oleh warga
              </p>
            </div>
            <BarChart3 className="w-4 h-4 text-[#D9A400]" />
          </div>

          <div className="space-y-4">
            {categoryStats.map((item) => (
              <div key={item.kategori} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{item.kategori}</span>
                  <span className="text-slate-500 font-mono">
                    {item.jumlah} aduan ({item.persentase}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2F4A3C] h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.persentase}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown by Desa */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-serif font-bold text-[#2F4A3C] text-base">
                Rekapitulasi per Wilayah Desa
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Kontribusi laporan di 3 desa Kecamatan Temiang Pesisir
              </p>
            </div>
            <MapPin className="w-4 h-4 text-[#D9A400]" />
          </div>

          <div className="divide-y divide-slate-100">
            {desaStats.map((item, idx) => (
              <div key={item.desa} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold font-mono flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Desa {item.desa}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {item.desa === "Tajur Biru" ? "Pusat Kecamatan" : "Wilayah Desa"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-serif font-bold text-[#2F4A3C] text-base">
                    {item.jumlah}
                  </span>
                  <span className="text-[11px] text-slate-400 ml-1">aduan</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Disclaimer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#2F4A3C]" />
        <span>
          Data statistik diperbarui secara otomatis dari database sistem POPMI KTP Kecamatan Temiang Pesisir.
        </span>
      </div>
    </div>
  )
}

