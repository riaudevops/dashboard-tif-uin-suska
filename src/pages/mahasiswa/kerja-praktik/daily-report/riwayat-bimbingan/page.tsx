import { useState, useEffect } from "react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import ReviewBimbingan from "@/components/mahasiswa/daily-report/riwayat-bimbingan/ReviewBimbingan";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, AlertCircle, Award, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const BimbinganKerjaPraktikPage = () => {
  const [isReviewBimbinganModal, setReviewBimbinganModal] = useState(false);
  const [showLoginNotification, setShowLoginNotification] = useState(false);

  // Cek apakah ini pertama kali login
  useEffect(() => {
    // Periksa apakah notifikasi sudah pernah ditampilkan
    const hasShownNotification = localStorage.getItem(
      "bimbinganNotificationShown"
    );

    if (!hasShownNotification) {
      setShowLoginNotification(true);
      // Tandai bahwa notifikasi sudah ditampilkan
      localStorage.setItem("bimbinganNotificationShown", "true");
    }
  }, []);

  // Fungsi untuk menutup notifikasi
  const closeNotification = () => {
    setShowLoginNotification(false);
  };

  const [bimbinganHistory] = useState([
    {
      id: 1,
      bimbinganKe: 1,
      tanggal: "06 Januari 2025",
      status: "Selesai",
    },
    {
      id: 2,
      bimbinganKe: 2,
      tanggal: "07 Januari 2025",
      status: "Selesai",
    },
    {
      id: 3,
      bimbinganKe: 3,
      tanggal: "10 Januari 2025",
      status: "Selesai",
    },
    {
      id: 4,
      bimbinganKe: 4,
      tanggal: "15 Januari 2025",
      status: "Selesai",
    },
    {
      id: 5,
      bimbinganKe: 5,
      tanggal: "15 Januari 2025",
      status: "Selesai",
    },
  ]);

  // Calculate remaining required sessions
  const completedSessions = bimbinganHistory.length;
  const minimumRequired = 5;
  const remainingSessions = Math.max(0, minimumRequired - completedSessions);
  const progressPercentage = (completedSessions / minimumRequired) * 100;
  const isComplete = completedSessions >= minimumRequired;

  return (
    <DashboardLayout>
      <div className="p-6 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text">
              Bimbingan Kerja Praktik
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Pantau progres bimbingan akademik Anda
            </p>
          </div>
        </div>

        {/* Notifikasi Login - Hanya muncul sekali */}
        {showLoginNotification && (
          <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300">
            <div className="flex justify-between items-center">
              <AlertDescription>
                Selamat datang di dashboard Bimbingan Kerja Praktik! Anda telah
                menyelesaikan {completedSessions} dari {minimumRequired}{" "}
                bimbingan yang diperlukan.
              </AlertDescription>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
                onClick={closeNotification}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        )}

        {/* Premium Progress Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Progress Card */}
          <Card className="col-span-2 overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
            <CardContent className="p-0">
              <div className="p-6 flex flex-col mt-8 md:flex-row items-center gap-8">
                {/* Left side - Progress Circle */}
                <div className="relative h-48 w-48 flex-shrink-0">
                  {/* Main circle */}
                  <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-inner"></div>

                  {/* Progress circle */}
                  <svg className="absolute inset-0" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="white"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="264"
                      strokeDashoffset={264 - (264 * progressPercentage) / 100}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>

                  {/* Center content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-center">
                      <span className="text-6xl font-bold">
                        {completedSessions}
                      </span>
                      <span className="text-3xl font-medium text-white/70">
                        /
                      </span>
                      <span className="text-3xl font-medium text-white/70">
                        {minimumRequired}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-white/70">
                      Bimbingan
                    </p>
                  </div>
                </div>

                {/* Right side - Progress info */}
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-2">
                    {isComplete ? (
                      <CheckCircle className="h-6 w-6 text-green-300" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-amber-300" />
                    )}
                    <h3 className="text-2xl font-bold">
                      {isComplete
                        ? "Persyaratan Terpenuhi!"
                        : "Persyaratan Bimbingan"}
                    </h3>
                  </div>

                  <p className="text-white/80 text-lg">
                    {isComplete
                      ? "Anda telah memenuhi jumlah minimum bimbingan yang diperlukan. Selamat!"
                      : `Anda harus menyelesaikan minimal ${minimumRequired} kali bimbingan untuk memenuhi persyaratan kerja praktik.`}
                  </p>

                  {!isComplete && (
                    <div className="mt-4 py-3 px-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10">
                      <p className="flex items-center gap-2 font-semibold">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-purple-600 text-xs font-bold">
                          {remainingSessions}
                        </span>
                        <span>
                          Bimbingan lagi diperlukan untuk memenuhi syarat
                        </span>
                      </p>
                    </div>
                  )}

                  {isComplete && (
                    <div className="flex gap-2 mt-4">
                      <Award className="h-6 w-6 text-yellow-300" />
                      <p className="text-green-300 font-semibold">
                        Siap untuk tahap selanjutnya!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="col-span-1 grid grid-cols-1 gap-4">
            {/* Sessions completed */}
            <Card className="border shadow-md bg-gray-50 dark:bg-gray-800/30 rounded-lg  border-gray-100 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Bimbingan Selesai
                    </p>
                    <h3 className="text-3xl font-bold mt-1">
                      {completedSessions}
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Percentage completed */}
            <Card className="border shadow-md bg-gray-50 dark:bg-gray-800/30 rounded-lg  border-gray-100 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between ">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Progres
                    </p>
                    <h3 className="text-3xl font-bold mt-1">
                      {progressPercentage}%
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 3V21M3 12H21M20 16L16 20M16 4L20 8M4 8L8 4M8 20L4 16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Remaining sessions */}
            <Card className="border shadow-md bg-gray-50 dark:bg-gray-800/30 rounded-lg  border-gray-100 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Sisa Bimbingan
                    </p>
                    <h3 className="text-3xl font-bold mt-1">
                      {remainingSessions}
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Timeline */}
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Riwayat Bimbingan
        </h2>

        {/* Enhanced Table */}
        <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-700/50">
                <TableHead className="w-24 sm:w-auto text-center font-bold">
                  No
                </TableHead>
                <TableHead className="w-24 sm:w-auto text-center font-bold">
                  Tanggal
                </TableHead>
                <TableHead className="w-24 sm:w-auto text-center font-bold">
                  Status
                </TableHead>
                <TableHead className="w-24 sm:w-auto text-center font-bold">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bimbinganHistory.map((item) => (
                <TableRow
                  key={item.id}
                  className={item.id % 2 !== 0
                    ? "bg-secondary dark:bg-gray-700/10 cursor-pointer"
                    : "bg-background dark:bg-gray-700/30 cursor-pointer"}
                >
                  <TableCell className="text-center font-medium">
                    {item.bimbinganKe}
                  </TableCell>
                  <TableCell className="text-center">{item.tanggal}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1 rounded-lg font-medium"
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      className="text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                      size="sm"
                      onClick={() => setReviewBimbinganModal(true)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal Review Bimbingan */}
      <ReviewBimbingan
        isOpen={isReviewBimbinganModal}
        onClose={() => setReviewBimbinganModal(false)}
      />
    </DashboardLayout>
  );
};

export default BimbinganKerjaPraktikPage;