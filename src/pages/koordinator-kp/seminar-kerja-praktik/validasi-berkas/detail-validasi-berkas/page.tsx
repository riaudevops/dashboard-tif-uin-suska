// import { type FC, useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import {
//   Check,
//   X,
//   Eye,
//   User,
//   Award,
//   Building,
//   GraduationCap,
//   FileText,
//   Calendar,
//   Clock,
//   MapPin,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "@/hooks/use-toast";
// import APISeminarKP from "@/services/api/koordinator-kp/mahasiswa.service";
// import DashboardLayout from "@/components/globals/layouts/dashboard-layout";

// interface Dokumen {
//   id: string;
//   jenis_dokumen: string;
//   link_path: string;
//   tanggal_upload: string;
//   status: string;
//   komentar: string | null;
//   id_pendaftaran_kp: string;
// }

// interface DokumenStep {
//   step1: Dokumen[];
//   step2: Dokumen[];
//   step3: Dokumen[];
//   step5: Dokumen[];
// }

// interface Student {
//   id: number;
//   nim: string;
//   name: string;
//   status: string;
//   timeAgo: string;
//   stage: Stage;
//   semester: number;
//   dosenPembimbing: string;
//   dosenPenguji: string;
//   pembimbingInstansi: string;
//   nilaiInstansi: string;
//   dokumen?: DokumenStep;
// }

// type Stage = "step1" | "step2" | "step3" | "step5";

// interface DocumentState {
//   id: string;
//   isRejected: boolean;
//   isAccepted: boolean;
//   rejectionReason: string;
// }

// const DetailValidasiBerkasPage: FC = () => {
//   const location = useLocation();
//   const { student } = location.state as { student: Student };
//   const [activeTab, setActiveTab] = useState<Stage>("step1");
//   const [documentsState, setDocumentsState] = useState<
//     Record<Stage, DocumentState[]>
//   >({
//     step1: [],
//     step2: [],
//     step3: [],
//     step5: [],
//   });
//   const [idState, setIdState] = useState({
//     isRejected: false,
//     isAccepted: false,
//     rejectionReason: "",
//   });
//   const [formData, setFormData] = useState({
//     ruanganSeminar: "",
//     tanggalSeminar: "",
//     jadwalSeminar: "",
//     dosenPenguji: "",
//   });

//   const queryClient = useQueryClient();

//   const validateMutation = useMutation({
//     mutationFn: (id: string) => APISeminarKP.postValidasiDokumen({ id }),
//     onSuccess: () => {
//       toast({
//         title: "✅ Berhasil",
//         description: "Dokumen berhasil divalidasi.",
//         duration: 3000,
//       });
//     },
//     onError: (error) => {
//       toast({
//         title: "❌ Gagal",
//         description: `Gagal memvalidasi dokumen: ${(error as Error).message}`,
//         duration: 3000,
//       });
//     },
//   });

//   const rejectMutation = useMutation({
//     mutationFn: ({ id, komentar }: { id: string; komentar: string }) =>
//       APISeminarKP.postTolakDokumen({ id, komentar }),
//     onSuccess: () => {
//       toast({
//         title: "✅ Berhasil",
//         description: "Dokumen berhasil ditolak.",
//         duration: 3000,
//       });
//     },
//     onError: (error) => {
//       toast({
//         title: "❌ Gagal",
//         description: `Gagal menolak dokumen: ${(error as Error).message}`,
//         duration: 3000,
//       });
//     },
//   });

//   useEffect(() => {
//     if (student?.dokumen) {
//       const initialStates: Record<Stage, DocumentState[]> = {
//         step1: student.dokumen.step1.map((doc: Dokumen) => ({
//           id: doc.id,
//           isAccepted: doc.status === "Divalidasi",
//           isRejected: doc.status === "Ditolak" && !!doc.komentar,
//           rejectionReason: doc.komentar || "",
//         })),
//         step2: student.dokumen.step2.map((doc: Dokumen) => ({
//           id: doc.id,
//           isAccepted: doc.status === "Divalidasi",
//           isRejected: doc.status === "Ditolak" && !!doc.komentar,
//           rejectionReason: doc.komentar || "",
//         })),
//         step3: student.dokumen.step3.map((doc: Dokumen) => ({
//           id: doc.id,
//           isAccepted: doc.status === "Divalidasi",
//           isRejected: doc.status === "Ditolak" && !!doc.komentar,
//           rejectionReason: doc.komentar || "",
//         })),
//         step5: student.dokumen.step5.map((doc: Dokumen) => ({
//           id: doc.id,
//           isAccepted: doc.status === "Divalidasi",
//           isRejected: doc.status === "Ditolak" && !!doc.komentar,
//           rejectionReason: doc.komentar || "",
//         })),
//       };
//       setDocumentsState(initialStates);

