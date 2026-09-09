import { getPengguna } from "./actions"
import { PageHeader } from "@/components/ui/page-header"
import { PenggunaClient } from "./pengguna-client"

export default async function PenggunaPage() {
  const pengguna = await getPengguna()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Pengguna"
        subtitle="Kelola akun, role, dan hak akses pengguna sistem internal"
      />
      <PenggunaClient penggunaList={pengguna} />
    </div>
  )
}
