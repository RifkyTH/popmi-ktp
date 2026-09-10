"use client"

import { useState, FormEvent, Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Lock, User, CheckCircle } from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || "/internal/beranda"

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push(from)
        router.refresh()
      }, 1800)
      return () => clearTimeout(timer)
    }
  }, [success, from, router])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      })

      if (res.ok) {
        setLoading(false)
        setSuccess(true)
      } else {
        setError("Username atau password salah. Silakan coba lagi.")
        setLoading(false)
      }
    } catch (err: any) {
      setError("Gagal terhubung ke server: " + err.message)
      setLoading(false)
    }
  }

  // ── Layar Sukses ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 animate-in fade-in duration-500">
        <style>{`
          @keyframes ping-once {
            0% { transform: scale(1); opacity: 1; }
            60% { transform: scale(1.5); opacity: 0.3; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes check-pop {
            0% { transform: scale(0); opacity: 0; }
            70% { transform: scale(1.15); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-ping-once { animation: ping-once 0.8s ease-out forwards; }
          .animate-check-pop { animation: check-pop 0.5s cubic-bezier(.36,2,.5,1) forwards; }
        `}</style>

        {/* Lingkaran centang animasi */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-28 h-28 rounded-full bg-kuning/20 animate-ping-once" />
          <div className="relative w-24 h-24 rounded-full bg-kuning flex items-center justify-center shadow-lg animate-check-pop">
            <CheckCircle className="w-12 h-12 text-hijau stroke-[2.5]" />
          </div>
        </div>

        {/* Teks */}
        <div className="text-center">
          <h2 className="text-2xl font-bold font-serif text-white">Selamat Datang!</h2>
          <p className="text-white/60 text-sm mt-1">Mengarahkan ke dashboard...</p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-kuning/70"
              style={{
                animation: `pulse 1s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    )
  }


  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Masuk ke Akun</h2>
        <p className="text-gray-500 text-sm mt-2">Silakan masukkan kredensial sistem Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100 flex items-start gap-3">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-hijau transition-colors">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau transition-all placeholder:text-gray-400 text-gray-900"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <button type="button" className="text-xs font-medium text-hijau hover:text-hijau/80 transition-colors">
                Lupa sandi?
              </button>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-hijau transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full pl-11 pr-11 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau transition-all placeholder:text-gray-400 text-gray-900"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-6 rounded-xl bg-hijau hover:bg-hijau/90 text-white font-medium text-base shadow-sm shadow-hijau/20 transition-all hover:shadow-md hover:shadow-hijau/20 active:scale-[0.98]"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Memproses...</span>
            </div>
          ) : (
            "Masuk"
          )}
        </Button>
      </form>

      {/* Demo credentials - minimal look */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Akses Cepat Demo</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Staf', u: 'staf', p: 'staf123' },
            { label: 'Kasi Pem (Zakaria)', u: 'zakaria', p: 'kecamatan123' },
            { label: 'Sekretaris (Jubir)', u: 'jubir', p: 'kecamatan123' },
            { label: 'Camat', u: 'camat', p: 'camat123' },
            { label: 'Admin', u: 'admin', p: 'admin123' },
            { label: 'Superadmin', u: 'superadmin', p: 'superadmin123' },
          ].map((item) => (
            <button 
              key={item.u}
              type="button"
              onClick={() => { setUsername(item.u); setPassword(item.p); }}
              className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex">
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-hijau items-center justify-center overflow-hidden">
        {/* Subtle background pattern/gradient */}
        <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-10" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-hijau/80 to-transparent mix-blend-multiply" />
        
        <div className="relative z-10 p-12 max-w-lg text-white">
          <div className="mb-8">
            <div className="w-48 h-48 mb-6">
              <img src="/logo-lingga.png" alt="Logo Lingga" className="w-full h-full object-contain drop-shadow-lg" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-medium leading-tight mb-4">
              Sistem Informasi<br />Layanan Terpadu
            </h1>
            <p className="text-white/70 text-lg leading-relaxed font-light">
              Portal administrasi dan manajemen pelayanan publik terpadu Kecamatan Temiang Pesisir.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm font-medium text-white/50 border-t border-white/10 pt-8 mt-12">
            <span>&copy; {new Date().getFullYear()} POPMI KTP</span>
            <span className="w-1.5 h-1.5 rounded-full bg-kuning/50" />
            <span>Kabupaten Lingga</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[400px]">
          {/* Mobile Header (Shows only on small screens) */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center w-40 h-40 mb-4">
              <img src="/logo-lingga.png" alt="Logo Lingga" className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <h1 className="text-2xl font-serif font-medium text-hijau">POPMI KTP</h1>
          </div>

          <Suspense fallback={<div className="animate-pulse h-64 bg-gray-100 rounded-xl"></div>}>
            <LoginForm />
          </Suspense>

          <div className="mt-12 text-center lg:text-left">
            <a 
              href="/publik" 
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-hijau transition-colors group font-medium"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              Kembali ke Portal Publik
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
