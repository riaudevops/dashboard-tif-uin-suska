import { type FC, useState, useEffect, useMemo } from "react";
import {
  Check,
  X,
  Eye,
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
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import APISeminarKP from "@/services/api/koordinator-kp/mahasiswa.service";

// Helper to get current date-time in WIB (UTC+7)
const getCurrentDateTime = () => {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
};

interface Dokumen {
  id: string;
  jenis_dokumen: string;
  link_path: string;
  tanggal_upload: string;
  status: string;
  komentar: string | null;
  id_pendaftaran_kp: string;
}

interface DokumenStep {
  step1: Dokumen[];
  step2: Dokumen[];
  step3: Dokumen[];
  step5: Dokumen[];
}

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
    dokumen?: DokumenStep;
    id_pendaftaran_kp?: string;
  } | null;
}

interface DocumentState {
  id: string;
  isRejected: boolean;
  isAccepted: boolean;
  rejectionReason: string;
}

const ValidasiIDModal: FC<ValidasiIDModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  const [documents, setDocuments] = useState<DocumentState[]>([]);
  const [showSection, setShowSection] = useState(false);
  const [formData, setFormData] = useState({
    nama_ruangan: "",
    tanggal: "",
    waktu_mulai: "",
    nip_penguji: "",
  });
  const queryClient = useQueryClient();

  const { data: dosenData = [] } = useQuery({
    queryKey: ["seminar-kp-dosen"],
    queryFn: APISeminarKP.getAllDosen,
  });

  const { data: ruanganData = [] } = useQuery({
    queryKey: ["seminar-kp-ruangan"],
    queryFn: APISeminarKP.getAllRuangan,
  });

  const validateMutation = useMutation({
    mutationFn: (id: string) => APISeminarKP.postValidasiDokumen({ id }),
    onSuccess: () => {
      toast({
        title: "✅ Berhasil",
        description: "Dokumen berhasil divalidasi.",
        duration: 3000,
      });
      queryClient.invalidateQueries({
        queryKey: ["koordinator-seminar-kp-detail", student?.nim],
      });
      queryClient.invalidateQueries({
        queryKey: ["koordinator-seminar-kp-dokumen"],
      });
    },
    onError: (error) => {
      toast({
        title: "❌ Gagal",
        description: `Gagal memvalidasi dokumen: ${(error as Error).message}`,
        duration: 3000,
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, komentar }: { id: string; komentar: string }) =>
      APISeminarKP.postTolakDokumen({ id, komentar }),
    onSuccess: () => {
      toast({
        title: "✅ Berhasil",
        description: "Dokumen berhasil ditolak.",
        duration: 3000,
      });
      queryClient.invalidateQueries({
        queryKey: ["koordinator-seminar-kp-detail", student?.nim],
      });
      queryClient.invalidateQueries({
        queryKey: ["koordinator-seminar-kp-dokumen"],
      });
    },
    onError: (error) => {
      toast({
        title: "❌ Gagal",
        description: `Gagal menolak dokumen: ${(error as Error).message}`,
        duration: 3000,
      });
    },
  });

  const scheduleMutation = useMutation({
    mutationFn: () => {
      if (!student?.id_pendaftaran_kp) {
        throw new Error("ID Pendaftaran KP tidak ditemukan!");
      }
      const payload = {
        tanggal: formData.tanggal, // Use raw string (e.g., "2025-05-20")
        waktu_mulai: formData.waktu_mulai, // Use raw string (e.g., "09:00")
        nim: student?.nim || "",
        nama_ruangan: formData.nama_ruangan,
        id_pendaftaran_kp: student?.id_pendaftaran_kp || "",
        nip_penguji: formData.nip_penguji,
      };
      console.log("Payload sent to postJadwal:", payload); // Verify payload
      return APISeminarKP.postJadwal(payload);
    },
    onSuccess: () => {
      toast({
        title: "✅ Berhasil",
        description: "Jadwal seminar berhasil disimpan.",
        duration: 3000,
      });
      queryClient.invalidateQueries({
        queryKey: ["koordinator-seminar-kp-dokumen"],
      });
      onClose();
    },
    onError: (error) => {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("ID Pendaftaran KP tidak ditemukan!")) {
        toast({
          title: "❌ Gagal",
          description:
            "ID Pendaftaran KP tidak ditemukan. Periksa data mahasiswa.",
          duration: 3000,
        });
      } else {
        if (
          errorMessage.includes("Waduh, dokumen nya belum divalidasi ni! 😭")
        ) {
          toast({
            title: "❌ Gagal",
            description: "Waduh, dokumen nya belum divalidasi ni! 😭",
            duration: 3000,
          });
        } else if (
          errorMessage.includes("Waduh, pendaftaran KP tidak ditemukan! 😭")
        ) {
          toast({
            title: "❌ Gagal",
            description: "Waduh, pendaftaran KP tidak ditemukan! 😭",
            duration: 3000,
          });
        } else if (errorMessage.includes("Jadwal mahasiswa konflik")) {
          toast({
            title: "❌ Gagal",
            description: errorMessage,
            duration: 3200,
          });
        } else if (errorMessage.includes("Jadwal dosen penguji konflik")) {
          toast({
            title: "❌ Gagal",
            description: errorMessage,
            duration: 3200,
          });
        } else if (errorMessage.includes("Jadwal dosen pembimbing konflik")) {
          toast({
            title: "❌ Gagal",
            description: errorMessage,
            duration: 3200,
          });
        } else if (errorMessage.includes("Ruangan tidak tersedia")) {
          toast({
            title: "❌ Gagal",
            description: "Ruangan tidak tersedia pada waktu yang dipilih",
            duration: 3200,
          });
        } else {
          toast({
            title: "❌ Gagal",
            description: `Gagal menyimpan jadwal: ${errorMessage}`,
            duration: 3200,
          });
        }
      }
    },
  });

  useEffect(() => {
    if (student && isOpen) {
      const initialDocs =
        student?.dokumen?.step2?.map((doc) => {
          let isAccepted = false;
          let isRejected = false;
          let rejectionReason = "";

          if (doc.status === "Divalidasi") {
            isAccepted = true;
          } else if (doc.status === "Ditolak" && doc.komentar) {
            isRejected = true;
            rejectionReason = doc.komentar || "";
          }

          return {
            id: doc.id,
            isRejected,
            isAccepted,
            rejectionReason,
          };
        }) || [];
      setDocuments(initialDocs);
      setShowSection(false);
      setFormData({
        nama_ruangan: "",
        tanggal: "",
        waktu_mulai: "",
        nip_penguji: "",
      });
    }
  }, [student, isOpen]);

  const supervisorNip = useMemo(() => {
    if (
      !student?.dosenPembimbing ||
      student.dosenPembimbing === "Tidak tersedia"
    ) {
      return undefined; // Ubah dari null ke undefined
    }
    const nipMatch = student.dosenPembimbing.match(/NIP: (\d+)/);
    return nipMatch ? nipMatch[1] : undefined; // Ubah dari null ke undefined
  }, [student]);

  const handleReject = (docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              isRejected: !doc.isRejected,
              isAccepted: false,
              rejectionReason: doc.isRejected ? "" : doc.rejectionReason,
            }
          : doc
      )
    );
    setShowSection(false);
  };

  const handleAccept = (docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              isAccepted: !doc.isAccepted,
              isRejected: false,
              rejectionReason: "",
            }
          : doc
      )
    );
    const acceptedDoc = documents.find((d) => d.id === docId);
    if (acceptedDoc && !acceptedDoc.isAccepted) {
      setShowSection(true);
    }
  };

  const handleReasonChange = (docId: string, reason: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId ? { ...doc, rejectionReason: reason } : doc
      )
    );
  };

  const handleViewDocument = (link: string) => {
    window.open(link, "_blank");
  };

  const handleFormChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirm = async () => {
    const hasAccepted = documents.some((doc) => doc.isAccepted);
    const hasRejected = documents.some((doc) => doc.isRejected);

    // Jika ada dokumen yang diterima dan showSection aktif, periksa field jadwal
    if (hasAccepted && showSection) {
      if (
        !formData.nama_ruangan ||
        !formData.tanggal ||
        !formData.waktu_mulai ||
        !formData.nip_penguji
      ) {
        toast({
          title: "❌ Gagal",
          description: "Semua field jadwal harus diisi.",
          duration: 3000,
        });
        return;
      }
    }

    // Jika hanya ada dokumen yang ditolak, pastikan alasan penolakan diisi
    const allRejectionsHaveReason = documents
      .filter((doc) => doc.isRejected)
      .every((doc) => doc.rejectionReason.trim() !== "");
    if (hasRejected && !allRejectionsHaveReason) {
      toast({
        title: "❌ Gagal",
        description:
          "Alasan penolakan harus diisi untuk semua dokumen yang ditolak.",
        duration: 3000,
      });
      return;
    }

    const validationPromises = documents
      .filter((doc) => doc.isAccepted)
      .map((doc) => validateMutation.mutateAsync(doc.id));

    const rejectionPromises = documents
      .filter((doc) => doc.isRejected && doc.rejectionReason)
      .map((doc) =>
        rejectMutation.mutateAsync({
          id: doc.id,
          komentar: doc.rejectionReason,
        })
      );

    try {
      await Promise.all([...validationPromises, ...rejectionPromises]);
      if (hasAccepted && showSection) {
        const selectedDateTime = new Date(
          `${formData.tanggal} ${formData.waktu_mulai}`
        );
        const currentDateTime = getCurrentDateTime();
        if (selectedDateTime <= currentDateTime) {
          toast({
            title: "❌ Gagal",
            description: "Tanggal dan waktu harus lebih dari waktu saat ini.",
            duration: 3000,
          });
          return;
        }
        await scheduleMutation.mutateAsync();
      }
      toast({
        title: "✅ Berhasil",
        description: "Semua perubahan telah dikonfirmasi.",
        duration: 3000,
      });
      queryClient.invalidateQueries({
        queryKey: ["koordinator-seminar-kp-detail", student?.nim],
      });
      queryClient.invalidateQueries({
        queryKey: ["koordinator-seminar-kp-dokumen"],
      });
      onClose();
      setShowSection(false);
    } catch (error) {
      toast({
        title: "❌ Gagal",
        description: `Terjadi kesalahan: ${(error as Error).message}`,
        duration: 3000,
      });
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  if (!student) return null;

  const hasRejected = documents.some((doc) => doc.isRejected);
  const hasAccepted = documents.some((doc) => doc.isAccepted);
  const allRejectionsHaveReason = documents
    .filter((doc) => doc.isRejected)
    .every((doc) => doc.rejectionReason.trim() !== "");
  const canConfirm =
    documents.length > 0 &&
    (hasAccepted || hasRejected) &&
    (!hasRejected || allRejectionsHaveReason) &&
    (!showSection ||
      !hasAccepted ||
      (formData.nama_ruangan &&
        formData.tanggal &&
        formData.waktu_mulai &&
        formData.nip_penguji));
  const currentDateTime = getCurrentDateTime();
  const selectedDateTime =
    formData.tanggal && formData.waktu_mulai
      ? new Date(`${formData.tanggal} ${formData.waktu_mulai}`)
      : null;
  const isPastDateTime = selectedDateTime
    ? selectedDateTime <= currentDateTime
    : false; // Ubah agar selalu boolean

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col p-0 rounded-xl bg-white dark:bg-gray-900">
        <div className="px-4 pt-12">
          <DialogHeader>
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

        <div className="overflow-y-auto flex-1 px-3 bg-gray-50 dark:bg-gray-900">
          <div className="py-4">
            <h3 className="text-sm font-medium flex items-center mb-3 text-gray-600 dark:text-gray-300">
              <FileText className="w-4 h-4 mr-2 text-emerald-500 dark:text-emerald-400" />
              Validasi ID Surat Undangan
            </h3>

            <div className="space-y-2">
              {student.dokumen?.step2 && student.dokumen.step2.length > 0 ? (
                student.dokumen.step2.map((doc) => {
                  const docState = documents.find((d) => d.id === doc.id);
                  return (
                    <div
                      key={doc.id}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
                    >
                      <div className="border-b border-gray-100 dark:border-gray-700 p-2.5 bg-gray-50 dark:bg-gray-800/80">
                        <p className="font-medium text-xs text-gray-600 dark:text-gray-300 flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-2"></span>
                          ID Surat Undangan
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Status: {doc.status || "Belum Diproses"}
                        </p>
                      </div>
                      <div className="p-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-lg text-gray-500 dark:text-gray-400 truncate max-w-lg">
                            <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                            <span className="truncate">{doc.link_path}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 rounded-full p-0 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                              onClick={() => handleViewDocument(doc.link_path)}
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
                              } hover:text-red-500 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 ${
                                doc.status === "Divalidasi"
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              onClick={() =>
                                doc.status !== "Divalidasi" &&
                                handleReject(doc.id)
                              }
                              disabled={doc.status === "Divalidasi"}
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
                })
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ID belum dikirim.
                </p>
              )}
            </div>
          </div>

          {showSection &&
            student.dokumen?.step2 &&
            student.dokumen.step2.length > 0 && (
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4"
                initial="hidden"
                animate="visible"
                variants={sectionVariants}
              >
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="nama_ruangan"
                      className="text-sm text-gray-600 dark:text-gray-300"
                    >
                      Ruangan Seminar
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        handleFormChange("nama_ruangan", value)
                      }
                      value={formData.nama_ruangan}
                    >
                      <SelectTrigger
                        id="nama_ruangan"
                        className="text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                      >
                        <SelectValue placeholder="Pilih ruangan" />
                      </SelectTrigger>
                      <SelectContent>
                        {ruanganData.map((ruangan: any) => (
                          <SelectItem key={ruangan.nama} value={ruangan.nama}>
                            {ruangan.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label
                        htmlFor="tanggal"
                        className="text-sm text-gray-600 dark:text-gray-300"
                      >
                        Tanggal Seminar
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="tanggal"
                          type="date"
                          value={formData.tanggal}
                          onChange={(e) =>
                            handleFormChange("tanggal", e.target.value)
                          }
                          className="pl-10 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="waktu_mulai"
                        className="text-sm text-gray-600 dark:text-gray-300"
                      >
                        Waktu Mulai
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="waktu_mulai"
                          type="time"
                          value={formData.waktu_mulai}
                          onChange={(e) =>
                            handleFormChange("waktu_mulai", e.target.value)
                          }
                          className="pl-10 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="nip_penguji"
                      className="text-sm text-gray-600 dark:text-gray-300"
                    >
                      Dosen Penguji
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        handleFormChange("nip_penguji", value)
                      }
                      value={formData.nip_penguji}
                    >
                      <SelectTrigger
                        id="nip_penguji"
                        className="text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                      >
                        <SelectValue placeholder="Pilih dosen penguji" />
                      </SelectTrigger>
                      <SelectContent>
                        {dosenData
                          .filter((dosen: any) =>
                            supervisorNip !== undefined
                              ? dosen.nip !== supervisorNip
                              : true
                          )
                          .map((dosen: any) => (
                            <SelectItem key={dosen.nip} value={dosen.nip}>
                              {dosen.nama}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800 p-3 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2 rounded-b-xl">
          <Button
            className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 hover:from-emerald-600 hover:to-teal-600 dark:hover:from-emerald-500 dark:hover:to-teal-500 border-0 h-8 text-xs px-4 rounded-sm shadow-sm flex items-center"
            onClick={handleConfirm}
            disabled={!canConfirm || isPastDateTime}
          >
            Konfirmasi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ValidasiIDModal;
