const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

const search = `        <table style="width:100%;font-family:Arial;font-size:12pt;margin-top:20px;">
          <tr>
            <td style="width:60%;"></td>
            <td style="width:40%;vertical-align:top;">
              <strong style="margin-left: 20px;">CAMAT TEMIANG PESISIR</strong><br>
              \${isSigned ? \`<div style="position: absolute; margin: -10px 0 0 -10px;"><img src="/ttd-camat.jpeg" style="width: 170px; height: auto; mix-blend-mode: multiply;" /></div><br><br><br><br><br>\` : \`<br><br><br><br><br>\`}
              <strong><u>HENDRA, S.STP</u></strong><br>
              Penata TK.I<br>
              NIP. 198507122006021001
            </td>
          </tr>
        </table>`;

const replace = `        <table style="width:100%;font-family:Arial;font-size:12pt;margin-top:20px;">
          <tr>
            <td style="width:60%;"></td>
            <td style="width:40%;vertical-align:top;">
              CAMAT TEMIANG PESISIR,<br>
              \${isSigned ? \`<div style="position: absolute; margin: -10px 0 0 -10px;"><img src="/ttd-camat.jpeg" style="width: 170px; height: auto; mix-blend-mode: multiply;" /></div><br><br><br><br><br>\` : \`<br><br><br><br><br>\`}
              <strong><u>HENDRA, S.STP</u></strong><br>
              PENATA TK.I / III.d<br>
              NIP. 19850712 200602 1 001
            </td>
          </tr>
        </table>`;

if (content.includes(search)) {
    content = content.replace(search, replace);
    fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
    console.log('Fixed signature text to match ttdCamat');
} else {
    console.log('Search string not found');
}
