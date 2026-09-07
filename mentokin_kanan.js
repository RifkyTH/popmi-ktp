const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

const search = `          <tr>
            <td style="width:50%;"></td>
            <td style="width:50%;vertical-align:top;padding-left:40px;padding-top:40px;">
              Tajur Biru, \${formatTanggal(tanggal)}<br>`;

const replace = `          <tr>
            <td style="width:65%;"></td>
            <td style="width:35%;vertical-align:top;padding-top:40px;">
              Tajur Biru, \${formatTanggal(tanggal)}<br>`;

if (content.includes(search)) {
    content = content.split(search).join(replace);
    fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
    console.log('Mentokin kanan berhasil');
} else {
    console.log('Search string not found');
}
