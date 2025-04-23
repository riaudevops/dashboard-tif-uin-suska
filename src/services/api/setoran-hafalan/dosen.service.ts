import { api } from "@/lib/axios-instance";
import { DataSetoran } from "@/interfaces/service/api/setoran-hafalan/dosen-service.inteface";

const getDataMyMahasiswa = async () => {
  const axios = api();
  const response = await axios.get(`${import.meta.env.VITE_BASE_URL_SETORAN_HAFALAN}/dosen/pa-saya`);
  const data = response.data;
  return data;
};

const getDataMahasiswaByEmail = async (nim: string) => {
  const axios = api();
  const response = await axios.get(`${import.meta.env.VITE_BASE_URL_SETORAN_HAFALAN}/mahasiswa/setoran/${nim}`);
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
  const request = await axios.post(`${import.meta.env.VITE_BASE_URL_SETORAN_HAFALAN}/mahasiswa/setoran/${nim}`, {
     data_setoran, tgl_setoran,
  });
  return request.data;
};

const pembatalanSetoranSurah = async ({
  nim,
  data_setoran,
}: {
  nim: string;
  data_setoran: DataSetoran[];
}) => {
  const axios = api();
  const request = await axios.delete(`${import.meta.env.VITE_BASE_URL_SETORAN_HAFALAN}/mahasiswa/setoran/${nim}`, {
    data: {
      data_setoran
    }
  });
  return request.data;
};

export default {
  getDataMyMahasiswa,
  getDataMahasiswaByEmail,
  postSetoranSurah,
  pembatalanSetoranSurah,
};
