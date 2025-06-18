import { type FC, useEffect, useState, useRef } from "react";
import {
  Search,
  History,
  Calendar,
  Clock,
  Building,
  GraduationCap,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import ScheduleTableContent from "./ScheduleTableContent";
import DashboardJadwalCard from "@/components/dosen/seminar-kp/DashboardJadwalCard";

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
  waktu_mulai: string;
  waktu_selesai: string;
  tanggal: string;
  dosen_penguji: string;
  dosen_pembimbing: string;
  instansi: string;
  pembimbing_instansi: string;
  status: "Menunggu" | "Selesai" | "Jadwal_Ulang";
  durasi?: number;
  jam?: string;
  jam_selesai?: string;
}

interface TahunAjaran {
  id: number;
  nama: string;
}

interface JadwalResponse {
  total_seminar: number;
  total_seminar_minggu_ini: number;
  total_jadwal_ulang: number;
  jadwal: {
    semua: JadwalSeminar[];
    hari_ini: JadwalSeminar[];
    minggu_ini: JadwalSeminar[];
    by_ruangan: {
      semua: { [key: string]: JadwalSeminar[] };
      hari_ini: { [key: string]: JadwalSeminar[] };
      minggu_ini: { [key: string]: JadwalSeminar[] };
    };
  };
  tahun_ajaran: TahunAjaran;
}

const ConvertToStringDateFormat = (dateStr: string) => {
  const date = new Date(dateStr);
  // Opsi untuk Intl.DateTimeFormat
  const options: any = {
    weekday: 'long', // "Jumat"
    day: 'numeric',  // "13"
    month: 'long',   // "Juni"
    year: 'numeric'  // "2025"
  };

  // Membuat formatter untuk lokal "id-ID" (Indonesia)
  const formatter = new Intl.DateTimeFormat('id-ID', options);

  // Menggunakan formatter untuk mengubah tanggal dan mengganti "pukul" jika ada
  return formatter.format(date).replace(/pukul.*/, '').trim();
}

const ConvertToStringTimeFormat = (dateTimeStr: string) => {
  const dateTime = new Date(dateTimeStr);
  return dateTime
    ? dateTime.toLocaleTimeString(
        "id-ID",
        {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Jakarta",
        }
      ).replace(".", ":")
    : "Waktu belum ditentukan";
}

