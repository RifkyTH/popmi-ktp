import { notFound } from "next/navigation"
import Link from "next/link"
import { getInformasiBySlug } from "@/lib/actions/informasi"
import { KATEGORI_LABELS } from "@/lib/mock-data/informasi"
import { ArrowLeft, Calendar, User, Building2, ShieldCheck, Share2, Clock, Eye } from "lucide-react"
import { Metadata } from "next"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const info = await getInformasiBySlug(slug)
  if (!info) return { title: "Informasi Tidak Ditemukan" }
  return {
    title: `${info.judul} - POPMI KTP`,
    description: info.ringkasan,
  }
}

export default async function DetailInformasiPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const info = await getInformasiBySlug(slug)
  if (!info) notFound()

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Link href="/publik/informasi">
          <button className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#2F4A3C] bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs transition-colors cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Indeks Informasi
          </button>
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider bg-[#2F4A3C]/10 text-[#2F4A3C] px-3 py-1 rounded-full border border-[#2F4A3C]/20">
          Kategori: {KATEGORI_LABELS[info.kategori] || info.kategori}
        </span>
      </div>

      {/* Article Container */}
      <article className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2F4A3C] via-[#D9A400] to-[#10B981]" />

        {/* Header Section */}
        <div className="space-y-4 pb-6 border-b border-slate-100">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#D9A400]">
            <Building2 className="w-3.5 h-3.5" />
            <span>Pemerintah Kecamatan Temiang Pesisir · Siaran Resmi</span>
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
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
              <ShieldCheck className="w-3 h-3" /> Terverifikasi
            </span>
          </div>
        </div>

        {/* High-Resolution Cover Photo */}
        {info.gambar && (
          <div className="w-full h-72 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative shadow-xs group">
            <img
              src={info.gambar}
              alt={info.judul}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white/90 text-[11px] font-medium border border-white/15">
              Dokumentasi Resmi Kecamatan Temiang Pesisir
            </div>
          </div>
        )}

        {/* Summary highlight */}
        {info.ringkasan && (
          <div className="bg-slate-50 border-l-4 border-[#D9A400] p-4.5 rounded-r-2xl text-xs sm:text-sm text-slate-700 italic leading-relaxed">
            &ldquo;{info.ringkasan}&rdquo;
          </div>
        )}

        {/* Body Content */}
        <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-wrap font-sans space-y-4">
          {info.isi}
        </div>

        {/* Footer Signature */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p>Pemerintah Kecamatan Temiang Pesisir · Kabupaten Lingga, Kepulauan Riau</p>
          <Link href="/publik/informasi" className="font-bold text-[#2F4A3C] hover:text-[#D9A400] underline">
            Lihat publikasi dan pengumuman lainnya &rarr;
          </Link>
        </div>
      </article>
    </div>
  )
}
