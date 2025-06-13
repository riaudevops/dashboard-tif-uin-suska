import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, useNavigate } from "react-router-dom";

const MahasiswaKerjaPraktekDaftarKpPermohonanFromPendaftaranPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    status: '',
    tanggalMulai: '',
    instansi: '',
    tujuanSurat: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Save form data to localStorage
    localStorage.setItem('kpSubmission', JSON.stringify({
      status: 'Pengajuan pendaftaran kp',
      company: 'PT. RAPP',
      submitted: true,
      formData
    }));
    
    // Navigate back to main page
    navigate('/mahasiswa/kerja-praktik/daftar-kp/permohonan');
  };

  return (
    <DashboardLayout>
      <Card className="w-full">
        <CardHeader className="text-center border-b">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-96 mx-auto" />
              <Skeleton className="h-4 w-80 mx-auto" />
            </div>
          ) : (
            <>
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                📝 Form Pendaftaran Kerja Praktik 🛠️
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Silakan isi form berikut untuk mendaftar KP 👩‍💻👨‍💻
              </p>
            </>
          )}
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {isLoading ? (
                <Skeleton className="h-8 w-48" />
              ) : (
                <div className="border-b pb-2">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    🗓️ Periode Kerja Praktik
                  </h2>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-10 w-full" />
                    </>
                  ) : (
                    <>
                      <label className="text-sm font-medium flex items-center gap-1">
                        🟢 Status Kerja Praktik
                      </label>
                      <Select onValueChange={(value) => handleChange('status', value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Baru" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baru">Baru KP ✨</SelectItem>
                          <SelectItem value="gagal">Gagal KP ❌</SelectItem>
                          <SelectItem value="ulang">Perpanjang KP 🔁</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-10 w-full" />
                    </>
                  ) : (
                    <>
                      <label className="text-sm font-medium flex items-center gap-1">
                        📅 Tanggal Mulai
                      </label>
                      <Input 
                        type="date" 
                        className="w-full"
                        onChange={(e) => handleChange('tanggalMulai', e.target.value)}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {isLoading ? (
                <Skeleton className="h-8 w-48" />
              ) : (
                <div className="border-b pb-2">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    🏢 Instansi/Perusahaan
                  </h2>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-4 w-44" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-4 w-64" />
                    </>
                  ) : (
                    <>
                      <label className="text-sm font-medium flex items-center gap-1">
                        🏭 Nama Instansi / Perusahaan
                      </label>
                      <Select onValueChange={(value) => handleChange('instansi', value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Instansi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt-rapp">PT. RAPP 🌟</SelectItem>
                          <SelectItem value="pt-indah-kiat">PT. Indah Kiat 🚀</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        ⚠️ Instansi Belum Terdaftar? Segera Daftarkan{" "}
                        <Link
                          to="/mahasiswa/kerja-praktik/daftar-kp/permohonan/form-daftar-instansi"
                          className="text-blue-600 hover:underline"
                        >
                          Disini 📝
                        </Link>
                      </p>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-4 w-56" />
                      <Skeleton className="h-36 w-full" />
                      <Skeleton className="h-4 w-32" />
                    </>
                  ) : (
                    <>
                      <label className="text-sm font-medium flex items-center gap-1">
                        ✉️ Tujuan Surat Dan Nama Instansi/Perusahaan
                      </label>
                      <Textarea
                        placeholder="Masukkan deskripsi..."
                        className="min-h-[150px] w-full"
                        onChange={(e) => handleChange('tujuanSurat', e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        📑 Format penulisan{" "}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="text-blue-600 hover:underline inline-flex items-center gap-1">
                                Disini <span className="text-base">📝</span>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-md p-6 bg-white shadow-lg rounded-lg border border-gray-200">
                              <div className="space-y-4">
                                <div className="border-b pb-3">
                                  <h3 className="font-bold text-sm text-gray-900 mb-1">
                                    TUJUAN SURAT DAN NAMA INSTANSI/PERUSAHAAN KP
                                  </h3>
                                </div>

                                <div className="space-y-3 text-gray-700">
                                  <p className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                    Tuliskan nama tujuan surat dan
                                    instansi/perusahaan tujuan pelaksanaan KP dengan
                                    <span className="font-semibold">
                                      {" "}
                                      BENAR dan TANPA DISINGKAT
                                    </span>
                                    .
                                  </p>

                                  <p>
                                    Nama instansi/perusahaan yang Anda input akan
                                    ditulis pada tujuan Surat Pengantar KP.
                                  </p>

                                  <p>
                                    Kesalahan dalam penulisan Nama
                                    Instansi/Perusahaan adalah tanggung jawab Anda.
                                  </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                  <p className="font-medium text-gray-900">
                                    Contoh Penulisan:
                                  </p>
                                  <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
                                    <li>Kepala Sekolah SMK Negeri 4 Pekanbaru</li>
                                    <li>Kepala HRD PT. ABC (Tbk)</li>
                                    <li>Manager PT. Pertamina Hulu Rokan Rumbai</li>
                                    <li>Kepala Dinas Pendidikan Kota Pekanbaru</li>
                                    <li>Kepala Dinas Pertanahan Provinsi Riau</li>
                                  </ul>
                                </div>

                                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                                    <span className="text-yellow-600">⚠️</span>
                                    PENTING: Sebaiknya cari tau terlebih dahulu ke
                                    instansi tujuan kemana surat pengantar dari
                                    Dekan akan ditujukan.
                                  </p>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-8">
            {isLoading ? (
              <>
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-48" />
              </>
            ) : (
              <>
                <Link to="/mahasiswa/kerja-praktik/daftar-kp/permohonan">
                  <Button
                    variant="outline"
                    className="w-32 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
                  >
                    Batal
                  </Button>
                </Link>
                <Button 
                  className="w-48 bg-green-600 hover:bg-green-700 transition-colors"
                  onClick={handleSubmit}
                >
                  Ajukan Permohonan
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default MahasiswaKerjaPraktekDaftarKpPermohonanFromPendaftaranPage;