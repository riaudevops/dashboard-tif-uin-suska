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
export interface ModalBoxBatalkanProps {
  openDialog: boolean;
  buttonLoading: boolean;
  onClose: (bool: boolean) => void;
  deleteSetoran: () => void;
  info: infoMahasiswa;
  nama_komponen_setoran?: string;
}
