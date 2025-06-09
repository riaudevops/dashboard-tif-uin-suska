import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { CircleCheckBig, CircleX } from "lucide-react";
import React from "react";
// import dataLogs from "@/assets/logs.json";
import { DataLogsProps } from "@/interfaces/components/dosen/setoran-hafalan/modal-box-logs.interface";
import { CircleCheckBig, CircleX, LucideBadgeHelp } from "lucide-react";
function ModalBoxLogsMahasiswa({
  isOpen,
  setIsOpen,
  dataLogs,
}: {
  dataLogs: DataLogsProps[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // utils/formatDateTime.ts
  function formatDateTime(isoTimestamp: string): string {
    const date = new Date(isoTimestamp);
    return date.toLocaleString("id-ID", {
      weekday: "long", // Senin, Selasa, dst
      year: "numeric", // 2025
      month: "long", // April
      day: "numeric", // 23
      hour: "2-digit", // 09
      minute: "2-digit", // 57
      second: "2-digit", // 17
      timeZoneName: "short", // WIB
    });
  }
  function extractIP(ip: string): string {
    if (ip.includes('::ffff:')) {
      return ip.split('::ffff:')[1];
    }
    return ip;
  }
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <DialogContent className="h-[calc(100vh-180px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center py-3">
            <div className="flex flex-col items-center justify-center gap-1">
              <div>Riwayat Aktivitas Muroja'ah Mahasiswa 🔗</div>
            </div>
          </DialogTitle>
          {dataLogs?.length === 0 && (
            <div className="w-full bg-muted/10 rounded-xl h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-10 gap-2">
              <div className="bg-secondary rounded-full backdrop-blur-sm">
                <LucideBadgeHelp
                  className="h-20 w-20 text-chart-3 drop-shadow-md"
                  strokeWidth={1.2}
                />
              </div>

              <div>
                <h1 className="text-4xl font-extrabold text-chart-3 tracking-tight text-center">
                  Tidak ada aktivitas
                </h1>
                <p className="text-foreground text-base leading-relaxed text-center">
                  Belum ada aktivitas pada mahasiswa ini.
                </p>
              </div>
            </div>
          )}
          <div className="flex flex-col">
            {/* kegiatan */}
            <div className="flex flex-col gap-2">
              {/* logs */}
              {dataLogs?.map((item) =>
                item.aksi === "VALIDASI" ? (
                  <div
                    key={item.id}
                    className="px-3 py-4 rounded-lg bg-gradient-to-r from-secondary to-green-500/50"
                  >
                    <div className="flex gap-3">
                      <div className="flex items-center">
                        <CircleCheckBig
                          className="stroke-green-500"
                          size={50}
                        />
                      </div>

                      <div className="flex flex-col gap-1 justify-center">
                        <div className="text-sm">
                          {item.dosen_yang_mengesahkan.nama}
                          {", "}
                          <span className="font-bold underline">
                            memvalidasi
                          </span>{" "}
                          muroja'ah dari surah{" "}
                          <span className="italic">{item.keterangan}</span>
                        </div>

                        <div className="flex justify-between">
                          <div className="text-xs dark:text-gray-400 text-gray-600">
                            {formatDateTime(item.timestamp)}
                          </div>
                          <div className="text-xs dark:text-gray-400 text-gray-600">
                            IPv4: {extractIP(item.ip)}
                          </div>
                        </div>

                        <div className="mt-1.5 text-xs text-foreground/70">
                          {item.user_agent}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={item.id} className="px-3 py-4 rounded-lg bg-gradient-to-r from-red-500/50 to-secondary">
                    <div className="flex gap-3 justify-start">
                      <div>
                        <CircleX className="stroke-red-500" size={50} />
                      </div>
                      <div className="flex flex-col gap-1 justify-center">
                        <div className="text-sm">
                          {item.dosen_yang_mengesahkan.nama}
                          {", "}
                          <span className="font-bold underline">
                            membatalkan
                          </span>{" "}
                          validasi muroja'ah dari surah{" "}
                          <span className="italic">{item.keterangan}</span>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-xs dark:text-gray-400 text-gray-600">
                            {formatDateTime(item.timestamp)}
                          </div>
                          <div className="text-xs dark:text-gray-400 text-gray-600">
                          IPv4: {extractIP(item.ip)}
                          </div>
                        </div>
                        <div className="mt-1.5 text-xs text-foreground/70">
                          {item.user_agent}
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

export default ModalBoxLogsMahasiswa;
