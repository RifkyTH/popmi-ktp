import Link from "next/link"
import { createServiceClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import {
  Settings,
  Users,
  ShieldCheck,
  Server,
  BellRing,
  Database,
  ArrowRight,
  Clock,
  FileText,
  MessageSquare,
  Building2,
  Lock,
  Radio,
  ExternalLink,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getHeroBackgroundSettings } from "@/lib/data/hero-settings"
import { HeroBackgroundSettingsManager } from "@/components/internal/hero-background-settings"

export const revalidate = 0

export default async function PengaturanPage() {
  const heroSettings = getHeroBackgroundSettings()
  const supabase = await createServiceClient()

  // Fetch counts
  const { count: totalUser } = await supabase.from("pengguna").select("*", { count: "exact", head: true })
  const { count: totalSurat } = await supabase.from("surat").select("*", { count: "exact", head: true })
  const { count: totalPengaduan } = await supabase.from("pengaduan").select("*", { count: "exact", head: true })
  const { count: totalLog } = await supabase.from("log_sistem").select("*", { count: "exact", head: true })

  // Fetch latest activities from surat
  const { data: riwayatSurat } = await supabase
    .from("surat_riwayat")
    .select("status, oleh, tanggal, surat:surat_id(judul)")
    .order("tanggal", { ascending: false })
    .limit(6)

  // Fetch latest activities from pengaduan
  const { data: riwayatPengaduan } = await supabase
    .from("pengaduan_riwayat")
    .select("status, oleh, tanggal, pengaduan:pengaduan_id(judul)")
    .order("tanggal", { ascending: false })
    .limit(6)

  // Fetch latest activities from sistem
  const { data: riwayatSistem } = await supabase
    .from("log_sistem")
    .select("aksi, keterangan, oleh, tanggal")
    .order("tanggal", { ascending: false })
    .limit(6)

  // Format and merge logs
  const suratLogs = (riwayatSurat || []).map((s) => {
    const suratObj = (s as any).surat
    return {
      type: "surat",
      status: s.status,
      oleh: s.oleh,
      tanggal: s.tanggal,
      title: Array.isArray(suratObj) ? suratObj[0]?.judul : suratObj?.judul,
    }
  })

  const pengaduanLogs = (riwayatPengaduan || []).map((p) => {
    const pengaduanObj = (p as any).pengaduan
    return {
      type: "pengaduan",
      status: p.status,
      oleh: p.oleh,
      tanggal: p.tanggal,
      title: Array.isArray(pengaduanObj) ? pengaduanObj[0]?.judul : pengaduanObj?.judul,
    }
  })

  const sistemLogs = (riwayatSistem || []).map((l) => ({
    type: "sistem",
    status: l.aksi,
    oleh: l.oleh,
    tanggal: l.tanggal,
    title: l.keterangan,
  }))

  const combinedLogs = [...suratLogs, ...pengaduanLogs, ...sistemLogs]
    .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
    .slice(0, 8)

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-teks/50">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Konfigurasi & Jejak Audit
            </span>
            <span>•</span>
            <span>Kecamatan Temiang Pesisir</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold font-serif text-hijau tracking-tight">
            Pengaturan & Pemeliharaan Sistem
          </h1>
          <p className="text-xs sm:text-sm text-teks/60 mt-0.5">
            Konfigurasi parameter operasional, modul integrasi, dan jejak audit aktivitas aparatur
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/internal/pengguna">
            <Button className="bg-hijau hover:bg-hijau/90 text-white shadow-sm text-xs font-semibold cursor-pointer">
              <Users className="w-4 h-4 mr-1.5" />
              Kelola Pengguna ({totalUser || 0})
            </Button>
          </Link>
        </div>
      </div>

      {/* 3 Status & Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Database & Layanan</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <p className="text-lg font-bold font-serif text-emerald-700">Online & Sinkron</p>
          </div>
          <p className="text-xs text-teks/50 mt-1">Supabase Cloud PostgreSQL</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Log Audit Tercatat</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-serif text-blue-700">{(totalLog || 0) + (combinedLogs.length || 0)}</p>
          <p className="text-xs text-teks/50 mt-1">rekam jejak aktivitas aparatur</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teks/50">Protokol Keamanan</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg font-bold font-serif text-purple-700">HttpOnly Session</p>
          <p className="text-xs text-teks/50 mt-1">Enkripsi autentikasi RBAC aktif</p>
        </div>
      </div>

      {/* Modul Kustomisasi Background Animasi Hero Portal Publik (Superadmin & Admin) */}
      <HeroBackgroundSettingsManager initialSettings={heroSettings} />

      {/* Grid Konfigurasi & Integrasi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Modul Akses & Pengguna */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="font-bold font-serif text-lg text-hijau">Manajemen Hak Akses & Pengguna</h2>
              <p className="text-xs text-teks/60 mt-0.5">
                Konfigurasi akun pejabat, kasi penandatangan berita acara, staf, dan admin sistem.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              {totalUser || 0} Akun
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 text-xs text-teks/70 space-y-2">
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Role terpisah: Super Admin, Admin, Camat, Sekretaris, Kasi, dan Staf Pelayanan.
            </p>
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Spesimen tanda tangan digital (TTD) tersinkron otomatis ke berkas PDF sah.
            </p>
          </div>

          <Link href="/internal/pengguna" className="inline-flex items-center gap-1.5 text-xs font-semibold text-hijau hover:text-emerald-700 transition-colors">
            Buka Modul Manajemen Pengguna &rarr;
          </Link>
        </div>

        {/* Notifikasi & Integrasi Warga */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
              <BellRing className="w-5 h-5" />
            </div>
            <h2 className="font-bold font-serif text-lg text-hijau">Kanal Integrasi & Notifikasi</h2>
            <p className="text-xs text-teks/60 mt-0.5">
              Status pengiriman pemberitahuan otomatis tindak lanjut pengaduan kepada warga.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 border border-gray-100">
              <div>
                <p className="text-xs font-semibold text-teks">WhatsApp Gateway API</p>
                <p className="text-[11px] text-teks/50">Kirim status pengaduan via nomor WhatsApp pelapor</p>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                Siap Diintegrasi
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 border border-gray-100">
              <div>
                <p className="text-xs font-semibold text-teks">Notifikasi Surat Sah (QR Code)</p>
                <p className="text-[11px] text-teks/50">Verifikasi barcode otentikasi digital Camat</p>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Aktif
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log / Jejak Aktivitas */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold font-serif text-lg text-hijau tracking-tight">
              Jejak Audit Aktivitas Sistem (Audit Trail)
            </h2>
            <p className="text-xs text-teks/50 mt-0.5">
              Rekam jejak riil perubahan surat, disposisi, pengaduan, dan aksi pengguna terbaru
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/internal/surat">
              <Button variant="outline" size="sm" className="text-xs h-8 cursor-pointer">
                <FileText className="w-3.5 h-3.5 mr-1" />
                Semua Surat
              </Button>
            </Link>
            <Link href="/internal/aduan">
              <Button variant="outline" size="sm" className="text-xs h-8 cursor-pointer">
                <MessageSquare className="w-3.5 h-3.5 mr-1" />
                Semua Aduan
              </Button>
            </Link>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {combinedLogs.length > 0 ? (
            combinedLogs.map((log, idx) => {
              let actionTitle = ""
              let tagColor = "bg-gray-100 text-gray-700 border-gray-200"

              if (log.type === "surat") {
                tagColor = "bg-emerald-50 text-emerald-700 border-emerald-200"
                actionTitle =
                  log.status === "draf"
                    ? "Membuat draf surat"
                    : log.status === "verifikasi"
                    ? "Memverifikasi berkas surat"
                    : log.status === "terbit"
                    ? "Menerbitkan surat sah (TTD Camat)"
                    : log.status === "menunggu_ttd"
                    ? "Meneruskan surat ke Camat"
                    : "Pembaruan dokumen surat"
              } else if (log.type === "pengaduan") {
                tagColor = "bg-amber-50 text-amber-700 border-amber-200"
                actionTitle =
                  log.status === "masuk"
                    ? "Menerima pengaduan baru"
                    : log.status === "verifikasi"
                    ? "Memverifikasi pengaduan"
                    : log.status === "proses"
                    ? "Memproses tindak lanjut aduan"
                    : log.status === "selesai"
                    ? "Menyelesaikan aduan warga"
                    : log.status === "ditolak"
                    ? "Menolak aduan warga"
                    : "Pembaruan status pengaduan"
              } else {
                tagColor = "bg-sky-50 text-sky-700 border-sky-200"
                actionTitle =
                  log.status === "tambah_pengguna"
                    ? "Menambah akun pengguna"
                    : log.status === "edit_pengguna"
                    ? "Mengubah data pengguna"
                    : log.status === "hapus_pengguna"
                    ? "Menghapus akun pengguna"
                    : log.status === "status_pengguna"
                    ? "Mengubah status aktif pengguna"
                    : log.status === "hapus_surat"
                    ? "Menghapus berkas surat"
                    : log.status === "hapus_semua_surat"
                    ? "Menghapus seluruh surat"
                    : log.status === "Tambah Pengaduan"
                    ? "Menambahkan pengaduan warga"
                    : log.status === "Edit Pengaduan"
                    ? "Mengubah pengaduan warga"
                    : log.status === "Hapus Pengaduan"
                    ? "Menghapus pengaduan warga"
                    : "Aktivitas Keamanan Sistem"
              }

              const title = log.title || (log.type === "surat" ? "Surat Pelayanan" : "Pengaduan Masyarakat")

              return (
                <div key={idx} className="px-6 py-3.5 hover:bg-gray-50/50 transition-colors flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 mt-0.5 uppercase tracking-wide", tagColor)}>
                      {log.type}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-teks truncate">
                        {actionTitle}: <span className="text-hijau">{title}</span>
                      </p>
                      <p className="text-[11px] text-teks/50 mt-0.5">
                        Diproses oleh: <span className="font-medium text-teks/70">{log.oleh}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-teks/40 flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3 text-teks/30" />
                      {formatDistanceToNow(new Date(log.tanggal), { addSuffix: true, locale: localeId })}
                    </span>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="px-6 py-12 text-center text-xs text-teks/40 italic">
              Belum ada aktivitas tercatat dalam sistem audit.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

