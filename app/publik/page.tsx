import Link from "next/link"
import { INFORMASI_DATA } from "@/lib/mock-data/informasi"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Eye, ArrowRight } from "lucide-react"
import { createServiceClient } from "@/lib/supabase/server"
import { StatsCounter } from "./stats-counter"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function PublikHomePage() {
  const latestNews = INFORMASI_DATA.slice(0, 3)

  const supabase = await createServiceClient()

  const { count: total } = await supabase
    .from("pengaduan")
    .select("*", { count: "exact", head: true })

  const { count: menunggu } = await supabase
    .from("pengaduan")
    .select("*", { count: "exact", head: true })
    .in("status", ["masuk", "verifikasi"])

  const { count: proses } = await supabase
    .from("pengaduan")
    .select("*", { count: "exact", head: true })
    .eq("status", "proses")

  const { count: selesai } = await supabase
    .from("pengaduan")
    .select("*", { count: "exact", head: true })
    .eq("status", "selesai")

  const initialCounts = {
    total: total ?? 0,
    menunggu: menunggu ?? 0,
    proses: proses ?? 0,
    selesai: selesai ?? 0,
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-kuning-muda/30 py-16 px-4 border-b border-kuning-muda/50">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="h-0.5 w-6 bg-kuning rounded-full" />
            <span className="text-xs font-bold uppercase tracking-widest text-teks/60">Layanan Posko Pengaduan & Informasi</span>
            <div className="h-0.5 w-6 bg-kuning rounded-full" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-hijau leading-tight">
            Satu Sistem, Surat Tertib,<br />Aduan Terpantau
          </h1>
          <p className="text-sm sm:text-base text-teks/70 max-w-xl mx-auto leading-relaxed">
            Laporkan permasalahan infrastruktur, pelayanan publik, sosial, lingkungan, atau keamanan di wilayah Kecamatan Temiang Pesisir. Dapatkan kepastian tindak lanjut secara real-time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/publik/pengaduan/buat" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-hijau hover:bg-hijau/95 text-white font-bold px-8 py-3.5 rounded-xl border border-kuning/30 shadow-md flex items-center justify-center gap-2 uppercase text-xs tracking-wider">
                <MessageSquare className="w-4 h-4 text-kuning" /> Buat Pengaduan Sekarang
              </button>
            </Link>
            <Link href="/publik/pengaduan/cek" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white hover:bg-krem text-teks border border-kuning font-bold px-8 py-3.5 rounded-xl shadow-sm flex items-center justify-center gap-2 uppercase text-xs tracking-wider">
                <Eye className="w-4 h-4 text-hijau" /> Cek Status Laporan
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StatsCounter initialCounts={initialCounts} />
      </section>

      {/* Alur Proses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-serif font-bold text-hijau">Bagaimana POPMI KTP Bekerja?</h2>
          <p className="text-sm text-teks/60">4 langkah mudah penyelesaian aduan Anda</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
          {[
            { num: "01", title: "Kirim Aduan", desc: "Isi form laporan secara lengkap dengan lokasi & foto pendukung." },
            { num: "02", title: "Terima Tiket", desc: "Dapatkan nomor tiket unik untuk melacak progress aduan Anda." },
            { num: "03", title: "Verifikasi & Proses", desc: "Petugas memvalidasi laporan dan mendistribusikan ke unit teknis." },
            { num: "04", title: "Pemberitahuan Selesai", desc: "Dapatkan info rincian penyelesaian masalah secara terbuka." },
          ].map((step, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-kuning-muda relative shadow-sm">
              <span className="text-3xl font-serif font-bold text-kuning/40 block mb-2">{step.num}</span>
              <h3 className="font-bold text-sm text-teks mb-1">{step.title}</h3>
              <p className="text-xs text-teks/60 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Berita Terbaru */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-bold text-hijau">Berita & Informasi Terbaru</h2>
          <Link href="/publik/informasi" className="text-xs font-bold text-kuning hover:underline flex items-center gap-1">
            Lihat Semua Informasi <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews.map((info) => (
            <Card key={info.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-kuning-muda text-teks/80 px-2 py-0.5 rounded border border-kuning/20">
                    {info.kategori}
                  </span>
                  <h3 className="font-bold text-base text-teks font-serif line-clamp-2 leading-snug">{info.judul}</h3>
                  <p className="text-xs text-teks/60 line-clamp-3 leading-relaxed">{info.ringkasan}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-[10px] text-teks/50">
                  <span>{info.tanggal}</span>
                  <Link href={`/publik/informasi/${info.slug}`} className="font-bold text-hijau hover:underline">
                    Baca Selengkapnya
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
