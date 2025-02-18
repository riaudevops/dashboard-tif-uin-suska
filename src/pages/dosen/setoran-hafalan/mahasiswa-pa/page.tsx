import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import icon_dosenpa_page from "@/assets/svgs/dosen/setoran-hafalan/mahasiswa/icon_dosenpa_page.svg";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useFilteredMahasiswa } from "@/hooks/use-filtering-searching";
import colourfulProgress from "@/helpers/colourful-progress";
import apiSetoran from "@/services/api/setoran-hafalan/dosen.service";
import { useQuery } from "@tanstack/react-query";

interface tabListStateProps {
  tahun: string;
  total: string;
}
export default function DosenSetoranHafalanMahasiswaPAPage() {
  const { data: dataMahasiswa_1 } = useQuery({
      queryKey: ["mahasiswa-pa-saya"],
      queryFn: () => apiSetoran.getDataMyMahasiswa().then((res) => res.data),
      staleTime: Infinity,
    });

    console.log(dataMahasiswa_1);
  const dataMahaiswa =
    dataMahasiswa_1?.info_mahasiswa_pa.daftar_mahasiswa;
  const tabListState = dataMahasiswa_1?.info_mahasiswa_pa.ringkasan;
  const { dataCurrent, setSearch, setTabState } = useFilteredMahasiswa(
    dataMahaiswa,
    "semua"
  );
  return (
    <>
      <DashboardLayout>
        <div className="flex flex-col gap-3 pt-11">
          <div className="flex bg-[#86A7FC] px-4 py-2 relative rounded-lg">
            <div className="flex flex-col gap-1 py-10 w-[70%]">
              <div className="font-bold text-3xl">Hello, Dosen PA!</div>
              <div>
                Selamat! 🎉 Tahun ini kamu membimbing {dataMahaiswa?.length}{" "}
                mahasiswa PA. Berikut adalah daftar mahasiswa yang akan kamu
                dampingi. Ayo, mari kita mulai bekerja
              </div>
            </div>

            <div>
              <div className="absolute bottom-0 right-0">
                <img src={icon_dosenpa_page} alt="" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5 w-full">
              <div>
                <Input
                  placeholder="Cari mahasiswa..."
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
              </div>
              <div className="flex justify-start">
                <Tabs defaultValue="tab1">
                  <TabsList className="gap-1.5 overflow-x-auto flex-wrap">
                    <TabsTrigger
                      value="tab1"
                      onClick={() => setTabState("semua")}
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:font-semibold hover:bg-blue-100"
                    >
                      Semua Angkatan
                    </TabsTrigger>
                    {tabListState?.map((item : tabListStateProps) => (
                      <TabsTrigger
                        key={item.tahun}
                        onClick={() => setTabState(item.tahun)}
                        value={item.tahun}
                        className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:font-semibold hover:bg-blue-100"
                      >
                        {item.tahun}{" "}
                        <span className="ml-1 px-1 text-primary rounded-xl bg-muted">
                          {item.total} mhs
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div>
              <Table>
                <TableHeader>
                  <TableRow className="border border-solid border-secondary bg-muted">
                    <TableHead>No</TableHead>
                    <TableHead className="text-center">
                      Nama Mahasiswa
                    </TableHead>
                    <TableHead className="text-center">Nim</TableHead>
                    <TableHead className="text-center">Semester</TableHead>
                    <TableHead className="text-center">
                      Progres Hafalan
                    </TableHead>
                    <TableHead className="text-center">
                      Terakhir Setor
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="border border-solid border-secondary">
                  {dataCurrent?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Data tidak ditemukan
                      </TableCell>
                    </TableRow>
                  )}
                  {dataCurrent?.map((item, index) => (
                    <TableRow
                      key={item.nim}
                      className={
                        index % 2 !== 0
                          ? "bg-secondary hover:bg-secondary hover:underline cursor-pointer"
                          : "bg-background hover:bg-background hover:underline cursor-pointer"
                      }
                      onClick={() => {
                        window.location.href = `/dosen/setoran-hafalan/mahasiswa-pa/${item.email}`;
                      }}
                    >
                        <TableCell>{index + 1}.</TableCell>
                        <TableCell className="text-center">
                          {item.nama}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.nim}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.semester}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 items-center w-full">
                            <div className="w-[90%]">
                              <Progress
                                value={
                                  item.info_setoran.persentase_progress_setor
                                }
                                color={colourfulProgress(
                                  item.info_setoran.persentase_progress_setor
                                )}
                                className="h-3"
                                style={{ maxWidth: "100%" }}
                              />
                            </div>
                            <span className="w-[10%] text-center">
                              {item.info_setoran.persentase_progress_setor}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {item.info_setoran.terakhir_setor || "-"}
                        </TableCell>
                    </TableRow>
                      // </Link>
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
