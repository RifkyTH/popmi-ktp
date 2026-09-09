import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PengaturanPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan Sistem"
        subtitle="Konfigurasi integrasi dan log aktivitas"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Management Shortcut */}
        <Card>
          <CardHeader>
            <CardTitle>Manajemen Pengguna</CardTitle>
            <CardDescription>Kelola akun petugas, operator desa, dan hak akses sistem</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-teks/70">
              Pengelolaan pengguna sekarang dipindahkan ke modul khusus Manajemen Pengguna untuk keamanan akses Super Admin.
            </p>
            <div className="pt-2">
              <Link href="/internal/pengguna">
                <Button size="sm">Buka Manajemen Pengguna</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Integration configs */}
        <Card>
          <CardHeader>
            <CardTitle>Notifikasi & Integrasi</CardTitle>
            <CardDescription>Konfigurasi pengiriman notifikasi otomatis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <p className="text-sm font-semibold text-teks">Notifikasi WhatsApp</p>
                <p className="text-xs text-teks/50">Kirim status pengaduan via WhatsApp API</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Aktif</span>
            </div>
            <div className="flex items-center justify-between pb-1">
              <div>
                <p className="text-sm font-semibold text-teks">Notifikasi Email</p>
                <p className="text-xs text-teks/50">Kirim email otomatis ke warga saat status update</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Aktif</span>
            </div>
            <div className="pt-2 flex gap-2">
              <Button size="sm" variant="outline">Konfigurasi Ulang</Button>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Log Aktivitas Sistem</CardTitle>
            <CardDescription>Jejak audit aktivitas staf dan status perubahan sistem terbaru</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-teks/80">
            <div className="border-l-2 border-kuning pl-4 py-1">
              <p className="font-semibold text-teks">Integrasi WhatsApp & Email diaktifkan</p>
              <p className="text-xs text-teks/50 mt-0.5">Baru saja · Super Admin</p>
            </div>
            <div className="border-l-2 border-gray-200 pl-4 py-1">
              <p className="font-semibold text-teks">Pembaruan konfigurasi Manajemen Pengguna</p>
              <p className="text-xs text-teks/50 mt-0.5">Hari ini · Sistem</p>
            </div>
            <div className="border-l-2 border-gray-200 pl-4 py-1">
              <p className="font-semibold text-teks">Staf login berhasil</p>
              <p className="text-xs text-teks/50 mt-0.5">Kemarin · Ahmad Fauzi</p>
            </div>
            <div className="pt-3">
              <Button size="sm" variant="outline">Muat Lebih Banyak Log</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