//       const stepsWithDocs = ["step5", "step3", "step2", "step1"].find(
//         (step) => student.dokumen?.[step as Stage]?.length > 0
//       );
//       if (stepsWithDocs) setActiveTab(stepsWithDocs as Stage);
//     }
//   }, [student]);

//   const handleReject = (docId: string, step: Stage) => {
//     setDocumentsState((prev) => ({
//       ...prev,
//       [step]: prev[step].map((doc) =>
//         doc.id === docId
//           ? {
//               ...doc,
//               isRejected: !doc.isRejected,
//               isAccepted: false,
//               rejectionReason: doc.isRejected ? "" : doc.rejectionReason,
//             }
//           : doc
//       ),
//     }));
//   };

//   const handleAccept = (docId: string, step: Stage) => {
//     setDocumentsState((prev) => ({
//       ...prev,
//       [step]: prev[step].map((doc) =>
//         doc.id === docId
//           ? {
//               ...doc,
//               isAccepted: !doc.isAccepted,
//               isRejected: false,
//               rejectionReason: "",
//             }
//           : doc
//       ),
//     }));
//   };

//   const handleReasonChange = (docId: string, reason: string, step: Stage) => {
//     setDocumentsState((prev) => ({
//       ...prev,
//       [step]: prev[step].map((doc) =>
//         doc.id === docId ? { ...doc, rejectionReason: reason } : doc
//       ),
//     }));
//   };

//   const handleViewDocument = (link: string) => {
//     window.open(link, "_blank");
//   };

//   const handleConfirm = async (step: Stage) => {
//     const docs = documentsState[step];
//     const validationPromises = docs
//       .filter((doc) => doc.isAccepted)
//       .map((doc) => validateMutation.mutateAsync(doc.id));
//     const rejectionPromises = docs
//       .filter((doc) => doc.isRejected && doc.rejectionReason)
//       .map((doc) =>
//         rejectMutation.mutateAsync({
//           id: doc.id,
//           komentar: doc.rejectionReason,
//         })
//       );

//     try {
//       await Promise.all([...validationPromises, ...rejectionPromises]);
//       toast({
//         title: "✅ Berhasil",
//         description: "Semua perubahan telah dikonfirmasi.",
//         duration: 3000,
//       });
//       queryClient.invalidateQueries({
//         queryKey: ["koordinator-seminar-kp-detail", student.nim],
//       });
//     } catch (error) {
//       toast({
//         title: "❌ Gagal",
//         description: `Terjadi kesalahan: ${(error as Error).message}`,
//         duration: 3000,
//       });
//     }
//   };

//   const handleRejectID = () => {
//     setIdState({
//       isRejected: !idState.isRejected,
//       isAccepted: false,
//       rejectionReason: idState.isRejected ? "" : idState.rejectionReason,
//     });
//   };

//   const handleAcceptID = () => {
//     setIdState({
//       isAccepted: !idState.isAccepted,
//       isRejected: false,
//       rejectionReason: "",
//     });
//   };

//   const handleReasonChangeID = (reason: string) => {
//     setIdState({ ...idState, rejectionReason: reason });
//   };

//   const handleFormChange = (field: keyof typeof formData, value: string) => {
//     setFormData({ ...formData, [field]: value });
//   };

//   const handleValidateID = () => {
//     toast({
//       title: "✅ Berhasil",
//       description: "ID Surat Undangan telah divalidasi.",
//       duration: 3000,
//     });
//   };

//   const getNamaDokumen = (jenis: string, step: string): string => {
//     const namesStep1: Record<string, string> = {
//       SURAT_KETERANGAN_SELESAI_KP: "Surat Keterangan Selesai KP",
//       LAPORAN_TAMBAHAN_KP: "Laporan Tambahan KP",
//       FORM_KEHADIRAN_SEMINAR: "Bukti Seminar KP (min. 5 kali)",
//     };
//     const namesStep3: Record<string, string> = {
//       SURAT_UNDANGAN_SEMINAR_KP: "Surat Undangan Seminar KP",
//     };
//     return step === "step1"
//       ? namesStep1[jenis] || "Dokumen Tidak Diketahui"
//       : namesStep3[jenis] || "Dokumen Tidak Diketahui";
//   };

