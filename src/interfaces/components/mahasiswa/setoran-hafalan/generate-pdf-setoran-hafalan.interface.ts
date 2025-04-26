interface Setoran {
  id: string;
  tgl_setoran: string;
  tgl_validasi: string;
  dosen_yang_mengesahkan: {
    nama: string;
  };
}

interface SurahData {
  id: string;
  nama: string;
  label: string;
  sudah_setor: boolean;
  info_setoran: Setoran;
}
export interface PDFGeneratorProps {
  nama: string;
  nim: string;
  dataSurah: SurahData[];
  dosen_pa: string;
  nip_dosen: string;
}
