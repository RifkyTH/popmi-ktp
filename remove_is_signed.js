const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

// For the ADD/DD tables: remove isSigned
const searchTableImg = `\${isSigned ? \`<img src="/ttd-digital.jpeg" style="width:60px;height:60px;object-fit:contain;mix-blend-mode:multiply;" />\` : \`\`}`;
const replaceTableImg = `<img src="/ttd-digital.jpeg" style="width:60px;height:60px;object-fit:contain;mix-blend-mode:multiply;" />`;

if (content.includes(searchTableImg)) {
    content = content.split(searchTableImg).join(replaceTableImg);
    console.log('Removed isSigned for tables');
}

// For tunda_salur_add (dotted lines): remove isSigned
const searchTundaImg1 = `\${isSigned ? \`<img src="/ttd-digital.jpeg" style="position:absolute; right:10px; top:-10px; width:60px; height:60px; object-fit:contain; mix-blend-mode:multiply;" />\` : \`\`}`;
const replaceTundaImg1 = `<img src="/ttd-digital.jpeg" style="position:absolute; right:10px; top:-10px; width:60px; height:60px; object-fit:contain; mix-blend-mode:multiply;" />`;

const searchTundaImg2 = `\${isSigned ? \`<img src="/ttd-digital.jpeg" style="position:absolute; right:10px; top:10px; width:60px; height:60px; object-fit:contain; mix-blend-mode:multiply;" />\` : \`\`}`;
const replaceTundaImg2 = `<img src="/ttd-digital.jpeg" style="position:absolute; right:10px; top:10px; width:60px; height:60px; object-fit:contain; mix-blend-mode:multiply;" />`;

if (content.includes(searchTundaImg1)) {
    content = content.split(searchTundaImg1).join(replaceTundaImg1);
    console.log('Removed isSigned for tunda 1');
}

if (content.includes(searchTundaImg2)) {
    content = content.split(searchTundaImg2).join(replaceTundaImg2);
    console.log('Removed isSigned for tunda 2');
}

fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