const ScheduleTable: FC<{
  data: JadwalResponse["jadwal"];
  onEdit: (seminar: JadwalSeminar) => void;
  selectedTahunAjaranId: number | null;
  setSelectedTahunAjaranId: (id: number | null) => void;
  tahunAjaranData: TahunAjaran[] | undefined;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: "semua" | "hari_ini" | "minggu_ini";
  setActiveTab: (tab: "semua" | "hari_ini" | "minggu_ini") => void;
  handleOpenLogModal: () => void;
  hoveredItem: JadwalSeminar | null;
  setHoveredItem: (item: JadwalSeminar | null) => void;
  hoverPosition: { x: number; y: number };
  setHoverPosition: (position: { x: number; y: number }) => void;
}> = ({
  data,
  onEdit,
  selectedTahunAjaranId,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  handleOpenLogModal,
  hoveredItem,
  setHoveredItem,
  hoverPosition,
  setHoverPosition,
}) => {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const rooms = ["FST-301", "FST-302", "FST-303", "FST-304", "FST-305"];
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  // Calculate flexible tooltip position
  useEffect(() => {
    if (hoveredItem && tooltipRef.current) {
      const tooltip = tooltipRef.current;
      const tooltipRect = tooltip.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x = hoverPosition.x;
      let y = hoverPosition.y;

      // Horizontal positioning
      if (x + tooltipRect.width > viewportWidth - 20) {
        // Tooltip would go off-screen to the right, position it to the left
        x = hoverPosition.x - tooltipRect.width - 20;
      }

      // If still off-screen to the left, center it horizontally
      if (x < 20) {
        x = Math.max(20, (viewportWidth - tooltipRect.width) / 2);
      }

      // Vertical positioning
      if (y + tooltipRect.height > viewportHeight - 20) {
        // Tooltip would go off-screen at the bottom, position it above
        y = hoverPosition.y - tooltipRect.height - 10;
      }

      // If still off-screen at the top, position at a safe spot
      if (y < 20) {
        y = Math.min(20, viewportHeight - tooltipRect.height - 20);
      }

      setTooltipPosition({ x, y });
    }
  }, [hoveredItem, hoverPosition]);

  // Add duration to seminars
  const currentData = Object.keys(data.by_ruangan[activeTab] || {}).reduce(
    (acc, room) => ({
      ...acc,
      [room]: (data.by_ruangan[activeTab][room] || []).map((item) => {
        const [startHour, startMinute] = ConvertToStringTimeFormat(item.waktu_mulai)
          .split(":")
          .map(Number);
        const [endHour, endMinute] = ConvertToStringTimeFormat(item.waktu_selesai).split(":").map(Number);
        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;
        return {
          ...item,
          jam: ConvertToStringTimeFormat(item.waktu_mulai),
          jam_selesai: ConvertToStringTimeFormat(item.waktu_selesai),
          durasi: endMinutes - startMinutes,
        };
      }),
    }),
    {} as { [key: string]: JadwalSeminar[] }
  );

  // Get days with schedules for "semua" tab
  const getDaysWithSchedules = () => {
    if (activeTab !== "semua") return [];
    const daysSet = new Set<string>();
    Object.values(currentData).forEach((roomSchedules: JadwalSeminar[]) => {
      roomSchedules.forEach((schedule: JadwalSeminar) =>
        daysSet.add(ConvertToStringDateFormat(schedule.tanggal))
      );
    });
    const daysArray = Array.from(daysSet);
    const parseDate = (dateStr: string) => {
      const months: { [key: string]: number } = {
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
      const parts = dateStr.split(" ");
      const day = Number.parseInt(parts[1]);
      const month = months[parts[2]] ?? 0;
      const year = Number.parseInt(parts[3]);
      return new Date(year, month, day);
    };
    return daysArray.sort(
      (a, b) => parseDate(a).getTime() - parseDate(b).getTime()
    );
  };

  const getHeaderSlots = () => {
    switch (activeTab) {
      case "hari_ini":
        return timeSlots;
      case "minggu_ini":
        return ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
      case "semua":
        return getDaysWithSchedules();
      default:
        return timeSlots;
    }
  };

  const headerSlots = getHeaderSlots();
  const roomColumnWidth = 90;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selesai":
        return "bg-green-100 text-green-800 border-green-200";
      case "Menunggu":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Jadwal_Ulang":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-400 text-gray-200 border-gray-500";
    }
  };

  const getRowHeight = (room: string) => {
    const schedules = currentData[room] || [];
    if (activeTab === "hari_ini") return 220;
    if (schedules.length === 0) return 80;
    if (activeTab === "semua") {
      const schedulesPerDate: { [key: string]: number } = {};
      schedules.forEach((schedule: JadwalSeminar) => {
        schedulesPerDate[ConvertToStringDateFormat(schedule.tanggal)] =
          (schedulesPerDate[ConvertToStringDateFormat(schedule.tanggal)] || 0) + 1;
      });
      const maxSchedules = Math.max(...Object.values(schedulesPerDate), 0);
      return maxSchedules === 0 ? 80 : 120;
    }
    return 220;
  };

  const handleMouseEnter = (item: JadwalSeminar, event: React.MouseEvent) => {
    setHoveredItem(item);
    const rect = event.currentTarget.getBoundingClientRect();
    setHoverPosition({
      x: rect.right + 10,
      y: rect.top,
    });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const formatHeaderDate = (dateStr: string) => {
    if (activeTab !== "semua") return dateStr;
    const parts = dateStr.split(" ");
    return `${parts[1]} ${parts[2]}`;
  };

  const getSchedulesByDate = (
    roomSchedules: JadwalSeminar[],
    targetDate: string
  ) => {
    return roomSchedules.filter(
      (schedule: JadwalSeminar) => ConvertToStringDateFormat(schedule.tanggal) === targetDate
    );
  };

  const getSchedulesByDay = (
    roomSchedules: JadwalSeminar[],
    targetDay: string
  ) => {
    if (activeTab !== "minggu_ini") return [];
    const dayMapping: { [key: string]: string } = {
      Senin: "Senin",
      Selasa: "Selasa",
      Rabu: "Rabu",
      Kamis: "Kamis",
      Jumat: "Jumat",
    };
    return roomSchedules.filter(
      (schedule: JadwalSeminar) =>
        ConvertToStringDateFormat(schedule.tanggal).split(",")[0] === dayMapping[targetDay]
    );
  };

  const getSchedulesByTime = (
    roomSchedules: JadwalSeminar[],
    targetTime: string
  ) => {
    if (activeTab !== "hari_ini") return [];
    return roomSchedules.filter((schedule: JadwalSeminar) => {
      const scheduleHour = Number.parseInt(ConvertToStringTimeFormat(schedule.waktu_mulai).split(":")[0]);
      const targetHour = Number.parseInt(targetTime.split(":")[0]);
      return scheduleHour === targetHour;
    });
  };

  const sortSchedulesByTime = (schedules: JadwalSeminar[]) => {
    return schedules.sort((a: JadwalSeminar, b: JadwalSeminar) => {
      const [aHour, aMinute] = ConvertToStringTimeFormat(a.waktu_mulai).split(":").map(Number);
      const [bHour, bMinute] = ConvertToStringTimeFormat(b.waktu_mulai).split(":").map(Number);
      const aMinutes = aHour * 60 + aMinute;
      const bMinutes = bHour * 60 + bMinute;
      return aMinutes - bMinutes;
    });
  };

  const isToday = (dateStr: string) => {
    const today = new Date(); // Current date: May 28, 2025
    const months: { [key: string]: number } = {
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
    const parts = dateStr.split(" ");
    const day = Number.parseInt(parts[1]);
    const month = months[parts[2]] ?? 0;
    const year = Number.parseInt(parts[3]);
    const scheduleDate = new Date(year, month, day);
    return (
      scheduleDate.getDate() === today.getDate() &&
      scheduleDate.getMonth() === today.getMonth() &&
      scheduleDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div>
      <div>
        {/* Header */}
        <div className="mb-6">
          <DashboardJadwalCard selectedTahunAjaranId={selectedTahunAjaranId} />

          {/* Filter and Search */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-4">
            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as "semua" | "hari_ini" | "minggu_ini")
              }
              className="w-full"
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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
                <div className="relative flex items-center w-full md:w-auto">
                  <Search className="absolute w-4 h-4 text-gray-400 left-3" />
                  <Input
                    type="text"
                    placeholder="Cari nama mahasiswa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-64 pl-10 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
                  />
                  <button
                    className="ml-2 rounded-sm flex dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 py-[10px] text-white text-xs px-5 transition-colors"
                    onClick={handleOpenLogModal}
                  >
                    <History className="h-4 w-4 mr-2" />
                    Log Jadwal
                  </button>
                </div>
              </div>

              <TabsContent value="semua" className="mt-4">
                <ScheduleTableContent
                  rooms={rooms}
                  headerSlots={headerSlots}
                  currentData={currentData}
                  activeTab={activeTab}
                  getRowHeight={getRowHeight}
                  roomColumnWidth={roomColumnWidth}
                  getStatusColor={getStatusColor}
                  handleMouseEnter={handleMouseEnter}
                  handleMouseLeave={handleMouseLeave}
                  formatHeaderDate={formatHeaderDate}
                  getSchedulesByDate={getSchedulesByDate}
                  getSchedulesByDay={getSchedulesByDay}
                  getSchedulesByTime={getSchedulesByTime}
                  sortSchedulesByTime={sortSchedulesByTime}
                  isToday={isToday}
                  onEdit={onEdit}
                />
              </TabsContent>
              <TabsContent value="hari_ini" className="mt-4">
                <ScheduleTableContent
                  rooms={rooms}
                  headerSlots={headerSlots}
                  currentData={currentData}
                  activeTab={activeTab}
                  getRowHeight={getRowHeight}
                  roomColumnWidth={roomColumnWidth}
                  getStatusColor={getStatusColor}
                  handleMouseEnter={handleMouseEnter}
                  handleMouseLeave={handleMouseLeave}
                  formatHeaderDate={formatHeaderDate}
                  getSchedulesByDate={getSchedulesByDate}
                  getSchedulesByDay={getSchedulesByDay}
                  getSchedulesByTime={getSchedulesByTime}
                  sortSchedulesByTime={sortSchedulesByTime}
                  isToday={isToday}
                  onEdit={onEdit}
                />
              </TabsContent>
              <TabsContent value="minggu_ini" className="mt-4">
                <ScheduleTableContent
                  rooms={rooms}
                  headerSlots={headerSlots}
                  currentData={currentData}
                  activeTab={activeTab}
                  getRowHeight={getRowHeight}
                  roomColumnWidth={roomColumnWidth}
                  getStatusColor={getStatusColor}
                  handleMouseEnter={handleMouseEnter}
                  handleMouseLeave={handleMouseLeave}
                  formatHeaderDate={formatHeaderDate}
                  getSchedulesByDate={getSchedulesByDate}
                  getSchedulesByDay={getSchedulesByDay}
                  getSchedulesByTime={getSchedulesByTime}
                  sortSchedulesByTime={sortSchedulesByTime}
                  isToday={isToday}
                  onEdit={onEdit}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Improved Flexible Hover Tooltip */}
        {hoveredItem && (
          <div
            ref={tooltipRef}
            className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm pointer-events-none dark:bg-gray-800 dark:border-gray-700 transition-all duration-200 ease-out"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              opacity: hoveredItem ? 1 : 0,
              visibility: hoveredItem ? "visible" : "hidden",
            }}
          >
            <div className="space-y-3">
              <div className="border-b border-gray-200 dark:border-gray-600 pb-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-200 text-lg">
                  {hoveredItem.mahasiswa.nama}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  NIM: {hoveredItem.mahasiswa.nim}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="text-sm dark:text-gray-300">
                    {ConvertToStringDateFormat(hoveredItem.tanggal)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm dark:text-gray-300">
                    {ConvertToStringTimeFormat(hoveredItem.waktu_mulai)} - {ConvertToStringTimeFormat(hoveredItem.waktu_selesai)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span className="text-sm dark:text-gray-300 truncate">
                    {hoveredItem.instansi}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span className="text-sm dark:text-gray-300">
                    Semester {hoveredItem.mahasiswa.semester}
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Status:
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      hoveredItem.status
                    )}`}
                  >
                    {hoveredItem.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    KP:
                  </span>
                  <span className="text-sm font-medium dark:text-gray-300">
                    {hoveredItem.status_kp}
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <div className="truncate">
                    <span className="font-medium">Pembimbing:</span>{" "}
                    {hoveredItem.dosen_pembimbing}
                  </div>
                  <div className="truncate">
                    <span className="font-medium">Penguji:</span>{" "}
                    {hoveredItem.dosen_penguji}
                  </div>
                  <div className="truncate">
                    <span className="font-medium">Pembimbing Instansi:</span>{" "}
                    {hoveredItem.pembimbing_instansi}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-200"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Selesai
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-yellow-100 border-2 border-yellow-200"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Menunggu
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-200"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Jadwal Ulang
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTable;
