"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import { PETA_CENTER, PETA_ZOOM } from "@/lib/mock-data/desa"
import "leaflet/dist/leaflet.css"

// Fix default Leaflet icon dengan webpack
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

export type PinReport = {
  id: string
  tiket: string
  judul: string
  desa: string | null
  kategori: string | null
  status: string
  lat: number
  lng: number
  isGps: boolean
}

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

// Tetap diexport agar tidak breaking import lama
export type GpsReport = PinReport

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

const STATUS_LABEL: Record<string, string> = {
  masuk:      "Masuk",
  verifikasi: "Verifikasi",
  proses:     "Diproses",
  selesai:    "Selesai",
}

const STATUS_BG: Record<string, string> = {
  masuk:      "#ea580c",
  verifikasi: "#d97706",
  proses:     "#2563eb",
  selesai:    "#16a34a",
}

/** Custom circular div icon — solid = GPS akurat, transparan = estimasi desa */
function makePinIcon(color: string, isGps: boolean) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 16px;
      height: 16px;
      background: ${isGps ? color : "transparent"};
      border: 2.5px solid ${color};
      border-radius: 50%;
      box-shadow: 0 1px 5px rgba(0,0,0,0.35);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -12],
  })
}

function FitBounds({ pins }: { pins: PinReport[] }) {
  const map = useMap()
  useEffect(() => {
    if (pins.length === 0) return
    if (pins.length === 1) {
      map.setView([pins[0].lat, pins[0].lng], 14)
      return
    }
    const lats = pins.map((p) => p.lat)
    const lngs = pins.map((p) => p.lng)
    map.fitBounds(
      [[Math.min(...lats) - 0.003, Math.min(...lngs) - 0.003],
       [Math.max(...lats) + 0.003, Math.max(...lngs) + 0.003]],
      { padding: [50, 50] }
    )
  }, [map, pins])
  return null
}

interface PetaMapProps {
  pinReports: PinReport[]
  desaMarkers: DesaMarker[]
  recentReports: RecentReport[]
}

export function PetaMap({ pinReports, desaMarkers, recentReports }: PetaMapProps) {
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

      <FitBounds pins={pinReports} />

      {pinReports.map((r) => {
        const color = KATEGORI_COLOR[r.kategori ?? "lainnya"] ?? "#64748b"
        const statusBg = STATUS_BG[r.status] ?? "#64748b"

        return (
          <Marker
            key={r.id}
            position={[r.lat, r.lng]}
            icon={makePinIcon(color, r.isGps)}
          >
            <Popup>
              <div className="min-w-[180px] text-xs font-sans space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-hijau font-mono">{r.tiket}</span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded font-bold text-white shrink-0"
                    style={{ background: statusBg }}
                  >
                    {STATUS_LABEL[r.status] ?? r.status}
                  </span>
                </div>
                <p className="font-semibold text-gray-800 leading-snug">{r.judul}</p>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <span
                    className="inline-block w-2 h-2 rounded-full shrink-0"
                    style={{ background: color }}
                  />
                  <span>{KATEGORI_LABEL[r.kategori ?? "lainnya"] ?? r.kategori}</span>
                  {r.desa && <span className="text-gray-400">· Desa {r.desa}</span>}
                </div>
                <p className={`text-[10px] ${r.isGps ? "text-green-600" : "text-orange-500"}`}>
                  {r.isGps ? "📍 Lokasi GPS akurat" : "📌 Estimasi dari desa pilihan"}
                </p>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
