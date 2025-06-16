import { type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import APISeminarKP from "@/services/api/koordinator-kp/mahasiswa.service";

// Tipe untuk data seminar
interface JadwalResponse {
  total_seminar: number;
  total_seminar_minggu_ini: number;
  total_jadwal_ulang: number;
  jadwal: {
    semua: any[];
    hari_ini: any[];
    minggu_ini: any[];
  };
  tahun_ajaran: {
    id: number;
    nama: string;
  };
}

interface DashboardJadwalCardProps {
  selectedTahunAjaranId: number | null;
}

const DashboardJadwalCard: FC<DashboardJadwalCardProps> = ({
  selectedTahunAjaranId,
}) => {
  // Fetch data menggunakan TanStack Query
  const { data, isLoading, isError } = useQuery<JadwalResponse>({
    queryKey: ["koordinator-jadwal-seminar", selectedTahunAjaranId],
    queryFn: () =>
      APISeminarKP.getJadwalSeminar(selectedTahunAjaranId ?? undefined),
    enabled: selectedTahunAjaranId !== null,
  });

  const totalSeminars = data?.total_seminar || 0;
  const seminarsThisWeek = data?.total_seminar_minggu_ini || 0;
  const rescheduledSeminars = data?.total_jadwal_ulang || 0;

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } },
  };

  if (isLoading) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-300">
        Memuat statistik...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-600 dark:text-red-300">
        Gagal memuat statistik
      </div>
    );
  }

  return (
    <motion.div
      className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Total Seminar Card */}
      <motion.div variants={item}>
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-3">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Total Seminar
            </CardTitle>
            <motion.div
              whileHover={{ rotate: 15 }}
              className="bg-blue-200 p-1.5 rounded-full dark:bg-blue-800"
            >
              <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-300" />
            </motion.div>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="text-2xl font-bold text-blue-800 dark:text-white"
            >
              {totalSeminars}
            </motion.div>
            <p className="text-xs text-blue-600 dark:text-blue-300 mt-0.5">
              Seminar Terjadwal
            </p>
            <div className="h-1.5 w-full bg-blue-100 dark:bg-blue-900 rounded-full mt-2">
              <motion.div
                initial={{ width: "0%" }}
                animate={{
                  width: totalSeminars > 0 ? "100%" : "0%",
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-1.5 bg-blue-500 rounded-full"
                style={{ maxWidth: "100%" }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Seminar Minggu Ini Card */}
      <motion.div variants={item}>
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-green-100 to-green-50 dark:from-green-950 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-3">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300">
              Seminar Minggu Ini
            </CardTitle>
            <motion.div
              whileHover={{ rotate: 15 }}
              className="bg-green-200 p-1.5 rounded-full dark:bg-green-800"
            >
              <CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-300" />
            </motion.div>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="text-2xl font-bold text-green-800 dark:text-white"
            >
              {seminarsThisWeek}
            </motion.div>
            <p className="text-xs text-green-600 dark:text-green-300 mt-0.5">
              Seminar Terjadwal
            </p>
            <div className="h-1.5 w-full bg-green-100 dark:bg-green-900 rounded-full mt-2">
              <motion.div
                initial={{ width: "0%" }}
                animate={{
                  width: totalSeminars
                    ? `${(seminarsThisWeek / totalSeminars) * 100}%`
                    : "0%",
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-1.5 bg-green-500 rounded-full"
                style={{ maxWidth: "100%" }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Jadwal Diganti Card */}
      <motion.div variants={item}>
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-950 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-3">
            <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Jadwal Diganti
            </CardTitle>
            <motion.div
              whileHover={{ rotate: 15 }}
              className="bg-amber-200 p-1.5 rounded-full dark:bg-amber-800"
            >
              <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-300" />
            </motion.div>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="text-2xl font-bold text-amber-800 dark:text-white"
            >
              {rescheduledSeminars}
            </motion.div>
            <p className="text-xs text-amber-600 dark:text-amber-300 mt-0.5">
              Seminar Dijadwal Ulang
            </p>
            <div className="h-1.5 w-full bg-amber-100 dark:bg-amber-900 rounded-full mt-2">
              <motion.div
                initial={{ width: "0%" }}
                animate={{
                  width: totalSeminars
                    ? `${(rescheduledSeminars / totalSeminars) * 100}%`
                    : "0%",
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-1.5 bg-amber-500 rounded-full"
                style={{ maxWidth: "100%" }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DashboardJadwalCard;
