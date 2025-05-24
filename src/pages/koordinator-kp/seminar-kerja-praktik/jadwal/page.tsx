import { useState, type FC } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { Search, Edit, History } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import DashboardJadwalCard from "@/components/dosen/seminar-kp/DashboardJadwalCard";
import EditJadwalSeminarModal from "@/components/koordinator-kp/seminar/edit-jadwal-modal";
import APISeminarKP from "@/services/api/koordinator-kp/mahasiswa.service";
import { Toaster } from "react-hot-toast";
import LogJadwalModal from "@/components/koordinator-kp/seminar/log-jadwal-modal";

// Tipe untuk data seminar
interface Mahasiswa {
  nama: string;
  nim: string;
  semester: number;
}

interface JadwalSeminar {
  id: string;
  mahasiswa: Mahasiswa;
  status_kp: "Baru" | "Lanjut";
  ruangan: string;
  jam: string;
  waktu_selesai: string;
  tanggal: string;
  dosen_penguji: string;
  dosen_pembimbing: string;
  instansi: string;
  pembimbing_instansi: string;
  status: "Menunggu" | "Selesai" | "Jadwal_Ulang";
}

interface JadwalResponse {
  total_seminar: number;
  total_seminar_minggu_ini: number;
  total_jadwal_ulang: number;
  jadwal: {
    semua: JadwalSeminar[];
    hari_ini: JadwalSeminar[];
    minggu_ini: JadwalSeminar[];
  };
  tahun_ajaran: {
    id: number;
    nama: string;
  };
}

interface LogEntry {
  id: string;
  action: "create" | "update";
  timestamp: string;
  changes: {
    field: string;
    oldValue?: string;
    newValue?: string;
  }[];
  keterangan?: string;
  id_jadwal?: string;
}

