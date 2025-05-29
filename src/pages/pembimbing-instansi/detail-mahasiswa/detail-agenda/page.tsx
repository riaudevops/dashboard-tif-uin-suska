import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useNavigate } from "react-router-dom";
import APIKerjaPraktik from "@/services/api/pembimbing-instansi/daily-report.service";
import ModalAgendaMahasiswa from "@/components/pembimbing-instansi/ModalAgendaMahasiswa";
import { ArrowLeft, FileText, AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DailyReportDetailResponse,
  DetailDailyReport,
} from "@/interfaces/pages/mahasiswa/kerja-praktik/daily-report/daily-report.interface";

const PembimbingInstansiKerjaPraktikMahasiswaDetailAgendaPage: React.FC =
  () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAgenda, setSelectedAgenda] =
      useState<DetailDailyReport | null>(null);

    const {
      data: detailDailyReportMahasiswaInstansiSaya,
      isLoading,
      error,
    } = useQuery<DailyReportDetailResponse, Error>({
      queryKey: ["detail-daily-report-mahasiswa-instansi-saya", id],
      queryFn: () =>
        APIKerjaPraktik.getDetailDailyReportMahasiswaInstansiSaya(id!).then(
          (res) => res.data
        ),
      staleTime: Infinity,
      enabled: !!id,
    });

    const formatDate = (date: string): string => {
      try {
        return new Date(date).toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      } catch {
        return "Tanggal tidak valid!";
      }
    };

    const DailyReportCard = ({
      report,
      loading,
    }: {
      report: DailyReportDetailResponse | null;
      loading: boolean;
    }) => {
      return (
        <Card className="mt-6 border-none shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
          <div className="p-6">
            {/* <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
              Detail Daily Report
            </h2> */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {loading ? (
                <>
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-5 h-5" />
                    <Skeleton className="w-32 h-4" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-5 h-5" />
                    <Skeleton className="w-32 h-4" />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Catatan Evaluasi
                      </p>
                      <p className="text-base text-gray-900 dark:text-white">
                        {report?.catatan_evaluasi || "-"}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
      );
    };

    const AgendaTableSkeleton = () => (
      <Card className="border-none shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
        <div className="p-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="flex items-center py-4 space-x-4 border-b border-gray-200 dark:border-gray-700 animate-pulse last:border-0"
            >
              <Skeleton className="w-12 h-6" />
              <Skeleton className="w-24 h-6" />
              <Skeleton className="flex-1 h-6" />
              <Skeleton className="w-24 h-8" />
            </div>
          ))}
        </div>
      </Card>
    );

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-10 h-10 border-t-2 border-indigo-500 rounded-full"
          />
        </div>
      );
    }

    if (error || !detailDailyReportMahasiswaInstansiSaya) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
          <p className="mb-4 text-lg font-medium text-gray-700 dark:text-gray-300">
            {error?.message || "Data tidak ditemukan..."}
          </p>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={() => window.location.reload()}
          >
            Coba Lagi
          </Button>
        </div>
      );
    }

    return (
      <div className="min-h-screen p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mr-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold text-gray-800 md:text-2xl dark:text-white">
            {formatDate(
              detailDailyReportMahasiswaInstansiSaya.tanggal_presensi
            )}
          </h1>
        </div>
        {/* Agenda Table */}
        <Card className="mt-6 border-none shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
          <div className="p-6">
            {/* <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
              List Agenda
            </h2> */}
            {detailDailyReportMahasiswaInstansiSaya.detail_daily_report.length >
            0 ? (
              <Table>
                <TableHeader className="bg-indigo-50 dark:bg-indigo-900/20">
                  <TableRow>
                    <TableHead className="font-semibold text-center text-gray-700 dark:text-gray-200">
                      Agenda Ke-
                    </TableHead>
                    <TableHead className="font-semibold text-center text-gray-700 dark:text-gray-200">
                      Waktu
                    </TableHead>
                    <TableHead className="font-semibold text-center text-gray-700 dark:text-gray-200">
                      Agenda
                    </TableHead>
                    <TableHead className="font-semibold text-center text-gray-700 dark:text-gray-200">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <AgendaTableSkeleton />
                  ) : (
                    detailDailyReportMahasiswaInstansiSaya.detail_daily_report.map(
                      (entry, index) => (
                        <TableRow
                          key={entry.id}
                          className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/20"
                        >
                          <TableCell className="py-4 font-medium text-center text-gray-900 dark:text-white">
                            {index + 1}
                          </TableCell>
                          <TableCell className="py-4 text-center text-gray-700 dark:text-gray-300">
                            {entry.waktu_mulai} - {entry.waktu_selesai}
                          </TableCell>
                          <TableCell className="py-4 text-center text-gray-700 dark:text-gray-300">
                            {entry.judul_agenda || "-"}
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <Button
                              size="sm"
                              className="text-white bg-indigo-500 hover:bg-indigo-700"
                              onClick={() => {
                                setSelectedAgenda(entry);
                                setIsModalOpen(true);
                              }}
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              Detail
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    )
                  )}
                </TableBody>
              </Table>
            ) : (
              <div className="py-12 text-center">
                <FileText
                  size={40}
                  className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
                />
                <p className="text-gray-500 dark:text-gray-400">
                  Belum ada agenda...
                </p>
              </div>
            )}
          </div>
        </Card>
        <DailyReportCard
          report={detailDailyReportMahasiswaInstansiSaya}
          loading={isLoading}
        />
        <ModalAgendaMahasiswa
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAgenda(null);
          }}
          reportData={selectedAgenda || undefined}
        />
      </div>
    );
  };

export default PembimbingInstansiKerjaPraktikMahasiswaDetailAgendaPage;
