"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { hapusSemuaSurat } from "./actions"
import { Button } from "@/components/ui/button"

export function DeleteAllButton() {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteAll = async () => {
    if (confirm("AWAS: Apakah Anda yakin ingin menghapus SEMUA surat? Tindakan ini tidak dapat dibatalkan!")) {
      setIsDeleting(true)
      try {
        await hapusSemuaSurat()
      } catch (err) {
        console.error(err)
        alert("Gagal menghapus semua surat.")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <Button 
      variant="destructive"
      onClick={handleDeleteAll}
      disabled={isDeleting}
    >
      <Trash2 className="w-4 h-4 mr-2" />
      Hapus Semua
    </Button>
  )
}
