"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { hapusSurat } from "./actions"

export function DeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus surat ini?")) {
      setIsDeleting(true)
      try {
        await hapusSurat(id)
      } catch (err) {
        console.error(err)
        alert("Gagal menghapus surat.")
        setIsDeleting(false)
      }
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-500 hover:text-red-700 transition-colors p-1.5 disabled:opacity-50 flex-shrink-0"
      title="Hapus Surat"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
