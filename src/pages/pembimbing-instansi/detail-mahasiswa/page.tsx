import { useState, useEffect } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";

const DailyReportKerjaPraktikMahasiswaPage = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
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

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

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

  const handleCheckboxChange = (hari : string) => {
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

  const getStatusColor = (status : string) => {
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
  const StudentProfileCard = ({ student }: { student : any, loading : boolean}) => {

    return (
      <div className="rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="flex flex-col md:flex-row">

          {/* Student Bio Data Section */}
          <div className="flex flex-col gap-3 justify-center flex-1 p-6 border-t md:border-t-0 md:border-l border-gray-100">
            {loading ? (
              <>
                <div className="flex items-center gap-2">
                  <User size={18} className="text-gray-400" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-48 ml-4" />
                </div>
                <div className="flex items-center gap-2">
                  <FileDigit size={18} className="text-gray-400" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-32 ml-4" />
                </div>
                <div className="flex items-center gap-2">
                  <Rocket size={18} className="text-gray-400" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16 ml-4" />
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-gray-400" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-48 ml-4" />
                </div>
              </>
            ) : (
              <>
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
                  <div className="flex items-center gap-2 w-full sm:w-48">
                    <Calendar size={18} className="text-gray-800" />
                    <span className="font-medium text-black">Periode KP</span>
                  </div>
                  <div className="flex items-center gap-2 pl-6 sm:pl-0">
                    <span className="text-gray-600">:</span>
                    <span className="text-gray-900">{student.tanggalMulai} - {student.tanggalSelesai}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Table loading skeleton
  const TableLoadingSkeleton = () => (
    <div className="bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
      <Card className="rounded-lg border border-gray-300">
        <div className="p-4">
          <div className="h-10 bg-blue-500/10 rounded-lg mb-4" />
          {[...Array(5)].map((_, index) => (
            <div 
              key={index} 
              className="flex items-center space-x-4 py-4 animate-pulse border-b border-gray-100 last:border-0"
            >
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-6 w-40 flex-1" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-5 w-5 rounded-sm" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

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
      <StudentProfileCard student={studentData} loading={loading} />

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Daftar Laporan Harian
          </h2>
          {!loading && (
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
          )}
          {loading && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          )}
        </div>

        {/* Table section with loading state */}
        {loading ? (
          <TableLoadingSkeleton />
        ) : (
          <>
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
                              className="bg-teal-500 text-white hover:text-white hover:bg-teal-600 transition-all duration-300 shadow-sm hover:shadow-md"
                              onClick={() =>
                                navigate(
                                  `/instansi/detail-mahasiswa/detail?tanggal=${row.tanggal}`
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
                        className={pageNum === currentPage ? "bg-emerald-50 text-emerald-950 hover:bg-emerald-200" : ""}
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
          </>
        )}
      </div>
    </div>
  );
};

export default DailyReportKerjaPraktikMahasiswaPage;