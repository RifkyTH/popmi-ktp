const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

// Fix size for ADD/DD tables
const searchTableImg = `<img src="/ttd-digital.jpeg" style="width:100%;max-width:120px;height:auto;mix-blend-mode:multiply;" />`;
const replaceTableImg = `\${isSigned ? \`<img src="/ttd-digital.jpeg" style="width:60px;height:60px;object-fit:contain;mix-blend-mode:multiply;" />\` : \`\`}`;

if (content.includes(searchTableImg)) {
    content = content.split(searchTableImg).join(replaceTableImg);
    console.log('Reduced barcode size in tables (and added isSigned back)');
}

// Fix size for tunda_salur_add (the dotted line version)
const searchTundaImg1 = `\${isSigned ? \`<img src="/ttd-digital.jpeg" style="position:absolute; right:0; top:-20px; width:100px; height:auto; mix-blend-mode:multiply;" />\` : \`\`}`;
const replaceTundaImg1 = `\${isSigned ? \`<img src="/ttd-digital.jpeg" style="position:absolute; right:10px; top:-10px; width:60px; height:60px; object-fit:contain; mix-blend-mode:multiply;" />\` : \`\`}`;

const searchTundaImg2 = `\${isSigned ? \`<img src="/ttd-digital.jpeg" style="position:absolute; right:0; top:0px; width:100px; height:auto; mix-blend-mode:multiply;" />\` : \`\`}`;
const replaceTundaImg2 = `\${isSigned ? \`<img src="/ttd-digital.jpeg" style="position:absolute; right:10px; top:10px; width:60px; height:60px; object-fit:contain; mix-blend-mode:multiply;" />\` : \`\`}`;


if (content.includes(searchTundaImg1)) {
    content = content.split(searchTundaImg1).join(replaceTundaImg1);
    console.log('Reduced barcode size in tunda_salur_add (row 1)');
}

if (content.includes(searchTundaImg2)) {
    content = content.split(searchTundaImg2).join(replaceTundaImg2);
    console.log('Reduced barcode size in tunda_salur_add (row 2)');
}


fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
