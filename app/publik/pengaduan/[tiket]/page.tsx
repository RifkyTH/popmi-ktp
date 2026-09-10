import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createServiceClient } from "@/lib/supabase/server"
import { STATUS_PENGADUAN_LABELS, KATEGORI_LABELS, StatusPengaduan, KategoriPengaduan } from "@/lib/mock-data/pengaduan"
import { ArrowLeft, MapPin, CheckCircle2, ImageIcon, Clock, CheckCircle, ShieldCheck, Building2, PhoneCall } from "lucide-react"

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

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      {/* Top Bar / Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link href="/publik/pengaduan/cek">
            <button className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#2F4A3C] bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-2xs transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali
            </button>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Nomor Tiket:</span>
            <span className="font-mono font-bold text-sm bg-[#2F4A3C]/10 text-[#2F4A3C] px-2.5 py-0.5 rounded-lg">
              {report.tiket}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
              reportStatus === "selesai"
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300/40"
                : reportStatus === "proses"
                ? "bg-blue-100 text-blue-800 border border-blue-300/40"
                : "bg-amber-100 text-amber-800 border border-amber-300/40"
            }`}
          >
            {STATUS_PENGADUAN_LABELS[reportStatus]}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Detail Utama */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Aduan */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                  {KATEGORI_LABELS[reportKategori]}
                </span>
                <span className="text-xs text-slate-400">
                  Desa {report.desa}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#2F4A3C] leading-snug">
                {report.judul}
              </h1>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-100 text-sm">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Uraian &amp; Kronologi Aduan
                </span>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {report.deskripsi}
                </p>
              </div>

              {report.lokasi && (
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-start gap-2.5 text-xs text-slate-600">
                  <MapPin className="w-4 h-4 text-[#D9A400] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-700">Patokan Lokasi Fisik:</strong>
                    <span>{report.lokasi}</span>
                  </div>
                </div>
              )}

              {/* Foto Bukti Fisik */}
              {report.foto_url && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#2F4A3C]" /> Foto Bukti Pendukung
                  </span>
                  <a href={report.foto_url} target="_blank" rel="noopener noreferrer" className="block group">
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100">
                      <Image
                        src={report.foto_url}
                        alt="Foto bukti pengaduan"
                        width={800}
                        height={450}
                        className="w-full max-h-80 object-cover group-hover:scale-[1.01] transition-transform duration-200"
                        unoptimized
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent text-white text-[11px] text-center py-2 opacity-90">
                        Klik untuk membuka gambar resolusi penuh
                      </div>
                    </div>
                  </a>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                <div>
                  <span className="block font-bold text-slate-400 uppercase tracking-wider text-[10px]">Wilayah Desa</span>
                  <span className="font-medium text-slate-700">Desa {report.desa}</span>
                </div>
                <div>
                  <span className="block font-bold text-slate-400 uppercase tracking-wider text-[10px]">Waktu Pengiriman</span>
                  <span className="font-medium text-slate-700">
                    {new Date(report.tanggal_masuk).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Kotak Tanggapan Resmi Petugas */}
          {report.respon_petugas ? (
            <div className="bg-emerald-50/70 rounded-3xl border border-emerald-200/80 p-6 sm:p-7 shadow-xs space-y-3 relative overflow-hidden">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-emerald-950 text-base">
                    Tanggapan Resmi Kecamatan Temiang Pesisir
                  </h2>
                  <p className="text-[11px] text-emerald-700">
                    Tindak lanjut terverifikasi oleh aparatur kecamatan
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-emerald-900/90 leading-relaxed whitespace-pre-wrap pt-1">
                {report.respon_petugas}
              </p>
              {report.petugas_terkait && (
                <div className="pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs text-emerald-800">
                  <span>Petugas Penanggung Jawab:</span>
                  <strong className="font-semibold">{report.petugas_terkait}</strong>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-5 text-center space-y-1">
              <Clock className="w-5 h-5 text-slate-400 mx-auto" />
              <h3 className="text-xs font-bold text-slate-700">Dalam Antrean Penanganan</h3>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Laporan Anda sedang ditelaah oleh petugas terkait di Kantor Camat Temiang Pesisir. Tanggapan resmi akan muncul di sini.
              </p>
            </div>
          )}
        </div>

        {/* Timeline & Informasi Pendukung */}
        <div className="space-y-6">
          {/* Card Timeline Stepper */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            <h2 className="font-serif font-bold text-[#2F4A3C] text-base pb-2 border-b border-slate-100">
              Progres Tindak Lanjut
            </h2>

            <ol className="relative border-l-2 border-slate-200 ml-3 space-y-6">
              {statusOrder.map((statusKey, i) => {
                const isDone = i < currentIndex
                const isActive = i === currentIndex
                const r = riwayat.find((x) => x.status === statusKey)

                return (
                  <li key={statusKey} className="ml-6 relative">
                    <span
                      className={`absolute -left-[31px] top-0 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-white text-xs font-bold ${
                        isDone
                          ? "bg-emerald-600 text-white"
                          : isActive
                          ? "bg-[#2F4A3C] text-white shadow-xs"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isDone ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                    </span>

                    <h3
                      className={`text-xs font-bold ${
                        isActive
                          ? "text-[#2F4A3C]"
                          : isDone
                          ? "text-emerald-700"
                          : "text-slate-400"
                      }`}
                    >
                      {STATUS_PENGADUAN_LABELS[statusKey as StatusPengaduan]}
                    </h3>

                    {r?.catatan && (
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        {r.catatan}
                      </p>
                    )}

                    {r?.tanggal && (
                      <time className="block text-[10px] text-slate-400 mt-1">
                        {new Date(r.tanggal).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    )}
                  </li>
                )
              })}
            </ol>
          </div>

          {/* Bantuan / Kontak Center */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 p-5 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-[#2F4A3C] font-bold">
              <Building2 className="w-4 h-4 text-[#D9A400]" />
              Pusat Pelayanan Kecamatan
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Butuh konfirmasi mendesak atau klarifikasi data laporan? Hubungi Posko Pengaduan Tajur Biru.
            </p>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800 underline"
            >
              <PhoneCall className="w-3 h-3" /> WhatsApp Posko Pengaduan
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

