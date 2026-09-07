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
    data_form: suratData.data_form || {},
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
