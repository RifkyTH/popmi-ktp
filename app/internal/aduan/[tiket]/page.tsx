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

export const revalidate = 0

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

  // Format WhatsApp Link jika kontak berformat nomor telepon
  const cleanPhone = report.kontak ? report.kontak.replace(/\D/g, "") : ""
  const waNumber = cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone
  const waUrl = cleanPhone.length >= 10 ? `https://wa.me/${waNumber}?text=Halo%20Bpk%2FIbu%20${encodeURIComponent(report.nama)}%2C%20terkait%20laporan%20aduan%20Anda%20dengan%20nomor%20tiket%20${report.tiket}%20di%20Kecamatan%20Temiang%20Pesisir.` : null

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Header GovTech */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Layanan Pengaduan (LAPOR-TP) · Lembar Kerja Petugas
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2F4A3C] tracking-tight">
              Aduan: <span className="font-mono text-emerald-800">{report.tiket}</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1 max-w-2xl">
              Verifikasi kelayakan informasi laporan masyarakat, lakukan koordinasi lapangan, dan berikan tindak lanjut resmi.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
            <Link href="/internal/aduan">
              <Button variant="outline" size="sm" className="text-xs font-semibold rounded-xl border-gray-300">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Kembali ke Daftar
              </Button>
            </Link>
            <DeleteDetailAduanButton id={report.id} tiket={report.tiket} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Detail Laporan & Pelapor (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Kartu Rincian Laporan */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-7 space-y-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  {KATEGORI_LABELS[report.kategori as KategoriPengaduan] || report.kategori}
                </span>
                <span className="text-xs text-gray-400">·</span>
                <span className="text-xs text-gray-500">
                  Masuk: {new Date(report.tanggal_masuk).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                  report.status === "selesai"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : report.status === "proses"
                    ? "bg-blue-50 text-blue-800 border border-blue-200"
                    : report.status === "ditolak"
                    ? "bg-rose-50 text-rose-800 border border-rose-200"
                    : "bg-amber-50 text-amber-800 border border-amber-200"
                }`}
              >
                {STATUS_PENGADUAN_LABELS[report.status as StatusPengaduan] || report.status}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Judul Pokok Aduan
                </span>
                <h2 className="text-lg font-bold text-gray-900 leading-snug">
                  {report.judul}
                </h2>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                  Uraian Lengkap Laporan Warga
                </span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {report.deskripsi}
                </div>
              </div>

              {report.lokasi && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    Detail Lokasi Kejadian
                  </span>
                  <p className="text-xs text-gray-800 flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" /> {report.lokasi}
                  </p>
                </div>
              )}

              {/* Bukti Foto */}
              {report.foto_url && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-700" /> Bukti Lampiran Foto
                  </span>
                  <a href={report.foto_url} target="_blank" rel="noopener noreferrer" className="block group">
                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm max-w-lg bg-slate-50">
                      <Image
                        src={report.foto_url}
                        alt="Foto bukti pengaduan"
                        width={800}
                        height={450}
                        className="w-full max-h-72 object-cover group-hover:scale-[1.02] transition-transform duration-200"
                        unoptimized
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-xs text-white text-[11px] text-center py-2 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                        Klik untuk membuka foto ukuran penuh di tab baru
                      </div>
                    </div>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Kartu Informasi Pelapor */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#2F4A3C]">
              Identitas Pelapor Warga
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-gray-400 block text-[11px] mb-1">Nama Pelapor</span>
                <span className="font-bold text-gray-900 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-700" /> {report.nama}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-gray-400 block text-[11px] mb-1">Domisili Desa</span>
                <span className="font-bold text-gray-900">
                  Desa {report.desa}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between">
                <div>
                  <span className="text-gray-400 block text-[11px] mb-1">Kontak WhatsApp/HP</span>
                  <span className="font-mono font-bold text-gray-900 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" /> {report.kontak || "-"}
                  </span>
                </div>
                {waUrl && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center justify-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  >
                    Hubungi via WA
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Formulir Update & Status Timeline (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <UpdateAduanForm 
            tiket={report.tiket} 
            currentStatus={report.status} 
            currentRespon={report.respon_petugas}
            userName={userName}
          />

          {/* Tanggapan Petugas Saat Ini */}
          {report.respon_petugas && (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm space-y-2 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                Tanggapan Aktif di Publik
              </span>
              <p className="text-gray-700 leading-relaxed italic mt-1">
                &ldquo;{report.respon_petugas}&rdquo;
              </p>
              {report.tanggal_selesai && (
                <span className="text-[11px] text-gray-400 block">
                  Diselesaikan: {new Date(report.tanggal_selesai).toLocaleDateString("id-ID")}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
