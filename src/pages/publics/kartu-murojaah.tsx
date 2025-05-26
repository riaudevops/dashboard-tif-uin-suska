import {
  BookOpen,
  FileBadge,
  Mail,
  MapPin,
  PhoneCall,
  User,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DarkLogoUSR from "@/assets/svgs/dark-logo-usr";
import LightLogoUSR from "@/assets/svgs/light-logo-usr";
import { useTheme } from "@/components/themes/theme-provider";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import APISetoran from "@/services/api/public/setoran-hafalan.service";
// import AnimatedPercentage from "./animate-angka";
import ProgressChart from "./progress-bar";
// import ProgressChart from "./progress-bar";
const KartuMurojaahPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: dataRingkasan, isSuccess } = useQuery({
    queryKey: ["kartu-murojaah-digital", id],
    queryFn: () =>
      APISetoran.getKartuMurojaahDigital({ id: id! }).then((data) => data),
    staleTime: Infinity,
  });

  console.log(dataRingkasan);
  // console.log(isSuccess);
  const infoDataMahasiswa = dataRingkasan?.data?.info;
  const dataRingkasanSetoran = dataRingkasan?.data?.setoran?.ringkasan;
  console.log(dataRingkasanSetoran);
  const dataSurah = dataRingkasan?.data?.setoran?.detail;
  const { theme } = useTheme();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="p-2 border-b border-gray-200 mb-3">
        <div className="flex items-center gap-1.5 px-2 rounded-xl">
          {theme === "dark" ? (
            <DarkLogoUSR className="w-8 h-8" />
          ) : (
            <LightLogoUSR className="w-8 h-8" />
          )}
          <span className="text-base font-semibold">
            dashboard<span className="italic font-medium">.tif-usr</span>
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Informasi Mahasiswa */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-6">
          <div className="flex items-center mb-6">
            <User className="w-8 h-8 text-blue-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-800">
              Informasi Mahasiswa
            </h3>
          </div>
          <div className="flex flex-col gap-4 justify-center items-center">
            <div className="flex flex-col items-center justify-center">
              <div className="flex h-20 w-20 rounded-full bg-green-300 border-2 border-gray-200">
                <div className="flex items-center justify-center h-full w-full rounded-full bg-blue-300 text-2xl">
                  {infoDataMahasiswa?.nama
                    .split(" ")
                    .slice(0, 2)
                    .map((word: string) => word.charAt(0))
                    .join("")}
                </div>
              </div>
              <div className="text-lg font-bold">{infoDataMahasiswa?.nama}</div>
              <div className="text-sm text-gray-500">
                {infoDataMahasiswa?.nim}
              </div>
            </div>

            {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"> */}
            {/* <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <label className="block text-sm font-semibold text-blue-600 mb-1">
                Nama Lengkap
                </label>
                <p className="text-lg font-bold text-gray-800">
                {infoDataMahasiswa?.nama}
                </p>
                </div> */}
            {/* <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <label className="block text-sm font-semibold text-green-600 mb-1">
                NIM
                </label>
                <p className="text-lg font-bold text-gray-800">
                {infoDataMahasiswa?.nim}
                </p>
                </div> */}
            <div className="rounded-xl grid grid-cols-2 gap-2 w-full md:gap-11">
              <div className="bg-green-50 rounded-xl border py-4 px-2">
                <label className="block text-sm font-semibold text-purple-600 mb-1">
                  Semester
                </label>
                <p className="text-lg font-bold text-gray-800">
                  {infoDataMahasiswa?.semester}
                </p>
              </div>
              <div className="bg-red-50 rounded-xl border py-4 px-2">
                <label className="block text-sm font-semibold text-purple-600 mb-1">
                  Angkatan
                </label>
                <p className="text-lg font-bold text-gray-800">
                  {infoDataMahasiswa?.angkatan}
                </p>
              </div>
              {/* <div className="bg-pink-50 py-4 px-2 rounded-xl border border-pink-100">
                  <label className="block text-sm font-semibold text-pink-600 mb-1">
                  Angkatan
                  </label>
                  <p className="text-lg font-bold text-gray-800">
                  {infoDataMahasiswa?.angkatan}
                  </p>
                  </div> */}
              {/* </div> */}
            </div>
          </div>
        </div>

        {/* Progress Hafalan Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-6">
          <div className="flex items-center mb-6">
            <BookOpen className="w-8 h-8 text-green-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-800">
              Progress Muroja'ah Juz 30
            </h3>
          </div>
          <div className="grid md:grid-cols-5 gap-6">
            {dataRingkasanSetoran?.map((item, index) => {
              // Define colors for each card
              const colors = [
                "from-blue-500 to-blue-600",
                "from-green-500 to-green-600", // SEMKP
                "from-purple-500 to-purple-600", // DAFTAR_TA
                "from-orange-500 to-orange-600", // SEMPRO
                "from-yellow-500 to-yellow-600", // SIDANG_TA
              ];

              // Define display names for each label
              const displayNames = {
                KP: "Kerja Praktik",
                SEMKP: "Seminar Kerja Praktik",
                DAFTAR_TA: "Tugas Akhir",
                SEMPRO: "Seminar Proposal",
                SIDANG_TA: "Sidang Akhir",
              };

              return (
                <div
                  key={item.label || index}
                  className={`text-center bg-gradient-to-br ${
                    colors[index] || "from-gray-500 to-gray-600"
                  } text-white rounded-xl shadow-lg flex flex-col items-center justify-center px-3 py-6`}
                >
                  <div className="text-xl font-medium mb-2 md:text-base">
                    {displayNames[item.label] || item.label}
                  </div>
                  {/* <AnimatedPercentage target={item.persentase_progres_setor} /> */}
                  <ProgressChart targetProgress={item.persentase_progres_setor}/>
                  {/* <p className="text-3xl font-bold">
                    {item.persentase_progres_setor} %
                    </p> */}
                  <div className="mt-2 text-xs opacity-75">
                    <div>
                      {item.total_sudah_setor}/{item.total_wajib_setor}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail Surah */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-6">
          <div className="flex items-center mb-6">
            <FileBadge className="w-8 h-8 text-yellow-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-800">Detail Surah</h3>
          </div>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-blue-50 to-green-50">
                  <TableHead className="text-left p-4 font-semibold text-gray-700 border-b border-gray-200">
                    No.
                  </TableHead>
                  <TableHead className="text-left p-4 font-semibold text-gray-700 border-b border-gray-200">
                    Nama Surah
                  </TableHead>
                  <TableHead className="text-center p-4 font-semibold text-gray-700 border-b border-gray-200">
                    Tanggal Muroja'ah
                  </TableHead>
                  <TableHead className="text-center p-4 font-semibold text-gray-700 border-b border-gray-200">
                    Dosen Yang Mengesahkan
                  </TableHead>
                  <TableHead className="text-center p-4 font-semibold text-gray-700 border-b border-gray-200">
                    Status Muroja'ah
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataSurah?.map((surah, index) => (
                  <TableRow
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="p-4 font-medium text-gray-800">
                      {index + 1}.
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="font-semibold text-gray-800">
                        {surah.nama} - {surah.nama_arab}
                      </div>
                    </TableCell>
                    <TableCell className="p-4 text-center text-gray-600">
                      {surah?.sudah_setor &&
                        new Date(surah?.info_setoran?.tgl_setoran)
                          .toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                          .replace(/^(\d+)\s(\w+)\s(\d+)$/, "$1 $2, $3")}
                    </TableCell>
                    <TableCell className="p-4 text-center text-gray-600">
                      {surah?.info_setoran?.dosen_yang_mengesahkan.nama}
                    </TableCell>

                    <TableCell className="p-4 text-center">
                      <span
                        className={`${
                          surah.sudah_setor
                            ? "text-green-800 bg-green-100 border-green-200"
                            : "text-red-800 bg-red-100 border-red-200"
                        } px-3 py-1 rounded-full text-sm font-medium border`}
                      >
                        {surah.sudah_setor ? "Selesai" : "Belum"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Action Buttons */}
        {/* <div className="grid md:grid-cols-3 gap-4 mb-6">
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <Eye className="w-5 h-5 mr-2" />
            Lihat Dokumen PDF
          </button>
          <button className="bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <Download className="w-5 h-5 mr-2" />
            Download Dokumen
          </button>
          <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <Printer className="w-5 h-5 mr-2" />
            Cetak Laporan
          </button>
        </div> */}

        {/* Footer */}
      </div>
      <footer className="flex flex-col border-t">
        <div className="z-10 px-16 pb-8 pt-4">
          <div className="grid grid-cols-1 gap-8 text-center md:text-start md:grid-cols-3">
            {/* Logo and Copyright Section */}
            <div className="flex flex-col items-center space-y-4 md:items-start">
              <div className="flex items-center gap-1.5 rounded-xl">
                {theme === "dark" ? (
                  <DarkLogoUSR className="w-8 h-8" />
                ) : (
                  <LightLogoUSR className="w-8 h-8" />
                )}
                <span className="text-base font-semibold">
                  dashboard
                  <span className="italic font-medium">.tif-usr</span>
                </span>
              </div>
              <p className="text-sm">
                Teknik Informatika. © 2025. All rights reserved.
              </p>
            </div>
            {/* Contact Section */}
            <div className="flex justify-end">
              <div className="flex flex-col items-center space-y-4 md:items-start">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 " />
                  <span className="">+62878-6868-5950</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 " />
                  <a target="_blank" href="mailto:tif@uin-suska.ac.id">
                    tif@uin-suska.ac.id
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="hidden w-5 h-5 md:block" />
                  <p className="">Jl. HR. Soebrantas No.155 KM 18</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4 md:justify-end ">
              <a href="#">
                <span className="sr-only">Facebook</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#">
                <span className="sr-only">Twitter</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#">
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a target="_blank" href="https://www.instagram.com/tifuinsuska/">
                <span className="sr-only">Instagram</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default KartuMurojaahPage;
