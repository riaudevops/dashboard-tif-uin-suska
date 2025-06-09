import { X } from "lucide-react";
import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DetailAgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  agenda: {
    id: number;
    waktu_mulai: string;
    waktu_selesai: string;
    judul_agenda: string;
    deskripsi_agenda: string;
  } | null;
}

const DetailAgendaModal = ({
  isOpen,
  onClose,
  agenda,
}: DetailAgendaModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

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
                Detail Agenda
              </h2>
            </motion.div>

            <AnimatePresence>
              <motion.div
                className="flex-1"
                initial="hidden"
                animate="visible"
                variants={contentVariants}
              >
                <div className="space-y-6">
                  {agenda ? (
                    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <div className="p-6">
                        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
                          <p className="font-medium text-gray-600 dark:text-gray-400">
                            {agenda.judul_agenda}
                          </p>
                          <p className="font-medium text-gray-600 dark:text-gray-400">
                            {agenda.waktu_mulai} - {agenda.waktu_selesai}
                          </p>
                        </div>
                        {/* <motion.div variants={itemVariants}>
                        <h4 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-200">
                          Judul Agenda
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          {agenda.judul_agenda}
                        </p>
                      </motion.div> */}
                        <motion.div className="mt-6" variants={itemVariants}>
                          {/* <h4 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-200">
                          Deskripsi Agenda
                        </h4> */}
                          <div className="p-4 border border-gray-300 border-dashed rounded-lg bg-gray-50 dark:bg-gray-700/30 dark:border-gray-600">
                            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                              {agenda.deskripsi_agenda ||
                                "Tidak ada deskripsi Agenda."}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      Tidak ada data agenda...
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DetailAgendaModal;
