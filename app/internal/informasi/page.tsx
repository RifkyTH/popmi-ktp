import { cookies } from "next/headers"
import { getSessionFromCookie } from "@/lib/auth"
import { getInformasiList } from "@/lib/actions/informasi"
import { InformasiClient } from "./informasi-client"
import { Metadata } from "next"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Publikasi & Berita - SILAT-TP",
  description: "Manajemen informasi, pengumuman, dan berita publik Kecamatan Temiang Pesisir",
}

export default async function InternalInformasiPage() {
  const cookieStore = await cookies()
  const user = getSessionFromCookie(cookieStore.get("silat_session")?.value)
  const initialData = await getInformasiList()

  return <InformasiClient initialData={initialData} currentUser={user} />
}
