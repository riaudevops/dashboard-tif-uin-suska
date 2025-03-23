import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import Stepper from "@/components/mahasiswa/seminar/stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRound, Book, DoorOpen, TimerIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Step4({ activeStep }: { activeStep: number }) {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-8">
        Validasi Kelengkapan Berkas Seminar Kerja Praktik
      </h1>
      <Stepper activeStep={activeStep} />
      <div className="">
        {/* Header */}

        <div className="flex gap-2 mb-9">
          <div>
            <Alert className="px-16 bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white text-center">
              <AlertTitle className="text-7xl ">H-5</AlertTitle>
              <AlertDescription>menuju seminar</AlertDescription>
            </Alert>
          </div>

          <div className="bg-gradient-to-r from-purple-900 via-purple-700 to-purple-900 text-white py-6 px-8 shadow-lg rounded flex-1">
            <h1 className="text-center text-3xl font-semibold">
              Semoga Sukses Dalam Melaksanakan Seminar-KP 👌
            </h1>
            <p className="text-center text-sm mt-2">
              Berikut Jadwal & Beserta Dosen Penguji Anda Untuk Seminar-KP
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Left Card - Seminar Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-purple-800 dark:text-purple-400">
                Informasi Seminar KP Anda
              </CardTitle>
            </CardHeader>
            <Separator className="mb-4 " />
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center w-full">
                <div className="flex-1">
                  <h3 className="flex items-center gap-2 font-medium">
                    <TimerIcon className="size-4" />
                    Waktu / Tanggal
                  </h3>
                  <p className="font-medium text-muted-foreground">
                    10.00 Wib / 13 Feb 2025
                  </p>
                </div>

                <Separator orientation="vertical" className="mx-4 h-12" />

                <div className="flex-1 ">
                  <h3 className="flex items-center gap-2 font-medium ">
                    <DoorOpen className="size-4" />
                    Ruangan
                  </h3>
                  <p className="font-medium text-muted-foreground">FST 301</p>
                </div>
              </div>
              <Separator className="" />
              <div className="flex justify-between items-center w-full">
                <div className="flex-1">
                  <h3 className="flex flex-row items-center gap-2 font-medium ">
                    <UserRound className="size-4" />
                    Dosen Pembimbing
                  </h3>
                  <p className="font-medium text-muted-foreground">
                    Pizaini,S.T, M.Kom
                  </p>
                </div>

                <Separator orientation="vertical" className="mx-4 h-12" />

                <div className="flex-1 ">
                  <h3 className="flex items-center gap-2 font-medium ">
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
                  <h3 className="flex flex-row items-center gap-2 font-medium ">
                    <UserRound className="size-4" />
                    Dosen Penguji
                  </h3>
                  <p className="font-medium text-muted-foreground">
                    Iwan Iskandar,M.T
                  </p>
                </div>

                <Separator orientation="vertical" className="mx-4 h-12" />

                <div className="flex-1 ">
                  <h3 className="flex items-center gap-2 font-medium ">
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
                <h3 className="flex flex-row items-center gap-2 font-medium">
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
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-purple-800 dark:text-purple-400">
                H-3 Sebelum Seminar KP Mahasiswa Wajib Sudah:
              </CardTitle>
            </CardHeader>
            <Separator className="mb-4" />
            <CardContent>
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
                    className="flex items-start gap-4 p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900 dark:hover:text-purple-200 transition-colors duration-200"
                  >
                    <div className="flex-shrink-0 size-8 flex items-center justify-center bg-purple-400/20 dark:text-purple-200 rounded-lg font-semibold text-purple-800">
                      {index + 1}
                    </div>
                    <div className="flex-1 pt-1">
                      <span className="text-primary dark:text-gray-200">
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
