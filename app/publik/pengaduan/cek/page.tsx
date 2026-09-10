"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { STATUS_PENGADUAN_LABELS, KATEGORI_LABELS, StatusPengaduan, KategoriPengaduan } from "@/lib/mock-data/pengaduan"
import { Search, MapPin, Calendar, FileText, ChevronRight, Loader2, ShieldAlert, Sparkles } from "lucide-react"
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

function CekPengaduanContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[] | null>(null)
  const [loading, setLoading] = useState(false)

  // Auto-search if q param is provided in URL
  useEffect(() => {
    if (initialQuery.trim()) {
      setQuery(initialQuery)
      executeSearch(initialQuery)
    }
  }, [initialQuery])

  async function executeSearch(searchTerm: string) {
    if (!searchTerm.trim()) return
    setLoading(true)
    try {
      const data = await cariPengaduan(searchTerm.trim())
      setResults(data)
    } catch (error) {
      console.error(error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    executeSearch(query)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D9A400]/40 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D9A400]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F4A3C]">
            Layanan Pelacakan Status Transparan
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F4A3C]">
          Lacak Laporan Pengaduan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Masukkan nomor tiket laporan atau nomor HP Anda yang terdaftar saat mengirim aduan.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nomor Tiket (Contoh: TP-2026-00121) atau No HP..."
            className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-transparent border-0 focus:outline-none text-slate-800 placeholder:text-slate-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#2F4A3C] hover:bg-[#23382D] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 shrink-0 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#D9A400]" />
              Mencari...
            </>
          ) : (
            "Cari Laporan"
          )}
        </button>
      </form>

      {/* Results Section */}
      {results !== null && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-serif font-bold text-[#2F4A3C] text-lg">
              Hasil Pencarian ({results.length})
            </h2>
            <span className="text-xs text-slate-400">
              Kata kunci: <span className="font-mono font-bold text-slate-600">&ldquo;{query}&rdquo;</span>
            </span>
          </div>

          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map((item) => {
                const isSelesai = item.status === "selesai"
                const isProses = item.status === "proses"

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all hover:border-[#2F4A3C]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-xs sm:text-sm px-2.5 py-1 rounded-md bg-[#2F4A3C]/10 text-[#2F4A3C]">
                          {item.tiket}
                        </span>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700">
                          {KATEGORI_LABELS[item.kategori as KategoriPengaduan]}
                        </span>
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            isSelesai
                              ? "bg-emerald-100 text-emerald-800"
                              : isProses
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {STATUS_PENGADUAN_LABELS[item.status as StatusPengaduan]}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-[#2F4A3C] group-hover:text-emerald-800 transition-colors">
                        {item.judul}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#D9A400]" /> Desa {item.desa}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(item.tanggal_masuk).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 pt-2 sm:pt-0">
                      <Link href={`/publik/pengaduan/${item.tiket}`}>
                        <button className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#2F4A3C] bg-slate-50 hover:bg-[#2F4A3C] hover:text-white border border-slate-200 px-4 py-2.5 rounded-xl transition-all shadow-2xs">
                          Pantau Detail
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-slate-700">
                Laporan Tidak Ditemukan
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Nomor tiket atau nomor HP yang Anda masukkan tidak cocok dengan data laporan yang tercatat. Pastikan penulisan sesuai format resmi (contoh: <span className="font-mono font-bold text-slate-700">TP-2026-00121</span>).
              </p>
              <div className="pt-2">
                <Link href="/publik/pengaduan/buat">
                  <button className="text-xs font-bold text-[#2F4A3C] hover:text-[#D9A400] underline">
                    Belum mengirim laporan? Buat pengaduan baru di sini
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function CekPengaduanPage() {
  return (
    <Suspense fallback={
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#D9A400]" />
        <p className="text-xs">Memuat modul pencarian tiket...</p>
      </div>
    }>
      <CekPengaduanContent />
    </Suspense>
  )
}

