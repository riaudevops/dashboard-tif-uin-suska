import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import {
  Search,
  Filter,
  Info,
  ChevronRight,
  BarChart,
  X,
  Calendar,
  GraduationCap,
  User,
  ArrowRight,
  Clock,
  CheckCircle,
  BookOpen,
  FileText,
  Presentation,
  Award,
  AlertTriangle,
} from "lucide-react";

export const DosenKerjaPraktikmahasiswaBimbinganpage = () => {
  const navigate = useNavigate();
  const [academicYear, setAcademicYear] = useState("2023-2024 Ganjil");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Total Bimbingan");
  const [isLoaded, setIsLoaded] = useState(false);

  // Add animation effect after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Sample data
  const stats = [
    { title: "Total Bimbingan", count: 8, label: "Mahasiswa" },
    { title: " Kerja Praktik", count: 1, label: "Mahasiswa" },
    { title: " Seminar Kerja Praktik", count: 2, label: "Mahasiswa" },
    { title: " Lanjut", count: 0, label: "Mahasiswa" },
    { title: " Selesai", count: 5, label: "Mahasiswa" },
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
  const getInitials = (name : string) => {
    // Split the name by spaces and get the first two characters
    const nameParts = name.split(" ");
    if (nameParts.length >= 2) {
      // Get first letter of first name and first letter of last name
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    } else {
      // If only one name, get the first two letters
      return name.substring(0, 2).toUpperCase();
    }
  };

  // Function to get status colors and gradients and icons
  const getStatusStyles = (status : string) => {
    switch (status) {
      case "Kerja Praktik":
        return {
          gradient: "bg-gradient-to-r from-blue-500 to-blue-600",
          glow: "shadow-blue-500/20",
          border: "border-blue-400",
          badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
          lightBg: "bg-blue-50 dark:bg-blue-900/10",
          icon: <BookOpen className="h-5 w-5" />
        };
      case "Seminar Kerja Praktik":
        return {
          gradient: "bg-gradient-to-r from-purple-500 to-indigo-600",
          glow: "shadow-purple-500/20",
          border: "border-purple-400",
          badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
          lightBg: "bg-purple-50 dark:bg-purple-900/10",
          icon: <Presentation className="h-5 w-5" />
        };
      case "Lanjut":
        return {
          gradient: "bg-gradient-to-r from-orange-500 to-amber-600",
          glow: "shadow-orange-500/20",
          border: "border-orange-400",
          badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
          lightBg: "bg-orange-50 dark:bg-orange-900/10",
          icon: <FileText className="h-5 w-5" />
        };
      case "Gagal":
        return {
          gradient: "bg-gradient-to-r from-red-500 to-rose-600",
          glow: "shadow-red-500/20",
          border: "border-red-400",
          badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
          lightBg: "bg-red-50 dark:bg-red-900/10",
          icon: <AlertTriangle className="h-5 w-5" />
        };
      case "Selesai":
        return {
          gradient: "bg-gradient-to-r from-green-500 to-emerald-600",
          glow: "shadow-green-500/20",
          border: "border-green-400",
          badge: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
          lightBg: "bg-green-50 dark:bg-green-900/10",
          icon: <Award className="h-5 w-5" />
        };
      default:
        return {
          gradient: "bg-gradient-to-r from-gray-500 to-gray-600",
          glow: "shadow-gray-500/20",
          border: "border-gray-400",
          badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
          lightBg: "bg-gray-50 dark:bg-gray-900/10",
          icon: <Info className="h-5 w-5" />
        };
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
    let filtered =
      selectedFilter === "Total Bimbingan"
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

  // Handle search input change
  const handleSearchChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
  };

  // Framer motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 15
      }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  // New up and down animation variant replacing the rotate variant
  const floatVariants = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold mb-4">Mahasiswa Bimbingan Anda</h1>

          {/* Academic Year Selector */}
          <div className="flex items-center gap-2 dark:text-gray-200">
            <span className="text-sm font-medium">Tahun Ajaran</span>
            <div className="relative">
              <select
                className="border rounded-md px-3 py-1 pr-8 text-sm appearance-none dark:bg-gray-800 shadow-sm"
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
        </motion.div>

        {/* Stats Cards with Animation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={statsVariants}
              whileHover={{ 
                y: -5, 
                transition: { duration: 0.2 } 
              }}
              className={`rounded-lg shadow-lg overflow-hidden ${
                index === 0
                  ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white"
                  : "bg-gradient-to-br from-teal-500 to-teal-700 text-white"
              }`}
            >
              <div className="p-5 relative overflow-hidden">
                <motion.div 
                  className="absolute -right-3 top-10 opacity-10"
                  variants={floatVariants}
                  animate="float"
                >
                  {index === 0 ? (
                    <User size={80} strokeWidth={1} />
                  ) : index === 1 ? (
                    <BarChart size={80} strokeWidth={1} />
                  ) : index === 2 ? (
                    <GraduationCap size={80} strokeWidth={1} />
                  ) : index === 3 ? (
                    <Calendar size={80} strokeWidth={1} />
                  ) : (
                    <CheckCircle size={80} strokeWidth={1} />
                  )}
                </motion.div>
                <h3 className="text-sm font-medium opacity-90">{stat.title}</h3>
                <p className="text-3xl font-bold my-2">{stat.count}</p>
                <p className="text-xs opacity-80">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filter and Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 mb-4"
        >
          {/* Filter Button with Dropdown */}
          <div className="relative sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 dark:bg-gray-800 border dark:border-gray-700 px-4 py-2 rounded-md text-sm w-full shadow-sm hover:shadow-md transition-all"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <Filter className="h-4 w-4" />
              <span>Filter Status</span>
            </motion.button>

            {/* Filter Dropdown */}
            <AnimatePresence>
              {showFilterDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-20 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-xl py-1 border dark:border-gray-700"
                >
                  <div className="flex justify-between  items-center px-4 py-2 border-b dark:border-gray-700">
                    <span className="font-medium">Filter Status</span>
                    <motion.button
                      whileHover={{ rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowFilterDropdown(false)}
                      className="text-gray-500 hover:text-gray-700  dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  </div>
                  <div className="py-1">
                    {filterOptions.map((option) => (
                      <motion.button
                        key={option}
                        whileHover={{ 
                          backgroundColor: "rgba(59, 130, 246, 0.1)",
                          x: 5
                        }}
                        className={`w-full text-left px-4 py-2 text-sm z-50 hover:bg-blue-50 dark:hover:bg-gray-700 ${
                          selectedFilter === option
                            ? "bg-blue-50 dark:bg-blue-900/20 font-medium text-blue-600 dark:text-blue-400"
                            : ""
                        }`}
                        onClick={() => applyFilter(option)}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search Input with Clear Button */}
          <div className="relative flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau NIM..."
                className="w-full border dark:border-gray-700 dark:bg-gray-800 rounded-md pl-10 pr-10 py-2 text-sm shadow-sm"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={clearSearch}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Active Filters Display */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex justify-between items-center mb-6 text-sm"
        >
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {selectedFilter !== "Total Bimbingan" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="bg-blue-50 dark:bg-blue-900/20 shadow-sm px-3 py-1 rounded-full flex items-center gap-1"
                >
                  <span className="text-blue-600 dark:text-blue-400">
                    {selectedFilter}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => applyFilter("Total Bimbingan")}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="bg-blue-50 dark:bg-blue-900/20 shadow-sm px-3 py-1 rounded-full flex items-center gap-1"
                >
                  <span className="text-blue-600 dark:text-blue-400">
                    Pencarian: {searchQuery}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={clearSearch}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Data Information */}
          <div className="flex items-center gap-2 dark:text-gray-400">
            <Info className="h-4 w-4 dark:text-gray-400" />
            <span>{filteredStudents.length} Data Ditemukan</span>
          </div>
        </motion.div>

        {/* Student Cards - 2 columns grid on desktop */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <AnimatePresence>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => {
                const statusStyle = getStatusStyles(student.status);
                
                return (
                  <motion.div
                    key={student.id}
                    variants={cardVariants}
                    custom={index}
                    layout
                    whileHover={{ y: -5 }}
                    className={`rounded-xl overflow-hidden shadow-lg ${statusStyle.glow} bg-white dark:bg-gray-800 border dark:border-gray-700 transition-all`}
                  >
                    {/* Card Top Section */}
                    <div className={`${statusStyle.gradient} h-3`}></div>
                    
                    {/* Card Header with Status Badge */}
                    <div className="px-5 py-4 flex justify-between items-center">
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.badge}`}
                      >
                        {student.status}
                      </motion.span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {student.lastSupervision}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-5">
                        {/* Animated Avatar */}
                        <div className="relative">
                          <motion.div 
                            className={`absolute inset-0 rounded-full ${statusStyle.gradient}`}
                            animate={{
                              scale: [1, 1.05, 1],
                              opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                          ></motion.div>
                          
                          <motion.div
                            className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl border-2 ${statusStyle.border} ${statusStyle.gradient} shadow-lg`}
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            {getInitials(student.name)}
                          </motion.div>
                        </div>

                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1 dark:text-white">
                            {student.name}
                          </h3>

                          <div className="space-y-2">
                            <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                              <span className="flex items-center gap-1 w-24">
                                <User className="h-3 w-3" />
                                NIM
                              </span>
                              <span className="font-medium">: {student.id}</span>
                            </div>

                            <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                              <span className="w-24 flex items-center gap-1">
                                <GraduationCap className="h-3 w-3" />
                                Semester
                              </span>
                              <span className="font-medium">
                                : {student.semester}
                              </span>
                            </div>

                            <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                              <span className="w-24 flex items-center gap-1">
                                <BarChart className="h-3 w-3" />
                                Bimbingan
                              </span>
                              <span className="font-medium">
                                : {student.supervisionCount} kali
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Progress Bimbingan</span>
                          <span className={`font-medium ${student.status === "Selesai" ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"}`}>
                            {student.supervisionCount}/5
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div 
                            className={`h-full ${statusStyle.gradient}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(student.supervisionCount / 6) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className={`${statusStyle.lightBg} p-4 border-t dark:border-gray-700`}>
                      <div className="flex justify-end">
                        <motion.button
                          whileHover={{ 
                            scale: 1.05,
                            x: 5
                          }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center text-sm font-medium text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 px-4 rounded-md hover:bg-white/50 dark:hover:bg-gray-700/50"
                          onClick={() =>
                            navigate(
                              `/dosen/kerja-praktik/mahasiswa-bimbingan-kp/detail?nim=${student.id}&name=${student.name}&semester=${student.semester}&status=${student.status}`
                            )
                          }
                        >
                          <span>Lihat Detail</span>
                          <motion.div
                            className="ml-1"
                            animate={{ 
                              y: [0, -3, 0] 
                            }}
                            transition={{ 
                              repeat: Infinity, 
                              repeatType: "reverse", 
                              duration: 1.5,
                              delay: index * 0.2
                            }}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </motion.div>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                variants={cardVariants} 
                className="col-span-2 py-12 flex flex-col items-center justify-center text-center"
              >
                <motion.div 
                  className="rounded-full bg-gray-100 dark:bg-gray-700 p-4 mb-4"
                 variants={cardVariants}
                  animate="pulse"
                >
                  <Info className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                </motion.div>
                <motion.h3 
                  className="font-medium text-lg mb-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Tidak Ada Data
                </motion.h3>
                <motion.p 
                  className="text-gray-500 dark:text-gray-400 text-sm max-w-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {searchQuery
                    ? `Tidak ada mahasiswa yang cocok dengan pencarian "${searchQuery}"${
                        selectedFilter !== "Total Bimbingan"
                          ? ` dengan status "${selectedFilter}"`
                          : ""
                      }.`
                    : `Tidak ada mahasiswa bimbingan dengan status "${selectedFilter}" pada tahun ajaran ini.`}
                </motion.p>
                {(searchQuery || selectedFilter !== "Total Bimbingan") && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md text-sm shadow-md hover:shadow-lg transition-all"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedFilter("Total Bimbingan");
                    }}
                  >
                    Reset Filter
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default DosenKerjaPraktikmahasiswaBimbinganpage;