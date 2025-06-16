import { ReactNode, type FC } from "react";
import { User, Award, Building, GraduationCap } from "lucide-react";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

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
    nilai_pembimbing?: number;
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
    komponen_nilai_pembimbing?: {
      penyelesaian_masalah?: number;
      bimbingan_sikap?: number;
      kualitas_laporan?: number;
      catatan?: string;
    };
    komponen_nilai_penguji?: {
      penguasaan_keilmuan?: number;
      kemampuan_presentasi?: number;
      kesesuaian_urgensi?: number;
      catatan?: string;
    };
  } | null;
}

const DetailNilaiModal: FC<DetailNilaiModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  if (!student) return null;

  const renderKomponenGrid = (
    komponenData: { [key: string]: string | number | undefined },
    labels: { [key: string]: string }
  ): ReactNode => {
    return (
      <div className="space-y-2">
        {Object.entries(komponenData).map(([key, value]) => {
          if (key === "masukan" || key === "catatan") {
            return (
              <div
                key={key}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-3"
              >
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {labels[key] ||
                    key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/_/g, " ")}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {value ||
                    "Tidak ada " + (key === "masukan" ? "masukan" : "catatan")}
                </div>
              </div>
            );
          }

          return (
            <div
              key={key}
              className="flex items-center justify-between py-2 px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md"
            >
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {labels[key] ||
                  key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
              </span>
              <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                {value || 0}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const instansiLabels = {
    deliverables: "Deliverables",
    ketepatan_waktu: "Ketepatan Waktu",
    kedisiplinan: "Kedisiplinan",
    attitude: "Attitude",
    kerjasama_tim: "Kerjasama Tim",
    inisiatif: "Inisiatif",
    masukan: "Masukan",
  };

  const pembimbingLabels = {
    penyelesaian_masalah: "Penyelesaian Masalah",
    bimbingan_sikap: "Bimbingan Sikap",
    kualitas_laporan: "Kualitas Laporan",
    catatan: "Catatan",
  };

  const pengujiLabels = {
    penguasaan_keilmuan: "Penguasaan Materi",
    kemampuan_presentasi: "Teknik Presentasi",
    kesesuaian_urgensi: "Kesesuaian Laporan dan Presentasi",
    catatan: "Catatan",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-xl bg-white dark:bg-gray-900 shadow-xl">
        {/* Header Section - Compact */}
        <div className="p-4 pb-3">
          <DialogHeader>
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 p-3 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/95 rounded-full p-1.5 w-8 h-8 flex items-center justify-center shadow-sm">
                      <User className="text-emerald-600 w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-0.5">
                        {student.nama}
                      </h3>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-white/95 text-emerald-700 px-2 py-0.5 rounded-full shadow-sm font-medium">
                          Sem {student.semester}
                        </span>
                        <span className="flex items-center bg-emerald-600/30 px-2 py-0.5 rounded-full">
                          <span className="bg-white w-1.5 h-1.5 rounded-full mr-1.5"></span>
                          {student.status_daftar_kp}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/95 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                    {student.nim}
                  </div>
                </div>
              </div>

              {/* Profile Details - Compact Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border-t border-gray-100 dark:border-gray-600">
                <div className="p-3 flex items-center gap-2 border-r border-gray-100 dark:border-gray-600 border-b lg:border-b-0">
                  <Award className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">
                      Instansi
                    </div>
                    <div className="font-semibold text-xs text-gray-800 dark:text-gray-200 truncate">
                      {student.instansi}
                    </div>
                  </div>
                </div>
                <div className="p-3 flex items-center gap-2 border-r lg:border-r border-gray-100 dark:border-gray-600 border-b lg:border-b-0">
                  <Building className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">
                      Pembimbing Instansi
                    </div>
                    <div className="font-semibold text-xs text-gray-800 dark:text-gray-200 truncate">
                      {student.pembimbing_instansi}
                    </div>
                  </div>
                </div>
                <div className="p-3 flex items-center gap-2 border-r border-gray-100 dark:border-gray-600">
                  <GraduationCap className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">
                      Dosen Pembimbing
                    </div>
                    <div className="font-semibold text-xs text-gray-800 dark:text-gray-200 truncate">
                      {student.dosen_pembimbing}
                    </div>
                  </div>
                </div>
                <div className="p-3 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">
                      Dosen Penguji
                    </div>
                    <div className="font-semibold text-xs text-gray-800 dark:text-gray-200 truncate">
                      {student.dosen_penguji}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Scrollable Content - Compact */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="w-full space-y-3">
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4">
                <div className="text-center">
                  <div className="text-xs font-medium opacity-90 mb-1">
                    NILAI AKHIR
                  </div>
                  <div className="text-2xl font-bold mb-0.5">
                    {student.nilai_akhir?.toFixed(2) || "0.0"} (
                    {student.nilai_huruf || "N/A"})
                  </div>
                </div>
              </div>

              <div className="p-4">
                {/* Grade Cards Grid - Compact */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Nilai Pembimbing Instansi Card */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-3 text-center">
                      <h3 className="font-semibold text-xs">
                        Pembimbing Instansi
                      </h3>
                    </div>
                    <div className="p-4 text-center">
                      {student.nilai_instansi ? (
                        <>
                          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                            {student.nilai_instansi}
                          </div>
                          <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                            ✓ Sudah Dinilai
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-lg font-bold text-red-500 dark:text-red-400 mb-1">
                            Belum Dinilai
                          </div>
                          <div className="text-xs text-red-500 dark:text-red-400">
                            Menunggu Penilaian
                          </div>
                        </>
                      )}
                    </div>
                    {student.komponen_nilai_instansi && (
                      <div className="px-3 pb-3">
                        {renderKomponenGrid(
                          student.komponen_nilai_instansi,
                          instansiLabels
                        )}
                      </div>
                    )}
                  </div>

                  {/* Nilai Dosen Pembimbing Card */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 text-center">
                      <h3 className="font-semibold text-xs">
                        Dosen Pembimbing
                      </h3>
                    </div>
                    <div className="p-4 text-center">
                      {student.nilai_pembimbing ? (
                        <>
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                            {student.nilai_pembimbing}
                          </div>
                          <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                            ✓ Sudah Dinilai
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-lg font-bold text-red-500 dark:text-red-400 mb-1">
                            Belum Dinilai
                          </div>
                          <div className="text-xs text-red-500 dark:text-red-400">
                            Menunggu Penilaian
                          </div>
                        </>
                      )}
                    </div>
                    {student.komponen_nilai_pembimbing && (
                      <div className="px-3 pb-3">
                        {renderKomponenGrid(
                          student.komponen_nilai_pembimbing,
                          pembimbingLabels
                        )}
                      </div>
                    )}
                  </div>

                  {/* Nilai Dosen Penguji Card */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 text-center">
                      <h3 className="font-semibold text-xs">Dosen Penguji</h3>
                    </div>
                    <div className="p-4 text-center">
                      {student.nilai_penguji ? (
                        <>
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                            {student.nilai_penguji}
                          </div>
                          <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                            ✓ Sudah Dinilai
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-lg font-bold text-red-500 dark:text-red-400 mb-1">
                            Belum Dinilai
                          </div>
                          <div className="text-xs text-red-500 dark:text-red-400">
                            Menunggu Penilaian
                          </div>
                        </>
                      )}
                    </div>
                    {student.komponen_nilai_penguji && (
                      <div className="px-3 pb-3">
                        {renderKomponenGrid(
                          student.komponen_nilai_penguji,
                          pengujiLabels
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailNilaiModal;
