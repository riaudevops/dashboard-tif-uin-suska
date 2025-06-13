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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<
    | {
        response: Boolean;
        message: string;
      }
    | null
    | string
  >(null);

  const [isRejectButtonClicked, setIsRejectButtonClicked] =
    useState<boolean>(false);
  const [rejectMessage, setRejectMessage] = useState<string>("");
  const [level_akses, setlevel_akses] = useState(1);
  const [id_instansi, setid_instansi] = useState("");
  const [tujuan_surat_instansi, settujuan_surat_instansi] = useState("");
  const [link_surat_pengantar, setlink_surat_pengantar] = useState("");
  const [link_surat_balasan, setlink_surat_balasan] = useState("");
  const [id_surat_pengajuan_dospem, set_id_surat_pengajuan_dospem] =
    useState("");
  const [link_surat_penunjukan_dospem, setlink_surat_penunjukan_dospem] =
    useState("");
  const [link_surat_perpanjangan_kp, setlink_surat_perpanjangan_kp] =
    useState("");
  const [kelas_kp, setkelas_kp] = useState("");
  const [alasan_lanjut_kp, setalasan_lanjut_kp] = useState("");
  const [judul_kp, setjudul_kp] = useState("");
  const [status, setstatus] = useState("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { id } = useParams();

  // const getstatusmahasiswa = (status: string) => {
  //   switch (status) {
  //     case "Baru":
  //       return "bg-green-300 ";
  //     case "Lanjut":
  //       return "bg-yellow-500";
  //     case "Selesai":
  //       return "bg-red-500 ";
  //     case "Gagal":
  //       return "bg-red-500";
  //     default:
  //       return "bg-gray-500";
  //   }
  // };

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

  async function handleOnAccept1(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading((prev) => !prev);
    try {
      const axios = api();
      const response = await axios.post(
        `${
          import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
        }/koordinator-kp/daftar-kp/berkas-mahasiswa`,
        {
          id,
          status,
          kelas_kp,
          tujuan_surat_instansi,
          link_surat_pengantar,
          link_surat_balasan,
          link_surat_penunjukan_dospem,
          link_surat_perpanjangan_kp,
          id_surat_pengajuan_dospem,
          level_akses,
          judul_kp,
          alasan_lanjut_kp,
          id_instansi,
        }
      );

      setResponse(response.data.message);
      const pointer = setTimeout(() => {
        setResponse(null);
        clearTimeout(pointer);
      }, 1000);

      setIsEditing((prev) => !prev);
      setIsLoading((prev) => !prev);
    } catch (e) {
      throw new Error("Terjadi kesalahan pada sistem");
    }
  }

  async function handleOnReject1(e: FormEvent<HTMLFormElement>) {
    e.stopPropagation();
    e.preventDefault();
    try {
      const axios = api();
      const response = await axios.post(
        `${
          import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
        }/koordinator-kp/daftar-kp/tolak-berkas-mahasiswa`,
        {
          id: id,
          message: rejectMessage,
        }
      );

      setIsLoading((prev) => !prev);

      setResponse(response.data.message);
      const pointer = setTimeout(() => {
        setResponse(null);
        clearTimeout(pointer);
      }, 1000);

      setIsRejectButtonClicked((prev) => !prev);
    } catch (e) {
      throw new Error("Terjadi kesalahan pada sistem");
    }
  }

  useEffect(() => {
    (async function () {
      const axios = api();
      const response = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
        }/koordinator-kp/daftar-kp/get-data-kp/${id}`
      );
      // if (response.data?.data?.level_akses % 2 === 0) {
      //   setIsEditing(true);
      // }
      setlevel_akses(response.data?.data?.level_akses);
      setid_instansi(response.data?.data?.id_instansi);
      settujuan_surat_instansi(response.data?.data?.tujuan_surat_instansi);
      setlink_surat_pengantar(response.data?.data?.document[1].data);
      setlink_surat_balasan(response.data?.data?.document[2].data);
      set_id_surat_pengajuan_dospem(response.data?.data?.document[3].data);
      setlink_surat_penunjukan_dospem(response.data?.data?.document[4].data);
      setlink_surat_perpanjangan_kp(response.data?.data?.document[5].data);
      setkelas_kp(response.data?.data?.kelas_kp);
      setalasan_lanjut_kp(response.data?.data?.alasan_lanjut_kp);
      setjudul_kp(response.data?.data?.judul_kp);
      setstatus(response.data?.data?.status);
    })();
  }, []);

  // Mock data - in a real app, this would come from your API
  // const biodataMahasiswa = {
  //   name: "John Doe",
  //   nim: "123456789",
  //   status: "Baru",
  //   instansi: "PT. ABC",
  //   semester: 6,
  //   PembimbingInstansi: "Jane Smith",
  //   dosenPembimbing: "Dr. John Smith",
  //   tanggalMulai: "03/02/2024",
  //   tanggalSelesai: "03/05/2024",
  //   linkGdrive: "http://drive.google.com/drive/folders/file.pdf",
  //   alasanPerpanjangan: "Habis masa waktu",
  // };

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
                  onChange={(e) => settujuan_surat_instansi(e.target.value)}
                  value={
                    isEditing
                      ? tujuan_surat_instansi
                      : biodataMahasiswa?.tujuan_surat_instansi || ""
                  }
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
                  onChange={(e) => setlink_surat_pengantar(e.target.value)}
                  value={
                    isEditing
                      ? link_surat_pengantar
                      : (biodataMahasiswa &&
                          biodataMahasiswa.document &&
                          biodataMahasiswa?.document[1]?.data) ||
                        ""
                  }
                />
              </div>

              <div
                className={`mb-3 p-2 rounded-lg flex flex-col ${
                  biodataMahasiswa?.level_akses === 4 ? "bg-green-600" : ""
                }`}
              >
                <Label htmlFor="surat-balasan">Surat Balasan Instansi : </Label>
                <Input
                  onChange={(e) => setlink_surat_balasan(e.target.value)}
                  value={
                    isEditing
                      ? link_surat_balasan
                      : (biodataMahasiswa &&
                          biodataMahasiswa.document &&
                          biodataMahasiswa?.document[2]?.data) ||
                        ""
                  }
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
                  onChange={(e) =>
                    set_id_surat_pengajuan_dospem(e.target.value)
                  }
                  value={
                    isEditing
                      ? id_surat_pengajuan_dospem
                      : (biodataMahasiswa &&
                          biodataMahasiswa.document &&
                          biodataMahasiswa?.document[3]?.data) ||
                        ""
                  }
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
                  onChange={(e) =>
                    setlink_surat_penunjukan_dospem(e.target.value)
                  }
                  value={
                    isEditing
                      ? link_surat_penunjukan_dospem
                      : (biodataMahasiswa &&
                          biodataMahasiswa.document &&
                          biodataMahasiswa?.document[4]?.data) ||
                        ""
                  }
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
                    onChange={(e) =>
                      setlink_surat_perpanjangan_kp(e.target.value)
                    }
                    value={
                      isEditing
                        ? link_surat_perpanjangan_kp
                        : (biodataMahasiswa &&
                            biodataMahasiswa.document &&
                            biodataMahasiswa?.document[5]?.data) ||
                          ""
                    }
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
                    onChange={(e) => setalasan_lanjut_kp(e.target.value)}
                    value={
                      isEditing
                        ? alasan_lanjut_kp
                        : biodataMahasiswa?.alasan_lanjut_kp || ""
                    }
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
                  disabled={isLoading}
                  className={
                    "px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                  }
                >
                  Tolak Permohonan
                </Button>
                <form onSubmit={handleOnAccept}>
                  <Button
                    disabled={isLoading}
                    className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Validasi Permohonan
                  </Button>
                </form>
              </div>
            )}
          {/* {biodataMahasiswa?.level_akses % 2 === 1 && !isEditing && (
            <div className="flex justify-end gap-3 mt-6">
              <Button
                onClick={() => setIsEditing((prev) => !prev)}
                disabled={isLoading}
                className={
                  "px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                }
              >
                Edit
              </Button>
            </div>
          )} */}
          {biodataMahasiswa?.level_akses % 2 === 1 && isEditing && (
            <div className="flex justify-end gap-3 mt-6">
              <Button
                onClick={() => setIsEditing((prev) => !prev)}
                disabled={isLoading}
                className={
                  "px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                }
              >
                Batal
              </Button>
              <form onSubmit={handleOnAccept}>
                <Button
                  disabled={isLoading}
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
          {response && (
            <div className="fixed p-2 left-[50%] -translate-x-0.5 rounded-lg bg-green-600 text-white">
              {response as string}
            </div>
          )}
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
