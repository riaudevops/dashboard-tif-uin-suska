import { useState, useEffect } from "react";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  SquareArrowOutUpRight,
  FileText,
  Users,
  Briefcase,
  CheckCircle,
  AlertTriangle,
  X,
  LayoutGridIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import APIKerjaPraktik from "@/services/api/koordinator-kp/daily-report.service";

interface DailyReport {
  id: string;
  status: string;
}

interface Instansi {
  id: string;
  nama: string;
}

interface Mahasiswa {
  nama: string;
  nim: string;
}

interface TahunAjaran {
  nama: string;
}

interface MahasiswaKP {
  id: string;
  status: string;
  tahun_ajaran: TahunAjaran;
  mahasiswa: Mahasiswa;
  instansi: Instansi;
  daily_report?: DailyReport;
}

interface TableData {
  id: string;
  name: string;
  nim: string;
  Angkatan: string;
  company: string;
  status: string;
  tahunAjaran: string;
}

interface CardData {
  title: string;
  value: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  shadowColor: string;
  description: string;
}

const KoordinatorKerjaPraktikDailyReportPage: React.FC = () => {
  const navigate = useNavigate();
  const [academicYear, setAcademicYear] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("Semua Riwayat");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [statsVisible, setStatsVisible] = useState<boolean>(false);
  const itemsPerPage = 10;

  const {
    data: mahasiswaList,
    isLoading,
    error,
  } = useQuery<MahasiswaKP[], Error>({
    queryKey: ["all-mahasiswa"],
    queryFn: () => APIKerjaPraktik.getAllMahasiswa().then((data) => data.data),
    staleTime: Infinity,
  });

  const academicYears = [
    ...new Set(mahasiswaList?.map((mhs) => mhs.tahun_ajaran?.nama || "") || []),
  ].sort();

  useEffect(() => {
    if (academicYears.length > 0 && !academicYear) {
      setAcademicYear(academicYears[0]);
    }
  }, [academicYears]);

  const tableData: TableData[] = mahasiswaList
    ? mahasiswaList.map((mhs) => {
        const nim = mhs.mahasiswa?.nim || "";
        const angkatan = nim.length >= 3 ? `20${nim.slice(1, 3)}` : "Unknown";
        return {
          id: mhs.id,
          name: mhs.mahasiswa?.nama || "Unknown",
          nim: nim,
          Angkatan: angkatan,
          company: mhs.instansi?.nama || "Unknown",
          status: mhs.status || "Unknown",
          tahunAjaran: mhs.tahun_ajaran?.nama || "Unknown",
        };
      })
    : [];

  const cardData: CardData[] = [
    {
      title: "Total Mahasiswa",
      value: tableData.length,
      icon: Users,
      color:
        "bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-900",
      shadowColor: "shadow-blue-500/20 dark:shadow-blue-800/30",
      description: "Mahasiswa yang Melaksanakan KP",
    },
    {
      title: "Laporan Terkumpul",
      value: tableData.filter(
        (item) =>
          item.status !== "Gagal" &&
          mahasiswaList?.find((m) => m.id === item.id)?.daily_report?.status
      ).length,
      icon: FileText,
      color:
        "bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-900",
      shadowColor: "shadow-purple-500/20 dark:shadow-purple-800/30",
      description: "Total Keseluruhan Laporan",
    },
    {
      title: "Perusahaan",
      value: [...new Set(tableData.map((item) => item.company))].length,
      icon: Briefcase,
      color:
        "bg-gradient-to-br from-amber-500 to-amber-700 dark:from-amber-600 dark:to-amber-900",
      shadowColor: "shadow-amber-500/20 dark:shadow-amber-800/30",
      description: "Perusahaan yang Terdaftar",
    },
    {
      title: "Progress 100%",
      value: tableData.filter((item) => item.status === "Selesai").length,
      icon: CheckCircle,
      color:
        "bg-gradient-to-br from-emerald-500 to-emerald-700 dark:from-emerald-600 dark:to-emerald-900",
      shadowColor: "shadow-emerald-500/20 dark:shadow-emerald-800/30",
      description: "Mahasiswa dengan Progress Penuh",
    },
  ];

  const angkatanYears = [
    ...new Set(tableData.map((item) => item.Angkatan)),
  ].sort();

  const filteredData = tableData.filter(
    (item) =>
      (activeTab === "Semua Riwayat" || item.Angkatan === activeTab) &&
      (academicYear === "" || item.tahunAjaran === academicYear) &&
      (searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nim.includes(searchTerm) ||
        item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Baru":
        return {
          badge:
            "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
        };
      case "Lanjut":
        return {
          badge:
            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
        };
      case "Gagal":
        return {
          badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
        };
      case "Selesai":
        return {
          badge:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
        };
      default:
        return {
          badge:
            "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        };
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab, academicYear]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Gagal memuat data: {error.message}
          </p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Coba Lagi
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex">
            <span className="bg-white flex justify-center items-center shadow-sm text-gray-800 dark:text-gray-200 dark:bg-gray-900 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 text-md font-medium tracking-tight">
              <span
                className={`inline-block animate-pulse w-3 h-3 rounded-full mr-2 bg-yellow-400`}
              />
              <LayoutGridIcon className="w-4 h-4 mr-1.5" />
              Daily Report Kerja Praktik Mahasiswa
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                className="px-3 py-1 pr-8 text-sm bg-white border rounded-lg shadow-sm appearance-none focus:outline-none active:outline-none dark:bg-gray-800 dark:border-gray-700 focus:ring-0 active:ring-0"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                disabled={academicYears.length === 0}
              >
                {academicYears.length > 0 ? (
                  academicYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))
                ) : (
                  <option value="">-</option>
                )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronRight className="w-4 h-4 text-gray-500 rotate-90 dark:text-gray-400" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={statsVisible ? "visible" : "hidden"}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {cardData.map((card, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 },
              }}
              className={`${card.shadowColor} shadow-lg`}
            >
              <Card
                className={`border-none overflow-hidden ${card.color} text-white h-full relative`}
              >
                <motion.div
                  className="absolute transform -translate-y-1/2 top-1/2 right-4 opacity-10"
                  initial={{ scale: 0.7, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 3,
                    delay: index * 0.5,
                  }}
                >
                  <card.icon />
                </motion.div>
                <CardContent className="p-6">
                  <div className="flex items-start mt-1">
                    <div className="p-2 mr-4 rounded-lg bg-white/20">
                      <card.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium opacity-90">
                        {card.title}
                      </p>
                      <h3 className="mt-1 text-3xl font-bold">{card.value}</h3>
                    </div>
                  </div>
                  <div className="mt-4 text-sm opacity-80">
                    {card.description}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col items-start justify-between gap-4 pt-2 md:flex-row md:items-center"
        >
          <div className="flex w-full gap-2 md:w-auto">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="bg-gray-100 dark:bg-gray-700 p-0.5 rounded-md">
                <TabsTrigger
                  value="Semua Riwayat"
                  className="text-sm font-medium data-[state=active]:bg-blue-500 dark:data-[state=active]:bg-blue-700 data-[state=active]:text-white rounded-md"
                >
                  Semua Angkatan
                </TabsTrigger>
                {angkatanYears.map((year) => (
                  <TabsTrigger
                    key={year}
                    value={year}
                    className="text-sm font-medium data-[state=active]:bg-blue-500 dark:data-[state=active]:bg-blue-700 data-[state=active]:text-white rounded-md"
                  >
                    {year}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="relative w-full">
            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              placeholder="Cari nama, NIM, perusahaan, atau status..."
              className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <AnimatePresence>
              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={clearSearch}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="flex flex-wrap gap-2 mb-4"
        >
          {academicYear && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1 px-3 py-1 rounded-full shadow-sm bg-blue-50 dark:bg-blue-900/20"
            >
              <span className="text-sm text-blue-600 dark:text-blue-400">
                {academicYear}
              </span>
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setAcademicYear(academicYears[0] || "")}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800"
              >
                <X className="w-3 h-3" />
              </motion.button>
            </motion.div>
          )}
          {/* {activeTab !== "Semua Riwayat" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1 px-3 py-1 rounded-full shadow-sm bg-blue-50 dark:bg-blue-900/20"
            >
              <span className="text-sm text-blue-600 dark:text-blue-400">
                Angkatan: {activeTab}
              </span>
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveTab("Semua Riwayat")}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800"
              >
                <X className="w-3 h-3" />
              </motion.button>
            </motion.div>
          )} */}
          {searchTerm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1 px-3 py-1 rounded-full shadow-sm bg-blue-50 dark:bg-blue-900/20"
            >
              <span className="text-sm text-blue-600 dark:text-blue-400">
                Search: {searchTerm}
              </span>
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={clearSearch}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800"
              >
                <X className="w-3 h-3" />
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="w-full overflow-hidden bg-white border rounded-md shadow-md dark:bg-gray-800 dark:border-gray-700"
        >
          <Table>
            <TableHeader className="bg-gray-100 dark:bg-gray-900/40">
              <TableRow>
                <TableHead className="font-semibold text-center text-gray-700 dark:text-gray-300">
                  No.
                </TableHead>
                <TableHead className="font-semibold text-center text-gray-700 dark:text-gray-300">
                  Nama
                </TableHead>
                <TableHead className="font-semibold text-center text-gray-700 dark:text-gray-300">
                  NIM
                </TableHead>
                <TableHead className="font-semibold text-center text-gray-700 dark:text-gray-300">
                  Angkatan
                </TableHead>
                <TableHead className="font-semibold text-center text-gray-700 dark:text-gray-300">
                  Instansi
                </TableHead>
                <TableHead className="font-semibold text-center text-gray-700 dark:text-gray-300">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-center text-gray-700 dark:text-gray-300">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    className={
                      parseInt(item.id, 10) % 2 === 0
                        ? "bg-gray-50 dark:bg-gray-900/10 hover:bg-gray-100 dark:hover:bg-gray-900/20 transition-colors"
                        : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/20 transition-colors"
                    }
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <TableCell className="font-medium text-center">
                      {index + 1}.
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      {item.name}
                    </TableCell>
                    <TableCell className="text-center">{item.nim}</TableCell>
                    <TableCell className="text-center">
                      {item.Angkatan}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.company}
                    </TableCell>
                    <TableCell className="px-2 py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          getStatusStyles(item.status).badge
                        }`}
                      >
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-white transition-colors bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                        onClick={() =>
                          navigate(
                            `/koordinator-kp/kerja-praktik/daily-report/detail-mahasiswa?id=${item.id}`
                          )
                        }
                      >
                        <SquareArrowOutUpRight className="w-4 h-4 mr-1" />
                        Detail
                      </motion.button>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="py-6 text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-col items-center"
                    >
                      <AlertTriangle className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Tidak ada data yang sesuai dengan filter atau
                        pencarian...
                      </p>
                      {(searchTerm ||
                        activeTab !== "Semua Riwayat" ||
                        academicYear) && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 mt-4 text-sm text-white bg-blue-500 rounded-md"
                          onClick={() => {
                            setSearchTerm("");
                            setActiveTab("Semua Riwayat");
                            setAcademicYear(academicYears[0] || "");
                            setCurrentPage(1);
                          }}
                        >
                          Reset Filter
                        </motion.button>
                      )}
                    </motion.div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between p-4 border-t dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredData.length)} of{" "}
              {filteredData.length} Mahasiswa
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-8 h-8 p-0 border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    return (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                    );
                  })
                  .map((page, index, array) => {
                    const showEllipsisBefore =
                      index > 0 && array[index - 1] !== page - 1;
                    const showEllipsisAfter =
                      index < array.length - 1 && array[index + 1] !== page + 1;

                    return (
                      <div key={page} className="flex items-center">
                        {showEllipsisBefore && (
                          <span className="mx-1 text-gray-400 dark:text-gray-500">
                            ...
                          </span>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handlePageChange(page)}
                          className={`h-8 w-8 flex items-center justify-center rounded-md text-sm font-medium ${
                            currentPage === page
                              ? "bg-blue-500 dark:bg-blue-600 text-white"
                              : "text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          {page}
                        </motion.button>
                        {showEllipsisAfter && (
                          <span className="mx-1 text-gray-400 dark:text-gray-500">
                            ...
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-8 h-8 p-0 border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default KoordinatorKerjaPraktikDailyReportPage;
