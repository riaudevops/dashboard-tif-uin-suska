import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, FilePenLine, BookOpen, Calendar1Icon, EyeIcon, FilePlus2Icon } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CardContent, CardHeader } from "@/components/ui/card";
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
  })

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

  const institutionComment = detailDailyReportSaya?.catatan_evaluasi || "Belum ada catatan evaluasi.";

  const agendaEntries: Agenda[] =
    detailDailyReportSaya?.detail_daily_report || [];

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-4">
        <CardHeader className="p-0 flex flex-row w-full justify-between">
          <div className="flex">
            <span className="bg-white flex justify-center items-center shadow-sm text-gray-800 dark:text-gray-200 dark:bg-gray-900 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 text-md font-medium tracking-tight">
              <span
                className={`inline-block animate-pulse w-3 h-3 rounded-full mr-2 bg-yellow-400`}
              />
              <BookOpen className="w-4 h-4 mr-1.5" />
              Detail Agenda Daily Report KP Mahasiswa
            </span>
          </div>
          <div className="flex ml-3 underline underline-offset-2 text-md">
            <Calendar1Icon className="w-5 h-5 mr-1.5" />           
            {formatDate(detailDailyReportSaya?.tanggal_presensi)}              
          </div>
          {/* Tanggal Realtime Dalam Format Humanize */}
        </CardHeader>
        <CardContent className="px-4 pt-1 pb-4 rounded-md bg-background border shadow-sm">
          <Button
            variant={"outline"}
            className="w-auto mt-2 mb-3"
            onClick={() => setIsModalOpen(true)}
          >
            <FilePlus2Icon className="w-[1.15rem] h-[1.15rem]" />
            Tambah Agenda
          </Button>
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
                  <TableHead className="max-w-12 text-center">
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
                      "Waktu Agenda"
                    )}
                  </TableHead>
                  <TableHead className="text-center">
                    {isLoading ? (
                      <Skeleton className="w-16 h-4 text-center" />
                    ) : (
                      "Judul Agenda"
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
                    <TableRow key={entry.id} className={`hover:bg-transparent ${index % 2 === 0 ? "bg-background/70" : ""}`}>
                      <TableCell className="text-center">{index + 1}.</TableCell>
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
                            <EyeIcon className="w-4 h-4" />
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
          {/* Institution Comment Display Box - Enlarged */}
          <div className="p-6 mt-6 border border-gray-100 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800/30 dark:border-gray-700">
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
