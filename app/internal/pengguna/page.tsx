import { getPengguna } from "./actions"
import { PenggunaClient } from "./pengguna-client"

export const revalidate = 0

export default async function PenggunaPage() {
  const pengguna = await getPengguna()

  return <PenggunaClient penggunaList={pengguna} />
}

