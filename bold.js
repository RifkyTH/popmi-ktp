const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

content = content.replace('${jabatan},${isSigned', '<strong>${jabatan}</strong>,${isSigned');
content = content.replace('CAMAT TEMIANG PESISIR,<br>', '<strong>CAMAT TEMIANG PESISIR,</strong><br>');

fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
console.log('Bold applied');
