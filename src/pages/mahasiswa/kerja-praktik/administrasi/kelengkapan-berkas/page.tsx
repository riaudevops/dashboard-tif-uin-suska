"use client";

import { Link } from "react-router";
import CardProgressKelengkapanBerkas from "@/components/mahasiswa/daftar-kp/CardProgressKelengkapanBerkas";
import { useState } from "react";
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
import { toast } from "sonner";
import { ErrorInterface } from "@/interfaces/pages/error.type";

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

export default function MahasiswaKerjapraktikDaftarKPKelengkapanBerkasPage() {
  const [isLanjutKPClicked, setIsLanjutKPClicked] = useState<boolean>(false);
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

  const unggahBerkasMutation = useMutation({
    mutationFn: (data: any) => APIDaftarKP.unggahBerkasPendafataranKP(data),
    onSuccess: (data: any) => {
      toast.success(
        data.message || "Berhasil mengirimkan surat perpanjangan kerja praktik"
      );
      queryClient.invalidateQueries({
        queryKey: ["kp-terbaru-kelengkapan-berkas"],
        exact: true,
      });
      if (currentPage !== dataKPTerbaru?.level_akses)
        setIsEditingSuratPerpanjanganKP((prev) => !prev);
    },
    onError: (data: ErrorInterface) => {
      toast.error(
        data?.response?.data?.message ||
          "Gagal mengirimkan surat perpanjangan kerja praktik"
      );
    },
  });

  let statusValidasi: StatusValidasiInterface = {
    style: "",
    message: "",
  };

  let isEditing = isEditingSuratPengantar;
  let setIsEditing = setIsEditingSuratPengantar;

  const { data: dataKPTerbaru, isError: isErrorDataKPTerbaru } = useQuery({
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

  const { data: dataPembimbingInstansi, isError: isErrorPembimbingInstansi } =
    useQuery({
      queryKey: ["halaman-kelengkapan-berkas-data-pembimbing-instansi"],
      queryFn: () =>
        APIDaftarKP.getPembimbingInstansi().then((res) => res.data),
    });

  console.log(dataPembimbingInstansi);

  const { data: tanggalKP } = useQuery({
    queryKey: ["tanggal-daftar-kelengkapan-berkas"],
    queryFn: () => APIDaftarKP.getTanggalDaftarKP().then((res) => res.data),
  });

  let isPendaftaranKPClosed = true;
  let isPendaftaranKPLanjutClosed = true;

  if (tanggalKP) {
    isPendaftaranKPClosed = IsPendaftaranKPClosedSync(tanggalKP);
    isPendaftaranKPLanjutClosed = IsPendaftaranKPLanjutClosedSync(tanggalKP);
  }

  if (
    dataKPTerbaru &&
    dataKPTerbaru?.dokumen_pendaftaran_kp[1]?.status === "Ditolak"
  ) {
    statusValidasi.style = "bg-red-600";
    statusValidasi.message =
      (dataKPTerbaru && dataKPTerbaru?.dokumen_pendaftaran_kp[1]?.catatan) ||
      "Periksa kembali dokumen anda";
  } else if (
    dataKPTerbaru &&
    dataKPTerbaru?.dokumen_pendaftaran_kp[1]?.status === "Terkirim"
  ) {
    statusValidasi.style = "bg-blue-400";
    statusValidasi.message = "menunggu divalidasi oleh Koordinator KP";
  } else if (
    dataKPTerbaru &&
    dataKPTerbaru?.dokumen_pendaftaran_kp[1]?.status === "Divalidasi"
  ) {
    statusValidasi.style = "bg-green-600";
    statusValidasi.message =
      "Berkas KP berhasil divalidasi oleh Koordinator KP";
  } else {
    statusValidasi.style = "bg-gray-400";
    statusValidasi.message = "Belum mengirimkan berkas";
  }
  let InputField = (
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
          {isEditing || currentPage === dataKPTerbaru?.level_akses ? (
            <Input
              required
              key="surat-pengantar"
              className={"mt-1 p-2 border-[1px] border-slate-300"}
              type="text"
              placeholder="Masukkan Link Berkas..."
              id="surat-pengantar-kp"
              name="data"
            />
          ) : (
            <p>
              {(dataKPTerbaru &&
                dataKPTerbaru &&
                dataKPTerbaru?.dokumen_pendaftaran_kp[1]?.data) ||
                "Data tidak tersedia"}
            </p>
          )}
          <Input readOnly className="hidden" name="nomorBerkas" value={1} />
        </CardContent>
      </div>
    </Card>
  );

  if (currentPage === 3 && dataKPTerbaru?.level_akses! >= 3) {
    isEditing = isEditingSuratBalasan;
    if (dataKPTerbaru.dokumen_pendaftaran_kp[2]?.status === "Ditolak") {
      statusValidasi.style = "bg-red-600";
      statusValidasi.message =
        dataKPTerbaru.dokumen_pendaftaran_kp[2]?.catatan ||
        "Periksa kembali dokumen anda";
    } else if (dataKPTerbaru.dokumen_pendaftaran_kp[2]?.status === "Terkirim") {
      statusValidasi.style = "bg-blue-400";
      statusValidasi.message = "menunggu divalidasi oleh Koordinator KP";
    } else if (
      dataKPTerbaru.dokumen_pendaftaran_kp[2]?.status === "Divalidasi"
    ) {
      statusValidasi.style = "bg-green-600";
      statusValidasi.message =
        "Berkas KP berhasil divalidasi oleh Koordinator KP";
    } else {
      statusValidasi.style = "bg-gray-400";
      statusValidasi.message = "Belum mengirimkan berkas";
    }
    setIsEditing = setIsEditingSuratBalasan;
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
            {isEditing || currentPage === dataKPTerbaru?.level_akses! ? (
              <>
                <Input
                  required
                  key="surat-balasan"
                  className="mt-1 p-2 border-[1px] border-slate-300"
                  type="text"
                  placeholder="Masukkan Link Berkas..."
                  id="surat-balasan-kp"
                  name="data"
                />
                <Label
                  className="text-sm font-bold mt-6"
                  htmlFor="pembimbing-instansi"
                >
                  Nama Pembimbing Instansi / Perusahaan
                </Label>
                <CardContent className="p-0 rounded-md border-black border-[1px]">
                  <select
                    required
                    name="email_pembimbing_instansi"
                    id="pembimbing-instansi"
                    className="dark:bg-black dark:border-white dark:border-[1px] rounded-lg block w-[100%] p-2"
                  >
                    <option value="">Pilih Pembimbing Instansi</option>
                    {dataPembimbingInstansi &&
                      dataPembimbingInstansi.map(({ email, nama }: any) => (
                        <option key={email} value={email}>
                          {nama}
                        </option>
                      ))}
                  </select>
                </CardContent>

                <CardDescription className="text-sm text-slate-500">
                  Pembimbing Instansi belum terdaftar? Daftarkan segera{" "}
                  <Link
                    className="text-blue-500"
                    to={{
                      pathname:
                        "/mahasiswa/kerja-praktik/daftar-kp/permohonan/form-daftar-pembimbing-instansi",
                    }}
                  >
                    Disini
                  </Link>
                </CardDescription>

                <Label
                  className="font-bold text-sm mt-1"
                  htmlFor="tanggal-mulai"
                >
                  Tanggal Mulai : {"(Optional)"}
                </Label>
                <Input
                  type="date"
                  name="tanggalMulai"
                  id="tanggal-mulai"
                  className="mt-1 p-2 border-[1px] border-slate-300"
                />
                <Label
                  className="font-bold text-sm mt-1"
                  htmlFor="tanggal-selesai"
                >
                  Tanggal Selesai : {"(Optional)"}
                </Label>
                <Input
                  type="date"
                  name="tanggalSelesai"
                  id="tanggal-selesai"
                  className="mt-1 p-2 border-[1px] border-slate-300"
                />
              </>
            ) : (
              <p>
                {(dataKPTerbaru &&
                  dataKPTerbaru.dokumen_pendaftaran_kp[2]?.data) ||
                  "Data tidak tersedia"}
              </p>
            )}
            <Input readOnly className="hidden" name="nomorBerkas" value={2} />
          </CardContent>
        </div>
      </Card>
    );
  } else if (currentPage === 5 && dataKPTerbaru?.level_akses! >= 5) {
    isEditing = isEditingIdPengajuanDospem;
    if (dataKPTerbaru.dokumen_pendaftaran_kp[3]?.status === "Ditolak") {
      statusValidasi.style = "bg-red-600";
      statusValidasi.message =
        dataKPTerbaru.dokumen_pendaftaran_kp[3]?.catatan ||
        "Periksa kembali dokumen anda";
    } else if (dataKPTerbaru.dokumen_pendaftaran_kp[3]?.status === "Terkirim") {
      statusValidasi.style = "bg-blue-400";
      statusValidasi.message = "menunggu divalidasi oleh Koordinator KP";
    } else if (
      dataKPTerbaru.dokumen_pendaftaran_kp[3]?.status === "Divalidasi"
    ) {
      statusValidasi.style = "bg-green-600";
      statusValidasi.message =
        "Berkas KP berhasil divalidasi oleh Koordinator KP";
    } else {
      statusValidasi.style = "bg-gray-400";
      statusValidasi.message = "Belum mengirimkan berkas";
    }
    setIsEditing = setIsEditingIdPengajuanDospem;
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
            <CardDescription>
              <a
                target="_blank"
                href="http://seminar-fst.uin-suska.ac.id/akademik/prosedur/pembimbing"
              >
                http://seminar-fst.uin-suska.ac.id/akademik/prosedur/pembimbing
              </a>
            </CardDescription>
          </CardHeader>
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
            {isEditing || currentPage === dataKPTerbaru?.level_akses! ? (
              <Input
                required
                key="id-pengajuan-dospem"
                className={"mt-1 p-2 border-[1px] border-slate-300"}
                type="text"
                placeholder="Masukkan Id Pengajuan..."
                id="id-pengajuan-dosen-pembimbing"
                name="data"
              />
            ) : (
              <p>{dataKPTerbaru?.dokumen_pendaftaran_kp[3]?.data}</p>
            )}
            <Input readOnly className="hidden" name="nomorBerkas" value={3} />
          </CardContent>
        </Card>
      </Card>
    );
  } else if (currentPage === 7 && dataKPTerbaru?.level_akses! >= 7) {
    isEditing = isEditingSuratPenunjukkanDospem;
    if (dataKPTerbaru.dokumen_pendaftaran_kp[4]?.status === "Ditolak") {
      statusValidasi.style = "bg-red-600";
      statusValidasi.message =
        dataKPTerbaru.dokumen_pendaftaran_kp[4]?.catatan ||
        "Periksa kembali dokumen anda";
    } else if (dataKPTerbaru.dokumen_pendaftaran_kp[4]?.status === "Terkirim") {
      statusValidasi.style = "bg-blue-400";
      statusValidasi.message = "menunggu divalidasi oleh Koordinator KP";
    } else if (
      dataKPTerbaru.dokumen_pendaftaran_kp[4]?.status === "Divalidasi"
    ) {
      statusValidasi.style = "bg-green-600";
      statusValidasi.message =
        "Berkas KP berhasil divalidasi oleh Koordinator KP";
    } else {
      statusValidasi.style = "bg-gray-400";
      statusValidasi.message = "Belum mengirimkan berkas";
    }
    setIsEditing = setIsEditingSuratPenunjukkanDospem;
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
            {isEditing || currentPage === dataKPTerbaru?.level_akses! ? (
              <>
                <Input
                  required
                  key="surat-penunjukkan-dospem"
                  className={"mt-1 p-2 border-[1px] border-slate-300"}
                  type="text"
                  placeholder="Masukkan Link Berkas..."
                  id="surat-penunjukkan-dosen-pembimbing"
                  name="data"
                />
              </>
            ) : (
              <p>{dataKPTerbaru?.dokumen_pendaftaran_kp[4]?.data}</p>
            )}
            <Input readOnly className="hidden" name="nomorBerkas" value={4} />
          </CardContent>
        </div>
      </Card>
    );
  } else if (currentPage === 9 && dataKPTerbaru?.level_akses! >= 9) {
    isEditing = isEditingSuratPerpanjanganKP;
    if (dataKPTerbaru.dokumen_pendaftaran_kp[5]?.status === "Ditolak") {
      statusValidasi.style = "bg-red-600";
      statusValidasi.message =
        dataKPTerbaru.dokumen_pendaftaran_kp[5]?.catatan ||
        "Periksa kembali dokumen anda";
    } else if (dataKPTerbaru.dokumen_pendaftaran_kp[5]?.status === "Terkirim") {
      statusValidasi.style = "bg-blue-400";
      statusValidasi.message = "menunggu divalidasi oleh Koordinator KP";
    } else if (
      dataKPTerbaru.dokumen_pendaftaran_kp[5]?.status === "Divalidasi"
    ) {
      statusValidasi.style = "bg-green-600";
      statusValidasi.message =
        "Berkas KP berhasil divalidasi oleh Koordinator KP";
    } else {
      statusValidasi.style = "bg-gray-400";
      statusValidasi.message = "Belum mengirimkan berkas";
    }
    setIsEditing = setIsEditingSuratPerpanjanganKP;
    InputField = (
      <Card className="border-[1px] border-slate-300 p-3 ">
        <div className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-bold text-lg">
              Pendaftaran KP Berhasil
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Silakan mengisi Daily Report Kerja praktik
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
                {isEditing || currentPage === dataKPTerbaru?.level_akses! ? (
                  <Input
                    required
                    key="surat-perpanjangan-kp"
                    className={"mt-1 p-2 border-[1px] border-slate-300"}
                    type="text"
                    placeholder="Masukkan Link Berkas..."
                    id="surat-perpanjangan-kp"
                    name="data"
                  />
                ) : (
                  <p>{dataKPTerbaru?.dokumen_pendaftaran_kp[5]?.data}</p>
                )}
                <Input
                  readOnly
                  className="hidden"
                  name="nomorBerkas"
                  value={5}
                />
                <Label
                  className="font-bold text-sm mt-1"
                  htmlFor="alasan-lanjut-kp"
                >
                  Alasan Lanjut KP :
                </Label>
                {isEditing || currentPage === dataKPTerbaru?.level_akses! ? (
                  <Textarea
                    className="w-full  border-[1px] border-gray-300"
                    name="alasan_lanjut_kp"
                    id="alasan-lanjut-kp"
                    placeholder="Masukkan alasan lanjut kerja praktik anda..."
                  ></Textarea>
                ) : (
                  <p>
                    {dataKPTerbaru?.alasan_lanjut_kp || "Data tidak tersedia"}
                  </p>
                )}
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
                  Ajukan Perpanjangan Kerja praktik
                </Button>
              )}
            </>
          )}
        </div>
      </Card>
    );
  }
  if (!dataKPTerbaru || isErrorDataKPTerbaru || isErrorPembimbingInstansi) {
    return (
      <Card className="p-2 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
        Data Tidak Ditemukan
      </Card>
    );
  }

  if (!dataKPTerbaru) {
    return (
      <Card className="p-2 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
        Loading...
      </Card>
    );
  }

  return (
    <DashboardLayout>
      {isPendaftaranKPClosed && (
        <Card>
          <CardHeader>
            Saat ini masa pendaftaran kerja praktik sudah ditutup
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
                    statusBerkas={
                      dataKPTerbaru?.dokumen_pendaftaran_kp[i + 1]?.status
                    }
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
                  <CardDescription className="mt-2 text-sm dark:text-white text-black">
                    {":"} {statusValidasi.message}
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
            <Card className="mt-2">
              <CardDescription className="p-3 font-bold rounded-lg bg-green-200 dark:bg-black ">
                Silakan Isi Form di Bawah ini untuk Divalidasi!
              </CardDescription>
              <form
                onSubmit={(e) => handleOnSubmitForm(e, unggahBerkasMutation)}
              >
                <div className="dark:bg-black bg-green-100 p-3">
                  <CardTitle className="flex items-center gap-2 font-bold text-sm tracking-wide my-2">
                    <ClipboardList /> Validasi Berkas
                  </CardTitle>
                  {InputField}
                </div>
                {(currentPage === dataKPTerbaru?.level_akses! || isEditing) &&
                  (dataKPTerbaru?.level_akses! !== 9 ||
                    (dataKPTerbaru.level_akses === 9 &&
                      isPendaftaranKPLanjutClosed === false &&
                      isLanjutKPClicked)) && (
                    <CardFooter className="flex justify-end items-center gap-2 mt-2">
                      {currentPage !== dataKPTerbaru?.level_akses! && (
                        <Button
                          disabled={unggahBerkasMutation.isPending}
                          type="reset"
                          onClick={() => setIsEditing((prev) => !prev)}
                          className=" px-16 tracking-wide py-1 font-semibold  hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </Button>
                      )}
                      <Button
                        disabled={unggahBerkasMutation.isPending}
                        type="reset"
                        className=" px-16 tracking-wide py-1 font-semibold  hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Kosongkan Formulir
                      </Button>
                      <Button
                        disabled={unggahBerkasMutation.isPending}
                        type="submit"
                        className=" px-24 py-1 tracking-wide text-white font-medium  bg-green-950 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Kirim
                      </Button>
                    </CardFooter>
                  )}
              </form>
              {!isEditing && currentPage !== dataKPTerbaru?.level_akses! && (
                <CardFooter className="flex justify-end items-center gap-2 mt-2">
                  <Button
                    disabled={unggahBerkasMutation.isPending}
                    onClick={() => setIsEditing((prev) => !prev)}
                    className=" px-24 py-1 tracking-wide text-white font-medium  bg-green-950 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Edit
                  </Button>
                </CardFooter>
              )}
            </Card>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}

function handleOnSubmitForm(
  e: any,
  mutation: UseMutationResult<any, any, any, unknown>
) {
  e.preventDefault();
  const object = new FormData(e.currentTarget);
  const data = Object.fromEntries(object.entries());
  mutation.mutate(data);
}
