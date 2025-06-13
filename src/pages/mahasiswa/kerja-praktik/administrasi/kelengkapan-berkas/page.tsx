"use client";

import { Link } from "react-router";
import CardProgressKelengkapanBerkas from "@/components/mahasiswa/daftar-kp/CardProgressKelengkapanBerkas";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import {
  IsPendaftaranKPClosedSync,
  IsPendaftaranKPLanjutClosedSync,
} from "@/helpers/batas-waktu-pendaftaran..validator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import APIDaftarKP from "@/services/api/mahasiswa/daftar-kp.service";
import {
  useQuery,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { ClipboardList } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const DataCardProgressKelengkapanBerkas = [
  "Surat Pengantar",
  "Surat Balasan Instansi",
  "Id Pengajuan Dosen Pembimbing",
  "Surat Penunjukkan Dosen Pembimbing",
  "Selesai",
];

interface StatusValidasiInterface {
  style: string;
  message: string;
}

export default function MahasiswaKerjaPraktekDaftarKPKelengkapanBerkasPage() {
  const [isLanjutKPClicked, setIsLanjutKPClicked] = useState<boolean>(false);
  const [alasan_lanjut_kp, setalasan_lanjut_kp] = useState<string>("");
  const [isEditingSuratPengantar, setIsEditingSuratPengantar] =
    useState<boolean>(false);
  const [isEditingSuratBalasan, setIsEditingSuratBalasan] =
    useState<boolean>(false);
  const [isEditingIdPengajuanDospem, setIsEditingIdPengajuanDospem] =
    useState<boolean>(false);
  const [isEditingSuratPenunjukkanDospem, setIsEditingSuratPenunjukkanDospem] =
    useState<boolean>(false);
  const [isEditingSuratPerpanjanganKP, setIsEditingSuratPerpanjanganKP] =
    useState<boolean>(false);

  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);

  const suratPengantarMutation = useMutation({
    mutationFn: (data: any) => APIDaftarKP.postSuratPengantarKP(data),
    onSuccess: (data: any) => {
      toast({
        title: "Sukses",
        description:
          data.message || "Berhasil mengirimkan surat pengantar kerja praktek",
        duration: 3000,
      });
      setIsEditingSuratPengantar((prev) => !prev);
      queryClient.invalidateQueries({
        queryKey: ["kp-terbaru-kelengkapan-berkas"],
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

  const suratBalasanMutation = useMutation({
    mutationFn: (data: any) => APIDaftarKP.postSuratBalasanKP(data),
    onSuccess: (data: any) => {
      toast({
        title: "Sukses",
        description:
          data.message || "Berhasil mengirimkan surat balasan kerja praktek",
        duration: 3000,
      });
      setIsEditingSuratBalasan((prev) => !prev);
      queryClient.invalidateQueries({
        queryKey: ["kp-terbaru-kelengkapan-berkas"],
        exact: true,
      });
    },
    onError: (data: any) => {
      toast({
        title: "Gagal",
        description:
          data.message || "Gagal mengirimkan surat balasan kerja praktek",
        duration: 3000,
      });
    },
  });

  const idPengajuanDospemMutation = useMutation({
    mutationFn: (data: any) => APIDaftarKP.postIdPengajuanDospem(data),
    onSuccess: (data: any) => {
      toast({
        title: "Sukses",
        description:
          data.message ||
          "Berhasil mengirimkan ID pengajuan dosen pembimbing kerja praktek",
        duration: 3000,
      });
      setIsEditingIdPengajuanDospem((prev) => !prev);
      queryClient.invalidateQueries({
        queryKey: ["kp-terbaru-kelengkapan-berkas"],
        exact: true,
      });
    },
    onError: (data: any) => {
      toast({
        title: "Gagal",
        description:
          data.message ||
          "Gagal mengirimkan ID pengajuan dosen pembimbing kerja praktek",
        duration: 3000,
      });
    },
  });

  const suratPenunjukkanDospemMutation = useMutation({
    mutationFn: (data: any) => APIDaftarKP.postSuratPenunjukkanDospemKP(data),
    onSuccess: (data: any) => {
      toast({
        title: "Sukses",
        description:
          data.message ||
          "Berhasil mengirimkan surat Penunjukkan dosen pembimbing kerja praktek",
        duration: 3000,
      });
      setIsEditingSuratPenunjukkanDospem((prev) => !prev);
      queryClient.invalidateQueries({
        queryKey: ["kp-terbaru-kelengkapan-berkas"],
        exact: true,
      });
    },
    onError: (data: any) => {
      toast({
        title: "Gagal",
        description:
          data.message ||
          "Gagal mengirimkan surat Penunjukkan dosen pembimbing kerja praktek",
        duration: 3000,
      });
    },
  });

  const suratPerpanjanganKPMutation = useMutation({
    mutationFn: (data: any) => APIDaftarKP.postSuratPerpanjanganKP(data),
    onSuccess: (data: any) => {
      toast({
        title: "Sukses",
        description:
          data.message ||
          "Berhasil mengirimkan surat perpanjangan kerja praktek",
        duration: 3000,
      });
      setIsEditingSuratPerpanjanganKP((prev) => !prev);
      queryClient.invalidateQueries({
        queryKey: ["kp-terbaru-kelengkapan-berkas"],
        exact: true,
      });
    },
    onError: (data: any) => {
      toast({
        title: "Gagal",
        description:
          data.message || "Gagal mengirimkan surat perpanjangan kerja praktek",
        duration: 3000,
      });
    },
  });

  let mutation = suratPengantarMutation;
  let key = "linkSuratPengantarKP";
  let InputField = <div></div>;
  let statusValidasi: StatusValidasiInterface = {
    style: "",
    message: "",
  };

  const { data: dataKPTerbaru } = useQuery({
    queryKey: ["kp-terbaru-kelengkapan-berkas"],
    queryFn: () =>
      APIDaftarKP.getKPAktifMahasiswa().then((res) => {
        if (res.data?.level_akses >= 10) {
          setCurrentPage(9);
          setIsLanjutKPClicked(true);
        } else if (res.data?.level_akses % 2 === 0) {
          setCurrentPage(res.data.level_akses - 1);
        } else {
          setCurrentPage(res.data.level_akses);
        }

        return res.data;
      }),
  });

  const { data: tanggalKP } = useQuery({
    queryKey: ["tanggal-daftar-kelengkapan-berkas"],
    queryFn: () => APIDaftarKP.getTanggalDaftarKP(),
  });

  let isPendaftaranKPClosed = true;
  let isPendaftaranKPLanjutClosed = true;

  if (tanggalKP) {
    isPendaftaranKPClosed = IsPendaftaranKPClosedSync(tanggalKP);
    isPendaftaranKPLanjutClosed = IsPendaftaranKPLanjutClosedSync(tanggalKP);
  }

  if (currentPage === 1 && dataKPTerbaru?.level_akses! >= 1) {
    if (dataKPTerbaru?.level_akses === 1) {
      if (dataKPTerbaru.catatan_penolakan) {
        statusValidasi.style = "bg-red-600";
        statusValidasi.message = dataKPTerbaru.catatan_penolakan;
      } else {
        statusValidasi.style = "bg-gray-400";
        statusValidasi.message = "Belum mengirimkan berkas";
      }
    } else if (dataKPTerbaru?.level_akses === 2) {
      statusValidasi.style = "bg-blue-400";
      statusValidasi.message = "menunggu divalidasi oleh Koordinator KP";
    } else {
      statusValidasi.style = "bg-green-600";
      statusValidasi.message =
        "Berkas KP berhasil divalidasi oleh Koordinator KP";
    }
    InputField = (
      <Card className="border-[1px] border-slate-300 ">
        <div className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-bold text-lg">
              Dokumen Surat Pengantar dari Dekan
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Silakan inputkan Link Gdrive dengan file harus berformat pdf.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Label
              className="font-bold text-sm mt-1"
              htmlFor="surat-pengantar-kp"
            >
              Link :{" "}
            </Label>
            <Input
              required
              key="surat-pengantar"
              readOnly={dataKPTerbaru?.level_akses > 1}
              className={`mt-1 text-black p-2 border-[1px] border-slate-300   ${
                dataKPTerbaru?.level_akses > 1 ? "hover:cursor-not-allowed" : ""
              }`}
              type="text"
              placeholder="Masukkan Link Berkas..."
              id="surat-pengantar-kp"
              name="linkSuratPengantarKP"
            />
          </CardContent>
        </div>
      </Card>
    );
  } else if (currentPage === 3 && dataKPTerbaru?.level_akses! >= 3) {
    if (dataKPTerbaru?.level_akses === 3) {
      if (dataKPTerbaru.catatan_penolakan) {
        statusValidasi.style = "bg-red-600";
        statusValidasi.message = dataKPTerbaru.catatan_penolakan;
      } else {
        statusValidasi.style = "bg-gray-400";
        statusValidasi.message = "Belum mengirimkan berkas";
      }
    } else if (dataKPTerbaru?.level_akses === 4) {
      statusValidasi.style = "bg-blue-400";
      statusValidasi.message = "menunggu divalidasi oleh Koordinator KP";
    } else {
      statusValidasi.style = "bg-green-600";
      statusValidasi.message =
        "Berkas KP berhasil divalidasi oleh Koordinator KP";
    }
    key = "linkSuratBalasanKP";
    mutation = suratBalasanMutation;
    InputField = (
      <Card className="border-[1px] border-slate-300 p-3 ">
        <div className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-bold text-lg">
              Dokumen Surat Jawaban dari Instansi
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Silakan inputkan Link Gdrive dengan file harus berformat pdf.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Label
              className="font-bold text-sm mt-1"
              htmlFor="surat-balasan-kp"
            >
              Link :{" "}
            </Label>
            <Input
              required
              key="surat-balasan"
              readOnly={dataKPTerbaru?.level_akses > 3}
              className={`mt-1 text-black p-2 border-[1px] border-slate-300  ${
                dataKPTerbaru?.level_akses > 3 ? "hover:cursor-not-allowed" : ""
              }`}
              type="text"
              placeholder="Masukkan Link Berkas..."
              id="surat-balasan-kp"
              name="linkSuratBalasanKP"
            />
          </CardContent>
        </div>
      </Card>
    );
  } else if (currentPage === 5 && dataKPTerbaru?.level_akses! >= 5) {
    if (dataKPTerbaru?.level_akses === 5) {
      if (dataKPTerbaru.catatan_penolakan) {
        statusValidasi.style = "bg-red-600";
        statusValidasi.message = dataKPTerbaru.catatan_penolakan;
      } else {
        statusValidasi.style = "bg-gray-400";
        statusValidasi.message = "Belum mengirimkan berkas";
      }
    } else if (dataKPTerbaru?.level_akses === 6) {
      statusValidasi.style = "bg-blue-400";
      statusValidasi.message = "menunggu divalidasi oleh Koordinator KP";
    } else {
      statusValidasi.style = "bg-green-600";
      statusValidasi.message =
        "Berkas KP berhasil divalidasi oleh Koordinator KP";
    }
    key = "IdPengajuanDosenPembimbingKP";
    mutation = idPengajuanDospemMutation;
    InputField = (
      <Card className="grid md:grid-cols-2 gap-4">
        <Card className="border-[1px] border-slate-300 p-3 ">
          <CardHeader>
            <CardTitle className="font-bold text-lg">
              Link Pengajuan Dosen Pembimbing pada Portal FST
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Silakan kunjungi link di bawah ini :
            </CardDescription>
          </CardHeader>
          <CardDescription>
            http://seminar-fst.uin-suska.ac.id/akademik/prosedur/pembimbing
          </CardDescription>
        </Card>
        <Card className="border-[1px] border-slate-300 p-3 ">
          <CardHeader>
            <CardTitle className="font-bold text-lg">
              Id Pengajuan Portal FST
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Silakan masukkan Id pengajuan yang telah diperoleh dari portal FST
              :
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Label
              className="font-bold text-sm mt-1"
              htmlFor="id-pengajuan-dosen-pembimbing"
            >
              Id Pengajuan Pembimbing KP :{" "}
            </Label>
            <Input
              required
              key="id-pengajuan-dospem"
              readOnly={dataKPTerbaru?.level_akses > 5}
              className={`mt-1 text-black p-2 border-[1px] border-slate-300  ${
                dataKPTerbaru?.level_akses > 5 ? "hover:cursor-not-allowed" : ""
              }`}
              type="text"
              placeholder="Masukkan Id Pengajuan..."
              id="id-pengajuan-dosen-pembimbing"
              name="IdPengajuanDosenPembimbingKP"
            />
          </CardContent>
        </Card>
      </Card>
    );
  } else if (currentPage === 7 && dataKPTerbaru?.level_akses! >= 7) {
    if (dataKPTerbaru?.level_akses === 7) {
      if (dataKPTerbaru.catatan_penolakan) {
        statusValidasi.style = "bg-red-600";
        statusValidasi.message = dataKPTerbaru.catatan_penolakan;
      } else {
        statusValidasi.style = "bg-gray-400";
        statusValidasi.message = "Belum mengirimkan berkas";
      }
    } else if (dataKPTerbaru?.level_akses === 8) {
      statusValidasi.style = "bg-blue-400";
      statusValidasi.message = "menunggu divalidasi oleh Koordinator KP";
    } else {
      statusValidasi.style = "bg-green-600";
      statusValidasi.message =
        "Berkas KP berhasil divalidasi oleh Koordinator KP";
    }
    key = "linkSuratPenunjukkanDosenPembimbingKP";
    mutation = suratPenunjukkanDospemMutation;
    InputField = (
      <Card className="border-[1px] border-slate-300 p-3 ">
        <div className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-bold text-lg">
              Dokumen Penunjukkan Dosen Pembimbing
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Silakan inputkan Link Gdrive dengan file harus berformat pdf.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Label
              className="font-bold text-sm mt-1"
              htmlFor="surat-penunjukkan-dosen-pembimbing"
            >
              Link :{" "}
            </Label>
            <Input
              required
              key="surat-penunjukkan-dospem"
              readOnly={dataKPTerbaru?.level_akses > 7}
              className={`mt-1 text-black p-2 border-[1px] border-slate-300  ${
                dataKPTerbaru?.level_akses > 7 ? "hover:cursor-not-allowed" : ""
              }`}
              type="text"
              placeholder="Masukkan Link Berkas..."
              id="surat-penunjukkan-dosen-pembimbing"
              name="linkSuratPenunjukkanDosenPembimbingKP"
            />
          </CardContent>
        </div>
      </Card>
    );
  } else if (currentPage === 9 && dataKPTerbaru?.level_akses! >= 9) {
    if (dataKPTerbaru?.level_akses === 9) {
      if (dataKPTerbaru.catatan_penolakan) {
        statusValidasi.style = "bg-red-600";
        statusValidasi.message = dataKPTerbaru.catatan_penolakan;
      } else {
        statusValidasi.style = "bg-gray-400";
        statusValidasi.message = "Belum mengirimkan berkas";
      }
    } else if (dataKPTerbaru?.level_akses === 10) {
      statusValidasi.style = "bg-blue-400";
      statusValidasi.message = "menunggu divalidasi oleh Koordinator KP";
    } else {
      statusValidasi.style = "bg-green-600";
      statusValidasi.message =
        "Berkas KP berhasil divalidasi oleh Koordinator KP";
    }
    key = "linkSuratPerpanjanganKP";
    mutation = suratPerpanjanganKPMutation;
    InputField = (
      <Card className="border-[1px] border-slate-300 p-3 ">
        <div className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-bold text-lg">
              Pendaftaran KP Berhasil
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Silakan mengisi Daily Report Kerja Praktek
            </CardDescription>
          </CardHeader>
          {isPendaftaranKPLanjutClosed === false && isLanjutKPClicked && (
            <Card>
              <CardHeader>
                <CardDescription className="text-xs text-slate-500">
                  Silakan inputkan Link Gdrive dengan file harus berformat pdf.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Label
                  className="font-bold text-sm mt-1"
                  htmlFor="surat-perpanjangan-kp"
                >
                  Link :
                </Label>
                <Input
                  required
                  key="surat-perpanjangan-kp"
                  readOnly={dataKPTerbaru?.level_akses > 9}
                  className={`mt-1 text-black p-2 border-[1px] border-slate-300  ${
                    dataKPTerbaru?.level_akses > 9
                      ? "hover:cursor-not-allowed"
                      : ""
                  }`}
                  type="text"
                  placeholder="Masukkan Link Berkas..."
                  id="surat-perpanjangan-kp"
                  name="linkSuratPerpanjanganKP"
                />

                <Label
                  className="font-bold text-sm mt-1"
                  htmlFor="alasan-lanjut-kp"
                >
                  Alasan Lanjut KP :
                </Label>
                <Textarea
                  onChange={(e) => setalasan_lanjut_kp(e.target.value)}
                  value={
                    dataKPTerbaru?.level_akses > 9
                      ? dataKPTerbaru.alasan_lanjut_kp || ""
                      : alasan_lanjut_kp
                  }
                  readOnly={dataKPTerbaru?.level_akses > 9}
                  className="w-full  border-[1px] border-gray-300"
                  name="alasan_lanjut_kp"
                  id="alasan-lanjut-kp"
                ></Textarea>
              </CardContent>
            </Card>
          )}
          {!isLanjutKPClicked && (
            <>
              {" "}
              <Link
                to={{ pathname: "/mahasiswa/kerja-praktik/daily-report" }}
                className="text-center hover:cursor-pointer rounded-md bg-green-950 py-1 text-white font-bold tracking-wide my-3"
              >
                Pergi ke Halaman Daily Report
              </Link>
              {isPendaftaranKPLanjutClosed === false && (
                <Button
                  onClick={() => setIsLanjutKPClicked((prev) => !prev)}
                  className="text-center hover:cursor-pointer rounded-md bg-green-950 py-1 text-white font-bold tracking-wide mt-2"
                >
                  Ajukan Perpanjangan Kerja Praktek
                </Button>
              )}
            </>
          )}
        </div>
      </Card>
    );
  }

  // if (currentPage <= dataKPTerbaru?.level_akses!) {
  // }

  return (
    <DashboardLayout>
      {isPendaftaranKPClosed && (
        <Card>
          <CardHeader>
            Saat ini masa pendaftaran kerja praktek sudah ditutup
          </CardHeader>
        </Card>
      )}
      {dataKPTerbaru && (
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-2xl tracking-wide">
              Validasi Kelengkapan Berkas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              {DataCardProgressKelengkapanBerkas.map((item, i) => {
                let status: boolean | undefined = false;

                if (dataKPTerbaru?.level_akses! >= i * 2 + 1) {
                  status = true;
                }

                return (
                  <CardProgressKelengkapanBerkas
                    key={i}
                    onClick={() => {
                      if (status) setCurrentPage(i * 2 + 1);
                    }}
                    text={item}
                    number={i + 1}
                    status={status}
                  />
                );
              })}
            </div>
            {(currentPage < 9 || (currentPage >= 9 && isLanjutKPClicked)) && (
              <Card className={` ${statusValidasi.style} mt-4`}>
                <CardHeader>
                  <CardTitle className="font-medium text-lg tracking-wide">
                    Status Validasi Surat Jawaban
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm text-black">
                    {":"} {statusValidasi.message}
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
            <Card className="mt-2">
              <CardDescription className="p-3 font-bold text-black rounded-lg bg-green-200 dark:bg-black ">
                Silakan Isi Form di Bawah ini untuk Divalidasi!
              </CardDescription>
              <form onSubmit={(e) => handleOnSubmitForm(e, mutation, key)}>
                <div className="dark:bg-black bg-green-100 p-3">
                  <CardTitle className="flex items-center gap-2 font-bold text-sm tracking-wide my-2">
                    <ClipboardList /> Validasi Berkas
                  </CardTitle>
                  {InputField}
                </div>
                {currentPage === dataKPTerbaru?.level_akses! &&
                  (dataKPTerbaru?.level_akses! !== 9 ||
                    (dataKPTerbaru.level_akses === 9 &&
                      isPendaftaranKPLanjutClosed === false &&
                      isLanjutKPClicked)) && (
                    <CardFooter className="flex justify-end items-center gap-2 mt-2">
                      <Button
                        disabled={
                          suratPengantarMutation.isPending ||
                          suratBalasanMutation.isPending ||
                          idPengajuanDospemMutation.isPending ||
                          suratPenunjukkanDospemMutation.isPending ||
                          suratPerpanjanganKPMutation.isPending
                        }
                        type="reset"
                        className=" px-16 tracking-wide py-1 font-semibold  hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Kosongkan Formulir
                      </Button>
                      <Button
                        disabled={
                          suratPengantarMutation.isPending ||
                          suratBalasanMutation.isPending ||
                          idPengajuanDospemMutation.isPending ||
                          suratPenunjukkanDospemMutation.isPending ||
                          suratPerpanjanganKPMutation.isPending
                        }
                        type="submit"
                        className=" px-24 py-1 tracking-wide text-white font-medium  bg-green-950 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Kirim
                      </Button>
                    </CardFooter>
                  )}
              </form>
            </Card>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}

function handleOnSubmitForm(
  e: any,
  mutation: UseMutationResult<any, any, any, unknown>,
  key: string
) {
  e.preventDefault();
  const object = new FormData(e.currentTarget);
  const data = Object.fromEntries(object.entries());
  mutation.mutate(data[key]);
}

// function handleOnSubmitForm(
//   url: string,
//   setIsLoading: Dispatch<SetStateAction<boolean>>,
//   setResponse: Dispatch<SetStateAction<CommonResponse | null>>,
//   setDataKPTerbaru: Dispatch<SetStateAction<KPInterface>>
// ) {
//   return async function handleOnSubmit(e: FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setIsLoading((prev) => !prev);
//     const formData = new FormData(e.currentTarget);
//     const objectFormData = Object.fromEntries(formData.entries());
//     const axios = api();
//     axios
//       .post(url, {
//         ...objectFormData,
//       })
//       .then((response) => {
//         setIsLoading((prev) => !prev);
//         setResponse(response.data);
//         setDataKPTerbaru((prev) => {
//           return { ...prev, level_akses: prev.level_akses + 1 };
//         });
//         const pointer = setTimeout(() => {
//           setResponse(null);
//           clearTimeout(pointer);
//         }, 1000);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };
// }

// function FormSuratPengantar({url, isLoading, setIsLoading} : {isLoading : boolean, setIsLoading : Dispatch<SetStateAction<boolean>>, url : string}) {

//   return <form onSubmit={handleOnSubmitForm(url, setIsLoading)}>
//     <div className="bg-green-100 p-3">
//         <h4 className="font-bold text-sm tracking-wide my-2">< ClipboardList /> Validasi Berkas</h4>
//         <div className="border-[1px] border-slate-300 p-3 bg-white ">
//           <div className="flex flex-col">
//           <h3 className="font-bold text-lg">Dokumen Surat Pengantar dari Dekan</h3>
//           <p className="text-xs text-slate-500">Silakan inputkan Link Gdrive dengan file harus berformat pdf.</p>
//           <label className="font-bold text-sm mt-1" htmlFor="nama-pembimbing-instansi">Link : </label>
//           <input className="mt-1 p-2 border-[1px] border-slate-300  " type="text" placeholder="Masukkan Link Berkas..." id="nama-pembimbing-instansi" name="linkSuratPengantarKP"/>
//           </div>
//         </div>
//       </div>
//       <div className="flex justify-end items-center mt-2">
//       <Button disabled={isLoading} type="reset" className=" px-16 tracking-wide py-1 font-semibold  hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Kosongkan Formulir</Button>
//       <button disabled={isLoading} type="submit" className=" px-24 py-1 tracking-wide text-white font-medium  bg-green-950 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Kirim</button>
//       </div>
//   </form>
// }

// function FormSuratBalasanInstansi({url} : {url : string}) {

//   return <form onSubmit={handleOnSubmitForm(url, setIsLoading)}>
//     <div className="bg-green-100 p-3">
//         <h4 className="font-bold text-sm tracking-wide my-2">< ClipboardList /> Validasi Berkas</h4>
//         <div className="border-[1px] border-slate-300 p-3 bg-white ">
//           <div className="flex flex-col">
//           <h3 className="font-bold text-lg">Dokumen Surat Pengantar dari Dekan</h3>
//           <p className="text-xs text-slate-500">Silakan inputkan Link Gdrive dengan file harus berformat pdf.</p>
//           <label className="font-bold text-sm mt-1" htmlFor="nama-pembimbing-instansi">Link : </label>
//           <input className="mt-1 p-2 border-[1px] border-slate-300 " type="text" placeholder="Masukkan Link Berkas..." id="nama-pembimbing-instansi" name="linkSuratPengantarKP"/>
//           </div>
//         </div>
//       </div>
//       <div className="flex justify-end items-center mt-2">
//       <button disabled={isLoading} type="reset" className=" px-16 tracking-wide py-1 font-semibold  hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Kosongkan Formulir</button>
//       <button disabled={isLoading} type="submit" className=" px-24 py-1 tracking-wide text-white font-medium  bg-green-950 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Kirim</button>
//       </div>
//   </form>
// }

// function FormSuratBalasanInstansi1(url : string) {

//   return <form>
//     <div className="bg-green-100 p-3">
//         <h4 className="font-bold text-sm tracking-wide my-2">< ClipboardList /> Kontak Pembimbing Instansi</h4>
//         <div className="border-[1px] border-slate-300 p-3 bg-white ">
//           <div className="flex flex-col mt-2">
//           <label className="font-bold text-sm" htmlFor="nama-pembimbing-instansi">Nama Pembimbing Instansi</label>
//           <input className="p-1 border-[1px] border-slate-300 " type="text" placeholder="Nama Penanggung Jawab Instansi..." id="nama-pembimbing-instansi"/>
//           </div>
//           <div className="flex flex-col mt-2">
//           <label className="font-bold text-sm" htmlFor="email-resmi-pembimbing-instansi">Email Resmi Pembimbing Instansi</label>
//           <input className="p-1 border-[1px] border-slate-300 " type="text" placeholder="Nama Penanggung Jawab Instansi..." id="email-resmi-pembimbing-instansi"/>
//           </div>
//         </div>
//       </div>
//     </form>
// }
