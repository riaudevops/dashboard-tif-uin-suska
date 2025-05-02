import { useState } from "react";
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

// Main component
export default function KoordinatorKerjaPraktikDailyReportpage() {
  const [academicYear, setAcademicYear] = useState("2023-2024 Ganjil");
  const [activeTab, setActiveTab] = useState("Semua Riwayat");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Data from the image
  const applicationData = [
    {
      id: 1,
      name: "Gilang Ramadhan",
      nim: "1225111212",
      Angkatan: "2022",
    },
    {
      id: 2,
      name: "Farhan Fadilla",
      nim: "1225111212",
      Angkatan: "2022",
    },
    {
      id: 3,
      name: "Ahmad Kurniawan",
      nim: "1225111212",
      Angkatan: "2022",
    },
    {
      id: 4,
      name: "Muh Zaki Erbay",
      nim: "1225111212",
      Angkatan: "2024",
    },
    {
      id: 5,
      name: "M. Rafly Wirayudha",
      nim: "1225111212",
      Angkatan: "2023",
    },
  ];

  const filteredData = applicationData
    .filter(
      (item) => activeTab === "Semua Riwayat" || item.Angkatan === activeTab
    )
    .filter(
      (item) =>
        searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <DashboardLayout>
      <div className="p-4 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Daily Report Mahasiswa</h1>

        {/* Academic Year Selector */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Tahun Ajaran</span>
            <div className="relative">
              <select
                className="border rounded-lg px-3 py-1 pr-8 text-sm appearance-none dark:bg-gray-800 shadow-sm"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
              >
                <option value="2023-2024 Ganjil">2023-2024 Ganjil</option>
                <option value="2023-2024 Genap">2023-2024 Genap</option>
                <option value="2022-2023 Ganjil">2022-2023 Ganjil</option>
                <option value="2022-2023 Genap">2022-2023 Genap</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <ChevronRight className="h-4 w-4 text-gray-500 rotate-90" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Search bar */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="bg-blue-100 dark:bg-blue-900/30 p-0.5 rounded-md">
                <TabsTrigger
                  value="Semua Riwayat"
                  className="text-sm font-medium data-[state=active]:bg-blue-600 dark:data-[state=active]:bg-blue-700 data-[state=active]:text-white rounded-md"
                >
                  Semua Angkatan
                </TabsTrigger>
                <TabsTrigger
                  value="2022"
                  className="text-sm font-medium data-[state=active]:bg-blue-600 dark:data-[state=active]:bg-blue-700 data-[state=active]:text-white rounded-md"
                >
                  2022
                </TabsTrigger>
                <TabsTrigger
                  value="2023"
                  className="text-sm font-medium data-[state=active]:bg-blue-600 dark:data-[state=active]:bg-blue-700 data-[state=active]:text-white rounded-md"
                >
                  2023
                </TabsTrigger>
                <TabsTrigger
                  value="2024"
                  className="text-sm font-medium data-[state=active]:bg-blue-600 dark:data-[state=active]:bg-blue-700 data-[state=active]:text-white rounded-md"
                >
                  2024
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="relative w-64">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              placeholder="Cari nama mahasiswa..."
              className="pl-8 ml-2 py-2 w-full rounded-md border border-gray-300 dark:bg-gray-700/10 focus:outline-none  focus:ring-blue-300 dark:focus:ring-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="w-full bg-white dark:bg-gray-900/20 rounded-md border shadow-md">
          <Table>
            <TableHeader className=" bg-gray-200 dark:bg-gray-900/10">
              <TableRow>
                <TableHead className="text-center uppercase font-semibold ">
                  No
                </TableHead>
                <TableHead className="text-center uppercase font-semibold ">
                  Nama Mahasiswa
                </TableHead>
                <TableHead className="text-center uppercase font-semibold ">
                  Nim
                </TableHead>
                <TableHead className="text-center uppercase font-semibold ">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow
                  key={item.id}
                  className={
                    item.id % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-900/10"
                      : "bg-gray-50 dark:bg-gray-800"
                  }
                >
                  <TableCell className="text-center font-medium">
                    {item.id}
                  </TableCell>
                  <TableCell className="text-center">{item.name}</TableCell>
                  <TableCell className="text-center">{item.nim}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      className="border-gray-300 bg-blue-500 text-white hover:bg-blue-600 font-medium flex items-center gap-1 mx-auto"
                      onClick={() =>
                        navigate(
                          `/Koordinator-kp/Kerja-Praktik/Daily-Report/Detail-Mahasiswa?name=${item.name}&nim=${item.nim}`
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
          <div className="p-2 text-sm text-gray-500 border-t">
            {filteredData.length} of {applicationData.length} row(s) selected.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
