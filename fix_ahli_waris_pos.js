const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

const search = `        <table style="width:100%;font-family:Arial;font-size:12pt;margin-top:10px;">
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
            <td style="width:50%;vertical-align:top;padding-left:40px;">
              Tajur Biru, \${formatTanggal(tanggal)}<br>
              <strong>CAMAT TEMIANG PESISIR</strong><br>
              \${isSigned ? \`<div style="position: absolute; margin: -5px 0 0 -15px;"><img src="/ttd-camat.jpeg" style="width: 170px; height: auto; mix-blend-mode: multiply;" /></div><br><br><br><br><br>\` : \`<br><br><br><br><br>\`}
              <strong><u>HENDRA, S.STP</u></strong><br>
              PEMBINA / IV.a<br>
              NIP 198507122006021001
            </td>
          </tr>
        </table>`;

const replace = `        <table style="width:100%;font-family:Arial;font-size:12pt;margin-top:10px;">
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
            <td style="width:50%;"></td>
          </tr>
          <tr>
            <td style="width:50%;"></td>
            <td style="width:50%;vertical-align:top;padding-left:40px;padding-top:40px;">
              Tajur Biru, \${formatTanggal(tanggal)}<br>
              <strong>CAMAT TEMIANG PESISIR</strong><br>
              \${isSigned ? \`<div style="position: absolute; margin: -5px 0 0 -15px;"><img src="/ttd-camat.jpeg" style="width: 170px; height: auto; mix-blend-mode: multiply;" /></div><br><br><br><br><br>\` : \`<br><br><br><br><br>\`}
              <strong><u>HENDRA, S.STP</u></strong><br>
              PEMBINA / IV.a<br>
              NIP 198507122006021001
            </td>
          </tr>
        </table>`;

if (content.includes(search)) {
    content = content.split(search).join(replace);
    fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
    console.log('Moved Camat signature below Saksi-saksi');
} else {
    console.log('Search string not found');
}
