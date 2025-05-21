export interface KPDetailsInterface {
  id : string,
  status : string,
  tujuan_surat_instansi : string
  tanggal_mulai : string,
  tanggal_selesai : string,
  level_akses : number,
  link_surat_pengantar?: string | null
  link_surat_balasan?: string | null,
  link_surat_penunjukan_dospem?: string | null,
  link_surat_perpanjangan_kp?: string | null,
  id_surat_pengajuan_dospem?: string | null,
  catatan_penolakan? : string | null,
  alasan_lanjut_kp : string,
  mahasiswa: {
      nim: string,
      nama: string,
      no_hp: string,
      email: string
    },
  instansi? : {
    nama : string,
    pembimbing_instansi : {
      nama : string
    }
  } | null,
  dosen_pembimbing? : {
    nama : string
  } | null,
}

export interface KPInterface {
  id : string,
  tanggal_mulai : string,
  status : string,
  id_tahun_ajaran : number,
  mahasiswa : {
    nim : string,
    nama : string
  }
}