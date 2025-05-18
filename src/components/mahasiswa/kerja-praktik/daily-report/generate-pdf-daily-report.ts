// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// // @ts-ignore
// import { GeistSansBold, GeistSansRegular } from "./jsPDFCustomFont";

// interface IEvaluasiDailyReport {
//   dailyReportId?: string;
//   nip: string;
//   komentar: string;
//   status: string;
// }

// interface IAgenda {
//   waktuMulai: string;
//   waktuSelesai: string;
//   judulAgenda: string;
//   deskripsiAgenda: string;
//   files: string[];
// }

// interface IDailyReport {
//   _id: string;
//   tanggal: Date | string;
//   agenda?: IAgenda[];
// }

// interface IMahasiswa {
//   _id: string;
//   email: string;
//   nim: string;
//   nama: string;
//   judulKP: string;
//   instansi: string;
//   pembimbingInstansi: string;
//   dosenPembimbing: string;
//   mulaiKP: string;
//   selesaiKP: string;
//   reports: IDailyReport[];
// }

// interface CetakLaporanKPProps {
//   mahasiswaData: IMahasiswa;
//   evaluasiData: IEvaluasiDailyReport[];
// }

// const PDF_CONFIG = {
//   margin: 15,
//   lineY: 45,
//   sizeLogo: 32,
//   textStart: 20,
//   lineSpacing: 6,
//   fontSize: {
//     header: 16,
//     subHeader: 14,
//     body: 12,
//   },
// } as const;

// /**
//  * Format date to Indonesian format
//  */
// const formatDate = (dateString: string) => {
//   try {
//     return new Date(dateString).toLocaleDateString("id-ID", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });
//   } catch (error) {
//     console.error("Error formatting date:", error);
//     return dateString;
//   }
// };

// /**
//  * Add document header
//  */
// const addHeader = (doc: jsPDF) => {
//   try {
//     const { textStart } = PDF_CONFIG;

//     doc.setFont("Geist-Bold", "bold");
//     doc.setFontSize(PDF_CONFIG.fontSize.header);
//     doc.text("DAILY REPORT KERJA PRAKTIK MAHASISWA", doc.internal.pageSize.width / 2, textStart, { align: "center" });

//     doc.setFontSize(PDF_CONFIG.fontSize.header);
//     doc.text("PROGRAM STUDI TEKNIK INFORMATIKA", doc.internal.pageSize.width / 2, textStart + 8, { align: "center" });
//   } catch (error) {
//     console.error("Error adding header:", error);
//   }
// };

// /**
//  * Add KP title section
//  */
// const addJudulKP = (doc: jsPDF, judulKP: string) => {
//   try {
//     const { margin } = PDF_CONFIG;
//     const startY = 50;

//     doc.setFont("Geist-Bold", "bold");
//     doc.setFontSize(PDF_CONFIG.fontSize.body);
//     doc.text("JUDUL KP", margin, startY);

//     // Create box for KP title
//     doc.setDrawColor(0);
//     doc.setLineWidth(0.5);
//     doc.rect(margin, startY + 2, doc.internal.pageSize.width - (margin * 2), 12);
    
//     doc.setFont("Geist-Regular", "regular");
//     // Break long title into multiple lines if needed
//     const titleLines = doc.splitTextToSize(judulKP, doc.internal.pageSize.width - (margin * 2) - 4);
//     doc.text(titleLines, margin + 2, startY + 9);

//     return startY + 20; // Return next Y position
//   } catch (error) {
//     console.error("Error adding judul KP:", error);
//     return 70; // Fallback value
//   }
// };

// /**
//  * Add student information section
//  */
// const addMahasiswaInfo = (doc: jsPDF, mahasiswaData: IMahasiswa) => {
//   try {
//     const { margin } = PDF_CONFIG;
//     const startY = 70;
//     const width = (doc.internal.pageSize.width - (margin * 2)) / 3;
//     const height = 12;

//     // First row (3 columns)
//     // Student Name
//     doc.setFont("Geist-Bold", "bold");
//     doc.text("NAMA MAHASISWA", margin, startY);
//     doc.setDrawColor(0);
//     doc.setLineWidth(0.5);
//     doc.rect(margin, startY + 2, width, height);
//     doc.setFont("Geist-Regular", "regular");
//     doc.text(mahasiswaData.nama, margin + 2, startY + 9);

