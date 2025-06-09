import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, BookOpen, Award } from "lucide-react";

interface DetailBimbinganModalProps {
  isOpen: boolean;
  onClose: () => void;
  bimbinganSaya?: {
    judul: string;
    nama: string;
    nim: string;
    dosenPembimbing: string;
    evaluasi: string;
    tanggal: string;
  };
}

const DetailBimbinganModal = ({
  isOpen,
  onClose,
  bimbinganSaya,
}: DetailBimbinganModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const data = bimbinganSaya || {
    judul: "-",
    nama: "-",
    nim: "-",
    dosenPembimbing: "-",
    evaluasi: "-",
    tanggal: "-",
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
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/10"
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
            className="bg-white dark:bg-gray-800 rounded-2xl py-8 px-6 w-[92%] md:max-w-[1000px] max-h-[90vh] overflow-y-auto flex flex-col shadow-xl relative border border-gray-100 dark:border-gray-700"
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
              className="flex items-center justify-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                  Detail Bimbingan
                </h2>
              </div>
            </motion.div>

            <AnimatePresence>
              <motion.div
                className="flex-1"
                initial="hidden"
                animate="visible"
                variants={contentVariants}
              >
                <motion.div className="mb-6" variants={itemVariants}>
                  <div className="p-5 border border-purple-100 rounded-lg shadow-sm bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 dark:border-purple-800/30">
                    <h3 className="flex items-center mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                      <Award className="w-4 h-4 mr-2 text-purple-500" />
                      Judul Kerja Praktik
                    </h3>
                    <p className="overflow-hidden text-sm font-medium text-gray-800 break-words whitespace-normal dark:text-gray-200 md:text-base">
                      {data.judul}
                    </p>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  <motion.div className="space-y-5" variants={itemVariants}>
                    <div className="bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 dark:bg-gray-700/50 dark:border-gray-700">
                        <h3 className="font-medium text-gray-700 dark:text-gray-300">
                          Informasi Bimbingan
                        </h3>
                      </div>
                      <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        <div className="flex px-6 py-4">
                          <div className="p-2 mt-1 mr-4 rounded-full bg-blue-50 dark:bg-blue-900/20">
                            <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              Tanggal Bimbingan
                            </p>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              {data.tanggal}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start px-6 py-4">
                          <div className="p-2 mt-1 mr-4 rounded-full bg-green-50 dark:bg-green-900/20">
                            <User className="w-4 h-4 text-green-500 dark:text-green-400" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              Nama Mahasiswa
                            </p>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              {data.nama}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start px-6 py-4">
                          <div className="p-2 mt-1 mr-4 rounded-full bg-indigo-50 dark:bg-indigo-900/20">
                            <User className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              NIM
                            </p>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              {data.nim}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start px-6 py-4">
                          <div className="p-2 mt-1 mr-4 rounded-full bg-amber-50 dark:bg-amber-900/20">
                            <BookOpen className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              Dosen Pembimbing
                            </p>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              {data.dosenPembimbing}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div className="md:col-span-2" variants={itemVariants}>
                    <div className="h-full">
                      <div className="h-full p-6 bg-white border border-gray-100 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <h3 className="flex items-center gap-2 mb-4 font-semibold text-gray-700 dark:text-gray-300">
                          <div className="p-2 rounded-full bg-indigo-50 dark:bg-indigo-900/20">
                            <Award className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                          </div>
                          Evaluasi Bimbingan
                        </h3>
                        <div className="p-5 mt-4 rounded-lg shadow-inner bg-gray-50 dark:bg-gray-700/30">
                          <p className="text-gray-700 whitespace-pre-line dark:text-gray-300">
                            {data.evaluasi || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
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

export default DetailBimbinganModal;
