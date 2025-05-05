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

export const KoordinatorKerjaPraktikPermohonanDetailPage = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const name = query.get("name") || "-";
  const nim = query.get("nim") || "-";

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

  // Mock data - in a real app, this would come from your API
  const biodataMahasiswa = {
    name: "John Doe",
    nim: "123456789",
    status: "Baru", 
    instansi: "PT. ABC",
    semester: 6,
    PembimbingInstansi: "Jane Smith",
    dosenPembimbing: "Dr. John Smith",
    tanggalMulai: "03/02/2024",
    tanggalSelesai: "03/05/2024",
    linkGdrive: "http://drive.google.com/drive/folders/file.pdf",
    alasanPerpanjangan: "Habis masa waktu",
  };

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
                        type="date"
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
                      className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md block w-full p-2.5 
                      dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:placeholder-gray-400 
                      focus:ring-primary focus:border-primary focus:outline-none min-h-24 resize-none"
                      placeholder="Masukkan tujuan surat"
                    ></textarea>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                  <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md shadow-sm transition-all duration-200">
                    Tolak Permohonan
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md shadow-sm transition-all duration-200">
                    Validasi Permohonan
                  </button>
                </div>
              </div>
            </Card>
          </>
        );

      case "Lanjut":
      case "Gagal":
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
                      placeholder="Masukkan alasan perpanjangan..."
                      className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md block w-full p-2.5 
                      dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:placeholder-gray-400 
                      focus:ring-primary focus:border-primary focus:outline-none min-h-24 resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                  <Button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-md shadow-sm transition-all duration-200">
                    Tolak Permohonan
                  </Button>
                  <Button className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md shadow-sm transition-all duration-200">
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
                    Semester {biodataMahasiswa.semester}
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
                      {biodataMahasiswa.status === "Baru"
                        ? "Belum ada instansi"
                        : biodataMahasiswa.instansi}
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
                      {biodataMahasiswa.PembimbingInstansi}
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
                      {biodataMahasiswa.dosenPembimbing}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Render content based on status */}
        {renderStatusContent()}
      </DashboardLayout>
    </>
  );
};

export default KoordinatorKerjaPraktikPermohonanDetailPage;
