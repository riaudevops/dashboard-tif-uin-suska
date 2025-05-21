import { type FC } from "react";
import {
  Eye,
  User,
  Award,
  Building,
  GraduationCap,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface DetailNilaiModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    nim: string;
    nama: string;
    kelas: string;
    status_daftar_kp: "Baru" | "Lanjut" | "Selesai";
    status_nilai: string;
    semester: string;
    instansi: string;
    pembimbing_instansi: string;
    dosen_pembimbing: string;
    dosen_penguji: string;
    nilai_instansi?: number;
    nilai_penguji?: number;
    nilai_akhir?: number;
    nilai_huruf?: string;
    komponen_nilai_instansi?: {
      deliverables?: number;
      ketepatan_waktu?: number;
      kedisiplinan?: number;
      attitude?: number;
      kerjasama_tim?: number;
      inisiatif?: number;
      masukan?: string;
    };
    komponen_nilai_penguji?: {
      penguasaan_keilmuan?: number;
      kemampuan_presentasi?: number;
      kesesuaian_urgensi?: number;
      catatan?: string;
    };
    komponen_nilai_pembimbing?: {
      [key: string]: number | string | undefined;
    };
  } | null;
}

const DetailNilaiModal: FC<DetailNilaiModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden flex flex-col p-0 rounded-xl bg-white dark:bg-gray-900">
        <div className="pt-12 px-4">
          <DialogHeader>
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-emerald-600 dark:to-teal-500 p-3 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-1 w-10 h-10 flex items-center justify-center shadow-sm">
                      <User className="text-emerald-600 dark:text-emerald-400 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{student.nama}</h3>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-white/90 dark:bg-gray-800/90 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full shadow-sm text-center">
                          Semester {student.semester}
                        </span>
                        <span className="flex items-center bg-emerald-600/40 dark:bg-emerald-700/40 px-2 py-0.5 rounded-full">
                          <span className="bg-white dark:bg-gray-200 w-1.5 h-1.5 rounded-full mr-1"></span>
                          {student.status_daftar_kp}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/90 dark:bg-gray-800/90 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-md text-xs font-medium shadow-sm">
                    {student.nim}
                  </div>
                </div>
              </div>

              {/* Profile Details - horizontal layout */}
              <div className="grid grid-cols-4 gap-0 border-t border-gray-100 dark:border-gray-700">
                <div className="p-3 flex items-center gap-2 border-r border-gray-100 dark:border-gray-700">
                  <Award className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                  <div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Instansi
                    </div>
                    <div className="font-medium text-xs text-gray-800 dark:text-gray-200">
                      {student.instansi}
                    </div>
                  </div>
                </div>
                <div className="p-3 flex items-center gap-2 border-r border-gray-100 dark:border-gray-700">
                  <Building className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                  <div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Pembimbing Instansi
                    </div>
                    <div className="font-medium text-xs text-gray-800 dark:text-gray-200">
                      {student.pembimbing_instansi}
                    </div>
                  </div>
                </div>
                <div className="p-3 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                  <div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Dosen Pembimbing
                    </div>
                    <div className="font-medium text-xs text-gray-800 dark:text-gray-200">
                      {student.dosen_pembimbing}
                    </div>
                  </div>
                </div>
                <div className="p-3 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                  <div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Dosen Penguji
                    </div>
                    <div className="font-medium text-xs text-gray-800 dark:text-gray-200">
                      {student.dosen_penguji}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Total Grade Card */}
        <div className="flex justify-center">
          <div className="relative bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 px-8 rounded-xl shadow-lg flex flex-col items-center justify-center">
            <div className="text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
              TOTAL
            </div>
            <span className="font-bold text-2xl">
              {student.nilai_akhir || student.nilai_instansi || 0} (
              {student.nilai_huruf || "N/A"})
            </span>
          </div>
        </div>

        {/* Grade Cards Container with new, cooler design */}
        <div className="grid grid-cols-3 gap-4 mb-4 px-4">
          {/* Pembimbing Instansi Card */}
          <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="relative h-20 bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center p-3">
              <div className="text-center">
                <div className="text-xs font-medium text-emerald-100 uppercase tracking-wide">
                  Nilai
                </div>
                <h3 className="text-white font-semibold">
                  Pembimbing Instansi
                </h3>
              </div>
            </div>

            <div className="p-4 flex flex-col items-center mt-5">
              {student.nilai_instansi ? (
                <>
                  <div className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                    {student.nilai_instansi}
                  </div>
                  {student.komponen_nilai_instansi && (
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full mt-6"
                    >
                      <AccordionItem value="instansi">
                        <AccordionTrigger className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-gray-600 transition-colors">
                          <Eye className="w-3 h-3 mr-1" />
                          <span>Lihat Detail</span>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mt-2">
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-800 dark:text-gray-200">
                            <div>
                              Deliverables:{" "}
                              {student.komponen_nilai_instansi.deliverables ||
                                "N/A"}
                            </div>
                            <div>
                              Ketepatan Waktu:{" "}
                              {student.komponen_nilai_instansi
                                .ketepatan_waktu || "N/A"}
                            </div>
                            <div>
                              Kedisiplinan:{" "}
                              {student.komponen_nilai_instansi.kedisiplinan ||
                                "N/A"}
                            </div>
                            <div>
                              Attitude:{" "}
                              {student.komponen_nilai_instansi.attitude ||
                                "N/A"}
                            </div>
                            <div>
                              Kerjasama Tim:{" "}
                              {student.komponen_nilai_instansi.kerjasama_tim ||
                                "N/A"}
                            </div>
                            <div>
                              Inisiatif:{" "}
                              {student.komponen_nilai_instansi.inisiatif ||
                                "N/A"}
                            </div>
                            <div className="col-span-2">
                              Masukan:{" "}
                              {student.komponen_nilai_instansi.masukan ||
                                "Tidak ada masukan"}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center py-2">
                  <div className="text-red-500 dark:text-red-400 font-semibold animate-pulse">
                    Belum Mengisi!
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Menunggu Penilaian
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dosen Pembimbing Card */}
          <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="relative h-20 bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center p-3">
              <div className="text-center">
                <div className="text-xs font-medium text-emerald-100 uppercase tracking-wide">
                  Nilai
                </div>
                <h3 className="text-white font-semibold">Dosen Pembimbing</h3>
              </div>
            </div>

            <div className="p-4 flex flex-col items-center mt-5">
              <div className="flex flex-col items-center py-2">
                <div className="text-red-500 dark:text-red-400 font-semibold animate-pulse">
                  Belum Mengisi!
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Menunggu Penilaian
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full mt-6">
                <AccordionItem value="pembimbing">
                  <AccordionTrigger className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-gray-600 transition-colors">
                    <Eye className="w-3 h-3 mr-1" />
                    <span>Lihat Detail</span>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mt-2">
                    {student.komponen_nilai_pembimbing ? (
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-800 dark:text-gray-200">
                        {Object.entries(student.komponen_nilai_pembimbing).map(
                          ([key, value]) => (
                            <div key={key}>
                              {key.charAt(0).toUpperCase() +
                                key.slice(1).replace(/_/g, " ")}
                              : {value || "N/A"}
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Belum ada data komponen nilai.
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Dosen Penguji Card */}
          <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="relative h-20 bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center p-3">
              <div className="text-center">
                <div className="text-xs font-medium text-emerald-100 uppercase tracking-wide">
                  Nilai
                </div>
                <h3 className="text-white font-semibold">Dosen Penguji</h3>
              </div>
            </div>

            <div className="p-4 flex flex-col items-center mt-5">
              {student.nilai_penguji ? (
                <>
                  <div className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                    {student.nilai_penguji}
                  </div>
                  {student.komponen_nilai_penguji && (
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full mt-6"
                    >
                      <AccordionItem value="penguji">
                        <AccordionTrigger className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-gray-600 transition-colors">
                          <Eye className="w-3 h-3 mr-1" />
                          <span>Lihat Detail</span>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mt-2">
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-800 dark:text-gray-200">
                            <div>
                              Penguasaan Keilmuan:{" "}
                              {student.komponen_nilai_penguji
                                .penguasaan_keilmuan || "N/A"}
                            </div>
                            <div>
                              Kemampuan Presentasi:{" "}
                              {student.komponen_nilai_penguji
                                .kemampuan_presentasi || "N/A"}
                            </div>
                            <div>
                              Kesesuaian Urgensi:{" "}
                              {student.komponen_nilai_penguji
                                .kesesuaian_urgensi || "N/A"}
                            </div>
                            <div className="col-span-2">
                              Catatan:{" "}
                              {student.komponen_nilai_penguji.catatan ||
                                "Tidak ada catatan"}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center py-2">
                  <div className="text-red-500 dark:text-red-400 font-semibold animate-pulse">
                    Belum Mengisi!
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Menunggu Penilaian
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailNilaiModal;
