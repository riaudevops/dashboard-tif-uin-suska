import { type FC, useState } from "react";
import {
  Check,
  X,
  Eye,
  User,
  Award,
  Building,
  GraduationCap,
  FileText,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ValidasiSuratUndanganModalProps {
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
    pembimbingInstansi: string;
    nilaiInstansi: string;
  } | null;
}

interface DocumentState {
  id: string;
  isRejected: boolean;
  isAccepted: boolean;
  rejectionReason: string;
}

const ValidasiSuratUndanganModal: FC<ValidasiSuratUndanganModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  if (!student) return null;

  const [documents, setDocuments] = useState<DocumentState[]>([
    { id: "doc1", isRejected: false, isAccepted: false, rejectionReason: "" },
    { id: "doc2", isRejected: false, isAccepted: false, rejectionReason: "" },
    { id: "doc3", isRejected: false, isAccepted: false, rejectionReason: "" },
  ]);

  const handleReject = (docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              isRejected: !doc.isRejected, // Toggle rejection state
              isAccepted: false,
              rejectionReason: doc.isRejected ? "" : doc.rejectionReason, // Clear reason if unselecting
            }
          : doc
      )
    );
  };

  const handleAccept = (docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              isAccepted: !doc.isAccepted, // Toggle acceptance state
              isRejected: false,
              rejectionReason: "", // Clear reason if accepting or unselecting
            }
          : doc
      )
    );
  };

  const handleReasonChange = (docId: string, reason: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId ? { ...doc, rejectionReason: reason } : doc
      )
    );
  };

  const documentList = [
    {
      id: "doc1",
      title: "Surat Undangan Seminar",
      url: "https://drive.google.com/drive/folders/file.pdf",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col p-0 rounded-xl bg-white dark:bg-gray-900">
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
              <div className="grid grid-cols-4 gap-0 border-t border-gray-100 dark:border-gray-700">
                <div className="p-3 flex items-center gap-2 border-r border-gray-100 dark:border-gray-700">
                  <Award className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                  <div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Nilai Instansi
                    </div>
                    <div className="font-medium text-xs text-gray-800 dark:text-gray-200">
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
          </DialogHeader>
        </div>

        {/* Main content - scrollable */}
        <div className="overflow-y-auto flex-1 px-3 bg-gray-50 dark:bg-gray-900">
          {/* Validation Documents Section */}
          <div className="my-4">
            <h3 className="text-sm font-medium flex items-center mb-3 text-gray-600 dark:text-gray-300">
              <FileText className="w-4 h-4 mr-2 text-emerald-500 dark:text-emerald-400" />
              Validasi Berkas Surat Undangan
            </h3>

            {/* Document List */}
            <div className="space-y-2">
              {documentList.map((doc) => {
                const docState = documents.find((d) => d.id === doc.id);
                return (
                  <div
                    key={doc.id}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
                  >
                    <div className="border-b border-gray-100 dark:border-gray-700 p-2.5 bg-gray-50 dark:bg-gray-800/80">
                      <p className="font-medium text-xs text-gray-600 dark:text-gray-300 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-2"></span>
                        {doc.title}
                      </p>
                    </div>
                    <div className="p-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 truncate max-w-lg">
                          <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                          <span className="truncate">{doc.url}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 rounded-full p-0 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className={`h-6 w-6 rounded-full p-0 ${
                              docState?.isRejected
                                ? "text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/50"
                                : "text-gray-500 dark:text-gray-400"
                            } hover:text-red-500 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50`}
                            onClick={() => handleReject(doc.id)}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className={`h-6 w-6 rounded-full p-0 ${
                              docState?.isAccepted
                                ? "text-emerald-500 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50"
                                : "text-gray-500 dark:text-gray-400"
                            } hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50`}
                            onClick={() => handleAccept(doc.id)}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div
                        className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out ${
                          docState?.isRejected
                            ? "max-h-32 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <Textarea
                          placeholder="Masukkan alasan penolakan..."
                          value={docState?.rejectionReason || ""}
                          onChange={(e) =>
                            handleReasonChange(doc.id, e.target.value)
                          }
                          className="w-full text-sm border-gray-200 dark:border-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons - fixed at bottom with gradient */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800 p-3 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2 rounded-b-xl">
          <Button
            variant="outline"
            className="text-red-500 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 text-xs px-3 rounded-sm shadow-sm"
          >
            Tolak
          </Button>
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 hover:from-emerald-600 hover:to-teal-600 dark:hover:from-emerald-500 dark:hover:to-teal-500 border-0 h-8 text-xs px-4 rounded-sm shadow-sm flex items-center">
            Validasi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ValidasiSuratUndanganModal;
