import { useState, useEffect } from "react";
import {
  ArrowLeft,

  FileText,
  FileInput,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import ModalAdendaMahasiswa from "@/components/instansi/ModalAdendaMahasiswa";

const DailyReportKerjaPraktikMahasiswaDetailPage = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const tanggal = query.get("tanggal") || "-";
  const [selectedRows] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Added loading state
  const [isLoading, setIsLoading] = useState(true);

  const studentData = {
    nama: "Gilang Ramadhan Indra",
    nim: "1225011323",
    semester: "6",
    tanggalMulai: "31 Januari 2025",
    tanggalSelesai: "01 Maret 2025",
    progress: 80,
  };

  const [agendaEntries] = useState([
    {
      id: 1,
      agenda: "1",
      nama_agenda: "Kegiatan 1",
      waktu: "08:00 - 10:00",
      status: "Design UI/UX",
    },
    {
      id: 2,
      agenda: "2",
      nama_agenda: "Kegiatan 2",
      waktu: "10:00 - 12:00",
      status: "Frontend Development",
    },
    {
      id: 3,
      agenda: "3",
      nama_agenda: "Kegiatan 3",
      waktu: "13:00 - 15:00",
      status: "Backend Development",
    },
    {
      id: 4,
      agenda: "4",
      nama_agenda: "Kegiatan 3",
      waktu: "13:00 - 15:00",
      status: "Backend Development",
    },
  ]);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Student Profile Card Component that includes both progress chart and bio data
  const StudentProfileCard = ({
    isLoading,
  }: {
    student: any;
    isLoading: boolean;
  }) => {

    if (isLoading) {
      return (
        <div className="rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="flex flex-col md:flex-row">
            {/* Progress Chart Section Skeleton */}
            <div className="relative flex items-center justify-center p-6 md:w-64">
              <Skeleton className="h-40 w-40 rounded-full" />
            </div>

            {/* Student Bio Data Section Skeleton */}
            <div className="flex flex-col gap-3 justify-center flex-1 p-6 border-t md:border-t-0 md:border-l border-gray-100">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-48 ml-7" />

              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-24 ml-7" />

              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-16 ml-7" />

              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-56 ml-7" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="flex flex-col md:flex-row">
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center mr-3 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          List Agenda Kerja Praktik <span>{tanggal}</span>
        </h1>
      </div>

      {/* Combined Student Profile Card */}
      <StudentProfileCard student={studentData} isLoading={isLoading} />

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 mt-6">

        {/* Table Section */}
        <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="text-center">
                  {isLoading ? (
                    <Skeleton className="h-4 w-16 mx-auto" />
                  ) : (
                    "Kegiatan ke-"
                  )}
                </TableHead>
                <TableHead className="text-center">
                  {isLoading ? (
                    <Skeleton className="h-4 w-24 mx-auto" />
                  ) : (
                    "Waktu"
                  )}
                </TableHead>
                <TableHead className="text-center">
                  {isLoading ? (
                    <Skeleton className="h-4 w-16 mx-auto" />
                  ) : (
                    "Agenda"
                  )}
                </TableHead>
                <TableHead className="text-center">
                  {isLoading ? (
                    <Skeleton className="h-4 w-24 mx-auto" />
                  ) : (
                    "Aksi"
                  )}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? [...Array(3)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center">
                        <Skeleton className="h-4 w-6 mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Skeleton className="h-4 w-24 mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Skeleton className="h-6 w-32 mx-auto" />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Skeleton className="h-8 w-8 rounded" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : agendaEntries.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-transparent">
                      <TableCell className="text-center">
                        {entry.agenda}
                      </TableCell>
                      <TableCell className="text-center">
                        {entry.waktu}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <span className="inline-block px-3 py-1 rounded-md text-xs font-medium">
                            {entry.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Button
                            size="sm"
                            className="bg-blue-500 text-white hover:bg-blue-700"
                            onClick={() => setIsModalOpen(true)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
        {/* Row Selection Indicator */}
        <div className="mt-3 text-sm text-gray-500">
          {selectedRows.length} of {agendaEntries.length} row(s) selected.
        </div>
      </div>
      
      <div>
        <h1>
          Berikan Komentar Daily Report Mahasiswa{" "}
          <span className="text-red-500">*</span>
        </h1>
        <div className="flex flex-col gap-2">
          <textarea
            className="border border-gray-300 rounded-md p-2"
            rows={1}
            placeholder="Tulis komentar di sini..."
          ></textarea>
          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              variant="default"
              size="sm"
              className=" bg-blue-500 text-white hover:bg-blue-700  "
            >
              <FileInput className="h-4 w-4" />
              Kirim
            </Button>
          </div>
        </div>
      </div>

      <ModalAdendaMahasiswa
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default DailyReportKerjaPraktikMahasiswaDetailPage;