//   if (!student) return <div>Tidak ada data mahasiswa.</div>;

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
//           <div className="bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-emerald-600 dark:to-teal-500 p-3 text-white">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-1 w-10 h-10 flex items-center justify-center shadow-sm">
//                   <User className="text-emerald-600 dark:text-emerald-400 w-6 h-6" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-lg">{student.name}</h3>
//                   <div className="flex items-center gap-2 text-xs">
//                     <span className="bg-white/90 dark:bg-gray-800/90 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full shadow-sm text-center">
//                       Semester {student.semester}
//                     </span>
//                     <span className="flex items-center bg-emerald-600/40 dark:bg-emerald-700/40 px-2 py-0.5 rounded-full">
//                       <span className="bg-white dark:bg-gray-200 w-1.5 h-1.5 rounded-full mr-1"></span>
//                       {student.status || "Belum Diproses"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white/90 dark:bg-gray-800/90 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-md text-xs font-medium shadow-sm">
//                 {student.nim}
//               </div>
//             </div>
//           </div>
//           <div className="grid grid-cols-3 gap-0 border-t border-gray-100 dark:border-gray-700">
//             <div className="p-3 flex items-center gap-2 border-r border-gray-100 dark:border-gray-700">
//               <Award className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
//               <div>
//                 <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
//                   Nilai Instansi
//                 </div>
//                 <div className="font-medium text-sm text-gray-800 dark:text-gray-200">
//                   {student.nilaiInstansi || "Belum ada nilai"}
//                 </div>
//               </div>
//             </div>
//             <div className="p-3 flex items-center gap-2 border-r border-gray-100 dark:border-gray-700">
//               <Building className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
//               <div>
//                 <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
//                   Pembimbing Instansi
//                 </div>
//                 <div className="font-medium text-sm text-gray-800 dark:text-gray-200">
//                   {student.pembimbingInstansi || "Belum ditentukan"}
//                 </div>
//               </div>
//             </div>
//             <div className="p-3 flex items-center gap-2">
//               <GraduationCap className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
//               <div>
//                 <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
//                   Dosen Pembimbing
//                 </div>
//                 <div className="font-medium text-sm text-gray-800 dark:text-gray-200">
//                   {student.dosenPembimbing || "Belum ditentukan"}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <Tabs
//           value={activeTab}
//           onValueChange={(value) => setActiveTab(value as Stage)}
//           className="w-full"
//         >
//           <TabsList className="grid grid-cols-4 gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
//             <TabsTrigger
//               value="step1"
//               className="text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
//               disabled={!(student.dokumen?.step1?.length > 0)}
//             >
//               Pendaftaran
//             </TabsTrigger>
//             <TabsTrigger
//               value="step2"
//               className="text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
//               disabled={!(student.dokumen?.step2?.length > 0)}
//             >
//               ID Surat Undangan
//             </TabsTrigger>
//             <TabsTrigger
//               value="step3"
//               className="text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
//               disabled={!(student.dokumen?.step3?.length > 0)}
//             >
//               Surat Undangan
//             </TabsTrigger>
//             <TabsTrigger
//               value="step5"
//               className="text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
//               disabled={!(student.dokumen?.step5?.length > 0)}
//             >
//               Pasca Seminar
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="step1" className="mt-4">
//             {student.dokumen?.step1?.length > 0 ? (
//               <>
//                 <div className="py-4">
//                   <h3 className="text-sm font-medium flex items-center mb-3 text-gray-600 dark:text-gray-300">
//                     <FileText className="w-4 h-4 mr-2 text-emerald-500 dark:text-emerald-400" />
//                     Validasi Berkas Pendaftaran Seminar KP Mahasiswa
//                   </h3>
//                   <div className="space-y-2">
//                     {student.dokumen.step1.map((doc: Dokumen) => {
//                       const docState = documentsState.step1.find(
//                         (d) => d.id === doc.id
//                       ) || {
//                         id: doc.id,
//                         isAccepted: false,
//                         isRejected: false,
//                         rejectionReason: "",
//                       };
//                       return (
//                         <div
//                           key={doc.id}
//                           className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
//                         >
//                           <div className="border-b border-gray-100 dark:border-gray-700 p-2.5 bg-gray-50 dark:bg-gray-800/80">
//                             <p className="font-medium text-xs text-gray-600 dark:text-gray-300 flex items-center">
//                               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-2"></span>
//                               {getNamaDokumen(doc.jenis_dokumen, "step1")}
//                             </p>
//                             <p className="text-xs text-gray-500 dark:text-gray-400">
//                               Status: {doc.status || "Belum Diproses"}
//                             </p>
//                           </div>
//                           <div className="p-2.5">
//                             <div className="flex items-center justify-between">
//                               <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 truncate max-w-lg">
//                                 <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
//                                 <span className="truncate">
//                                   {doc.link_path}
//                                 </span>
//                               </div>
//                               <div className="flex gap-1">
//                                 <Button
//                                   size="sm"
//                                   variant="ghost"
//                                   className="h-6 w-6 rounded-full p-0 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
//                                   onClick={() =>
//                                     handleViewDocument(doc.link_path)
//                                   }
//                                 >
//                                   <Eye className="h-3.5 w-3.5" />
//                                 </Button>
//                                 <Button
//                                   size="sm"
//                                   variant="ghost"
//                                   className={`h-6 w-6 rounded-full p-0 ${
//                                     docState.isRejected
//                                       ? "text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/50"
//                                       : "text-gray-500 dark:text-gray-400"
//                                   } hover:text-red-500 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 ${
//                                     doc.status === "Divalidasi" ||
//                                     doc.status === "Ditolak"
//                                       ? "opacity-50 cursor-not-allowed"
//                                       : ""
//                                   }`}
//                                   onClick={() =>
//                                     (doc.status === "Terkirim" ||
//                                       doc.status === "Belum Diproses") &&
//                                     handleReject(doc.id, "step1")
//                                   }
//                                   disabled={
//                                     doc.status === "Divalidasi" ||
//                                     doc.status === "Ditolak"
//                                   }
//                                 >
//                                   <X className="h-3.5 w-3.5" />
//                                 </Button>
//                                 <Button
//                                   size="sm"
//                                   variant="ghost"
//                                   className={`h-6 w-6 rounded-full p-0 ${
//                                     docState.isAccepted
//                                       ? "text-emerald-500 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50"
//                                       : "text-gray-500 dark:text-gray-400"
//                                   } hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 ${
//                                     doc.status === "Divalidasi" ||
//                                     doc.status === "Ditolak"
//                                       ? "opacity-50 cursor-not-allowed"
//                                       : ""
//                                   }`}
//                                   onClick={() =>
//                                     (doc.status === "Terkirim" ||
//                                       doc.status === "Belum Diproses") &&
//                                     handleAccept(doc.id, "step1")
//                                   }
//                                   disabled={
//                                     doc.status === "Divalidasi" ||
//                                     doc.status === "Ditolak"
//                                   }
//                                 >
//                                   <Check className="h-3.5 w-3.5" />
//                                 </Button>
//                               </div>
//                             </div>
//                             <div
//                               className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out ${
//                                 docState.isRejected
//                                   ? "max-h-32 opacity-100"
//                                   : "max-h-0 opacity-0"
//                               }`}
//                             >
//                               <Textarea
//                                 placeholder="Masukkan alasan penolakan..."
//                                 value={docState.rejectionReason || ""}
//                                 onChange={(e) =>
//                                   handleReasonChange(
//                                     doc.id,
//                                     e.target.value,
//                                     "step1"
//                                   )
//                                 }
//                                 className="w-full text-sm border-gray-200 dark:border-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//                 <div className="flex justify-end gap-2 mt-4">
//                   <Button
//                     className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 hover:from-emerald-600 hover:to-teal-600 dark:hover:from-emerald-500 dark:hover:to-teal-500 border-0 h-8 text-xs px-4 rounded-sm shadow-sm flex items-center"
//                     onClick={() => handleConfirm("step1")}
//                   >
//                     Konfirmasi
//                   </Button>
//                 </div>
//               </>
//             ) : (
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 Tidak ada dokumen yang tersedia untuk divalidasi.
//               </p>
//             )}
//           </TabsContent>

