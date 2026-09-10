"use client"

import { useState } from "react"
import { INFORMASI_DATA } from "@/lib/mock-data/informasi"
import { Calendar, User, ChevronRight, Newspaper, Bell, Sparkles } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const TABS: { key: string; label: string }[] = [
  { key: "semua", label: "Semua Informasi" },
  { key: "pengumuman", label: "Pengumuman" },
  { key: "berita", label: "Berita" },
  { key: "program", label: "Program Pemerintah" },
  { key: "jadwal", label: "Jadwal Pelayanan" },
  { key: "kesehatan", label: "Kesehatan" },
  { key: "pendidikan", label: "Pendidikan" },
]

export default function InformasiPage() {
  const [activeTab, setActiveTab] = useState("semua")

  const filteredData = activeTab === "semua"
    ? INFORMASI_DATA
    : INFORMASI_DATA.filter((i) => i.kategori === activeTab)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D9A400]/40 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9A400]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F4A3C]">
              Publikasi &amp; Komunikasi Publik
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F4A3C]">
            Pusat Informasi &amp; Pengumuman
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
            Berita resmi, maklumat pelayanan, dan agenda kegiatan pemerintahan Kecamatan Temiang Pesisir, Kabupaten Lingga.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-500 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs shrink-0 flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-[#D9A400]" />
          <span>{filteredData.length} Artikel Ditampilkan</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const count = tab.key === "semua"
            ? INFORMASI_DATA.length
            : INFORMASI_DATA.filter((i) => i.kategori === tab.key).length

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2",
                activeTab === tab.key
                  ? "bg-[#2F4A3C] text-white border-[#2F4A3C] shadow-xs"
                  : "bg-white text-slate-600 border-slate-200 hover:border-[#2F4A3C]/40 hover:bg-slate-50"
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.2 rounded-full font-mono",
                  activeTab === tab.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Grid */}
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-[#2F4A3C]/40"
            >
              <div className="p-6 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#2F4A3C]/10 text-[#2F4A3C] px-2.5 py-0.5 rounded-full">
                    {item.kategori}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.tanggal}
                  </span>
                </div>

                <h2 className="font-serif font-bold text-lg text-[#2F4A3C] group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug">
                  {item.judul}
                </h2>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {item.ringkasan}
                </p>
              </div>

              <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                  <User className="w-3 h-3" />
                  <span className="truncate max-w-[120px]">{item.penulis}</span>
                </div>
                <Link
                  href={`/publik/informasi/${item.slug}`}
                  className="font-bold text-[#2F4A3C] group-hover:text-emerald-700 flex items-center gap-1 transition-colors"
                >
                  Baca Pengumuman <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center text-slate-400 space-y-2">
          <Newspaper className="w-8 h-8 mx-auto text-slate-300" />
          <p className="font-serif font-bold text-slate-700 text-sm">Belum Ada Informasi di Kategori Ini</p>
          <p className="text-xs text-slate-400">Silakan pilih kategori lain atau periksa tab &ldquo;Semua Informasi&rdquo;</p>
        </div>
      )}
    </div>
  )
}

