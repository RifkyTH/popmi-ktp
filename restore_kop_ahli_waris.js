const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

const search = `    case "ahli_waris": return \`
      <div class="print-page" style="\${base}">
        <div style="text-align:center; font-family:Arial; font-size:12pt; margin-bottom:16px;">`;

const replace = `    case "ahli_waris": return \`
      <div class="print-page" style="\${base}">
        \${kopSurat()}
        <div style="text-align:center; font-family:Arial; font-size:12pt; margin-bottom:16px;">`;

if (content.includes(search)) {
    content = content.split(search).join(replace);
    fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
    console.log('Restored Kop Surat for ahli_waris');
} else {
    console.log('Search string not found');
}
