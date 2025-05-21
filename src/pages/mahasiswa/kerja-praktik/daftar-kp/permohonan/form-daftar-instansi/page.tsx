import { FormEvent, useState } from "react"
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";

interface CommonResponse {
    response : boolean,
    message : string
}

function MahasiswaKerjaPraktikDaftarKPPermohonanFormDaftarInstansiPage() {
    const [response, setResponse] = useState<CommonResponse | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function handleOnSubmit(e : FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(prev => !prev)
        const formData = new FormData(e.currentTarget);
        const objectFormData = Object.fromEntries(formData.entries());
        const url = "http://localhost:5000/daftar-kp/pendaftaran-instansi"
        const response = await fetch(url, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                namaInstansi : objectFormData.namaInstansi,
                alamatInstansi : objectFormData.alamatInstansi,
                jenisInstansi : objectFormData.jenisInstansi,
                emailPenanggungJawabInstansi : objectFormData.emailPenanggungJawabInstansi,
                namaPenanggungJawabInstansi : objectFormData.namaPenanggungJawabInstansi,
                telpPenanggungJawabInstansi : objectFormData.telpPenanggungJawabInstansi,
                profilInstansi : objectFormData.profilInstansi,
                longitude : parseFloat(objectFormData.longitude as string),
                latitude : parseFloat(objectFormData.latitude as string)
            })
        })
        if (!(response.ok)) {
            throw new Error("Terjadi kesalahan pada server")
        }
            const data = await response.json();
            setResponse(data)
            const pointer = setTimeout(() => {
                setResponse(null)
                clearTimeout(pointer)
            }, 1000)
        
        setIsLoading(prev => !prev)
    }

    return <DashboardLayout>
    <form onSubmit={handleOnSubmit} >
        {response && response.response && <div className="fixed left-1/2 py-2 -translate-x-1/2 rounded-lg w-80 bg-green-600 text-white">
        <p className="text-center text-white font-semibold tracking-wide">{response.message}</p>
        </div>}
        {response && !(response.response) && <div className="absolute left-1/2 -translate-x-1/2 rounded-lg w-80 py-2 bg-green-600">
        <p className="text-center text-white font-semibold tracking-wide">{response.message}</p>
        </div>}
        <h2 className="text-center font-bold text-2xl mb-6">Form Pengajuan Instansi Kerja Praktek</h2>
        <div className="grid md:grid-cols-2 md:gap-56 gap-10">
            <div className="border-[1px] border-slate-200 p-3 rounded-lg">
                <h4 className="font-bold text-lg mb-2">🏢 Instansi/Perusahaan</h4>
                <label className="text-sm font-bold" htmlFor="instansi">Nama Instansi / Perusahaan</label>
                <input className="text-black block w-full border-[1px] border-slate-300 rounded-md p-1 mb-4" placeholder="Nama Perusahaan..." type="text" id="instansi" name="namaInstansi"/>

                <label className="text-sm font-bold" htmlFor="alamat-instansi">Alamat Instansi / Perusahaan</label>
                <textarea className="block w-full border-[1px] border-slate-300 rounded-md p-1 mb-4" placeholder="Alamat Perusahaan..." rows={3} id="alamat-instansi" name="alamatInstansi"/>

                <label className="text-sm font-bold" htmlFor="jenis-instansi">Jenis Instansi</label>
                <select className="block w-full my-2 p-2 rounded-lg border-[1px] border-slate-300" name="jenisInstansi" id="jenis-instansi">
                    <option value="">Pilih Jenis Instansi</option>
                    <option value="Pemerintahan">Pemerintahan</option>
                    <option value="Swasta">Swasta</option>
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="UMKM">UMKM</option>
                </select>

                <label className="text-sm font-bold" htmlFor="longitude">Longitude</label>
                <input className="text-black block w-full border-[1px] border-slate-300 rounded-md p-1 mb-4" type="number" id="longitude" name="longitude"/>

                <label className="text-sm font-bold" htmlFor="latitude">Latitude</label>
                <input className="text-black block w-full border-[1px] border-slate-300 rounded-md p-1 mb-4" type="number" id="latitude" name="latitude"/>

                <label className="text-sm font-bold" htmlFor="profil-singkat">Profil Singkat</label>
                <textarea className="block w-full border-[1px] p-1 border-slate-300 rounded-lg" name="profilSingkat" id="profil-singkat" rows={5}></textarea>
            </div>
            <div className="border-[1px] border-slate-200 p-3 rounded-lg">
                <h4 className="font-bold text-lg mb-2 md:mt-0 mt-10">🏢 Kontak Instansi</h4>
                <label className="text-sm font-bold" htmlFor="nama-penanggung-jawab">Nama Penanggung Jawab Instansi</label>
                <input className="text-black block w-full border-[1px] border-slate-300 rounded-md p-1 mb-4" placeholder="Nama Penanggung Jawab..." type="text" id="nama-penanggung-jawab" name="namaPenanggungJawabInstansi"/>

                <label className="text-sm font-bold" htmlFor="no-telp-penanggung-jawab-instansi">No Telpon Penanggung Jawab Instansi</label>
                <input className="text-black block w-full border-[1px] border-slate-300 rounded-md p-1 mb-4" placeholder="+62-000-0000-0000" type="text" id="no-telp-penanggung-jawab-instansi" name="telpPenanggungJawabInstansi"/>

                <label className="text-sm font-bold" htmlFor="email-penanggung-jawab-instansi">Email Penanggung Jawab Instansi</label>
                <input className="text-black block w-full border-[1px] border-slate-300 rounded-md p-1" placeholder="example@email.com" type="text" id="email-penanggung-jawab-instansi" name="emailPenanggungJawabInstansi"/>
            </div>
        </div>
        
        <div className="text-end mt-4 sm:flex sm:flex-col sm:gap-2 md:block">
            <button type="button" disabled={isLoading} className="md:mr-4 py-1 md:w-[198px] font-bold border-black border-[1px] rounded-lg hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">Batal</button>
            <button type="submit" disabled={isLoading} className="bg-green-600 py-1 md:w-[198px] text-white font-bold rounded-lg hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">Ajukan Permohonan</button>
        </div>
    </form>
    </DashboardLayout>
}

export default MahasiswaKerjaPraktikDaftarKPPermohonanFormDaftarInstansiPage