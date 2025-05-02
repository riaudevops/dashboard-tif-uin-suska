import { useState } from "react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import {
  Calendar,
  Clock,
  GraduationCap,
  Info,
  Plus,
  User,
  ClipboardCheck,
  Building,
  FileEdit,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

const DosenKerjaPraktikMahasiswaDetail = () => {
  // State for tabs
  const [activeTab, setActiveTab] = useState("info");

  // Sample student data
  const student = {
    id: "12234537658", // From the image
    name: "Muh. Zaki Erbai Syas",
    photo: "/path/to/muh-zaki.jpg",
    semester: 5,
    supervisionCount: 2, // From the image
    status: "Kerja Praktik", // From the image
    lastSupervision: "15 April 2025",
    program: "Teknik Informatika",
    reportTitle: "Pengembangan Aplikasi Perpustakaan", // From the image
    supervisor: "Sarinah, M.Pd", // From the image
    company: "RAPP", // From the image
    startDate: "1 Maret 2025",
    endDate: "30 Juni 2025",
  };

  // Sample agenda data
  const agendaData = [
    {
      id: 1,
      date: "1 Maret 2025",
      activity: "Perkenalan dengan tim IT",
      status: "Selesai",
      notes: "Bertemu dengan supervisor dan tim IT perusahaan",
    },
    {
      id: 2,
      date: "3 Maret 2025",
      activity: "Analisis kebutuhan aplikasi",
      status: "Selesai",
      notes: "Mengidentifikasi kebutuhan fungsional dan non-fungsional",
    },
    {
      id: 3,
      date: "15 Maret 2025",
      activity: "Desain database",
      status: "Selesai",
      notes: "Membuat ERD dan struktur tabel",
    },
    {
      id: 4,
      date: "1 April 2025",
      activity: "Implementasi frontend",
      status: "Sedang Berlangsung",
      notes: "Membuat UI halaman utama dan manajemen buku",
    },
    {
      id: 5,
      date: "20 April 2025",
      activity: "Implementasi backend",
      status: "Belum Mulai",
      notes: "Mengembangkan API dan logika bisnis",
    },
  ];

  // Sample supervision history
  const supervisionHistory = [
    {
      id: 1,
      date: "5 Maret 2025",
      time: "10:00 - 11:30",
      type: "Online",
      topic: "Diskusi rencana kerja praktik",
      progress: "25%",
      notes:
        "Mahasiswa telah menyusun rencana kerja dengan baik. Perlu menambahkan timeline yang lebih detail.",
      files: ["rencana-kerja.pdf"],
      status: "Selesai",
      evaluated: true,
    },
    {
      id: 2,
      date: "15 April 2025",
      time: "13:00 - 14:30",
      type: "Tatap Muka",
      topic: "Progress implementasi frontend",
      progress: "40%",
      notes:
        "Mahasiswa menunjukkan progress pembuatan UI. Perlu perbaikan pada tampilan mobile.",
      files: ["ui-screenshots.pdf", "code-progress.zip"],
      status: "Selesai",
      evaluated: false,
    },
  ];

  // Function to get initials from name
  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    } else {
      return name.substring(0, 2).toUpperCase();
    }
  };

  // Function to get status color for badges
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Kerja Praktik":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "Seminar Kerja Praktik":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      case "Selesai":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "Sedang Berlangsung":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "Belum Mulai":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Function to get status gradient colors for profile header
  const getStatusGradientColors = (status: string) => {
    switch (status) {
      case "Kerja Praktik":
        return "from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800";
      case "Seminar Kerja Praktik":
        return "from-purple-500 to-purple-600 dark:from-purple-700 dark:to-purple-800";
      case "Selesai":
        return "from-green-500 to-green-600 dark:from-green-700 dark:to-green-800";
      case "Skripsi":
        return "from-yellow-500 to-yellow-600 dark:from-yellow-700 dark:to-yellow-800";
      case "Magang":
        return "from-indigo-500 to-indigo-600 dark:from-indigo-700 dark:to-indigo-800";
      default:
        return "from-gray-500 to-gray-600 dark:from-gray-700 dark:to-gray-800";
    }
  };

  // Function to get status color for profile avatar
  const getStatusAvatarColor = (status: string) => {
    switch (status) {
      case "Kerja Praktik":
        return "from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700";
      case "Seminar Kerja Praktik":
        return "from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700";
      case "Selesai":
        return "from-green-500 to-green-600 dark:from-green-600 dark:to-green-700";
      case "Skripsi":
        return "from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700";
      case "Magang":
        return "from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700";
      default:
        return "from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700";
    }
  };

  // Function to handle adding a new supervision
  const handleAddSupervision = () => {
    // Implementation would be added here, possibly with a modal
    alert("Tambah bimbingan baru");
  };

  // Function to handle supervision evaluation
  const handleEvaluateSupervision = (supervisionId: string) => {
    // Implementation would be added here, possibly with a modal
    alert(`Evaluasi bimbingan ID: ${supervisionId}`);
  };

  return (
    <DashboardLayout>
      <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Page Title */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Detail Mahasiswa Bimbingan</h1>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
              student.status
            )}`}
          >
            {student.status}
          </div>
        </div>

        {/* Enhanced Student Profile Card with Dynamic Colors */}
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl overflow-hidden shadow-md mb-8">
          <div
            className={`bg-gradient-to-r ${getStatusGradientColors(
              student.status
            )} h-24`}
          ></div>

          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-start -mt-12 gap-6">
              {/* Profile Picture / Initials with Dynamic Colors */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div
                  className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center text-white font-bold text-3xl bg-gradient-to-br ${getStatusAvatarColor(
                    student.status
                  )} shadow-md`}
                >
                  {getInitials(student.name)}
                </div>
              </div>

              {/* Student Information */}
              <div className="flex-1 pt-4 md:pt-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center md:text-left">
                      {student.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-center md:text-left">
                      {student.id}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 mx-auto md:mx-0">
                    <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                      <GraduationCap className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span>Semester {student.semester}</span>
                    </span>
                    <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                      <ClipboardCheck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span>{student.supervisionCount} Bimbingan</span>
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Report Title */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Judul Laporan
                          </h3>
                          <p className="font-semibold text-gray-900 dark:text-white mt-1">
                            {student.reportTitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Academic & KP Info */}
                    <div className="bg-gray-50 dark:bg-gray-800/30 border dark:border-gray-700 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                        Informasi Kerja Praktik
                      </h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex gap-2">
                          <Building className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Instansi/Perusahaan
                            </p>
                            <p className="font-medium text-sm">
                              {student.company}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <User className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Pembimbing Instansi
                            </p>
                            <p className="font-medium text-sm">
                              {student.supervisor}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Mulai KP
                            </p>
                            <p className="font-medium text-sm">
                              {student.startDate}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Selesai KP
                            </p>
                            <p className="font-medium text-sm">
                              {student.endDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs Navigation */}
        <div className="flex mb-1 border-b dark:border-gray-700">
          <button
            className={`py-3 px-6 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === "info"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 "
            }`}
            onClick={() => setActiveTab("info")}
          >
            <Calendar className="h-4 w-4" />
            <span>Agenda Kerja Praktik</span>
          </button>
          <button
            className={`py-3 px-6 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === "supervision"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab("supervision")}
          >
            <ClipboardCheck className="h-4 w-4" />
            <span>Riwayat Bimbingan</span>
          </button>
        </div>

        {/* Tab Content with Enhanced Styling */}
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl overflow-hidden shadow-md">
          {/* Agenda Tab */}
          {activeTab === "info" && (
            <div>
              <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <span>Agenda Kegiatan Kerja Praktik</span>
                </h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {agendaData.length} Kegiatan
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50">
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        No
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Tanggal
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Kegiatan
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Catatan
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {agendaData.map((agenda, index) => (
                      <tr
                        key={agenda.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-medium">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{agenda.date}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 font-medium">
                          {agenda.activity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full inline-flex items-center gap-1 ${getStatusBadgeColor(
                              agenda.status
                            )}`}
                          >
                            {agenda.status === "Selesai" && (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                            {agenda.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {agenda.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Supervision History Tab */}
          {activeTab === "supervision" && (
            <div>
              <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-blue-500" />
                  <span>Riwayat Bimbingan</span>
                </h2>
                <button
                  onClick={handleAddSupervision}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Bimbingan</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50">
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        No
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Tanggal
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Waktu
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Tipe
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {supervisionHistory.map((supervision, index) => (
                      <tr
                        key={supervision.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-medium">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{supervision.date}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>{supervision.time}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 font-medium">
                          {supervision.topic}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() =>
                              handleEvaluateSupervision(
                                supervision.id.toString() || ""
                              )
                            }
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs shadow-sm transition-colors ${
                              supervision.evaluated
                                ? "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300"
                                : "bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 hover:shadow"
                            }`}
                            disabled={supervision.evaluated}
                          >
                            <FileEdit className="h-3 w-3" />
                            {supervision.evaluated
                              ? "Sudah Dievaluasi"
                              : "Evaluasi Bimbingan"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {supervisionHistory.length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-3 mb-4">
                    <Info className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  </div>
                  <h3 className="font-medium text-lg mb-1">
                    Belum Ada Data Bimbingan
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">
                    Belum ada rekaman bimbingan untuk mahasiswa ini. Klik tombol
                    "Tambah Bimbingan" untuk menambahkan data bimbingan baru.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DosenKerjaPraktikMahasiswaDetail;
