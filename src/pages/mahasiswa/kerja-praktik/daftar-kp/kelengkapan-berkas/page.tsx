'use client'

import {Link} from "react-router";
import CardProgressKelengkapanBerkas from "@/components/mahasiswa/daftar-kp/CardProgressKelengkapanBerkas";
import { Dispatch, FormEvent, SetStateAction, useState, useEffect } from "react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";

const DataCardProgressKelengkapanBerkas = [
  "Surat Pengantar",
  "Surat Balasan Instansi",
  "Id Pengajuan Dosen Pembimbing",
  "Surat Penunjukkan Dosen Pembimbing",
  "Selesai"
]

interface KPInterface {
  status : string,
  tanggal_mulai : string
  level_akses : number,
  link_surat_pengantar?: string | null
  link_surat_balasan?: string | null,
  link_surat_penunjukan_dospem?: string | null,
  link_surat_perpanjangan_kp?: string | null,
  id_surat_pengajuan_dospem?: string | null,
  catatan_penolakan? : string | null
}

interface CommonResponse {
  response : boolean,
  message : string
}

interface StatusValidasiInterface {
  style : string,
  message : string
}

export default function MahasiswaKerjaPraktekDaftarKPKelengkapanBerkasPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<CommonResponse | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [tanggalPendaftaran, setTanggalPendaftaran] = useState();
  const [dataKPTerbaru, setDataKPTerbaru] = useState<KPInterface>({
    status : "",
    tanggal_mulai : "",
    level_akses : 0,
    link_surat_pengantar: "",
    link_surat_balasan: "",
    link_surat_penunjukan_dospem: "",
    link_surat_perpanjangan_kp: "",
    id_surat_pengajuan_dospem: "",
  })
  const [currentPage, setCurrentPage] = useState(1)
  let url = "http://localhost:5000/daftar-kp/unggah-surat-pengantar-kp";
  let InputField = <div></div>
  let statusValidasi : StatusValidasiInterface = {
    style : "",
    message : ""
  }

  if (currentPage === 1 && dataKPTerbaru?.level_akses! >= 1) {
    if (dataKPTerbaru?.level_akses === 1) {
      if (dataKPTerbaru.catatan_penolakan) {
        statusValidasi.style = "bg-red-600";
        statusValidasi.message = dataKPTerbaru.catatan_penolakan
      } else {
      statusValidasi.style = "bg-gray-600";
      statusValidasi.message = "Belum mengirimkan berkas"
      }
    } else if (dataKPTerbaru?.level_akses === 2) {
      statusValidasi.style = "bg-blue-400";
      statusValidasi.message = "menunggu divalidasi oleh Koordinator KP"  
    }
    else {
      statusValidasi.style = "bg-green-600";
      statusValidasi.message = "Berkas KP berhasil divalidasi oleh Koordinator KP"
    }
    InputField = <div className="border-[1px] border-slate-300 p-3 rounded-lg">
    <div className="flex flex-col">
    <h3 className="font-bold text-lg">Dokumen Surat Pengantar dari Dekan</h3>
    <p className="text-xs text-slate-500">Silakan inputkan Link Gdrive dengan file harus berformat pdf.</p>
    <label className="font-bold text-sm mt-1" htmlFor="surat-pengantar-kp">Link : </label>
    <input key="surat-pengantar" onChange={(e) => setInputValue(e.target.value)} value={inputValue} readOnly={dataKPTerbaru?.level_akses > 2} className={`mt-1 text-black p-2 border-[1px] border-slate-300 rounded-lg  ${dataKPTerbaru?.level_akses > 2 ? "hover:cursor-not-allowed" : ""}`} type="text" placeholder="Masukkan Link Berkas..." id="surat-pengantar-kp" name="linkSuratPengantarKP"/>
    </div>
  </div>
  }

  else if (currentPage === 3 && dataKPTerbaru?.level_akses! >= 3) {
    if (dataKPTerbaru?.level_akses === 3) {
      if (dataKPTerbaru.catatan_penolakan) {
        statusValidasi.style = "bg-red-600";
        statusValidasi.message = dataKPTerbaru.catatan_penolakan
      } else {
      statusValidasi.style = "bg-gray-600";
      statusValidasi.message = "Belum mengirimkan berkas"
      }
    } else if (dataKPTerbaru?.level_akses === 4) {
      statusValidasi.style = "bg-blue-400";
      statusValidasi.message = "menunggu divalidasi oleh Koordinator KP"  
    }
    else {
      statusValidasi.style = "bg-green-600";
      statusValidasi.message = "Berkas KP berhasil divalidasi oleh Koordinator KP"
    }
    url = "http://localhost:5000/daftar-kp/unggah-surat-balasan-kp";
    InputField = <div className="border-[1px] border-slate-300 p-3 rounded-lg">
    <div className="flex flex-col">
    <h3 className="font-bold text-lg">Dokumen Surat Jawaban dari Instansi</h3>
    <p className="text-xs text-slate-500">Silakan inputkan Link Gdrive dengan file harus berformat pdf.</p>
    <label className="font-bold text-sm mt-1" htmlFor="surat-balasan-kp">Link : </label>
    <input key="surat-jawaban" onChange={(e) => setInputValue(e.target.value)} value={inputValue} readOnly={dataKPTerbaru?.level_akses > 4} className={`mt-1 text-black p-2 border-[1px] border-slate-300 rounded-lg ${dataKPTerbaru?.level_akses > 4 ? "hover:cursor-not-allowed" : ""}`} type="text" placeholder="Masukkan Link Berkas..." id="surat-balasan-kp" name="linkSuratBalasanKP"/>
    </div>
  </div>
  }

  else if (currentPage === 5 && dataKPTerbaru?.level_akses! >= 5) {
    if (dataKPTerbaru?.level_akses === 5) {
      if (dataKPTerbaru.catatan_penolakan) {
        statusValidasi.style = "bg-red-600";
        statusValidasi.message = dataKPTerbaru.catatan_penolakan
      } else {
      statusValidasi.style = "bg-gray-600";
      statusValidasi.message = "Belum mengirimkan berkas"
      }
    } else if (dataKPTerbaru?.level_akses === 6) {
      statusValidasi.style = "bg-blue-400";
      statusValidasi.message = "menunggu divalidasi oleh Koordinator KP"  
    }
    else {
      statusValidasi.style = "bg-green-600";
      statusValidasi.message = "Berkas KP berhasil divalidasi oleh Koordinator KP"
    }
    url = "http://localhost:5000/daftar-kp/unggah-id-pengajuan-dosen-pembimbing-kp";
    InputField = <div className="grid md:grid-cols-2 gap-4">
    <div className="border-[1px] border-slate-300 p-3 rounded-lg">
    <h3 className="font-bold text-lg">Link Pengajuan Dosen Pembimbing pada Portal FST</h3>
    <p className="text-xs text-slate-500">Silakan kunjungi link di bawah ini :</p>
    <p>http://seminar-fst.uin-suska.ac.id/akademik/prosedur/pembimbing</p>
    </div>
    <div className="border-[1px] border-slate-300 p-3 rounded-lg">
    <h3 className="font-bold text-lg">Id Pengajuan Portal FST</h3>
    <p className="text-xs text-slate-500">Silakan masukkan Id pengajuan yang telah diperoleh dari portal FST :</p>
    <label className="font-bold text-sm mt-1" htmlFor="id-pengajuan-dosen-pembimbing">Id Pengajuan Pembimbing KP : </label>
    <input key="id-pengajuan-dospem" onChange={(e) => setInputValue(e.target.value)} value={inputValue} readOnly={dataKPTerbaru?.level_akses > 6} className={`mt-1 text-black p-2 border-[1px] border-slate-300 rounded-lg ${dataKPTerbaru?.level_akses > 6 ? "hover:cursor-not-allowed" : ""}`} type="text" placeholder="Masukkan Id Pengajuan..." id="id-pengajuan-dosen-pembimbing" name="IdPengajuanDosenPembimbingKP"/>
    </div>
  </div>
  }

  else if (currentPage === 7 && dataKPTerbaru?.level_akses! >= 7) {
    if (dataKPTerbaru?.level_akses === 7) {
      if (dataKPTerbaru.catatan_penolakan) {
        statusValidasi.style = "bg-red-600";
        statusValidasi.message = dataKPTerbaru.catatan_penolakan
      } else {
        statusValidasi.style = "bg-gray-600";
        statusValidasi.message = "Belum mengirimkan berkas"
      }
    } else if (dataKPTerbaru?.level_akses === 8) {
      statusValidasi.style = "bg-blue-400";
      statusValidasi.message = "menunggu divalidasi oleh Koordinator KP"  
    }
    else {
      statusValidasi.style = "bg-green-600";
      statusValidasi.message = "Berkas KP berhasil divalidasi oleh Koordinator KP"
    }
    url = "http://localhost:5000/daftar-kp/unggah-surat-penunjukkan-dosen-pembimbing-kp";
    InputField = <div className="border-[1px] border-slate-300 p-3 rounded-lg">
    <div className="flex flex-col">
    <h3 className="font-bold text-lg">Dokumen Penunjukkan Dosen Pembimbing</h3>
    <p className="text-xs text-slate-500">Silakan inputkan Link Gdrive dengan file harus berformat pdf.</p>
    <label className="font-bold text-sm mt-1" htmlFor="surat-penunjukkan-dosen-pembimbing">Link : </label>
    <input key="surat-penunjukkan-dospem" onChange={(e) => setInputValue(e.target.value)} value={inputValue} readOnly={dataKPTerbaru?.level_akses > 8} className={`mt-1 text-black p-2 border-[1px] border-slate-300 rounded-lg ${dataKPTerbaru?.level_akses > 8 ? "hover:cursor-not-allowed" : ""}`} type="text" placeholder="Masukkan Link Berkas..." id="surat-penunjukkan-dosen-pembimbing" name="linkSuratPenunjukkanDosenPembimbingKP"/>
    </div>
  </div>
  }

  else if (currentPage === 9 && dataKPTerbaru?.level_akses! >= 9) {
    url = "http://localhost:5000/daftar-kp/unggah-surat-perpanjangan-kp";
    const isItOKDaftar = new Date(tanggalPendaftaran?.tanggal_akhir_pendaftaran_kp_lanjut).getTime() - (new Date()).getTime() > 0;
    InputField = <div className="border-[1px] border-slate-300 p-3 rounded-lg">
    <div className="flex flex-col">
    <h3 className="font-bold text-lg">Pendaftaran KP Berhasil</h3>
    <p className="text-sm text-slate-500">Silakan mengisi Daily Report Kerja Praktek</p>
    <p>Atau</p>
    {isItOKDaftar && <><p className="text-xs text-slate-500">Silakan inputkan Link Gdrive dengan file harus berformat pdf.</p>
    <label className="font-bold text-sm mt-1" htmlFor="surat-penunjukkan-dosen-pembimbing">Link : </label>
    <input key="surat-penunjukkan-dospem" onChange={(e) => setInputValue(e.target.value)} value={inputValue} readOnly={dataKPTerbaru?.level_akses > 8} className={`mt-1 text-black p-2 border-[1px] border-slate-300 rounded-lg ${dataKPTerbaru?.level_akses > 8 ? "hover:cursor-not-allowed" : ""}`} type="text" placeholder="Masukkan Link Berkas..." id="surat-penunjukkan-dosen-pembimbing" name="linkSuratPenunjukkanDosenPembimbingKP"/>
    <Link to={{pathname : "/mahasiswa/kerja-praktik/daily-report"}} className="text-center hover:cursor-pointer rounded-md bg-green-950 py-1 text-white font-bold tracking-wide mt-2">Pergi ke Halaman Daily Report</Link>
    </>
    }</div>
  </div>
  }

  if (currentPage <= dataKPTerbaru?.level_akses!) {

  }

  useEffect(() => {
      (async function() {
        const response = await fetch("http://localhost:5000/daftar-kp/kp-aktif-mahasiswa")
        const data = await response.json();
        if (!data) {
          console.log("Gagal mendapatkan riwayat KP")
        } else {
          setDataKPTerbaru(data.data)
          if (data?.data?.level_akses % 2 === 0) {
            setCurrentPage(data.data.level_akses-1)  
          } else {
          setCurrentPage(data.data.level_akses)
          }
        }
        const response1 = await fetch("http://localhost:5000/daftar-kp/get-tanggal-daftar-kp");
        if (!response1.ok) {
          throw new Error("Gagal mendapatkan data tanggal")
        }
        const data1 = await response1.json();
        setTanggalPendaftaran(data1.data);
      })()
    }, [])


  return <DashboardLayout>
    {dataKPTerbaru && <div>
    <h3 className="font-bold text-2xl tracking-wide">Validasi Kelengkapan Berkas</h3>
    <div className="flex justify-between">
      {DataCardProgressKelengkapanBerkas.map((item, i) => {
        let status : boolean | undefined = false;

        if (dataKPTerbaru?.level_akses! >= i*2+1) {
          status = true;
        }

        return < CardProgressKelengkapanBerkas key={i} onClick={() => {if (status) setCurrentPage(i*2+1)}} text={item} number={i+1} status={status}/>
      })}
        {response && response.response && <div className="absolute left-1/2 py-2 -translate-x-1/2 rounded-lg w-80 bg-green-600 text-white">
        <p className="text-center text-white font-semibold tracking-wide">{response.message}</p>
        </div>}
        {response && !(response.response) && <div className="absolute left-1/2 -translate-x-1/2 rounded-lg w-80 py-2 bg-green-600">
        <p className="text-center text-white font-semibold tracking-wide">{response.message}</p>
        </div>}
    </div>
    <div className={`rounded-lg ${statusValidasi.style} py-5 px-3 mt-4`}>
      <h3 className="font-medium text-lg tracking-wide text-white">Status Validasi Surat Jawaban</h3>
      <p className="mt-2 text-white text-sm">{":"} {statusValidasi.message}</p>
    </div>
    <div className="mt-2">
      <div className="p-3 font-bold bg-green-200 dark:bg-black rounded-lg">
        Silakan Isi Form di Bawah ini untuk Divalidasi!
      </div>
      <form onSubmit={handleOnSubmitForm(url, setIsLoading, setResponse, setDataKPTerbaru)}>
        <div className="dark:bg-black bg-green-100 p-3">
          <h4 className="font-bold text-sm tracking-wide my-2">🥚 Validasi Berkas</h4>
          {InputField}
      </div>
      {currentPage === dataKPTerbaru?.level_akses! && (dataKPTerbaru?.level_akses! !== 9 || dataKPTerbaru?.level_akses! === 9 && new Date(tanggalPendaftaran?.tanggal_akhir_pendaftaran_kp_lanjut).getTime() - (new Date()).getTime() > 0) && <div className="flex justify-end items-center mt-2">
      <button onClick={() => setInputValue("")} disabled={isLoading} type="reset" className=" px-16 tracking-wide py-1 font-semibold rounded-lg hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Kosongkan Formulir</button>
      <button disabled={isLoading} type="submit" className=" px-24 py-1 tracking-wide text-white font-medium rounded-lg bg-green-950 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Kirim</button>
      </div>}
  </form>
    </div>
    </div>}
  </DashboardLayout>
}

