export type HeroBackgroundType = "video" | "image" | "mesh"

export interface HeroBackgroundSettings {
  enabled: boolean
  type: HeroBackgroundType
  url: string
  title: string
  overlayOpacity: number // 0.3 to 0.95 (e.g. 0.8 keeps text contrast pristine)
  overlayTheme: "light" | "forest" | "dark"
  blurAmount: "none" | "sm" | "md"
  updatedAt: string
  updatedBy: string
}

export const HERO_PRESETS = [
  {
    id: "video-oceans-local",
    title: "Lautan & Ombak Pesisir Kepulauan (Video Loop HD)",
    type: "video" as HeroBackgroundType,
    url: "/videos/hero-oceans.mp4",
    previewImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop",
    description: "Video loop resolusi tinggi pergerakan ombak laut pesisir yang tenang dan sinematik.",
  },
  {
    id: "image-panorama",
    title: "Panorama Pesisir Pantai Temiang (Ambient Pan)",
    type: "image" as HeroBackgroundType,
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop",
    previewImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop",
    description: "Pemandangan pesisir tropis jernih berpasir putih dengan pergerakan animasi lembut.",
  },
  {
    id: "mesh-liquid",
    title: "Aura Bahari & Zamrud Lingga (Animasi Mesh)",
    type: "mesh" as HeroBackgroundType,
    url: "",
    previewImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
    description: "Gelombang gradien hijau tua, emas, dan biru laut yang bergerak dinamis.",
  },
]

export const DEFAULT_HERO_SETTINGS: HeroBackgroundSettings = {
  enabled: true,
  type: "video",
  url: "/videos/hero-oceans.mp4",
  title: "Lautan & Ombak Pesisir Kepulauan (Video Loop HD)",
  overlayOpacity: 0.45,
  overlayTheme: "light",
  blurAmount: "none",
  updatedAt: new Date().toISOString(),
  updatedBy: "Super Administrator",
}
