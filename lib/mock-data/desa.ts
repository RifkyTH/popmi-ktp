export const DESA_LIST = [
  "Temiang",
  "Tajur Biru",
  "Pulau Batang",
]

export const KECAMATAN = "Temiang Pesisir"
export const KABUPATEN = "Kabupaten Lingga"
export const PROVINSI = "Kepulauan Riau"

// Koordinat perkiraan masing-masing desa (lat, lng) — dapat diperbarui sesuai data GIS
export const DESA_KOORDINAT: Record<string, [number, number]> = {
  "Temiang":     [0.1536, 104.5389],
  "Tajur Biru":  [0.1722, 104.5511],
  "Pulau Batang":[0.1289, 104.5234],
}

// Titik tengah Kecamatan Temiang Pesisir
export const PETA_CENTER: [number, number] = [0.1512, 104.5345]
export const PETA_ZOOM = 12
