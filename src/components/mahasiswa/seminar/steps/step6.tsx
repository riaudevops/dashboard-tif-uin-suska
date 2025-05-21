import { motion } from "framer-motion";
import { Award } from "lucide-react";

import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import Stepper from "@/components/mahasiswa/seminar/stepper";
import InfoCard from "../informasi-seminar";
import Status from "../status";

// Define TypeScript interface for component props
interface Step6Props {
  activeStep: number;
  status: string;
}

/**
 * Step6 component - Displays the final step of the seminar validation process
 *
 * @param {number} activeStep - Current active step in the stepper
 * @param {string} status - Current validation status ('belum' or 'validasi')
 */
export default function Step6({ activeStep, status }: Step6Props) {
  // Define constants outside the component
  const informasiSeminarFields = [
    "judul",
    "nilai",
    "lokasi",
    "lamaKerjaPraktek",
    "dosenPembimbing",
    "dosenPenguji",
  ];

  // Animation variants for consistent motion effects
  const fadeInAnimation = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5, delay: 0.1 },
  };

  // Different bubble animations
  const bubbleAnimations = {
    first: {
      animate: { y: [0, -10, 0], scale: [1, 1.1, 1] },
      transition: { repeat: Infinity, duration: 5, ease: "easeInOut" },
    },
    second: {
      animate: { y: [0, 10, 0], scale: [1, 1.1, 1] },
      transition: { repeat: Infinity, duration: 7, ease: "easeInOut" },
    },
    third: {
      animate: { x: [0, 10, 0], scale: [1, 1.1, 1] },
      transition: { repeat: Infinity, duration: 6, ease: "easeInOut" },
    },
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">
        Validasi Kelengkapan Berkas Seminar Kerja Praktik
      </h1>

      <Stepper activeStep={activeStep} />

      <div className="p-4 ">
        <div className="flex flex-col gap-12 mb-4">
          {/* Success banner */}
          <motion.div
            className="relative overflow-hidden bg-white dark:bg-black rounded-xl shadow-sm dark:shadow-xl text-gray-800 dark:text-white py-8 px-6 border border-gray-100 dark:border-none"
            {...fadeInAnimation}
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 dark:from-purple-600/20 dark:via-transparent via-transparent to-purple-100/60 dark:to-blue-600/20"></div>

            {/* Decorative bubbles */}
            <motion.div
              className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-blue-400/20 dark:bg-purple-500/30 blur-md"
              {...bubbleAnimations.first}
            />
            <motion.div
              className="absolute top-1/2 -right-4 w-12 h-12 rounded-full bg-purple-400/20 dark:bg-blue-500/30 blur-md"
              {...bubbleAnimations.second}
            />
            <motion.div
              className="absolute bottom-6 left-10 w-8 h-8 rounded-full bg-pink-400/20 dark:bg-pink-500/30 blur-md"
              {...bubbleAnimations.third}
            />

            {/* Header with award icon */}
            <div className="flex justify-between items-center mb-6">
              <div className="w-12 h-1 bg-gradient-to-r from-blue-500 dark:from-purple-500 to-transparent rounded-full"></div>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                className="relative"
              >
                <Award
                  className="w-12 h-12 text-blue-600 dark:text-yellow-300"
                  strokeWidth={1.5}
                />
                <motion.div
                  className="absolute inset-0 bg-blue-400/20 dark:bg-yellow-300/20 rounded-full blur-md"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </motion.div>

              <div className="w-12 h-1 bg-gradient-to-l from-blue-500 dark:from-purple-500 to-transparent rounded-full"></div>
            </div>

            {/* Congratulations message */}
            <h1 className="text-center text-2xl font-bold mb-3">
              <span className="text-blue-600 dark:text-purple-300">
                Selamat!
              </span>{" "}
              Proses Seminar Kerja Praktik Anda
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-yellow-300 dark:to-orange-400">
                {" "}
                Berhasil
              </span>
            </h1>

            {/* Info message */}
            <div className="bg-blue-50 dark:bg-white/10 backdrop-blur-sm rounded-xl p-3  border border-blue-100 dark:border-transparent">
              <p className="text-center text-xs font-medium text-gray-700 dark:text-white/80">
                Silakan Cek Berkala Untuk Progress Nilai Anda
              </p>
            </div>
          </motion.div>
        </div>

        {/* Conditional rendering based on status */}
        {status === "belum" ? (
          <>
            <Status
              status="belum"
              title="Nilai Anda Masih dalam Proses Validasi"
              subtitle="Mohon bersabar"
            />

            <InfoCard displayItems={informasiSeminarFields} className="mt-4" />
          </>
        ) : (
          status === "validasi" && (
            <InfoCard displayItems={informasiSeminarFields} />
          )
        )}
      </div>
    </div>
  );
}
