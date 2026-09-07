"use client"

export function PrintButton({ suratId }: { suratId: string }) {
  return (
    <div className="print:hidden fixed top-4 right-4 z-10 flex gap-2">
      <button
        onClick={() => window.print()}
        className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-md transition-all flex items-center gap-1.5"
      >
        🖨️ Cetak / Simpan PDF
      </button>
      <a
        href={`/internal/surat/${suratId}`}
        className="bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        ← Kembali
      </a>
    </div>
  )
}
