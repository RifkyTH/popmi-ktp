import Image from "next/image"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-krem">
      {/* Decorative top ribbon */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-hijau via-kuning to-hijau" />

      {/* Logo + nama */}
      <div className="flex flex-col items-center gap-5">
        {/* Logo dengan ring kuning */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-2 border-kuning-muda flex items-center justify-center bg-white shadow-lg">
            <Image
              src="/logo-lingga.png"
              alt="Logo Kabupaten Lingga"
              width={72}
              height={72}
              className="object-contain"
              priority
            />
          </div>
          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-full border-2 border-t-kuning border-r-kuning border-b-transparent border-l-transparent animate-spin" />
        </div>

        {/* Teks identitas */}
        <div className="text-center space-y-1">
          <p className="font-serif font-bold text-hijau text-xl tracking-tight leading-none">
            POPMI KTP
          </p>
          <p className="text-[11px] font-semibold tracking-widest text-teks/50 uppercase">
            Kecamatan Temiang Pesisir
          </p>
          <p className="text-[10px] tracking-wider text-teks/40 uppercase">
            Kabupaten Lingga
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-kuning animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-kuning animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-kuning animate-bounce [animation-delay:300ms]" />
        </div>
      </div>

      {/* Slogan */}
      <p className="absolute bottom-8 text-[10px] text-teks/30 italic tracking-wide">
        Satu Sistem, Surat Tertib, Aduan Terpantau.
      </p>
    </div>
  )
}
