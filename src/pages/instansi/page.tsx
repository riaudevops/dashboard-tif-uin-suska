import { useState } from "react";
import { Search, Calendar, Bell, Eye, EyeClosed } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const InstansiKerjaPraktikPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredButtonId, setHoveredButtonId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // Extended student list to demonstrate pagination
  const students = [
    {
      id: 1,
      name: "Abmi Sukma",
      status: "Mahasiswa",
      university: "UIN SUSKA RIAU",
      notifications: 1,
      tanggalMulai: "31 Januari 2025",
      tanggalSelesai: "31 Desember 2025",
    },
    {
      id: 2,
      name: "Muh. Zaki Erbai Syas",
      status: "Mahasiswa",
      university: "UIN SUSKA RIAU",
      notifications: 0,
      tanggalMulai: "31 Januari 2025",
      tanggalSelesai: "31 Desember 2025",
    },
    {
      id: 3,
      name: "Ahmad Kurniawan",
      status: "Mahasiswa",
      university: "UIN SUSKA RIAU",
      notifications: 0,
      tanggalMulai: "31 Januari 2025",
      tanggalSelesai: "31 Desember 2025",
    },
    {
      id: 4,
      name: "Farhan Aulia",
      status: "Mahasiswa",
      university: "UIN SUSKA RIAU",
      notifications: 7,
      tanggalMulai: "31 Januari 2025",
      tanggalSelesai: "31 Desember 2025",
    },
    {
      id: 5,
      name: "Farras Lathief",
      status: "Mahasiswa",
      university: "UIN SUSKA RIAU",
      notifications: 0,
      tanggalMulai: "31 Januari 2025",
      tanggalSelesai: "31 Desember 2025",
    },
    {
      id: 6,
      name: "M. Gilang Indra",
      status: "Mahasiswa",
      university: "UIN SUSKA RIAU",
      notifications: 1,
      tanggalMulai: "31 Januari 2025",
      tanggalSelesai: "31 Desember 2025",
    },
    {
      id: 7,
      name: "Sarah Nur Afifah",
      status: "Mahasiswa",
      university: "UIN SUSKA RIAU",
      notifications: 3,
      tanggalMulai: "31 Januari 2025",
      tanggalSelesai: "31 Desember 2025",
    },
    {
      id: 8,
      name: "Rahma Putri",
      status: "Mahasiswa",
      university: "UIN SUSKA RIAU",
      notifications: 0,
      tanggalMulai: "31 Januari 2025",
      tanggalSelesai: "31 Desember 2025",
    },
    {
      id: 9,
      name: "Dimas Pratama",
      status: "Mahasiswa",
      university: "UIN SUSKA RIAU",
      notifications: 2,
      tanggalMulai: "31 Januari 2025",
      tanggalSelesai: "31 Desember 2025",
    },
    {
      id: 10,
      name: "Anisa Wijaya",
      status: "Mahasiswa",
      university: "UIN SUSKA RIAU",
      notifications: 1,
      tanggalMulai: "31 Januari 2025",
      tanggalSelesai: "31 Desember 2025",
    },
    {
      id: 11,
      name: "Rizky Maulana",
      status: "Mahasiswa",
      university: "UIN SUSKA RIAU",
      notifications: 5,
      tanggalMulai: "31 Januari 2025",
      tanggalSelesai: "31 Desember 2025",
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

  const handlePageChange = (page: number) => {
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
          }`}
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
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "text-slate-700 border hover:border-indigo-200 hover:text-indigo-700"
              }
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Complex pagination with ellipses
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            isActive={currentPage === 1}
            className={
              currentPage === 1
                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                : "text-slate-700 border hover:border-indigo-200 hover:text-indigo-700"
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
            <PaginationLink className="text-slate-700 border hover:border-indigo-200 hover:text-indigo-700">
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
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                    : "text-slate-700 border hover:border-indigo-200 hover:text-indigo-700"
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
            <PaginationLink className="text-slate-700 border hover:border-indigo-200 hover:text-indigo-700">
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
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "text-slate-700 border hover:border-indigo-200 hover:text-indigo-700"
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
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          tabIndex={currentPage === totalPages ? -1 : 0}
        />
      </PaginationItem>
    );

    return items;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      {/* Top Section with User Profile and Date */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 flex items-center mt-1 text-sm">
            <Calendar size={16} className="mr-2" />
            {formattedDate}
          </p>
        </div>
      </div>

      {/* Welcome Card - Using Shadcn Card component */}
      <Card className="mb-8 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-700 border-none relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
        <div className="absolute -bottom-14 -left-14 w-48 h-48 bg-white opacity-5 rounded-full"></div>
        <div className="absolute top-1/2 right-1/4 transform -translate-y-1/2 w-24 h-24 bg-white opacity-5 rounded-full"></div>

        <CardHeader className="pb-32">
          <CardTitle className="text-3xl font-bold text-white">
            Selamat Datang, Pembimbing Instansi!
          </CardTitle>
          <CardDescription className="text-purple-100 opacity-90 text-lg">
            Pembimbing Profesional Kerja Praktik
          </CardDescription>
        </CardHeader>
        <div>
          <div className="absolute bottom-0 right-0">
            <img src={icon_dosenpa_page} alt="" />
          </div>
        </div>
      </Card>

      {/* Student List Section - Modern Table Design */}
      <Card className="shadow-md">
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
              className="pl-9 border-slate-300 focus:border-indigo-300 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-slate-50">
                <TableHead className="w-24 sm:w-auto text-center text-gray-700 ">
                  Nama Mahasiswa
                </TableHead>
                <TableHead className="w-24 sm:w-auto text-center text-gray-700 ">
                  Tanggal Mulai
                </TableHead>
                <TableHead className="w-24 sm:w-auto text-center text-gray-700 ">
                  Tanggal Selesai
                </TableHead>
                <TableHead className="w-24 sm:w-auto text-center text-gray-700 ">
                  Daily Report
                </TableHead>
                <TableHead className="w-24 sm:w-auto text-center text-gray-700 ">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((student) => (
                <TableRow
                  key={student.id}
                  className="border-b text-center hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell className="font-medium text-slate-800 py-4">
                    {student.name}
                  </TableCell>
                 <TableCell className="font-medium text-slate-800 py-4">
                    {student.tanggalMulai}
                  </TableCell>
                  <TableCell className="font-medium text-slate-800 py-4">
                    {student.tanggalSelesai}
                  </TableCell>
                  <TableCell>
                    {student.notifications > 0 ? (
                      <Badge
                        variant="default"
                        className="bg-red-100 text-red-700 hover:bg-red-200 border-none"
                      >
                        <Bell size={12} className="mr-1" />
                        {student.notifications}
                      </Badge>
                    ) : (
                      <span className="text-slate-400 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/instansi/detail/${student.name}`)}
                      className="bg-blue-500 text-white hover:text-white hover:bg-blue-600"
                      onMouseEnter={() => setHoveredButtonId(student.id)}
                      onMouseLeave={() => setHoveredButtonId(null)}
                    >
                      {hoveredButtonId === student.id ? (
                        <Eye size={16} />
                      ) : (
                        <EyeClosed size={16} />
                      )}
                      Lihat Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Empty state when no students match search */}
          {filteredStudents.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Search size={40} className="text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-700">
                Tidak ada mahasiswa
              </h3>
              <p className="text-slate-500 mt-1 max-w-md">
                Tidak ada mahasiswa yang cocok dengan pencarian "{searchTerm}".
                Coba dengan kata kunci lain.
              </p>
            </div>
          )}

          {/* Pagination dengan dynamic pages berdasarkan data */}
          {filteredStudents.length > 0 && (
            <div className="py-4 px-6 border-t border-slate-100">
              <div className="flex justify-between items-center w-full">
                <div className="flex-shrink-0">
                  <p className="text-sm text-slate-500">
                    {indexOfFirstItem + 1}-
                    {Math.min(indexOfLastItem, filteredStudents.length)} of{" "}
                    {filteredStudents.length} Row(s) selected
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InstansiKerjaPraktikPage;
