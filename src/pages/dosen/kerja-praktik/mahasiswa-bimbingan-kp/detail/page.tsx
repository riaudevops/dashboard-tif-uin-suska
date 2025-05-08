import { useState } from "react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import {
  Calendar,
  GraduationCap,
  User,
  ClipboardCheck,
  Building,
  FilePlus2,
  FileText,
  SquareArrowOutUpRightIcon,
  BookOpen,
  Save,
} from "lucide-react";
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
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TambahBimbingan from "@/components/dosen/kerja-praktik/daily-report/ModalTambahBimbingan";
import ReviewBimbinganKP from "@/components/dosen/kerja-praktik/daily-report/ModalReviewBimbingan";
import { useLocation } from "react-router-dom";

const DosenKerjaPraktikMahasiswaDetail = () => {
  const [activeTab, setActiveTab] = useState("Daily-Report");
  const [IsModalBimbingan, setOpenModalBimbingan] = useState(false);
  const [IsModalBimbinganDetail, setOpenModalBimbinganDetail] = useState(false);
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const name = query.get("name") || "-";
  const nim = query.get("nim") || "-";
  const semester = query.get("semester") || "-";
  const status = query.get("status") || "-";


  // Sample student data
  const student = {
    id: "12234537658", // From the image
    name: "Muh. Zaki Erbai Syas",
    photo: "/path/to/muh-zaki.jpg",
    semester: 5,
    status: "Kerja Praktik", // From the image
    lastSupervision: "15 April 2025",
    program: "Teknik Informatika",
    reportTitle:
      "Pengembangan Sistem Informasi Terintegrasi Berbasis Cloud Computing", // From the image
    supervisor: "Sarinah, M.Pd",
    company: "RAPP", // From the image
    startDate: "1 Maret 2025",
    endDate: "30 Juni 2025",
  };

  // Sample agenda data
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
      status: "Selesai",
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
      status: "Selesai",
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

  // Fungsi untuk menentukan variant badge status laporan
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Selesai":
        return "bg-green-100 text-green-800 hover:bg-green-200 border-green-200";
      case "Revisi":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200";
    }
  };


  // Function to get initials from name
  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    } else {
      return name.substring(0, 2).toUpperCase();
    }
  };


  // Function to get status color for profile avatar
  const getStatusAvatarColor = (status: string) => {
    switch (status) {
      case "Kerja Praktik":
        return "from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700";
      case "Seminar Kerja Praktik":
        return "from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700";
      case "Selesai":
        return "from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700";
      case "Skripsi":
        return "from-orange-500 to-amber-600 dark:from-orange-600 dark:to-amber-700";
      case "Magang":
        return "from-indigo-500 to-blue-600 dark:from-indigo-600 dark:to-blue-700";
      case "Lanjut":
        return "from-orange-500 to-amber-600 dark:from-orange-600 dark:to-amber-700";
      case "Gagal":
        return "from-red-500 to-rose-600 dark:from-red-600 dark:to-rose-700";
      default:
        return "from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700";
    }
  };  

  // Updated evaluation criteria with weights as per the image
  const evaluationCriteria = [
    { id: 'kemampuan_penyelesaian', label: 'Kemampuan penyelesaian masalah', weight: 0.40 },
    { id: 'keaktifan_bimbingan', label: 'Keaktifan bimbingan dan Sikap', weight: 0.35 },
    { id: 'kualitas_laporan', label: 'Kualitas laporan KP', weight: 0.25 }
  ];

   // State for evaluation form
   const [evaluationValues, setEvaluationValues] = useState({
    kemampuan_penyelesaian: 70,
    keaktifan_bimbingan: 70,
    kualitas_laporan: 70,
    catatan: ""
  });

  // Handler for slider changes
  const handleSliderChange = (name : string, value : number[]) => {
    setEvaluationValues(prev => ({
      ...prev,
      [name]: value[0]
    }));
  };
  
  // Reset form to default values


  // Handler for text area changes
  const handleTextAreaChange = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
    setEvaluationValues(prev => ({
      ...prev,
      catatan: e.target.value
    }));
  };

  // Calculate final score with weights
  const calculateFinalScore = () => {
    let weightedSum = 0;
    
    // Calculate weighted sum based on criteria weights
    weightedSum += evaluationValues.kemampuan_penyelesaian * evaluationCriteria[0].weight;
    weightedSum += evaluationValues.keaktifan_bimbingan * evaluationCriteria[1].weight;
    weightedSum += evaluationValues.kualitas_laporan * evaluationCriteria[2].weight;
    
    // Return rounded score - this represents 40% of the total grade as per the image
    return Math.round(weightedSum);
  };

  // Function to get grade based on score
  const getGrade = (score = 0) => {
    if (score >= 85) return "A";
    if (score >= 80) return "A-";
    if (score >= 75) return "B+";
    if (score >= 70) return "B";
    if (score >= 65) return "B-";
    if (score >= 60) return "C+";
    if (score >= 55) return "C";
    if (score >= 50) return "C-";
    if (score >= 40) return "D";
    return "E";
  };

  return (
    <DashboardLayout>
      <div className="p-4 min-h-screen ">
        {/* Page Title */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Detail Mahasiswa Bimbingan</h1>
        </div>

        {/* Profile Pictures card */}
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl overflow-hidden shadow-md mb-8">
          <div
            className={`bg-gradient-to-r ${getStatusAvatarColor(
              status
            )} h-24`}
          ></div>

          <div className="px-6 pb-6">
            {/* Three-column layout for the profile section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column - Report Title */}
              <div className="space-y-4 mt-8">
                <div className="bg-gray-50 dark:bg-gray-800/30 border dark:border-gray-700 rounded-lg p-4 h-full flex flex-col justify-center">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <h2 className="uppercase text-sm font-medium text-gray-500 dark:text-gray-400">
                        Judul Laporan
                      </h2>
                    </div>
                    <Card className="rounded-lg py-4 px-4 dark:bg-gray-800/30 border dark:border-gray-700 shadow-sm overflow-hidden w-full">
                      <div className="max-h-24 overflow-y-auto custom-scrollbar">
                        <p className=" uppercase text-sm font-semibold text-gray-900 dark:text-white">
                          {student.reportTitle}
                        </p>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Center Column - Profile */}
              <div className="flex flex-col items-center -mt-12">
                <div
                  className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center text-white font-bold text-3xl bg-gradient-to-br ${getStatusAvatarColor(
                    status
                  )} shadow-md`}
                >
                  {getInitials(name)}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-3 text-center">
                  {name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  {nim}
                </p>
                <div className="flex items-center space-x-2 mt-4">
                  <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                    <GraduationCap className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span>Semester {semester}</span>
                  </span>
                  <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                    <ClipboardCheck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span>{bimbinganData.length} Bimbingan</span>
                  </span>
                </div>
              </div>

              {/* Right Column - KP Info */}
              <div className="space-y-4 mt-8">
                <div className="bg-gray-50 dark:bg-gray-800/30 border dark:border-gray-700 rounded-lg p-4">
                  <h3 className="uppercase text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                    Informasi Kerja Praktik
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex gap-2">
                      <Building className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Instansi/Perusahaan
                        </p>
                        <p className="font-medium text-sm">{student.company}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <User className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Pembimbing Instansi
                        </p>
                        <p className="font-medium text-sm">
                          {student.supervisor}
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
                          {student.startDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Selesai KP
                        </p>
                        <p className="font-medium text-sm">{student.endDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Table */}
        <div className="mt-4">
          <Tabs
            defaultValue="Daily-Report"
            className="w-full"
            onValueChange={setActiveTab}
            value={activeTab}
          >
            <TabsList className="grid w-full bg-gray-100 dark:bg-gray-800 max-w-2xl grid-cols-3 mb-2">
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
              <TabsTrigger
                value="Penilaian"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500"
              >
                <ClipboardCheck className="h-4 w-4 mr-2" />
                Penilaian
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
                                  setOpenModalBimbinganDetail(true)
                                }
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

            <TabsContent value="Penilaian" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Nilai Kerja Praktik</CardTitle>
                  <CardDescription>
                    Formulir penilaian kerja praktik mahasiswa (Dosen Pembimbing - 40%)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Assessment Criteria based on the image */}
                    {evaluationCriteria.map((criteria) => (
                      <div key={criteria.id} className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <Label htmlFor={criteria.id} className="text-sm font-bold text-gray-700 dark:text-gray-300">
                              {criteria.label}
                            </Label>
                            <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                              {Math.round(criteria.weight * 100)}%
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={evaluationValues[criteria.id as keyof typeof evaluationValues] as number}
                              onChange={(e) => {
                                const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                                handleSliderChange(criteria.id, [value]);
                              }}
                              className="w-16 h-9 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-center text-sm"
                            />
                            
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-xs text-gray-500 dark:text-gray-400 w-6">0</span>
                          <Slider
                            id={criteria.id}
                            defaultValue={[70]}
                            max={100}
                            step={1}
                            className="flex-grow"
                            value={[evaluationValues[criteria.id as keyof typeof evaluationValues] as number]}
                            onValueChange={(value) => handleSliderChange(criteria.id, value)}
                          />
                          <span className="text-xs text-gray-500 dark:text-gray-400 w-6">100</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Notes Section */}
                  <div className="mt-6">
                    <Label htmlFor="catatan" className="text-sm font-medium">
                      Catatan Evaluasi
                    </Label>
                    <Textarea
                      id="catatan"
                      placeholder="Masukkan catatan atau umpan balik untuk mahasiswa"
                      className="mt-2 h-24"
                      value={evaluationValues.catatan}
                      onChange={handleTextAreaChange}
                    />
                  </div>

                  {/* Final Score and Grade Section */}
                  <div className="mt-8 bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Nilai Akhir</h3>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{calculateFinalScore()}</p>
                        <p className="text-xs text-gray-500 mt-1">(40% dari total nilai)</p>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Grade</h3>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{getGrade(calculateFinalScore())}</p>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                        <Badge className={calculateFinalScore() >= 55 ? "bg-green-100 text-green-800 mt-2 text-sm" : "bg-red-100 text-red-800 mt-2 text-sm"}>
                          {calculateFinalScore() >= 55 ? "Lulus" : "Tidak Lulus"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline">Reset</Button>
                  <Button className="bg-blue-500 text-white hover:bg-blue-600">
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Penilaian
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
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
  );
};

export default DosenKerjaPraktikMahasiswaDetail;