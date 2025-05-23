import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import {
  Calendar,
  DownloadIcon,
  FileDigit,
  GraduationCap,
  History,
  Printer,
  Rocket,
  User,
  X,
} from "lucide-react";
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
import APISetoran from "@/services/api/mahasiswa/setoran-hafalan.service";
import { useFilteringSetoranSurat } from "@/hooks/use-filtering-setor-surat";
import { colourLabelingCategory } from "@/helpers/colour-labeling-category";
import { Skeleton } from "@/components/ui/skeleton";
import ModalBoxDetailSetoran from "@/components/mahasiswa/setoran-hafalan/detail-riwayat/ModalBoxDetailSetoran";
import { useState } from "react";
import ModalBoxLogsMahasiswa from "@/components/mahasiswa/setoran-hafalan/detail-riwayat/ModalBoxLogsMahasiswa";
import TableLoadingSkeleton from "@/components/globals/table-loading-skeleton";
import { Input } from "@/components/ui/input";

export default function MahasiswaSetoranHafalanDetailRiwayatPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [dataModal, setDataModal] = useState({
    nama_komponen_setoran: "",
    tanggal_setoran: "",
    sudah_setoran: false as boolean,
    dosen_mengesahkan: "",
  });

  const [modalLogs, setModalLogs] = useState(false);

  const { data: dataRingkasan, isLoading } = useQuery({
    queryKey: ["setoran-saya-detail"],
    queryFn: () => APISetoran.getDataMysetoran().then((data) => data.data),
    staleTime: Infinity,
  });

  const { dataCurrent, setTabState, tabState, setSearch, search } =
    useFilteringSetoranSurat(dataRingkasan?.setoran.detail, "default");

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleCetakKartuMurojaahMobile = async () => {
    const response = await APISetoran.getKartuMurojaahSaya();
    
    const pdfName = response.headers["content-disposition"].split("filename=")[1].replaceAll('"', '');
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url || "";
    link.download = pdfName || "";
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);   
  }

  const handleCetakKartuMurojaah = async () => {
    const response = await APISetoran.getKartuMurojaahSaya();
    
    const pdfName = response.headers["content-disposition"].split("filename=")[1].replaceAll('"', '');
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    setPdfUrl(url);
    setPdfName(pdfName);
    setShowModal(true);    
  }

  const handeDownloadPDF = async () => {
    const link = document.createElement("a");
    link.href = pdfUrl || "";
    link.download = pdfName || "";
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);

    setShowModal(false);
    setPdfUrl(null);
    setPdfName(null);
  }

  return (
    <>
      {showModal && pdfUrl && (
        <div className="fixed z-[999] w-screen h-screen flex items-center justify-center bg-black bg-opacity-70">
          <div className="w-[80%] h-[90%] flex flex-col justify-center items-end gap-1">
            <div className="flex gap-1 h-10 w-full">
              <div className="w-full h-full rounded-md bg-green-800 flex justify-start items-center px-4">
                <p className="text-white text-center font-medium">{ pdfName }</p>
              </div>
              <Button variant={"default"} className="bg-yellow-700 active:bg-yellow-700 hover:bg-yellow-800 justify-center flex h-full hover:scale-95 active:scale-100"
                  onClick={handeDownloadPDF}
                >
                  <DownloadIcon width={50} height={50} color="white" />
              </Button>
              <Button variant={"destructive"} className="justify-center flex h-full hover:scale-95 active:scale-100"
                  onClick={() => {
                    setShowModal(false);
                    setPdfUrl(null);
                  }}
                >
                  <X width={50} height={50} color="white" />
              </Button>
            </div>
            <iframe
              src={pdfUrl}
              title={pdfName || ""}
              className="border rounded w-full h-full"
            ></iframe>
          </div>
        </div>
      )}

      <DashboardLayout>
        <ModalBoxDetailSetoran
          openDialog={openDialog}
          setOpenDialog={() => {
            setOpenDialog(!openDialog);
            setDataModal({
              nama_komponen_setoran: "",
              tanggal_setoran: "",
              sudah_setoran: false,
              dosen_mengesahkan: "",
            });
          }}
          nama_komponen_setoran={dataModal.nama_komponen_setoran}
          tanggal_setoran={dataModal?.tanggal_setoran}
          dosen_mengesahkan={dataModal?.dosen_mengesahkan}
          sudah_setor={dataModal.sudah_setoran}
        />

        <ModalBoxLogsMahasiswa
          isOpen={modalLogs}
          setIsOpen={setModalLogs}
          dataLogs={dataRingkasan?.setoran.log}
        />
        <div className="flex flex-col gap-4">
          {/* judul */}
          <div className="flex flex-col gap-1.5 -mb-2.5">
            <div className="text-lg md:text-3xl font-bold select-none -ml-1">
              ✨ Detail Riwayat Muroja'ah-mu...
            </div>
            <div className="select-none ml-1 md:text-base text-sm">
              Berikut detail riwayat muroja'ah kamu untuk persyaratan
              akademik di UIN Suska Riau, semangat terus ya... 💙❤️
            </div>
          </div>

          {/* statistik && user info */}
          <div className="flex gap-2 -mb-5">
            <ProgressStatistik
              uploadedDocs={
                dataRingkasan?.setoran.info_dasar.total_sudah_setor || 0
              }
              totalDocs={
                dataRingkasan?.setoran.info_dasar.total_wajib_setor || 1
              }
            />

            <div className="md:-ml-36 ml-3 flex flex-col gap-1 h-full justify-center py-9 md:py-14">
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
                  <span className="">{dataRingkasan?.info.nama}</span>
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
                  <span className="">{dataRingkasan?.info.nim}</span>
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
                  <span className="">{dataRingkasan?.info.semester}</span>
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
                  <span className="">
                    {dataRingkasan?.info.dosen_pa.nama}
                  </span>
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
                    {dataRingkasan?.setoran.info_dasar.terakhir_setor}
                  </span>
                </div>
              </div>
            </div>
          </div>          

          {/* table and button  */}
          <div className="flex flex-col gap-1.5 sticky top-[51.3px] bg-background pt-2.5 -mb-4 pb-3.5 z-50">
            <div className="flex justify-between gap-4">
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
              <div className="flex gap-1.5">
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
                <Button
                  variant={"default"}
                  className="hidden md:flex bg-blue-500 text-white hover:bg-blue-700 active:scale-95"
                  onClick={handleCetakKartuMurojaah}
                >
                  <Printer />
                  Cetak Kartu Muroja'ah
                </Button>
                <Button
                  variant={"default"}
                  className="md:hidden flex bg-blue-500 text-white hover:bg-blue-700 active:scale-95"
                  onClick={handleCetakKartuMurojaahMobile}
                >
                  <Printer />
                </Button>
              </div>
            </div>
            <div className="mt-1">
              <Input
                placeholder="Cari surah yang mau di-muroja'ah berdasarkan nama surah-nya..."
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                className="w-full"
              />
            </div>
          </div>        
          <div>
            <Table>
              <TableHeader>
                <TableRow className="border hover:bg-muted border-solid border-secondary bg-muted">
                  <TableHead className="text-center">No</TableHead>
                  <TableHead className="text-center">Nama Surah</TableHead>
                  <TableHead className="text-center">
                    Tanggal Muroja'ah
                  </TableHead>
                  <TableHead className="text-center">
                    Persyaratan Muroja'ah
                  </TableHead>
                  <TableHead className="text-center">
                    Dosen Yang Mengesahkan
                  </TableHead>
                  <TableHead className="text-center">Status Muroja'ah</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="border border-solid border-secondary">
                {dataCurrent?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      {search ? "❌ Maaf, surah yang anda cari tidak ditemukan nih!" : tabState === "sudah_setor"
                        ? "❌ Anda Belum Menyetor Satu pun Hafalan Surah"
                        : "✔️ Anda Sudah Menyetor semua Hafalan Surah"}
                    </TableCell>
                  </TableRow>
                )}
                {isLoading && <TableLoadingSkeleton columns={6} rows={7} />}
                {dataCurrent?.map((surah, index) => (
                  <TableRow
                    key={surah.id}
                    className={
                      index % 2 !== 0
                        ? "bg-secondary cursor-pointer"
                        : "bg-background cursor-pointer"
                    }
                    onClick={() => {
                      setDataModal({
                        nama_komponen_setoran: surah.nama,
                        tanggal_setoran:
                          new Date(surah.info_setoran?.tgl_setoran)
                            .toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })
                            .replace(/^(\d+)\s(\w+)\s(\d+)$/, "$1 $2, $3") ||
                          "-",
                        dosen_mengesahkan:
                          surah.info_setoran?.dosen_yang_mengesahkan.nama ||
                          "-",
                        sudah_setoran: surah.sudah_setor,
                      });
                      setOpenDialog(true);
                    }}
                  >
                    <TableCell className="text-center">
                      {index + 1}.
                    </TableCell>
                    <TableCell className="text-center">{surah.nama} {surah.nama_arab && ` - ${surah.nama_arab}`}</TableCell>
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
                    <TableCell className="text-center">
                      <div
                        className={`py-1 px-3 rounded-2xl text-center text-white inline-block ${
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
                        <div className="bg-green-600 px-3 py-1 text-white rounded-2xl inline-block">
                          Selesai
                        </div>
                      ) : (
                        <div>-</div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
