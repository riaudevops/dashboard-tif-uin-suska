import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {ModalBoxDetailSetoranProps} from "@/interfaces/components/mahasiswa/setoran-hafalan/modal-box-detail-setoran.interface";
function ModalBoxDetailSetoran({
  openDialog,
  setOpenDialog,
  nama_komponen_setoran,
  tanggal_setoran,
  dosen_mengesahkan,
  sudah_setor,
}: ModalBoxDetailSetoranProps) {  return (
    <Dialog
      open={openDialog}
      onOpenChange={(open) => {
        setOpenDialog(open);
      }}
    >
      <DialogContent className="max-w-[25rem]">
        <DialogHeader>
          <DialogTitle className="text-center mb-4">
            Detail Riwayat Penyetoran Anda 📝
          </DialogTitle>

          {!sudah_setor ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="px-2 bg-muted py-1 text-center font-semibold">
                  Nama Surah
                </div>
                <div className="text-center">{nama_komponen_setoran}</div>
                <div className="justify-center items-center mt-4">
                  ❌ Anda{" "}
                  <span className="italic font-medium underline">
                    belum muroja'ah
                  </span>{" "}
                  surah tersebut.
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="px-2 bg-secondary py-1 text-center font-semibold">
                  Nama Surah
                </div>
                <div className="text-center">{nama_komponen_setoran}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="bg-secondary py-1 text-center font-semibold">
                  Tanggal Muroja'ah
                </div>
                <div className="py-1 text-center">{tanggal_setoran}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="bg-secondary py-1 text-center font-semibold">
                  Dosen yang Mengesahkan
                </div>
                <div className="text-center">{dosen_mengesahkan}</div>
              </div>
              <div className="md:text-center gap-1 mt-2 ">
                ✅ Anda telah <i><u><b>muroja'ah</b></u></i> surah tersebut.
              </div>
            </div>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ModalBoxDetailSetoran;
