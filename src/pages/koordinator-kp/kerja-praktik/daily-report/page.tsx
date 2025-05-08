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
} from "lucide-react";
import { motion } from "framer-motion";
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

// Main component
export default function KoordinatorKerjaPraktikDailyReportPage() {
  const [academicYear, setAcademicYear] = useState("2023-2024 Ganjil");
  const [activeTab, setActiveTab] = useState("Semua Riwayat");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statsVisible, setStatsVisible] = useState(false);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Sample data with only 8 entries as requested
  const tableData = [
    {
      id: 1,
      name: "Gilang Ramadhan",
      nim: "1225111212",
      Angkatan: "2022",
      dailyReports: 12,
      company: "PT Teknologi Maju",
    },
    {
      id: 2,
      name: "Farhan Fadilla",
      nim: "1225111213",
      Angkatan: "2022",
      dailyReports: 15,
      company: "PT Digital Solution",
    },
    {
      id: 3,
      name: "Ahmad Kurniawan",
      nim: "1225111214",
      Angkatan: "2022",
      dailyReports: 10,
      company: "PT Informatika Nusantara",
    },
    {
      id: 4,
      name: "Muh Zaki Erbay",
      nim: "1225111215",
      Angkatan: "2024",
      dailyReports: 5,
      company: "PT Global Tech",
    },
    {
      id: 5,
      name: "M. Rafly Wirayudha",
      nim: "1225111216",
      Angkatan: "2023",
      dailyReports: 8,
      company: "CV Media Kreatif",
    },
    {
      id: 6,
      name: "Rizky Pratama",
      nim: "1225111217",
      Angkatan: "2022",
      dailyReports: 14,
      company: "PT Solusi Digital",
    },
    {
      id: 7,
      name: "Dimas Nugroho",
      nim: "1225111218",
      Angkatan: "2023",
      dailyReports: 7,
      company: "PT Inovasi Teknologi",
    },
    {
      id: 8,
      name: "Rahmat Hidayat",
      nim: "1225111219",
      Angkatan: "2024",
      dailyReports: 3,
      company: "CV Aplikasi Cerdas",
    },
  ];

  // Card data - keeping only the top 4 cards
  const cardData = [
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
      value: tableData.reduce((sum, item) => sum + item.dailyReports, 0),
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
      shadowColor: "shadow-emerald-500/20 dark:shadow-emerald-800/30",
      description: " Perusahaan yang Terdaftar ",
    },
    {
      title: "Progress 100%",
      value: tableData.filter(item => {
        // Assume max expected reports is 15
        const maxReports = 15;
        const percentage = Math.min(Math.round((item.dailyReports / maxReports) * 100), 100);
        return percentage === 100;
      }).length,
      icon: CheckCircle,
      color:
        "bg-gradient-to-br from-emerald-500 to-emerald-700 dark:from-emerald-600 dark:to-emerald-900",
      shadowColor: "shadow-emerald-500/20 dark:shadow-emerald-800/30",
      description: "Mahasiswa dengan Progress Penuh",
    },
  ];

  // Filter data based on active tab and search term
  const filteredData = tableData.filter(
    (item) =>
      (activeTab === "Semua Riwayat" || item.Angkatan === activeTab) &&
      (searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nim.includes(searchTerm) ||
        item.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page changes
  const handlePageChange = (page : number) => {
    setCurrentPage(page);
  };

  // Go to previous page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Go to next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to get progress color and percentage based on daily reports
  const getProgressData = (reports : number) => {
    // Assume max expected reports is 15
    const maxReports = 15;
    const percentage = Math.min(Math.round((reports / maxReports) * 100), 100);

    // Color gradient based on percentage
    let color;
    if (percentage < 25) {
      color = "bg-red-500";
    } else if (percentage < 50) {
      color = "bg-orange-500";
    } else if (percentage < 75) {
      color = "bg-yellow-500";
    } else {
      color = "bg-green-500";
    }

    return { percentage, color };
  };

  // Animation for cards section
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Container animations
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

  return (
    <DashboardLayout>
      <div className="p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center"
        >
          <h1 className="text-2xl font-bold">Dashboard Koordinator KP</h1>

          {/* Academic Year Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tahun Ajaran
            </span>
            <div className="relative">
              <select
                className="border rounded-lg px-3 py-1 pr-8 text-sm appearance-none bg-white dark:bg-gray-800 shadow-sm dark:border-gray-700"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
              >
                <option value="2024-2025 Ganjil">2024-2025 Genap</option>
                <option value="2023-2024 Ganjil">2023-2024 Ganjil</option>
                <option value="2023-2024 Genap">2023-2024 Genap</option>
                <option value="2022-2023 Ganjil">2022-2023 Ganjil</option>
                <option value="2022-2023 Genap">2022-2023 Genap</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400 rotate-90" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Modern Cards Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={statsVisible ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
                  className="absolute top-1/2 right-4 opacity-10 transform -translate-y-1/2"
                  initial={{ scale: 0.7, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 3,
                    delay: index * 0.5,
                  }}
                >
                  <card.icon size={80} strokeWidth={1} />
                </motion.div>
                <CardContent className="p-6">
                  <div className="flex items-start mt-1">
                    <div className="bg-white/20 rounded-lg p-2 mr-4">
                      <card.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium opacity-90">
                        {card.title}
                      </p>
                      <h3 className="text-3xl font-bold mt-1">{card.value}</h3>
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

        {/* Divider and section title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="border-b dark:border-gray-700 pb-2"
        >
          <h2 className="text-xl font-semibold mb-2">Daily Report Mahasiswa</h2>
        </motion.div>

        {/* Tabs and Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4"
        >
          <div className="flex gap-2 w-full md:w-auto">
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
                <TabsTrigger
                  value="2022"
                  className="text-sm font-medium data-[state=active]:bg-blue-500 dark:data-[state=active]:bg-blue-700 data-[state=active]:text-white rounded-md"
                >
                  2022
                </TabsTrigger>
                <TabsTrigger
                  value="2023"
                  className="text-sm font-medium data-[state=active]:bg-blue-500 dark:data-[state=active]:bg-blue-700 data-[state=active]:text-white rounded-md"
                >
                  2023
                </TabsTrigger>
                <TabsTrigger
                  value="2024"
                  className="text-sm font-medium data-[state=active]:bg-blue-500 dark:data-[state=active]:bg-blue-700 data-[state=active]:text-white rounded-md"
                >
                  2024
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="relative w-full ">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              placeholder="Cari nama, NIM, perusahaan..."
              className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="w-full bg-white dark:bg-gray-800 rounded-md border dark:border-gray-700 shadow-md overflow-hidden"
        >
          <Table>
            <TableHeader className="bg-gray-100 dark:bg-gray-900/40">
              <TableRow>
                <TableHead className="text-center uppercase font-semibold text-gray-700 dark:text-gray-300">
                  No
                </TableHead>
                <TableHead className="text-center uppercase font-semibold text-gray-700 dark:text-gray-300">
                  Nama Mahasiswa
                </TableHead>
                <TableHead className="text-center uppercase font-semibold text-gray-700 dark:text-gray-300">
                  NIM
                </TableHead>
                <TableHead className="text-center uppercase font-semibold text-gray-700 dark:text-gray-300">
                  Angkatan
                </TableHead>
                <TableHead className="text-center uppercase font-semibold text-gray-700 dark:text-gray-300">
                  Perusahaan
                </TableHead>
                <TableHead className="text-center uppercase font-semibold text-gray-700 dark:text-gray-300">
                  Progres
                </TableHead>
                <TableHead className="text-center uppercase font-semibold text-gray-700 dark:text-gray-300">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((item) => (
                <motion.tr
                  key={item.id}
                  className={
                    item.id % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-900/10 hover:bg-gray-100 dark:hover:bg-gray-900/20 transition-colors"
                      : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900/20 transition-colors"
                  }
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + item.id * 0.05 }}
                >
                  <TableCell className="text-center font-medium">
                    {item.id}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-center">{item.nim}</TableCell>
                  <TableCell className="text-center">{item.Angkatan}</TableCell>
                  <TableCell className="text-center">{item.company}</TableCell>
                  <TableCell className="text-center py-3 px-2">
                    {(() => {
                      const { percentage, color } = getProgressData(item.dailyReports);
                      return (
                        <div className="flex flex-col items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-1 overflow-hidden">
                            <motion.div 
                              className={`h-2.5 rounded-full ${color}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: 1.2 + item.id * 0.05 }}
                            />
                          </div>
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {percentage}%
                          </div>
                        </div>
                      );
                    })()}
                  </TableCell>
                  <TableCell className="text-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
                      onClick={() =>
                        navigate(
                          `/koordinator-kp/kerja-praktik/daily-report/detail-mahasiswa?name=${item.name}&nim=${item.nim}`
                        )
                      }
                    >
                      <SquareArrowOutUpRight className="h-4 w-4" />
                      Lihat Detail
                    </motion.button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="p-4 border-t dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Menampilkan {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredData.length)} dari{" "}
              {filteredData.length} hasil
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0 flex items-center justify-center border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Show first page, last page, current page, and pages around current page
                    return (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                    );
                  })
                  .map((page, index, array) => {
                    // Add ellipsis when there are gaps
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
                className="h-8 w-8 p-0 flex items-center justify-center border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
} 