import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createServiceClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"
import { id as localeId } from "date-fns/locale"

export default async function PengaturanPage() {
  const supabase = await createServiceClient()
  
  // Fetch latest 5 activities from surat_riwayat
  const { data: riwayatSurat } = await supabase
    .from("surat_riwayat")
    .select("status, oleh, tanggal, surat:surat_id(judul)")
    .order("tanggal", { ascending: false })
    .limit(5)

  const logs = riwayatSurat || []

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
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Nonaktif</span>
            </div>
            <div className="flex items-center justify-between pb-1">
              <div>
                <p className="text-sm font-semibold text-teks">Notifikasi Email</p>
                <p className="text-xs text-teks/50">Kirim email otomatis ke warga saat status update</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Nonaktif</span>
            </div>
            <div className="pt-2 flex gap-2">
              <Button size="sm" variant="outline" disabled>Sedang Dikembangkan</Button>
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
            {logs.length > 0 ? logs.map((log, idx) => {
              const actionTitle = log.status === 'draf' ? 'Membuat draf surat' 
                : log.status === 'verifikasi' ? 'Memverifikasi surat'
                : log.status === 'terbit' ? 'Menerbitkan surat'
                : log.status === 'menunggu_ttd' ? 'Meneruskan ke Camat'
                : 'Mengubah surat'
              
              const suratTitle = Array.isArray(log.surat) ? log.surat[0]?.judul : log.surat?.judul
              
              return (
                <div key={idx} className="border-l-2 border-kuning pl-4 py-1">
                  <p className="font-semibold text-teks">{actionTitle}: {suratTitle || 'Surat'}</p>
                  <p className="text-xs text-teks/50 mt-0.5">
                    {formatDistanceToNow(new Date(log.tanggal), { addSuffix: true, locale: localeId })} · {log.oleh}
                  </p>
                </div>
              )
            }) : (
              <p className="text-teks/50 text-sm">Belum ada aktivitas tercatat.</p>
            )}
            
            <div className="pt-3">
              <Link href="/internal/surat">
                <Button size="sm" variant="outline">Lihat Semua Surat</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
