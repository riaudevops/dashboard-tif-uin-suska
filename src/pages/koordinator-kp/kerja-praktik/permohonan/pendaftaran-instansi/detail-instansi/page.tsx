import { useParams } from "react-router-dom"
import {useState, useEffect} from 'react';
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";

interface Instansi {
    nama: string;
    id: string;
    alamat: string;
    longitude: number | null;
    latitude: number | null;
    jenis: string;
    profil_singkat: string | null;
    status: string;
    nama_pj: string;
    no_hp_pj: string;
}

function KoordinatorKerjaPraktikDetailInstansiPage() {
    const [dataInstansi, setDataInstansi] = useState<Instansi | null>(null);
    const {id} = useParams();
    useEffect(() => {
        (async function() {
            const response = await fetch(`http://localhost:5000/daftar-kp/get-data-instansi/${id}`);
            
            if (!response.ok) {
                throw new Error("Gagal mendapatkan data instansi");
            }

            const data = await response.json();
            
            setDataInstansi(data.data)
        })();

    }, []);

    async function handleOnAccept() {
        const response = await fetch("http://localhost:5000/daftar-kp/edit-data-instansi", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                id,
                status : "Aktif"
            })
        })

        if (!response.ok) {
            throw new Error("Gagal mengubah data instansi")
        }
    }

    async function handleOnReject() {

    }

    async function handleOnDelete () {

    }

    async function handleOnEdit() {

    }
    
    return <DashboardLayout>
        {dataInstansi !== null ? <><div className="flex gap-2">
            <div className="w-[50%]">
            <div className="w-full h-52 bg-gray-600">
            </div>
            <div>
            <p>Profil Singkat : </p>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto fugiat iusto blanditiis? Atque eos similique alias nulla perspiciatis dolorum esse consequatur aspernatur! Dolore blanditiis corporis ipsa animi corrupti nam ab necessitatibus vero? Rerum, adipisci hic quisquam iusto sint optio quasi suscipit deserunt, quos qui consequatur, rem amet assumenda dignissimos quod aut accusantium a? Dolorem tempore illo aspernatur voluptatum similique porro impedit commodi. Id, minus tempora in eius iure magni qui a eum perferendis consequatur reprehenderit beatae molestiae nihil asperiores, blanditiis voluptates deserunt animi. Cupiditate voluptas minus non neque doloremque beatae libero assumenda enim, veniam necessitatibus fugit laudantium dolores, quam natus!</p>
            <p>{dataInstansi?.profil_singkat}</p>
        </div>
            </div>
            <div className="flex-grow">
            <div className="rounded-lg p-2 border-[1px] border-gray-200 shadow-md mb-6">
            <h4 className="tracking-wide font-bold text-lg">{dataInstansi?.nama}</h4>
            <p>Jenis Instansi: {dataInstansi?.jenis}</p>
            <p>Status : {dataInstansi?.status}</p>
            </div>
            <div className="rounded-lg p-2 border-[1px] border-gray-200 shadow-md mb-6">
            <h4 className="tracking-wide font-bold text-lg">Lokasi</h4>
            <p>latitude : {dataInstansi?.latitude}</p>
            <p>longitude : {dataInstansi?.longitude}</p>
            <p>alamat : {dataInstansi?.alamat}</p>
            </div>
            <div className="rounded-lg p-2 border-[1px] border-gray-200 shadow-md">
            <h4 className="tracking-wide font-bold text-lg">Penanggung Jawab</h4>
            <p>Nama Penanggung Jawab : {dataInstansi?.nama_pj}</p>
            <p>Nomor Penanggung Jawab : {dataInstansi?.no_hp_pj}</p>
            </div>
            <p></p>
            </div>
        </div>
        <div className="fixed left-0 right-0 py-3 pr-10 bottom-0 flex justify-end gap-4">
               {dataInstansi?.status === "Pending" ? <> 
               <button onClick={handleOnReject} className="bg-red-600 p-2 rounded-lg text-white font-semibold tracking-wide">Tolak Pengajuan</button>
                <button onClick={handleOnAccept} className="bg-green-600 p-2 rounded-lg text-white font-semibold tracking-wide">Terima Pengajuan</button>
                </> : 
                <> 
               <button onClick={handleOnDelete} className="bg-red-600 p-2 rounded-lg text-white font-semibold tracking-wide">Hapus Instansi</button>
                <button onClick={handleOnEdit} className="bg-green-600 p-2 rounded-lg text-white font-semibold tracking-wide">Edit Instansi</button>
                </>
           } </div>
        </> : <div></div>}
    </DashboardLayout>
}

export default KoordinatorKerjaPraktikDetailInstansiPage