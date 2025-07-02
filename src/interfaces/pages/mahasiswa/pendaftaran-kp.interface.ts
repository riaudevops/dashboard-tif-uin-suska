export interface KPDetailsInterface {
  id: string;
  status: string;
  tujuan_surat_instansi: string;
  tanggal_mulai: string;
  tanggal_selesai?: string;
  level_akses: number;
  judul_kp?: string;
  kelas_kp?: string;
  dokumen_pendaftaran_kp: {
    idKriteria: number;
    status: "Terkirim" | "Divalidasi" | "Ditolak";
    message: string;
    data: string;
  }[];
  catatan_penolakan?: string | null;
  alasan_lanjut_kp?: string;
  mahasiswa: {
    nim: string;
    nama: string;
    no_hp: string;
    email: string;
  };
  instansi?: {
    id: string;
    nama: string;
    pembimbing_instansi: {
      nama: string;
    }[];
  } | null;
  dosen_pembimbing?: {
    nama: string;
  } | null;
}

export interface KPInterface {
  id: string;
  tanggal_mulai: string;
  status: string;
  id_tahun_ajaran: number;
  mahasiswa: {
    nim: string;
    nama: string;
  };
}