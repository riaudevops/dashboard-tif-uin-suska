import { useState, useEffect } from "react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Building2, Phone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MahasiswaKerjaPraktikDaftarKPPermohonanFormDaftarInstansiPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="text-center border-b pb-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-96 mx-auto" />
                <Skeleton className="h-4 w-80 mx-auto" />
              </div>
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">
                  🏢 Form Pengajuan Instansi Kerja Praktik
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  ✨ Lengkapi data instansi/perusahaan untuk pengajuan kerja praktik
                  anda
                </p>
              </>
            )}
          </CardHeader>

          <CardContent className="pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Instansi/Perusahaan */}
              <div className="space-y-6">
                {isLoading ? (
                  <Skeleton className="h-8 w-48" />
                ) : (
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <Building2 className="h-5 w-5 text-blue-500" />
                    <h2 className="text-lg font-semibold">Instansi/Perusahaan</h2>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    {isLoading ? (
                      <>
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-10 w-full" />
                      </>
                    ) : (
                      <>
                        <label className="text-sm font-medium flex items-center gap-2">
                          <span>Nama Instansi / Perusahaan</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="Contoh: PT. Tech Indonesia"
                          className="w-full hover:border-blue-400 focus:border-blue-500 transition-colors"
                        />
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    {isLoading ? (
                      <>
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-44 w-full" />
                      </>
                    ) : (
                      <>
                        <label className="text-sm font-medium flex items-center gap-2">
                          <span>Alamat Instansi / Perusahaan</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                          placeholder="Masukkan alamat lengkap instansi..."
                          className="min-h-[180px] resize-none hover:border-blue-400 focus:border-blue-500 transition-colors"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Kontak Instansi */}
              <div className="space-y-6">
                {isLoading ? (
                  <Skeleton className="h-8 w-36" />
                ) : (
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <Phone className="h-5 w-5 text-blue-500" />
                    <h2 className="text-lg font-semibold">Kontak Instansi</h2>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    {isLoading ? (
                      <>
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-10 w-full" />
                      </>
                    ) : (
                      <>
                        <label className="text-sm font-medium flex items-center gap-2">
                          <span>Nama Penanggung jawab Instansi</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="Contoh: Budi Santoso"
                          className="w-full hover:border-blue-400 focus:border-blue-500 transition-colors"
                        />
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    {isLoading ? (
                      <>
                        <Skeleton className="h-4 w-48" />
                        <div className="flex gap-2">
                          <Skeleton className="h-10 w-16" />
                          <Skeleton className="h-10 flex-1" />
                        </div>
                      </>
                    ) : (
                      <>
                        <label className="text-sm font-medium flex items-center gap-2">
                          <span>No-telp penanggung jawab instansi</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                          <Select>
                            <SelectTrigger className="w-16 hover:border-blue-400 focus:border-blue-500 transition-colors">
                              <SelectValue placeholder="ID" />
                            </SelectTrigger>
                          </Select>
                          <Input
                            type="tel"
                            placeholder="Contoh: 812-3456-7890"
                            className="flex-1 hover:border-blue-400 focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-24">
              {isLoading ? (
                <>
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-48" />
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-32 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
                  >
                    Batal
                  </Button>
                  <Button className="w-48 bg-green-600 hover:bg-green-700 transition-colors">
                    Ajukan Permohonan
                  </Button>
                </>
              )}
            </div>

            {isLoading ? (
              <Skeleton className="h-4 w-96 mt-6" />
            ) : (
              <p className="text-xs text-muted-foreground mt-6">
                📝 Pastikan semua data yang diisi sudah benar sebelum mengajukan
                permohonan
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MahasiswaKerjaPraktikDaftarKPPermohonanFormDaftarInstansiPage;