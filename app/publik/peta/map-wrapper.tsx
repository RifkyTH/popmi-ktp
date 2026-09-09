"use client"

import dynamic from "next/dynamic"
import type { DesaMarker, RecentReport } from "./map-client"

// Leaflet tidak support SSR, wajib pakai dynamic import dengan ssr: false
const PetaMap = dynamic(
  () => import("./map-client").then((m) => ({ default: m.PetaMap })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[420px] bg-slate-50 flex items-center justify-center rounded-b-2xl">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-hijau/30 border-t-hijau rounded-full animate-spin mx-auto" />
          <p className="text-xs text-teks/50">Memuat peta...</p>
        </div>
      </div>
    ),
  }
)

export function PetaMapWrapper({
  markers,
  recentReports,
}: {
  markers: DesaMarker[]
  recentReports: RecentReport[]
}) {
  return <PetaMap markers={markers} recentReports={recentReports} />
}
