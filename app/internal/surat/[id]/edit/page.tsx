import { notFound } from "next/navigation"
import { createServiceClient } from "@/lib/supabase/server"
import { JenisSurat } from "@/lib/mock-data/surat"
import EditSuratClient from "./client"

export default async function EditSuratPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = await createServiceClient()
  const { data: suratData } = await supabase
    .from("surat")
    .select("*")
    .eq("id", id)
    .single()

  if (!suratData) notFound()

  // Hanya bisa edit kalau masih draf
  if (suratData.status !== "draf") {
    return (
      <div className="p-6 text-center text-red-600">
        Surat ini tidak dapat diedit karena statusnya sudah <strong>{suratData.status}</strong>.
      </div>
    )
  }

  return (
    <EditSuratClient
      suratId={suratData.id}
      jenis={suratData.jenis as JenisSurat}
      nomor={suratData.nomor}
      initialData={suratData.data_form || {}}
    />
  )
}
