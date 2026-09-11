import Link from "next/link"
import {
  MessageSquare,
  Eye,
  ArrowRight,
  MapPin,
  Layers,
  BarChart3,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  FileCheck2,
  Search,
  Building2,
  Navigation,
  Sparkles,
} from "lucide-react"
import { createServiceClient } from "@/lib/supabase/server"
import { getInformasiList } from "@/lib/actions/informasi"
import { getHeroBackgroundSettings } from "@/lib/data/hero-settings"
import { isHeroTextWhite } from "@/lib/data/hero-types"
import { StatsCounter } from "./stats-counter"
import { HeroSlideShow } from "@/components/publik/hero-slideshow"
import { HeroAnimatedBackground } from "@/components/publik/hero-animated-background"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function PublikHomePage() {
  const heroSettings = getHeroBackgroundSettings()
  const isWhite = isHeroTextWhite(heroSettings)
  const allNews = await getInformasiList({ publishedOnly: true })
  const headlineSlides = allNews.filter((n) => n.is_headline).length > 0
    ? allNews.filter((n) => n.is_headline)
    : allNews.slice(0, 4)
  const latestNews = allNews.slice(0, 3)

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
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden pt-14 pb-18 px-4 border-b border-slate-200/80">
        {/* Animated Background (Uploaded and managed by Superadmin) */}
        <HeroAnimatedBackground settings={heroSettings} />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Official badge */}
          <div
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full border shadow-xs transition-colors",
              isWhite
                ? "bg-white/15 backdrop-blur-md border-white/25 text-white"
                : "bg-white border-[#D9A400]/40 text-[#2F4A3C]"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-[#D9A400] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest">
              Portal Resmi Layanan Aspirasi &amp; Informasi Publik
            </span>
          </div>

          {/* Main Title */}
          <h1
            className={cn(
              "text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight tracking-tight transition-colors",
              isWhite
                ? "text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]"
                : "text-[#2F4A3C]"
            )}
          >
            Satu Sistem, Surat Tertib, <br className="hidden sm:inline" />
            <span
              className={cn(
                "bg-clip-text text-transparent",
                isWhite
                  ? "bg-gradient-to-r from-emerald-300 via-amber-200 to-teal-200"
                  : "bg-gradient-to-r from-[#2F4A3C] via-[#2F4A3C] to-[#10B981]"
              )}
            >
              Aduan Terpantau
            </span>
          </h1>

          <p
            className={cn(
              "text-sm sm:text-base max-w-2xl mx-auto leading-relaxed transition-colors",
              isWhite
                ? "text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]"
                : "text-slate-600"
            )}
          >
            Platform pengaduan dan keterbukaan informasi digital Kecamatan Temiang Pesisir, Kabupaten Lingga.
            Laporkan masalah fasilitas, lingkungan, dan pelayanan di desa Anda secara terverifikasi dan transparan.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/publik/pengaduan/buat" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-[#2F4A3C] hover:bg-[#23382D] text-white font-bold px-7 py-3.5 rounded-xl border border-[#D9A400]/40 shadow-md flex items-center justify-center gap-2.5 text-xs uppercase tracking-wider transition-all hover:shadow-lg hover:-translate-y-0.5">
                <MessageSquare className="w-4 h-4 text-[#D9A400]" /> Buat Pengaduan Warga
              </button>
            </Link>
            <Link href="/publik/pengaduan/cek" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white hover:bg-slate-50 text-[#2F4A3C] border border-slate-300 font-bold px-7 py-3.5 rounded-xl shadow-xs flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all hover:border-[#2F4A3C]/40 hover:-translate-y-0.5">
                <Eye className="w-4 h-4 text-[#2F4A3C]" /> Lacak Tiket Laporan
              </button>
            </Link>
          </div>

          {/* Quick Ticket Lookup Mini Box */}
          <div className="pt-4 max-w-xl mx-auto">
            <form action="/publik/pengaduan/cek" method="GET" className="bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-2">
              <div className="pl-3.5 text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="q"
                placeholder="Punya nomor tiket? Ketik di sini (contoh: TP-2026-00121)..."
                className="w-full text-xs sm:text-sm bg-transparent border-0 focus:outline-none text-slate-800 placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="bg-[#2F4A3C] hover:bg-[#23382D] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shrink-0 transition-colors"
              >
                Cek Progres
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Hero Featured Slide Show Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D9A400] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#2F4A3C]">
              Dokumentasi Kegiatan &amp; Sorotan Berita Kecamatan
            </span>
          </div>
          <Link
            href="/publik/informasi"
            className="text-xs font-bold text-[#2F4A3C] hover:text-[#D9A400] flex items-center gap-1 transition-colors"
          >
            Lihat Semua Informasi <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <HeroSlideShow items={headlineSlides} />
      </section>

      {/* Stats Counter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StatsCounter initialCounts={initialCounts} />
      </section>

      {/* 4 Fitur Utama / Quick Access Hub */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-2 border-b border-slate-200/80 gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D9A400]">
              Layanan Digital Warga
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2F4A3C]">
              Akses Cepat &amp; Fasilitas Publik
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Terhubung langsung dengan operator di Kantor Camat
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Lapor Permasalahan */}
          <Link
            href="/publik/pengaduan/buat"
            className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-[#2F4A3C]/40 transition-all flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="h-40 w-full overflow-hidden relative bg-slate-100">
                <img
                  src="/images/quick-access/quick-lapor.jpg"
                  alt="Ilustrasi Lapor Permasalahan Warga"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-md text-emerald-700 shadow-xs flex items-center justify-center border border-white/60">
                  <Send className="w-4 h-4" />
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-serif font-bold text-base text-[#2F4A3C] group-hover:text-[#23382D]">
                  Lapor Permasalahan
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Laporkan keluhan jalan, sampah, bansos, atau dokumen dengan bukti foto dan koordinat GPS.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0 flex items-center text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
              Buka Formulir Aduan <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          {/* Card 2: Pantau Tiket Real-Time */}
          <Link
            href="/publik/pengaduan/cek"
            className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-[#2F4A3C]/40 transition-all flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="h-40 w-full overflow-hidden relative bg-slate-100">
                <img
                  src="/images/quick-access/quick-lacak.jpg"
                  alt="Ilustrasi Pantau Tiket Laporan"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-md text-blue-700 shadow-xs flex items-center justify-center border border-white/60">
                  <FileCheck2 className="w-4 h-4" />
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-serif font-bold text-base text-[#2F4A3C] group-hover:text-[#23382D]">
                  Pantau Tiket Real-Time
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Ketahui sejauh mana laporan Anda ditindaklanjuti lengkap dengan riwayat dan catatan petugas.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0 flex items-center text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform">
              Cek Status Sekarang <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          {/* Card 3: Peta Sebaran Laporan */}
          <Link
            href="/publik/peta"
            className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-[#2F4A3C]/40 transition-all flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="h-40 w-full overflow-hidden relative bg-slate-100">
                <img
                  src="/images/quick-access/quick-peta.jpg"
                  alt="Ilustrasi Peta Sebaran Laporan"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-md text-amber-700 shadow-xs flex items-center justify-center border border-white/60">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-serif font-bold text-base text-[#2F4A3C] group-hover:text-[#23382D]">
                  Peta Sebaran Laporan
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Visualisasi titik aduan masyarakat secara geografis di seluruh pulau dan pesisir kecamatan.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0 flex items-center text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform">
              Eksplorasi Peta Interaktif <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          {/* Card 4: Transparansi & Statistik */}
          <Link
            href="/publik/transparansi"
            className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-[#2F4A3C]/40 transition-all flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="h-40 w-full overflow-hidden relative bg-slate-100">
                <img
                  src="/images/quick-access/quick-transparansi.jpg"
                  alt="Ilustrasi Transparansi dan Statistik Data"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-md text-[#2F4A3C] shadow-xs flex items-center justify-center border border-white/60">
                  <BarChart3 className="w-4 h-4" />
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-serif font-bold text-base text-[#2F4A3C] group-hover:text-[#23382D]">
                  Transparansi &amp; Statistik
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Buka data kinerja penanganan keluhan warga per desa dan kategori masalah secara akuntabel.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0 flex items-center text-xs font-bold text-[#2F4A3C] group-hover:translate-x-1 transition-transform">
              Lihat Statistik Lengkap <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* Alur Proses 4 Langkah */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D9A400]">
              Mekanisme Standar Pelayanan
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F4A3C]">
              Bagaimana Aduan Anda Diproses?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              4 tahap terstruktur dari penerimaan hingga penyelesaian tuntas oleh pihak Kecamatan Temiang Pesisir
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              {
                step: "01",
                icon: Send,
                title: "Kirim Laporan",
                desc: "Isi identitas diri, deskripsi keluhan, lokasi fisik, serta lampirkan foto dan koordinat GPS.",
              },
              {
                step: "02",
                icon: ShieldCheck,
                title: "Terima Kode Tiket",
                desc: "Sistem menerbitkan nomor tiket unik (contoh: TP-2026-00121) untuk memantau progres kapan saja.",
              },
              {
                step: "03",
                icon: Clock,
                title: "Validasi & Tindak Lanjut",
                desc: "Petugas kecamatan memeriksa laporan dan mendisposisikan ke unit teknis atau aparat desa terkait.",
              },
              {
                step: "04",
                icon: CheckCircle2,
                title: "Pemberitahuan Tuntas",
                desc: "Aduan diselesaikan disertai penjelasan resmi dan dokumentasi tindak lanjut yang dapat dilihat publik.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative bg-slate-50/70 rounded-2xl p-5 border border-slate-200/70 hover:bg-white hover:border-[#2F4A3C]/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#2F4A3C]/10 text-[#2F4A3C]">
                    TAHAP {item.step}
                  </span>
                  <item.icon className="w-5 h-5 text-[#D9A400]" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#2F4A3C] mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wilayah 3 Desa Pelayanan */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#1F3328] to-[#2F4A3C] rounded-3xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D9A400]/10 blur-3xl rounded-full pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#D9A400]">
                Cakupan Wilayah Administrasi
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                3 Desa di Kecamatan Temiang Pesisir
              </h2>
              <p className="text-xs sm:text-sm text-white/70 max-w-xl leading-relaxed">
                Pelayanan aduan dan dokumen menjangkau seluruh kepulauan dan pesisir di Kabupaten Lingga.
              </p>
            </div>
            <Link href="/publik/peta">
              <button className="bg-[#D9A400] hover:bg-[#b88a00] text-[#1F3328] font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shrink-0">
                <Navigation className="w-4 h-4" /> Buka Peta Geografis
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            {/* Desa Tajur Biru */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-5 border border-white/15 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#D9A400] text-[#1F3328] px-2 py-0.5 rounded">
                  Ibu Kota Kecamatan
                </span>
                <Building2 className="w-4 h-4 text-[#D9A400]" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white">Desa Tajur Biru</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Pusat kantor kecamatan, posko pengaduan utama, dan pusat administrasi pemerintahan terpadu.
              </p>
            </div>

            {/* Desa Temiang */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-5 border border-white/15 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded">
                  Wilayah Pesisir
                </span>
                <MapPin className="w-4 h-4 text-white/70" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white">Desa Temiang</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Kawasan permukiman pesisir dan sentra nelayan dengan pos koordinasi pelayanan desa.
              </p>
            </div>

            {/* Desa Pulau Batang */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-5 border border-white/15 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded">
                  Wilayah Kepulauan
                </span>
                <MapPin className="w-4 h-4 text-white/70" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white">Desa Pulau Batang</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Wilayah kepulauan dengan dukungan pelaporan berbasis GPS dan pendataan warga berkala.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Berita & Pengumuman Terbaru */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200/80">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D9A400]">
              Kanal Publikasi
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2F4A3C]">
              Berita &amp; Informasi Resmi
            </h2>
          </div>
          <Link
            href="/publik/informasi"
            className="text-xs font-bold text-[#2F4A3C] hover:text-[#D9A400] flex items-center gap-1 transition-colors"
          >
            Lihat Semua Informasi <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews.map((info) => (
            <div
              key={info.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-[#2F4A3C]/30"
            >
              {info.gambar && (
                <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={info.gambar}
                    alt={info.judul}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-md border border-white/20">
                      {info.kategori}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-6 space-y-2.5 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {info.tanggal}
                  </span>
                  {!info.gambar && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#2F4A3C]/10 text-[#2F4A3C] px-2 py-0.5 rounded">
                      {info.kategori}
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-base sm:text-lg text-[#2F4A3C] group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug">
                  {info.judul}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mt-1">
                  {info.ringkasan}
                </p>
              </div>

              <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs mt-auto">
                <span className="text-slate-400 font-medium truncate max-w-[130px]">{info.penulis}</span>
                <Link
                  href={`/publik/informasi/${info.slug}`}
                  className="font-bold text-[#2F4A3C] group-hover:text-emerald-700 flex items-center gap-1 shrink-0"
                >
                  Baca Selengkapnya <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

