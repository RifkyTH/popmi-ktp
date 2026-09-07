const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

const replacement = `
        <div style="margin-top:20px;font-family:Arial;font-size:12pt;">
          <p>Tembusan:</p>
          <ol style="margin-left:20px;margin-top:4px;">
            <li>Yth. Kepala Badan Pengelolaan Keuangan dan Aset Daerah Kabupaten Lingga di Daik Lingga;</li>
            <li>Yth. Inspektur Kabupaten Lingga di Daik Lingga.</li>
          </ol>
        </div>
      </div>

      <!-- PAGE 2 -->
      <div class="print-page" style="\\$\\{base\\};page-break-before:always;">
        \\$\\{kopSurat()\\}

        <div style="text-align:center;font-family:Arial;font-size:12pt;font-weight:bold;margin:12px 0 16px 0;">
          Berita Acara Hasil Verifikasi Kecamatan
        </div>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:12px;border:none;">
          <tr><td style="width:120px;">Desa</td><td>: \\$\\{desa\\}</td></tr>
          <tr><td>Kecamatan</td><td>: Temiang Pesisir</td></tr>
        </table>

        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:10px;text-indent:40px;line-height:1.5;">
          Pada Hari ini Senin Tanggal Dua Puluh Dua Bulan Juni Tahun Dua Ribu Dua Puluh Enam, (2026) telah dilaksanakan verifikasi terhadap kelengkapan persyaratan pengajuan penyaluran dana DD TAHAP II yang disampaikan oleh Desa \\$\\{desa\\} dengan catatan kesimpulan sebagai berikut:
        </p>

        <table style="width:100%;font-family:Arial;font-size:12pt;border-collapse:collapse;margin-bottom:12px;">
          <thead>
            <tr>
              <th style="border:1px solid #000;padding:6px;text-align:center;width:30px;">No</th>
              <th style="border:1px solid #000;padding:6px;text-align:center;">Rincian</th>
              <th style="border:1px solid #000;padding:6px;text-align:center;width:150px;">CHEKLIST/KET</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">a.</td>
              <td style="border:1px solid #000;padding:6px;">Surat Permohonan Pencairan Dana dari Kepala Desa</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;"></td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">b.</td>
              <td style="border:1px solid #000;padding:6px;">Surat Kelengkapan Persyaratan Penyaluran Dari Camat</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;"></td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">c.</td>
              <td style="border:1px solid #000;padding:6px;">Laporan Realisasi DD Tahap I Tahun 2026</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;"></td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">d.</td>
              <td style="border:1px solid #000;padding:6px;">Laporan Realisasi Taging DD Tahap I Tahun 2026</td>
              <td style="border:1px solid #000;padding:6px;text-align:center;"></td>
            </tr>
          </tbody>
        </table>

        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:12px;text-indent:40px;line-height:1.5;">
          Hasil verifikasi kecamatan terhadap kelengkapan persyaratan pengajuan penyaluran DD TAHAP II dalam kondisi lengkap, dan jumlah penggunaan dana yang akan disalurkan sudah sesuai dengan pagu yang tersedia.
        </p>
        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:24px;">
          Demikian Berita Acara ini dibuat untuk digunakan sebagaimana mestinya.
        </p>

        <table style="width:100%;font-family:Arial;font-size:12pt;border-collapse:collapse;">
          <tr>
            <td style="width:58%;vertical-align:top;">
              <table style="width:100%;font-family:Arial;font-size:12pt;border-collapse:collapse;">
                <thead>
                  <tr>
                    <th style="border:1px solid #000;padding:6px;text-align:center;width:30px;">No</th>
                    <th style="border:1px solid #000;padding:6px;text-align:center;">NAMA ANGGOTA TIM VERIFIKASI KECAMATAN</th>
                    <th style="border:1px solid #000;padding:6px;text-align:center;width:120px;">TANDA TANGAN</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="border:1px solid #000;padding:6px;text-align:center;">1</td>
                    <td style="border:1px solid #000;padding:6px;">JUBIR, S.Pd.SD</td>
                    <td style="border:1px solid #000;padding:6px;height:50px;"></td>
                  </tr>
                  <tr>
                    <td style="border:1px solid #000;padding:6px;text-align:center;">2</td>
                    <td style="border:1px solid #000;padding:6px;">ZAKARIA, A.Ma.Pd</td>
                    <td style="border:1px solid #000;padding:6px;height:50px;"></td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td style="width:42%;vertical-align:top;padding-left:16px;">
              <div style="text-align:center;margin-top:24px;">
                <strong>CAMAT TEMIANG PESISIR</strong><br>
                \\$\\{isSigned ? \`<div style="margin: 4px 0;"><img src="/ttd-camat.jpeg" style="width: 130px; height: auto; mix-blend-mode: multiply; transform: rotate(-5deg);" /></div>\` : \`<br><br><br><br><br><br>\`\\}
                <strong><u>HENDRA, S.STP</u></strong><br>
                Penata TK.I<br>
                NIP. 198507122006021001
              </div>
            </td>
          </tr>
        </table>
      </div>\`

    // ── 5. REKOMENDASI ADD`;

const search = `        \\$\\{ttdCamat(tanggal, isSigned)\\}
      </div>\`

    // ── 5. REKOMENDASI ADD`;

const finalReplace = `        \\$\\{ttdCamat(tanggal, isSigned)\\}` + replacement;

// string literal exact replace
content = content.split(search.replace(/\\\\\\$/g, '$').replace(/\\\\\\{/g, '{').replace(/\\\\\\}/g, '}')).join(finalReplace.replace(/\\\\\\$/g, '$').replace(/\\\\\\{/g, '{').replace(/\\\\\\}/g, '}'));
fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
console.log("Updated");
