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
// import ModalBoxDosen from "@/components/dosen/setoran-hafalan/ModalBoxValidasiSetoran";
// import ModalBoxBatalSetoran from "@/components/dosen/setoran-hafalan/ModalBoxBatalSetoran";
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
  SaveAll,
  User,
} from "lucide-react";
import ProgressStatistik from "@/components/mahasiswa/setoran-hafalan/detail-riwayat/ProgressStatistik";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ModalBoxLogs from "@/components/dosen/setoran-hafalan/ModalBoxLogs";
// import LoadingComponent from "@/components/globals/loading";

interface Dosen {
  nama: string;
}

interface Setoran {
  id: string;
  tgl_setoran: string;
  tgl_validasi: string;
  dosen: Dosen;
}
interface MahasiswaSetoran {
  nomor: number;
  nama: string;
  label: string;
  sudah_setor: boolean;
  setoran: Setoran[];
}
// interface detailSetoranProps {
//   nomor: number;
//   nama: string;
//   label: string;
//   sudah_setor: boolean;
//   setoran: Setoran[];
// }
interface CheckedData {
  nama_surah: string;
  nomor_surah: number;
  id_surah?: string;
}
function DetailMahasiswaSetoran() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const email = urlParams.get("email");
  const { toast } = useToast();
  const queryclient = useQueryClient();

  const { data: dataInfoSetoran, isLoading } = useQuery({
    queryKey: ["info-mahasiswa-by-email"],
    queryFn: () =>
      apiSetoran.getDataMahasiswaByEmail(email!).then((res) => res.data),
  });

  const { dataCurrent, setTabState, tabState, setSearch } =
    useFilteringSetoranSurat(dataInfoSetoran?.setoran.detail, "default");

  // post data Setoran with mutation
  const mutation = useMutation({
    mutationFn: apiSetoran.postSetoranSurah,
  });

  const mutationDelete = useMutation({
    mutationFn: apiSetoran.pembatalanSetoranSurah,
  });
  // const [buttonLoading, setButtonLoading] = useState(true);
  const [tempDataCheck, setTempDataCheck] = useState<CheckedData[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aksi, setAksi] = useState<string>("");
  // console.log(aksi);
  // console.log(JSON.stringify(tempDataCheck));

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);

    if (checked) {
      // Jika dicentang, tambahkan semua data ke tempDataCheck
      const allData =
        dataCurrent?.map((surah) => ({
          nama_surah: surah.nama,
          nomor_surah: surah.nomor,
          id_surah: surah.setoran[0]?.id || "", // Add this line
        })) || [];

      setTempDataCheck(allData);
    } else {
      // Jika tidak dicentang, kosongkan array
      setTempDataCheck([]);
    }
  };
  const handleAksi = async () => {
    switch (aksi) {
      case "validasi":
        setLoading(true);
        try {
          // Filter item yang id_surah-nya kosong, lalu lakukan mutatio
          const dataAcc = tempDataCheck
            .filter((item) => item.id_surah === "")
            .map((item) => ({
              nama_surah: item.nama_surah,
              nomor_surah: item.nomor_surah,
            }));
          console.log(dataAcc);
          // if (dataAcc.length === 0) {
          //   setLoading(false);
          //   return toast({
          //     title: "ℹ️ Info",
          //     description: "Tidak ada surah yang divalidasi",
          //     className: "dark:bg-blue-500 bg-blue-300",
          //   });
          // }

          // await Promise.all(dataAcc);
          await queryclient.invalidateQueries({
            queryKey: ["info-mahasiswa-by-email"],
          });
          setTempDataCheck([]);
          setSelectAll(false);
          toast({
            title: "✨ Sukses",
            description: "Validasi Setoran Surah Berhasil",
            className: "dark:bg-green-600 bg-green-300",
          });

          setLoading(false);
          console.log("Sukses");
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
        break;
      case "batalkan":
        setLoading(true);
        try {
          const dataBatalkan = tempDataCheck
            .filter((item) => item.id_surah !== "")
            .map((item) => ({ id_surah: item.id_surah } as const));
          console.log(dataBatalkan);
          if (dataBatalkan.length === 0) {
            setLoading(false);
            return toast({
              title: "ℹ️ Info",
              description: "Tidak ada surah yang dibatalkan",
              className: "dark:bg-blue-500 bg-blue-300",
            });
          }

          // await Promise.all(dataBatalkan);
          await queryclient.invalidateQueries({
            queryKey: ["info-mahasiswa-by-email"],
          });
          setTempDataCheck([]);
          setSelectAll(false);
          setLoading(false);
          toast({
            title: "✨ Sukses",
            description: "Pembatalan Setoran Surah Berhasil",
            className: "dark:bg-green-600 bg-green-300",
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
        break;
      default:
        toast({
          title: "📢 Peringatan",
          description: "Pilih aksi yang ingin dilakukan",
          className: "dark:bg-orange-400 bg-orange-300",
        });
        break;
    }
  };
  const handleCheckBoxToTempData = (
    checked: boolean,
    nama_surah: string,
    nomor_surah: number
  ) => {
    if (checked) {
      // Tambahkan data baru ke array
      setTempDataCheck((prevData) => [
        ...prevData,
        { nama_surah: nama_surah, nomor_surah: nomor_surah },
        ]);
    } else {
      // Hapus data yang sesuai dari array
      setTempDataCheck((prevData) =>
        prevData.filter(
          (item) => item.nama_surah !== nama_surah || item.nomor_surah !== nomor_surah
        )
      );
    }
  };

  // const [openModalValidasiSetoran, setModalValidasiSetoran] = useState(false);
  // const [openModalBatalkanSetoran, setModalBatalkanSetoran] = useState(false);
  const [openModalStatistik, setModalStatistik] = useState(false);
  const [openModalLogs, setModalLogs] = useState(false);
  return (
    <DashboardLayout>
      <ModalBoxStatistik
        isOpen={openModalStatistik}
        dataRingkasan={dataInfoSetoran?.setoran.ringkasan}
        setIsOpen={setModalStatistik}
      />
      <ModalBoxLogs isOpen={openModalLogs} setIsOpen={setModalLogs} />
      {/* <ModalBoxBatalSetoran
        openDialog={openModalBatalkanSetoran}
        buttonLoading={buttonLoading}
        deleteSetoran={() => {
          setButtonLoading(true);
          mutationDelete.mutate({
            id: idSurah,
          });
        }}
        info={dataInfoSetoran?.info}
        detail={detailSurah}
        onClose={() => {
          setModalBatalkanSetoran(false);
        }}
      /> */}
      {/* <ModalBoxDosen
        openDialog={openModalValidasiSetoran}
        buttonLoading={buttonLoading}
        validasiSetoran={(dateSetoran: string) => {
          setButtonLoading(true);
          mutation.mutate({
            nim: dataInfoSetoran?.info.nim,
            nomor_surah: detailSurah.nomor,
            tgl_setoran: dateSetoran,
          });
        }}
        info={dataInfoSetoran?.info}
        detail={detailSurah}
        onClose={(bool) => {
          setModalValidasiSetoran(bool);
        }}
      /> */}

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
          {/* <ProgressStatistik uploadedDocs={5} totalDocs={10} /> */}
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

            <Select
              value={aksi} // Pastikan jika null, tetap bisa reset ke placeholder
              onValueChange={(e) => {
                setAksi(e);
              }}
            >
              <SelectTrigger className="bg-orange-500 dark:bg-orange-700 text-white">
                <SelectValue placeholder="Pilih Aksi" />
              </SelectTrigger>
              <SelectContent className="bg-red-400">
                <SelectItem value="validasi">Validasi</SelectItem>
                <SelectItem value="batalkan">Batalkan</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={"default"}
              className="bg-green-500 hover:scale-[106%] text-white hover:bg-green-700 active:scale-95 flex justify-center items-center gap-1.5"
              // disabled={tempDataCheck.length === 0 || isLoading}
              onClick={() => {
                handleAksi();
                // setLoading(true);
                // try {
                //   // Filter item yang id_surah-nya kosong, lalu lakukan mutatio
                //   const dataAcc = tempDataCheck
                //     .filter((item) => item.id_surah === "")
                //     .map((item) => {
                //       return mutation.mutateAsync({
                //         nim: item.nim,
                //         nomor_surah: item.nomor_surah,
                //         tgl_setoran: item.tgl_setoran,
                //       });
                //     });
                //   await Promise.all(dataAcc);
                //   setTempDataCheck([]);
                //   setSelectAll(false);
                //   toast({
                //     title: "✨ Sukses",
                //     description: "Validasi Setoran Surah Berhasil",
                //   });
                //   setLoading(false);
                //   await queryclient.invalidateQueries({
                //     queryKey: ["info-mahasiswa-by-email"],
                //   });
                //   console.log("Sukses");
                // } catch (error) {
                //   toast({
                //     title: "❌ Error",
                //     description: "Validasi Setoran Surah Gagal",
                //     variant: "destructive",
                //     action: (
                //       <ToastAction
                //         altText="Refreh"
                //         onClick={() => window.location.reload()}
                //       >
                //         Refresh
                //       </ToastAction>
                //     ),
                //   });
                //   console.log(error);
                // }
              }}
            >
              <SaveAll /> Simpan
            </Button>
            {/* <Button
              variant={"default"}
              className="bg-red-500 hover:scale-[106%] text-white hover:bg-red-700 active:scale-95 flex justify-center items-center gap-1.5"
              onClick={async () => {
                setLoading(true);
                try {
                  const dataAcc = tempDataCheck
                    .filter((item) => item.id_surah !== "")
                    .map((item) => {
                      return mutationDelete.mutateAsync({
                        id: item.id_surah,
                      });
                    });

                  if (dataAcc.length === 0) {
                    setLoading(false);
                    return toast({
                      title: "❌ Error",
                      description: "Tidak ada data yang bisa dihapus",
                      variant: "destructive",
                    });
                  }

                  await Promise.all(dataAcc);
                  setTempDataCheck([]);
                  setSelectAll(false);
                  setLoading(false);
                  await queryclient.invalidateQueries({
                    queryKey: ["info-mahasiswa-by-email"],
                  });
                  toast({
                    title: "✨ Sukses",
                    description: "Pembatalan Setoran Surah Berhasil",
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
              disabled={tempDataCheck.length === 0 || isLoading}
            >
              Hapus
            </Button> */}
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

        <div>
          <Table>
            <TableHeader>
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
                <TableHead className="">
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
                      {surah.setoran.length > 0 ? (
                        <div>
                          <p>
                            {new Date(
                              surah.setoran[0].tgl_setoran
                            ).toLocaleDateString("id-ID")}
                          </p>
                        </div>
                      ) : (
                        <p>-</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div
                        className={`py-2 px-6 rounded-md text-center text-white font-normal ${
                          colourLabelingCategory(surah.label)[1]
                        }`}
                      >
                        {colourLabelingCategory(surah.label)[0]}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {surah.sudah_setor ? surah.setoran[0].dosen.nama : "-"}
                    </TableCell>

                    <TableCell className="text-center">
                      {surah.sudah_setor ? (
                        <div>sudah setor</div>
                      ) : (
                        <div>-</div>
                      )}
                    </TableCell>
                    <TableCell className="">
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
                            dataInfoSetoran?.info.nim,
                            surah.nomor,
                            new Date().toISOString().split("T")[0],
                            surah.setoran[0]?.id || ""
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
