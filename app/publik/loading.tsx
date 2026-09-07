import Image from "next/image"

export default function PublikLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      {/* Logo dengan ring kuning */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-2 border-kuning-muda flex items-center justify-center bg-white shadow-md">
          <Image
            src="/logo-lingga.png"
            alt="Logo Kabupaten Lingga"
            width={60}
            height={60}
            className="object-contain"
            priority
          />
        </div>
        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full border-2 border-t-kuning border-r-kuning border-b-transparent border-l-transparent animate-spin" />
      </div>

      {/* Teks + dots */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm font-semibold text-teks/60 tracking-wide">Memuat halaman...</p>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-kuning animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-kuning animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-kuning animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}
