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
  validasiSetoran: (dateSetoran: string) => void;
  deleteSetoran: () => void;
  cancelModal?: boolean;
  info: infoMahasiswa;
  detail: detailSetoranProps;
}
function ModalBoxDosen({
  openDialog,
  buttonLoading,
  validasiSetoran,
  deleteSetoran,
  cancelModal,
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
  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long", // Ubah format bulan menjadi nama bulan
      year: "numeric",
    });
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
            {cancelModal
              ? `Pembatalan Setoran ${detail?.nama}`
              : `Validate Setoran Surah ${detail?.nama}`}
          </DialogTitle>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div>Nama</div>
              <Input disabled className="bg-secondary" value={info?.nama} />
            </div>
            <div className="flex flex-col gap-1">
              <div>Nim</div>
              <Input disabled className="bg-secondary" value={info?.nim} />
            </div>
            <div className="flex flex-col gap-1">
              <div>Nama Surah yang disetor</div>
              <Input disabled className="bg-secondary" value={detail?.nama} />
            </div>
            <div className="flex flex-col gap-1">
              <div>Tanggal Setoran Hafalan(klik untuk mengubah)</div>
              <div>
                {
                  cancelModal ? (
                    <Input type="text"
                      className="bg-secondary"
                      disabled
                      value={formatDate(detail?.setoran[0]?.tgl_setoran)}
                    />
                    
                  ): (
                    <Input
                      type="date"
                      className="bg-secondary"
                      onChange={(e) => setDateSetoran(e.target.value)}
                      defaultValue={new Date().toISOString().split("T")[0]}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  )

                }
              </div>
            </div>
            <div className="flex gap-1 items-center">
              <Checkbox
                id="terms"
                checked={checkBoxState}
                onClick={() => {
                  setCheckBoxState(!checkBoxState);
                }}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none"
              >
                Accept terms and conditions
              </label>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          {cancelModal ? (
            <Button
              disabled={!checkBoxState}
              className="bg-destructive hover:bg-destructive/90 w-full text-primary"
              onClick={() => {
                deleteSetoran();
                setCheckBoxState(false);
              }}
            >
              {buttonLoading && <Loader2 className="animate-spin" />}
              Pembatalan Setoran Hafalan
            </Button>
          ) : (
            <Button
              disabled={!checkBoxState}
              className="bg-green-500 hover:bg-green-400 w-full text-primary"
              onClick={() => {
                validasiSetoran(dateSetoran);
                setCheckBoxState(false);
              }}
            >
              {buttonLoading && <Loader2 className="animate-spin" />}
              Validasi
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ModalBoxDosen;
