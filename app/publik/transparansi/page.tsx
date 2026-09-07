import { PENGADUAN_DATA, STATUS_PENGADUAN_LABELS, KATEGORI_LABELS } from "@/lib/mock-data/pengaduan"
import { DESA_LIST } from "@/lib/mock-data/desa"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function TransparansiPage() {
  const total = PENGADUAN_DATA.length
  const selesai = PENGADUAN_DATA.filter((p) => p.status === "selesai").length
  const proses = PENGADUAN_DATA.filter((p) => p.status === "proses" || p.status === "verifikasi").length
  const masuk = PENGADUAN_DATA.filter((p) => p.status === "masuk").length

  // Calculate stats by Category
  const categoryStats = Object.keys(KATEGORI_LABELS).map((key) => {
    const count = PENGADUAN_DATA.filter((p) => p.kategori === key).length
    return {
      kategori: KATEGORI_LABELS[key as keyof typeof KATEGORI_LABELS],
      jumlah: count,
      persentase: total > 0 ? Math.round((count / total) * 100) : 0,
    }
  })

  // Calculate stats by Desa
  const desaStats = DESA_LIST.map((desa) => {
    const count = PENGADUAN_DATA.filter((p) => p.desa === desa).length
    return {
      desa,
      jumlah: count,
    }
  }).sort((a, b) => b.jumlah - a.jumlah)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <PageHeader
        title="Transparansi Pelayanan & Pengaduan"
        subtitle="Statistik terbuka penanganan aspirasi dan laporan masyarakat secara berkala"
      />

      {/* Stats Counter */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-kuning-muda p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-teks/50 mb-1">Total Laporan Masuk</p>
          <p className="text-3xl font-serif font-bold text-hijau">{total}</p>
        </div>
        <div className="bg-white rounded-xl border border-kuning-muda p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-teks/50 mb-1">Laporan Selesai</p>
          <p className="text-3xl font-serif font-bold text-green-600">{selesai}</p>
          <p className="text-[10px] text-green-700/80 mt-1">
            Tingkat Penyelesaian: {total > 0 ? Math.round((selesai / total) * 100) : 0}%
          </p>
        </div>
        <div className="bg-white rounded-xl border border-kuning-muda p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-teks/50 mb-1">Sedang Diproses</p>
          <p className="text-3xl font-serif font-bold text-blue-600">{proses}</p>
        </div>
        <div className="bg-white rounded-xl border border-kuning-muda p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-teks/50 mb-1">Menunggu Verifikasi</p>
          <p className="text-3xl font-serif font-bold text-orange-600">{masuk}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Breakdown by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Persentase Berdasarkan Kategori</CardTitle>
            <CardDescription>Sebaran jenis aduan yang disampaikan oleh masyarakat</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {categoryStats.map((item) => (
              <div key={item.kategori} className="space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-teks">{item.kategori}</span>
                  <span className="text-teks/75">{item.jumlah} aduan ({item.persentase}%)</span>
                </div>
                {/* Custom Progress Bar */}
                <div className="w-full bg-kuning-muda/30 h-2.5 rounded-full overflow-hidden border border-kuning-muda/50">
                  <div
                    className="bg-kuning h-full rounded-full"
                    style={{ width: `${item.persentase}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Breakdown by Desa */}
        <Card>
          <CardHeader>
            <CardTitle>Aduan Masuk per Desa</CardTitle>
            <CardDescription>Jumlah kontribusi laporan permasalahan dari tiap wilayah desa</CardDescription>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead className="bg-krem text-left text-xs uppercase tracking-wider text-teks/50">
                <tr className="border-b border-kuning-muda">
                  <th className="px-5 py-3 font-bold">Desa</th>
                  <th className="px-5 py-3 font-bold text-right">Jumlah Aduan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {desaStats.map((item) => (
                  <tr key={item.desa} className="hover:bg-krem/40">
                    <td className="px-5 py-2.5 font-medium text-teks">Desa {item.desa}</td>
                    <td className="px-5 py-2.5 text-right font-bold text-hijau">{item.jumlah}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-2xl border border-kuning-muda p-5 text-center text-xs text-teks/50">
        * Statistik di atas dihimpun secara langsung dari seluruh laporan masyarakat yang masuk ke database POPMI KTP.
      </div>
    </div>
  )
}
