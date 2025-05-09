import BarChartSetoran from "@/components/mahasiswa/setoran-hafalan/statistik/BarChartSetoranHafalan";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { MahasiswaSetoranHafalanStatistikPageProps } from "@/interfaces/pages/mahasiswa/setoran-hafalan/statistik/statistik.interface";

function ModalBoxStatistik({
  dataRingkasan, isOpen, setIsOpen}: { dataRingkasan: MahasiswaSetoranHafalanStatistikPageProps[], isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center py-3">
            Statistik Muroja'ah Mahasiswa 📝
          </DialogTitle>
          <div className="flex flex-col gap-3">
            {dataRingkasan?.map(
              (item: MahasiswaSetoranHafalanStatistikPageProps) => (
                <BarChartSetoran
                  key={item.label}
                  label={item.label}
                  persentase={item.persentase_progres_setor}
                  wajib_setor={item.total_wajib_setor}
                  telah_setor={item.total_sudah_setor}
                />
              )
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ModalBoxStatistik;
