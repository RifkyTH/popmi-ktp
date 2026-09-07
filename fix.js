const fs = require('fs');
let lines = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8').split('\n');

const content_to_insert = `
// ─── Blok TTD Camat ───────────────────────────────────────────────────────────
function ttdCamat(tanggal: string, isSigned: boolean = false, jabatan = "CAMAT TEMIANG PESISIR", nama = "HENDRA, S.STP", pangkat = "PENATA TK.I / III.d", nip = "NIP. 19850712 200602 1 001", showDate: boolean = true): string {
  return \`
  <table style="width:100%;font-family:Arial;font-size:12pt;margin-top:40px;">
    <tr>
      <td style="width:60%;"></td>
      <td style="width:40%;vertical-align:top;">
        \${showDate ? \`Tajur Biru, \${formatTanggal(tanggal)}<br>\` : ""}
        \${jabatan},\${isSigned ? \`<div style="margin: 4px 0;"><img src="/ttd-camat.jpeg" style="width: 95px; height: auto; mix-blend-mode: multiply;" /></div>\` : \`<br><br><br><br><br>\`}
        <strong><u>\${nama}</u></strong><br>
        \${pangkat}<br>
        \${nip}
      </td>
    </tr>
  </table>\`
}

// ─── Isi Surat Khusus ─────────────────────────────────────────────────────────
function getIsiSurat(surat: Surat): string {
  const f = surat.data_form || {}
  
  if (surat.jenis === "dispensasi_nikah") {
    // Helper untuk coretan (strike-through)
    const strike = (opts: string[], selected: string) => {
      return opts.map(opt => (opt === selected ? opt : \`<del>\${opt}</del>\`)).join("/")
    }

    const tglSurat = f.tanggalSuratDesa ? formatTanggal(f.tanggalSuratDesa) : "......................"
    const tglNikah = f.tanggalNikah ? formatTanggal(f.tanggalNikah) : "......................"
    const desaTeks = f.desaPengantar || "......................"

    return \`
`;

let index_to_insert = 0;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Nomor : ${nomor}')) {
        index_to_insert = i + 3;
        break;
    }
}

let end_index = index_to_insert;
for (let i = index_to_insert; i < lines.length; i++) {
    if (lines[i].includes('<div style="font-family:Arial, sans-serif;font-size:12pt;line-height:1.15;margin-top:16px;">')) {
        end_index = i;
        break;
    }
}

lines.splice(index_to_insert, end_index - index_to_insert, content_to_insert);
fs.writeFileSync('lib/mock-data/generate-surat.ts', lines.join('\n'));
console.log('Done');
