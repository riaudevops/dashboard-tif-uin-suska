import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, BookOpen, Award, Building } from "lucide-react";

interface ReviewBimbinganProps {
  isOpen: boolean;
  onClose: () => void;
  reportData?: any;
}

const ReviewBimbingan = ({
  isOpen,
  onClose,
  reportData,
}: ReviewBimbinganProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isOpen) {
      timer = setTimeout(() => {
        setShowContent(true);
      }, 100);
    } else {
      setShowContent(false);
    }

    // Handle ESC key to close modal
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowContent(false);
        setTimeout(onClose, 300);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Default data if none is provided
  const data = reportData || {
    status: "Diterima",
    nama: "Abmi Sukma",
    nim: "12250120341",
    dosenPembimbing: "Yelfi Vitriani, S.Kom., M.M.S.I.",
    pembimbingInstansi: "Sarinah, M. Pd",
    evaluasi:
      "Kamu sudah bagus dalam kerja sama tim, lanjutkan dan semangat!!!",
    tanggal: "20 Januari 2025",
    judul:
      "PERANCANGAN SISTEM INFORMASI PEMANTAUAN PERKEMBANGAN STATUS PERBAIKAN KOMPUTER BERBASIS WEB DI PT. PERTAMINA",
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.25, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.25, ease: "easeInOut" },
    },
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
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
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
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/10  flex items-center justify-center z-50"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backdropVariants}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowContent(false);
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
            {/* Close button at the top */}
            <motion.button
              onClick={() => {
                setShowContent(false);
                setTimeout(onClose, 250);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Header */}
            <motion.div
              className="flex justify-center items-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="text-center">
                <div className="flex justify-center mb-2"></div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white bg-clip-text">
                  Review Bimbingan
                </h2>
              </div>
            </motion.div>

            {/* Content */}
            <AnimatePresence>
              {showContent && (
                <motion.div
                  className="flex-1"
                  initial="hidden"
                  animate="visible"
                  variants={contentVariants}
                >
                  {/* Title box - Now above the columns */}
                  <motion.div className="mb-6" variants={itemVariants}>
                    <div className="p-5 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-100 dark:border-purple-800/30 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                        <Award className="w-4 h-4 mr-2 text-purple-500" />
                        JUDUL KERJA PRAKTIK
                      </h3>
                      <p className="text-gray-800 dark:text-gray-200 font-medium break-words whitespace-normal overflow-hidden text-sm md:text-base">
                        {data.judul}
                      </p>
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left column - Student Information */}
                    <motion.div className="space-y-5" variants={itemVariants}>
                      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                        {/* Section header */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                          <h3 className="font-medium text-gray-700 dark:text-gray-300">
                            Informasi Bimbingan
                          </h3>
                        </div>

                        {/* Info list items */}
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                          {/* Tanggal */}
                          <div className="flex px-6 py-4">
                            <div className="rounded-full p-2 bg-blue-50 dark:bg-blue-900/20 mr-4 mt-1">
                              <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                                TANGGAL BIMBINGAN 
                              </p>
                              <p className="font-medium text-gray-800 dark:text-gray-200">
                                {data.tanggal}
                              </p>
                            </div>
                          </div>

                          {/* Nama */}
                          <div className="flex items-start px-6 py-4">
                            <div className="rounded-full p-2 bg-green-50 dark:bg-green-900/20 mr-4 mt-1">
                              <User className="w-4 h-4 text-green-500 dark:text-green-400" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                                NAMA MAHASISWA 
                              </p>
                              <p className="font-medium text-gray-800 dark:text-gray-200">
                                {data.nama}
                              </p>
                            </div>
                          </div>

                          {/* NIM */}
                          <div className="flex items-start px-6 py-4">
                            <div className="rounded-full p-2 bg-indigo-50 dark:bg-indigo-900/20 mr-4 mt-1">
                              <User className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                                NIM
                              </p>
                              <p className="font-medium text-gray-800 dark:text-gray-200">
                                {data.nim}
                              </p>
                            </div>
                          </div>

                          {/* Dosen */}
                          <div className="flex items-start px-6 py-4">
                            <div className="rounded-full p-2 bg-amber-50 dark:bg-amber-900/20 mr-4 mt-1">
                              <BookOpen className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                                DOSEN PEMBIMBING
                              </p>
                              <p className="font-medium text-gray-800 dark:text-gray-200">
                                {data.dosenPembimbing}
                              </p>
                            </div>
                          </div>

                          {/* Instansi */}
                          <div className="flex items-start px-6 py-4">
                            <div className="rounded-full p-2 bg-purple-50 dark:bg-purple-900/20 mr-4 mt-1">
                              <Building className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                                PEMBIMBING INSTANSI
                              </p>
                              <p className="font-medium text-gray-800 dark:text-gray-200">
                                {data.pembimbingInstansi}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Right column - Report details */}
                    <motion.div
                      className="md:col-span-2"
                      variants={itemVariants}
                    >
                      <div className="h-full">
                        <div className="p-6 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm h-full">
                          <h3 className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold mb-4">
                            <div className="rounded-full p-2 bg-indigo-50 dark:bg-indigo-900/20">
                              <Award className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                            </div>
                            EVALUASI BIMBINGAN
                          </h3>

                          <div className="mt-4 p-5 rounded-lg bg-gray-50 dark:bg-gray-700/30 shadow-inner">
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                              {data.evaluasi}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReviewBimbingan;
