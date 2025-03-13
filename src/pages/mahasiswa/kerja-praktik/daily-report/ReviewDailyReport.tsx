
// import { X } from "lucide-react";
// import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
// import { ShinyButton } from "@/components/magicui/shiny-button";

// interface TambahAgendaModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//   }

// const DetailAgendaModal = ({ isOpen, onClose, agendaData  }) => {
//   if (!isOpen) return null;

//   // Default data if none is provided
//   const data = agendaData || {
//     id: "1",
//     tanggal: "24 Februari, 2024",
//     agenda: "Kegiatan 1",
//     status: "Tepat Waktu",
//     deskripsi: "Melakukan desain UI/UX untuk aplikasi daily report. Fokus pada tampilan dan pengalaman pengguna yang mudah dipahami.",
//     waktuMulai: "09:00",
//     waktuSelesai: "16:00",
//     dokumen: [
//       {
//         id: 1,
//         nama: "Screenshot_1.jpg",
//         url: "#"
//       },
//       {
//         id: 2,
//         nama: "Desain_UI_Daily_Report.pdf",
//         url: "#"
//       }
//     ],
//     feedback: "Desain sudah baik, perhatikan konsistensi warna dan spacing pada beberapa elemen."
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
//         <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
//           <h2 className="text-xl font-bold">Detail Agenda</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>
        
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Informasi Agenda</h3>
//               <div className="space-y-3">
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Tanggal</p>
//                   <p className="font-medium">{data.tanggal}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Kegiatan</p>
//                   <p className="font-medium">{data.agenda}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
//                   <span className="inline-block px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
//                     {data.status}
//                   </span>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Waktu</p>
//                   <p className="font-medium">{data.waktuMulai} - {data.waktuSelesai}</p>
//                 </div>
//               </div>
//             </div>
            
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Deskripsi Kegiatan</h3>
//               <p className="text-gray-700 dark:text-gray-300">{data.deskripsi}</p>
              
//               <h3 className="text-lg font-semibold mt-6 mb-4">Dokumen Terkait</h3>
//               <div className="space-y-2">
//                 {data.dokumen.map((doc?: any) => (
//                   <div 
//                     key={doc.id} 
//                     className="p-3 border border-gray-200 dark:border-gray-700 rounded-md flex justify-between items-center"
//                   >
//                     <span>{doc.nama}</span>
//                     <AnimatedShinyText className="cursor-pointer flex items-center gap-1 text-sm">
//                       Unduh
//                     </AnimatedShinyText>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
          
//           <div className="mt-8">
//             <h3 className="text-lg font-semibold mb-4">Feedback Pembimbing</h3>
//             <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
//               <p className="text-gray-700 dark:text-gray-300">{data.feedback}</p>
//             </div>
//           </div>
          
//           <div className="mt-8 flex justify-end space-x-3">
//             <button 
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
//             >
//               Tutup
//             </button>
//             <ShinyButton>
//               Edit Agenda
//             </ShinyButton>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DetailAgendaModal;