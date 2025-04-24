import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import Stepper from "@/components/mahasiswa/seminar/stepper";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import FileUpload from "../fileUpload";
import Status from "../status";
import { Textarea } from "@/components/ui/textarea";

export default function Step5({
  activeStep,
  status,
}: {
  activeStep: number;
  status: string;
}) {
  function handleFileChange(file: File | null): void {
    console.log(file)
    throw new Error("Function not implemented.");
  }

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
            subtitle="Silahkan lengkapi dokumen terlebih dahulu"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <Card className="h-fullflex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Upload Dokumen Pasca Seminar Kerja Praktik
                </CardTitle>
              </CardHeader>
              <Separator className="mb-4" />

              <CardContent className="flex flex-col gap-4 flex-grow">
                <FileUpload
                  label="Upload Berita Acara Seminar KP"
                  onChange={handleFileChange}
                />
                <FileUpload
                  label="Upload Lembar Pengesahan KP"
                  onChange={handleFileChange}
                />
                <FileUpload
                  label="Upload Daftar Hadir Seminar KP"
                  onChange={handleFileChange}
                />
                <FileUpload
                  label="Upload Revisi Daily Report (jika ada)"
                  onChange={handleFileChange}
                />
                <FileUpload
                  label="Upload Revisi Laporan Tambahan (jika ada)"
                  onChange={handleFileChange}
                />
                <FileUpload
                  label="Upload Sistem KP Final (jika ada)"
                  onChange={handleFileChange}
                />
              </CardContent>

              <CardFooter className="flex justify-end pt-4 gap-3 pb-3">
                <Button variant="outline">Batal</Button>
                <Button>Kirim</Button>
              </CardFooter>
            </Card>
            <div className="space-y-2">
              <div className="flex flex-col items-center px-10">
                <Card className="flex flex-col w-full  rounded-lg overflow-visible relative bg-yellow-300 shadow-lg -rotate-1 transform  mt-6">
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
                      placeholder="Silahkan untuk laporannya diperbaiki daftar pustaka dan footnote-nya"
                      className="w-full text-red-800 bg-yellow-200 border-none shadow-inner min-h-32 resize-none"
                    />
                  </CardContent>
                </Card>
                <Card className="flex flex-col w-full  rounded-lg overflow-visible relative bg-yellow-300 shadow-lg rotate-1 transform  mt-6">
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
          </div>
        </>
      )}
      {status === "validasi" && (
        <>
          <Status
            status="validasi"
            title="Dokumen Pasca Seminar KP Anda dalam proses Validasi"
            subtitle="Silahkan menunggu konfirmasi berikutnya!"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <Card className="h-fullflex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Upload Dokumen Pasca Seminar Kerja Praktik
                </CardTitle>
              </CardHeader>
              <Separator className="mb-4" />

              <CardContent className="flex flex-col gap-4 flex-grow">
                <FileUpload
                  label="Upload Berita Acara Seminar KP"
                  onChange={handleFileChange}
                />
                <FileUpload
                  label="Upload Lembar Pengesahan KP"
                  onChange={handleFileChange}
                />
                <FileUpload
                  label="Upload Daftar Hadir Seminar KP"
                  onChange={handleFileChange}
                />
                <FileUpload
                  label="Upload Revisi Daily Report (jika ada)"
                  onChange={handleFileChange}
                />
                <FileUpload
                  label="Upload Revisi Laporan Tambahan (jika ada)"
                  onChange={handleFileChange}
                />
                <FileUpload
                  label="Upload Sistem KP Final (jika ada)"
                  onChange={handleFileChange}
                />
              </CardContent>

              <CardFooter className="flex justify-end pt-4 gap-3 pb-3">
                <Button variant="outline">Batal</Button>
                <Button>Kirim</Button>
              </CardFooter>
            </Card>
            <div className="space-y-2">
              <div className="flex flex-col items-center px-10">
                <Card className="flex flex-col w-full  rounded-lg overflow-visible relative bg-yellow-300 shadow-lg -rotate-1 transform  mt-6">
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
                      placeholder="Silahkan untuk laporannya diperbaiki daftar pustaka dan footnote-nya"
                      className="w-full text-red-800 bg-yellow-200 border-none shadow-inner min-h-32 resize-none"
                    />
                  </CardContent>
                </Card>
                <Card className="flex flex-col w-full  rounded-lg overflow-visible relative bg-yellow-300 shadow-lg rotate-1 transform  mt-6">
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
          </div>
        </>
      )}
      {status === "ditolak" && (
        <>
          <Status
            status="ditolak"
            title=" Dokumen Pasca Seminar Anda Ditolak"
            subtitle="Silahkan Isi kembali
            Form sesuai perintah!"
            catatan="Pada Surat Balasan, Nama Anda Salah"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <Card className="h-fullflex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Upload Dokumen Pasca Seminar Kerja Praktik
                </CardTitle>
              </CardHeader>
              <Separator className="mb-4" />

              <CardContent className="flex flex-col gap-4 flex-grow">
                <FileUpload
                  label="Upload Berita Acara Seminar KP"
                  onChange={handleFileChange}
                />
                <FileUpload
                  label="Upload Lembar Pengesahan KP"
                  onChange={handleFileChange}
                />
                <FileUpload
                  label="Upload Daftar Hadir Seminar KP"
                  onChange={handleFileChange}
                />
                <FileUpload
                  label="Upload Revisi Daily Report (jika ada)"
                  onChange={handleFileChange}
                />
                <FileUpload
                  label="Upload Revisi Laporan Tambahan (jika ada)"
                  onChange={handleFileChange}
                />
                <FileUpload
                  label="Upload Sistem KP Final (jika ada)"
                  onChange={handleFileChange}
                />
              </CardContent>

              <CardFooter className="flex justify-end pt-4 gap-3 pb-3">
                <Button variant="outline">Batal</Button>
                <Button>Kirim</Button>
              </CardFooter>
            </Card>
            <div className="space-y-2">
              <div className="flex flex-col items-center px-10">
                <Card className="flex flex-col w-full  rounded-lg overflow-visible relative bg-yellow-300 shadow-lg -rotate-1 transform  mt-6">
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
                      placeholder="Silahkan untuk laporannya diperbaiki daftar pustaka dan footnote-nya"
                      className="w-full text-red-800 bg-yellow-200 border-none shadow-inner min-h-32 resize-none"
                    />
                  </CardContent>
                </Card>
                <Card className="flex flex-col w-full  rounded-lg overflow-visible relative bg-yellow-300 shadow-lg rotate-1 transform  mt-6">
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
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
