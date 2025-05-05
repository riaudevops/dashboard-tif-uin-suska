import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Edit2 } from "lucide-react";

interface EditDailyReportProps {
  isOpen: boolean;
  onClose: () => void;
  reportData?: any;
  onSave?: (updatedData: any) => void;
}

const EditDailyReport = ({
  isOpen,
  onClose,
  reportData,
  onSave,
}: EditDailyReportProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    tanggal: "",
    waktu: "",
    judul: "",
    deskripsiKegiatan: "",
  });

  // Initialize form data when modal opens or reportData changes
  useEffect(() => {
    if (reportData) {
      setFormData({
        tanggal: reportData.tanggal || "",
        waktu: reportData.waktu || "",
        judul: reportData.judul || "",
        deskripsiKegiatan: reportData.deskripsiKegiatan || "",
      });
    } else {
      // Default data if none is provided
      setFormData({
        tanggal: "Jumat, 20/10/2024",
        waktu: "09:00/16:00",
        judul: "Design UI/UX Daily Report",
        deskripsiKegiatan:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget ligula eu lectus lobortis condimentum.",
      });
    }
  }, [reportData, isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isOpen) {
      // Reduced delay for smoother appearance
      timer = setTimeout(() => {
        setShowContent(true);
      }, 100);
    } else {
      setShowContent(false);
      setIsEditing(false); // Reset editing state when modal closes
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

  const handleSaveChanges = () => {
    if (onSave) {
      onSave(formData);
    }
    setIsEditing(false);
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
          className="fixed inset-0 bg-black/10 flex items-center justify-center z-50"
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
                {isEditing ? "Edit Daily Report" : "Review Daily Report"}
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
                  <div className="space-y-6">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                          {isEditing ? (
                            <>
                              <div className="w-full md:w-1/2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Tanggal
                                </label>
                                <input
                                  type="text"
                                  name="tanggal"
                                  value={formData.tanggal}
                                  onChange={handleInputChange}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                              <div className="w-full md:w-1/2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Waktu
                                </label>
                                <input
                                  type="text"
                                  name="waktu"
                                  value={formData.waktu}
                                  onChange={handleInputChange}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="text-gray-600 dark:text-gray-400 font-medium">
                                {formData.tanggal}
                              </p>
                              <p className="text-gray-600 dark:text-gray-400 font-medium">
                                {formData.waktu}
                              </p>
                            </>
                          )}
                        </div>

                        {isEditing ? (
                          <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Judul
                            </label>
                            <input
                              type="text"
                              name="judul"
                              value={formData.judul}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        ) : (
                          <h3 className="font-semibold text-xl text-center my-6 text-gray-800 dark:text-white">
                            {formData.judul}
                          </h3>
                        )}

                        {/* Report content */}
                        <motion.div 
                          className="mt-8"
                          variants={itemVariants}
                        >
                          <h4 className="font-medium text-lg mb-4 text-gray-800 dark:text-gray-200">
                            Deskripsi Kegiatan
                          </h4>
                          <div className={`${isEditing ? "" : "bg-gray-50 dark:bg-gray-700/30 p-6"} rounded-lg border border-dashed border-gray-300 dark:border-gray-600`}>
                            {isEditing ? (
                              <textarea
                                name="deskripsiKegiatan"
                                value={formData.deskripsiKegiatan}
                                onChange={handleInputChange}
                                className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                              />
                            ) : (
                              <div className="max-h-64 overflow-y-auto pr-2">
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {formData.deskripsiKegiatan || "Tidak ada deskripsi kegiatan."}
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                        
                        {/* Edit/Save button at the bottom */}
                        <motion.div 
                          className="mt-8 flex justify-center"
                          variants={itemVariants}
                        >
                          <motion.button
                            onClick={isEditing ? handleSaveChanges : () => setIsEditing(true)}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg ${
                              isEditing 
                                ? "bg-green-500 hover:bg-green-600 text-white" 
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                            } transition-colors`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {isEditing ? (
                              <>
                                <Save className="w-5 h-5" />
                                <span>Simpan Perubahan</span>
                              </>
                            ) : (
                              <>
                                <Edit2 className="w-5 h-5" />
                                <span>Edit Agenda</span>
                              </>
                            )}
                          </motion.button>
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

export default EditDailyReport;