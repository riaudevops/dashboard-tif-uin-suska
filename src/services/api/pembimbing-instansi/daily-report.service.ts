import { api } from "@/lib/axios-instance";

export default class APIKerjaPraktik {
  public static async putAktivasiAkun(id: string) {
    const axios = api();
    const request = await axios.put(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/pembimbing-instansi/aktivasi-akun/${id}`
    );
    return request.data;
  }

  public static async getMahasiswaInstansiSaya(id: string) {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/pembimbing-instansi/mahasiswa-saya/${id}`
    );
    return response.data;
  }

  public static async getDetailMahasiswaInstansiSaya(id: string) {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/pembimbing-instansi/mahasiswa/${id}`
    );
    return response.data;
  }

  public static async getDetailDailyReportMahasiswaInstansiSaya(id: string) {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/pembimbing-instansi/detail-daily-report-mahasiswa/${id}`
    );
    return response.data;
  }

  public static async putDailyReport(
    id_daily_report: string,
    data: {
      catatan_evaluasi: string;
      status: string;
    }
  ) {
    const axios = api();
    const request = await axios.put(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/pembimbing-instansi/daily-report-mahasiswa/${id_daily_report}`,
      data
    );

    return request.data;
  }

  public static async postNilai(
    id: string,
    data: {
      deliverables: number;
      ketepatan_waktu: number;
      kedisiplinan: number;
      attitude: number;
      kerjasama_tim: number;
      inisiatif: number;
      masukan: string;
    }
  ) {
    const axios = api();
    const request = await axios.post(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/pembimbing-instansi/nilai-mahasiswa/${id}`,
      data
    );
    return request.data;
  }

  public static async putNilai(
    id: string,
    data: {
      deliverables: number;
      ketepatan_waktu: number;
      kedisiplinan: number;
      attitude: number;
      kerjasama_tim: number;
      inisiatif: number;
      masukan: string;
    }
  ) {
    const axios = api();
    const request = await axios.put(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/pembimbing-instansi/nilai-mahasiswa/${id}`,
      data
    );
    return request.data;
  }
}
