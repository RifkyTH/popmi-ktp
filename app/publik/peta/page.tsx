import { createServiceClient } from "@/lib/supabase/server"
import { DESA_LIST, DESA_KOORDINAT } from "@/lib/mock-data/desa"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Layers } from "lucide-react"
import { PetaMapWrapper } from "./map-wrapper"
import type { PinReport, DesaMarker } from "./map-client"

export const dynamic = "force-dynamic"
export const revalidate = 0

const KATEGORI_LABEL: Record<string, string> = {
  infrastruktur: "Infrastruktur",
  lingkungan:    "Lingkungan",
  pelayanan:     "Pelayanan Publik",
  sosial:        "Bantuan Sosial",
  keamanan:      "Keamanan",
  lainnya:       "Lainnya",
}

const KATEGORI_DOT: Record<string, string> = {
  infrastruktur: "bg-red-600",
  lingkungan:    "bg-green-600",
  pelayanan:     "bg-blue-600",
  sosial:        "bg-orange-500",
  keamanan:      "bg-purple-600",
  lainnya:       "bg-slate-500",
}

/**
 * Jitter deterministik berdasarkan string seed (tiket).
 * Menghasilkan offset lat/lng konsisten — tidak berubah setiap render.
 * Range ±0.0025 derajat ≈ ±270 meter — cukup jauh agar tidak tumpuk.
 */
function deterministicJitter(seed: string, range = 0.0025): [number, number] {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57
  for (let i = 0; i < seed.length; i++) {
    const c = seed.charCodeAt(i)
    h1 = Math.imul(h1 ^ c, 2246822519)
    h2 = Math.imul(h2 ^ c, 3266489917)
  }
  h1 = (Math.imul(h1 ^ (h1 >>> 17), 2246822519) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489917)) >>> 0
  h2 = (Math.imul(h2 ^ (h2 >>> 16), 2246822519) ^ Math.imul(h1 ^ (h1 >>> 15), 3266489917)) >>> 0
  const latOff = ((h1 / 0xFFFFFFFF) - 0.5) * range * 2
  const lngOff = ((h2 / 0xFFFFFFFF) - 0.5) * range * 2
  return [latOff, lngOff]
}