//           <TabsContent value="step2" className="mt-4">
//             {student.dokumen?.step2?.length > 0 ? (
//               <>
//                 <div className="my-4">
//                   <h3 className="text-sm font-medium flex items-center mb-3 text-gray-600 dark:text-gray-300">
//                     <FileText className="w-4 h-4 mr-2 text-emerald-500 dark:text-emerald-400" />
//                     Validasi ID Surat Undangan
//                   </h3>
//                   {student.dokumen.step2.map((doc: Dokumen) => {
//                     const docState = documentsState.step2.find(
//                       (d) => d.id === doc.id
//                     ) || {
//                       id: doc.id,
//                       isAccepted: false,
//                       isRejected: false,
//                       rejectionReason: "",
//                     };
//                     return (
//                       <div
//                         key={doc.id}
//                         className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
//                       >
//                         <div className="border-b border-gray-100 dark:border-gray-700 p-2.5 bg-gray-50 dark:bg-gray-800/80">
//                           <p className="font-medium text-xs text-gray-600 dark:text-gray-300 flex items-center">
//                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-2"></span>
//                             ID Surat Undangan
//                           </p>
//                           <p className="text-xs text-gray-500 dark:text-gray-400">
//                             Status: {doc.status || "Belum Diproses"}
//                           </p>
//                         </div>
//                         <div className="p-2.5">
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 truncate max-w-lg">
//                               <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
//                               <span className="truncate">{doc.link_path}</span>
//                             </div>
//                             <div className="flex gap-1">
//                               <Button
//                                 size="sm"
//                                 variant="ghost"
//                                 className="h-6 w-6 rounded-full p-0 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
//                                 onClick={() =>
//                                   handleViewDocument(doc.link_path)
//                                 }
//                               >
//                                 <Eye className="h-3.5 w-3.5" />
//                               </Button>
//                               <Button
//                                 size="sm"
//                                 variant="ghost"
//                                 className={`h-6 w-6 rounded-full p-0 ${
//                                   docState.isRejected
//                                     ? "text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/50"
//                                     : "text-gray-500 dark:text-gray-400"
//                                 } hover:text-red-500 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 ${
//                                   doc.status === "Divalidasi" ||
//                                   doc.status === "Ditolak"
//                                     ? "opacity-50 cursor-not-allowed"
//                                     : ""
//                                 }`}
//                                 onClick={() =>
//                                   (doc.status === "Terkirim" ||
//                                     doc.status === "Belum Diproses") &&
//                                   handleReject(doc.id, "step2")
//                                 }
//                                 disabled={
//                                   doc.status === "Divalidasi" ||
//                                   doc.status === "Ditolak"
//                                 }
//                               >
//                                 <X className="h-3.5 w-3.5" />
//                               </Button>
//                               <Button
//                                 size="sm"
//                                 variant="ghost"
//                                 className={`h-6 w-6 rounded-full p-0 ${
//                                   docState.isAccepted
//                                     ? "text-emerald-500 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50"
//                                     : "text-gray-500 dark:text-gray-400"
//                                 } hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 ${
//                                   doc.status === "Divalidasi" ||
//                                   doc.status === "Ditolak"
//                                     ? "opacity-50 cursor-not-allowed"
//                                     : ""
//                                 }`}
//                                 onClick={() =>
//                                   (doc.status === "Terkirim" ||
//                                     doc.status === "Belum Diproses") &&
//                                   handleAccept(doc.id, "step2")
//                                 }
//                                 disabled={
//                                   doc.status === "Divalidasi" ||
//                                   doc.status === "Ditolak"
//                                 }
//                               >
//                                 <Check className="h-3.5 w-3.5" />
//                               </Button>
//                             </div>
//                           </div>
//                           <div
//                             className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out ${
//                               docState.isRejected
//                                 ? "max-h-32 opacity-100"
//                                 : "max-h-0 opacity-0"
//                             }`}
//                           >
//                             <Textarea
//                               placeholder="Masukkan alasan penolakan..."
//                               value={docState.rejectionReason || ""}
//                               onChange={(e) =>
//                                 handleReasonChange(
//                                   doc.id,
//                                   e.target.value,
//                                   "step2"
//                                 )
//                               }
//                               className="w-full text-sm border-gray-200 dark:border-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//                 {documentsState.step2.some((doc) => doc.isAccepted) && (
//                   <motion.div
//                     className="my-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4"
//                     initial="hidden"
//                     animate="visible"
//                     variants={{
//                       hidden: { opacity: 0, y: -10 },
//                       visible: {
//                         opacity: 1,
//                         y: 0,
//                         transition: { duration: 0.3 },
//                       },
//                     }}
//                   >
//                     <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
//                       Validasi ID FST Surat Undangan
//                     </h4>
//                     <div className="grid gap-4">
//                       <div className="grid grid-cols-1 gap-2">
//                         <Label
//                           htmlFor="ruanganSeminar"
//                           className="text-sm text-gray-600 dark:text-gray-300"
//                         >
//                           Ruangan Seminar
//                         </Label>
//                         <div className="relative">
//                           <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                           <Input
//                             id="ruanganSeminar"
//                             placeholder="Masukkan ruangan seminar"
//                             value={formData.ruanganSeminar}
//                             onChange={(e) =>
//                               handleFormChange("ruanganSeminar", e.target.value)
//                             }
//                             className="pl-10 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
//                           />
//                         </div>
//                       </div>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="grid gap-2">
//                           <Label
//                             htmlFor="tanggalSeminar"
//                             className="text-sm text-gray-600 dark:text-gray-300"
//                           >
//                             Tanggal Seminar
//                           </Label>
//                           <div className="relative">
//                             <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                             <Input
//                               id="tanggalSeminar"
//                               placeholder="dd/mm/yyyy"
//                               value={formData.tanggalSeminar}
//                               onChange={(e) =>
//                                 handleFormChange(
//                                   "tanggalSeminar",
//                                   e.target.value
//                                 )
//                               }
//                               className="pl-10 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
//                             />
//                           </div>
//                         </div>
//                         <div className="grid gap-2">
//                           <Label
//                             htmlFor="jadwalSeminar"
//                             className="text-sm text-gray-600 dark:text-gray-300"
//                           >
//                             Jadwal Seminar
//                           </Label>
//                           <div className="relative">
//                             <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                             <Input
//                               id="jadwalSeminar"
//                               placeholder="HH:MM"
//                               value={formData.jadwalSeminar}
//                               onChange={(e) =>
//                                 handleFormChange(
//                                   "jadwalSeminar",
//                                   e.target.value
//                                 )
//                               }
//                               className="pl-10 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                       <div className="grid gap-2">
//                         <Label
//                           htmlFor="dosenPenguji"
//                           className="text-sm text-gray-600 dark:text-gray-300"
//                         >
//                           Pemilihan Dosen Penguji
//                         </Label>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">
//                           Ketik Nama Dosen atau Bidang Keilmuan nya!
//                         </p>
//                         <Select
//                           onValueChange={(value) =>
//                             handleFormChange("dosenPenguji", value)
//                           }
//                         >
//                           <SelectTrigger
//                             id="dosenPenguji"
//                             className="text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
//                           >
//                             <SelectValue placeholder="Nama Dosen Penguji" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="Dosen A">Dosen A</SelectItem>
//                             <SelectItem value="Dosen B">Dosen B</SelectItem>
//                             <SelectItem value="Dosen C">Dosen C</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}
//                 <div className="flex justify-end gap-2 mt-4">
//                   <Button
//                     variant="outline"
//                     className={`text-red-500 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 text-xs px-3 rounded-sm shadow-sm ${
//                       documentsState.step2.some((doc) => doc.isRejected)
//                         ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800"
//                         : ""
//                     }`}
//                     onClick={handleRejectID}
//                     disabled={documentsState.step2.some(
//                       (doc) => doc.isAccepted
//                     )}
//                   >
//                     <X className="h-3.5 w-3.5 mr-1" />
//                     Tolak
//                   </Button>
//                   <Button
//                     className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 hover:from-emerald-600 hover:to-teal-600 dark:hover:from-emerald-500 dark:hover:to-teal-500 border-0 h-8 text-xs px-4 rounded-sm shadow-sm flex items-center"
//                     onClick={handleValidateID}
//                     disabled={documentsState.step2.some(
//                       (doc) => doc.isRejected
//                     )}
//                   >
//                     Validasi
//                   </Button>
//                 </div>
//               </>
//             ) : (
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 Tidak ada dokumen yang tersedia untuk divalidasi.
//               </p>
//             )}
//           </TabsContent>

