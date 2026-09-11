"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Palette,
  Highlighter,
  Link as LinkIcon,
  Minus,
  Table as TableIcon,
  Undo2,
  Redo2,
  RemoveFormatting,
  Code2,
  Eye,
  Check,
  X,
  Type,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface WordEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

const TEXT_COLORS = [
  { label: "Hitam Naskah", color: "#1e293b" },
  { label: "Hijau Temiang", color: "#2F4A3C" },
  { label: "Emas Lingga", color: "#D9A400" },
  { label: "Biru Dinas", color: "#1d4ed8" },
  { label: "Merah Penting", color: "#dc2626" },
  { label: "Abu-abu", color: "#64748b" },
]

const HIGHLIGHT_COLORS = [
  { label: "Kuning Stabilo", color: "#fef08a" },
  { label: "Hijau Stabilo", color: "#bbf7d0" },
  { label: "Biru Stabilo", color: "#bfdbfe" },
  { label: "Merah Muda", color: "#fecdd3" },
  { label: "Tanpa Stabilo", color: "transparent" },
]

// Helper to convert legacy markdown/plaintext into clean HTML
function formatInitialHtml(content: string): string {
  if (!content) return "<p><br></p>"
  // If content already contains HTML tags, return as is
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return content
  }

  // Convert legacy linebreaks and markdown asterisks to HTML paragraphs
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => {
      let formatted = p.trim()
      // bold **text**
      formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // italic *text*
      formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>")
      // single line break to <br/>
      formatted = formatted.replace(/\n/g, "<br/>")
      return `<p>${formatted}</p>`
    })
    .join("")

  return paragraphs || "<p><br></p>"
}

