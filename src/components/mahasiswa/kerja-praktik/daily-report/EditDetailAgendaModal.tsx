import { X, Save, TimerOffIcon, TimerResetIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import APIKerjaPraktik from "@/services/api/mahasiswa/daily-report.service";
import { toast } from "sonner";

interface EditDetailAgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  agenda: {
    id: number;
    waktu_mulai: string;
    waktu_selesai: string;
    judul_agenda: string;
    deskripsi_agenda: string;
  } | null;
  onSave?: (updatedData: any) => void;
}

const EditDetailAgendaModal = ({
  isOpen,
  onClose,
  agenda,
  onSave,
}: EditDetailAgendaModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    waktu_mulai: "",
    waktu_selesai: "",
    judul_agenda: "",
    deskripsi_agenda: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (agenda) {
      setFormData({
        waktu_mulai: agenda.waktu_mulai || "",
        waktu_selesai: agenda.waktu_selesai || "",
        judul_agenda: agenda.judul_agenda || "",
        deskripsi_agenda: agenda.deskripsi_agenda || "",
      });
      setError(null);
    } else {
      setFormData({
        waktu_mulai: "",
        waktu_selesai: "",
        judul_agenda: "",
        deskripsi_agenda: "",
      });
    }
  }, [agenda, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!agenda?.id) {
      setError("Data agenda tidak valid.");
      return;
    }

    try {
      await APIKerjaPraktik.putDetailDailyReport(agenda.id, formData);
      toast.success("Agenda berhasil diperbarui!", {
        style: {
          background: "#10B981",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
      });
      if (onSave) {
        onSave(formData);
      }
      setError(null);
      setTimeout(onClose, 300);
    } catch (err) {
      setError("Gagal menyimpan perubahan nih, silakan coba lagi! 😮‍💨");
      console.error("Error:", err);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25, ease: "easeInOut" } },
    exit: { opacity: 0, transition: { duration: 0.25, ease: "easeInOut" } },
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
        mass: 0.8,
        duration: 0.3,
      },
    },
    exit: {
      scale: 0.98,
      y: 10,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
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
              className="bg-white dark:bg-gray-800 rounded-xl py-6 px-8 w-[95%] md:max-w-[600px] max-h-[95vh] overflow-y-auto flex flex-col shadow-xl relative"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
            >
              <motion.button
                onClick={() => {
                  setTimeout(onClose, 200);
                }}
                className="absolute p-2 text-gray-600 transition-colors bg-gray-100 rounded-full top-4 right-4 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>

              <motion.div
                className="flex items-center justify-center mb-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Edit Agenda
                </h2>
              </motion.div>

              <AnimatePresence>
                <motion.div
                  className="flex-1"
                  initial="hidden"
                  animate="visible"
                  variants={contentVariants}
                >
                  <div className="space-y-4">
                    {error && (
                      <motion.div
                        className="p-3 text-red-800 bg-red-100 border border-red-200 rounded-md"
                        variants={itemVariants}
                      >
                        {error}
                      </motion.div>
                    )}
                    <motion.div
                      className="grid grid-cols-2 gap-4"
                      variants={itemVariants}
                    >
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Waktu Mulai
                        </label>
                        <div className="relative w-full mt-1.5">
                          <input
                            type="time"
                            name="waktu_mulai"
                            value={formData.waktu_mulai}
                            className="bg-secondary date-input w-full py-2 pl-10 pr-4 rounded-md border border-gray-300 dark:bg-gray-700 dark:text-white"
                            onChange={handleInputChange}
                          />
                          {/* Ikon di pojok kiri input */}
                          <TimerResetIcon className="absolute left-3 top-[20px] transform -translate-y-1/2 text-foreground w-5 h-5" />
                        </div>
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Waktu Selesai
                        </label>
                        <div className="relative w-full mt-1.5">
                          <input
                            type="time"
                            name="waktu_selesai"
                            value={formData.waktu_selesai}
                            className="bg-secondary date-input w-full py-2 pl-10 pr-4 rounded-md border border-gray-300 dark:bg-gray-700 dark:text-white"
                            onChange={handleInputChange}
                          />
                          {/* Ikon di pojok kiri input */}
                          <TimerOffIcon className="absolute left-3 top-[20px] transform -translate-y-1/2 text-foreground w-5 h-5" />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Judul Agenda
                      </label>
                      <Input
                        type="text"
                        name="judul_agenda"
                        value={formData.judul_agenda}
                        onChange={handleInputChange}
                        className="w-full dark:bg-gray-700 dark:text-white"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Deskripsi Agenda
                      </label>
                      <Textarea
                        name="deskripsi_agenda"
                        value={formData.deskripsi_agenda}
                        onChange={handleInputChange}
                        className="w-full h-32 dark:bg-gray-700 dark:text-white"
                      />
                    </motion.div>

                    <motion.div
                      className="flex justify-end gap-2 mt-6"
                      variants={itemVariants}
                    >
                      <Button
                        variant="outline"
                        onClick={() => {
                          setTimeout(onClose, 200);
                        }}
                      >
                        Batal
                      </Button>
                      <Button
                        onClick={handleSaveChanges}
                        className="text-white bg-green-500 hover:bg-green-600"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Simpan
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditDetailAgendaModal;
