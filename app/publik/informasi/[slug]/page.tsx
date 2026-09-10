import { notFound } from "next/navigation"
import Link from "next/link"
import { INFORMASI_DATA } from "@/lib/mock-data/informasi"
import { ArrowLeft, Calendar, User, Building2, ShieldCheck, Share2 } from "lucide-react"

export default async function DetailInformasiPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const info = INFORMASI_DATA.find((i) => i.slug === slug)
  if (!info) notFound()

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Link href="/publik/informasi">
          <button className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#2F4A3C] bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Indeks Berita
          </button>
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider bg-[#2F4A3C]/10 text-[#2F4A3C] px-3 py-1 rounded-full">
          Kategori: {info.kategori}
        </span>
      </div>

      {/* Article Container */}
      <article className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2F4A3C] via-[#D9A400] to-[#10B981]" />

        {/* Header */}
        <div className="space-y-4 pb-6 border-b border-slate-100">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#D9A400]">
            <Building2 className="w-3.5 h-3.5" />
            <span>Kecamatan Temiang Pesisir · Siaran Resmi</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#2F4A3C] leading-tight tracking-tight">
            {info.judul}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {info.tanggal}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Dipublikasikan oleh: <strong className="text-slate-700 font-semibold">{info.penulis}</strong>
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              <ShieldCheck className="w-3 h-3" /> Terverifikasi
            </span>
          </div>
        </div>

        {/* Summary highlight */}
        {info.ringkasan && (
          <div className="bg-slate-50 border-l-4 border-[#D9A400] p-4 rounded-r-2xl text-xs sm:text-sm text-slate-600 italic leading-relaxed">
            &ldquo;{info.ringkasan}&rdquo;
          </div>
        )}

        {/* Body Content */}
        <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-wrap font-sans space-y-4">
          {info.isi}
        </div>

        {/* Footer Signature */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p>Pemerintah Kecamatan Temiang Pesisir · Kabupaten Lingga</p>
          <Link href="/publik/informasi" className="font-bold text-[#2F4A3C] hover:text-[#D9A400] underline">
            Lihat publikasi dan pengumuman lainnya &rarr;
          </Link>
        </div>
      </article>
    </div>
  )
}

