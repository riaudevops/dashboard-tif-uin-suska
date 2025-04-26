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
  ArrowUpRight,
  Printer,
  Calendar,
  Clock,
  Lock,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MahasiswaKerjaPraktekDailyReportIsiAgendaPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const internshipStartDate = new Date("2025-03-13");
  const internshipEndDate = new Date("2025-03-30");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const hasShownNotification = localStorage.getItem('kpNotificationShown');
    console.log(hasShownNotification)

    const timer = setTimeout(() => {
      setIsLoading(false);
      // Trigger animation after loading
      setTimeout(() => setIsAnimating(true), 300);

      // Show notification after loading is complete
      const internshipProgress = calculateInternshipProgress();
      if (!internshipProgress.isCompleted) {
        setTimeout(() => setShowNotification(true), 500);

        // Auto-dismiss notification after 10 seconds
        setTimeout(() => setShowNotification(false), 7000);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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

  const [agendaEntries] = useState([
    {
      hari_kerja: "1",
      tanggal: "24 Februari, 2024",
      status: "Tepat Waktu",
    },
    {
      hari_kerja: "2",
      tanggal: "25 Februari, 2024",
      status: "Terlambat 3 Hari",
    },
    {
      hari_kerja: "3",
      tanggal: "26 Februari, 2024",
      status: "Terlambat 4 Hari",
    },
    {
      hari_kerja: "4",
      tanggal: "27 Februari, 2024",
      status: "Terlambat 1 Hari",
    },
  ]);

  const internshipProgress = calculateInternshipProgress();
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Truncate description
  const truncateDescription = (description: string, maxLength: number = 20) => {
    return description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;
  };

  const navigate = useNavigate();

  // Fungsi untuk menangani klik pada tombol cetak
  const handlePrintClick = () => {
    if (internshipProgress.isCompleted) {
      // Lakukan aksi cetak laporan
      console.log("Mencetak laporan...");
      // Tambahkan logika cetak laporan di sini
    }
  };

  // Function to handle closing the notification manually
  const handleCloseNotification = () => {
    setShowNotification(false);
  };

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
          {/* Notification for incomplete progress */}
          {!isLoading &&
            !internshipProgress.isCompleted &&
            showNotification && (
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

          {/* Internship Progress Section */}
          <div className="mb-6 sm:mb-8">
            {isLoading ? (
              <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-4">
                  {/* Calendar info skeleton */}
                  <div className="flex items-center gap-2 text-sm font-medium w-full">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>

                  {/* Button Skeleton */}
                  <Skeleton className="h-9 w-24 rounded-md" />
                </div>

                {/* Progress Bar Skeleton */}
                <div className="relative mb-1">
                  <Skeleton className="h-6 w-full rounded-full" />
                </div>

                {/* Progress Stats Skeleton */}
                <div className="flex justify-between items-center flex-wrap mt-3 px-1 text-sm">
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>

                  <Skeleton className="h-4 w-32" />

                  <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>

                {/* Milestone Indicators Skeleton */}
                <div className="relative mt-2 mb-1 px-1">
                  <div className="flex justify-between">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <Skeleton className="w-3 h-3 rounded-full" />
                        <Skeleton className="h-3 w-10 mt-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-4">
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

                  {/* Tombol Cetak dengan Kondisi */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="w-full md:w-auto"
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
                            className="w-full md:w-auto flex items-center gap-2"
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
                                Cetak
                              </>
                            ) : (
                              <>
                                <Lock className="h-4 w-4" />
                                Cetak
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

                {/* Modern Progress Bar Container */}
                <div className="relative mb-1">
                  {/* Background Progress Bar */}
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                    {/* Progress Fill with Gradient and Animation */}
                    <div
                      className={`h-full relative transition-all duration-1000 ease-out rounded-full flex items-center ${
                        isAnimating ? "opacity-100" : "opacity-0"
                      }`}
                      style={{
                        width: isAnimating
                          ? `${internshipProgress.progressPercentage}%`
                          : "0%",
                        background:
                          "linear-gradient(90deg, #4f46e5, #8b5cf6, #ec4899)",
                        boxShadow: "0 0 10px rgba(168, 85, 247, 0.5)",
                      }}
                    >
                      {/* Animated Pulse Highlight */}
                      <div className="absolute inset-0 bg-white opacity-20 rounded-full animate-pulse"></div>

                      {/* Progress Percentage on Bar */}
                      <span className="text-xs font-bold text-white ml-2 drop-shadow-md mr-2">
                        {internshipProgress.progressPercentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Stats */}
                <div className="flex justify-between items-center flex-wrap mt-3 px-1 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-300 gap-1">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">
                      {internshipProgress.elapsedDays} hari
                    </span>{" "}
                    telah dilalui
                  </div>

                  <div className="font-semibold">
                    {internshipProgress.isCompleted ? (
                      <span className="text-green-500 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" /> Periode KP selesai
                      </span>
                    ) : (
                      <span>
                        <span className="text-primary">
                          {internshipProgress.daysRemaining}
                        </span>{" "}
                        hari tersisa
                      </span>
                    )}
                  </div>

                  <div className="flex items-center text-gray-600 dark:text-gray-300 gap-1">
                    <span className="font-medium">
                      {internshipProgress.totalDays} hari
                    </span>{" "}
                    total durasi
                  </div>
                </div>

                {/* Milestone Indicators */}
                <div className="relative mt-2 mb-1 px-1">
                  <div className="flex justify-between">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          internshipProgress.progressPercentage >= 0
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <span className="text-xs mt-1">Mulai</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          internshipProgress.progressPercentage >= 25
                            ? "bg-indigo-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <span className="text-xs mt-1">25%</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          internshipProgress.progressPercentage >= 50
                            ? "bg-purple-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <span className="text-xs mt-1">50%</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          internshipProgress.progressPercentage >= 75
                            ? "bg-pink-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <span className="text-xs mt-1">75%</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          internshipProgress.progressPercentage >= 100
                            ? "bg-rose-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <span className="text-xs mt-1">Selesai</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Table Section */}
          <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
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
                {isLoading
                  ? // Improved Skeleton rows
                    [...Array(4)].map((_, index) => (
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
                  : // Actual data rows
                    agendaEntries.map((entry, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-gray-100/50 dark:hover:bg-gray-700/20"
                      >
                        <TableCell className="text-xs w-24 sm:text-base text-center">
                          {entry.hari_kerja}
                        </TableCell>
                        <TableCell className="text-xs sm:text-base text-center">
                          {truncateDescription(entry.tanggal)}
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`inline-block px-2 sm:px-3 py-1 rounded-md text-xs font-medium ${
                              !entry.status.includes("Terlambat")
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {entry.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center items-center ">
                            <AnimatedShinyText
                              className="flex items-center gap-2 cursor-pointer border border-gray-600  gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:border-purple-400  rounded-md px-3 py-1 transition-colors "
                              onClick={() =>
                                navigate(
                                  `/mahasiswa/kerja-praktik/daily-report/isi-agenda/detail?tanggal=${entry.tanggal}`
                                )
                              }
                            >
                              ✨ Lihat Detail
                              <ArrowUpRight className="h-4 w-4" />
                            </AnimatedShinyText>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </div>

      {/* Add the CSS animation */}
      <style>{`
        @keyframes slideIn {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
         @keyframes slideOut {
          0% {
            transform: translateX(100%);
            opacity: 1;
          }
          100% {
            transform: translateX(0);
            opacity: 0;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default MahasiswaKerjaPraktekDailyReportIsiAgendaPage;
