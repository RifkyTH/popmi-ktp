import { createServiceClient } from "@/lib/supabase/server"
import { RekapClient, RealSuratItem } from "./rekap-client"
import { JenisSurat, StatusSurat } from "@/lib/mock-data/surat"

export const revalidate = 0

export default async function RekapPage() {
  const supabase = await createServiceClient()

  // Ambil data real seluruh surat dari tabel surat di database
  const { data: suratList } = await supabase
    .from("surat")
    .select("id, nomor, jenis, judul, pemohon, desa, tanggal_buat, tanggal_terbit, status, dibuat_oleh, diverifikasi_oleh")
    .order("tanggal_buat", { ascending: false })

  const formattedSurat: RealSuratItem[] = (suratList || []).map((s) => ({
    id: s.id,
    nomor: s.nomor,
    jenis: s.jenis as JenisSurat,
    judul: s.judul,
    pemohon: s.pemohon,
    desa: s.desa,
    tanggal_buat: s.tanggal_buat,
    tanggal_terbit: s.tanggal_terbit,
    status: s.status as StatusSurat,
    dibuat_oleh: s.dibuat_oleh,
    diverifikasi_oleh: s.diverifikasi_oleh,
  }))

  return <RekapClient initialSurat={formattedSurat} />
}

