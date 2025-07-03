import { useState, useEffect, type FC } from "react";
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
  GraduationCapIcon,
  ChevronRight,
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

// Type definitions
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
  waktu_dinilai?: string;
  catatan_penguji?: string;
}

interface TahunAjaran {
  id: number;
  nama: string;
}

interface ApiResponse {
  tahun_ajaran: TahunAjaran;
  statistics: {
    totalMahasiswa: number;
    mahasiswaDinilai: number;
    mahasiswaBelumDinilai: number;
    persentaseDinilai: number;
  };
  jadwalHariIni: Jadwal[];
  semuaJadwal: Jadwal[];
}

const ConvertToStringDateFormat = (dateStr: string) => {
  const date = new Date(dateStr);
  // Opsi untuk Intl.DateTimeFormat
  const options: any = {
    weekday: "long", // "Jumat"
    day: "numeric", // "13"
    month: "long", // "Juni"
    year: "numeric", // "2025"
  };

  // Membuat formatter untuk lokal "id-ID" (Indonesia)
  const formatter = new Intl.DateTimeFormat("id-ID", options);

  // Menggunakan formatter untuk mengubah tanggal dan mengganti "pukul" jika ada
  return formatter
    .format(date)
    .replace(/pukul.*/, "")
    .trim();
};

const ConvertToStringTimeFormat = (dateTimeStr: string) => {
  if (!dateTimeStr.includes("T")) return dateTimeStr;
  const dateTime = new Date(dateTimeStr);
  return dateTime
    ? dateTime
        .toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Jakarta",
        })
        .replace(".", ":")
    : "Waktu belum ditentukan";
};

const SkeletonDashboardCards: FC = () => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse"
      aria-busy="true"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 border-none shadow-md rounded-lg p-4"
        >
          <div className="flex justify-between items-center mb-2">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
          </div>
          <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );
};

// const SkeletonSeminarHariIni: FC = () => {
//   return (
//     <div className="pt-2 pb-3 animate-pulse" aria-busy="true">
//       <div className="mb-2.5 flex items-center">
//         <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {Array.from({ length: 3 }).map((_, index) => (
//           <div
//             key={index}
//             className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
//           >
//             <div className="flex justify-between items-start mb-3">
//               <div className="flex items-center gap-2">
//                 <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
//                 <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
//               </div>
//               <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
//             </div>
//             <div className="space-y-2 mb-4">
//               <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
//               <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
//             </div>
//             <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
//               <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
//               <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

const SkeletonFilter: FC = () => {
  return (
    <div
      className="flex flex-col md:flex-row justify-between items-center gap-4 animate-pulse"
      aria-busy="true"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 w-full">
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-md" />
          <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-md" />
        </div>
        <div className="flex items-center w-full relative">
          <div className="h-9 w-full bg-gray-200 dark:bg-gray-700 rounded-md" />
        </div>
      </div>
    </div>
  );
};

