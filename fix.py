import sys

with open('lib/mock-data/generate-surat.ts', 'r') as f:
    lines = f.readlines()

content_to_insert = """
// ─── Blok TTD Camat ───────────────────────────────────────────────────────────
function ttdCamat(tanggal: string, isSigned: boolean = false, jabatan = "CAMAT TEMIANG PESISIR", nama = "HENDRA, S.STP", pangkat = "PENATA TK.I / III.d", nip = "NIP. 19850712 200602 1 001", showDate: boolean = true): string {
  return `
  <table style="width:100%;font-family:Arial;font-size:12pt;margin-top:40px;">
    <tr>
      <td style="width:60%;"></td>
      <td style="width:40%;vertical-align:top;">
        ${showDate ? `Tajur Biru, ${formatTanggal(tanggal)}<br>` : ""}
        ${jabatan},${isSigned ? `<div style="margin: 4px 0;"><img src="/ttd-camat.jpeg" style="width: 95px; height: auto; mix-blend-mode: multiply;" /></div>` : `<br><br><br><br><br>`}
        <strong><u>${nama}</u></strong><br>
        ${pangkat}<br>
        ${nip}
      </td>
    </tr>
  </table>`
}

// ─── Isi Surat Khusus ─────────────────────────────────────────────────────────
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

    return \`
"""

# Find line 56, the end of judulSurat
index_to_insert = 0
for i, line in enumerate(lines):
    if "Nomor : ${nomor}" in line:
        index_to_insert = i + 3
        break

# Remove lines that look like the old fragment until we see <div style="font-family:Arial
end_index = index_to_insert
for i in range(index_to_insert, len(lines)):
    if "<div style=\"font-family:Arial, sans-serif;font-size:12pt;line-height:1.15;margin-top:16px;\">" in lines[i]:
        end_index = i
        break

del lines[index_to_insert:end_index]
lines.insert(index_to_insert, content_to_insert)

with open('lib/mock-data/generate-surat.ts', 'w') as f:
    f.writelines(lines)