//           <TabsContent value="step3" className="mt-4">
//             {student.dokumen?.step3?.length > 0 ? (
//               <>
//                 <div className="py-4">
//                   <h3 className="text-sm font-medium flex items-center mb-3 text-gray-600 dark:text-gray-300">
//                     <FileText className="w-4 h-4 mr-2 text-emerald-500 dark:text-emerald-400" />
//                     Validasi Berkas Surat Undangan Seminar KP Mahasiswa
//                   </h3>
//                   <div className="space-y-2">
//                     {student.dokumen.step3.map((doc: Dokumen) => {
//                       const docState = documentsState.step3.find(
//                         (d) => d.id === doc.id
//                       ) || {
//                         id: doc.id,
//                         isAccepted: false,
//                         isRejected: false,
//                         rejectionReason: "",
//                       };
//                       return (
//                         <div
//                           key={doc.id}
//                           className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
//                         >
//                           <div className="border-b border-gray-100 dark:border-gray-700 p-2.5 bg-gray-50 dark:bg-gray-800/80">
//                             <p className="font-medium text-xs text-gray-600 dark:text-gray-300 flex items-center">
//                               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-2"></span>
//                               {getNamaDokumen(doc.jenis_dokumen, "step3")}
//                             </p>
//                             <p className="text-xs text-gray-500 dark:text-gray-400">
//                               Status: {doc.status || "Belum Diproses"}
//                             </p>
//                           </div>
//                           <div className="p-2.5">
//                             <div className="flex items-center justify-between">
//                               <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 truncate max-w-lg">
//                                 <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
//                                 <span className="truncate">
//                                   {doc.link_path}
//                                 </span>
//                               </div>
//                               <div className="flex gap-1">
//                                 <Button
//                                   size="sm"
//                                   variant="ghost"
//                                   className="h-6 w-6 rounded-full p-0 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
//                                   onClick={() =>
//                                     handleViewDocument(doc.link_path)
//                                   }
//                                 >
//                                   <Eye className="h-3.5 w-3.5" />
//                                 </Button>
//                                 <Button
//                                   size="sm"
//                                   variant="ghost"
//                                   className={`h-6 w-6 rounded-full p-0 ${
//                                     docState.isRejected
//                                       ? "text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/50"
//                                       : "text-gray-500 dark:text-gray-400"
//                                   } hover:text-red-500 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 ${
//                                     doc.status === "Divalidasi" ||
//                                     doc.status === "Ditolak"
//                                       ? "opacity-50 cursor-not-allowed"
//                                       : ""
//                                   }`}
//                                   onClick={() =>
//                                     (doc.status === "Terkirim" ||
//                                       doc.status === "Belum Diproses") &&
//                                     handleReject(doc.id, "step3")
//                                   }
//                                   disabled={
//                                     doc.status === "Divalidasi" ||
//                                     doc.status === "Ditolak"
//                                   }
//                                 >
//                                   <X className="h-3.5 w-3.5" />
//                                 </Button>
//                                 <Button
//                                   size="sm"
//                                   variant="ghost"
//                                   className={`h-6 w-6 rounded-full p-0 ${
//                                     docState.isAccepted
//                                       ? "text-emerald-500 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50"
//                                       : "text-gray-500 dark:text-gray-400"
//                                   } hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 ${
//                                     doc.status === "Divalidasi" ||
//                                     doc.status === "Ditolak"
//                                       ? "opacity-50 cursor-not-allowed"
//                                       : ""
//                                   }`}
//                                   onClick={() =>
//                                     (doc.status === "Terkirim" ||
//                                       doc.status === "Belum Diproses") &&
//                                     handleAccept(doc.id, "step3")
//                                   }
//                                   disabled={
//                                     doc.status === "Divalidasi" ||
//                                     doc.status === "Ditolak"
//                                   }
//                                 >
//                                   <Check className="h-3.5 w-3.5" />
//                                 </Button>
//                               </div>
//                             </div>
//                             <div
//                               className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out ${
//                                 docState.isRejected
//                                   ? "max-h-32 opacity-100"
//                                   : "max-h-0 opacity-0"
//                               }`}
//                             >
//                               <Textarea
//                                 placeholder="Masukkan alasan penolakan..."
//                                 value={docState.rejectionReason || ""}
//                                 onChange={(e) =>
//                                   handleReasonChange(
//                                     doc.id,
//                                     e.target.value,
//                                     "step3"
//                                   )
//                                 }
//                                 className="w-full text-sm border-gray-200 dark:border-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//                 <div className="flex justify-end gap-2 mt-4">
//                   <Button
//                     className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 hover:from-emerald-600 hover:to-teal-600 dark:hover:from-emerald-500 dark:hover:to-teal-500 border-0 h-8 text-xs px-4 rounded-sm shadow-sm flex items-center"
//                     onClick={() => handleConfirm("step3")}
//                   >
//                     Konfirmasi
//                   </Button>
//                 </div>
//               </>
//             ) : (
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 Tidak ada dokumen yang tersedia untuk divalidasi.
//               </p>
//             )}
//           </TabsContent>

