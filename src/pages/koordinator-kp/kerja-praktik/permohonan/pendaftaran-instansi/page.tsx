import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import APIDaftarKP from "@/services/api/koordinator-kp/daftar-kp.service";
import { Input } from "@/components/ui/input";

// interface InstansiInterface {
//   id: string;
//   status: "Semua Instansi" | "Aktif" | "Pending" | "Tidak_Aktif";
//   nama: string;
//   jenis: "Swasta" | "UMKM" | "Pemerintahan" | "Pendidikan";
// }

type Tab = "Semua Instansi" | "Aktif" | "Pending" | "Tidak_Aktif";

const cardData = [
  { text: "Total Instansi", count: 0 },
  { text: "Instansi Aktif", count: 0 },
  { text: "Instansi Pending", count: 0 },
  { text: "Instansi Tidak Aktif", count: 0 },
];

const buttonData = [
  { text: "Semua Instansi" },
  { text: "Aktif" },
  { text: "Pending" },
  { text: "Tidak_Aktif" },
];

function KoordinatorKerjaPraktikInstansiPage() {
  const [currentTab, setCurrentTab] = useState<Tab>("Semua Instansi");
  const [searchInput, setSearchInput] = useState<string>("");
  const navigate = useNavigate();

  const { data: dataInstansi, isLoading } = useQuery({
    queryKey: ["halaman-detail-instansi-data-instansi"],
    queryFn: () =>
      APIDaftarKP.getAllDataInstansi().then((res) => {
        cardData[1].count = 0;
        cardData[2].count = 0;
        cardData[3].count = 0;
        cardData[0].count = 0;

        res.data.forEach((item: any) => {
          if (item.status === "Aktif") {
            ++cardData[1].count;
          } else if (item.status === "Pending") {
            ++cardData[2].count;
          } else if (item.status === "Tidak_Aktif") {
            ++cardData[3].count;
          }
          ++cardData[0].count;
        });

        return res.data;
      }),
  });

  return (
    <DashboardLayout>
      <Card>
        <div className="flex flex-col gap-4">
          <CardHeader>
            <CardTitle className="font-bold tracking-wide text-2xl">
              Daftar Instansi Kerja praktik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-auto">
              {cardData.map((item, i) => (
                <Card1 key={i} text={item.text} count={item.count} />
              ))}
            </div>
            <div className="flex justify-between my-2">
              <div className="w-fit rounded-lg flex gap-2">
                {buttonData.map((item, i) => (
                  <Button
                    key={i}
                    onClick={() => setCurrentTab(item.text as Tab)}
                    className={`p-2 rounded-lg ${
                      currentTab === item.text
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    } text-sm font-semibold tracking-wide`}
                  >
                    {item.text.replace("_", " ")}
                  </Button>
                ))}
              </div>
              <Input
                className="max-w-[25%] border dark:border-gray-700 dark:bg-gray-800/50"
                placeholder="Cari berdasarkan nama"
                onChange={(e) => setSearchInput(e.currentTarget.value)}
                value={searchInput}
              />
            </div>
            <div className="rounded-lg overflow-hidden border-[1px] border-gray-300">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-b-[1px] border-gray-300 text-gray-600">
                    <TableHead>No</TableHead>
                    <TableHead>Nama Instansi</TableHead>
                    <TableHead>Jenis Instansi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataInstansi &&
                    dataInstansi
                      .filter(
                        (item: any) =>
                          currentTab === "Semua Instansi" ||
                          item.status === currentTab
                      )
                      .filter((item: any) => item.nama.includes(searchInput))
                      .map((item: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{item.nama}</TableCell>
                          <TableCell>{item.jenis}</TableCell>
                          <TableCell>{item.status}</TableCell>
                          <TableCell>
                            <Button
                              onClick={() =>
                                navigate(
                                  `/koordinator-kp/kerja-praktik/instansi/detail-instansi/${item.id}`
                                )
                              }
                              className="rounded-lg p-2 bg-blue-500 text-white font-semibold tracking-wide"
                            >
                              Lihat Detail
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
              {isLoading && <p className="text-center">Loading...</p>}
            </div>
          </CardContent>
        </div>
      </Card>
    </DashboardLayout>
  );
}

interface CardProps {
  text: string;
  count: number;
}

function Card1({ text, count }: CardProps) {
  return (
    <Card className="flex rounded-lg border-2 border-green-600 w-[25%]">
      <div className="h-full w-1 bg-green-600"></div>
      <CardContent className="p-3">
        <CardDescription>{text}</CardDescription>
        <CardTitle className="font-bold text-3xl">{count}</CardTitle>
        <CardDescription className="text-blue-600">Instansi</CardDescription>
      </CardContent>
    </Card>
  );
}

export default KoordinatorKerjaPraktikInstansiPage;
