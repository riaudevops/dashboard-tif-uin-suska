import { api } from "@/lib/axios-instance";

export default class APISeminarKP {
  public static async getDataMahasiswaDiuji() {
    const axios = api();
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK}/seminar-kp/jadwal-saya`
    );
    const data = response.data;
    return data;
  }

  public static async getNilai() {
    const axios = api();
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK}/seminar-kp/nilai`
    );
    const data = response.data;
    return data;
  }

  public static async postNilaiPenguji({
    id,
    penguasaanKeilmuan,
    kemampuanPresentasi,
    kesesuaianUrgensi,
    catatan,
    nim,
    idJadwalSeminar,
  }: {
    id: string;
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
        id,
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
