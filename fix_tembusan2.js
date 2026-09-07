const fs = require('fs');
let lines = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8').split('\n');

const search = `        <div style="margin-top:20px;font-family:Arial;font-size:12pt;">
          <p>Tembusan:</p>
          <ol style="margin-left:20px;margin-top:4px;">
            <li>Yth. Kepala Badan Pengelolaan Keuangan dan Aset Daerah Kabupaten Lingga di Daik Lingga;</li>
            <li>Yth. Inspektur Kabupaten Lingga di Daik Lingga.</li>
          </ol>
        </div>`;

const replace = `        <div style="margin-top:20px;font-family:Arial;font-size:10pt;">
          Tembusan:<br>
          <ol style="margin-left:20px;margin-top:4px;padding-left:0;">
            <li>Yth. Kepala Badan Pengelolaan Keuangan dan Aset Daerah Kabupaten Lingga di Daik Lingga;</li>
            <li>Yth. Inspektur Kabupaten Lingga di Daik Lingga.</li>
          </ol>
        </div>`;

let found = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<div style="margin-top:20px;font-family:Arial;font-size:12pt;">')) {
        if (lines[i+1].includes('<p>Tembusan:</p>')) {
            lines.splice(i, 8, replace);
            found = true;
            break;
        }
    }
}

if (found) {
    fs.writeFileSync('lib/mock-data/generate-surat.ts', lines.join('\n'));
    console.log('Tembusan updated');
} else {
    console.log('Not found');
}
