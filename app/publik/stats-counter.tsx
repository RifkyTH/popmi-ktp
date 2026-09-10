"use client"

import { useEffect, useState } from "react"
import { MessageSquare, Clock, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export interface StatsCounts {
  total: number
  menunggu: number
  proses: number
  selesai: number
}

export function StatsCounter({ initialCounts }: { initialCounts: StatsCounts }) {
  const [counts, setCounts] = useState<StatsCounts>(initialCounts)

  useEffect(() => {
    // Keep initialCounts synced if parent re-renders
    setCounts(initialCounts)
  }, [initialCounts])

  useEffect(() => {
    const supabase = createClient()

    async function fetchCounts() {
      try {
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

        setCounts({
          total: total ?? 0,
          menunggu: menunggu ?? 0,
          proses: proses ?? 0,
          selesai: selesai ?? 0,
        })
      } catch (err) {
        console.error("Error fetching live stats:", err)
      }
    }

    // Subscribe to realtime database changes on 'pengaduan'
    const channel = supabase
      .channel("realtime-pengaduan-stats")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pengaduan" },
        () => {
          fetchCounts()
        }
      )
      .subscribe()

    // Poll every 5 seconds for instant guarantee
    const interval = setInterval(fetchCounts, 5000)

    // Also refetch when tab is active
    const handleFocus = () => fetchCounts()
    window.addEventListener("focus", handleFocus)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
      window.removeEventListener("focus", handleFocus)
    }
  }, [])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Statistik Terhubung Langsung (Real-Time Live Sync)
          </span>
        </div>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Kecamatan Temiang Pesisir
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Laporan */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all hover:border-[#2F4A3C]/40 group relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#2F4A3C]" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Laporan
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#2F4A3C]/10 flex items-center justify-center text-[#2F4A3C] group-hover:scale-105 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-[#2F4A3C] tracking-tight">
            {counts.total}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Aduan teregistrasi</span>
        </div>

        {/* Menunggu Verifikasi */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all hover:border-amber-400/50 group relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Menunggu
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-600 tracking-tight">
            {counts.menunggu}
          </p>
          <span className="text-[11px] text-amber-600/70 mt-1 block">Validasi & telaah awal</span>
        </div>

        {/* Sedang Diproses */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all hover:border-blue-400/50 group relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Diproses
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-blue-700 tracking-tight">
            {counts.proses}
          </p>
          <span className="text-[11px] text-blue-600/70 mt-1 block">Penanganan di lapangan</span>
        </div>

        {/* Laporan Selesai */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all hover:border-emerald-400/50 group relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Tuntas / Selesai
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-emerald-700 tracking-tight">
            {counts.selesai}
          </p>
          <span className="text-[11px] text-emerald-600/70 mt-1 block">Tindak lanjut rampung</span>
        </div>
      </div>
    </div>
  )
}
