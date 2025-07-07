import { useState, useEffect } from "react";
interface InfoSetoran {
    total_wajib_setor: number;
    total_sudah_setor: number;
    total_belum_setor: number;
    persentase_progres_setor: number;
    terakhir_setor: string;
    tgl_terakhir_setor: string;
  }
  
  interface MahasiswaSetoran {
    email: string;
    nim: string;
    nama: string;
    angkatan: string;
    semester: number;
    info_setoran: InfoSetoran;
  }
export function useFilteredMahasiswa(
  dataMahasiswa: MahasiswaSetoran[],
  initialTab: string = "semua"
) {
  const [dataCurrent, setDataCurrent] = useState<MahasiswaSetoran[]>([]);
  const [search, setSearch] = useState<string>("");
  const [tabState, setTabState] = useState<string>(initialTab);

  useEffect(() => {
    if (tabState === "semua") {
      setDataCurrent(dataMahasiswa);
    } else {
      const data = dataMahasiswa.filter((item) => item.angkatan === tabState);
      setDataCurrent(data);
    }
  }, [tabState, dataMahasiswa]);

  useEffect(() => {
    if (search === "") {
      if (tabState === "semua") {
        setDataCurrent(dataMahasiswa);
      } else {
        const data = dataMahasiswa.filter((item) => item.angkatan === tabState);
        setDataCurrent(data);
      }
    } else {
      const data = dataMahasiswa.filter(
        (item) =>
          (tabState === "semua" || item.angkatan === tabState) &&
          (normalizeText(item.nama).includes(normalizeText(search)) ||
            normalizeText(item.nim).includes(normalizeText(search)))
      );
      setDataCurrent(data);
    }
  }, [search, tabState, dataMahasiswa]);

  return { dataCurrent, setSearch, setTabState, search, tabState };
}

/**
 * Membersihkan dan menyederhanakan string untuk perbandingan.
 * - Mengubah ke huruf kecil
 * - Menghapus spasi, tanda hubung (-), dan apostrof (')
 * - Mengganti huruf vokal ganda (aa, ii, uu) menjadi tunggal
 * @param str String yang akan dinormalisasi
 * @returns String yang sudah bersih
 */
const normalizeText = (str: string): string => {
  if (!str) return '';

  return str
    .toLowerCase()                      // 1. Ubah ke huruf kecil semua
    .replace(/['\- \.]/g, '')             // 2. Hapus apostrof, tanda hubung, dan spasi
    .replace(/a/g, '')                // 3. Ganti 'aa' menjadi 'a'
    .replace(/i/g, '')                // 4. Ganti 'ii' menjadi 'i'
    .replace(/u/g, '');               // 5. Ganti 'uu' menjadi 'u'
};