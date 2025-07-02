import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import APIKerjaPraktik from "@/services/api/mahasiswa/daily-report.service";
import { TimerOffIcon, TimerResetIcon } from "lucide-react";

interface TambahAgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyReportId: string;
  onSave?: () => void;
}

const TambahAgendaModal = ({
  isOpen,
  onClose,
  dailyReportId,
  onSave,
}: TambahAgendaModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    waktu_mulai: "",
    waktu_selesai: "",
    judul_agenda: "",
    deskripsi_agenda: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    waktu_mulai?: string;
    waktu_selesai?: string;
    judul_agenda?: string;
    deskripsi_agenda?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      waktu_mulai?: string;
      waktu_selesai?: string;
      judul_agenda?: string;
      deskripsi_agenda?: string;
    } = {};

    if (!formData.waktu_mulai) {
      newErrors.waktu_mulai = "Waktu mulai wajib diisi.";
    }
    if (!formData.waktu_selesai) {
      newErrors.waktu_selesai = "Waktu selesai wajib diisi.";
    } else if (
      formData.waktu_mulai &&
      formData.waktu_selesai <= formData.waktu_mulai
    ) {
      newErrors.waktu_selesai = "Waktu selesai harus setelah waktu mulai.";
    }
    if (!formData.judul_agenda) {
      newErrors.judul_agenda = "Judul agenda wajib diisi.";
    }
    if (!formData.deskripsi_agenda) {
      newErrors.deskripsi_agenda = "Deskripsi agenda wajib diisi.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Harap isi semua field dengan benar.", {
        style: {
          background: "#EF4444",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await APIKerjaPraktik.postDetailDailyReport(dailyReportId, formData);
      toast.success("Agenda berhasil ditambahkan!", {
        style: {
          background: "#10B981",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
      });
      setFormData({
        waktu_mulai: "",
        waktu_selesai: "",
        judul_agenda: "",
        deskripsi_agenda: "",
      });
      if (onSave) onSave();
      setTimeout(onClose, 300);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal menambahkan Agenda!";
      toast.error(errorMessage, {
        style: {
          background: "#EF4444",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.25 } },
  };

  const modalVariants = {
    hidden: { scale: 0.95, y: 10, opacity: 0 },
    visible: {
      scale: 1,
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 400,
        duration: 0.3,
      },
    },
    exit: { scale: 0.98, y: 10, opacity: 0, transition: { duration: 0.2 } },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={backdropVariants}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setTimeout(onClose, 200);
              }
            }}
          >
            <motion.div
              ref={modalRef}
              className="bg-white dark:bg-gray-800 rounded-xl py-6 px-8 w-[95%] md:max-w-[600px] max-h-[95vh] overflow-y-auto flex flex-col shadow-xl"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
            >
              <motion.button
                onClick={() => {
                  setTimeout(onClose, 200);
                }}
                className="absolute p-2 text-gray-600 bg-gray-100 rounded-full top-4 right-4 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>

              <motion.h2
                className="mb-6 text-2xl font-bold text-center text-gray-800 dark:text-white"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Tambah Agenda
              </motion.h2>

              <AnimatePresence>
                <motion.form
                  onSubmit={handleSubmit}
                  className="flex flex-col flex-1 space-y-4"
                  initial="hidden"
                  animate="visible"
                  variants={contentVariants}
                >
                  <motion.div
                    className="grid grid-cols-2 gap-4"
                    variants={itemVariants}
                  >
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Waktu Mulai <span className="text-red-500">*</span>
                      </label>
                      <div className="relative w-full mt-1.5">
                        <input
                          type="time"
                          name="waktu_mulai"
                          value={formData.waktu_mulai}
                          className={`bg-secondary date-input w-full py-2 pl-10 pr-4 rounded-md border border-gray-300 dark:bg-gray-700 dark:text-white ${errors.waktu_mulai ? "border-red-500" : ""}`}
                          onChange={handleChange}
                        />
                        {/* Ikon di pojok kiri input */}
                        <TimerResetIcon className="absolute left-3 top-[20px] transform -translate-y-1/2 text-foreground w-5 h-5" />
                      </div>
                      {errors.waktu_mulai && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.waktu_mulai}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Waktu Selesai <span className="text-red-500">*</span>
                      </label>
                      <div className="relative w-full mt-1.5">
                        <input
                          type="time"
                          name="waktu_selesai"
                          value={formData.waktu_selesai}
                          className={`bg-secondary date-input w-full py-2 pl-10 pr-4 rounded-md border border-gray-300 dark:bg-gray-700 dark:text-white ${errors.waktu_mulai ? "border-red-500" : ""}`}
                          onChange={handleChange}
                        />
                        {/* Ikon di pojok kiri input */}
                        <TimerOffIcon className="absolute left-3 top-[20px] transform -translate-y-1/2 text-foreground w-5 h-5" />
                      </div>
                      {errors.waktu_selesai && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.waktu_selesai}
                        </p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Judul Agenda <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="judul_agenda"
                      value={formData.judul_agenda}
                      onChange={handleChange}
                      placeholder="Masukkan Judul Agenda"
                      className={`w-full dark:bg-gray-700 dark:text-white ${
                        errors.judul_agenda ? "border-red-500" : ""
                      }`}
                    />
                    {errors.judul_agenda && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.judul_agenda}
                      </p>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Deskripsi Agenda <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      name="deskripsi_agenda"
                      value={formData.deskripsi_agenda}
                      onChange={handleChange}
                      placeholder="Masukkan Deskripsi Agenda"
                      rows={4}
                      className={`w-full dark:bg-gray-700 dark:text-white ${
                        errors.deskripsi_agenda ? "border-red-500" : ""
                      }`}
                    />
                    {errors.deskripsi_agenda && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.deskripsi_agenda}
                      </p>
                    )}
                  </motion.div>

                  <motion.div
                    className="flex justify-end gap-2 mt-6"
                    variants={itemVariants}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setTimeout(onClose, 200);
                      }}
                      disabled={isSubmitting}
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="flex items-center gap-2 text-white bg-emerald-500 hover:bg-emerald-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Menyimpan...
                        </span>
                      ) : (
                        "Simpan"
                      )}
                    </Button>
                  </motion.div>
                </motion.form>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TambahAgendaModal;
