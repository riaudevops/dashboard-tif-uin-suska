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
export interface ModalBoxValidasiProps {
  openDialog: boolean;
  buttonLoading: boolean;
  onClose: (bool: boolean) => void;
  validasiSetoran: (dateSetoran: string) => void;
  info: infoMahasiswa;
  nama_komponen_setoran?: string;
}
