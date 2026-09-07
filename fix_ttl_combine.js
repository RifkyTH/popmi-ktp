const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

// Fix ttlPewaris - combine tempatLahirPewaris + tanggalLahirPewaris
const old1 = '          ${fieldRow("Tempat/ Tgl.Lahir", f.ttlPewaris || "", "150px")}';
const new1 = '          ${fieldRow("Tempat/ Tgl.Lahir", (f.tempatLahirPewaris || "") + (f.tanggalLahirPewaris ? ", " + formatTanggal(f.tanggalLahirPewaris) : ""), "150px")}';

// Fix ttlPemohon - combine tempatLahirPemohon + tanggalLahirPemohon
const old2 = '          ${fieldRow("Tempat/ Tgl.Lahir", f.ttlPemohon || "", "150px")}';
const new2 = '          ${fieldRow("Tempat/ Tgl.Lahir", (f.tempatLahirPemohon || "") + (f.tanggalLahirPemohon ? ", " + formatTanggal(f.tanggalLahirPemohon) : ""), "150px")}';

let modified = false;

if (content.includes(old1)) {
    content = content.split(old1).join(new1);
    modified = true;
    console.log('ttlPewaris updated');
} else {
    console.log('old1 not found');
}

if (content.includes(old2)) {
    content = content.split(old2).join(new2);
    modified = true;
    console.log('ttlPemohon updated');
} else {
    console.log('old2 not found');
}

if (modified) {
    fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
    console.log('Done');
}
