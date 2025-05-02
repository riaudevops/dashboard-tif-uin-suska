import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  SquareArrowOutUpRightIcon,
  Printer,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Lock,
  CheckCircle,
  AlertTriangle,
  X,
  ClipboardCheck,
  Clock,
  User,
  Building,
  GraduationCap,
  ContactRound,
} from "lucide-react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


const MahasiswaKerjaPraktekDailyReportIsiAgendaPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [showCompletionNotification, setShowCompletionNotification] =
    useState(false);
  const [showAbsensiNotification, setShowAbsensiNotification] = useState(false);
  const [absensiNotificationType, setAbsensiNotificationType] =
    useState("success"); 
  const [absensiNotificationMessage, setAbsensiNotificationMessage] =
    useState("");
  const [agendaEntries, setAgendaEntries] = useState<
    { hari_kerja: string; tanggal: string; status: string }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(0);
  const entriesPerPage = 8;
  const [lastAbsensiDate, setLastAbsensiDate] = useState<Date | null>(null);
 
  
  // Internship period dates
  const internshipStartDate = new Date("2025-03-15");
  const internshipEndDate = new Date("2025-03-25");

  // Mahasiswa biodata
  const biodataMahasiswa = {
    nama: "Ahmad Kurniawan",
    nim: "1225011514",
    semester: "6",
    status: "Baru",
    instansi: "UIN SUSKA RIAU",
    dosenPembimbing: "-",
    PembimbingInstansi: "-",
  };

  useEffect(() => {
    const hasShownNotificationThisSession = sessionStorage.getItem(
      "kpNotificationShown"
    );

    const hasShownCompletionNotificationThisSession = sessionStorage.getItem(
      "kpCompletionNotificationShown"
    );

    // Load stored agenda entries from localStorage
    const storedEntries = localStorage.getItem("agendaEntries");
    if (storedEntries) {
      setAgendaEntries(JSON.parse(storedEntries));
    }

    // Load last absensi date
    const storedLastAbsensiDate = localStorage.getItem("lastAbsensiDate");
    if (storedLastAbsensiDate) {
      setLastAbsensiDate(new Date(storedLastAbsensiDate));
    }

    const timer = setTimeout(() => {
      setIsLoading(false);

      // Calculate internship progress first to use it for notification logic
      const internshipProgress = calculateInternshipProgress();

      // Only show warning notification if not completed and not shown before
      if (!internshipProgress.isCompleted && !hasShownNotificationThisSession) {
        setTimeout(() => {
          setShowNotification(true);
          sessionStorage.setItem("kpNotificationShown", "true");
        }, 500);
        setTimeout(() => setShowNotification(false), 10000);
      }

      // Show completion notification if completed and not shown before
      if (
        internshipProgress.isCompleted &&
        !hasShownCompletionNotificationThisSession
      ) {
        setTimeout(() => {
          setShowCompletionNotification(true);
          sessionStorage.setItem("kpCompletionNotificationShown", "true");
        }, 1000);
        // Keep completion notification visible longer
        setTimeout(() => setShowCompletionNotification(false), 15000);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Function to get random status with only "Disetujui" and "Direvisi" options
  const getRandomStatus = () => {
    const statuses = ["Disetujui", "Direvisi"];
    const randomIndex = Math.floor(Math.random() * statuses.length);
    return statuses[randomIndex];
  };

  // Calculate total internship days and current progress
  const calculateInternshipProgress = () => {
    const today = new Date();
    const totalDays = Math.ceil(
      (internshipEndDate.getTime() - internshipStartDate.getTime()) /
        (1000 * 3600 * 24)
    );
    const elapsedDays = Math.ceil(
      (today.getTime() - internshipStartDate.getTime()) / (1000 * 3600 * 24)
    );
    const progressPercentage = Math.min(
      Math.max((elapsedDays / totalDays) * 100, 0),
      100
    );

    return {
      totalDays,
      elapsedDays,
      progressPercentage,
      daysRemaining: totalDays - elapsedDays,
      isCompleted: progressPercentage >= 100,
    };
  };

  const formatDate = (date = new Date()) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Check if user already filled absensi today
  const isAbsensiAllowed = () => {
    if (!lastAbsensiDate) return true;

    const today = new Date();
    const lastDate = new Date(lastAbsensiDate);

    return (
      today.getDate() !== lastDate.getDate() ||
      today.getMonth() !== lastDate.getMonth() ||
      today.getFullYear() !== lastDate.getFullYear()
    );
  };

  const navigate = useNavigate();

  const showNotificationWithType = (type: string, message: string) => {
    setAbsensiNotificationType(type);
    setAbsensiNotificationMessage(message);
    setShowAbsensiNotification(true);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowAbsensiNotification(false);
    }, 5000);
  };

  // Function to handle print button click
  const handlePrintClick = () => {
    if (internshipProgress.isCompleted) {
      // Do print action
      console.log("Mencetak laporan...");
      showNotificationWithType(
        "success",
        "Laporan sedang dicetak, mohon tunggu sebentar..."
      );
    } else {
      // Show notification if report is not complete
      showNotificationWithType(
        "error",
        "Laporan belum bisa dicetak. Selesaikan periode KP terlebih dahulu."
      );
    }
  };

  // Function to handle attendance button click
  const handleAttendanceClick = () => {
    // Check if absensi is allowed today
    if (!isAbsensiAllowed()) {
      showNotificationWithType(
        "warning",
        "Anda sudah mengisi absensi hari ini. Silakan coba lagi besok."
      );
      return;
    }

    // Add a new entry to the agenda
    const today = new Date();
    const currentDayNumber = agendaEntries.length + 1;
    const formattedDate = formatDate(today);
    const randomStatus = getRandomStatus();

    const newEntry = {
      hari_kerja: currentDayNumber.toString(),
      tanggal: formattedDate,
      status: randomStatus,
    };

    const updatedEntries = [...agendaEntries, newEntry];
    setAgendaEntries(updatedEntries);

    // Store the updated entries in localStorage
    localStorage.setItem("agendaEntries", JSON.stringify(updatedEntries));

    // Update and store last absensi date
    setLastAbsensiDate(today);
    localStorage.setItem("lastAbsensiDate", today.toString());

    // Always show the page containing the first entry
    setCurrentPage(0);

    showNotificationWithType(
      "success",
      `Berhasil mengisi absensi untuk hari ke-${currentDayNumber}. Silakan lengkapi detail agenda kerja hari ini.`
    );
  };

  // Function to handle closing the notification manually
  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  // Function to handle closing the completion notification manually
  const handleCloseCompletionNotification = () => {
    setShowCompletionNotification(false);
  };

  // Function to handle closing the absensi notification manually
  const handleCloseAbsensiNotification = () => {
    setShowAbsensiNotification(false);
  };

  // Pagination handlers
  const handleNextPage = () => {
    if ((currentPage + 1) * entriesPerPage < agendaEntries.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get current entries for pagination - starting from first entry (index 0)
  const getCurrentEntries = () => {
    const startIndex = currentPage * entriesPerPage;
    return agendaEntries.slice(startIndex, startIndex + entriesPerPage);
  };

  // Get color for status badge - only for "Disetujui" and "Direvisi"
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disetujui":
        return "bg-green-100 text-green-800";
      case "Direvisi":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getstatusmahasiswa = (status: string) => {
    switch (status) {
      case "Baru":
        return "bg-green-500 status-indicator animate-pulse";
      case "Lanjut":
        return "bg-amber-500";
      case "Gagal":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Get notification styles based on type
  const getNotificationStyles = (type: string) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-gradient-to-r from-green-50 to-green-100",
          border: "border-l-4 border-green-500",
          text: "text-green-700",
          icon: (
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
          ),
          buttonClass: "text-green-500 hover:text-green-700",
        };
      case "warning":
        return {
          bg: "bg-gradient-to-r from-amber-50 to-amber-100",
          border: "border-l-4 border-amber-500",
          text: "text-amber-700",
          icon: (
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          ),
          buttonClass: "text-amber-500 hover:text-amber-700",
        };
      case "error":
        return {
          bg: "bg-gradient-to-r from-red-50 to-red-100",
          border: "border-l-4 border-red-500",
          text: "text-red-700",
          icon: <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />,
          buttonClass: "text-red-500 hover:text-red-700",
        };
      default:
        return {
          bg: "bg-gradient-to-r from-blue-50 to-blue-100",
          border: "border-l-4 border-blue-500",
          text: "text-blue-700",
          icon: (
            <Clock className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          ),
          buttonClass: "text-blue-500 hover:text-blue-700",
        };
    }
  };

  const internshipProgress = calculateInternshipProgress();

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
          {isLoading ? (
            <Skeleton className="h-8 w-64" />
          ) : (
            <CardTitle className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-0">
              Daily Report Kerja Praktik
            </CardTitle>
          )}
        </CardHeader>
        <CardContent>
          {/* Warning Notification for incomplete progress - Only show if not completed */}
          {!isLoading &&
            showNotification &&
            !internshipProgress.isCompleted && (
              <div
                className="fixed top-4 right-4 z-50 max-w-md transform transition-all duration-500 ease-in-out"
                style={{
                  animation: "slideIn 0.5s ease-out, pulse 2s infinite",
                  opacity: showNotification ? 1 : 0,
                  transform: showNotification
                    ? "translateX(0)"
                    : "translateX(100%)",
                }}
              >
                <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded-md shadow-lg flex items-start justify-between">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-sm">Pengingat Penting</h3>
                      <p className="text-sm">
                        Anda harus menyelesaikan 100% periode KP untuk dapat
                        mencetak laporan.
                        {internshipProgress.daysRemaining > 0 && (
                          <span className="block mt-1 font-medium">
                            Masih tersisa {internshipProgress.daysRemaining}{" "}
                            hari lagi.
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseNotification}
                    className="text-amber-500 hover:text-amber-700 ml-2 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

          {/* Success Notification for 100% completion */}
          {!isLoading &&
            showCompletionNotification &&
            internshipProgress.isCompleted && (
              <div
                className="fixed top-4 right-4 z-50 max-w-md transform transition-all duration-500 ease-in-out"
                style={{
                  animation: "slideIn 0.5s ease-out, pulse 2s infinite",
                  opacity: showCompletionNotification ? 1 : 0,
                  transform: showCompletionNotification
                    ? "translateX(0)"
                    : "translateX(100%)",
                }}
              >
                <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-lg flex items-start justify-between">
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-sm">Selamat!</h3>
                      <p className="text-sm">
                        Anda telah menyelesaikan 100% periode Kerja Praktik.
                        <span className="block mt-1 font-medium">
                          Sekarang Anda dapat mencetak laporan KP.
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseCompletionNotification}
                    className="text-green-500 hover:text-green-700 ml-2 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

          {/* Beautiful Absensi Notification - Dynamic based on type */}
          {!isLoading && showAbsensiNotification && (
            <div
              className="fixed top-4 right-4 z-50 max-w-md transform transition-all duration-500 ease-in-out"
              style={{
                animation: "slideIn 0.5s ease-out, fadeInOut 5s ease-in-out",
                opacity: showAbsensiNotification ? 1 : 0,
                transform: showAbsensiNotification
                  ? "translateX(0)"
                  : "translateX(100%)",
              }}
            >
              <div
                className={`${
                  getNotificationStyles(absensiNotificationType).bg
                } ${getNotificationStyles(absensiNotificationType).border} ${
                  getNotificationStyles(absensiNotificationType).text
                } p-4 rounded-md shadow-lg flex items-start justify-between`}
              >
                <div className="flex gap-3">
                  {getNotificationStyles(absensiNotificationType).icon}
                  <div>
                    <h3 className="font-bold text-sm">
                      {absensiNotificationType === "success"
                        ? "Berhasil!"
                        : absensiNotificationType === "warning"
                        ? "Perhatian!"
                        : absensiNotificationType === "error"
                        ? "Gagal!"
                        : "Informasi"}
                    </h3>
                    <p className="text-sm">{absensiNotificationMessage}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseAbsensiNotification}
                  className={`${
                    getNotificationStyles(absensiNotificationType).buttonClass
                  } ml-2 flex-shrink-0`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Biodata Section */}
          <div className="mb-6">
            {isLoading ? (
              <div className="bg-white dark:bg-gray-800/30 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-md">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-40" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Skeleton className="h-20 w-full rounded-lg" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800/40 dark:to-gray-800/20 rounded-lg border border-gray-100 dark:border-gray-700 shadow-md overflow-hidden">
                {/* Header Section with Avatar */}
                <div className="bg-primary/10 p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white dark:bg-gray-800 rounded-full h-12 w-12 flex items-center justify-center shadow-inner border border-primary/20">
                      <User className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        {biodataMahasiswa.nama}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-md text-xs font-medium mr-2">
                          Semester {biodataMahasiswa.semester}
                        </span>
                        <span className="flex items-center">
                          <span
                            className={`inline-block w-3 h-3 rounded-full mr-1.5 ${getstatusmahasiswa(
                              biodataMahasiswa.status
                            )}`}
                          ></span>
                          {biodataMahasiswa.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      {biodataMahasiswa.nim}
                    </span>
                  </div>
                </div>

                {/* Info Cards */}
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* NIM Card */}
                    <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-bl-full -translate-y-6 translate-x-6 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-300"></div>

                      <div className="flex items-center gap-3 relative z-10">
                        <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2.5">
                          <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Instansi
                          </p>
                          <p className="text-base font-bold text-gray-800 dark:text-gray-200">
                            {biodataMahasiswa.instansi}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Instansi Card */}
                    <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-bl-full -translate-y-6 translate-x-6 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-300"></div>

                      <div className="flex items-center gap-3 relative z-10">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-2.5">
                          <ContactRound className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Pembimbing Instansi
                          </p>
                          <p className="text-base font-bold text-gray-800 dark:text-gray-200">
                            {biodataMahasiswa.PembimbingInstansi}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Dosen Card */}
                    <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-bl-full -translate-y-6 translate-x-6 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-300"></div>

                      <div className="flex items-center gap-3 relative z-10">
                        <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-2.5">
                          <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Dosen Pembimbing
                          </p>
                          <p className="text-base font-bold text-gray-800 dark:text-gray-200">
                            {biodataMahasiswa.dosenPembimbing}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Buttons Section (replacing progress bar) */}
          <div className="mb-6 sm:mb-8">
            {isLoading ? (
              <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex justify-between items-center gap-4">
                  <Skeleton className="h-4 w-48" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-24 rounded-md" />
                    <Skeleton className="h-9 w-24 rounded-md" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Periode KP: </span>
                    <span className="text-primary">
                      {formatDate(internshipStartDate)}
                    </span>
                    <span> - </span>
                    <span className="text-primary">
                      {formatDate(internshipEndDate)}
                    </span>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    {/* Attendance Button */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className={`w-full sm:w-auto flex items-center gap-2 ${
                              isAbsensiAllowed()
                                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                : "bg-gray-400 text-white cursor-not-allowed"
                            }`}
                            onClick={handleAttendanceClick}
                            disabled={!isAbsensiAllowed()}
                          >
                            <ClipboardCheck className="h-4 w-4" />
                            Absensi
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isAbsensiAllowed()
                            ? "Klik untuk mengisi absensi harian"
                            : "Anda sudah mengisi absensi hari ini"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Print Button with Condition */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="w-full sm:w-auto"
                            style={{
                              cursor: !internshipProgress.isCompleted
                                ? "not-allowed"
                                : "pointer",
                            }}
                          >
                            <Button
                              variant={
                                internshipProgress.isCompleted
                                  ? "secondary"
                                  : "outline"
                              }
                              className="w-full sm:w-auto flex items-center gap-2"
                              style={{
                                cursor: !internshipProgress.isCompleted
                                  ? "not-allowed"
                                  : "pointer",
                              }}
                              disabled={!internshipProgress.isCompleted}
                              onClick={handlePrintClick}
                              
                            >
                              
                              {internshipProgress.isCompleted ? (
                                <>
                                  <Printer className="h-4 w-4 text-green-500" />
                                  Cetak Daily report
                                </>
                              ) : (
                                <>
                                  <Lock className="h-4 w-4" />
                                  Cetak Daily Report
                                </>
                              )}
                            </Button>
                          </div>
                        </TooltipTrigger>
                        {!internshipProgress.isCompleted && (
                          <TooltipContent>
                            <p>
                              Anda harus menyelesaikan 100% periode KP untuk
                              mencetak laporan
                            </p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Table Section with Pagination */}
          <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/10 dark:bg-primary/5">
                  <TableHead className="w-24 sm:w-auto text-center">
                    {isLoading ? (
                      <Skeleton className="h-4 w-16 mx-auto" />
                    ) : (
                      "Hari Ke-"
                    )}
                  </TableHead>
                  <TableHead className="w-1/2 sm:w-auto text-center">
                    {isLoading ? (
                      <Skeleton className="h-4 w-24 mx-auto" />
                    ) : (
                      "Tanggal"
                    )}
                  </TableHead>
                  <TableHead className="w-1/4 sm:w-auto text-center">
                    {isLoading ? (
                      <Skeleton className="h-4 w-16 mx-auto" />
                    ) : (
                      "Status"
                    )}
                  </TableHead>
                  <TableHead className="w-1/4 sm:w-auto text-center">
                    {isLoading ? (
                      <Skeleton className="h-4 w-16 mx-auto" />
                    ) : (
                      "Aksi"
                    )}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Skeleton rows
                  [...Array(8)].map((_, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-gray-100/50 dark:hover:bg-gray-700/20"
                    >
                      <TableCell className="text-center">
                        <Skeleton className="h-4 w-8 mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Skeleton className="h-4 w-36 mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Skeleton className="h-6 w-28 rounded-md mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Skeleton className="h-8 w-32 rounded-md mx-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : // Show actual entries or empty state
                agendaEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Calendar className="h-10 w-10 mb-2 opacity-50" />
                        <p className="font-medium">Belum ada entri agenda</p>
                        <p className="text-sm">
                          Klik tombol "Absensi" untuk menambahkan entri baru
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  // Display current page entries
                  getCurrentEntries().map((entry, index) => (
                    <TableRow
                      key={index}
                      className={
                        index % 2 !== 0
                          ? "bg-secondary dark:bg-gray-700/30 hover:bg-gray-200/60 dark:hover:bg-gray-700/40 cursor-pointer"
                          : "bg-background dark:bg-gray-700/10 hover:bg-gray-100/60 dark:hover:bg-gray-700/20 cursor-pointer"
                      }
                    >
                      <TableCell className="text-center font-medium">
                        {parseInt(entry.hari_kerja)}
                      </TableCell>
                      <TableCell className="text-center">
                        {entry.tanggal}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center px-4 py-1 rounded-md text-xs font-medium ${getStatusColor(
                            entry.status
                          )}`}
                        >
                          {entry.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-white bg-blue-500 hover:bg-blue-600 shadow-sm hover:shadow transition-all duration-200"
                          onClick={() =>
                            navigate(
                              `/mahasiswa/kerja-praktik/daily-report/isi-agenda/detail?tanggal=${entry.tanggal}`
                            )
                          }
                        >
                          <SquareArrowOutUpRightIcon className="h-4 w-4 mr-1" />
                          Lihat Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination Controls - Only visible if there are entries */}
            {!isLoading && agendaEntries.length > 0 && (
              <div className="flex justify-between items-center p-4 border-t border-gray-100 dark:border-gray-700">
                <div className="text-sm text-gray-500">
                  {currentPage * entriesPerPage + 1} -{" "}
                  {Math.min(
                    (currentPage + 1) * entriesPerPage,
                    agendaEntries.length
                  )}{" "}
                  of {agendaEntries.length} row(s) Selected
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 0}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={
                      (currentPage + 1) * entriesPerPage >= agendaEntries.length
                    }
                    className="flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Add custom CSS for animations */}
          <style type="text/css">{`
            @keyframes slideIn {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
            
            
          `}</style>
        </CardContent>
      </div>
    </DashboardLayout>
  );
};

export default MahasiswaKerjaPraktekDailyReportIsiAgendaPage;
