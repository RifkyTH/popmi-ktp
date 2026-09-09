"use client"

import { useState } from "react"
import { STATUS_PENGADUAN_LABELS, KATEGORI_LABELS, StatusPengaduan, KategoriPengaduan } from "@/lib/mock-data/pengaduan"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Calendar, FileText, ChevronRight } from "lucide-react"
import Link from "next/link"
import { cariPengaduan } from "../actions"

type SearchResult = {
  id: string
  tiket: string
  judul: string
  kategori: KategoriPengaduan
  status: StatusPengaduan
  desa: string
  tanggal_masuk: string
}

export default function CekPengaduanPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[] | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)

    try {
      const data = await cariPengaduan(query)
      setResults(data)
    } catch (error) {
      console.error(error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <PageHeader
        title="Lacak Laporan Pengaduan"
        subtitle="Masukkan nomor tiket laporan atau nomor HP Anda untuk melacak progress"
      />

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teks/40" />
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nomor Tiket (Contoh: TP-2026-00121) atau No HP..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kuning"
          />
        </div>
        <Button type="submit" className="px-6">
          Cari Laporan
        </Button>
      </form>

      {results !== null && (
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-hijau text-lg">Hasil Pencarian ({results.length})</h3>

          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-sm text-hijau">{item.tiket}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-kuning-muda text-teks/80">
                          {KATEGORI_LABELS[item.kategori as KategoriPengaduan]}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
                            item.status === "selesai"
                              ? "bg-green-100 text-green-800"
                              : item.status === "proses"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {STATUS_PENGADUAN_LABELS[item.status as StatusPengaduan]}
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-teks">{item.judul}</h4>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-teks/50">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Desa {item.desa}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(item.tanggal_masuk).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <Link href={`/publik/pengaduan/${item.tiket}`}>
                        <Button variant="outline" className="text-xs font-bold gap-1 group">
                          Detail Laporan <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-kuning-muda p-8 text-center text-teks/50 space-y-2">
              <FileText className="w-8 h-8 mx-auto text-teks/30" />
              <p className="font-semibold text-sm">Laporan tidak ditemukan</p>
              <p className="text-xs max-w-sm mx-auto">
                Silakan periksa kembali nomor tiket yang dimasukkan, atau hubungi pusat bantuan kami jika Anda menemui kendala.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
