import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import Stepper from "@/components/mahasiswa/seminar/stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Status from "../status";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileText, RefreshCw, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";

const DocumentCard = ({
  title,
  status,
}: {
  title: string;
  status: "belum" | "validasi";
}) => {
  if (status === "validasi") {
    return (
      <div className="gap-1.5">
        <Label htmlFor="link" className="font-semibold text-xs">
          {title}
        </Label>
        <Input
          type="text"
          id="link"
          value="http://drive.google.com/drive/folders/file.pdf"
          readOnly
          className="bg-white dark:text-white cursor-text select-all dark:bg-secondary "
        />
      </div>
    );
  }

  return (
    <Card className="border border-green-100 dark:border-green-800/40 bg-white dark:bg-gray-800/80 shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <div className="mt-1 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
            <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <CardTitle className="text-base font-medium text-gray-800 dark:text-gray-100">
              {title}
            </CardTitle>
            <p className="font-normal text-sm text-gray-600 dark:text-gray-400 mt-1">
              Silakan inputkan Link GDrive dengan file harus berformat pdf.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label
            htmlFor="link"
            className="flex items-center gap-1 font-medium text-xs text-gray-700 dark:text-gray-300"
          >
            Link GDrive <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              type="text"
              id="link"
              placeholder="https://drive.google.com/drive/folders/file.pdf"
              className="pl-9 border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:focus:border-green-500 dark:focus:ring-green-500/50"
            />
            <Upload className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
const documents = [
  "Upload Berita Acara Seminar KP",
  "Upload Lembar Pengesahan KP",
  "Upload Daftar Hadir Seminar KP",
  "Upload Revisi Daily Report (jika ada)",
  "Upload Revisi Laporan Tambahan (jika ada)",
  "Upload Sistem KP Final (jika ada)",
];

export default function Step5({
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
            title="Anda Belum Mengupload Dokumen-dokumen Pasca Seminar KP"
            subtitle="Silakan lengkapi dokumen terlebih dahulu"
          />

          <div className="flex flex-col">
            <div className="px-4 py-6">
              <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
                <Card className="flex-1 flex flex-col rounded-lg overflow-visible relative bg-yellow-300 shadow-lg -rotate-1 transform">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-500 rounded-full shadow-md z-10 flex items-center justify-center">
                    <div className="w-2 h-2 bg-yellow-800 rounded-full"></div>
                  </div>

                  <div className="absolute inset-0 shadow-inner"></div>

                  <CardHeader className="pb-0 pt-6">
                    <CardTitle className="text-base font-semibold text-yellow-900">
                      # Catatan/Evaluasi Dosen Pembimbing
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-4 flex-grow p-4">
                    <Textarea
                      placeholder="Silakan untuk laporannya diperbaiki daftar pustaka dan footnote-nya"
                      className="w-full text-red-800 bg-yellow-200 border-none shadow-inner min-h-32 resize-none"
                    />
                  </CardContent>
                </Card>

                <Card className="flex-1 flex flex-col rounded-lg overflow-visible relative bg-yellow-300 shadow-lg rotate-1 transform">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-500 rounded-full shadow-md z-10 flex items-center justify-center">
                    <div className="w-2 h-2 bg-yellow-800 rounded-full"></div>
                  </div>

                  <div className="absolute inset-0 shadow-inner"></div>

                  <CardHeader className="pb-0 pt-6">
                    <CardTitle className="text-base font-semibold text-yellow-900">
                      # Catatan/Evaluasi Dosen Penguji
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-4 flex-grow p-4">
                    <Textarea
                      placeholder="Evaluasi daftar isi, urutannya salah"
                      className="w-full text-gray-800 bg-yellow-200 border-none shadow-inner min-h-32 resize-none"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
            <div>
              <Card className="border border-green-200 dark:border-green-800/50 shadow-sm rounded-lg overflow-hidden bg-gradient-to-b from-green-50/70 to-white dark:from-green-950/20 dark:to-gray-900/95">
                <CardHeader className="px-5 py-4 mb-2 bg-gradient-to-r from-green-200/80 to-green-100/60 dark:from-green-800/30 dark:to-green-900/20 border-b border-green-200 dark:border-green-800/30">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-green-500 dark:bg-green-400 rounded-full"></div>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Silakan isi formulir di bawah ini untuk divalidasi!
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="p-5 flex flex-col gap-5">
                  {documents.map((doc, index) => (
                    <DocumentCard key={index} title={doc} status="belum" />
                  ))}
                </CardContent>
              </Card>

              <div className="flex justify-end mt-5">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Kosongkan Formulir
                  </Button>
                  <Button className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-white border-none shadow-sm hover:shadow">
                    Kirim
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {status === "validasi" && (
        <>
          <Status
            status="validasi"
            title="Dokumen Pasca Seminar KP Anda dalam proses Validasi"
            subtitle="Silakan menunggu konfirmasi berikutnya!"
          />
          <div className="flex flex-col">
            <div className="px-4 py-6">
              <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
                <Card className="flex-1 flex flex-col rounded-lg overflow-visible relative bg-yellow-300 shadow-lg -rotate-1 transform">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-500 rounded-full shadow-md z-10 flex items-center justify-center">
                    <div className="w-2 h-2 bg-yellow-800 rounded-full"></div>
                  </div>

                  <div className="absolute inset-0 shadow-inner"></div>

                  <CardHeader className="pb-0 pt-6">
                    <CardTitle className="text-base font-semibold text-yellow-900">
                      # Catatan/Evaluasi Dosen Pembimbing
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-4 flex-grow p-4">
                    <Textarea
                      placeholder="Silakan untuk laporannya diperbaiki daftar pustaka dan footnote-nya"
                      className="w-full text-red-800 bg-yellow-200 border-none shadow-inner min-h-32 resize-none"
                    />
                  </CardContent>
                </Card>

                <Card className="flex-1 flex flex-col rounded-lg overflow-visible relative bg-yellow-300 shadow-lg rotate-1 transform">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-500 rounded-full shadow-md z-10 flex items-center justify-center">
                    <div className="w-2 h-2 bg-yellow-800 rounded-full"></div>
                  </div>

                  <div className="absolute inset-0 shadow-inner"></div>

                  <CardHeader className="pb-0 pt-6">
                    <CardTitle className="text-base font-semibold text-yellow-900">
                      # Catatan/Evaluasi Dosen Penguji
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-4 flex-grow p-4">
                    <Textarea
                      placeholder="Evaluasi daftar isi, urutannya salah"
                      className="w-full text-gray-800 bg-yellow-200 border-none shadow-inner min-h-32 resize-none"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
            <div>
              <Card className="border border-green-200 dark:border-green-800/50 shadow-sm rounded-lg overflow-hidden bg-gradient-to-b from-green-50/70 to-white dark:from-green-950/20 dark:to-gray-900/95">
                <CardHeader className="px-5 py-4 mb-2 bg-gradient-to-r from-green-200/80 to-green-100/60 dark:from-green-800/30 dark:to-green-900/20 border-b border-green-200 dark:border-green-800/30">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-green-500 dark:bg-green-400 rounded-full"></div>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Silakan isi formulir di bawah ini untuk divalidasi!
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="p-5 flex flex-col gap-5">
                  {documents.map((doc, index) => (
                    <DocumentCard key={index} title={doc} status="validasi" />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
      {status === "ditolak" && (
        <>
          <Status
            status="ditolak"
            title=" Dokumen Pasca Seminar Anda Ditolak"
            subtitle="Silakan Isi kembali
            Form sesuai perintah!"
            catatan="Pada Surat Balasan, Nama Anda Salah"
          />
          <div className="flex flex-col">
            <div className="px-4 py-6">
              <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
                <Card className="flex-1 flex flex-col rounded-lg overflow-visible relative bg-yellow-300 shadow-lg -rotate-1 transform">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-500 rounded-full shadow-md z-10 flex items-center justify-center">
                    <div className="w-2 h-2 bg-yellow-800 rounded-full"></div>
                  </div>

                  <div className="absolute inset-0 shadow-inner"></div>

                  <CardHeader className="pb-0 pt-6">
                    <CardTitle className="text-base font-semibold text-yellow-900">
                      # Catatan/Evaluasi Dosen Pembimbing
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-4 flex-grow p-4">
                    <Textarea
                      placeholder="Silakan untuk laporannya diperbaiki daftar pustaka dan footnote-nya"
                      className="w-full text-red-800 bg-yellow-200 border-none shadow-inner min-h-32 resize-none"
                    />
                  </CardContent>
                </Card>

                <Card className="flex-1 flex flex-col rounded-lg overflow-visible relative bg-yellow-300 shadow-lg rotate-1 transform">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-500 rounded-full shadow-md z-10 flex items-center justify-center">
                    <div className="w-2 h-2 bg-yellow-800 rounded-full"></div>
                  </div>

                  <div className="absolute inset-0 shadow-inner"></div>

                  <CardHeader className="pb-0 pt-6">
                    <CardTitle className="text-base font-semibold text-yellow-900">
                      # Catatan/Evaluasi Dosen Penguji
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-4 flex-grow p-4">
                    <Textarea
                      placeholder="Evaluasi daftar isi, urutannya salah"
                      className="w-full text-gray-800 bg-yellow-200 border-none shadow-inner min-h-32 resize-none"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
            <div>
              <Card className="border border-green-200 dark:border-green-800/50 shadow-sm rounded-lg overflow-hidden bg-gradient-to-b from-green-50/70 to-white dark:from-green-950/20 dark:to-gray-900/95">
                <CardHeader className="px-5 py-4 mb-2 bg-gradient-to-r from-green-200/80 to-green-100/60 dark:from-green-800/30 dark:to-green-900/20 border-b border-green-200 dark:border-green-800/30">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-green-500 dark:bg-green-400 rounded-full"></div>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Silakan isi formulir di bawah ini untuk divalidasi!
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="p-5 flex flex-col gap-5">
                  {documents.map((doc, index) => (
                    <DocumentCard key={index} title={doc} status="belum" />
                  ))}
                </CardContent>
              </Card>

              <div className="flex justify-end mt-5">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Kosongkan Formulir
                  </Button>
                  <Button className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-white border-none shadow-sm hover:shadow">
                    Kirim
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
