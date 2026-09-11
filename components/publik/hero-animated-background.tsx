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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[320px] bg-[#2F4A3C]/5 blur-3xl -z-10 rounded-full pointer-events-none" />
    )
  }

  const blurClass =
    settings.blurAmount === "md"
      ? "blur-md"
      : settings.blurAmount === "sm"
      ? "blur-xs"
      : "blur-none"

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none"
      aria-hidden="true"
    >
      {/* 1. Video Animation */}
      {settings.type === "video" && settings.url && !videoFailed && (
        <video
          key={settings.url}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoFailed(true)}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
            blurClass
          )}
        >
          <source src={settings.url} type="video/mp4" />
          <source src={settings.url} type="video/webm" />
        </video>
      )}

      {/* 2. Image / GIF Animation (or fallback if video failed) */}
      {(settings.type === "image" || (settings.type === "video" && videoFailed)) &&
        settings.url && (
          <div
            className={cn(
              "absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[20000ms] ease-out scale-105 animate-pulse",
              blurClass
            )}
            style={{
              backgroundImage: `url('${settings.url}')`,
              animationDuration: "12s",
            }}
          />
        )}

      {/* 3. Liquid Aura / Animated Organic Mesh */}
      {settings.type === "mesh" && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated Blob 1: Forest Green Emerald */}
          <div
            className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-emerald-400/20 blur-3xl animate-pulse"
            style={{ animationDuration: "8s" }}
          />
          {/* Animated Blob 2: Gold Amber */}
          <div
            className="absolute top-1/4 -right-24 w-[480px] h-[480px] rounded-full bg-[#D9A400]/15 blur-3xl animate-pulse"
            style={{ animationDuration: "10s", animationDelay: "2s" }}
          />
          {/* Animated Blob 3: Deep Ocean Forest */}
          <div
            className="absolute -bottom-24 left-1/3 w-[560px] h-[560px] rounded-full bg-[#2F4A3C]/15 blur-3xl animate-pulse"
            style={{ animationDuration: "12s", animationDelay: "4s" }}
          />
        </div>
      )}

      {/* 4. Executive Scrim Overlays - Keeps text 100% crisp and readable */}
      {/* Opacity Controlled Scrim */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity",
          settings.overlayTheme === "forest"
            ? "bg-[#1f3328]"
            : settings.overlayTheme === "dark"
            ? "bg-slate-950"
            : "bg-white"
        )}
        style={{ opacity: settings.overlayOpacity }}
      />

      {/* Multi-stop gradient for seamless blend into page content */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-transparent to-white/50" />
    </div>
  )
}
