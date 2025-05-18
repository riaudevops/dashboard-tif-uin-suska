import { type FC } from "react";
import {
  Eye,
  User,
  Award,
  Building,
  GraduationCap,
  FileText,
  ChevronRight,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NilaiBelumValidModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    id: number;
    nim: string;
    name: string;
    semester: number;
    status: string;
    dosenPembimbing: string;
    dosenPenguji: string;
    nilaiPembimbing: string;
    nilaiPenguji: string;
    pembimbingInstansi: string;
    nilaiInstansi: string;
    instansi: string;
  } | null;
}

const NilaiBelumValidModal: FC<NilaiBelumValidModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col p-0 rounded-xl bg-white dark:bg-gray-900">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 dark:from-emerald-700 dark:to-green-600 p-4">
          <DialogHeader className="pb-0">
            <DialogTitle className="text-base font-bold text-white flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Validasi Berkas Surat Undangan
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Main content - scrollable */}
        <div className="overflow-y-auto flex-1 px-4  bg-gray-50 dark:bg-gray-900">
          {/* Student Profile Card */}
          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 mb-5">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-emerald-600 dark:to-teal-500 p-3 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-1 w-10 h-10 flex items-center justify-center shadow-sm">
                    <User className="text-emerald-600 dark:text-emerald-400 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{student.name}</h3>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="bg-white/90 dark:bg-gray-800/90 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full shadow-sm text-center">
                        Semester {student.semester}
                      </span>
                      <span className="flex items-center bg-emerald-600/40 dark:bg-emerald-700/40 px-2 py-0.5 rounded-full">
                        <span className="bg-white dark:bg-gray-200 w-1.5 h-1.5 rounded-full mr-1"></span>
                        {student.status}
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
                    {student.pembimbingInstansi}
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
                    {student.dosenPembimbing}
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
                    {student.dosenPenguji}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Grade Card */}
          {/* <div className="flex justify-center mb-6">
            <div className="relative bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 px-8 rounded-xl shadow-lg flex flex-col items-center justify-center">
              <div className="text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                TOTAL
              </div>
              <span className="font-bold text-3xl">1.40 (D)</span>
            </div>
          </div> */}

          {/* Grade Cards Container with new, cooler design */}
          <div className="grid grid-cols-3 gap-4 mb-4">
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
                {student.nilaiInstansi ? (
                  <>
                    <div className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                      {student.nilaiInstansi}
                    </div>
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

                <button className="w-full mt-6 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-gray-600 transition-colors">
                  <Eye className="w-3 h-3 mr-1" />
                  <span>Lihat Detail</span>
                  <ChevronRight className="w-3 h-3 ml-1" />
                </button>
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

              <div className="p-4 flex flex-col items-center mt-2">
                {student.nilaiPembimbing ? (
                  <>
                    <div className="text-5xl font-bold text-gray-800 dark:text-gray-100">
                      {student.nilaiPembimbing}
                    </div>
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

                <button className="w-full mt-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-gray-600 transition-colors ">
                  <Eye className="w-3 h-3 mr-1" />
                  <span>Lihat Detail</span>
                  <ChevronRight className="w-3 h-3 ml-1" />
                </button>
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

              <div className="p-4 flex flex-col items-center mt-2">
                {student.nilaiPenguji ? (
                  <>
                    <div className="text-5xl font-bold text-gray-800 dark:text-gray-100">
                      {student.nilaiPenguji}
                    </div>
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

                <button className="w-full mt-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-gray-600 transition-colors ">
                  <Eye className="w-3 h-3 mr-1" />
                  <span>Lihat Detail</span>
                  <ChevronRight className="w-3 h-3 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NilaiBelumValidModal;
