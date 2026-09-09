"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import { DESA_KOORDINAT, PETA_CENTER, PETA_ZOOM } from "@/lib/mock-data/desa"
import "leaflet/dist/leaflet.css"

// Fix default marker icon (Leaflet issue with webpack)
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

export type DesaMarker = {
  name: string
  count: number
  breakdown: Record<string, number>
}

export type GpsReport = {
  id: string
  tiket: string
  judul: string
  desa: string | null
  kategori: string | null
  status: string
  lat: number
  lng: number
}

export type RecentReport = {
  tiket: string
  judul: string
  desa: string | null
  kategori: string | null
  status: string
  tanggal_masuk: string
}

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

const STATUS_COLOR: Record<string, string> = {
  masuk:      "#ea580c",
  verifikasi: "#d97706",
  proses:     "#2563eb",
  selesai:    "#16a34a",
}

function getDominantKategori(breakdown: Record<string, number>): string {
  let max = 0
  let dominant = "lainnya"
  for (const [k, v] of Object.entries(breakdown)) {
    if (v > max) { max = v; dominant = k }
  }
  return dominant
}

function getClusterRadius(count: number): number {
  if (count === 0) return 8
  return Math.min(8 + count * 3, 40)
}

// Buat custom icon berbentuk lingkaran berwarna untuk GPS pin
function makeGpsIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:18px;height:18px;
      background:${color};
      border:2.5px solid white;
      border-radius:50%;
      box-shadow:0 1px 4px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -12],
  })
}

function FitBounds({ gpsReports, desaMarkers }: { gpsReports: GpsReport[]; desaMarkers: DesaMarker[] }) {
  const map = useMap()
  useEffect(() => {
    const points: [number, number][] = []

    // Tambah titik GPS report
    for (const r of gpsReports) {
      points.push([r.lat, r.lng])
    }

    // Tambah titik desa yang punya data
    for (const m of desaMarkers) {
      if (m.count > 0 && DESA_KOORDINAT[m.name]) {
        points.push(DESA_KOORDINAT[m.name])
      }
    }

    if (points.length === 0) return
    if (points.length === 1) {
      map.setView(points[0], 14)
    } else {
      const lats = points.map((p) => p[0])
      const lngs = points.map((p) => p[1])
      map.fitBounds(
        [[Math.min(...lats) - 0.005, Math.min(...lngs) - 0.005],
         [Math.max(...lats) + 0.005, Math.max(...lngs) + 0.005]],
        { padding: [40, 40] }
      )
    }
  }, [map, gpsReports, desaMarkers])
  return null
}

interface PetaMapProps {
  markers: DesaMarker[]
  gpsReports: GpsReport[]
  recentReports: RecentReport[]
}

export function PetaMap({ markers, gpsReports, recentReports }: PetaMapProps) {
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

      <FitBounds gpsReports={gpsReports} desaMarkers={markers} />

      {/* Pin GPS Individual — laporan dengan koordinat akurat */}
      {gpsReports.map((r) => {
        const color = KATEGORI_COLOR[r.kategori ?? "lainnya"] ?? "#64748b"
        const statusColor = STATUS_COLOR[r.status] ?? "#64748b"
        return (
          <Marker
            key={r.id}
            position={[r.lat, r.lng]}
            icon={makeGpsIcon(color)}
          >
            <Popup>
              <div className="min-w-[180px] text-xs font-sans space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-green-700 font-mono">{r.tiket}</span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded font-bold text-white"
                    style={{ background: statusColor }}
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
                <p className="text-[10px] text-green-600 flex items-center gap-1">
                  📍 Lokasi GPS akurat
                </p>
              </div>
            </Popup>
          </Marker>
        )
      })}

      {/* Cluster Desa — laporan tanpa GPS (fallback) */}
      {markers.map((m) => {
        // Hanya tampilkan cluster jika ada laporan tanpa GPS
        const gpsCountInDesa = gpsReports.filter((r) => r.desa === m.name).length
        const nonGpsCount = m.count - gpsCountInDesa
        if (nonGpsCount === 0 && m.count > 0) return null // semua sudah ada GPS

        const coords = DESA_KOORDINAT[m.name]
        if (!coords) return null

        const dominant = getDominantKategori(m.breakdown)
        const color = KATEGORI_COLOR[dominant] ?? "#64748b"
        const radius = getClusterRadius(nonGpsCount || m.count)

        return (
          <CircleMarker
            key={`desa-${m.name}`}
            center={coords}
            radius={radius}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: 0.35,
              weight: 2,
              dashArray: "5,4",
            }}
          >
            <Popup>
              <div className="min-w-[160px] text-xs font-sans">
                <p className="font-bold text-sm mb-1">Desa {m.name}</p>
                <p className="text-gray-500 mb-1">
                  {m.count === 0 ? "Belum ada laporan" : `${m.count} laporan total`}
                </p>
                {nonGpsCount > 0 && (
                  <p className="text-orange-600 text-[10px] mb-2">
                    {nonGpsCount} laporan belum ada GPS
                  </p>
                )}
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
