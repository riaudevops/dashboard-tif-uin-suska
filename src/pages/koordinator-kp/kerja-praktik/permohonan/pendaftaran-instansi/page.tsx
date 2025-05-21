import DashboardLayout from "@/components/globals/layouts/dashboard-layout"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface InstansiInterface {
    id: string,
    status: "Semua Instansi" | "Aktif" | "Pending" | "Tidak_Aktif"
    nama: string,
    jenis: "Swasta" | "UMKM" | "Pemerintahan" | "Pendidikan",
}

type Tab = "Semua Instansi" | "Aktif" | "Pending" | "Tidak_Aktif";

const cardData = [
    {text : "Total Instansi", count : 0},
    {text : "Instansi Aktif", count : 0},
    {text : "Instansi Pending", count : 0},
    {text : "Instansi Tidak Aktif", count : 0}
]

const buttonData = [
    {text : "Semua Instansi"},
    {text : "Aktif"},
    {text : "Pending"},
    {text : "Tidak_Aktif"},
]

function KoordinatorKerjaPraktikInstansiPage() {
const [currentTab, setCurrentTab] = useState<Tab>("Semua Instansi");
const [dataInstansi, setDataInstansi] = useState<InstansiInterface[]>([]);
const navigate = useNavigate();


useEffect(() => {
    (async function() {
        const response = await fetch("http://localhost:5000/daftar-kp/get-all-data-instansi")

        if (!response.ok) {
            throw new Error("Gagal mendapatkan data instansi");
        }

        const data = await response.json();

        setDataInstansi(data.data)

    })()
}, [])

return <DashboardLayout>
<div className="flex flex-col gap-4">
    <h1 className="font-bold tracking-wide text-2xl">Daftar Instansi Kerja Praktek</h1>
    <div className="flex gap-2">
        {cardData.map(item => <Card text={item.text} count={item.count}/>)}
    </div>
    <div className="w-fit rounded-lg bg-gray-200">
        {buttonData.map(item => <button onClick={() => setCurrentTab(item.text as Tab)} className={`p-2 rounded-lg ${currentTab === item.text ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"} text-sm font-semibold tracking-wide`}>{item.text.replace("_", " ")}</button>)}
    </div>
    <div className="rounded-lg overflow-hidden border-[1px] border-gray-300">
    <table className="w-full">
        <tr className="border-b-[1px] border-gray-300 text-gray-600">
            <th>No</th>
            <th>Nama Instansi</th>
            <th>Jenis Instansi</th>
            <th>Status</th>
            <th>Aksi</th>
            <th className="text-transparent text-4xl">l</th>
        </tr>
        {dataInstansi.filter(item => currentTab === "Semua Instansi" || item.status === currentTab).map((item, i) => <tr key={i} className="text-center">
            <td>{i+1}</td>
            <td>{item.nama}</td>
            <td>{item.jenis}</td>
            <td>{item.status}</td>
            <td><button onClick={() => navigate(`/koordinator-kp/kerja-praktik/instansi/detail-instansi/${item.id}`)} className="rounded-lg p-2 bg-blue-500 text-white font-semibold tracking-wide">Lihat Detail</button></td>
            <th className="text-transparent text-5xl">l</th>
        </tr>)}
    </table>
    </div>
</div>
</DashboardLayout>
}

interface CardProps {
    text : string, 
    count : number, 
}

function Card({text, count} : CardProps) {
    return <div className="flex rounded-lg border-2 border-green-600 w-[20%]">
        <div className="h-full w-1 bg-green-600"></div>
        <div className="p-3">
            <p>{text}</p>
            <h3 className="font-bold text-3xl">{count}</h3>
            <p className="text-blue-600">Instansi</p>
        </div>
    </div>
}


export default KoordinatorKerjaPraktikInstansiPage