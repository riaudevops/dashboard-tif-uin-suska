import { useState, useEffect } from "react";
interface InfoSetoran {
    total_wajib_setor: number;
    total_sudah_setor: number;
    total_belum_setor: number;
    persentase_progress_setor: number;
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
          (item.nama.toLowerCase().includes(search.toLowerCase()) ||
            item.nim.toLowerCase().includes(search.toLowerCase()))
      );
      setDataCurrent(data);
    }
  }, [search, tabState, dataMahasiswa]);

  return { dataCurrent, setSearch, setTabState, search, tabState };
}
