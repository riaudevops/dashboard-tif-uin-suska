import { KPDetailsInterface } from "@/interfaces/pages/mahasiswa/pendaftaran-kp.interface";
import {
  DataDosenInterface,
  GetTahunAjaranService,
  TanggalPendaftaranKPInterface,
} from "@/interfaces/service/api/daftar-kp/all.interface";
import {
  AccTolakBerkasMahasiswaInterface,
  CommonResponse,
  PutMahasiswaParamsInterface,
  UbahTanggalPendaftaranKPInterface,
  DataInstansiInterface,
  StatistikMahasiswaInterface,
  ACCTolakInstansiPropsInterface,
} from "@/interfaces/service/api/daftar-kp/koordinator-kp-service.interface";
import { api } from "@/lib/axios-instance";

export default class APIDaftarKP {
  // Mahasiswa

  static async getAllPermohonanMahasiswa() {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/koordinator-kp/daftar-kp/get-data-kp`
    );
    const data = response.data;
    return data;
  }

  static async getDataKPMahasiswa(
    id: string | null | undefined
  ): Promise<{ message: string; response: string; data: KPDetailsInterface }> {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/koordinator-kp/daftar-kp/get-data-kp/${id}`
    );
    const data = response.data;
    return data;
  }

  public static async editDataMahasiswa(
    dataBaru: PutMahasiswaParamsInterface
  ): Promise<CommonResponse> {
    const axios = api();
    const response = await axios.put(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/koordinator-kp/daftar-kp/berkas-mahasiswa/${dataBaru.id}`,
      dataBaru
    );
    const data = response.data;
    return data;
  }

  static async accTolakBerkasMahasiswa({
    id,
    nomorBerkas,
    status,
    catatan,
    nipDospem,
  }: AccTolakBerkasMahasiswaInterface) {
    const axios = api();
    const response = await axios.patch(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/koordinator-kp/daftar-kp/berkas-mahasiswa/${id}`,
      {
        nomorBerkas,
        status,
        catatan,
        nipDospem,
      }
    );
    const data = response.data;
    return data;
  }

  static async getStatistikPendaftaran(): Promise<StatistikMahasiswaInterface> {
    const axios = api();

    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/koordinator-kp/daftar-kp/statistik-pendaftaran`
    );

    const data = response.data;

    return data;
  }

  // Instansi

  public static async getAllDataInstansi() {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/koordinator-kp/daftar-kp/instansi`
    );
    const data = response.data;
    return data;
  }

  public static async getDetailDataInstansi(
    id: string
  ): Promise<CommonResponse & { data: DataInstansiInterface }> {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/koordinator-kp/daftar-kp/instansi/${id}`
    );
    const data = response.data;
    return data;
  }

  public static async postInstansi(
    dataInstansi: DataInstansiInterface
  ): Promise<CommonResponse> {
    const axios = api();

    const response = await axios.post(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/koordinator-kp/daftar-kp/instansi`,
      {
        nama: dataInstansi.nama,
        alamat: dataInstansi.alamat,
        jenis: dataInstansi.jenis,
        nama_pj: dataInstansi.nama_pj,
        no_hp_pj: dataInstansi.no_hp_pj,
        status: dataInstansi.status,
        longitude: dataInstansi.longitude,
        latitude: dataInstansi.latitude,
        radius: dataInstansi.radius,
        profil_singkat: dataInstansi.profil_singkat,
      }
    );

    const data = response.data;

    return data;
  }

  public static async accTolakInstansi({
    id,
    status,
  }: ACCTolakInstansiPropsInterface): Promise<CommonResponse> {
    const axios = api();

    const response = await axios.patch(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/koordinator-kp/daftar-kp/instansi/${id}`,
      {
        status,
      }
    );

    const data = response.data;
    return data;
  }

  public static async editDataInstansi(
    dataInstansi: DataInstansiInterface
  ): Promise<CommonResponse> {
    const axios = api();
    const response = await axios.put(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/koordinator-kp/daftar-kp/instansi/${dataInstansi.id}`,
      {
        status: dataInstansi.status,
        profil_singkat: dataInstansi.profil_singkat,
        nama: dataInstansi.nama,
        jenis: dataInstansi.jenis,
        nama_pj: dataInstansi.nama_pj,
        no_hp_pj: dataInstansi.no_hp_pj,
        alamat: dataInstansi.alamat,
        longitude: dataInstansi.longitude,
        latitude: dataInstansi.latitude,
        radius: dataInstansi.radius,
      }
    );
    const data = response.data;
    return data;
  }

  public static async deleteDataInstansi(id: string) {
    const axios = api();
    const response = await axios.delete(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/koordinator-kp/daftar-kp/instansi/${id}`
    );
    const data = response.data;
    return data;
  }

  // Tanggal

  static async ubahTanggalPendaftaranKP({
    tanggalMulai,
    tanggalTerakhir,
    type,
  }: UbahTanggalPendaftaranKPInterface): Promise<CommonResponse> {
    const axios = api();
    const response = await axios.patch(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/koordinator-kp/daftar-kp/tanggal-daftar-kp`,
      {
        tanggalMulai,
        tanggalTerakhir,
        type,
      }
    );
    const data = response.data;
    return data;
  }

  // Umum

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
