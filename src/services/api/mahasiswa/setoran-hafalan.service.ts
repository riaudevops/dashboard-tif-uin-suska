import { api } from "@/lib/axios-instance";

export default class APISetoran {
  public static async getDataMysetoran() {
    const axios = api();
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_SETORAN_HAFALAN}/mahasiswa/setoran-saya`
    );
    const data = response.data;
    return data;
  }

  public static async getKartuMurojaahSaya() {
    const axios = api();
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_SETORAN_HAFALAN}/mahasiswa/kartu-murojaah-saya`,
      { responseType: "arraybuffer" }
    );
    return response;
  }
}
