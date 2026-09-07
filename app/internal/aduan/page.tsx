import Link from "next/link"
import { createServiceClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { STATUS_PENGADUAN_LABELS, KATEGORI_LABELS, KATEGORI_COLORS, StatusPengaduan, KategoriPengaduan } from "@/lib/mock-data/pengaduan"
import { cn } from "@/lib/utils"

const statusColors: Record<StatusPengaduan, string> = {
  masuk: "bg-gray-100 text-gray-700",
  verifikasi: "bg-blue-100 text-blue-700",
  proses: "bg-orange-100 text-orange-700",
  selesai: "bg-green-100 text-green-700",
  ditolak: "bg-red-100 text-red-700",
}

export default async function AduanInternalPage() {
  const supabase = await createServiceClient()
  
  const { data: pengaduanList } = await supabase
    .from("pengaduan")
    .select("*")
    .order("tanggal_masuk", { ascending: false })

  const pengaduan = pengaduanList || []

  return (
    <div>
      <PageHeader
        title="Pengaduan Masyarakat"
        subtitle="Daftar laporan dan aspirasi dari warga"
      />

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
              {pengaduan.map((p) => (
                <tr key={p.id} className="hover:bg-krem/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-mono text-xs font-bold text-hijau mb-1">{p.tiket}</div>
                    <div className="text-xs text-teks/60">
                      {new Date(p.tanggal_masuk).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-teks">{p.nama}</div>
                    <div className="text-xs text-teks/60 mt-0.5">{p.kontak}</div>
                  </td>
                  <td className="px-5 py-4 max-w-[250px]">
                    <span className={cn("inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-1.5", KATEGORI_COLORS[p.kategori as KategoriPengaduan])}>
                      {KATEGORI_LABELS[p.kategori as KategoriPengaduan]}
                    </span>
                    <div className="font-medium text-teks truncate" title={p.judul}>{p.judul}</div>
                  </td>
                  <td className="px-5 py-4 text-teks/80">
                    {p.desa}
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap", statusColors[p.status as StatusPengaduan])}>
                      {STATUS_PENGADUAN_LABELS[p.status as StatusPengaduan]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Link href={`/internal/aduan/${p.tiket}`}>
                      <Button variant="outline" size="sm" className="h-8 text-xs px-2.5">
                        <Eye className="w-3.5 h-3.5 mr-1.5" /> Proses
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}

              {pengaduan.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-teks/50">
                    Belum ada pengaduan masyarakat yang masuk.
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