//           <TabsContent value="step5" className="mt-4">
//             {student.dokumen?.step5?.length > 0 ? (
//               <>
//                 <div className="px-4 py-6">
//                   <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
//                     {/* Add evaluation cards if needed */}
//                   </div>
//                 </div>
//                 <div className="my-4">
//                   <h3 className="text-sm font-medium flex items-center mb-3 text-gray-600 dark:text-gray-300">
//                     <FileText className="w-4 h-4 mr-2 text-emerald-500 dark:text-emerald-400" />
//                     Validasi Berkas Pasca Seminar KP Mahasiswa
//                   </h3>
//                   <div className="space-y-2">
//                     {student.dokumen.step5.map((doc: Dokumen) => {
//                       const docState = documentsState.step5.find(
//                         (d) => d.id === doc.id
//                       ) || {
//                         id: doc.id,
//                         isAccepted: false,
//                         isRejected: false,
//                         rejectionReason: "",
//                       };
//                       return (
//                         <div
//                           key={doc.id}
//                           className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
//                         >
//                           <div className="border-b border-gray-100 dark:border-gray-700 p-2.5 bg-gray-50 dark:bg-gray-800/80">
//                             <p className="font-medium text-xs text-gray-600 dark:text-gray-300 flex items-center">
//                               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-2"></span>
//                               {getNamaDokumen(doc.jenis_dokumen, "step5") ||
//                                 "Dokumen Tidak Diketahui"}
//                             </p>
//                             <p className="text-xs text-gray-500 dark:text-gray-400">
//                               Status: {doc.status || "Belum Diproses"}
//                             </p>
//                           </div>
//                           <div className="p-2.5">
//                             <div className="flex items-center justify-between">
//                               <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 truncate max-w-lg">
//                                 <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
//                                 <span className="truncate">
//                                   {doc.link_path}
//                                 </span>
//                               </div>
//                               <div className="flex gap-1">
//                                 <Button
//                                   size="sm"
//                                   variant="ghost"
//                                   className="h-6 w-6 rounded-full p-0 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
//                                   onClick={() =>
//                                     handleViewDocument(doc.link_path)
//                                   }
//                                 >
//                                   <Eye className="h-3.5 w-3.5" />
//                                 </Button>
//                                 <Button
//                                   size="sm"
//                                   variant="ghost"
//                                   className={`h-6 w-6 rounded-full p-0 ${
//                                     docState.isRejected
//                                       ? "text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/50"
//                                       : "text-gray-500 dark:text-gray-400"
//                                   } hover:text-red-500 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50`}
//                                   onClick={() => handleReject(doc.id, "step5")}
//                                 >
//                                   <X className="h-3.5 w-3.5" />
//                                 </Button>
//                                 <Button
//                                   size="sm"
//                                   variant="ghost"
//                                   className={`h-6 w-6 rounded-full p-0 ${
//                                     docState.isAccepted
//                                       ? "text-emerald-500 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50"
//                                       : "text-gray-500 dark:text-gray-400"
//                                   } hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50`}
//                                   onClick={() => handleAccept(doc.id, "step5")}
//                                 >
//                                   <Check className="h-3.5 w-3.5" />
//                                 </Button>
//                               </div>
//                             </div>
//                             <div
//                               className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out ${
//                                 docState.isRejected
//                                   ? "max-h-32 opacity-100"
//                                   : "max-h-0 opacity-0"
//                               }`}
//                             >
//                               <Textarea
//                                 placeholder="Masukkan alasan penolakan..."
//                                 value={docState.rejectionReason || ""}
//                                 onChange={(e) =>
//                                   handleReasonChange(
//                                     doc.id,
//                                     e.target.value,
//                                     "step5"
//                                   )
//                                 }
//                                 className="w-full text-sm border-gray-200 dark:border-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//                 <div className="flex justify-end gap-2 mt-4">
//                   <Button
//                     variant="outline"
//                     className="text-red-500 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 text-xs px-3 rounded-sm shadow-sm"
//                   >
//                     Tolak
//                   </Button>
//                   <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 hover:from-emerald-600 hover:to-teal-600 dark:hover:from-emerald-500 dark:hover:to-teal-500 border-0 h-8 text-xs px-4 rounded-sm shadow-sm flex items-center">
//                     Validasi
//                   </Button>
//                 </div>
//               </>
//             ) : (
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 Tidak ada dokumen yang tersedia untuk divalidasi.
//               </p>
//             )}
//           </TabsContent>
//         </Tabs>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default DetailValidasiBerkasPage;
