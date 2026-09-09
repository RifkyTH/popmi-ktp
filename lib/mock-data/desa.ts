export const DESA_LIST = [
  "Temiang",
  "Tajur Biru",
  "Pulau Batang",
]

export const KECAMATAN = "Temiang Pesisir"
export const KABUPATEN = "Kabupaten Lingga"
export const PROVINSI = "Kepulauan Riau"

// Koordinat akurat masing-masing desa (lat, lng)
export const DESA_KOORDINAT: Record<string, [number, number]> = {
  "Temiang":     [0.311395, 104.418504],
  "Tajur Biru":  [0.286026, 104.421258],
  "Pulau Batang":[0.263069, 104.375278],
}

// Titik tengah Kecamatan Temiang Pesisir
export const PETA_CENTER: [number, number] = [0.287, 104.405]
export const PETA_ZOOM = 12
