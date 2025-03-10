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
import { FileText, ArrowUpRight } from "lucide-react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "react-router-dom";
// Import the TambahAgendaModal component
import TambahAgendaModal from "@/pages/mahasiswa/kerja-praktik/daily-report/AddTaskModal";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { ShinyButton } from "@/components/magicui/shiny-button";

const MahasiswaKerjaPraktekDailyReportIsiAgendaDetailPage = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const tanggal = query.get("tanggal") || "24 Februari, 2024";

  const [isLoading, setIsLoading] = useState(false);
  // Add state to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRows] = useState([1, 2, 3]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate total internship days and current progress

  const [agendaEntries] = useState([
    {
      agenda: "3",
      nama_agenda: "Kegiatan 3",
      status: "Tepat Waktu",
    },
    {
      agenda: "2",
      nama_agenda: "Kegiatan 2",
      status: "Tepat Waktu",
    },
    {
      agenda: "1",
      nama_agenda: "Kegiatan 1",
      status: "Tepat Waktu",
    },
  ]);

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
                List Agenda Kerja Praktek Tanggal {tanggal}
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
            <FileText className=" mr-2 h-4 w-4" />
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
                      <Skeleton className="h-4 w-16 text-center" />
                    ) : (
                      "Status"
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
                        <TableCell>
                          <Skeleton className="h-6 w-20" />
                        </TableCell>
                      </TableRow>
                    ))
                  : agendaEntries.map((entry, index) => (
                      <TableRow key={index} className="hover:bg-transparent">
                        <TableCell className="text-center">
                          {entry.agenda}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <span className="inline-block px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                              {entry.status}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <AnimatedShinyText className="flex items-center gap-2 cursor-pointer border border-gray-600  gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:border-purple-400  rounded-md px-3 py-1 transition-colors ">
                              ✨ Lihat Detail
                              <ArrowUpRight className="h-4 w-4" />
                            </AnimatedShinyText>
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
        </CardContent>
      </div>
    </DashboardLayout>
  );
};

export default MahasiswaKerjaPraktekDailyReportIsiAgendaDetailPage;
