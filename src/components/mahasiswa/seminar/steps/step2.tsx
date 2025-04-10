import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import Stepper from "@/components/mahasiswa/seminar/stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ExternalLink } from "lucide-react";
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
        <>
          <Status
            status="belum"
            title="Anda belum memasukkan ID pengajuan Undangan Seminar KP"
            subtitle="Silakan masukkan ID pengajuan Undangan Seminar KP!"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card Pertama */}
            <Card className="h-full overflow-hidden rounded-xl border border-emerald-100 dark:border-emerald-900/30">
              <div className="bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-4">
                <CardTitle className="text-white text-lg font-medium">
                  Silakan Lakukan Pengajuan Pembuatan Surat Undangan
                </CardTitle>
              </div>

              <CardContent className="flex flex-col h-[calc(100%-4rem)] gap-4 p-6">
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Kunjungi link di bawah ini:
                  </p>
                  <a
                    href="https://seminar-fst.uin-suska.ac.id/akademik/prosedur/seminar"
                    className="cursor-pointer inline-flex items-center font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline transition-colors duration-200"
                  >
                    https://seminar-fst.uin-suska.ac.id/akademik/prosedur/seminar
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </div>
                <div className="p-3 mt-auto border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-900/20 rounded-md">
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                    <span>
                      Setelah mengajukan, Anda akan mendapatkan ID pengajuan
                      yang harus diinput pada form di samping.
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card Kedua */}
            <Card className="h-full overflow-hidden rounded-xl border border-emerald-100 dark:border-emerald-900/30">
              <div className="bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-4">
                <CardTitle className="text-white text-lg font-medium">
                  Silakan Masukkan ID Pengajuan
                </CardTitle>
              </div>

              <CardContent className="flex flex-col h-[calc(100%-4rem)] gap-4 p-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="id-input"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    ID Pengajuan <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="id-input"
                      placeholder="Masukkan ID Pengajuan"
                      className="border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400 pl-3 pr-3 py-2"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Format: Kombinasi huruf dan angka yang Anda terima dari
                    portal
                  </p>
                </div>
                <div className="flex justify-end gap-3 mt-auto">
                  <Button className="bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white border-none">
                    Kirim
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
      {status === "validasi" && (
        <>
          <Status
            status="validasi"
            title=" Input ID Pengajuan Surat Undangan anda dalam proses validasi"
            subtitle="Silakan menunggu konfirmasi berikutnya!"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card Pertama */}
            <Card className="h-full border border-green-200 dark:border-green-800/50 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-950/50 border-b border-green-200 dark:border-green-800/40">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-green-500 dark:bg-green-400 rounded-full"></div>
                  <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-100">
                    Silakan Lakukan Pengajuan Pembuatan Surat Undangan
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col  gap-4 p-5">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Kunjungi link di bawah ini:
                  </p>
                  <a
                    href="https://seminar-fst.uin-suska.ac.id/akademik/prosedur/seminar"
                    className="cursor-pointer inline-flex items-center font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline transition-colors duration-200"
                  >
                    https://seminar-fst.uin-suska.ac.id/akademik/prosedur/seminar
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </div>
                <div className="p-3  border mt-5  border-green-200 dark:border-green-800/40 bg-green-50 dark:bg-green-900/20 rounded-md">
                  <p className="text-sm text-green-700 dark:text-green-300 flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600 dark:text-green-400" />
                    <span>
                      Setelah mengajukan, Anda akan mendapatkan ID pengajuan
                      yang harus diinput pada form di samping.
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card Kedua */}
            <Card className="h-full border border-green-200 dark:border-green-800/50 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-950/50 border-b border-green-200 dark:border-green-800/40">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-green-500 dark:bg-green-400 rounded-full"></div>
                  <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-100">
                    Silakan Masukkan ID Pengajuan Pada Portal FST
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col h-[calc(100%-4rem)] gap-4 p-5">
                <div className="mt-2 space-y-2">
                  <Label
                    htmlFor="id-input"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    ID Pengajuan <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="id-input"
                      placeholder="12JDUAHAHIOH"
                      className="border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500 dark:focus:border-green-400 dark:focus:ring-green-400 pl-3 pr-3 py-2"
                      readOnly
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Format: Kombinasi huruf dan angka yang Anda terima dari
                    portal
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
      {status === "ditolak" && (
        <>
          <Status
            status="ditolak"
            title="Input ID Pengajuan Surat Undangan Anda Ditolak"
            subtitle="Silakan isi kembali Form sesuai perintah!"
            catatan="Pada surat balasan, nama Anda salah"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {/* Card Pertama */}
            <Card className="h-full border border-green-200 dark:border-green-800/50 shadow-sm ">
              <CardHeader className="bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-950/50 border-b border-green-200 dark:border-green-800/40">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-green-500 dark:bg-green-400 rounded-full"></div>
                  <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-100">
                    Silakan Lakukan Pengajuan Pembuatan Surat Undangan
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col  gap-4 p-5">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Kunjungi link di bawah ini:
                  </p>
                  <a
                    href="https://seminar-fst.uin-suska.ac.id/akademik/prosedur/seminar"
                    className="cursor-pointer inline-flex items-center font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline transition-colors duration-200"
                  >
                    https://seminar-fst.uin-suska.ac.id/akademik/prosedur/seminar
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </div>
                <div className="p-3  border mt-5  border-green-200 dark:border-green-800/40 bg-green-50 dark:bg-green-900/20 rounded-md">
                  <p className="text-sm text-green-700 dark:text-green-300 flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600 dark:text-green-400" />
                    <span>
                      Setelah mengajukan, Anda akan mendapatkan ID pengajuan
                      yang harus diinput pada form di samping.
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card Kedua */}
            <Card className="h-full border border-green-200 dark:border-green-800/50 shadow-sm ">
              <CardHeader className="bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-950/50 border-b border-green-200 dark:border-green-800/40">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-green-500 dark:bg-green-400 rounded-full"></div>
                  <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-100">
                    Silakan Masukkan ID Pengajuan Pada Portal FST
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col h-[calc(100%-4rem)] gap-4 p-5">
                <div className="mt-2 space-y-2">
                  <Label
                    htmlFor="id-input"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    ID Pengajuan <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="id-input"
                      placeholder="Masukkan ID Pengajuan"
                      className="border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500 dark:focus:border-green-400 dark:focus:ring-green-400 pl-3 pr-3 py-2"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Format: Kombinasi huruf dan angka yang Anda terima dari
                    portal
                  </p>
                </div>
                <div className="flex justify-end gap-3 mt-auto">
                  <Button className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white border-none">
                    Kirim
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
