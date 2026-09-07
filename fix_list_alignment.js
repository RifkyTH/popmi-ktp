const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

const oldTable = `<table style="width:100%;font-family:Arial;font-size:12pt;border:none;margin-bottom:6px;">
          <tr>
            <td style="width:24px;vertical-align:top;">1.</td>
            <td style="text-align:justify;line-height:1.5;">Proses Pemberhentian dan Pengangkatan Perangkat Desa tetap berdasarkan pada ketentuan peraturan perundang-undangan yang berlaku sebagai berikut :
              <table style="width:100%;border:none;margin-top:4px;">
                <tr>
                  <td style="width:24px;vertical-align:top;">a.</td>
                  <td style="text-align:justify;line-height:1.5;padding-bottom:6px;">Kepala Desa harus memperdomi ketentuan tentang pemberhentian perangkat desa sebagaimana terdapat perubahan kewenangan kepala desa diatur pada pasal 26 ayat (2) huruf B undang-undang no 3 tahun 2024 tentang perubahan kedua atas undang-undang no 6 tahun 2014 tentang Desa yang berbunyi &quot;dalam melaksanakan tugas, sebagaimana dimaksud pada ayat 1, kepala desa berwenang mengusulkan pengangkatan dan pemberhentian perangkat desa kepada bupati&quot; namun tidak diikuti dengan perubahan mekanisme pengangkatan dan pemberhentian desa pada pasal 49 ayat 2 dan mekanisme pemberhentian perangkat desa pada pasal 53 ayat 3 undang-undang no 6 tahun 2014 tentang desa.,</td>
                </tr>
                <tr>
                  <td style="width:24px;vertical-align:top;">b.</td>
                  <td style="text-align:justify;line-height:1.5;padding-bottom:6px;">Permendagri nomor 67 tahun 2017 tentang perubahan atas peraturan mendagri no 83 tahun 2015 tentang pengangkatan dan pemberhentian perangkat desa.,</td>
                </tr>
                <tr>
                  <td style="width:24px;vertical-align:top;">c.</td>
                  <td style="text-align:justify;line-height:1.5;padding-bottom:6px;">Surat menteri dalam negeri Republik Indonesia nomor : 100.3.5.5/3318/BPD tanggal 16 Juli 2024 hal : penegasan penentuan perubahan tentang perangkat desa.,</td>
                </tr>
                <tr>
                  <td style="width:24px;vertical-align:top;">d.</td>
                  <td style="text-align:justify;line-height:1.5;">Peraturan Bupati Lingga nomor 31 tahun 2017 tentang pedoman penyusunan struktur organisasi dan tata kerja pemerintah desa.</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="width:24px;vertical-align:top;padding-top:6px;">2.</td>
            <td style="text-align:justify;line-height:1.5;padding-top:6px;">Agar kepala desa membuat surat usulan kepada Bupati atas Rekomendasi yang diberikan oleh Camat sebagai dasar penetapan pemberhentian perangkat desa (\${jabatan}).</td>
          </tr>
          <tr>
            <td style="width:24px;vertical-align:top;padding-top:6px;">3.</td>
            <td style="text-align:justify;line-height:1.5;padding-top:6px;">Untuk menghindari tidak terjadi kekosongan Jabatan sebagai Perangkat desa (\${jabatan}) di Desa \${desa} Kecamatan Temiang Pesisir, disarankan agar Kepala Desa segera menunjuk pejabat pelaksana tugas yang berasal dari perangkat desa yang ada.</td>
          </tr>
          <tr>
            <td style="width:24px;vertical-align:top;padding-top:6px;">4.</td>
            <td style="text-align:justify;line-height:1.5;padding-top:6px;">Bupati melakukan evaluasi atas usulan pemberhentian perangkat desa dan memberikan rekomendasi tertulis kepada kepala desa selambat-lambatnya 20 (Dua Puluh) hari kerja.</td>
          </tr>
          <tr>
            <td style="width:24px;vertical-align:top;padding-top:6px;">5.</td>
            <td style="text-align:justify;line-height:1.5;padding-top:6px;">Kepala desa menetapkan keputusan pemberhentian perangkat desa paling lambat 14 (Empat Belas) hari kerja setelah diterimanya rekomendasi tertulis dari bupati.</td>
          </tr>
        </table>`;

