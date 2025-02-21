import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { Calendar, FileDigit, Printer, Rocket, User } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ProgressStatistik from "@/components/mahasiswa/setoran-hafalan/detail-riwayat/ProgressStatistik";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import apiSetoran from "@/services/api/setoran-hafalan/mahasiswa.service";
import { useFilteringSetoranSurat } from "@/hooks/use-filtering-setor-surat";
import { colourLabelingCategory } from "@/helpers/colour-labeling-category";
import { GeneratePDF } from "@/components/mahasiswa/setoran-hafalan/detail-riwayat/generate-pdf-setoran-hafalan";
import { Skeleton } from "@/components/ui/skeleton";
import ModalBoxDetailSetoran from "@/components/mahasiswa/setoran-hafalan/detail-riwayat/ModalBoxDetailSetoran";
import { useState } from "react";
export default function MahasiswaSetoranHafalanDetailRiwayatPage() {
  const { data: dataRingkasan, isLoading } = useQuery({
    queryKey: ["setoran-saya-detail"],
    queryFn: () => apiSetoran.getDataMysetoran().then((data) => data.data),
    staleTime: Infinity,
  });

  const { dataCurrent, setTabState, tabState } = useFilteringSetoranSurat(
    dataRingkasan?.setoran.detail,
    "default"
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [dataModal, setDataModal] = useState({
    nama_surah: "",
    tanggal_setoran: "",
    sudah_setoran: false as boolean,
    dosen_mengesahkan: "",
  });
  console.log(dataModal);
  return (
    <>
      <DashboardLayout>
        <ModalBoxDetailSetoran
          openDialog={openDialog}
          setOpenDialog={() => {
            setOpenDialog(!openDialog);
            setDataModal({
              nama_surah: "",
              tanggal_setoran: "",
              sudah_setoran: false,
              dosen_mengesahkan: "",
            });
          }}
          nama_surah={dataModal.nama_surah}
          tanggal_setoran={dataModal?.tanggal_setoran}
          dosen_mengesahkan={dataModal?.dosen_mengesahkan}
          sudah_setor={dataModal.sudah_setoran}
        />
        <div className="flex flex-col gap-3">
          {/* judul */}
          <div className="flex flex-col gap-1.5 -mb-2">
            <div className="text-lg md:text-3xl font-bold select-none -ml-1">
              ✨ Detail Riwayat Setoran Hafalanmu...
            </div>
            <div className="select-none ml-1 md:text-base text-sm">
              Berikut detail riwayat setoran hafalan kamu untuk persyaratan
              akademik di UIN Suska Riau, semangat terus ya... 💙❤️
            </div>
          </div>
          {/* statistik && user info */}
          <div className="flex gap-2">
            <ProgressStatistik
              uploadedDocs={dataRingkasan?.setoran.info_dasar.total_sudah_setor}
              totalDocs={dataRingkasan?.setoran.info_dasar.total_wajib_setor}
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
                  <span className="">{dataRingkasan?.info.nama}</span>
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
                  <span className="">{dataRingkasan?.info.nim}</span>
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
                  <span className="">{dataRingkasan?.info.semester}</span>
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
                    {dataRingkasan?.setoran.info_dasar.terakhir_setor}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* table and button  */}
          <div className="flex flex-col gap-2.5">
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
              <Button
                variant={"default"}
                className="bg-blue-500 hover:scale-[106%] text-white hover:bg-blue-700 active:scale-95"
                onClick={() =>
                  GeneratePDF({
                    nama: dataRingkasan?.info.nama,
                    nim: dataRingkasan?.info.nim,
                    dataSurah: dataRingkasan?.setoran.detail,
                    dosen_pa: dataRingkasan?.info.dosen_pa.nama,
                    nip_dosen: dataRingkasan?.info.dosen_pa.nip,
                  })
                }
              >
                <Printer /> Cetak Kartu Setoran
              </Button>
            </div>

            <div>
              <Table>
                <TableHeader>
                  <TableRow className="border hover:bg-muted border-solid border-secondary bg-muted">
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
                  </TableRow>
                </TableHeader>
                <TableBody className="border border-solid border-secondary">
                  {dataCurrent?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        {tabState === "sudah_setor"
                          ? "❌ Anda Belum Menyetor Satu pun Hafalan Surah"
                          : "✔️ Anda Sudah Menyetor semua Hafalan Surah"}
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
                  {dataCurrent?.map((surah, index) => (
                    <TableRow
                      key={surah.nomor}
                      className={
                        index % 2 !== 0
                          ? "bg-secondary cursor-pointer"
                          : "bg-background cursor-pointer"
                      }
                      onClick={() => {
                        console.log(surah.nama);
                        setOpenDialog(true);
                        setDataModal({
                          nama_surah: surah.nama,
                          tanggal_setoran:
                            new Date(surah.setoran[0]?.tgl_setoran)
                              .toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })
                              .replace(/^(\d+)\s(\w+)\s(\d+)$/, "$1 $2, $3") ||
                            "-",
                          dosen_mengesahkan:
                            surah.setoran[0]?.dosen.nama || "-",
                          sudah_setoran: surah.sudah_setor,
                        });
                      }}
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
                              {new Date(surah.setoran[0].tgl_setoran)
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
                      <TableCell>
                        <div
                          className={`py-2 px-6 rounded-md text-center text-white font-medium ${
                            colourLabelingCategory(surah.label)[1]
                          }`}
                        >
                          {colourLabelingCategory(surah.label)[0]}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {surah.setoran.length > 0
                          ? surah.setoran[0].dosen.nama
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
