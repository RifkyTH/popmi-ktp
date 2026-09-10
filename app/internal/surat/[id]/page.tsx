import { notFound } from "next/navigation"
import Link from "next/link"
import { cookies } from "next/headers"
import { getSessionFromCookie, AUTH_COOKIE_NAME } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/server"
import { JENIS_SURAT_LABELS, STATUS_LABELS, StatusSurat, JenisSurat } from "@/lib/mock-data/surat"
import { Button } from "@/components/ui/button"
import {
  Printer,
  ArrowLeft,
  FileCheck,
  CheckCheck,
  Pencil,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  User,
  Users,
  Calendar,
  ShieldCheck,
  Check,
  ChevronRight,
  Sparkles,
  Send,
  ExternalLink,
  FileSpreadsheet,
  Stamp,
  Lock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { UbahVerifikatorForm } from "@/components/internal/ubah-verifikator-form"

export const revalidate = 0

const statusPillStyles: Record<StatusSurat, { bg: string; text: string; border: string; dot: string }> = {
  draf: { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", dot: "bg-slate-400" },
  verifikasi: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200", dot: "bg-blue-500" },
  menunggu_ttd: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200", dot: "bg-amber-500" },
  terbit: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200", dot: "bg-emerald-500" },
  terkirim: { bg: "bg-teal-50", text: "text-teal-800", border: "border-teal-200", dot: "bg-teal-500" },
}

const STATUS_ORDER: StatusSurat[] = ["draf", "verifikasi", "menunggu_ttd", "terbit", "terkirim"]

export default async function DetailSuratPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(AUTH_COOKIE_NAME)?.value
  const user = getSessionFromCookie(sessionValue)
  const isKasi = ["kasi", "kasi_pem", "kasi_ekbang", "kasi_kesos", "kasi_ekobang", "kasi_kessos", "sekretaris"].includes(user?.role || "")

  const supabase = await createServiceClient()

  const { data: suratData } = await supabase
    .from("surat")
    .select("*")
    .eq("id", id)
    .single()

  if (!suratData) notFound()

  const { data: riwayatData } = await supabase
    .from("surat_riwayat")
    .select("*")
    .eq("surat_id", id)
    .order("tanggal", { ascending: true })

  const riwayat = riwayatData || []

  // Map snake_case to camelCase for display
  const surat = {
    id: suratData.id,
    nomor: suratData.nomor,
    jenis: suratData.jenis as JenisSurat,
    judul: suratData.judul,
    pemohon: suratData.pemohon,
    desa: suratData.desa,
    tanggalBuat: suratData.tanggal_buat,
    tanggalTerbit: suratData.tanggal_terbit,
    status: suratData.status as StatusSurat,
    dibuatOleh: suratData.dibuat_oleh,
    diverifikasiOleh: suratData.diverifikasi_oleh,
    disetujuiOleh: suratData.disetujui_oleh,
    perihal: suratData.perihal,
    dataForm: suratData.data_form || {},
  }

  const hasTimVerifikasi = ["rekomendasi_dd", "rekomendasi_add", "tunda_salur_add"].includes(surat.jenis)
  const isAdminOrSuper = user?.role === "super_admin" || user?.role === "admin"
  const isSignedJubir = Boolean(surat.dataForm?.ttd_jubir) && surat.dataForm?.ttd_jubir !== "false"
  const isSignedZakaria = Boolean(surat.dataForm?.ttd_zakaria) && surat.dataForm?.ttd_zakaria !== "false"

  // Ambil spesimen TTD terbaru dari tabel pengguna agar sinkron dengan yang diunggah di profil
  const { data: signers } = await supabase
    .from("pengguna")
    .select("id, username, role, nama, jabatan, ttd_url")
    .order("username", { ascending: true })

  const camatUser = signers?.find((u) => u.role === "camat")
  const officialCamatNama = camatUser?.nama || "HENDRA, S.STP"
  const officialCamatJabatan = camatUser?.jabatan || "Camat Temiang Pesisir"

  // Cek jika superadmin sudah override penandatangan slot jubir/zakaria
  const overrideJubir = surat.dataForm?.penandatangan_jubir as { userId: string; nama: string; jabatan: string; ttd_url: string | null } | undefined
  const overrideZakaria = surat.dataForm?.penandatangan_zakaria as { userId: string; nama: string; jabatan: string; ttd_url: string | null } | undefined

  // Resolusi user verifikator efektif: prioritaskan override, lalu cari berdasarkan username tepat
  const jubirUser = overrideJubir
    ? (signers?.find((u) => u.id === overrideJubir.userId) ?? { id: overrideJubir.userId, nama: overrideJubir.nama, jabatan: overrideJubir.jabatan, ttd_url: overrideJubir.ttd_url })
    : (signers?.find((u) => u.username === "jubir") 
        ?? signers?.find((u) => u.role === "sekretaris") 
        ?? null)

  const zakariaUser = overrideZakaria
    ? (signers?.find((u) => u.id === overrideZakaria.userId) ?? { id: overrideZakaria.userId, nama: overrideZakaria.nama, jabatan: overrideZakaria.jabatan, ttd_url: overrideZakaria.ttd_url })
    : (signers?.find((u) => u.username === "zakaria")
        ?? signers?.find((u) => u.role === "kasi_kesos")
        ?? null)

  // Apakah user yang login cocok dengan penandatangan efektif?
  const isJubirUser = Boolean(
    (user?.id && jubirUser && user.id === jubirUser.id) ||
    (!overrideJubir && (user?.username?.toLowerCase().includes("jubir") || user?.role === "sekretaris"))
  )
  const isZakariaUser = Boolean(
    (user?.id && zakariaUser && user.id === zakariaUser.id) ||
    (!overrideZakaria && (user?.username?.toLowerCase().includes("zakaria") || user?.role === "kasi_kesos" || user?.role === "kasi_pem" || user?.role === "kasi_ekbang" || user?.role === "kasi"))
  )

  const camatTtdSrc = camatUser?.ttd_url || surat.dataForm?.ttd_camat_url || "/ttd-camat.jpeg"
  
  // TTD verifikator: HANYA diambil dari profil pengguna yang bersangkutan di tabel pengguna.
  const jubirRealTtdUrl = jubirUser?.id
    ? (signers?.find((u) => u.id === jubirUser.id)?.ttd_url || null)
    : null
  const zakariaRealTtdUrl = zakariaUser?.id
    ? (signers?.find((u) => u.id === zakariaUser.id)?.ttd_url || null)
    : null

  const jubirTtdSrc = jubirRealTtdUrl
  const zakariaTtdSrc = zakariaRealTtdUrl

  // Daftar pengguna untuk dropdown ubah verifikator (hanya tampil ke superadmin)
  const penggunaDropdown = (signers || [])
    .filter((u) => !["super_admin", "admin", "petugas", "camat"].includes(u.role))
    .map((u) => ({ id: u.id, nama: u.nama, jabatan: u.jabatan, ttd_url: u.ttd_url }))

  const currentIndex = STATUS_ORDER.indexOf(surat.status)
  const timelineSteps = STATUS_ORDER.map((status, i) => {
    // Ambil entri riwayat terbaru untuk setiap tahapan status
    const riwayatItem = [...riwayat].reverse().find((r) => r.status === status)

    let description: string | undefined = undefined
    if (riwayatItem) {
      let catatan = riwayatItem.catatan || ""
      // Sinkronkan nama verifikator agar selalu mengikuti penandatangan aktif
      if (status === "menunggu_ttd" && hasTimVerifikasi && (catatan.includes("Verifikasi Berita Acara") || catatan.includes("Jubir") || catatan.includes("Zakaria"))) {
        catatan = `Verifikasi Berita Acara lengkap oleh ${jubirUser?.nama ?? "Verifikator 1"} & ${zakariaUser?.nama ?? "Verifikator 2"}. Otomatis diteruskan ke Camat untuk TTD.`
      }
      description = `oleh ${riwayatItem.oleh}${catatan ? " — " + catatan : ""}`
    }

    return {
      label: STATUS_LABELS[status],
      description,
      timestamp: riwayatItem?.tanggal,
      done: i < currentIndex,
      active: i === currentIndex,
    }
  })

  const statusStyle = statusPillStyles[surat.status] || statusPillStyles.draf

  // Filter out internal backend signature & numbering keys so they never leak into the applicant form attributes
  const isInternalKey = (key: string) => {
    const k = key.toLowerCase()
    return (
      k.startsWith("ttd_") ||
      k.startsWith("verifikator_") ||
      k.startsWith("penandatangan_") ||
      ["nomorurut", "nomorbulan", "nomortahun"].includes(k)
    )
  }

  const displayFormEntries = Object.entries(surat.dataForm).filter(([k]) => !isInternalKey(k))

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      {/* Header GovTech */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Naskah Dinas Resmi · Kecamatan Temiang Pesisir
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2F4A3C] tracking-tight">
              {surat.judul}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 flex flex-wrap items-center gap-2">
              <span className="font-medium text-gray-800">{JENIS_SURAT_LABELS[surat.jenis] ?? surat.jenis}</span>
              <span className="text-gray-300">·</span>
              <span className="font-mono font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200/60">
                No. {surat.nomor}
              </span>
              <span className="text-gray-300">·</span>
              <span>Dibuat: {surat.tanggalBuat}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto shrink-0">
            <Link href="/internal/surat">
              <Button variant="outline" size="sm" className="text-xs font-semibold rounded-xl border-gray-300">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Kembali
              </Button>
            </Link>
            {surat.status === "draf" && (
              <Link href={`/internal/surat/${surat.id}/edit`}>
                <Button variant="outline" size="sm" className="text-xs font-semibold rounded-xl border-emerald-300 text-emerald-800 hover:bg-emerald-50">
                  <Pencil className="w-4 h-4 mr-1.5" /> Edit Draf
                </Button>
              </Link>
            )}
            <Link href={`/internal/surat/${surat.id}/cetak`} target="_blank">
              <Button size="sm" className="bg-[#2F4A3C] hover:bg-[#23382d] text-white text-xs font-semibold px-4 rounded-xl shadow-sm">
                <Printer className="w-4 h-4 mr-1.5" /> Cetak PDF e-TEPI
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Detail & Data Surat (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Informasi Berkas Naskah Dinas */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-7 space-y-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-[#2F4A3C]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#2F4A3C]">Informasi Berkas Naskah Dinas</h2>
                  <p className="text-[11px] text-gray-500">Legalitas registrasi dan data pemohon</p>
                </div>
              </div>

              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                  statusStyle.bg,
                  statusStyle.text,
                  statusStyle.border
                )}
              >
                <span className={cn("w-2 h-2 rounded-full", statusStyle.dot, surat.status !== "terkirim" && "animate-pulse")} />
                {STATUS_LABELS[surat.status] ?? surat.status}
              </span>
            </div>

            {/* Grid 6 Informasi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-gray-400 block text-[11px] mb-1">Nomor Registrasi Surat</span>
                <span className="font-mono font-bold text-emerald-800 text-sm block truncate">
                  {surat.nomor}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-gray-400 block text-[11px] mb-1">Jenis Layanan / Naskah</span>
                <span className="font-semibold text-gray-900 block truncate">
                  {JENIS_SURAT_LABELS[surat.jenis] ?? surat.jenis}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-gray-400 block text-[11px] mb-1">Pemohon / Atas Nama</span>
                <span className="font-bold text-gray-900 block truncate">
                  {surat.pemohon}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-gray-400 block text-[11px] mb-1">Wilayah / Asal Desa</span>
                <span className="font-semibold text-gray-900 block truncate">
                  Desa {surat.desa || "-"}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-gray-400 block text-[11px] mb-1">Perihal Dokumen</span>
                <span className="font-medium text-gray-800 block truncate">
                  {surat.perihal || "-"}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-gray-400 block text-[11px] mb-1">Tanggal Pembuatan</span>
                <span className="font-medium text-gray-900 block">
                  {surat.tanggalBuat}
                  {surat.tanggalTerbit && (
                    <span className="text-emerald-700 font-semibold block mt-0.5">
                      Terbit: {surat.tanggalTerbit}
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Aparatur Pemroses & Penanggung Jawab Section */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-3.5 h-3.5 text-[#2F4A3C]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Aparatur Penanggung Jawab &amp; Alur Pengesahan
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Pembuat / Konseptor Draf */}
                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Konseptor Draf</span>
                      <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-200/70 text-slate-700">Draf</span>
                    </div>
                    <p className="text-xs font-bold text-gray-900 truncate" title={surat.dibuatOleh}>
                      {surat.dibuatOleh}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 truncate">Penyusun Naskah Dinas</p>
                  </div>
                </div>

                {/* 2. Tim Verifikator Teknis */}
                <div className="p-3.5 rounded-xl bg-blue-50/40 border border-blue-200/70 shadow-2xs hover:border-blue-300 transition-all flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Verifikator Teknis</span>
                      {(isSignedJubir && isSignedZakaria) || surat.status === "terbit" || surat.status === "terkirim" ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200/60">✓ Lengkap</span>
                      ) : (
                        <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">Pemeriksaan</span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-gray-900 truncate" title={hasTimVerifikasi ? `${jubirUser?.nama ?? "Verifikator 1"} & ${zakariaUser?.nama ?? "Verifikator 2"}` : (surat.diverifikasiOleh || "Tim Verifikasi")}>
                      {hasTimVerifikasi ? `${jubirUser?.nama ?? "Verifikator 1"} & ${zakariaUser?.nama ?? "Verifikator 2"}` : (surat.diverifikasiOleh || "Tim Verifikasi Kecamatan")}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 truncate">Pemeriksa &amp; Pemaraf Dokumen</p>
                  </div>
                </div>

                {/* 3. Pengesahan Camat */}
                <div className={cn(
                  "p-3.5 rounded-xl border shadow-2xs transition-all flex items-start gap-3",
                  (surat.status === "terbit" || surat.status === "terkirim" || surat.disetujuiOleh)
                    ? "bg-emerald-50/50 border-emerald-200/90"
                    : "bg-slate-50/80 border-slate-200/80"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-2xs",
                    (surat.status === "terbit" || surat.status === "terkirim" || surat.disetujuiOleh)
                      ? "bg-[#2F4A3C] text-[#D9A400]"
                      : "bg-amber-100 text-amber-700"
                  )}>
                    <Stamp className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Pengesahan Camat</span>
                      {(surat.status === "terbit" || surat.status === "terkirim") ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200/60">Sah e-TEPI</span>
                      ) : (
                        <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">Menunggu</span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-gray-900 truncate" title={officialCamatNama}>
                      {officialCamatNama}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 truncate">Camat Temiang Pesisir</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview TTD Camat — tampil setelah surat diterbitkan */}
            {(surat.status === "terbit" || surat.status === "terkirim") && (
              <div className="mt-4 pt-5 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Stamp className="w-4 h-4 text-[#D9A400]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2F4A3C]">
                    Pengesahan Tanda Tangan Elektronik Camat
                  </span>
                </div>

                <div className="rounded-2xl border-2 border-dashed border-emerald-300/80 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:14px_14px] bg-slate-50/70 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="text-center w-full sm:w-auto">
                    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-xs inline-block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={camatTtdSrc}
                        alt="TTD Camat"
                        className="w-32 h-20 mix-blend-multiply object-contain mx-auto"
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <div className="w-40 h-0.5 bg-gray-800 mx-auto mb-1" />
                      <p className="text-xs font-bold text-gray-900">{officialCamatNama}</p>
                      <p className="text-[10px] text-gray-500">{officialCamatJabatan.toUpperCase()} · PEMBINA / IV.a</p>
                      <p className="text-[10px] text-gray-400 font-mono">NIP. 198507122006021001</p>
                    </div>
                  </div>

                  <div className="bg-white border border-emerald-200 rounded-xl p-4 text-xs text-emerald-800 space-y-1.5 max-w-sm shadow-xs">
                    <div className="flex items-center gap-2 font-bold text-emerald-800 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      Telah Ditandatangani Sah
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      Dokumen resmi telah ditandatangani secara elektronik oleh <strong>{officialCamatNama}</strong>
                      {surat.tanggalTerbit && (
                        <> pada tanggal {new Date(surat.tanggalTerbit).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</>
                      )}.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Detail Data Isian Formulir */}
          {displayFormEntries.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-7 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <h2 className="text-base font-bold text-[#2F4A3C]">Rincian Atribut & Data Isian Formulir</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {displayFormEntries.map(([key, value]) => {
                  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                  const isBooleanTrue = value === "true" || value === true
                  const isBooleanFalse = value === "false" || value === false

                  return (
                    <div key={key} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 break-words">
                      <span className="text-gray-400 block text-[11px] mb-1">{label}</span>
                      {isBooleanTrue ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" /> Lengkap / Terlampir
                        </span>
                      ) : isBooleanFalse ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 bg-gray-200/80 px-2 py-0.5 rounded-full">
                          Belum Dilampirkan
                        </span>
                      ) : (
                        <span className="font-semibold text-gray-800 block">
                          {value ? String(value) : "-"}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Card 3: Tanda Tangan Tim Verifikasi Kecamatan */}
          {hasTimVerifikasi && (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-7 space-y-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D9A400]" />
                  <div>
                    <h2 className="text-base font-bold text-[#2F4A3C]">Tanda Tangan Tim Verifikasi Kecamatan</h2>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Berita Acara Verifikasi ditandatangani oleh kedua verifikator sebelum diteruskan ke Camat.
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 self-start sm:self-auto">
                  2 Verifikator
                </span>
              </div>

              {/* Status Ringkasan Alert */}
              <div>
                {isSignedJubir && isSignedZakaria ? (
                  <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Verifikasi lengkap oleh kedua verifikator ({jubirUser?.nama ?? "Verifikator 1"} &amp; {zakariaUser?.nama ?? "Verifikator 2"}). Dokumen otomatis diteruskan ke Camat untuk ditandatangani.</span>
                  </div>
                ) : (isSignedJubir || isSignedZakaria) ? (
                  <div className="flex items-center gap-2.5 p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 font-medium shadow-xs">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>1 dari 2 verifikator telah menandatangani ({isSignedJubir ? (jubirUser?.nama ?? "Verifikator 1") : (zakariaUser?.nama ?? "Verifikator 2")}). Menunggu tanda tangan verifikator berikutnya.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium shadow-xs">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Menunggu paraf / tanda tangan dari kedua anggota Tim Verifikasi ({jubirUser?.nama ?? "Verifikator 1"} &amp; {zakariaUser?.nama ?? "Verifikator 2"}) di akun masing-masing.</span>
                  </div>
                )}
              </div>

              {/* 2 Kotak Spesimen Verifikator */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Slot Jubir */}
                <div className="border border-gray-200/90 rounded-2xl p-5 bg-slate-50/70 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Anggota Tim 1</span>
                      {isSignedJubir ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          ✓ Sudah TTD
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Belum TTD
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-sm text-gray-900">{jubirUser?.nama ?? "JUBIR, S.Pd.SD"}</p>
                    <p className="text-xs text-gray-500">{jubirUser?.jabatan ?? "Tim Verifikasi Kecamatan"}</p>

                    {/* Form ubah penandatangan slot 1 — hanya superadmin */}
                    {isAdminOrSuper && !isSignedJubir && (
                      <UbahVerifikatorForm
                        suratId={surat.id}
                        slot="jubir"
                        slotLabel="Anggota Tim 1"
                        currentNama={jubirUser?.nama ?? "JUBIR, S.Pd.SD"}
                        penggunaList={penggunaDropdown}
                      />
                    )}

                    {isSignedJubir && (
                      <div className="mt-3 flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 shadow-xs">
                        {jubirTtdSrc ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={jubirTtdSrc} alt={`TTD ${jubirUser?.nama ?? "Verifikator 1"}`} className="w-16 h-12 mix-blend-multiply object-contain" />
                        ) : (
                          <div className="w-16 h-12 flex items-center justify-center bg-gray-100 rounded text-[10px] text-gray-400 text-center">Tanpa TTD</div>
                        )}
                        <div className="text-xs">
                          <p className="font-semibold text-emerald-700">Tanda Tangan Terpasang</p>
                          <p className="text-[10px] text-gray-400">
                            {surat.dataForm?.ttd_jubir_tanggal ? new Date(surat.dataForm.ttd_jubir_tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "Terverifikasi"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    {!isSignedJubir ? (
                      (isJubirUser || isAdminOrSuper) ? (
                        <form action={async () => {
                          "use server"
                          const { tandaTanganiVerifikasi } = await import("../actions")
                          await tandaTanganiVerifikasi(surat.id, "jubir", user?.nama || jubirUser?.nama || "JUBIR, S.Pd.SD")
                        }} className="w-full">
                          <Button type="submit" size="sm" className="w-full bg-[#2F4A3C] hover:bg-[#23382d] text-white text-xs font-semibold py-2 rounded-xl">
                            <FileCheck className="w-4 h-4 mr-1.5" /> Tanda Tangani ({jubirUser?.nama ?? "Verifikator 1"})
                          </Button>
                        </form>
                      ) : (
                        <p className="text-[11px] text-gray-400 italic text-center">Login sebagai {jubirUser?.nama ?? "Verifikator 1"} untuk menandatangani</p>
                      )
                    ) : (
                      (isJubirUser || isAdminOrSuper) && (
                        <form action={async () => {
                          "use server"
                          const { batalkanTandaTanganiVerifikasi } = await import("../actions")
                          await batalkanTandaTanganiVerifikasi(surat.id, "jubir", user?.nama || jubirUser?.nama || "Verifikator 1")
                        }} className="w-full flex justify-end">
                          <button type="submit" className="text-xs text-red-600 hover:text-red-700 hover:underline font-medium cursor-pointer">
                            Batalkan TTD
                          </button>
                        </form>
                      )
                    )}
                  </div>
                </div>

                {/* 2. Slot Zakaria */}
                <div className="border border-gray-200/90 rounded-2xl p-5 bg-slate-50/70 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Anggota Tim 2</span>
                      {isSignedZakaria ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          ✓ Sudah TTD
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Belum TTD
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-sm text-gray-900">{zakariaUser?.nama ?? "ZAKARIA, A.Ma.Pd"}</p>
                    <p className="text-xs text-gray-500">{zakariaUser?.jabatan ?? "Tim Verifikasi Kecamatan"}</p>

                    {/* Form ubah penandatangan slot 2 — hanya superadmin */}
                    {isAdminOrSuper && !isSignedZakaria && (
                      <UbahVerifikatorForm
                        suratId={surat.id}
                        slot="zakaria"
                        slotLabel="Anggota Tim 2"
                        currentNama={zakariaUser?.nama ?? "ZAKARIA, A.Ma.Pd"}
                        penggunaList={penggunaDropdown}
                      />
                    )}

                    {isSignedZakaria && (
                      <div className="mt-3 flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 shadow-xs">
                        {zakariaTtdSrc ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={zakariaTtdSrc} alt={`TTD ${zakariaUser?.nama ?? "Verifikator 2"}`} className="w-16 h-12 mix-blend-multiply object-contain" />
                        ) : (
                          <div className="w-16 h-12 flex items-center justify-center bg-gray-100 rounded text-[10px] text-gray-400 text-center">Tanpa TTD</div>
                        )}
                        <div className="text-xs">
                          <p className="font-semibold text-emerald-700">Tanda Tangan Terpasang</p>
                          <p className="text-[10px] text-gray-400">
                            {surat.dataForm?.ttd_zakaria_tanggal ? new Date(surat.dataForm.ttd_zakaria_tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "Terverifikasi"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    {!isSignedZakaria ? (
                      (isZakariaUser || isAdminOrSuper) ? (
                        <form action={async () => {
                          "use server"
                          const { tandaTanganiVerifikasi } = await import("../actions")
                          await tandaTanganiVerifikasi(surat.id, "zakaria", user?.nama || zakariaUser?.nama || "ZAKARIA, A.Ma.Pd")
                        }} className="w-full">
                          <Button type="submit" size="sm" className="w-full bg-[#2F4A3C] hover:bg-[#23382d] text-white text-xs font-semibold py-2 rounded-xl">
                            <FileCheck className="w-4 h-4 mr-1.5" /> Tanda Tangani ({zakariaUser?.nama ?? "Verifikator 2"})
                          </Button>
                        </form>
                      ) : (
                        <p className="text-[11px] text-gray-400 italic text-center">Login sebagai {zakariaUser?.nama ?? "Verifikator 2"} untuk menandatangani</p>
                      )
                    ) : (
                      (isZakariaUser || isAdminOrSuper) && (
                        <form action={async () => {
                          "use server"
                          const { batalkanTandaTanganiVerifikasi } = await import("../actions")
                          await batalkanTandaTanganiVerifikasi(surat.id, "zakaria", user?.nama || zakariaUser?.nama || "Verifikator 2")
                        }} className="w-full flex justify-end">
                          <button type="submit" className="text-xs text-red-600 hover:text-red-700 hover:underline font-medium cursor-pointer">
                            Batalkan TTD
                          </button>
                        </form>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Card 4: Aksi Alur Persetujuan (Workflow Actions) */}
          {((surat.status === "draf" && !hasTimVerifikasi && (isKasi || user?.role === "super_admin")) || 
            (surat.status === "verifikasi" && !hasTimVerifikasi && (user?.role === "staf" || user?.role === "super_admin")) || 
            (surat.status === "menunggu_ttd" && (user?.role === "camat" || user?.role === "super_admin")) ||
            (surat.status === "terbit" && (user?.role === "staf" || user?.role === "super_admin"))) && (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <Sparkles className="w-4 h-4 text-[#D9A400]" />
                <h3 className="text-base font-bold text-[#2F4A3C]">Aksi Alur Persetujuan Dokumen</h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {surat.status === "draf" && !hasTimVerifikasi && (isKasi || user?.role === "super_admin") && (
                  <form action={async () => {
                    "use server"
                    const { verifikasiKasi } = await import("../actions")
                    await verifikasiKasi(surat.id, user?.nama || "Super Admin")
                  }}>
                    <Button type="submit" size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold px-4 py-2">
                      <FileCheck className="w-4 h-4 mr-2" /> Verifikasi & Paraf (Kasi)
                    </Button>
                  </form>
                )}

                {surat.status === "verifikasi" && !hasTimVerifikasi && (user?.role === "staf" || user?.role === "super_admin") && (
                  <form action={async () => {
                    "use server"
                    const { teruskanKeCamat } = await import("../actions")
                    await teruskanKeCamat(surat.id, user?.nama || "Super Admin")
                  }}>
                    <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold px-4 py-2">
                      <Send className="w-4 h-4 mr-2" /> Teruskan ke Meja Camat
                    </Button>
                  </form>
                )}

                {surat.status === "menunggu_ttd" && (user?.role === "camat" || user?.role === "super_admin") && (
                  <form action={async () => {
                    "use server"
                    const { terbitkanSurat } = await import("../actions")
                    await terbitkanSurat(surat.id, officialCamatNama)
                  }}>
                    <Button type="submit" size="sm" className="bg-[#2F4A3C] hover:bg-[#23382d] text-white rounded-xl text-xs font-semibold px-5 py-2.5 shadow-sm">
                      <CheckCheck className="w-4 h-4 mr-2 text-[#D9A400]" /> Tandatangani & Terbitkan Surat (Camat)
                    </Button>
                  </form>
                )}

                {surat.status === "terbit" && (user?.role === "staf" || user?.role === "super_admin") && (
                  <form action={async () => {
                    "use server"
                    const { arsipkanSurat } = await import("../actions")
                    await arsipkanSurat(surat.id, user?.nama || "Super Admin")
                  }}>
                    <Button type="submit" size="sm" className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold px-4 py-2">
                      <CheckCheck className="w-4 h-4 mr-2" /> Serahkan / Arsipkan Dokumen
                    </Button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Timeline & Cetak (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card Riwayat & Tahapan Status (Timeline) */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Clock className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-[#2F4A3C]">Riwayat & Tahapan Status</h3>
            </div>

            <div className="space-y-4 relative pl-3 border-l-2 border-slate-200 ml-3">
              {timelineSteps.map((step, idx) => {
                return (
                  <div key={idx} className="relative pl-6">
                    <div
                      className={cn(
                        "absolute -left-[19px] top-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white transition-colors",
                        step.done
                          ? "bg-[#2F4A3C] text-white shadow-xs"
                          : step.active
                          ? "bg-[#D9A400] text-gray-900 ring-emerald-100 shadow-sm"
                          : "bg-slate-200 text-gray-500"
                      )}
                    >
                      {step.done ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <div>
                      <h4
                        className={cn(
                          "text-xs font-bold leading-tight",
                          step.done ? "text-[#2F4A3C]" : step.active ? "text-gray-900" : "text-gray-400"
                        )}
                      >
                        {step.label}
                      </h4>
                      {step.description && (
                        <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">{step.description}</p>
                      )}
                      {step.timestamp && (
                        <span className="text-[10px] text-gray-400 block mt-1 font-mono">
                          {new Date(step.timestamp).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Card Keabsahan Dokumen & Pintasan Cetak */}
          <div className="bg-gradient-to-br from-[#2F4A3C] via-[#355243] to-[#24392e] text-white p-6 rounded-2xl shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-white/20 text-[#D9A400] border border-white/20">
                <ShieldCheck className="w-3 h-3 text-[#D9A400]" /> Dokumen Sah e-TEPI
              </span>
            </div>

            <div>
              <h4 className="font-bold text-sm text-white">Naskah Dinas Terverifikasi</h4>
              <p className="text-xs text-white/80 mt-1 leading-relaxed">
                Naskah ini tersimpan dalam basis data arsip Kecamatan Temiang Pesisir dan dilengkapi spesimen tanda tangan elektronik sah.
              </p>
            </div>

            <Link href={`/internal/surat/${surat.id}/cetak`} target="_blank" className="block">
              <Button className="w-full bg-[#D9A400] hover:bg-[#c49300] text-gray-900 text-xs font-bold py-2.5 rounded-xl shadow-md">
                <Printer className="w-4 h-4 mr-2" /> Buka Lembar Cetak PDF <ExternalLink className="w-3.5 h-3.5 ml-auto" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
