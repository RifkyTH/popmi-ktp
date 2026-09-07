const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

const fixes = [
  // 1. Kecamatan Temiang pesisir -> Temiang Pesisir (huruf P kapital)
  ['Kecamatan Temiang pesisir.', 'Kecamatan Temiang Pesisir.'],

  // 2. memperdomanai -> memperdomi
  ['memperdomanai ketentuan', 'memperdomi ketentuan'],

  // 3. berbunyi" -> berbunyi "  (spasi sebelum tanda petik pembuka)
  ['yang berbunyi&quot; dalam', 'yang berbunyi &quot;dalam'],

  // 4. bupati" -> bupati" (spasi setelah tanda petik penutup)
  ['kepada bupati&quot; namun', 'kepada bupati&quot; namun'],

  // 5. republic Indonesia -> Republik Indonesia
  ['negeri republic Indonesia', 'negeri Republik Indonesia'],

  // 6. Hapus titik-koma yang diakhiri.,  -> .
  ['perangkat desa.,</td>', 'perangkat desa.</td>'],
  ['pengangkatan dan pemberhentian perangkat desa.,</td>', 'pengangkatan dan pemberhentian perangkat desa.</td>'],
];

let count = 0;
for (const [from, to] of fixes) {
  if (content.includes(from)) {
    content = content.split(from).join(to);
    console.log('Fixed: ' + from.substring(0, 50));
    count++;
  } else {
    console.log('NOT FOUND: ' + from.substring(0, 50));
  }
}

fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
console.log(`\nTotal: ${count} perbaikan diterapkan`);
