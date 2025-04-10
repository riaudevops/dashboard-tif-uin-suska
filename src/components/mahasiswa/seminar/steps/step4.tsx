import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import Stepper from "@/components/mahasiswa/seminar/stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UserRound,
  Book,
  DoorOpen,
  TimerIcon,
  PartyPopper,
  Calendar,
  Clock,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function Step4({ activeStep }: { activeStep: number }) {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-8">
        Validasi Kelengkapan Berkas Seminar Kerja Praktik
      </h1>
      <Stepper activeStep={activeStep} />
      <div>
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-4  pb-4 relative overflow-hidden w-full">
          {/* Left countdown card - fixed width */}
          <motion.div
            className="h-56 w-56 lg:h-auto flex-shrink-0"
            transition={{ type: "spring", stiffness: 300 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-600 dark:from-emerald-500 dark:to-teal-700 rounded-xl p-6 text-center flex flex-col justify-center items-center transform-gpu shadow-lg">
              {/* Animated particles */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-white/30"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 3,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </motion.div>

              {/* Glowing circle behind clock */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white/10 blur-xl" />

              {/* Animated clock */}
              <div className="relative flex justify-center">
                <div className="size-16 rounded-full flex items-center justify-center mb-2 ">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Clock className="w-10 h-10 text-white drop-shadow-md" />
                  </motion.div>
                </div>
              </div>

              {/* Countdown display */}
              <h2 className="text-6xl font-bold text-white mt-3 drop-shadow-lg">
                H-5
              </h2>

              {/* Pulse effect behind text */}
              <motion.div
                className="absolute w-32 h-12 rounded-full bg-white/10 blur-md"
                style={{ top: "60%" }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* Label */}
              <span className="relative text-xs text-emerald-100 uppercase tracking-wider font-medium mt-3 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                MENUJU SEMINAR
              </span>

              {/* Decorative corner accents */}
              <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-white/30 rounded-tl-lg" />
              <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-white/30 rounded-tr-lg" />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-white/30 rounded-bl-lg" />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-white/30 rounded-br-lg" />
            </div>
          </motion.div>

          {/* Right announcement card - expand to fill space */}
          <motion.div
            className="flex-1 rounded-xl overflow-hidden relative border border-gray-100 dark:border-none bg-white dark:bg-black min-h-56"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Background gradient */}
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

            {/* Add more decorative elements to fill the width */}
            <motion.div
              className="absolute top-1/4 right-1/4 w-24 h-24 rounded-full bg-indigo-400/10 dark:bg-indigo-500/20 blur-xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            />

            <motion.div
              className="absolute bottom-1/3 right-1/5 w-16 h-16 rounded-full bg-blue-400/10 dark:bg-blue-500/20 blur-lg"
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
            />

            <div className="relative h-full p-6 sm:p-8 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100/80 text-blue-700 hover:bg-blue-200/80 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 backdrop-blur-sm">
                    Seminar-KP
                  </Badge>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 dark:from-purple-500 to-transparent rounded-full"></div>
                </div>

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 10,
                    ease: "linear",
                  }}
                  className="relative"
                >
                  <PartyPopper
                    className="w-8 h-8 text-blue-500 dark:text-pink-300"
                    strokeWidth={1.5}
                  />
                  <motion.div
                    className="absolute inset-0 bg-blue-400/20 dark:bg-pink-300/20 rounded-full blur-md"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </motion.div>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4 text-gray-800 dark:text-white">
                <span className="text-blue-600 dark:text-purple-300">
                  Semoga Sukses Dalam
                </span>{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-pink-300 dark:to-blue-300">
                  Pelaksanaan Seminar! ✨
                </span>
              </h1>

              <div className="bg-blue-50 dark:bg-white/10 backdrop-blur-sm rounded-xl p-3 mt-2 max-w-xl border border-blue-100 dark:border-transparent">
                <p className="text-gray-700 dark:text-white/80 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                  Jadwal & informasi Dosen Penguji Anda sudah siap
                </p>
              </div>

              <div className="w-24 h-1 bg-gradient-to-l from-blue-500 dark:from-purple-500 to-transparent rounded-full self-end"></div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Card - Seminar Information */}
          <Card className="overflow-hidden rounded-xl border border-emerald-100 dark:border-emerald-900/30">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-4">
              <CardTitle className="text-white text-lg font-medium">
                Informasi Seminar KP Anda
              </CardTitle>
            </CardHeader>

            <Separator className="mb-4 " />
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center w-full">
                <div className="flex-1">
                  <h3 className="flex items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                    <TimerIcon className="size-4" />
                    Waktu / Tanggal
                  </h3>
                  <p className="font-medium text-muted-foreground">
                    10.00 Wib / 13 Feb 2025
                  </p>
                </div>

                <Separator orientation="vertical" className="mx-4 h-12" />

                <div className="flex-1 ">
                  <h3 className="flex items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                    <DoorOpen className="size-4" />
                    Ruangan
                  </h3>
                  <p className="font-medium text-muted-foreground">FST 301</p>
                </div>
              </div>
              <Separator className="" />
              <div className="flex justify-between items-center w-full">
                <div className="flex-1">
                  <h3 className="flex flex-row items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                    <UserRound className="size-4" />
                    Dosen Pembimbing
                  </h3>
                  <p className="font-medium text-muted-foreground">
                    Pizaini,S.T, M.Kom
                  </p>
                </div>

                <Separator orientation="vertical" className="mx-4 h-12" />

                <div className="flex-1 ">
                  <h3 className="flex items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                    <DoorOpen className="size-4" />
                    Kontak Pembimbing
                  </h3>
                  <p className="font-medium text-muted-foreground">
                    082135467289
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center w-full">
                <div className="flex-1">
                  <h3 className="flex flex-row items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                    <UserRound className="size-4" />
                    Dosen Penguji
                  </h3>
                  <p className="font-medium text-muted-foreground">
                    Iwan Iskandar,M.T
                  </p>
                </div>

                <Separator orientation="vertical" className="mx-4 h-12" />

                <div className="flex-1 ">
                  <h3 className="flex items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                    <DoorOpen className="size-4" />
                    Kontak Penguji
                  </h3>
                  <p className="font-medium text-muted-foreground">
                    089735739837
                  </p>
                </div>
              </div>
              <Separator className=" " />
              <div>
                <h3 className="flex flex-row items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                  <Book className="size-4" />
                  Judul Laporan
                </h3>
                <p className="font-medium text-muted-foreground">
                  Analisis Sistem Keamanan Sistem Perencanaan Divisi Sdm PT.
                  RAPP
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Right Card - Requirements */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-emerald-100 dark:border-emerald-900/30">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-4">
              <CardTitle className="text-white text-lg font-medium">
                H-3 Sebelum Seminar KP Mahasiswa Wajib Sudah:
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ol className="space-y-2">
                {[
                  "Hubungi Dosen Pembimbing dan Dosen Penguji Terkait Seminar dan Jadwal (Konfirmasi)",
                  "Serahkan Dokumen Seminar KP : Printed dan Soft File (Via Telegram) Daily Report, Laporan Tambahan dan Undangan Seminar KP Kepada Dosen Pembimbing dan Penguji KP Maksimal 3 Hari SEBELUM Seminar KP",
                  "Persiapkan Infokus dll ketika seminar pada Hari H",
                  "Konfirmasi ke Koordinator KP jika ada kendala dll",
                  "Menyiapkan form Berita Acara dan Lembar Pengesahan KP",
                ].map((text, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-4 p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-200 transition-colors duration-200"
                  >
                    <div className="flex-shrink-0 size-8 flex items-center justify-center bg-emerald-400/20 dark:bg-emerald-800/40 rounded-lg font-semibold text-emerald-700 dark:text-emerald-300">
                      {index + 1}
                    </div>
                    <div className="flex-1 pt-1">
                      <span className="text-gray-700 dark:text-gray-200">
                        {text}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
