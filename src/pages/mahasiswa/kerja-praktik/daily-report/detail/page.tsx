import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, FilePenLine } from "lucide-react";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import APIKerjaPraktik from "@/services/api/mahasiswa/daily-report.service";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import TambahAgendaModal from "@/components/mahasiswa/kerja-praktik/daily-report/TambahAgendaModal";
import DetailAgendaModal from "@/components/mahasiswa/kerja-praktik/daily-report/DetailAgendaModal";
import EditDetailAgendaModal from "@/components/mahasiswa/kerja-praktik/daily-report/EditDetailAgendaModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Agenda {
  id: number;
  waktu_mulai: string;
  waktu_selesai: string;
  judul_agenda: string;
  deskripsi_agenda: string;
}

const MahasiswaKerjaPraktikDailyReportDetailPage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const queryClient = useQueryClient();

  const { data: detailDailyReportSaya, isLoading } = useQuery({
    queryKey: ["detail-daily-report-saya", id],
    queryFn: () =>
      APIKerjaPraktik.getDetailDailyReportSaya(id!).then((data) => data.data),
    staleTime: Infinity,
    enabled: !!id,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRows] = useState<number[]>([]);
  const [selectedAgenda, setSelectedAgenda] = useState<Agenda | null>(null);

  const formatTime = (start: string, end: string) => {
    return `${start} - ${end}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const institutionComment = detailDailyReportSaya?.catatan_evaluasi || "-";

  const agendaEntries: Agenda[] =
    detailDailyReportSaya?.detail_daily_report || [];

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <CardHeader className="flex flex-col items-start justify-between pb-2 space-y-2 sm:flex-row sm:items-center sm:space-y-0">
          {isLoading ? (
            <>
              <Skeleton className="w-64 h-8" />
              <div className="flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                <Skeleton className="w-40 h-5" />
                <Skeleton className="w-24 h-5" />
              </div>
            </>
          ) : (
            <CardTitle className="mb-2 text-2xl font-bold sm:text-3xl sm:mb-0">
              {detailDailyReportSaya?.tanggal_presensi
                ? formatDate(detailDailyReportSaya.tanggal_presensi)
                : "Detail Daily Report"}
            </CardTitle>
          )}
        </CardHeader>
        <CardContent>
          <ShinyButton
            className="w-auto mb-6"
            onClick={() => setIsModalOpen(true)}
          >
            <FileText className="w-[1.15rem] h-[1.15rem] mr-3" />
            Tambah Agenda
          </ShinyButton>
          <TambahAgendaModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            dailyReportId={id!}
            onSave={() => {
              queryClient.invalidateQueries({
                queryKey: ["detail-daily-report-saya", id],
              });
            }}
          />
          {/* Table Section */}
          <div className="overflow-hidden border border-gray-100 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800/30 dark:border-gray-700">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="text-center">
                    {isLoading ? (
                      <Skeleton className="w-16 h-4 text-center" />
                    ) : (
                      "Agenda Ke-"
                    )}
                  </TableHead>
                  <TableHead className="text-center">
                    {isLoading ? (
                      <Skeleton className="w-24 h-4 text-center" />
                    ) : (
                      "Waktu"
                    )}
                  </TableHead>
                  <TableHead className="text-center">
                    {isLoading ? (
                      <Skeleton className="w-16 h-4 text-center" />
                    ) : (
                      "Agenda"
                    )}
                  </TableHead>
                  <TableHead className="text-center">
                    {isLoading ? (
                      <Skeleton className="w-24 h-4 text-center" />
                    ) : (
                      "Aksi"
                    )}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(2)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="w-24 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-48 h-4" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Skeleton className="w-24 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-20 h-6" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-4 h-4 mx-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : agendaEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FileText className="w-10 h-10 mb-3 opacity-50" />
                        <p className="text-sm">
                          Klik tombol "Tambah Agenda" untuk menambahkan Agenda
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  agendaEntries.map((entry: Agenda, index: number) => (
                    <TableRow key={entry.id} className="hover:bg-transparent">
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center">
                        {formatTime(entry.waktu_mulai, entry.waktu_selesai)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <span className="inline-block px-3 py-1 text-sm font-medium rounded-md">
                            {entry.judul_agenda}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center space-x-2">
                          <Button
                            size="sm"
                            className="text-white bg-blue-500 hover:bg-blue-700"
                            onClick={() => {
                              setSelectedAgenda(entry);
                              setIsDetailModalOpen(true);
                            }}
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            className="text-white bg-amber-500 hover:bg-amber-600"
                            onClick={() => {
                              setSelectedAgenda(entry);
                              setIsEditModalOpen(true);
                            }}
                          >
                            <FilePenLine className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {/* Row Selection Indicator */}
          <div className="mt-3 text-sm text-gray-500">
            {selectedRows.length} of {agendaEntries.length} row(s) selected.
          </div>
          {/* Institution Comment Display Box - Enlarged */}
          <div className="p-6 mt-8 border border-gray-100 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800/30 dark:border-gray-700">
            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2 mb-4 text-lg font-medium">
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
                  Evaluasi dari Pembimbing Instansi
                </Label>
                <div className="p-5 border border-blue-100 rounded-md bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800">
                  <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    {institutionComment}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
      <DetailAgendaModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedAgenda(null);
        }}
        agenda={selectedAgenda}
      />
      <EditDetailAgendaModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAgenda(null);
        }}
        agenda={selectedAgenda}
        onSave={() => {
          queryClient.invalidateQueries({
            queryKey: ["detail-daily-report-saya", id],
          });
        }}
      />
    </DashboardLayout>
  );
};

export default MahasiswaKerjaPraktikDailyReportDetailPage;
