import { useEffect, useState } from "react";
import { Search, ChevronRight, ArrowUpRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import APIDaftarKP from "@/services/api/koordinator-kp/daftar-kp.service";

// Main component
export default function KoordinatorKerjaPraktikPermohonanPage() {
  const [academicYear, setAcademicYear] = useState<number>(1);
  const [activeTab, setActiveTab] = useState("Semua Riwayat");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const stats = [
    { title: "Total Bimbingan", count: 0, label: "Mahasiswa" },
    { title: " Kerja Praktik", count: 0, label: "Mahasiswa" },
    { title: " Seminar Kerja Praktik", count: 0, label: "Mahasiswa" },
    { title: "Lanjut", count: 0, label: "Mahasiswa" },
    { title: "Selesai", count: 0, label: "Mahasiswa" },
  ];

  const { data: applicationData } = useQuery({
    queryKey: ["daftar-permohonan-mahasiswa"],
    queryFn: () =>
      APIDaftarKP.getAllPermohonanMahasiswa().then((res) => res.data),
  });

  const { data: tahunAjaran } = useQuery({
    queryKey: ["data-tahun-ajaran-koordinator-kp"],
    queryFn: () => APIDaftarKP.getTahunAjaran().then((res) => res.data),
  });

  const [filteredData, setFilteredData] = useState(applicationData);

  // Filter data based on active tab and search query
  useEffect(() => {
    const fd =
      applicationData &&
      applicationData
        .filter(
          (item: any) =>
            // Filter by active tab
            activeTab === "Semua Riwayat" || item.status === activeTab
        )
        .filter((item: any) => item.id_tahun_ajaran == academicYear)
        .filter(
          (item: any) =>
            // Filter by search query (case insensitive)
            searchTerm === "" ||
            item?.mahasiswa?.nama.toLowerCase().includes(searchTerm.toLowerCase())
        );
      setFilteredData(fd);
  }, [activeTab, applicationData, academicYear, searchTerm]);

  return (
    <DashboardLayout>
      <Card className="p-4 min-h-screen">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-4">
            Permohonan Pendaftaran Kp Mahasiswa
          </CardTitle>
        </CardHeader>

        {/* Academic Year Selector */}
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Tahun Ajaran</span>
              <div className="relative">
                <select
                  className="border rounded-md px-3 py-1 pr-8 text-sm appearance-none dark:bg-gray-800 shadow-sm"
                  value={academicYear}
                  defaultValue={tahunAjaran?.[0]?.id}
                  onChange={(e) => setAcademicYear(parseInt(e.target.value))}
                >
                  {tahunAjaran?.map((item, index) => (
                    <option selected={index === 0} key={item.id} value={item.id}>
                      {item.nama}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <ChevronRight className="h-4 w-4 text-gray-500 rotate-90" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className={`dark:bg-gray-800/30 border p-4 rounded-lg shadow-sm ${
                  index === 0
                    ? "border-l-8 border-green-500"
                    : "border-l-8 border-green-500"
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-sm text-gray-700 dark:text-white">
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-4xl font-bold my-2">
                    {stat.count}
                  </CardDescription>
                  <CardDescription className="text-xs text-blue-500">
                    {stat.label}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs and Search bar */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="bg-green-50 dark:bg-gray-800 p-0.5 rounded-md">
                  <TabsTrigger
                    value="Semua Riwayat"
                    className="text-sm font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md"
                  >
                    Semua Riwayat
                  </TabsTrigger>
                  <TabsTrigger
                    value="Baru"
                    className="text-sm font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md"
                  >
                    Baru
                  </TabsTrigger>
                  <TabsTrigger
                    value="Lanjut"
                    className="text-sm font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md"
                  >
                    Lanjut
                  </TabsTrigger>
                  <TabsTrigger
                    value="Gagal"
                    className="text-sm font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md"
                  >
                    Gagal
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="relative w-64">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                placeholder="Cari nama mahasiswa..."
                className="pl-8 pr-4 py-2 w-full dark:bg-gray-800 dark:border-gray-700 rounded-full border border-gray-300  focus:ring-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="w-full bg-white dark:bg-gray-800 rounded-md border">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-900">
                <TableRow>
                  <TableHead className="text-center font-semibold">
                    No
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    Nama Mahasiswa
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    {activeTab === "Semua Riwayat" ? "Status" : "NIM"}
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    Waktu Pengajuan
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData &&
                  filteredData.map((item: any, i: number) => (
                    <TableRow
                      key={item.id}
                      className={
                        i % 2 === 0
                          ? "bg-white dark:bg-gray-800"
                          : "bg-gray-50 dark:bg-gray-900/30"
                      }
                    >
                      <TableCell className="text-center font-medium">
                        {i + 1}
                      </TableCell>
                      <TableCell className="text-center">
                        {item?.mahasiswa?.nama || "John"}
                      </TableCell>
                      <TableCell className="text-center">
                        {activeTab === "Semua Riwayat" ? (
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              item.status === "Baru"
                                ? "bg-blue-100 text-blue-800"
                                : item.status === "Lanjut"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        ) : (
                          item?.mahasiswa?.nim || "1323123121"
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {item &&
                          item.tanggal_mulai &&
                          item.tanggal_mulai.slice(0, 10).replaceAll("-", "/")}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          className="bg-blue-500 text-white hover:bg-blue-600 font-medium flex items-center gap-1 mx-auto"
                          onClick={() =>
                            navigate(
                              `/koordinator-kp/kerja-praktik/permohonan/detail-permohonan/${item.id}`
                            )
                          }
                        >
                          <ArrowUpRight className="h-4 w-4" />
                          Lihat Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {filteredData && (
              <div className="p-2 text-sm text-gray-500 border-t">
                {filteredData.length} of {applicationData.length} row(s)
                selected.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}