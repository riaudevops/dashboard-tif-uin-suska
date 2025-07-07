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
import { ModalBoxBatalkanProps } from "@/interfaces/components/dosen/setoran-hafalan/modal-box-batalkan-setoran.interface";

function ModalBoxBatalSetoran({
  openDialog,
  buttonLoading,
  deleteSetoran,
  info,
  onClose
}: ModalBoxBatalkanProps) {
  const [checkBoxState, setCheckBoxState] = React.useState(false);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(openDialog);
  }, [openDialog]);
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
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-center">
            ❌ Pembatalan Muroja'ah ❌ 
          </DialogTitle>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="text-start">Nama</div>
              <Input disabled className="bg-secondary" value={info?.nama} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-start">NIM</div>
              <Input disabled className="bg-secondary" value={info?.nim} />
            </div>

            <div className="flex gap-3 items-center cursor-pointer">
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
                className="text-sm text-left leading-tight cursor-pointer font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none"
              >
                Saya yakin akan membatalkan validasi muroja'ah dari
                mahasiswa{" "}
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
            className="bg-red-600 hover:bg-destructive/90 w-full text-white"
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              !buttonLoading && deleteSetoran();
            }}
          >
            {buttonLoading && <Loader2 className="animate-spin" />}
            Batalkan Muroja'ah Mahasiswa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ModalBoxBatalSetoran;
