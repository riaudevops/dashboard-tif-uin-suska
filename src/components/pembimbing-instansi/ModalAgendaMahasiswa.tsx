import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReviewDailyReportProps {
  isOpen: boolean;
  onClose: () => void;
  reportData?: {
    id: string;
    waktu_mulai: string;
    waktu_selesai: string;
    judul_agenda: string;
    deskripsi_agenda: string;
  };
}

const ModalAgendaMahasiswa = ({
  isOpen,
  onClose,
  reportData,
}: ReviewDailyReportProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

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
      transition: { type: "spring", damping: 30, stiffness: 400 },
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backdropVariants}
          onClick={() => {
            setTimeout(onClose, 250);
          }}
        >
          <motion.div
            ref={modalRef}
            className="bg-white dark:bg-gray-900 rounded-2xl py-6 px-8 w-[95%] md:max-w-[800px] max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            <Button
              onClick={() => {
                setTimeout(onClose, 250);
              }}
              className="absolute p-2 bg-gray-100 rounded-full top-4 right-4 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              variant="ghost"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Button>

            <motion.div
              className="flex items-center justify-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {reportData?.judul_agenda || ""}
              </h2>
            </motion.div>

            <AnimatePresence>
              <motion.div
                className="space-y-6"
                initial="hidden"
                animate="visible"
                variants={contentVariants}
              >
                <motion.div
                  className="flex items-center pb-4 mb-6 border-b border-gray-200 dark:border-gray-700"
                  variants={itemVariants}
                >
                  <Clock className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-300" />
                  <p className="font-medium text-gray-600 dark:text-gray-400">
                    {reportData?.waktu_mulai || ""} -{" "}
                    {reportData?.waktu_selesai || ""}
                  </p>
                </motion.div>
                {/* <motion.h3
                  className="text-xl font-semibold text-center text-gray-800 dark:text-white"
                  variants={itemVariants}
                >
                  {reportData?.judul_agenda || ""}
                </motion.h3> */}
                <motion.div variants={itemVariants}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      Deskripsi Agenda
                    </h4>
                    {/* <Button
                      variant="ghost"
                      onClick={handleCopy}
                      className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {isCopied ? (
                        <Check className="w-5 h-5 mr-1" />
                      ) : (
                        <Clipboard className="w-5 h-5 mr-1" />
                      )}
                      {isCopied ? "Tersalin" : "Salin"}
                    </Button> */}
                  </div>
                  <div className="p-6 border border-gray-300 border-dashed rounded-lg bg-gray-50 dark:bg-gray-800/30 dark:border-gray-600">
                    <p className="leading-relaxed text-gray-700 whitespace-pre-wrap dark:text-gray-300">
                      {reportData?.deskripsi_agenda || "Belum ada deskripsi..."}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalAgendaMahasiswa;
