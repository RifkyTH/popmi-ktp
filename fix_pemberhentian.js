const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

const oldBlock = `    // ── 8. PEMBERHENTIAN PERANGKAT DESA ──────────────────────────────────────\r\n    case "pemberhentian_perangkat": return \`\r\n      <div class="print-page" style="\${base}">\r\n        \${kopSurat()}\r\n\r\n        <div style="text-align:center;font-family:Arial;font-size:14pt;font-weight:bold;margin:16px 0 4px 0;"><u>REKOMENDASI</u></div>\r\n        <div style="text-align:center;font-family:Arial;font-size:12pt;margin-bottom:4px;">Nomor : \${surat.nomor}</div>\r\n        <div style="text-align:center;font-family:Arial;font-size:12pt;margin-bottom:6px;">TENTANG</div>\r\n        <div style="text-align:center;font-family:Arial;font-size:12pt;font-weight:bold;margin-bottom:20px;">Rekomendasi Persetujuan Pemberhentian Perangkat Desa</div>\r\n\r\n        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:10px;">\r\n          Menindaklanjuti surat dari Kepala Desa \${desa} Kecamatan Temiang Pesisir Nomor: 140/DS-PL.B/IV/2026/046, tanggal 27 April 2026 perihal Permohonan Rekomendasi Pemberhentian Perangkat Desa pada Jabatan Kasi Pemerintahan Desa \${desa} Kecamatan Temiang Pesisir. Disampaikan hal-hal sebagai berikut:\r\n        </p>\r\n\r\n        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:8px;">Proses Pemberhentian dan Pengangkatan Perangkat Desa tetap berdasarkan pada ketentuan peraturan perundang-undangan yang berlaku sebagai berikut:</p>\r\n\r\n        <ol style="font-family:Arial;font-size:12pt;margin-left:20px;margin-bottom:10px;text-align:justify;">\r\n          <li style="margin-bottom:6px;">Kepala Desa harus memperdomani ketentuan tentang pemberhentian perangkat desa sebagaimana terdapat perubahan kewenangan kepala desa diatur pada pasal 26 ayat (2) huruf B undang-undang no 3 tahun 2024 tentang perubahan kedua atas undang-undang no 6 tahun 2014 tentang Desa;</li>\r\n          <li style="margin-bottom:6px;">Permendagri nomor 67 tahun 2017 tentang perubahan atas peraturan mendagri no 83 tahun 2015 tentang pengangkatan dan pemberhentian perangkat desa;</li>\r\n          <li style="margin-bottom:6px;">Surat menteri dalam negeri republik Indonesia nomor: 100.3.5.5/3318/BPD tanggal 16 Juli 2024 hal: penegasan penentuan perubahan tentang perangkat desa;</li>\r\n          <li>Peraturan Bupati Lingga nomor 31 tahun 2017 tentang pedoman penyusunan struktur organisasi dan tata kerja pemerintah desa.</li>\r\n        </ol>\r\n\r\n        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:8px;">Agar kepala desa membuat surat usulan kepada Bupati atas Rekomendasi yang diberikan oleh Camat sebagai dasar penetapan pemberhentian perangkat desa (Kasi Pemerintahan).</p>\r\n        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:8px;">Untuk menghindari tidak terjadi kekosongan Jabatan sebagai Perangkat desa (Kasi Pemerintahan) Desa \${desa} Kecamatan Temiang Pesisir, disarankan agar Kepala Desa segera menunjuk pejabat pelaksana tugas yang berasal dari perangkat desa yang ada.</p>\r\n        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:8px;">Bupati melakukan evaluasi atas usulan pemberhentian perangkat desa dan memberikan rekomendasi tertulis kepada kepala desa selambat-lambatnya 20 (Dua Puluh) hari kerja.</p>\r\n        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:8px;">Kepala desa menetapkan keputusan pemberhentian perangkat desa paling lambat 14 (Empat Belas) hari kerja setelah diterimanya rekomendasi tertulis dari bupati.</p>\r\n        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:8px;">Demikian rekomendasi ini disampaikan, atas perhatian dan bantuannya kami ucapkan terimakasih.</p>\r\n\r\n        <table style="width:100%;font-family:Arial;font-size:12pt;margin-top:20px;">\r\n          <tr>\r\n            <td style="width:65%;vertical-align:top;">\r\n              Dikeluarkan di: Tajur Biru<br>\r\n              Pada Tanggal: \${formatTanggal(tanggal)}\r\n            </td>\r\n            <td style="width:35%;vertical-align:top;">\r\n              CAMAT TEMIANG PESISIR,\${isSigned ? \`<div style="margin: 4px 0;"><img src="/ttd-camat.jpeg" style="width: 95px; height: auto; mix-blend-mode: multiply;" /></div>\` : \`<br><br><br><br><br>\`}\r\n              <strong><u>HENDRA, S.STP</u></strong><br>\r\n              PEMBINA / IV.a<br>\r\n              NIP. 198507122006021001\r\n            </td>\r\n          </tr>\r\n        </table>\r\n\r\n        <div style="margin-top:20px;font-family:Arial;font-size:12pt;">\r\n          <p>Tembusan Kepada Yth:</p>\r\n          <ol style="margin-left:20px;">\r\n            <li>Bupati Lingga;</li>\r\n            <li>Kepala Dinas Pemberdayaan Masyarakat dan Desa Kabupaten Lingga;</li>\r\n            <li>Inspektur Kabupaten Lingga;</li>\r\n            <li>Ketua Badan Permusyawaratan Desa \${desa};</li>\r\n            <li>Arsip.</li>\r\n          </ol>\r\n        </div>\r\n      </div>\``;

