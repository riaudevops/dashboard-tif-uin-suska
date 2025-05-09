import uinsuskalogo from "@/assets/uin_suska_logo.jpg";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { colourLabelingCategory } from "@/helpers/colour-labeling-category";
import { GeistSansBold, GeistSansRegular } from "./jsPDFCustomFont";
import { PDFGeneratorProps } from "@/interfaces/components/mahasiswa/setoran-hafalan/generate-pdf-setoran-hafalan.interface";
const PDF_CONFIG = {
  margin: 15,
  lineY: 45,
  sizeLogoUin: 32,
  textStart: 20,
  lineSpacing: 6,
  fontSize: {
    header: 16,
    subHeader: 14,
    body: 12,
  },
} as const;
const formatDate = (isoDate: string) => {
  return new Date(isoDate)
    .toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long", // Ubah format bulan menjadi nama bulan
      year: "numeric",
    })
    .replace(/^(\d+)\s(\w+)\s(\d+)$/, "$1 $2, $3");
};
// Separate components for different sections
const addHeader = (doc: jsPDF) => {
  const { margin, sizeLogoUin, textStart, lineSpacing } = PDF_CONFIG;

  doc.addImage(uinsuskalogo, "PNG", margin, 10, sizeLogoUin, sizeLogoUin);

  doc.setFont("Geist-Bold", "bold");
  doc.setFontSize(PDF_CONFIG.fontSize.header);
  doc.text("KARTU MUROJA'AH JUZ 30", margin + sizeLogoUin + 5, textStart);

  doc.setFont("Geist-Regular", "regular");
  doc.setFontSize(PDF_CONFIG.fontSize.subHeader);

  const texts = [
    "PROGRAM STUDI TEKNIK INFORMATIKA",
    "FAKULTAS SAINS DAN TEKNOLOGI",
    "UNIVERSITAS ISLAM NEGERI SULTAN SYARIF KASIM RIAU",
  ];

  texts.forEach((text, index) => {
    doc.text(
      text,
      margin + sizeLogoUin + 5,
      textStart + lineSpacing * (index + 1)
    );
  });
};
const addStudentInfo = (
  doc: jsPDF,
  { nama, nim, dosen_pa }: PDFGeneratorProps
) => {
  const { margin, lineY } = PDF_CONFIG;
  const labelX = margin;
  const valueX = margin + 50;
  const textStartY = lineY + 8;

  doc.setFontSize(PDF_CONFIG.fontSize.body);

  const info = [
    { label: "Nama", value: nama },
    { label: "NIM", value: nim },
    { label: "Pembimbing Akademik", value: dosen_pa },
  ];

  info.forEach((item, index) => {
    const y = textStartY + index * 7;
    doc.text(item.label, labelX, y);
    doc.text(":", valueX - 1, y);
    doc.text(item.value, valueX + 2, y);
  });

  return textStartY + info.length * 7;
};

const addSignature = (
  doc: jsPDF,
  { dosen_pa, nip_dosen }: PDFGeneratorProps
) => {
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;

  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Set posisi awal blok tanda tangan dari tengah halaman
  const startX = pageWidth / 2 + 33; // Mulai dari tengah + offset
  const finalY = pageHeight - 46;

  // Render teks tanpa alignment right
  doc.text(`Pekanbaru, ${currentDate}`, startX, finalY);
  doc.text("Pembimbing Akademik,", startX, finalY + 6);
  doc.text(dosen_pa, startX, finalY + 26);

  // Buat garis yang sesuai dengan lebar nama
  const nameWidth = doc.getTextWidth(dosen_pa);
  doc.line(
    startX, // Mulai dari posisi teks
    finalY + 27,
    startX + nameWidth, // Sampai akhir lebar nama
    finalY + 27
  );

  // Tambah NIP
  doc.text(`NIP. ${nip_dosen}`, startX, finalY + 32);
};
export const GeneratePDF = ({ props }: { props: PDFGeneratorProps }) => {
  const doc = new jsPDF({
    encryption: {
      // userPassword: nim,
      userPermissions: ["print", "modify", "annot-forms"],
    },
  });

  doc.addFileToVFS("Geist-Bold.ttf", GeistSansBold);
  doc.addFileToVFS("Geist-Regular.ttf", GeistSansRegular);
  doc.addFont("Geist-Bold.ttf", "Geist-Bold", "bold");
  doc.addFont("Geist-Regular.ttf", "Geist-Regular", "regular");

  addHeader(doc);
  doc.line(
    PDF_CONFIG.margin,
    PDF_CONFIG.lineY,
    doc.internal.pageSize.width - PDF_CONFIG.margin,
    PDF_CONFIG.lineY
  );

  const tableStartY = addStudentInfo(doc, props);
  const tableData = props.dataSurah.map((surah, index) => [
    `${index + 1}.`,
    surah.nama,
    surah.sudah_setor ? formatDate(surah.info_setoran.tgl_setoran) : "-",
    colourLabelingCategory(surah.label)[0],
    surah.sudah_setor ? surah.info_setoran.dosen_yang_mengesahkan.nama : "-",
  ]);

  doc.setFont("Geist-Regular", "regular");
  autoTable(doc, {
    startY: tableStartY - 2,
    head: [
      [
        "No.",
        "Surah",
        "Tanggal Muroja'ah",
        "Persyaratan Muroja'ah",
        "Dosen yang Mengesahkan",
      ],
    ],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      halign: "center",
      fontStyle: "bold",
      font: "Geist-Bold",
    },
    bodyStyles: {
      halign: "center",
      fontStyle: "bold",
      fontSize: 8,
      cellPadding: 0.6,
    },
    styles: {
      fontSize: 9,
      cellPadding: 1,
      font: "Geist-Regular",
      textColor: [0, 0, 0],
    },
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

  addSignature(doc, props);

  // Tambahkan nip dosen setelah tanda tangan (di tengah garis)'

  doc.save(`[Kartu Muroja'ah] ${props.nama}.pdf`);
};