const newList = `<ol style="font-family:Arial;font-size:12pt;line-height:1.5;margin:0 0 6px 0;padding-left:24px;text-align:justify;">
          <li style="margin-bottom:6px;padding-left:4px;">Proses Pemberhentian dan Pengangkatan Perangkat Desa tetap berdasarkan pada ketentuan peraturan perundang-undangan yang berlaku sebagai berikut :
            <ol type="a" style="margin:4px 0 0 0;padding-left:20px;">
              <li style="margin-bottom:6px;padding-left:4px;">Kepala Desa harus memperdomi ketentuan tentang pemberhentian perangkat desa sebagaimana terdapat perubahan kewenangan kepala desa diatur pada pasal 26 ayat (2) huruf B undang-undang no 3 tahun 2024 tentang perubahan kedua atas undang-undang no 6 tahun 2014 tentang Desa yang berbunyi &quot;dalam melaksanakan tugas, sebagaimana dimaksud pada ayat 1, kepala desa berwenang mengusulkan pengangkatan dan pemberhentian perangkat desa kepada bupati&quot; namun tidak diikuti dengan perubahan mekanisme pengangkatan dan pemberhentian desa pada pasal 49 ayat 2 dan mekanisme pemberhentian perangkat desa pada pasal 53 ayat 3 undang-undang no 6 tahun 2014 tentang desa.,</li>
              <li style="margin-bottom:6px;padding-left:4px;">Permendagri nomor 67 tahun 2017 tentang perubahan atas peraturan mendagri no 83 tahun 2015 tentang pengangkatan dan pemberhentian perangkat desa.,</li>
              <li style="margin-bottom:6px;padding-left:4px;">Surat menteri dalam negeri Republik Indonesia nomor : 100.3.5.5/3318/BPD tanggal 16 Juli 2024 hal : penegasan penentuan perubahan tentang perangkat desa.,</li>
              <li style="margin-bottom:0;padding-left:4px;">Peraturan Bupati Lingga nomor 31 tahun 2017 tentang pedoman penyusunan struktur organisasi dan tata kerja pemerintah desa.</li>
            </ol>
          </li>
          <li style="margin-bottom:6px;padding-left:4px;">Agar kepala desa membuat surat usulan kepada Bupati atas Rekomendasi yang diberikan oleh Camat sebagai dasar penetapan pemberhentian perangkat desa (\${jabatan}).</li>
          <li style="margin-bottom:6px;padding-left:4px;">Untuk menghindari tidak terjadi kekosongan Jabatan sebagai Perangkat desa (\${jabatan}) di Desa \${desa} Kecamatan Temiang Pesisir, disarankan agar Kepala Desa segera menunjuk pejabat pelaksana tugas yang berasal dari perangkat desa yang ada.</li>
          <li style="margin-bottom:6px;padding-left:4px;">Bupati melakukan evaluasi atas usulan pemberhentian perangkat desa dan memberikan rekomendasi tertulis kepada kepala desa selambat-lambatnya 20 (Dua Puluh) hari kerja.</li>
          <li style="margin-bottom:6px;padding-left:4px;">Kepala desa menetapkan keputusan pemberhentian perangkat desa paling lambat 14 (Empat Belas) hari kerja setelah diterimanya rekomendasi tertulis dari bupati.</li>
        </ol>`;

if (content.includes(oldTable)) {
    content = content.split(oldTable).join(newList);
    fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
    console.log('List updated to <ol>');
} else {
    // maybe exact match is failing, let's do a substring replace
    console.log('Exact match failed. Proceeding with split-join on table bounds.');
    const startIdx = content.indexOf('<table style="width:100%;font-family:Arial;font-size:12pt;border:none;margin-bottom:6px;">');
    const endStr = '</table>\n\n        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin:12px 0;text-indent:40px;line-height:1.5;">';
    const endIdx = content.indexOf(endStr);
    
    if (startIdx !== -1 && endIdx !== -1) {
        const fullOld = content.substring(startIdx, endIdx + 8); // include </table>
        content = content.split(fullOld).join(newList);
        fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
        console.log('List updated to <ol> via substring');
    } else {
        console.log('Not found at all');
    }
}