//     // NIM
//     doc.setFont("Geist-Bold", "bold");
//     doc.text("NIM", margin + width + 5, startY);
//     doc.rect(margin + width + 5, startY + 2, width - 5, height);
//     doc.setFont("Geist-Regular", "regular");
//     doc.text(mahasiswaData.nim, margin + width + 7, startY + 9);

//     // KP Start Date
//     doc.setFont("Geist-Bold", "bold");
//     doc.text("TGL MULAI KP", margin + (width * 2), startY);
//     doc.rect(margin + (width * 2), startY + 2, width, height);
//     doc.setFont("Geist-Regular", "regular");
//     doc.text(formatDate(mahasiswaData.mulaiKP), margin + (width * 2) + 2, startY + 9);

//     // Second row (2 columns)
//     const startY2 = startY + 20;
//     const width2 = (doc.internal.pageSize.width - (margin * 2)) / 2;

//     // Faculty Supervisor
//     doc.setFont("Geist-Bold", "bold");
//     doc.text("DOSEN PEMBIMBING KP", margin, startY2);
//     doc.rect(margin, startY2 + 2, width2, height);
//     doc.setFont("Geist-Regular", "regular");
//     doc.text(mahasiswaData.dosenPembimbing, margin + 2, startY2 + 9);

//     // Institution Supervisor
//     doc.setFont("Geist-Bold", "bold");
//     doc.text("PEMBIMBING INSTANSI", margin + width2 + 5, startY2);
//     doc.rect(margin + width2 + 5, startY2 + 2, width2 - 5, height);
//     doc.setFont("Geist-Regular", "regular");
//     doc.text(mahasiswaData.pembimbingInstansi, margin + width2 + 7, startY2 + 9);

//     // Add institution name (missing in original code)
//     const startY3 = startY2 + 20;
//     doc.setFont("Geist-Bold", "bold");
//     doc.text("INSTANSI KP", margin, startY3);
//     doc.rect(margin, startY3 + 2, doc.internal.pageSize.width - (margin * 2), height);
//     doc.setFont("Geist-Regular", "regular");
//     doc.text(mahasiswaData.instansi, margin + 2, startY3 + 9);

//     return startY3 + 20; // Return next Y position
//   } catch (error) {
//     console.error("Error adding mahasiswa info:", error);
//     return 110; // Fallback value
//   }
// };

// /**
//  * Add daily report table
//  */
// const addDailyReportTable = (doc: jsPDF, mahasiswaData: IMahasiswa, evaluasiData: IEvaluasiDailyReport[]) => {
//   try {
//     // Track the final Y position
//     let finalY = 200; // Default value
    
//     const mergedData = mahasiswaData.reports
//       .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())
//       .map((report) => {
//         const matchingEvaluasi = evaluasiData.find(
//           (evaluasi) => evaluasi.dailyReportId === report._id
//         );

//         let tanggal;
//         try {
//           tanggal = new Date(report.tanggal).toLocaleDateString("id-ID", {
//             weekday: "long",
//             day: "numeric",
//             month: "long",
//             year: "numeric",
//           });
//         } catch (e) {
//           tanggal = String(report.tanggal);
//         }

//         // Format agenda for display in table
//         const agendaText = report.agenda?.map((ag) => {
//           return `${ag.judulAgenda}\n${ag.waktuMulai} - ${ag.waktuSelesai}\n${ag.deskripsiAgenda}`;
//         }).join("\n\n") || "Tidak ada agenda";

//         // Text for documentation
//         const dokumentasiText = report.agenda?.some(ag => ag.files && ag.files.length > 0) 
//           ? "Lihat lampiran dokumentasi" 
//           : "Tidak ada dokumentasi";

//         return [
//           tanggal,
//           agendaText,
//           dokumentasiText,
//           matchingEvaluasi?.komentar || "Tidak Ada Evaluasi"
//         ];
//       });

