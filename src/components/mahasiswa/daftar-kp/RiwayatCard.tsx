import {Link} from "react-router";

interface props {
  status : string,
  tanggalMulai : string,
  namaInstansi : string
}

export default function RiwayatCard({status, tanggalMulai, namaInstansi} : props) {
    return <div className="border-[1px] dark:bg-black border-green-600 bg-green-100 rounded-lg p-3 mb-2">
    <div className="flex justify-between">
      <div className="flex justify-start gap-8">
      <p className="text-xs font-bold">🥚 Status KP : {status}</p>
      <p className="text-xs font-bold">🥚 {namaInstansi}</p>
      <p className="text-xs font-bold">🥚 {tanggalMulai}</p>
      </div>
      <p className="text-xs">Progress Terkini : Pendaftaran KP</p>
    </div>
    <div className="flex justify-between items-center mt-2">
    <h2 className="font-bold text-lg">Kerja Praktek #1</h2>
    <Link to={{pathname : "/pendaftaran-kerja-praktek/log"}} className="flex flex-between text-white py-2 px-4 rounded-lg bg-green-600">Lihat Log {"  >"}</Link>
  </div>
  </div>
}