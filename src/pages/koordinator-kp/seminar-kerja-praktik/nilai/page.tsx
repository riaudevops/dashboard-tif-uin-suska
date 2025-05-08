import { useState, type FC } from "react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { Search, Eye } from "lucide-react";

import {
  Card,
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
import NilaiBelumValidModal from "@/components/koordinator/seminar/nilai-belumValid-modal";
import NilaiValidModal from "@/components/koordinator/seminar/nilai-valid-modal";
import NilaiApproveModal from "@/components/koordinator/seminar/nilai-approve-modal";

// Type definitions
type Stage = "pendaftaran" | "idSurat" | "suratUndangan" | "pascaSeminar";
type NilaiStatus = "nilaiBelumValid" | "nilaiValid" | "nilaiApprove";
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
  nilaiPembimbing: string;
  nilaiPenguji: string;
  nilaiStatus: NilaiStatus;
  kelas: string;
  instansi: string;
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

const KoordinatorNilaiPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"semua" | NilaiStatus>("semua");

  // State untuk dialog
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

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
      nilaiInstansi: "4.00 (A)",
      nilaiStatus: "nilaiBelumValid",
      kelas: "C",
      instansi: "Prodi TIF UIN Suska Riau",
      nilaiPembimbing: "",
      nilaiPenguji: "",
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
      dosenPenguji: "Rahmad Abdillah, S.t, M.Kom",
      pembimbingInstansi: "Iwan Iskandar",
      nilaiInstansi: "4.00 (A)",
      nilaiStatus: "nilaiValid",
      kelas: "C",
      instansi: "Prodi TIF UIN Suska Riau",
      nilaiPembimbing: "4.00 (A)",
      nilaiPenguji: "4.00 (A)",
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
      dosenPenguji: "Rahmad Abdillah, S.t, M.Kom",
      pembimbingInstansi: "Iwan Iskandar",
      nilaiInstansi: "4.00 (A)",
      nilaiStatus: "nilaiApprove",
      kelas: "C",
      instansi: "Prodi TIF UIN Suska Riau",
      nilaiPembimbing: "4.00 (A)",
      nilaiPenguji: "4.00 (A)",
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
      nilaiInstansi: "4.00 (A)",
      nilaiStatus: "nilaiBelumValid",
      kelas: "C",
      instansi: "Prodi TIF UIN Suska Riau",
      nilaiPembimbing: "",
      nilaiPenguji: "",
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
      dosenPenguji: "Rahmad Abdillah, S.t, M.Kom",
      pembimbingInstansi: "Liza Afriyanti",
      nilaiInstansi: "4.00 (A)",
      nilaiStatus: "nilaiValid",
      kelas: "C",
      instansi: "Prodi TIF UIN Suska Riau",
      nilaiPembimbing: "4.00 (A)",
      nilaiPenguji: "4.00 (A)",
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
      nilaiInstansi: "4.00 (A)",
      nilaiStatus: "nilaiApprove",
      kelas: "C",
      instansi: "Prodi TIF UIN Suska Riau",
      nilaiPembimbing: "4.00 (A)",
      nilaiPenguji: "4.00 (A)",
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
      nilaiInstansi: "4.00 (A)",
      nilaiStatus: "nilaiBelumValid",
      kelas: "C",
      instansi: "Prodi TIF UIN Suska Riau",
      nilaiPembimbing: "",
      nilaiPenguji: "",
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
      nilaiInstansi: "4.00 (A)",
      nilaiStatus: "nilaiValid",
      kelas: "C",
      instansi: "Prodi TIF UIN Suska Riau",
      nilaiPembimbing: "4.00 (A)",
      nilaiPenguji: "4.00 (A)",
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
      dosenPenguji: "Rahmad Abdillah, S.t, M.Kom",
      pembimbingInstansi: "Liza Afriyanti",
      nilaiInstansi: "4.00 (A)",
      nilaiStatus: "nilaiApprove",
      kelas: "C",
      instansi: "Prodi TIF UIN Suska Riau",
      nilaiPembimbing: "4.00 (A)",
      nilaiPenguji: "4.00 (A)",
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
      dosenPenguji: "Rahmad Abdillah, S.t, M.Kom",
      pembimbingInstansi: "Nurrahman",
      nilaiInstansi: "4.00 (A)",
      nilaiStatus: "nilaiBelumValid",
      kelas: "C",
      instansi: "Prodi TIF UIN Suska Riau",
      nilaiPembimbing: "",
      nilaiPenguji: "",
    },
  ];

  // Filter students based on active tab and search query
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "semua" || student.nilaiStatus === activeTab;
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

    switch (selectedStudent.nilaiStatus) {
      case "nilaiBelumValid":
        return (
          <NilaiBelumValidModal
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            student={selectedStudent}
          />
        );
      case "nilaiValid":
        return (
          <NilaiValidModal
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            student={selectedStudent}
          />
        );
      case "nilaiApprove":
        return (
          <NilaiApproveModal
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
                2023-2024 Ganjil
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1 - Nilai Belum Valid */}
            <div className="rounded-lg overflow-hidden border dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-all duration-300 flex">
              <div className="w-1 bg-gradient-to-b from-blue-400 to-blue-600 flex-shrink-0"></div>
              <div className="p-4 flex flex-col w-full">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Nilai Belum Valid
                </p>
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                  18
                </div>
                <div className="text-xs font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wider">
                  Mahasiswa
                </div>
              </div>
            </div>

            {/* Card 2 - Ditolak Validasi */}
            <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-900 border dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 flex">
              <div className="w-1 bg-gradient-to-b from-red-400 to-red-600 flex-shrink-0"></div>
              <div className="p-4 flex flex-col w-full">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Nilai Valid
                </p>
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400">
                  3
                </div>
                <div className="text-xs font-semibold text-red-500 dark:text-red-400 uppercase tracking-wider">
                  Mahasiswa
                </div>
              </div>
            </div>

            {/* Card 3 - Validasi Selesai */}
            <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-900 border dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 flex">
              <div className="w-1 bg-gradient-to-b from-green-400 to-green-600 flex-shrink-0"></div>
              <div className="p-4 flex flex-col w-full">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Nilai Approve
                </p>
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
                  7
                </div>
                <div className="text-xs font-semibold text-green-500 dark:text-green-400 uppercase tracking-wider">
                  Mahasiswa
                </div>
              </div>
            </div>
          </div>

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
            <TableHead className=" font-semibold dark:text-gray-200">
              Nama Mahasiswa
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Status
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Kelas
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Status Nilai
            </TableHead>
            {/* <TableHead className="text-center font-semibold dark:text-gray-200">
              Tanggal Valid
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Tanggal Approve
            </TableHead> */}
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
                <TableCell className="dark:text-gray-300 text-center">
                  {student.kelas}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      nilaiStatusBadgeConfig[student.nilaiStatus].bgColor
                    } ${
                      nilaiStatusBadgeConfig[student.nilaiStatus].textColor
                    } ${
                      nilaiStatusBadgeConfig[student.nilaiStatus].darkBgColor
                    } ${
                      nilaiStatusBadgeConfig[student.nilaiStatus].darkTextColor
                    }`}
                  >
                    {nilaiStatusBadgeConfig[student.nilaiStatus].label}
                  </span>
                </TableCell>
                {/* <TableCell className="text-center text-xs text-muted-foreground dark:text-gray-400">
                  {student.timeAgo}
                </TableCell> */}
                <TableCell className="text-center">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white mx-auto dark:from-emerald-600 dark:to-teal-600 dark:hover:from-emerald-700 dark:hover:to-teal-700 border-0 transition-all flex items-center gap-1.5 py-1 rounded-md  text-xs"
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

// import { useState, type FC } from "react";
// import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
// import { Search, Eye } from "lucide-react";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import ValidasiPendaftaranModal from "@/components/koordinator/seminar/validasi-pendaftaran-modal";
// import ValidasiIdModal from "@/components/koordinator/seminar/validasi-id-modal";
// import ValidasiSuratUndanganModal from "@/components/koordinator/seminar/validasi-suratUndangan-modal";
// import ValidasipascaSeminarModal from "@/components/koordinator/seminar/validasi-pascaSeminar-modal";
// import NilaiBelumValidModal from "@/components/koordinator/seminar/nilai-belumValid-modal";
// import NilaiValidModal from "@/components/koordinator/seminar/nilai-valid-modal";
// import NilaiApproveModal from "@/components/koordinator/seminar/nilai-approve-modal";

// // Type definitions
// type Stage = "pendaftaran" | "idSurat" | "suratUndangan" | "pascaSeminar";
// type NilaiStatus = "nilaiBelumValid" | "nilaiValid" | "nilaiApprove";
// type Status = "baru" | "lanjut" | "selesai";

// interface Student {
//   id: number;
//   nim: string;
//   name: string;
//   status: Status;
//   timeAgo: string;
//   stage: Stage;
//   semester: number;
//   dosenPembimbing: string;
//   dosenPenguji: string;
//   pembimbingInstansi: string;
//   nilaiInstansi: string;
//   nilaiPembimbing: string;
//   nilaiPenguji: string;
//   nilaiStatus: NilaiStatus;
//   kelas: string;
//   instansi: string;
// }

// // Badge variants and colors mapped to application stages with modern transparent design
// const nilaiStatusBadgeConfig: Record<
//   NilaiStatus,
//   {
//     label: string;
//     bgColor: string;
//     textColor: string;
//     borderColor: string;
//     darkBgColor: string;
//     darkTextColor: string;
//     darkBorderColor: string;
//   }
// > = {
//   nilaiBelumValid: {
//     label: "Nilai Belum Valid",
//     bgColor: "bg-blue-100/70",
//     textColor: "text-blue-700",
//     borderColor: "border-blue-200",
//     darkBgColor: "dark:bg-blue-900/30",
//     darkTextColor: "dark:text-blue-300",
//     darkBorderColor: "dark:border-blue-800",
//   },
//   nilaiValid: {
//     label: "Nilai Valid",
//     bgColor: "bg-purple-100/70",
//     textColor: "text-purple-700",
//     borderColor: "border-purple-200",
//     darkBgColor: "dark:bg-purple-900/30",
//     darkTextColor: "dark:text-purple-300",
//     darkBorderColor: "dark:border-purple-800",
//   },
//   nilaiApprove: {
//     label: "Nilai Approve",
//     bgColor: "bg-emerald-100/70",
//     textColor: "text-emerald-700",
//     borderColor: "border-emerald-200",
//     darkBgColor: "dark:bg-emerald-900/30",
//     darkTextColor: "dark:text-emerald-300",
//     darkBorderColor: "dark:border-emerald-800",
//   },
// };

// const KoordinatorNilaiPage: FC = () => {
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [activeTab, setActiveTab] = useState<"semua" | NilaiStatus>("semua");

//   // State untuk dialog
//   const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
//   const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

//   // Mock data
//   const students: Student[] = [
//     {
//       id: 1,
//       nim: "12250111523",
//       name: "M Farhan Aulia Pratama",
//       status: "baru",
//       timeAgo: "9 Hari yang lalu",
//       stage: "pascaSeminar",
//       semester: 6,
//       dosenPembimbing: "Pizaini, S.T, M.Kom",
//       dosenPenguji: "Rahmad Abdillah, S.T, M.Kom",
//       pembimbingInstansi: "Iwan Iskandar",
//       nilaiInstansi: "4.00 (A)",
//       nilaiStatus: "nilaiBelumValid",
//       kelas: "C",
//       instansi: "Prodi TIF UIN Suska Riau",
//       nilaiPembimbing: "",
//       nilaiPenguji: "",
//     },
//     {
//       id: 2,
//       nim: "12250111527",
//       name: "Gilang Ramadhan",
//       status: "baru",
//       timeAgo: "20 Menit yang lalu",
//       stage: "pendaftaran",
//       semester: 6,
//       dosenPembimbing: "Pizaini, S.T, M.Kom",
//       dosenPenguji: "Rahmad Abdillah, S.t, M.Kom",
//       pembimbingInstansi: "Iwan Iskandar",
//       nilaiInstansi: "4.00 (A)",
//       nilaiStatus: "nilaiValid",
//       kelas: "C",
//       instansi: "Prodi TIF UIN Suska Riau",
//       nilaiPembimbing: "4.00 (A)",
//       nilaiPenguji: "4.00 (A)",
//     },
//     {
//       id: 3,
//       nim: "12250111528",
//       name: "Farhan Fadilla",
//       status: "baru",
//       timeAgo: "2 Hari yang lalu",
//       stage: "pendaftaran",
//       semester: 6,
//       dosenPembimbing: "Affandes, S.T, M.Kom",
//       dosenPenguji: "Rahmad Abdillah, S.t, M.Kom",
//       pembimbingInstansi: "Iwan Iskandar",
//       nilaiInstansi: "4.00 (A)",
//       nilaiStatus: "nilaiApprove",
//       kelas: "C",
//       instansi: "Prodi TIF UIN Suska Riau",
//       nilaiPembimbing: "4.00 (A)",
//       nilaiPenguji: "4.00 (A)",
//     },
//     {
//       id: 4,
//       nim: "12250111529",
//       name: "Ahmad Kurniawan",
//       status: "baru",
//       timeAgo: "1 Bulan yang lalu",
//       stage: "suratUndangan",
//       semester: 6,
//       dosenPembimbing: "Affandes, S.T, M.Kom",
//       dosenPenguji: "Rahmad Abdillah, S.T, M.Kom",
//       pembimbingInstansi: "Liza Afriyanti",
//       nilaiInstansi: "4.00 (A)",
//       nilaiStatus: "nilaiBelumValid",
//       kelas: "C",
//       instansi: "Prodi TIF UIN Suska Riau",
//       nilaiPembimbing: "",
//       nilaiPenguji: "",
//     },
//     {
//       id: 5,
//       nim: "12250111521",
//       name: "Muh Zaki Erbay Syas",
//       status: "baru",
//       timeAgo: "7 Hari yang lalu",
//       stage: "idSurat",
//       semester: 6,
//       dosenPembimbing: "Pizaini, S.T, M.Kom",
//       dosenPenguji: "Rahmad Abdillah, S.t, M.Kom",
//       pembimbingInstansi: "Liza Afriyanti",
//       nilaiInstansi: "4.00 (A)",
//       nilaiStatus: "nilaiValid",
//       kelas: "C",
//       instansi: "Prodi TIF UIN Suska Riau",
//       nilaiPembimbing: "4.00 (A)",
//       nilaiPenguji: "4.00 (A)",
//     },
//     {
//       id: 6,
//       nim: "12250111522",
//       name: "Muhammad Rafly Wirayudha",
//       status: "baru",
//       timeAgo: "9 Hari yang lalu",
//       stage: "pascaSeminar",
//       semester: 6,
//       dosenPembimbing: "Affandes, S.T, M.Kom",
//       dosenPenguji: "Rahmad Abdillah, S.T, M.Kom",
//       pembimbingInstansi: "Liza Afriyanti",
//       nilaiInstansi: "4.00 (A)",
//       nilaiStatus: "nilaiApprove",
//       kelas: "C",
//       instansi: "Prodi TIF UIN Suska Riau",
//       nilaiPembimbing: "4.00 (A)",
//       nilaiPenguji: "4.00 (A)",
//     },
//     {
//       id: 7,
//       nim: "12250111523",
//       name: "Abmi Sukma Edri",
//       status: "baru",
//       timeAgo: "9 Hari yang lalu",
//       stage: "pascaSeminar",
//       semester: 6,
//       dosenPembimbing: "Iwan Iskandar, S.T, M.Kom",
//       dosenPenguji: "Rahmad Abdillah, S.T, M.Kom",
//       pembimbingInstansi: "Liza Afriyanti",
//       nilaiInstansi: "4.00 (A)",
//       nilaiStatus: "nilaiBelumValid",
//       kelas: "C",
//       instansi: "Prodi TIF UIN Suska Riau",
//       nilaiPembimbing: "",
//       nilaiPenguji: "",
//     },
//     {
//       id: 8,
//       nim: "12250111523",
//       name: "Hafiz Alhadid Rahman",
//       status: "baru",
//       timeAgo: "9 Hari yang lalu",
//       stage: "suratUndangan",
//       semester: 6,
//       dosenPembimbing: "Iwan Iskandar, S.T, M.Kom",
//       dosenPenguji: "Rahmad Abdillah, S.T, M.Kom",
//       pembimbingInstansi: "Liza Afriyanti",
//       nilaiInstansi: "4.00 (A)",
//       nilaiStatus: "nilaiValid",
//       kelas: "C",
//       instansi: "Prodi TIF UIN Suska Riau",
//       nilaiPembimbing: "4.00 (A)",
//       nilaiPenguji: "4.00 (A)",
//     },
//     {
//       id: 9,
//       nim: "12250111523",
//       name: "M. Nabil Dawami",
//       status: "baru",
//       timeAgo: "9 Hari yang lalu",
//       stage: "idSurat",
//       semester: 6,
//       dosenPembimbing: "Iwan Iskandar, S.T, M.Kom",
//       dosenPenguji: "Rahmad Abdillah, S.t, M.Kom",
//       pembimbingInstansi: "Liza Afriyanti",
//       nilaiInstansi: "4.00 (A)",
//       nilaiStatus: "nilaiApprove",
//       kelas: "C",
//       instansi: "Prodi TIF UIN Suska Riau",
//       nilaiPembimbing: "4.00 (A)",
//       nilaiPenguji: "4.00 (A)",
//     },
//     {
//       id: 10,
//       nim: "12250111523",
//       name: "Cahyo Kumolo",
//       status: "lanjut",
//       timeAgo: "9 Hari yang lalu",
//       stage: "pendaftaran",
//       semester: 6,
//       dosenPembimbing: "Iwan Iskandar, S.T, M.Kom",
//       dosenPenguji: "Rahmad Abdillah, S.t, M.Kom",
//       pembimbingInstansi: "Nurrahman",
//       nilaiInstansi: "4.00 (A)",
//       nilaiStatus: "nilaiBelumValid",
//       kelas: "C",
//       instansi: "Prodi TIF UIN Suska Riau",
//       nilaiPembimbing: "",
//       nilaiPenguji: "",
//     },
//   ];

//   // Filter students based on active tab and search query
//   const filteredStudents = students.filter((student) => {
//     const matchesSearch = student.name
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase());
//     const matchesTab =
//       activeTab === "semua" || student.nilaiStatus === activeTab;
//     return matchesSearch && matchesTab;
//   });

//   // Function to open dialog with selected student
//   const handleOpenDialog = (student: Student) => {
//     setSelectedStudent(student);
//     setIsDialogOpen(true);
//   };

//   // Render the appropriate modal based on student stage
//   const renderModal = () => {
//     if (!selectedStudent) return null;

//     switch (selectedStudent.nilaiStatus) {
//       case "nilaiBelumValid":
//         return (
//           <NilaiBelumValidModal
//             isOpen={isDialogOpen}
//             onClose={() => setIsDialogOpen(false)}
//             student={selectedStudent}
//           />
//         );
//       case "nilaiValid":
//         return (
//           <NilaiValidModal
//             isOpen={isDialogOpen}
//             onClose={() => setIsDialogOpen(false)}
//             student={selectedStudent}
//           />
//         );
//       case "nilaiApprove":
//         return (
//           <NilaiApproveModal
//             isOpen={isDialogOpen}
//             onClose={() => setIsDialogOpen(false)}
//             student={selectedStudent}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <DashboardLayout>
//       <div className="transition-colors duration-300">
//         {/* Header */}
//         <div className="space-y-6">
//           <div>
//             <h1 className="text-2xl font-bold mb-4 dark:text-white">
//               Nilai Kerja Praktik Mahasiswa
//             </h1>

//             {/* Academic Year */}
//             <div>
//               <span className="mr-2 text-gray-600 dark:text-gray-300">
//                 Tahun Ajaran
//               </span>
//               <Badge
//                 variant="outline"
//                 className="bg-gray-100 dark:bg-gray-900 dark:text-gray-300"
//               >
//                 2023-2024 Ganjil
//               </Badge>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {/* Card 1 - Nilai Belum Valid */}
//             <div className="rounded-lg overflow-hidden border dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-all duration-300 flex">
//               <div className="w-1 bg-gradient-to-b from-blue-400 to-blue-600 flex-shrink-0"></div>
//               <div className="p-4 flex flex-col w-full">
//                 <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
//                   Nilai Belum Valid
//                 </p>
//                 <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
//                   18
//                 </div>
//                 <div className="text-xs font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wider">
//                   Mahasiswa
//                 </div>
//               </div>
//             </div>

//             {/* Card 2 - Ditolak Validasi */}
//             <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-900 border dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 flex">
//               <div className="w-1 bg-gradient-to-b from-red-400 to-red-600 flex-shrink-0"></div>
//               <div className="p-4 flex flex-col w-full">
//                 <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
//                   Nilai Valid
//                 </p>
//                 <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400">
//                   3
//                 </div>
//                 <div className="text-xs font-semibold text-red-500 dark:text-red-400 uppercase tracking-wider">
//                   Mahasiswa
//                 </div>
//               </div>
//             </div>

//             {/* Card 3 - Validasi Selesai */}
//             <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-900 border dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 flex">
//               <div className="w-1 bg-gradient-to-b from-green-400 to-green-600 flex-shrink-0"></div>
//               <div className="p-4 flex flex-col w-full">
//                 <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
//                   Nilai Approve
//                 </p>
//                 <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
//                   7
//                 </div>
//                 <div className="text-xs font-semibold text-green-500 dark:text-green-400 uppercase tracking-wider">
//                   Mahasiswa
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Navigation Tabs and Search Bar in a flex container */}
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <Tabs
//               defaultValue="semua"
//               onValueChange={(value) =>
//                 setActiveTab(value as "semua" | NilaiStatus)
//               }
//               className="w-full"
//             >
//               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
//                 <TabsList className="dark:bg-gray-700">
//                   <TabsTrigger
//                     value="semua"
//                     className="dark:data-[state=active]:bg-gray-800"
//                   >
//                     Semua
//                   </TabsTrigger>
//                   <TabsTrigger
//                     value="nilaiBelumValid"
//                     className="dark:data-[state=active]:bg-gray-800"
//                   >
//                     Nilai Belum Valid
//                   </TabsTrigger>
//                   <TabsTrigger
//                     value="nilaiValid"
//                     className="dark:data-[state=active]:bg-gray-800"
//                   >
//                     Nilai Valid
//                   </TabsTrigger>
//                   <TabsTrigger
//                     value="nilaiApprove"
//                     className="dark:data-[state=active]:bg-gray-800"
//                   >
//                     Approve
//                   </TabsTrigger>
//                 </TabsList>

//                 {/* Search Bar - now to the right of tabs */}
//                 <div className="flex items-center w-full relative">
//                   <Search className="h-4 w-4 absolute left-3 text-gray-400" />
//                   <Input
//                     type="text"
//                     placeholder="Cari nama mahasiswa..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full pl-10 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400"
//                   />
//                 </div>
//               </div>

//               <TabsContent value="semua" className="mt-4">
//                 <StudentTable
//                   students={filteredStudents}
//                   onViewDetail={handleOpenDialog}
//                 />
//               </TabsContent>

//               <TabsContent value="nilaiBelumValid" className="mt-4">
//                 <StudentTable
//                   students={filteredStudents}
//                   onViewDetail={handleOpenDialog}
//                 />
//               </TabsContent>

//               <TabsContent value="nilaiValid" className="mt-4">
//                 <StudentTable
//                   students={filteredStudents}
//                   onViewDetail={handleOpenDialog}
//                 />
//               </TabsContent>

//               <TabsContent value="nilaiApprove" className="mt-4">
//                 <StudentTable
//                   students={filteredStudents}
//                   onViewDetail={handleOpenDialog}
//                 />
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       </div>

//       {/* Render the appropriate modal */}
//       {renderModal()}
//     </DashboardLayout>
//   );
// };

// // Separate component for the students table
// const StudentTable: FC<{
//   students: Student[];
//   onViewDetail: (student: Student) => void;
// }> = ({ students, onViewDetail }) => {
//   return (
//     <Card className="shadow-none rounded-none dark:bg-gray-900 dark:border-gray-700">
//       <Table>
//         <TableHeader className="bg-gray-200 dark:bg-gray-700">
//           <TableRow className="hover:bg-gray-300 dark:hover:bg-gray-600">
//             <TableHead className="w-12 text-center font-semibold dark:text-gray-200">
//               No
//             </TableHead>
//             <TableHead className=" font-semibold dark:text-gray-200">
//               Nama Mahasiswa
//             </TableHead>
//             <TableHead className="text-center font-semibold dark:text-gray-200">
//               Status
//             </TableHead>
//             <TableHead className="text-center font-semibold dark:text-gray-200">
//               Kelas
//             </TableHead>
//             <TableHead className="text-center font-semibold dark:text-gray-200">
//               Status Nilai
//             </TableHead>
//             <TableHead className="text-center font-semibold dark:text-gray-200">
//               Tanggal Valid
//             </TableHead>
//             <TableHead className="text-center font-semibold dark:text-gray-200">
//               Tanggal Approve
//             </TableHead>
//             <TableHead className="text-center font-semibold dark:text-gray-200">
//               Aksi
//             </TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {students.length === 0 ? (
//             <TableRow className="dark:border-gray-700 dark:hover:bg-gray-700">
//               <TableCell
//                 colSpan={6}
//                 className="text-center py-6 text-muted-foreground dark:text-gray-400"
//               >
//                 Tidak ada data yang ditemukan
//               </TableCell>
//             </TableRow>
//           ) : (
//             students.map((student) => (
//               <TableRow
//                 key={student.id}
//                 className="dark:border-gray-700 dark:hover:bg-gray-700"
//               >
//                 <TableCell className="font-medium text-center dark:text-gray-300">
//                   {student.id}
//                 </TableCell>
//                 <TableCell className="dark:text-gray-300">
//                   {student.name}
//                 </TableCell>
//                 <TableCell className="text-center">
//                   <Badge
//                     variant={
//                       student.status === "baru" ? "secondary" : "outline"
//                     }
//                     className={
//                       student.status === "baru"
//                         ? "dark:bg-gray-700 dark:text-gray-200"
//                         : "dark:border-gray-600 dark:text-gray-300"
//                     }
//                   >
//                     {student.status === "baru"
//                       ? "Baru"
//                       : student.status === "lanjut"
//                       ? "Lanjut"
//                       : "Selesai"}
//                   </Badge>
//                 </TableCell>
//                 <TableCell className="dark:text-gray-300 text-center">
//                   {student.kelas}
//                 </TableCell>
//                 <TableCell className="text-center">
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       nilaiStatusBadgeConfig[student.nilaiStatus].bgColor
//                     } ${
//                       nilaiStatusBadgeConfig[student.nilaiStatus].textColor
//                     } ${
//                       nilaiStatusBadgeConfig[student.nilaiStatus].darkBgColor
//                     } ${
//                       nilaiStatusBadgeConfig[student.nilaiStatus].darkTextColor
//                     }`}
//                   >
//                     {nilaiStatusBadgeConfig[student.nilaiStatus].label}
//                   </span>
//                 </TableCell>
//                 <TableCell className="text-center text-xs text-muted-foreground dark:text-gray-400">
//                   {student.timeAgo}
//                 </TableCell>
//                 <TableCell className="text-center">
//                   <Button
//                     variant="default"
//                     size="sm"
//                     className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white mx-auto dark:from-emerald-600 dark:to-teal-600 dark:hover:from-emerald-700 dark:hover:to-teal-700 border-0 transition-all flex items-center gap-1.5 py-1 rounded-md  text-xs"
//                     onClick={() => onViewDetail(student)}
//                   >
//                     <Eye className="h-3.5 w-3.5" />
//                     <span>Detail</span>
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>
//     </Card>
//   );
// };

// export default KoordinatorNilaiPage;
