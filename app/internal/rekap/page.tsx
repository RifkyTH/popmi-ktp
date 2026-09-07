"use client"

import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts"

const chartData = [
  { name: "Jan", DD: 4, ADD: 8, BBM: 10, Nikah: 15 },
  { name: "Feb", DD: 5, ADD: 8, BBM: 12, Nikah: 12 },
  { name: "Mar", DD: 6, ADD: 8, BBM: 15, Nikah: 18 },
  { name: "Apr", DD: 3, ADD: 8, BBM: 8, Nikah: 9 },
  { name: "Mei", DD: 7, ADD: 8, BBM: 11, Nikah: 14 },
  { name: "Jun", DD: 8, ADD: 8, BBM: 14, Nikah: 20 },
  { name: "Jul", DD: 5, ADD: 8, BBM: 13, Nikah: 17 },
  { name: "Agust", DD: 8, ADD: 9, BBM: 16, Nikah: 22 },
]

const pieData = [
  { name: "Dispensasi Nikah", value: 129, color: "#D9A400" },
  { name: "Rekomendasi BBM", value: 100, color: "#2F4A3C" },
  { name: "Dana Desa (DD)", value: 44, color: "#7A2E27" },
  { name: "Alokasi Dana Desa (ADD)", value: 65, color: "#2563EB" },
  { name: "Ahli Waris & Lainnya", value: 50, color: "#8B5CF6" },
]

export default function RekapPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Rekap & Statistik Surat"
        subtitle="Analisis data pelayanan administrasi kecamatan"
      />

      {/* Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tren Surat Masuk per Bulan (2026)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Nikah" fill="#D9A400" name="Dispensasi Nikah" />
                  <Bar dataKey="BBM" fill="#2F4A3C" name="Rekomendasi BBM" />
                  <Bar dataKey="DD" fill="#7A2E27" name="Dana Desa (DD)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Proporsi Jenis Surat</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-60 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend */}
            <div className="w-full space-y-2 mt-2 text-xs">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-teks/70">{item.name}</span>
                  </div>
                  <span className="font-bold text-teks">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail per Desa Table */}
      <Card>
        <CardHeader>
          <CardTitle>Jumlah Rekomendasi per Desa (Bulan Ini)</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="bg-krem text-left text-xs uppercase tracking-wider text-teks/50">
              <tr>
                <th className="px-5 py-3 font-bold">Desa</th>
                <th className="px-5 py-3 font-bold text-center">DD</th>
                <th className="px-5 py-3 font-bold text-center">ADD</th>
                <th className="px-5 py-3 font-bold text-center">Dispensasi Nikah</th>
                <th className="px-5 py-3 font-bold text-center">BBM</th>
                <th className="px-5 py-3 font-bold text-center">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {[
                { desa: "Temiang", dd: 2, add: 1, nikah: 5, bbm: 4 },
                { desa: "Pasir Panjang", dd: 1, add: 1, nikah: 3, bbm: 2 },
                { desa: "Duara", dd: 1, add: 1, nikah: 4, bbm: 3 },
                { desa: "Sungai Buluh", dd: 1, add: 1, nikah: 2, bbm: 4 },
                { desa: "Penuba", dd: 2, add: 1, nikah: 3, bbm: 2 },
                { desa: "Penuba Timur", dd: 1, add: 1, nikah: 1, bbm: 0 },
                { desa: "Berindat", dd: 0, add: 1, nikah: 2, bbm: 1 },
                { desa: "Air Glubi", dd: 0, add: 1, nikah: 2, bbm: 0 },
              ].map((row) => (
                <tr key={row.desa} className="hover:bg-krem/40">
                  <td className="px-5 py-2.5 font-medium text-teks">Desa {row.desa}</td>
                  <td className="px-5 py-2.5 text-center">{row.dd}</td>
                  <td className="px-5 py-2.5 text-center">{row.add}</td>
                  <td className="px-5 py-2.5 text-center">{row.nikah}</td>
                  <td className="px-5 py-2.5 text-center">{row.bbm}</td>
                  <td className="px-5 py-2.5 text-center font-bold text-hijau">
                    {row.dd + row.add + row.nikah + row.bbm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
