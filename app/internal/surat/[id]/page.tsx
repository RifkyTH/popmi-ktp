import { notFound } from "next/navigation"
import Link from "next/link"
import { cookies } from "next/headers"
import { getSessionFromCookie, AUTH_COOKIE_NAME } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/server"
import { JENIS_SURAT_LABELS, STATUS_LABELS, StatusSurat, JenisSurat } from "@/lib/mock-data/surat"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { StatusTimeline } from "@/components/ui/status-timeline"
import { Printer, ArrowLeft, FileCheck, CheckCheck, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"

const statusColors: Record<StatusSurat, string> = {
  draf: "bg-gray-100 text-gray-700",
  verifikasi: "bg-blue-100 text-blue-700",
  menunggu_ttd: "bg-orange-100 text-orange-700",
  terbit: "bg-green-100 text-green-700",
  terkirim: "bg-teal-100 text-teal-700",
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
  const isJubirUser = Boolean(user?.username?.toLowerCase().includes("jubir") || user?.nama?.toLowerCase().includes("jubir"))
  const isZakariaUser = Boolean(user?.username?.toLowerCase().includes("zakaria") || user?.nama?.toLowerCase().includes("zakaria"))
  const isAdminOrSuper = user?.role === "super_admin" || user?.role === "admin"
  const isSignedJubir = Boolean(surat.dataForm?.ttd_jubir) && surat.dataForm?.ttd_jubir !== "false"
  const isSignedZakaria = Boolean(surat.dataForm?.ttd_zakaria) && surat.dataForm?.ttd_zakaria !== "false"

  const currentIndex = STATUS_ORDER.indexOf(surat.status)
  const timelineSteps = STATUS_ORDER.map((status, i) => {
    const riwayatItem = riwayat.find((r) => r.status === status)
    return {
      label: STATUS_LABELS[status],
      description: riwayatItem
        ? `oleh ${riwayatItem.oleh}${riwayatItem.catatan ? " — " + riwayatItem.catatan : ""}`
        : undefined,
      timestamp: riwayatItem?.tanggal,
      done: i < currentIndex,
      active: i === currentIndex,
    }
  })

  return (
    <div>
      <PageHeader
        title={surat.judul}
        subtitle={`${JENIS_SURAT_LABELS[surat.jenis] ?? surat.jenis} · Dibuat ${surat.tanggalBuat}`}
      >
        <Link href="/internal/surat">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Button>
        </Link>
        {surat.status === "draf" && (
          <Link href={`/internal/surat/${surat.id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="w-4 h-4" /> Edit
            </Button>
          </Link>
        )}
        <Link href={`/internal/surat/${surat.id}/cetak`} target="_blank">
          <Button size="sm">
            <Printer className="w-4 h-4" /> Cetak / PDF
          </Button>
        </Link>
      </PageHeader>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Detail */}
        <div className="lg:col-span-2 space-y-5">
          {/* Info surat */}
          <div className="bg-white rounded-xl border border-kuning-muda p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold font-serif text-hijau text-lg">Informasi Surat</h2>
              <span className={cn("px-3 py-1 rounded-full text-xs font-bold", statusColors[surat.status] ?? "bg-gray-100 text-gray-700")}>
                {STATUS_LABELS[surat.status] ?? surat.status}
              </span>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-teks/50 mb-0.5">Nomor Surat</dt>
                <dd className="font-mono text-teks">{surat.nomor}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-teks/50 mb-0.5">Jenis</dt>
                <dd className="text-teks">{JENIS_SURAT_LABELS[surat.jenis] ?? surat.jenis}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-teks/50 mb-0.5">Pemohon</dt>
                <dd className="text-teks">{surat.pemohon}</dd>
              </div>
              {surat.desa && (
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-teks/50 mb-0.5">Desa</dt>
                  <dd className="text-teks">Desa {surat.desa}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-teks/50 mb-0.5">Perihal</dt>
                <dd className="text-teks">{surat.perihal}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-teks/50 mb-0.5">Tanggal Buat</dt>
                <dd className="text-teks">{surat.tanggalBuat}</dd>
              </div>
              {surat.tanggalTerbit && (
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-teks/50 mb-0.5">Tanggal Terbit</dt>
                  <dd className="text-teks font-medium text-green-700">{surat.tanggalTerbit}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-teks/50 mb-0.5">Dibuat Oleh</dt>
                <dd className="text-teks">{surat.dibuatOleh}</dd>
              </div>
              {surat.diverifikasiOleh && (
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-teks/50 mb-0.5">Diverifikasi Oleh</dt>
                  <dd className="text-teks">{surat.diverifikasiOleh}</dd>
                </div>
              )}
              {surat.disetujuiOleh && (
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-teks/50 mb-0.5">Disetujui/TTD Oleh</dt>
                  <dd className="text-teks">{surat.disetujuiOleh}</dd>
                </div>
              )}
            </dl>

            {/* Preview TTD Camat — tampil setelah surat diterbitkan */}
            {(surat.status === "terbit" || surat.status === "terkirim") && (
              <div className="mt-5 pt-5 border-t border-kuning-muda">
                <p className="text-xs font-bold uppercase tracking-wider text-teks/50 mb-3">
                  Tanda Tangan Digital Camat
                </p>
                <div className="flex items-end gap-6">
                  <div className="text-center">
                    <div className="relative inline-block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/ttd-camat.jpeg"
                        alt="TTD Camat"
                        className="w-28 h-auto mix-blend-multiply"
                      />
                    </div>
                    <p className="text-xs font-bold underline mt-1">HENDRA, S.STP</p>
                    <p className="text-[10px] text-teks/60">CAMAT TEMIANG PESISIR</p>
                    <p className="text-[10px] text-teks/60">PEMBINA / IV.a</p>
                    <p className="text-[10px] text-teks/60">NIP. 198507122006021001</p>
                  </div>
                  <div className="mb-1 text-xs text-green-700 flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <span className="text-base">✅</span>
                    <span>
                      Ditandatangani oleh <strong>{surat.disetujuiOleh || "Camat"}</strong>
                      {surat.tanggalTerbit && (
                        <> pada {new Date(surat.tanggalTerbit).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Data Isian Form */}
          {Object.keys(surat.dataForm).length > 0 && (
            <div className="bg-white rounded-xl border border-kuning-muda p-6 mt-5">
              <h2 className="font-bold font-serif text-hijau text-lg mb-4">Detail Data Isian</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                {Object.entries(surat.dataForm).map(([key, value]) => (
                  <div key={key} className="break-words">
                    <dt className="text-xs font-bold uppercase tracking-wider text-teks/50 mb-0.5">
                      {/* Format camelCase to Title Case approximately */}
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </dt>
                    <dd className="text-teks font-medium whitespace-pre-wrap">
                      {value ? String(value) : "-"}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Tanda Tangan Tim Verifikasi Kecamatan */}
          {hasTimVerifikasi && (
            <div className="bg-white rounded-xl border border-kuning-muda p-6 mt-5">
              <div className="mb-4">
                <h2 className="font-bold font-serif text-hijau text-lg">Tanda Tangan Tim Verifikasi Kecamatan</h2>
                <p className="text-xs text-teks/60 mt-0.5">
                  Berita Acara Verifikasi ditandatangani oleh kedua anggota tim di bawah ini. Setelah kedua orang menandatangani, surat akan otomatis diteruskan ke Camat.
                </p>

                {/* Status Ringkasan */}
                <div className="mt-3">
                  {isSignedJubir && isSignedZakaria ? (
                    <div className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800 font-medium">
                      <span className="text-base">✅</span>
                      <span>Verifikasi lengkap oleh kedua anggota (Jubir & Zakaria). Surat otomatis diteruskan ke Camat untuk ditandatangani.</span>
                    </div>
                  ) : (isSignedJubir || isSignedZakaria) ? (
                    <div className="flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 font-medium">
                      <span className="text-base">⏳</span>
                      <span>1 dari 2 anggota telah menandatangani ({isSignedJubir ? "Jubir, S.Pd.SD" : "Zakaria, A.Ma.Pd"}). Menunggu tanda tangan {isSignedJubir ? "Zakaria, A.Ma.Pd" : "Jubir, S.Pd.SD"} agar otomatis diteruskan ke Camat.</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 font-medium">
                      <span className="text-base">📋</span>
                      <span>Menunggu tanda tangan dari kedua anggota Tim Verifikasi di akun masing-masing.</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. JUBIR */}
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teks/50">Anggota Tim 1</span>
                      {isSignedJubir ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
                          ✓ Sudah TTD
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Belum TTD
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-sm text-teks">JUBIR, S.Pd.SD</p>
                    <p className="text-xs text-teks/60">Tim Verifikasi Kecamatan</p>

                    {isSignedJubir && (
                      <div className="mt-3 flex items-center gap-3 p-2.5 bg-white rounded-lg border border-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/ttd-digital.jpeg" alt="TTD Jubir" className="w-12 h-12 mix-blend-multiply object-contain" />
                        <div className="text-xs text-teks/70">
                          <p className="font-semibold text-green-700">Tanda Tangan Digital Terpasang</p>
                          <p className="text-[11px] text-teks/50">
                            {surat.dataForm?.ttd_jubir_tanggal ? new Date(surat.dataForm.ttd_jubir_tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Terverifikasi"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
                    {!isSignedJubir ? (
                      (isJubirUser || isAdminOrSuper) ? (
                        <form action={async () => {
                          "use server"
                          const { tandaTanganiVerifikasi } = await import("../actions")
                          await tandaTanganiVerifikasi(surat.id, "jubir", user?.nama || "JUBIR, S.Pd.SD")
                        }} className="w-full">
                          <Button type="submit" size="sm" className="w-full bg-hijau hover:bg-hijau/90 text-white font-medium">
                            <FileCheck className="w-4 h-4 mr-1.5" /> Tanda Tangani (Jubir, S.Pd.SD)
                          </Button>
                        </form>
                      ) : (
                        <p className="text-xs text-teks/40 italic">Login sebagai akun Jubir untuk menandatangani</p>
                      )
                    ) : (
                      (isJubirUser || isAdminOrSuper) && (
                        <form action={async () => {
                          "use server"
                          const { batalkanTandaTanganiVerifikasi } = await import("../actions")
                          await batalkanTandaTanganiVerifikasi(surat.id, "jubir", user?.nama || "Jubir")
                        }} className="w-full flex justify-end">
                          <button type="submit" className="text-xs text-red-600 hover:underline">
                            Batalkan TTD
                          </button>
                        </form>
                      )
                    )}
                  </div>
                </div>

                {/* 2. ZAKARIA */}
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teks/50">Anggota Tim 2</span>
                      {isSignedZakaria ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
                          ✓ Sudah TTD
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Belum TTD
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-sm text-teks">ZAKARIA, A.Ma.Pd</p>
                    <p className="text-xs text-teks/60">Tim Verifikasi Kecamatan</p>

                    {isSignedZakaria && (
                      <div className="mt-3 flex items-center gap-3 p-2.5 bg-white rounded-lg border border-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/ttd-digital.jpeg" alt="TTD Zakaria" className="w-12 h-12 mix-blend-multiply object-contain" />
                        <div className="text-xs text-teks/70">
                          <p className="font-semibold text-green-700">Tanda Tangan Digital Terpasang</p>
                          <p className="text-[11px] text-teks/50">
                            {surat.dataForm?.ttd_zakaria_tanggal ? new Date(surat.dataForm.ttd_zakaria_tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Terverifikasi"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
                    {!isSignedZakaria ? (
                      (isZakariaUser || isAdminOrSuper) ? (
                        <form action={async () => {
                          "use server"
                          const { tandaTanganiVerifikasi } = await import("../actions")
                          await tandaTanganiVerifikasi(surat.id, "zakaria", user?.nama || "ZAKARIA, A.Ma.Pd")
                        }} className="w-full">
                          <Button type="submit" size="sm" className="w-full bg-hijau hover:bg-hijau/90 text-white font-medium">
                            <FileCheck className="w-4 h-4 mr-1.5" /> Tanda Tangani (Zakaria, A.Ma.Pd)
                          </Button>
                        </form>
                      ) : (
                        <p className="text-xs text-teks/40 italic">Login sebagai akun Zakaria untuk menandatangani</p>
                      )
                    ) : (
                      (isZakariaUser || isAdminOrSuper) && (
                        <form action={async () => {
                          "use server"
                          const { batalkanTandaTanganiVerifikasi } = await import("../actions")
                          await batalkanTandaTanganiVerifikasi(surat.id, "zakaria", user?.nama || "Zakaria")
                        }} className="w-full flex justify-end">
                          <button type="submit" className="text-xs text-red-600 hover:underline">
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

        {/* Actions */}
        {((surat.status === "draf" && !hasTimVerifikasi && (isKasi || user?.role === "super_admin")) || 
          (surat.status === "verifikasi" && !hasTimVerifikasi && (user?.role === "staf" || user?.role === "super_admin")) || 
          (surat.status === "menunggu_ttd" && (user?.role === "camat" || user?.role === "super_admin")) ||
          (surat.status === "terbit" && (user?.role === "staf" || user?.role === "super_admin"))) && (
          <div className="bg-white rounded-xl border border-kuning-muda p-6 mt-5">
            <h2 className="font-bold font-serif text-hijau text-base mb-3">Aksi Tersedia</h2>
            <div className="flex flex-wrap gap-3">
              {surat.status === "draf" && !hasTimVerifikasi && (isKasi || user?.role === "super_admin") && (
                <form action={async () => {
                  "use server"
                  const { verifikasiKasi } = await import("../actions")
                  await verifikasiKasi(surat.id, user?.nama || "Super Admin")
                }}>
                  <Button type="submit" size="sm" variant="secondary">
                    <FileCheck className="w-4 h-4 mr-2" /> Verifikasi (Kasi)
                  </Button>
                </form>
              )}
              {surat.status === "verifikasi" && !hasTimVerifikasi && (user?.role === "staf" || user?.role === "super_admin") && (
                <form action={async () => {
                  "use server"
                  const { teruskanKeCamat } = await import("../actions")
                  await teruskanKeCamat(surat.id, user?.nama || "Super Admin")
                }}>
                  <Button type="submit" size="sm" variant="secondary">
                    <FileCheck className="w-4 h-4 mr-2" /> Teruskan ke Camat
                  </Button>
                </form>
              )}
              {surat.status === "menunggu_ttd" && (user?.role === "camat" || user?.role === "super_admin") && (
                <form action={async () => {
                  "use server"
                  const { terbitkanSurat } = await import("../actions")
                  await terbitkanSurat(surat.id, user?.nama || "Super Admin")
                }}>
                  <Button type="submit" size="sm">
                    <CheckCheck className="w-4 h-4 mr-2" /> Tandatangani &amp; Terbitkan (Camat)
                  </Button>
                </form>
              )}
              {surat.status === "terbit" && (user?.role === "staf" || user?.role === "super_admin") && (
                <form action={async () => {
                  "use server"
                  const { arsipkanSurat } = await import("../actions")
                  await arsipkanSurat(surat.id, user?.nama || "Super Admin")
                }}>
                  <Button type="submit" size="sm" className="bg-teal-600 hover:bg-teal-700">
                    <CheckCheck className="w-4 h-4 mr-2" /> Serahkan / Arsipkan Surat
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl border border-kuning-muda p-6 h-fit">
          <h2 className="font-bold font-serif text-hijau text-base mb-5">Riwayat Status</h2>
          <StatusTimeline steps={timelineSteps} />
        </div>
      </div>
    </div>
  )
}
