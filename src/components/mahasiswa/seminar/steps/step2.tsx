import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import Stepper from "@/components/mahasiswa/seminar/stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Status from "../status";
import { Label } from "@/components/ui/label";

export default function Step2({
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
      {status === "belum" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-6">
          <div className="space-y-2">
            <Status
              status="belum"
              title="Anda belum memasukkan ID pengajuan Undangan Seminar KP"
              subtitle="Silahkan masukkan ID pengajuan Undangan Seminar KP!"
            />
            <Card className="">
              <CardHeader className="  rounded-t-lg">
                <CardTitle className="text-base font-semibold text-gray-700 dark:text-gray-200">
                  Silakan Lakukan Pengajuan Pembuatan Surat Undangan Pada Portal
                  FST
                </CardTitle>
              </CardHeader>
              <Separator className="mb-4" />
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Kunjungi link dibawah ini:
                </p>
                <a
                  href="https://seminar-fst.uin-suska.ac.id/akademik/prosedur/seminar"
                  className="cursor-pointer inline-flex items-center font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
                >
                  https://seminar-fst.uin-suska.ac.id/akademik/prosedur/seminar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          </div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Silahkan Input Id Di Bawah Ini
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-[calc(100%-4rem)] gap-4">
              <div>
                <h3 className="font-medium mb-2">
                  Form Input Id Pengajuan Undangan Seminar Kp
                </h3>
                <p className="text-sm text-muted-foreground">
                  silakan input id yang didapatkan pada portal fst
                </p>
              </div>
              <Input placeholder="Masukkan ID Pengajuan" />
              <div className="flex justify-end gap-3">
                <Button>Kirim</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {status === "validasi" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-6">
          <div className="space-y-2">
            <Status
              status="validasi"
              title=" Input ID Pengajuan Surat Undangan anda dalam proses validasi"
              subtitle="Silahkan menunggu konfirmasi berikutnya!"
            />
            <Card className="">
              <CardHeader className="  rounded-t-lg">
                <CardTitle className="text-base font-semibold text-gray-700 dark:text-gray-200">
                  Silakan Lakukan Pengajuan Pembuatan Surat Undangan Pada Portal
                  FST
                </CardTitle>
              </CardHeader>
              <Separator className="mb-4" />
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Kunjungi link dibawah ini:
                </p>
                <a
                  href="https://seminar-fst.uin-suska.ac.id/akademik/prosedur/seminar"
                  className="cursor-pointer inline-flex items-center font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
                >
                  https://seminar-fst.uin-suska.ac.id/akademik/prosedur/seminar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          </div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Silahkan Masukkan ID Pengajuan Pada Portal FST
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-[calc(100%-4rem)] gap-4">
              <div>
                <Label htmlFor="id">ID Pengajuan Surat Undangan</Label>
                <Input placeholder="12JDUAHAHIOH" disabled />
              </div>
              <div className="flex justify-end gap-3">
                <Button>Kirim</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {status === "ditolak" && (
        <>
          <Status
            status="ditolak"
            title="Input ID Pengajuan Surat Undangan Anda Ditolak"
            subtitle="Silahkan isi kembali Form sesuai perintah!"
            catatan="Pada surat balasan, nama Anda salah"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <div className="space-y-2">
              <Card className="">
                <CardHeader className="  rounded-t-lg">
                  <CardTitle className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                    Silahkan Lakukan Pengajuan Pembuatan Surat Undangan Pada
                    Portal FST
                  </CardTitle>
                </CardHeader>
                <Separator className="mb-4" />
                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    Kunjungi link dibawah ini:
                  </p>
                  <a
                    href="https://seminar-fst.uin-suska.ac.id/akademik/prosedur/seminar"
                    className="cursor-pointer inline-flex items-center font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
                  >
                    https://seminar-fst.uin-suska.ac.id/akademik/prosedur/seminar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            </div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Silahkan Masukkan ID Pengajuan Pada Portal FST
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col h-[calc(100%-4rem)] gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="id">ID Pengajuan Surat Undangan</Label>
                  <Input placeholder="Masukkan ID Pengajuan" />
                </div>
                <div className="flex justify-end gap-3">
                  <Button>Kirim</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
