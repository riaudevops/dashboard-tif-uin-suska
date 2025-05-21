import { useState, type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { Search, Edit } from "lucide-react";
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

// Komponen Utama
const KoordinatorJadwalSeminarPage: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeminar, setSelectedSeminar] = useState<JadwalSeminar | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "semua" | "hari_ini" | "minggu_ini"
  >("semua");
  console.log("Active Tab:", activeTab);

  // Fetch data menggunakan TanStack Query
  const { data, isLoading, isError, error } = useQuery<JadwalResponse>({
    queryKey: ["koordinator-jadwal-seminar"],
    queryFn: APISeminarKP.getJadwalSeminar,
  });

  // Ambil data untuk masing-masing tab dari API
  const semuaSeminars: JadwalSeminar[] = data?.jadwal?.semua || [];
  const hariIniSeminars: JadwalSeminar[] = data?.jadwal?.hari_ini || [];
  const mingguIniSeminars: JadwalSeminar[] = data?.jadwal?.minggu_ini || [];

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

  const handleSaveSeminar = (updatedSeminar: JadwalSeminar) => {
    console.log("Updated seminar:", updatedSeminar);
    handleCloseModal();
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
            <TableHead className="w-12 font-semibold text-center dark:text-gray-200">
              No
            </TableHead>
            <TableHead className="font-semibold dark:text-gray-200">
              Nama Mahasiswa
            </TableHead>
            <TableHead className="font-semibold text-center dark:text-gray-200">
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
            seminars.map((seminar, index) => (
              <TableRow
                key={seminar.id}
                className="dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <TableCell className="font-medium text-center dark:text-gray-300">
                  {index + 1}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {seminar.mahasiswa.nama}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300">
                  {seminar.ruangan}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300">
                  {seminar.jam}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300">
                  {seminar.tanggal}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300">
                  {seminar.dosen_pembimbing}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300">
                  {seminar.dosen_penguji}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300">
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
