import { useState } from 'react';
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MahasiswaKerjaPraktikDailyReportRiwayatBimbinganPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [bimbinganHistory] = useState([
    {
      id: 1,
      tanggal: "2024-02-10",
      topik: "Review Bab 1 Laporan KP",
      pembimbing: "Dr. Siti Aminah, M.Kom",
      status: "Selesai",
      catatan: "Perbaiki latar belakang dan rumusan masalah"
    },
    {
      id: 2,
      tanggal: "2024-02-15",
      topik: "Diskusi Metodologi Penelitian",
      pembimbing: "Dr. Siti Aminah, M.Kom",
      status: "Proses",
      catatan: "Tambahkan referensi terkait metode yang digunakan"
    },
    {
      id: 3,
      tanggal: "2024-02-20",
      topik: "Review Progress Implementasi",
      pembimbing: "Dr. Siti Aminah, M.Kom",
      status: "Terjadwal",
      catatan: "Persiapkan demo aplikasi"
    }
  ]);

  // Simulate loading for demo purposes
  setTimeout(() => {
    setIsLoading(false);
  }, 2000);

  return (
    <DashboardLayout>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-40" />
              </>
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">Riwayat Bimbingan</CardTitle>
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  Ajukan Bimbingan
                </Button>
              </>
            )}
          </CardHeader>
          <CardContent>
            {/* Filter and Search Section */}
            {isLoading ? (
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Skeleton className="h-10 flex-1" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-[140px]" />
                  <Skeleton className="h-10 w-[140px]" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Cari riwayat bimbingan..." className="pl-8" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[140px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="selesai">Selesai</SelectItem>
                      <SelectItem value="proses">Proses</SelectItem>
                      <SelectItem value="terjadwal">Terjadwal</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Pilih Tanggal
                  </Button>
                </div>
              </div>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {isLoading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardContent className="pt-4">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-8 w-16" />
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                <>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-sm font-medium text-muted-foreground mb-1">Total Bimbingan</div>
                      <div className="text-2xl font-bold">8</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-sm font-medium text-muted-foreground mb-1">Bimbingan Bulan Ini</div>
                      <div className="text-2xl font-bold">3</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-sm font-medium text-muted-foreground mb-1">Bimbingan Terjadwal</div>
                      <div className="text-2xl font-bold">1</div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {isLoading ? (
                      <>
                        <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                        <TableHead><Skeleton className="h-4 w-32" /></TableHead>
                        <TableHead><Skeleton className="h-4 w-40" /></TableHead>
                        <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                        <TableHead><Skeleton className="h-4 w-48" /></TableHead>
                      </>
                    ) : (
                      <>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Topik</TableHead>
                        <TableHead>Pembimbing</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Catatan</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <>
                      {[1, 2, 3].map((i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                        </TableRow>
                      ))}
                    </>
                  ) : (
                    <>
                      {bimbinganHistory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.tanggal}</TableCell>
                          <TableCell>{item.topik}</TableCell>
                          <TableCell>{item.pembimbing}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                item.status === "Selesai"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : item.status === "Proses"
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              }
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {item.catatan}
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
    </DashboardLayout>
  );
};

export default MahasiswaKerjaPraktikDailyReportRiwayatBimbinganPage;