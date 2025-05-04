import { useState, type FC } from "react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import {
  Search,
  Eye,
  Edit,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  BookOpen,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import DetailSeminarModal from "@/components/dosen/seminar/detail-seminar-modal";
import InputNilaiModal from "@/pages/dosen/seminar-kerja-praktek/nilai-penguji/NilaiSeminarPenguji";

// Type definitions
type Role = "dibimbing" | "diuji";
type Status = "belum dinilai" | "selesai";

interface Student {
  id: number;
  name: string;
  room: string;
  time: string;
  date: string;
  role: Role;
  status: Status;
  tanggalDinilai?: string;
}

// Badge variants and colors for roles
const roleBadgeConfig: Record<
  Role,
  {
    label: string;
    bgColor: string;
    textColor: string;
    darkBgColor: string;
    darkTextColor: string;
  }
> = {
  dibimbing: {
    label: "Dibimbing",
    bgColor: "bg-blue-100/70",
    textColor: "text-blue-700",
    darkBgColor: "dark:bg-blue-900/30",
    darkTextColor: "dark:text-blue-300",
  },
  diuji: {
    label: "Diuji",
    bgColor: "bg-purple-100/70",
    textColor: "text-purple-700",
    darkBgColor: "dark:bg-purple-900/30",
    darkTextColor: "dark:text-purple-300",
  },
};

// Circular Progress Chart Component
const CircularProgressChart = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  textSize = "text-2xl",
}) => {
  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Background circle */}
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-emerald-500 dark:text-emerald-400 transition-all duration-500 ease-out"
        />
      </svg>
      {/* Percentage text in the middle */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`font-bold ${textSize} text-emerald-700 dark:text-emerald-300`}
        >
          {percentage}%
        </span>
        <span className="text-xs text-gray-600 dark:text-gray-400">
          Selesai
        </span>
      </div>
    </div>
  );
};

const DosenPengujiNilaiPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"semua" | "dibimbing" | "diuji">(
    "semua"
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isInputNilaiModalOpen, setIsInputNilaiModalOpen] =
    useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Mock data
  const students: Student[] = [
    {
      id: 1,
      name: "M Farhan Aulia Pratama",
      room: "FST301",
      time: "09:00",
      date: "2025-05-10",
      role: "dibimbing",
      status: "selesai",
      tanggalDinilai: "2025-05-12",
    },
    {
      id: 2,
      name: "Gilang Ramadhan",
      room: "FST301",
      time: "10:30",
      date: "2025-05-11",
      role: "diuji",
      status: "selesai",
      tanggalDinilai: "2025-05-12",
    },
    {
      id: 3,
      name: "Farhan Fadilla",
      room: "FST302",
      time: "13:00",
      date: "2025-05-12",
      role: "dibimbing",
      status: "belum dinilai",
      tanggalDinilai: "",
    },
    {
      id: 4,
      name: "Ahmad Kurniawan",
      room: "FST303",
      time: "14:00",
      date: "2025-05-13",
      role: "diuji",
      status: "belum dinilai",
      tanggalDinilai: "",
    },
  ];

  // Filter students based on active tab and search query
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "semua" ||
      (activeTab === "dibimbing" && student.role === "dibimbing") ||
      (activeTab === "diuji" && student.role === "diuji");
    return matchesSearch && matchesTab;
  });

  // Calculate statistics for dashboard cards
  const totalStudents = students.length;
  const dibimbingCount = students.filter((s) => s.role === "dibimbing").length;
  const diujiCount = students.filter((s) => s.role === "diuji").length;
  const belumDinilaiCount = students.filter(
    (s) => s.status === "belum dinilai"
  ).length;
  const selesaiCount = students.filter((s) => s.status === "selesai").length;
  const totalPercentage = Math.round((selesaiCount / totalStudents) * 100);

  // Get nearest seminar date
  const today = new Date();
  const upcomingSeminars = students
    .filter((s) => new Date(s.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const nearestSeminar =
    upcomingSeminars.length > 0 ? upcomingSeminars[0] : null;

  // Handle opening modals
  const handleOpenDetailModal = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  const handleOpenInputNilaiModal = (student: Student) => {
    setSelectedStudent(student);
    setIsInputNilaiModalOpen(true);
  };

  // Function to format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="transition-colors duration-300">
        {/* Header */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-4 dark:text-white">
              Seminar Kerja Praktik Mahasiswa
            </h1>
            <div>
              <span className="mr-2 text-gray-600 dark:text-gray-300">
                Tahun Ajaran
              </span>
              <Badge
                variant="outline"
                className="bg-gray-100 dark:bg-gray-900 dark:text-gray-300"
              >
                2024-2025 Ganjil
              </Badge>
            </div>
          </div>

          {/* Dashboard Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Total Mahasiswa Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-900/30 shadow-sm transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Users className="h-5 w-5" />
                  Total Mahasiswa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-800 dark:text-blue-200">
                  {totalStudents}
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  {dibimbingCount} Dibimbing | {diujiCount} Diuji
                </p>
              </CardContent>
            </Card>

            {/* Status Penilaian Card */}
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 dark:border-emerald-900/30 shadow-sm transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle className="h-5 w-5" />
                  Status Penilaian
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-800 dark:text-emerald-200">
                  {selesaiCount}
                </div>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                  Selesai dari {totalStudents} mahasiswa
                </p>
              </CardContent>
            </Card>

            {/* Belum Dinilai Card */}
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 dark:border-amber-900/30 shadow-sm transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-300">
                  <AlertCircle className="h-5 w-5" />
                  Perlu Penilaian
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-800 dark:text-amber-200">
                  {belumDinilaiCount}
                </div>
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                  Mahasiswa belum dinilai
                </p>
              </CardContent>
            </Card>
          </div>

          {/*Progress Card*/}
          <Card className="bg-white dark:bg-gray-800 mb-6 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Progres Penilaian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Left side: Circular progress chart */}
                <div className="flex flex-col items-center">
                  <CircularProgressChart percentage={totalPercentage} />
                  <div className="text-center mt-3">
                    <div className="font-medium text-gray-700 dark:text-gray-300">
                      Total Selesai Dinilai
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {selesaiCount}/{totalStudents} mahasiswa
                    </div>
                  </div>
                </div>

                {/* Right side: Progress bars - with more compact layout */}
                <div className="flex-1 space-y-6 w-full max-w-full">
                  {/* Dibimbing progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Dibimbing
                      </span>
                      <span className="font-medium">
                        {
                          students.filter(
                            (s) =>
                              s.role === "dibimbing" && s.status === "selesai"
                          ).length
                        }
                        /{dibimbingCount}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{
                          width:
                            dibimbingCount > 0
                              ? `${
                                  (students.filter(
                                    (s) =>
                                      s.role === "dibimbing" &&
                                      s.status === "selesai"
                                  ).length /
                                    dibimbingCount) *
                                  100
                                }%`
                              : "0%",
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Diuji progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Diuji
                      </span>
                      <span className="font-medium">
                        {
                          students.filter(
                            (s) => s.role === "diuji" && s.status === "selesai"
                          ).length
                        }
                        /{diujiCount}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{
                          width:
                            diujiCount > 0
                              ? `${
                                  (students.filter(
                                    (s) =>
                                      s.role === "diuji" &&
                                      s.status === "selesai"
                                  ).length /
                                    diujiCount) *
                                  100
                                }%`
                              : "0%",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Seminar Card */}
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-900/30 shadow-sm transition-all duration-200 hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2 text-purple-700 dark:text-purple-300">
                      <Calendar className="h-5 w-5" />
                      Seminar Terdekat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {nearestSeminar ? (
                      <>
                        <div className="text-lg font-bold text-purple-800 dark:text-purple-200 truncate">
                          {nearestSeminar.name}
                        </div>
                        <p className="text-sm text-purple-600 dark:text-purple-400 mt-1 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDate(nearestSeminar.date)},{" "}
                          {nearestSeminar.time}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                        Tidak ada jadwal seminar terdekat
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Tabs and Search Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Tabs
              defaultValue="semua"
              onValueChange={(value) =>
                setActiveTab(value as "semua" | "dibimbing" | "diuji")
              }
              className="w-full"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
                <TabsList className="dark:bg-gray-700">
                  <TabsTrigger
                    value="semua"
                    className="dark:data-[state=active]:bg-gray-800"
                  >
                    Semua
                  </TabsTrigger>
                  <TabsTrigger
                    value="dibimbing"
                    className="dark:data-[state=active]:bg-gray-800"
                  >
                    Dibimbing
                  </TabsTrigger>
                  <TabsTrigger
                    value="diuji"
                    className="dark:data-[state=active]:bg-gray-800"
                  >
                    Diuji
                  </TabsTrigger>
                </TabsList>

                {/* Search Bar */}
                <div className="flex items-center w-full relative">
                  <Search className="h-4 w-4 absolute left-3 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari nama mahasiswa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400"
                  />
                </div>
              </div>

              <TabsContent value="semua" className="mt-4">
                <StudentTable
                  students={filteredStudents}
                  onViewDetail={handleOpenDetailModal}
                  onInputNilai={handleOpenInputNilaiModal}
                />
              </TabsContent>
              <TabsContent value="dibimbing" className="mt-4">
                <StudentTable
                  students={filteredStudents}
                  onViewDetail={handleOpenDetailModal}
                  onInputNilai={handleOpenInputNilaiModal}
                />
              </TabsContent>
              <TabsContent value="diuji" className="mt-4">
                <StudentTable
                  students={filteredStudents}
                  onViewDetail={handleOpenDetailModal}
                  onInputNilai={handleOpenInputNilaiModal}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {selectedStudent && (
        <>
          {/* <DetailSeminarModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            student={selectedStudent}
          /> */}
          <InputNilaiModal
            isOpen={isInputNilaiModalOpen}
            onClose={() => setIsInputNilaiModalOpen(false)}
            student={selectedStudent}
          />
        </>
      )}
    </DashboardLayout>
  );
};

// Separate component for the students table
const StudentTable: FC<{
  students: Student[];
  onViewDetail: (student: Student) => void;
  onInputNilai: (student: Student) => void;
}> = ({ students, onViewDetail, onInputNilai }) => {
  return (
    <Card className="shadow-none rounded-none dark:bg-gray-900 dark:border-gray-700">
      <Table>
        <TableHeader className="bg-gray-200 dark:bg-gray-700">
          <TableRow className="hover:bg-gray-300 dark:hover:bg-gray-600">
            <TableHead className="w-12 text-center font-semibold dark:text-gray-200">
              No
            </TableHead>
            <TableHead className="font-semibold dark:text-gray-200">
              Nama Mahasiswa
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Ruangan
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Jam
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Tanggal
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Peran
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Status
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Tanggal Dinilai
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 ? (
            <TableRow className="dark:border-gray-700 dark:hover:bg-gray-700">
              <TableCell
                colSpan={9}
                className="text-center py-6 text-muted-foreground dark:text-gray-400"
              >
                Tidak ada data yang ditemukan
              </TableCell>
            </TableRow>
          ) : (
            students.map((student, index) => (
              <TableRow
                key={student.id}
                className="dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <TableCell className="font-medium text-center dark:text-gray-300">
                  {index + 1}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {student.name}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300">
                  {student.room}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300">
                  {student.time}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300">
                  {student.date}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    className={`${roleBadgeConfig[student.role].bgColor} ${
                      roleBadgeConfig[student.role].textColor
                    } ${roleBadgeConfig[student.role].darkBgColor} ${
                      roleBadgeConfig[student.role].darkTextColor
                    }`}
                  >
                    {roleBadgeConfig[student.role].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      student.status === "belum dinilai"
                        ? "secondary"
                        : "outline"
                    }
                    className={
                      student.status === "belum dinilai"
                        ? "dark:bg-gray-700 dark:text-gray-200"
                        : "dark:border-gray-600 dark:text-gray-300"
                    }
                  >
                    {student.status === "belum dinilai"
                      ? "Belum Dinilai"
                      : "Selesai"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center dark:text-gray-300">
                  {student.tanggalDinilai || "-"}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white dark:from-emerald-600 dark:to-teal-600 dark:hover:from-emerald-700 dark:hover:to-teal-700 border-0 transition-all flex items-center gap-1.5 py-1 rounded-md text-xs"
                      onClick={() => onViewDetail(student)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Detail</span>
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white dark:from-blue-600 dark:to-indigo-600 dark:hover:from-blue-700 dark:hover:to-indigo-700 border-0 transition-all flex items-center gap-1.5 py-1 rounded-md text-xs"
                      onClick={() => onInputNilai(student)}
                      disabled={student.status === "selesai"}
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Nilai</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default DosenPengujiNilaiPage;

// import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   AlertCircleIcon,
//   BookOpenIcon,
//   CalendarIcon,
//   CheckCircleIcon,
//   ClockIcon,
//   LayoutGrid,
//   MapPinIcon,
//   Table as TableIcon,
// } from "lucide-react";
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router-dom";
// import mahasiswa_icon from "@/assets/svgs/dosen/seminar-kerja-praktek/mahasiswa.svg";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import React from "react";

// const WelcomeHeader = () => {
//   return (
//     <div className="bg-[#5A6D5A] rounded-lg p-10 flex justify-between items-center relative overflow-visible mt-10">
//       <div className="text-white">
//         <h1 className="text-2xl font-semibold mb-2">
//           Riwayat Seminar KP Mahasiswa
//         </h1>
//         <p className="text-sm opacity-90">
//           Kamu sudah menguji 9 mahasiswa yang Seminar KP. Segera beri mereka
//           nilai seminarnnya, So Lets do it!
//         </p>
//       </div>
//       <div className="absolute -top-[28%] size-48 right-4 ">
//         <img
//           src={mahasiswa_icon}
//           alt="Student illustration"
//           className="object-contain w-full h-full"
//         />
//       </div>
//     </div>
//   );
// };

// interface StudentData {
//   name: string;
//   type: string;
//   ruangan: string;
//   time: string;
//   date: string;
//   isGraded: boolean;
//   seminarDate: Date;
// }

// interface StudentCardProps {
//   name: string;
//   type: string;
//   ruangan: string;
//   time: string;
//   date: string;
//   isGraded: boolean; // Added isGraded property
// }

// const StudentCard: React.FC<StudentCardProps> = ({
//   name,
//   type,
//   ruangan,
//   time,
//   date,
//   isGraded,
// }) => {
//   const navigate = useNavigate();
//   const [openDialog, setOpenDialog] = useState(false);
//   const [dataModal, setDataModal] = useState<{
//     name: string;
//     ruangan: string;
//     time: string;
//     date: string;
//     isGraded: boolean;
//   } | null>(null);

//   const handleCardClick = () => {
//     setDataModal({
//       name,
//       ruangan,
//       time,
//       date,
//       isGraded,
//     });
//     setOpenDialog(true);
//   };

//   // Generate initials for avatar
//   const getInitials = (name: string) => {
//     return name
//       .split(" ")
//       .map((word) => word[0])
//       .join("")
//       .toUpperCase()
//       .substring(0, 2);
//   };

//   return (
//     <>
//       <div
//         className="p-4 rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white mb-3 cursor-pointer  dark:hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
//         onClick={handleCardClick}
//       >
//         <div className="flex items-start gap-3">
//           {/* Avatar */}
//           {/* <div className="flex-shrink-0">
//             <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 text-base font-bold">
//               {getInitials(name)}
//             </div>
//           </div> */}

//           {/* Content */}
//           <div className="flex-1">
//             <h3 className="font-semibold text-base mb-1 line-clamp-1">
//               {name}
//             </h3>
//             <div className="text-gray-600 dark:text-gray-300 text-sm mb-2 flex flex-wrap gap-x-2">
//               <span className="inline-flex items-center">
//                 <BookOpenIcon className="w-3.5 h-3.5 mr-1" />
//                 {type}
//               </span>
//               <span className="inline-flex items-center">
//                 <MapPinIcon className="w-3.5 h-3.5 mr-1" />
//                 {ruangan}
//               </span>
//               <span className="inline-flex items-center">
//                 <ClockIcon className="w-3.5 h-3.5 mr-1" />
//                 {time}
//               </span>
//             </div>

//             <div className="flex items-center justify-between mt-2">
//               <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
//                 <CalendarIcon className="w-3.5 h-3.5 mr-1" />
//                 {date}
//               </div>

//               {isGraded ? (
//                 <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 font-medium">
//                   Sudah Dinilai
//                 </span>
//               ) : (
//                 <Button
//                   size="sm"
//                   className="h-8 px-3 border border-blue-600 text-xs bg-blue-600 font-medium text-white dark:text-white hover:bg-blue-700 dark:hover:bg-blue-500 rounded-lg"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     navigate(`/dosen/seminar-kp/nilai-penguji/input-nilai`);
//                   }}
//                 >
//                   Input Nilai
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Student Detail Dialog */}
//       <Dialog open={openDialog} onOpenChange={setOpenDialog}>
//         <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
//           <DialogHeader className="border-b p-4 bg-gray-50 dark:bg-gray-800">
//             <DialogTitle className="text-xl font-semibold text-center">
//               Detail Mahasiswa
//             </DialogTitle>
//           </DialogHeader>

//           {dataModal && (
//             <div className="p-4">
//               <div className="flex justify-center mb-6">
//                 <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 text-2xl font-bold">
//                   {getInitials(dataModal.name)}
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
//                   <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
//                     Nama Mahasiswa
//                   </p>
//                   <p className="font-medium text-base">{dataModal.name}</p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
//                     <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
//                       Ruangan
//                     </p>
//                     <div className="font-medium flex items-center gap-2">
//                       <MapPinIcon className="w-4 h-4 text-blue-500" />
//                       {dataModal.ruangan}
//                     </div>
//                   </div>

//                   <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
//                     <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
//                       Waktu
//                     </p>
//                     <div className="font-medium flex items-center gap-2">
//                       <ClockIcon className="w-4 h-4 text-blue-500" />
//                       {dataModal.time}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
//                   <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
//                     Tanggal
//                   </p>
//                   <div className="font-medium flex items-center gap-2">
//                     <CalendarIcon className="w-4 h-4 text-blue-500" />
//                     {dataModal.date}
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
//                   <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
//                     Status Penilaian
//                   </p>
//                   <div className="font-medium">
//                     {dataModal.isGraded ? (
//                       <div className="flex items-center gap-2">
//                         <CheckCircleIcon className="w-5 h-5 text-green-500" />
//                         <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
//                           Sudah Dinilai
//                         </span>
//                       </div>
//                     ) : (
//                       <div className="flex items-center gap-2">
//                         <AlertCircleIcon className="w-5 h-5 text-yellow-500" />
//                         <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
//                           Belum Dinilai
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           <DialogFooter className="flex gap-2 border-t p-4 bg-gray-50 dark:bg-gray-800">
//             <Button
//               onClick={() =>
//                 navigate(`/dosen/seminar-kerja-praktek/mahasiswa-diuji/detail`)
//               }
//               className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
//             >
//               Lihat Detail
//             </Button>

//             {dataModal && !dataModal.isGraded && (
//               <Button
//                 onClick={() =>
//                   navigate(`/dosen/seminar-kp/nilai-penguji/input-nilai`)
//                 }
//                 className="flex-1 bg-green-600 hover:bg-green-700 text-white"
//               >
//                 Input Nilai
//               </Button>
//             )}
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// const StudentTable: React.FC<{
//   students: StudentData[];
//   isLoading?: boolean;
// }> = ({ students, isLoading = false }) => {
//   const navigate = useNavigate();
//   const [openDialog, setOpenDialog] = useState(false);
//   const [dataModal, setDataModal] = useState<{
//     name: string;
//     ruangan: string;
//     time: string;
//     date: string;
//   } | null>(null);

//   // Sorting states
//   const [sortConfig, setSortConfig] = useState<{
//     key: keyof StudentData | null;
//     direction: "ascending" | "descending";
//   }>({
//     key: null,
//     direction: "ascending",
//   });

//   // Handle sorting
//   const requestSort = (key: keyof StudentData) => {
//     let direction: "ascending" | "descending" = "ascending";
//     if (sortConfig.key === key && sortConfig.direction === "ascending") {
//       direction = "descending";
//     }
//     setSortConfig({ key, direction });
//   };

//   // Apply sorting to students data
//   const sortedStudents = React.useMemo(() => {
//     if (!sortConfig.key) return students;

//     return [...students].sort((a, b) => {
//       if (a[sortConfig.key!] < b[sortConfig.key!]) {
//         return sortConfig.direction === "ascending" ? -1 : 1;
//       }
//       if (a[sortConfig.key!] > b[sortConfig.key!]) {
//         return sortConfig.direction === "ascending" ? 1 : -1;
//       }
//       return 0;
//     });
//   }, [students, sortConfig]);

//   // Generate sort indicator
//   const getSortIndicator = (key: keyof StudentData) => {
//     if (sortConfig.key !== key) return null;
//     return sortConfig.direction === "ascending" ? " ↑" : " ↓";
//   };

//   return (
//     <div className="w-full">
//       <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
//         <Table className="w-full">
//           <TableHeader>
//             <TableRow className="bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800">
//               <TableHead className="text-center font-medium text-sm py-3 text-gray-600 dark:text-gray-300 w-12">
//                 No
//               </TableHead>
//               <TableHead
//                 className="font-medium text-sm py-3 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
//                 onClick={() => requestSort("name")}
//               >
//                 Nama {getSortIndicator("name")}
//               </TableHead>
//               <TableHead
//                 className="text-center font-medium text-sm py-3 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
//                 onClick={() => requestSort("ruangan")}
//               >
//                 Ruangan {getSortIndicator("ruangan")}
//               </TableHead>
//               <TableHead
//                 className="text-center font-medium text-sm py-3 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
//                 onClick={() => requestSort("time")}
//               >
//                 Jam {getSortIndicator("time")}
//               </TableHead>
//               <TableHead
//                 className="text-center font-medium text-sm py-3 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
//                 onClick={() => requestSort("date")}
//               >
//                 Tanggal {getSortIndicator("date")}
//               </TableHead>
//               <TableHead className="text-center font-medium text-sm py-3 text-gray-600 dark:text-gray-300 w-24">
//                 Aksi
//               </TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {sortedStudents.length === 0 && !isLoading && (
//               <TableRow>
//                 <TableCell
//                   colSpan={6}
//                   className="text-center py-8 text-gray-500 dark:text-gray-400"
//                 >
//                   <div className="flex flex-col items-center justify-center space-y-2">
//                     <svg
//                       className="w-12 h-12 text-gray-400"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                       ></path>
//                     </svg>
//                     <p className="text-base font-medium">
//                       Tidak ada data mahasiswa
//                     </p>
//                     <p className="text-sm">
//                       Belum ada mahasiswa yang terdaftar untuk seminar
//                     </p>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             )}
//             {!isLoading &&
//               sortedStudents.map((student, index) => (
//                 <TableRow
//                   key={index}
//                   className={
//                     index % 2 === 0
//                       ? "bg-white dark:bg-gray-950 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
//                       : "bg-gray-50 dark:bg-gray-900/50 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
//                   }
//                   onClick={() => {
//                     setOpenDialog(true);
//                     setDataModal({
//                       name: student.name,
//                       ruangan: student.ruangan,
//                       time: student.time,
//                       date: student.date,
//                     });
//                   }}
//                 >
//                   <TableCell className="text-center font-medium text-gray-600 dark:text-gray-400">
//                     {index + 1}.
//                   </TableCell>
//                   <TableCell className="py-3">
//                     <div className="font-medium">{student.name}</div>
//                   </TableCell>
//                   <TableCell className="text-center">
//                     {student.ruangan}
//                   </TableCell>
//                   <TableCell className="text-center">{student.time}</TableCell>
//                   <TableCell className="text-center">{student.date}</TableCell>
//                   <TableCell className="text-center">
//                     <Button
//                       size="sm"
//                       className="h-8 px-3 border text-xs bg-blue-600 font-medium text-white dark:text-white hover:bg-blue-700 dark:hover:bg-blue-400 rounded-lg"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         navigate(`/dosen/seminar-kp/nilai-penguji/input-nilai`);
//                       }}
//                     >
//                       Input Nilai
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Enhanced Dialog for showing student details */}
//       <Dialog open={openDialog} onOpenChange={setOpenDialog}>
//         <DialogContent className="max-w-md rounded-xl">
//           <DialogHeader className="border-b pb-4">
//             <DialogTitle className="text-xl font-semibold text-center">
//               Detail Mahasiswa
//             </DialogTitle>
//           </DialogHeader>
//           {dataModal && (
//             <div className="py-3">
//               <div className="flex justify-center mb-6">
//                 <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 text-2xl font-bold">
//                   {dataModal.name
//                     .split(" ")
//                     .map((word) => word[0])
//                     .join("")}
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
//                     Nama Mahasiswa
//                   </p>
//                   <p className="font-medium">{dataModal.name}</p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
//                     <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
//                       Ruangan
//                     </p>
//                     <p className="font-medium">{dataModal.ruangan}</p>
//                   </div>

//                   <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
//                     <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
//                       Waktu
//                     </p>
//                     <p className="font-medium">{dataModal.time}</p>
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
//                     Tanggal
//                   </p>
//                   <div className="font-medium flex items-center gap-2">
//                     <CalendarIcon className="w-4 h-4 text-blue-500" />
//                     {dataModal.date}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//           <DialogFooter className="flex gap-2 border-t pt-4">
//             <Button
//               onClick={() =>
//                 navigate(`/dosen/seminar-kerja-praktek/mahasiswa-diuji/detail`)
//               }
//               className="bg-blue-600 hover:bg-blue-700 text-white"
//             >
//               Lihat Detail Lengkap
//             </Button>
//             <Button
//               variant="outline"
//               onClick={() => setOpenDialog(false)}
//               className="border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300"
//             >
//               Tutup
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// // Helper function to parse Indonesian date format
// const parseIndonesianDate = (dateString: string): Date => {
//   const months: Record<string, number> = {
//     Januari: 0,
//     Februari: 1,
//     Maret: 2,
//     April: 3,
//     Mei: 4,
//     Juni: 5,
//     Juli: 6,
//     Agustus: 7,
//     September: 8,
//     Oktober: 9,
//     November: 10,
//     Desember: 11,
//   };

//   const [day, month, year] = dateString.split(" ");
//   return new Date(parseInt(year), months[month], parseInt(day));
// };

// export default function DosenPengujiNilaiPage() {
//   const [isGridView, setIsGridView] = useState(true);
//   const [activeTab, setActiveTab] = useState("belum-dinilai");
//   const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Sample data with seminarDate property
//   const students: StudentData[] = [
//     {
//       name: "Farhan Fadhila",
//       type: "Seminar KP",
//       ruangan: "FST.301",
//       time: "08.00 WIB",
//       date: "23 April 2025",
//       isGraded: true,
//       seminarDate: parseIndonesianDate("23 April 2025"),
//     },
//     {
//       name: "Abmi Sukma Edri",
//       type: "Seminar KP",
//       ruangan: "FST.301",
//       time: "09.00 WIB",
//       date: "23 April 2025",
//       isGraded: false,
//       seminarDate: parseIndonesianDate("23 April 2025"),
//     },
//     {
//       name: "Muhammad Farhan Aulia Pratama",
//       type: "Seminar KP",
//       ruangan: "FST.302",
//       time: "10.00 WIB",
//       date: "23 April 2025",
//       isGraded: true,
//       seminarDate: parseIndonesianDate("23 April 2025"),
//     },
//     {
//       name: "M Nabil Dawami",
//       type: "Seminar KP",
//       ruangan: "FST.302",
//       time: "11.00 WIB",
//       date: "23 April 2025",
//       isGraded: false,
//       seminarDate: parseIndonesianDate("23 April 2025"),
//     },
//     {
//       name: "Hafidz Alhadid Rahman",
//       type: "Seminar KP",
//       ruangan: "FST.303",
//       time: "13.00 WIB",
//       date: "23 April 2025",
//       isGraded: true,
//       seminarDate: parseIndonesianDate("23 April 2025"),
//     },
//     {
//       name: "Muhammad Rafly Wirayudha",
//       type: "Seminar KP",
//       ruangan: "FST.303",
//       time: "14.00 WIB",
//       date: "23 April 2025",
//       isGraded: false,
//       seminarDate: parseIndonesianDate("23 April 2025"),
//     },
//     {
//       name: "Gilang Ramadhan Indra",
//       type: "Seminar KP",
//       ruangan: "FST.303",
//       time: "15.00 WIB",
//       date: "23 April 2025",
//       isGraded: true,
//       seminarDate: parseIndonesianDate("23 April 2025"),
//     },
//     {
//       name: "Ahmad Kurniawan",
//       type: "Seminar KP",
//       ruangan: "FST.301",
//       time: "16.00 WIB",
//       date: "23 April 2025",
//       isGraded: false,
//       seminarDate: parseIndonesianDate("23 April 2025"),
//     },
//     {
//       name: "Muh Zaki Erbai Syas",
//       type: "Seminar KP",
//       ruangan: "FST.301",
//       time: "17.00 WIB",
//       date: "23 April 2025",
//       isGraded: true,
//       seminarDate: parseIndonesianDate("23 April 2025"),
//     },
//     {
//       name: "Dewi Kartika",
//       type: "Seminar KP",
//       ruangan: "FST.302",
//       time: "09.00 WIB",
//       date: "24 April 2025",
//       isGraded: false,
//       seminarDate: parseIndonesianDate("24 April 2025"),
//     },
//     {
//       name: "Arif Nugraha",
//       type: "Seminar KP",
//       ruangan: "FST.302",
//       time: "10.00 WIB",
//       date: "24 April 2025",
//       isGraded: false,
//       seminarDate: parseIndonesianDate("24 April 2025"),
//     },
//     {
//       name: "Salsa Bintang",
//       type: "Seminar KP",
//       ruangan: "FST.304",
//       time: "11.00 WIB",
//       date: "25 April 2025",
//       isGraded: false,
//       seminarDate: parseIndonesianDate("25 April 2025"),
//     },
//     {
//       name: "Bayu Prasetya",
//       type: "Seminar KP",
//       ruangan: "FST.304",
//       time: "13.00 WIB",
//       date: "25 April 2025",
//       isGraded: false,
//       seminarDate: parseIndonesianDate("25 April 2025"),
//     },
//     {
//       name: "Nina Permata",
//       type: "Seminar KP",
//       ruangan: "FST.303",
//       time: "15.00 WIB",
//       date: "26 April 2025",
//       isGraded: false,
//       seminarDate: parseIndonesianDate("26 April 2025"),
//     },
//     {
//       name: "Reza Dwi",
//       type: "Seminar KP",
//       ruangan: "FST.301",
//       time: "08.00 WIB",
//       date: "27 April 2025",
//       isGraded: false,
//       seminarDate: parseIndonesianDate("27 April 2025"),
//     },
//   ];

//   // Function to count expected number of items based on filter
//   const getExpectedCount = (filter: string): number => {
//     switch (filter) {
//       case "belum-dinilai":
//         return students.filter((student) => !student.isGraded).length;
//       case "selesai":
//         return students.filter((student) => student.isGraded).length;
//       default:
//         return students.length;
//     }
//   };

//   // Function to filter students based on the selected tab
//   const filterStudentsByStatus = (selectedTab: string) => {
//     setIsLoading(true);

//     let filtered: StudentData[];

//     switch (selectedTab) {
//       case "belum-dinilai":
//         filtered = students.filter((student) => !student.isGraded);
//         break;
//       case "selesai":
//         filtered = students.filter((student) => student.isGraded);
//         break;
//       default:
//         filtered = [...students];
//         break;
//     }

//     // Simulate loading
//     setTimeout(() => {
//       setFilteredStudents(filtered);
//       setIsLoading(false);
//     }, 500);
//   };

//   // Effect to filter students when tab changes
//   useEffect(() => {
//     filterStudentsByStatus(activeTab);
//   }, [activeTab]);

//   const ViewToggleButtons = () => (
//     <div className="flex gap-2">
//       <Button
//         variant={isGridView ? "default" : "outline"}
//         size="sm"
//         onClick={() => setIsGridView(true)}
//         className={`flex items-center gap-1 text-sm ${
//           isGridView
//             ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
//             : "border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
//         }`}
//       >
//         <LayoutGrid size={16} />
//         Grid
//       </Button>
//       <Button
//         variant={!isGridView ? "default" : "outline"}
//         size="sm"
//         onClick={() => setIsGridView(false)}
//         className={`flex items-center gap-1 text-sm ${
//           !isGridView
//             ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
//             : "border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
//         }`}
//       >
//         <TableIcon size={16} />
//         Table
//       </Button>
//     </div>
//   );

//   return (
//     <DashboardLayout>
//       <WelcomeHeader />
//       <div>
//         <Tabs
//           defaultValue="belum-dinilai"
//           className="w-full"
//           onValueChange={setActiveTab}
//         >
//           <div className="flex justify-between items-center w-full">
//             <TabsList className="grid w-fit grid-cols-2 gap-2">
//               <TabsTrigger
//                 value="belum-dinilai"
//                 className="transition-all duration-300 ease-in-out data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:bg-blue-50 text-sm"
//               >
//                 Belum Dinilai
//               </TabsTrigger>
//               <TabsTrigger
//                 value="selesai"
//                 className="transition-all duration-300 ease-in-out data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:bg-blue-50 text-sm"
//               >
//                 Selesai
//               </TabsTrigger>
//             </TabsList>

//             <ViewToggleButtons />
//           </div>

//           <div className="mt-4 shadow-none border-none">
//             <TabsContent value="belum-dinilai" className="mt-0">
//               <div className="">
//                 {isGridView ? (
//                   <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
//                     {isLoading ? (
//                       <div></div>
//                     ) : filteredStudents.length === 0 ? (
//                       <div className="col-span-3 text-center py-8">
//                         ❌ Tidak ada mahasiswa yang{" "}
//                         {activeTab === "belum-dinilai" ? "belum" : "telah"}{" "}
//                         dinilai
//                       </div>
//                     ) : (
//                       filteredStudents.map((student, index) => (
//                         <StudentCard
//                           key={index}
//                           name={student.name}
//                           type={student.type}
//                           ruangan={student.ruangan}
//                           time={student.time}
//                           date={student.date}
//                           isGraded={student.isGraded} // Pass isGraded property
//                         />
//                       ))
//                     )}
//                   </div>
//                 ) : (
//                   <div className="rounded-md border">
//                     <StudentTable
//                       students={filteredStudents}
//                       isLoading={isLoading}
//                     />
//                   </div>
//                 )}
//               </div>
//             </TabsContent>

//             <TabsContent value="selesai" className="mt-0">
//               <div className="pt-2">
//                 {isGridView ? (
//                   <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
//                     {isLoading ? (
//                       <div></div>
//                     ) : filteredStudents.length === 0 ? (
//                       <div className="col-span-3 text-center py-8">
//                         ❌ Tidak ada mahasiswa yang{" "}
//                         {activeTab === "belum-dinilai" ? "belum" : "telah"}{" "}
//                         dinilai
//                       </div>
//                     ) : (
//                       filteredStudents.map((student, index) => (
//                         <StudentCard
//                           key={index}
//                           name={student.name}
//                           type={student.type}
//                           ruangan={student.ruangan}
//                           time={student.time}
//                           date={student.date}
//                           isGraded={student.isGraded} // Pass isGraded property
//                         />
//                       ))
//                     )}
//                   </div>
//                 ) : (
//                   <div className="rounded-md border">
//                     <StudentTable
//                       students={filteredStudents}
//                       isLoading={isLoading}
//                     />
//                   </div>
//                 )}
//               </div>
//             </TabsContent>
//           </div>
//         </Tabs>
//       </div>
//       {/* <div className="flex justify-end pt-0">
//         <h3 className="text-sm">---pagination---</h3>
//       </div> */}
//     </DashboardLayout>
//   );
// }
