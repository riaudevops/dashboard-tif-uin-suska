import { type FC, useState } from "react";
import {
  Check,
  X,
  User,
  Award,
  Building,
  GraduationCap,
  FileText,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ValidasiIDModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    id: number;
    nim: string;
    name: string;
    semester: number;
    status: string;
    dosenPembimbing: string;
    pembimbingInstansi: string;
    nilaiInstansi: string;
  } | null;
}

interface IDState {
  isRejected: boolean;
  isAccepted: boolean;
  rejectionReason: string;
}

const ValidasiIDModal: FC<ValidasiIDModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  if (!student) return null;

  // State for validation status
  const [idState, setIdState] = useState<IDState>({
    isRejected: false,
    isAccepted: false,
    rejectionReason: "",
  });

  // Form state for the new section
  const [formData, setFormData] = useState({
    ruanganSeminar: "",
    tanggalSeminar: "",
    jadwalSeminar: "",
    dosenPenguji: "",
  });

  const handleReject = () => {
    setIdState({
      isRejected: !idState.isRejected,
      isAccepted: false,
      rejectionReason: idState.isRejected ? "" : idState.rejectionReason,
    });
  };

  const handleAccept = () => {
    setIdState({
      isAccepted: !idState.isAccepted,
      isRejected: false,
      rejectionReason: "",
    });
  };

  const handleReasonChange = (reason: string) => {
    setIdState({
      ...idState,
      rejectionReason: reason,
    });
  };

  const handleFormChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleValidate = () => {
    // Perform validation logic here if needed (e.g., API call)
    onClose(); // Close the modal after validation
  };

  const ID = {
    title: "ID Surat Undangan",
    url: "12JDUAHAHIOH",
  };

  // Animation variants for the new section
  const sectionVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 rounded-xl bg-white dark:bg-gray-900">
        {/* Header with gradient */}
        <div className="px-4 pt-12">
          <DialogHeader>
            {/* Student Profile Card */}
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
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
              <div className="grid grid-cols-3 gap-0 border-t border-gray-100 dark:border-gray-700">
                <div className="p-3 flex items-center gap-2 border-r border-gray-100 dark:border-gray-700">
                  <Award className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                  <div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Nilai Instansi
                    </div>
                    <div className="font-medium text-sm text-gray-800 dark:text-gray-200">
                      {student.nilaiInstansi}
                    </div>
                  </div>
                </div>
                <div className="p-3 flex items-center gap-2 border-r border-gray-100 dark:border-gray-700">
                  <Building className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                  <div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Pembimbing Instansi
                    </div>
                    <div className="font-medium text-sm text-gray-800 dark:text-gray-200">
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
                    <div className="font-medium text-sm text-gray-800 dark:text-gray-200">
                      {student.dosenPembimbing}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Main content - scrollable */}
        <div className="overflow-y-auto flex-1 px-3 bg-gray-50 dark:bg-gray-900">
          {/* Validation ID Section */}
          <div className="my-4">
            <h3 className="text-sm font-medium flex items-center mb-3 text-gray-600 dark:text-gray-300">
              <FileText className="w-4 h-4 mr-2 text-emerald-500 dark:text-emerald-400" />
              Validasi ID Surat Undangan
            </h3>

            {/* Document Display */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-700 transition-all">
              <div className="border-b border-gray-100 dark:border-gray-700 p-2.5 bg-gray-50 dark:bg-gray-800/80">
                <p className="font-medium text-xs text-gray-600 dark:text-gray-300 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-2"></span>
                  {ID.title}
                </p>
              </div>
              <div className="p-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 truncate max-w-lg">
                    <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                    <span className="truncate">{ID.url}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-7 w-7 p-0 rounded-full ${
                        idState.isRejected
                          ? "bg-red-100 text-red-600 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                          : "text-gray-400 border-gray-200 dark:text-gray-500 dark:border-gray-700"
                      }`}
                      onClick={handleReject}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-7 w-7 p-0 rounded-full ${
                        idState.isAccepted
                          ? "bg-green-100 text-green-600 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                          : "text-gray-400 border-gray-200 dark:text-gray-500 dark:border-gray-700"
                      }`}
                      onClick={handleAccept}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Rejection Reason Textarea */}
              <div
                className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out ${
                  idState?.isRejected
                    ? "max-h-32 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <Textarea
                  placeholder="Masukkan alasan penolakan..."
                  value={idState?.rejectionReason || ""}
                  onChange={(e) => handleReasonChange(e.target.value)}
                  className="w-full text-sm border-gray-200 dark:border-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* New Section - Appears with animation when "Check" is clicked */}
          {idState.isAccepted && (
            <motion.div
              className="my-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4"
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
            >
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Validasi ID FST Surat Undangan
              </h4>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label
                    htmlFor="ruanganSeminar"
                    className="text-sm text-gray-600 dark:text-gray-300"
                  >
                    Ruangan Seminar
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="ruanganSeminar"
                      placeholder="dd/mm/yyyy"
                      value={formData.ruanganSeminar}
                      onChange={(e) =>
                        handleFormChange("ruanganSeminar", e.target.value)
                      }
                      className="pl-10 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="tanggalSeminar"
                      className="text-sm text-gray-600 dark:text-gray-300"
                    >
                      Tanggal Seminar
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="tanggalSeminar"
                        placeholder="dd/mm/yyyy"
                        value={formData.tanggalSeminar}
                        onChange={(e) =>
                          handleFormChange("tanggalSeminar", e.target.value)
                        }
                        className="pl-10 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="jadwalSeminar"
                      className="text-sm text-gray-600 dark:text-gray-300"
                    >
                      Jadwal Seminar
                    </Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="jadwalSeminar"
                        placeholder="dd/mm/yyyy"
                        value={formData.jadwalSeminar}
                        onChange={(e) =>
                          handleFormChange("jadwalSeminar", e.target.value)
                        }
                        className="pl-10 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="dosenPenguji"
                    className="text-sm text-gray-600 dark:text-gray-300"
                  >
                    Pemilihan Dosen Penguji
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Ketik Nama Dosen atau Bidang Keilmuan nya!
                  </p>
                  <Select
                    onValueChange={(value) =>
                      handleFormChange("dosenPenguji", value)
                    }
                  >
                    <SelectTrigger
                      id="dosenPenguji"
                      className="text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                    >
                      <SelectValue placeholder="Nama Dosen Penguji" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dosen A">Dosen A</SelectItem>
                      <SelectItem value="Dosen B">Dosen B</SelectItem>
                      <SelectItem value="Dosen C">Dosen C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Action Buttons - fixed at bottom with gradient */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800 p-3 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2 rounded-b-xl">
          <Button
            variant="outline"
            className={`text-red-500 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 text-xs px-3 rounded-sm shadow-sm ${
              idState.isRejected
                ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800"
                : ""
            }`}
            onClick={handleReject}
            disabled={idState.isAccepted}
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Tolak
          </Button>
          <Button
            className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 hover:from-emerald-600 hover:to-teal-600 dark:hover:from-emerald-500 dark:hover:to-teal-500 border-0 h-8 text-xs px-4 rounded-sm shadow-sm flex items-center"
            onClick={handleValidate}
            disabled={idState.isRejected}
          >
            Validasi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ValidasiIDModal;
