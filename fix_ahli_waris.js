const fs = require('fs');
let lines = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8').split('\n');

let start = -1;
let end = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('case "ahli_waris":')) {
        start = i;
    }
    if (start !== -1 && lines[i].includes('// ── 8. PEMBERHENTIAN PERANGKAT DESA')) {
        end = i;
        break;
    }
}

if (start !== -1 && end !== -1) {
    const newContent = `    case "ahli_waris": return \`
      <div class="print-page" style="\${base}">
        <div style="text-align:center; font-family:Arial; font-size:12pt; margin-bottom:16px;">
          <strong><u>SURAT KETERANGAN AHLI WARIS</u></strong><br>
          Nomor : \${surat.nomor}
        </div>

        <p style="font-family:Arial;font-size:12pt;margin-bottom:4px;">Yang bertanda tangan di bawah ini, Kecamatan Temiang Pesisir Kabupaten Lingga.</p>
        <p style="font-family:Arial;font-size:12pt;margin-bottom:8px;">Dengan ini menerangkan bahwa :</p>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:16px;border:none;">
          \${fieldRow("Nama", surat.pemohon, "150px")}
          \${fieldRow("NIK", "2104031501710001", "150px")}
          \${fieldRow("Tempat/ Tgl.Lahir", "Pulau Duyung, 18 Januari 1971", "150px")}
          \${fieldRow("Jenis Kelamin", "Laki-Laki", "150px")}
          \${fieldRow("Agama", "Islam", "150px")}
          \${fieldRow("Pekerjaan", "Pegawai Negeri Sipil (PNS)", "150px")}
          \${fieldRow("Alamat", "Tekoli, RT 06/RW 03 Desa Pulau Batang", "150px")}
        </table>

        <p style="font-family:Arial;font-size:12pt;margin-bottom:8px;">Bahwa yang tersebut namanya di atas adalah Ahli waris dari :</p>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:16px;border:none;">
          \${fieldRow("Nama", "SURIANA", "150px")}
          \${fieldRow("NIK", "2104034406690001", "150px")}
          \${fieldRow("Tempat/ Tgl.Lahir", "Tekoli, 04 Juni 1969", "150px")}
          \${fieldRow("Jenis Kelamin", "Perempuan", "150px")}
          \${fieldRow("Agama", "Islam", "150px")}
          \${fieldRow("Pekerjaan", "Pegawai Negeri Sipil (PNS)", "150px")}
          \${fieldRow("Alamat", "Tekoli, RT 06/RW 03 Desa Tajur Biru", "150px")}
        </table>

        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:4px;text-indent:40px;line-height:1.2;">
          Bahwa Ahli Waris tersebut diatas adalah benar-benar Ahli Waris dari Almarhumah SURIANA dan kami bertanggung jawab atas kebenaran dari pernyataan ini.
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
                  <td>ARIANTO (Ketua RT 006)</td>
                  <td style="text-align:right;">(...............)</td>
                </tr>
                <tr>
                  <td style="width:20px;padding-top:16px;">2.</td>
                  <td style="padding-top:16px;">ISLAN (Ketua RW 003)</td>
                  <td style="text-align:right;padding-top:16px;">(...............)</td>
                </tr>
              </table>
            </td>
            <td style="width:50%;vertical-align:top;padding-left:40px;text-align:center;">
              Tajur Biru, \${formatTanggal(tanggal)}<br>
              <strong>CAMAT TEMIANG PESISIR</strong><br>
              \${isSigned ? \`<div style="position: absolute; margin: -5px 0 0 -15px;"><img src="/ttd-camat.jpeg" style="width: 170px; height: auto; mix-blend-mode: multiply;" /></div><br><br><br><br><br>\` : \`<br><br><br><br><br>\`}
              <strong><u>HENDRA, S.STP</u></strong><br>
              PEMBINA / IV.a<br>
              NIP 198507122006021001
            </td>
          </tr>
        </table>
      </div>\`
`;
    lines.splice(start, end - start, newContent);
    fs.writeFileSync('lib/mock-data/generate-surat.ts', lines.join('\n'));
    console.log('Ahli Waris updated');
} else {
    console.log('Block not found');
}
