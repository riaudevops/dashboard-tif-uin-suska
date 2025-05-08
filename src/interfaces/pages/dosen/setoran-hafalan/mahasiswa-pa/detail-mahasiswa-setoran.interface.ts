interface Dosen {
  nama: string;
  nip: string;
  email: string;
}

interface Setoran {
  id: string;
  tgl_setoran: string;
  tgl_validasi: string;
  dosen_yang_mengesahkan: Dosen;
}
export interface MahasiswaSetoran {
  id: string;
  nama: string;
  nama_arab: string;
  external_id: string;
  label: string;
  sudah_setor: boolean;
  info_setoran: Setoran;
}
export interface CheckedData {
  nama_komponen_setoran: string;
  id_komponen_setoran: string;
  id?: string;
}