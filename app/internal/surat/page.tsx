import { createServiceClient } from "@/lib/supabase/server"
import { DaftarSuratClient, RealSuratItem } from "./daftar-surat-client"

export const revalidate = 0

export default async function DaftarSuratPage() {
  const supabase = await createServiceClient()
  const { data: suratList } = await supabase
    .from("surat")
    .select("id, nomor, jenis, judul, pemohon, desa, tanggal_buat, tanggal_terbit, status, dibuat_oleh, diverifikasi_oleh, disetujui_oleh")
    .order("tanggal_buat", { ascending: false })

  const surat: RealSuratItem[] = (suratList || []).map((s) => ({
    id: s.id,
    nomor: s.nomor,
    jenis: s.jenis,
    judul: s.judul,
    pemohon: s.pemohon,
    desa: s.desa,
    tanggal_buat: s.tanggal_buat,
    tanggal_terbit: s.tanggal_terbit,
    status: s.status,
    dibuat_oleh: s.dibuat_oleh,
    diverifikasi_oleh: s.diverifikasi_oleh,
    disetujui_oleh: s.disetujui_oleh,
  }))

  return <DaftarSuratClient initialSurat={surat} />
}

