// import Link from "next/link";
// import {useRouter} from "next/navigation"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";

interface CommonResponse {
    response : boolean,
    message : string
}

function MahasiswaKerjaPraktekDaftarKpPermohonanFromPendaftaranPage() {

    const [dataInstansi, setDataInstansi] = useState([]);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [response, setResponse] = useState<CommonResponse | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        (async function() {
            const response = await fetch("http://localhost:5000/daftar-kp/data-instansi")
            const data = await response.json()
            console.log(data.data)
            setDataInstansi(data.data)
        })()
    }, [])

    async function handleOnSubmit(e : FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading((prev) => !prev)
        const formData = new FormData(e.currentTarget);
        const objectFormData = Object.fromEntries(formData.entries());
        const url = "http://localhost:5000/daftar-kp/pendaftaran-kp"
        try {
        const response = await fetch(url, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                tanggalMulai : new Date(objectFormData.tanggalMulai as string).toISOString(),
                tujuanSuratInstansi : objectFormData.tujuanSuratInstansi,
                idInstansi : objectFormData.idInstansi,
            })
        }) 
        // console.log("test2")
        // console.log("test3")
        if (!(response.ok)) {
            setIsLoading(prev => !prev)
            throw new Error("Terjadi suatu kesalahan di server")
        }
            const data = await response.json();
            setResponse(data)
            const pointer = setTimeout(() => {
                setResponse(null)
                clearTimeout(pointer)
            }, 1000)
        // console.log("tes4")
        navigate("/mahasiswa/kerja-praktik/daftar-kp/permohonan")
    }
    catch (e) {
        throw new Error("Data tanggal tidak valid")
    }
    }

    async function handleOnCancel() {
        navigate("/mahasiswa/kerja-praktik/daftar-kp/permohonan")
    }

    return <DashboardLayout>
    <form onSubmit={handleOnSubmit}>
        {response && response.response && <div className="fixed left-1/2 py-2 -translate-x-1/2 rounded-lg w-80 bg-green-600 text-white">
        <p className="text-center text-white font-semibold tracking-wide">{response.message}</p>
        </div>}
        {response && !(response.response) && <div className="absolute left-1/2 -translate-x-1/2 rounded-lg w-80 py-2 bg-green-600">
        <p className="text-center text-white font-semibold tracking-wide">{response.message}</p>
        </div>}
      <h3 className="text-center font-bold text-2xl">Form Pendaftaran Kerja Praktek</h3>  
        <div className="">
            <h4 className="font-bold text-lg">🏢 Instansi/Perusahaan</h4>
            <label className="text-sm font-bold mt-6" htmlFor="instansi">Nama Instansi / Perusahaan</label>
            <div className="text-black p-2 bg-white rounded-md border-black border-[1px]">
            <select className="bg-white block w-[100%]" name="idInstansi" id="instansi">
                <option value="">Pilih Instansi</option>
                {dataInstansi.map(({id, nama}) => <option key={id} value={id}>{nama}</option>)}
            </select>
            </div>
            <p className="text-sm text-slate-500">Instansi belum terdaftar? Daftarkan segera <Link className="text-blue-500" to={{pathname : "/mahasiswa/kerja-praktik/daftar-kp/permohonan/form-daftar-instansi"}}>Disini</Link></p>
        </div>

        <div>
            <label className="text-sm font-bold" htmlFor="tujuan-surat">Tujuan Surat Instansi/Perusahaan</label>
            <textarea className="text-black block bg-white w-full p-2 border-slate-300 border-[1px] rounded-lg h-42" name="tujuanSuratInstansi" id="tujuan-surat" placeholder="Masukkan tujuan instansi disini..."></textarea>
            <p className="text-slate-500 text-sm">Lihat format penulisan Disini</p>
        </div>

        <div>
        <label className="text-sm font-bold" htmlFor="tanggal-mulai">Tanggal Mulai</label>
        <div>
        <input className="text-black bg-white w-full p-2 border-slate-300 border-[1px] rounded-lg" type="date" id="tanggal-mulai" name="tanggalMulai"/>
        </div>
        </div>

        <div className="text-end mt-4 sm:flex sm:flex-col sm:gap-2 md:block">
            <button onClick={handleOnCancel} type="button" disabled={isLoading} className="md:mr-4 bg-white py-1 md:w-[198px] font-bold border-black border-[1px] rounded-lg hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">Batal</button>
            <button type="submit" disabled={isLoading} className="bg-green-600 py-1 md:w-[198px] text-white font-bold rounded-lg hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">Ajukan Permohonan</button>
        </div>
    </form>
    </DashboardLayout>
}

export default MahasiswaKerjaPraktekDaftarKpPermohonanFromPendaftaranPage;