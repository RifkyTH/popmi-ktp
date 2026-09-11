"use client"

import { useState } from "react"
import {
  Informasi,
  KategoriInfo,
  KATEGORI_LABELS,
} from "@/lib/mock-data/informasi"
import {
  Calendar,
  User,
  ChevronRight,
  Newspaper,
  Bell,
  Clock,
  ArrowRight,
  Image as ImageIcon,
  Star,
  Search,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { HeroSlideShow } from "@/components/publik/hero-slideshow"

const TABS: { key: string; label: string }[] = [
  { key: "semua", label: "Semua Informasi" },
  { key: "pengumuman", label: "Pengumuman" },
  { key: "berita", label: "Berita" },
  { key: "program", label: "Program Pemerintah" },
  { key: "jadwal", label: "Jadwal Pelayanan" },
  { key: "kesehatan", label: "Kesehatan" },
  { key: "pendidikan", label: "Pendidikan" },
]

export function InformasiListClient({
  initialData,
}: {
  initialData: Informasi[]
}) {
  const [activeTab, setActiveTab] = useState("semua")
  const [searchQuery, setSearchQuery] = useState("")

  // Top Headline Slides for the spotlight slider
  const headlineSlides = initialData.filter((item) => item.is_headline && item.gambar)
  const slidesToShow = headlineSlides.length > 0 ? headlineSlides : initialData.filter((i) => i.gambar).slice(0, 3)

  // Filtered by active tab and search query
  const filteredData = initialData.filter((item) => {
    const matchesTab = activeTab === "semua" || item.kategori === activeTab
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ringkasan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.penulis.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D9A400]/40 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9A400]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F4A3C]">
              Publikasi &amp; Komunikasi Resmi Warga
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F4A3C]">
            Pusat Informasi &amp; Pengumuman
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
            Berita resmi, maklumat pelayanan, dan agenda kegiatan pemerintahan Kecamatan Temiang Pesisir, Kabupaten Lingga.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs shrink-0 flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-[#D9A400]" />
          <span>{filteredData.length} Artikel Ditampilkan</span>
        </div>
      </div>

      {/* Featured Headline Photo Slide Show (Spotlight) */}
      {slidesToShow.length > 0 && activeTab === "semua" && searchQuery === "" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-[#D9A400] text-[#D9A400]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#2F4A3C]">
              Sorotan Kegiatan Utama
            </span>
          </div>
          <HeroSlideShow items={slidesToShow} />
        </div>
      )}

      {/* Filter Tabs & Quick Search */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => {
              const count =
                tab.key === "semua"
                  ? initialData.length
                  : initialData.filter((i) => i.kategori === tab.key).length

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 cursor-pointer",
                    activeTab === tab.key
                      ? "bg-[#2F4A3C] text-white border-[#2F4A3C] shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:border-[#2F4A3C]/40 hover:bg-slate-50"
                  )}
                >
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded-full font-mono",
                      activeTab === tab.key
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#2F4A3C] bg-white"
            />
          </div>
        </div>
      </div>

      {/* Grid of Articles with Photos */}
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-[#2F4A3C]/40"
            >
              {/* Photo Cover */}
              {item.gambar ? (
                <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={item.gambar}
                    alt={item.judul}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-md border border-white/20">
                      {KATEGORI_LABELS[item.kategori] || item.kategori}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-28 w-full bg-gradient-to-r from-slate-100 to-slate-200 flex items-center justify-center text-slate-300 relative">
                  <ImageIcon className="w-8 h-8 opacity-40" />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#2F4A3C]/10 text-[#2F4A3C] px-2.5 py-1 rounded-md border border-[#2F4A3C]/20">
                      {KATEGORI_LABELS[item.kategori] || item.kategori}
                    </span>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6 space-y-3 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {item.tanggal}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <User className="w-3 h-3 text-slate-400" />
                    <span className="truncate max-w-[110px]">{item.penulis}</span>
                  </span>
                </div>

                <Link href={`/publik/informasi/${item.slug}`}>
                  <h2 className="font-serif font-bold text-base sm:text-lg text-[#2F4A3C] group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug">
                    {item.judul}
                  </h2>
                </Link>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mt-1">
                  {item.ringkasan}
                </p>
              </div>

              {/* Footer / Read Link */}
              <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs mt-auto">
                <span className="text-[11px] text-slate-400 font-medium">Dokumentasi Resmi</span>
                <Link
                  href={`/publik/informasi/${item.slug}`}
                  className="font-bold text-[#2F4A3C] group-hover:text-emerald-700 flex items-center gap-1 transition-colors"
                >
                  <span>Baca Selengkapnya</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center text-slate-400 space-y-3">
          <Newspaper className="w-8 h-8 mx-auto text-slate-300" />
          <p className="font-serif font-bold text-slate-700 text-sm">
            Tidak Ada Informasi Ditemukan
          </p>
          <p className="text-xs text-slate-400">
            {searchQuery
              ? `Tidak ada artikel dengan kata kunci "${searchQuery}".`
              : "Belum ada artikel yang dipublikasikan di kategori ini."}
          </p>
          <button
            onClick={() => {
              setActiveTab("semua")
              setSearchQuery("")
            }}
            className="text-xs font-bold text-[#2F4A3C] hover:underline"
          >
            Tampilkan Semua Informasi
          </button>
        </div>
      )}
    </div>
  )
}
