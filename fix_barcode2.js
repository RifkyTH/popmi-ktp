const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

// 1. Revert Camat Signature
const searchCamatBarcode = `<div style="position: absolute; margin: -10px 0 0 10px;"><img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=CAMAT_TEMIANG_PESISIR" style="width: 80px; height: 80px; mix-blend-mode: multiply;" /></div>`;
const replaceCamatImg = `<div style="position: absolute; margin: -10px 0 0 -10px;"><img src="/ttd-camat.jpeg" style="width: 170px; height: auto; mix-blend-mode: multiply;" /></div>`;

if (content.includes(searchCamatBarcode)) {
    content = content.split(searchCamatBarcode).join(replaceCamatImg);
    console.log('Reverted Camat signature');
}

// 2. Add /ttd-digital.jpeg to Tim Verifikasi
const searchDd = `            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">1</td>
              <td style="border:1px solid #000;padding:6px;">JUBIR, S.Pd.SD</td>
              <td style="border:1px solid #000;padding:6px;height:50px;"></td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">2</td>
              <td style="border:1px solid #000;padding:6px;">ZAKARIA, A.Ma.Pd</td>
              <td style="border:1px solid #000;padding:6px;height:50px;"></td>
            </tr>`;

const replaceDd = `            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">1</td>
              <td style="border:1px solid #000;padding:6px;">JUBIR, S.Pd.SD</td>
              <td style="border:1px solid #000;padding:6px;height:60px;text-align:center;vertical-align:middle;">
                \${isSigned ? \`<img src="/ttd-digital.jpeg" style="width:50px;height:50px;object-fit:contain;mix-blend-mode:multiply;" />\` : \`\`}
              </td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">2</td>
              <td style="border:1px solid #000;padding:6px;">ZAKARIA, A.Ma.Pd</td>
              <td style="border:1px solid #000;padding:6px;height:60px;text-align:center;vertical-align:middle;">
                \${isSigned ? \`<img src="/ttd-digital.jpeg" style="width:50px;height:50px;object-fit:contain;mix-blend-mode:multiply;" />\` : \`\`}
              </td>
            </tr>`;

if (content.includes(searchDd)) {
    content = content.split(searchDd).join(replaceDd);
    console.log('Inserted ttd-digital.jpeg to Tim Verifikasi');
}

fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
