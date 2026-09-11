"use client"

import { useState, useTransition, useRef } from "react"
import {
  HeroBackgroundSettings,
  HeroBackgroundType,
  HERO_PRESETS,
} from "@/lib/data/hero-types"
import {
  updateHeroSettings,
  uploadHeroMedia,
} from "@/lib/actions/hero-settings"
import {
  Video,
  Image as ImageIcon,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sliders,
  ExternalLink,
  Loader2,
  Film,
  Layers,
  Eye,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function HeroBackgroundSettingsManager({
  initialSettings,
}: {
  initialSettings: HeroBackgroundSettings
}) {
  const [settings, setSettings] = useState<HeroBackgroundSettings>(initialSettings)
  const [selectedType, setSelectedType] = useState<HeroBackgroundType>(initialSettings.type)
  const [customUrl, setCustomUrl] = useState(initialSettings.url)
  const [enabled, setEnabled] = useState(initialSettings.enabled)
  const [opacity, setOpacity] = useState(initialSettings.overlayOpacity)
  const [theme, setTheme] = useState(initialSettings.overlayTheme)
  const [blur, setBlur] = useState(initialSettings.blurAmount)

  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file upload (video or animated image)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setFeedback(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await uploadHeroMedia(formData)
      if (res.success && res.settings) {
        setSettings(res.settings)
        setSelectedType(res.settings.type)
        setCustomUrl(res.settings.url)
        setEnabled(true)
        setFeedback({
          type: "success",
          text: `Berhasil mengupload file "${file.name}". Background animasi langsung aktif!`,
        })
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err?.message || "Gagal mengunggah file." })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // Handle choosing preset
  const handleSelectPreset = (preset: (typeof HERO_PRESETS)[0]) => {
    setSelectedType(preset.type)
    setCustomUrl(preset.url)
    setSettings((prev) => ({
      ...prev,
      type: preset.type,
      url: preset.url,
      title: preset.title,
    }))
  }

  // Handle saving all settings
  const handleSave = async () => {
    setIsSaving(true)
    setFeedback(null)

    try {
      const res = await updateHeroSettings({
        enabled,
        type: selectedType,
        url: customUrl.trim(),
        overlayOpacity: opacity,
        overlayTheme: theme,
        blurAmount: blur,
      })

      if (res.success && res.settings) {
        setSettings(res.settings)
        setFeedback({
          type: "success",
          text: "Pengaturan background animasi berhasil disimpan dan langsung aktif di portal publik!",
        })
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err?.message || "Gagal menyimpan pengaturan." })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden space-y-6">
      {/* Panel Header */}
      <div className="p-6 bg-gradient-to-r from-slate-50 via-emerald-50/40 to-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#2F4A3C] text-[#D9A400] shadow-xs">
              <Film className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#2F4A3C]">
                Background Animasi Hero (Portal Publik)
              </h2>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded uppercase tracking-wider">
                Khusus Superadmin
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            Upload video latar (MP4/WebM), gambar animasi (GIF/WebP), atau pilih efek gradien bahari hidup untuk latar belakang judul utama portal publik warga.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-[#2F4A3C] focus:ring-[#2F4A3C]"
            />
            <span className="text-xs font-bold text-slate-700">
              {enabled ? "Status: Aktif" : "Status: Nonaktif"}
            </span>
          </label>

          <a
            href="/publik"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Lihat Hasil</span>
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 space-y-6">
        {/* Feedback Alert */}
        {feedback && (
          <div
            className={cn(
              "p-3.5 rounded-xl border flex items-center gap-2.5 text-xs animate-in fade-in duration-200",
              feedback.type === "error"
                ? "bg-rose-50 border-rose-200 text-rose-700"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            )}
          >
            {feedback.type === "error" ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span className="font-medium">{feedback.text}</span>
          </div>
        )}

        {/* 1. Upload Section */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Upload className="w-4 h-4 text-[#2F4A3C]" />
            <span>1. Upload File Animasi Baru Dari Perangkat</span>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-2">
              <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#2F4A3C]/40 rounded-2xl bg-slate-50/60 hover:bg-emerald-50/30 cursor-pointer transition-all group">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,image/gif,image/webp,image/jpeg,image/png"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#2F4A3C]/10 text-[#2F4A3C] flex items-center justify-center group-hover:scale-110 transition-transform">
                    {isUploading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {isUploading
                        ? "Sedang mengunggah dan memproses file..."
                        : "Klik untuk memilih video atau gambar animasi"}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Mendukung Video: <strong>MP4, WebM</strong> · Gambar: <strong>GIF, WebP, PNG, JPG</strong>
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {/* Custom URL Option */}
            <div className="space-y-1.5 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
              <label className="text-[11px] font-bold text-slate-600 block">
                Atau Masukkan URL Video / Animasi:
              </label>
              <input
                type="url"
                placeholder="https://.../video.mp4 atau .gif"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#2F4A3C]"
              />
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedType("video")}
                  className={cn(
                    "flex-1 py-1 rounded text-[10px] font-bold border transition-colors",
                    selectedType === "video"
                      ? "bg-[#2F4A3C] text-white border-[#2F4A3C]"
                      : "bg-white text-slate-600 border-slate-200"
                  )}
                >
                  Mode Video
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType("image")}
                  className={cn(
                    "flex-1 py-1 rounded text-[10px] font-bold border transition-colors",
                    selectedType === "image"
                      ? "bg-[#2F4A3C] text-white border-[#2F4A3C]"
                      : "bg-white text-slate-600 border-slate-200"
                  )}
                >
                  Mode Gambar/GIF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Official Presets Selection */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D9A400]" />
              <span>2. Atau Pilih Koleksi Preset Animasi Resmi Kecamatan:</span>
            </label>
            <span className="text-[11px] text-slate-400">1-Klik Langsung Terpasang</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {HERO_PRESETS.map((preset) => {
              const isSelected =
                selectedType === preset.type &&
                (preset.type === "mesh" || customUrl === preset.url)
              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={cn(
                    "p-3 rounded-xl border-2 transition-all cursor-pointer group flex flex-col justify-between space-y-2 relative overflow-hidden",
                    isSelected
                      ? "border-[#2F4A3C] bg-emerald-50/50 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  )}
                >
                  <div className="h-28 rounded-lg overflow-hidden relative bg-slate-100 border border-slate-200">
                    <img
                      src={preset.previewImage}
                      alt={preset.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white">
                        {preset.type === "video"
                          ? "Video Loop"
                          : preset.type === "mesh"
                          ? "Animasi Mesh"
                          : "Ambient Image"}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#2F4A3C] text-[#D9A400] flex items-center justify-center shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-xs text-slate-800 line-clamp-1">{preset.title}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                      {preset.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 3. Appearance Controls & Fine-Tuning */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-[#2F4A3C]" />
            <span>3. Pengaturan Kontras &amp; Keterbacaan Teks Warga</span>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            {/* Overlay Opacity */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Tingkat Penutup (Overlay)</span>
                <span className="font-mono font-bold text-[#2F4A3C]">
                  {Math.round(opacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full accent-[#2F4A3C] cursor-pointer"
              />
              <p className="text-[10.5px] text-slate-400 leading-tight">
                Rentang 0% (tanpa penutup) hingga 100% (penutup penuh). Nilai 30% - 50% memberikan keseimbangan visual dan keterbacaan yang ideal.
              </p>
            </div>

            {/* Overlay Theme */}
            <div className="space-y-1.5">
              <span className="font-semibold text-slate-700 block">Warna Lapisan Penutup</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { key: "light", label: "Putih Bersih" },
                  { key: "forest", label: "Hijau Hutan" },
                  { key: "dark", label: "Gelap Malam" },
                ].map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTheme(t.key as any)}
                    className={cn(
                      "py-1.5 rounded-lg font-semibold text-[11px] border transition-colors",
                      theme === t.key
                        ? "bg-[#2F4A3C] text-white border-[#2F4A3C]"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Blur */}
            <div className="space-y-1.5">
              <span className="font-semibold text-slate-700 block">Efek Blur Latar</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { key: "none", label: "Tajam (0px)" },
                  { key: "sm", label: "Halus (2px)" },
                  { key: "md", label: "Sedang (4px)" },
                ].map((b) => (
                  <button
                    key={b.key}
                    type="button"
                    onClick={() => setBlur(b.key as any)}
                    className={cn(
                      "py-1.5 rounded-lg font-semibold text-[11px] border transition-colors",
                      blur === b.key
                        ? "bg-[#2F4A3C] text-white border-[#2F4A3C]"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                    )}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Live Mini-Preview Frame */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> Pratinjau Tampilan Hero:
          </span>

          <div className="relative rounded-2xl overflow-hidden border border-slate-300 h-56 flex items-center justify-center p-6 text-center select-none shadow-xs">
            {/* Background Simulator */}
            {enabled && selectedType === "video" && customUrl && (
              <video
                key={customUrl}
                autoPlay
                loop
                muted
                playsInline
                className={cn(
                  "absolute inset-0 w-full h-full object-cover",
                  blur === "md" ? "blur-md" : blur === "sm" ? "blur-xs" : "blur-none"
                )}
              >
                <source src={customUrl} type="video/mp4" />
              </video>
            )}

            {enabled && selectedType === "image" && customUrl && (
              <div
                className={cn(
                  "absolute inset-0 w-full h-full bg-cover bg-center animate-pulse",
                  blur === "md" ? "blur-md" : blur === "sm" ? "blur-xs" : "blur-none"
                )}
                style={{ backgroundImage: `url('${customUrl}')`, animationDuration: "8s" }}
              />
            )}

            {enabled && selectedType === "mesh" && (
              <div className="absolute inset-0 overflow-hidden bg-slate-50">
                <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-emerald-400/30 blur-2xl animate-pulse" />
                <div className="absolute top-10 right-0 w-40 h-40 rounded-full bg-[#D9A400]/25 blur-2xl animate-pulse" />
              </div>
            )}

            {/* Scrim */}
            <div
              className={cn(
                "absolute inset-0",
                theme === "forest"
                  ? "bg-[#1f3328]"
                  : theme === "dark"
                  ? "bg-slate-950"
                  : "bg-white"
              )}
              style={{ opacity }}
            />

            {/* Foreground Content */}
            <div className="relative z-10 space-y-2 max-w-md">
              <span
                className={cn(
                  "inline-block text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border shadow-2xs",
                  theme === "forest" || theme === "dark"
                    ? "bg-white/15 border-white/20 text-white"
                    : "bg-white/90 border-[#D9A400]/40 text-[#2F4A3C]"
                )}
              >
                PORTAL RESMI LAYANAN ASPIRASI &amp; INFORMASI
              </span>
              <h3
                className={cn(
                  "font-serif font-bold text-xl sm:text-2xl leading-tight",
                  theme === "forest" || theme === "dark" ? "text-white" : "text-[#2F4A3C]"
                )}
              >
                Satu Sistem, Surat Tertib, Aduan Terpantau
              </h3>
              <p
                className={cn(
                  "text-[11px] line-clamp-2",
                  theme === "forest" || theme === "dark" ? "text-white/80" : "text-slate-600"
                )}
              >
                Platform keterbukaan informasi digital Kecamatan Temiang Pesisir, Kabupaten Lingga.
              </p>
              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="px-3 py-1 rounded-lg bg-[#2F4A3C] text-white text-[10px] font-bold">
                  Buat Pengaduan
                </span>
                <span className="px-3 py-1 rounded-lg bg-white border border-slate-300 text-[#2F4A3C] text-[10px] font-bold">
                  Lacak Tiket
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button Bar */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2F4A3C] hover:bg-[#23382D] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#D9A400]" />
                <span>Menyimpan Konfigurasi...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#D9A400]" />
                <span>Terapkan Background ke Portal Publik</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
