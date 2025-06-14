import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  Building,
  GraduationCap,
  ContactRound,
  Calendar,
  Building2,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect, FormEvent } from "react";
import { KPDetailsInterface } from "@/interfaces/pages/mahasiswa/pendaftaran-kp.interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/axios-instance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import APIDaftarKP from "@/services/api/mahasiswa/daftar-kp.service";
import { toast } from "@/hooks/use-toast";

const KoordinatorKerjaPraktikPermohonanDetailPage = () => {
  const [isRejectButtonClicked, setIsRejectButtonClicked] =
    useState<boolean>(false);
  const [rejectMessage, setRejectMessage] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { id } = useParams();

  const queryClient = useQueryClient();

  const { data: dataInstansi } = useQuery({
    queryKey: ["koordinator-kp-data-instansi-mahasiswa"],
    queryFn: () => APIDaftarKP.getAllDataInstansi().then((res) => res.data),
  });

  const { data: biodataMahasiswa } = useQuery({
    queryKey: ["koordinator-kp-data-detail-mahasiswa"],
    queryFn: () => APIDaftarKP.getDataKPMahasiswa(id).then((res) => res.data),
  });

  const accMutation = useMutation({
    mutationFn: (data: any) => APIDaftarKP.postACCBerkasMahasiswa(data),
    onSuccess: (data: any) => {
      toast({
        title: "Sukses",
        description:
          data.message || "Berhasil mengirimkan surat pengantar kerja praktek",
        duration: 3000,
      });
      queryClient.invalidateQueries({
        queryKey: ["koordinator-kp-data-detail-mahasiswa"],
        exact: true,
      });
    },
    onError: (data: any) => {
      toast({
        title: "Gagal",
        description:
          data.message || "Gagal mengirimkan surat pengantar kerja praktek",
        duration: 3000,
      });
    },
  });

  const { data: dataKPMahasiswa } = useQuery({
    queryKey: ["kp-terbaru-mahasiswa-detail-koordinator-kp"],
    queryFn: () => APIDaftarKP.getDataKPMahasiswa(id),
  });

  const tolakMutation = useMutation({
    mutationFn: (data: any) => APIDaftarKP.postTolakBerkasMahasiswa(data),
    onSuccess: (data: any) => {
      toast({
        title: "Sukses",
        description:
          data.message || "Berhasil mengirimkan surat pengantar kerja praktek",
        duration: 3000,
      });
      queryClient.invalidateQueries({
        queryKey: ["koordinator-kp-data-detail-mahasiswa"],
        exact: true,
      });
      setIsRejectButtonClicked(false);
    },
    onError: (data: any) => {
      toast({
        title: "Gagal",
        description:
          data.message || "Gagal mengirimkan surat pengantar kerja praktek",
        duration: 3000,
      });
    },
  });

  function handleOnAccept(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    accMutation.mutate({ id, message: "Berhasil" });
  }

  function handleOnReject(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    tolakMutation.mutate({ id, message: rejectMessage });
  }

  // async function handleOnEdit(e: FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   setIsLoading((prev) => !prev);
  //   try {
  //     const axios = api();
  //     const response = await axios.post(
  //       `${
  //         import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
  //       }/koordinator-kp/daftar-kp/berkas-mahasiswa`,
  //       {
  //         id,
  //         status,
  //         kelas_kp,
  //         tujuan_surat_instansi,
  //         link_surat_pengantar,
  //         link_surat_balasan,
  //         link_surat_penunjukan_dospem,
  //         link_surat_perpanjangan_kp,
  //         id_surat_pengajuan_dospem,
  //         level_akses,
  //         judul_kp,
  //         alasan_lanjut_kp,
  //         id_instansi,
  //       }
  //     );

  //     setResponse(response.data.message);
  //     const pointer = setTimeout(() => {
  //       setResponse(null);
  //       clearTimeout(pointer);
  //     }, 1000);

  //     setIsEditing((prev) => !prev);
  //     setIsLoading((prev) => !prev);
  //   } catch (e) {
  //     throw new Error("Terjadi kesalahan pada sistem");
  //   }
  // }

  // Render different content based on status
  const renderStatusContent = (
    <>
      {/* Riwayat Permohonan Kerja Praktik Section */}
      <Card className="mt-6 rounded-lg  border border-gray-100 dark:border-gray-700 shadow-md overflow-hidden">
        <div className="p-6">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
              Riwayat Permohonan Kerja Praktik
            </CardTitle>
          </CardHeader>

          {/* Periode Kerja Praktik */}
          <Card className="mb-6 bg-white dark:bg-gray-800/50 rounded-lg p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Periode Kerja Praktik
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Tanggal Mulai
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    readOnly={!isEditing}
                    value={
                      biodataMahasiswa?.tanggal_mulai
                        ?.slice(0, 10)
                        .replaceAll("-", "/") || ""
                    }
                    key="tanggal-mulai"
                    type="Input"
                    className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md block w-full pl-10 p-2.5 
                        dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:placeholder-gray-400 
                        focus:ring-primary focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instansi/Perusahaan */}
          <Card className="mb-6 bg-white dark:bg-gray-800/50 rounded-lg p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Instansi/Perusahaan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label
                  htmlFor="nama-instansi"
                  className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
                >
                  Nama Instansi / Perusahaan
                </Label>
                {!isEditing && (
                  <Input
                    readOnly
                    key="nama-instansi"
                    id="nama-instansi"
                    value={biodataMahasiswa?.instansi?.nama || "Tidak tersedia"}
                    type="text"
                    className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md block w-full p-2.5 
                      dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:placeholder-gray-400 
                      focus:ring-primary focus:border-primary focus:outline-none"
                    placeholder="Masukkan nama instansi"
                  />
                )}
                {isEditing && (
                  <select
                    className="bg-white block w-[100%] p-2"
                    name="idInstansi"
                    id="instansi"
                  >
                    <option value="">Pilih Instansi</option>
                    {dataInstansi?.map(({ id, nama }: any) => (
                      <option
                        selected={biodataMahasiswa?.instansi?.id === id}
                        key={id}
                        value={id}
                      >
                        {nama}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <Label
                  htmlFor="tujuan-surat-instansi"
                  className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
                >
                  Tujuan Surat Instansi/ Perusahaan
                </Label>
                <Textarea
                  id="tujuan-surat-instansi"
                  key="tujuan_surat_instansi"
                  className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md block w-full p-2.5 
                      dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:placeholder-gray-400 
                      focus:ring-primary focus:border-primary focus:outline-none min-h-24 resize-none"
                  placeholder="Masukkan tujuan surat"
                ></Textarea>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg border border-gray-100 shadow-sm p-4 mb-6">
            <CardHeader>
              <CardTitle className="font-bold tracking-wide text-md text-gray-600">
                Berkas Mahasiswa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`mb-3 p-2 rounded-lg flex flex-col ${
                  biodataMahasiswa?.level_akses === 2 ? "bg-green-600" : ""
                }`}
              >
                <Label htmlFor="surat-pengantar">Surat Pengantar : </Label>
                <Input
                  readOnly={!isEditing}
                  className="p-2 border border-gray-300 rounded-lg bg-gray-100"
                  type="text"
                  id="surat-pengantar"
                />
              </div>

              <div
                className={`mb-3 p-2 rounded-lg flex flex-col ${
                  biodataMahasiswa?.level_akses === 4 ? "bg-green-600" : ""
                }`}
              >
                <Label htmlFor="surat-balasan">Surat Balasan Instansi : </Label>
                <Input
                  readOnly={!isEditing}
                  className="p-2 border border-gray-300 rounded-lg bg-gray-100"
                  type="text"
                  id="surat-balasan"
                />
              </div>

              <div
                className={`mb-3 p-2 rounded-lg flex flex-col ${
                  biodataMahasiswa?.level_akses === 6 ? "bg-green-600" : ""
                }`}
              >
                <Label htmlFor="id-pengajuan">
                  Id Pengajuan Dosen Pembimbing :{" "}
                </Label>
                <Input
                  readOnly={!isEditing}
                  className="p-2 border border-gray-300 rounded-lg bg-gray-100"
                  type="text"
                  id="id-pengajuan"
                />
              </div>

              <div
                className={`mb-3 p-2 rounded-lg flex flex-col ${
                  biodataMahasiswa?.level_akses === 8 ? "bg-green-600" : ""
                }`}
              >
                <Label htmlFor="surat-penunjukkan">
                  Surat Penunjukkan Dosen Pembimbing :{" "}
                </Label>
                <Input
                  readOnly={!isEditing}
                  className="p-2 border border-gray-300 rounded-lg bg-gray-100"
                  type="text"
                  id="surat-penunjukkan"
                />
              </div>
              <div
                className={`mb-3 p-2 rounded-lg flex flex-col ${
                  biodataMahasiswa?.level_akses === 10 ? "bg-green-600" : ""
                }`}
              >
                <div>
                  <Label htmlFor="surat-lanjut">Surat Perpanjangan KP : </Label>
                  <Input
                    readOnly={!isEditing}
                    className="p-2 border border-gray-300 rounded-lg bg-gray-100"
                    type="text"
                    id="surat-lanjut"
                  />
                </div>
                <div>
                  <Label htmlFor="alasan-lanjut-kp">
                    Alasan Lanjut Kerja Praktek :
                  </Label>
                  <Textarea
                    readOnly={!isEditing}
                    className="p-2 border border-gray-300 rounded-lg bg-gray-100"
                    id="alasan-lanjut-kp"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}

          {biodataMahasiswa?.level_akses !== 0 &&
            biodataMahasiswa?.level_akses % 2 === 0 && (
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  onClick={() => setIsRejectButtonClicked(true)}
                  disabled={accMutation.isPending || tolakMutation.isPending}
                  className={
                    "px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                  }
                >
                  Tolak Permohonan
                </Button>
                <form onSubmit={handleOnAccept}>
                  <Button
                    disabled={accMutation.isPending || tolakMutation.isPending}
                    className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Validasi Permohonan
                  </Button>
                </form>
              </div>
            )}
          {biodataMahasiswa?.level_akses % 2 === 1 && isEditing && (
            <div className="flex justify-end gap-3 mt-6">
              <Button
                onClick={() => setIsEditing((prev) => !prev)}
                disabled={accMutation.isPending || tolakMutation.isPending}
                className={
                  "px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                }
              >
                Batal
              </Button>
              <form onSubmit={handleOnAccept}>
                <Button
                  disabled={accMutation.isPending || tolakMutation.isPending}
                  className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Perbarui
                </Button>
              </form>
            </div>
          )}
        </div>
      </Card>
    </>
  );
  return (
    <>
      <DashboardLayout>
        <div
          className={`${isRejectButtonClicked ? "z-[49]" : ""}`}
          onClick={() =>
            isRejectButtonClicked
              ? setIsRejectButtonClicked((prev) => !prev)
              : ""
          }
        >
          {isRejectButtonClicked && (
            <Card
              onClick={(e: any) => e.stopPropagation()}
              className="fixed flex flex-col justify-between h-[30%] gap-2 z-50 p-2 border-[1px] border-black bg-white rounded-lg left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]"
            >
              <CardHeader>
                <CardTitle className="font-bold tracking-wide text-lg">
                  Penolakan Berkas Mahasiswa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <Label htmlFor="alasan-penolakan">
                    Alasan Penolakan Berkas :{" "}
                  </Label>
                  <Input
                    readOnly={isEditing}
                    value={rejectMessage}
                    onChange={(e) => setRejectMessage(e.currentTarget.value)}
                    type="text"
                    id="alasan-penolakan"
                    className="rounded-lg border-[1px] border-slate-300 p-2"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button
                  onClick={() => setIsRejectButtonClicked((prev) => !prev)}
                  className="rounded-lg p-2"
                >
                  Batal
                </Button>
                <form onClick={handleOnReject}>
                  <Button className="rounded-lg text-white bg-red-500 p-2">
                    Tolak Berkas
                  </Button>
                </form>
              </CardFooter>
            </Card>
          )}
          {/* Biodata Section */}
          <Card className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800/40 dark:to-gray-800/20 rounded-lg border border-gray-100 dark:border-gray-700 shadow-md overflow-hidden">
            {/* Header Section with Avatar */}
            <div className="bg-emerald-500  p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white dark:bg-gray-800 rounded-full h-12 w-12 flex items-center justify-center shadow-inner border border-primary/20">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-50 dark:text-gray-100">
                    {biodataMahasiswa?.mahasiswa?.nama || "Loading..."}
                  </CardTitle>
                  <div className="flex items-center  text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center text-white">
                      <CardTitle>{biodataMahasiswa?.status}</CardTitle>
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
                <CardTitle className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {biodataMahasiswa?.mahasiswa?.nama || "Loading..."}
                </CardTitle>
              </div>
            </div>

            {/* Info Cards */}
            <Card>
              <div className="p-4 bg-emerald-100">
                <div className=" grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* NIM Card */}
                  <Card className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-bl-full -translate-y-6 translate-x-6 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-300"></div>
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2.5">
                        <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xs font-medium text-gray-800 dark:text-gray-400 uppercase tracking-wider">
                          Instansi
                        </CardTitle>
                        <CardDescription className="text-base  text-gray-500 dark:text-gray-200">
                          {biodataMahasiswa?.instansi?.nama ||
                            "Belum Ada Instansi"}
                        </CardDescription>
                      </div>
                    </div>
                  </Card>

                  {/* Instansi Card */}
                  <Card className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 dark:bg-emerald-900/20 rounded-bl-full -translate-y-6 translate-x-6 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-300"></div>

                    <div className="flex items-center gap-3 relative z-10">
                      <div className="bg-blue-100 dark:bg-emerald-900/30 rounded-lg p-2.5">
                        <ContactRound className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xs font-medium text-gray-800 dark:text-gray-400 uppercase tracking-wider">
                          Pembimbing Instansi
                        </CardTitle>
                        <CardDescription className="text-base font-bold text-gray-800 dark:text-gray-200">
                          {biodataMahasiswa?.instansi?.pembimbing_instansi
                            ?.nama || "Belum Ada Pembimbing Instansi"}
                        </CardDescription>
                      </div>
                    </div>
                  </Card>

                  {/* Dosen Card */}
                  <Card className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 dark:bg-purple-900/20 rounded-bl-full -translate-y-6 translate-x-6 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-300"></div>

                    <div className="flex items-center gap-3 relative z-10">
                      <div className="bg-blue-100 dark:bg-purple-900/30 rounded-lg p-2.5">
                        <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xs font-medium text-gray-800 dark:text-gray-400 uppercase tracking-wider">
                          Dosen Pembimbing
                        </CardTitle>
                        <CardDescription className="text-base font-bold text-gray-800 dark:text-gray-200">
                          {biodataMahasiswa?.dosen_pembimbing?.nama ||
                            "Belum Ada Dosen Pembimbing"}
                        </CardDescription>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </Card>
          </Card>
          {renderStatusContent}
        </div>
      </DashboardLayout>
    </>
  );
};

export default KoordinatorKerjaPraktikPermohonanDetailPage;
