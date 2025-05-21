import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { Card } from "@/components/ui/card";
import {
  User,
  Building,
  GraduationCap,
  ContactRound,
  Calendar,
  Building2,
  FileText,
  ClipboardPenLine,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect, FormEvent } from "react";
import { KPDetailsInterface } from "@/interfaces/pages/mahasiswa/pendaftaran-kp.interface";

const KoordinatorKerjaPraktikPermohonanDetailPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<{response : Boolean, message : string} | null>(null);
  const [isRejectButtonClicked, setIsRejectButtonClicked] = useState<boolean>(false);
  const [rejectMessage, setRejectMessage] = useState<string>("");
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const [biodataMahasiswa, setBiodataMahasiswa] = useState<KPDetailsInterface>({
    id : "4432432",
    mahasiswa : {
      nim : "122414132532",
      nama : "Olav Thomas",
      no_hp : "0823323293123",
      email : "olav@gmail.com"
    },
    level_akses : 1,
    status: "Baru", 
    tujuan_surat_instansi : "Jl Kebun Kopi",
    instansi : {
      nama : "test123",
      pembimbing_instansi : {
        nama : "Pembimbing Instansi"
      }
    },
    dosen_pembimbing : {
      nama : "dosen_pembimbing"
    },
    tanggal_mulai: "2025-05-02T00:00:00.000Z",
    tanggal_selesai: "2025-05-02T00:00:00.000Z",
    link_surat_pengantar: "",
    alasan_lanjut_kp: "Habis masa waktu",
  });
  const name = query.get("name") || "-";
  const nim = query.get("nim") || "-";
  const idKP = query.get("idKP") || "-";

  const getstatusmahasiswa = (status: string) => {
    switch (status) {
      case "Baru":
        return "bg-green-300 ";
      case "Lanjut":
        return "bg-yellow-500";
      case "Selesai":
        return "bg-red-500 ";
      case "Gagal":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  async function handleOnAccept(e : FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading((prev) => !prev);
    try {
      const response = await fetch("http://localhost:5000/daftar-kp/berkas-mahasiswa", {
          method : "POST",
          headers : {
          'Content-Type' : "application/json",
          },
          body : JSON.stringify({
          "id" : idKP
})
        }
      )

      if (!(response.ok)) {
              setIsLoading(prev => !prev)
              throw new Error("Terjadi suatu kesalahan di server")
          }

            const responseBiodata = await fetch(`http://localhost:5000/daftar-kp/get-data-kp/${idKP}`);

            if (!responseBiodata.ok) {
              throw new Error("Gagal mendapatkan data mahasiswa")
            }

            const data = await response.json();
              setResponse(data)
              const pointer = setTimeout(() => {
                  setResponse(null)
                  clearTimeout(pointer)
              }, 1000)

            const dataMahasiswa = await responseBiodata.json();
            setBiodataMahasiswa(dataMahasiswa.data || []);
              
    } catch (e) {
      throw new Error("Terjadi kesalahan pada sistem")
    }
  }

    async function handleOnReject(e : FormEvent<HTMLFormElement>) {
      e.stopPropagation();
      e.preventDefault();
        try {
      const response = await fetch("http://localhost:5000/daftar-kp/tolak-berkas-mahasiswa", {
          method : "POST",
          headers : {
          'Content-Type' : "application/json",
          },
          body : JSON.stringify({
          "id" : idKP,
          "message" : rejectMessage
        })
        }
      )

      if (!(response.ok)) {
              setIsLoading(prev => !prev)
              throw new Error("Terjadi suatu kesalahan di server")
          }

            const responseBiodata = await fetch(`http://localhost:5000/daftar-kp/get-data-kp/${idKP}`);

            if (!responseBiodata.ok) {
              throw new Error("Gagal mendapatkan data mahasiswa")
            }

            const data = await response.json();
              setResponse(data)
              const pointer = setTimeout(() => {
                  setResponse(null)
                  clearTimeout(pointer)
              }, 1000)

            const dataMahasiswa = await responseBiodata.json();
            setBiodataMahasiswa(dataMahasiswa.data || []);
            setIsRejectButtonClicked(prev => !prev)
    } catch (e) {
      throw new Error("Terjadi kesalahan pada sistem")
    }
  }

  useEffect(() => {
    (async function() {
      const response = await fetch(`http://localhost:5000/daftar-kp/get-data-kp/${idKP}`)
      if (!response.ok) {
        throw new Error("Gagal mendapatkan data mahasiswa")
      }
      const data = await response.json();
      setBiodataMahasiswa(data.data || []);

    })()
  }, [])

  // Mock data - in a real app, this would come from your API
  // const biodataMahasiswa = {
  //   name: "John Doe",
  //   nim: "123456789",
  //   status: "Baru", 
  //   instansi: "PT. ABC",
  //   semester: 6,
  //   PembimbingInstansi: "Jane Smith",
  //   dosenPembimbing: "Dr. John Smith",
  //   tanggalMulai: "03/02/2024",
  //   tanggalSelesai: "03/05/2024",
  //   linkGdrive: "http://drive.google.com/drive/folders/file.pdf",
  //   alasanPerpanjangan: "Habis masa waktu",
  // };

  // Render different content based on status
  const renderStatusContent = () => {
    switch (biodataMahasiswa.status) {
      case "Baru":
        return (
          <>
            {/* Riwayat Permohonan Kerja Praktik Section */}
            <Card className="mt-6 rounded-lg  border border-gray-100 dark:border-gray-700 shadow-md overflow-hidden">
              <div className="p-6">
                <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
                  Riwayat Permohonan Kerja Praktik
                </h1>

                {/* Periode Kerja Praktik */}
                <div className="mb-6 bg-white dark:bg-gray-800/50 rounded-lg p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <h2 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Periode Kerja Praktik
                  </h2>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Tanggal Mulai
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-500" />
                      </div>
                      <input
                      value={biodataMahasiswa.tanggal_mulai.slice(0,10).replaceAll("-", "/")}
                      key="tanggal-mulai"
                        type="input"
                        className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md block w-full pl-10 p-2.5 
                        dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:placeholder-gray-400 
                        focus:ring-primary focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Instansi/Perusahaan */}
                <div className="mb-6 bg-white dark:bg-gray-800/50 rounded-lg p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <h2 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
                    <Building2 className="h-5 w-5 mr-2" />
                    Instansi/Perusahaan
                  </h2>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Nama Instansi / Perusahaan
                    </label>
                    <input
                    key="nama-instansi"
                    value={biodataMahasiswa.instansi?.nama || "Tidak tersedia"}
                      type="text"
                      className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md block w-full p-2.5 
                      dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:placeholder-gray-400 
                      focus:ring-primary focus:border-primary focus:outline-none"
                      placeholder="Masukkan nama instansi"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Tujuan Surat Instansi/ Perusahaan
                    </label>
                    <textarea
                    key="tujuan_surat_instansi"
                      value={biodataMahasiswa?.tujuan_surat_instansi || "Tidak tersedia"}
                      className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md block w-full p-2.5 
                      dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:placeholder-gray-400 
                      focus:ring-primary focus:border-primary focus:outline-none min-h-24 resize-none"
                      placeholder="Masukkan tujuan surat"
                    ></textarea>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-100 shadow-sm p-4 mb-6">
                  <h3 className="font-bold tracking-wide text-md text-gray-600">Berkas Mahasiswa</h3>
                  <div className={`mb-3 p-2 rounded-lg flex flex-col ${biodataMahasiswa.level_akses === 2 ? "bg-green-600" : ""}`} >
                    <label htmlFor="surat-pengantar">Surat Pengantar : </label>
                    <input className="p-2 border border-gray-300 rounded-lg bg-gray-100" type="text" id="surat-pengantar" value={biodataMahasiswa?.link_surat_pengantar || ""} />
                  </div>

                  <div className={`mb-3 p-2 rounded-lg flex flex-col ${biodataMahasiswa.level_akses === 4 ? "bg-green-600" : ""}`} >
                    <label htmlFor="surat-balasan">Surat Balasan Instansi : </label>
                    <input className="p-2 border border-gray-300 rounded-lg bg-gray-100" type="text" id="surat-balasan" value={biodataMahasiswa?.link_surat_balasan || ""} />
                  </div>

                  <div className={`mb-3 p-2 rounded-lg flex flex-col ${biodataMahasiswa.level_akses === 6 ? "bg-green-600" : ""}`} >
                    <label htmlFor="id-pengajuan">Id Pengajuan Dosen Pembimbing : </label>
                    <input className="p-2 border border-gray-300 rounded-lg bg-gray-100" type="text" id="id-pengajuan" value={biodataMahasiswa?.id_surat_pengajuan_dospem || ""} />
                  </div>

                  <div className={`mb-3 p-2 rounded-lg flex flex-col ${biodataMahasiswa.level_akses === 8 ? "bg-green-600" : ""}`} >
                    <label htmlFor="surat-penunjukkan">Surat Penunjukkan Dosen Pembimbing : </label>
                    <input className="p-2 border border-gray-300 rounded-lg bg-gray-100" type="text" id="surat-penunjukkan" value={biodataMahasiswa?.link_surat_penunjukan_dospem || ""} />
                  </div>

                  <div className={`mb-3 p-2 rounded-lg flex flex-col ${biodataMahasiswa.level_akses === 10 ? "bg-green-600" : ""}`} >
                    <label htmlFor="surat-lanjut">Surat Perpanjangan KP : </label>
                    <input className="p-2 border border-gray-300 rounded-lg bg-gray-100" type="text" id="surat-lanjut" value={biodataMahasiswa?.link_surat_perpanjangan_kp || ""} />
                  </div>
                </div>

                {/* Action Buttons */}

                {biodataMahasiswa?.level_akses !== 0 && biodataMahasiswa?.level_akses % 2 === 0 && <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setIsRejectButtonClicked(true)} disabled={isLoading} className={"px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"}>
                    Tolak Permohonan
                  </button>
                  <form onSubmit={handleOnAccept}>
                  <button disabled={isLoading} className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50">
                    Validasi Permohonan
                  </button>
                  </form>
                </div>}
              </div>
            </Card>
          </>
        );
      case "Gagal":
      case "Lanjut":
        return (
          <>
            <Card className="mt-6 rounded-lg border border-gray-100 dark:border-gray-700 shadow-md overflow-hidden">
              <div className="p-6">
                <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
                  <ClipboardPenLine className="h-5 w-5 mr-2" />
                  Validasi Berkas
                </h1>

                {/* Periode Kerja Praktik */}
                <div className="mb-6 bg-white dark:bg-gray-800/50 rounded-lg p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <h2 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Periode Kerja Praktik
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Tanggal Mulai
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Calendar className="h-4 w-4 text-gray-500" />
                        </div>
                        <input
                          type="date"
                          key="tanggal_mulai_gagal"
                          value={biodataMahasiswa.tanggal_mulai.slice(0, 10).replaceAll("-", "/")}
                          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md block w-full pl-10 p-2.5 
                          dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:placeholder-gray-400 
                          focus:ring-primary focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Tanggal Selesai
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Calendar className="h-4 w-4 text-gray-500" />
                        </div>
                        <input
                        key="tanggal_selesai_gagal"
                          type="date"
                          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md block w-full pl-10 p-2.5 
                          dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:placeholder-gray-400 
                          focus:ring-primary focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {biodataMahasiswa.status === "Lanjut" && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-red-600">
                        Hari Ini Telah Lewat 7 Hari Dari Waktu Selesai Mahasiswa
                        !
                      </p>
                    </div>
                  )}
                </div>

                {/* Dokumen Penunjukan Dosen Pembimbing */}
                <div className="mb-6 bg-white dark:bg-gray-800/50 rounded-lg p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <h2 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Dokumen Penunjukan Dosen Pembimbing
                  </h2>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Link gdrive <span className="text-red-500">*</span>
                    </label>
                    <textarea
                    key="dokumen_penunjukkan_dosen_pembimbing"
                      placeholder="Masukkan link gdrive..."
                      className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md block w-full p-2.5 
                      dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:placeholder-gray-400 
                      focus:ring-primary focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                {/* Alasan Perpanjangan */}
                <div className="mb-6 bg-white dark:bg-gray-800/50 rounded-lg p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <h2 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
                    Alasan mengajukan perpanjangan waktu pelaksanaan KP
                    <span className="text-red-500">*</span>
                  </h2>

                  <div>
                    <textarea
                    key="tujuan_surat_instansi_perpanjangan_kp"
                      placeholder="Masukkan alasan perpanjangan..."
                      className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md block w-full p-2.5 
                      dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:placeholder-gray-400 
                      focus:ring-primary focus:border-primary focus:outline-none min-h-24 resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                  <Button disabled={isLoading} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-md shadow-sm transition-all duration-200">
                    Tolak Permohonan
                  </Button>
                  <Button disabled={isLoading} className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md shadow-sm transition-all duration-200">
                    Validasi Permohonan
                  </Button>
                </div>
              </div>
            </Card>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <DashboardLayout>
        <div className={`${isRejectButtonClicked ? "z-[49]": ""}`} onClick={() => isRejectButtonClicked ? setIsRejectButtonClicked(prev => !prev) : ""}>
       {response && <div className="fixed p-2 left-[50%] -translate-x-0.5 rounded-lg bg-green-600 text-white">{response && response.message}</div> }
       {isRejectButtonClicked && <div onClick={(e : any) => e.stopPropagation()} className="fixed flex flex-col justify-between h-[30%] gap-2 z-50 p-2 border-[1px] border-black bg-white rounded-lg left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">
        <h3 className="font-bold tracking-wide text-lg">Penolakan Berkas Mahasiswa</h3>
        <div className="flex flex-col">
        <label htmlFor="alasan-penolakan">Alasan Penolakan Berkas : </label>
        <input value={rejectMessage} onChange={(e) => setRejectMessage(e.currentTarget.value)} type="text" id="alasan-penolakan" className="rounded-lg border-[1px] border-slate-300 p-2" />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={() => setIsRejectButtonClicked(prev => !prev)} className="rounded-lg p-2">Batal</button>
          <form onClick={handleOnReject}>
          <button className="rounded-lg text-white bg-red-500 p-2">Tolak Berkas</button>
          </form>
        </div>
        </div>}
        {/* Biodata Section */}
        <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800/40 dark:to-gray-800/20 rounded-lg border border-gray-100 dark:border-gray-700 shadow-md overflow-hidden">
          {/* Header Section with Avatar */}
          <div className="bg-emerald-500  p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white dark:bg-gray-800 rounded-full h-12 w-12 flex items-center justify-center shadow-inner border border-primary/20">
                <User className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-50 dark:text-gray-100">
                  {name}
                </h3>
                <div className="flex items-center  text-sm text-gray-500 dark:text-gray-400">
                  <span className="bg-white text-gray-800 dark:bg-gray-800 border-gray-50 dark:border-gray-50 dark:text-gray-50 px-2 py-0.5 rounded-full text-xs font-medium mr-2">
                    Semester {6}
                  </span>
                  <span className="flex items-center text-white">
                    <span
                      className={`inline-block w-3 h-3 animate-pulse rounded-full mr-1.5 ${getstatusmahasiswa(
                        biodataMahasiswa.status
                      )}`}
                    ></span>
                    {biodataMahasiswa.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {nim}
              </span>
            </div>
          </div>

          {/* Info Cards */}
          <div className="p-4 bg-emerald-100">
            <div className=" grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* NIM Card */}
              <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-bl-full -translate-y-6 translate-x-6 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-300"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2.5">
                    <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800 dark:text-gray-400 uppercase tracking-wider">
                      Instansi
                    </p>
                    <p className="text-base  text-gray-500 dark:text-gray-200">
                      {biodataMahasiswa?.instansi?.nama || "Belum Ada Instansi"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Instansi Card */}
              <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 dark:bg-emerald-900/20 rounded-bl-full -translate-y-6 translate-x-6 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-300"></div>

                <div className="flex items-center gap-3 relative z-10">
                  <div className="bg-blue-100 dark:bg-emerald-900/30 rounded-lg p-2.5">
                    <ContactRound className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800 dark:text-gray-400 uppercase tracking-wider">
                      Pembimbing Instansi
                    </p>
                    <p className="text-base font-bold text-gray-800 dark:text-gray-200">
                      {biodataMahasiswa?.instansi?.pembimbing_instansi?.nama || "Belum Ada Pembimbing Instansi"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dosen Card */}
              <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 dark:bg-purple-900/20 rounded-bl-full -translate-y-6 translate-x-6 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-300"></div>

                <div className="flex items-center gap-3 relative z-10">
                  <div className="bg-blue-100 dark:bg-purple-900/30 rounded-lg p-2.5">
                    <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800 dark:text-gray-400 uppercase tracking-wider">
                      Dosen Pembimbing
                    </p>
                    <p className="text-base font-bold text-gray-800 dark:text-gray-200">
                      {biodataMahasiswa?.dosen_pembimbing?.nama || "Belum Ada Dosen Pembimbing"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Render content based on status */}
        {renderStatusContent()}
        </div>
      </DashboardLayout>
    </>
  );
};

export default KoordinatorKerjaPraktikPermohonanDetailPage;