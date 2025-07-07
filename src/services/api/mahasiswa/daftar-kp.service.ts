import { api } from "@/lib/axios-instance";
import {
  CreatePendaftaranMahasiswaInterface,
  UpdatePendaftaranMahasiswaInterface,
} from "@/interfaces/pages/mahasiswa/kerja-praktik/daftar-kp/pendaftaran.interface";
import {
  CommonResponse,
  DataDosenInterface,
  GetTahunAjaranService,
  TanggalPendaftaranKPInterface,
} from "@/interfaces/service/api/daftar-kp/all.interface";
import {
  PembimbingInstansiInterface,
  unggahBerkasPendafataranKPInterface,
} from "@/interfaces/service/api/daftar-kp/mahasiswa-service.interface";

export default class APIDaftarKP {
  static async updatePendaftaranMahasiswa({
    judul_kp,
    kelas_kp,
  }: UpdatePendaftaranMahasiswaInterface) {
    const axios = api();
    const response = await axios.patch(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/mahasiswa/daftar-kp/pendaftaran-kp`,
      {
        judul_kp,
        kelas_kp,
      }
    );
    const data = response.data;
    return data;
  }

  static async getPembimbingInstansi(): Promise<
    CommonResponse & { data: PembimbingInstansiInterface[] }
  > {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/mahasiswa/daftar-kp/pembimbing-instansi`
    );
    const data = response.data;
    return data;
  }

  static async createPembimbingInstansi({
    nama,
    no_hp,
    email_pembimbing_instansi,
    jabatan,
  }: PembimbingInstansiInterface) {
    const axios = api();
    const response = await axios.post(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/mahasiswa/daftar-kp/pembimbing-instansi`,
      {
        nama,
        no_hp,
        email_pembimbing_instansi,
        jabatan,
      }
    );
    const data = response.data;
    return data;
  }

  static async createPendaftaranMahasiswa({
    tanggalMulai,
    tujuanSuratInstansi,
    idInstansi,
    judul_kp,
    kelas_kp,
  }: CreatePendaftaranMahasiswaInterface) {
    const axios = api();
    const response = await axios.post(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/mahasiswa/daftar-kp/pendaftaran-kp`,
      {
        tanggalMulai,
        tujuanSuratInstansi,
        idInstansi,
        judul_kp,
        kelas_kp,
      }
    );
    const data = response.data;
    return data;
  }

  static async unggahBerkasPendafataranKP({
    nomorBerkas,
    data,
    tanggalMulai,
    tanggalSelesai,
    email_pembimbing_instansi,
  }: unggahBerkasPendafataranKPInterface): Promise<CommonResponse> {
    const axios = api();
    const response = await axios.patch(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/mahasiswa/daftar-kp/berkas-daftar-kp`,
      {
        nomorBerkas: parseInt(nomorBerkas as unknown as string),
        data,
        tanggalMulai: new Date(tanggalMulai as unknown as string),
        tanggalSelesai: new Date(tanggalSelesai as unknown as string),
        email_pembimbing_instansi,
      }
    );

    const result = response.data;
    return result;
  }

  static async postDataInstansi({
    objectFormData,
    position,
    radius,
  }: {
    objectFormData: any;
    position: any;
    radius: any;
  }) {
    const axios = api();
    const response = await axios.post(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/mahasiswa/daftar-kp/pendaftaran-instansi`,
      {
        namaInstansi: objectFormData.namaInstansi,
        alamatInstansi: objectFormData.alamatInstansi,
        jenisInstansi: objectFormData.jenisInstansi,
        namaPenanggungJawabInstansi: objectFormData.namaPenanggungJawabInstansi,
        telpPenanggungJawabInstansi: objectFormData.telpPenanggungJawabInstansi,
        profilInstansi: objectFormData.profilInstansi,
        longitude: position.lng,
        latitude: position.lat,
        radius,
        profilSingkat: objectFormData.profilSingkat,
      }
    );
    const data = response.data;
    return data;
  }

  static async getLOGMahasiswa(idLOG: string) {
    const axios = api();
    if (idLOG !== undefined && idLOG !== null && idLOG !== "") {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
        }/mahasiswa/daftar-kp/log/${idLOG}`
      );
      const data = response.data;
      return data;
    }
  }

  static async getRiwayatKP() {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/mahasiswa/daftar-kp/riwayat-pendaftaran-kp`
    );
    const data = response.data;
    return data;
  }

  static async getTanggalDaftarKP(): Promise<TanggalPendaftaranKPInterface> {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/daftar-kp/tanggal-daftar-kp`
    );
    const data = response.data;
    return data;
  }

  static async getDataDosen(): Promise<
    CommonResponse & { data: DataDosenInterface[] }
  > {
    const axios = api();
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK}/daftar-kp/data-dosen`
    );
    const data = response.data;
    return data;
  }

  public static async getKPAktifMahasiswa() {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/mahasiswa/daftar-kp/kp-saya`
    );
    const data = response.data;
    return data;
  }
  public static async getDataInstansiAktif() {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/mahasiswa/daftar-kp/data-instansi`
    );
    const data = response.data;
    return data;
  }
  public static async getTahunAjaran(): Promise<GetTahunAjaranService> {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/daftar-kp/get-tahun-ajaran`
    );
    const data = response.data;
    return data;
  }
}
