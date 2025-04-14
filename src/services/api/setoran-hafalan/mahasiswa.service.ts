import { api } from "@/lib/axios-instance";

const getDataMysetoran = async () => {
    const axios = api();
    const response = await axios.get(`mahasiswa/setoran-saya`)
    const data = response.data;
    return data
}



export default { getDataMysetoran }