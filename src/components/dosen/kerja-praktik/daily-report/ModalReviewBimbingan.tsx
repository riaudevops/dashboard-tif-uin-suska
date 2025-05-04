import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ReviewBimbinganProps {
  isOpen: boolean;
  onClose: () => void;
  reportData?: any;
}

const ReviewBimbinganKP = ({
  isOpen,
  onClose,
  reportData,
}: ReviewBimbinganProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isOpen) {
      // Reduced delay for smoother appearance
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
      // Prevent scrolling of background content
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
    tanggal: "Jumat, 20/10/2024",
    waktu: "09:00/16:00",
    judul: "Design UI/UX Daily Report",
    deskripsiKegiatan:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
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
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
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
            className="bg-white dark:bg-gray-800 rounded-xl py-6 px-8 w-[95%] md:max-w-[1000px] max-h-[95vh] overflow-y-auto flex flex-col shadow-xl relative"
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
              className="flex justify-center items-center text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Review Bimbingan Kerja Praktik
              </h2>
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
                  <div className="space-y-4">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
                      <div className="p-4">
                        <h3 className="font-semibold text-xl text-center my-6 text-gray-800 dark:text-white">
                          {data.judul}
                        </h3>

                        {/* Report content - Only the description is kept */}
                        <motion.div className="mt-8" variants={itemVariants}>
                          <h4 className="font-medium text-lg mb-2 text-gray-800 dark:text-gray-200">
                            Evaluasi Bimbingan
                          </h4>
                          <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {data.deskripsiKegiatan ||
                                "Tidak ada deskripsi kegiatan."}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
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

export default ReviewBimbinganKP;
