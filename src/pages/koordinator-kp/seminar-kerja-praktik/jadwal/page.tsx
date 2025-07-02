import { useState, useEffect, type FC } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { Input } from "@/components/ui/input";
import {
  Search,
  History,
  CalendarCheck2Icon,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";
import APISeminarKP from "@/services/api/koordinator-kp/mahasiswa.service";
import { toast } from "sonner";
import EditJadwalSeminarModal from "@/components/koordinator-kp/seminar/edit-jadwal-modal";
import LogJadwalModal from "@/components/koordinator-kp/seminar/log-jadwal-modal";
import ScheduleTable from "@/components/koordinator-kp/seminar/ScheduleTable";

// Type Definitions
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

interface Ruangan {
  nama: string;
}

// Skeleton Components
const SkeletonCard: FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3" aria-busy="true">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 border-none shadow-md rounded-lg p-4 animate-pulse"
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

const SkeletonTable: FC = () => {
  return (
    <div
      className="rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 animate-pulse"
      aria-busy="true"
    >
      <div className="flex">
        <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 w-[90px]">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
          </div>
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-center border-b border-gray-200 dark:border-gray-700 h-[80px]"
            >
              <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
        <div className="flex-1">
          <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex-1 p-4 text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0"
              >
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
              </div>
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="flex border-b border-gray-200 dark:border-gray-700 h-[80px]"
            >
              {Array.from({ length: 6 }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="flex-1 border-r border-gray-200 dark:border-gray-700 last:border-r-0 p-2"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SkeletonTabs: FC = () => {
  return (
    <div
      className="flex space-x-1 rounded-md bg-gray-100 dark:bg-gray-700 p-1"
      aria-busy="true"
    >
      {["Semua", "Hari Ini", "Minggu Ini"].map((_, index) => (
        <div
          key={index}
          className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 animate-pulse h-8 w-20"
        />
      ))}
    </div>
  );
};

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
  const [selectedTahunAjaranId, setSelectedTahunAjaranId] = useState<
    number | null
  >(null);
  const [hoveredItem, setHoveredItem] = useState<JadwalSeminar | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  // Fetch academic years
  const {
    data: tahunAjaranData,
    isLoading: isTahunAjaranLoading,
    isError: isTahunAjaranError,
  } = useQuery<TahunAjaran[]>({
    queryKey: ["tahun-ajaran"],
    queryFn: APISeminarKP.getTahunAjaran,
  });

  // Fetch rooms
  const {
    data: ruanganData,
    isLoading: isRuanganLoading,
    isError: isRuanganError,
  } = useQuery<Ruangan[]>({
    queryKey: ["ruangan"],
    queryFn: APISeminarKP.getAllRuangan,
  });

  // Fetch seminar schedule
  const { data, isLoading, isError, error } = useQuery<JadwalResponse>({
    queryKey: ["koordinator-jadwal-seminar", selectedTahunAjaranId],
    queryFn: () =>
      APISeminarKP.getJadwalSeminar(selectedTahunAjaranId ?? undefined),
    enabled: selectedTahunAjaranId !== null,
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

  // Set default tahun ajaran
  useEffect(() => {
    if (
      tahunAjaranData &&
      tahunAjaranData.length > 0 &&
      selectedTahunAjaranId === null
    ) {
      setSelectedTahunAjaranId(tahunAjaranData[0].id);
    }
  }, [tahunAjaranData, selectedTahunAjaranId]);

  // Synchronize tahun ajaran
  useEffect(() => {
    if (
      data?.tahun_ajaran?.id &&
      data.tahun_ajaran.id !== selectedTahunAjaranId &&
      tahunAjaranData?.some((tahun) => tahun.id === data.tahun_ajaran.id)
    ) {
      setSelectedTahunAjaranId(data.tahun_ajaran.id);
    }
  }, [data, tahunAjaranData, selectedTahunAjaranId]);

  // Map logJadwal to LogEntry
  const logs: LogEntry[] = (logData?.logJadwal || [])
    .map((log: any) => {
      const changes: LogEntry["changes"] = [];
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

  // Filter seminars based on search query
  const filteredData: JadwalResponse["jadwal"] = {
    semua: (data?.jadwal.semua || []).filter(
      (seminar) =>
        seminar.mahasiswa.nama
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        seminar.mahasiswa.nim.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    hari_ini: (data?.jadwal.hari_ini || []).filter(
      (seminar) =>
        seminar.mahasiswa.nama
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        seminar.mahasiswa.nim.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    minggu_ini: (data?.jadwal.minggu_ini || []).filter(
      (seminar) =>
        seminar.mahasiswa.nama
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        seminar.mahasiswa.nim.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    by_ruangan: {
      semua: Object.keys(data?.jadwal.by_ruangan.semua || {}).reduce(
        (acc, room) => ({
          ...acc,
          [room]: (data?.jadwal.by_ruangan.semua[room] || []).filter(
            (seminar) =>
              seminar.mahasiswa.nama
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              seminar.mahasiswa.nim
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          ),
        }),
        {} as { [key: string]: JadwalSeminar[] }
      ),
      hari_ini: Object.keys(data?.jadwal.by_ruangan.hari_ini || {}).reduce(
        (acc, room) => ({
          ...acc,
          [room]: (data?.jadwal.by_ruangan.hari_ini[room] || []).filter(
            (seminar) =>
              seminar.mahasiswa.nama
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              seminar.mahasiswa.nim
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          ),
        }),
        {} as { [key: string]: JadwalSeminar[] }
      ),
      minggu_ini: Object.keys(data?.jadwal.by_ruangan.minggu_ini || {}).reduce(
        (acc, room) => ({
          ...acc,
          [room]: (data?.jadwal.by_ruangan.minggu_ini[room] || []).filter(
            (seminar) =>
              seminar.mahasiswa.nama
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              seminar.mahasiswa.nim
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          ),
        }),
        {} as { [key: string]: JadwalSeminar[] }
      ),
    },
  };

  const handleOpenModal = (seminar: JadwalSeminar) => {
    setSelectedSeminar(seminar);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSeminar(null);
  };

  const handleSaveSeminar = async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: ["log-jadwal"] });
      await queryClient.invalidateQueries({
        queryKey: ["koordinator-jadwal-seminar", selectedTahunAjaranId],
      });
    } catch (error) {
      toast.error(`Gagal memperbarui jadwal seminar`, {
        duration: 3000,
      });
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

  if (isTahunAjaranError || isRuanganError) {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-600 dark:text-gray-300 py-10">
          Gagal memuat data. Silakan coba lagi nanti.
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    toast.error(`Gagal mengambil data jadwal: ${error.message}`, {
      duration: 3000,
    });
    return (
      <DashboardLayout>
        <div className="text-center text-red-600 dark:text-red-300">
          Gagal mengambil data jadwal. Silakan coba lagi nanti.
        </div>
      </DashboardLayout>
    );
  }

  const rooms = ruanganData?.map((r) => r.nama) || [];

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-3.5">
          <div className="flex">
            <span className="bg-white flex justify-center items-center shadow-sm text-gray-800 dark:text-gray-200 dark:bg-gray-900 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 text-md font-medium tracking-tight">
              <span className="inline-block animate-pulse w-3 h-3 rounded-full mr-2 bg-yellow-400" />
              <CalendarCheck2Icon className="w-4 h-4 mr-1.5" />
              Jadwal Seminar Kerja Praktik Mahasiswa
            </span>
          </div>
          <div className="flex items-center gap-2 dark:text-gray-200">
            <div className="relative">
              {isLoading || isTahunAjaranLoading || isRuanganLoading ? (
                <div className="px-3 py-1 pr-8 text-sm bg-white border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 h-8 w-32 animate-pulse" />
              ) : (
                <>
                  <select
                    className="px-3 py-1 pr-8 text-sm bg-white border focus:outline-none active:outline-none rounded-lg shadow-sm appearance-none dark:bg-gray-800 dark:border-gray-700 focus:ring-0 active:ring-0 disabled:opacity-50"
                    value={selectedTahunAjaranId ?? ""}
                    onChange={(e) =>
                      setSelectedTahunAjaranId(Number(e.target.value))
                    }
                    disabled={
                      isTahunAjaranLoading ||
                      !tahunAjaranData ||
                      isRuanganLoading
                    }
                  >
                    {tahunAjaranData && tahunAjaranData.length > 0 ? (
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
                </>
              )}
            </div>
          </div>
        </div>

        {isLoading || isTahunAjaranLoading || isRuanganLoading ? (
          <>
            <SkeletonCard />

            {/* Tab dan Tombol-tombol */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 mt-4">
              <SkeletonTabs />

              <div className="flex items-center gap-2">
                <button
                  className="rounded-sm flex bg-gradient-to-r from-blue-500 to-blue-600 py-[10px] text-white text-xs px-5 opacity-50 cursor-not-allowed"
                  disabled
                >
                  <History className="h-4 w-4 mr-2" />
                  Log Jadwal
                </button>
                <button
                  className="rounded-sm flex bg-gradient-to-r from-green-500 to-green-600 py-[10px] text-white text-xs px-5 opacity-50 cursor-not-allowed"
                  disabled
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Ruangan
                </button>
                <button
                  className="rounded-sm flex bg-gradient-to-r from-red-500 to-red-600 py-[10px] text-white text-xs px-5 opacity-50 cursor-not-allowed"
                  disabled
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus Ruangan
                </button>
              </div>
            </div>

            {/* Searchbar */}
            <div className="relative flex items-center w-full md:w-auto mb-4">
              <Search className="absolute w-4 h-4 text-gray-400 left-3" />
              <Input
                type="text"
                placeholder="Cari mahasiswa berdasarkan nama atau NIM..."
                value=""
                className="w-full pl-10 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 animate-pulse"
                disabled
              />
            </div>

            {/* Tabel Jadwal */}
            <SkeletonTable />
          </>
        ) : (
          <ScheduleTable
            data={filteredData}
            rooms={rooms}
            onEdit={handleOpenModal}
            selectedTahunAjaranId={selectedTahunAjaranId}
            setSelectedTahunAjaranId={setSelectedTahunAjaranId}
            tahunAjaranData={tahunAjaranData}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleOpenLogModal={handleOpenLogModal}
            hoveredItem={hoveredItem}
            setHoveredItem={setHoveredItem}
            hoverPosition={hoverPosition}
            setHoverPosition={setHoverPosition}
          />
        )}
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

export default KoordinatorJadwalSeminarPage;