const newBlock = `    // ── 8. PEMBERHENTIAN PERANGKAT DESA ──────────────────────────────────────
    case "pemberhentian_perangkat": {
      const f = surat.data_form || {}
      const jabatan = f.jabatan || "Kasi Pemerintahan"
      const nomorSuratDesa = f.nomorSuratDesa || "....................."
      const tglSuratDesa = f.tanggalSuratDesa ? formatTanggal(f.tanggalSuratDesa) : "....................."
      return \`
      <div class="print-page" style="\${base}">
        \${kopSurat()}

        <div style="text-align:center;font-family:Arial;font-size:12pt;font-weight:bold;margin:16px 0 4px 0;">REKOMENDASI</div>
        <div style="text-align:center;font-family:Arial;font-size:12pt;margin-bottom:4px;">Nomor : \${surat.nomor}</div>
        <div style="text-align:center;font-family:Arial;font-size:12pt;margin-bottom:2px;font-weight:bold;">TENTANG</div>
        <div style="text-align:center;font-family:Arial;font-size:12pt;margin-bottom:16px;">Rekomendasi Persetujuan Pemberhentian Perangkat Desa</div>

        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:10px;text-indent:40px;line-height:1.5;">
          Menindaklanjuti surat dari Kepala Desa \${desa} Kecamatan Temiang Pesisir Nomor :\${nomorSuratDesa}, tanggal \${tglSuratDesa} perihal Permohonan Rekomendasi Pemberhentian Perangkat Desa pada Jabatan \${jabatan} Desa \${desa} Kecamatan Temiang pesisir. Disampaikan hal-hal sebagai berikut :
        </p>

        <table style="width:100%;font-family:Arial;font-size:12pt;border:none;margin-bottom:6px;">
          <tr>
            <td style="width:24px;vertical-align:top;">1.</td>
            <td style="text-align:justify;line-height:1.5;">Proses Pemberhentian dan Pengangkatan Perangkat Desa tetap berdasarkan pada ketentuan peraturan perundang-undangan yang berlaku sebagai berikut :
              <table style="width:100%;border:none;margin-top:4px;">
                <tr>
                  <td style="width:24px;vertical-align:top;">a.</td>
                  <td style="text-align:justify;line-height:1.5;padding-bottom:6px;">Kepala Desa harus memperdomanai ketentuan tentang pemberhentian perangkat desa sebagaimana terdapat perubahan kewenangan kepala desa diatur pada pasal 26 ayat (2) huruf B undang-undang no 3 tahun 2024 tentang perubahan kedua atas undang-undang no 6 tahun 2014 tentang Desa yang berbunyi&quot; dalam melaksanakan tugas, sebagaimana dimaksud pada ayat 1, kepala desa berwenang mengusulkan pengangkatan dan pemberhentian perangkat desa kepada bupati&quot; namun tidak diikuti dengan perubahan mekanisme pengangkatan dan pemberhentian desa pada pasal 49 ayat 2 dan mekanisme pemberhentian perangkat desa pada pasal 53 ayat 3 undang-undang no 6 tahun 2014 tentang desa.,</td>
                </tr>
                <tr>
                  <td style="width:24px;vertical-align:top;">b.</td>
                  <td style="text-align:justify;line-height:1.5;padding-bottom:6px;">Permendagri nomor 67 tahun 2017 tentang perubahan atas peraturan mendagri no 83 tahun 2015 tentang pengangkatan dan pemberhentian perangkat desa.,</td>
                </tr>
                <tr>
                  <td style="width:24px;vertical-align:top;">c.</td>
                  <td style="text-align:justify;line-height:1.5;padding-bottom:6px;">Surat menteri dalam negeri republic Indonesia nomor : 100.3.5.5/3318/BPD tanggal 16 Juli 2024 hal : penegasan penentuan perubahan tentang perangkat desa.,</td>
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
        </table>

        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin:12px 0;text-indent:40px;line-height:1.5;">
          Demikian rekomendasi ini disampaikan, atas perhatian dan bantuannya kami ucapkan terimakasih.
        </p>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-top:20px;">
          <tr>
            <td style="width:60%;vertical-align:top;"></td>
            <td style="width:40%;vertical-align:top;">
              Dikeluarkan di : Tajur Biru<br>
              <span style="text-decoration:underline;">Pada Tanggal : \${formatTanggal(tanggal)}</span><br><br>
              <strong>CAMAT TEMIANG PESISIR</strong><br>
              \${isSigned ? \`<div style="position:absolute;margin:-5px 0 0 -10px;"><img src="/ttd-camat.jpeg" style="width:170px;height:auto;mix-blend-mode:multiply;" /></div><br><br><br><br><br>\` : \`<br><br><br><br><br>\`}
              <strong><u>HENDRA, S.STP</u></strong><br>
              PEMBINA / IV.a<br>
              NIP 198507122006021001
            </td>
          </tr>
        </table>

        <div style="font-family:Arial;font-size:10pt;margin-top:24px;line-height:1.4;">
          <p style="margin-bottom:4px;">Tembusan Kepada Yth :</p>
          <table style="border:none;width:100%;">
            <tr><td style="width:20px;vertical-align:top;">1.</td><td>Bupati Lingga</td></tr>
            <tr><td style="vertical-align:top;padding-top:2px;">2.</td><td style="padding-top:2px;">Cq Kepala Dinas Pemberdayaan Masyarakat dan Desa Kabupaten Lingga;</td></tr>
            <tr><td style="vertical-align:top;padding-top:2px;">3.</td><td style="padding-top:2px;">Inspektur Kabupaten Lingga;</td></tr>
            <tr><td style="vertical-align:top;padding-top:2px;">4.</td><td style="padding-top:2px;">Ketua Badan Permusyawaratan Desa \${desa};</td></tr>
            <tr><td style="vertical-align:top;padding-top:2px;">5.</td><td style="padding-top:2px;">Arsip.</td></tr>
          </table>
        </div>
      </div>\`
    }`;

if (content.includes(oldBlock)) {
    content = content.split(oldBlock).join(newBlock);
    fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
    console.log('pemberhentian_perangkat template updated');
} else {
    console.log('Old block not found');
    // try to find partial
    const idx = content.indexOf('case "pemberhentian_perangkat":');
    console.log('Found case at index:', idx);
}
