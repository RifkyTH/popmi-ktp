const fs = require('fs');
let lines = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('CAMAT TEMIANG PESISIR')) {
        // Find the <br><br><br><br> line around here
        for (let j = i; j < i + 5; j++) {
            if (lines[j] && lines[j].includes('<br><br><br><br>')) {
                // If it's a standalone line (not inside the template literal logic)
                if (lines[j].trim() === '<br><br><br><br>') {
                    lines.splice(j, 1);
                    // Add some height to the absolute positioned div instead
                    // Wait, the easiest is to just modify the isSigned line to include <br>s
                    break;
                }
            }
        }
    }
}

// Just to be extremely precise
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<div style="position: absolute; margin: -10px 0 0 -10px;"><img src="/ttd-camat.jpeg"')) {
        // Change it to output <br>s when signed so layout doesn't collapse
        lines[i] = lines[i].replace(
            '<div style="position: absolute; margin: -10px 0 0 -10px;"><img src="/ttd-camat.jpeg" style="width: 170px; height: auto; mix-blend-mode: multiply;" /></div>',
            '<div style="position: absolute; margin: -10px 0 0 -10px;"><img src="/ttd-camat.jpeg" style="width: 170px; height: auto; mix-blend-mode: multiply;" /></div><br><br><br><br><br>'
        );
    }
}

fs.writeFileSync('lib/mock-data/generate-surat.ts', lines.join('\n'));
console.log('Fixed signature gap');
