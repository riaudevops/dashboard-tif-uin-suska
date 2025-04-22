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
  nomor: number;
  nama: string;
  label: string;
  sudah_setor: boolean;
  info_setoran: Setoran;
}
export interface CheckedData {
  nama_surah: string;
  nomor_surah: number;
  id?: string;
}
