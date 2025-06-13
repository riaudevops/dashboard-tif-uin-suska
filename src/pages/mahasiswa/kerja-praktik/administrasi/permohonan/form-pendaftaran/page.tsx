// import Link from "next/link";
// import {useRouter} from "next/navigation"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation } from "@tanstack/react-query";
import APIDaftarKP from "@/services/api/mahasiswa/daftar-kp.service";
import { api } from "@/lib/axios-instance";
import { CreatePendaftaranMahasiswaInterface } from "@/interfaces/pages/mahasiswa/kerja-praktik/daftar-kp/pendaftaran.interface";
import { toast } from "@/hooks/use-toast";

interface CommonResponse {
  response: boolean;
  message: string;
}

function MahasiswaKerjaPraktekDaftarKpPermohonanFromPendaftaranPage() {
  const [date, setDate] = useState<Date>(new Date());
  const navigate = useNavigate();

  const { data: dataInstansi, isLoading } = useQuery({
    queryKey: ["instansi-aktif"],
    queryFn: () => APIDaftarKP.getDataInstansiAktif().then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (data: CreatePendaftaranMahasiswaInterface) =>
      APIDaftarKP.createPendaftaranMahasiswa(data),
    onSuccess: (data) => {
      toast({
        title: "Sukses",
        description:
          data.message || "Berhasil melakukan pendaftaran kerja praktek",
        duration: 3000,
      });
      const pointer = setTimeout(function () {
        navigate("/mahasiswa/kerja-praktik/daftar-kp/permohonan");
        clearTimeout(pointer);
      }, 1000);
    },
    onError: (data) => {
      toast({
        title: "Gagal",
        description:
          data.message || "Gagal melakukan pendaftaran kerja praktek",
        duration: 3000,
      });
    },
  });

  async function handleOnSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const objectFormData = Object.fromEntries(formData.entries());
    mutation.mutate({
      tanggalMulai: date.toISOString(),
      tujuanSuratInstansi: objectFormData.tujuanSuratInstansi as string,
      idInstansi: objectFormData.idInstansi as string,
    });
  }

  async function handleOnCancel() {
    navigate("/mahasiswa/kerja-praktik/daftar-kp/permohonan");
  }

  return (
    <DashboardLayout>
      <Card>
        <form onSubmit={handleOnSubmit}>
          <CardHeader>
            <CardTitle className="text-center font-bold text-2xl">
              Form Pendaftaran Kerja Praktek
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardTitle className="font-bold text-lg">
              🏢 Instansi/Perusahaan
            </CardTitle>
            <Label className="text-sm font-bold mt-6" htmlFor="instansi">
              Nama Instansi / Perusahaan
            </Label>
            <CardContent className="text-black bg-white p-0 rounded-md border-black border-[1px]">
              <select
                required
                className="bg-white block w-[100%] p-2"
                name="idInstansi"
                id="instansi"
              >
                <option value="">Pilih Instansi</option>
                {dataInstansi?.map(({ id, nama }: any) => (
                  <option key={id} value={id}>
                    {nama}
                  </option>
                ))}
              </select>
            </CardContent>
            <CardDescription className="text-sm text-slate-500">
              Instansi belum terdaftar? Daftarkan segera{" "}
              <Link
                className="text-blue-500"
                to={{
                  pathname:
                    "/mahasiswa/kerja-praktik/daftar-kp/permohonan/form-daftar-instansi",
                }}
              >
                Disini
              </Link>
            </CardDescription>
          </CardContent>

          <CardContent>
            <Label className="text-sm font-bold" htmlFor="tujuan-surat">
              Tujuan Surat Instansi/Perusahaan
            </Label>
            <Textarea
              required
              className="text-black block bg-white w-full p-2 border-slate-300 border-[1px] h-42"
              name="tujuanSuratInstansi"
              id="tujuan-surat"
              placeholder="Masukkan tujuan instansi disini..."
            ></Textarea>
          </CardContent>

          <CardContent className="w-fit">
            <Label className="text-sm font-bold" htmlFor="tanggal-mulai">
              Tanggal Mulai
            </Label>
            <Calendar
              required
              className="text-black bg-white w-full p-2 border-slate-300 border-[1px]"
              id="tanggal-mulai"
              onDayClick={(e) => setDate(e)}
              selected={date}
            />
          </CardContent>

          <CardFooter className="text-end mt-4 sm:flex sm:flex-col sm:gap-2 md:block">
            <Button
              onClick={handleOnCancel}
              type="button"
              disabled={mutation.isPending}
              className="md:mr-4  py-1 md:w-[198px] font-bold border-black border-[1px] hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-green-600 py-1 md:w-[198px] font-bold hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              Ajukan Permohonan
            </Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardLayout>
  );
}

export default MahasiswaKerjaPraktekDaftarKpPermohonanFromPendaftaranPage;
