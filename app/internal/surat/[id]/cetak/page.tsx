import { notFound } from "next/navigation"
import { createServiceClient } from "@/lib/supabase/server"
import { JENIS_SURAT_LABELS, JenisSurat } from "@/lib/mock-data/surat"
import { generateSuratHTML } from "@/lib/mock-data/generate-surat"
import { PrintLayout } from "@/components/internal/print-layout"
import type { Surat } from "@/lib/mock-data/surat"

export default async function CetakSuratPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServiceClient()

  const { data: suratData } = await supabase
    .from("surat")
    .select("*")
    .eq("id", id)
    .single()

  if (!suratData) notFound()

  // Fetch riwayat to pass to generateSuratHTML
  const { data: riwayatData } = await supabase
    .from("surat_riwayat")
    .select("*")
    .eq("surat_id", id)
    .order("tanggal", { ascending: true })

  // Ambil spesimen TTD terbaru dari tabel pengguna agar PDF selalu sinkron dengan foto/spesimen yang diupload di profil
  const { data: signers } = await supabase
    .from("pengguna")
    .select("id, username, role, nama, ttd_url")

  // Cek override penandatangan oleh superadmin
  const dataForm = (suratData.data_form || {}) as Record<string, any>
  const overrideJubir = dataForm?.penandatangan_jubir as { userId: string; nama: string; jabatan: string; ttd_url: string | null } | undefined
  const overrideZakaria = dataForm?.penandatangan_zakaria as { userId: string; nama: string; jabatan: string; ttd_url: string | null } | undefined

  const camatUser = signers?.find((u) => u.role === "camat")

  // Resolusi user efektif: prioritaskan override, lalu default berdasarkan username/role
  const jubirUser = overrideJubir
    ? signers?.find((u) => u.id === overrideJubir.userId) ?? { id: overrideJubir.userId, nama: overrideJubir.nama, ttd_url: overrideJubir.ttd_url }
    : (signers?.find((u) => u.username === "jubir" || u.role === "sekretaris" || u.nama?.toLowerCase().includes("jubir")) ?? null)

  const zakariaUser = overrideZakaria
    ? signers?.find((u) => u.id === overrideZakaria.userId) ?? { id: overrideZakaria.userId, nama: overrideZakaria.nama, ttd_url: overrideZakaria.ttd_url }
    : (signers?.find((u) => u.username === "zakaria" || u.role === "kasi_kesos" || u.nama?.toLowerCase().includes("zakaria")) ?? null)

  // TTD HANYA jika pengguna yang bersangkutan sudah mengupload TTD di profilnya
  const jubirTtd = jubirUser?.id ? (signers?.find((u) => u.id === jubirUser.id)?.ttd_url || null) : null
  const zakariaTtd = zakariaUser?.id ? (signers?.find((u) => u.id === zakariaUser.id)?.ttd_url || null) : null

  const effectiveDataForm = {
    ...(suratData.data_form || {}),
    ttd_camat_url: camatUser?.ttd_url || suratData.data_form?.ttd_camat_url || "/ttd-camat.jpeg",
    // TTD verifikator: HANYA jika pengguna sudah upload TTD di profilnya, jika belum maka null (kosong)
    ttd_jubir_url: jubirTtd,
    ttd_zakaria_url: zakariaTtd,
    // Nama verifikator efektif untuk PDF
    verifikator_1_nama: jubirUser?.nama || "JUBIR, S.Pd.SD",
    verifikator_2_nama: zakariaUser?.nama || "ZAKARIA, A.Ma.Pd",
  }

  // Map Supabase snake_case to the Surat type expected by generateSuratHTML
  const surat: Surat = {
    id: suratData.id,
    nomor: suratData.nomor,
    jenis: suratData.jenis as JenisSurat,
    judul: suratData.judul,
    pemohon: suratData.pemohon,
    desa: suratData.desa ?? undefined,
    tanggalBuat: suratData.tanggal_buat,
    tanggalTerbit: suratData.tanggal_terbit ?? undefined,
    status: suratData.status,
    dibuatOleh: suratData.dibuat_oleh,
    diverifikasiOleh: suratData.diverifikasi_oleh ?? undefined,
    disetujuiOleh: suratData.disetujui_oleh ?? undefined,
    perihal: suratData.perihal,
    data_form: effectiveDataForm,
    riwayat: (riwayatData || []).map((r) => ({
      status: r.status,
      oleh: r.oleh,
      tanggal: r.tanggal,
      catatan: r.catatan ?? undefined,
    })),
  }

  // Generate HTML isi surat menggunakan template e-TEPI (pure inline styles)
  const html = generateSuratHTML(surat)
  const title = `${JENIS_SURAT_LABELS[surat.jenis] ?? surat.jenis} – ${surat.pemohon}`

  return <PrintLayout suratId={id} html={html} title={title} />
}
