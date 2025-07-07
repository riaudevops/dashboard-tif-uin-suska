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
import { ModalBoxValidasiProps } from "@/interfaces/components/dosen/setoran-hafalan/modal-box-validasi-setoran.interface";


function ModalBoxValidasiSetoran({
  openDialog,
  buttonLoading,
  validasiSetoran,
  info,
  onClose,
}: ModalBoxValidasiProps) {
  const [checkBoxState, setCheckBoxState] = React.useState(false);
  const [dateSetoran, setDateSetoran] = React.useState(getLocalDateString());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(openDialog);
    setDateSetoran(getLocalDateString());
  }, [openDialog]);
  function getLocalDateString() {
    const now = new Date();
    const offset = now.getTimezoneOffset(); // dalam menit
    const localDate = new Date(now.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  }
  useEffect(() => {
    setCheckBoxState(buttonLoading);
  }, [buttonLoading]);


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
            &nbsp; Validasi Pengesahan Anda &nbsp;
            <span className="text-green-500 font-extrabold text-lg">✓</span>
          </DialogTitle>
          <div className="flex flex-col gap-3 w-full">
            <div className="flex flex-col gap-1">
              <div className="text-start">Nama</div>
              <Input disabled className="bg-secondary" value={info?.nama} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-start">NIM</div>
              <Input disabled className="bg-secondary" value={info?.nim} />
            </div>
            
            <div className="text-left flex flex-col gap-1">
              <div>
                Tanggal Muroja'ah{" "}
                <span className="text-sm italic">
                  &nbsp;(klik untuk mengubah)
                </span>
              </div>
              <div>
                {
                  <div className="relative w-full">
                    <input
                      type="date"
                      className="bg-secondary date-input w-full py-2 pl-10 pr-4 rounded-md border border-gray-300"
                      onChange={(e) => setDateSetoran(e.target.value)}
                      defaultValue={getLocalDateString()}
                      max={getLocalDateString()}
                    />
                    {/* Ikon di pojok kiri input */}
                    <Calendar1Icon className="absolute left-3 top-[20px] transform -translate-y-1/2 text-foreground w-5 h-5" />
                  </div>
                }
              </div>
            </div>
            <div className="flex gap-3 items-center cursor-pointer">
              <Checkbox
                id="terms"
                checked={checkBoxState}
                onClick={() => {
                  setCheckBoxState(!checkBoxState);
                }}
              />
              <label
                htmlFor="terms"
                className="text-sm text-left leading-tight cursor-pointer font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none"
              >
                Saya yakin akan melakukan validasi muroja'ah dari mahasiswa{" "}
                <span className="underline italic font-medium">
                  {info?.nama}
                </span>
              </label>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={!checkBoxState}
            className="bg-green-500 hover:bg-green-400 w-full text-white"
            onClick={() => {
              !buttonLoading && validasiSetoran(dateSetoran);
            }}
          >
            {buttonLoading && <Loader2 className="animate-spin" />}
            Validasi Muroja'ah Mahasiswa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ModalBoxValidasiSetoran;
