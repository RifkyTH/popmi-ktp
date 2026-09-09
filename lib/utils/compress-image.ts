/**
 * Kompresi gambar menggunakan Canvas API.
 * Mengubah ukuran ke max 1200px (lebar/tinggi) dan encode sebagai JPEG.
 * Kualitas visual tetap baik namun ukuran file berkurang drastis.
 */
export async function compressImage(
  file: File,
  maxWidthOrHeight = 1200,
  quality = 0.82
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      let { width, height } = img

      // Hitung dimensi baru dengan mempertahankan aspek rasio
      if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
        if (width > height) {
          height = Math.round((height * maxWidthOrHeight) / width)
          width = maxWidthOrHeight
        } else {
          width = Math.round((width * maxWidthOrHeight) / height)
          height = maxWidthOrHeight
        }
      }

      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Gagal mendapatkan canvas context"))
        return
      }

      // Render gambar ke canvas
      ctx.drawImage(img, 0, 0, width, height)

      // Konversi ke blob JPEG terkompresi
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Gagal mengkompresi gambar"))
            return
          }
          // Buat File baru dari blob
          const compressedFile = new File(
            [blob],
            file.name.replace(/\.[^.]+$/, ".jpg"),
            { type: "image/jpeg" }
          )
          resolve(compressedFile)
        },
        "image/jpeg",
        quality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Gagal memuat gambar"))
    }

    img.src = url
  })
}
