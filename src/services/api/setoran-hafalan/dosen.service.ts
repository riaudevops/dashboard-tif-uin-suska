import { api } from "@/lib/axios-instance";
const getDataMyMahasiswa = async () => {
  const axios = api();
  const response = await axios.get(`/dosen/pa-saya`);
  const data = response.data;
  return data;
};

const getDataMahasiswaByEmail = async (email: string) => {
  const axios = api();
  const response = await axios.get(`/mahasiswa/setoran/${email}`);
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
  const request = await axios.post(`/dosen/setor`, {
    nim,
    email_dosen_pa,
    nomor_surah,
    tgl_setoran,
  });
  return request.data;
};


const pembatalanSetoranSurah = async ({id }: {id: string}) => {
  const axios = api();
  const request =await axios.delete(`/dosen/setor/${id}`);
  return request.data
};
export default {
  getDataMyMahasiswa,
  getDataMahasiswaByEmail,
  postSetoranSurah,
  pembatalanSetoranSurah,
};
