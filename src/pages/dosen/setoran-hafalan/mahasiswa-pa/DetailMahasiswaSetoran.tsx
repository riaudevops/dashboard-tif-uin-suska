import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { useState } from "react";
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
import apiSetoran from "@/services/api/setoran-hafalan/dosen.service";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import ModalBoxStatistik from "@/components/dosen/setoran-hafalan/ModalBoxStatistik";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFilteringSetoranSurat } from "@/hooks/use-filtering-setor-surat";
import {
  Activity,
  Calendar,
  ChartSpline,
  FileDigit,
  Rocket,
  User,
} from "lucide-react";
import ProgressStatistik from "@/components/mahasiswa/setoran-hafalan/detail-riwayat/ProgressStatistik";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import ModalBoxLogsDosen from "@/components/dosen/setoran-hafalan/ModalBoxLogsDosen";
import ModalBoxValidasiSetoran from "@/components/dosen/setoran-hafalan/ModalBoxValidasiSetoran";
import ModalBoxBatalSetoran from "@/components/dosen/setoran-hafalan/ModalBoxBatalSetoran";
import {
  CheckedData,
  MahasiswaSetoran,
} from "@/interfaces/pages/dosen/setoran-hafalan/mahasiswa-pa/detail-mahasiswa-setoran.interface";
function DetailMahasiswaSetoran() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const nim = urlParams.get("nim");
  const { toast } = useToast();
  const queryclient = useQueryClient();

  const { data: dataInfoSetoran, isLoading } = useQuery({
    queryKey: ["info-mahasiswa-by-email"],
    queryFn: () =>
      apiSetoran.getDataMahasiswaByEmail(nim!).then((res) => res.data),
  });

  const { dataCurrent, setTabState, tabState, setSearch } =
    useFilteringSetoranSurat(dataInfoSetoran?.setoran.detail, "default");

  const mutationAccept = useMutation({
    mutationFn: apiSetoran.postSetoranSurah,
  });

  const mutationDelete = useMutation({
    mutationFn: apiSetoran.pembatalanSetoranSurah,
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
          nama_surah: surah.nama,
          nomor_surah: surah.nomor,
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
        .map((item) => item.nama_surah);
      return tempData.join(", ");
    } else {
      const tempData = tempDataCheck
        .filter((item) => item.id !== "")
        .map((item) => item.nama_surah);
      return tempData.join(", ");
    }
  };
  const handleCheckBoxToTempData = (
    checked: boolean,
    nama_surah: string,
    nomor_surah: number,
    id?: string
  ) => {
    if (checked) {
      // Tambahkan data baru ke array
      setTempDataCheck((prevData) => [
        ...prevData,
        {
          nama_surah: nama_surah,
          nomor_surah: nomor_surah,
          id: id,
        },
      ]);
    } else {
      // Hapus data yang sesuai dari array
      setTempDataCheck((prevData) =>
        prevData.filter(
          (item) =>
            item.nama_surah !== nama_surah || item.nomor_surah !== nomor_surah
        )
      );
    }
  };
  return (
    <DashboardLayout>
      <ModalBoxStatistik
        isOpen={openModalStatistik}
        dataRingkasan={dataInfoSetoran?.setoran.ringkasan}
        setIsOpen={setModalStatistik}
      />
      <ModalBoxLogsDosen isOpen={openModalLogs} setIsOpen={setModalLogs} />
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
                nomor_surah: item.nomor_surah,
                nama_surah: item.nama_surah,
              }));
            if (dataBatalkan.length === 0) {
              setLoading(false);
              return toast({
                title: "ℹ️ Info",
                description: "Tidak ada surah yang dibatalkan",
                className: "dark:bg-blue-500 bg-blue-300",
              });
            }

            mutationDelete
              .mutateAsync({
                nim: dataInfoSetoran?.info.nim,
                data_setoran: dataBatalkan,
              })
              .then((data) => {
                console.log(data);
                if (data.response) {
                  queryclient.invalidateQueries({
                    queryKey: ["info-mahasiswa-by-email"],
                  });

                  setTempDataCheck([]);
                  setSelectAll(false);
                  setModalBatalkanSetoran(false);
                  setButtonLoading(false);
                  toast({
                    title: "✨ Sukses",
                    description: "Membatalkan Setoran Surah Berhasil",
                    // className: "dark:bg-green-600 bg-green-300",
                  });

                  setLoading(false);
                }
              });
          } catch (error) {
            toast({
              title: "❌ Error",
              description: "Pembatalan Setoran Surah Gagal",
              variant: "destructive",
              action: (
                <ToastAction
                  altText="Refreh"
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </ToastAction>
              ),
            });
            console.log(error);
          }
        }}
        info={dataInfoSetoran?.info}
        nama_surah={tempDataToString("batalkan")}
        onClose={() => {
          setModalBatalkanSetoran(false);
        }}
      />
      <ModalBoxValidasiSetoran
        openDialog={openModalValidasiSetoran}
        buttonLoading={buttonLoading}
        validasiSetoran={(dateSetoran: string) => {
          if (dateSetoran === "") {
            return toast({
              title: "📢 Peringatan",
              description: "Tanggal setoran tidak boleh kosong",
              // className: "dark:bg-blue-500 bg-blue-300",
            });
          }
          setButtonLoading(true);
          try {
            const dataAcc = tempDataCheck
              .filter((item) => item.id === "")
              .map((item) => ({
                nama_surah: item.nama_surah,
                nomor_surah: item.nomor_surah,
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
                    queryKey: ["info-mahasiswa-by-email"],
                  });

                  setTempDataCheck([]);
                  setSelectAll(false);
                  setModalValidasiSetoran(false);
                  setButtonLoading(false);
                  toast({
                    title: "✨ Sukses",
                    description: "Validasi Setoran Surah Berhasil",
                    // className: "dark:bg-green-600 bg-green-300",
                  });

                  setLoading(false);
                }
              });
          } catch (error) {
            toast({
              title: "❌ Error",
              description: "Validasi Setoran Surah Gagal",
              variant: "destructive",
              action: (
                <ToastAction
                  altText="Refreh"
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </ToastAction>
              ),
            });
            console.log(error);
          }
        }}
        info={dataInfoSetoran?.info}
        nama_surah={tempDataToString("validasi")}
        onClose={(bool) => {
          setModalValidasiSetoran(bool);
        }}
      />

      <div className="flex flex-col gap-4">
        {/* judul */}
        <div className="flex flex-col gap-1.5 -mb-2">
          <div className="text-lg md:text-3xl font-bold select-none -ml-1">
            ✨ Detail Riwayat Setoran Hafalan Mahasiswa PA-mu...
          </div>
          <div className="select-none ml-1 md:text-base text-sm">
            Berikut detail riwayat setoran hafalan mahasiswa PA kamu untuk
            persyaratan akademik di UIN Suska Riau... 💙❤️
          </div>
        </div>
        <div className="flex gap-2">
          <ProgressStatistik
            uploadedDocs={dataInfoSetoran?.setoran.info_dasar.total_sudah_setor}
            totalDocs={dataInfoSetoran?.setoran.info_dasar.total_wajib_setor}
          />
          <div className="-ml-28 flex flex-col gap-1 h-full justify-center py-14">
            <div className="flex items-center">
              {/* Bagian kiri */}
              <div className="flex items-center gap-1 min-w-40">
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
              <div className="flex items-center gap-1 min-w-40">
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
              <div className="flex items-center gap-1 min-w-40">
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
              <div className="flex items-center gap-1 min-w-40">
                <Calendar size={19} />
                <span className="font-medium">Terakhir Setoran</span>
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

        <div className="flex flex-col gap-1.5 sticky top-[64.3px] z-10 bg-background py-1.5">
          <div className="flex justify-between">
            <div>
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
                    Semua Riwayat
                  </TabsTrigger>
                  <TabsTrigger
                    value="tab2"
                    onClick={() => setTabState("sudah_setor")}
                    className={`data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:font-semibold ${
                      tabState !== "sudah_setor" &&
                      "hover:bg-blue-100 dark:hover:bg-background/20"
                    }`}
                  >
                    Sudah Disetor
                  </TabsTrigger>
                  <TabsTrigger
                    value="tab3"
                    onClick={() => setTabState("belum_setor")}
                    className={`data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:font-semibold ${
                      tabState !== "belum_setor" &&
                      "hover:bg-blue-100 dark:hover:bg-background/20"
                    }`}
                  >
                    Belum Disetor
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex gap-1.5">
              <Button
                variant={"default"}
                className="bg-blue-500 hover:scale-[106%] text-white hover:bg-blue-700 active:scale-95 flex justify-center items-center gap-1.5"
                onClick={() => {
                  setModalStatistik(true);
                }}
              >
                <ChartSpline size={20} />
                Lihat Statistik
              </Button>
              <Button
                variant={"default"}
                className="bg-gray-500 hover:scale-[106%] text-white hover:bg-gray-700 active:scale-95 flex justify-center items-center gap-1.5"
                onClick={() => {
                  setModalLogs(true);
                }}
              >
                <Activity size={20} />
                Lihat Logs
              </Button>
              <Button
                variant={"outline"}
                className="rounded-full border-2 border-solid border-red-400 hover:scale-[105%] active:scale-95"
                disabled={tempDataCheck.length === 0 || isLoading}
                onClick={() => {
                  const dataBatalkan = tempDataCheck
                    .filter((item) => item.id !== "")
                    .map((item) => ({
                      id: item.id,
                      nomor_surah: item.nomor_surah,
                      nama_surah: item.nama_surah,
                    }));
                  if (dataBatalkan.length === 0) {
                    setModalBatalkanSetoran(false);
                    return toast({
                      title: "📢 Peringatan",
                      description: "Surah yang anda pilih belum disetor",
                      // className: "dark:bg-orange-400 bg-orange-300",
                    });
                  }

                  setModalBatalkanSetoran(true);
                }}
              >
                ❌ Batalkan
              </Button>

              <Button
                variant={"outline"}
                className="rounded-full border-2 border-solid border-green-400 hover:scale-[105%] active:scale-95"
                disabled={tempDataCheck.length === 0 || isLoading}
                onClick={() => {
                  const dataAcc = tempDataCheck
                    .filter((item) => item.id === "")
                    .map((item) => ({
                      nama_surah: item.nama_surah,
                      nomor_surah: item.nomor_surah,
                    }));

                  if (dataAcc.length === 0) {
                    setLoading(false);
                    setModalValidasiSetoran(false);
                    return toast({
                      title: "📢 Peringatan",
                      description: "Surah yang anda pilih sudah disetor",
                      // className: "dark:bg-orange-400 bg-orange-300",
                    });
                  }

                  setModalValidasiSetoran(true);
                }}
              >
                <span className="font-bold text-green-500 text-lg">✓</span>{" "}
                Validasi
              </Button>
            </div>
          </div>

          <div>
            <Input
              placeholder="Cari Surah berdasarkan nama..."
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="w-full"
            />
          </div>
        </div>

        <div className="">
          <Table>
            <TableHeader className="">
              <TableRow className="border border-solid border-secondary bg-muted">
                <TableHead className="">No</TableHead>
                <TableHead>Nama Surah</TableHead>
                <TableHead className="text-center">
                  Tanggal Setoran Hafalan
                </TableHead>
                <TableHead className="text-center">
                  Persyaratan Setoran
                </TableHead>
                <TableHead className="text-center">
                  Dosen Yang Mengesahkan
                </TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="w-24 text-center">
                  <Checkbox
                    className="data-[state=checked]:bg-green-500"
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
                  <TableCell colSpan={6} className="text-center">
                    {tabState === "sudah_setor"
                      ? "❌ Mahasiswa ini Belum Menyetor Satu pun Hafalan Surah"
                      : "✔️ Mahasiswa ini Sudah Menyetor semua Hafalan Surah"}
                  </TableCell>
                </TableRow>
              )}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-[90%]" />
                      <Skeleton className="h-8 w-[60%]" />
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-[90%]" />
                      <Skeleton className="h-8 w-[60%]" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                dataCurrent?.map((surah: MahasiswaSetoran, index: number) => (
                  <TableRow
                    key={surah.nomor}
                    className={
                      index % 2 !== 0
                        ? "bg-secondary hover:bg-secondary"
                        : "bg-background hover:bg-background"
                    }
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{surah.nama}</TableCell>
                    <TableCell className="text-center">
                      {surah.sudah_setor ? (
                        <div>
                          <p>
                            {new Date(
                              surah.info_setoran.tgl_setoran
                            ).toLocaleDateString("id-ID")}
                          </p>
                        </div>
                      ) : (
                        <p>-</p>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div
                        className={`py-1 px-5 rounded-2xl text-center text-white inline-block ${
                          colourLabelingCategory(surah.label)[1]
                        }`}
                      >
                        {colourLabelingCategory(surah.label)[0]}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {surah.sudah_setor
                        ? surah.info_setoran.dosen_yang_mengesahkan.nama
                        : "-"}
                    </TableCell>

                    <TableCell className="text-center">
                      {surah.sudah_setor ? (
                        <div className="bg-green-600 px-1 py-1 text-white rounded-2xl text-xs">
                          Sudah Setor
                        </div>
                      ) : (
                        <div>-</div>
                      )}
                    </TableCell>
                    <TableCell className="w-24 text-center">
                      <Checkbox
                        className="data-[state=checked]:bg-green-500"
                        checked={
                          selectAll ||
                          tempDataCheck.some(
                            (item) => item.nomor_surah === surah.nomor
                          )
                        }
                        onCheckedChange={(checked) =>
                          handleCheckBoxToTempData(
                            Boolean(checked),
                            surah.nama,
                            surah.nomor,
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
    </DashboardLayout>
  );
}

export default DetailMahasiswaSetoran;
