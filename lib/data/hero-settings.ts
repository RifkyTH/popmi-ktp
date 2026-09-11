import "server-only"
import fs from "fs"
import path from "path"
import {
  HeroBackgroundSettings,
  DEFAULT_HERO_SETTINGS,
} from "./hero-types"

export * from "./hero-types"

const SETTINGS_FILE_PATH = path.join(process.cwd(), "lib", "data", "hero-settings.json")

export function getHeroBackgroundSettings(): HeroBackgroundSettings {
  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const fileData = fs.readFileSync(SETTINGS_FILE_PATH, "utf-8")
      return JSON.parse(fileData) as HeroBackgroundSettings
    }
  } catch (err) {
    console.warn("Could not read hero settings file, falling back to default:", err)
  }
  return DEFAULT_HERO_SETTINGS
}

export function saveHeroBackgroundSettings(settings: HeroBackgroundSettings): void {
  try {
    const dir = path.dirname(SETTINGS_FILE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(settings, null, 2), "utf-8")
  } catch (err) {
    console.error("Error saving hero settings file:", err)
    throw new Error("Gagal menyimpan konfigurasi background hero.")
  }
}
