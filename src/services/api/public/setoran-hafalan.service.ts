import { api } from "@/lib/axios-instance";

export default class APISetoran {
  public static async getKartuMurojaahDigital({id}: { id: string }) {
    const axios = api();
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_PUBLIC_SETORAN_HAFALAN}/hanz/kartu-murojaah-digital/${id}`,
    );
    const data = response.data;
    return data;
  }

  public static async getKartuRekapanMurojaahPADigital({id}: { id: string }) {
    const axios = api();
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_PUBLIC_SETORAN_HAFALAN}/hanz/kartu-rekapan-murojaah-pa-digital/${id}`,
    );
    const data = response.data;
    return data;
  }
}
