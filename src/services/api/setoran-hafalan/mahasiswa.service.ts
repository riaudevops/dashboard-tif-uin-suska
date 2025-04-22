import { api } from "@/lib/axios-instance";

const getDataMysetoran = async () => {
    const axios = api();
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL_SETORAN_HAFALAN}/mahasiswa/setoran-saya`)
    const data = response.data;
    return data
}



export default { getDataMysetoran }