const fs = require('fs');
let content = fs.readFileSync('lib/mock-data/generate-surat.ts', 'utf8');

// Replace the hardcoded ahli_waris template data with dynamic form data
const oldTemplate = `    case "ahli_waris": {
      const f = surat.data_form || {}
      return \`
      <div class="print-page" style="\${base}">
        \${kopSurat()}
        <div style="text-align:center; font-family:Arial; font-size:12pt; margin-bottom:16px;">
          <strong><u>SURAT KETERANGAN AHLI WARIS</u></strong><br>
          Nomor : \${surat.nomor}
        </div>

        <p style="font-family:Arial;font-size:12pt;margin-bottom:4px;">Yang bertanda tangan di bawah ini, Kecamatan Temiang Pesisir Kabupaten Lingga.</p>
        <p style="font-family:Arial;font-size:12pt;margin-bottom:8px;">Dengan ini menerangkan bahwa :</p>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:16px;border:none;">
          \${fieldRow("Nama", surat.pemohon, "150px")}
          \${fieldRow("NIK", "2104031501710001", "150px")}
          \${fieldRow("Tempat/ Tgl.Lahir", "Pulau Duyung, 18 Januari 1971", "150px")}
          \${fieldRow("Jenis Kelamin", "Laki-Laki", "150px")}
          \${fieldRow("Agama", "Islam", "150px")}
          \${fieldRow("Pekerjaan", "Pegawai Negeri Sipil (PNS)", "150px")}
          \${fieldRow("Alamat", "Tekoli, RT 06/RW 03 Desa Pulau Batang", "150px")}
        </table>

        <p style="font-family:Arial;font-size:12pt;margin-bottom:8px;">Bahwa yang tersebut namanya di atas adalah Ahli waris dari :</p>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:16px;border:none;">
          \${fieldRow("Nama", "SURIANA", "150px")}
          \${fieldRow("NIK", "2104034406690001", "150px")}
          \${fieldRow("Tempat/ Tgl.Lahir", "Tekoli, 04 Juni 1969", "150px")}
          \${fieldRow("Jenis Kelamin", "Perempuan", "150px")}
          \${fieldRow("Agama", "Islam", "150px")}
          \${fieldRow("Pekerjaan", "Pegawai Negeri Sipil (PNS)", "150px")}
          \${fieldRow("Alamat", "Tekoli, RT 06/RW 03 Desa Tajur Biru", "150px")}
        </table>

        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:4px;text-indent:40px;line-height:1.2;">
          Bahwa Ahli Waris tersebut diatas adalah benar-benar Ahli Waris dari Almarhumah SURIANA dan kami bertanggung jawab atas kebenaran dari pernyataan ini.
        </p>
        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:16px;text-indent:40px;line-height:1.2;">
          Demikian surat Keterangan Ahli Waris ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
        </p>`;

const newTemplate = `    case "ahli_waris": {
      const f = surat.data_form || {}
      const pemohonNama = (f.pemohon || surat.pemohon || "").toUpperCase()
      const pewaris = (f.pewaris || "").toUpperCase()
      return \`
      <div class="print-page" style="\${base}">
        \${kopSurat()}
        <div style="text-align:center; font-family:Arial; font-size:12pt; margin-bottom:16px;">
          <strong><u>SURAT KETERANGAN AHLI WARIS</u></strong><br>
          Nomor : \${surat.nomor}
        </div>

        <p style="font-family:Arial;font-size:12pt;margin-bottom:4px;">Yang bertanda tangan di bawah ini, Kecamatan Temiang Pesisir Kabupaten Lingga.</p>
        <p style="font-family:Arial;font-size:12pt;margin-bottom:8px;">Dengan ini menerangkan bahwa :</p>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:16px;border:none;">
          \${fieldRow("Nama", pemohonNama, "150px")}
          \${fieldRow("NIK", f.nikPemohon || "", "150px")}
          \${fieldRow("Tempat/ Tgl.Lahir", f.ttlPemohon || "", "150px")}
          \${fieldRow("Jenis Kelamin", f.jkPemohon || "", "150px")}
          \${fieldRow("Agama", f.agamaPemohon || "", "150px")}
          \${fieldRow("Pekerjaan", f.pekerjaanPemohon || "", "150px")}
          \${fieldRow("Alamat", f.alamatPemohon || "", "150px")}
        </table>

        <p style="font-family:Arial;font-size:12pt;margin-bottom:8px;">Bahwa yang tersebut namanya di atas adalah Ahli waris dari :</p>

        <table style="width:100%;font-family:Arial;font-size:12pt;margin-bottom:16px;border:none;">
          \${fieldRow("Nama", pewaris, "150px")}
          \${fieldRow("NIK", f.nikPewaris || "", "150px")}
          \${fieldRow("Tempat/ Tgl.Lahir", f.ttlPewaris || "", "150px")}
          \${fieldRow("Jenis Kelamin", f.jkPewaris || "", "150px")}
          \${fieldRow("Agama", f.agamaPewaris || "", "150px")}
          \${fieldRow("Pekerjaan", f.pekerjaanPewaris || "", "150px")}
          \${fieldRow("Alamat", f.alamatPewaris || "", "150px")}
        </table>

        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:4px;text-indent:40px;line-height:1.2;">
          Bahwa Ahli Waris tersebut diatas adalah benar-benar Ahli Waris dari \${f.hubungan === "Suami" || f.hubungan === "Anak Kandung" ? "Almarhum" : "Almarhumah"} \${pewaris} dan kami bertanggung jawab atas kebenaran dari pernyataan ini.
        </p>
        <p style="font-family:Arial;font-size:12pt;text-align:justify;margin-bottom:16px;text-indent:40px;line-height:1.2;">
          Demikian surat Keterangan Ahli Waris ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
        </p>`;

if (content.includes(oldTemplate)) {
    content = content.split(oldTemplate).join(newTemplate);
    fs.writeFileSync('lib/mock-data/generate-surat.ts', content);
    console.log('Template ahli_waris berhasil diupdate');
} else {
    console.log('Search string not found');
}
