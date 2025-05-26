import { api } from "@/lib/axios-instance";

export default class APISeminarKP {
  public static async getDataMydokumen() {
    const axios = api();
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK}/seminar-kp/dokumen-saya`
    );
    const data = response.data;
    return data;
  }

  public static async postLinkDokumen({
    nim,
    link_path,
    id_pendaftaran_kp,
    url,
  }: {
    nim: string;
    link_path: string;
    id_pendaftaran_kp: string;
    url: string;
  }) {
    try {
      const axios = api();
      const fullUrl =
        url.startsWith("http") || url.startsWith("https")
          ? url
          : `${import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK}${url}`;
      const request = await axios.post(fullUrl, {
        nim,
        link_path,
        id_pendaftaran_kp,
      });
      return request.data;
    } catch (error) {
      console.error(`Error posting link dokumen to ${url}:`, error);
      throw error;
    }
  }

  // public static async postLinkDokumen({
  //   nim,
  //   link_path,
  //   id_pendaftaran_kp,
  //   url,
  // }: {
  //   nim: string;
  //   link_path: string;
  //   id_pendaftaran_kp: string;
  //   url: string;
  // }) {
  //   try {
  //     const axios = api();
  //     const request = await axios.post(url, {
  //       nim,
  //       link_path,
  //       id_pendaftaran_kp,
  //     });
  //     return request.data;
  //   } catch (error) {
  //     console.error(`Error posting link dokumen to ${url}:`, error);
  //     throw error;
  //   }
  // }
}
