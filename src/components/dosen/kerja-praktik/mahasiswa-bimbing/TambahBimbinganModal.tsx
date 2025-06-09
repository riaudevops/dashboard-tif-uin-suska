import { X, Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";

interface TambahBimbinganModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (catatan_bimbingan: string) => void;
}

const TambahBimbinganModal = ({
  isOpen,
  onClose,
  onSave,
}: TambahBimbinganModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [catatanBimbingan, setCatatanBimbingan] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCatatanBimbingan("");
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!catatanBimbingan.trim()) {
      setError("Catatan bimbingan tidak boleh kosong.");
      return;
    }
    onSave(catatanBimbingan);
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25, ease: "easeInOut" } },
    exit: { opacity: 0, transition: { duration: 0.25, ease: "easeInOut" } },
  };

  const modalVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      scale: 0.98,
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
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/40 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backdropVariants}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setTimeout(onClose, 250);
            }
          }}
        >
          <motion.div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 rounded-xl py-6 px-8 w-[95%] md:max-w-[600px] max-h-[95vh] overflow-y-auto overflow-x-hidden flex flex-col shadow-xl relative"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            <motion.button
              onClick={() => {
                setTimeout(onClose, 250);
              }}
              className="absolute p-2 text-gray-600 transition-colors bg-gray-100 rounded-full top-4 right-4 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
            <motion.div
              className="flex items-center justify-center mb-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800 dark:text-white">
                Tambah Bimbingan
              </h2>
            </motion.div>
            <AnimatePresence>
              <motion.div
                className="flex-1"
                initial="hidden"
                animate="visible"
                variants={contentVariants}
              >
                <div className="space-y-5">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 text-red-700 bg-red-100 rounded-md"
                    >
                      {error}
                    </motion.div>
                  )}
                  <motion.div variants={itemVariants} className="group">
                    <Label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Catatan Bimbingan
                    </Label>
                    <Textarea
                      name="catatanBimbingan"
                      value={catatanBimbingan}
                      onChange={(e) => setCatatanBimbingan(e.target.value)}
                      placeholder="Masukkan catatan bimbingan..."
                      className="w-full h-32 p-4 transition-all border border-gray-300 rounded-lg shadow-sm resize-none dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white group-hover:border-blue-400"
                      aria-label="Catatan Bimbingan"
                    />
                  </motion.div>
                  <motion.div
                    className="flex justify-end mt-8"
                    variants={itemVariants}
                  >
                    <Button
                      onClick={handleSave}
                      disabled={!catatanBimbingan.trim()}
                      className={`flex items-center gap-2 px-8 py-3 rounded-lg text-white font-medium transition-all ${
                        catatanBimbingan.trim()
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      aria-label="Simpan Bimbingan"
                    >
                      <Save className="w-5 h-5" />
                      <span>Simpan</span>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TambahBimbinganModal;
