import { createServiceClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/ui/page-header"
import { AduanTable } from "./aduan-table"

export default async function AduanInternalPage() {
  const supabase = await createServiceClient()
  
  const { data: pengaduanList } = await supabase
    .from("pengaduan")
    .select("*")
    .order("tanggal_masuk", { ascending: false })

  const pengaduan = pengaduanList || []

  return (
    <div>
      <PageHeader
        title="Pengaduan Masyarakat"
        subtitle="Manajemen dan tindak lanjut laporan aspirasi dari warga"
      />

      <AduanTable initialData={pengaduan} />
    </div>
  )
}
