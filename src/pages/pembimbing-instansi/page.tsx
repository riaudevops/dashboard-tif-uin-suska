import { useState, useEffect } from "react";
import { Search, Calendar } from "lucide-react";
import icon_dosenpa_page from "@/assets/svgs/dosen/setoran-hafalan/mahasiswa/icon_dosenpa_page.svg";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const InstansiKerjaPraktikPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredButtonId, setHoveredButtonId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [, setShowStatCards] = useState(false);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    const statCardsTimer = setTimeout(() => {
      setShowStatCards(true);
    }, 1200);

    return () => {
      clearTimeout(timer);
      clearTimeout(statCardsTimer);
    };
  }, []);

  // Extended student list to demonstrate pagination with added dailyReports
  const students = [
    {
      id: 1,
      name: "Abmi Sukma",
      status: "Mahasiswa",
      university: "UIN SUSKA RIAU",
      dailyReports: 15,
      tanggalMulai: "31 Januari 2025",
      tanggalSelesai: "31 Desember 2025",
      progress: 75,
    },
    {
      id: 2,
      name: "Muh. Zaki Erbai Syas",
      status: "Mahasiswa",
      university: "UIN SUSKA RIAU",
      dailyReports: 8,
      tanggalMulai: "31 Januari 2025",
      tanggalSelesai: "31 Desember 2025",
      progress: 40,
    },
    {
      id: 3,
      name: "Ahmad Kurniawan",
      status: "Mahasiswa",
      university: "UIN SUSKA RIAU",
      dailyReports: 12,
      tanggalMulai: "31 Januari 2025",
      tanggalSelesai: "31 Desember 2025",
      progress: 60,
    },
    {
      id: 4,
      name: "Farhan Aulia",
      status: "Mahasiswa",
      university: "UIN SUSKA RIAU",
      dailyReports: 20,
      tanggalMulai: "31 Januari 2025",
      tanggalSelesai: "31 Desember 2025",
      progress: 90,
    },
    {
      id: 5,
      name: "Farras Lathief",
      status: "Mahasiswa",
      university: "UIN SUSKA RIAU",
      dailyReports: 5,
      tanggalMulai: "31 Januari 2025",
      tanggalSelesai: "31 Desember 2025",
      progress: 25,
    },
    {
      id: 6,
      name: "M. Gilang Indra",
      status: "Mahasiswa",
      university: "UIN SUSKA RIAU",
      dailyReports: 10,
      tanggalMulai: "31 Januari 2025",
      tanggalSelesai: "31 Desember 2025",
      progress: 50,
    },
    {
      id: 7,
      name: "Sarah Nur Afifah",
      status: "Mahasiswa",
      university: "UIN SUSKA RIAU",
      dailyReports: 18,
      tanggalMulai: "31 Januari 2025",
      tanggalSelesai: "31 Desember 2025",
      progress: 85,
    },
    {
      id: 8,
      name: "Rahma Putri",
      status: "Mahasiswa",
      university: "UIN SUSKA RIAU",
      dailyReports: 7,
      tanggalMulai: "31 Januari 2025",
      tanggalSelesai: "31 Desember 2025",
      progress: 30,
    },
    {
      id: 9,
      name: "Dimas Pratama",
      status: "Mahasiswa",
      university: "UIN SUSKA RIAU",
      dailyReports: 14,
      tanggalMulai: "31 Januari 2025",
      tanggalSelesai: "31 Desember 2025",
      progress: 70,
    },
    {
      id: 10,
      name: "Anisa Wijaya",
      status: "Mahasiswa",
      university: "UIN SUSKA RIAU",
      dailyReports: 11,
      tanggalMulai: "31 Januari 2025",
      tanggalSelesai: "31 Desember 2025",
      progress: 55,
    },
    {
      id: 11,
      name: "Rizky Maulana",
      status: "Mahasiswa",
      university: "UIN SUSKA RIAU",
      dailyReports: 16,
      tanggalMulai: "31 Januari 2025",
      tanggalSelesai: "31 Desember 2025",
      progress: 65,
    },
  ];

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination values
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStudents.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page : number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];

    // Add "Previous" button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          className={`border rounded-md ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          } transition-all duration-300 hover:shadow-md`}
          onClick={() => handlePageChange(currentPage - 1)}
          tabIndex={currentPage === 1 ? -1 : 0}
        />
      </PaginationItem>
    );

    // Create numbered pagination items
    if (totalPages <= 5) {
      // Show all pages if 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              className={
                currentPage === i
                  ? "bg-teal-50 text-teal-700 border-teal-200 transform scale-110 shadow-sm transition-all duration-300"
                  : "text-slate-700 border hover:border-teal-200 hover:text-teal-700 transition-all duration-300 hover:scale-110"
              }
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            isActive={currentPage === 1}
            className={
              currentPage === 1
                ? "bg-teal-50 text-teal-700 border-teal-200 transform scale-110 shadow-sm transition-all duration-300"
                : "text-slate-700 border hover:border-teal-200 hover:text-teal-700 transition-all duration-300 hover:scale-110"
            }
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if current page is > 3
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationLink className="text-slate-700 border hover:border-teal-200 hover:text-teal-700">
              ...
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          // Skip first and last pages as they're added separately
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                isActive={currentPage === i}
                className={
                  currentPage === i
                    ? "bg-teal-50 text-teal-700 border-teal-200 transform scale-110 shadow-sm transition-all duration-300"
                    : "text-slate-700 border hover:border-teal-200 hover:text-teal-700 transition-all duration-300 hover:scale-110"
                }
                onClick={() => handlePageChange(i)}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      // Show ellipsis if current page is < totalPages - 2
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationLink className="text-slate-700 border hover:border-teal-200 hover:text-teal-700">
              ...
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Always show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              isActive={currentPage === totalPages}
              className={
                currentPage === totalPages
                  ? "bg-teal-50 text-teal-700 border-teal-200 transform scale-110 shadow-sm transition-all duration-300"
                  : "text-slate-700 border hover:border-teal-200 hover:text-teal-700 transition-all duration-300 hover:scale-110"
              }
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    // Add "Next" button
    items.push(
      <PaginationItem key="next">
        <PaginationNext
          className={`border rounded-md ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          } transition-all duration-300 hover:shadow-md`}
          onClick={() => handlePageChange(currentPage + 1)}
          tabIndex={currentPage === totalPages ? -1 : 0}
        />
      </PaginationItem>
    );

    return items;
  };

  // Skeleton loading component
  const SkeletonRow = () => (
    <TableRow className="border-b animate-pulse">
      <TableCell className="py-4">
        <div className="h-4 w-32 bg-slate-200 rounded"></div>
      </TableCell>
      <TableCell><div className="h-4 w-24 bg-slate-200 rounded"></div></TableCell>
      <TableCell><div className="h-4 w-24 bg-slate-200 rounded"></div></TableCell>
      <TableCell><div className="h-4 w-8 bg-slate-200 rounded mx-auto"></div></TableCell>
      <TableCell className="text-center">
        <div className="h-8 w-24 bg-slate-200 rounded mx-auto"></div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      {/* Top Section with Date only (profile removed) */}
      <motion.div 
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 flex items-center mt-1 text-sm">
            <Calendar size={16} className="mr-2" />
            {formattedDate}
          </p>
        </div>
      </motion.div>

      {/* Welcome Card with Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        <Card className="mb-8 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 border-none relative overflow-hidden">
          {/* Animated decorative circles */}
          <motion.div 
            className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1] 
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
          <motion.div 
            className="absolute -bottom-14 -left-14 w-48 h-48 bg-white opacity-5 rounded-full"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.05, 0.1, 0.05] 
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
          <motion.div 
            className="absolute top-1/2 right-1/4 transform -translate-y-1/2 w-24 h-24 bg-white opacity-5 rounded-full"
            animate={{ 
              scale: [1, 1.4, 1],
              opacity: [0.05, 0.12, 0.05] 
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />

          <CardHeader className="pb-32">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <CardTitle className="text-3xl font-bold text-white">
                Selamat Datang, Pembimbing Instansi!
              </CardTitle>
              <CardDescription className="text-teal-100 opacity-90 text-lg">
                Pembimbing Profesional Kerja Praktik
              </CardDescription>
            </motion.div>
          </CardHeader>
          <div>
            <motion.div 
              className="absolute bottom-0 right-0"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <img src={icon_dosenpa_page} alt="" />
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Student List Section with Animation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <Card className="shadow-md transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 pb-4 border-b">
            <div>
              <CardTitle className="text-xl text-slate-800">
                Daftar Mahasiswa Kerja Praktik
              </CardTitle>
              <CardDescription className="text-slate-500">
                Kelola dan pantau progres mahasiswa
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Cari mahasiswa..."
                className="pl-9 border-slate-300 focus:border-teal-300 w-full sm:w-64 transition-all duration-300 focus:shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="hover:bg-slate-50">
                  <TableHead className="w-24 sm:w-auto text-center text-gray-700">
                    Nama Mahasiswa
                  </TableHead>
                  <TableHead className="w-24 sm:w-auto text-center text-gray-700">
                    Tanggal Mulai
                  </TableHead>
                  <TableHead className="w-24 sm:w-auto text-center text-gray-700">
                    Tanggal Selesai
                  </TableHead>
                  <TableHead className="w-24 sm:w-auto text-center text-gray-700">
                    Jumlah Daily Report
                  </TableHead>
                  <TableHead className="w-24 sm:w-auto text-center text-gray-700">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Show skeleton loading rows
                  Array(5).fill(null).map((_, index) => (
                    <SkeletonRow key={`skeleton-${index}`} />
                  ))
                ) : (
                  // Show actual data rows without motion effects
                  currentItems.map((student) => (
                    <TableRow
                      key={student.id}
                      className="border-b hover:bg-slate-50/50 transition-colors cursor-pointer"
                    >
                      <TableCell className="font-medium text-slate-800 text-center py-4">
                        {student.name}
                      </TableCell>
                      <TableCell className="text-slate-600 text-center py-4">
                        {student.tanggalMulai}
                      </TableCell>
                      <TableCell className="text-slate-600 text-center py-4">
                        {student.tanggalSelesai}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center p-2">
                          <div className="text-xl font-bold text-teal-600 mb-1">
                            {student.dailyReports}
                          </div>
                          
                          <div className="w-full relative">
                            {/* Enhanced progress bar with gradient and animation */}
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                              <div 
                                className={`h-full transition-all duration-700 ease-out ${
                                  student.progress >= 75 ? 'bg-gradient-to-r from-teal-400 to-emerald-500' : 
                                  student.progress >= 50 ? 'bg-gradient-to-r from-teal-400 to-teal-500' : 
                                  student.progress >= 25 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 
                                  'bg-gradient-to-r from-rose-400 to-rose-500'
                                }`}
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>
                            
                            {/* Percentage indicator with matching color */}
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-slate-500">Progress</span>
                              <span className={`text-xs font-semibold ${
                                student.progress >= 75 ? 'text-emerald-600' : 
                                student.progress >= 50 ? 'text-teal-600' : 
                                student.progress >= 25 ? 'text-amber-600' : 
                                'text-rose-600'
                              }`}>
                                {student.progress}% selesai
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/instansi/detail/${student.id}`)}
                          className="bg-teal-500 text-white hover:text-white hover:bg-teal-600 transition-all duration-300 shadow-sm hover:shadow-md"
                          onMouseEnter={() => setHoveredButtonId(student.id)}
                          onMouseLeave={() => setHoveredButtonId(null)}
                        >
                          {hoveredButtonId === student.id ? (
                            <Eye size={16} className="mr-2" />
                          ) : (
                            <EyeClosed size={16} className="mr-2" />
                          )}
                          Lihat Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            {/* Empty state when no students match search */}
            <AnimatePresence>
              {filteredStudents.length === 0 && !isLoading && (
                <motion.div 
                  className="py-12 flex flex-col items-center justify-center text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <Search size={40} className="text-slate-300 mb-4" />
                  </motion.div>
                  <h3 className="text-lg font-medium text-slate-700">
                    Tidak ada mahasiswa
                  </h3>
                  <p className="text-slate-500 mt-1 max-w-md">
                    Tidak ada mahasiswa yang cocok dengan pencarian "{searchTerm}".
                    Coba dengan kata kunci lain.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {filteredStudents.length > 0 && !isLoading && (
              <motion.div 
                className="py-4 px-6 border-t border-slate-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <div className="flex justify-between items-center w-full">
                  <div className="flex-shrink-0">
                    <p className="text-sm text-slate-500">
                      {indexOfFirstItem + 1}-
                      {Math.min(indexOfLastItem, filteredStudents.length)} dari{" "}
                      {filteredStudents.length} Mahasiswa
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-auto">
                    <Pagination>
                      <PaginationContent>
                        {renderPaginationItems()}
                      </PaginationContent>
                    </Pagination>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default InstansiKerjaPraktikPage;