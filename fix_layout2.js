const fs = require('fs');
let lines = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8').split('\n');

const content_to_insert = `        <table style="width:100%;font-family:Arial;font-size:12pt;border-collapse:collapse;">
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
              <td style="border:1px solid #000;padding:6px;">JUBIR, S.Pd.SD</td>
              <td style="border:1px solid #000;padding:6px;height:50px;"></td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">2</td>
              <td style="border:1px solid #000;padding:6px;">ZAKARIA, A.Ma.Pd</td>
              <td style="border:1px solid #000;padding:6px;height:50px;"></td>
            </tr>
          </tbody>
        </table>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-top:20px;">
          <tr>
            <td style="width:60%;"></td>
            <td style="width:40%;vertical-align:top;">
              <strong style="margin-left: 20px;">CAMAT TEMIANG PESISIR</strong><br>
              \${isSigned ? \`<div style="position: absolute; margin: -10px 0 0 -10px;"><img src="/ttd-camat.jpeg" style="width: 170px; height: auto; mix-blend-mode: multiply;" /></div>\` : \`<br><br><br><br><br>\`}
              <br><br><br><br>
              <strong><u>HENDRA, S.STP</u></strong><br>
              Penata TK.I<br>
              NIP. 198507122006021001
            </td>
          </tr>
        </table>
      </div>\``;

let index_to_insert = 0;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Demikian Berita Acara ini dibuat untuk digunakan sebagaimana mestinya.')) {
        index_to_insert = i + 2;
        break;
    }
}

let end_index = index_to_insert;
for (let i = index_to_insert; i < lines.length; i++) {
    if (lines[i].trim() === '</div>`') {
        end_index = i + 1;
        break;
    }
}

lines.splice(index_to_insert, end_index - index_to_insert, content_to_insert);
fs.writeFileSync('lib/mock-data/generate-surat.ts', lines.join('\n'));
console.log('Done');
