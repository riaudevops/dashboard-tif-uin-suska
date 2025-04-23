import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

interface ReviewDailyReportProps {
  isOpen: boolean;
  onClose: () => void;
  reportData?: any;
}

const ReviewDailyReport = ({ isOpen, onClose, reportData }: ReviewDailyReportProps) => {
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
    status: "Diterima", // or "Ditolak"
    nama: "Abmi Sukma",
    nim: "12250120341",
    dosenPembimbing: "Yelfi Vitriani, S.Kom., M.M.S.I.",
    pembimbingInstansi: "Sarinah, M.Pd",
    evaluasi: "Saat design UI/UX kedepannya bisa pakai figma saja, untuk abmi terus berlatih untuk lebih baik kedepannya ya",
    tanggal: "Jumat, 20/10/2024",
    waktu: "09:00/16:00",
    judul: "Design UI/UX Daily Report",
    dokumentasi: [
      { id: 1, url: "/api/placeholder/320/240" },
      { id: 2, url: "/api/placeholder/320/240" },
      { id: 3, url: "/api/placeholder/320/240" }
    ],
    deskripsiNote: "Deskripsi agenda tidak dapat diganti setelah di acc Pembimbing Instansi.",
    deskripsiKegiatan: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget ligula eu lectus lobortis condimentum. Aliquam nonummy auctor massa. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla at risus. Quisque purus magna, auctor et, sagittis ac, posuere eu, lectus. Nam mattis, felis ut adipiscing. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget ligula eu lectus lobortis condimentum. Aliquam nonummy auctor massa. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla at risus. Quisque purus magna, auctor et, sagittis ac, posuere eu, lectus. Nam mattis, felis ut adipiscing. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget ligula eu lectus lobortis condimentum. Aliquam nonummy auctor massa. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla at risus. Quisque purus magna, auctor et, sagittis ac, posuere eu, lectus. Nam mattis, felis ut adipiscing."
  };

  // Get status styling
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "diterima":
        return {
          bgColor: "bg-green-500",
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          textColor: "text-green-700"
        };
      case "belum":
        return {
          bgColor: "bg-red-500",
          icon: <XCircle className="w-5 h-5 text-red-500" />,
          textColor: "text-red-700"
        };
      default:
        return {
          bgColor: "bg-yellow-500",
          icon: <Info className="w-5 h-5 text-yellow-500" />,
          textColor: "text-yellow-700"
        };
    }
  };

  const statusStyle = getStatusStyles(data.status);

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.25, ease: "easeInOut" }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.25, ease: "easeInOut" } 
    }
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
        duration: 0.3 
      }
    },
    exit: { 
      scale: 0.98, 
      y: 10, 
      opacity: 0,
      transition: { 
        duration: 0.2,
        ease: "easeOut" 
      } 
    }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.05,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
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
            className="bg-white dark:bg-gray-800 rounded-xl py-6 px-8 w-[90%] md:max-w-[1000px] max-h-[90vh] overflow-y-auto flex flex-col shadow-xl relative"
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
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Review Daily Report</h2>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left column - Student Information */}
                    <motion.div 
                      className="space-y-6"
                      variants={itemVariants}
                    >
                      <div className="space-y-6">
                        <div>
                          <h3 className="uppercase text-sm text-gray-500 dark:text-gray-400 font-medium mb-2">STATUS VERIFIKASI</h3>
                          <div className="flex items-center">
                            <div className={`w-4 h-4 animate-pulse rounded-full ${statusStyle.bgColor} mr-3`}></div>
                            <p className={`font-medium ${statusStyle.textColor} dark:text-gray-200`}>{data.status}</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                          <h3 className="uppercase text-sm text-gray-500 dark:text-gray-400 font-medium mb-2">NAMA MAHASISWA</h3>
                          <p className="font-medium text-gray-800 dark:text-gray-200">{data.nama}</p>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                          <h3 className="uppercase text-sm text-gray-500 dark:text-gray-400 font-medium mb-2">NIM</h3>
                          <p className="font-medium text-gray-800 dark:text-gray-200">{data.nim}</p>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                          <h3 className="uppercase text-sm text-gray-500 dark:text-gray-400 font-medium mb-2">DOSEN PEMBIMBING</h3>
                          <p className="font-medium text-gray-800 dark:text-gray-200">{data.dosenPembimbing}</p>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                          <h3 className="uppercase text-sm text-gray-500 dark:text-gray-400 font-medium mb-2">PEMBIMBING INSTANSI</h3>
                          <p className="font-medium text-gray-800 dark:text-gray-200">{data.pembimbingInstansi}</p>
                        </div>
                        
                        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg relative border border-green-200 dark:border-green-800">
                          <p className="text-sm text-green-800 dark:text-green-300 pr-6">{data.deskripsiNote}</p>
                          <div className="absolute right-3 top-3 w-6 h-6 bg-green-800 dark:bg-green-700 rounded-full flex items-center justify-center text-white dark:text-green-100 text-xs shadow-md">
                            i
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Right column - Report details */}
                    <motion.div 
                      className="md:col-span-2 space-y-6"
                      variants={itemVariants}
                    >
                      <div>
                        <h3 className="uppercase text-sm text-gray-500 dark:text-gray-400 font-medium mb-2">EVALUASI AGENDA</h3>
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/30 shadow-sm">
                          <p className="text-gray-700 dark:text-gray-300">{data.evaluasi}</p>
                        </div>
                      </div>
                      
                      <div className="">
                        <h3 className="uppercase text-sm text-gray-500 dark:text-gray-400 font-medium mb-2">DAILY REPORT</h3>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm max-h-96 overflow-y-auto">
                          <div className="p-5">
                            <p className="text-gray-600 dark:text-gray-400 mb-4">{data.tanggal} - {data.waktu}</p>
                            
                            <h3 className="font-semibold text-lg text-center my-6 text-gray-800 dark:text-white">{data.judul}</h3>
                            
                            <div className="mt-6">
                              <h4 className="font-medium mb-3 text-gray-800 dark:text-gray-200">Dokumentasi</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {data.dokumentasi.map((doc: any) => (
                                  <motion.div 
                                    key={doc.id} 
                                    className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <div className="relative pb-[75%]">
                                      <img 
                                        src={doc.url} 
                                        alt={`Documentation ${doc.id}`} 
                                        className="absolute inset-0 w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="p-2 text-center text-sm text-gray-600 dark:text-gray-400 truncate bg-gray-50 dark:bg-gray-700/50">
                                      {doc.name}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mt-6">
                              <h4 className="font-medium mb-3 text-gray-800 dark:text-gray-200">Deskripsi Kegiatan</h4>
                              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                                <p className="text-gray-700 dark:text-gray-300">{data.deskripsiKegiatan || "Tidak ada deskripsi kegiatan."}</p>
                              </div>
                            </div>
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

export default ReviewDailyReport;