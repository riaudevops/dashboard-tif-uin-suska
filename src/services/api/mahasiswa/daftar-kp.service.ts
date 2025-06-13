import { api } from "@/lib/axios-instance";
import { DataInstansi } from "@/interfaces/pages/koordinator-kp/kerja-praktik/instansi.interface";
import { CreatePendaftaranMahasiswaInterface } from "@/interfaces/pages/mahasiswa/kerja-praktik/daftar-kp/pendaftaran.interface";

export default class APIDaftarKP {
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

  static async createPendaftaranMahasiswa({
    tanggalMulai,
    tujuanSuratInstansi,
    idInstansi,
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
      }
    );
    const data = response.data;
    return data;
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
        emailPenanggungJawabInstansi:
          objectFormData.emailPenanggungJawabInstansi,
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

  static async getKPTerbaruMahasiswa() {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/mahasiswa/daftar-kp/kp-saya`
    );
    const data = response.data;
    return data;
  }

  static async getLOGMahasiswa(idLOG: string) {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/mahasiswa/daftar-kp/log/${idLOG}`
    );
    const data = response.data;
    return data;
  }

  static async getDataKPMahasiswa(id: string | null | undefined) {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/koordinator-kp/daftar-kp/get-data-kp/${id}`
    );
    const data = response.data;
    return data;
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

  static async postSuratPengantarKP(linkSuratPengantarKP: string) {
    const axios = api();
    const response = await axios.post(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/mahasiswa/daftar-kp/unggah-surat-pengantar-kp`,
      {
        linkSuratPengantarKP,
      }
    );
    const data = response.data;
    return data;
  }

  static async postACCBerkasMahasiswa({
    id,
    catatan,
  }: {
    id: string;
    catatan: string;
  }) {
    const axios = api();
    const response = await axios.post(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/koordinator-kp/daftar-kp/acc-berkas-mahasiswa`,
      {
        id,
        catatan,
      }
    );
    const data = response.data;
    return data;
  }

  static async postTolakBerkasMahasiswa({
    id,
    message,
  }: {
    id: string;
    message: string;
  }) {
    const axios = api();
    const response = await axios.post(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/koordinator-kp/daftar-kp/tolak-berkas-mahasiswa`,
      {
        id,
        message,
      }
    );
    const data = response.data;
    return data;
  }

  static async postSuratBalasanKP(linkSuratBalasanKP: string) {
    const axios = api();
    const response = await axios.post(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/mahasiswa/daftar-kp/unggah-surat-balasan-kp`,
      {
        linkSuratBalasanKP,
      }
    );
    const data = response.data;
    return data;
  }

  static async postIdPengajuanDospem(IdPengajuanDosenPembimbingKP: string) {
    const axios = api();
    const response = await axios.post(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/mahasiswa/daftar-kp/unggah-id-pengajuan-dosen-pembimbing-kp`,
      {
        IdPengajuanDosenPembimbingKP,
      }
    );
    const data = response.data;
    return data;
  }

  static async postSuratPenunjukkanDospemKP(
    linkSuratPenunjukkanDosenPembimbingKP: string
  ) {
    const axios = api();
    const response = await axios.post(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/mahasiswa/daftar-kp/unggah-surat-penunjukkan-dosen-pembimbing-kp`,
      {
        linkSuratPenunjukkanDosenPembimbingKP,
      }
    );
    const data = response.data;
    return data;
  }

  static async postSuratPerpanjanganKP(linkSuratPerpanjanganKP: string) {
    const axios = api();
    const response = await axios.post(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/mahasiswa/daftar-kp/unggah-surat-perpanjangan-kp`,
      {
        linkSuratPerpanjanganKP,
      }
    );
    const data = response.data;
    return data;
  }

  static async postSuratPenolakanInstansi(
    link_surat_penolakan_instansi: string
  ) {
    const axios = api();
    const response = await axios.post(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/mahasiswa/daftar-kp/unggah-surat-penolakan-instansi`,
      {
        link_surat_penolakan_instansi,
      }
    );
    const data = response.data;
    return data;
  }

  static async getTanggalDaftarKP() {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/daftar-kp/get-tanggal-daftar-kp`
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

  public static async getDetailDataInstansi(id: string) {
    const axios = api();
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/koordinator-kp/daftar-kp/instansi/${id}`
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

  public static async editDataInstansi(dataInstansi: DataInstansi) {
    const axios = api();
    const response = await axios.put(
      `${
        import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
      }/koordinator-kp/daftar-kp/instansi`,
      {
        id: dataInstansi.id,
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

  //   public static async getKartuMurojaahSaya() {
  //     const axios = api();
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_BASE_URL_SETORAN_HAFALAN}/mahasiswa/kartu-murojaah-saya`,
  //       { responseType: "arraybuffer" }
  //     );
  //     return response;
  //   }
}
