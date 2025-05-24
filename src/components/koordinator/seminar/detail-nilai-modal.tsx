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
      <div className="space-y-3">
        {Object.entries(komponenData).map(([key, value]) => {
          if (key === "masukan" || key === "catatan") {
            return (
              <div
                key={key}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4"
              >
                <div className="text-sm font-medium text-gray-700 mb-2">
                  {labels[key] ||
                    key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/_/g, " ")}
                </div>
                <div className="text-sm text-gray-600 leading-relaxed">
                  {value ||
                    "Tidak ada " + (key === "masukan" ? "masukan" : "catatan")}
                </div>
              </div>
            );
          }

          return (
            <div
              key={key}
              className="flex items-center justify-between py-3 px-4 bg-white border border-gray-200 rounded-lg"
            >
              <span className="text-sm font-medium text-gray-700">
                {labels[key] ||
                  key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
              </span>
              <span className="font-bold text-lg text-emerald-600">
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
    penguasaan_keilmuan: "Penguasaan Materi (40%)",
    kemampuan_presentasi: "Teknik Presentasi (25%)",
    kesesuaian_urgensi: "Kesesuaian Laporan dan Presentasi (35%)",
    catatan: "Catatan",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-screen overflow-hidden flex flex-col p-0 rounded-2xl bg-white shadow-2xl">
        {/* Header Section */}
        <div className="p-6 pb-4">
          <DialogHeader>
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-white">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/95 rounded-full p-2 w-12 h-12 flex items-center justify-center shadow-md">
                      <User className="text-emerald-600 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-1">{student.nama}</h3>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="bg-white/95 text-emerald-700 px-3 py-1 rounded-full shadow-sm font-medium">
                          Semester {student.semester}
                        </span>
                        <span className="flex items-center bg-emerald-600/30 px-3 py-1 rounded-full">
                          <span className="bg-white w-2 h-2 rounded-full mr-2"></span>
                          {student.status_daftar_kp}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/95 text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold shadow-md">
                    {student.nim}
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border-t border-gray-100">
                <div className="p-4 flex items-center gap-3 border-r border-gray-100 border-b lg:border-b-0">
                  <Award className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Instansi
                    </div>
                    <div className="font-semibold text-sm text-gray-800 truncate">
                      {student.instansi}
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-center gap-3 border-r lg:border-r border-gray-100 border-b lg:border-b-0">
                  <Building className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Pembimbing Instansi
                    </div>
                    <div className="font-semibold text-sm text-gray-800 truncate">
                      {student.pembimbing_instansi}
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-center gap-3 border-r border-gray-100">
                  <GraduationCap className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Dosen Pembimbing
                    </div>
                    <div className="font-semibold text-sm text-gray-800 truncate">
                      {student.dosen_pembimbing}
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-center gap-3">
                  <GraduationCap className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Dosen Penguji
                    </div>
                    <div className="font-semibold text-sm text-gray-800 truncate">
                      {student.dosen_penguji}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="w-full space-y-4">
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6">
                <div className="flex items-center justify-between w-full">
                  <div className="text-center flex-1">
                    <div className="text-sm font-medium opacity-90 mb-2">
                      NILAI AKHIR
                    </div>
                    <div className="text-4xl font-bold mb-1">
                      {student.nilai_akhir?.toFixed(1) || "0.0"}
                    </div>
                    <div className="text-xl font-semibold">
                      ({student.nilai_huruf || "N/A"})
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4">
                {/* Grade Cards Grid - Symmetric Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Nilai Pembimbing Instansi Card */}
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 text-center">
                      <h3 className="font-semibold text-sm">
                        Pembimbing Instansi
                      </h3>
                    </div>
                    <div className="p-6 text-center">
                      {student.nilai_instansi ? (
                        <>
                          <div className="text-3xl font-bold text-emerald-600 mb-2">
                            {student.nilai_instansi}
                          </div>
                          <div className="text-xs text-green-600 font-medium">
                            ✓ Sudah Dinilai
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-2xl font-bold text-red-500 mb-2">
                            Belum Dinilai
                          </div>
                          <div className="text-xs text-red-500">
                            Menunggu Penilaian
                          </div>
                        </>
                      )}
                    </div>
                    {student.komponen_nilai_instansi && (
                      <div className="px-6 pb-4">
                        {renderKomponenGrid(
                          student.komponen_nilai_instansi,
                          instansiLabels
                        )}
                      </div>
                    )}
                  </div>

                  {/* Nilai Dosen Pembimbing Card */}
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 text-center">
                      <h3 className="font-semibold text-sm">
                        Dosen Pembimbing
                      </h3>
                    </div>
                    <div className="p-6 text-center">
                      {student.nilai_pembimbing ? (
                        <>
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            {student.nilai_pembimbing}
                          </div>
                          <div className="text-xs text-green-600 font-medium">
                            ✓ Sudah Dinilai
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-2xl font-bold text-red-500 mb-2">
                            Belum Dinilai
                          </div>
                          <div className="text-xs text-red-500">
                            Menunggu Penilaian
                          </div>
                        </>
                      )}
                    </div>
                    {student.komponen_nilai_pembimbing && (
                      <div className="px-6 pb-4">
                        {renderKomponenGrid(
                          student.komponen_nilai_pembimbing,
                          pembimbingLabels
                        )}
                      </div>
                    )}
                  </div>

                  {/* Nilai Dosen Penguji Card */}
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 text-center">
                      <h3 className="font-semibold text-sm">Dosen Penguji</h3>
                    </div>
                    <div className="p-6 text-center">
                      {student.nilai_penguji ? (
                        <>
                          <div className="text-3xl font-bold text-purple-600 mb-2">
                            {student.nilai_penguji}
                          </div>
                          <div className="text-xs text-green-600 font-medium">
                            ✓ Sudah Dinilai
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-2xl font-bold text-red-500 mb-2">
                            Belum Dinilai
                          </div>
                          <div className="text-xs text-red-500">
                            Menunggu Penilaian
                          </div>
                        </>
                      )}
                    </div>
                    {student.komponen_nilai_penguji && (
                      <div className="px-6 pb-4">
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
