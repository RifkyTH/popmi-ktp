const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

const search = `<td style="width:50%;vertical-align:top;padding-left:40px;text-align:center;">
              Tajur Biru, \${formatTanggal(tanggal)}<br>
              <strong>CAMAT TEMIANG PESISIR</strong><br>`;

const replace = `<td style="width:50%;vertical-align:top;padding-left:40px;">
              Tajur Biru, \${formatTanggal(tanggal)}<br>
              <strong>CAMAT TEMIANG PESISIR</strong><br>`;

if (content.includes(search)) {
    content = content.split(search).join(replace);
    fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
    console.log('Removed text-align:center from Ahli Waris Camat block');
} else {
    console.log('Search string not found');
}
