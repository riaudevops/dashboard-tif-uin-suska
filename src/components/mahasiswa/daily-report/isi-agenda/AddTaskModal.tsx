import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";


interface TambahAgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TambahAgendaModal = ({ isOpen, onClose }: TambahAgendaModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    jamMasuk: "",
    jamSelesai: "",
    judulAgenda: "",
    deskripsi: "",
  });

  const handleOutsideClick = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  console.log(handleOutsideClick)

  // Add state for handling modal animation stages
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isOpen) {
      // Delay showing content for a staggered effect
      timer = setTimeout(() => {
        setShowContent(true);
      }, 200);
    } else {
      setShowContent(false);
    }

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);

    // Add delay before closing to allow exit animation
    setShowContent(false);
    setTimeout(onClose, 300);
  };

  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 rounded-xl py-4 px-6 w-[90%] md:max-w-[900px] max-h-[90vh] overflow-y-auto flex flex-col"
            initial={{ scale: 0.8, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.3,
            }}
          >
            <motion.button
              onClick={() => {
                setShowContent(false);
                setTimeout(onClose, 300);
              }}
              className="w-full text-gray-500 hover:text-red-500 text-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              ✕
            </motion.button>

            {/* Modal Header */}
            <motion.h2
              className="text-2xl font-bold text-center mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Tambah Agenda
            </motion.h2>

            {/* Modal Body */}
            <AnimatePresence>
              {showContent && (
                <motion.form
                  onSubmit={handleSubmit}
                  className="flex dark:bg-gray-800 flex-col flex-1"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.1 },
                    },
                  }}
                >
                  <motion.div
                    className="grid grid-cols-2 gap-2"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <div className="space-y-1">
                      <label
                        className="text-sm dark:text-white font-medium "
                        htmlFor="jamMasuk"
                      >
                        Jam Masuk
                      </label>
                      <input
                        id="jamMasuk"
                        name="jamMasuk"
                        type="time"
                        value={formData.jamMasuk}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2 text-sm focus:ring-2 hover:bg-gray-50 dark:bg-gray-700 focus:ring-blue-200 focus:border-blue-400 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        className="text-sm font-medium dark:text-white"
                        htmlFor="jamSelesai"
                      >
                        Jam Keluar
                      </label>
                      <input
                        id="jamSelesai"
                        name="jamSelesai"
                        type="time"
                        value={formData.jamSelesai}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2 text-sm focus:ring-2 hover:bg-gray-50 dark:bg-gray-700 focus:ring-blue-200 focus:border-blue-400 outline-none"
                      />
                    </div>
                  </motion.div>

                  {/* Judul Agenda */}
                  <motion.div
                    className="mt-4 mb-4"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <label className="block dark:text-white text-sm font-medium mb-2">
                      Judul Agenda <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="judulAgenda"
                      value={formData.judulAgenda}
                      onChange={handleChange}
                      placeholder="Masukkan Judul Agenda"
                      className="w-full border dark:bg-gray-700  focus:ring-2 hover:bg-gray-50 rounded-md px-3 py-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                    />
                  </motion.div>

                  {/* Deskripsi */}
                  <motion.div
                    className="mb-4"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <label className="block text-sm  font-medium mb-2">
                      Deskripsi <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="deskripsi"
                      value={formData.deskripsi}
                      onChange={handleChange}
                      placeholder="Masukkan Deskripsi Agenda"
                      rows={4}
                      className="w-full border focus-ring-2 hover:bg-gray-50 dark:bg-gray-700  rounded-md px-3 py-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                    ></textarea>
                  </motion.div>

                  {/* Buttons */}
                  <motion.div
                    className="flex justify-between mt-auto pt-4"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="submit"
                        variant="outline"
                        className="bg-gray-900 text-white px-4 py-2 rounded-md flex items-center gap-2"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 12L9 17L20 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Simpan
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TambahAgendaModal;
