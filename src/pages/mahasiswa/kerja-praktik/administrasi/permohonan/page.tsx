import { useState, useEffect } from "react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import {
  Clipboard,
  ArrowRight,
  MapPinHouse,
  CalendarDays,
  CircleFadingArrowUp,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface KPRegistration {
  id: string;
  status: string;
  company: string;
  date: string;
  progress: string;
}

const MahasiswaKerjaPraktekDaftarKpPermohonanPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubmission, setHasSubmission] = useState(false);
  const [submissionData, setSubmissionData] = useState<any>(null);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      const savedSubmission = localStorage.getItem("kpSubmission");
      if (savedSubmission) {
        const data = JSON.parse(savedSubmission);
        if (data.submitted) {
          setHasSubmission(true);
          setSubmissionData(data);
        }
      }
    }, 2000);
  }, []);

  const activeRegistration: KPRegistration = {
    id: "#3",
    status: "Gagal",
    company: "PL Rapp",
    date: "2025-02-28",
    progress: "Kelengkapan Berkas",
  };

  const previousRegistration: KPRegistration = {
    id: "#2",
    status: "Lanjut",
    company: "PT. Indah Kiat",
    date: "2025-01-20",
    progress: "Pendaftaran Ditolak",
  };

  const renderSubmissionStatus = () => (
    <div className="p-4 space-y-4">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold">
            Permohonan Pendaftaran Kerja Praktik
          </h2>
          <p className="mt-2 mb-4 text-gray-600">
            Pengajuan pendaftaran kerja praktik anda dalam{" "}
            <span className="font-medium text-blue-600">
              proses kelengkapan berkas
            </span>
            ...
          </p>

          <div className="flex justify-between">
          <Card className="p-8 w-[40%]">
            {/* Informasi Pengajuan */}
            <div className="space-y-6">
              <div>
                <h3 className=" font-xl">
                  Nama Instansi Pengajuan :
                </h3>
                <p className="mt-1 text-gray-700">{submissionData?.company}</p>
              </div>

              <div>
                <h3 className="font-xl">
                  Proses Validasi Terkini Pada Alur :
                </h3>
                <p className="mt-1 text-gray-700">{submissionData?.status}</p>
              </div>
            </div>
           </Card> 
            

            {/* Progress Surat Pengantar Dekan */}
            <div className="w-1/2 mt-8">
              <h3 className="mb-4 text-lg font-medium text-center">
                Progress Surat Pengantar Dekan:
              </h3>
              <div className="relative flex items-center justify-between py-4">
                {/* Progress Line */}
                <motion.div
                  className="absolute h-1 bg-gray-200 rounded-full"
                  style={{ top: "40%", left: "10%", width: "90%" }}
                />
                <motion.div
                  className="absolute h-1 bg-green-400 rounded-full"
                  style={{ top: "40%", left: "10%", width: "40%" }}
                  initial={{ width: "0%" }}
                  animate={{ width: "40%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                />

                {/* Steps */}
                {["Permohonan", "Cetak", "Selesai"].map((step, index) => (
                  <div
                    key={step}
                    className="relative z-10 flex flex-col items-center"
                  >
                    {index === 0 && (
                      <motion.div
                        className="absolute w-12 h-12 bg-green-300 rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      />
                    )}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.3 }}
                      className={`relative w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-colors ${
                        index === 0 ? "bg-green-500" : "bg-blue-500"
                      }`}
                    >
                      {index === 0 ? (
                        <CheckCircle2 className="text-white w-7 h-7" />
                      ) : (
                        <Info className="text-white w-7 h-7" />
                      )}
                    </motion.div>
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.5 }}
                      className={`mt-2 text-sm font-medium ${
                        index === 0 ? "text-black" : "text-gray-600"
                      }`}
                    >
                      {step}
                    </motion.span>
                  </div>
                ))}
              </div>
            </div>  
            </div>       
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            {isLoading ? (
              <Skeleton className="w-48 h-8" />
            ) : (
              <CardTitle className="pb-2 text-2xl font-semibold tracking-tight">
                📊 Detail Riwayat
              </CardTitle>
            )}
          </div>
          <div className="space-y-4">
            <div>
              {isLoading ? (
                <Skeleton className="w-24 h-6 mb-3" />
              ) : (
                <h3 className="mb-3 text-lg font-medium">🎯 Aktif</h3>
              )}
              {isLoading ? (
                <Skeleton className="w-full h-40" />
              ) : (
                <Card className="transition-colors duration-300 bg-purple-800 hover:bg-purple-950">
                  <CardContent className="px-6 py-6">
                    <div className="text-center text-white">
                      <h1 className="font-bold font-xl">
                        Anda sekarang tidak sedang melakukan pendaftaran atau
                        pelaksanaan kp
                      </h1>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              {isLoading ? (
                <Skeleton className="w-40 h-6 mb-3" />
              ) : (
                <h3 className="mb-3 text-lg font-medium">
                  📜 Riwayat Sebelumnya
                </h3>
              )}
              {isLoading ? (
                <Skeleton className="w-full h-40" />
              ) : (
                <Card className="transition-colors duration-300 bg-purple-800 hover:bg-purple-950">
                  <CardContent className="px-6 py-8">
                    <div className="flex justify-between text-white">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2">
                          <Clipboard className="w-5 h-5" />
                          <Badge
                            className="px-3 py-1 text-sm bg-white/20"
                            variant="destructive"
                          >
                            Status kp: {previousRegistration.status}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <MapPinHouse className="w-5 h-5" />
                            <span className="text-sm">
                              {previousRegistration.company}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-5 h-5" />
                            <span className="text-sm">
                              {previousRegistration.date}
                            </span>
                          </div>
                        </div>
                        <div className="text-xl font-semibold">
                          Pendaftaran Kp {previousRegistration.id}
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <div className="text-sm">
                          ⏳ Progress : {previousRegistration.progress}
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="transition-transform duration-200 w-fit group hover:scale-105"
                        >
                          View Detail
                          <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              {isLoading ? (
                <Skeleton className="w-full h-40" />
              ) : (
                <Card className="transition-colors duration-300 bg-purple-800 hover:bg-purple-950">
                  <CardContent className="px-6 py-8">
                    <div className="flex justify-between text-white">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2">
                          <Clipboard className="w-5 h-5" />
                          <Badge
                            className="px-3 py-1 text-sm bg-white/20"
                            variant="destructive"
                          >
                            Status kp: {activeRegistration.status}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <MapPinHouse className="w-5 h-5" />
                            <span className="text-sm">
                              {activeRegistration.company}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-5 h-5" />
                            <span className="text-sm">
                              {activeRegistration.date}
                            </span>
                          </div>
                        </div>
                        <div className="text-xl font-bold">
                          Pendaftaran Kp {activeRegistration.id}
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <div className="text-sm">
                          ⏳ Progress : {activeRegistration.progress}
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="transition-transform duration-200 w-fit group hover:scale-105"
                        >
                          View Detail
                          <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );

  const renderInitialState = () => (
    <div className="p-4 space-y-4">
      <CardHeader className="p-0 pb-2.5">
        <CardTitle className="text-4xl font-bold">
          {isLoading ? (
            <Skeleton className="w-64 h-8" />
          ) : (
            <span>✨ Pendaftaran Kerja Praktik </span>
          )}
        </CardTitle>
      </CardHeader>

      <Card>
        <CardHeader>
          {isLoading ? (
            <Skeleton className="w-64 h-8" />
          ) : (
            <CardTitle>📝 Permohonan Pendaftaran Kerja Praktik</CardTitle>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="w-3/4 h-6" />
              <Skeleton className="w-40 h-10" />
            </div>
          ) : (
            <>
              <p className="mb-4 text-muted-foreground">
                Silakan Ajukan Permohonan Pendaftaran Kerja Praktik Pada Tombol Dibawah
                ini!
              </p>
              <Link to="/mahasiswa/kerja-praktik/daftar-kp/permohonan/form-pendaftaran">
                <Button className="text-black bg-white border border-black hover:bg-gray-100 group">
                  Buat Permohonan
                  <CircleFadingArrowUp className="w-4 h-4 group-hover:animate-bounce" />
                </Button>
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <DashboardLayout>
      {hasSubmission ? renderSubmissionStatus() : renderInitialState()}
    </DashboardLayout>
  );
};

export default MahasiswaKerjaPraktekDaftarKpPermohonanPage;