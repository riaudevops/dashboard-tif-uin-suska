import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import Stepper from "@/components/mahasiswa/seminar/stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, UserRound, Book, CalendarCheck, Award } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { infoPengajuanSeminar } from "@/pages/mahasiswa/seminar/validasi-berkas/page";
import Status from "../status";
import { motion } from "framer-motion";

export default function Step6({
  activeStep,
  status,
}: {
  activeStep: number;
  status: string;
}) {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-8">
        Validasi Kelengkapan Berkas Seminar Kerja Praktik
      </h1>
      <Stepper activeStep={activeStep} />
      <div className="p-4">
        {/* Header */}

        <div className="flex flex-col gap-12">
          <motion.div
            className="relative overflow-hidden bg-white dark:bg-black rounded-xl shadow-sm dark:shadow-xl text-gray-800 dark:text-white py-8 px-6 border border-gray-100 dark:border-none"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 dark:from-purple-600/20 dark:via-transparent via-transparent to-purple-100/60 dark:to-blue-600/20"></div>

            {/* Decorative Bubbles */}
            <motion.div
              className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-blue-400/20 dark:bg-purple-500/30 blur-md"
              animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-1/2 -right-4 w-12 h-12 rounded-full bg-purple-400/20 dark:bg-blue-500/30 blur-md"
              animate={{ y: [0, 10, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-6 left-10 w-8 h-8 rounded-full bg-pink-400/20 dark:bg-pink-500/30 blur-md"
              animate={{ x: [0, 10, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            />

            <div className="flex justify-between items-center mb-6">
              <div className="w-12 h-1 bg-gradient-to-r from-blue-500 dark:from-purple-500 to-transparent rounded-full"></div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                className="relative"
              >
                <Award
                  className="w-12 h-12 text-blue-600 dark:text-yellow-300"
                  strokeWidth={1.5}
                />
                <motion.div
                  className="absolute inset-0 bg-blue-400/20 dark:bg-yellow-300/20 rounded-full blur-md"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </motion.div>
              <div className="w-12 h-1 bg-gradient-to-l from-blue-500 dark:from-purple-500 to-transparent rounded-full"></div>
            </div>

            <h1 className="text-center text-2xl font-bold mb-3">
              <span className="text-blue-600 dark:text-purple-300">
                Selamat!
              </span>{" "}
              Proses Seminar Kerja Praktik Anda
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-yellow-300 dark:to-orange-400">
                {" "}
                Berhasil
              </span>
            </h1>

            <div className="bg-blue-50 dark:bg-white/10 backdrop-blur-sm rounded-xl p-3 mt-4 border border-blue-100 dark:border-transparent">
              <p className="text-center text-xs font-medium text-gray-700 dark:text-white/80">
                Silakan Cek Berkala Untuk Progress Nilai Anda
              </p>
            </div>
          </motion.div>
        </div>

        {status === "belum" && (
          <>
            {/* <Status
              status="belum"
              title="Nilai Anda Masih dalam Proses Validasi"
              subtitle="Mohon bersabar"
            /> */}
            <div className="flex gap-10 mt-6 justify-center ">
              <Card className="flex flex-col w-fit  rounded-lg overflow-visible relative bg-yellow-300 shadow-lg -rotate-1 transform  mt-6">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-500 rounded-full shadow-md z-10 flex items-center justify-center">
                  <div className="w-2 h-2 bg-yellow-800 rounded-full"></div>
                </div>

                <CardHeader className="pb-0 pt-6">
                  <CardTitle className="text-base font-semibold text-yellow-900">
                    # Nilai Mata Kuliah Kerja Praktik Anda
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col gap-4 flex-grow p-4   justify-center">
                  <span className="font-bold text-6xl text-center text-yellow-900">
                    0.00 (E)
                  </span>
                </CardContent>
              </Card>

              <Card className="overflow-hidden rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-4">
                  <CardTitle className="text-white text-lg font-medium">
                    Informasi Diseminasi Kerja Praktik Anda
                  </CardTitle>
                </CardHeader>
                <Separator className="mb-4" />
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="flex flex-row items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                      <Book className="size-4" />
                      Judul Laporan:
                    </h3>
                    <p className="text-muted-foreground">
                      {infoPengajuanSeminar.judul}
                    </p>
                  </div>
                  <Separator />

                  <div className="flex justify-between items-center w-full">
                    <div className="flex-1">
                      <h3 className="flex flex-row items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                        <Map className="size-4" />
                        Lokasi Kerja Praktik:
                      </h3>
                      <p className="text-muted-foreground">
                        {infoPengajuanSeminar.lokasi}
                      </p>
                    </div>

                    <Separator orientation="vertical" className="mx-4 h-12" />

                    <div className="flex-1 ">
                      <h3 className="flex items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                        <UserRound className="size-4" />
                        Dosen Pembimbing
                      </h3>
                      <p className=" text-muted-foreground">
                        {infoPengajuanSeminar.dosenPembimbing}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center w-full">
                    <div className="flex-1">
                      <h3 className="flex flex-row items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                        <CalendarCheck className="size-4" />
                        Lama Kerja Praktik
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        20 JANUARI 2025 - 18 JUNI 2025
                      </p>
                    </div>

                    <Separator orientation="vertical" className="mx-4 h-12" />

                    <div className="flex-1 ">
                      <h3 className="flex items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                        <UserRound className="size-4" />
                        Dosen Penguji
                      </h3>
                      <p className=" text-muted-foreground">
                        {infoPengajuanSeminar.dosenPenguji}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
        {status === "validasi" && (
          <>
            <div className="flex gap-10 mt-6 justify-center ">
              <Card className="flex flex-col w-fit  rounded-lg overflow-visible relative bg-yellow-300 shadow-lg -rotate-1 transform  mt-6">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-500 rounded-full shadow-md z-10 flex items-center justify-center">
                  <div className="w-2 h-2 bg-yellow-800 rounded-full"></div>
                </div>

                <CardHeader className="pb-0 pt-6">
                  <CardTitle className="text-base font-semibold text-yellow-900">
                    # Nilai Mata Kuliah Kerja Praktik Anda
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col gap-4 flex-grow p-4   justify-center">
                  <span className="font-bold text-6xl text-center text-green-700">
                    100 (A)
                  </span>
                </CardContent>
              </Card>

              <Card className="overflow-hidden rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-4">
                  <CardTitle className="text-white text-lg font-medium">
                    Informasi Diseminasi Kerja Praktik Anda
                  </CardTitle>
                </CardHeader>
                <Separator className="mb-4" />
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="flex flex-row items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                      <Book className="size-4" />
                      Judul Laporan:
                    </h3>
                    <p className="text-muted-foreground">
                      {infoPengajuanSeminar.judul}
                    </p>
                  </div>
                  <Separator />

                  <div className="flex justify-between items-center w-full">
                    <div className="flex-1">
                      <h3 className="flex flex-row items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                        <Map className="size-4" />
                        Lokasi Kerja Praktik:
                      </h3>
                      <p className="text-muted-foreground">
                        {infoPengajuanSeminar.lokasi}
                      </p>
                    </div>

                    <Separator orientation="vertical" className="mx-4 h-12" />

                    <div className="flex-1 ">
                      <h3 className="flex items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                        <UserRound className="size-4" />
                        Dosen Pembimbing
                      </h3>
                      <p className=" text-muted-foreground">
                        {infoPengajuanSeminar.dosenPembimbing}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center w-full">
                    <div className="flex-1">
                      <h3 className="flex flex-row items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                        <CalendarCheck className="size-4" />
                        Lama Kerja Praktik
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        20 JANUARI 2025 - 18 JUNI 2025
                      </p>
                    </div>

                    <Separator orientation="vertical" className="mx-4 h-12" />

                    <div className="flex-1 ">
                      <h3 className="flex items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                        <UserRound className="size-4" />
                        Dosen Penguji
                      </h3>
                      <p className=" text-muted-foreground">
                        {infoPengajuanSeminar.dosenPenguji}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
