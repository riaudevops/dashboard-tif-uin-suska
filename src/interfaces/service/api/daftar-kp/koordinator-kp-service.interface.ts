export interface PutMahasiswaParamsInterface {
  id?: string;
  status?: "Gagal" | "Baru" | "Lanjut" | "Pilih Status" | null;
  tanggal_selesai?: Date;
  kelas_kp?: string;
  tujuan_surat_instansi?: string;
  link_surat_penolakan_instansi?: string;
  link_surat_pengantar?: string;
  link_surat_balasan?: string;
  link_surat_penunjukkan_dospem?: string;
  link_surat_perpanjangan_kp?: string;
  id_surat_pengajuan_dospem?: string;
  status_link_surat_penolakan_instansi?:
    | "Ditolak"
    | "Divalidasi"
    | "Terkirim"
    | "Pilih Status"
    | null;
  status_link_surat_pengantar?:
    | "Ditolak"
    | "Divalidasi"
    | "Terkirim"
    | "Pilih Status"
    | null;
  status_link_surat_balasan?:
    | "Ditolak"
    | "Divalidasi"
    | "Terkirim"
    | "Pilih Status"
    | null;
  status_link_surat_penunjukkan_dospem?:
    | "Ditolak"
    | "Divalidasi"
    | "Terkirim"
    | "Pilih Status"
    | null;
  status_link_surat_perpanjangan_kp?:
    | "Ditolak"
    | "Divalidasi"
    | "Terkirim"
    | "Pilih Status"
    | null;
  status_id_surat_pengajuan_dospem?:
    | "Ditolak"
    | "Divalidasi"
    | "Terkirim"
    | "Pilih Status"
    | null;
  catatan_link_surat_penolakan_instansi?: string;
  catatan_link_surat_pengantar?: string;
  catatan_link_surat_balasan?: string;
  catatan_link_surat_penunjukkan_dospem?: string;
  catatan_link_surat_perpanjangan_kp?: string;
  catatan_id_surat_pengajuan_dospem?: string;
  catatan_penolakan?: string;
  level_akses?: number | null;
  judul_kp?: string;
  alasan_lanjut_kp?: string;
  id_instansi?: string;
}

export interface CommonResponse {
  response: boolean;
  message: string;
}
