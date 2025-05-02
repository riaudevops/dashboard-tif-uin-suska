import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { User, Building, ContactRound, ArrowUpRight, Calendar, FileText } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Import shadcn/ui components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const KoordinatorKerjaPraktikDailyReportDetailpage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("agenda");
  const query = new URLSearchParams(search);
  const name = query.get("name") || "-";
  const nim = query.get("nim") || "-";

  // Sample data for daily reports
  const dailyReports = [
    { id: 1, day: 25, date: "25 Februari 2025", status: "Selesai" },
    { id: 2, day: 24, date: "24 Februari 2025", status: "Selesai" },
    { id: 3, day: 23, date: "23 Februari 2025", status: "Menunggu" },
    { id: 4, day: 22, date: "22 Februari 2025", status: "Revisi" },
    { id: 5, day: 21, date: "21 Februari 2025", status: "Revisi" },
  ];

  const getstatusmahasiswa = (status : string) => {
    switch (status) {
      case "Baru":
        return "bg-green-300";
      case "Lanjut":
        return "bg-yellow-500";
      case "Selesai":
        return "bg-red-500";
      case "Gagal":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Function to determine status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Selesai":
        return "secondary";
      case "Menunggu":
        return "outline";
      case "Revisi":
        return "destructive";
      default:
        return "default";
    }
  };

  // Mock data for biodata
  const biodataMahasiswa = {
    name: "John Doe",
    nim: "123456789",
    status: "Baru",
    instansi: "PT. ABC",
    semester: 6,
    judulkp: "Pengembangan Aplikasi Web",
  };

  // Mock data for application data table
  const applicationData = [
    { id: 1, name: "John Doe", nim: "123456789" },
    { id: 2, name: "Jane Smith", nim: "987654321" },
    { id: 3, name: "Alice Johnson", nim: "456789123" }
  ];

  // Filtered data for table
  const filteredData = applicationData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.nim.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <DashboardLayout>
        {/* Biodata Section */}
        <Card className="border-none shadow-md overflow-hidden">
          <div className="bg-emerald-500 p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white dark:bg-gray-800 rounded-full h-12 w-12 flex items-center justify-center shadow-inner border border-primary/20">
                <User className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-50 dark:text-gray-100">
                  {name}
                </h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Badge variant="outline" className="bg-white text-gray-800 dark:bg-gray-800 border-gray-50 dark:border-gray-50 dark:text-gray-50 mr-2">
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
            <Badge variant="outline" className="bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300">
              {nim}
            </Badge>
          </div>

          {/* Info Cards */}
          <CardContent className="p-4 bg-emerald-50 dark:bg-emerald-950/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Judul Laporan Card */}
              <Card className="border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2.5">
                      <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardDescription className="text-xs font-medium text-gray-800 dark:text-gray-400 uppercase tracking-wider">
                        Judul Laporan
                      </CardDescription>
                      <p className="text-base text-gray-500 dark:text-gray-200">
                        {biodataMahasiswa.status === "Baru"
                          ? "Belum ada instansi"
                          : biodataMahasiswa.instansi}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pembimbing Instansi Card */}
              <Card className="border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="bg-blue-100 dark:bg-emerald-900/30 rounded-lg p-2.5">
                      <ContactRound className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardDescription className="text-xs font-medium text-gray-800 dark:text-gray-400 uppercase tracking-wider">
                        Pembimbing Instansi
                      </CardDescription>
                      <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                        Drs. Ahmad Fauzi, M.Kom
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Tabs and Table */}
        <div className="mt-6">
          <Tabs defaultValue="agenda" className="w-full" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="agenda" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                <Calendar className="h-4 w-4 mr-2" />
                Agenda Kerja Praktik
              </TabsTrigger>
              <TabsTrigger value="riwayat" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                <FileText className="h-4 w-4 mr-2" />
                Riwayat Bimbingan
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="agenda" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Laporan Harian</CardTitle>
                  <CardDescription>
                    Daftar laporan harian kegiatan kerja praktik
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-24">Hari ke-</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dailyReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.day}</TableCell>
                          <TableCell>{report.date}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(report.status)}>
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => console.log(`Viewing details for day ${report.day}`)}
                            >
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                              Lihat Detail
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="riwayat">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Riwayat Bimbingan</CardTitle>
                  <CardDescription>
                    Catatan bimbingan dengan dosen pembimbing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Topik Bimbingan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">1</TableCell>
                        <TableCell>20 Februari 2025</TableCell>
                        <TableCell>Penentuan Judul Laporan</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Selesai</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                          >
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            Lihat Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">2</TableCell>
                        <TableCell>15 Februari 2025</TableCell>
                        <TableCell>Review Bab 1</TableCell>
                        <TableCell>
                          <Badge variant="destructive">Revisi</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                          >
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            Lihat Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
};

export default KoordinatorKerjaPraktikDailyReportDetailpage;