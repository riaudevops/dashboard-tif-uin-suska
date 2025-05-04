import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { Search, Filter, Info, ChevronRight, BarChart, X, Calendar, GraduationCap, User } from "lucide-react";

export const DosenKerjaPraktikmahasiswaBimbinganpage = () => {
  const navigate = useNavigate();
  const [academicYear, setAcademicYear] = useState("2023-2024 Ganjil");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Total Bimbingan");

  // Sample data
  const stats = [
    { title: "Total Bimbingan", count: 8, label: "Mahasiswa" },
    { title: " Kerja Praktik", count: 1, label: "Mahasiswa" },
    { title: " Seminar Kerja Praktik", count: 2, label: "Mahasiswa" },
    { title: "Lanjut", count: 0, label: "Mahasiswa" },
    { title: "Selesai", count: 5, label: "Mahasiswa" },
  ];

  // Updated to include 8 students total
  const students = [
    {
      id: "12250114256",
      name: "Muh. Zaki Erbai Syas",
      photo: "/path/to/muh-zaki.jpg",
      semester: 5,
      supervisionCount: 3,
      status: "Kerja Praktik",
      lastSupervision: "15 April 2025",
    },
    {
      id: "12250114257",
      name: "Ahmad Kurniawan",
      photo: "/path/to/ahmad.jpg",
      semester: 5,
      supervisionCount: 2,
      status: "Seminar Kerja Praktik",
      lastSupervision: "12 April 2025",
    },
    {
      id: "12250114258",
      name: "Farras Lathief",
      photo: "/path/to/farras.jpg",
      semester: 5,
      supervisionCount: 4,
      status: "Selesai",
      lastSupervision: "10 April 2025",
    },
    {
      id: "12250114259",
      name: "Rini Wulandari",
      photo: "/path/to/rini.jpg",
      semester: 5,
      supervisionCount: 5,
      status: "Seminar Kerja Praktik",
      lastSupervision: "8 April 2025",
    },
    {
      id: "12250114260",
      name: "Dewi Safitri",
      photo: "/path/to/dewi.jpg",
      semester: 6,
      supervisionCount: 3,
      status: "Selesai",
      lastSupervision: "5 April 2025",
    },
    {
      id: "12250114261",
      name: "Budi Santoso",
      photo: "/path/to/budi.jpg",
      semester: 6,
      supervisionCount: 4,
      status: "Selesai",
      lastSupervision: "3 April 2025",
    },
    {
      id: "12250114262",
      name: "Andi Firmansyah",
      photo: "/path/to/andi.jpg",
      semester: 5,
      supervisionCount: 6,
      status: "Selesai",
      lastSupervision: "1 April 2025",
    },
    {
      id: "12250114263",
      name: "Fitra Ramadhan",
      photo: "/path/to/fitra.jpg",
      semester: 6,
      supervisionCount: 5,
      status: "Selesai",
      lastSupervision: "28 Maret 2025",
    },
  ];

  // Function to get initials from name (first 2 letters)
  const getInitials = (name: string) => {
    // Split the name by spaces and get the first two characters
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      // Get first letter of first name and first letter of last name
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    } else {
      // If only one name, get the first two letters
      return name.substring(0, 2).toUpperCase();
    }
  };

  // Function to get background color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Kerja Praktik":
        return "bg-blue-500";
      case "Seminar Kerja Praktik":
        return "bg-purple-500";
      case "Lanjut":
        return "bg-orange-500";
      case "Gagal":
        return "bg-red-500";
      case "Selesai":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // Function to get border color based on status
  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case "Kerja Praktik":
        return "border-blue-400";
      case "Seminar Kerja Praktik":
        return "border-purple-400";
      case "Lanjut":
        return "border-orange-400";
      case "Gagal":
        return "border-red-400";
      case "Selesai":
        return "border-green-400";
      default:
        return "border-gray-400";
    }
  };

  // Function to get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Kerja Praktik":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "Seminar Kerja Praktik":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      case "Lanjut":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
      case "Gagal":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      case "Selesai":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Status filter options
  const filterOptions = [
    "Total Bimbingan",
    "Kerja Praktik",
    "Seminar Kerja Praktik",
    "Lanjut",
    "Selesai",
    "Gagal",
  ];

  // Function to apply filter
  const applyFilter = (filter : string) => {
    setSelectedFilter(filter);
    setShowFilterDropdown(false);
  };

  // Function to get filtered students
  const getFilteredStudents = () => {
    // First apply status filter
    let filtered = selectedFilter === "Total Bimbingan" 
      ? students 
      : students.filter((student) => student.status === selectedFilter);
    
    // Then apply search filter if there's a search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(query) ||
          student.id.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  // Get filtered students
  const filteredStudents = getFilteredStudents();

  // Function to handle navigation to detail page
  const handleNavigateToDetail = (studentId : string) => {
    navigate(`/dosen/kerja-praktik/mahasiswa-bimbingan-kp/detail/${studentId}`);
  };

  // Handle search input change
  const handleSearchChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <DashboardLayout>
      <div className="p-4 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Mahasiswa Bimbingan Anda</h1>

        {/* Academic Year Selector */}
        <div className="mb-6">
          <div className="flex items-center gap-2 dark:from-gray-900 dark:to-gray-800 ">
            <span className="text-sm font-medium">Tahun Ajaran</span>
            <div className="relative">
              <select
                className="border rounded-md px-3 py-1 pr-8 text-sm appearance-none  dark:bg-gray-800 shadow-sm"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
              >
                <option value="2023-2024 Ganjil">2023-2024 Ganjil</option>
                <option value="2023-2024 Genap">2023-2024 Genap</option>
                <option value="2022-2023 Ganjil">2022-2023 Ganjil</option>
                <option value="2022-2023 Genap">2022-2023 Genap</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <ChevronRight className="h-4 w-4 text-gray-500 rotate-90" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 ">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={` dark:bg-gray-800/30 border p-4 rounded-lg shadow-sm ${
                index === 0
                  ? "border-l-8 border-blue-500"
                  : "border-l-8 border-teal-500"
              }`}
            >
              <h3 className="text-sm text-gray-700 dark:text-white">
                {stat.title}
              </h3>
              <p className="text-4xl font-bold my-2">{stat.count}</p>
              <p className="text-xs text-blue-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filter and Search Bar - MODIFIED THIS SECTION */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {/* Filter Button with Dropdown */}
          <div className="relative sm:w-auto">
            <button 
              className="flex items-center gap-2 dark:bg-gray-800/30 border px-4 py-2 rounded-md text-sm w-full"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <Filter className="h-4 w-4" />
              <span>Filter Status</span>
            </button>
            
            {/* Filter Dropdown */}
            {showFilterDropdown && (
              <div className="absolute z-10 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border dark:border-gray-700">
                <div className="flex justify-between items-center px-4 py-2 border-b dark:border-gray-700">
                  <span className="font-medium">Filter Status</span>
                  <button 
                    onClick={() => setShowFilterDropdown(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="py-1">
                  {filterOptions.map((option) => (
                    <button
                      key={option}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        selectedFilter === option ? "bg-blue-50 dark:bg-gray-700 font-medium text-blue-600 dark:text-blue-400" : ""
                      }`}
                      onClick={() => applyFilter(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Input with Clear Button - Now this takes all remaining space */}
          <div className="relative flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau NIM..."
                className="w-full border dark:bg-gray-800/30 rounded-md pl-10 pr-10 py-2 text-sm"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="flex justify-between items-center mb-6 text-sm">
          <div className="flex flex-wrap gap-2">
            {selectedFilter !== "Total Bimbingan" && (
              <div className="bg-blue-50 dark:bg-gray-700/30 shadow-sm px-3 py-1 rounded-full flex items-center gap-1">
                <span className="text-blue-600 dark:text-blue-400">{selectedFilter}</span>
                <button
                  onClick={() => applyFilter("Total Bimbingan")}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {searchQuery && (
              <div className="bg-blue-50 dark:bg-gray-700 px-3 py-1 rounded-full flex items-center gap-1">
                <span className="text-blue-600 dark:text-blue-400">Pencarian: {searchQuery}</span>
                <button
                  onClick={clearSearch}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
          
          {/* Data Information */}
          <div className="flex items-center gap-2 dark:text-gray-400">
            <Info className="h-4 w-4 dark:text-gray-400" />
            <span>{filteredStudents.length} Data Ditemukan</span>
          </div>
        </div>

        {/* Student Cards - 2 columns grid on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student, index) => (
              <div
                key={index}
                className="dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Card Header with Status Badge */}
                <div className="px-4 py-3 border-b dark:border-gray-700 flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(student.status)}`}>
                    {student.status}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Terakhir bimbingan: {student.lastSupervision}
                  </span>
                </div>
                
                {/* Card Content */}
                <div className="p-4 bg-white dark:bg-gray-800/30">
                  <div className="flex items-start gap-4">
                    {/* Student Initials Avatar */}
                    <div className="flex-shrink-0">
                      <div 
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl border-2 ${getStatusBorderColor(student.status)} ${getStatusColor(student.status)} shadow-sm`}
                      >
                        {getInitials(student.name)}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-lg dark:text-white mb-1">
                        {student.name}
                      </h3>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                          <span className="flex items-center gap-1 w-24">
                            <User className="h-3 w-3" />
                            NIM</span>
                          <span className="font-medium">: {student.id}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                          <span className="w-24 flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" />
                            Semester
                          </span>
                          <span className="font-medium">: {student.semester}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                          <span className="w-24 flex items-center gap-1">
                            <BarChart className="h-3 w-3" />
                            Bimbingan
                          </span>
                          <span className="font-medium">: {student.supervisionCount} kali</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex justify-end p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <button 
                    className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors py-1 px-3 rounded-md hover:bg-blue-50 dark:hover:bg-gray-800"
                    onClick={() => handleNavigateToDetail(student.id)}
                  >
                    <span>Lihat Detail</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 py-12 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-3 mb-4">
                <Info className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="font-medium text-lg mb-1">Tidak Ada Data</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">
                {searchQuery 
                  ? `Tidak ada mahasiswa yang cocok dengan pencarian "${searchQuery}"${selectedFilter !== "Total Bimbingan" ? ` dengan status "${selectedFilter}"` : ""}.` 
                  : `Tidak ada mahasiswa bimbingan dengan status "${selectedFilter}" pada tahun ajaran ini.`}
              </p>
              {(searchQuery || selectedFilter !== "Total Bimbingan") && (
                <button 
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedFilter("Total Bimbingan");
                  }}
                >
                  Reset Filter
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DosenKerjaPraktikmahasiswaBimbinganpage;