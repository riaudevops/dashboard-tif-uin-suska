interface DosenProps {
  nip: string;
  nama: string;
  email: string;
}
export interface DataLogsProps {
  id: number;
  keterangan: string;
  aksi: string;
  ip: string;
  user_agent: string;
  timestamp: string;
  nim: string;
  dosen_yang_mengesahkan: DosenProps;
}
