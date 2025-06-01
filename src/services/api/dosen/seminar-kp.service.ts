import { api } from "@/lib/axios-instance";

export default class APISeminarKP {
  public static async getDataMahasiswaDiuji(tahun_ajaran_id?: number) {
    const axios = api();
    const url = tahun_ajaran_id
      ? `${
          import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
        }/seminar-kp/jadwal-saya?tahun_ajaran_id=${tahun_ajaran_id}`
      : `${import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK}/seminar-kp/jadwal-saya`;
    const response = await axios.get(url);
    const data = response.data;
    return data;
  }

  public static async getTahunAjaran() {
    const axios = api();
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK}/seminar-kp/tahun-ajaran`
    );
    const data = response.data;
    return data;
  }

  public static async createUpdateNilaiPenguji({
    nilaiId,
    penguasaanKeilmuan,
    kemampuanPresentasi,
    kesesuaianUrgensi,
    catatan,
    nim,
    idJadwalSeminar,
  }: {
    nilaiId: string;
    penguasaanKeilmuan: number;
    kemampuanPresentasi: number;
    kesesuaianUrgensi: number;
    catatan: string;
    nim: string;
    idJadwalSeminar: string;
  }) {
    const axios = api();
    const request = await axios.post(
      `${import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK}/seminar-kp/nilai/penguji`,
      {
        nilaiId,
        penguasaanKeilmuan,
        kemampuanPresentasi,
        kesesuaianUrgensi,
        catatan,
        nim,
        idJadwalSeminar,
      }
    );
    return request.data;
  }
}