function handleOnSubmitForm(url : string, setIsLoading : Dispatch<SetStateAction<boolean>>, setResponse : Dispatch<SetStateAction<CommonResponse | null>>, setDataKPTerbaru : Dispatch<SetStateAction<KPInterface>>) {
  return (async function handleOnSubmit(e : FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(prev => !prev)
    const formData = new FormData(e.currentTarget);
    const objectFormData = Object.fromEntries(formData.entries());
    const response = await fetch(url, {
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(objectFormData)
    })
    setIsLoading(prev => !prev)

    if (!(response.ok)) {
      throw new Error("Terjadi kesalahan pada server")
    }

    const data = await response.json();
            setResponse(data)
            setDataKPTerbaru(prev => {
                return {...prev, 
                  level_akses : prev.level_akses + 1
                }
            })
            const pointer = setTimeout(() => {
                setResponse(null)
                clearTimeout(pointer)
            }, 1000)

  })
}

// function FormSuratPengantar({url, isLoading, setIsLoading} : {isLoading : boolean, setIsLoading : Dispatch<SetStateAction<boolean>>, url : string}) {
  
//   return <form onSubmit={handleOnSubmitForm(url, setIsLoading)}>
//     <div className="bg-green-100 p-3">
//         <h4 className="font-bold text-sm tracking-wide my-2">🥚 Validasi Berkas</h4>
//         <div className="border-[1px] border-slate-300 p-3 bg-white rounded-lg">
//           <div className="flex flex-col">
//           <h3 className="font-bold text-lg">Dokumen Surat Pengantar dari Dekan</h3>
//           <p className="text-xs text-slate-500">Silakan inputkan Link Gdrive dengan file harus berformat pdf.</p>
//           <label className="font-bold text-sm mt-1" htmlFor="nama-pembimbing-instansi">Link : </label>
//           <input className="mt-1 p-2 border-[1px] border-slate-300 rounded-lg " type="text" placeholder="Masukkan Link Berkas..." id="nama-pembimbing-instansi" name="linkSuratPengantarKP"/>
//           </div>
//         </div>
//       </div>
//       <div className="flex justify-end items-center mt-2">
//       <button disabled={isLoading} type="reset" className=" px-16 tracking-wide py-1 font-semibold rounded-lg hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Kosongkan Formulir</button>
//       <button disabled={isLoading} type="submit" className=" px-24 py-1 tracking-wide text-white font-medium rounded-lg bg-green-950 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Kirim</button>
//       </div>
//   </form>
// }



