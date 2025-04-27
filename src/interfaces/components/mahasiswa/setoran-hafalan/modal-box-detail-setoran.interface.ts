export interface ModalBoxDetailSetoranProps {
    nama_komponen_setoran: string;
    tanggal_setoran: string;
    dosen_mengesahkan: string;
    sudah_setor: boolean;
    openDialog: boolean;
    setOpenDialog: (openDialog: boolean) => void;
  }