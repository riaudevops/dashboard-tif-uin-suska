import { useState, type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { Search, Eye, Users, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
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
import DetailNilaiModal from "@/components/koordinator-kp/seminar/detail-nilai-modal";
import { motion } from "framer-motion";
import APISeminarKP from "@/services/api/koordinator-kp/mahasiswa.service";

// Type definitions
type NilaiStatus = "nilaiBelumValid" | "nilaiValid" | "nilaiApprove";
type status_daftar_kp = "Baru" | "Lanjut" | "Selesai";

interface Mahasiswa {
  nim: string;
  nama: string;
  kelas: string;
  status_daftar_kp: status_daftar_kp;
  status_nilai: string;
  semester: string;
  instansi: string;
  pembimbing_instansi: string;
  dosen_pembimbing: string;
  dosen_penguji: string;
}

interface NilaiResponse {
  tahunAjaran: string;
  jumlahNilaiBelumValid: number;
  jumlahNilaiValid: number;
  jumlahNilaiApprove: number;
  detailMahasiswa: Mahasiswa[];
}

// Badge variants and colors mapped to application stages with modern transparent design
const nilaiStatusBadgeConfig: Record<
  NilaiStatus,
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
  nilaiBelumValid: {
    label: "Nilai Belum Valid",
    bgColor: "bg-blue-100/70",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    darkBgColor: "dark:bg-blue-900/30",
    darkTextColor: "dark:text-blue-300",
    darkBorderColor: "dark:border-blue-800",
  },
  nilaiValid: {
    label: "Nilai Valid",
    bgColor: "bg-purple-100/70",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
    darkBgColor: "dark:bg-purple-900/30",
    darkTextColor: "dark:text-purple-300",
    darkBorderColor: "dark:border-purple-800",
  },
  nilaiApprove: {
    label: "Nilai Approve",
    bgColor: "bg-emerald-100/70",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    darkBgColor: "dark:bg-emerald-900/30",
    darkTextColor: "dark:text-emerald-300",
    darkBorderColor: "dark:border-emerald-800",
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

const KoordinatorNilaiPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"semua" | NilaiStatus>("semua");

  // State untuk dialog
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Mahasiswa | null>(
    null
  );

  // Fetch data menggunakan TanStack Query
  const { data, isLoading, isError, error } = useQuery<NilaiResponse>({
    queryKey: ["koordinator-nilai"],
    queryFn: APISeminarKP.getNilai,
  });

  // Transform data dari API ke format yang sesuai
  const students: Mahasiswa[] =
    data?.detailMahasiswa.map((student) => ({
      nim: student.nim,
      nama: student.nama,
      kelas: student.kelas,
      status_daftar_kp: student.status_daftar_kp as status_daftar_kp,
      status_nilai: student.status_nilai,
      semester: student.semester,
      instansi: student.instansi,
      pembimbing_instansi: student.pembimbing_instansi,
      dosen_pembimbing: student.dosen_pembimbing,
      dosen_penguji: student.dosen_penguji,
    })) || [];
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.nama
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "semua" ||
      (activeTab === "nilaiBelumValid" &&
        student.status_nilai === "Nilai Belum Valid") ||
      (activeTab === "nilaiValid" && student.status_nilai === "Nilai Valid") ||
      (activeTab === "nilaiApprove" &&
        student.status_nilai === "Nilai Approve");
    return matchesSearch && matchesTab;
  });

  // Calculate statistics from API data
  const totalStudents = students.length || 0;
  const belumValidCount = data?.jumlahNilaiBelumValid || 0;
  const validCount = data?.jumlahNilaiValid || 0;
  const approveCount = data?.jumlahNilaiApprove || 0;

  // Function to open dialog with selected student
  const handleOpenDialog = (student: Mahasiswa) => {
    // Cari data lengkap berdasarkan nim dari detailMahasiswa asli
    const fullStudentData = data?.detailMahasiswa.find(
      (s) => s.nim === student.nim
    );
    setSelectedStudent(fullStudentData || student);
    setIsDialogOpen(true);
  };

  // Render the modal
  const renderModal = () => {
    return (
      <DetailNilaiModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        student={selectedStudent}
      />
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-600 dark:text-gray-300">
          Memuat data nilai...
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-600 dark:text-red-300">
          Gagal mengambil data: {(error as Error).message}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="transition-colors duration-300">
        {/* Header */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-4 dark:text-white">
              Nilai Kerja Praktik Mahasiswa
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
                {data?.tahunAjaran || "Tidak tersedia"}
              </Badge>
            </div>
          </div>

          {/* Cards Section */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Card 1 - Nilai Belum Valid */}
            <motion.div variants={item}>
              <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950 dark:to-gray-900">
                <div className="flex flex-row items-center justify-between p-4 pb-2">
                  <h3 className="text-xl font-medium text-blue-800 dark:text-blue-300">
                    Nilai Belum Valid
                  </h3>
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    className="bg-blue-200 p-2 rounded-full dark:bg-blue-800"
                  >
                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  </motion.div>
                </div>
                <div className="p-4 pt-0">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="text-5xl font-bold text-blue-800 dark:text-white"
                  >
                    {belumValidCount}
                  </motion.div>
                  <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                    Mahasiswa
                  </p>
                  <div className="h-2 w-full bg-blue-100 dark:bg-blue-900 rounded-full mt-3">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{
                        width: totalStudents
                          ? `${(belumValidCount / totalStudents) * 100}%`
                          : "0%",
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-2 bg-blue-500 rounded-full"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Card 2 - Nilai Valid */}
            <motion.div variants={item}>
              <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-950 dark:to-gray-900">
                <div className="flex flex-row items-center justify-between p-4 pb-2">
                  <h3 className="text-xl font-medium text-purple-800 dark:text-purple-300">
                    Nilai Valid
                  </h3>
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    className="bg-purple-200 p-2 rounded-full dark:bg-purple-800"
                  >
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                  </motion.div>
                </div>
                <div className="p-4 pt-0">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="text-5xl font-bold text-purple-800 dark:text-white"
                  >
                    {validCount}
                  </motion.div>
                  <p className="text-sm text-purple-600 dark:text-purple-300 mt-1">
                    Mahasiswa
                  </p>
                  <div className="h-2 w-full bg-purple-100 dark:bg-purple-900 rounded-full mt-3">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{
                        width: totalStudents
                          ? `${(validCount / totalStudents) * 100}%`
                          : "0%",
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-2 bg-purple-500 rounded-full"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Card 3 - Nilai Approve */}
            <motion.div variants={item}>
              <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-950 dark:to-gray-900">
                <div className="flex flex-row items-center justify-between p-4 pb-2">
                  <h3 className="text-xl font-medium text-emerald-800 dark:text-emerald-300">
                    Nilai Approve
                  </h3>
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    className="bg-emerald-200 p-2 rounded-full dark:bg-emerald-800"
                  >
                    <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  </motion.div>
                </div>
                <div className="p-4 pt-0">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="text-5xl font-bold text-emerald-800 dark:text-white"
                  >
                    {approveCount}
                  </motion.div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-300 mt-1">
                    Mahasiswa
                  </p>
                  <div className="h-2 w-full bg-emerald-100 dark:bg-emerald-900 rounded-full mt-3">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{
                        width: totalStudents
                          ? `${(approveCount / totalStudents) * 100}%`
                          : "0%",
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-2 bg-emerald-500 rounded-full"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Navigation Tabs and Search Bar in a flex container */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Tabs
              defaultValue="semua"
              onValueChange={(value) =>
                setActiveTab(value as "semua" | NilaiStatus)
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
                    value="nilaiBelumValid"
                    className="dark:data-[state=active]:bg-gray-800"
                  >
                    Nilai Belum Valid
                  </TabsTrigger>
                  <TabsTrigger
                    value="nilaiValid"
                    className="dark:data-[state=active]:bg-gray-800"
                  >
                    Nilai Valid
                  </TabsTrigger>
                  <TabsTrigger
                    value="nilaiApprove"
                    className="dark:data-[state=active]:bg-gray-800"
                  >
                    Approve
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

              <TabsContent value="nilaiBelumValid" className="mt-4">
                <StudentTable
                  students={filteredStudents}
                  onViewDetail={handleOpenDialog}
                />
              </TabsContent>

              <TabsContent value="nilaiValid" className="mt-4">
                <StudentTable
                  students={filteredStudents}
                  onViewDetail={handleOpenDialog}
                />
              </TabsContent>

              <TabsContent value="nilaiApprove" className="mt-4">
                <StudentTable
                  students={filteredStudents}
                  onViewDetail={handleOpenDialog}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Render the modal */}
      {renderModal()}
    </DashboardLayout>
  );
};

// Separate component for the students table
const StudentTable: FC<{
  students: Mahasiswa[];
  onViewDetail: (student: Mahasiswa) => void;
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
              NIM
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Status KP
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Kelas
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Status Nilai
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
                colSpan={7}
                className="text-center py-6 text-muted-foreground dark:text-gray-400"
              >
                Tidak ada data yang ditemukan
              </TableCell>
            </TableRow>
          ) : (
            students.map((student, index) => (
              <TableRow
                key={student.nim}
                className="dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <TableCell className="font-medium text-center dark:text-gray-300">
                  {index + 1}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {student.nama}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300">
                  {student.nim}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      student.status_daftar_kp === "Baru"
                        ? "secondary"
                        : "outline"
                    }
                    className={
                      student.status_daftar_kp === "Baru"
                        ? "dark:bg-gray-700 dark:text-gray-200"
                        : "dark:border-gray-600 dark:text-gray-300"
                    }
                  >
                    {student.status_daftar_kp}
                  </Badge>
                </TableCell>
                <TableCell className="dark:text-gray-300 text-center">
                  {student.kelas}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      nilaiStatusBadgeConfig[
                        student.status_nilai === "Nilai Belum Valid"
                          ? "nilaiBelumValid"
                          : student.status_nilai === "Nilai Valid"
                          ? "nilaiValid"
                          : "nilaiApprove"
                      ].bgColor
                    } ${
                      nilaiStatusBadgeConfig[
                        student.status_nilai === "Nilai Belum Valid"
                          ? "nilaiBelumValid"
                          : student.status_nilai === "Nilai Valid"
                          ? "nilaiValid"
                          : "nilaiApprove"
                      ].textColor
                    } ${
                      nilaiStatusBadgeConfig[
                        student.status_nilai === "Nilai Belum Valid"
                          ? "nilaiBelumValid"
                          : student.status_nilai === "Nilai Valid"
                          ? "nilaiValid"
                          : "nilaiApprove"
                      ].darkBgColor
                    } ${
                      nilaiStatusBadgeConfig[
                        student.status_nilai === "Nilai Belum Valid"
                          ? "nilaiBelumValid"
                          : student.status_nilai === "Nilai Valid"
                          ? "nilaiValid"
                          : "nilaiApprove"
                      ].darkTextColor
                    }`}
                  >
                    {student.status_nilai}
                  </span>
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

export default KoordinatorNilaiPage;
