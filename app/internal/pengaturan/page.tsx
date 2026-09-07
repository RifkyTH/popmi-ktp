import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PengaturanPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan Sistem"
        subtitle="Konfigurasi template surat, pengguna, dan log aktivitas"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Template format */}
        <Card>
          <CardHeader>
            <CardTitle>Template & Klasifikasi Surat</CardTitle>
            <CardDescription>Format nomor klasifikasi surat dinas sesuai Permendagri</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-teks">Dispensasi Nikah</span>
              <span className="font-mono text-teks/70">451.1/CMT-TP/[No]/[Tahun]</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-teks">Dana Desa & ADD</span>
              <span className="font-mono text-teks/70">142.1/CMT-TP/[No]/[Tahun]</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-teks">Ahli Waris</span>
              <span className="font-mono text-teks/70">474.4/CMT-TP/[No]/[Tahun]</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-teks">Perangkat Desa</span>
              <span className="font-mono text-teks/70">140/CMT-TP/[No]/[Tahun]</span>
            </div>
            <div className="pt-2">
              <Button size="sm" variant="outline">Sunting Klasifikasi</Button>
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pengguna</CardTitle>
            <CardDescription>Pengelolaan akun petugas dan tingkat hak akses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              { nama: "Ahmad Fauzi", role: "Staf / Operator" },
              { nama: "Hj. Siti Rahayu, S.Sos", role: "Kasi Pemerintahan" },
              { nama: "Drs. Muhammad Rizal", role: "Camat" },
              { nama: "Reni Wulandari", role: "Petugas Pengaduan" },
            ].map((u) => (
              <div key={u.nama} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-semibold text-teks">{u.nama}</p>
                  <p className="text-xs text-teks/50">{u.role}</p>
                </div>
                <Button size="sm" variant="ghost">Sunting</Button>
              </div>
            ))}
            <div className="pt-2">
              <Button size="sm">Tambah Pengguna Baru</Button>
            </div>
          </CardContent>
        </Card>

        {/* Integration configs */}
        <Card>
          <CardHeader>
            <CardTitle>Notifikasi & Integrasi</CardTitle>
            <CardDescription>Konfigurasi pengiriman notifikasi pengaduan warga</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teks">Notifikasi WhatsApp</p>
                <p className="text-xs text-teks/50">Kirim status pengaduan via WhatsApp API</p>
              </div>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Nonaktif</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teks">Notifikasi Email</p>
                <p className="text-xs text-teks/50">Kirim email otomatis ke warga saat status update</p>
              </div>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Nonaktif</span>
            </div>
            <div className="pt-2">
              <Button size="sm" variant="outline">Hubungkan Layanan</Button>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log */}
        <Card>
          <CardHeader>
            <CardTitle>Log Aktivitas Sistem</CardTitle>
            <CardDescription>Jejak audit aktivitas staf dan status perubahan sistem</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-teks/70">
            <div className="border-l-2 border-kuning pl-3 py-1">
              <p className="font-semibold">staf login berhasil</p>
              <p className="text-teks/40">2026-08-27 15:30 · Ahmad Fauzi</p>
            </div>
            <div className="border-l-2 border-kuning pl-3 py-1">
              <p className="font-semibold">Membuat draf Dispensasi Nikah a.n Ahmad Riyadi</p>
              <p className="text-teks/40">2026-08-10 09:00 · Ahmad Fauzi</p>
            </div>
            <div className="border-l-2 border-kuning pl-3 py-1">
              <p className="font-semibold">Menerbitkan rekomendasi DD Pasir Panjang</p>
              <p className="text-teks/40">2026-08-12 08:45 · Drs. Muhammad Rizal</p>
            </div>
            <div className="pt-2">
              <Button size="sm" variant="outline">Lihat Seluruh Log</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