//     autoTable(doc, {
//       startY: 130, // Adjusted for the added institution field
//       head: [["TANGGAL", "KEGIATAN", "DOKUMENTASI", "CATATAN EVALUASI"]],
//       body: mergedData,
//       theme: "grid", 
//       headStyles: {
//         fillColor: [220, 220, 220],
//         textColor: [0, 0, 0],
//         halign: "center",
//         fontStyle: "bold",
//         font: "Geist-Bold"
//       },
//       columnStyles: {
//         0: { cellWidth: 50 },
//         1: { cellWidth: 'auto' },
//         2: { cellWidth: 40 },
//         3: { cellWidth: 50 }
//       },
//       styles: {
//         font: "Geist-Regular",
//         cellPadding: 4,
//         lineWidth: 0.5,
//         overflow: 'linebreak',
//       },
//       bodyStyles: {
//         valign: 'top'
//       },
//       didDrawPage: (data) => {
//         // Add header on each page
//         if (data.pageNumber > 1) {
//           addHeader(doc);
//           doc.setFont("Geist-Regular", "regular");
//           doc.setFontSize(10);
//           doc.text(`Daily Report KP - ${mahasiswaData.nama} (${mahasiswaData.nim})`, PDF_CONFIG.margin, 40);
//         }
//       },
//       // Track the final Y position directly
//       didDrawCell: function(data) {
//         if (data.row.index === data.table.body.length - 1) {
//           finalY = data.cell.y + 5; // Add some padding
//         }
//       },
//       // Handle empty data case
//       didParseCell: function(data) {
//         if (mergedData.length === 0 && data.section === 'body') {
//           doc.setFont("Geist-Regular", "regular");
//           doc.setFontSize(12);
//           doc.text("Tidak ada data laporan harian", 
//             doc.internal.pageSize.width / 2, 150, { align: "center" });
//         }
//       }
//     });

//     // Return Y position after table
//     return finalY;
//   } catch (error) {
//     console.error("Error adding daily report table:", error);
//     return 200; // Fallback value
//   }
// };

// /**
//  * Add conclusion section
//  */
// const addKesimpulan = (doc: jsPDF, nextY: number) => {
//   try {
//     const { margin } = PDF_CONFIG;
    
//     doc.setFont("Geist-Bold", "bold");
//     doc.setFontSize(PDF_CONFIG.fontSize.body);
//     doc.text("KESIMPULAN KEGIATAN KERJA PRAKTIK:", margin, nextY + 10);

//     // Create box for conclusion
//     doc.setDrawColor(0);
//     doc.setLineWidth(0.5);
//     doc.rect(margin, nextY + 12, doc.internal.pageSize.width - (margin * 2), 50);

//     // Text under the conclusion box
//     doc.setFont("Geist-Regular", "regular");
//     doc.setFontSize(10);
//     const text = "Berdasarkan daily report dan kesimpulan kegiatan KP yang telah selesai dilaksanakan oleh mahasiswa, maka yang bersangkutan dinyatakan telah selesai melaksanakan KP dan mendapatkan persetujuan untuk mendaftar Diseminasi KP.";
    
//     const textLines = doc.splitTextToSize(text, doc.internal.pageSize.width - (margin * 2));
//     doc.text(textLines, margin, nextY + 70);

//     return nextY + 80;
//   } catch (error) {
//     console.error("Error adding kesimpulan:", error);
//     return nextY + 80; // Fallback value
//   }
// };

// /**
//  * Add signature section
//  */
// const addSignatures = (doc: jsPDF, mahasiswaData: IMahasiswa, nextY: number) => {
//   try {
//     const { margin } = PDF_CONFIG;
//     const width = doc.internal.pageSize.width;
//     const halfWidth = width / 2;

//     // Get current date in Indonesian format
//     const currentDate = new Date().toLocaleDateString("id-ID", {
//       day: "numeric",
//       month: "long",
//       year: "numeric", // Changed to include year
//     });

//     // Left column: Institution Supervisor
//     doc.setFont("Geist-Regular", "regular");
//     doc.text("Mengetahui,", margin, nextY);
//     doc.text("Pembimbing Instansi KP", margin, nextY + 6);
    
//     // Add signature line
//     doc.setDrawColor(0);
//     doc.setLineWidth(0.5);
//     doc.line(margin, nextY + 30, margin + 60, nextY + 30);
    
//     doc.text(mahasiswaData.pembimbingInstansi, margin, nextY + 36);
//     doc.text("NIP. _______________", margin, nextY + 42); // Added blank for NIP

//     // Right column: Student
//     doc.text(`Pekanbaru, ${currentDate}`, halfWidth + 20, nextY);
//     doc.text("Mahasiswa yang bersangkutan,", halfWidth + 20, nextY + 6);  
    
//     // Add signature line
//     doc.line(halfWidth + 20, nextY + 30, halfWidth + 80, nextY + 30);
    
//     doc.text(mahasiswaData.nama, halfWidth + 20, nextY + 36);
//     doc.text(`NIM. ${mahasiswaData.nim}`, halfWidth + 20, nextY + 42);

