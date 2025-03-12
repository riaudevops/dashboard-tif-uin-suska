import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import Stepper from "@/components/mahasiswa/seminar/stepper";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Map, UserRound, Book } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Status from "@/components/mahasiswa/seminar/status";
import { infoPengajuanSeminar } from "@/pages/mahasiswa/seminar/validasi-berkas/page";
import FileUpload from "../fileUpload";

function handleFileChange(file: File | null): void {
  throw new Error("Function not implemented.");
}

export default function Step1({
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
            title="Anda Belum Mengupload Dokumen Form Pendaftaran Diseminasi KP"
            subtitle="Silahkan lengkapi dokumen terlebih dahulu."
          />
          <Card className="px-12">
            <CardHeader>
              <CardTitle className="text-xl text-center">
                Form Pendaftaran Kerja Praktik
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <FileUpload
                  label="Surat keterangan selesai kp dari instansi"
                  onChange={handleFileChange}
                />
              </div>
              <div>
                <FileUpload
                  label="Menghadiri seminar KP mahasiswa lain minimal 5 kali"
                  onChange={handleFileChange}
                />
              </div>
              <div>
                <FileUpload
                  label="Laporan tambahan tugas KP"
                  onChange={handleFileChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <div className="flex gap-2 ">
                <Button className="bg-secondary" variant={"outline"}>
                  Batal
                </Button>
                <Button className="bg-primary">Ajukan</Button>
              </div>
            </CardFooter>
          </Card>
        </>
      )}

      {status === "validasi" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-6">
          <div className="space-y-2">
            <Status
              status="validasi"
              title="Dokumen Pendaftaran Diseminasi Anda dalam proses validasi"
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
          <Card>
            <CardHeader>
              <CardTitle className="text-xl ">
                Form Pendaftaran Kerja Praktik
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <FileUpload
                  label="Surat keterangan selesai kp dari instansi"
                  onChange={handleFileChange}
                />
              </div>
              <div>
                <FileUpload
                  label="Menghadiri seminar KP mahasiswa lain minimal 5 kali"
                  onChange={handleFileChange}
                />
              </div>
              <div>
                <FileUpload
                  label="Laporan tambahan tugas KP"
                  onChange={handleFileChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end pt-4 gap-3 ">
              <Button variant="outline">Batal</Button>
              <Button>Kirim</Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {status === "ditolak" && (
        <div className="flex flex-col gap-4">
          <Status
            status="ditolak"
            title=" Dokumen Pendaftaran Diseminasi Anda Ditolak"
            subtitle="Silahkan Isi kembali
            Form sesuai perintah!"
            catatan="Pada Surat Balasan, Nama Anda Salah"
          />
          <Card className="">
            <CardHeader>
              <CardTitle className="text-xl text-center">
                Form Pendaftaran Kerja Praktik
              </CardTitle>
              <CardDescription className="text-center">
                Silahkan Upload Dokumen dibawah ini!
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <Label htmlFor="file">
                  Surat keterangan selesai kp dari instansi
                </Label>
                <div className="flex items-center space-x-2">
                  <Input id="file" type="file" className="flex-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="file">
                  Menghadiri seminar KP mahasiswa lain minimal 5 kali
                </Label>
                <div className="flex items-center space-x-2">
                  <Input id="file" type="file" className="flex-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="file">Laporan tambahan tugas kp </Label>
                <div className="flex items-center space-x-2">
                  <Input id="file" type="file" className="flex-1" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-2">
                <Button className="bg-primary">Ajukan</Button>
                <Button className="bg-secondary" variant={"outline"}>
                  Batal
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