export function WordEditor({
  value,
  onChange,
  placeholder = "Tulis isi naskah berita, informasi, atau pengumuman di sini...",
  minHeight = "280px",
}: WordEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const isInternalChangeRef = useRef(false)
  const [isSourceMode, setIsSourceMode] = useState(false)
  const [htmlSource, setHtmlSource] = useState("")
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    justifyFull: false,
    insertUnorderedList: false,
    insertOrderedList: false,
    formatBlock: "p",
  })

  // Popover menus
  const [showColorMenu, setShowColorMenu] = useState(false)
  const [showHighlightMenu, setShowHighlightMenu] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const savedSelectionRef = useRef<Range | null>(null)

  // Word & Character count
  const [stats, setStats] = useState({ words: 0, characters: 0 })

  // Initialize editor content once or when external value changes drastically
  useEffect(() => {
    if (!editorRef.current) return
    if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false
      return
    }

    const currentHtml = editorRef.current.innerHTML
    const targetHtml = formatInitialHtml(value)

    if (currentHtml !== targetHtml) {
      editorRef.current.innerHTML = targetHtml
      updateStats(targetHtml)
    }
  }, [value])

  const updateStats = (html: string) => {
    if (typeof window === "undefined") return
    const temp = document.createElement("div")
    temp.innerHTML = html
    const text = temp.textContent || temp.innerText || ""
    const trimmed = text.trim()
    const words = trimmed ? trimmed.split(/\s+/).length : 0
    const characters = text.length
    setStats({ words, characters })
  }

  // Update active formatting states based on current selection
  const checkActiveFormats = useCallback(() => {
    if (typeof document === "undefined") return
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikethrough: document.queryCommandState("strikeThrough"),
      justifyLeft: document.queryCommandState("justifyLeft"),
      justifyCenter: document.queryCommandState("justifyCenter"),
      justifyRight: document.queryCommandState("justifyRight"),
      justifyFull: document.queryCommandState("justifyFull"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
      insertOrderedList: document.queryCommandState("insertOrderedList"),
      formatBlock: document.queryCommandValue("formatBlock") || "p",
    })
  }, [])

  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (isSourceMode || !editorRef.current) return
    editorRef.current.focus()
    document.execCommand(command, false, value)
    handleEditorInput()
    checkActiveFormats()
  }

  const handleEditorInput = () => {
    if (!editorRef.current) return
    const html = editorRef.current.innerHTML
    isInternalChangeRef.current = true
    onChange(html)
    updateStats(html)
  }

  // Save current text selection before opening popovers/modals
  const saveSelection = () => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange()
    }
  }

  // Restore text selection
  const restoreSelection = () => {
    if (savedSelectionRef.current && window.getSelection) {
      const sel = window.getSelection()
      if (sel) {
        sel.removeAllRanges()
        sel.addRange(savedSelectionRef.current)
      }
    }
  }

  const handleOpenLinkModal = () => {
    saveSelection()
    const sel = window.getSelection()
    setLinkText(sel ? sel.toString() : "")
    setLinkUrl("")
    setShowLinkModal(true)
  }

  const handleInsertLink = (e: React.FormEvent) => {
    e.preventDefault()
    if (!linkUrl) return
    restoreSelection()

    if (linkText && (!savedSelectionRef.current || savedSelectionRef.current.collapsed)) {
      const anchorHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-emerald-700 underline font-semibold hover:text-emerald-900">${linkText}</a>`
      executeCommand("insertHTML", anchorHtml)
    } else {
      executeCommand("createLink", linkUrl)
    }

    setShowLinkModal(false)
    setLinkUrl("")
    setLinkText("")
  }

  const handleInsertTable = (rows = 3, cols = 3) => {
    let tableHtml = `<table class="min-w-full border-collapse border border-slate-300 my-4 text-xs"><thead><tr class="bg-slate-100">`
    for (let c = 1; c <= cols; c++) {
      tableHtml += `<th class="border border-slate-300 p-2 font-bold text-slate-800">Kolom ${c}</th>`
    }
    tableHtml += `</tr></thead><tbody>`
    for (let r = 1; r < rows; r++) {
      tableHtml += `<tr>`
      for (let c = 1; c <= cols; c++) {
        tableHtml += `<td class="border border-slate-300 p-2 text-slate-700">Data ${r}.${c}</td>`
      }
      tableHtml += `</tr>`
    }
    tableHtml += `</tbody></table><p><br></p>`
    executeCommand("insertHTML", tableHtml)
  }

  const handleToggleSourceMode = () => {
    if (!isSourceMode) {
      // Switch to HTML code view
      setHtmlSource(editorRef.current?.innerHTML || "")
      setIsSourceMode(true)
    } else {
      // Switch back to WYSIWYG view
      if (editorRef.current) {
        editorRef.current.innerHTML = htmlSource
      }
      onChange(htmlSource)
      updateStats(htmlSource)
      setIsSourceMode(false)
    }
  }

  return (
    <div className="w-full rounded-2xl border border-slate-300/80 bg-white shadow-xs overflow-hidden flex flex-col focus-within:border-[#2F4A3C] focus-within:ring-2 focus-within:ring-[#2F4A3C]/10 transition-all">
      {/* 1. MS Word Style Ribbon Toolbar */}
      <div className="bg-slate-50/90 border-b border-slate-200 p-2 select-none flex flex-wrap items-center gap-1 sm:gap-1.5 text-slate-700">
        {/* Undo / Redo Group */}
        <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => executeCommand("undo")}
            title="Urungkan (Ctrl+Z)"
            className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("redo")}
            title="Ulangi (Ctrl+Y)"
            className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-5 w-px bg-slate-200 mx-0.5 hidden xs:block" />

        {/* Paragraph & Heading Styles Dropdown */}
        <div className="flex items-center">
          <select
            value={activeFormats.formatBlock.toLowerCase()}
            onChange={(e) => {
              const tag = e.target.value
              if (tag === "blockquote") {
                executeCommand("formatBlock", "<blockquote>")
              } else if (tag.startsWith("h")) {
                executeCommand("formatBlock", `<${tag}>`)
              } else {
                executeCommand("formatBlock", "<p>")
              }
            }}
            title="Gaya Paragraf & Judul"
            className="h-8 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 focus:outline-none focus:border-[#2F4A3C] shadow-2xs cursor-pointer"
          >
            <option value="p">Normal (Paragraf)</option>
            <option value="h1">Judul Utama (H1)</option>
            <option value="h2">Sub Judul (H2)</option>
            <option value="h3">Sub Bagian (H3)</option>
            <option value="blockquote">Kutipan Naskah (Quote)</option>
          </select>
        </div>

        <div className="h-5 w-px bg-slate-200 mx-0.5 hidden xs:block" />

        {/* Font Formats: B, I, U, S */}
        <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => executeCommand("bold")}
            title="Tebal (Ctrl+B)"
            className={cn(
              "p-1.5 rounded transition-all",
              activeFormats.bold
                ? "bg-[#2F4A3C] text-white font-bold"
                : "hover:bg-slate-100 text-slate-700"
            )}
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("italic")}
            title="Miring (Ctrl+I)"
            className={cn(
              "p-1.5 rounded transition-all",
              activeFormats.italic
                ? "bg-[#2F4A3C] text-white"
                : "hover:bg-slate-100 text-slate-700"
            )}
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("underline")}
            title="Garis Bawah (Ctrl+U)"
            className={cn(
              "p-1.5 rounded transition-all",
              activeFormats.underline
                ? "bg-[#2F4A3C] text-white"
                : "hover:bg-slate-100 text-slate-700"
            )}
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("strikeThrough")}
            title="Coretan (Strikethrough)"
            className={cn(
              "p-1.5 rounded transition-all",
              activeFormats.strikethrough
                ? "bg-[#2F4A3C] text-white"
                : "hover:bg-slate-100 text-slate-700"
            )}
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Colors (Text & Highlight) Popovers */}
        <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5 shadow-2xs relative">
          {/* Text Color */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowColorMenu(!showColorMenu)
                setShowHighlightMenu(false)
              }}
              title="Warna Teks"
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 flex items-center gap-0.5"
            >
              <Palette className="w-3.5 h-3.5 text-emerald-700" />
            </button>

            {showColorMenu && (
              <div className="absolute top-full left-0 mt-1 z-50 p-2 bg-white rounded-xl shadow-xl border border-slate-200 flex flex-col gap-1 w-36">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  Warna Teks
                </span>
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => {
                      executeCommand("foreColor", c.color)
                      setShowColorMenu(false)
                    }}
                    className="flex items-center gap-2 px-2 py-1 rounded-md text-xs hover:bg-slate-100 text-slate-700 w-full text-left"
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="text-[11px]">{c.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Highlight Color */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowHighlightMenu(!showHighlightMenu)
                setShowColorMenu(false)
              }}
              title="Warna Sorotan / Stabilo"
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 flex items-center gap-0.5"
            >
              <Highlighter className="w-3.5 h-3.5 text-[#D9A400]" />
            </button>

            {showHighlightMenu && (
              <div className="absolute top-full left-0 mt-1 z-50 p-2 bg-white rounded-xl shadow-xl border border-slate-200 flex flex-col gap-1 w-36">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  Stabilo
                </span>
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => {
                      executeCommand("hiliteColor", c.color)
                      setShowHighlightMenu(false)
                    }}
                    className="flex items-center gap-2 px-2 py-1 rounded-md text-xs hover:bg-slate-100 text-slate-700 w-full text-left"
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="text-[11px]">{c.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="h-5 w-px bg-slate-200 mx-0.5 hidden sm:block" />

        {/* Alignments: Left, Center, Right, Justify (Rata Kiri, Tengah, Kanan, Rata Kiri-Kanan) */}
        <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => executeCommand("justifyLeft")}
            title="Rata Kiri"
            className={cn(
              "p-1.5 rounded transition-all",
              activeFormats.justifyLeft
                ? "bg-[#2F4A3C] text-white"
                : "hover:bg-slate-100 text-slate-700"
            )}
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("justifyCenter")}
            title="Rata Tengah"
            className={cn(
              "p-1.5 rounded transition-all",
              activeFormats.justifyCenter
                ? "bg-[#2F4A3C] text-white"
                : "hover:bg-slate-100 text-slate-700"
            )}
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("justifyRight")}
            title="Rata Kanan"
            className={cn(
              "p-1.5 rounded transition-all",
              activeFormats.justifyRight
                ? "bg-[#2F4A3C] text-white"
                : "hover:bg-slate-100 text-slate-700"
            )}
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("justifyFull")}
            title="Rata Kiri-Kanan (Justify Word)"
            className={cn(
              "p-1.5 rounded transition-all",
              activeFormats.justifyFull
                ? "bg-[#2F4A3C] text-white font-bold"
                : "hover:bg-slate-100 text-slate-700"
            )}
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lists & Indentation */}
        <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => executeCommand("insertUnorderedList")}
            title="Daftar Poin (Bullets)"
            className={cn(
              "p-1.5 rounded transition-all",
              activeFormats.insertUnorderedList
                ? "bg-[#2F4A3C] text-white"
                : "hover:bg-slate-100 text-slate-700"
            )}
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("insertOrderedList")}
            title="Daftar Angka (Numbering)"
            className={cn(
              "p-1.5 rounded transition-all",
              activeFormats.insertOrderedList
                ? "bg-[#2F4A3C] text-white"
                : "hover:bg-slate-100 text-slate-700"
            )}
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("outdent")}
            title="Kurangi Indentasi"
            className="p-1.5 rounded hover:bg-slate-100 text-slate-700"
          >
            <Outdent className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("indent")}
            title="Tambah Indentasi"
            className="p-1.5 rounded hover:bg-slate-100 text-slate-700"
          >
            <Indent className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-5 w-px bg-slate-200 mx-0.5 hidden sm:block" />

        {/* Insert: Link, Horizontal Rule, Table */}
        <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={handleOpenLinkModal}
            title="Sisipkan Tautan Web (Link)"
            className="p-1.5 rounded hover:bg-slate-100 text-slate-700"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("insertHorizontalRule")}
            title="Sisipkan Garis Pembatas Naskah"
            className="p-1.5 rounded hover:bg-slate-100 text-slate-700"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleInsertTable(3, 3)}
            title="Sisipkan Tabel 3x3"
            className="p-1.5 rounded hover:bg-slate-100 text-slate-700"
          >
            <TableIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Clear formatting */}
        <button
          type="button"
          onClick={() => executeCommand("removeFormat")}
          title="Hapus Format Teks"
          className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 shadow-2xs"
        >
          <RemoveFormatting className="w-3.5 h-3.5" />
        </button>

        {/* Source Mode Toggle (Right-aligned) */}
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleToggleSourceMode}
            title={isSourceMode ? "Kembali ke Mode Visual Word" : "Lihat / Edit Kode HTML"}
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer shadow-2xs",
              isSourceMode
                ? "bg-amber-100 text-amber-900 border-amber-300"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
            )}
          >
            {isSourceMode ? (
              <>
                <Eye className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden xs:inline">Mode Word</span>
              </>
            ) : (
              <>
                <Code2 className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden xs:inline">Kode HTML</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Document Workspace / Editor Canvas */}
      <div className="relative bg-white flex-1 flex flex-col">
        {isSourceMode ? (
          <textarea
            value={htmlSource}
            onChange={(e) => setHtmlSource(e.target.value)}
            className="w-full p-4 font-mono text-xs text-slate-800 focus:outline-none resize-y bg-slate-900 text-slate-100 leading-relaxed min-h-[300px]"
            spellCheck={false}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleEditorInput}
            onKeyUp={checkActiveFormats}
            onMouseUp={checkActiveFormats}
            onFocus={checkActiveFormats}
            style={{ minHeight }}
            className="w-full p-4 sm:p-6 text-sm text-slate-800 focus:outline-none overflow-y-auto leading-relaxed max-h-[500px] prose-word"
            data-placeholder={placeholder}
          />
        )}
      </div>

      {/* 3. Executive Status Bar (Word & Character Count) */}
      <div className="bg-slate-50 border-t border-slate-200 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-500 select-none">
        <div className="flex items-center gap-3">
          <span className="font-medium text-slate-600">
            <strong>{stats.words}</strong> kata
          </span>
          <span className="h-3 w-px bg-slate-300" />
          <span>
            <strong>{stats.characters}</strong> karakter
          </span>
        </div>

        <div className="flex items-center gap-2">
          {activeFormats.justifyFull && (
            <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
              <AlignJustify className="w-2.5 h-2.5" /> Rata Kiri-Kanan (Justify)
            </span>
          )}
          <span className="text-[10px] text-slate-400 hidden sm:inline">
            Editor Dokumen POPMI KTP
          </span>
        </div>
      </div>

      {/* 4. Link Insert Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 w-full max-w-sm space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-[#2F4A3C]" /> Sisipkan Tautan Web
              </h4>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInsertLink} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Teks Tautan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Klik tautan pendaftaran di sini"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#2F4A3C]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Alamat URL Web <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://linggakab.go.id/..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#2F4A3C]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#2F4A3C] hover:bg-[#23382D] text-xs font-bold text-white shadow-xs"
                >
                  Sisipkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
