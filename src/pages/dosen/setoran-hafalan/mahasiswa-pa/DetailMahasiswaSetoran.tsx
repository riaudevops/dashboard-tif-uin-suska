import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
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
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiSetoran from "@/services/api/setoran-hafalan/dosen.service";
// import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
// import ModalBox from "@/components/dosen/setoran-hafalan/ModalBox";
import ModalBoxDosen from "@/components/dosen/setoran-hafalan/ModalBox";
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
  const { email } = useParams<{ email: string }>();
  const { toast } = useToast();
  const queryclient = useQueryClient();
  // get data mahasiswa by email
  const { data: dataInfoSetoran } = useQuery({
    queryKey: ["info-mahasiswa-by-email"],
    queryFn: () =>
      apiSetoran.getDataMahasiswaByEmail(email!).then((res) => res.data),
    staleTime: Infinity,
  });

  // post data Setoran with mutation
  const mutation = useMutation({
    mutationFn: apiSetoran.postSetoranSurah, // Pastikan tidak langsung dipanggil
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["info-mahasiswa-by-email"] });

      setDetailSurah({
        nomor: 0,
        nama: "",
        label: "",
        sudah_setor: false,
        setoran: [],
      })

      setButtonLoading(false);
      setModal(false);

      toast({
        title: "Success",
        description: "Setoran Surah Berhasil",
      })
    },

    onError: () => {
      toast({
        title: "Error",
        description: "Setoran Surah Gagal",
        variant: "destructive",
        action: (
          <ToastAction altText="Refreh" onClick={() => window.location.reload()}>Refresh</ToastAction>
        ),
      })
    },
  });

  const mutationDelete = useMutation({
    mutationFn: apiSetoran.pembatalanSetoranSurah,
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["info-mahasiswa-by-email"] });
      toast({
        title: "Success",
        description: "Pembatalan Setoran Surah Berhasil",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Pembatalan Setoran Surah Gagal",
        variant: "destructive",
        action: (
          <ToastAction altText="Refreh" onClick={() => window.location.reload()}>Refresh</ToastAction>
        ),
      })
    },
  })
  const [detailSurah, setDetailSurah] = useState<detailSetoranProps>({
    nomor: 0,
    nama: "",
    label: "",
    sudah_setor: false,
    setoran: [],
  });

  const [idSurah, setIdSurah] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

  const [openModal, setModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  console.log(openModal+"dosen");
  return (
    <DashboardLayout>
      <ModalBoxDosen
        openDialog={openModal}
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

        deleteSetoran={() => {
          mutationDelete.mutate({
            id: idSurah
          })
          setModal(false);
          setCancelModal(false);
        }}
        info={dataInfoSetoran?.info}
        detail={detailSurah}
        onClose={(bool) => {
          setModal(bool);
          setCancelModal(false);
        }}
        cancelModal={cancelModal}
      />
      <div className="flex flex-col gap-4">
        <div className="text-3xl font-bold select-none">
          Detail Setoran Mahasiswa
        </div>
        {/* identitas */}
        <div className="flex flex-col gap-1">
          <div className="flex">
            <div className="w-12 text-left">Nama</div>
            <div className="px-2">:</div>
            <div>{dataInfoSetoran?.info.nama}</div>
          </div>

          <div className="flex">
            <div className="w-12 text-left">Nim</div>
            <div className="px-2">:</div>
            <div>{dataInfoSetoran?.info.nim}</div>
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
              {dataInfoSetoran?.setoran.detail?.map(
                (surah: MahasiswaSetoran, index: number) => (
                  <TableRow
                    key={surah.nomor}
                    className={
                      index % 2 !== 0
                        ? "bg-secondary hover:bg-secondary"
                        : "bg-background hover:bg-background"
                    }
                  >
                    <TableCell className="text-center">
                      {surah.setoran.length > 0 && "✔️ "}
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
                        className={`py-2 px-6 rounded-md text-center text-white font-semibold ${
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
                        <Button className="bg-primary rounded-full border-2 border-solid border-red-400" onClick={() => {
                          setDetailSurah({
                            nomor: surah.nomor,
                            nama: surah.nama,
                            label: surah.label,
                            sudah_setor: surah.sudah_setor,
                            setoran: surah.setoran as Setoran[],
                          });
                          setIdSurah(surah.setoran[0].id);
                          setCancelModal(true);
                          setModal(true);
                        }}>❌ Batalkan</Button>
                      ) : (
                        <Button
                          className="bg-primary rounded-full border-2 border-solid border-green-400"
                          onClick={() => {
                            console.log(surah.nama)
                            setDetailSurah({
                              nomor: surah.nomor,
                              nama: surah.nama,
                              label: surah.label,
                              sudah_setor: surah.sudah_setor,
                              setoran: surah.setoran as Setoran[],
                            });
                            setModal(true);
                          }}
                        >
                          ✅ACC
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DetailMahasiswaSetoran;
