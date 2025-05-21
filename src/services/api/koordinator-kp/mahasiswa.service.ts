import { api } from "@/lib/axios-instance";

export default class APISeminarKP {
  public static async getDataMahasiswa() {
    const axios = api();
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK}/seminar-kp/dokumen`
    );
    const data = response.data;
    return data;
  }

  public static async getDataMahasiswaByEmail(nim: string) {
    const axios = api();
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK}/seminar-kp/dokumen/${nim}`
    );
    const data = response.data;
    return data;
  }

  public static async postValidasiDokumen({ id }: { id: string }) {
    const axios = api();
    const request = await axios.post(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/seminar-kp/dokumen/validasi`,
      {
        id,
      }
    );
    return request.data;
  }

  public static async postTolakDokumen({
    id,
    komentar,
  }: {
    id: string;
    komentar: string;
  }) {
    const axios = api();
    const request = await axios.post(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/seminar-kp/dokumen/ditolak`,
      {
        id,
        komentar,
      }
    );
    return request.data;
  }

  public static async getJadwalSeminar() {
    const axios = api();
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK}/seminar-kp/jadwal`
    );
    const data = response.data;
    return data;
  }

  public static async getNilai() {
    const axios = api();
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK}/seminar-kp/nilai`
    );
    const data = response.data;
    return data;
  }

  public static async postJadwal({
    tanggal,
    waktu_mulai,
    nim,
    nama_ruangan,
    id_pendaftaran_kp,
    nip_penguji,
  }: {
    tanggal: string;
    waktu_mulai: string;
    nim: string;
    nama_ruangan: string;
    id_pendaftaran_kp: string;
    nip_penguji: string;
  }) {
    const axios = api();
    const request = await axios.post(
      `${import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK}/seminar-kp/jadwal`,
      {
        tanggal,
        waktu_mulai,
        nim,
        nama_ruangan,
        id_pendaftaran_kp,
        nip_penguji,
      }
    );
    return request.data;
  }

  public static async getAllDosen() {
    const axios = api();
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK}/seminar-kp/dosen`
    );
    const data = response.data;
    return data;
  }

  public static async getAllRuangan() {
    const axios = api();
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK}/seminar-kp/ruangan`
    );
    const data = response.data;
    return data;
  }

  public static async putJadwal({
    id,
    tanggal,
    waktu_mulai,
    nama_ruangan,
    nip_penguji,
  }: {
    id: string;
    tanggal?: string;
    waktu_mulai?: string;
    nama_ruangan?: string;
    nip_penguji?: string;
  }) {
    const axios = api();
    const request = await axios.put(
      `${import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK}/seminar-kp/jadwal`,
      {
        id,
        tanggal,
        waktu_mulai,
        nama_ruangan,
        nip_penguji,
      }
    );
    return request.data;
  }
}
