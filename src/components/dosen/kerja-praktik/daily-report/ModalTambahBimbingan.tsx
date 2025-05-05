import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, BookOpen, Save } from "lucide-react";

interface TambahBimbinganProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (bimbinganData: any) => void;
}

const TambahBimbingan = ({
  isOpen,
  onClose,
  onSave,
}: TambahBimbinganProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(false);
  const [formData, setFormData] = useState({
    tanggal: "",
    waktuMulai: "",
    waktuSelesai: "",
    topikBimbingan: "",
    detailBimbingan: "",
  });

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      // Default empty form data
      setFormData({
        tanggal: "",
        waktuMulai: "",
        waktuSelesai: "",
        topikBimbingan: "",
        detailBimbingan: "",
      });
    }
  }, [isOpen]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveBimbingan = () => {
    if (onSave) {
      onSave(formData);
    }
    setShowContent(false);
    setTimeout(onClose, 250);
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
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      scale: 0.98,
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

  const isFormValid = () => {
    return formData.tanggal && formData.waktuMulai && formData.waktuSelesai && formData.topikBimbingan;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 overflow-hidden"
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
            className="bg-white dark:bg-gray-800 rounded-xl py-6 px-8 w-[95%] md:max-w-[600px] max-h-[95vh] overflow-y-auto overflow-x-hidden flex flex-col shadow-xl relative"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            // Removed drag functionality to make modal static
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
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                Tambah Bimbingan
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
                  <div className="space-y-5">
                    {/* Date input */}
                    <motion.div variants={itemVariants} className="group">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-700" />
                        Tanggal Bimbingan
                      </label>
                      <input
                        type="date"
                        name="tanggal"
                        value={formData.tanggal}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all group-hover:border-blue-400"
                      />
                    </motion.div>

                    {/* Time inputs */}
                    <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                      <div className="group">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-700" />
                          Waktu Mulai
                        </label>
                        <input
                          type="time"
                          name="waktuMulai"
                          value={formData.waktuMulai}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all group-hover:border-blue-400"
                        />
                      </div>
                      <div className="group">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-700" />
                          Waktu Selesai
                        </label>
                        <input
                          type="time"
                          name="waktuSelesai"
                          value={formData.waktuSelesai}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all group-hover:border-blue-400"
                        />
                      </div>
                    </motion.div>

                    {/* Topic input */}
                    <motion.div variants={itemVariants} className="group">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                        <BookOpen className="w-4 h-4 text-gray-700" />
                        Topik Bimbingan
                      </label>
                      <input
                        type="text"
                        name="topikBimbingan"
                        value={formData.topikBimbingan}
                        onChange={handleInputChange}
                        placeholder="Masukkan topik bimbingan..."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all group-hover:border-blue-400"
                      />
                    </motion.div>

                    {/* Details text area */}
                    <motion.div variants={itemVariants} className="group">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Detail Bimbingan (Opsional)
                      </label>
                      <textarea
                        name="detailBimbingan"
                        value={formData.detailBimbingan}
                        onChange={handleInputChange}
                        placeholder="Masukkan detail bimbingan jika diperlukan..."
                        className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all group-hover:border-blue-400 resize-none"
                      />
                    </motion.div>
                    
                    {/* Save button */}
                    <motion.div 
                      className="mt-8 flex justify-center"
                      variants={itemVariants}
                    >
                      <motion.button
                        onClick={handleSaveBimbingan}
                        disabled={!isFormValid()}
                        className={`flex items-center gap-2 px-8 py-3 rounded-lg text-white font-medium transition-all
                          ${isFormValid() 
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg" 
                            : "bg-gray-400 cursor-not-allowed"
                          }`}
                        whileHover={isFormValid() ? { scale: 1.03 } : {}}
                        whileTap={isFormValid() ? { scale: 0.98 } : {}}
                      >
                        <Save className="w-5 h-5" />
                        <span>Simpan Bimbingan</span>
                      </motion.button>
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

export default TambahBimbingan;