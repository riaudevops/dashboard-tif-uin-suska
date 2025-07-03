export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isWithinPeriod: boolean;
  hasEntry: boolean;
  entry: DailyReport | null;
  isStartDate?: boolean;
  isEndDate?: boolean;
}

interface PendaftaranKP {
  id: string;
  status: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  tahun_ajaran: {
    nama: string;
  };
}

interface PembimbingInstansi {
  id: string;
  nama: string;
  jabatan: string;
  status: string;
  instansi: Instansi;
}

interface Mahasiswa {
  nim: string;
  nama: string;
  pendaftaran_kp: PendaftaranKP[];
  daily_report?: DailyReport[];
}

export interface DailyReport {
  id: string;
  tanggal_presensi: string;
  hari_ke: number;
  status: string;
  catatan_evaluasi: string;
  detail_daily_report?: DetailDailyReport[];
}

export interface DetailDailyReport {
  id: string;
  waktu_mulai: string;
  waktu_selesai: string;
  judul_agenda: string;
  deskripsi_agenda: string;
}

interface Instansi {
  id: string;
  nama: string;
  alamat: string;
  profil_singkat: string;
  latitude: number;
  longitude: number;
}

interface DosenPembimbing {
  nip: string;
  nama: string;
}

interface TahunAjaran {
  nama: string;
}

export interface Bimbingan {
  id: string;
  tanggal_bimbingan: string;
  catatan_bimbingan: string;
  status: string;
}

export interface Nilai {
  id: string;
  nilai_instansi: number;
  nilai_pembimbing: number;
  komponen_penilaian_instansi?: KomponenPenilaianInstansi[];
  komponen_penilaian_pembimbing?: KomponenPenilaianPembimbing[];
}

export interface KomponenPenilaianInstansi {
  id: string;
  deliverables: number;
  ketepatan_waktu: number;
  kedisiplinan: number;
  attitude: number;
  kerjasama_tim: number;
  inisiatif: number;
  masukan: string;
}

export interface KomponenPenilaianPembimbing {
  id: string;
  penyelesaian_masalah: number;
  bimbingan_sikap: number;
  kualitas_laporan: number;
  catatan: string;
}

export interface DailyReportSayaResponse {
  data?: {
    id: string;
    status: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    judul_kp: string;
    kelas_kp: string;
    tahun_ajaran: TahunAjaran;
    mahasiswa: Mahasiswa;
    instansi: Instansi;
    pembimbing_instansi: PembimbingInstansi;
    dosen_pembimbing: DosenPembimbing;
    daily_report?: DailyReport[];
    nilai?: Nilai[];
  };
}

export interface DetailMahasiswaSayaResponse {
  id: string;
  status: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  judul_kp: string;
  kelas_kp: string;
  tahun_ajaran: TahunAjaran;
  mahasiswa: Mahasiswa;
  instansi: Instansi;
  pembimbing_instansi: PembimbingInstansi;
  dosen_pembimbing: DosenPembimbing;
  daily_report?: DailyReport[];
  bimbingan?: Bimbingan[];
  nilai?: Nilai[];
}

export interface MahasiswaSayaResponse {
  nim: string;
  nama: string;
  pendaftaran_kp: PendaftaranKP[];
  bimbingan?: Bimbingan[];
}

export interface MahasiswaDetailResponse {
  id: string;
  status: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  judul_kp: string;
  kelas_kp: string;
  tahun_ajaran: TahunAjaran;
  mahasiswa: Mahasiswa;
  instansi: Instansi;
  pembimbing_instansi: PembimbingInstansi;
  dosen_pembimbing: DosenPembimbing;
  daily_report?: DailyReport[];
  bimbingan?: Bimbingan[];
}

export interface MahasiswaInstansiSayaResponse {
  pembimbing_instansi: PembimbingInstansi;
  mahasiswa: Mahasiswa[];
}

export interface MahasiswaInstansiDetailResponse {
  id: string;
  status: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  mahasiswa: Mahasiswa;
  daily_report?: DailyReport[];
  nilai?: Nilai[];
}

export interface PutDailyReportData {
  catatan_evaluasi: string;
  status: "Disetujui" | "Revisi" | "Ditolak";
}

export interface EvaluationFormData {
  catatan_evaluasi: string;
  status: "Disetujui" | "Revisi" | "Ditolak";
}

export interface AssessmentFormData {
  deliverables: number;
  ketepatan_waktu: number;
  kedisiplinan: number;
  attitude: number;
  kerjasama_tim: number;
  inisiatif: number;
  masukan: string;
}

export interface DailyReportDetailResponse {
  id: string;
  status: string;
  tanggal_presensi: string;
  catatan_evaluasi: string;
  mahasiswa: Mahasiswa;
  detail_daily_report: DetailDailyReport[];
}
