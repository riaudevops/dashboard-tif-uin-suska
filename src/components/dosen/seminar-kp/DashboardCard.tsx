import { type FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export interface Student {
  id: string;
  nim: string;
  name: string;
  semester: number;
  judul: string;
  lokasi: string;
  dosenPembimbing: string;
  pembimbingInstansi: string;
  ruangan: string;
  waktu_mulai: string;
  waktu_selesai: string;
  tanggalSeminar: string;
  status: "Dinilai" | "Belum Dinilai";
  tanggalDinilai?: string;
}

interface DashboardCardsProps {
  students: Student[];
  statistics: {
    totalMahasiswa: number;
    mahasiswaDinilai: number;
    mahasiswaBelumDinilai: number;
    persentaseDinilai: number;
  };
}

const DashboardCards: FC<DashboardCardsProps> = ({ statistics }) => {
  const {
    totalMahasiswa,
    mahasiswaDinilai,
    mahasiswaBelumDinilai,
    persentaseDinilai,
  } = statistics;

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

  return (
    <motion.div
      className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Total Mahasiswa Card */}
      <motion.div variants={item}>
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-950 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-3">
            <CardTitle className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
              Total
            </CardTitle>
            <motion.div
              whileHover={{ rotate: 15 }}
              className="bg-indigo-200 p-1.5 rounded-full dark:bg-indigo-800"
            >
              <Users className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-300" />
            </motion.div>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="text-2xl font-bold text-indigo-800 dark:text-white"
            >
              {totalMahasiswa}
            </motion.div>
            <p className="text-xs text-indigo-600 dark:text-indigo-300 mt-0.5">
              Mahasiswa Diuji
            </p>
            <div className="h-1.5 w-full bg-indigo-100 dark:bg-indigo-900 rounded-full mt-2">
              <motion.div
                initial={{ width: "0%" }}
                animate={{
                  width: totalMahasiswa > 0 ? "100%" : "0%",
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-1.5 bg-indigo-500 rounded-full"
                style={{ maxWidth: "100%" }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Persentase Selesai Card */}
      <motion.div variants={item}>
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-950 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-3">
            <CardTitle className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
              Persentase Selesai
            </CardTitle>
            <motion.div
              whileHover={{ rotate: 15 }}
              className="bg-emerald-200 p-1.5 rounded-full dark:bg-emerald-800"
            >
              <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300" />
            </motion.div>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="flex items-end gap-0.5">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="text-2xl font-bold text-emerald-800 dark:text-white"
              >
                {persentaseDinilai}
              </motion.div>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-300">
                %
              </span>
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-300 mt-0.5">
              {mahasiswaDinilai} dari {totalMahasiswa} telah dinilai
            </p>
            <div className="h-1.5 w-full bg-emerald-100 dark:bg-emerald-900 rounded-full mt-2">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${persentaseDinilai}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-1.5 bg-emerald-500 rounded-full"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Belum Dinilai Card */}
      <motion.div variants={item}>
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-950 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-3">
            <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Belum Dinilai
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
              {mahasiswaBelumDinilai}
            </motion.div>
            <p className="text-xs text-amber-600 dark:text-amber-300 mt-0.5">
              Mahasiswa belum dinilai
            </p>
            <div className="h-1.5 w-full bg-amber-100 dark:bg-amber-900 rounded-full mt-2">
              <motion.div
                initial={{ width: "0%" }}
                animate={{
                  width: totalMahasiswa
                    ? `${(mahasiswaBelumDinilai / totalMahasiswa) * 100}%`
                    : "0%",
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-1.5 bg-amber-500 rounded-full"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DashboardCards;
