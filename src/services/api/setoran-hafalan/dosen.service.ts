import { api } from "@/lib/axios-instance";

interface DataSetoran {
  nama_surah: string;
  nomor_surah: number;
}
const getDataMyMahasiswa = async () => {
  const axios = api();
  const response = await axios.get(`dosen/pa-saya`);
  const data = response.data;
  return data;
};

const getDataMahasiswaByEmail = async (email: string) => {
  const axios = api();
  const response = await axios.get(`mahasiswa/setoran/${email}`);
  const data = response.data;
  return data;
};

const postSetoranSurah = async ({
  nim,
  data_setoran,
  tgl_setoran,
}: {
  nim: string;
  data_setoran: DataSetoran[];
  tgl_setoran: string;
}) => {
  const axios = api();
  const request = await axios.post(`/dosen/setor`, {
    nim,
    data_setoran,
    tgl_setoran,
  });
  return request.data;
};

const pembatalanSetoranSurah = async ({id }: {id: string}) => {
  const axios = api();
  const request =await axios.delete(`dosen/setor/${id}`);
  return request.data
};

export default {
  getDataMyMahasiswa,
  getDataMahasiswaByEmail,
  postSetoranSurah,
  pembatalanSetoranSurah,
};