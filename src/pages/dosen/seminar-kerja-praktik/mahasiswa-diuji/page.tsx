import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircleIcon,
  BookOpenIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  LayoutGrid,
  MapPinIcon,
  Table as TableIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import mahasiswa_icon from "@/assets/svgs/dosen/seminar-kerja-praktek/mahasiswa.svg";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

const WelcomeHeader = () => {
  return (
    <div className="bg-[#5A6D5A] rounded-lg p-10 flex justify-between items-center relative overflow-visible mt-10">
      <div className="text-white">
        <h1 className="text-2xl font-semibold mb-2">
          Riwayat Seminar KP Mahasiswa
        </h1>
        <p className="text-sm opacity-90">
          Kamu sudah menguji 9 mahasiswa yang Seminar KP. Segera beri mereka
          nilai seminarnnya, So Lets do it!
        </p>
      </div>
      <div className="absolute -top-[28%] size-48 right-4 ">
        <img
          src={mahasiswa_icon}
          alt="Student illustration"
          className="object-contain w-full h-full"
        />
      </div>
    </div>
  );
};

interface StudentData {
  name: string;
  type: string;
  ruangan: string;
  time: string;
  date: string;
  isGraded: boolean;
  seminarDate: Date;
}

interface StudentCardProps {
  name: string;
  type: string;
  ruangan: string;
  time: string;
  date: string;
  isGraded: boolean; // Added isGraded property
}
const StudentCard: React.FC<StudentCardProps> = ({
  name,
  type,
  ruangan,
  time,
  date,
  isGraded,
}) => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [dataModal, setDataModal] = useState<{
    name: string;
    ruangan: string;
    time: string;
    date: string;
    isGraded: boolean;
  } | null>(null);

  const handleCardClick = () => {
    setDataModal({
      name,
      ruangan,
      time,
      date,
      isGraded,
    });
    setOpenDialog(true);
  };

  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <div
        className="p-4 rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white mb-3 cursor-pointer  dark:hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
        onClick={handleCardClick}
      >
        <div className="flex items-start gap-3">
          {/* Avatar */}
          {/* <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 text-base font-bold">
              {getInitials(name)}
            </div>
          </div> */}

          {/* Content */}
          <div className="flex-1">
            <h3 className="font-semibold text-base mb-1 line-clamp-1">
              {name}
            </h3>
            <div className="text-gray-600 dark:text-gray-300 text-sm mb-2 flex flex-wrap gap-x-2">
              <span className="inline-flex items-center">
                <BookOpenIcon className="w-3.5 h-3.5 mr-1" />
                {type}
              </span>
              <span className="inline-flex items-center">
                <MapPinIcon className="w-3.5 h-3.5 mr-1" />
                {ruangan}
              </span>
              <span className="inline-flex items-center">
                <ClockIcon className="w-3.5 h-3.5 mr-1" />
                {time}
              </span>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                <CalendarIcon className="w-3.5 h-3.5 mr-1" />
                {date}
              </div>

              {isGraded ? (
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 font-medium">
                  Sudah Dinilai
                </span>
              ) : (
                <Button
                  size="sm"
                  className="h-8 px-3 border border-blue-600 text-xs bg-blue-600 font-medium text-white dark:text-white hover:bg-blue-700 dark:hover:bg-blue-500 rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dosen/seminar-kp/nilai-penguji/input-nilai`);
                  }}
                >
                  Input Nilai
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Student Detail Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
          <DialogHeader className="border-b p-4 bg-gray-50 dark:bg-gray-800">
            <DialogTitle className="text-xl font-semibold text-center">
              Detail Mahasiswa
            </DialogTitle>
          </DialogHeader>

          {dataModal && (
            <div className="p-4">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 text-2xl font-bold">
                  {getInitials(dataModal.name)}
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Nama Mahasiswa
                  </p>
                  <p className="font-medium text-base">{dataModal.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Ruangan
                    </p>
                    <div className="font-medium flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4 text-blue-500" />
                      {dataModal.ruangan}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Waktu
                    </p>
                    <div className="font-medium flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-blue-500" />
                      {dataModal.time}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Tanggal
                  </p>
                  <div className="font-medium flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-blue-500" />
                    {dataModal.date}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Status Penilaian
                  </p>
                  <div className="font-medium">
                    {dataModal.isGraded ? (
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Sudah Dinilai
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <AlertCircleIcon className="w-5 h-5 text-yellow-500" />
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          Belum Dinilai
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2 border-t p-4 bg-gray-50 dark:bg-gray-800">
            <Button
              onClick={() =>
                navigate(`/dosen/seminar-kerja-praktek/mahasiswa-diuji/detail`)
              }
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Lihat Detail
            </Button>

            {dataModal && !dataModal.isGraded && (
              <Button
                onClick={() =>
                  navigate(`/dosen/seminar-kp/nilai-penguji/input-nilai`)
                }
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Input Nilai
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const StudentTable: React.FC<{
  students: StudentData[];
  isLoading?: boolean;
}> = ({ students, isLoading = false }) => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [dataModal, setDataModal] = useState<{
    name: string;
    ruangan: string;
    time: string;
    date: string;
  } | null>(null);

  // Sorting states
  const [sortConfig, setSortConfig] = useState<{
    key: keyof StudentData | null;
    direction: "ascending" | "descending";
  }>({
    key: null,
    direction: "ascending",
  });

  // Handle sorting
  const requestSort = (key: keyof StudentData) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting to students data
  const sortedStudents = React.useMemo(() => {
    if (!sortConfig.key) return students;

    return [...students].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key!] > b[sortConfig.key!]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [students, sortConfig]);

  // Generate sort indicator
  const getSortIndicator = (key: keyof StudentData) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? " ↑" : " ↓";
  };

  return (
    <div className="w-full">
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800">
              <TableHead className="text-center font-medium text-sm py-3 text-gray-600 dark:text-gray-300 w-12">
                No
              </TableHead>
              <TableHead
                className="font-medium text-sm py-3 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => requestSort("name")}
              >
                Nama {getSortIndicator("name")}
              </TableHead>
              <TableHead
                className="text-center font-medium text-sm py-3 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => requestSort("ruangan")}
              >
                Ruangan {getSortIndicator("ruangan")}
              </TableHead>
              <TableHead
                className="text-center font-medium text-sm py-3 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => requestSort("time")}
              >
                Jam {getSortIndicator("time")}
              </TableHead>
              <TableHead
                className="text-center font-medium text-sm py-3 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => requestSort("date")}
              >
                Tanggal {getSortIndicator("date")}
              </TableHead>
              <TableHead className="text-center font-medium text-sm py-3 text-gray-600 dark:text-gray-300 w-24">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStudents.length === 0 && !isLoading && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <p className="text-base font-medium">
                      Tidak ada data mahasiswa
                    </p>
                    <p className="text-sm">
                      Belum ada mahasiswa yang terdaftar untuk seminar
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              sortedStudents.map((student, index) => (
                <TableRow
                  key={index}
                  className={
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-950 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      : "bg-gray-50 dark:bg-gray-900/50 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  }
                  onClick={() => {
                    setOpenDialog(true);
                    setDataModal({
                      name: student.name,
                      ruangan: student.ruangan,
                      time: student.time,
                      date: student.date,
                    });
                  }}
                >
                  <TableCell className="text-center font-medium text-gray-600 dark:text-gray-400">
                    {index + 1}.
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="font-medium">{student.name}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    {student.ruangan}
                  </TableCell>
                  <TableCell className="text-center">{student.time}</TableCell>
                  <TableCell className="text-center">{student.date}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 border text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dosen/seminar-kp/mahasiswa-diuji/detail`);
                        }}
                      >
                        Detail
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Enhanced Dialog for showing student details */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-semibold text-center">
              Detail Mahasiswa
            </DialogTitle>
          </DialogHeader>
          {dataModal && (
            <div className="py-3">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 text-2xl font-bold">
                  {dataModal.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Nama Mahasiswa
                  </p>
                  <p className="font-medium">{dataModal.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Ruangan
                    </p>
                    <p className="font-medium">{dataModal.ruangan}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Waktu
                    </p>
                    <p className="font-medium">{dataModal.time}</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Tanggal
                  </p>
                  <div className="font-medium flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-blue-500" />
                    {dataModal.date}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2 border-t pt-4">
            <Button
              onClick={() =>
                navigate(`/dosen/seminar-kerja-praktek/mahasiswa-diuji/detail`)
              }
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Lihat Detail Lengkap
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpenDialog(false)}
              className="border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper function to parse Indonesian date format
const parseIndonesianDate = (dateString: string): Date => {
  const months: Record<string, number> = {
    Januari: 0,
    Februari: 1,
    Maret: 2,
    April: 3,
    Mei: 4,
    Juni: 5,
    Juli: 6,
    Agustus: 7,
    September: 8,
    Oktober: 9,
    November: 10,
    Desember: 11,
  };

  const [day, month, year] = dateString.split(" ");
  return new Date(parseInt(year), months[month], parseInt(day));
};

export default function DosenPengujiMahasiswaPage() {
  const [isGridView, setIsGridView] = useState(true);
  const [activeTab, setActiveTab] = useState("semua");
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sample data with seminarDate property
  const students: StudentData[] = [
    {
      name: "Farhan Fadhila",
      type: "Seminar KP",
      ruangan: "FST.301",
      time: "08.00 WIB",
      date: "23 April 2025",
      isGraded: true,
      seminarDate: parseIndonesianDate("23 April 2025"),
    },
    {
      name: "Abmi Sukma Edri",
      type: "Seminar KP",
      ruangan: "FST.301",
      time: "09.00 WIB",
      date: "23 April 2025",
      isGraded: false,
      seminarDate: parseIndonesianDate("23 April 2025"),
    },
    {
      name: "Muhammad Farhan Aulia Pratama",
      type: "Seminar KP",
      ruangan: "FST.302",
      time: "10.00 WIB",
      date: "23 April 2025",
      isGraded: true,
      seminarDate: parseIndonesianDate("23 April 2025"),
    },
    {
      name: "M Nabil Dawami",
      type: "Seminar KP",
      ruangan: "FST.302",
      time: "11.00 WIB",
      date: "23 April 2025",
      isGraded: false,
      seminarDate: parseIndonesianDate("23 April 2025"),
    },
    {
      name: "Hafidz Alhadid Rahman",
      type: "Seminar KP",
      ruangan: "FST.303",
      time: "13.00 WIB",
      date: "23 April 2025",
      isGraded: true,
      seminarDate: parseIndonesianDate("23 April 2025"),
    },
    {
      name: "Muhammad Rafly Wirayudha",
      type: "Seminar KP",
      ruangan: "FST.303",
      time: "14.00 WIB",
      date: "23 April 2025",
      isGraded: false,
      seminarDate: parseIndonesianDate("23 April 2025"),
    },
    {
      name: "Gilang Ramadhan Indra",
      type: "Seminar KP",
      ruangan: "FST.303",
      time: "15.00 WIB",
      date: "23 April 2025",
      isGraded: true,
      seminarDate: parseIndonesianDate("23 April 2025"),
    },
    {
      name: "Ahmad Kurniawan",
      type: "Seminar KP",
      ruangan: "FST.301",
      time: "16.00 WIB",
      date: "23 April 2025",
      isGraded: false,
      seminarDate: parseIndonesianDate("23 April 2025"),
    },
    {
      name: "Muh Zaki Erbai Syas",
      type: "Seminar KP",
      ruangan: "FST.301",
      time: "17.00 WIB",
      date: "23 April 2025",
      isGraded: true,
      seminarDate: parseIndonesianDate("23 April 2025"),
    },
    {
      name: "Dewi Kartika",
      type: "Seminar KP",
      ruangan: "FST.302",
      time: "09.00 WIB",
      date: "24 April 2025",
      isGraded: false,
      seminarDate: parseIndonesianDate("24 April 2025"),
    },
    {
      name: "Arif Nugraha",
      type: "Seminar KP",
      ruangan: "FST.302",
      time: "10.00 WIB",
      date: "24 April 2025",
      isGraded: false,
      seminarDate: parseIndonesianDate("24 April 2025"),
    },
    {
      name: "Salsa Bintang",
      type: "Seminar KP",
      ruangan: "FST.304",
      time: "11.00 WIB",
      date: "25 April 2025",
      isGraded: false,
      seminarDate: parseIndonesianDate("25 April 2025"),
    },
    {
      name: "Bayu Prasetya",
      type: "Seminar KP",
      ruangan: "FST.304",
      time: "13.00 WIB",
      date: "25 April 2025",
      isGraded: false,
      seminarDate: parseIndonesianDate("25 April 2025"),
    },
    {
      name: "Nina Permata",
      type: "Seminar KP",
      ruangan: "FST.303",
      time: "15.00 WIB",
      date: "26 April 2025",
      isGraded: false,
      seminarDate: parseIndonesianDate("26 April 2025"),
    },
    {
      name: "Reza Dwi",
      type: "Seminar KP",
      ruangan: "FST.301",
      time: "08.00 WIB",
      date: "27 April 2025",
      isGraded: false,
      seminarDate: parseIndonesianDate("27 April 2025"),
    },
  ];

  // Function to filter students based on the selected tab
  const filterStudentsByDate = (selectedTab: string) => {
    setIsLoading(true);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filtered: StudentData[];

    switch (selectedTab) {
      case "hari-ini":
        filtered = students.filter((student) => {
          const seminarDate = new Date(student.seminarDate);
          seminarDate.setHours(0, 0, 0, 0);
          return seminarDate.getTime() === today.getTime();
        });
        break;
      case "mendatang":
        filtered = students.filter((student) => {
          const seminarDate = new Date(student.seminarDate);
          seminarDate.setHours(0, 0, 0, 0);
          return seminarDate > today;
        });
        break;
      default: // "semua"
        filtered = [...students];
        break;
    }

    // Simulate loading
    setTimeout(() => {
      setFilteredStudents(filtered);
      setIsLoading(false);
    }, 500);
  };

  // Effect to filter students when tab changes
  useEffect(() => {
    filterStudentsByDate(activeTab);
  }, [activeTab]);

  const ViewToggleButtons = () => (
    <div className="flex gap-2">
      <Button
        variant={isGridView ? "default" : "outline"}
        size="sm"
        onClick={() => setIsGridView(true)}
        className={`flex items-center gap-1 text-sm ${
          isGridView
            ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            : "border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        <LayoutGrid size={16} />
        Grid
      </Button>
      <Button
        variant={!isGridView ? "default" : "outline"}
        size="sm"
        onClick={() => setIsGridView(false)}
        className={`flex items-center gap-1 text-sm ${
          !isGridView
            ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            : "border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        <TableIcon size={16} />
        Table
      </Button>
    </div>
  );

  return (
    <DashboardLayout>
      <WelcomeHeader />
      <div>
        <Tabs
          defaultValue="semua"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <div className="flex justify-between items-center w-full">
            <TabsList className="grid w-fit grid-cols-3 gap-2">
              <TabsTrigger
                value="semua"
                className="transition-all duration-300 ease-in-out data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:bg-blue-50 text-sm"
              >
                Semua
              </TabsTrigger>
              <TabsTrigger
                value="hari-ini"
                className="transition-all duration-300 ease-in-out data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:bg-blue-50 text-sm"
              >
                Hari Ini
              </TabsTrigger>
              <TabsTrigger
                value="mendatang"
                className="transition-all duration-300 ease-in-out data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:bg-blue-50 text-sm"
              >
                Mendatang
              </TabsTrigger>
            </TabsList>

            <ViewToggleButtons />
          </div>

          <div className="mt-4 shadow-none border-none">
            <TabsContent value="semua" className="mt-0">
              <div className="pt-2">
                {isGridView ? (
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {isLoading ? (
                      <div></div>
                    ) : filteredStudents.length === 0 ? (
                      <div className="col-span-3 text-center py-8">
                        ❌ Tidak ada data mahasiswa
                      </div>
                    ) : (
                      filteredStudents.map((student, index) => (
                        <StudentCard
                          key={index}
                          name={student.name}
                          type={student.type}
                          ruangan={student.ruangan}
                          time={student.time}
                          date={student.date}
                          isGraded={student.isGraded} // Pass isGraded property
                        />
                      ))
                    )}
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <StudentTable
                      students={filteredStudents}
                      isLoading={isLoading}
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="hari-ini" className="mt-0">
              <div className="pt-2">
                {isGridView ? (
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {isLoading ? (
                      <div></div>
                    ) : filteredStudents.length === 0 ? (
                      <div className="col-span-3 text-center py-8">
                        ❌ Tidak ada seminar pada hari ini
                      </div>
                    ) : (
                      filteredStudents.map((student, index) => (
                        <StudentCard
                          key={index}
                          name={student.name}
                          type={student.type}
                          ruangan={student.ruangan}
                          time={student.time}
                          date={student.date}
                          isGraded={student.isGraded} // Pass isGraded property
                        />
                      ))
                    )}
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <StudentTable
                      students={filteredStudents}
                      isLoading={isLoading}
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="mendatang" className="mt-0">
              <div className="pt-2">
                {isGridView ? (
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {isLoading ? (
                      <div></div>
                    ) : filteredStudents.length === 0 ? (
                      <div className="col-span-3 text-center py-8">
                        ❌ Tidak ada seminar mendatang
                      </div>
                    ) : (
                      filteredStudents.map((student, index) => (
                        <StudentCard
                          key={index}
                          name={student.name}
                          type={student.type}
                          ruangan={student.ruangan}
                          time={student.time}
                          date={student.date}
                          isGraded={student.isGraded} // Pass isGraded property
                        />
                      ))
                    )}
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <StudentTable
                      students={filteredStudents}
                      isLoading={isLoading}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <div className="flex justify-end pt-0">
        <h3 className="text-sm">---pagination---</h3>
      </div>
    </DashboardLayout>
  );
}
