import { api } from "@/lib/axios-instance";

export default class APIKerjaPraktik {
  public static async getDailyReportSaya() {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/mahasiswa/daily-report-saya`
    );
    return response.data;
  }

  public static async getDetailDailyReportSaya(id: string) {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/mahasiswa/daily-report-saya/${id}`
    );
    return response.data;
  }

  public static async postDailyReport(data: {
    latitude: number;
    longitude: number;
  }) {
    const axios = api();
    const request = await axios.post(
      `${import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK}/mahasiswa/presensi`,
      data
    );
    return request.data;
  }

  public static async postDetailDailyReport(
    id_daily_report: string,
    data: {
      waktu_mulai: string;
      waktu_selesai: string;
      judul_agenda: string;
      deskripsi_agenda: string;
    }
  ) {
    const axios = api();
    const request = await axios.post(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/mahasiswa/detail-daily-report/${id_daily_report}`,
      data
    );
    return request.data;
  }

  public static async putDetailDailyReport(
    id_detail_daily_report: number,
    data: {
      waktu_mulai: string;
      waktu_selesai: string;
      judul_agenda: string;
      deskripsi_agenda: string;
    }
  ) {
    const axios = api();
    const request = await axios.put(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/mahasiswa/detail-daily-report/${id_detail_daily_report}`,
      data
    );

    return request.data;
  }
}
