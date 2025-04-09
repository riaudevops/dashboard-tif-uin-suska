import { useEffect, useState } from "react";
interface Dosen {
  nama: string;
}

interface Setoran {
  id: string;
  tgl_setoran: string; // Bisa diubah ke Date jika ingin langsung digunakan sebagai objek Date
  tgl_validasi: string; // Bisa diubah ke Date jika diperlukan
  dosen: Dosen;
}

interface MahasiswaSetoran {
  nomor: number;
  nama: string;
  label: string;
  sudah_setor: boolean;
  setoran: Setoran[];
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
            item.nama.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, dataIntial, tabState]);

  return { dataCurrent, setTabState, tabState, setSearch };
}