export default async function PetaPengaduanPage() {
  const supabase = await createServiceClient()
  const { data: pengaduanList } = await supabase
    .from("pengaduan")
    .select("id, tiket, judul, desa, kategori, status, tanggal_masuk, lat, lng")
    .order("tanggal_masuk", { ascending: false })

  const data = pengaduanList || []
  const totalPins = data.length

  // Buat pin untuk setiap laporan
  const pinReports: PinReport[] = data
    .map((d) => {
      if (d.lat != null && d.lng != null) {
        // ✅ Punya GPS akurat
        return {
          id: d.id,
          tiket: d.tiket,
          judul: d.judul,
          desa: d.desa,
          kategori: d.kategori,
          status: d.status,
          lat: d.lat as number,
          lng: d.lng as number,
          isGps: true,
        } as PinReport
      } else if (d.desa && DESA_KOORDINAT[d.desa]) {
        // 📍 Pakai koordinat desa + jitter agar tidak tumpuk
        const [baseLat, baseLng] = DESA_KOORDINAT[d.desa]
        const [jLat, jLng] = deterministicJitter(d.tiket ?? d.id)
        return {
          id: d.id,
          tiket: d.tiket,
          judul: d.judul,
          desa: d.desa,
          kategori: d.kategori,
          status: d.status,
          lat: baseLat + jLat,
          lng: baseLng + jLng,
          isGps: false,
        } as PinReport
      }
      return null
    })
    .filter(Boolean) as PinReport[]

  // Sebaran per desa untuk side panel
  const allDesas = Array.from(new Set([...DESA_LIST, ...data.map((d) => d.desa).filter(Boolean)]))
  const desaMarkers: DesaMarker[] = allDesas.map((desa) => {
    const desaReports = data.filter((d) => d.desa === desa)
    const breakdown: Record<string, number> = {}
    for (const r of desaReports) {
      const kat = r.kategori || "lainnya"
      breakdown[kat] = (breakdown[kat] || 0) + 1
    }
    return { name: desa, count: desaReports.length, breakdown }
  }).sort((a, b) => b.count - a.count)

  const recentReports = data.slice(0, 5)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D9A400]/40 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9A400]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F4A3C]">
              Sistem Pemetaan Geospasial
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F4A3C]">
            Peta Sebaran Permasalahan Wilayah
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
            Visualisasi titik lokasi permasalahan masyarakat di seluruh pulau dan pesisir Kecamatan Temiang Pesisir.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#2F4A3C] bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs">
            {totalPins} Titik Laporan
          </span>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl shadow-2xs">
            {pinReports.filter((p) => p.isGps).length} GPS Akurat
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Peta Interaktif (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
            {/* Toolbar */}
            <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-[#2F4A3C] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#D9A400]" /> Peta Geografis Temiang Pesisir
              </span>
              <span className="text-[11px] text-slate-400">
                Kabupaten Lingga, Kepulauan Riau
              </span>
            </div>

            {/* Map Canvas */}
            <div className="h-[460px] w-full">
              <PetaMapWrapper pinReports={pinReports} desaMarkers={desaMarkers} recentReports={recentReports} />
            </div>
          </div>

          {/* Legenda Kategori */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-2.5 text-xs shadow-2xs">
            <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center">
              {Object.entries(KATEGORI_LABEL).map(([key, label]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${KATEGORI_DOT[key]} ring-2 ring-white shadow-xs`} />
                  <span className="text-slate-600 font-medium">{label}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 justify-center text-[10px] text-slate-400 border-t border-slate-100 pt-2">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-600 ring-2 ring-white shadow-xs" />
                <span>Pin Solid: Lokasi GPS terdeteksi otomatis dari perangkat</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full border border-slate-400 bg-slate-100" />
                <span>Pin Estimasi: Koordinat estimasi sentra desa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel (1 Col) */}
        <div className="space-y-4">
          {/* Desa Summary */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 space-y-4 shadow-xs">
            <h2 className="font-serif font-bold text-[#2F4A3C] text-sm pb-2 border-b border-slate-100">
              Sebaran per Wilayah Desa
            </h2>
            <div className="space-y-2.5 text-xs">
              {desaMarkers.map((d) => (
                <div key={d.name} className="flex justify-between items-center pb-2 border-b border-slate-50 last:border-0">
                  <div>
                    <span className="font-semibold text-slate-700 block">
                      Desa {d.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {d.name === "Tajur Biru" ? "Ibu Kota Kecamatan" : "Wilayah Desa"}
                    </span>
                  </div>
                  <span className="font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-[#2F4A3C]">
                    {d.count} aduan
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reports Mini Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 space-y-4 shadow-xs">
            <h2 className="font-serif font-bold text-[#2F4A3C] text-sm pb-2 border-b border-slate-100">
              Aduan Terbaru di Peta
            </h2>
            <div className="space-y-3">
              {recentReports.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Belum ada data laporan</p>
              ) : (
                recentReports.map((p) => (
                  <div key={p.id} className="text-xs space-y-1 pb-2 border-b border-slate-50 last:border-0">
                    <div className="flex justify-between items-center font-semibold">
                      <span className="font-mono text-[#2F4A3C] text-[11px]">{p.tiket}</span>
                      <span className="text-slate-400 text-[10px]">
                        {p.tanggal_masuk
                          ? new Date(p.tanggal_masuk).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                            })
                          : "-"}
                      </span>
                    </div>
                    <p className="font-medium text-slate-700 line-clamp-1">{p.judul}</p>
                    <p className="text-[10px] text-slate-400">
                      Desa {p.desa || "-"}
                      {p.kategori && (
                        <span className="ml-1 text-slate-400">· {KATEGORI_LABEL[p.kategori] ?? p.kategori}</span>
                      )}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

