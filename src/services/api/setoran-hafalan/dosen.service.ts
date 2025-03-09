import { api } from "@/lib/axios-instance";

const getDataMyMahasiswa = async () => {
  const axios = api();
  const response = await axios.get(`imemoraise/v1/dosen/pa-saya`);
  const data = response.data;
  return data;
};

const getDataMahasiswaByEmail = async (email: string) => {
  const axios = api();
  const response = await axios.get(`imemoraise/v1/mahasiswa/setoran/${email}`);
  const data = response.data;
  return data;
};

const postSetoranSurah = async ({
  nim,
  email_dosen_pa,
  nomor_surah,
  tgl_setoran,
}: {
  nim: string;
  email_dosen_pa: string;
  nomor_surah: number;
  tgl_setoran: string;
}) => {
  const axios = api();
  const request = await axios.post(`imemoraise/v1/dosen/setor`, {
    nim,
    email_dosen_pa,
    nomor_surah,
    tgl_setoran,
  });
  return request.data;
};

const pembatalanSetoranSurah = async ({id }: {id: string}) => {
  const axios = api();
  const request =await axios.delete(`imemoraise/v1/dosen/setor/${id}`);
  return request.data
};

export default {
  getDataMyMahasiswa,
  getDataMahasiswaByEmail,
  postSetoranSurah,
  pembatalanSetoranSurah,
};