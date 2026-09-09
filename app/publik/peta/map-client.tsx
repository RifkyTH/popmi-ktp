"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet"
import { DESA_KOORDINAT, PETA_CENTER, PETA_ZOOM } from "@/lib/mock-data/desa"
import "leaflet/dist/leaflet.css"

export type DesaMarker = {
  name: string
  count: number
  breakdown: Record<string, number>
}

export type RecentReport = {
  tiket: string
  judul: string
  desa: string | null
  kategori: string | null
  status: string
  tanggal_masuk: string
}

// Warna per kategori
const KATEGORI_COLOR: Record<string, string> = {
  infrastruktur: "#dc2626",
  lingkungan:    "#16a34a",
  pelayanan:     "#2563eb",
  sosial:        "#ea580c",
  keamanan:      "#9333ea",
  lainnya:       "#64748b",
}

const KATEGORI_LABEL: Record<string, string> = {
  infrastruktur: "Infrastruktur",
  lingkungan:    "Lingkungan",
  pelayanan:     "Pelayanan Publik",
  sosial:        "Bantuan Sosial",
  keamanan:      "Keamanan",
  lainnya:       "Lainnya",
}

function getDominantKategori(breakdown: Record<string, number>): string {
  let max = 0
  let dominant = "lainnya"
  for (const [k, v] of Object.entries(breakdown)) {
    if (v > max) { max = v; dominant = k }
  }
  return dominant
}

function getRadius(count: number): number {
  if (count === 0) return 8
  return Math.min(8 + count * 3, 40)
}

// Komponen untuk auto-fit bounds jika ada marker
function FitBoundsToMarkers({ markers }: { markers: DesaMarker[] }) {
  const map = useMap()
  useEffect(() => {
    const withCoords = markers.filter((m) => DESA_KOORDINAT[m.name])
    if (withCoords.length > 0) {
      const coords = withCoords.map((m) => DESA_KOORDINAT[m.name])
      if (coords.length === 1) {
        map.setView(coords[0], PETA_ZOOM)
      } else {
        const lats = coords.map((c) => c[0])
        const lngs = coords.map((c) => c[1])
        map.fitBounds([
          [Math.min(...lats) - 0.01, Math.min(...lngs) - 0.01],
          [Math.max(...lats) + 0.01, Math.max(...lngs) + 0.01],
        ], { padding: [40, 40] })
      }
    }
  }, [map, markers])
  return null
}

interface PetaMapProps {
  markers: DesaMarker[]
  recentReports: RecentReport[]
}

export function PetaMap({ markers, recentReports }: PetaMapProps) {
  return (
    <MapContainer
      center={PETA_CENTER}
      zoom={PETA_ZOOM}
      className="w-full h-full"
      style={{ minHeight: "420px" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBoundsToMarkers markers={markers} />

      {markers.map((m) => {
        const coords = DESA_KOORDINAT[m.name]
        if (!coords) return null

        const dominant = getDominantKategori(m.breakdown)
        const color = KATEGORI_COLOR[dominant] ?? "#64748b"
        const radius = getRadius(m.count)

        return (
          <CircleMarker
            key={m.name}
            center={coords}
            radius={radius}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: 0.55,
              weight: 2,
            }}
          >
            <Popup>
              <div className="min-w-[160px] text-xs font-sans">
                <p className="font-bold text-sm mb-1">Desa {m.name}</p>
                <p className="text-gray-600 mb-2">
                  {m.count === 0
                    ? "Belum ada laporan"
                    : `${m.count} laporan masuk`}
                </p>
                {m.count > 0 && (
                  <div className="space-y-1">
                    {Object.entries(m.breakdown)
                      .filter(([, v]) => v > 0)
                      .sort(([, a], [, b]) => b - a)
                      .map(([k, v]) => (
                        <div key={k} className="flex items-center gap-1.5">
                          <span
                            className="inline-block w-2 h-2 rounded-full shrink-0"
                            style={{ background: KATEGORI_COLOR[k] ?? "#64748b" }}
                          />
                          <span className="text-gray-700">
                            {KATEGORI_LABEL[k] ?? k}: <strong>{v}</strong>
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
