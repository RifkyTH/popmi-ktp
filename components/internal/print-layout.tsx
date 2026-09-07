"use client"

import { useEffect, useRef } from "react"

interface PrintLayoutProps {
  suratId: string
  html: string
  title?: string
}

/**
 * Komponen yang me-render isi surat ke dalam iframe dengan styling
 * identik dengan e-TEPI (print.js), sehingga tampilan di browser
 * dan hasil PDF persis sama.
 */
export function PrintLayout({ suratId, html, title = "Cetak Dokumen" }: PrintLayoutProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const doc = iframe.contentWindow?.document
    if (!doc) return

    doc.open()
    doc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @page { size: A4 portrait; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #fff; font-family: Arial, sans-serif; font-size: 12pt; color: #000; margin: 0; }
    .print-page {
      width: 210mm;
      min-height: 297mm;
      padding: 10mm 20mm 15mm 25mm;
      background: #fff;
      margin: 0 auto;
      page-break-after: always;
      word-break: break-word;
      overflow-wrap: break-word;
    }
    table { border-collapse: collapse; }
    @media print {
      body { margin: 0; }
      .print-page { padding: 10mm 20mm 15mm 25mm; margin: 0; }
    }
  </style>
</head>
<body>${html}</body>
</html>`)
    doc.close()
  }, [html, title])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toolbar - hidden saat print */}
      <div className="print:hidden fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href={`/internal/surat/${suratId}`}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              ← Kembali
            </a>
            <span className="text-gray-300">|</span>
            <span className="text-sm font-medium text-gray-700">{title}</span>
          </div>
          <button
            onClick={() => {
              if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.focus()
                iframeRef.current.contentWindow.print()
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow transition-colors flex items-center gap-2"
          >
            🖨️ Cetak / Simpan PDF
          </button>
        </div>
      </div>

      {/* Preview iframe — tampilan identik dengan output print */}
      <div className="pt-14 print:pt-0 flex justify-center py-8 print:py-0">
        <iframe
          ref={iframeRef}
          title={title}
          style={{
            width: "210mm",
            minHeight: "297mm",
            border: "none",
            background: "white",
            boxShadow: "0 0 20px rgba(0,0,0,0.15)",
          }}
          className="print:shadow-none"
        />
      </div>
    </div>
  )
}
