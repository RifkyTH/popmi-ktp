const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

const search = `        <p style="font-family:Arial;font-size:12pt;margin-bottom:12px;">
          Daftar anggota Tim Verifikasi Kecamatan
        </p>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:24px;border:none;">
          <tr>
            <td style="width:40px;text-align:right;padding-right:10px;">1.</td>
            <td>JUBIR, S.Pd.SD</td>
            <td style="text-align:right;">......................................</td>
          </tr>
          <tr>
            <td style="text-align:right;padding-right:10px;">2.</td>
            <td>ZAKARIA, A.Ma.Pd</td>
            <td style="text-align:right;">......................................</td>
          </tr>
        </table>`;

const replace = `        <table style="width:100%;font-family:Arial;font-size:12pt;border-collapse:collapse;margin-bottom:24px;">
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
        </table>`;

if (content.includes(search)) {
    content = content.replace(search, replace);
    fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
    console.log('Fixed ADD table');
} else {
    console.log('Search string not found');
}
