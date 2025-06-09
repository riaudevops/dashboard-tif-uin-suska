import { Badge } from "@/components/ui/badge";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { DailyReport } from "@/interfaces/pages/mahasiswa/kerja-praktik/daily-report/daily-report.interface";

interface DetailDailyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyReportData?: DailyReport;
}

const DetailDailyReportModal = ({
  isOpen,
  onClose,
  dailyReportData,
}: DetailDailyReportModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [expandedDetails, setExpandedDetails] = useState<string[]>([]);

  if (!isOpen) return null;

  const data = dailyReportData || {
    id: "-",
    tanggal_presensi: new Date().toISOString(),
    status: "-",
    catatan_evaluasi: "-",
    detail_daily_report: [],
  };

  const toggleDetail = (id: string) => {
    setExpandedDetails((prev) =>
      prev.includes(id)
        ? prev.filter((detailId) => detailId !== id)
        : [...prev, id]
    );
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Disetujui":
        return "bg-green-100 text-green-800";
      case "Revisi":
        return "bg-amber-100 text-amber-800";
      case "Ditolak":
        return "bg-red-100 text-red-800";
      case "Menunggu":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

  const detailVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" },
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
            className="bg-white dark:bg-gray-800 rounded-xl py-6 px-8 w-[95%] md:max-w-[700px] max-h-[95vh] overflow-y-auto flex flex-col shadow-xl relative"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            tabIndex={-1}
            aria-labelledby="modal-title"
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
              <h2
                id="modal-title"
                className="text-2xl font-bold text-gray-800 dark:text-white"
              >
                Detail Daily Report
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
                  {/* Main Report Details */}
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700/30 dark:border-gray-600">
                    <motion.div variants={itemVariants} className="mt-4">
                      <h4 className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tanggal Presensi
                      </h4>
                      <p className="text-gray-900 dark:text-gray-100">
                        {formatDate(data.tanggal_presensi)}
                      </p>
                    </motion.div>
                    <motion.div variants={itemVariants} className="mt-4">
                      <h4 className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status
                      </h4>
                      <Badge className={getStatusVariant(data.status)}>
                        {data.status}
                      </Badge>
                    </motion.div>
                    <motion.div variants={itemVariants} className="mt-4">
                      <h4 className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Catatan Evaluasi
                      </h4>
                      <div className="p-3 bg-white border border-gray-300 border-dashed rounded-lg dark:bg-gray-800 dark:border-gray-600">
                        <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                          {data.catatan_evaluasi || "Tidak ada catatan"}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                  {/* Detail Daily Report */}
                  <div>
                    {/* <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Detail Agenda Harian
                      </h3> */}
                    {(data.detail_daily_report ?? []).length > 0 ? (
                      <div className="space-y-4">
                        {data.detail_daily_report?.map((detail, index) => (
                          <motion.div
                            key={detail.id}
                            className="overflow-hidden border border-gray-200 rounded-lg dark:border-gray-600"
                            variants={itemVariants}
                          >
                            <button
                              className="flex items-center justify-between w-full p-4 transition-colors bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                              onClick={() => toggleDetail(detail.id)}
                              aria-expanded={expandedDetails.includes(
                                detail.id
                              )}
                              aria-controls={`detail-${detail.id}`}
                            >
                              <div className="flex items-center gap-2">
                                {index + 1}.
                                <span className="font-medium text-gray-800 dark:text-gray-100">
                                  {detail.judul_agenda}
                                </span>
                              </div>
                              {expandedDetails.includes(detail.id) ? (
                                <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                              )}
                            </button>
                            <AnimatePresence>
                              {expandedDetails.includes(detail.id) && (
                                <motion.div
                                  id={`detail-${detail.id}`}
                                  className="p-4 bg-white dark:bg-gray-800"
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  variants={detailVariants}
                                >
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-end gap-2">
                                      <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                        <div>
                                          {/* <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Waktu Mulai
                                          </h4> */}
                                          <p className="text-gray-900 dark:text-gray-100">
                                            {detail.waktu_mulai} -
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {/* <Clock className="w-4 h-4 text-gray-600 dark:text-gray-300" /> */}
                                        <div>
                                          {/* <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Waktu Selesai
                                          </h4> */}
                                          <p className="text-gray-900 dark:text-gray-100">
                                            {detail.waktu_selesai}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      {/* <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Deskripsi Agenda
                                      </h4> */}
                                      <div className="p-3 border border-gray-300 border-dashed rounded-lg bg-gray-50 dark:bg-gray-700/30 dark:border-gray-600">
                                        <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                                          {detail.deskripsi_agenda || "-"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <motion.div
                        variants={itemVariants}
                        className="p-4 text-center border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700/30 dark:border-gray-600"
                      >
                        <p className="text-gray-600 dark:text-gray-400">
                          Belum ada agenda nih...
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DetailDailyReportModal;