const SkeletonTable: FC = () => {
  return (
    <div
      className="shadow-none rounded-none dark:bg-gray-900 dark:border-gray-700 border border-gray-200 animate-pulse"
      aria-busy="true"
    >
      <Table>
        <TableHeader className="bg-gray-200 dark:bg-gray-700">
          <TableRow className="hover:bg-gray-300 dark:hover:bg-gray-600">
            <TableHead className="text-center w-12">
              <div className="h-4 w-8 bg-gray-300 dark:bg-gray-600 rounded mx-auto" />
            </TableHead>
            <TableHead className="text-center">
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded mx-auto" />
            </TableHead>
            <TableHead className="text-center">
              <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded mx-auto" />
            </TableHead>
            <TableHead className="text-center">
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded mx-auto" />
            </TableHead>
            <TableHead className="text-center">
              <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded mx-auto" />
            </TableHead>
            <TableHead className="text-center">
              <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded mx-auto" />
            </TableHead>
            <TableHead className="text-center">
              <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded mx-auto" />
            </TableHead>
            <TableHead className="text-center">
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded mx-auto" />
            </TableHead>
            <TableHead className="text-center">
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded mx-auto" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow
              key={index}
              className="dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <TableCell className="text-center">
                <div className="h-4 w-8 bg-gray-200 dark:bg-gray-600 rounded mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-600 rounded mx-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const DosenPengujiNilaiPage: FC = () => {
  const [selectedTahunAjaranId, setSelectedTahunAjaranId] = useState<
    number | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"belum_dinilai" | "dinilai">(
    "belum_dinilai"
  );
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch daftar tahun ajaran
  const {
    data: tahunAjaranData,
    isLoading: isTahunAjaranLoading,
    isError: isTahunAjaranError,
    error: tahunAjaranError,
  } = useQuery<TahunAjaran[]>({
    queryKey: ["tahun-ajaran"],
    queryFn: APISeminarKP.getTahunAjaran,
  });

  // Fetch data mahasiswa berdasarkan tahun ajaran yang dipilih
  const {
    data: apiData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ApiResponse>({
    queryKey: ["mahasiswaDiuji", selectedTahunAjaranId],
    queryFn: () => {
      console.log("Fetching data for tahunAjaranId:", selectedTahunAjaranId);
      return APISeminarKP.getDataMahasiswaDiuji(selectedTahunAjaranId);
    },
    enabled: selectedTahunAjaranId !== undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (apiData) {
      console.log("Received apiData:", apiData);
    }
  }, [apiData]);

  useEffect(() => {
    if (selectedTahunAjaranId !== undefined) {
      refetch();
    }
  }, [selectedTahunAjaranId, refetch]);

  // Set tahun ajaran default ke yang pertama dari API saat data tersedia
  useEffect(() => {
    if (
      tahunAjaranData &&
      tahunAjaranData.length > 0 &&
      selectedTahunAjaranId === undefined
    ) {
      setSelectedTahunAjaranId(tahunAjaranData[0].id);
    }
  }, [tahunAjaranData, selectedTahunAjaranId]);

  // Early returns for error and loading states
  if (isTahunAjaranError) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center dark:text-gray-300">
          <p>
            Error loading academic years: {(tahunAjaranError as Error).message}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading || isTahunAjaranLoading) {
    return (
      <DashboardLayout>
        <div className="flex">
          <span className="bg-white flex justify-center items-center shadow-sm text-gray-800 dark:text-gray-200 dark:bg-gray-900 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 text-md font-medium tracking-tight">
            <span
              className={`inline-block animate-pulse w-3 h-3 rounded-full mr-2 bg-yellow-400`}
            />
            <GraduationCapIcon className="w-4 h-4 mr-1.5" />
            Mahasiswa Uji Kerja Praktik
          </span>
        </div>
        <div className="mt-3.5 space-y-4">
          <SkeletonDashboardCards />
          {/* <SkeletonSeminarHariIni /> */}
          <SkeletonFilter />
          <SkeletonTable />
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center dark:text-gray-300">
          <p>Error loading data: {(error as Error).message}</p>
        </div>
      </DashboardLayout>
    );
  }

  // If apiData is undefined (e.g., query hasn't run yet), return a loading state
  if (!apiData) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <SkeletonDashboardCards />
          {/* <SkeletonSeminarHariIni /> */}
          <SkeletonFilter />
          <SkeletonTable />
        </div>
      </DashboardLayout>
    );
  }

  // Now it's safe to map apiData.semuaJadwal and apiData.jadwalHariIni
  const students: Student[] = (apiData.semuaJadwal || []).map((jadwal) => ({
    id: jadwal.id,
    nim: jadwal.nim,
    name: jadwal.nama,
    semester: jadwal.semester,
    judul: jadwal.judul_kp,
    lokasi: jadwal.lokasi_kp,
    dosenPembimbing: jadwal.dosen_pembimbing,
    pembimbingInstansi: jadwal.pembimbing_instansi,
    ruangan: jadwal.ruangan,
    waktu_mulai: ConvertToStringTimeFormat(jadwal.waktu_mulai),
    waktu_selesai: ConvertToStringTimeFormat(jadwal.waktu_selesai),
    tanggalSeminar: ConvertToStringDateFormat(jadwal.tanggal),
    status: jadwal.status,
    tanggalDinilai:
      jadwal.status === "Belum Dinilai" || !jadwal.waktu_dinilai
        ? undefined
        : new Date(jadwal.waktu_dinilai).toLocaleDateString("id-ID", {
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

  const seminarHariIni: Student[] = (apiData.jadwalHariIni || []).map(
    (jadwal) => ({
      id: jadwal.id,
      nim: jadwal.nim,
      name: jadwal.nama,
      semester: jadwal.semester,
      judul: jadwal.judul_kp,
      lokasi: jadwal.lokasi_kp,
      dosenPembimbing: jadwal.dosen_pembimbing,
      pembimbingInstansi: jadwal.pembimbing_instansi,
      ruangan: jadwal.ruangan,
      waktu_mulai: ConvertToStringTimeFormat(jadwal.waktu_mulai),
      waktu_selesai: ConvertToStringTimeFormat(jadwal.waktu_selesai),
      tanggalSeminar: ConvertToStringDateFormat(jadwal.tanggal),
      status: jadwal.status,
      tanggalDinilai:
        jadwal.status === "Belum Dinilai" || !jadwal.waktu_dinilai
          ? undefined
          : new Date(jadwal.waktu_dinilai).toLocaleDateString("id-ID", {
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
    })
  );

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nim.toLowerCase().includes(searchQuery.toLowerCase());
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
        <div className="space-y-4">
          <div className="flex justify-between mb-4">
            <div className="flex">
              <span className="bg-white flex justify-center items-center shadow-sm text-gray-800 dark:text-gray-200 dark:bg-gray-900 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 text-md font-medium tracking-tight">
                <span
                  className={`inline-block animate-pulse w-3 h-3 rounded-full mr-2 bg-yellow-400`}
                />
                <GraduationCapIcon className="w-4 h-4 mr-1.5" />
                Mahasiswa Uji Kerja Praktik
              </span>
            </div>
            {/* Academic Year Selector */}
            <div className="flex items-center gap-2 dark:text-gray-200">
              <div className="relative">
                <select
                  className="px-3 py-1 pr-8 text-sm bg-white border focus:outline-none active:outline-none rounded-lg shadow-sm appearance-none dark:bg-gray-800 dark:border-gray-700 focus:ring-0 active:ring-0 disabled:opacity-50"
                  value={selectedTahunAjaranId ?? ""}
                  onChange={(e) =>
                    setSelectedTahunAjaranId(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  disabled={isTahunAjaranLoading || !tahunAjaranData}
                >
                  {isTahunAjaranLoading ? (
                    <option value="">Memuat tahun ajaran...</option>
                  ) : tahunAjaranData && tahunAjaranData.length > 0 ? (
                    tahunAjaranData.map((year) => (
                      <option key={year.id} value={year.id}>
                        {year.nama}
                      </option>
                    ))
                  ) : (
                    <option value="">Tidak ada tahun ajaran tersedia</option>
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronRight className="w-4 h-4 text-gray-500 rotate-90" />
                </div>
              </div>
            </div>
          </div>

          <DashboardCards students={students} statistics={apiData.statistics} />

          {seminarHariIni.length > 0 && (
            <div className="pt-2 pb-3">
              <div className="mb-2.5 flex items-center">
                <div className="text-xl tracking-tight font-semibold flex items-center dark:text-white">
                  <span className="bg-gradient-to-br from-blue-600 to-violet-600 text-white p-1.5 rounded-lg mr-2">
                    <Calendar className="h-4 w-4" />
                  </span>
                  Seminar Terdekat
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {seminarHariIni.map((seminar) => (
                  <div
                    key={seminar.id}
                    className="group relative rounded-xl bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10 dark:bg-gray-900/60 dark:hover:bg-gray-900/80 overflow-hidden border border-gray-200/60 dark:border-gray-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer backdrop-blur-sm"
                    onClick={() => handleOpenInputNilaiPage(seminar)}
                  >
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative p-4">
                      {/* Header with badges and time */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className="px-2 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-900/60 rounded-md text-xs font-medium border-0 shadow-sm">
                            {seminar.ruangan}
                          </Badge>
                          <Badge className="px-2 py-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60 rounded-md text-xs font-medium border-0 shadow-sm">
                            {seminar.status}
                          </Badge>
                        </div>
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100/80 dark:bg-gray-800/60 px-2 py-1 rounded-md">
                          {seminar.waktu_mulai} - {seminar.waktu_selesai}
                        </div>
                      </div>

                      {/* Main content */}
                      <div className="space-y-2 mb-4">
                        <h3 className="font-semibold text-sm leading-tight group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                          {seminar.name}
                        </h3>

                        <p className="text-xs text-gray-600 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-800/40 px-2 py-1 rounded inline-block">
                          {seminar.nim}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200/60 dark:border-gray-700/40">
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3 w-3 mr-1.5 text-blue-500" />
                          <span className="font-medium">
                            {seminar.tanggalSeminar}
                          </span>
                        </div>

                        {/* Hover indicator */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 font-medium">
                            <span>Lihat Detail</span>
                            <svg
                              className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subtle left border accent */}
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 w-full">
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
                    placeholder="Cari mahasiswa berdasarkan nama atau NIM..."
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
            <TableHead className="text-center max-w-9 font-semibold dark:text-gray-200">
              No.
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
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
            students.map((student, index) => (
              <TableRow
                key={student.id}
                className="dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <TableCell className="text-center dark:text-gray-300 text-xs">
                  {index + 1}.
                </TableCell>
                <TableCell className="text-center dark:text-gray-300 font-medium text-xs">
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
