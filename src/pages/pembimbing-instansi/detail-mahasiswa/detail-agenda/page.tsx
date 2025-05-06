import { useState, useEffect } from "react";
import {
  ArrowLeft,
  User,
  FileDigit,
  Rocket,
  Calendar,
  FileText,
  FileInput,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import ModalAdendaMahasiswa from "@/components/instansi/ModalAdendaMahasiswa";

const DailyReportKerjaPraktikMahasiswaDetailPage = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const tanggal = query.get("tanggal") || "-";
  const [selectedRows] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Added loading state
  const [isLoading, setIsLoading] = useState(true);

  const studentData = {
    nama: "Gilang Ramadhan Indra",
    nim: "1225011323",
    semester: "6",
    tanggalMulai: "31 Januari 2025",
    tanggalSelesai: "01 Maret 2025",
    progress: 80,
  };

  const [agendaEntries] = useState([
    {
      id: 1,
      agenda: "1",
      nama_agenda: "Kegiatan 1",
      waktu: "08:00 - 10:00",
      status: "Design UI/UX",
    },
    {
      id: 2,
      agenda: "2",
      nama_agenda: "Kegiatan 2",
      waktu: "10:00 - 12:00",
      status: "Frontend Development",
    },
    {
      id: 3,
      agenda: "3",
      nama_agenda: "Kegiatan 3",
      waktu: "13:00 - 15:00",
      status: "Backend Development",
    },
    {
      id: 4,
      agenda: "4",
      nama_agenda: "Kegiatan 3",
      waktu: "13:00 - 15:00",
      status: "Backend Development",
    },
  ]);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Student Profile Card Component that includes both progress chart and bio data
  const StudentProfileCard = ({
    student,
    isLoading,
  }: {
    student: any;
    isLoading: boolean;
  }) => {
    // Modern Progress Circle Component
    const radius = 80;
    const strokeWidth = 20;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset =
      circumference - (student.progress / 100) * circumference;

    if (isLoading) {
      return (
        <div className="rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="flex flex-col md:flex-row">
            {/* Progress Chart Section Skeleton */}
            <div className="relative flex items-center justify-center p-6 md:w-64">
              <Skeleton className="h-40 w-40 rounded-full" />
            </div>

            {/* Student Bio Data Section Skeleton */}
            <div className="flex flex-col gap-3 justify-center flex-1 p-6 border-t md:border-t-0 md:border-l border-gray-100">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-48 ml-7" />

              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-24 ml-7" />

              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-16 ml-7" />

              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-56 ml-7" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="flex flex-col md:flex-row">
          {/* Progress Chart Section */}
          <div className="relative flex items-center justify-center p-6 md:w-64">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Glowing background effect */}
              <div className="absolute inset-0 rounded-full opacity-70"></div>

              {/* Background Circle with light gray */}
              <svg
                height={radius * 2}
                width={radius * 2}
                className="drop-shadow-md"
              >
                <defs>
                  <linearGradient
                    id="bgGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#f1f5f9" />
                    <stop offset="100%" stopColor="#e2e8f0" />
                  </linearGradient>
                </defs>
                <circle
                  stroke="url(#bgGradient)"
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                />

                {/* Progress Circle with multi-color gradient */}
                <defs>
                  <linearGradient
                    id="progressGradient"
                    gradientUnits="userSpaceOnUse"
                    x1="80"
                    y1="0"
                    x2="80"
                    y2="160"
                  >
                    <stop offset="0%" stopColor="#4ADE80" />{" "}
                    {/* Green at top */}
                    <stop offset="33%" stopColor="#84CC16" />{" "}
                    {/* Green-yellow */}
                    <stop offset="66%" stopColor="#EAB308" />{" "}
                    {/* Yellow-orange */}
                    <stop offset="100%" stopColor="#EF4444" />{" "}
                    {/* Red at bottom */}
                  </linearGradient>
                </defs>
                <circle
                  stroke="url(#progressGradient)"
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference + " " + circumference}
                  style={{
                    strokeDashoffset,
                    transform: "rotate(-90deg)",
                    transformOrigin: "center",
                    transition: "stroke-dashoffset 1s ease-in-out",
                  }}
                  strokeLinecap="round"
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                />
              </svg>

              {/* Percentage Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm text-gray-500">Progress</span>
                <div className="relative">
                  <span className="text-4xl font-bold text-gray-900">
                    {student.progress}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Student Bio Data Section */}
          <div className="flex flex-col gap-3 justify-center flex-1 p-6 border-t md:border-t-0 md:border-l border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
              <div className="flex items-center gap-2 w-full sm:w-48">
                <User size={18} className="text-gray-800" />
                <span className="font-medium text-gray-800">Nama Lengkap</span>
              </div>
              <div className="flex items-center gap-2 pl-6 sm:pl-0">
                <span className="text-gray-600">:</span>
                <span className="text-gray-900">{student.nama}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
              <div className="flex items-center gap-2 w-full sm:w-48">
                <FileDigit size={18} className="text-gray-800" />
                <span className="font-medium text-gray-800">NIM</span>
              </div>
              <div className="flex items-center gap-2 pl-6 sm:pl-0">
                <span className="text-gray-600">:</span>
                <span className="text-gray-900">{student.nim}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
              <div className="flex items-center gap-2 w-full sm:w-48">
                <Rocket size={18} className="text-gray-800" />
                <span className="font-medium text-black">Semester</span>
              </div>
              <div className="flex items-center gap-2 pl-6 sm:pl-0">
                <span className="text-gray-600">:</span>
                <span className="text-gray-900">{student.semester}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
              <div className="flex items-center gap-2 ">
                <Calendar size={18} className="text-gray-800" />
                <span className="font-medium text-black">
                  Tanggal Mulai/Selesai
                </span>
              </div>
              <div className="flex items-center gap-2 pl-6 sm:pl-0">
                <span className="text-gray-600 ml-2">:</span>
                <span className="text-gray-900">
                  {student.tanggalMulai}/{student.tanggalSelesai}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center mr-3 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Daily Report Kerja Praktik Mahasiswa
        </h1>
      </div>

      {/* Combined Student Profile Card */}
      <StudentProfileCard student={studentData} isLoading={isLoading} />

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          {isLoading ? (
            <Skeleton className="h-6 w-64" />
          ) : (
            <h2 className="text-lg font-semibold text-gray-800">
              List Agenda Kerja Praktik Tanggal {tanggal}
            </h2>
          )}
        </div>

        {/* Table Section */}
        <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="text-center">
                  {isLoading ? (
                    <Skeleton className="h-4 w-16 mx-auto" />
                  ) : (
                    "Kegiatan ke-"
                  )}
                </TableHead>
                <TableHead className="text-center">
                  {isLoading ? (
                    <Skeleton className="h-4 w-24 mx-auto" />
                  ) : (
                    "Waktu"
                  )}
                </TableHead>
                <TableHead className="text-center">
                  {isLoading ? (
                    <Skeleton className="h-4 w-16 mx-auto" />
                  ) : (
                    "Agenda"
                  )}
                </TableHead>
                <TableHead className="text-center">
                  {isLoading ? (
                    <Skeleton className="h-4 w-24 mx-auto" />
                  ) : (
                    "Aksi"
                  )}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? [...Array(3)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center">
                        <Skeleton className="h-4 w-6 mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Skeleton className="h-4 w-24 mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Skeleton className="h-6 w-32 mx-auto" />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Skeleton className="h-8 w-8 rounded" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : agendaEntries.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-transparent">
                      <TableCell className="text-center">
                        {entry.agenda}
                      </TableCell>
                      <TableCell className="text-center">
                        {entry.waktu}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <span className="inline-block px-3 py-1 rounded-md text-xs font-medium">
                            {entry.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Button
                            size="sm"
                            className="bg-blue-500 text-white hover:bg-blue-700"
                            onClick={() => setIsModalOpen(true)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
        {/* Row Selection Indicator */}
        <div className="mt-3 text-sm text-gray-500">
          {selectedRows.length} of {agendaEntries.length} row(s) selected.
        </div>
      </div>
      <div>
        <h1>
          Berikan Komentar Daily Report Mahasiswa{" "}
          <span className="text-red-500">*</span>
        </h1>
        <div className="flex flex-col gap-2">
          <textarea
            className="border border-gray-300 rounded-md p-2"
            rows={1}
            placeholder="Tulis komentar di sini..."
          ></textarea>
          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              variant="default"
              size="sm"
              className=" bg-blue-500 text-white hover:bg-blue-700  "
            >
              <FileInput className="h-4 w-4" />
              Kirim
            </Button>
          </div>
        </div>
      </div>
      <ModalAdendaMahasiswa
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default DailyReportKerjaPraktikMahasiswaDetailPage;
