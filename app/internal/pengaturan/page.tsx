import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createServiceClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"
import { id as localeId } from "date-fns/locale"

export default async function PengaturanPage() {
  const supabase = await createServiceClient()
  
  // Fetch latest activities from surat
  const { data: riwayatSurat } = await supabase
    .from("surat_riwayat")
    .select("status, oleh, tanggal, surat:surat_id(judul)")
    .order("tanggal", { ascending: false })
    .limit(5)

  // Fetch latest activities from pengaduan
  const { data: riwayatPengaduan } = await supabase
    .from("pengaduan_riwayat")
    .select("status, oleh, tanggal, pengaduan:pengaduan_id(judul)")
    .order("tanggal", { ascending: false })
    .limit(5)

  // Fetch latest activities from sistem (login, user actions)
  const { data: riwayatSistem } = await supabase
    .from("log_sistem")
    .select("aksi, keterangan, oleh, tanggal")
    .order("tanggal", { ascending: false })
    .limit(5)

  // Format and merge logs
  const suratLogs = (riwayatSurat || []).map(s => ({
    type: 'surat',
    status: s.status,
    oleh: s.oleh,
    tanggal: s.tanggal,
    title: Array.isArray(s.surat) ? s.surat[0]?.judul : s.surat?.judul
  }))

  const pengaduanLogs = (riwayatPengaduan || []).map(p => ({
    type: 'pengaduan',
    status: p.status,
    oleh: p.oleh,
    tanggal: p.tanggal,
    title: Array.isArray(p.pengaduan) ? p.pengaduan[0]?.judul : p.pengaduan?.judul
  }))

  const sistemLogs = (riwayatSistem || []).map(l => ({
    type: 'sistem',
    status: l.aksi,
    oleh: l.oleh,
    tanggal: l.tanggal,
    title: l.keterangan
  }))

  // Sort combined logs by date (newest first) and take top 5
  const combinedLogs = [...suratLogs, ...pengaduanLogs, ...sistemLogs]
    .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
    .slice(0, 5)

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
            {combinedLogs.length > 0 ? combinedLogs.map((log, idx) => {
              let actionTitle = ''
              
              if (log.type === 'surat') {
                actionTitle = log.status === 'draf' ? 'Membuat draf surat' 
                  : log.status === 'verifikasi' ? 'Memverifikasi surat'
                  : log.status === 'terbit' ? 'Menerbitkan surat'
                  : log.status === 'menunggu_ttd' ? 'Meneruskan ke Camat'
                  : 'Pembaruan surat'
              } else if (log.type === 'pengaduan') {
                actionTitle = log.status === 'masuk' ? 'Menerima pengaduan baru' 
                  : log.status === 'verifikasi' ? 'Memverifikasi pengaduan'
                  : log.status === 'proses' ? 'Memproses pengaduan'
                  : log.status === 'selesai' ? 'Menyelesaikan pengaduan'
                  : log.status === 'ditolak' ? 'Menolak pengaduan'
                  : 'Pembaruan pengaduan'
              } else {
                actionTitle = log.status === 'login' ? 'Login' 
                  : log.status === 'tambah_pengguna' ? 'Menambah Pengguna'
                  : log.status === 'edit_pengguna' ? 'Pembaruan Pengguna'
                  : log.status === 'hapus_pengguna' ? 'Penghapusan Pengguna'
                  : log.status === 'status_pengguna' ? 'Ubah Status Pengguna'
                  : log.status === 'hapus_surat' ? 'Menghapus Surat'
                  : log.status === 'hapus_semua_surat' ? 'Menghapus Semua Surat'
                  : 'Aktivitas Sistem'
              }
              
              const title = log.title || (log.type === 'surat' ? 'Surat' : 'Pengaduan')
              const borderColor = log.type === 'pengaduan' ? 'border-orange-400' 
                : log.type === 'sistem' ? 'border-blue-400' 
                : 'border-kuning'
              
              return (
                <div key={idx} className={`border-l-2 ${borderColor} pl-4 py-1`}>
                  <p className="font-semibold text-teks">{actionTitle}: {title}</p>
                  <p className="text-xs text-teks/50 mt-0.5">
                    {formatDistanceToNow(new Date(log.tanggal), { addSuffix: true, locale: localeId })} · {log.oleh}
                  </p>
                </div>
              )
            }) : (
              <p className="text-teks/50 text-sm">Belum ada aktivitas tercatat.</p>
            )}
            
            <div className="pt-3 flex gap-2">
              <Link href="/internal/surat">
                <Button size="sm" variant="outline">Lihat Surat</Button>
              </Link>
              <Link href="/internal/pengaduan">
                <Button size="sm" variant="outline">Lihat Pengaduan</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
