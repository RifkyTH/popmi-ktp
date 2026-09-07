import Link from "next/link"
import { createServiceClient } from "@/lib/supabase/server"
import { JENIS_SURAT_LABELS, STATUS_LABELS, JenisSurat } from "@/lib/mock-data/surat"
import { PageHeader } from "@/components/ui/page-header"

export default async function ArsipPage() {
  const supabase = await createServiceClient()

  // Only show terbit or terkirim in archive
  const { data: arsipList } = await supabase
    .from("surat")
    .select("id, nomor, jenis, pemohon, tanggal_terbit, tanggal_buat, disetujui_oleh")
    .in("status", ["terbit", "terkirim"])
    .order("tanggal_terbit", { ascending: false })

  const arsipData = arsipList || []

  return (
    <div>
      <PageHeader
        title="Arsip Digital"
        subtitle="Pencarian dan unduh surat resmi yang telah terbit"
      />

      <div className="bg-white rounded-xl border border-kuning-muda p-4 mb-5 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Cari berdasarkan nomor, pemohon, perihal..."
          className="flex-1 min-w-48 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-kuning"
        />
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-kuning">
          <option value="">Semua Tahun</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-kuning-muda overflow-hidden">
        {arsipData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-krem">
                <tr className="border-b border-kuning-muda text-left">
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-teks/50">Nomor Surat</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-teks/50">Jenis Surat</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-teks/50">Pemohon</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-teks/50">Tgl Terbit</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-teks/50">Disetujui Oleh</th>
                  <th className="px-5 py-3.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {arsipData.map((surat) => (
                  <tr key={surat.id} className="hover:bg-krem/60 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-teks/70">{surat.nomor}</td>
                    <td className="px-5 py-3.5 font-medium">{JENIS_SURAT_LABELS[surat.jenis as JenisSurat] ?? surat.jenis}</td>
                    <td className="px-5 py-3.5 text-teks/80">{surat.pemohon}</td>
                    <td className="px-5 py-3.5 text-teks/60 text-xs">{surat.tanggal_terbit || surat.tanggal_buat}</td>
                    <td className="px-5 py-3.5 text-teks/60 text-xs">{surat.disetujui_oleh || "Camat"}</td>
                    <td className="px-5 py-3.5 flex gap-2">
                      <Link
                        href={`/internal/surat/${surat.id}/cetak`}
                        target="_blank"
                        className="text-xs font-semibold text-hijau hover:text-kuning transition-colors"
                      >
                        Cetak PDF
                      </Link>
                      <span className="text-gray-300">|</span>
                      <Link
                        href={`/internal/surat/${surat.id}`}
                        className="text-xs font-semibold text-teks/60 hover:text-teks transition-colors"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-teks/50">
            Belum ada arsip surat yang diterbitkan.
          </div>
        )}
      </div>
    </div>
  )
}
