import { FormEvent, useState } from "react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import APIDaftarKP from "@/services/api/mahasiswa/daftar-kp.service";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Circle,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ErrorInterface } from "@/interfaces/pages/error.type";

function MahasiswaKerjaPraktikDaftarKPPermohonanFormDaftarInstansiPage() {
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: 0.51044,
    lng: 101.438309,
  });

  const [radius, setRadius] = useState<number>(500);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => APIDaftarKP.postDataInstansi(data),
    onSuccess: (data) => {
      toast.success(data.message || "Berhasil mengirimkan data instansi");
    },
    onError: (data: ErrorInterface) => {
      toast.error(
          data?.response?.data?.message || "Gagal mengirimkan data instansi");
    },
  });

  async function handleOnSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const objectFormData = Object.fromEntries(formData.entries());
    mutate({ objectFormData, position, radius });
  }

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });

    return (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    );
  }
  return (
    <DashboardLayout>
      <Card>
        <form onSubmit={handleOnSubmit}>
          <CardHeader>
            <CardTitle className="text-center font-bold text-2xl mb-6">
              Form Pengajuan Instansi Kerja praktik
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 md:gap-8 gap-10">
            <Card className="p-3">
              <MapContainer
                className="z-[0]"
                center={[position.lat, position.lng]}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: 600 }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Circle radius={radius} center={position} />
                <LocationMarker />
              </MapContainer>

              <Label className="text-sm font-bold" htmlFor="longitude">
                Longitude
              </Label>
              <Input
                required
                className=" block w-full border-[1px] border-slate-300 rounded-md p-1 mb-4"
                type="number"
                id="longitude"
                name="longitude"
                value={position.lng}
                onChange={(e) =>
                  setPosition((prev) => {
                    return {
                      ...prev,
                      lng: parseFloat(e.currentTarget.value) || 0,
                    };
                  })
                }
              />

              <Label className="text-sm font-bold" htmlFor="latitude">
                Latitude
              </Label>
              <Input
                required
                className=" block w-full border-[1px] border-slate-300 rounded-md p-1 mb-4"
                type="number"
                id="latitude"
                name="latitude"
                value={position.lat}
                onChange={(e) =>
                  setPosition((prev) => {
                    return {
                      ...prev,
                      lat: parseFloat(e.currentTarget.value) || 0,
                    };
                  })
                }
              />
              <Label className="text-sm font-bold" htmlFor="radius">
                Radius
              </Label>
              <Input
                required
                className=" block w-full border-[1px] border-slate-300 rounded-md p-1 mb-4"
                type="number"
                id="radius"
                name="radius"
                value={radius}
                onChange={(e) =>
                  setRadius(parseFloat(e.currentTarget.value) || 0)
                }
              />
            </Card>
            <Card className="flex flex-col justify-between border-none shadow-none">
              <Card className="border-[1px] border-slate-200 p-3">
                <CardTitle className="font-bold text-lg mb-2">
                  🏢 Instansi/Perusahaan
                </CardTitle>
                <Label className="text-sm font-bold" htmlFor="instansi">
                  Nama Instansi / Perusahaan
                </Label>
                <Input
                  required
                  className=" block w-full border-[1px] border-slate-300 rounded-md p-1 mb-4"
                  placeholder="Nama Perusahaan..."
                  type="text"
                  id="instansi"
                  name="namaInstansi"
                />

                <Label className="text-sm font-bold" htmlFor="alamat-instansi">
                  Alamat Instansi / Perusahaan
                </Label>
                <Textarea
                  className="block w-full border-[1px] border-slate-300 rounded-md p-1 mb-4"
                  placeholder="Alamat Perusahaan..."
                  rows={3}
                  id="alamat-instansi"
                  name="alamatInstansi"
                />

                <Label className="text-sm font-bold" htmlFor="jenis-instansi">
                  Jenis Instansi
                </Label>
                <select
                  className="block w-full my-2 dark:bg-black dark:white border-[1px] rounded-lg p-2 border-slate-300"
                  name="jenisInstansi"
                  id="jenis-instansi"
                >
                  <option value="">Pilih Jenis Instansi</option>
                  <option value="Pemerintahan">Pemerintahan</option>
                  <option value="Swasta">Swasta</option>
                  <option value="Pendidikan">Pendidikan</option>
                  <option value="UMKM">UMKM</option>
                </select>

                <Label className="text-sm font-bold" htmlFor="profil-singkat">
                  Profil Singkat
                </Label>
                <textarea
                  className="block w-full dark:bg-black dark:white rounded-lg border-[1px] p-1 border-slate-300"
                  name="profilSingkat"
                  id="profil-singkat"
                  rows={5}
                ></textarea>
              </Card>
              <Card className="p-3">
                <CardTitle className="font-bold text-lg mb-2 md:mt-0 mt-10">
                  🏢 Kontak Instansi
                </CardTitle>
                <Label
                  className="text-sm font-bold"
                  htmlFor="nama-penanggung-jawab"
                >
                  Nama Penanggung Jawab Instansi
                </Label>
                <Input
                  required
                  className=" block w-full border-[1px] border-slate-300 rounded-md p-1 mb-4"
                  placeholder="Nama Penanggung Jawab..."
                  type="text"
                  id="nama-penanggung-jawab"
                  name="namaPenanggungJawabInstansi"
                />

                <Label
                  className="text-sm font-bold"
                  htmlFor="no-telp-penanggung-jawab-instansi"
                >
                  No Telpon Penanggung Jawab Instansi
                </Label>
                <Input
                  required
                  className=" block w-full border-[1px] border-slate-300 rounded-md p-1 mb-4"
                  placeholder="+62-000-0000-0000"
                  type="text"
                  id="no-telp-penanggung-jawab-instansi"
                  name="telpPenanggungJawabInstansi"
                />
              </Card>
            </Card>
          </CardContent>

          <CardFooter className="text-end mt-4 sm:flex sm:flex-col sm:gap-2 md:block">
            <Button
              type="reset"
              disabled={isPending}
              className="md:mr-4 py-1 md:w-[198px] font-bold border-black border-[1px] hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-green-600 text-white py-1 md:w-[198px] font-bold hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              Ajukan Permohonan
            </Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardLayout>
  );
}

export default MahasiswaKerjaPraktikDaftarKPPermohonanFormDaftarInstansiPage;