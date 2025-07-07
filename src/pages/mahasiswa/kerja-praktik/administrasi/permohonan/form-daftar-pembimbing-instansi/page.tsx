import { useNavigate } from "react-router-dom";
import { FormEvent } from "react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import APIDaftarKP from "@/services/api/mahasiswa/daftar-kp.service";
import { PembimbingInstansiInterface } from "@/interfaces/service/api/daftar-kp/mahasiswa-service.interface";
import { toast } from "sonner";

function MahasiswaKerjapraktikDaftarKpPermohonanFormDaftarPembimbingInstansiPage() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: PembimbingInstansiInterface) =>
      APIDaftarKP.createPembimbingInstansi(data).then((res) => res.data),
    onSuccess: () => {
      toast.success("Berhasil menambahkan instansi");
    },
    onError: () => {
      toast.error("Gagal menambahkan data instansi");
    },
  });

  async function handleOnSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const objectFormData = Object.fromEntries(formData.entries());
    mutation.mutate({
      nama: objectFormData.nama as string,
      no_hp: objectFormData.no_hp as string,
      email_pembimbing_instansi:
        objectFormData.email_pembimbing_instansi as string,
      jabatan: objectFormData.jabatan as string,
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
              Form Pendaftaran Pembimbing Instansi
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Label
              className="text-sm font-bold"
              htmlFor="nama-pembimbing-instansi"
            >
              Nama Pembimbing Instansi :
            </Label>
            <Textarea
              required
              className="block w-full p-2 border-slate-300 border-[1px] h-42"
              name="nama"
              id="nama-pembimbing-instansi"
              placeholder="Masukkan nama pembimbing instansi disini..."
            ></Textarea>
          </CardContent>

          <CardContent>
            <Label className="text-sm font-bold" htmlFor="email-input">
              Email Pembimbing Instansi :
            </Label>
            <Textarea
              className="block w-full p-2 border-slate-300 border-[1px] h-42"
              name="email_pembimbing_instansi"
              id="email-input"
              placeholder="Masukkan Email Pembimbing Instansi disini..."
            ></Textarea>
          </CardContent>

          <CardContent>
            <Label className="text-sm font-bold" htmlFor="no_hp_input">
              Nomor Handphone :
            </Label>
            <Textarea
              className="block w-full p-2 border-slate-300 border-[1px] h-42"
              name="no_hp"
              id="no_hp_input"
              placeholder="Masukkan Nomor Handphone disini..."
            ></Textarea>
          </CardContent>

          <CardContent>
            <Label className="text-sm font-bold" htmlFor="jabatan-input">
              Jabatan :
            </Label>
            <Textarea
              className="block w-full p-2 border-slate-300 border-[1px] h-42"
              name="jabatan"
              id="jabatan-input"
              placeholder="Masukkan Jabatan Pembimbing Instansi disini..."
            ></Textarea>
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
              className="bg-green-600 py-1 md:w-[198px] font-bold text-white hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              Ajukan Permohonan
            </Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardLayout>
  );
}

export default MahasiswaKerjapraktikDaftarKpPermohonanFormDaftarPembimbingInstansiPage;
