import { createServiceClient } from "@/lib/supabase/server"
import { DESA_LIST } from "@/lib/mock-data/desa"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Map, MapPin, Layers, Info } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function PetaPengaduanPage() {
  const supabase = await createServiceClient()
  const { data: pengaduanList } = await supabase
    .from("pengaduan")
    .select("*")
    .order("tanggal_masuk", { ascending: false })

  const data = pengaduanList || []
  const totalPins = data.length

  // Sebaran per desa
  const allDesas = Array.from(new Set([...DESA_LIST, ...data.map((d) => d.desa).filter(Boolean)]))
  const sebaranDesa = allDesas.map((desa) => ({
    name: desa,
    count: data.filter((d) => d.desa === desa).length,
  })).sort((a, b) => b.count - a.count)

  const recentReports = data.slice(0, 3)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <PageHeader
        title="Peta Permasalahan Kecamatan"
        subtitle="Visualisasi sebaran laporan warga di wilayah Temiang Pesisir"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map mockup */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-kuning-muda overflow-hidden shadow-sm relative">
            {/* Header map toolbar */}
            <div className="bg-krem px-4 py-3 border-b border-kuning-muda flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Peta Temiang Pesisir (Mockup)
              </span>
              <span className="bg-kuning-muda font-semibold px-2 py-0.5 rounded text-teks/80">
                {totalPins} Pin Laporan Aktif
              </span>
            </div>

            {/* Styled visual map grid placeholder */}
            <div className="h-96 w-full bg-slate-50 relative flex items-center justify-center p-8">
              {/* Decorative islands (map mockup) */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#d9a400_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="relative w-full h-full max-w-xl flex items-center justify-center">
                {/* Island 1 - Penuba */}
                <div className="absolute top-1/4 left-1/4 w-32 h-20 bg-hijau/20 rounded-full blur-[2px] transform rotate-12 flex items-center justify-center border border-hijau/40">
                  <span className="text-[10px] uppercase font-bold text-hijau/60 select-none">P. Penuba</span>
                </div>
                {/* Island 2 - Temiang */}
                <div className="absolute bottom-1/3 right-1/4 w-40 h-24 bg-hijau/20 rounded-full blur-[2px] transform -rotate-6 flex items-center justify-center border border-hijau/40">
                  <span className="text-[10px] uppercase font-bold text-hijau/60 select-none">P. Temiang</span>
                </div>

                {/* Map Pins */}
                <div className="absolute top-1/3 left-1/3 animate-bounce">
                  <MapPin className="w-6 h-6 text-red-600 drop-shadow-md" />
                </div>
                <div className="absolute bottom-1/2 right-1/3 animate-bounce delay-150">
                  <MapPin className="w-6 h-6 text-green-600 drop-shadow-md" />
                </div>
                <div className="absolute top-1/2 right-1/2 animate-bounce delay-300">
                  <MapPin className="w-6 h-6 text-purple-600 drop-shadow-md" />
                </div>
                <div className="absolute bottom-1/3 left-1/2 animate-bounce delay-75">
                  <MapPin className="w-6 h-6 text-orange-600 drop-shadow-md" />
                </div>
              </div>

              {/* Bottom Notice */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-kuning-muda shadow text-xs flex gap-2 items-center">
                <Info className="w-4 h-4 text-kuning shrink-0" />
                <p className="text-teks/70">
                  <strong>Catatan:</strong> Ini adalah visualisasi mockup peta. Peta interaktif berbasis GIS/Google Maps sedang dalam tahap pengerjaan.
                </p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-xl border border-kuning-muda p-4 flex flex-wrap gap-4 justify-center text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <span>Infrastruktur</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-600" />
              <span>Lingkungan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>Pelayanan Publik</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span>Bantuan Sosial</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <span>Keamanan</span>
            </div>
          </div>
        </div>

        {/* Side Panel stats */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-serif font-bold text-hijau text-sm">Sebaran per Desa</h3>
              <div className="space-y-2 text-xs">
                {sebaranDesa.slice(0, 6).map((d) => (
                  <div key={d.name} className="flex justify-between items-center pb-1.5 border-b border-gray-50">
                    <span className="text-teks/80">Desa {d.name}</span>
                    <span className="font-bold text-teks bg-krem px-2 py-0.5 rounded">{d.count} aduan</span>
                  </div>
                ))}
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
                                year: "numeric",
                              })
                            : "-"}
                        </span>
                      </div>
                      <p className="font-medium text-teks line-clamp-1">{p.judul}</p>
                      <p className="text-[10px] text-teks/50">Desa {p.desa || "-"}</p>
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
