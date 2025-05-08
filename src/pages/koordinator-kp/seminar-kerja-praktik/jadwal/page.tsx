import { useState, type FC } from "react";
// import { useNavigate } from "react-router-dom";
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
import EditJadwalSeminarModal from "@/components/koordinator/seminar/edit-jadwal-modal";

// Interface untuk data seminar
interface Seminar {
  id: number;
  namaMahasiswa: string;
  ruangan: string;
  jam: string;
  tanggalSeminar: string;
  dosenPenguji: string;
  status: "terjadwal" | "selesai" | "diganti";
}

// Komponen Utama
const KoordinatorJadwalSeminarPage: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeminar, setSelectedSeminar] = useState<Seminar | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "semua" | "hari_ini" | "minggu_ini"
  >("semua");
  // const navigate = useNavigate();

  // Data dummy seminar
  const [seminars, setSeminars] = useState<Seminar[]>([
    {
      id: 1,
      namaMahasiswa: "M Farhan Aulia Pratama",
      ruangan: "FST301",
      jam: "09:00",
      tanggalSeminar: "2025-05-08",
      dosenPenguji: "Dr. Ahmad Fauzi",
      status: "terjadwal",
    },
    {
      id: 2,
      namaMahasiswa: "Gilang Ramadhan",
      ruangan: "FST302",
      jam: "10:30",
      tanggalSeminar: "2025-05-08",
      dosenPenguji: "Dr. Siti Aminah",
      status: "selesai",
    },
    {
      id: 3,
      namaMahasiswa: "Farhan Fadilla",
      ruangan: "FST303",
      jam: "13:00",
      tanggalSeminar: "2025-05-09",
      dosenPenguji: "Prof. Arif Rahman",
      status: "diganti",
    },
    {
      id: 4,
      namaMahasiswa: "Ahmad Kurniawan",
      ruangan: "FST304",
      jam: "14:00",
      tanggalSeminar: "2025-05-10",
      dosenPenguji: "Dr. Dewi Susanti",
      status: "terjadwal",
    },
    {
      id: 5,
      namaMahasiswa: "Anisa Putri",
      ruangan: "FST305",
      jam: "09:30",
      tanggalSeminar: "2025-05-11",
      dosenPenguji: "Prof. Eko Prasetyo",
      status: "terjadwal",
    },
  ]);

  const handleOpenModal = (seminar: Seminar) => {
    setSelectedSeminar(seminar);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSeminar(null);
  };

  const handleSaveSeminar = (updatedSeminar: Seminar) => {
    // Update the seminar data in the state
    setSeminars((prevSeminars) =>
      prevSeminars.map((seminar) =>
        seminar.id === updatedSeminar.id ? updatedSeminar : seminar
      )
    );
    console.log("Updated seminar:", updatedSeminar);
  };

  // Filter seminars berdasarkan tab dan pencarian
  const filteredSeminars = seminars.filter((seminar) => {
    const matchesSearch = seminar.namaMahasiswa
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const seminarDate = new Date(seminar.tanggalSeminar);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());

    if (activeTab === "hari_ini") {
      return (
        matchesSearch && seminarDate.toDateString() === today.toDateString()
      );
    } else if (activeTab === "minggu_ini") {
      return (
        matchesSearch &&
        seminarDate >= thisWeekStart &&
        seminarDate <=
          new Date(thisWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
      );
    }
    return matchesSearch;
  });

  // Format tanggal
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold dark:text-white">Jadwal Seminar</h1>

          <DashboardJadwalCard seminars={seminars} />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Tabs
              defaultValue="semua"
              onValueChange={(value) =>
                setActiveTab(value as "semua" | "hari_ini" | "minggu_ini")
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

                <div className="flex items-center w-full relative">
                  <Search className="h-4 w-4 absolute left-3 text-gray-400" />
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
                  seminars={filteredSeminars}
                  onEdit={handleOpenModal}
                  formatDate={formatDate}
                />
              </TabsContent>
              <TabsContent value="hari_ini" className="mt-4">
                <SeminarTable
                  seminars={filteredSeminars}
                  onEdit={handleOpenModal}
                  formatDate={formatDate}
                />
              </TabsContent>
              <TabsContent value="minggu_ini" className="mt-4">
                <SeminarTable
                  seminars={filteredSeminars}
                  onEdit={handleOpenModal}
                  formatDate={formatDate}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Render the modal */}
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
  seminars: Seminar[];
  onEdit: (seminar: Seminar) => void;
  formatDate: (dateString: string) => string;
}> = ({ seminars, onEdit, formatDate }) => {
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
              Ruangan
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Jam
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Tanggal Seminar
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Dosen Penguji
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
                colSpan={7}
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
                  {seminar.namaMahasiswa}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300">
                  {seminar.ruangan}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300">
                  {seminar.jam}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300">
                  {formatDate(seminar.tanggalSeminar)}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300">
                  {seminar.dosenPenguji}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
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
