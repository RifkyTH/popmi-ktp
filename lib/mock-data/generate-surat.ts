import type { Surat } from "./surat"

// â”€â”€â”€ Logo (base64 placeholder â€” diambil dari path publik saat runtime) â”€â”€â”€â”€â”€â”€â”€â”€â”€
// e-TEPI menggunakan LOGO_KAB_LINGGA sebagai konstanta base64 atau URL
const LOGO_URL = "/logo-lingga.png"

// â”€â”€â”€ Helper format tanggal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function formatTanggal(iso: string): string {
  const bulan = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember"
  ]
  const d = new Date(iso)
  return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`
}

// â”€â”€â”€ Kop Surat (identik dengan e-TEPI print.js kopSurat()) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function kopSurat(): string {
  return `
  <table width="100%" style="font-family:Arial;border-collapse:collapse;">
    <tr>
      <td width="85" style="vertical-align:middle;text-align:center;padding:0;">
        <img src="${LOGO_URL}" style="width:75px;height:auto;display:block;margin:0 auto;" alt="Logo">
      </td>
      <td style="vertical-align:middle;text-align:center;padding:0 0 0 8px;">
        <div style="font-family:Arial;font-size:14pt;font-weight:normal;line-height:1.3;">PEMERINTAH KABUPATEN LINGGA</div>
        <div style="font-family:Arial;font-size:20pt;font-weight:bold;line-height:1.2;">KECAMATAN TEMIANG PESISIR</div>
        <div style="font-family:Arial;font-size:9pt;margin-top:2px;">Jalan. Bathin Aban No. 1, Temiang Pesisir, Lingga, Kepulauan Riau, 29873</div>
        <div style="font-family:Arial;font-size:9pt;">Pos-el : kec.temiangpesisir.lingga@gmail.com</div>
      </td>
    </tr>
  </table>
  <hr style="border:0;border-top:3px solid #000;margin:5px 0 1px 0;">
  <hr style="border:0;border-top:1px solid #000;margin:0 0 12px 0;">`
}

// --- Field row helper (label : value) -----------------------------------------
function fieldRow(label: string, value: string, labelWidth = "150px"): string {
  return `
  <tr>
    <td style="width:${labelWidth};vertical-align:top;padding:2px 0;font-family:Arial;font-size:12pt;line-height:1.15;white-space:nowrap;">${label}</td>
    <td style="width:1%;vertical-align:top;padding:2px 12px;font-family:Arial;font-size:12pt;line-height:1.15;white-space:nowrap;">:</td>
    <td style="vertical-align:top;padding:2px 0;font-family:Arial;font-size:12pt;line-height:1.15;text-align:justify;width:100%;">${value || ""}</td>
  </tr>`
}

// --- Judul Surat (bold, underline, centered) ----------------------------------
function judulSurat(judul: string, nomor: string): string {
  return `
  <div style="text-align:center;font-family:Arial;font-size:12pt;margin-top:16px;line-height:1.2;">
    <strong><u>${judul.toUpperCase()}</u></strong>
  </div>
  <div style="text-align:center;font-family:Arial;font-size:12pt;margin-top:2px;margin-bottom:8px;line-height:1.2;">
    Nomor : ${nomor}
  </div>`
}

// â”€â”€â”€ Blok TTD Camat â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ttdCamat(tanggal: string, isSigned: boolean = false, jabatan = "CAMAT TEMIANG PESISIR", nama = "HENDRA, S.STP", pangkat = "PEMBINA / IV.a", nip = "NIP. 198507122006021001", showDate: boolean = true, ttdImgUrl = "/ttd-camat.jpeg"): string {
  return `
  <table style="width:100%;font-family:Arial;font-size:12pt;margin-top:40px;">
    <tr>
      <td style="width:65%;"></td>
      <td style="width:35%;vertical-align:top;">
        ${showDate ? `Tajur Biru, ${formatTanggal(tanggal)}<br>` : ""}
        <strong>${jabatan}</strong>,<br>
        ${isSigned ? `<img src="${ttdImgUrl}" style="width:75px;height:auto;mix-blend-mode:multiply;display:block;margin:4px 0;" />` : `<div style="height:70px;"></div>`}
        <strong><u>${nama}</u></strong><br>
        ${pangkat}<br>
        ${nip}
      </td>
    </tr>
  </table>`
}

// â”€â”€â”€ Isi Surat Khusus â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function getIsiSurat(surat: Surat): string {
  const f = surat.data_form || {}
  
  if (surat.jenis === "dispensasi_nikah") {
    // Helper untuk coretan (strike-through)
    const strike = (opts: string[], selected: string) => {
      return opts.map(opt => (opt === selected ? opt : `<del>${opt}</del>`)).join("/")
    }

    const tglSurat = f.tanggalSuratDesa ? formatTanggal(f.tanggalSuratDesa) : "......................"
    const tglNikah = f.tanggalNikah ? formatTanggal(f.tanggalNikah) : "......................"
    const desaTeks = f.desaPengantar || "......................"

    return `

    <div style="font-family:Arial, sans-serif;font-size:12pt;line-height:1.15;margin-top:16px;">
      <p>Camat Temiang Pesisir Kabupaten Lingga menerangkan bahwa :</p>
      
      <div style="margin-top:12px;">
        <div>1. Calon Suami :</div>
        <table style="width:100%;margin-left:16px;margin-top:4px;border-collapse:collapse;font-size:12pt;">
          <tr>
            <td style="width:160px;vertical-align:top;">Nama</td>
            <td style="width:12px;vertical-align:top;">:</td>
            <td style="vertical-align:top;">${f.namaSuami?.toUpperCase() || ""}</td>
          </tr>
          <tr>
            <td style="vertical-align:top;">Tempat Tanggal Lahir</td>
            <td style="vertical-align:top;">:</td>
            <td style="vertical-align:top;">${f.tempatLahirSuami || ""}, ${f.tanggalLahirSuami ? formatTanggal(f.tanggalLahirSuami) : ""}</td>
          </tr>
          <tr>
            <td style="vertical-align:top;">Jenis Kelamin</td>
            <td style="vertical-align:top;">:</td>
            <td style="vertical-align:top;">${f.jkSuami || ""}</td>
          </tr>
          <tr>
            <td style="vertical-align:top;">Agama</td>
            <td style="vertical-align:top;">:</td>
            <td style="vertical-align:top;">${f.agamaSuami || ""}</td>
          </tr>
          <tr>
            <td style="vertical-align:top;">Status Perkawinan</td>
            <td style="vertical-align:top;">:</td>
            <td style="vertical-align:top;">${strike(["Jejaka", "Duda Mati", "Duda Cerai"], f.statusSuami)}</td>
          </tr>
          <tr>
            <td style="vertical-align:top;">Pekerjaan</td>
            <td style="vertical-align:top;">:</td>
            <td style="vertical-align:top;">${f.pekerjaanSuami || ""}</td>
          </tr>
          <tr>
            <td style="vertical-align:top;">Alamat</td>
            <td style="vertical-align:top;">:</td>
            <td style="vertical-align:top;">${f.alamatSuami || ""}</td>
          </tr>
        </table>
      </div>

      <div style="margin-top:12px;">
        <div>2. Calon Istri :</div>
        <table style="width:100%;margin-left:16px;margin-top:4px;border-collapse:collapse;font-size:12pt;">
          <tr>
            <td style="width:160px;vertical-align:top;">Nama</td>
            <td style="width:12px;vertical-align:top;">:</td>
            <td style="vertical-align:top;">${f.namaIstri?.toUpperCase() || ""}</td>
          </tr>
          <tr>
            <td style="vertical-align:top;">Tempat Tanggal Lahir</td>
            <td style="vertical-align:top;">:</td>
            <td style="vertical-align:top;">${f.tempatLahirIstri || ""}, ${f.tanggalLahirIstri ? formatTanggal(f.tanggalLahirIstri) : ""}</td>
          </tr>
          <tr>
            <td style="vertical-align:top;">Jenis Kelamin</td>
            <td style="vertical-align:top;">:</td>
            <td style="vertical-align:top;">${f.jkIstri || ""}</td>
          </tr>
          <tr>
            <td style="vertical-align:top;">Agama</td>
            <td style="vertical-align:top;">:</td>
            <td style="vertical-align:top;">${f.agamaIstri || ""}</td>
          </tr>
          <tr>
            <td style="vertical-align:top;">Status Perkawinan</td>
            <td style="vertical-align:top;">:</td>
            <td style="vertical-align:top;">${strike(["Perawan", "Janda Mati", "Janda Cerai"], f.statusIstri)}</td>
          </tr>
          <tr>
            <td style="vertical-align:top;">Pekerjaan</td>
            <td style="vertical-align:top;">:</td>
            <td style="vertical-align:top;">${f.pekerjaanIstri || ""}</td>
          </tr>
          <tr>
            <td style="vertical-align:top;">Alamat</td>
            <td style="vertical-align:top;">:</td>
            <td style="vertical-align:top;">${f.alamatIstri || ""}</td>
          </tr>
        </table>
      </div>

      <p style="margin-top:16px;text-align:justify;">
        Berdasarkan Surat Model N1, N2, N4 dari kelurahan/Desa ${desaTeks} tanggal ${tglSurat} bahwa yang bersangkutan ingin melangsungkan akad nikah pada tanggal ${tglNikah} bertempat di ${f.tempatNikah || "......................"}, karena pelaporan untuk melangsungkan pernikahan ini sudah lengkap, maka kami memberikan dispensasi untuk melangsungkan akad nikah tersebut dengan alasan Calon Pengantin sudah memenuhi persyaratan.
      </p>

      <p style="margin-top:16px;">
        Demikian surat dispensasi nikah ini kami berikan, untuk dipergunakan sebagaimana mestinya.
      </p>
    </div>`
  }

  // Jika bukan dispensasi_nikah, pakai flat template biasa
  const keys = Object.keys(f).filter(k => k !== "desaPengantar" && k !== "tanggalSuratDesa")
  let rows = ""
  for (const k of keys) {
    if (f[k]) {
      const label = k.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())
      rows += fieldRow(label, f[k])
    }
  }

  return `
  <div style="font-family:Arial;font-size:12pt;margin-top:12px;">
    <p>Yang bertanda tangan di bawah ini, Camat Temiang Pesisir Kabupaten Lingga,</p>
    <p>menerangkan / merekomendasikan bahwa :</p>
    <table style="width:100%;margin-left:16px;margin-top:12px;border-collapse:collapse;font-size:12pt;">
      ${rows}
    </table>
    <p style="margin-top:16px;">Demikian surat ini dibuat untuk dapat dipergunakan sebagaimana mestinya.</p>
  </div>`
}

// â”€â”€â”€ GENERATOR UTAMA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function generateSuratHTML(surat: Surat): string {
  const isSigned = surat.status === "terbit" || surat.status === "terkirim";
  const base = "font-family:Arial;font-size:12pt;color:#000;line-height:1.15;"
  const tanggal = surat.tanggalTerbit || new Date().toISOString().split("T")[0]
  const desa = surat.desa || "Pulau Batang"
  const formData = (surat.data_form || {}) as Record<string, any>
  const isSignedJubir = Boolean(formData.ttd_jubir) && formData.ttd_jubir !== "false"
  const isSignedZakaria = Boolean(formData.ttd_zakaria) && formData.ttd_zakaria !== "false"
  // Nama verifikator â€” bisa di-override oleh superadmin via penandatangan_jubir/zakaria
  const namaVerifikator1: string = formData.verifikator_1_nama || "JUBIR, S.Pd.SD"
  const namaVerifikator2: string = formData.verifikator_2_nama || "ZAKARIA, A.Ma.Pd"
  // TTD src â€” null jika belum upload (tidak pakai fallback default agar gambar tidak muncul)
  const ttdJubirSrc: string | null = formData.ttd_jubir_url || null
  const ttdZakariaSrc: string | null = formData.ttd_zakaria_url || null
  const ttdCamatSrc = formData.ttd_camat_url || "/ttd-camat.jpeg"

  switch (surat.jenis) {

    // â”€â”€ 1. DISPENSASI NIKAH â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    case "dispensasi_nikah": {
      const f = surat.data_form || {}
      const strike = (opts: string[], selected: string) => {
        if (!selected) return opts.join(" / ")
        return opts.map(opt => (opt === selected ? opt : `<del>${opt}</del>`)).join(" / ")
      }
      
      const tglSurat = f.tanggalSuratDesa ? formatTanggal(f.tanggalSuratDesa) : "......................"
      const tglNikah = f.tanggalNikah ? formatTanggal(f.tanggalNikah) : "......................"
      const desaTeks = f.desaPengantar || "......................"

      const rowFormat = (label: string, value: string) => `
        <tr>
          <td style="width:22px;"></td>
          <td style="width:178px;vertical-align:top;">${label}</td>
          <td style="width:16px;vertical-align:top;text-align:center;">:</td>
          <td style="vertical-align:top;">${value || ""}</td>
        </tr>
      `

      const formatTTL = (tempat: string, tgl: string) => {
        if (tempat && tgl) return `${tempat}, ${formatTanggal(tgl)}`
        if (tempat) return tempat
        if (tgl) return formatTanggal(tgl)
        return ""
      }

      return `
      <div class="print-page" style="${base}">
        ${kopSurat()}
        ${judulSurat("DISPENSASI NIKAH", surat.nomor)}

        <p style="margin-bottom:12px;font-family:Arial;font-size:12pt;">
          Camat Temiang Pesisir Kabupaten Lingga menerangkan bahwa :
        </p>

        <table style="width:100%;font-family:Arial;font-size:12pt;border-collapse:collapse;">
          <tr>
            <td style="width:22px; font-weight:bold; vertical-align:top;">1.</td>
            <td colspan="3" style="font-weight:bold; padding-bottom:4px;">Calon Suami :</td>
          </tr>
          ${rowFormat("Nama", (f.namaSuami || "").toUpperCase())}
          ${rowFormat("Tempat Tanggal Lahir", formatTTL(f.tempatLahirSuami, f.tanggalLahirSuami))}
          ${rowFormat("Jenis Kelamin", f.jkSuami || "")}
          ${rowFormat("Agama", f.agamaSuami || "")}
          ${rowFormat("Status Perkawinan", strike(["Jejaka", "Duda Mati", "Duda Cerai"], f.statusSuami))}
          ${rowFormat("Pekerjaan", f.pekerjaanSuami || "")}
          ${rowFormat("Alamat", f.alamatSuami || "")}
          
          <tr><td colspan="4" style="height:18px;"></td></tr>
          
          <tr>
            <td style="width:22px; font-weight:bold; vertical-align:top;">2.</td>
            <td colspan="3" style="font-weight:bold; padding-bottom:4px;">Calon Istri :</td>
          </tr>
          ${rowFormat("Nama", (f.namaIstri || "").toUpperCase())}
          ${rowFormat("Tempat Tanggal Lahir", formatTTL(f.tempatLahirIstri, f.tanggalLahirIstri))}
          ${rowFormat("Jenis Kelamin", f.jkIstri || "")}
          ${rowFormat("Agama", f.agamaIstri || "")}
          ${rowFormat("Status Perkawinan", strike(["Perawan", "Janda Mati", "Janda Cerai"], f.statusIstri))}
          ${rowFormat("Pekerjaan", f.pekerjaanIstri || "")}
          ${rowFormat("Alamat", f.alamatIstri || "")}
        </table>

        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-top:16px;margin-bottom:0;text-indent:22px;">
          Berdasarkan Surat Model N1, N2, N4 dari kelurahan/Desa ${desaTeks} tanggal ${tglSurat} bahwa yang bersangkutan ingin melangsungkan akad nikah pada tanggal ${tglNikah} bertempat di ${f.tempatNikah || "......................"}, karena pelaporan untuk melangsungkan pernikahan ini sudah lengkap, maka kami memberikan dispensasi untuk melangsungkan akad nikah tersebut dengan alasan Calon Pengantin sudah memenuhi persyaratan.
        </p>
        
        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-top:16px;margin-bottom:0;text-indent:22px;">
          Demikian surat dispensasi nikah ini kami berikan, untuk dipergunakan sebagaimana mestinya.
        </p>

        <table style="width:100%;margin-top:24px;font-family:Arial;font-size:12pt;border-collapse:collapse;">
          <tr>
            <td style="width:100%;"></td>
            <td style="text-align:left; line-height:1.2; white-space:nowrap;">
              <table style="border:none; margin:0; padding:0; border-collapse:collapse; font-family:Arial; font-size:12pt;">
                <tr>
                  <td style="width:28px;"></td>
                  <td style="padding-bottom:4px;">Tajur Biru, ${formatTanggal(tanggal)}</td>
                </tr>
                <tr>
                  <td colspan="2" style="font-weight:bold; vertical-align:top; padding-bottom:2px;">CAMAT TEMIANG PESISIR,</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:4px 0;">
                    ${isSigned ? `<img src="${ttdCamatSrc}" style="width:75px;height:auto;mix-blend-mode:multiply;display:block;margin-bottom:2px;" />` : `<div style="height:70px;"></div>`}
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td style="font-weight:bold;"><span style="text-decoration:underline;">HENDRA, S.STP</span></td>
                </tr>
                <tr>
                  <td></td>
                  <td style="font-weight:bold;">PEMBINA / IV.a</td>
                </tr>
                <tr>
                  <td></td>
                  <td style="font-weight:bold;">NIP. 198507122006021001</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>`
    }

    // â”€â”€ 2. REKOMENDASI BBM JBKP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    case "bbm_jbkp": {
      const f = surat.data_form || {}
      return `
      <div class="print-page" style="${base}">
        ${kopSurat()}
        ${judulSurat("Surat Rekomendasi Pembelian Jenis BBM Khusus Penugasan (JBKP)", surat.nomor)}

        <p style="font-family:Arial;font-size:12pt;margin-bottom:2px;">Dasar Hukum :</p>
        <ol style="font-family:Arial;font-size:12pt;margin:0;padding-left:20px;margin-bottom:12px;text-align:justify;">
          <li style="margin-bottom:0px;">Undang-Undang Nomor 22 Tahun 2001 tentang Minyak dan Gas Bumi sebagaimana telah diubah dengan Undang-Undang Nomor 6 Tahun 2023 tentang penetapan Peraturan Pemerintahan Pengganti Undang-Undang Nomor 2 Tahun 2002 tentang Cipta Kerja menjadi Undang-Undang;</li>
          <li style="margin-bottom:0px;">Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah sebagaimana telah beberapa kali diubah terakhir dengan Undang-Undang Nomor 6 Tahun 2023 tentang Penetapan Peraturan Pemerintah Pengganti Undang-Undang Nomor 2 Tahun 2022 tentang Cipta Kerja menjadi Undang-Undang; dan</li>
          <li style="margin-bottom:0px;">Peraturan Presiden Nomor 191 Tahun 2014 tentang Penyediaan, Pendistribusian dan Harga Jual Eceran Bahan Bakar Minyak sebagaimana telah diubah terakhir dengan Peraturan Presiden Nomor 117 Tahun 2021 tentang perubahan Ketiga Atas Peraturan Presiden Nomor 191 Tahun 2014 tentang Penyediaan, Pendistribusian dan Harga Jual Eceran Bahan Bakar Minyak;</li>
          <li style="margin-bottom:0px;">Peraturan Badan Pengatur Hilir Minyak dan Gas Bumi Nomor 02 Tahun 2023 tentang Penerbitan Surat Rekomendasi Untuk Pembelian Jenis Bahan Bakar Minyak Tertentu dan Jenis Bahan Bakar Minyak Khusus Penugasan;</li>
          <li style="margin-bottom:0px;">Surat Keputusan Bupati Lingga Nomor: 317/KPTS/VI/2024 tentang Penyerahan Sebagian Kewenangan Bupati Lingga Kepada Perangkat Daerah Dalam Penerbitan Surat Rekomendasi Untuk Pembelian Bahan Bakar Minyak Tertentu (JBT) Jenis Bio Solar dan Minyak Tanah, dan Pembelian Minyak Khusus Penugasan (JBKP) Jenis Pertalite;</li>
        </ol>

        <p style="font-family:Arial;font-size:12pt;margin-bottom:12px;">Dengan ini memberikan Surat Rekomendasi kepada :</p>
        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:8px;border-collapse:collapse;text-align:left;table-layout:fixed;word-wrap:break-word;">
          <tr>
            <td style="width:24px;vertical-align:top;">1.</td>
            <td style="width:240px;vertical-align:top;">Nama</td>
            <td style="width:12px;vertical-align:top;">:</td>
            <td style="vertical-align:top;text-align:justify;width:100%;">${surat.pemohon.toUpperCase()}</td>
          </tr>
          <tr>
            <td style="vertical-align:top;">2.</td>
            <td style="vertical-align:top;">NIK</td>
            <td style="vertical-align:top;">:</td>
            <td style="vertical-align:top;text-align:justify;width:100%;">${f.nik || "2104032102110001"}</td>
          </tr>
          <tr>
            <td style="vertical-align:top;">3.</td>
            <td style="vertical-align:top;">Alamat</td>
            <td style="vertical-align:top;">:</td>
            <td style="vertical-align:top;text-align:justify;width:100%;">${f.alamat || `Tanjung Ambat, RT. 01 / RW. 01 Desa ${desa} Kecamatan Temiang Pesisir`}</td>
          </tr>
          <tr>
            <td style="vertical-align:top;">4.</td>
            <td style="vertical-align:top;">Nama Usaha (jika ada)</td>
            <td style="vertical-align:top;">:</td>
            <td style="vertical-align:top;text-align:justify;width:100%;">${f.namaUsaha || `Sub Penyalur BBM ${surat.pemohon.toUpperCase()}`}</td>
          </tr>
          <tr>
            <td style="vertical-align:top;">5.</td>
            <td style="vertical-align:top;">Sektor Konsumen Pengguna</td>
            <td style="vertical-align:top;">:</td>
            <td style="vertical-align:top;text-align:justify;width:100%;">${f.sektor || "Sarana Transportasi Umum"}</td>
          </tr>
          <tr>
            <td style="vertical-align:top;">6.</td>
            <td style="vertical-align:top;">Jenis Usaha</td>
            <td style="vertical-align:top;">:</td>
            <td style="vertical-align:top;text-align:justify;width:100%;">${f.jenisUsaha || "Angkutan Darat dan Laut JBKP (Ron 90/Pertalite)"}</td>
          </tr>
        </table>

        <div style="page-break-inside: avoid; margin-top: 8px;">
          <p style="font-family:Arial;font-size:12pt;margin-bottom:2px;">Berdasarkan Hasil Verifikasi dan Evaluasi Perhitungan:</p>
          <ol style="font-family:Arial;font-size:12pt;margin:0;padding-left:20px;margin-bottom:12px;text-align:justify;">
            <li style="margin-bottom:2px;">Kebutuhan Jenis Minyak Khusus Penugasan (JBKP) yang digunakan untuk Pembelian BBM Jenis Pertalite;</li>
            <li style="margin-bottom:2px;">Diberikan Jenis BBM Khusus Penugasan (JBKP) Jenis Pertalite:
              <table style="width:100%;font-family:Arial;font-size:12pt;margin-top:2px;margin-bottom:2px;border-collapse:collapse;text-align:left;table-layout:fixed;word-wrap:break-word;">
                <tr>
                  <td style="width:24px;vertical-align:top;padding:0 0 0 4px;">a.</td>
                  <td style="width:240px;vertical-align:top;padding:0;">Alokasi Volume</td>
                  <td style="width:12px;vertical-align:top;padding:0;">:</td>
                  <td style="vertical-align:top;padding:0;text-align:justify;width:100%;">${f.volume || "3.200"} Liter / Bulan</td>
                </tr>
                <li>
              Surat Rekomendasi ini diberikan untuk jangka waktu: ${f.jangkaWaktu || "4 (empat) Minggu"}
            </li>
                <tr>
                  <td style="vertical-align:top;padding:0 0 0 4px;">b.</td>
                  <td style="vertical-align:top;padding:0;">Tempat Pengambilan</td>
                  <td style="vertical-align:top;padding:0;">:</td>
                  <td style="vertical-align:top;padding:0;text-align:justify;width:100%;">${f.tempatPengambilan || "PT. Petro Nusatama Sebangka"}</td>
                </tr>
                <tr>
                  <td style="vertical-align:top;padding:0 0 0 4px;">c.</td>
                  <td style="vertical-align:top;padding:0;">Nomor Penyalur</td>
                  <td style="vertical-align:top;padding:0;">:</td>
                  <td style="vertical-align:top;padding:0;text-align:justify;width:100%;">${f.nomorPenyalur || "16.291.064"}</td>
                </tr>
                <tr>
                  <td style="vertical-align:top;padding:0 0 0 4px;">d.</td>
                  <td style="vertical-align:top;padding:0;">Alamat Penyalur</td>
                  <td style="vertical-align:top;padding:0;">:</td>
                  <td style="vertical-align:top;padding:0;text-align:justify;width:100%;">${f.alamatPenyalur || "Pulau Sebangka, RT.010 / RW.004 Kecamatan Senayang"}</td>
                </tr>
              </table>
            </li>
            <li style="margin-bottom:2px;text-align:left;">
              <span style="display:inline-block;width:264px;vertical-align:top;">Alat Pembelian yang digunakan</span><span style="display:inline-block;width:12px;vertical-align:top;">:</span><span style="display:inline-block;vertical-align:top;">${f.alatPembelian || "DRUM"}</span>
            </li>
            <li style="margin-bottom:2px;">Jangka waktu pemberlakuan Surat Rekomendasi ini sampai dengan tanggal ${f.jangkaWaktu ? new Date(f.jangkaWaktu).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "31 Agustus 2026"}.</li>
            <li style="margin-bottom:2px;">Surat Rekomendasi ini hanya berlaku untuk perseorangan sesuai dengan identitas pemohon Surat Rekomendasi.</li>
            <li style="margin-bottom:2px;">Surat Rekomendasi ini dilarang untuk diberikan, dipindahtangankan, atau dialihkan kepada pihak lain.</li>
            <li style="margin-bottom:2px;">Apabila Surat Rekomendasi tidak dipergunakan sebagaimana mestinya dan tidak sesuai dengan ketentuan peraturan perundang-undangan, Surat Rekomendasi akan dicabut dan diproses secara hukum sesuai dengan ketentuan peraturan perundang-undangan.</li>
            <li style="margin-bottom:2px;">Surat Rekomendasi ini beserta lampirannya harus dilampirkan kembali saat perpanjangan atau pengajuan ulang permohonan Surat Rekomendasi.</li>
          </ol>
        </div>

        ${ttdCamat(tanggal, isSigned, "CAMAT TEMIANG PESISIR", "HENDRA, S.STP", "PEMBINA / IV.a", "NIP. 198507122006021001", true, ttdCamatSrc)}
      </div>`
    }

    // â”€â”€ 3. REKOMENDASI BBM JBT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    case "bbm_jbt": {
      const f = surat.data_form || {}
      return `
      <div class="print-page" style="${base}">
        ${kopSurat()}
        ${judulSurat("Surat Rekomendasi Pembelian Jenis BBM Tertentu (JBT)", surat.nomor)}

        <p style="font-family:Arial;font-size:12pt;line-height:1.15;margin-bottom:4px;">Dasar Hukum :</p>
        <ol style="font-family:Arial;font-size:12pt;line-height:1.15;margin-left:20px;margin-bottom:8px;text-align:justify;">
          <li style="margin-bottom:6px;">Undang-Undang Nomor 22 Tahun 2001 tentang Minyak dan Gas Bumi sebagaimana telah diubah dengan Undang-Undang Nomor 6 Tahun 2023 Tentang Penetapan Peraturan Pemerintah Pengganti Undang-Undang Nomor 2 Tahun 2022 Tentang Cipta Kerja Menjadi Undang-Undang;</li>
          <li style="margin-bottom:6px;">Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah sebagaimana telah beberapa kali diubah terakhir dengan Undang-Undang Nomor 6 Tahun 2023 Tentang Penetapan Peraturan Pemerintah Pengganti Undang-Undang Nomor 2 Tahun 2022 Tentang Cipta Kerja Menjadi Undang-Undang; dan</li>
          <li style="margin-bottom:6px;">Peraturan Presiden Nomor 191 Tahun 2014 Tentang Penyediaan, Pendistribusian dan Harga Jual Eceran Bahan Bakar Minyak Sebagaimana Telah diubah Terakhir dengan Peraturan Presiden Nomor 117 Tahun 2021 Perubahan ketiga atas Peraturan Presiden Nomor 191 Tahun 2014 tentang penyediaan, pendistribusian dan harga jual eceran Bahan Bakar Minyak;</li>
          <li style="margin-bottom:6px;">Peraturan Badan Pengatur Hilir Minyak dan Gas Bumi Nomor 02 Tahun 2023 tentang Penerbitan Surat Rekomendasi Untuk Pembelian Jenis Bahan Bakar Minyak Tertentu dan Jenis Bahan Bakar Minyak Khusus Penugasan;</li>
          <li>Surat Keputusan Bupati Lingga Nomor : 317/KPTS/VI/2024 Tentang Penyerahan Sebagian Kewenangan Bupati Lingga Kepada Perangkat Daerah Dalam Penerbitan Surat Rekomendasi Untuk Pembelian Jenis Bahan Bakar Minyak Tertentu (JBT) Jenis Bio Solar dan Minyak Tanah, dan Pembelian Jenis Bahan Bakar Minyak Khusus Penugasan (JBKP) Jenis Pertalite.</li>
        </ol>

        <p style="font-family:Arial;font-size:12pt;line-height:1.15;margin-bottom:4px;">Dengan ini memberikan Surat Rekomendasi Kepada :</p>
        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:8px;border-collapse:collapse;table-layout:fixed;word-wrap:break-word;">
          ${fieldRow("Nama", surat.pemohon, "230px")}
          ${fieldRow("NIK", f.nik || "2104031108810001", "230px")}
          ${fieldRow("Alamat", f.alamat || `Tanjung Ambat RT.01 RW.01 Desa ${desa}, Kecamatan Temiang Pesisir`, "230px")}
          ${fieldRow("Nama Usaha", f.namaUsaha || "-", "230px")}
          ${fieldRow("Sektor Konsumen Pengguna", `Rumah Tangga / Usaha Mikro di Desa ${desa}`, "230px")}
          ${fieldRow("Jenis Usaha", f.jenisUsaha || "-", "230px")}
        </table>

        <div style="page-break-inside: avoid; margin-top: 8px;">
        <p style="font-family:Arial;font-size:12pt;line-height:1.15;margin-top:4px;margin-bottom:4px;">Berdasarkan Hasil Verifikasi dan Evaluasi Perhitungan:</p>
        <p style="font-family:Arial;font-size:12pt;line-height:1.15;margin-top:4px;margin-bottom:6px;">1. Kebutuhan Jenis BBM Tertentu yang di gunakan untuk Pembelian BBM Subsidi :</p>
        <table style="width:100%;font-family:Arial;font-size:12pt;border-collapse:collapse;margin-bottom:8px;table-layout:fixed;word-wrap:break-word;">
          <thead>
            <tr>
              <th style="border:1px solid #000;padding:4px;text-align:center;width:5%;">No</th>
              <th style="border:1px solid #000;padding:4px;text-align:center;width:23%;">Konsumen Pengguna</th>
              <th style="border:1px solid #000;padding:4px;text-align:center;width:12%;">Jumlah<br>KK</th>
              <th style="border:1px solid #000;padding:4px;text-align:center;width:14%;">Jenis<br>Alat</th>
              <th style="border:1px solid #000;padding:4px;text-align:center;width:14%;">Fungsi<br>Alat</th>
              <th style="border:1px solid #000;padding:4px;text-align:center;width:16%;">Jml Hari<br>Operasi/Bln</th>
              <th style="border:1px solid #000;padding:4px;text-align:center;width:16%;">Jml Keb<br>(Lt/Bulan)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border:1px solid #000;padding:4px;text-align:center;">1</td>
              <td style="border:1px solid #000;padding:4px;">Rumah Tangga</td>
              <td style="border:1px solid #000;padding:4px;text-align:center;">${f.jumlahRumahTangga || "172"}</td>
              <td style="border:1px solid #000;padding:4px;text-align:center;">Kompor</td>
              <td style="border:1px solid #000;padding:4px;text-align:center;">Memasak</td>
              <td style="border:1px solid #000;padding:4px;text-align:center;">30 Hari</td>
              <td style="border:1px solid #000;padding:4px;text-align:center;">${f.kebutuhanRumahTangga || "3.040"}</td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:4px;text-align:center;">2</td>
              <td style="border:1px solid #000;padding:4px;">Usaha Mikro</td>
              <td style="border:1px solid #000;padding:4px;text-align:center;">${f.jumlahUsahaMikro || "11"}</td>
              <td style="border:1px solid #000;padding:4px;text-align:center;">Kompor</td>
              <td style="border:1px solid #000;padding:4px;text-align:center;">Memasak</td>
              <td style="border:1px solid #000;padding:4px;text-align:center;">30 Hari</td>
              <td style="border:1px solid #000;padding:4px;text-align:center;">${f.kebutuhanUsahaMikro || "132"}</td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:4px;text-align:center;font-weight:bold;" colspan="2">JUMLAH</td>
              <td style="border:1px solid #000;padding:4px;text-align:center;font-weight:bold;">${parseInt(f.jumlahRumahTangga || "172") + parseInt(f.jumlahUsahaMikro || "11")}</td>
              <td style="border:1px solid #000;padding:4px;" colspan="3"></td>
              <td style="border:1px solid #000;padding:4px;text-align:center;font-weight:bold;">${f.volume || "11.800"}</td>
            </tr>
          </tbody>
        </table>
        </div>
        <div style="page-break-inside: avoid; padding-top: 64px; margin-top: 8px;">
        <p style="font-family:Arial;font-size:12pt;line-height:1.15;margin-top:4px;margin-bottom:6px;">2. Diberikan Jenis BBM Tertentu Jenis ${f.jenisBBM || "Minyak Tanah"} :</p>
        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:8px;border-collapse:collapse;table-layout:fixed;word-wrap:break-word;">
          ${fieldRow("a.  Alokasi Volume", `<strong>${f.volume || "11.800"} Liter Per (bulan)</strong>`, "270px")}
          ${fieldRow("b.  Tempat Pengambilan", f.tempatPengambilan || "AMT.PT.Bintang Abadi Sejahtera", "270px")}
          ${fieldRow("c.  Nomor Penyalur", f.nomorPenyalur || "12.3180", "270px")}
          ${fieldRow("d.  Alamat Penyalur", f.alamatPenyalur || "Pulau Sebangka Kecamatan Senayang", "270px")}
          ${fieldRow("e.  Alat Pembelian yang digunakan", f.alatPembelian || "Drum Besi", "270px")}
          ${fieldRow("f.  Jangka Waktu Pemberlakuan", `Surat Rekomendasi ini Sampai dengan Tanggal ${f.jangkaWaktu ? new Date(f.jangkaWaktu).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "31 Agustus 2026"}`, "270px")}
        </table>

        <ol style="font-family:Arial;font-size:12pt;line-height:1.15;margin-left:20px;margin-bottom:8px;padding-top:8px;text-align:justify;" start="3">
          <li style="margin-bottom:4px;">Penyalur SPBU wajib mencatat riwayat pembelian konsumen pengguna dalam format sebagaimana terlampir.</li>
          <li style="margin-bottom:4px;">Surat Rekomendasi ini hanya berlaku untuk perseorangan sesuai dengan identitas pemohon Surat Rekomendasi.</li>
          <li style="margin-bottom:4px;">Surat Rekomendasi ini dilarang untuk diberikan, dipindahtangankan, atau dialihkan kepada pihak lain.</li>
          <li style="margin-bottom:4px;">Apabila Surat Rekomendasi tidak dipergunakan sebagaimana mestinya dan tidak sesuai dengan ketentuan peraturan perundang-undangan, Surat Rekomendasi akan dicabut dan diproses secara hukum sesuai dengan ketentuan peraturan perundang-undangan.</li>
          <li style="margin-bottom:4px;">Surat Rekomendasi ini beserta lampirannya harus dilampirkan kembali saat perpanjangan atau pengajuan ulang permohonan Surat Rekomendasi.</li>
        </ol>
        </div>

        ${ttdCamat(tanggal, isSigned, "CAMAT TEMIANG PESISIR", "HENDRA, S.STP", "PEMBINA / IV.a", "NIP. 198507122006021001", true, ttdCamatSrc)}
      </div>`
    }

    // â”€â”€ 4. REKOMENDASI DANA DESA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    case "rekomendasi_dd": return `
      <div class="print-page" style="${base}">
        ${kopSurat()}

        <div style="text-align:right;font-family:Arial;font-size:12pt;margin:8px 0 16px 0;">
          Tajur Biru, ${formatTanggal(tanggal)}
        </div>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:8px;">
          ${fieldRow("Nomor", surat.nomor, "80px")}
          ${fieldRow("Sifat", "Penting", "80px")}
          ${fieldRow("Lampiran", "1 (Satu) Berkas", "80px")}
          ${fieldRow("Perihal", "<strong>Rekomendasi Pengajuan<br>Dana Desa Tahap II<br>T.A 2026</strong>", "80px")}
        </table>

        <div style="font-family:Arial;font-size:12pt;margin-bottom:12px;">
          Yth. Kepala Dinas Pemberdayaan Masyarakat dan Desa<br>
          Kabupaten Lingga<br>
          di -<br>
          <span style="font-weight:bold;margin-left:40px;">Daik Lingga</span>
        </div>

        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:10px;text-indent:40px;">
          Dengan Hormat, bahwa berdasarkan Peraturan Menteri Keuangan Nomor 7 Tahun 2026, Bab IV Pasal 7 Ayat (2) huruf a tentang Pengalokasian Dana Desa Setiap Desa, Penggunaan dan Penyaluran Dana Desa Tahun Anggaran 2026 dan Merekomendasikan Desa ${desa} untuk melanjutkan proses selanjutnya.
        </p>
        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:10px;text-indent:40px;">
          Adapun kelengkapan berkas dan persyaratan pencairan Dana Keuangan Desa ${desa} Tahap II (Dua) Dana Desa Tahun Anggaran 2026 (Terlampir).
        </p>
        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:10px;">
          Demikian disampaikan untuk menjadi bahan pertimbangan, atas perhatian dan kerjasama diucapkan terima kasih.
        </p>

        ${ttdCamat(tanggal, isSigned, "CAMAT TEMIANG PESISIR", "HENDRA, S.STP", "PEMBINA / IV.a", "NIP. 198507122006021001", false, ttdCamatSrc)}

        <div style="margin-top:20px;font-family:Arial;font-size:10pt;">
          Tembusan:<br>
          <ol style="margin-left:20px;margin-top:4px;padding-left:0;">
            <li>Yth. Kepala Badan Pengelolaan Keuangan dan Aset Daerah Kabupaten Lingga di Daik Lingga;</li>
            <li>Yth. Inspektur Kabupaten Lingga di Daik Lingga.</li>
          </ol>
        </div>

      </div>
      <!-- PAGE 2 -->
      <div class="print-page" style="${base};page-break-before:always;">
        ${kopSurat()}

        <div style="text-align:center;font-family:Arial;font-size:12pt;font-weight:bold;margin:12px 0 16px 0;">
          Berita Acara Hasil Verifikasi Kecamatan
        </div>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:12px;border:none;">
          <tr><td style="width:120px;">Desa</td><td>: ${desa}</td></tr>
          <tr><td>Kecamatan</td><td>: Temiang Pesisir</td></tr>
        </table>

        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:10px;text-indent:40px;line-height:1.5;">
          Pada Hari ini Senin Tanggal Dua Puluh Dua Bulan Juni Tahun Dua Ribu Dua Puluh Enam, (2026) telah dilaksanakan verifikasi terhadap kelengkapan persyaratan pengajuan penyaluran dana DD TAHAP II yang disampaikan oleh Desa ${desa} dengan catatan kesimpulan sebagai berikut:
        </p>

        <table style="width:100%;font-family:Arial;font-size:12pt;border-collapse:collapse;margin-bottom:12px;">
          <thead>
            <tr>
              <th style="border:1px solid #000;padding:6px;text-align:center;width:45px;white-space:nowrap;">No</th>
              <th style="border:1px solid #000;padding:6px;text-align:center;">Rincian</th>
              <th style="border:1px solid #000;padding:6px;text-align:center;width:150px;">CHEKLIST/KET</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">a.</td>
              <td style="border:1px solid #000;padding:6px;">Surat Permohonan Pencairan Dana dari Kepala Desa</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;"></td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">b.</td>
              <td style="border:1px solid #000;padding:6px;">Surat Kelengkapan Persyaratan Penyaluran Dari Camat</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;"></td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">c.</td>
              <td style="border:1px solid #000;padding:6px;">Laporan Realisasi DD Tahap I Tahun 2026</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;"></td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">d.</td>
              <td style="border:1px solid #000;padding:6px;">Laporan Realisasi Taging DD Tahap I Tahun 2026</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;"></td>
            </tr>
          </tbody>
        </table>

        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:12px;text-indent:40px;line-height:1.5;">
          Hasil verifikasi kecamatan terhadap kelengkapan persyaratan pengajuan penyaluran DD TAHAP II dalam kondisi lengkap, dan jumlah penggunaan dana yang akan disalurkan sudah sesuai dengan pagu yang tersedia.
        </p>
        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:24px;">
          Demikian Berita Acara ini dibuat untuk digunakan sebagaimana mestinya.
        </p>
        <table style="width:100%;font-family:Arial;font-size:12pt;border-collapse:collapse;">
          <thead>
            <tr>
              <th style="border:1px solid #000;padding:6px;text-align:center;width:45px;white-space:nowrap;">No</th>
              <th style="border:1px solid #000;padding:6px;text-align:center;">NAMA ANGGOTA TIM VERIFIKASI KECAMATAN</th>
              <th style="border:1px solid #000;padding:6px;text-align:center;width:180px;">TANDA TANGAN</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">1</td>
              <td style="border:1px solid #000;padding:6px;">${namaVerifikator1}</td>
              <td style="border:1px solid #000;padding:6px;height:60px;text-align:center;vertical-align:middle;">
                ${isSignedJubir && ttdJubirSrc ? `<img src="${ttdJubirSrc}" style="width:60px;height:60px;object-fit:contain;mix-blend-mode:multiply;" />` : ``}
              </td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">2</td>
              <td style="border:1px solid #000;padding:6px;">${namaVerifikator2}</td>
              <td style="border:1px solid #000;padding:6px;height:60px;text-align:center;vertical-align:middle;">
                ${isSignedZakaria && ttdZakariaSrc ? `<img src="${ttdZakariaSrc}" style="width:60px;height:60px;object-fit:contain;mix-blend-mode:multiply;" />` : ``}
              </td>
            </tr>
          </tbody>
        </table>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-top:20px;">
          <tr>
            <td style="width:65%;"></td>
            <td style="width:35%;vertical-align:top;">
              <strong>CAMAT TEMIANG PESISIR,</strong><br>
              ${isSigned ? `<img src="${ttdCamatSrc}" style="width:75px;height:auto;mix-blend-mode:multiply;display:block;margin:4px 0;" />` : `<div style="height:70px;"></div>`}
              <strong><u>HENDRA, S.STP</u></strong><br>
              PEMBINA / IV.a<br>
              NIP. 198507122006021001
            </td>
          </tr>
        </table>
      </div>`

    // â”€â”€ 5. REKOMENDASI ADD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    case "rekomendasi_add": return `
      <!-- PAGE 1: SURAT PENGANTAR -->
      <div class="print-page" style="${base}">
        ${kopSurat()}

        <div style="text-align:right;font-family:Arial;font-size:12pt;margin-top:20px;margin-bottom:20px;">
          Tajur Biru, ${formatTanggal(tanggal)}
        </div>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:8px;">
          ${fieldRow("Nomor", surat.nomor, "80px")}
          ${fieldRow("Sifat", "Penting", "80px")}
          ${fieldRow("Lampiran", "1 (satu) dokumen", "80px")}
          ${fieldRow("Perihal", "<strong>Rekomendasi Pengajuan ADD<br>Bulan Februari 2026</strong>", "80px")}
        </table>

        <div style="font-family:Arial;font-size:12pt;margin-bottom:12px;">
          Yth. Kepala Dinas Pemberdayaan Masyarakat<br>
          dan Desa Kabupaten Lingga<br>
          di -<br>
          <span style="font-weight:bold;margin-left:40px;">Daik Lingga</span>
        </div>

        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:10px;text-indent:40px;line-height:1.5;">
          Dengan ini kami kirimkan berkas kelengkapan pengajuan Alokasi Dana Desa bulan Februari 2026 sesuai dengan Peraturan Bupati Lingga Nomor 21 Tahun 2025 Tentang Perubahan atas Peraturan Bupati Lingga Nomor 127 Tahun 2022 tentang Tata Cara Pengalokasian Alokasi Dana Desa bersumber dari Anggaran Pendapatan dan Belanja Daerah, Desa ${desa} dengan rincian terlampir.
        </p>
        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:10px;text-indent:40px;line-height:1.5;">
          Demikian disampaikan untuk menjadi bahan pertimbangan, atas perhatian dan kerjasamanya diucapkan terima kasih.
        </p>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-top:40px;">
          <tr>
            <td style="width:65%;"></td>
            <td style="width:35%;vertical-align:top;">
              <strong>CAMAT TEMIANG PESISIR,</strong><br>
              ${isSigned ? `<img src="${ttdCamatSrc}" style="width:75px;height:auto;mix-blend-mode:multiply;display:block;margin:4px 0;" />` : `<div style="height:70px;"></div>`}
              <strong><u>HENDRA, S.STP</u></strong><br>
              PEMBINA / IV.a<br>
              NIP. 198507122006021001
            </td>
          </tr>
        </table>

        <div style="margin-top:20px;font-family:Arial;font-size:10pt;">
          Tembusan:<br>
          <ol style="margin-left:20px;margin-top:4px;padding-left:0;">
            <li>Yth. Kepala Badan Pengelolaan Keuangan dan Aset Daerah Kabupaten Lingga di Daik Lingga;</li>
            <li>Yth. Inspektur Kabupaten Lingga di Daik Lingga.</li>
          </ol>
        </div>
      </div>

      <!-- PAGE 2: BERITA ACARA -->
      <div class="print-page" style="${base};page-break-before:always;">
        ${kopSurat()}
        <div style="text-align:center;font-family:Arial;font-size:12pt;font-weight:bold;text-decoration:underline;margin:12px 0 16px 0;">
          Berita Acara Hasil Verifikasi Kecamatan
        </div>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:12px;border:none;">
          <tr><td style="width:120px;">Desa</td><td>: ${desa}</td></tr>
          <tr><td>Kecamatan</td><td>: Temiang Pesisir</td></tr>
        </table>

        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:10px;text-indent:40px;line-height:1.5;">
          Pada hari Rabu tanggal Dua Puluh Sembilan bulan April tahun Dua Ribu Dua Puluh Enam telah dilaksanakan verifikasi terhadap kelengkapan persyaratan pengajuan penyaluran dana ADD Bulan Februari 2026 yang disampaikan oleh Desa ${desa}, dengan kesimpulan catatan sebagai berikut :
        </p>

        <table style="width:100%;font-family:Arial;font-size:12pt;border-collapse:collapse;margin-bottom:12px;">
          <thead>
            <tr>
              <th style="border:1px solid #000;padding:6px;text-align:center;width:45px;white-space:nowrap;">NO</th>
              <th style="border:1px solid #000;padding:6px;text-align:center;">RINCIAN</th>
              <th style="border:1px solid #000;padding:6px;text-align:center;width:150px;">CHEKLIST/KET</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">a.</td>
              <td style="border:1px solid #000;padding:6px;">Surat Permohonan Kepala Desa</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;font-size:16pt;">${formData.cekA === "true" ? "âœ“" : ""}</td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">b.</td>
              <td style="border:1px solid #000;padding:6px;">FotoCopy Print Out Buku Rekening Pemerintah Desa</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;font-size:16pt;">${formData.cekB === "true" ? "âœ“" : ""}</td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">c.</td>
              <td style="border:1px solid #000;padding:6px;">FotoCopy NPWP Pemerintah Desa</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;font-size:16pt;">${formData.cekC === "true" ? "âœ“" : ""}</td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">d.</td>
              <td style="border:1px solid #000;padding:6px;">Laporan Realisasi pelaksanaan kegiatan dan anggaran penggunaan ADD Bulan sebelumnya dengan menunjukkan penggunaan Dana minimal 75% (tujuh puluh lima persen)</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;font-size:16pt;">${formData.cekD === "true" ? "âœ“" : ""}</td>
            </tr>
          </tbody>
        </table>

        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:12px;text-indent:40px;line-height:1.5;">
          Hasil verifikasi Kecamatan terhadap kelengkapan persyaratan pengajuan penyaluran ADD bulan Februari 2026 dalam kondisi lengkap, dan jumlah penggunaan dana yang akan disalurkan sudah sesuai dengan pagu yang tersedia.
        </p>
        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:12px;text-indent:40px;line-height:1.5;">
          Demikian Berita Acara ini dibuat untuk digunakan sebagaimana mestinya.
        </p>

        <table style="width:100%;font-family:Arial;font-size:12pt;border-collapse:collapse;margin-bottom:24px;">
          <thead>
            <tr>
              <th style="border:1px solid #000;padding:6px;text-align:center;width:45px;white-space:nowrap;">No</th>
              <th style="border:1px solid #000;padding:6px;text-align:center;">NAMA ANGGOTA TIM VERIFIKASI KECAMATAN</th>
              <th style="border:1px solid #000;padding:6px;text-align:center;width:180px;">TANDA TANGAN</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">1</td>
              <td style="border:1px solid #000;padding:6px;">${namaVerifikator1}</td>
              <td style="border:1px solid #000;padding:6px;height:60px;text-align:center;vertical-align:middle;">
                ${isSignedJubir && ttdJubirSrc ? `<img src="${ttdJubirSrc}" style="width:60px;height:60px;object-fit:contain;mix-blend-mode:multiply;" />` : ``}
              </td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">2</td>
              <td style="border:1px solid #000;padding:6px;">${namaVerifikator2}</td>
              <td style="border:1px solid #000;padding:6px;height:60px;text-align:center;vertical-align:middle;">
                ${isSignedZakaria && ttdZakariaSrc ? `<img src="${ttdZakariaSrc}" style="width:60px;height:60px;object-fit:contain;mix-blend-mode:multiply;" />` : ``}
              </td>
            </tr>
          </tbody>
        </table>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-top:20px;">
          <tr>
            <td style="width:65%;"></td>
            <td style="width:35%;vertical-align:top;">
              <strong>CAMAT TEMIANG PESISIR,</strong><br>
              ${isSigned ? `<img src="${ttdCamatSrc}" style="width:75px;height:auto;mix-blend-mode:multiply;display:block;margin:4px 0;" />` : `<div style="height:70px;"></div>`}
              <strong><u>HENDRA, S.STP</u></strong><br>
              PEMBINA / IV.a<br>
              NIP. 198507122006021001
            </td>
          </tr>
        </table>
      </div>`

    // â”€â”€ 6. TUNDA SALUR ADD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    case "tunda_salur_add": return `
      <!-- PAGE 1: SURAT PENGANTAR -->
      <div class="print-page" style="${base}">
        ${kopSurat()}

        <div style="text-align:right;font-family:Arial;font-size:12pt;margin-top:20px;margin-bottom:20px;">
          Tajur Biru, ${formatTanggal(tanggal)}
        </div>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:8px;">
          ${fieldRow("Nomor", surat.nomor, "80px")}
          ${fieldRow("Sifat", "Penting", "80px")}
          ${fieldRow("Lampiran", "1 (satu) dokumen", "80px")}
          ${fieldRow("Perihal", "<strong>Rekomendasi Pengajuan Tunda Salur ADD<br>Bulan Desember 2025</strong>", "80px")}
        </table>

        <div style="font-family:Arial;font-size:12pt;margin-bottom:12px;">
          Yth. Kepala Dinas Pemberdayaan Masyarakat<br>
          dan Desa Kabupaten Lingga<br>
          di -<br>
          <span style="font-weight:bold;margin-left:40px;">Daik Lingga</span>
        </div>

        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:10px;text-indent:40px;line-height:1.5;">
          Dengan ini kami kirimkan berkas kelengkapan pengajuan Alokasi Dana Desa <strong>Tunda Salur</strong> Bulan <strong>Desember</strong> 2025 sesuai dengan Peraturan Bupati Lingga Nomor 16 Tahun 2026 Tentang Pengalokasian Alokasi Dana Desa Tunda Salur Tahun 2025 Kabupaten Lingga Tahun Anggaran 2026 yang bersumber dari anggaran Pendapatan dan Belanja Daerah, Desa ${desa} dengan rincian terlampir.
        </p>
        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:10px;text-indent:40px;line-height:1.5;">
          Demikian disampaikan untuk menjadi bahan pertimbangan, atas perhatian dan kerjasamanya diucapkan terima kasih.
        </p>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-top:40px;">
          <tr>
            <td style="width:65%;"></td>
            <td style="width:35%;vertical-align:top;">
              <strong>CAMAT TEMIANG PESISIR,</strong><br>
              ${isSigned ? `<img src="${ttdCamatSrc}" style="width:75px;height:auto;mix-blend-mode:multiply;display:block;margin:4px 0;" />` : `<div style="height:70px;"></div>`}
              <strong><u>HENDRA, S.STP</u></strong><br>
              PEMBINA / IV.a<br>
              NIP. 198507122006021001
            </td>
          </tr>
        </table>

        <div style="margin-top:20px;font-family:Arial;font-size:10pt;">
          Tembusan;<br>
          <ol style="margin-left:20px;margin-top:4px;padding-left:0;">
            <li>Yth. Kepala Badan Pengelolaan Keuangan dan Aset Daerah Kabupaten Lingga di Daik Lingga;</li>
            <li>Yth. Inspektur Kabupaten Lingga di Daik Lingga.</li>
          </ol>
        </div>
      </div>

      <!-- PAGE 2: BERITA ACARA -->
      <div class="print-page" style="${base};page-break-before:always;">
        <div style="text-align:center;font-family:Arial;font-size:12pt;font-weight:bold;text-decoration:underline;margin:12px 0 16px 0;">
          Berita Acara Hasil Verifikasi Kecamatan
        </div>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:12px;border:none;">
          <tr><td style="width:120px;">Desa</td><td>: ${desa}</td></tr>
          <tr><td>Kecamatan</td><td>: Temiang Pesisir</td></tr>
        </table>

        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:10px;text-indent:40px;line-height:1.5;">
          Pada hari ${new Date(tanggal).toLocaleDateString('id-ID', {weekday:'long'})} tanggal Enam Belas bulan April tahun Dua Ribu Dua Puluh Enam telah dilaksanakan verifikasi terhadap kelengkapan persyaratan pengajuan penyaluran Tunda Salur dana ADD Bulan Desember 2025 yang disampaikan oleh Desa ${desa}, dengan kesimpulan catatan sebagai berikut :
        </p>

        <table style="width:100%;font-family:Arial;font-size:12pt;border-collapse:collapse;margin-bottom:12px;">
          <thead>
            <tr>
              <th style="border:1px solid #000;padding:6px;text-align:center;width:45px;white-space:nowrap;">NO</th>
              <th style="border:1px solid #000;padding:6px;text-align:center;">RINCIAN</th>
              <th style="border:1px solid #000;padding:6px;text-align:center;width:80px;">CHEKLIST/KET</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">1.</td>
              <td style="border:1px solid #000;padding:6px;">Surat Permohonan Kepala Desa</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;font-size:16pt;">${formData.cek1 === "true" ? "âœ“" : ""}</td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">2.</td>
              <td style="border:1px solid #000;padding:6px;">Foto Copy Buku Bank/ Print Rekening Pemerintah Desa</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;font-size:16pt;">${formData.cek2 === "true" ? "âœ“" : ""}</td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">3.</td>
              <td style="border:1px solid #000;padding:6px;">Foto Copy NPWP Pemerintah Desa</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;font-size:16pt;">${formData.cek3 === "true" ? "âœ“" : ""}</td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">4.</td>
              <td style="border:1px solid #000;padding:6px;">Surat Pernyataan TanggungJawab Mutlak Atas Penggunaan Dana kurang bayar ADD Tahun Anggaran 2025</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;font-size:16pt;">${formData.cek4 === "true" ? "âœ“" : ""}</td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">5.</td>
              <td style="border:1px solid #000;padding:6px;">APBDesa Perubahan Anggaran 2025</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;font-size:16pt;">${formData.cek5 === "true" ? "âœ“" : ""}</td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">6.</td>
              <td style="border:1px solid #000;padding:6px;">Laporan Realisasi Anggaran Tahun Anggaran 2025</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;font-size:16pt;">${formData.cek6 === "true" ? "âœ“" : ""}</td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">7.</td>
              <td style="border:1px solid #000;padding:6px;">Laporan Realisasi ADD Tunda Salur Bulan November 2025</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;font-size:16pt;">${formData.cek7 === "true" ? "âœ“" : ""}</td>
            </tr>
          </tbody>
        </table>

        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:12px;text-indent:40px;line-height:1.5;">
          Hasil verifikasi Kecamatan terhadap kelengkapan persyaratan pengajuan penyaluran Tunda Salur ADD bulan Desember 2025 dalam kondisi lengkap, dan jumlah penggunaan dana yang akan disalurkan sudah sesuai dengan pagu yang tersedia.
        </p>
        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:12px;text-indent:40px;line-height:1.5;">
          Demikian Berita Acara ini dibuat untuk digunakan sebagaimana mestinya.
        </p>
        
        <p style="font-family:Arial;font-size:12pt;margin-bottom:8px;">
          Daftar anggota Tim Verifikasi Kecamatan
        </p>

        <table style="width:100%;font-family:Arial;font-size:12pt;border-collapse:collapse;margin-bottom:24px;">
          <thead>
            <tr>
              <th style="border:1px solid #000;padding:6px;text-align:center;width:45px;white-space:nowrap;">No</th>
              <th style="border:1px solid #000;padding:6px;text-align:center;">NAMA ANGGOTA TIM VERIFIKASI KECAMATAN</th>
              <th style="border:1px solid #000;padding:6px;text-align:center;width:180px;">TANDA TANGAN</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">1</td>
              <td style="border:1px solid #000;padding:6px;">${namaVerifikator1}</td>
              <td style="border:1px solid #000;padding:6px;height:60px;text-align:center;vertical-align:middle;">
                ${isSignedJubir && ttdJubirSrc ? `<img src="${ttdJubirSrc}" style="width:60px;height:60px;object-fit:contain;mix-blend-mode:multiply;" />` : ``}
              </td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">2</td>
              <td style="border:1px solid #000;padding:6px;">${namaVerifikator2}</td>
              <td style="border:1px solid #000;padding:6px;height:60px;text-align:center;vertical-align:middle;">
                ${isSignedZakaria && ttdZakariaSrc ? `<img src="${ttdZakariaSrc}" style="width:60px;height:60px;object-fit:contain;mix-blend-mode:multiply;" />` : ``}
              </td>
            </tr>
          </tbody>
        </table>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-top:20px;">
          <tr>
            <td style="width:65%;"></td>
            <td style="width:35%;vertical-align:top;">
              <strong>CAMAT TEMIANG PESISIR,</strong><br>
              ${isSigned ? `<img src="${ttdCamatSrc}" style="width:75px;height:auto;mix-blend-mode:multiply;display:block;margin:4px 0;" />` : `<div style="height:70px;"></div>`}
              <strong><u>HENDRA, S.STP</u></strong><br>
              PEMBINA / IV.a<br>
              NIP. 198507122006021001
            </td>
          </tr>
        </table>
      </div>`

    // â”€â”€ 7. AHLI WARIS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    case "ahli_waris": {
      const f = surat.data_form || {}
      const pemohonNama = (f.pemohon || surat.pemohon || "").toUpperCase()
      const pewaris = (f.pewaris || "").toUpperCase()
      return `
      <div class="print-page" style="${base}">
        ${kopSurat()}
        <div style="text-align:center; font-family:Arial; font-size:12pt; margin-bottom:16px;">
          <strong><u>SURAT KETERANGAN AHLI WARIS</u></strong><br>
          Nomor : ${surat.nomor}
        </div>

        <p style="font-family:Arial;font-size:12pt;margin-bottom:4px;">Yang bertanda tangan di bawah ini, Kecamatan Temiang Pesisir Kabupaten Lingga.</p>
        <p style="font-family:Arial;font-size:12pt;margin-bottom:8px;">Dengan ini menerangkan bahwa :</p>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:16px;border:none;">
          ${fieldRow("Nama", pemohonNama, "150px")}
          ${fieldRow("NIK", f.nikPemohon || "", "150px")}
          ${fieldRow("Tempat/ Tgl.Lahir", (f.tempatLahirPemohon || "") + (f.tanggalLahirPemohon ? ", " + formatTanggal(f.tanggalLahirPemohon) : ""), "150px")}
          ${fieldRow("Jenis Kelamin", f.jkPemohon || "", "150px")}
          ${fieldRow("Agama", f.agamaPemohon || "", "150px")}
          ${fieldRow("Pekerjaan", f.pekerjaanPemohon || "", "150px")}
          ${fieldRow("Alamat", f.alamatPemohon || "", "150px")}
        </table>

        <p style="font-family:Arial;font-size:12pt;margin-bottom:8px;">Bahwa yang tersebut namanya di atas adalah Ahli waris dari :</p>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:16px;border:none;">
          ${fieldRow("Nama", pewaris, "150px")}
          ${fieldRow("NIK", f.nikPewaris || "", "150px")}
          ${fieldRow("Tempat/ Tgl.Lahir", (f.tempatLahirPewaris || "") + (f.tanggalLahirPewaris ? ", " + formatTanggal(f.tanggalLahirPewaris) : ""), "150px")}
          ${fieldRow("Jenis Kelamin", f.jkPewaris || "", "150px")}
          ${fieldRow("Agama", f.agamaPewaris || "", "150px")}
          ${fieldRow("Pekerjaan", f.pekerjaanPewaris || "", "150px")}
          ${fieldRow("Alamat", f.alamatPewaris || "", "150px")}
        </table>

        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:4px;text-indent:40px;line-height:1.2;">
          Bahwa Ahli Waris tersebut diatas adalah benar-benar Ahli Waris dari ${f.hubungan === "Suami" || f.hubungan === "Anak Kandung" ? "Almarhum" : "Almarhumah"} ${pewaris} dan kami bertanggung jawab atas kebenaran dari pernyataan ini.
        </p>
        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:16px;text-indent:40px;line-height:1.2;">
          Demikian surat Keterangan Ahli Waris ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
        </p>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-top:10px;">
          <tr>
            <td style="width:50%;vertical-align:top;padding-right:20px;">
              Saksi-saksi :<br>
              <table style="width:100%;margin-top:8px;border:none;">
                <tr>
                  <td style="width:20px;">1.</td>
                  <td>${f.saksi1 || "ARIANTO (Ketua RT 006)"}</td>
                  <td style="text-align:right;">(...............)</td>
                </tr>
                <tr>
                  <td style="width:20px;padding-top:16px;">2.</td>
                  <td style="padding-top:16px;">${f.saksi2 || "ISLAN (Ketua RW 003)"}</td>
                  <td style="text-align:right;padding-top:16px;">(...............)</td>
                </tr>
              </table>
            </td>
            <td style="width:50%;"></td>
          </tr>
          <tr>
            <td style="width:65%;"></td>
            <td style="width:35%;vertical-align:top;padding-top:40px;">
              Tajur Biru, ${formatTanggal(tanggal)}<br>
              <strong>CAMAT TEMIANG PESISIR</strong><br>
              ${isSigned ? `<img src="${ttdCamatSrc}" style="width:75px;height:auto;mix-blend-mode:multiply;display:block;margin:4px 0;" />` : `<br><br><br><br><br>`}
              <strong><u>HENDRA, S.STP</u></strong><br>
              PEMBINA / IV.a<br>
              NIP 198507122006021001
            </td>
          </tr>
        </table>
      </div>`
    }

    // â”€â”€ 8. PEMBERHENTIAN PERANGKAT DESA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    case "pemberhentian_perangkat": {
      const f = surat.data_form || {}
      const jabatan = f.jabatan || "Kasi Pemerintahan"
      const nomorSuratDesa = f.nomorSuratDesa || "....................."
      const tglSuratDesa = f.tanggalSuratDesa ? formatTanggal(f.tanggalSuratDesa) : "....................."
      return `
      <div class="print-page" style="${base}">
        ${kopSurat()}

        <div style="text-align:center;font-family:Arial;font-size:12pt;font-weight:bold;margin:16px 0 4px 0;">REKOMENDASI</div>
        <div style="text-align:center;font-family:Arial;font-size:12pt;margin-bottom:4px;">Nomor : ${surat.nomor}</div>
        <div style="text-align:center;font-family:Arial;font-size:12pt;margin-bottom:2px;font-weight:bold;">TENTANG</div>
        <div style="text-align:center;font-family:Arial;font-size:12pt;margin-bottom:16px;">Rekomendasi Persetujuan Pemberhentian Perangkat Desa</div>

        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:10px;text-indent:40px;line-height:1.5;">
          Menindaklanjuti surat dari Kepala Desa ${desa} Kecamatan Temiang Pesisir Nomor :${nomorSuratDesa}, tanggal ${tglSuratDesa} perihal Permohonan Rekomendasi Pemberhentian Perangkat Desa pada Jabatan ${jabatan} Desa ${desa} Kecamatan Temiang Pesisir. Disampaikan hal-hal sebagai berikut :
        </p>

        <ol style="font-family:Arial;font-size:12pt;line-height:1.5;margin:0 0 6px 0;padding-left:24px;text-align:justify;">
          <li style="margin-bottom:6px;padding-left:4px;">Proses Pemberhentian dan Pengangkatan Perangkat Desa tetap berdasarkan pada ketentuan peraturan perundang-undangan yang berlaku sebagai berikut :
            <ol type="a" style="margin:4px 0 0 0;padding-left:20px;">
              <li style="margin-bottom:6px;padding-left:4px;">Kepala Desa harus memperdomi ketentuan tentang pemberhentian perangkat desa sebagaimana terdapat perubahan kewenangan kepala desa diatur pada pasal 26 ayat (2) huruf B undang-undang no 3 tahun 2024 tentang perubahan kedua atas undang-undang no 6 tahun 2014 tentang Desa yang berbunyi &quot;dalam melaksanakan tugas, sebagaimana dimaksud pada ayat 1, kepala desa berwenang mengusulkan pengangkatan dan pemberhentian perangkat desa kepada bupati&quot; namun tidak diikuti dengan perubahan mekanisme pengangkatan dan pemberhentian desa pada pasal 49 ayat 2 dan mekanisme pemberhentian perangkat desa pada pasal 53 ayat 3 undang-undang no 6 tahun 2014 tentang desa.,</li>
              <li style="margin-bottom:6px;padding-left:4px;">Permendagri nomor 67 tahun 2017 tentang perubahan atas peraturan mendagri no 83 tahun 2015 tentang pengangkatan dan pemberhentian perangkat desa.,</li>
              <li style="margin-bottom:6px;padding-left:4px;">Surat menteri dalam negeri Republik Indonesia nomor : 100.3.5.5/3318/BPD tanggal 16 Juli 2024 hal : penegasan penentuan perubahan tentang perangkat desa.,</li>
              <li style="margin-bottom:0;padding-left:4px;">Peraturan Bupati Lingga nomor 31 tahun 2017 tentang pedoman penyusunan struktur organisasi dan tata kerja pemerintah desa.</li>
            </ol>
          </li>
          <li style="margin-bottom:6px;padding-left:4px;">Agar kepala desa membuat surat usulan kepada Bupati atas Rekomendasi yang diberikan oleh Camat sebagai dasar penetapan pemberhentian perangkat desa (${jabatan}).</li>
          <li style="margin-bottom:6px;padding-left:4px;">Untuk menghindari tidak terjadi kekosongan Jabatan sebagai Perangkat desa (${jabatan}) di Desa ${desa} Kecamatan Temiang Pesisir, disarankan agar Kepala Desa segera menunjuk pejabat pelaksana tugas yang berasal dari perangkat desa yang ada.</li>
        </ol>

        <!-- Pindah ke halaman 2 -->
        <div style="page-break-before:always;"></div>

        <ol start="4" style="font-family:Arial;font-size:12pt;line-height:1.5;margin:80px 0 6px 0;padding-left:24px;text-align:justify;">
          <li style="margin-bottom:6px;padding-left:4px;">Bupati melakukan evaluasi atas usulan pemberhentian perangkat desa dan memberikan rekomendasi tertulis kepada kepala desa selambat-lambatnya 20 (Dua Puluh) hari kerja.</li>
          <li style="margin-bottom:6px;padding-left:4px;">Kepala desa menetapkan keputusan pemberhentian perangkat desa paling lambat 14 (Empat Belas) hari kerja setelah diterimanya rekomendasi tertulis dari bupati.</li>
        </ol>

        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin:12px 0;text-indent:40px;line-height:1.5;">
          Demikian rekomendasi ini disampaikan, atas perhatian dan bantuannya kami ucapkan terimakasih.
        </p>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-top:20px;">
          <tr>
            <td style="width:60%;vertical-align:top;"></td>
            <td style="width:40%;vertical-align:top;">
              <table style="border:none;margin-bottom:8px;line-height:1.2;">
                <tr>
                  <td style="padding:0;">Dikeluarkan di</td>
                  <td style="padding:0 4px;">:</td>
                  <td style="padding:0;">Tajur Biru</td>
                </tr>
                <tr>
                  <td style="padding:0;">Pada Tanggal</td>
                  <td style="padding:0 4px;">:</td>
                  <td style="padding:0;">${formatTanggal(tanggal)}</td>
                </tr>
              </table>
              <strong>CAMAT TEMIANG PESISIR</strong><br>
              ${isSigned ? `<img src="${ttdCamatSrc}" style="width:75px;height:auto;mix-blend-mode:multiply;display:block;margin:4px 0;" />` : `<br><br><br><br><br>`}
              <strong><u>HENDRA, S.STP</u></strong><br>
              PEMBINA / IV.a<br>
              NIP 198507122006021001
            </td>
          </tr>
        </table>

        <div style="font-family:Arial;font-size:10pt;margin-top:24px;line-height:1.4;">
          <p style="margin-bottom:4px;">Tembusan Kepada Yth :</p>
          <table style="border:none;width:100%;">
            <tr><td style="width:20px;vertical-align:top;">1.</td><td>Bupati Lingga</td></tr>
            <tr><td style="vertical-align:top;padding-top:2px;">2.</td><td style="padding-top:2px;">Cq Kepala Dinas Pemberdayaan Masyarakat dan Desa Kabupaten Lingga;</td></tr>
            <tr><td style="vertical-align:top;padding-top:2px;">3.</td><td style="padding-top:2px;">Inspektur Kabupaten Lingga;</td></tr>
            <tr><td style="vertical-align:top;padding-top:2px;">4.</td><td style="padding-top:2px;">Ketua Badan Permusyawaratan Desa ${desa};</td></tr>
            <tr><td style="vertical-align:top;padding-top:2px;">5.</td><td style="padding-top:2px;">Arsip.</td></tr>
          </table>
        </div>
      </div>`
    }

    default: {
      const f = surat.data_form || {}
      return `
      <div class="print-page" style="${base}">
        ${kopSurat()}
        <p>Surat ${surat.jenis} untuk ${surat.pemohon}</p>
        <p>${surat.perihal || f.perihal || ""}</p>
        ${ttdCamat(tanggal, isSigned, "CAMAT TEMIANG PESISIR", "HENDRA, S.STP", "PEMBINA / IV.a", "NIP. 198507122006021001", true, ttdCamatSrc)}
      </div>`
    }
  }
}
