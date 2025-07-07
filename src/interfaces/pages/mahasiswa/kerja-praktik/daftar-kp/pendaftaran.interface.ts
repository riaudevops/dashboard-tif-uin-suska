export interface CreatePendaftaranMahasiswaInterface {
  tanggalMulai: string;
  tujuanSuratInstansi: string;
  idInstansi: string;
  kelas_kp?: string;
  judul_kp?: string;
}

export interface UpdatePendaftaranMahasiswaInterface {
  tanggalMulai?: string;
  tujuanSuratInstansi?: string;
  idInstansi?: string;
  kelas_kp?: string;
  judul_kp?: string;
}

export interface tanggalKPInterface {
  tanggal_mulai_pendaftaran_kp?: Date;
  tanggal_akhir_pendaftaran_kp?: Date;
  tanggal_mulai_pendaftaran_kp_lanjut?: Date;
  tanggal_akhir_pendaftaran_kp_lanjut?: Date;
}
