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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-kuning-muda p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teks/50">Laporan Diterima</span>
          <MessageSquare className="w-4 h-4 text-kuning" />
        </div>
        <p className="text-3xl font-serif font-bold text-hijau animate-in fade-in">{counts.total}</p>
      </div>

      <div className="bg-white rounded-xl border border-kuning-muda p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teks/50">Menunggu Verifikasi</span>
          <Clock className="w-4 h-4 text-orange-500" />
        </div>
        <p className="text-3xl font-serif font-bold text-orange-600 animate-in fade-in">{counts.menunggu}</p>
      </div>

      <div className="bg-white rounded-xl border border-kuning-muda p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teks/50">Sedang Diproses</span>
          <Clock className="w-4 h-4 text-blue-500" />
        </div>
        <p className="text-3xl font-serif font-bold text-blue-600 animate-in fade-in">{counts.proses}</p>
      </div>

      <div className="bg-white rounded-xl border border-kuning-muda p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teks/50">Laporan Selesai</span>
          <CheckCircle className="w-4 h-4 text-green-500" />
        </div>
        <p className="text-3xl font-serif font-bold text-green-600 animate-in fade-in">{counts.selesai}</p>
      </div>
    </div>
  )
}