// Komponen Utama
const KoordinatorJadwalSeminarPage: FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedSeminar, setSelectedSeminar] = useState<JadwalSeminar | null>(
    null
  );
  const [selectedSeminarId, setSelectedSeminarId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "semua" | "hari_ini" | "minggu_ini"
  >("semua");
  console.log("Active Tab:", activeTab);

  // Fetch jadwal seminar
  const { data, isLoading, isError, error } = useQuery<JadwalResponse>({
    queryKey: ["koordinator-jadwal-seminar"],
    queryFn: APISeminarKP.getJadwalSeminar,
  });

  // Fetch log jadwal
  const {
    data: logData,
    isLoading: isLogLoading,
    isError: isLogError,
    error: logError,
  } = useQuery({
    queryKey: ["log-jadwal"],
    queryFn: APISeminarKP.getLogJadwal,
  });

  // Ambil data untuk masing-masing tab dari API
  const semuaSeminars: JadwalSeminar[] = data?.jadwal?.semua || [];
  const hariIniSeminars: JadwalSeminar[] = data?.jadwal?.hari_ini || [];
  const mingguIniSeminars: JadwalSeminar[] = data?.jadwal?.minggu_ini || [];

  // Map logJadwal ke LogEntry
  const logs: LogEntry[] = (logData?.logJadwal || [])
    .map((log: any) => {
      const changes: LogEntry["changes"] = [];

      // Tanggal
      if (
        log.tanggal_lama &&
        log.tanggal_baru &&
        log.tanggal_lama !== log.tanggal_baru
      ) {
        changes.push({
          field: "tanggal",
          oldValue: new Date(log.tanggal_lama).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          newValue: new Date(log.tanggal_baru).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        });
      }

      // Ruangan
      if (
        log.ruangan_lama &&
        log.ruangan_baru &&
        log.ruangan_lama !== log.ruangan_baru
      ) {
        changes.push({
          field: "ruangan",
          oldValue: log.ruangan_lama,
          newValue: log.ruangan_baru,
        });
      }

      // Dosen Penguji
      if (
        log.nama_penguji_lama &&
        log.nama_penguji_baru &&
        log.nama_penguji_lama !== log.nama_penguji_baru
      ) {
        changes.push({
          field: "dosen_penguji",
          oldValue: log.nama_penguji_lama,
          newValue: log.nama_penguji_baru,
        });
      } else if (log.nama_penguji_baru) {
        // For CREATE logs or updates with only new examiner
        changes.push({
          field: "dosen_penguji",
          oldValue: undefined,
          newValue: log.nama_penguji_baru,
        });
      }

      return {
        id: log.id,
        action: log.log_type.toLowerCase() as "create" | "update",
        timestamp: log.created_at,
        changes,
        keterangan: log.keterangan,
        id_jadwal: log.id_jadwal,
      };
    })
    .sort(
      (a: LogEntry, b: LogEntry) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  const filteredLogs = selectedSeminarId
    ? logs.filter((log) => log.id_jadwal === selectedSeminarId)
    : logs;

  // Filter berdasarkan pencarian nama mahasiswa untuk setiap tab
  const filteredSemuaSeminars = semuaSeminars.filter((seminar) =>
    seminar.mahasiswa.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHariIniSeminars = hariIniSeminars.filter((seminar) =>
    seminar.mahasiswa.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMingguIniSeminars = mingguIniSeminars.filter((seminar) =>
    seminar.mahasiswa.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (seminar: JadwalSeminar) => {
    setSelectedSeminar(seminar);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSeminar(null);
  };

  const handleSaveSeminar = async (updatedSeminar: JadwalSeminar) => {
    try {
      // Invalidate queries to refetch logs and seminars
      await queryClient.invalidateQueries({ queryKey: ["log-jadwal"] });
      await queryClient.invalidateQueries({
        queryKey: ["koordinator-jadwal-seminar"],
      });
    } catch (error) {
      console.error("Failed to update seminar:", error);
      // Optionally show error toast
    } finally {
      handleCloseModal();
    }
  };

  const handleOpenLogModal = () => {
    setSelectedSeminarId(null);
    setIsLogModalOpen(true);
  };

  const handleCloseLogModal = () => {
    setIsLogModalOpen(false);
    setSelectedSeminarId(null);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-600 dark:text-gray-300">
          Memuat jadwal seminar...
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
      <Toaster position="top-right" />
      <div>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">
              Jadwal Seminar
            </h1>
            <div className="mt-2">
              <span className="mr-2 text-gray-600 dark:text-gray-300">
                Tahun Ajaran
              </span>
              <span className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-900 dark:text-gray-300 px-2 py-1 text-sm font-medium">
                {data?.tahun_ajaran?.nama || "Tidak tersedia"}
              </span>
            </div>
          </div>

          <DashboardJadwalCard />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Tabs
              defaultValue="semua"
              onValueChange={(value) =>
                setActiveTab(value as "semua" | "hari_ini" | "minggu_ini")
              }
              className="w-full"
            >
              <div className="flex flex-col items-start justify-between w-full gap-4 md:flex-row md:items-center">
                <TabsList className="dark:bg-gray-700">
                  <TabsTrigger
                    value="semua"
                    className="dark:data-[state=active]:bg-gray-800"
                  >
                    Semua
                  </TabsTrigger>
                  <TabsTrigger
                    value="hari_ini"
                    className="dark:data-[state=active]:bg-gray-800"
                  >
                    Hari Ini
                  </TabsTrigger>
                  <TabsTrigger
                    value="minggu_ini"
                    className="dark:data-[state=active]:bg-gray-800"
                  >
                    Minggu Ini
                  </TabsTrigger>
                </TabsList>

                <div className="relative flex items-center w-full">
                  <Search className="absolute w-4 h-4 text-gray-400 left-3" />
                  <Input
                    type="text"
                    placeholder="Cari nama mahasiswa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                    onClick={handleOpenLogModal}
                  >
                    <History className="h-4 w-4 mr-1" />
                    Log Jadwal
                  </Button>
                </div>
              </div>

              <TabsContent value="semua" className="mt-4">
                <SeminarTable
                  seminars={filteredSemuaSeminars}
                  onEdit={handleOpenModal}
                />
              </TabsContent>
              <TabsContent value="hari_ini" className="mt-4">
                <SeminarTable
                  seminars={filteredHariIniSeminars}
                  onEdit={handleOpenModal}
                />
              </TabsContent>
              <TabsContent value="minggu_ini" className="mt-4">
                <SeminarTable
                  seminars={filteredMingguIniSeminars}
                  onEdit={handleOpenModal}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <EditJadwalSeminarModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        seminar={selectedSeminar}
        onSave={handleSaveSeminar}
      />
      <LogJadwalModal
        isOpen={isLogModalOpen}
        onClose={handleCloseLogModal}
        seminarId={selectedSeminarId}
        logs={filteredLogs}
        isLoading={isLogLoading}
        isError={isLogError}
        error={logError}
      />
    </DashboardLayout>
  );
};

// Komponen Tabel Seminar
const SeminarTable: FC<{
  seminars: JadwalSeminar[];
  onEdit: (seminar: JadwalSeminar) => void;
}> = ({ seminars, onEdit }) => {
  return (
    <Card className="rounded-none shadow-none dark:bg-gray-900 dark:border-gray-700">
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
              Ruangan
            </TableHead>
            <TableHead className="font-semibold text-center dark:text-gray-200">
              Jam
            </TableHead>
            <TableHead className="font-semibold text-center dark:text-gray-200">
              Tanggal Seminar
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Dosen Pembimbing
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Dosen Penguji
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Status
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {seminars.length === 0 ? (
            <TableRow className="dark:border-gray-700 dark:hover:bg-gray-700">
              <TableCell
                colSpan={9}
                className="text-center py-6 text-muted-foreground dark:text-gray-400"
              >
                Tidak ada data yang ditemukan
              </TableCell>
            </TableRow>
          ) : (
            seminars.map((seminar) => (
              <TableRow
                key={seminar.id}
                className="dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <TableCell className="font-medium dark:text-gray-300 text-xs">
                  {seminar.mahasiswa.nama}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300 text-xs">
                  {seminar.mahasiswa.nim}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300 text-xs">
                  {seminar.ruangan}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300 text-xs">
                  {seminar.jam}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300 text-xs">
                  {seminar.tanggal}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300 text-xs">
                  {seminar.dosen_pembimbing}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300 text-xs">
                  {seminar.dosen_penguji}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300 text-xs">
                  {seminar.status}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="default"
                    size="sm"
                    className="text-white bg-blue-500 hover:bg-blue-600"
                    onClick={() => onEdit(seminar)}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Edit
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

export default KoordinatorJadwalSeminarPage;

// import { useState, type FC, useEffect, useRef } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
// import {
//   Search,
//   Edit,
//   History,
//   Calendar,
//   Clock,
//   MapPin,
//   Users,
//   User,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from "@/components/ui/hover-card";
// import EditJadwalSeminarModal from "@/components/koordinator/seminar/edit-jadwal-modal";
// import APISeminarKP from "@/services/api/koordinator-kp/mahasiswa.service";
// import { Toaster } from "react-hot-toast";
// import LogJadwalModal from "@/components/koordinator/seminar/log-jadwal-modal";
// import DashboardJadwalCard from "@/components/dosen/seminar-kp/DashboardJadwalCard";

// // Interfaces
// interface Mahasiswa {
//   nama: string;
//   nim: string;
//   semester: number;
// }

// interface JadwalSeminar {
//   id: string;
//   mahasiswa: Mahasiswa;
//   status_kp: "Baru" | "Lanjut";
//   ruangan: string;
//   jam: string;
//   waktu_selesai?: string;
//   tanggal: string;
//   dosen_penguji: string;
//   dosen_pembimbing: string;
//   instansi: string;
//   pembimbing_instansi: string;
//   status: "Menunggu" | "Selesai" | "Jadwal_Ulang";
// }

// interface JadwalResponse {
//   total_seminar: number;
//   total_seminar_minggu_ini: number;
//   total_jadwal_ulang: number;
//   jadwal: {
//     semua: JadwalSeminar[];
//     hari_ini: JadwalSeminar[];
//     minggu_ini: JadwalSeminar[];
//     by_ruangan: {
//       semua: Record<string, JadwalSeminar[]>;
//       hari_ini: Record<string, JadwalSeminar[]>;
//       minggu_ini: Record<string, JadwalSeminar[]>;
//     };
//   };
//   tahun_ajaran: {
//     id: number;
//     nama: string;
//   };
// }

// interface LogEntry {
//   id: string;
//   action: "create" | "update";
//   timestamp: string;
//   changes: {
//     field: string;
//     oldValue?: string;
//     newValue?: string;
//   }[];
//   keterangan?: string;
//   id_jadwal?: string;
// }

// // Room data
// const ROOMS = [
//   { id: "FST-301", name: "FST-301" },
//   { id: "FST-302", name: "FST-302" },
//   { id: "FST-303", name: "FST-303" },
//   { id: "FST-304", name: "FST-304" },
//   { id: "FST-305", name: "FST-305" },
//   { id: "FST-306", name: "FST-306" },
//   { id: "FST-307", name: "FST-307" },
//   { id: "FST-308", name: "FST-308" },
// ];

// // Time slots with ranges for "Hari Ini" tab
// const TIME_RANGES = [
//   { start: "07:00", end: "08:00", label: "07:00 - 08:00" },
//   { start: "08:00", end: "09:00", label: "08:00 - 09:00" },
//   { start: "09:00", end: "10:00", label: "09:00 - 10:00" },
//   { start: "10:00", end: "11:00", label: "10:00 - 11:00" },
//   { start: "11:00", end: "12:00", label: "11:00 - 12:00" },
//   { start: "12:00", end: "13:00", label: "12:00 - 13:00" },
//   { start: "13:00", end: "14:00", label: "13:00 - 14:00" },
//   { start: "14:00", end: "15:00", label: "14:00 - 15:00" },
//   { start: "15:00", end: "16:00", label: "15:00 - 16:00" },
//   { start: "16:00", end: "17:00", label: "16:00 - 17:00" },
//   { start: "17:00", end: "18:00", label: "17:00 - 18:00" },
// ];

// // Helper functions
// const getStatusColor = (status: string) => {
//   switch (status) {
//     case "Selesai":
//       return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
//     case "Menunggu":
//       return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
//     case "Jadwal_Ulang":
//       return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
//     default:
//       return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
//   }
// };

// const generateWeekDates = () => {
//   const today = new Date();
//   const currentDay = today.getDay();
//   const startOfWeek = new Date(today);
//   startOfWeek.setDate(today.getDate() - currentDay + 1); // Monday

//   const weekDates = [];
//   for (let i = 0; i < 7; i++) {
//     const date = new Date(startOfWeek);
//     date.setDate(startOfWeek.getDate() + i);
//     weekDates.push(date);
//   }
//   return weekDates;
// };

// const formatDateForDisplay = (date: Date) => {
//   const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
//   const months = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "Mei",
//     "Jun",
//     "Jul",
//     "Ags",
//     "Sep",
//     "Okt",
//     "Nov",
//     "Des",
//   ];

//   return {
//     day: days[date.getDay() === 0 ? 6 : date.getDay() - 1],
//     date: date.getDate(),
//     month: months[date.getMonth()],
//     fullDate: date.toDateString(),
//   };
// };

// const parseDateString = (dateStr: string) => {
//   const months = {
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

//   const parts = dateStr.split(", ")[1]?.split(" ");
//   if (!parts || parts.length < 3) return null;

//   const day = parseInt(parts[0]);
//   const month = months[parts[1] as keyof typeof months];
//   const year = parseInt(parts[2]);

//   return new Date(year, month, day);
// };

// const isTimeInRange = (
//   timeStr: string,
//   rangeStart: string,
//   rangeEnd: string
// ) => {
//   const timeMinutes = timeStr
//     .split(":")
//     .reduce((acc, time) => 60 * acc + +time, 0);
//   const startMinutes = rangeStart
//     .split(":")
//     .reduce((acc, time) => 60 * acc + +time, 0);
//   const endMinutes = rangeEnd
//     .split(":")
//     .reduce((acc, time) => 60 * acc + +time, 0);

//   return timeMinutes >= startMinutes && timeMinutes < endMinutes;
// };

// // All Seminars Grid Component
// const AllSeminarsGrid: FC<{
//   seminars: JadwalSeminar[];
//   searchQuery: string;
//   onEditSeminar: (seminar: JadwalSeminar) => void;
// }> = ({ seminars, searchQuery, onEditSeminar }) => {
//   const filteredSeminars =
//     seminars?.filter(
//       (seminar) =>
//         seminar.mahasiswa.nama
//           .toLowerCase()
//           .includes(searchQuery.toLowerCase()) ||
//         seminar.mahasiswa.nim.includes(searchQuery)
//     ) || [];

//   // Extract unique dates with seminars
//   const seminarDates = filteredSeminars
//     .map((seminar) => {
//       const date = parseDateString(seminar.tanggal);
//       return date ? date.toDateString() : null;
//     })
//     .filter((date): date is string => date !== null);
//   const uniqueDates = [...new Set(seminarDates)];

//   const getSeminarForSlot = (roomId: string, dateStr: string) => {
//     return filteredSeminars.filter((seminar) => {
//       const seminarDate = parseDateString(seminar.tanggal);
//       return (
//         seminarDate &&
//         seminarDate.toDateString() === dateStr &&
//         seminar.ruangan === roomId
//       );
//     });
//   };

//   const getColumnWidth = (dateStr: string) => {
//     let maxWidth = 120; // minimum width for date header

//     ROOMS.forEach((room) => {
//       const seminarsInSlot = getSeminarForSlot(room.id, dateStr);
//       if (seminarsInSlot.length > 0) {
//         // Calculate width needed for the longest name + padding
//         const longestName = seminarsInSlot.reduce(
//           (longest, seminar) =>
//             seminar.mahasiswa.nama.length > longest.length
//               ? seminar.mahasiswa.nama
//               : longest,
//           ""
//         );
//         const estimatedWidth = Math.max(140, longestName.length * 8 + 60); // 8px per char + padding
//         maxWidth = Math.max(maxWidth, estimatedWidth);
//       }
//     });

//     return `${maxWidth}px`;
//   };

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
//       <div className="relative overflow-x-auto">
//         <div
//           className="grid border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 min-w-max sticky top-0 z-10"
//           style={{
//             gridTemplateColumns: `128px ${uniqueDates
//               .map((date) => getColumnWidth(date))
//               .join(" ")}`,
//           }}
//         >
//           <div className="p-3 border-r border-gray-200 dark:border-gray-600 flex items-center justify-center sticky left-0 z-20 bg-gray-50 dark:bg-gray-700">
//             <div className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide text-center">
//               Ruangan
//             </div>
//           </div>
//           {uniqueDates.map((date, index) => {
//             const formattedDate = new Date(date);
//             return (
//               <div
//                 key={index}
//                 className="border-r border-gray-200 dark:border-gray-600 p-3 text-center"
//               >
//                 <div className="text-xs">
//                   <div className="font-semibold text-gray-700 dark:text-gray-200">
//                     {formatDateForDisplay(formattedDate).day}
//                   </div>
//                   <div className="text-gray-500 dark:text-gray-400 mt-1">
//                     {formatDateForDisplay(formattedDate).date}{" "}
//                     {formatDateForDisplay(formattedDate).month}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         <div className="divide-y divide-gray-200 dark:divide-gray-700">
//           {ROOMS.map((room) => (
//             <div
//               key={room.id}
//               className="grid hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-w-max"
//               style={{
//                 gridTemplateColumns: `128px ${uniqueDates
//                   .map((date) => getColumnWidth(date))
//                   .join(" ")}`,
//               }}
//             >
//               <div className="p-3 border-r border-gray-200 dark:border-gray-700 flex items-center justify-center min-h-[80px] sticky left-0 z-10 bg-white dark:bg-gray-800">
//                 <div className="text-sm font-medium text-gray-900 dark:text-gray-100 text-center">
//                   {room.name}
//                 </div>
//               </div>
//               {uniqueDates.map((date, dateIndex) => {
//                 const seminarsInSlot = getSeminarForSlot(room.id, date);
//                 return (
//                   <div
//                     key={dateIndex}
//                     className="p-2 border-r border-gray-200 dark:border-gray-700 min-h-[80px] relative"
//                   >
//                     {seminarsInSlot.length > 0 ? (
//                       <div className="space-y-1">
//                         {seminarsInSlot.map((seminar, seminarIndex) => (
//                           <HoverCard
//                             key={`${seminar.id}-${seminarIndex}`}
//                             openDelay={200}
//                             closeDelay={200}
//                           >
//                             <HoverCardTrigger asChild>
//                               <div
//                                 onClick={() => onEditSeminar(seminar)}
//                                 className={`rounded-lg p-2 cursor-pointer transition-all hover:scale-105 hover:shadow-md border relative ${getStatusColor(
//                                   seminar.status
//                                 )}`}
//                               >
//                                 <div className="flex items-start gap-2">
//                                   <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
//                                     {seminar.mahasiswa.nama
//                                       .charAt(0)
//                                       .toUpperCase()}
//                                   </div>
//                                   <div className="flex-1 min-w-0">
//                                     <div className="text-xs font-medium truncate">
//                                       {seminar.mahasiswa.nama}
//                                     </div>
//                                     <div className="text-xs opacity-75 flex items-center gap-1 mt-1">
//                                       <Clock className="h-2 w-2 flex-shrink-0" />
//                                       <span className="truncate">
//                                         {seminar.jam}
//                                       </span>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </HoverCardTrigger>
//                             <HoverCardContent
//                               side="top"
//                               className="w-80  text-xs rounded-lg shadow-lg z-50 p-3 border-none"
//                             >
//                               <div className="space-y-1">
//                                 <div className="font-semibold">
//                                   {seminar.mahasiswa.nama}
//                                 </div>
//                                 <div>NIM: {seminar.mahasiswa.nim}</div>
//                                 <div>
//                                   Semester: {seminar.mahasiswa.semester}
//                                 </div>
//                                 <div>
//                                   Waktu: {seminar.jam}{" "}
//                                   {seminar.waktu_selesai &&
//                                     `- ${seminar.waktu_selesai}`}
//                                 </div>
//                                 <div>
//                                   Dosen Pembimbing: {seminar.dosen_pembimbing}
//                                 </div>
//                                 <div>
//                                   Dosen Penguji: {seminar.dosen_penguji}
//                                 </div>
//                                 <div>Instansi: {seminar.instansi}</div>
//                                 <div>Status KP: {seminar.status_kp}</div>
//                               </div>
//                             </HoverCardContent>
//                           </HoverCard>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-500">
//                         {/* Empty slot */}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Calendar Grid Component
// const CalendarGrid: FC<{
//   activeTab: "hari_ini" | "minggu_ini";
//   currentWeek: Date[];
//   onNavigateWeek: (direction: "prev" | "next") => void;
//   seminars: Record<string, JadwalSeminar[]>;
//   onEditSeminar: (seminar: JadwalSeminar) => void;
// }> = ({ activeTab, currentWeek, onNavigateWeek, seminars, onEditSeminar }) => {
//   const getSeminarForSlot = (
//     roomId: string,
//     slot: { start: string; end: string } | Date
//   ) => {
//     const roomSeminars = seminars?.[roomId] || [];
//     const today = new Date();

//     if (activeTab === "hari_ini") {
//       const slotStart = (slot as { start: string; end: string }).start;
//       const slotEnd = (slot as { start: string; end: string }).end;
//       return roomSeminars.filter((seminar) => {
//         const seminarDate = parseDateString(seminar.tanggal);
//         return (
//           seminarDate &&
//           seminarDate.toDateString() === today.toDateString() &&
//           isTimeInRange(seminar.jam, slotStart, slotEnd)
//         );
//       });
//     } else {
//       return roomSeminars.filter((seminar) => {
//         const seminarDate = parseDateString(seminar.tanggal);
//         return (
//           seminarDate &&
//           seminarDate.toDateString() === (slot as Date).toDateString()
//         );
//       });
//     }
//   };

//   const getColumnHeaders = () => {
//     if (activeTab === "hari_ini") {
//       return TIME_RANGES;
//     } else {
//       return currentWeek;
//     }
//   };

//   const getGridCols = () => {
//     if (activeTab === "hari_ini") {
//       return "grid-cols-12"; // 1 for room + 11 time ranges
//     } else {
//       return "grid-cols-8"; // 1 for room + 7 days
//     }
//   };

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-none shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
//       {/* Week Navigation - only show for weekly views */}
//       {activeTab !== "hari_ini" && (
//         <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
//           <button
//             onClick={() => onNavigateWeek("prev")}
//             className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
//           >
//             <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
//           </button>
//           <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
//             {currentWeek[0] &&
//               currentWeek[6] &&
//               `${formatDateForDisplay(currentWeek[0]).date} ${
//                 formatDateForDisplay(currentWeek[0]).month
//               } - ${formatDateForDisplay(currentWeek[6]).date} ${
//                 formatDateForDisplay(currentWeek[6]).month
//               }`}
//           </div>
//           <button
//             onClick={() => onNavigateWeek("next")}
//             className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
//           >
//             <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
//           </button>
//         </div>
//       )}

//       <div className="relative overflow-x-auto">
//         {/* Header Row */}
//         <div
//           className={`grid ${getGridCols()} border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 min-w-max sticky top-0 z-10`}
//         >
//           <div className="p-3 border-r border-gray-200 dark:border-gray-600 flex items-center justify-center sticky left-0 z-20 bg-gray-50 dark:bg-gray-700">
//             <div className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide text-center">
//               Ruangan
//             </div>
//           </div>
//           {getColumnHeaders().map((header, index) => (
//             <div
//               key={index}
//               className="border-r border-gray-200 dark:border-gray-600 p-3 text-center"
//             >
//               {header.label ? (
//                 <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">
//                   {header.label}
//                 </div>
//               ) : (
//                 <div className="text-xs">
//                   <div className="font-semibold text-gray-700 dark:text-gray-200 text-center">
//                     {formatDateForDisplay(header as Date).day}
//                   </div>
//                   <div className="text-gray-500 dark:text-gray-400 text-center mt-1">
//                     {formatDateForDisplay(header as Date).date}{" "}
//                     {formatDateForDisplay(header as Date).month}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Room Rows */}
//         <div className="divide-y divide-gray-200 dark:divide-gray-700">
//           {ROOMS.map((room) => (
//             <div
//               key={room.id}
//               className={`grid ${getGridCols()} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-w-max`}
//             >
//               {/* Room Info */}
//               <div className="p-4 border-r border-gray-200 dark:border-gray-700 flex items-center justify-center min-h-[80px] sticky left-0 z-10 bg-white dark:bg-gray-800">
//                 <div className="text-sm font-medium text-gray-900 dark:text-gray-100 text-center">
//                   {room.name}
//                 </div>
//               </div>

//               {/* Time/Day Slots */}
//               {getColumnHeaders().map((slot, slotIndex) => {
//                 const seminarsInSlot = getSeminarForSlot(room.id, slot);

//                 return (
//                   <div
//                     key={slotIndex}
//                     className="p-2 border-r border-gray-200 dark:border-gray-700 min-h-[80px] relative"
//                   >
//                     {seminarsInSlot.length > 0 ? (
//                       <div className="space-y-1 w-full">
//                         {seminarsInSlot.map((seminar, seminarIndex) => (
//                           <HoverCard
//                             key={`${seminar.id}-${seminarIndex}`}
//                             openDelay={200}
//                             closeDelay={200}
//                           >
//                             <HoverCardTrigger asChild>
//                               <div
//                                 onClick={() => onEditSeminar(seminar)}
//                                 className={`w-full rounded-lg p-2 cursor-pointer transition-all hover:scale-105 hover:shadow-md border relative ${getStatusColor(
//                                   seminar.status
//                                 )}`}
//                               >
//                                 <div className="flex items-start gap-2">
//                                   <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
//                                     {seminar.mahasiswa.nama
//                                       .charAt(0)
//                                       .toUpperCase()}
//                                   </div>
//                                   <div className="flex-1 min-w-0">
//                                     <div className="text-xs font-medium truncate">
//                                       {seminar.mahasiswa.nama}
//                                     </div>
//                                     <div className="text-xs opacity-75 flex items-center gap-1 mt-1">
//                                       <Clock className="h-2 w-2 flex-shrink-0" />
//                                       <span className="truncate">
//                                         {seminar.jam}
//                                       </span>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </HoverCardTrigger>
//                             <HoverCardContent
//                               side="top"
//                               className="w-80 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50 p-3 border-none"
//                             >
//                               <div className="space-y-1">
//                                 <div className="font-semibold">
//                                   {seminar.mahasiswa.nama}
//                                 </div>
//                                 <div>NIM: {seminar.mahasiswa.nim}</div>
//                                 <div>
//                                   Semester: {seminar.mahasiswa.semester}
//                                 </div>
//                                 <div>
//                                   Waktu: {seminar.jam}{" "}
//                                   {seminar.waktu_selesai &&
//                                     `- ${seminar.waktu_selesai}`}
//                                 </div>
//                                 <div>
//                                   Dosen Pembimbing: {seminar.dosen_pembimbing}
//                                 </div>
//                                 <div>
//                                   Dosen Penguji: {seminar.dosen_penguji}
//                                 </div>
//                                 <div>Instansi: {seminar.instansi}</div>
//                                 <div>Status KP: {seminar.status_kp}</div>
//                                 <div className="pt-1 border-t border-gray-700 text-gray-300">
//                                   Klik untuk edit jadwal
//                                 </div>
//                               </div>
//                             </HoverCardContent>
//                           </HoverCard>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-500">
//                         {/* Empty slot */}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main Component
// const KoordinatorJadwalSeminarPage: FC = () => {
//   const queryClient = useQueryClient();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLogModalOpen, setIsLogModalOpen] = useState(false);
//   const [selectedSeminar, setSelectedSeminar] = useState<JadwalSeminar | null>(
//     null
//   );
//   const [selectedSeminarId, setSelectedSeminarId] = useState<string | null>(
//     null
//   );
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [activeTab, setActiveTab] = useState<
//     "semua" | "hari_ini" | "minggu_ini"
//   >("semua");
//   const [currentWeek, setCurrentWeek] = useState(generateWeekDates());

//   const { data, isLoading, isError, error } = useQuery<JadwalResponse>({
//     queryKey: ["koordinator-jadwal-seminar"],
//     queryFn: APISeminarKP.getJadwalSeminar,
//   });

//   const {
//     data: logData,
//     isLoading: isLogLoading,
//     isError: isLogError,
//     error: logError,
//   } = useQuery({
//     queryKey: ["log-jadwal"],
//     queryFn: APISeminarKP.getLogJadwal,
//   });

//   const handleOpenModal = (seminar: JadwalSeminar) => {
//     setSelectedSeminar(seminar);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedSeminar(null);
//   };

//   const handleSaveSeminar = async (updatedSeminar: JadwalSeminar) => {
//     try {
//       await queryClient.invalidateQueries({ queryKey: ["log-jadwal"] });
//       await queryClient.invalidateQueries({
//         queryKey: ["koordinator-jadwal-seminar"],
//       });
//     } catch (error) {
//       console.error("Failed to update seminar:", error);
//     } finally {
//       handleCloseModal();
//     }
//   };

//   const handleOpenLogModal = () => {
//     setSelectedSeminarId(null);
//     setIsLogModalOpen(true);
//   };

//   const handleCloseLogModal = () => {
//     setIsLogModalOpen(false);
//     setSelectedSeminarId(null);
//   };

//   const navigateWeek = (direction: "prev" | "next") => {
//     const newWeek = currentWeek.map((date) => {
//       const newDate = new Date(date);
//       newDate.setDate(date.getDate() + (direction === "next" ? 7 : -7));
//       return newDate;
//     });
//     setCurrentWeek(newWeek);
//   };

//   const logs: LogEntry[] = (logData?.logJadwal || [])
//     .map((log: any) => {
//       const changes: LogEntry["changes"] = [];

//       if (
//         log.tanggal_lama &&
//         log.tanggal_baru &&
//         log.tanggal_lama !== log.tanggal_baru
//       ) {
//         changes.push({
//           field: "tanggal",
//           oldValue: new Date(log.tanggal_lama).toLocaleDateString("id-ID", {
//             weekday: "long",
//             day: "numeric",
//             month: "long",
//             year: "numeric",
//           }),
//           newValue: new Date(log.tanggal_baru).toLocaleDateString("id-ID", {
//             weekday: "long",
//             day: "numeric",
//             month: "long",
//             year: "numeric",
//           }),
//         });
//       }

//       if (
//         log.ruangan_lama &&
//         log.ruangan_baru &&
//         log.ruangan_lama !== log.ruangan_baru
//       ) {
//         changes.push({
//           field: "ruangan",
//           oldValue: log.ruangan_lama,
//           newValue: log.ruangan_baru,
//         });
//       }

//       if (
//         log.nama_penguji_lama &&
//         log.nama_penguji_baru &&
//         log.nama_penguji_lama !== log.nama_penguji_baru
//       ) {
//         changes.push({
//           field: "dosen_penguji",
//           oldValue: log.nama_penguji_lama,
//           newValue: log.nama_penguji_baru,
//         });
//       } else if (log.nama_penguji_baru) {
//         changes.push({
//           field: "dosen_penguji",
//           oldValue: undefined,
//           newValue: log.nama_penguji_baru,
//         });
//       }

//       return {
//         id: log.id,
//         action: log.log_type.toLowerCase() as "create" | "update",
//         timestamp: log.created_at,
//         changes,
//         keterangan: log.keterangan,
//         id_jadwal: log.id_jadwal,
//       };
//     })
//     .sort(
//       (a: LogEntry, b: LogEntry) =>
//         new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
//     );

//   const filteredLogs = selectedSeminarId
//     ? logs.filter((log) => log.id_jadwal === selectedSeminarId)
//     : logs;

//   if (isLoading) {
//     return (
//       <DashboardLayout>
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
//             <p className="text-gray-600 dark:text-gray-300">
//               Memuat jadwal seminar...
//             </p>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   if (isError) {
//     return (
//       <DashboardLayout>
//         <div className="text-center text-red-600 dark:text-red-300 p-8">
//           <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 max-w-md mx-auto">
//             <h3 className="font-medium mb-2">Gagal mengambil data</h3>
//             <p className="text-sm">{(error as Error).message}</p>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <Toaster position="top-right" />
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold mb-4 dark:text-white">
//               Jadwal Seminar KP
//             </h1>
//             <div className="mt-2 flex items-center gap-2">
//               <span className="text-gray-600 dark:text-gray-300">
//                 Tahun Ajaran
//               </span>
//               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
//                 {data?.tahun_ajaran?.nama || "Tidak tersedia"}
//               </span>
//             </div>
//           </div>

//           <button
//             onClick={handleOpenLogModal}
//             className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm text-gray-700 dark:text-gray-200"
//           >
//             <History className="h-4 w-4" />
//             Log Jadwal
//           </button>
//         </div>

//         <DashboardJadwalCard />

//         {/* Controls */}
//         <div>
//           <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
//             {/* Tabs */}
//             <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
//               {[
//                 { key: "semua", label: "Semua" },
//                 { key: "hari_ini", label: "Hari Ini" },
//                 { key: "minggu_ini", label: "Minggu Ini" },
//               ].map((tab) => (
//                 <button
//                   key={tab.key}
//                   onClick={() => setActiveTab(tab.key as typeof activeTab)}
//                   className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//                     activeTab === tab.key
//                       ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
//                       : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
//                   }`}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>

//             {/* Search */}
//             <div className="relative w-full lg:w-80">
//               <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
//               <input
//                 type="text"
//                 placeholder="Cari nama mahasiswa atau NIM..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         {activeTab === "semua" ? (
//           <AllSeminarsGrid
//             seminars={data?.jadwal.semua || []}
//             searchQuery={searchQuery}
//             onEditSeminar={handleOpenModal}
//           />
//         ) : (
//           <CalendarGrid
//             activeTab={activeTab}
//             currentWeek={currentWeek}
//             onNavigateWeek={navigateWeek}
//             seminars={data?.jadwal.by_ruangan[activeTab] || {}}
//             onEditSeminar={handleOpenModal}
//           />
//         )}
//       </div>

//       {/* Modals */}
//       <EditJadwalSeminarModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         seminar={selectedSeminar}
//         onSave={handleSaveSeminar}
//       />
//       <LogJadwalModal
//         isOpen={isLogModalOpen}
//         onClose={handleCloseLogModal}
//         seminarId={selectedSeminarId}
//         logs={filteredLogs}
//         isLoading={isLogLoading}
//         isError={isLogError}
//         error={logError}
//       />
//     </DashboardLayout>
//   );
// };

// export default KoordinatorJadwalSeminarPage;
