import { createServiceClient } from "@/lib/supabase/server"
import { ArsipClient, RealArsipItem } from "./arsip-client"
import { JenisSurat } from "@/lib/mock-data/surat"

export const revalidate = 0

export default async function ArsipPage() {
  const supabase = await createServiceClient()

  // Ambil hanya surat yang sudah sah / diterbitkan (terbit / terkirim)
  const { data: arsipList } = await supabase
    .from("surat")
    .select("id, nomor, jenis, judul, pemohon, desa, tanggal_terbit, tanggal_buat, status, disetujui_oleh")
    .in("status", ["terbit", "terkirim"])
    .order("tanggal_buat", { ascending: false })

  const formattedArsip: RealArsipItem[] = (arsipList || []).map((s) => ({
    id: s.id,
    nomor: s.nomor,
    jenis: s.jenis as JenisSurat,
    judul: s.judul,
    pemohon: s.pemohon,
    desa: s.desa,
    tanggal_buat: s.tanggal_buat,
    tanggal_terbit: s.tanggal_terbit,
    status: s.status,
    disetujui_oleh: s.disetujui_oleh,
  }))

  return <ArsipClient initialArsip={formattedArsip} />
}

