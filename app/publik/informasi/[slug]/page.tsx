import { notFound } from "next/navigation"
import Link from "next/link"
import { INFORMASI_DATA } from "@/lib/mock-data/informasi"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User } from "lucide-react"

export default async function DetailInformasiPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const info = INFORMASI_DATA.find((i) => i.slug === slug)
  if (!info) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/publik/informasi">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Informasi
          </Button>
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider bg-kuning-muda text-teks/80 px-2.5 py-1 rounded border border-kuning/30">
          Kategori: {info.kategori}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-kuning-muda p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Header */}
        <div className="space-y-3 pb-5 border-b border-gray-150">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-hijau leading-tight">
            {info.judul}
          </h1>
          <div className="flex flex-wrap gap-4 text-xs text-teks/50">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {info.tanggal}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Ditulis oleh: {info.penulis}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="text-sm sm:text-base text-teks/80 leading-relaxed whitespace-pre-wrap font-sans space-y-4">
          {info.isi}
        </div>
      </div>
    </div>
  )
}
