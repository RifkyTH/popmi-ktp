import { createServiceClient } from "@/lib/supabase/server"
import { AduanTable } from "./aduan-table"

export const revalidate = 0

export default async function AduanInternalPage() {
  const supabase = await createServiceClient()
  
  const { data: pengaduanList } = await supabase
    .from("pengaduan")
    .select("*")
    .order("tanggal_masuk", { ascending: false })

  const pengaduan = pengaduanList || []

  return <AduanTable initialData={pengaduan} />
}

