import { api } from "@/lib/axios-instance";

export default class APIKerjaPraktik {
  public static async getAllMahasiswa() {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/koordinator-kp/semua-mahasiswa`
    );
    return response.data;
  }

  public static async getAllDetailMahasiswa(id: string) {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/koordinator-kp/mahasiswa/${id}`
    );
    return response.data;
  }
}
