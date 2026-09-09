import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createServiceClient } from "@/lib/supabase/server"
import { STATUS_PENGADUAN_LABELS, KATEGORI_LABELS, StatusPengaduan, KategoriPengaduan } from "@/lib/mock-data/pengaduan"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Phone, MapPin, CheckCircle, ImageIcon } from "lucide-react"
import { UpdateAduanForm } from "../update-form"
import { getSessionFromCookie } from "@/lib/auth"
import { cookies } from "next/headers"
import { DeleteDetailAduanButton } from "../delete-detail-button"

export default async function DetailAduanInternalPage({
  params,
}: {
  params: Promise<{ tiket: string }>
}) {
  const { tiket } = await params
  const supabase = await createServiceClient()
  
  // Ambil data user yang login untuk dicatat sebagai petugas
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("silat_session")?.value
  const user = sessionToken ? getSessionFromCookie(sessionToken) : null
  const userName = user ? user.role.toUpperCase() : "Admin"

  // Fetch pengaduan
  const { data: report } = await supabase
    .from("pengaduan")
    .select("*")
    .eq("tiket", tiket)
    .single()

  if (!report) notFound()

  return (
    <div className="space-y-6">
      <PageHeader title={`Aduan: ${report.tiket}`} subtitle="Verifikasi dan tindak lanjuti laporan warga">
        <Link href="/internal/aduan">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
          </Button>
        </Link>
        <DeleteDetailAduanButton id={report.id} tiket={report.tiket} />
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Detail Laporan */}
          <div className="bg-white rounded-xl border border-kuning-muda p-6 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-gray-100">
              <span className="font-mono font-bold text-hijau">{report.tiket}</span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                report.status === "selesai" ? "bg-green-100 text-green-800" :
                report.status === "proses" ? "bg-blue-100 text-blue-800" :
                "bg-orange-100 text-orange-800"
              }`}>
                {STATUS_PENGADUAN_LABELS[report.status as StatusPengaduan]}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-teks/50 mb-1">Kategori</h3>
                <p className="text-sm font-semibold text-teks">{KATEGORI_LABELS[report.kategori as KategoriPengaduan]}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-teks/50 mb-1">Judul Laporan</h3>
                <p className="text-base font-semibold text-teks">{report.judul}</p>
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
            </div>
          </div>

          {/* Info Pelapor */}
          <div className="bg-white rounded-xl border border-kuning-muda p-6 shadow-sm">
            <h3 className="font-serif font-bold text-hijau mb-4">Informasi Pelapor</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="block text-xs font-bold uppercase text-teks/50 mb-1">Nama</span>
                <span className="font-medium flex items-center gap-1"><User className="w-3.5 h-3.5" /> {report.nama}</span>
              </div>
              <div>
                <span className="block text-xs font-bold uppercase text-teks/50 mb-1">Kontak</span>
                <span className="font-medium flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {report.kontak}</span>
              </div>
              <div>
                <span className="block text-xs font-bold uppercase text-teks/50 mb-1">Desa Asal</span>
                <span className="font-medium">{report.desa}</span>
              </div>
              <div>
                <span className="block text-xs font-bold uppercase text-teks/50 mb-1">Tanggal Lapor</span>
                <span className="font-medium">{new Date(report.tanggal_masuk).toLocaleDateString("id-ID")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-5">
          <UpdateAduanForm 
            tiket={report.tiket} 
            currentStatus={report.status} 
            currentRespon={report.respon_petugas}
            userName={userName}
          />
        </div>
      </div>
    </div>
  )
}
