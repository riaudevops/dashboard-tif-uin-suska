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
import ModalBoxDosen from "@/components/dosen/setoran-hafalan/ModalBoxValidasiSetoran";
import ModalBoxBatalSetoran from "@/components/dosen/setoran-hafalan/ModalBoxBatalSetoran";
import { Skeleton } from "@/components/ui/skeleton";
import ModalBoxStatistik from "@/components/dosen/setoran-hafalan/ModalBoxStatistik";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFilteringSetoranSurat } from "@/hooks/use-filtering-setor-surat";
import { Calendar, ChartSpline, FileDigit, Rocket, User } from "lucide-react";
import ProgressStatistik from "@/components/mahasiswa/setoran-hafalan/detail-riwayat/ProgressStatistik";
interface Dosen {
  nama: string;
}

interface Setoran {
  id: string;
  tgl_setoran: string; // Bisa diubah ke Date jika ingin langsung digunakan sebagai objek Date
  tgl_validasi: string; // Bisa diubah ke Date jika diperlukan
  dosen: Dosen;
}
interface MahasiswaSetoran {
  nomor: number;
  nama: string;
  label: string;
  sudah_setor: boolean;
  setoran: Setoran[];
}
interface detailSetoranProps {
  nomor: number;
  nama: string;
  label: string;
  sudah_setor: boolean;
  setoran: Setoran[];
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
      apiSetoran.getDataMahasiswaByEmail(email!).then((res) => res.data)
  });

  const { dataCurrent, setTabState, tabState } = useFilteringSetoranSurat(
    dataInfoSetoran?.setoran.detail,
    "default"
  );

  // post data Setoran with mutation
  const mutation = useMutation({
    mutationFn: apiSetoran.postSetoranSurah,
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["info-mahasiswa-by-email"] });

      setDetailSurah({
        nomor: 0,
        nama: "",
        label: "",
        sudah_setor: false,
        setoran: [],
      });

      setButtonLoading(false);
      setModalValidasiSetoran(false);

      toast({
        title: "✨ Sukses",
        description: "Validasi Setoran Surah Berhasil",
      });
    },

    onError: () => {
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
    },
  });

  const mutationDelete = useMutation({
    mutationFn: apiSetoran.pembatalanSetoranSurah,
    onSuccess: () => {
      setButtonLoading(false);
      setModalBatalkanSetoran(false);
      queryclient.invalidateQueries({ queryKey: ["info-mahasiswa-by-email"] });
      toast({
        title: "✨ Sukses",
        description: "Pembatalan Setoran Surah Berhasil",
      });
    },
    onError: () => {
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
    },
  });
  const [detailSurah, setDetailSurah] = useState<detailSetoranProps>({
    nomor: 0,
    nama: "",
    label: "",
    sudah_setor: false,
    setoran: [],
  });

  const [idSurah, setIdSurah] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

  const [openModalValidasiSetoran, setModalValidasiSetoran] = useState(false);
  const [openModalBatalkanSetoran, setModalBatalkanSetoran] = useState(false);
  const [openModalStatistik, setModalStatistik] = useState(false);
  return (
    <DashboardLayout>
      <ModalBoxStatistik
        isOpen={openModalStatistik}
        dataRingkasan={dataInfoSetoran?.setoran.ringkasan}
        setIsOpen={setModalStatistik}
      />
      <ModalBoxBatalSetoran
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
      />
      <ModalBoxDosen
        openDialog={openModalValidasiSetoran}
        buttonLoading={buttonLoading}
        validasiSetoran={(dateSetoran: string) => {
          setButtonLoading(true);
          mutation.mutate({
            nim: dataInfoSetoran?.info.nim,
            email_dosen_pa: dataInfoSetoran?.info.dosen_pa.email,
            nomor_surah: detailSurah.nomor,
            tgl_setoran: dateSetoran,
          });
        }}
        info={dataInfoSetoran?.info}
        detail={detailSurah}
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
          <div>
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
          </div>
        </div>

        <div>
          <Table>
            <TableHeader>
              <TableRow className="border border-solid border-secondary bg-muted">
                <TableHead className="text-center">No</TableHead>
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
                <TableHead className="text-center">Aksi</TableHead>
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
              {dataCurrent?.map((surah: MahasiswaSetoran, index: number) => (
                <TableRow
                  key={surah.nomor}
                  className={
                    index % 2 !== 0
                      ? "bg-secondary hover:bg-secondary"
                      : "bg-background hover:bg-background"
                  }
                >
                  <TableCell className="text-center">
                    {surah.setoran.length > 0 && (
                      <span className="text-green-500 text-xl font-bold">
                        ✓{" "}
                      </span>
                    )}
                    {index + 1}.
                  </TableCell>
                  <TableCell>{surah.nama}</TableCell>
                  <TableCell className="text-center">
                    {surah.setoran.length > 0 ? (
                      <div>
                        <p>
                          {new Date(
                            surah.setoran[0].tgl_setoran
                          ).toLocaleDateString()}{" "}
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
                      <Button
                        variant={"outline"}
                        className="rounded-full border-2 border-solid border-red-400 hover:scale-[105%] active:scale-95"
                        onClick={() => {
                          setDetailSurah({
                            nomor: surah.nomor,
                            nama: surah.nama,
                            label: surah.label,
                            sudah_setor: surah.sudah_setor,
                            setoran: surah.setoran as Setoran[],
                          });
                          setIdSurah(surah.setoran[0].id);
                          setModalBatalkanSetoran(true);
                        }}
                      >
                        ❌ Batalkan
                      </Button>
                    ) : (
                      <Button
                        variant={"outline"}
                        className="rounded-full border-2 border-solid border-green-400 hover:scale-[105%] active:scale-95"
                        onClick={() => {
                          console.log(surah.nama);
                          setDetailSurah({
                            nomor: surah.nomor,
                            nama: surah.nama,
                            label: surah.label,
                            sudah_setor: surah.sudah_setor,
                            setoran: surah.setoran as Setoran[],
                          });
                          setModalValidasiSetoran(true);
                        }}
                      >
                        <span className="font-bold text-green-500 text-lg">
                          ✓
                        </span>{" "}
                        ACC
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DetailMahasiswaSetoran;
