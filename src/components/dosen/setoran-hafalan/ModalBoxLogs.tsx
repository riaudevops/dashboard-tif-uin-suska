import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CircleCheckBig, CircleX } from "lucide-react";
import React from "react";
import dataLogs from "@/assets/logs.json";

function ModalBoxLogs({
  isOpen,
  setIsOpen,

}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // console.log(dataLogs.log_validasi);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-center py-3">
            <div className="flex flex-col items-center justify-center gap-1">
              <div>Logs Setoran Mahasiswa 🔗</div>
             
            </div>
          </DialogTitle>
          <div className="flex flex-col h-96 overflow-y-auto">
            {/* kegiatan */}
            <div className="flex flex-col gap-2">
              {dataLogs.log_validasi.map((item) =>
                item.action === "validasi" ? (
                  <div className="px-3 py-4 rounded-lg bg-gradient-to-r from-secondary to-green-500/50">
                    <div className="flex gap-1.5">
                      <div className="flex items-center">
                        <CircleCheckBig
                          className="stroke-green-500"
                          size={50}
                        />
                      </div>

                      <div className="flex flex-col gap-1 justify-center">
                        <div className="text-sm">
                          Anda{" "}
                          <span className="font-bold underline">
                            memvalidasi
                          </span>{" "}
                          surah{" "}
                          {item.surah?.map((surah, index) => (
                            <span key={surah.nomor} className="italic">
                              {surah.nama_latin}
                              {index < item.surah.length - 1 && ", "}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs dark:text-gray-400 text-gray-600">
                          {item.waktu_display}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-3 py-4 rounded-lg bg-gradient-to-r from-red-500/50 to-secondary">
                    <div className="flex gap-1.5 justify-start">
                      <div>
                        <CircleX className="stroke-red-500" size={50} />
                      </div>
                      <div className="flex flex-col gap-1 justify-center">
                        <div className="text-sm">
                          Anda{" "}
                          <span className="font-bold underline">
                            membatalkan
                          </span>{" "}
                          validasi surah{" "}
                          {item.surah?.map((surah, index) => (
                            <span key={surah.nomor} className="italic">
                              {surah.nama_latin}
                              {index < item.surah.length - 1 && ", "}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs dark:text-gray-400 text-gray-600">
                          {item.waktu_display}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ModalBoxLogs;
