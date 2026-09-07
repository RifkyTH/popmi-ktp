const fs = require('fs');
let lines = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8').split('\n');

const search = '<div style="margin-top:20px;font-family:Arial;font-size:12pt;">';

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Tembusan:')) {
        // Find the div above it
        for (let j = i; j >= i - 5; j--) {
            if (lines[j].includes('font-size:12pt;')) {
                lines[j] = lines[j].replace('font-size:12pt;', 'font-size:10pt;');
                break;
            }
        }
        break;
    }
}

fs.writeFileSync('lib/mock-data/generate-surat.ts', lines.join('\n'));
console.log('Fixed font size for Tembusan');
