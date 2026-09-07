const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

const search = `          </ol>
        </div>

      <!-- PAGE 2 -->`;
      
const replace = `          </ol>
        </div>
      </div>

      <!-- PAGE 2 -->`;

if (content.includes(search)) {
    content = content.replace(search, replace);
    fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
    console.log('Added missing closing div');
} else {
    console.log('Search string not found');
}
