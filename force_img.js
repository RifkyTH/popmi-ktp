const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

const search = `                \${isSigned ? \`<img src="/ttd-digital.jpeg" style="width:100%;max-width:120px;height:auto;mix-blend-mode:multiply;" />\` : \`\`}`;

const replace = `                <img src="/ttd-digital.jpeg" style="width:100%;max-width:120px;height:auto;mix-blend-mode:multiply;" />`;

if (content.includes(search)) {
    content = content.split(search).join(replace);
    fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
    console.log('Removed isSigned condition for table images');
} else {
    console.log('Search string not found');
}
