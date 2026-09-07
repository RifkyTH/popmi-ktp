const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

const searchBottom = `        <table style="width:100%;font-family:Arial;font-size:12pt;margin-top:40px;">
          <tr>
            <td style="width:65%;"></td>
            <td style="width:35%;vertical-align:top;">
              Tajur Biru, 29 April 2026<br><br>
              <strong>CAMAT TEMIANG PESISIR,</strong><br>`;

const replaceBottom = `        <table style="width:100%;font-family:Arial;font-size:12pt;margin-top:40px;">
          <tr>
            <td style="width:65%;"></td>
            <td style="width:35%;vertical-align:top;">
              <strong>CAMAT TEMIANG PESISIR,</strong><br>`;

let updated = false;

if (content.includes(searchBottom)) {
    content = content.replace(searchBottom, replaceBottom);
    console.log('Fixed bottom date');
    updated = true;
} else {
    console.log('Search string for bottom not found');
}

const searchTopAdd = `      <!-- PAGE 1: SURAT PENGANTAR -->
      <div class="print-page" style="\${base}">
        \${kopSurat()}

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:8px;">`;

const replaceTopAdd = `      <!-- PAGE 1: SURAT PENGANTAR -->
      <div class="print-page" style="\${base}">
        \${kopSurat()}

        <div style="text-align:right;font-family:Arial;font-size:12pt;margin-top:20px;margin-bottom:20px;">
          Tajur Biru, \${formatTanggal(tanggal)}
        </div>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:8px;">`;

if (content.includes(searchTopAdd)) {
    content = content.replace(searchTopAdd, replaceTopAdd);
    console.log('Added top date');
    updated = true;
} else {
    console.log('Search string for top not found');
}

if (updated) {
    fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
}
