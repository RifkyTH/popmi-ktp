import { createServiceClient } from "@/lib/supabase/server"
import { DESA_LIST, DESA_KOORDINAT } from "@/lib/mock-data/desa"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Layers } from "lucide-react"
import { PetaMapWrapper } from "./map-wrapper"
import type { DesaMarker } from "./map-client"

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

export default async function PetaPengaduanPage() {
  const supabase = await createServiceClient()
  const { data: pengaduanList } = await supabase
    .from("pengaduan")
    .select("id, tiket, judul, desa, kategori, status, tanggal_masuk")
    .order("tanggal_masuk", { ascending: false })

  const data = pengaduanList || []
  const totalPins = data.length

  // Gabungkan desa dari DB + DESA_LIST
  const allDesas = Array.from(new Set([...DESA_LIST, ...data.map((d) => d.desa).filter(Boolean)]))

  // Hitung sebaran per desa + breakdown kategori
  const markers: DesaMarker[] = allDesas.map((desa) => {
    const desaReports = data.filter((d) => d.desa === desa)
    const breakdown: Record<string, number> = {}
    for (const r of desaReports) {
      const kat = r.kategori || "lainnya"
      breakdown[kat] = (breakdown[kat] || 0) + 1
    }
    return { name: desa, count: desaReports.length, breakdown }
  }).sort((a, b) => b.count - a.count)

  const sebaranDesa = [...markers].sort((a, b) => b.count - a.count)
  const recentReports = data.slice(0, 5)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <PageHeader
        title="Peta Permasalahan Kecamatan"
        subtitle="Visualisasi sebaran laporan warga di wilayah Temiang Pesisir"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Peta Interaktif */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-kuning-muda overflow-hidden shadow-sm">
            {/* Toolbar */}
            <div className="bg-krem px-4 py-3 border-b border-kuning-muda flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Peta Interaktif Temiang Pesisir
              </span>
              <span className="bg-kuning-muda font-semibold px-2 py-0.5 rounded text-teks/80">
                {totalPins} Laporan Aktif
              </span>
            </div>

            {/* Map */}
            <div className="h-[420px] w-full">
              <PetaMapWrapper markers={markers} recentReports={recentReports} />
            </div>
          </div>

          {/* Legenda */}
          <div className="bg-white rounded-xl border border-kuning-muda p-4 flex flex-wrap gap-x-5 gap-y-2 justify-center text-xs">
            {Object.entries(KATEGORI_LABEL).map(([key, label]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${KATEGORI_DOT[key]}`} />
                <span>{label}</span>
              </div>
            ))}
            <div className="w-full text-center text-[10px] text-teks/40 pt-1">
              Ukuran lingkaran proporsional terhadap jumlah laporan. Klik marker untuk detail.
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-serif font-bold text-hijau text-sm">Sebaran per Desa</h3>
              <div className="space-y-2 text-xs">
                {sebaranDesa.map((d) => {
                  const hasCoords = !!DESA_KOORDINAT[d.name]
                  return (
                    <div key={d.name} className="flex justify-between items-center pb-1.5 border-b border-gray-50 last:border-0">
                      <span className={`${hasCoords ? "text-teks/80" : "text-teks/40 italic"}`}>
                        Desa {d.name}
                      </span>
                      <span className={`font-bold px-2 py-0.5 rounded ${d.count > 0 ? "text-teks bg-krem" : "text-teks/30 bg-gray-50"}`}>
                        {d.count} aduan
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-serif font-bold text-hijau text-sm">Laporan Terbaru</h3>
              <div className="space-y-3">
                {recentReports.length === 0 ? (
                  <p className="text-xs text-teks/50 italic">Belum ada laporan</p>
                ) : (
                  recentReports.map((p) => (
                    <div key={p.id} className="text-xs space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span className="text-hijau">{p.tiket}</span>
                        <span className="text-teks/50">
                          {p.tanggal_masuk
                            ? new Date(p.tanggal_masuk).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                              })
                            : "-"}
                        </span>
                      </div>
                      <p className="font-medium text-teks line-clamp-1">{p.judul}</p>
                      <p className="text-[10px] text-teks/50">
                        Desa {p.desa || "-"}
                        {p.kategori && (
                          <span className="ml-1.5 text-teks/30">· {KATEGORI_LABEL[p.kategori] ?? p.kategori}</span>
                        )}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
