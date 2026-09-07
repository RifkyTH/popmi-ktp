const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

const search_ahli_waris = `    case "ahli_waris": return \`
      <div class="print-page" style="\${base}">`;
const replace_ahli_waris = `    case "ahli_waris": {
      const f = surat.data_form || {}
      return \`
      <div class="print-page" style="\${base}">`;

const search_saksi = `                <tr>
                  <td style="width:20px;">1.</td>
                  <td>ARIANTO (Ketua RT 006)</td>
                  <td style="text-align:right;">(...............)</td>
                </tr>
                <tr>
                  <td style="width:20px;padding-top:16px;">2.</td>
                  <td style="padding-top:16px;">ISLAN (Ketua RW 003)</td>
                  <td style="text-align:right;padding-top:16px;">(...............)</td>
                </tr>`;

const replace_saksi = `                <tr>
                  <td style="width:20px;">1.</td>
                  <td>\${f.saksi1 || "ARIANTO (Ketua RT 006)"}</td>
                  <td style="text-align:right;">(...............)</td>
                </tr>
                <tr>
                  <td style="width:20px;padding-top:16px;">2.</td>
                  <td style="padding-top:16px;">\${f.saksi2 || "ISLAN (Ketua RW 003)"}</td>
                  <td style="text-align:right;padding-top:16px;">(...............)</td>
                </tr>`;

const search_end = `        </table>
      </div>\``;
const replace_end = `        </table>
      </div>\`
    }`;


let modified = false;

if (content.includes(search_ahli_waris)) {
    content = content.split(search_ahli_waris).join(replace_ahli_waris);
    modified = true;
} else {
    console.log("search_ahli_waris failed");
}

if (content.includes(search_saksi)) {
    content = content.split(search_saksi).join(replace_saksi);
    modified = true;
} else {
    console.log("search_saksi failed");
}

if (content.includes(search_end)) {
    // Wait, replacing search_end globally might break other cases if they look exactly the same.
    // So let's only replace the first occurrence after search_saksi.
    const parts = content.split(replace_saksi);
    if(parts.length > 1) {
        parts[1] = parts[1].replace(search_end, replace_end);
        content = parts.join(replace_saksi);
    }
} else {
    console.log("search_end failed");
}

if (modified) {
    fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
    console.log('Updated ahli_waris saksi to use variables');
}
