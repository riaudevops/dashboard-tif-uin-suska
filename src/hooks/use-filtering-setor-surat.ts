import { useEffect, useState } from "react";
interface Dosen {
  nama: string;
  nip: string;
  email: string;
}

interface Setoran {
  id: string;
  tgl_setoran: string;
  tgl_validasi: string;
  dosen_yang_mengesahkan: Dosen;
}
interface MahasiswaSetoran {
  id: string;
  nama: string;
  nama_arab: string;
  external_id: string;
  label: string;
  sudah_setor: boolean;
  info_setoran: Setoran;
}
export function useFilteringSetoranSurat(
  dataIntial: MahasiswaSetoran[],
  initialTab: string = "default"
) {
  const [dataCurrent, setDataCurrent] = useState<MahasiswaSetoran[]>([]);
  const [tabState, setTabState] = useState<string>(initialTab);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (tabState === "default") {
      setDataCurrent(dataIntial);
    } else if (tabState === "belum_setor") {
      setDataCurrent(dataIntial.filter((item) => item.sudah_setor === false));
    } else if (tabState === "sudah_setor") {
      setDataCurrent(dataIntial.filter((item) => item.sudah_setor === true));
    }
  }, [tabState, dataIntial]);

  useEffect(() => {
    if (search === "") {
      if (tabState === "default") {
        setDataCurrent(dataIntial);
      } else if (tabState === "belum_setor") {
        setDataCurrent(dataIntial.filter((item) => item.sudah_setor === false));
      } else if (tabState === "sudah_setor") {
        setDataCurrent(dataIntial.filter((item) => item.sudah_setor === true));
      }
    } else {
      setDataCurrent(
        dataIntial.filter(
          (item) =>
            (tabState === "default" ||
              (tabState === "belum_setor" && item.sudah_setor === false) ||
              (tabState === "sudah_setor" && item.sudah_setor === true)) &&
            normalizeText(item.nama).includes(normalizeText(search))
        )
      );
    }
  }, [search, dataIntial, tabState]);

  return { dataCurrent, setTabState, tabState, setSearch, search };
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
    .replace(/['\- ]/g, '')             // 2. Hapus apostrof, tanda hubung, dan spasi
    .replace(/a/g, '')                // 3. Ganti 'aa' menjadi 'a'
    .replace(/i/g, '')                // 4. Ganti 'ii' menjadi 'i'
    .replace(/u/g, '')
    .replace(/y/g, '')
    .replace(/ff/g, 'f')
    .replace(/h/g, '');               // 5. Ganti 'uu' menjadi 'u'
};