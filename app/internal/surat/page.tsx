import Link from "next/link"
import { createServiceClient } from "@/lib/supabase/server"
import { JENIS_SURAT_LABELS, STATUS_LABELS, StatusSurat, JenisSurat } from "@/lib/mock-data/surat"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { DeleteButton } from "./delete-button"
import { DeleteAllButton } from "./delete-all-button"
import { FilePlus } from "lucide-react"
import { cn } from "@/lib/utils"

const statusColors: Record<StatusSurat, string> = {
  draf: "bg-gray-100 text-gray-700",
  verifikasi: "bg-blue-100 text-blue-700",
  menunggu_ttd: "bg-orange-100 text-orange-700",
  terbit: "bg-green-100 text-green-700",
  terkirim: "bg-teal-100 text-teal-700",
}

export default async function DaftarSuratPage() {
  const supabase = await createServiceClient()
  const { data: suratList } = await supabase
    .from("surat")
    .select("id, nomor, jenis, judul, pemohon, desa, tanggal_buat, status, dibuat_oleh")
    .order("tanggal_buat", { ascending: false })
    .limit(10)

  const surat = suratList || []

  return (
    <div>
      <PageHeader
        title="Daftar Surat & Rekomendasi"
        subtitle="Semua surat yang diproses kecamatan"
      >
        <div className="flex items-center gap-2">
          <DeleteAllButton />
          <Link href="/internal/surat/baru">
            <Button>
              <FilePlus className="w-4 h-4 mr-2" />
              Buat Surat Baru
            </Button>
          </Link>
        </div>
      </PageHeader>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-kuning-muda p-4 mb-5 flex flex-wrap gap-3">
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-kuning">
          <option value="">Semua Jenis</option>
          {(Object.keys(JENIS_SURAT_LABELS) as JenisSurat[]).map((key) => (
            <option key={key} value={key}>{JENIS_SURAT_LABELS[key]}</option>
          ))}
        </select>
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-kuning">
          <option value="">Semua Status</option>
          {(Object.keys(STATUS_LABELS) as StatusSurat[]).map((key) => (
            <option key={key} value={key}>{STATUS_LABELS[key]}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Cari pemohon, nomor surat..."
          className="flex-1 min-w-48 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-kuning"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-kuning-muda overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-krem">
              <tr className="border-b border-kuning-muda text-left">
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-teks/50">Nomor</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-teks/50">Jenis Surat</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-teks/50">Pemohon/Desa</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-teks/50">Tgl Buat</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-teks/50">Status</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-teks/50">Dibuat Oleh</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {surat.map((s) => (
                <tr key={s.id} className="hover:bg-krem/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-mono text-xs text-teks/70">{s.nomor}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-teks">{JENIS_SURAT_LABELS[s.jenis as JenisSurat] ?? s.jenis}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-teks/80">{s.pemohon}</p>
                    {s.desa && <p className="text-xs text-teks/50 mt-0.5">Desa {s.desa}</p>}
                  </td>
                  <td className="px-5 py-3.5 text-teks/60 text-xs">{s.tanggal_buat}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap", statusColors[s.status as StatusSurat] ?? "bg-gray-100 text-gray-700")}>
                      {STATUS_LABELS[s.status as StatusSurat] ?? s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-teks/60 text-xs">{s.dibuat_oleh}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/internal/surat/${s.id}`}
                        className="text-xs font-semibold text-hijau hover:text-kuning transition-colors whitespace-nowrap"
                      >
                        Lihat Detail &rarr;
                      </Link>
                      <DeleteButton id={s.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {surat.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-teks/50">
                    Belum ada surat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-gray-100 text-xs text-teks/50">
          Menampilkan {surat.length} surat
        </div>
      </div>
    </div>
  )
}
