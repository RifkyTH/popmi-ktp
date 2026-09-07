"use client"

import { useState } from "react"
import { INFORMASI_DATA, KategoriInfo } from "@/lib/mock-data/informasi"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, User, ChevronRight } from "lucide-react"
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <PageHeader
        title="Pusat Informasi Kecamatan"
        subtitle="Berita resmi, pengumuman, program pemerintah, dan jadwal pelayanan terpadu"
      />

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-kuning-muda pb-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors border",
              activeTab === tab.key
                ? "bg-hijau text-white border-hijau"
                : "bg-white text-teks/70 border-kuning-muda hover:bg-krem hover:text-hijau"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-kuning-muda text-teks/80 px-2 py-0.5 rounded border border-kuning/20 w-fit block">
                    {item.kategori}
                  </span>
                  <h3 className="font-bold text-base text-teks font-serif line-clamp-2 leading-snug">
                    {item.judul}
                  </h3>
                  <p className="text-xs text-teks/60 line-clamp-3 leading-relaxed">
                    {item.ringkasan}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-[10px] text-teks/50">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {item.tanggal}
                  </span>
                  <Link
                    href={`/publik/informasi/${item.slug}`}
                    className="font-bold text-hijau hover:underline flex items-center gap-0.5 group"
                  >
                    Selengkapnya <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-teks/50">
          Belum ada informasi dalam kategori ini.
        </div>
      )}
    </div>
  )
}
