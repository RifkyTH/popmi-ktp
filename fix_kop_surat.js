const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

const search = `      <!-- PAGE 2: BERITA ACARA -->
      <div class="print-page" style="\${base};page-break-before:always;">
        <div style="text-align:center;font-family:Arial;font-size:12pt;font-weight:bold;text-decoration:underline;margin:12px 0 16px 0;">`;

const replace = `      <!-- PAGE 2: BERITA ACARA -->
      <div class="print-page" style="\${base};page-break-before:always;">
        \${kopSurat()}
        <div style="text-align:center;font-family:Arial;font-size:12pt;font-weight:bold;text-decoration:underline;margin:12px 0 16px 0;">`;

if (content.includes(search)) {
    content = content.replace(search, replace);
    fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
    console.log('Added kopSurat');
} else {
    console.log('Search string not found');
}
