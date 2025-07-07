export interface unggahBerkasPendafataranKPInterface {
  nomorBerkas: number;
  data: string;
  tanggalMulai?: Date;
  tanggalSelesai?: Date;
  nipDospem?: string;
  email_pembimbing_instansi?: string;
}

export interface PembimbingInstansiInterface {
  jabatan: string;
  email_pembimbing_instansi: string;
  nama: string;
  no_hp: string;
}
