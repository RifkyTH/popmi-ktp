const fs = require('fs');
let lines = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8').split('\n');

let start = -1;
let end = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('case "tunda_salur_add":')) {
        start = i;
    }
    if (start !== -1 && lines[i].includes('// ── 7. AHLI WARIS')) {
        end = i;
        break;
    }
}

if (start !== -1 && end !== -1) {
    const newContent = `    case "tunda_salur_add": return \`
      <!-- PAGE 1: SURAT PENGANTAR -->
      <div class="print-page" style="\${base}">
        \${kopSurat()}

        <div style="text-align:right;font-family:Arial;font-size:12pt;margin-top:20px;margin-bottom:20px;">
          Tajur Biru, \${formatTanggal(tanggal)}
        </div>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:8px;">
          \${fieldRow("Nomor", surat.nomor, "80px")}
          \${fieldRow("Sifat", "Penting", "80px")}
          \${fieldRow("Lampiran", "1 (satu) dokumen", "80px")}
          \${fieldRow("Perihal", "<strong>Rekomendasi Pengajuan Tunda Salur ADD<br>Bulan Desember 2025</strong>", "80px")}
        </table>

        <div style="font-family:Arial;font-size:12pt;margin-bottom:12px;">
          Yth. Kepala Dinas Pemberdayaan Masyarakat<br>
          dan Desa Kabupaten Lingga<br>
          di -<br>
          <span style="font-weight:bold;margin-left:40px;">Daik Lingga</span>
        </div>

        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:10px;text-indent:40px;line-height:1.5;">
          Dengan ini kami kirimkan berkas kelengkapan pengajuan Alokasi Dana Desa <strong>Tunda Salur</strong> Bulan <strong>Desember</strong> 2025 sesuai dengan Peraturan Bupati Lingga Nomor 16 Tahun 2026 Tentang Pengalokasian Alokasi Dana Desa Tunda Salur Tahun 2025 Kabupaten Lingga Tahun Anggaran 2026 yang bersumber dari anggaran Pendapatan dan Belanja Daerah, Desa \${desa} dengan rincian terlampir.
        </p>
        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:10px;text-indent:40px;line-height:1.5;">
          Demikian disampaikan untuk menjadi bahan pertimbangan, atas perhatian dan kerjasamanya diucapkan terima kasih.
        </p>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-top:40px;">
          <tr>
            <td style="width:65%;"></td>
            <td style="width:35%;vertical-align:top;">
              <strong>CAMAT TEMIANG PESISIR,</strong><br>
              \${isSigned ? \`<div style="position: absolute; margin: -10px 0 0 -10px;"><img src="/ttd-camat.jpeg" style="width: 170px; height: auto; mix-blend-mode: multiply;" /></div><br><br><br><br><br>\` : \`<br><br><br><br><br>\`}
              <strong><u>HENDRA, S.STP</u></strong><br>
              PEMBINA / IV.a<br>
              NIP. 198507122006021001
            </td>
          </tr>
        </table>

        <div style="margin-top:20px;font-family:Arial;font-size:10pt;">
          Tembusan;<br>
          <ol style="margin-left:20px;margin-top:4px;padding-left:0;">
            <li>Yth. Kepala Badan Pengelolaan Keuangan dan Aset Daerah Kabupaten Lingga di Daik Lingga;</li>
            <li>Yth. Inspektur Kabupaten Lingga di Daik Lingga.</li>
          </ol>
        </div>
      </div>

      <!-- PAGE 2: BERITA ACARA -->
      <div class="print-page" style="\${base};page-break-before:always;">
        <div style="text-align:center;font-family:Arial;font-size:12pt;font-weight:bold;text-decoration:underline;margin:12px 0 16px 0;">
          Berita Acara Hasil Verifikasi Kecamatan
        </div>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:12px;border:none;">
          <tr><td style="width:120px;">Desa</td><td>: \${desa}</td></tr>
          <tr><td>Kecamatan</td><td>: Temiang Pesisir</td></tr>
        </table>

        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:10px;text-indent:40px;line-height:1.5;">
          Pada hari \${new Date(tanggal).toLocaleDateString('id-ID', {weekday:'long'})} tanggal Enam Belas bulan April tahun Dua Ribu Dua Puluh Enam telah dilaksanakan verifikasi terhadap kelengkapan persyaratan pengajuan penyaluran Tunda Salur dana ADD Bulan Desember 2025 yang disampaikan oleh Desa \${desa}, dengan kesimpulan catatan sebagai berikut :
        </p>

        <table style="width:100%;font-family:Arial;font-size:12pt;border-collapse:collapse;margin-bottom:12px;">
          <thead>
            <tr>
              <th style="border:1px solid #000;padding:6px;text-align:center;width:45px;white-space:nowrap;">NO</th>
              <th style="border:1px solid #000;padding:6px;text-align:center;">RINCIAN</th>
              <th style="border:1px solid #000;padding:6px;text-align:center;width:80px;">CHEKLIST/KET</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">1.</td>
              <td style="border:1px solid #000;padding:6px;">Surat Permohonan Kepala Desa</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;"></td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">2.</td>
              <td style="border:1px solid #000;padding:6px;">Foto Copy Buku Bank/ Print Rekening Pemerintah Desa</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;"></td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">3.</td>
              <td style="border:1px solid #000;padding:6px;">Foto Copy NPWP Pemerintah Desa</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;"></td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">4.</td>
              <td style="border:1px solid #000;padding:6px;">Surat Pernyataan TanggungJawab Mutlak Atas Penggunaan Dana kurang bayar ADD Tahun Anggaran 2025</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;"></td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">5.</td>
              <td style="border:1px solid #000;padding:6px;">APBDesa Perubahan Anggaran 2025</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;"></td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">6.</td>
              <td style="border:1px solid #000;padding:6px;">Laporan Realisasi Anggaran Tahun Anggaran 2025</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;"></td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">7.</td>
              <td style="border:1px solid #000;padding:6px;">Laporan Realisasi ADD Tunda Salur Bulan November 2025</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;"></td>
            </tr>
          </tbody>
        </table>

        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:12px;text-indent:40px;line-height:1.5;">
          Hasil verifikasi Kecamatan terhadap kelengkapan persyaratan pengajuan penyaluran Tunda Salur ADD bulan Desember 2025 dalam kondisi lengkap, dan jumlah penggunaan dana yang akan disalurkan sudah sesuai dengan pagu yang tersedia.
        </p>
        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:12px;text-indent:40px;line-height:1.5;">
          Demikian Berita Acara ini dibuat untuk digunakan sebagaimana mestinya.
        </p>
        
        <p style="font-family:Arial;font-size:12pt;margin-bottom:8px;">
          Daftar anggota Tim Verifikasi Kecamatan
        </p>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:24px;border:none;">
          <tr>
            <td style="width:40px;text-align:right;padding-right:10px;">1.</td>
            <td>JUBIR, S.Pd.SD</td>
            <td style="text-align:right;position:relative;">
              ......................................
              \${isSigned ? \`<img src="/ttd-digital.jpeg" style="position:absolute; right:0; top:-20px; width:100px; height:auto; mix-blend-mode:multiply;" />\` : \`\`}
            </td>
          </tr>
          <tr>
            <td style="text-align:right;padding-right:10px;padding-top:20px;">2.</td>
            <td style="padding-top:20px;">ZAKARIA, A.Ma.Pd</td>
            <td style="text-align:right;padding-top:20px;position:relative;">
              ......................................
              \${isSigned ? \`<img src="/ttd-digital.jpeg" style="position:absolute; right:0; top:0px; width:100px; height:auto; mix-blend-mode:multiply;" />\` : \`\`}
            </td>
          </tr>
        </table>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-top:20px;">
          <tr>
            <td style="width:65%;"></td>
            <td style="width:35%;vertical-align:top;">
              <strong>CAMAT TEMIANG PESISIR,</strong><br>
              \${isSigned ? \`<div style="position: absolute; margin: -10px 0 0 -10px;"><img src="/ttd-camat.jpeg" style="width: 170px; height: auto; mix-blend-mode: multiply;" /></div><br><br><br><br><br>\` : \`<br><br><br><br><br>\`}
              <strong><u>HENDRA, S.STP</u></strong><br>
              PEMBINA / IV.a<br>
              NIP. 198507122006021001
            </td>
          </tr>
        </table>
      </div>\`
`;
    lines.splice(start, end - start, newContent);
    fs.writeFileSync('lib/mock-data/generate-surat.ts', lines.join('\n'));
    console.log('Tunda Salur ADD updated');
} else {
    console.log('Block not found');
}
