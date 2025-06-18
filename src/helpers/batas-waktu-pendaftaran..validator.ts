import { api } from "@/lib/axios-instance";

interface tanggalKPInterface {
  tanggal_mulai_pendaftaran_kp?: Date;
  tanggal_akhir_pendaftaran_kp?: Date;
  tanggal_mulai_pendaftaran_kp_lanjut?: Date;
  tanggal_akhir_pendaftaran_kp_lanjut?: Date;
}

export async function IsPendaftaranKPClosed(): Promise<boolean | null> {
  const axios = api();
  const response = await axios.get(
    `${
      import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
    }/koordinator-kp/daftar-kp/tanggal-daftar-kp`
  );

  const tanggalKP = response.data as tanggalKPInterface;
  if (!tanggalKP) {
    return true;
  }
  if (
    tanggalKP.tanggal_mulai_pendaftaran_kp === null ||
    tanggalKP.tanggal_mulai_pendaftaran_kp === undefined ||
    new Date(tanggalKP.tanggal_mulai_pendaftaran_kp).getTime() >
      new Date().getTime() ||
    tanggalKP.tanggal_akhir_pendaftaran_kp === null ||
    tanggalKP.tanggal_akhir_pendaftaran_kp === undefined ||
    new Date(tanggalKP.tanggal_akhir_pendaftaran_kp).getTime() -
      new Date().getTime() <=
      0
  ) {
    return true;
  }
  return false;
}

export function IsPendaftaranKPClosedSync(data: tanggalKPInterface): boolean {
  if (!data) {
    return true;
  }
  if (
    data.tanggal_mulai_pendaftaran_kp === null ||
    data.tanggal_mulai_pendaftaran_kp === undefined ||
    new Date(data.tanggal_mulai_pendaftaran_kp).getTime() >
      new Date().getTime() ||
    data.tanggal_akhir_pendaftaran_kp === null ||
    data.tanggal_akhir_pendaftaran_kp === undefined ||
    new Date(data.tanggal_akhir_pendaftaran_kp).getTime() -
      new Date().getTime() <=
      0
  ) {
    return true;
  }
  return false;
}

export function IsPendaftaranKPLanjutClosedSync(
  data: tanggalKPInterface
): boolean {
  if (!data) {
    return true;
  }
  if (
    data.tanggal_mulai_pendaftaran_kp_lanjut === null ||
    data.tanggal_mulai_pendaftaran_kp_lanjut === undefined ||
    new Date(data.tanggal_mulai_pendaftaran_kp_lanjut).getTime() >
      new Date().getTime() ||
    data.tanggal_akhir_pendaftaran_kp_lanjut === null ||
    data.tanggal_akhir_pendaftaran_kp_lanjut === undefined ||
    new Date(data.tanggal_akhir_pendaftaran_kp_lanjut).getTime() -
      new Date().getTime() <=
      0
  ) {
    return true;
  }
  return false;
}

export async function IsPendaftaranKPLanjutClosed(): Promise<boolean | null> {
  const axios = api();

  const response = await axios.get(
    `${
      import.meta.env.VITE_BASE_URL_KERJA_PRAKTIK
    }/koordinator-kp/daftar-kp/tanggal-daftar-kp-lanjut`
  );

  const tanggalKP = response.data.data;

  if (!tanggalKP) {
    return true;
  }

  if (
    tanggalKP.tanggal_mulai_pendaftaran_kp_lanjut === null ||
    tanggalKP.tanggal_mulai_pendaftaran_kp_lanjut === undefined ||
    new Date(tanggalKP.tanggal_mulai_pendaftaran_kp_lanjut).getTime() >
      new Date().getTime() ||
    tanggalKP.tanggal_akhir_pendaftaran_kp_lanjut === null ||
    tanggalKP.tanggal_akhir_pendaftaran_kp_lanjut === undefined ||
    new Date(tanggalKP.tanggal_akhir_pendaftaran_kp_lanjut).getTime() <
      new Date().getTime()
  ) {
    return true;
  }
  return false;
}
