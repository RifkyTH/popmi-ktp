const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

const search = `                \${isSigned ? \`<img src="/ttd-digital.jpeg" style="width:50px;height:50px;object-fit:contain;mix-blend-mode:multiply;" />\` : \`\`}
              </td>`;

const replace = `                \${isSigned ? \`<img src="/ttd-digital.jpeg" style="width:100%;max-width:120px;height:auto;mix-blend-mode:multiply;" />\` : \`\`}
              </td>`;

if (content.includes(search)) {
    content = content.split(search).join(replace);
    fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
    console.log('Updated image styling');
} else {
    console.log('Search string not found');
}
