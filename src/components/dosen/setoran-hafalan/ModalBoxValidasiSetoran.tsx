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
import { Calendar1Icon, Loader2 } from "lucide-react";
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
  validasiSetoran: (dateSetoran: string) => void;
  info: infoMahasiswa;
  detail: detailSetoranProps;
}
function ModalBoxValidasiSetoran({
  openDialog,
  buttonLoading,
  validasiSetoran,
  info,
  detail,
  onClose,
}: ModalBoxProps) {
  const [checkBoxState, setCheckBoxState] = React.useState(false);
  const [dateSetoran, setDateSetoran] = React.useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(openDialog);
  }, [openDialog]);
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
            <span className="text-green-500 font-extrabold text-lg">✓</span>
            &nbsp;
            Validasi Pengesahan Anda
            &nbsp;
            <span className="text-green-500 font-extrabold text-lg">✓</span>
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
              <div>Tanggal Setoran Hafalan <span className="text-sm italic">&nbsp;(klik untuk mengubah)</span></div>
              <div>
                {
                <div className="relative w-full">
                  <input
                    type="date"
                    className="bg-secondary date-input w-full py-2 pl-10 pr-4 rounded-md border border-gray-300"
                    onChange={(e) => setDateSetoran(e.target.value)}
                    defaultValue={new Date().toISOString().split("T")[0]}
                    max={new Date().toISOString().split("T")[0]}
                  />
                  {/* Ikon di pojok kiri input */}
                  <Calendar1Icon className="absolute left-3 top-[20px] transform -translate-y-1/2 text-foreground w-5 h-5" />
                </div>
                }
              </div>
            </div>
            <div className="flex gap-3 hover:scale-95 active:scale-100 items-center cursor-pointer">
              <Checkbox
                id="terms"
                checked={checkBoxState}
                onClick={() => {
                  setCheckBoxState(!checkBoxState);
                }}
              />
              <label
                htmlFor="terms"
                className="text-sm leading-tight cursor-pointer font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none"
              >
                Saya yakin akan melakukan validasi setoran surah{" "}
                <span className="underline italic font-medium">{detail?.nama}</span> dari
                mahasiswa <span className="underline italic font-medium">{info?.nama}</span>
              </label>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={!checkBoxState}
            className="bg-green-500 hover:bg-green-400 w-full text-white"
            onClick={() => {
              validasiSetoran(dateSetoran);
              setCheckBoxState(false);
            }}
          >
            {buttonLoading && <Loader2 className="animate-spin" />}
            Validasi Setoran Mahasiswa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ModalBoxValidasiSetoran;
