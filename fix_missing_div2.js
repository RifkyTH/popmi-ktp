const fs = require('fs');
let lines = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<!-- PAGE 2 -->')) {
        lines.splice(i, 0, '      </div>');
        break;
    }
}

fs.writeFileSync('lib/mock-data/generate-surat.ts', lines.join('\n'));
console.log('Added closing div');
