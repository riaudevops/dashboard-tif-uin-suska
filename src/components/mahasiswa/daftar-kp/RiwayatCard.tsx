import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";

interface props {
  status: string;
  tanggalMulai: string;
  namaInstansi: string;
  setIdLog: () => void;
  setIsPenolakanInstansiModalOpen?: () => void | null;
  setIsDetailModalOpen?: () => void | null;
  count?: number;
}

export default function RiwayatCard({
  status,
  tanggalMulai,
  namaInstansi,
  setIdLog,
  setIsPenolakanInstansiModalOpen,
  setIsDetailModalOpen,
  count = 1,
}: props) {
  return (
    <div className="border-[1px] dark:bg-black border-green-600 bg-green-100 rounded-lg p-3 mb-2">
      <div className="flex justify-between">
        <div className="flex justify-start gap-8">
          <div className="flex items-center gap-1 text-xs font-bold">
            <ClipboardList /> Status KP : {status}
          </div>
          <div className="flex items-center gap-1 text-xs font-bold">
            <ClipboardList /> {namaInstansi}
          </div>
          <div className="flex items-center gap-1 text-xs font-bold">
            <ClipboardList /> {tanggalMulai}
          </div>
        </div>
        <p className="text-xs">Progress Terkini : Pendaftaran KP</p>
      </div>
      <div className="flex justify-between items-center mt-2">
        <h2 className="font-bold text-lg">Kerja praktik #{count}</h2>
        <div className="flex gap-2">
          {setIsDetailModalOpen && setIsPenolakanInstansiModalOpen && (
            <>
              <Button
                onClick={setIsPenolakanInstansiModalOpen}
                className="flex flex-between text-white py-2 px-4 rounded-lg bg-green-600"
              >
                Ajukan Penolakan Instansi {"  >"}
              </Button>
              <Button
                onClick={setIsDetailModalOpen}
                className="flex flex-between text-white py-2 px-4 rounded-lg bg-green-600"
              >
                Lihat Detail {"  >"}
              </Button>
            </>
          )}
          <Button
            onClick={setIdLog}
            className="flex flex-between text-white py-2 px-4 rounded-lg bg-green-600"
          >
            Lihat Log {"  >"}
          </Button>
        </div>
      </div>
    </div>
  );
}
