import { useState, type FC } from "react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { Search, Eye, Users, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import ValidasiPendaftaranModal from "@/components/koordinator/seminar/validasi-pendaftaran-modal";
import ValidasiIdModal from "@/components/koordinator/seminar/validasi-id-modal";
import ValidasiSuratUndanganModal from "@/components/koordinator/seminar/validasi-suratUndangan-modal";
import ValidasipascaSeminarModal from "@/components/koordinator/seminar/validasi-pascaSeminar-modal";

// Type definitions
type Stage = "pendaftaran" | "idSurat" | "suratUndangan" | "pascaSeminar";
type Status = "baru" | "lanjut" | "selesai";

interface Student {
  id: number;
  nim: string;
  name: string;
  status: Status;
  timeAgo: string;
  stage: Stage;
  semester: number;
  dosenPembimbing: string;
  dosenPenguji: string;
  pembimbingInstansi: string;
  nilaiInstansi: string;
}

// Badge variants and colors mapped to application stages with modern transparent design
const stageBadgeConfig: Record<
  Stage,
  {
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    darkBgColor: string;
    darkTextColor: string;
    darkBorderColor: string;
  }
> = {
  pendaftaran: {
    label: "Pendaftaran",
    bgColor: "bg-blue-100/70",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    darkBgColor: "dark:bg-blue-900/30",
    darkTextColor: "dark:text-blue-300",
    darkBorderColor: "dark:border-blue-800",
  },
  idSurat: {
    label: "ID Surat",
    bgColor: "bg-purple-100/70",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
    darkBgColor: "dark:bg-purple-900/30",
    darkTextColor: "dark:text-purple-300",
    darkBorderColor: "dark:border-purple-800",
  },
  suratUndangan: {
    label: "Surat Undangan",
    bgColor: "bg-emerald-100/70",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    darkBgColor: "dark:bg-emerald-900/30",
    darkTextColor: "dark:text-emerald-300",
    darkBorderColor: "dark:border-emerald-800",
  },
  pascaSeminar: {
    label: "Pasca Seminar",
    bgColor: "bg-amber-100/70",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    darkBgColor: "dark:bg-amber-900/30",
    darkTextColor: "dark:text-amber-300",
    darkBorderColor: "dark:border-amber-800",
  },
};

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } },
};

const KoordinatorValidasiBerkasPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"semua" | Stage>("semua");

  // State untuk dialog
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Mock data
  // Mock data
  const students: Student[] = [
    {
      id: 1,
      nim: "12250111523",
      name: "M Farhan Aulia Pratama",
      status: "baru",
      timeAgo: "9 Hari yang lalu",
      stage: "pascaSeminar",
      semester: 6,
      dosenPembimbing: "Pizaini, S.T, M.Kom",
      dosenPenguji: "Rahmad Abdillah, S.T, M.Kom",
      pembimbingInstansi: "Iwan Iskandar",
      nilaiInstansi: "100",
    },
    {
      id: 2,
      nim: "12250111527",
      name: "Gilang Ramadhan",
      status: "baru",
      timeAgo: "20 Menit yang lalu",
      stage: "pendaftaran",
      semester: 6,
      dosenPembimbing: "Pizaini, S.T, M.Kom",
      dosenPenguji: "",
      pembimbingInstansi: "Iwan Iskandar",
      nilaiInstansi: "100",
    },
    {
      id: 3,
      nim: "12250111528",
      name: "Farhan Fadilla",
      status: "baru",
      timeAgo: "2 Hari yang lalu",
      stage: "pendaftaran",
      semester: 6,
      dosenPembimbing: "Affandes, S.T, M.Kom",
      dosenPenguji: "",
      pembimbingInstansi: "Iwan Iskandar",
      nilaiInstansi: "100",
    },
    {
      id: 4,
      nim: "12250111529",
      name: "Ahmad Kurniawan",
      status: "baru",
      timeAgo: "1 Bulan yang lalu",
      stage: "suratUndangan",
      semester: 6,
      dosenPembimbing: "Affandes, S.T, M.Kom",
      dosenPenguji: "Rahmad Abdillah, S.T, M.Kom",
      pembimbingInstansi: "Liza Afriyanti",
      nilaiInstansi: "100",
    },
    {
      id: 5,
      nim: "12250111521",
      name: "Muh Zaki Erbay Syas",
      status: "baru",
      timeAgo: "7 Hari yang lalu",
      stage: "idSurat",
      semester: 6,
      dosenPembimbing: "Pizaini, S.T, M.Kom",
      dosenPenguji: "",
      pembimbingInstansi: "Liza Afriyanti",
      nilaiInstansi: "100",
    },
    {
      id: 6,
      nim: "12250111522",
      name: "Muhammad Rafly Wirayudha",
      status: "baru",
      timeAgo: "9 Hari yang lalu",
      stage: "pascaSeminar",
      semester: 6,
      dosenPembimbing: "Affandes, S.T, M.Kom",
      dosenPenguji: "Rahmad Abdillah, S.T, M.Kom",
      pembimbingInstansi: "Liza Afriyanti",
      nilaiInstansi: "100",
    },
    {
      id: 7,
      nim: "12250111523",
      name: "Abmi Sukma Edri",
      status: "baru",
      timeAgo: "9 Hari yang lalu",
      stage: "pascaSeminar",
      semester: 6,
      dosenPembimbing: "Iwan Iskandar, S.T, M.Kom",
      dosenPenguji: "Rahmad Abdillah, S.T, M.Kom",
      pembimbingInstansi: "Liza Afriyanti",
      nilaiInstansi: "100",
    },
    {
      id: 8,
      nim: "12250111523",
      name: "Hafiz Alhadid Rahman",
      status: "baru",
      timeAgo: "9 Hari yang lalu",
      stage: "suratUndangan",
      semester: 6,
      dosenPembimbing: "Iwan Iskandar, S.T, M.Kom",
      dosenPenguji: "Rahmad Abdillah, S.T, M.Kom",
      pembimbingInstansi: "Liza Afriyanti",
      nilaiInstansi: "100",
    },
    {
      id: 9,
      nim: "12250111523",
      name: "M. Nabil Dawami",
      status: "baru",
      timeAgo: "9 Hari yang lalu",
      stage: "idSurat",
      semester: 6,
      dosenPembimbing: "Iwan Iskandar, S.T, M.Kom",
      dosenPenguji: "",
      pembimbingInstansi: "Liza Afriyanti",
      nilaiInstansi: "100",
    },
    {
      id: 10,
      nim: "12250111523",
      name: "Cahyo Kumolo",
      status: "lanjut",
      timeAgo: "9 Hari yang lalu",
      stage: "pendaftaran",
      semester: 6,
      dosenPembimbing: "Iwan Iskandar, S.T, M.Kom",
      dosenPenguji: "",
      pembimbingInstansi: "Nurrahman",
      nilaiInstansi: "100",
    },
  ];

  // Statistics for cards
  const totalMahasiswa = 18;
  const validasiDitolak = 3;
  const validasiSelesai = 7;

  // Filter students based on active tab and search query
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "semua" || student.stage === activeTab;
    return matchesSearch && matchesTab;
  });

  // Function to open dialog with selected student
  const handleOpenDialog = (student: Student) => {
    setSelectedStudent(student);
    setIsDialogOpen(true);
  };

  // Render the appropriate modal based on student stage
  const renderModal = () => {
    if (!selectedStudent) return null;

    switch (selectedStudent.stage) {
      case "pendaftaran":
        return (
          <ValidasiPendaftaranModal
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            student={selectedStudent}
          />
        );
      case "idSurat":
        return (
          <ValidasiIdModal
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            student={selectedStudent}
          />
        );
      case "suratUndangan":
        return (
          <ValidasiSuratUndanganModal
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            student={selectedStudent}
          />
        );
      case "pascaSeminar":
        return (
          <ValidasipascaSeminarModal
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            student={selectedStudent}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="transition-colors duration-300">
        {/* Header */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-4 dark:text-white">
              Validasi Permohonan Seminar KP Mahasiswa
            </h1>

            {/* Academic Year */}
            <div>
              <span className="mr-2 text-gray-600 dark:text-gray-300">
                Tahun Ajaran
              </span>
              <Badge
                variant="outline"
                className="bg-gray-100 dark:bg-gray-900 dark:text-gray-300"
              >
                2023-2024 Ganjil
              </Badge>
            </div>
          </div>

          {/* Animated Dashboard Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Card 1 - Permohonan Validasi */}
            <motion.div variants={item}>
              <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950 dark:to-gray-900">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-medium text-blue-800 dark:text-blue-300">
                    Permohonan Validasi
                  </CardTitle>
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    className="bg-blue-200 p-2 rounded-full dark:bg-blue-800"
                  >
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="text-5xl font-bold text-blue-800 dark:text-white"
                  >
                    {totalMahasiswa}
                  </motion.div>
                  <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                    Mahasiswa
                  </p>
                  <div className="h-2 w-full bg-blue-100 dark:bg-blue-900 rounded-full mt-3">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-2 bg-blue-500 rounded-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 2 - Ditolak Validasi */}
            <motion.div variants={item}>
              <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-red-100 to-red-50 dark:from-red-950 dark:to-gray-900">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-medium text-red-800 dark:text-red-300">
                    Validasi Ditolak
                  </CardTitle>
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    className="bg-red-200 p-2 rounded-full dark:bg-red-800"
                  >
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-300" />
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="text-5xl font-bold text-red-800 dark:text-white"
                  >
                    {validasiDitolak}
                  </motion.div>
                  <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                    Mahasiswa
                  </p>
                  <div className="h-2 w-full bg-red-100 dark:bg-red-900 rounded-full mt-3">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{
                        width: `${(validasiDitolak / totalMahasiswa) * 100}%`,
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-2 bg-red-500 rounded-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 3 - Validasi Selesai */}
            <motion.div variants={item}>
              <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-green-100 to-green-50 dark:from-green-950 dark:to-gray-900">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-medium text-green-800 dark:text-green-300">
                    Validasi Selesai
                  </CardTitle>
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    className="bg-green-200 p-2 rounded-full dark:bg-green-800"
                  >
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="text-5xl font-bold text-green-800 dark:text-white"
                  >
                    {validasiSelesai}
                  </motion.div>
                  <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                    Mahasiswa
                  </p>
                  <div className="h-2 w-full bg-green-100 dark:bg-green-900 rounded-full mt-3">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{
                        width: `${(validasiSelesai / totalMahasiswa) * 100}%`,
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-2 bg-green-500 rounded-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Navigation Tabs and Search Bar in a flex container */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Tabs
              defaultValue="semua"
              onValueChange={(value) => setActiveTab(value as "semua" | Stage)}
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
                    value="pendaftaran"
                    className="dark:data-[state=active]:bg-gray-800"
                  >
                    Pendaftaran
                  </TabsTrigger>
                  <TabsTrigger
                    value="idSurat"
                    className="dark:data-[state=active]:bg-gray-800"
                  >
                    Id Surat Undangan
                  </TabsTrigger>
                  <TabsTrigger
                    value="suratUndangan"
                    className="dark:data-[state=active]:bg-gray-800"
                  >
                    Surat Undangan
                  </TabsTrigger>
                  <TabsTrigger
                    value="pascaSeminar"
                    className="dark:data-[state=active]:bg-gray-800"
                  >
                    Pasca Seminar
                  </TabsTrigger>
                </TabsList>

                {/* Search Bar - now to the right of tabs */}
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
                  onViewDetail={handleOpenDialog}
                />
              </TabsContent>

              <TabsContent value="pendaftaran" className="mt-4">
                <StudentTable
                  students={filteredStudents}
                  onViewDetail={handleOpenDialog}
                />
              </TabsContent>

              <TabsContent value="idSurat" className="mt-4">
                <StudentTable
                  students={filteredStudents}
                  onViewDetail={handleOpenDialog}
                />
              </TabsContent>

              <TabsContent value="suratUndangan" className="mt-4">
                <StudentTable
                  students={filteredStudents}
                  onViewDetail={handleOpenDialog}
                />
              </TabsContent>

              <TabsContent value="pascaSeminar" className="mt-4">
                <StudentTable
                  students={filteredStudents}
                  onViewDetail={handleOpenDialog}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Render the appropriate modal */}
      {renderModal()}
    </DashboardLayout>
  );
};

// Separate component for the students table
const StudentTable: FC<{
  students: Student[];
  onViewDetail: (student: Student) => void;
}> = ({ students, onViewDetail }) => {
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
              Status
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Tahap
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Waktu Pengajuan
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
                colSpan={6}
                className="text-center py-6 text-muted-foreground dark:text-gray-400"
              >
                Tidak ada data yang ditemukan
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow
                key={student.id}
                className="dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <TableCell className="font-medium text-center dark:text-gray-300">
                  {student.id}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {student.name}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      student.status === "baru" ? "secondary" : "outline"
                    }
                    className={
                      student.status === "baru"
                        ? "dark:bg-gray-700 dark:text-gray-200"
                        : "dark:border-gray-600 dark:text-gray-300"
                    }
                  >
                    {student.status === "baru"
                      ? "Baru"
                      : student.status === "lanjut"
                      ? "Lanjut"
                      : "Selesai"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      stageBadgeConfig[student.stage].bgColor
                    } ${stageBadgeConfig[student.stage].textColor} ${
                      stageBadgeConfig[student.stage].darkBgColor
                    } ${stageBadgeConfig[student.stage].darkTextColor}`}
                  >
                    {stageBadgeConfig[student.stage].label}
                  </span>
                </TableCell>
                <TableCell className="text-center text-xs text-muted-foreground dark:text-gray-400">
                  {student.timeAgo}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white mx-auto dark:from-emerald-600 dark:to-teal-600 dark:hover:from-emerald-700 dark:hover:to-teal-700 border-0 transition-all flex items-center gap-1.5 py-1 rounded-md text-xs"
                    onClick={() => onViewDetail(student)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Detail</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default KoordinatorValidasiBerkasPage;
