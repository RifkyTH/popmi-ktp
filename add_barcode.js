const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

// The replacement for both DD and ADD tables
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

// We just replace all occurrences globally (there should be exactly two: DD and ADD)
if (content.includes(searchDd)) {
    content = content.split(searchDd).join(replaceDd);
    fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
    console.log('Inserted barcode signatures');
} else {
    console.log('Search string not found');
}
