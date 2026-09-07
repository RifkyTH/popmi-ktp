const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

const search = `<p style="font-family:Arial;font-size:12pt;">Yth. Kepala Dinas Pemberdayaan Masyarakat dan Desa</p>
        <p style="font-family:Arial;font-size:12pt;">Kabupaten Lingga</p>
        <p style="font-family:Arial;font-size:12pt;">di -</p>
        <p style="font-family:Arial;font-size:12pt;font-weight:bold;padding-left:40px;margin-bottom:8px;">Daik Lingga</p>`;

const replace = `<div style="font-family:Arial;font-size:12pt;margin-bottom:12px;">
          Yth. Kepala Dinas Pemberdayaan Masyarakat dan Desa<br>
          Kabupaten Lingga<br>
          di -<br>
          <span style="font-weight:bold;margin-left:40px;">Daik Lingga</span>
        </div>`;

if (content.includes(search)) {
    content = content.replace(search, replace);
    fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
    console.log('Alamat tujuan updated');
} else {
    console.log('Search string not found');
}
