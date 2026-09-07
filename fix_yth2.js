const fs = require('fs');
let lines = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8').split('\n');

const content_to_insert = `        <div style="font-family:Arial;font-size:12pt;margin-bottom:12px;">
          Yth. Kepala Dinas Pemberdayaan Masyarakat dan Desa<br>
          Kabupaten Lingga<br>
          di -<br>
          <span style="font-weight:bold;margin-left:40px;">Daik Lingga</span>
        </div>`;

let index_to_insert = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Yth. Kepala Dinas Pemberdayaan Masyarakat dan Desa')) {
        index_to_insert = i;
        break;
    }
}

if (index_to_insert > -1) {
    lines.splice(index_to_insert, 4, content_to_insert);
    fs.writeFileSync('lib/mock-data/generate-surat.ts', lines.join('\n'));
    console.log('Fixed');
} else {
    console.log('Not found');
}
