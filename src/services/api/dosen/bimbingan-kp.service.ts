import { api } from "@/lib/axios-instance";

export default class APIKerjaPraktik {
  public static async getMahasiswaBimbinganSaya() {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/dosen-pembimbing/mahasiswa-saya`
    );
    return response.data;
  }

  public static async getDetailMahasiswaBimbinganSaya(id: string) {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/dosen-pembimbing/mahasiswa/${id}`
    );
    return response.data;
  }

  public static async postBimbingan(
    id: string,
    data: { catatan_bimbingan: string; nim: string }
  ) {
    const axios = api();
    const request = await axios.post(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/dosen-pembimbing/bimbingan-mahasiswa/${id}`,
      data
    );
    return request.data;
  }

  public static async postNilai(
    id: string,
    data: {
      penyelesaian_masalah: number;
      bimbingan_sikap: number;
      kualitas_laporan: number;
      catatan: string;
    }
  ) {
    const axios = api();
    const request = await axios.post(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/dosen-pembimbing/nilai-mahasiswa/${id}`,
      data
    );
    return request.data;
  }

  public static async putNilai(
    id: string,
    data: {
      penyelesaian_masalah: number;
      bimbingan_sikap: number;
      kualitas_laporan: number;
      catatan: string;
    }
  ) {
    const axios = api();
    const request = await axios.put(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/dosen-pembimbing/nilai-mahasiswa/${id}`,
      data
    );
    return request.data;
  }
}
