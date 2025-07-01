export interface CommonResponse {
  response: boolean;
  message: string;
}

export interface GetTahunAjaranService extends CommonResponse {
  data: { id: number; nama?: string | null; created_at: Date }[];
}

export interface TanggalPendaftaranKPInterface {
  data: any;
  tanggal_mulai_pendaftaran_kp?: Date | null;
  tanggal_akhir_pendaftaran_kp?: Date | null;
  tanggal_mulai_pendaftaran_kp_lanjut?: Date | null;
  tanggal_akhir_pendaftaran_kp_lanjut?: Date | null;
}

export interface DataDosenInterface {
  nip: string;
  nama: string;
}
