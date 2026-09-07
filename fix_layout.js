const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

const search = `        <table style="width:100%;font-family:Arial;font-size:12pt;border-collapse:collapse;">
          <tr>
            <td style="width:58%;vertical-align:top;">
              <table style="width:100%;font-family:Arial;font-size:12pt;border-collapse:collapse;">
                <thead>
                  <tr>
                    <th style="border:1px solid #000;padding:6px;text-align:center;width:45px;white-space:nowrap;">No</th>
                    <th style="border:1px solid #000;padding:6px;text-align:center;">NAMA ANGGOTA TIM VERIFIKASI KECAMATAN</th>
                    <th style="border:1px solid #000;padding:6px;text-align:center;width:120px;">TANDA TANGAN</th>
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
            </td>
            <td style="width:42%;vertical-align:top;padding-left:16px;">
              <div style="text-align:center;margin-top:24px;">
                <strong>CAMAT TEMIANG PESISIR</strong><br>
                \${isSigned ? \`<div style="margin: 4px 0;"><img src="/ttd-camat.jpeg" style="width: 130px; height: auto; mix-blend-mode: multiply; transform: rotate(-5deg);" /></div>\` : \`<br><br><br><br><br><br>\`}
                <strong><u>HENDRA, S.STP</u></strong><br>
                Penata TK.I<br>
                NIP. 198507122006021001
              </div>
            </td>
          </tr>
        </table>
      </div>\``;

const replace = `        <table style="width:100%;font-family:Arial;font-size:12pt;border-collapse:collapse;">
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

if(content.includes(search)) {
    content = content.replace(search, replace);
    fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
    console.log('Replaced successfully');
} else {
    console.log('Search string not found');
}
