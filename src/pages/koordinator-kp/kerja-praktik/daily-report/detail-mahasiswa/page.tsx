import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import {
  User,
  Building,
  Calendar,
  FileText,
  BookOpen,
  SquareArrowOutUpRightIcon,
  FilePlus2,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TambahBimbingan from "@/components/dosen/kerja-praktik/daily-report/ModalTambahBimbingan";
import ReviewBimbinganKP from "@/components/dosen/kerja-praktik/daily-report/ModalReviewBimbingan";

export const KoordinatorKerjaPraktikDailyReportDetailPage = () => {
  const { search } = useLocation();
  const [activeTab, setActiveTab] = useState("Daily-Report");
  const query = new URLSearchParams(search);
  const name = query.get("name") || "-";
  const nim = query.get("nim") || "-";
  const [IsModalBimbingan, setOpenModalBimbingan] = useState(false);
  const [IsModalBimbinganDetail, setOpenModalBimbinganDetail] = useState(false);

  // Dummy data for daily reports - Data baru ditambahkan di awal array (untuk tampil di bagian atas)
  const dailyReports = [
    {
      id: 1,
      day: 30,
      date: "02 Maret 2025",
      status: "Selesai",
      kegiatan: "Implementasi fitur login pada aplikasi",
    },
    {
      id: 2,
      day: 29,
      date: "01 Maret 2025",
      status: "Selesai",
      kegiatan: "Desain database dan perancangan API",
    },
    {
      id: 3,
      day: 28,
      date: "28 Februari 2025",
      status: "Menunggu",
      kegiatan: "Implementasi dashboard admin",
    },
    {
      id: 4,
      day: 27,
      date: "27 Februari 2025",
      status: "Selesai",
      kegiatan: "Testing fitur registrasi pengguna",
    },
    {
      id: 5,
      day: 26,
      date: "26 Februari 2025",
      status: "Revisi",
      kegiatan: "Desain UI/UX halaman profile",
    },
    {
      id: 6,
      day: 25,
      date: "25 Februari 2025",
      status: "Selesai",
      kegiatan: "Rapat dengan tim terkait kebutuhan sistem",
    },
    {
      id: 7,
      day: 24,
      date: "24 Februari 2025",
      status: "Selesai",
      kegiatan: "Mempelajari dokumentasi framework",
    },
    {
      id: 8,
      day: 23,
      date: "23 Februari 2025",
      status: "Revisi",
      kegiatan: "Implementasi validasi form",
    },
    {
      id: 9,
      day: 22,
      date: "22 Februari 2025",
      status: "Revisi",
      kegiatan: "Debugging pada fitur notifikasi",
    },
    {
      id: 10,
      day: 21,
      date: "21 Februari 2025",
      status: "Ditolak",
      kegiatan: "Mengintegrasikan sistem pembayaran",
    },
  ];

  // Dummy data untuk riwayat bimbingan
  const bimbinganData = [
    {
      id: 1,
      tanggal: "05 Maret 2025",
      waktumulai: "14:30 ",
      waktuselesai: "15:30",
      topik: "Finalisasi Laporan Kerja Praktik",
      status: "Selesai",
    },
    {
      id: 2,
      tanggal: "28 Februari 2025",
      waktumulai: "14:30 ",
      waktuselesai: "15:30",
      topik: "Pembahasan Bab 3 dan Bab 4",
      status: "Revisi",
    },
    {
      id: 3,
      tanggal: "20 Februari 2025",
      waktumulai: "14:30 ",
      waktuselesai: "15:30",
      topik: "Penentuan Judul Laporan",
      status: "Selesai",
    },
    {
      id: 4,
      tanggal: "15 Februari 2025",
      waktumulai: "14:30 ",
      waktuselesai: "15:30",
      topik: "Review Bab 1",
      status: "Revisi",
    },
    {
      id: 5,
      tanggal: "08 Februari 2025",
      waktumulai: "14:30 ",
      waktuselesai: "15:30",
      topik: "Diskusi Metodologi Penelitian",
      status: "Menunggu",
    },
  ];

  // Urutkan data agar data terbaru muncul di atas (berdasarkan day)
  const sortedDailyReports = [...dailyReports].sort((a, b) => b.day - a.day);

  // Fungsi untuk menentukan warna indikator status mahasiswa
  const getstatusmahasiswa = (status: string) => {
    switch (status) {
      case "Baru":
        return "bg-green-500";
      case "Lanjut":
        return "bg-yellow-500";
      case "Selesai":
        return "bg-green-500";
      case "Gagal":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Fungsi untuk menentukan variant badge status laporan
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Selesai":
        return "bg-green-100 text-green-800 hover:bg-green-200 border-green-200";
      case "Menunggu":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200";
      case "Revisi":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200";
      case "Ditolak":
        return "bg-red-100 text-red-800 hover:bg-red-200 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200";
    }
  };

  // Mock data for biodata
  const biodataMahasiswa = {
    name: "John Doe",
    nim: "123456789",
    status: "Baru",
    instansi: "PT. ABC",
    pembimbingInstansi: "Dr. John Smith",
    semester: 6,
    judulkp:
      "Pengembangan Sistem Informasi Manajemen Kerja Praktik Berbasis Web",
    mulaikp: "1 Januari 2025",
    selesaikp: "30 Juni 2025",
  };

  return (
    <>
      <DashboardLayout>
        {/* Biodata Section */}
        <Card className="border-none shadow-md overflow-hidden">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white dark:bg-gray-800 rounded-full h-12 w-12 flex items-center justify-center shadow-inner border border-primary/20">
                <User className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-50 dark:text-gray-100">
                  {name}
                </h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Badge
                    variant="outline"
                    className="bg-white text-gray-800 dark:bg-gray-800 border-gray-200 dark:border-gray-700 dark:text-gray-300 mr-2"
                  >
                    Semester {biodataMahasiswa.semester}
                  </Badge>
                  <span className="flex items-center text-white">
                    <span
                      className={`inline-block w-3 h-3 animate-pulse rounded-full mr-1.5 ${getstatusmahasiswa(
                        biodataMahasiswa.status
                      )}`}
                    ></span>
                    {biodataMahasiswa.status}
                  </span>
                </div>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-white dark:bg-gray-800 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-800 dark:text-gray-300"
            >
              {nim}
            </Badge>
          </div>

          {/* Info Cards */}
          <CardContent className="p-4 bg-gray-50 dark:bg-gray-800/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Judul Laporan Card */}
              <div className="space-y-4">
                {/* Report Title */}
                <div className="bg-white border-gray-400 dark:bg-gray-800/30 border dark:border-gray-700 rounded-lg p-4">
                  <div className="flex gap-2">
                    <BookOpen className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Judul Laporan
                      </h3>
                      <p className="font-semibold text-gray-900 dark:text-white mt-1">
                        {biodataMahasiswa.judulkp}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pembimbing Instansi Card */}
              <div className="space-y-4">
                {/* Academic & KP Info */}
                <div className="bg-white border-gray-400 dark:bg-gray-800/30 border dark:border-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                    Informasi Kerja Praktik
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex gap-2">
                      <Building className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Instansi/Perusahaan
                        </p>
                        <p className="font-medium text-sm">
                          {biodataMahasiswa.instansi}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <User className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Pembimbing Instansi
                        </p>
                        <p className="font-medium text-sm">
                          {biodataMahasiswa.pembimbingInstansi}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Mulai KP
                        </p>
                        <p className="font-medium text-sm">
                          {biodataMahasiswa.mulaikp}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Selesai KP
                        </p>
                        <p className="font-medium text-sm">
                          {biodataMahasiswa.selesaikp}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs and Table */}
        <div className="mt-4">
          <Tabs
            defaultValue="Daily-Report"
            className="w-full"
            onValueChange={setActiveTab}
            value={activeTab}
          >
            <TabsList className="grid w-full bg-gray-100 dark:bg-gray-800 max-w-md grid-cols-2 mb-2">
              <TabsTrigger
                value="Daily-Report"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Agenda Kerja Praktik
              </TabsTrigger>
              <TabsTrigger
                value="Riwayat-bimbingan"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500"
              >
                <FileText className="h-4 w-4 mr-2" />
                Riwayat Bimbingan
              </TabsTrigger>
            </TabsList>

            <TabsContent value="Daily-Report" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Laporan Harian</CardTitle>
                  <CardDescription>
                    Daftar laporan harian kegiatan kerja praktik
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Card className="rounded-lg shadow-sm border-none overflow-hidden">
                    <Table className="dark:border-gray-700 border">
                      <TableHeader className="bg-gray-200 dark:bg-gray-800/20">
                        <TableRow>
                          <TableHead className=" text-center">
                            Hari ke-
                          </TableHead>
                          <TableHead className=" text-center">
                            Tanggal
                          </TableHead>
                          <TableHead className=" text-center">Status</TableHead>
                          <TableHead className=" text-center">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedDailyReports.map((report) => (
                          <TableRow
                            key={report.id}
                            className={
                              report.id % 2 !== 0
                                ? "bg-background dark:bg-gray-700/30 cursor-pointer"
                                : "bg-secondary dark:bg-gray-700/10 cursor-pointer"
                            }
                          >
                            <TableCell className="font-medium text-center">
                              {report.day}
                            </TableCell>
                            <TableCell className="text-center">
                              {report.date}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                className={getStatusVariant(report.status)}
                              >
                                {report.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                size="sm"
                                className="bg-blue-500 border-blue-200 text-gray-50 hover:bg-blue-600"
                                onClick={() =>
                                  console.log(
                                    `Viewing details for day ${report.day}`
                                  )
                                }
                              >
                                <SquareArrowOutUpRightIcon className="h-4 w-4 mr-1" />
                                Lihat Detail
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="Riwayat-bimbingan" className="space-y-4">
              <Card>
                <div className="flex justify-end mr-8 mb-2 mt-2">
                  <Button
                    className="bg-blue-500 text-gray-50 hover:bg-blue-600 dark:bg-blue-500 border dark:border-gray-700 dark:hover:bg-blue-600"
                    onClick={() => setOpenModalBimbingan(true)}
                  >
                    <FilePlus2 className="h-4 w-4 " />
                    Tambah Bimbingan
                  </Button>
                </div>
                <CardContent>
                  <Card className="rounded-lg shadow-sm border-none overflow-hidden">
                    <Table className="dark:border-gray-700 border">
                      <TableHeader className=" border  dark:border-gray-700 bg-gray-200 dark:bg-gray-800/10">
                        <TableRow>
                          <TableHead className=" text-center">No</TableHead>
                          <TableHead className=" text-center">
                            Tanggal
                          </TableHead>
                          <TableHead className=" text-center">Waktu</TableHead>
                          <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bimbinganData.map((bimbingan, index) => (
                          <TableRow
                            key={bimbingan.id}
                            className={
                              bimbingan.id % 2 !== 0
                                ? "bg-background dark:bg-gray-700/30 cursor-pointer"
                                : "bg-secondary dark:bg-gray-700/10 cursor-pointer"
                            }
                          >
                            <TableCell className="font-medium text-center">
                              {index + 1}
                            </TableCell>
                            <TableCell className="text-center">
                              {bimbingan.tanggal}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center">
                                {bimbingan.waktumulai} -{" "}
                                {bimbingan.waktuselesai}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                size={"sm"}
                                className="bg-blue-500 text-gray-50 hover:bg-blue-600 dark:bg-blue-500 border dark:border-gray-700 dark:hover:bg-blue-600"
                              onClick={() =>
                                  setOpenModalBimbinganDetail(true)}
                              >
                                <FileText className="h-4 w-4 " />
                                Lihat Detail
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <TambahBimbingan
          isOpen={IsModalBimbingan}
          onClose={() => setOpenModalBimbingan(false)}
        />
        <ReviewBimbinganKP
          isOpen={IsModalBimbinganDetail}
          onClose={() => setOpenModalBimbinganDetail(false)}
        />
      </DashboardLayout>
    </>
  );
};

export default KoordinatorKerjaPraktikDailyReportDetailPage;