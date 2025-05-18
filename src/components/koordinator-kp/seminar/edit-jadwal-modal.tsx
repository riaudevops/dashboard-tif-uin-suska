import { type FC, useState } from "react";
import {
  Calendar,
  Clock,
  Building,
  User,
  GraduationCap,
  MapPin,
  FileText,
} from "lucide-react";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Seminar {
  id: number;
  namaMahasiswa: string;
  ruangan: string;
  jam: string;
  tanggalSeminar: string;
  dosenPenguji: string;
  status: "terjadwal" | "selesai" | "diganti";
}

interface EditJadwalSeminarModalProps {
  isOpen: boolean;
  onClose: () => void;
  seminar: Seminar | null;
  onSave: (updatedSeminar: Seminar) => void;
}

const EditJadwalSeminarModal: FC<EditJadwalSeminarModalProps> = ({
  isOpen,
  onClose,
  seminar,
  onSave,
}) => {
  if (!seminar) return null;

  const [editSeminar, setEditSeminar] = useState<Seminar>({ ...seminar });
  // const [isEditJadwal, setIsEditJadwal] = useState(false);
  // const [isEditDosenPenguji, setIsEditDosenPenguji] = useState(false);

  // Dummy data for dropdowns
  const ruanganOptions = ["FST301", "FST302", "FST303", "FST304", "FST305"];
  const dosenOptions = [
    "Dr. Ahmad Fauzi",
    "Dr. Siti Aminah",
    "Prof. Arif Rahman",
    "Dr. Dewi Susanti",
    "Prof. Eko Prasetyo",
  ];

  const handleInputChange = (field: keyof Seminar, value: string) => {
    setEditSeminar((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(editSeminar);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-xl bg-white dark:bg-gray-900">
        {/* Header with gradient */}
        <div className="px-4 pt-8">
          <DialogHeader>
            {/* Student Profile Card */}
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-emerald-600 dark:to-teal-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-2 w-12 h-12 flex items-center justify-center shadow-sm">
                      <User className="text-emerald-600 dark:text-emerald-400 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {seminar.namaMahasiswa}
                      </h3>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-white/90 dark:bg-gray-800/90 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full shadow-sm text-center">
                          Semester 6
                        </span>
                        <span className="flex items-center bg-emerald-600/40 dark:bg-emerald-700/40 px-2 py-0.5 rounded-full">
                          <span className="bg-white dark:bg-gray-200 w-1.5 h-1.5 rounded-full mr-1"></span>
                          LANJUT
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/90 dark:bg-gray-800/90 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-md text-xs font-medium shadow-sm">
                    12250111527
                  </div>
                </div>
              </div>

              {/* Profile Details - horizontal layout */}
              <div className="grid grid-cols-4 gap-0 border-t border-gray-100 dark:border-gray-700">
                <div className="p-3 flex items-center gap-2 border-r border-gray-100 dark:border-gray-700">
                  <Building className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                  <div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      INSTANSI
                    </div>
                    <div className="font-medium text-xs text-gray-800 dark:text-gray-200">
                      PT RAPP
                    </div>
                  </div>
                </div>
                <div className="p-3 flex items-center gap-2 border-r border-gray-100 dark:border-gray-700">
                  <User className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                  <div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      PEMBIMBING INSTANSI
                    </div>
                    <div className="font-medium text-xs text-gray-800 dark:text-gray-200">
                      MR. JOHN DOE
                    </div>
                  </div>
                </div>
                <div className="p-3 flex items-center gap-2 border-r border-gray-100 dark:border-gray-700">
                  <GraduationCap className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                  <div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      DOSEN PEMBIMBING
                    </div>
                    <div className="font-medium text-xs text-gray-800 dark:text-gray-200">
                      PIZAINI, S.T, M.Kom
                    </div>
                  </div>
                </div>
                <div className="p-3 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                  <div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      DOSEN PENGUJI
                    </div>
                    <div className="font-medium text-xs text-gray-800 dark:text-gray-200">
                      {editSeminar.dosenPenguji}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Main content - scrollable */}
        <div className="overflow-y-auto flex-1 px-5 py-4 bg-gray-50 dark:bg-gray-900">
          {/* Form Section */}
          <div className="my-4">
            <h3 className="text-base font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
              PENGATURAN ULANG JADWAL DAN DOSEN PENGUJI
            </h3>

            <div className="space-y-6">
              {/* Edit Jadwal Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="ruangan"
                        className="text-xs text-gray-500 dark:text-gray-400 mb-1 block"
                      >
                        Ruangan Seminar
                      </Label>
                      <div className="relative">
                        <MapPin className="h-4 w-4 absolute left-3 top-3 text-gray-400 z-10" />
                        <Select
                          value={editSeminar.ruangan}
                          onValueChange={(value) =>
                            handleInputChange("ruangan", value)
                          }
                        >
                          <SelectTrigger
                            id="ruangan"
                            className="bg-white dark:bg-gray-800 pl-9"
                          >
                            <SelectValue placeholder="Pilih ruangan seminar" />
                          </SelectTrigger>
                          <SelectContent>
                            {ruanganOptions.map((room) => (
                              <SelectItem key={room} value={room}>
                                {room}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="tanggalSeminar"
                          className="text-xs text-gray-500 dark:text-gray-400 mb-1 block"
                        >
                          Tanggal Seminar
                        </Label>
                        <div className="relative">
                          <Calendar className="h-4 w-4 absolute left-3 top-2.5 text-gray-400" />
                          <Input
                            id="tanggalSeminar"
                            type="date"
                            value={editSeminar.tanggalSeminar}
                            onChange={(e) =>
                              handleInputChange(
                                "tanggalSeminar",
                                e.target.value
                              )
                            }
                            className="pl-9 bg-white dark:bg-gray-800"
                          />
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="jamSeminar"
                          className="text-xs text-gray-500 dark:text-gray-400 mb-1 block"
                        >
                          Jadwal Seminar
                        </Label>
                        <div className="relative">
                          <Clock className="h-4 w-4 absolute left-3 top-2.5 text-gray-400" />
                          <Input
                            id="jamSeminar"
                            type="time"
                            value={editSeminar.jam}
                            onChange={(e) =>
                              handleInputChange("jam", e.target.value)
                            }
                            className="pl-9 bg-white dark:bg-gray-800"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Dosen Penguji Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-4">
                  <div>
                    <Label
                      htmlFor="pemilihanDosenPenguji"
                      className="text-xs text-gray-500 dark:text-gray-400 mb-1 block"
                    >
                      Pemilihan Dosen Penguji
                    </Label>
                    <p className="text-xs text-gray-400 mb-2">
                      Pilih nama dosen penguji dari daftar
                    </p>
                    <div className="relative">
                      <GraduationCap className="h-4 w-4 absolute left-3 top-3 text-gray-400 z-10" />
                      <Select
                        value={editSeminar.dosenPenguji}
                        onValueChange={(value) =>
                          handleInputChange("dosenPenguji", value)
                        }
                      >
                        <SelectTrigger
                          id="pemilihanDosenPenguji"
                          className="bg-white dark:bg-gray-800 pl-9"
                        >
                          <SelectValue placeholder="Pilih dosen penguji" />
                        </SelectTrigger>
                        <SelectContent>
                          {dosenOptions.map((dosen) => (
                            <SelectItem key={dosen} value={dosen}>
                              {dosen}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - fixed at bottom */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 rounded-b-xl">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Kembali
          </Button>
          <Button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Validasi Perubahan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditJadwalSeminarModal;
