import { useState } from "react";
import {
  ArrowLeft,
  User,
  FileDigit,
  CheckCheck,
  Repeat2,
  Rocket,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
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
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

const DailyReportKerjaPraktikMahasiswaPage = () => {
  const [selectedRows, setSelectedRows] = useState<String[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const studentData = {
    nama: "Gilang Ramadhan Indra",
    nim: "1225011323",
    semester: "6",
    tanggalMulai: "31 Januari 2025",
    tanggalSelesai: "01 Maret 2025",
    progress: 80,
  };

  // Sample report data (expanded to demonstrate pagination)
  const allReportData = [
    { hari: 1, tanggal: "Senin, 25 Februari 2025", status: "Disetujui" },
    { hari: 2, tanggal: "Selasa, 24 Februari 2025", status: "Disetujui" },
    { hari: 3, tanggal: "Rabu, 23 Februari 2025", status: "Belum" },
    { hari: 4, tanggal: "Kamis, 22 Februari 2025", status: "Direvisi" },
    { hari: 5, tanggal: "Jumat, 21 Februari 2025", status: "Direvisi" },
    { hari: 6, tanggal: "Senin, 18 Februari 2025", status: "Disetujui" },
    { hari: 7, tanggal: "Selasa, 17 Februari 2025", status: "Disetujui" },
    { hari: 8, tanggal: "Rabu, 16 Februari 2025", status: "Disetujui" },
    { hari: 9, tanggal: "Kamis, 15 Februari 2025", status: "Menunggu" },
    { hari: 10, tanggal: "Jumat, 14 Februari 2025", status: "Direvisi" },
  ];

  // Calculate total pages
  const totalPages = Math.ceil(allReportData.length / itemsPerPage);
  
  // Get current page data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReportData = allReportData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber : number) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleCheckboxChange = (hari: String) => {
    setSelectedRows((prev) => {
      if (prev.includes(hari)) {
        return prev.filter((item) => item !== hari);
      } else {
        return [...prev, hari];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentReportData.map((row) => row.hari.toString()));
    }
    setSelectAll(!selectAll);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disetujui":
        return "bg-green-100 text-green-600";
      case "Direvisi":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100";
    }
  };

  // Student Profile Card Component that includes both progress chart and bio data
  const StudentProfileCard = ({ student }: { student: any }) => {
    // Modern Progress Circle Component
    const radius = 80;
    const strokeWidth = 20;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset =
      circumference - (student.progress / 100) * circumference;

    return (
      <div className="rounded-xl overflow-hidden">
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
                <span className="text-gray-900">{student.tanggalMulai}/{student.tanggalSelesai}</span>
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
      <StudentProfileCard student={studentData} />

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Daftar Laporan Harian
          </h2>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              className="flex items-center bg-emerald-500 text-white hover:bg-emerald-600"
            >
              <CheckCheck size={16} className="mr-1" />
              Setuju
            </Button>
            <Button
              size="sm"
              className="flex items-center bg-amber-500 text-white hover:bg-amber-600"
            >
              <Repeat2 size={16} className="mr-1" />
              Revisi
            </Button>
          </div>
        </div>

        {/* Table section - using Shadcn UI Table */}
        <div className="bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
          <Card className="rounded-lg border border-gray-300 ">
          <Table>
            <TableHeader className="bg-blue-500/10 rounded-lg">
              <TableRow className="bg-primary/10 dark:bg-primary/5">
                <TableHead className="w-24 sm:w-auto text-center text-gray-700 uppercase">
                  Hari ke-
                </TableHead>
                <TableHead className="w-1/2 sm:w-auto text-center text-gray-700 uppercase">
                  Tanggal
                </TableHead>
                <TableHead className="w-1/4 sm:w-auto text-center text-gray-700 uppercase">
                  Status
                </TableHead>
                <TableHead className="w-1/4 sm:w-auto text-center text-gray-700 uppercase">
                  Aksi
                </TableHead>
                <TableHead className="py-3 px-4 w-1/4  sm:w-auto text-gray-700">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                    className="ml-4 border-gray-500 text-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white focus:ring-green-500"
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentReportData.map((row) => (
                <TableRow
                  key={row.hari}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="py-4 px-4 text-sm text-center font-medium text-gray-900">
                    {row.hari}
                  </TableCell>
                  <TableCell className="py-4 px-4 text-sm text-center text-gray-700">
                    {row.tanggal}
                  </TableCell>
                  <TableCell className="py-4 px-4 text-center">
                    <span
                      className={`px-4 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${getStatusColor(
                        row.status
                      )}`}
                    >
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center py-4 px-4">
                    <div className="flex flex-col items-center gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex items-center bg-blue-500 text-white hover:bg-blue-600"
                        onClick={() =>
                          navigate(
                            `/instansi/detailmahasiswa/detail?tanggal=${row.tanggal}`
                          )
                        }
                      >
                        <FileText size={16} />
                        Lihat Detail
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <Checkbox
                      checked={selectedRows.includes(row.hari.toString())}
                      onCheckedChange={() =>
                        handleCheckboxChange(row.hari.toString())
                      }
                      className="ml-4 border-gray-500 text-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white focus:ring-green-500"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </Card>
        </div>

        {/* Improved Pagination footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
          <div className="text-sm text-gray-600 w-full sm:w-auto">
            {selectedRows.length} dari {currentReportData.length} baris dipilih
          </div>
          <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end gap-2">
            <div className="text-sm text-gray-600">
              Halaman {currentPage} dari {totalPages}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center"
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className={pageNum === currentPage ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                  >
                    {pageNum}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline" 
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center"
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReportKerjaPraktikMahasiswaPage;