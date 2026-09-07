const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

const search = `<p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:24px;text-indent:40px;line-height:1.5;">
          Demikian Berita Acara ini dibuat untuk digunakan sebagaimana mestinya.
        </p>
        
        <table style="width:100%;font-family:Arial;font-size:12pt;border-collapse:collapse;margin-bottom:24px;">
          <thead>
            <tr>
              <th style="border:1px solid #000;padding:6px;text-align:center;width:45px;white-space:nowrap;">No</th>
              <th style="border:1px solid #000;padding:6px;text-align:center;">NAMA ANGGOTA TIM VERIFIKASI KECAMATAN</th>`;

const replace = `<p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:12px;text-indent:40px;line-height:1.5;">
          Demikian Berita Acara ini dibuat untuk digunakan sebagaimana mestinya.
        </p>
        
        <p style="font-family:Arial;font-size:12pt;margin-bottom:12px;">
          Daftar anggota Tim Verifikasi Kecamatan
        </p>

        <table style="width:100%;font-family:Arial;font-size:12pt;border-collapse:collapse;margin-bottom:24px;">
          <thead>
            <tr>
              <th style="border:1px solid #000;padding:6px;text-align:center;width:45px;white-space:nowrap;">No</th>
              <th style="border:1px solid #000;padding:6px;text-align:center;">NAMA ANGGOTA TIM VERIFIKASI KECAMATAN</th>`;

if (content.includes(search)) {
    content = content.replace(search, replace);
    fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
    console.log('Fixed spacing and restored text');
} else {
    console.log('Search string not found');
}
