import Link from "next/link"
import { createServiceClient } from "@/lib/supabase/server"
import { JENIS_SURAT_LABELS, STATUS_LABELS, StatusSurat, JenisSurat } from "@/lib/mock-data/surat"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { FilePlus, Clock, FileCheck, FileText, Send } from "lucide-react"
import { cn } from "@/lib/utils"

const statusColors: Record<StatusSurat, string> = {
  draf: "bg-gray-100 text-gray-700",
  verifikasi: "bg-blue-100 text-blue-700",
  menunggu_ttd: "bg-orange-100 text-orange-700",
  terbit: "bg-green-100 text-green-700",
  terkirim: "bg-teal-100 text-teal-700",
}

export default async function BerandaPage() {
  const supabase = await createServiceClient()

  // Fetch recent 5 surat
  const { data: suratList } = await supabase
    .from("surat")
    .select("id, nomor, jenis, pemohon, tanggal_buat, status")
    .order("tanggal_buat", { ascending: false })
    .limit(5)

  // Fetch counts by status
  const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`
  
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

  const counts = {
    total: totalBulanIni ?? 0,
    draf: draftCount ?? 0,
    verifikasi: verifikasiCount ?? 0,
    menunggu_ttd: menungguCount ?? 0,
    terbit: terbitCount ?? 0,
  }

  const surat = suratList || []

  return (
    <div>
      <PageHeader
        title="Beranda"
        subtitle="Ringkasan aktivitas surat kecamatan hari ini"
      >
        <Link href="/internal/surat/baru">
          <Button>
            <FilePlus className="w-4 h-4 mr-2" />
            Buat Surat Baru
          </Button>
        </Link>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-kuning-muda p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-teks/50">Total Bulan Ini</p>
            <FileText className="w-4 h-4 text-kuning" />
          </div>
          <p className="text-3xl font-bold font-serif text-hijau">{counts.total}</p>
          <p className="text-xs text-teks/50 mt-1">surat/rekomendasi</p>
        </div>

        <div className="bg-white rounded-xl border border-kuning-muda p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-teks/50">Menunggu TTD</p>
            <Clock className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-3xl font-bold font-serif text-orange-600">{counts.menunggu_ttd}</p>
          <p className="text-xs text-teks/50 mt-1">perlu tanda tangan Camat</p>
        </div>

        <div className="bg-white rounded-xl border border-kuning-muda p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-teks/50">Menunggu Verifikasi</p>
            <FileCheck className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-bold font-serif text-blue-600">{counts.verifikasi}</p>
          <p className="text-xs text-teks/50 mt-1">perlu verifikasi Kasi</p>
        </div>

        <div className="bg-white rounded-xl border border-kuning-muda p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-teks/50">Sudah Terbit</p>
            <Send className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-3xl font-bold font-serif text-green-600">{counts.terbit}</p>
          <p className="text-xs text-teks/50 mt-1">surat diterbitkan</p>
        </div>
      </div>

      {/* Recent surat */}
      <div className="bg-white rounded-xl border border-kuning-muda">
        <div className="px-5 py-4 border-b border-kuning-muda flex items-center justify-between">
          <h2 className="font-bold font-serif text-hijau">Surat Terbaru</h2>
          <Link href="/internal/surat" className="text-xs text-kuning font-semibold hover:underline">
            Lihat semua →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-teks/50">Nomor Surat</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-teks/50">Jenis</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-teks/50">Pemohon</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-teks/50">Tanggal</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-teks/50">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {surat.map((s) => (
                <tr key={s.id} className="hover:bg-krem/60 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-teks/70">{s.nomor}</td>
                  <td className="px-5 py-3 font-medium">{JENIS_SURAT_LABELS[s.jenis as JenisSurat] ?? s.jenis}</td>
                  <td className="px-5 py-3 text-teks/70">{s.pemohon}</td>
                  <td className="px-5 py-3 text-teks/60">{s.tanggal_buat}</td>
                  <td className="px-5 py-3">
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", statusColors[s.status as StatusSurat] ?? "bg-gray-100 text-gray-700")}>
                      {STATUS_LABELS[s.status as StatusSurat] ?? s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/internal/surat/${s.id}`}
                      className="text-xs font-semibold text-hijau hover:text-kuning transition-colors"
                    >
                      Detail →
                    </Link>
                  </td>
                </tr>
              ))}
              {surat.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-teks/50">
                    Belum ada surat.
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
