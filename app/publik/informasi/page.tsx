import { getInformasiList } from "@/lib/actions/informasi"
import { InformasiListClient } from "./informasi-list-client"
import { Metadata } from "next"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Pusat Informasi & Pengumuman - POPMI KTP",
  description: "Berita resmi, maklumat pelayanan, dan agenda kegiatan pemerintahan Kecamatan Temiang Pesisir, Kabupaten Lingga.",
}

export default async function InformasiPage() {
  const initialData = await getInformasiList({ publishedOnly: true })

  return <InformasiListClient initialData={initialData} />
}
