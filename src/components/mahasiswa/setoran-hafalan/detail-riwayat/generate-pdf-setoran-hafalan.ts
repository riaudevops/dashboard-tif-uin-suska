import uinsuskalogo from "@/assets/uin-suska-logo.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { colourLabelingCategory } from "@/helpers/colour-labeling-category";
interface Setoran {
  id: string;
  tgl_setoran: string;
  tgl_validasi: string;
  dosen: {
    nama: string;
  };
}

interface SurahData {
  nomor: number;
  nama: string;
  label: string;
  sudah_setor: boolean;
  setoran: Setoran[];
}
export const GeneratePDF = ({
  nama,
  nim,
  dataSurah,
  dosen_pa,
  nip_dosen,
}: {
  nama: string;
  nim: string;
  dataSurah: SurahData[];
  dosen_pa: string;
  nip_dosen: string;
}) => {
  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long", // Ubah format bulan menjadi nama bulan
      year: "numeric",
    });
  };
  const doc = new jsPDF({
    encryption: {
      userPermissions: ["print", "modify", "annot-forms"],
    },
  });

  // **1. Tambahkan Header (Kop Surat)**
  const pageWidth = doc.internal.pageSize.width; // Lebar halaman
  const margin = 15; // Margin kiri & kanan
  const lineY = 48; // Posisi garis pemisah pertama
  const sizeLogoUin = 36;
  const textStart = 20; // Posisi awal teks
  const lineSpacing = 6; // Jarak vertikal antar teks
  const pageHeight = doc.internal.pageSize.height;

  // **Tambahkan Logo**
  doc.addImage(uinsuskalogo, "PNG", margin, 10, sizeLogoUin, sizeLogoUin);

  doc.setFont("arial", "bold");
  // **Judul**
  doc.setFontSize(16);
  doc.text(
    "Kartu Setoran Hafalan Juz 30",
    margin + sizeLogoUin + 5,
    textStart,
    {
      align: "left",
    }
  );

  // **Teks Lainnya dengan Jarak Konsisten**
  doc.setFont("arial", "normal");
  doc.setFontSize(14);
  let textY = textStart + lineSpacing; // Posisi awal untuk teks berikutnya

  const texts = [
    "Program Studi Teknik Informatika",
    "Fakultas Sains dan Teknologi",
    "Universitas Islam Negeri Sultan Syarif Kasim Riau",
  ];

  texts.forEach((text) => {
    doc.text(text, margin + sizeLogoUin + 5, textY, { align: "left" });
    textY += lineSpacing; // Tambahkan jarak antar teks
  });

  // **2. Garis Pemisah**
  doc.line(margin, lineY, pageWidth - margin, lineY);

  // **3. Identitas Mahasiswa**
  let textStartY = lineY + 6; // Mulai teks setelah garis pemisah pertama
  const labelX = margin; // Posisi label
  const valueX = margin + 45; // Posisi value agar sejajar

  doc.setFontSize(12);
  doc.setFont("arial", "normal");

  doc.text("Nama", labelX, textStartY);
  doc.text(":", valueX - 1, textStartY);
  doc.text(nama, valueX + 2, textStartY);

  textStartY += 7;
  doc.text("NIM", labelX, textStartY);
  doc.text(":", valueX - 1, textStartY);
  doc.text(nim, valueX + 2, textStartY);

  textStartY += 7;
  doc.text("Pembimbing Akademik", labelX, textStartY);
  doc.text(":", valueX - 1, textStartY);
  doc.text(dosen_pa, valueX + 2, textStartY);

  //4. Tabel Setoran
  const data = dataSurah?.map((surah, index) => {
    return [
      index + 1,
      surah.nama,
      surah.setoran.length > 0 ? formatDate(surah.setoran[0].tgl_setoran) : "-",
      colourLabelingCategory(surah.label)[0],
      surah.setoran.length > 0 ? surah.setoran[0].dosen.nama : "-",
    ];
  });
  autoTable(doc, {
    startY: textStartY + 3,
    head: [
      [
        "No",
        "Surah",
        "Tanggal Setoran",
        "Persyaratan Setoran",
        "Dosen yang Mengesahkan",
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      halign: "center",
      fontStyle: "bold",
    },
    body: data,
    bodyStyles: {
      halign: "center",
      fontStyle: "bold",
      fontSize: 8,
      cellPadding: 0.6,
    },
    styles: { fontSize: 9, cellPadding: 1 },
    didParseCell: function (data) {
      if (data.section === "body" && data.column.index === 3) {
        // Kelompok 1: Baris 1-8
        if (data.row.index === 0) {
          data.cell.rowSpan = 8;
          data.cell.styles.valign = "middle";
        } else if (data.row.index > 0 && data.row.index <= 7) {
          data.cell.text = [];
        }

        // Kelompok 2: Baris 9-16
        else if (data.row.index === 8) {
          data.cell.rowSpan = 8;
          data.cell.styles.valign = "middle";
        } else if (data.row.index > 8 && data.row.index <= 15) {
          data.cell.text = [];
        }

        // Kelompok 3: Baris 17-22
        else if (data.row.index === 16) {
          data.cell.rowSpan = 6;
          data.cell.styles.valign = "middle";
        } else if (data.row.index > 16 && data.row.index <= 21) {
          data.cell.text = [];
        }

        // Kelompok 4: Baris 23-34
        else if (data.row.index === 22) {
          data.cell.rowSpan = 12;
          data.cell.styles.valign = "middle";
        } else if (data.row.index > 22 && data.row.index <= 33) {
          data.cell.text = [];
        }

        // Kelompok 5: Baris 35-37
        else if (data.row.index === 34) {
          data.cell.rowSpan = 3;
          data.cell.styles.valign = "middle";
        } else if (data.row.index > 34 && data.row.index <= 36) {
          data.cell.text = [];
        }
      }
      if (data.row.index === 7) {
        // Baris terakhir kelompok 1
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(4);
        doc.line(
          data.cell.x,
          data.cell.y + data.cell.height, // Garis di bawah sel
          data.cell.x + data.cell.width,
          data.cell.y + data.cell.height
        );
      }
    },
  });
  // template tanda tangan di sebelah kanan dan nama dosen dan kota dan juga tanggal
  const offsetX = 55; // Geser ke kanan sejauh 20px
  const finalY = pageHeight - 48; // Posisikan tanda tangan 50px dari bawah
  const textX = pageWidth / 2 + offsetX; // Pusat halaman + offset ke kanan

  // Tambahkan teks kota dan tanggal di tengah bawah
  doc.text(
    "Pekanbaru, " +
      new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    textX,
    finalY,
    { align: "center" } // Pastikan teks tetap sejajar
  );

  // Tambahkan teks "Pembimbing Akademik,"
  doc.text("Pembimbing Akademik,", textX, finalY + 6, { align: "center" });

  // Tambahkan nama dosen setelah tanda tangan
  doc.text(dosen_pa, textX, finalY + 26, { align: "center" });

  // Tambahkan garis bawah nama dosen
  const textWidth = doc.getTextWidth("NIP. " +nip_dosen); // Lebar teks
  doc.line(
    textX - textWidth / 2,
    finalY + 27,
    textX + textWidth / 2,
    finalY + 27
  );

  // Tambahkan teks "NIP"
  doc.text("NIP. " + nip_dosen, textX, finalY + 32, { align: "center" });

  // Tambahkan nip dosen setelah tanda tangan (di tengah garis)'

  doc.save(`Kartu Setoran Hafalan-${nama}.pdf`);
};
