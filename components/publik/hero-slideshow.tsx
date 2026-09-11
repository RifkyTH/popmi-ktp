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

  // Touch gesture refs for mobile swipe
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

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

  // Only pause on desktop with a real mouse pointer, ignore mobile touch emulation
  const handleMouseEnter = () => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
      setIsPaused(true)
    }
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
  }

  // Handle touch swipe on mobile with auto-resume
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
    touchEndX.current = null
    setIsPaused(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current
      if (diff > 40) {
        nextSlide() // Swipe left -> next
      } else if (diff < -40) {
        prevSlide() // Swipe right -> prev
      }
    }
    touchStartX.current = null
    touchEndX.current = null
    // Crucial: ALWAYS resume autoplay on mobile as soon as the finger lifts
    setIsPaused(false)
  }

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return

    autoPlayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides)
    }, 4500)

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)
    }
  }, [isPaused, totalSlides])

  if (totalSlides === 0) return null

  const currentSlide = slides[currentIndex]

  return (
    <div
      className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-lg bg-slate-950 group select-none touch-pan-y"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Dokumentasi dan Berita Resmi Kecamatan Temiang Pesisir"
    >
      {/* Slide Container with Mobile-First Adaptive Height */}
      <div className="relative h-[320px] xs:h-[370px] sm:h-[440px] lg:h-[480px] w-full overflow-hidden">
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
              {/* Background Photo with smooth zoom & center crop protection */}
              {slide.gambar ? (
                <img
                  src={slide.gambar}
                  alt={slide.judul}
                  className={cn(
                    "w-full h-full object-cover object-center transition-transform duration-10000 ease-out",
                    isActive ? "scale-105" : "scale-100"
                  )}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1f3328] via-[#2F4A3C] to-slate-900" />
              )}

              {/* Multi-layered GovTech Gradient Scrim tuned for mobile & desktop */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 via-45% to-black/10" />
              <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 xs:p-6 sm:p-10 lg:p-12 z-20">
                <div className="max-w-2xl space-y-2 xs:space-y-3 sm:space-y-3.5">
                  {/* Category & Badge */}
                  <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap">
                    <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#D9A400] text-slate-950 font-extrabold text-[9px] sm:text-[10px] tracking-wider uppercase shadow-xs">
                      {KATEGORI_LABELS[slide.kategori] || slide.kategori}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-medium border border-white/20">
                      <Calendar className="w-3 h-3 text-[#D9A400]" />
                      <span>{slide.tanggal}</span>
                    </span>
                    <span className="hidden xs:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-[11px] font-medium">
                      <User className="w-3 h-3 text-[#D9A400]" />
                      <span>{slide.penulis}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-base xs:text-lg sm:text-2xl lg:text-3xl font-serif font-bold text-white leading-snug tracking-tight drop-shadow-sm line-clamp-2">
                    {slide.judul}
                  </h2>

                  {/* Excerpt - Compact on mobile */}
                  <p className="text-[11px] sm:text-sm text-white/80 line-clamp-1 sm:line-clamp-2 leading-relaxed max-w-xl font-sans">
                    {slide.ringkasan}
                  </p>

                  {/* Read Article CTA Button */}
                  <div className="pt-1 sm:pt-2">
                    <Link
                      href={`/publik/informasi/${slide.slug}`}
                      className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#2F4A3C] hover:bg-[#23382D] text-white text-[11px] sm:text-xs font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-white/20 shadow-md active:scale-95 transition-all group/btn"
                    >
                      <span>Baca Informasi Lengkap</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#D9A400] transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation Controls: Positioned higher on mobile to never overlap text */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Slide sebelumnya"
            className="absolute left-2 sm:left-4 top-1/3 sm:top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 transition-all opacity-80 hover:opacity-100 active:scale-90 cursor-pointer shadow-md"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Slide berikutnya"
            className="absolute right-2 sm:right-4 top-1/3 sm:top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 transition-all opacity-80 hover:opacity-100 active:scale-90 cursor-pointer shadow-md"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 h-5" />
          </button>
        </>
      )}

      {/* Slide Counter & Indicators */}
      {totalSlides > 1 && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex items-center gap-2 sm:gap-3">
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
          <div className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-mono font-bold tracking-wider">
            <span className="text-[#D9A400]">{String(currentIndex + 1).padStart(2, "0")}</span>
            <span className="text-white/40 mx-1">/</span>
            <span className="text-white/70">{String(totalSlides).padStart(2, "0")}</span>
          </div>
        </div>
      )}

      {/* Bottom Dot Indicators */}
      {totalSlides > 1 && (
        <div className="absolute bottom-3 right-4 sm:bottom-4 sm:right-10 z-30 flex items-center gap-1.5 sm:gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Buka slide ${idx + 1}`}
              className={cn(
                "h-1.5 sm:h-2 rounded-full transition-all cursor-pointer",
                idx === currentIndex
                  ? "w-6 sm:w-8 bg-[#D9A400]"
                  : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/70"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
