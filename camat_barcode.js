const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

const searchDd = `            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">1</td>
              <td style="border:1px solid #000;padding:6px;">JUBIR, S.Pd.SD</td>
              <td style="border:1px solid #000;padding:6px;height:60px;text-align:center;vertical-align:middle;">
                \${isSigned ? \`<img src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=JUBIR" style="width:50px;height:50px;mix-blend-mode:multiply;" />\` : \`\`}
              </td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">2</td>
              <td style="border:1px solid #000;padding:6px;">ZAKARIA, A.Ma.Pd</td>
              <td style="border:1px solid #000;padding:6px;height:60px;text-align:center;vertical-align:middle;">
                \${isSigned ? \`<img src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=ZAKARIA" style="width:50px;height:50px;mix-blend-mode:multiply;" />\` : \`\`}
              </td>
            </tr>`;

const replaceDd = `            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">1</td>
              <td style="border:1px solid #000;padding:6px;">JUBIR, S.Pd.SD</td>
              <td style="border:1px solid #000;padding:6px;height:50px;"></td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">2</td>
              <td style="border:1px solid #000;padding:6px;">ZAKARIA, A.Ma.Pd</td>
              <td style="border:1px solid #000;padding:6px;height:50px;"></td>
            </tr>`;

if (content.includes(searchDd)) {
    content = content.split(searchDd).join(replaceDd);
    console.log('Reverted Tim Verifikasi barcode');
}

// Now replace the Camat's signature to use a barcode placeholder instead of ttd-camat.jpeg
const searchCamatImg = `<div style="position: absolute; margin: -10px 0 0 -10px;"><img src="/ttd-camat.jpeg" style="width: 170px; height: auto; mix-blend-mode: multiply;" /></div>`;

const replaceCamatBarcode = `<div style="position: absolute; margin: -10px 0 0 10px;"><img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=CAMAT_TEMIANG_PESISIR" style="width: 80px; height: 80px; mix-blend-mode: multiply;" /></div>`;

if (content.includes(searchCamatImg)) {
    content = content.split(searchCamatImg).join(replaceCamatBarcode);
    console.log('Replaced Camat signature with barcode');
}

fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
