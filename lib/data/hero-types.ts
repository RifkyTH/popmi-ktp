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
    id: "video-coastal",
    title: "Ombak Pesisir Pantai Temiang (Video Loop)",
    type: "video" as HeroBackgroundType,
    url: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-waves-lapping-the-sand-41544-large.mp4",
    previewImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop",
    description: "Video pergerakan ombak laut tropis berulang yang tenang dan sinematik.",
  },
  {
    id: "mesh-liquid",
    title: "Aura Gradien Bahari & Zamrud (Animasi Organik)",
    type: "mesh" as HeroBackgroundType,
    url: "",
    previewImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
    description: "Gelombang gradien warna hijau tua, emas, dan biru laut yang bergerak mengalir halus.",
  },
  {
    id: "video-sea-horizon",
    title: "Lautan Tenang & Cakrawala Pesisir (Video Loop)",
    type: "video" as HeroBackgroundType,
    url: "https://assets.mixkit.co/videos/preview/mixkit-calm-sea-water-and-blue-sky-41525-large.mp4",
    previewImage: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=600&auto=format&fit=crop",
    description: "Lautan tenang dengan pantulan sinar matahari di atas air laut kepulauan.",
  },
  {
    id: "image-panorama",
    title: "Panorama Pesisir Kepulauan Lingga (Ambient Flow)",
    type: "image" as HeroBackgroundType,
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop",
    previewImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop",
    description: "Foto resolusi tinggi pesisir pulau dengan efek pergerakan perlahan (Ken-Burns Pan).",
  },
]

export const DEFAULT_HERO_SETTINGS: HeroBackgroundSettings = {
  enabled: true,
  type: "video",
  url: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-waves-lapping-the-sand-41544-large.mp4",
  title: "Ombak Pesisir Pantai Temiang (Video Loop)",
  overlayOpacity: 0.82,
  overlayTheme: "light",
  blurAmount: "none",
  updatedAt: new Date().toISOString(),
  updatedBy: "Super Administrator",
}
