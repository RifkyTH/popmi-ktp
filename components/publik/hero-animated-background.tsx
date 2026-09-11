"use client"

import { useState } from "react"
import { HeroBackgroundSettings } from "@/lib/data/hero-types"
import { cn } from "@/lib/utils"

export function HeroAnimatedBackground({
  settings,
}: {
  settings: HeroBackgroundSettings
}) {
  const [videoFailed, setVideoFailed] = useState(false)

  if (!settings || !settings.enabled) {
    // Default subtle glow if disabled
    return (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[320px] bg-[#2F4A3C]/5 blur-3xl z-0 rounded-full pointer-events-none" />
    )
  }

  const blurClass =
    settings.blurAmount === "md"
      ? "blur-md"
      : settings.blurAmount === "sm"
      ? "blur-xs"
      : "blur-none"

  const videoUrl = settings.url || "/videos/hero-oceans.mp4"
  const defaultPoster =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop"

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none"
      aria-hidden="true"
    >
      {/* 1. Video Animation */}
      {settings.type === "video" && !videoFailed && (
        <video
          key={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          poster={defaultPoster}
          onError={() => setVideoFailed(true)}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
            blurClass
          )}
        >
          <source src={videoUrl} type="video/mp4" />
          <source src="/videos/hero-oceans.mp4" type="video/mp4" />
        </video>
      )}

      {/* 2. Image / GIF Animation (or fallback if video failed) */}
      {(settings.type === "image" || videoFailed) && (
        <div
          className={cn(
            "absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[20000ms] ease-out scale-105 animate-pulse",
            blurClass
          )}
          style={{
            backgroundImage: `url('${settings.type === "image" && settings.url ? settings.url : defaultPoster}')`,
            animationDuration: "16s",
          }}
        />
      )}

      {/* 3. Liquid Aura / Animated Organic Mesh */}
      {settings.type === "mesh" && (
        <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50/50 to-amber-50/30">
          {/* Animated Blob 1: Forest Green Emerald */}
          <div
            className="absolute -top-24 -left-24 w-[550px] h-[550px] rounded-full bg-emerald-400/30 blur-3xl animate-pulse"
            style={{ animationDuration: "7s" }}
          />
          {/* Animated Blob 2: Gold Amber */}
          <div
            className="absolute top-1/4 -right-24 w-[520px] h-[520px] rounded-full bg-[#D9A400]/25 blur-3xl animate-pulse"
            style={{ animationDuration: "9s", animationDelay: "1.5s" }}
          />
          {/* Animated Blob 3: Deep Ocean Forest */}
          <div
            className="absolute -bottom-24 left-1/3 w-[600px] h-[600px] rounded-full bg-[#2F4A3C]/20 blur-3xl animate-pulse"
            style={{ animationDuration: "11s", animationDelay: "3s" }}
          />
        </div>
      )}

      {/* 4. Executive Scrim Overlays - Preserves text contrast while keeping background motion visible */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-300",
          settings.overlayTheme === "forest"
            ? "bg-[#16271e]"
            : settings.overlayTheme === "dark"
            ? "bg-slate-950"
            : "bg-white"
        )}
        style={{
          opacity: Math.min(Math.max(settings.overlayOpacity ?? 0.45, 0.2), 0.75),
        }}
      />

      {/* Soft gradient fades at top and bottom for smooth blend into page */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
    </div>
  )
}
