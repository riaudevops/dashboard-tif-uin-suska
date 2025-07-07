import { api } from "@/lib/axios-instance";

export default class APISeminarKP {
  public static async getDataMahasiswa(tahun_ajaran_id?: number) {
    const axios = api();
    const url = tahun_ajaran_id
      ? `${
          import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
        }/seminar-kp/dokumen?tahun_ajaran_id=${tahun_ajaran_id}`
      : `${import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK}/seminar-kp/dokumen`;
    const response = await axios.get(url);
    const data = response.data;
    return data;
  }

  public static async getTahunAjaran() {
    const axios = api();
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK}/seminar-kp/tahun-ajaran`
    );
    const data = response.data;
    return data;
  }

  public static async getDataMahasiswaByNIM(nim: string) {
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

  public static async getJadwalSeminar(tahun_ajaran_id?: number) {
    const axios = api();
    const url = tahun_ajaran_id
      ? `${
          import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
        }/seminar-kp/jadwal?tahun_ajaran_id=${tahun_ajaran_id}`
      : `${import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK}/seminar-kp/jadwal`;
    const response = await axios.get(url);
    const data = response.data;
    return data;
  }

  public static async getNilai(tahun_ajaran_id?: number) {
    const axios = api();
    const url = tahun_ajaran_id
      ? `${
          import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
        }/seminar-kp/nilai?tahun_ajaran_id=${tahun_ajaran_id}`
      : `${import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK}/seminar-kp/nilai`;
    const response = await axios.get(url);
    const data = response.data;
    return data;
  }

  public static async postJadwal({
    tanggal,
    waktu_mulai,
    waktu_selesai,
    nim,
    nama_ruangan,
    id_pendaftaran_kp,
    nip_penguji,
  }: {
    tanggal: string;
    waktu_mulai: string;
    waktu_selesai: string;
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
        waktu_selesai,
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

  public static async tambahRuangan({ nama }: { nama: string }) {
    const axios = api();
    const request = await axios.post(
      `${import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK}/seminar-kp/ruangan`,
      {
        nama,
      }
    );
    return request.data;
  }

  public static async hapusRuangan({ nama }: { nama: string }) {
    const axios = api();
    const request = await axios.delete(
      `${import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK}/seminar-kp/ruangan`,
      {
        data: { nama },
      }
    );
    return request.data;
  }

  public static async putJadwal({
    id,
    tanggal,
    waktu_mulai,
    waktu_selesai,
    nama_ruangan,
    nip_penguji,
  }: {
    id: string;
    tanggal?: string;
    waktu_mulai?: string;
    waktu_selesai?: string;
    nama_ruangan?: string;
    nip_penguji?: string;
  }) {
    const axios = api();
    const payload = {
      id,
      tanggal,
      waktu_mulai,
      waktu_selesai,
      nama_ruangan,
      nip_penguji,
    };

    // Jika tanggal diubah, pastikan waktu_mulai dan waktu_selesai juga dikirim
    if (tanggal !== undefined) {
      payload.waktu_mulai = waktu_mulai || undefined; // Hanya kirim jika ada
      payload.waktu_selesai = waktu_selesai || undefined; // Hanya kirim jika ada
    }

    const request = await axios.put(
      `${import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK}/seminar-kp/jadwal`,
      payload
    );
    return request.data;
  }

  public static async getLogJadwal() {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/seminar-kp/jadwal/log-jadwal`
    );
    const data = response.data;
    return data;
  }

  public static async validasiNilai({ idNilai }: { idNilai: string }) {
    const axios = api();
    const request = await axios.post(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/seminar-kp/nilai/validasi`,
      {
        idNilai,
      }
    );
    return request.data;
  }
}
