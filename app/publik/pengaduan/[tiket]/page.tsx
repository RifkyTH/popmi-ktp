import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createServiceClient } from "@/lib/supabase/server"
import { STATUS_PENGADUAN_LABELS, KATEGORI_LABELS, StatusPengaduan, KategoriPengaduan } from "@/lib/mock-data/pengaduan"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { StatusTimeline } from "@/components/ui/status-timeline"
import { ArrowLeft, MapPin, CheckCircle, ImageIcon } from "lucide-react"

const statusOrder = ["masuk", "verifikasi", "proses", "selesai"]

export default async function DetailPengaduanPage({
  params,
}: {
  params: Promise<{ tiket: string }>
}) {
  const { tiket } = await params
  const supabase = await createServiceClient()
  
  // Fetch pengaduan
  const { data: report } = await supabase
    .from("pengaduan")
    .select("*")
    .eq("tiket", tiket)
    .single()

  if (!report) notFound()

  // Fetch riwayat
  const { data: riwayatList } = await supabase
    .from("pengaduan_riwayat")
    .select("*")
    .eq("pengaduan_id", report.id)
    .order("tanggal", { ascending: true })

  const riwayat = riwayatList || []

  const reportStatus = report.status as StatusPengaduan
  const reportKategori = report.kategori as KategoriPengaduan

  const currentIndex = statusOrder.indexOf(reportStatus)
  const timelineSteps = statusOrder.map((status, i) => {
    const r = riwayat.find((x) => x.status === status)
    return {
      label: STATUS_PENGADUAN_LABELS[status as StatusPengaduan] || status,
      description: r ? r.catatan : undefined,
      timestamp: r?.tanggal,
      done: i < currentIndex,
      active: i === currentIndex,
    }
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <PageHeader title={`Aduan: ${report.tiket}`} subtitle={report.judul}>
        <Link href="/publik/pengaduan/cek">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info detail */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-kuning-muda p-6 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-gray-100">
              <span className="font-mono font-bold text-hijau text-sm">{report.tiket}</span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                  reportStatus === "selesai"
                    ? "bg-green-100 text-green-800"
                    : reportStatus === "proses"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {STATUS_PENGADUAN_LABELS[reportStatus]}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-teks/50 mb-1">Judul Laporan</h3>
                <p className="text-base font-semibold text-teks">{report.judul}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-teks/50 mb-1">Kategori</h3>
                <p className="text-sm font-semibold text-teks">{KATEGORI_LABELS[reportKategori]}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-teks/50 mb-1">Rincian Laporan</h3>
                <p className="text-sm text-teks/80 leading-relaxed whitespace-pre-wrap">{report.deskripsi}</p>
              </div>

              {report.lokasi && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teks/50 mb-1">Detail Lokasi</h3>
                  <p className="text-sm text-teks/80 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-hijau shrink-0" /> {report.lokasi}
                  </p>
                </div>
              )}

              {/* Foto Bukti */}
              {report.foto_url && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teks/50 mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" /> Foto Bukti Fisik
                  </h3>
                  <a href={report.foto_url} target="_blank" rel="noopener noreferrer" className="block group">
                    <div className="relative rounded-xl overflow-hidden border border-kuning-muda shadow-sm">
                      <Image
                        src={report.foto_url}
                        alt="Foto bukti pengaduan"
                        width={800}
                        height={450}
                        className="w-full max-h-80 object-cover group-hover:scale-[1.01] transition-transform duration-200"
                        unoptimized
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/30 text-white text-[10px] text-center py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        Klik untuk lihat ukuran penuh
                      </div>
                    </div>
                  </a>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2 text-xs text-teks/60">
                <div>
                  <span className="block font-bold text-teks/40 mb-0.5 uppercase tracking-wider">Desa</span>
                  <span>Desa {report.desa}</span>
                </div>
                <div>
                  <span className="block font-bold text-teks/40 mb-0.5 uppercase tracking-wider">Tanggal Masuk</span>
                  <span>{new Date(report.tanggal_masuk).toLocaleDateString("id-ID")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Respon Petugas */}
          {report.respon_petugas && (
            <div className="bg-white rounded-2xl border border-kuning-muda p-6 space-y-3 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-kuning/10 rounded-bl-full flex items-center justify-center pointer-events-none">
                <CheckCircle className="w-5 h-5 text-kuning translate-x-1.5 -translate-y-1.5" />
              </div>
              <h3 className="font-serif font-bold text-hijau text-base">Tanggapan Petugas Kecamatan</h3>
              <p className="text-sm text-teks/80 leading-relaxed">{report.respon_petugas}</p>
              {report.petugas_terkait && (
                <p className="text-xs text-teks/50 pt-1">
                  Ditanggapi oleh: <strong className="text-teks/70">{report.petugas_terkait}</strong>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Timeline aduan */}
        <div className="bg-white rounded-2xl border border-kuning-muda p-6 shadow-sm h-fit">
          <h3 className="font-serif font-bold text-hijau text-base mb-5">Timeline Tindak Lanjut</h3>
          <StatusTimeline steps={timelineSteps} />
        </div>
      </div>
    </div>
  )
}
