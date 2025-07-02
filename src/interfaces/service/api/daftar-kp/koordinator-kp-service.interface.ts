export interface PutMahasiswaParamsInterface {
  id?: string;
  status?: "Gagal" | "Baru" | "Lanjut" | "Pilih Status" | null;
  tanggal_selesai?: Date;
  kelas_kp?: string;
  nipDospem?: string | null;
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
  data: any;
  response: boolean;
  message: string;
}

export interface AccTolakBerkasMahasiswaInterface {
  id: string;
  nomorBerkas: number;
  status: "Divalidasi" | "Ditolak";
  catatan?: string;
  nipDospem?: string | null;
}

export interface UbahTanggalPendaftaranKPInterface {
  tanggalMulai: string;
  tanggalTerakhir: string;
  type: "Regular" | "Lanjut";
}

export interface DataInstansiInterface {
  id?: string | null;
  status: "Aktif" | "Pending" | "Tidak_Aktif";
  profil_singkat?: string | null;
  nama: string;
  jenis: "Pemerintahan" | "Swasta" | "Pendidikan" | "UMKM";
  nama_pj: string;
  no_hp_pj: string;
  alamat: string;
  longitude: number;
  latitude: number;
  radius: number;
}

export interface StatistikMahasiswaInterface extends CommonResponse {
  data: {
    pendaftaranTahunAjaran: { _count: number; id_tahun_ajaran: number }[];
    pendaftaranPerAngkatan: {
      [key: string]: number;
    };
  };
}

export interface ACCTolakInstansiPropsInterface {
  id: string;
  status: "Aktif";
}
