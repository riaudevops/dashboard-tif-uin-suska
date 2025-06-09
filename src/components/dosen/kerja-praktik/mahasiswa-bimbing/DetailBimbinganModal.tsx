import { X } from "lucide-react";
import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Bimbingan {
  id: string;
  tanggal_bimbingan: string;
  catatan_bimbingan: string;
  status: string;
}

interface DetailBimbinganModalProps {
  isOpen: boolean;
  onClose: () => void;
  bimbinganData?: Bimbingan;
}

const DetailBimbinganModal = ({
  isOpen,
  onClose,
  bimbinganData,
}: DetailBimbinganModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const data = bimbinganData || {
    id: "-",
    tanggal_bimbingan: new Date().toISOString(),
    catatan_bimbingan: "-",
    status: "-",
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
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
            className="bg-white dark:bg-gray-800 rounded-xl py-6 px-8 w-[95%] md:max-w-[600px] max-h-[95vh] overflow-y-auto flex flex-col shadow-xl relative"
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
              aria-label="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </motion.button>
            <motion.div
              className="flex items-center justify-center mb-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Detail Bimbingan
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
                  <motion.div variants={itemVariants}>
                    <h4 className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tanggal Bimbingan
                    </h4>
                    <div className="p-4 border border-gray-300 border-dashed rounded-lg bg-gray-50 dark:bg-gray-700/30 dark:border-gray-600">
                      <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                        {formatDate(data.tanggal_bimbingan)}
                      </p>
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <h4 className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Catatan Bimbingan
                    </h4>
                    <div className="p-4 border border-gray-300 border-dashed rounded-lg bg-gray-50 dark:bg-gray-700/30 dark:border-gray-600">
                      <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                        {data.catatan_bimbingan}
                      </p>
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
