import { useState, useEffect } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, FilePenLine } from "lucide-react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "react-router-dom";
import TambahAgendaModal from "@/components/mahasiswa/daily-report/isi-agenda/AddTaskModal";
import { ShinyButton } from "@/components/magicui/shiny-button";
import DetailAgendaModal from "@/components/mahasiswa/daily-report/isi-agenda/ReviewDailyReport";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import EditDailyReport from "@/components/mahasiswa/daily-report/isi-agenda/EditDailyReport";


const MahasiswaKerjaPraktekDailyReportIsiAgendaDetailPage = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const tanggal = query.get("tanggal") || "-";

  const [isLoading, setIsLoading] = useState(false);
  // Add state to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRows] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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
  ]);

  // Sample institution comment
  const institutionComment =
    "Kinerja mahasiswa baik dan tepat waktu dalam menyelesaikan tugas. Mohon tingkatkan detail dokumentasi untuk kegiatan berikutnya.";

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-64" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-24" />
              </div>
            </>
          ) : (
            <>
              <CardTitle className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-0">
                List Agenda Kerja Praktek {tanggal}
              </CardTitle>
            </>
          )}
        </CardHeader>
        <CardContent>
          {/* Change to handle modal open */}
          <ShinyButton
            className="w-auto mb-6"
            onClick={() => setIsModalOpen(true)}
          >
            <FileText className="mr-2 h-4 w-4" />
            isi agenda
          </ShinyButton>

          {/* Include the modal component */}
          <TambahAgendaModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />

          {/* Table Section */}
          <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="text-center">
                    {isLoading ? (
                      <Skeleton className="h-4 w-16 text-center" />
                    ) : (
                      "Kegiatan ke-"
                    )}
                  </TableHead>
                  <TableHead className="text-center">
                    {isLoading ? (
                      <Skeleton className="h-4 w-24 text-center" />
                    ) : (
                      "Waktu"
                    )}
                  </TableHead>
                  <TableHead className="text-center">
                    {isLoading ? (
                      <Skeleton className="h-4 w-16 text-center" />
                    ) : (
                      "Agenda"
                    )}
                  </TableHead>
                  <TableHead className="text-center">
                    {isLoading ? (
                      <Skeleton className="h-4 w-24 text-center" />
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
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-48" />
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-4 mx-auto" />
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
                              className=" bg-blue-500 text-white hover:bg-blue-700 "
                              onClick={() => setIsDetailModalOpen(true)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button 
                             size="sm"
                             className="bg-amber-500 hover:bg-amber-600 text-white ml-2"
                             onClick={() => setIsEditModalOpen(true)}>
                            <FilePenLine className="h-4 w-4" />
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

          {/* Institution Comment Display Box - Enlarged */}
          <div className="mt-8 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm p-6">
            <div className="space-y-4">
              <div>
                <Label className="text-lg font-medium flex items-center gap-2 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-600"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  Evaluasi Agenda dari Instansi
                </Label>
                <div className="p-5 bg-blue-50 dark:bg-blue-900/10 rounded-md border border-blue-100 dark:border-blue-800">
                  <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    {institutionComment}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Modal Components */}
      <DetailAgendaModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
      <EditDailyReport
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </DashboardLayout>
  );
};

export default MahasiswaKerjaPraktekDailyReportIsiAgendaDetailPage;
