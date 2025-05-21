import { api } from "@/lib/axios-instance";

export default class APIKerjaPraktik {
  public static async getBimbinganSaya() {
    const axios = api();
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK}/mahasiswa/bimbingan-saya`
    );
    return response.data;
  }
}