// function FormSuratBalasanInstansi({url} : {url : string}) {
  
//   return <form onSubmit={handleOnSubmitForm(url, setIsLoading)}>
//     <div className="bg-green-100 p-3">
//         <h4 className="font-bold text-sm tracking-wide my-2">🥚 Validasi Berkas</h4>
//         <div className="border-[1px] border-slate-300 p-3 bg-white rounded-lg">
//           <div className="flex flex-col">
//           <h3 className="font-bold text-lg">Dokumen Surat Pengantar dari Dekan</h3>
//           <p className="text-xs text-slate-500">Silakan inputkan Link Gdrive dengan file harus berformat pdf.</p>
//           <label className="font-bold text-sm mt-1" htmlFor="nama-pembimbing-instansi">Link : </label>
//           <input className="mt-1 p-2 border-[1px] border-slate-300 rounded-lg" type="text" placeholder="Masukkan Link Berkas..." id="nama-pembimbing-instansi" name="linkSuratPengantarKP"/>
//           </div>
//         </div>
//       </div>
//       <div className="flex justify-end items-center mt-2">
//       <button disabled={isLoading} type="reset" className=" px-16 tracking-wide py-1 font-semibold rounded-lg hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Kosongkan Formulir</button>
//       <button disabled={isLoading} type="submit" className=" px-24 py-1 tracking-wide text-white font-medium rounded-lg bg-green-950 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Kirim</button>
//       </div>
//   </form>
// }



// function FormSuratBalasanInstansi1(url : string) {

//   return <form>
//     <div className="bg-green-100 p-3">
//         <h4 className="font-bold text-sm tracking-wide my-2">🥚 Kontak Pembimbing Instansi</h4>
//         <div className="border-[1px] border-slate-300 p-3 bg-white rounded-lg">
//           <div className="flex flex-col mt-2">
//           <label className="font-bold text-sm" htmlFor="nama-pembimbing-instansi">Nama Pembimbing Instansi</label>
//           <input className="p-1 border-[1px] border-slate-300 rounded-lg" type="text" placeholder="Nama Penanggung Jawab Instansi..." id="nama-pembimbing-instansi"/>
//           </div>
//           <div className="flex flex-col mt-2">
//           <label className="font-bold text-sm" htmlFor="email-resmi-pembimbing-instansi">Email Resmi Pembimbing Instansi</label>
//           <input className="p-1 border-[1px] border-slate-300 rounded-lg" type="text" placeholder="Nama Penanggung Jawab Instansi..." id="email-resmi-pembimbing-instansi"/>
//           </div>
//         </div>
//       </div>
//     </form>
// }