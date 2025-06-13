import { Link } from "react-router";
import ProgressBar from "@/components/mahasiswa/daftar-kp/ProgressBar";
import { useEffect, useState } from "react";
import RiwayatCard from "@/components/mahasiswa/daftar-kp/RiwayatCard";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";

interface KPInterface {
  status : string,
  tanggal_mulai : string
  level_akses : number,
  instansi : {
      nama : string
  }
}

export default function MahasiswaKerjaPraktekDaftarKpPermohonanPage() {
  const [riwayatKP, setRiwayatKP] = useState<KPInterface[]>([]);
  const [activeKP, setActiveKP] = useState<KPInterface | null | false | undefined>(null);
  const [levelAkses, setLevelAkses] = useState(0)

  // KPInterface = aktif
  // null = data gagal didapatkan
  // undefined = sudah lulus
  // false = tidak sedang mendaftar dan belum lulus

  let StepComponent = <div></div>

  useEffect(() => {
    (async function() {
      const response = await fetch("http://localhost:5000/daftar-kp/riwayat-pendaftaran-kp")
      const data = await response.json();
      if (!data) {
        throw new Error("Gagal mendapatkan riwayat KP");
      } else if (data.response) {
        const result : KPInterface | undefined = (data.data as []).find(({status}) => status === "Baru");
        if (result) {
          setActiveKP(result)
          setLevelAkses((result as KPInterface).level_akses)
        } else {
          setActiveKP(undefined);
        }
        setRiwayatKP(data.data)
      } else {
        throw new Error("Terjadi kesalahan pada sisi server")
      }
    })()
  }, [])

  if (activeKP === undefined) {
    StepComponent = <div className="rounded-md border-green-500 border-2 py-2 px-4 bg-green-100">
    <h4 className="font-semibold text-lg">Permohonan Pendaftaran Kerja Praktek</h4>
    <p className="text-stone-500 my-2">Silakan Lakukan Pendaftaran Kerja Praktek Pada Tombol di Bawah ini Jika Sudah Memenuhi Syarat:</p>
    <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
      <div className="rounded-md bg-white py-3 px-2">
        <p>{"tif kerja-praktek@latest"}</p>
        <p className="text-cyan-700">✔ Setoran Hafalan 1-8</p>
        <p className="text-cyan-700">✔ 80 SKS yang telah Diambil</p>
        <p className="text-cyan-700">✔ Matakuliah Rekayasa Perangkat Lunak Berorientasi Objek Min. D</p>
        <p className="text-cyan-700">✔ Matakuliah Sistem Informasi Min. D</p>
        <p className="text-cyan-700">✔ Matakuliah Jaringan Komputer Min. D</p>
        <p className="text-cyan-700">✔ Menyiapkan Sistem</p>
        <p className="text-blue-800">ℹ Updated 1 file:</p>
        <p className="text-blue-800">- lib/kerja-praktek.ts</p>
        <p className="text-green-400">Success! Sistem siap digunakan.</p>
        <p>Silakan mulai pendaftaran kerja praktek Anda.</p>
      </div>
    </div>
    <Link to={{pathname : "/mahasiswa/kerja-praktik/daftar-kp/permohonan/form-pendaftaran"}} className="block text-center w-full hover:cursor-pointer hover:bg-green-400 bg-green-500 py-[4px] rounded-md text-white text-sm font-bold mt-2">Buat Permohonan ➡</Link>
  </div>
  }

  if (activeKP) {
  StepComponent = <div className="rounded-md border-green-500 border-2 py-2 px-4 bg-green-100 dark:bg-black">
  <h4 className="font-semibold text-lg">Permohonan Pendaftaran Kerja Praktek</h4>
  <p className="text-stone-500 my-2">Silakan Lakukan Pendaftaran Kerja Praktek Pada Tombol di Bawah ini Jika Sudah Memenuhi Syarat:</p>
  <div className="rounded-lg pt-4 flex justify-center gap-12 items-center">
    <div>
    <h4 className="text-lg font-bold">Progress Terkini Pendaftaran Kerja Praktek :</h4>
  < ProgressBar currentStep={levelAkses}/>
  </div>
  <div className="shadow-xl py-3 pl-3 pr-20 rounded-lg">
    <h5 className="font-bold">PENGAJUAN INSTANSI KP :</h5>
    <p>{(activeKP as KPInterface).instansi.nama}</p>
  </div>
  </div>
  <div className="md:mx-auto md:w-[500px] flex items-center justify-between rounded-full border-[1px] border-black dark:border-white p-2 mt-3">
  <p className="text-sm">Silakan lanjut untuk validasi kelengkapan berkas!</p>
  <Link to={{pathname : "/mahasiswa/kerja-praktik/daftar-kp/kelengkapan-berkas"}} className="rounded-full p-2 bg-green-600 text-white text-sm font-semibold">LANJUT {">"}</Link>
  </div>
</div>
  }

  return (
    <DashboardLayout>
      <h3 className="font-bold text-xl">Pendaftaran Kerja Praktek</h3>
      <p>Berikut detail Progres Pendaftaran Kerja Praktek Anda, semangat terus ya...</p>
      {StepComponent}
      <div className="rounded-lg p-2 mt-3 shadow-lg">
            <h3 className="font-semibold tracking-wide">Detail Riwayat</h3>
            <h4 className="mt-2 font-medium text-[14px] mb-2">Aktif</h4>
            {riwayatKP.map(({status, tanggal_mulai, instansi : {nama}}, i) => < RiwayatCard key={i} status={status} tanggalMulai={tanggal_mulai.slice(0,10).replaceAll("-", "/")} namaInstansi={nama} />)}
          </div>
    </DashboardLayout>
  );
}
