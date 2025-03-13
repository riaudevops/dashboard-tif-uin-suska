import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import Dropzone from "@/components/mahasiswa/seminar/dropzone";
import Stepper from "@/components/mahasiswa/seminar/stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileWithPath } from "react-dropzone";
import { Map, UserRound, Book } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { infoPengajuanSeminar } from "@/pages/mahasiswa/seminar/validasi-berkas/page";
import Status from "../status";

const handleFilesChange = (files: FileWithPath[]) => {
  console.log("Files changed:", files);
};

export default function Step3({
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
              title="Anda belum mengupload Surat Undangan & Dosen Penguji"
              subtitle="Silahkan upload dokumen terlebih dahulu"
            />
            <Card>
              <CardHeader className="">
                <CardTitle className="text-base font-semibold">
                  Informasi Pengajuan Diseminasi Kp Anda
                </CardTitle>
              </CardHeader>
              <Separator className="mb-4" />
              <CardContent className="space-y-4">
                <div>
                  <h3 className="flex flex-row items-center gap-2 font-medium ">
                    <Map className="size-4" />
                    Lokasi Kerja Praktik:
                  </h3>
                  <p className="text-muted-foreground">
                    {infoPengajuanSeminar.lokasi}
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="flex flex-row items-center gap-2 font-medium ">
                    <UserRound className="size-4" />
                    Dosen Pembimbing:
                  </h3>
                  <p className="text-muted-foreground">
                    {infoPengajuanSeminar.dosenPembimbing}
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="flex flex-row items-center gap-2 font-medium ">
                    <UserRound className="size-4" />
                    Dosen Penguji:
                  </h3>
                  <p className="text-muted-foreground">
                    {infoPengajuanSeminar.dosenPenguji}
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="flex flex-row items-center gap-2 font-medium">
                    <Book className="size-4" />
                    Judul Laporan:
                  </h3>
                  <p className="text-muted-foreground">
                    {infoPengajuanSeminar.judul}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Silahkan Upload Surat Undangan Seminar KP
              </CardTitle>
            </CardHeader>
            <Separator className="mb-4" />
            <CardContent className="flex flex-col h-[calc(100%-4rem)] gap-4 ">
              <div>
                <p className="text-sm text-muted-foreground">
                  upload dokumen dalam format{" "}
                  <span className="text-blue-600 dark:text-blue-400 cursor-pointer">
                    .pdf
                  </span>
                </p>
              </div>
              <Dropzone onFilesChange={handleFilesChange} />
              <div className="flex justify-end gap-3 pb-3">
                <Button variant="outline">Batal</Button>
                <Button>Simpan</Button>
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
              title="Input ID Pengajuan Surat Undangan Anda dalam Proses Validasi"
              subtitle="Silahkan lengkapi dokumen terlebih dahulu"
            />
            <Card>
              <CardHeader className="">
                <CardTitle className="text-base font-semibold">
                  Informasi Pengajuan Diseminasi Kp Anda
                </CardTitle>
              </CardHeader>
              <Separator className="mb-4" />
              <CardContent className="space-y-4">
                <div>
                  <h3 className="flex flex-row items-center gap-2 font-medium ">
                    <Map className="size-4" />
                    Lokasi Kerja Praktik:
                  </h3>
                  <p className="text-muted-foreground">
                    {infoPengajuanSeminar.lokasi}
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="flex flex-row items-center gap-2 font-medium ">
                    <UserRound className="size-4" />
                    Dosen Pembimbing:
                  </h3>
                  <p className="text-muted-foreground">
                    {infoPengajuanSeminar.dosenPembimbing}
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="flex flex-row items-center gap-2 font-medium ">
                    <UserRound className="size-4" />
                    Dosen Penguji:
                  </h3>
                  <p className="text-muted-foreground">
                    {infoPengajuanSeminar.dosenPenguji}
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="flex flex-row items-center gap-2 font-medium">
                    <Book className="size-4" />
                    Judul Laporan:
                  </h3>
                  <p className="text-muted-foreground">
                    {infoPengajuanSeminar.judul}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Silahkan Upload Surat Undangan Seminar KP
              </CardTitle>
            </CardHeader>
            <Separator className="mb-4" />
            <CardContent className="flex flex-col h-[calc(100%-4rem)] gap-4 ">
              <div>
                <p className="text-sm text-muted-foreground">
                  upload dokumen dalam format{" "}
                  <span className="text-blue-600 dark:text-blue-400 cursor-pointer">
                    .pdf
                  </span>
                </p>
              </div>
              <Dropzone onFilesChange={handleFilesChange} />
              <div className="flex justify-end gap-3 pb-3">
                <Button variant="outline">Batal</Button>
                <Button>Simpan</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {status === "ditolak" && (
        <>
          <Status
            status="ditolak"
            title=" Upload Surat Undangan & Dosen Penguji Anda Ditolak"
            subtitle="Silakan isi kembali Form sesuai perintah"
            catatan="Pada Surat Balasan, nama Anda salah"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <div className="space-y-2">
              <Card>
                <CardHeader className="">
                  <CardTitle className="text-base font-semibold">
                    Informasi Pengajuan Diseminasi Kp Anda
                  </CardTitle>
                </CardHeader>
                <Separator className="mb-4" />
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="flex flex-row items-center gap-2 font-medium ">
                      <Map className="size-4" />
                      Lokasi Kerja Praktik:
                    </h3>
                    <p className="text-muted-foreground">
                      {infoPengajuanSeminar.lokasi}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="flex flex-row items-center gap-2 font-medium ">
                      <UserRound className="size-4" />
                      Dosen Pembimbing:
                    </h3>
                    <p className="text-muted-foreground">
                      {infoPengajuanSeminar.dosenPembimbing}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="flex flex-row items-center gap-2 font-medium ">
                      <UserRound className="size-4" />
                      Dosen Penguji:
                    </h3>
                    <p className="text-muted-foreground">
                      {infoPengajuanSeminar.dosenPenguji}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="flex flex-row items-center gap-2 font-medium">
                      <Book className="size-4" />
                      Judul Laporan:
                    </h3>
                    <p className="text-muted-foreground">
                      {infoPengajuanSeminar.judul}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  Silahkan Upload Surat Undangan Seminar KP
                </CardTitle>
              </CardHeader>
              <Separator className="mb-4" />
              <CardContent className="flex flex-col h-[calc(100%-4rem)] gap-4 ">
                <div>
                  <p className="text-sm text-muted-foreground">
                    upload dokumen dalam format{" "}
                    <span className="text-blue-600 dark:text-blue-400 cursor-pointer">
                      .pdf
                    </span>
                  </p>
                </div>
                <Dropzone onFilesChange={handleFilesChange} />
                <div className="flex justify-end gap-3 pb-3">
                  <Button variant="outline">Batal</Button>
                  <Button>Simpan</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
