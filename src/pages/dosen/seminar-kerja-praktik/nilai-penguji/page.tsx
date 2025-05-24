import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import {
  Search,
  Eye,
  Edit,
  FileText,
  Calendar,
  User,
  Building,
  MapPin,
  Clock,
  File,
  CheckCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import APISeminarKP from "@/services/api/dosen/seminar-kp.service";

import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import DashboardCards from "@/components/dosen/seminar-kp/DashboardCard";

interface Student {
  id: string;
  nim: string;
  name: string;
  semester: number;
  judul: string;
  lokasi: string;
  dosenPembimbing: string;
  pembimbingInstansi: string;
  ruangan: string;
  waktu_mulai: string;
  waktu_selesai: string;
  tanggalSeminar: string;
  status: "Dinilai" | "Belum Dinilai";
  tanggalDinilai?: string;
  idNilai?: string;
  penguasaanKeilmuan?: number;
  kemampuanPresentasi?: number;
  kesesuaianUrgensi?: number;
  catatanPenguji?: string;
}

interface Jadwal {
  id: string;
  nim: string;
  nama: string;
  ruangan: string;
  tanggal: string;
  waktu_mulai: string;
  waktu_selesai: string;
  status: "Dinilai" | "Belum Dinilai";
  semester: number;
  dosen_pembimbing: string;
  pembimbing_instansi: string;
  judul_kp: string;
  lokasi_kp: string;
  status_jadwal: string;
  id_nilai: string;
  id_pendaftaran_kp: string;
  penguasaan_keilmuan?: number;
  kemampuan_presentasi?: number;
  kesesuaian_urgensi?: number;
  catatan_penguji?: string;
  waktu_dinilai_penguji?: string;
}

interface ApiResponse {
  statistics: {
    totalMahasiswa: number;
    mahasiswaDinilai: number;
    mahasiswaBelumDinilai: number;
    persentaseDinilai: number;
  };
  jadwalHariIni: Jadwal[];
  semuaJadwal: Jadwal[];
}

const DosenPengujiNilaiPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"belum_dinilai" | "dinilai">(
    "belum_dinilai"
  );
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const navigate = useNavigate();

  const {
    data: apiData,
    isLoading,
    error,
  } = useQuery<ApiResponse>({
    queryKey: ["mahasiswaDiuji"],
    queryFn: APISeminarKP.getDataMahasiswaDiuji,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center dark:text-gray-300">
          <p>Loading data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center dark:text-gray-300">
          <p>Error loading data: {(error as Error).message}</p>
        </div>
      </DashboardLayout>
    );
  }

  const students: Student[] = apiData!.semuaJadwal.map((jadwal) => ({
    id: jadwal.id,
    nim: jadwal.nim,
    name: jadwal.nama,
    semester: jadwal.semester,
    judul: jadwal.judul_kp,
    lokasi: jadwal.lokasi_kp,
    dosenPembimbing: jadwal.dosen_pembimbing,
    pembimbingInstansi: jadwal.pembimbing_instansi,
    ruangan: jadwal.ruangan,
    waktu_mulai: jadwal.waktu_mulai,
    waktu_selesai: jadwal.waktu_selesai,
    tanggalSeminar: jadwal.tanggal,
    status: jadwal.status,
    tanggalDinilai:
      jadwal.status === "Belum Dinilai" || !jadwal.waktu_dinilai_penguji
        ? undefined
        : new Date(jadwal.waktu_dinilai_penguji).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
    idNilai: jadwal.id_nilai,
    penguasaanKeilmuan: jadwal.penguasaan_keilmuan,
    kemampuanPresentasi: jadwal.kemampuan_presentasi,
    kesesuaianUrgensi: jadwal.kesesuaian_urgensi,
    catatanPenguji: jadwal.catatan_penguji,
  }));

  const seminarHariIni: Student[] = apiData!.jadwalHariIni.map((jadwal) => ({
    id: jadwal.id,
    nim: jadwal.nim,
    name: jadwal.nama,
    semester: jadwal.semester,
    judul: jadwal.judul_kp,
    lokasi: jadwal.lokasi_kp,
    dosenPembimbing: jadwal.dosen_pembimbing,
    pembimbingInstansi: jadwal.pembimbing_instansi,
    ruangan: jadwal.ruangan,
    waktu_mulai: jadwal.waktu_mulai,
    waktu_selesai: jadwal.waktu_selesai,
    tanggalSeminar: jadwal.tanggal,
    status: jadwal.status,
    tanggalDinilai:
      jadwal.status === "Belum Dinilai" || !jadwal.waktu_dinilai_penguji
        ? undefined
        : new Date(jadwal.waktu_dinilai_penguji).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
    idNilai: jadwal.id_nilai,
    penguasaanKeilmuan: jadwal.penguasaan_keilmuan,
    kemampuanPresentasi: jadwal.kemampuan_presentasi,
    kesesuaianUrgensi: jadwal.kesesuaian_urgensi,
    catatanPenguji: jadwal.catatan_penguji,
  }));

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "belum_dinilai"
        ? student.status === "Belum Dinilai"
        : student.status === "Dinilai";
    return matchesSearch && matchesTab;
  });

  const handleOpenInputNilaiPage = (student: Student) => {
    setSelectedStudent(student);
    navigate(`/dosen/seminar-kp/nilai-penguji/input-nilai`, {
      state: { student },
    });
  };

  const handleOpenViewNilaiPage = (student: Student) => {
    setSelectedStudent(student);
    navigate(`/dosen/seminar-kp/nilai-penguji/input-nilai`, {
      state: { student },
    });
  };

  const handleOpenDetailModal = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="transition-colors duration-300">
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

          <DashboardCards
            students={students}
            statistics={apiData!.statistics}
          />

          {seminarHariIni.length > 0 && (
            <div className="mt-8 mb-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-extrabold flex items-center dark:text-white">
                  <span className="bg-gradient-to-br from-blue-600 to-violet-600 text-white p-1.5 rounded-lg mr-3">
                    <Calendar className="h-4 w-4" />
                  </span>
                  Seminar Hari Ini
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {seminarHariIni.map((seminar) => (
                  <div
                    key={seminar.id}
                    className="group rounded-2xl bg-gray-50 hover:bg-white dark:bg-gray-800/40 dark:hover:bg-gray-800/70 overflow-hidden border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <Badge className="px-2.5 py-0.5 bg-blue-100/80 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 rounded-full text-xs font-medium">
                          {seminar.ruangan}
                        </Badge>
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {seminar.waktu_mulai} - {seminar.waktu_selesai}
                        </div>
                      </div>

                      <h3 className="font-bold text-base mb-1 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors">
                        {seminar.name}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {seminar.nim}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700/50">
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3.5 w-3.5 mr-1.5" />
                          {seminar.tanggalSeminar}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Tabs
              defaultValue="belum_dinilai"
              onValueChange={(value) =>
                setActiveTab(value as "belum_dinilai" | "dinilai")
              }
              className="w-full"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
                <TabsList className="dark:bg-gray-700">
                  <TabsTrigger
                    value="belum_dinilai"
                    className="dark:data-[state=active]:bg-gray-800"
                  >
                    Belum Dinilai
                  </TabsTrigger>
                  <TabsTrigger
                    value="dinilai"
                    className="dark:data-[state=active]:bg-gray-800"
                  >
                    Dinilai
                  </TabsTrigger>
                </TabsList>

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

              <TabsContent value="belum_dinilai" className="mt-4">
                <StudentTable
                  students={filteredStudents}
                  onViewDetail={handleOpenDetailModal}
                  onInputNilai={handleOpenInputNilaiPage}
                  onViewNilai={handleOpenViewNilaiPage}
                />
              </TabsContent>
              <TabsContent value="dinilai" className="mt-4">
                <StudentTable
                  students={filteredStudents}
                  onViewDetail={handleOpenDetailModal}
                  onInputNilai={handleOpenInputNilaiPage}
                  onViewNilai={handleOpenViewNilaiPage}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="sm:max-w-[750px] p-0 dark:bg-gray-900 dark:border-gray-700 rounded-xl overflow-hidden">
            {selectedStudent && (
              <>
                {/* Header with Gradient */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-2 w-12 h-12 flex items-center justify-center shadow-sm">
                        <User className="text-blue-600 dark:text-blue-400 w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-white">
                          {selectedStudent.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="bg-white/90 dark:bg-gray-800/90 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full shadow-sm">
                            Semester {selectedStudent.semester}
                          </span>
                          <span className="bg-blue-600/40 dark:bg-blue-700/40 text-white px-2 py-0.5 rounded-full">
                            {selectedStudent.nim}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="p-5 max-h-[50vh] overflow-y-auto space-y-5">
                  {/* Kerja Praktik */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 transition-all duration-300">
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <File className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      Kerja Praktik
                    </h3>
                    <div className="flex flex-col gap-2">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Judul
                        </p>
                        <p className="text-sm font-medium dark:text-gray-200">
                          {selectedStudent.judul}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Lokasi
                        </p>
                        <p className="text-sm font-medium dark:text-gray-200 flex items-center gap-1">
                          <Building className="w-4 h-4 text-gray-400" />
                          {selectedStudent.lokasi}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Jadwal Seminar */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 transition-all duration-300">
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      Jadwal Seminar
                    </h3>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Tanggal
                        </p>
                        <p className="text-sm font-medium dark:text-gray-200">
                          {selectedStudent.tanggalSeminar}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Jam
                        </p>
                        <p className="text-sm font-medium dark:text-gray-200 flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {selectedStudent.waktu_mulai} -{" "}
                          {selectedStudent.waktu_selesai}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Ruangan
                        </p>
                        <p className="text-sm font-medium dark:text-gray-200 flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {selectedStudent.ruangan}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pembimbing */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 transition-all duration-300">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Dosen Pembimbing
                        </p>
                        <p className="text-sm font-medium dark:text-gray-200">
                          {selectedStudent.dosenPembimbing}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Pembimbing Instansi
                        </p>
                        <p className="text-sm font-medium dark:text-gray-200">
                          {selectedStudent.pembimbingInstansi}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Penilaian */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 transition-all duration-300">
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      Status Penilaian
                    </h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Status
                        </p>
                        <Badge
                          className={`mt-1 ${
                            statusBadgeConfig[selectedStudent.status].bgColor
                          } ${
                            statusBadgeConfig[selectedStudent.status].textColor
                          } ${
                            statusBadgeConfig[selectedStudent.status]
                              .darkBgColor
                          } ${
                            statusBadgeConfig[selectedStudent.status]
                              .darkTextColor
                          }`}
                        >
                          {statusBadgeConfig[selectedStudent.status].label}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Tanggal Dinilai
                        </p>
                        <p className="text-sm font-medium dark:text-gray-200">
                          {selectedStudent.tanggalDinilai &&
                          selectedStudent.tanggalDinilai !== ""
                            ? selectedStudent.tanggalDinilai
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer with Close Button */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 transition-all duration-300"
                    >
                      Tutup
                    </Button>
                  </DialogClose>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

const statusBadgeConfig = {
  "Belum Dinilai": {
    label: "Belum Dinilai",
    bgColor: "bg-amber-100/70",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    darkBgColor: "dark:bg-amber-900/30",
    darkTextColor: "dark:text-amber-300",
    darkBorderColor: "dark:border-amber-800",
  },
  Dinilai: {
    label: "Dinilai",
    bgColor: "bg-emerald-100/70",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    darkBgColor: "dark:bg-emerald-900/30",
    darkTextColor: "dark:text-emerald-300",
    darkBorderColor: "dark:border-emerald-800",
  },
};

const StudentTable: FC<{
  students: Student[];
  onViewDetail: (student: Student) => void;
  onInputNilai: (student: Student) => void;
  onViewNilai: (student: Student) => void;
}> = ({ students, onViewDetail, onInputNilai, onViewNilai }) => {
  return (
    <Card className="shadow-none rounded-none dark:bg-gray-900 dark:border-gray-700">
      <Table>
        <TableHeader className="bg-gray-200 dark:bg-gray-700">
          <TableRow className="hover:bg-gray-300 dark:hover:bg-gray-600">
            <TableHead className="font-semibold dark:text-gray-200">
              Nama Mahasiswa
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              NIM
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Tanggal Seminar
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Jam
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Ruangan
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
            students.map((student) => (
              <TableRow
                key={student.id}
                className="dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <TableCell className="dark:text-gray-300 font-medium text-xs">
                  {student.name}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300 text-xs">
                  {student.nim}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300 text-xs">
                  {student.tanggalSeminar}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300 text-xs">
                  {student.waktu_mulai} - {student.waktu_selesai}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300 text-xs">
                  {student.ruangan}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statusBadgeConfig[student.status].bgColor
                    } ${statusBadgeConfig[student.status].textColor} ${
                      statusBadgeConfig[student.status].borderColor
                    } ${statusBadgeConfig[student.status].darkBgColor} ${
                      statusBadgeConfig[student.status].darkTextColor
                    } ${statusBadgeConfig[student.status].darkBorderColor}`}
                  >
                    {statusBadgeConfig[student.status].label}
                  </span>
                </TableCell>
                <TableCell className="text-center dark:text-gray-300 text-xs">
                  {student.tanggalDinilai && student.tanggalDinilai !== ""
                    ? student.tanggalDinilai
                    : "-"}
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
                    {student.status === "Belum Dinilai" ? (
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white dark:from-blue-600 dark:to-indigo-600 dark:hover:from-blue-700 dark:hover:to-indigo-700 border-0 transition-all flex items-center gap-1.5 py-1 rounded-md text-xs"
                        onClick={() => onInputNilai(student)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Nilai</span>
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white dark:from-purple-600 dark:to-fuchsia-600 dark:hover:from-purple-700 dark:hover:to-fuchsia-700 border-0 transition-all flex items-center gap-1.5 py-1 rounded-md text-xs"
                        onClick={() => onViewNilai(student)}
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Edit Nilai</span>
                      </Button>
                    )}
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