//     // Faculty Supervisor (center bottom)
//     doc.text("Dosen Pembimbing", width / 2 - 20, nextY + 60);
    
//     // Add signature line
//     doc.line(width / 2 - 20, nextY + 84, width / 2 + 40, nextY + 84);
    
//     doc.text(mahasiswaData.dosenPembimbing, width / 2 - 20, nextY + 90);
//     doc.text("NIP. _______________", width / 2 - 20, nextY + 96); // Added blank for NIP

//     return nextY + 100;
//   } catch (error) {
//     console.error("Error adding signatures:", error);
//     return nextY + 100; // Fallback value
//   }
// };

// /**
//  * Main function to generate PDF report
//  */
// export const GenerateDailyReportPDF = (props: CetakLaporanKPProps) => {
//   try {
//     const { mahasiswaData, evaluasiData } = props;
    
//     if (!mahasiswaData) {
//       console.error("Missing mahasiswa data");
//       return;
//     }
    
//     // Create new PDF document
//     const doc = new jsPDF({
//       orientation: "portrait",
//       unit: "mm",
//       format: "a4",
//     });

//     // Add fonts
//     try {
//       doc.addFileToVFS("Geist-Bold.ttf", GeistSansBold);
//       doc.addFileToVFS("Geist-Regular.ttf", GeistSansRegular);
//       doc.addFont("Geist-Bold.ttf", "Geist-Bold", "bold");
//       doc.addFont("Geist-Regular.ttf", "Geist-Regular", "regular");
//     } catch (e) {
//       console.error("Error loading fonts:", e);
//     }

//     // Add document elements
//     addHeader(doc);
//     const judulY = addJudulKP(doc, mahasiswaData.judulKP);
//     const infoY = addMahasiswaInfo(doc, mahasiswaData);
//     const tableEndY = addDailyReportTable(doc, mahasiswaData, evaluasiData || []);
    
//     // Add new page if little space remains
//     if (tableEndY > doc.internal.pageSize.height - 100) {   
//       doc.addPage();
//       const kesimpulanY = addKesimpulan(doc, 20);
//       addSignatures(doc, mahasiswaData, kesimpulanY);
//     } else {
//       const kesimpulanY = addKesimpulan(doc, tableEndY);
//       addSignatures(doc, mahasiswaData, kesimpulanY);
//     }

//     // Save PDF with proper filename
//     const safeFilename = mahasiswaData.nama.replace(/[^a-z0-9]/gi, '_');
//     doc.save(`Daily_Report_KP_${safeFilename}_${mahasiswaData.nim}.pdf`);
    
//     return doc; // Return doc object for testing or further processing
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.error("Error generating PDF:", error);
//       throw new Error(`Failed to generate PDF: ${error.message}`);
//     } else {
//       console.error("An unknown error occurred:", error);
//       throw new Error("An unknown error occurred");
//     }
//   }
// };

// // Example usage:
// // import { GenerateDailyReportPDF } from './GenerateDailyReportPDF';
// //
// // const handleGeneratePDF = () => {
// //   try {
// //     const mahasiswaData = {
// //       _id: "123456",
// //       email: "student@example.com",
// //       nim: "12345678",
// //       nama: "Nama Mahasiswa",
// //       judulKP: "Judul Kerja Praktik",
// //       instansi: "Nama Instansi",
// //       pembimbingInstansi: "Nama Pembimbing Instansi",
// //       dosenPembimbing: "Nama Dosen Pembimbing",
// //       mulaiKP: "2025-01-01",
// //       selesaiKP: "2025-03-31",
// //       reports: [
// //         {
// //           _id: "report1",
// //           tanggal: "2025-01-15",
// //           agenda: [
// //             {
// //               waktuMulai: "08:00",
// //               waktuSelesai: "12:00",
// //               judulAgenda: "Orientasi",
// //               deskripsiAgenda: "Mengikuti orientasi di instansi",
// //               files: []
// //             }
// //           ]
// //         }
// //       ]
// //     };
// //
// //     const evaluasiData = [
// //       {
// //         dailyReportId: "report1",
// //         nip: "987654321",
// //         komentar: "Bagus, lanjutkan",
// //         status: "approved"
// //       }
// //     ];
// //
// //     GenerateDailyReportPDF({
// //       mahasiswaData: mahasiswaData,
// //       evaluasiData: evaluasiData
// //     });
// //   } catch (error) {
// //     console.error("Failed to generate PDF:", error);
// //   }
// // };