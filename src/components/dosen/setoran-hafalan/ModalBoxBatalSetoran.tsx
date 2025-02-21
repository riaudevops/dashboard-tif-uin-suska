import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Dosen {
  nama: string;
}

interface Setoran {
  id: string;
  tgl_setoran: string;
  tgl_validasi: string;
  dosen: Dosen;
}

interface detailSetoranProps {
  nomor: number;
  nama: string;
  label: string;
  sudah_setor: boolean;
  setoran: Setoran[];
}
interface infoMahasiswa {
  nama: string;
  nim: string;
  email: string;
  semester: number;
  dosen_pa: {
    nama: string;
    nip: string;
    email: string;
  };
}
interface ModalBoxProps {
  openDialog: boolean;
  buttonLoading: boolean;
  onClose: (bool: boolean) => void;
  deleteSetoran: () => void;
  info: infoMahasiswa;
  detail: detailSetoranProps;
}
function ModalBoxBatalSetoran({
  openDialog,
  buttonLoading,
  deleteSetoran,
  info,
  detail,
  onClose,
}: ModalBoxProps) {
  const [checkBoxState, setCheckBoxState] = React.useState(false);
  const [isOpen, setIsOpen] = useState(false);

  console.log(buttonLoading);

  useEffect(() => {
    setIsOpen(openDialog);
  }, [openDialog]);
  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long", // Ubah format bulan menjadi nama bulan
      year: "numeric",
    }).replace(/^(\d+)\s(\w+)\s(\d+)$/, "$1 $2, $3");
  };
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        onClose(open);
        setCheckBoxState(false);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
             ❌ Pembatalan Setoran ❌ 
          </DialogTitle>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div>Nama</div>
              <Input disabled className="bg-secondary" value={info?.nama} />
            </div>
            <div className="flex flex-col gap-1">
              <div>NIM</div>
              <Input disabled className="bg-secondary" value={info?.nim} />
            </div>
            <div className="flex flex-col gap-1">
              <div>Nama Surah yang disetor</div>
              <Input disabled className="bg-secondary" value={detail?.nama} />
            </div>
            <div className="flex flex-col gap-1">
              <div>Tanggal Setoran Hafalan</div>
              <div>
                  <Input
                    type="text"
                    className="bg-secondary"
                    disabled
                    value={formatDate(detail?.setoran[0]?.tgl_setoran)}
                  />
              </div>
            </div>
            <div className="flex gap-3 hover:scale-95 active:scale-100 items-center cursor-pointer">
              <Checkbox
                id="terms"
                checked={checkBoxState}
                className=""
                onClick={() => {
                  setCheckBoxState(!checkBoxState);
                }}
              />
              <label
                htmlFor="terms"
                className="text-sm leading-tight cursor-pointer font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none"
              >
               Saya yakin akan membatalkan validasi setoran surah <span className="underline italic font-medium">{detail?.nama}
                </span> dari mahasiswa <span className="underline italic font-medium">{info?.nama}</span>
              </label>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
            <Button
              disabled={!checkBoxState}
              className="bg-red-600 hover:bg-destructive/90 w-full text-white"
              onClick={() => {
                deleteSetoran();
                setCheckBoxState(false);
              }}
            >
              {buttonLoading && <Loader2 className="animate-spin" />}
              Batalkan Setoran Mahasiswa
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ModalBoxBatalSetoran;
