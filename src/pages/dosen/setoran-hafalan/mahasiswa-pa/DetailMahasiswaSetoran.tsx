import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { colourLabelingCategory } from "@/helpers/colour-labeling-category";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import APISetoran from "@/services/api/dosen/setoran-hafalan.service";
import { Skeleton } from "@/components/ui/skeleton";
import ModalBoxStatistik from "@/components/dosen/setoran-hafalan/ModalBoxStatistik";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFilteringSetoranSurat } from "@/hooks/use-filtering-setor-surat";
import {
  ArrowLeft,
  BackpackIcon,
  BookOpenIcon,
  Calendar,
  ChartSpline,
  Clock,
  Download,
  FileDigit,
  GraduationCap,
  Hash,
  History,
  Loader2,
  Rocket,
  Upload,
  User,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import ModalBoxLogs from "@/components/dosen/setoran-hafalan/ModalBoxLogs";
import ModalBoxValidasiSetoran from "@/components/dosen/setoran-hafalan/ModalBoxValidasiSetoran";
import ModalBoxBatalSetoran from "@/components/dosen/setoran-hafalan/ModalBoxBatalSetoran";
import {
  CheckedData,
  MahasiswaSetoran,
} from "@/interfaces/pages/dosen/setoran-hafalan/mahasiswa-pa/detail-mahasiswa-setoran.interface";
import { useParams } from "react-router-dom";
import TableLoadingSkeleton from "@/components/globals/table-loading-skeleton";
import {
  ModalBoxQuran,
  SurahData,
} from "@/components/dosen/setoran-hafalan/ModalBoxQuran";
import { toast } from "sonner";
import ShinyProgressChart from "@/components/mahasiswa/setoran-hafalan/kartu-murojaah/shiny-progress-chart";

function DetailMahasiswaSetoran() {
  const { nim } = useParams<{ nim: string }>();
  const queryclient = useQueryClient();

  // Connect to External e-Quran API
  const [nomorSurah, setNomorSurah] = useState<string | undefined>();
  const [namaSurah, setNamaSurah] = useState<string | undefined>();
  const [dataSurah, setDataSurah] = useState<SurahData | undefined>();
  const [openModalQuran, setOpenModalQuran] = useState(false);
  const [openModalQuranIsLoading, setOpenModalQuranIsLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const [modalQuranRefresh, setModalQuranRefresh] = useState(false);
  useEffect(() => {
    if (!nomorSurah) return;
    setOpenModalQuranIsLoading((prevState) => ({
      ...prevState,
      [nomorSurah]: true,
    }));
    fetch(`https://equran.id/api/v2/surat/${nomorSurah}`)
      .then((res) => res.json())
      .then((data) => {
        setOpenModalQuranIsLoading((prevState) => ({
          ...prevState,
          [nomorSurah]: false,
        }));
        setDataSurah({ ...data.data, namaLatin: namaSurah });
        setOpenModalQuran(true);
      });
  }, [nomorSurah, modalQuranRefresh]);
  const handleNomorSurahChange = (nomorSurah: string, namaSurah: string) => {
    setNomorSurah(nomorSurah);
    setNamaSurah(namaSurah);
    setModalQuranRefresh((prev) => !prev);
  };

  const {
    data: dataInfoSetoran,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["info-mahasiswa-by-nim"],
    queryFn: () =>
      APISetoran.getDataMahasiswaByNIM(nim!).then((res) => res.data),
  });

  useEffect(() => {
    return () => {
      queryclient.removeQueries({ queryKey: ["info-mahasiswa-by-nim"] });
    };
  }, []);
  const { dataCurrent, setTabState, tabState, setSearch, search } =
    useFilteringSetoranSurat(dataInfoSetoran?.setoran.detail, "default");

  const mutationAccept = useMutation({
    mutationFn: APISetoran.postSetoranSurah,
  });

  const mutationDelete = useMutation({
    mutationFn: APISetoran.pembatalanSetoranSurah,
  });

  const [tempDataCheck, setTempDataCheck] = useState<CheckedData[]>([]);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openModalValidasiSetoran, setModalValidasiSetoran] = useState(false);
  const [openModalBatalkanSetoran, setModalBatalkanSetoran] = useState(false);
  const [openModalStatistik, setModalStatistik] = useState(false);
  const [openModalLogs, setModalLogs] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);

    if (checked) {
      // Jika dicentang, tambahkan semua data ke tempDataCheck
      const allData =
        dataCurrent?.map((surah) => ({
          nama_komponen_setoran: surah.nama,
          id_komponen_setoran: surah.id,
          id: surah.info_setoran?.id || "",
        })) || [];

      setTempDataCheck(allData);
    } else {
      // Jika tidak dicentang, kosongkan array
      setTempDataCheck([]);
    }
  };
  const tempDataToString = (aksi: string) => {
    if (aksi === "validasi") {
      const tempData = tempDataCheck
        .filter((item) => item.id === "")
        .map((item) => item.nama_komponen_setoran);
      return tempData.join(", ");
    } else {
      const tempData = tempDataCheck
        .filter((item) => item.id !== "")
        .map((item) => item.nama_komponen_setoran);
      return tempData.join(", ");
    }
  };
  const handleCheckBoxToTempData = (
    checked: boolean,
    nama_komponen_setoran: string,
    id_komponen_setoran: string,
    id?: string
  ) => {
    if (checked) {
      // Tambahkan data baru ke array
      setTempDataCheck((prevData) => [
        ...prevData,
        {
          nama_komponen_setoran: nama_komponen_setoran,
          id_komponen_setoran: id_komponen_setoran,
          id: id,
        },
      ]);
    } else {
      // Hapus data yang sesuai dari array
      setTempDataCheck((prevData) =>
        prevData.filter(
          (item) =>
            item.nama_komponen_setoran !== nama_komponen_setoran ||
            item.id_komponen_setoran !== id_komponen_setoran
        )
      );
    }
  };

  const handleGoBack = () => {
    return window.history.back();
  };

  return (
    <DashboardLayout>
      {openModalQuran && (
        <ModalBoxQuran
          isOpen={openModalQuran}
          setIsOpen={setOpenModalQuran}
          dataSurah={dataSurah}
        />
      )}
      <ModalBoxStatistik
        isFetching={isFetching}
        isOpen={openModalStatistik}
        dataRingkasan={dataInfoSetoran?.setoran.ringkasan}
        setIsOpen={setModalStatistik}
      />
      <ModalBoxLogs
        isOpen={openModalLogs}
        setIsOpen={setModalLogs}
        dataLogs={dataInfoSetoran?.setoran.log}
      />
      <ModalBoxBatalSetoran
        openDialog={openModalBatalkanSetoran}
        buttonLoading={buttonLoading}
        deleteSetoran={() => {
          setButtonLoading(true);
          try {
            const dataBatalkan = tempDataCheck
              .filter((item) => item.id !== "")
              .map((item) => ({
                id: item.id,
                id_komponen_setoran: item.id_komponen_setoran,
                nama_komponen_setoran: item.nama_komponen_setoran,
              }));
            if (dataBatalkan.length === 0) {
              setLoading(false);
              return toast.info("Tidak ada surah yang dibatalkan");
            }

            mutationDelete
              .mutateAsync({
                nim: dataInfoSetoran?.info.nim,
                data_setoran: dataBatalkan,
              })
              .then((data) => {
                if (data.response) {
                  queryclient.invalidateQueries({
                    queryKey: ["info-mahasiswa-by-nim"],
                  });

                  setTempDataCheck([]);
                  setSelectAll(false);
                  setModalBatalkanSetoran(false);
                  setButtonLoading(false);
                  toast.success(data.message);
                  setLoading(false);
                }
              });
          } catch (error) {
            toast.error("Pembatalan Muroja'ah Gagal!", {
              action: {
                label: "Refresh",
                onClick: () => window.location.reload(),
              },
            });
            console.log(error);
          }
        }}
        info={dataInfoSetoran?.info}
        nama_komponen_setoran={tempDataToString("batalkan")}
        onClose={() => {
          setModalBatalkanSetoran(false);
        }}
      />
      <ModalBoxValidasiSetoran
        openDialog={openModalValidasiSetoran}
        buttonLoading={buttonLoading}
        validasiSetoran={(dateSetoran: string) => {
          if (dateSetoran === "") {
            return toast.warning("Tanggal muroja'ah tidak boleh kosong!");
          }
          setButtonLoading(true);
          try {
            const dataAcc = tempDataCheck
              .filter((item) => item.id === "")
              .map((item) => ({
                nama_komponen_setoran: item.nama_komponen_setoran,
                id_komponen_setoran: item.id_komponen_setoran,
              }));

            mutationAccept
              .mutateAsync({
                nim: dataInfoSetoran?.info.nim,
                data_setoran: dataAcc,
                tgl_setoran: dateSetoran,
              })
              .then((data) => {
                if (data.response) {
                  queryclient.invalidateQueries({
                    queryKey: ["info-mahasiswa-by-nim"],
                  });

                  setTempDataCheck([]);
                  setSelectAll(false);
                  setModalValidasiSetoran(false);
                  setButtonLoading(false);
                  toast.success(data.message);

                  setLoading(false);
                } else {
                  return toast.error(data.message, {
                    action: {
                      label: "Refresh",
                      onClick: () => window.location.reload(),
                    },
                  });
                }
              });
          } catch (error) {
            toast.error("Validasi Muroja'ah Gagal!", {
              action: {
                label: "Refresh",
                onClick: () => window.location.reload(),
              },
            });
          }
        }}
        info={dataInfoSetoran?.info}
        nama_komponen_setoran={tempDataToString("validasi")}
        onClose={(bool) => {
          setModalValidasiSetoran(bool);
        }}
      />

      <div className="flex flex-col gap-4">
        {/* judul */}
        <div className="flex flex-col gap-1.5 mb-1.5">
          <div className="flex gap-3.5">
            <button
              onClick={handleGoBack}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft size={20} className="mr-1" />
              <span className="text-sm font-medium">Kembali</span>
            </button>

            <div className="flex">
              <span className="bg-white flex justify-center items-center shadow-sm text-gray-800 dark:text-gray-200 dark:bg-gray-900 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 text-md font-medium tracking-tight">
                <span
                  className={`inline-block animate-pulse w-3 h-3 rounded-full mr-2 bg-yellow-400`}
                />
                <BackpackIcon className="w-4 h-4 mr-1.5" />
                <span className="hidden md:block">
                  Detail Muroja'ah Juz 30 Mahasiswa
                </span>
                <span className="md:hidden">Detail Muroja'ah Juz 30</span>
              </span>
            </div>
          </div>
        </div>

        {/* statistik && user info desktop */}
        <div className="md:flex hidden gap-4 rounded-lg">
          <div className="dark:bg-muted/40 bg-yellow-300/10 border rounded-xl p-2 flex justify-center items-center flex-col">
            <div className="text-base text-orange-700 dark:text-orange-200 inline-block tracking-tight dark:bg-orange-700/20 bg-orange-800/10 rounded-md whitespace-nowrap px-2 font-medium">
              Progres Keseluruhan
            </div>
            <ShinyProgressChart
              loading={isFetching}
              targetProgress={
                dataInfoSetoran?.setoran.info_dasar.persentase_progres_setor
              }
            />
            <div className="dark:bg-pink-700/20 bg-pink-800/20 text-pink-800 dark:text-pink-200 text-sm tracking-tight inline-block opacity-75 rounded-md whitespace-nowrap px-2">
              <div>
                {dataInfoSetoran?.setoran.info_dasar.total_sudah_setor} dari{" "}
                {dataInfoSetoran?.setoran.info_dasar.total_wajib_setor} selesai
              </div>
            </div>
          </div>

          <div className="flex dark:bg-muted/40 bg-yellow-300/10 border rounded-xl py-2 px-8 flex-col gap-2 h-full justify-center">
            <div className="flex items-center">
              {/* Bagian kiri */}
              <div className="flex items-center gap-1 min-w-44">
                <User size={19} />
                <span className="font-medium">Nama Lengkap</span>
              </div>

              {/* Titik dua dan nilai */}
              <div className="flex items-center gap-2">
                <span>:</span>
                {isLoading && <Skeleton className="h-4 w-24" />}
                <span className="">{dataInfoSetoran?.info.nama}</span>
              </div>
            </div>
            <div className="flex items-center">
              {/* Bagian kiri */}
              <div className="flex items-center gap-1 min-w-44">
                <FileDigit size={19} />
                <span className="font-medium">NIM</span>
              </div>

              {/* Titik dua dan nilai */}
              <div className="flex items-center gap-2">
                <span>:</span>
                {isLoading && <Skeleton className="h-4 w-24" />}
                <span className="">{dataInfoSetoran?.info.nim}</span>
              </div>
            </div>
            <div className="flex items-center">
              {/* Bagian kiri */}
              <div className="flex items-center gap-1 min-w-44">
                <Rocket size={19} />
                <span className="font-medium">Semester</span>
              </div>

              {/* Titik dua dan nilai */}
              <div className="flex items-center gap-2">
                <span>:</span>
                {isLoading && <Skeleton className="h-4 w-24" />}
                <span className="">{dataInfoSetoran?.info.semester}</span>
              </div>
            </div>
            <div className="flex items-center">
              {/* Bagian kiri */}
              <div className="flex items-center gap-1 min-w-44">
                <GraduationCap size={19} />
                <span className="font-medium">Dosen PA</span>
              </div>

              {/* Titik dua dan nilai */}
              <div className="flex items-center gap-2">
                <span>:</span>
                {isLoading && <Skeleton className="h-4 w-24" />}
                <span className="">{dataInfoSetoran?.info.dosen_pa.nama}</span>
              </div>
            </div>
            <div className="flex items-center">
              {/* Bagian kiri */}
              <div className="flex items-center gap-1 min-w-44">
                <Calendar size={19} />
                <span className="font-medium">Terakhir Muroja'ah</span>
              </div>

              {/* Titik dua dan nilai */}
              <div className="flex items-center gap-2">
                <span>:</span>
                {isLoading && <Skeleton className="h-4 w-24" />}
                <span className="">
                  {dataInfoSetoran?.setoran.info_dasar.terakhir_setor}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* For Mobile View User Info */}
        <div className="-mt-1.5 -mb-2 md:hidden w-full h-full flex flex-col bg-transparent dark:bg-gradient-to-br dark:from-violet-800/10 dark:to-slate-900/5 border border-slate-300 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/80 transition-colors duration-300 py-3 px-4 rounded-xl items-center">
          <div className="flex items-center gap-[0.9rem] w-full rounded-xl">
            {/* AREA KIRI: AVATAR */}
            {isLoading ? (
              <Skeleton className="w-[4.5rem] h-[4.5rem] rounded-full flex-shrink-0" />
            ) : (
              <div
                className="flex-shrink-0 h-[4.5rem] w-[4.5rem] rounded-full overflow-hidden"
                title={dataInfoSetoran?.info.nama}
              >
                <img
                  src={`https://api.dicebear.com/8.x/micah/svg?seed=${encodeURIComponent(
                    dataInfoSetoran?.info.nama || "default"
                  )}&radius=50&backgroundType=gradientLinear&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                  alt={`Avatar of ${dataInfoSetoran?.info.nama}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* AREA KANAN: IDENTITAS UTAMA (Layout Simetris) */}
            <div className="flex flex-col justify-center h-full w-full">
              {isLoading ? (
                <div className="space-y-1">
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-3 w-3/5 mt-1.5" />
                  <div className="flex gap-1.5 pt-2">
                    <Skeleton className="h-8 w-4/5 rounded-lg" />
                    <Skeleton className="h-8 w-4/5 rounded-lg" />
                  </div>
                </div>
              ) : (
                <>
                  {/* Baris Atas: Nama dan NIM */}
                  <div className="overflow-hidden max-w-[13.5rem]">
                    <h2 className="text-lg font-semibold tracking-tight text-gray-800 dark:text-white text-ellipsis whitespace-nowrap overflow-hidden">
                      {dataInfoSetoran?.info.nama}
                    </h2>
                    <p className="text-sm text-gray-500 font-mono -mt-1">
                      {dataInfoSetoran?.info.nim}
                    </p>
                  </div>

                  {/* Baris Bawah: Tag/Pill */}
                  <div className="flex items-center gap-[0.32rem] mt-2">
                    <div className="flex items-center gap-1 border bg-indigo-700/15 dark:bg-indigo-700/30 dark:text-indigo-200 text-indigo-700 text-xs px-1.5 py-0 rounded-lg">
                      <Rocket size={10} />
                      <span>Semester {dataInfoSetoran?.info.semester}</span>
                    </div>
                    <div className="flex items-center gap-1 border bg-teal-700/15 dark:bg-teal-700/30 dark:text-teal-200 text-teal-700 text-xs px-2 py-0 rounded-lg">
                      <Hash size={10} />
                      <span>Akt. {dataInfoSetoran?.info.angkatan}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="w-full mt-4 pt-3 border-t flex justify-between border-slate-300 dark:border-slate-700/50">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              <span>
                Terakhir Muroja'ah{" "}
                {isFetching
                  ? "-"
                  : dataInfoSetoran?.setoran.info_dasar.terakhir_setor}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 sticky top-[51.3px] bg-background pt-2.5 -mb-4 pb-3.5 z-50">
          {/* For Mobile */}

          <div className="md:hidden overflow-x-auto max-w-full mb-2 flex gap-1.5">
            <Tabs defaultValue="tab1" className="w-full">
              <TabsList className="gap-1.5 w-full">
                <TabsTrigger
                  value="tab1"
                  onClick={() => setTabState("default")}
                  className={`w-full data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:font-semibold ${
                    tabState !== "default" &&
                    "hover:bg-blue-100 dark:hover:bg-background/20"
                  }`}
                >
                  Semua
                </TabsTrigger>
                <TabsTrigger
                  value="tab2"
                  onClick={() => setTabState("sudah_setor")}
                  className={`w-full data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:font-semibold ${
                    tabState !== "sudah_setor" &&
                    "hover:bg-blue-100 dark:hover:bg-background/20"
                  }`}
                >
                  Selesai
                </TabsTrigger>
                <TabsTrigger
                  value="tab3"
                  onClick={() => setTabState("belum_setor")}
                  className={`w-full data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:font-semibold ${
                    tabState !== "belum_setor" &&
                    "hover:bg-blue-100 dark:hover:bg-background/20"
                  }`}
                >
                  Belum
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              variant="outline"
              className="md:hidden bg-blue-500 text-white hover:bg-blue-600 active:scale-95 flex justify-center items-center gap-1.5"
            >
              <Download size={20} />
              {/* <span className="">Unduh Kartu Muroja'ah</span> */}
            </Button>
          </div>

          <div className="flex justify-between gap-2.5">
            {/* Hide at Mobile */}
            <div className="hidden md:block overflow-x-auto max-w-28 md:max-w-full">
              <Tabs defaultValue="tab1" className="w-full">
                <TabsList className="gap-1.5">
                  <TabsTrigger
                    value="tab1"
                    onClick={() => setTabState("default")}
                    className={`data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:font-semibold ${
                      tabState !== "default" &&
                      "hover:bg-blue-100 dark:hover:bg-background/20"
                    }`}
                  >
                    Semua riwayat muroja'ah
                  </TabsTrigger>
                  <TabsTrigger
                    value="tab2"
                    onClick={() => setTabState("sudah_setor")}
                    className={`data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:font-semibold ${
                      tabState !== "sudah_setor" &&
                      "hover:bg-blue-100 dark:hover:bg-background/20"
                    }`}
                  >
                    Selesai di-muroja'ah
                  </TabsTrigger>
                  <TabsTrigger
                    value="tab3"
                    onClick={() => setTabState("belum_setor")}
                    className={`data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:font-semibold ${
                      tabState !== "belum_setor" &&
                      "hover:bg-blue-100 dark:hover:bg-background/20"
                    }`}
                  >
                    Belum di-muroja'ah
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Display at Mobile */}
            <Input
              placeholder="Cari surah..."
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="w-full md:hidden"
            />

            <div className="flex gap-1.5 justify-center items-center">
              <Button
                variant={"default"}
                className="bg-purple-500 text-white hover:bg-purple-700 active:scale-95 flex justify-center items-center gap-1.5"
                onClick={() => {
                  setModalStatistik(true);
                }}
              >
                <ChartSpline size={20} />
                <span className="hidden md:block">Lihat Statistik</span>
              </Button>
              <Button
                variant={"default"}
                className="bg-orange-500 text-white hover:bg-orange-600 active:scale-95 flex justify-center items-center gap-1.5"
                onClick={() => {
                  setModalLogs(true);
                }}
              >
                <History size={20} />
                <span className="hidden md:block">Lihat Aktivitas</span>
              </Button>
              <div className="w-[2px] rounded-full h-full mx-1 py-0.5">
                <div className="w-full h-full bg-foreground/20" />
              </div>
              <Button
                variant={"outline"}
                className="border-2 border-solid border-red-400 active:scale-95"
                disabled={tempDataCheck.length === 0 || isLoading}
                onClick={() => {
                  const dataBatalkan = tempDataCheck
                    .filter((item) => item.id !== "")
                    .map((item) => ({
                      id: item.id,
                      id_komponen_setoran: item.id_komponen_setoran,
                      nama_komponen_setoran: item.nama_komponen_setoran,
                    }));
                  if (dataBatalkan.length === 0) {
                    setModalBatalkanSetoran(false);
                    return toast.warning(
                      "Surah yang anda pilih belum di-muroja'ah sebelumnya!"
                    );
                  }

                  setModalBatalkanSetoran(true);
                }}
              >
                ❌
              </Button>

              <Button
                variant={"outline"}
                className="border-2 border-solid border-green-400 active:scale-95"
                disabled={tempDataCheck.length === 0 || isLoading}
                onClick={() => {
                  const dataAcc = tempDataCheck
                    .filter((item) => item.id === "")
                    .map((item) => ({
                      nama_komponen_setoran: item.nama_komponen_setoran,
                      id_komponen_setoran: item.id_komponen_setoran,
                    }));

                  if (dataAcc.length === 0) {
                    setLoading(false);
                    setModalValidasiSetoran(false);
                    return toast.warning(
                      "Surah yang anda pilih sudah di-muroja'ah sebelumnya!"
                    );
                  }

                  setModalValidasiSetoran(true);
                }}
              >
                <span className="font-bold text-green-500 text-lg">✓</span>{" "}
              </Button>
            </div>
          </div>

          <div className="mt-1 md:block hidden">
            <Input
              placeholder="Cari surah yang mau di-muroja'ah berdasarkan nama surah-nya..."
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="w-full"
            />
          </div>
        </div>

        <div className="w-0 min-w-full">
          <div className="w-full overflow-x-auto md:max-w-full">
            <Table>
              <TableHeader className="sticky top-0">
                <TableRow className="border border-solid border-secondary bg-muted">
                  <TableHead className="text-center">No</TableHead>
                  <TableHead className="text-center whitespace-nowrap">
                    Nama Surah
                  </TableHead>
                  <TableHead className="text-center whitespace-nowrap">
                    Tanggal Muroja'ah
                  </TableHead>
                  <TableHead className="text-center whitespace-nowrap">
                    Persyaratan Muroja'ah
                  </TableHead>
                  <TableHead className="text-center whitespace-nowrap">
                    Dosen Yang Mengesahkan
                  </TableHead>
                  <TableHead className="text-center whitespace-nowrap">
                    Status Muroja'ah
                  </TableHead>
                  <TableHead className="w-24 text-center whitespace-nowrap">
                    <Checkbox
                      className="data-[state=checked]:bg-green-500 mr-2 md:mr-0"
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                      disabled={dataCurrent?.length === 0 || isLoading}
                    />
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="border border-solid border-secondary">
                {dataCurrent?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      {search
                        ? "❌ Maaf, surah yang anda cari tidak ditemukan nih!"
                        : tabState === "sudah_setor"
                        ? "❌ Mahasiswa ini Belum Menyetor Satu pun Hafalan Surah"
                        : "✔️ Mahasiswa ini Sudah Menyetor semua Hafalan Surah"}
                    </TableCell>
                  </TableRow>
                )}
                {isLoading && <TableLoadingSkeleton columns={7} rows={7} />}
                {loading ? (
                  <TableLoadingSkeleton columns={7} rows={7} />
                ) : (
                  dataCurrent?.map((surah: MahasiswaSetoran, index: number) => (
                    <TableRow
                      key={surah.id}
                      className={
                        index % 2 !== 0
                          ? "bg-secondary hover:bg-secondary"
                          : "bg-background hover:bg-background"
                      }
                    >
                      <TableCell className="text-center">
                        {index + 1}.
                      </TableCell>
                      <TableCell className="whitespace-nowrap flex gap-2 justify-center items-center text-center">
                        <span>
                          {surah.nama}{" "}
                          {surah.nama_arab && ` - ${surah.nama_arab}`}
                        </span>
                        <div
                          onClick={() =>
                            handleNomorSurahChange(
                              surah.external_id,
                              surah.nama
                            )
                          }
                          className="rounded-full hover:scale-110 active:scale-100 hover:bg-orange-400/25 flex justify-center items-center duration-300 cursor-pointer p-1 bg-orange-400/20 text-orange-600"
                        >
                          {openModalQuranIsLoading[surah.external_id] && (
                            <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                          )}
                          <BookOpenIcon className="w-3.5 h-3.5" />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {surah.sudah_setor ? (
                          <div>
                            <p>
                              {new Date(surah.info_setoran.tgl_setoran)
                                .toLocaleDateString("id-ID", {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                })
                                .replace(/^(\d+)\s(\w+)\s(\d+)$/, "$1 $2, $3")}
                            </p>
                          </div>
                        ) : (
                          <p>-</p>
                        )}
                      </TableCell>
                      <TableCell className="text-center whitespace-nowrap">
                        <div
                          className={`py-1 px-3 rounded-2xl text-center text-white inline-block ${
                            colourLabelingCategory(surah.label)[1]
                          }`}
                        >
                          {colourLabelingCategory(surah.label)[0]}
                        </div>
                      </TableCell>
                      <TableCell className="text-center whitespace-nowrap">
                        {surah.sudah_setor
                          ? surah.info_setoran.dosen_yang_mengesahkan.nama
                          : "-"}
                      </TableCell>

                      <TableCell className="text-center">
                        {surah.sudah_setor ? (
                          <div className="bg-green-600 px-3 py-1 text-white rounded-2xl inline-block">
                            Selesai
                          </div>
                        ) : (
                          <div>-</div>
                        )}
                      </TableCell>
                      <TableCell className="w-24 text-center">
                        <Checkbox
                          className="data-[state=checked]:bg-green-500 mr-2 md:mr-0"
                          checked={
                            selectAll ||
                            tempDataCheck.some(
                              (item) => item.id_komponen_setoran === surah.id
                            )
                          }
                          onCheckedChange={(checked) =>
                            handleCheckBoxToTempData(
                              Boolean(checked),
                              surah.nama,
                              surah.id,
                              surah.info_setoran?.id || ""
                            )
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DetailMahasiswaSetoran;
