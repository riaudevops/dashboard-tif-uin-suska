import { api } from "@/lib/axios-instance";

export default class APISetoran {
  public static async getKartuMurojaahDigital({id}: { id: string }) {
    const axios = api();
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_PUBLIC}/mahasiswa/kartu-murojaah-digital/${id}`,
    );
    const data = response.data;
    return data;
  }
}
