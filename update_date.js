const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

// 1. Update ttdCamat signature and logic
const oldTtdCamat = `function ttdCamat(tanggal: string, isSigned: boolean = false, jabatan = "CAMAT TEMIANG PESISIR", nama = "HENDRA, S.STP", pangkat = "PENATA TK.I / III.d", nip = "NIP. 19850712 200602 1 001"): string {
  return \`
  <table style="width:100%;font-family:Arial;font-size:12pt;margin-top:40px;">
    <tr>
      <td style="width:60%;"></td>
      <td style="width:40%;vertical-align:top;">
        Tajur Biru, \${formatTanggal(tanggal)}<br>
        \${jabatan},\${isSigned ? \`<div style="margin: 4px 0;"><img src="/ttd-camat.jpeg" style="width: 95px; height: auto; mix-blend-mode: multiply;" /></div>\` : \`<br><br><br><br><br>\`}
        <strong><u>\${nama}</u></strong><br>
        \${pangkat}<br>
        \${nip}
      </td>
    </tr>
  </table>\`
}`;

const newTtdCamat = `function ttdCamat(tanggal: string, isSigned: boolean = false, jabatan = "CAMAT TEMIANG PESISIR", nama = "HENDRA, S.STP", pangkat = "PENATA TK.I / III.d", nip = "NIP. 19850712 200602 1 001", showDate: boolean = true): string {
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
}`;

// 2. Replace rekomendasi_dd structure
const oldRek = `    case "rekomendasi_dd": return \`
      <div class="print-page" style="\${base}">
        \${kopSurat()}

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:8px;">`;

const newRek = `    case "rekomendasi_dd": return \`
      <div class="print-page" style="\${base}">
        \${kopSurat()}

        <div style="text-align:right;font-family:Arial;font-size:12pt;margin:4px 0 16px 0;">
          Tajur Biru, \${formatTanggal(tanggal)}
        </div>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:8px;">`;

const oldRekTtd = `        \${ttdCamat(tanggal, isSigned)}

        <div style="margin-top:20px;font-family:Arial;font-size:12pt;">`;

const newRekTtd = `        \${ttdCamat(tanggal, isSigned, "CAMAT TEMIANG PESISIR", "HENDRA, S.STP", "PENATA TK.I / III.d", "NIP. 19850712 200602 1 001", false)}

        <div style="margin-top:20px;font-family:Arial;font-size:12pt;">`;

content = content.replace(oldTtdCamat, newTtdCamat);
content = content.replace(oldRek, newRek);
content = content.replace(oldRekTtd, newRekTtd);

fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
console.log("Updated");
