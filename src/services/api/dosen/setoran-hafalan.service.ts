import { DataSetoran } from "@/interfaces/service/api/setoran-hafalan/dosen-service.inteface";
import { api } from "@/lib/axios-instance";

export default class APISetoran {
  public static async getDataMyMahasiswa() {
    const axios = api();
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_SETORAN_HAFALAN}/dosen/pa-saya`
    );
    const data = response.data;
    return data;
  }
  public static async getDataMahasiswaByEmail(nim: string) {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_SETORAN_HAFALAN
      }/mahasiswa/setoran/${nim}`
    );
    const data = response.data;
    return data;
  }
  public static async postSetoranSurah({
    nim,
    data_setoran,
    tgl_setoran,
  }: {
    nim: string;
    data_setoran: DataSetoran[];
    tgl_setoran: string;
  }) {
    const axios = api();
    const request = await axios.post(
      `${
        import.meta.env.VITE_BASE_URL_SETORAN_HAFALAN
      }/mahasiswa/setoran/${nim}`,
      {
        data_setoran,
        tgl_setoran,
      }
    );
    return request.data;
  }
  public static async pembatalanSetoranSurah({
    nim,
    data_setoran,
  }: {
    nim: string;
    data_setoran: DataSetoran[];
  }) {
    const axios = api();
    const request = await axios.delete(
      `${
        import.meta.env.VITE_BASE_URL_SETORAN_HAFALAN
      }/mahasiswa/setoran/${nim}`,
      {
        data: {
          data_setoran,
        },
      }
    );
    return request.data;
  }
}
