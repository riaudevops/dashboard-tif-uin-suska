import { useState, useEffect, type FC } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import ScheduleTable from "@/components/koordinator-kp/seminar/ScheduleTable";
import DashboardJadwalCard from "@/components/dosen/seminar-kp/DashboardJadwalCard";
import EditJadwalSeminarModal from "@/components/koordinator-kp/seminar/edit-jadwal-modal";
import LogJadwalModal from "@/components/koordinator-kp/seminar/log-jadwal-modal";
import APISeminarKP from "@/services/api/koordinator-kp/mahasiswa.service";
import { Toaster } from "react-hot-toast";
import { toast } from "@/hooks/use-toast";

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
    error: tahunAjaranError,
  } = useQuery<TahunAjaran[]>({
    queryKey: ["tahun-ajaran"],
    queryFn: APISeminarKP.getTahunAjaran,
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
    semua: (data?.jadwal.semua || []).filter((seminar) =>
      seminar.mahasiswa.nama.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    hari_ini: (data?.jadwal.hari_ini || []).filter((seminar) =>
      seminar.mahasiswa.nama.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    minggu_ini: (data?.jadwal.minggu_ini || []).filter((seminar) =>
      seminar.mahasiswa.nama.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    by_ruangan: {
      semua: Object.keys(data?.jadwal.by_ruangan.semua || {}).reduce(
        (acc, room) => ({
          ...acc,
          [room]: (data?.jadwal.by_ruangan.semua[room] || []).filter(
            (seminar) =>
              seminar.mahasiswa.nama
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

  const handleSaveSeminar = async (updatedSeminar: JadwalSeminar) => {
    try {
      await queryClient.invalidateQueries({ queryKey: ["log-jadwal"] });
      await queryClient.invalidateQueries({
        queryKey: ["koordinator-jadwal-seminar", selectedTahunAjaranId],
      });
      toast({
        title: "✅ Berhasil",
        description: "Jadwal seminar berhasil diperbarui.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "❌ Gagal",
        description: "Gagal memperbarui jadwal seminar.",
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

  if (isTahunAjaranError) {
    toast({
      title: "❌ Gagal",
      description: `Gagal mengambil daftar tahun ajaran: ${
        (tahunAjaranError as Error).message
      }`,
      duration: 3000,
    });
    return (
      <DashboardLayout>
        <div className="text-center text-gray-600 dark:text-gray-300 py-10">
          Gagal memuat daftar tahun ajaran. Silakan coba lagi nanti.
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading || isTahunAjaranLoading) {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-600 dark:text-gray-300">
          Memuat jadwal seminar...
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    toast({
      title: "❌ Gagal",
      description: `Gagal mengambil data jadwal: ${(error as Error).message}`,
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

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <ScheduleTable
        data={filteredData}
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
