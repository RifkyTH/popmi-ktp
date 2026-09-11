"use client"

import { useState, useEffect, useRef } from "react"
import { Informasi, KATEGORI_LABELS } from "@/lib/mock-data/informasi"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  ArrowRight,
  Sparkles,
  Play,
  Pause,
  Layers,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function HeroSlideShow({ items }: { items: Informasi[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Use only items with photos, or fallback to first items
  const validSlides = items.filter((item) => Boolean(item.gambar))
  const slides = validSlides.length > 0 ? validSlides : items

  const totalSlides = slides.length

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return

    autoPlayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides)
    }, 5500)

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)
    }
  }, [isPaused, totalSlides])

  if (totalSlides === 0) return null

  const currentSlide = slides[currentIndex]

  return (
    <div
      className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-lg bg-slate-950 group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Dokumentasi dan Berita Resmi Kecamatan Temiang Pesisir"
    >
      {/* Slide Container */}
      <div className="relative h-[380px] sm:h-[440px] lg:h-[480px] w-full overflow-hidden">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex
          return (
            <div
              key={slide.id || slide.slug}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-in-out",
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              )}
            >
              {/* Background Photo with smooth zoom */}
              {slide.gambar ? (
                <img
                  src={slide.gambar}
                  alt={slide.judul}
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-10000 ease-out",
                    isActive ? "scale-105" : "scale-100"
                  )}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1f3328] via-[#2F4A3C] to-slate-900" />
              )}

              {/* Multi-layered GovTech Gradient Scrim for crisp text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-12 z-20">
                <div className="max-w-2xl space-y-3.5">
                  {/* Category & Badge */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-[#D9A400] text-slate-950 font-extrabold text-[10px] tracking-wider uppercase shadow-xs">
                      {KATEGORI_LABELS[slide.kategori] || slide.kategori}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-medium border border-white/20">
                      <Calendar className="w-3 h-3 text-[#D9A400]" />
                      <span>{slide.tanggal}</span>
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-[11px] font-medium">
                      <User className="w-3 h-3 text-[#D9A400]" />
                      <span>{slide.penulis}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white leading-snug tracking-tight drop-shadow-sm line-clamp-2 sm:line-clamp-3">
                    {slide.judul}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-sm text-white/80 line-clamp-2 leading-relaxed max-w-xl font-sans">
                    {slide.ringkasan}
                  </p>

                  {/* Read Article CTA Button */}
                  <div className="pt-2">
                    <Link
                      href={`/publik/informasi/${slide.slug}`}
                      className="inline-flex items-center gap-2 bg-[#2F4A3C] hover:bg-[#23382D] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl border border-white/20 shadow-md active:scale-95 transition-all group/btn"
                    >
                      <span>Baca Informasi Lengkap</span>
                      <ArrowRight className="w-4 h-4 text-[#D9A400] transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation Controls: Left/Right Arrows */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Slide sebelumnya"
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Slide berikutnya"
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Slide Counter & Indicators */}
      {totalSlides > 1 && (
        <div className="absolute top-4 right-4 z-30 flex items-center gap-3">
          {/* Pause/Play indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white/80 text-[10px] font-mono">
            {isPaused ? (
              <>
                <Pause className="w-3 h-3 text-[#D9A400]" />
                <span>Dijeda</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-emerald-400" />
                <span>Otomatis</span>
              </>
            )}
          </div>

          {/* Number Counter Badge */}
          <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-bold tracking-wider">
            <span className="text-[#D9A400]">{String(currentIndex + 1).padStart(2, "0")}</span>
            <span className="text-white/40 mx-1">/</span>
            <span className="text-white/70">{String(totalSlides).padStart(2, "0")}</span>
          </div>
        </div>
      )}

      {/* Bottom Dot Indicators */}
      {totalSlides > 1 && (
        <div className="absolute bottom-4 right-6 sm:right-10 z-30 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Buka slide ${idx + 1}`}
              className={cn(
                "h-2 rounded-full transition-all cursor-pointer",
                idx === currentIndex
                  ? "w-8 bg-[#D9A400]"
                  : "w-2 bg-white/40 hover:bg-white/70"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
