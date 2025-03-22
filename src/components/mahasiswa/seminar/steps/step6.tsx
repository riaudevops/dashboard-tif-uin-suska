import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import Stepper from "@/components/mahasiswa/seminar/stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, UserRound, Book, CalendarCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { infoPengajuanSeminar } from "@/pages/mahasiswa/seminar/validasi-berkas/page";
import Status from "../status";

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
      <div className=" p-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 via-purple-700 to-purple-900 text-white py-6 px-8 mb-8 shadow-lg rounded-lg">
          <h1 className="text-center text-xl font-semibold">
            Selamat Proses Seminar Kerja Praktik Anda Telah Berhasil
          </h1>
          <p className="text-center text-sm mt-2">
            Silahkan Cek Berkala Untuk Progress Nilai Anda
          </p>
        </div>

        {status === "belum" && (
          <>
            <Status
              status="belum"
              title="Nilai Anda Masih dalam Proses Validasi"
              subtitle="Mohon bersabar"
            />
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

              <Card className="">
                <CardHeader className="">
                  <CardTitle className="text-base font-semibold">
                    Informasi Diseminasi Kerja Praktik Anda
                  </CardTitle>
                </CardHeader>
                <Separator className="mb-4" />
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="flex flex-row items-center gap-2 font-medium">
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
                      <h3 className="flex flex-row items-center gap-2 font-medium ">
                        <Map className="size-4" />
                        Lokasi Kerja Praktik:
                      </h3>
                      <p className="text-muted-foreground">
                        {infoPengajuanSeminar.lokasi}
                      </p>
                    </div>

                    <Separator orientation="vertical" className="mx-4 h-12" />

                    <div className="flex-1 ">
                      <h3 className="flex items-center gap-2 font-medium ">
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
                      <h3 className="flex flex-row items-center gap-2 font-medium ">
                        <CalendarCheck className="size-4" />
                        Lama Kerja Praktik
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        20 JANUARI 2025 - 18 JUNI 2025
                      </p>
                    </div>

                    <Separator orientation="vertical" className="mx-4 h-12" />

                    <div className="flex-1 ">
                      <h3 className="flex items-center gap-2 font-medium ">
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
                  <span className="font-bold text-6xl text-center text-yellow-900">
                    100 (A)
                  </span>
                </CardContent>
              </Card>

              <Card className="">
                <CardHeader className="">
                  <CardTitle className="text-base font-semibold">
                    Informasi Diseminasi Kerja Praktik Anda
                  </CardTitle>
                </CardHeader>
                <Separator className="mb-4" />
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="flex flex-row items-center gap-2 font-medium">
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
                      <h3 className="flex flex-row items-center gap-2 font-medium ">
                        <Map className="size-4" />
                        Lokasi Kerja Praktik:
                      </h3>
                      <p className="text-muted-foreground">
                        {infoPengajuanSeminar.lokasi}
                      </p>
                    </div>

                    <Separator orientation="vertical" className="mx-4 h-12" />

                    <div className="flex-1 ">
                      <h3 className="flex items-center gap-2 font-medium ">
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
                      <h3 className="flex flex-row items-center gap-2 font-medium ">
                        <CalendarCheck className="size-4" />
                        Lama Kerja Praktik
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        20 JANUARI 2025 - 18 JUNI 2025
                      </p>
                    </div>

                    <Separator orientation="vertical" className="mx-4 h-12" />

                    <div className="flex-1 ">
                      <h3 className="flex items-center gap-2 font-medium ">
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
