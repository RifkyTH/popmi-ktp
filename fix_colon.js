const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

const search = `    <td style="width:12px;vertical-align:top;padding:2px 0;font-family:Arial;font-size:12pt;line-height:1.15;">:</td>`;
const replace = `    <td style="width:24px;vertical-align:top;padding:2px 0;font-family:Arial;font-size:12pt;line-height:1.15;text-align:center;">:</td>`;

if (content.includes(search)) {
    content = content.split(search).join(replace);
    fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
    console.log('Updated colon spacing in fieldRow');
} else {
    console.log('Search string not found');
}
