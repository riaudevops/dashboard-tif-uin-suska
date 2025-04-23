import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import React from "react";

interface Step {
  number: number;
  title: string;
  subtitle: string;
  status: "not-action" | "pending" | "tervalidasi";
}

interface StepperProps {
  steps?: Step[];
  activeStep: number;
}

const defaultSteps: Step[] = [
  {
    number: 1,
    title: "Pendaftaran",
    subtitle: "Upload Dokumen",
    status: "not-action",
  },
  {
    number: 2,
    title: "ID Pengajuan Surat Undangan",
    subtitle: "Input",
    status: "pending",
  },
  {
    number: 3,
    title: "Surat Undangan",
    subtitle: "Upload Dokumen",
    status: "pending",
  },
  {
    number: 4,
    title: "Seminar KP",
    subtitle: "Informasi",
    status: "pending",
  },
  {
    number: 5,
    title: "Pasca Seminar KP",
    subtitle: "Upload Dokumen",
    status: "pending",
  },
  {
    number: 6,
    title: "Selesai",
    subtitle: "",
    status: "pending",
  },
];

const Stepper: React.FC<StepperProps> = ({
  steps = defaultSteps,
  activeStep,
}) => {
  const getStatusColor = (stepIndex: number): string => {
    if (stepIndex < activeStep) {
      return "bg-primary-foreground text-primary"; // Selesai
    }
    if (stepIndex === activeStep) {
      return "bg-blue-50 dark:bg-blue-900 text-blue-500 dark:text-blue-400"; // Aktif
    }
    return "bg-muted text-muted-foreground"; // Belum
  };

  const getCircleColor = (stepIndex: number): string => {
    if (stepIndex <= activeStep) {
      return "bg-gradient-to-r from-green-400 to-green-600 text-white"; // Selesai atau Aktif
    }
    return "bg-gray-400 text-white"; // Belum
  };

  const getLineAnimation = (stepIndex: number) => {
    if (stepIndex < activeStep) {
      return {
        backgroundColor: "rgb(22, 163, 74)",
        transition: { duration: 0.5, delay: stepIndex * 0.2 },
      };
    }
    return {
      backgroundColor: "rgb(229, 231, 235)",
      transition: { duration: 0.5 },
    };
  };

  const getStepStatusText = (stepIndex: number): string => {
    if (stepIndex < activeStep) return "Tervalidasi";
    if (stepIndex === activeStep) return "Sekarang";
    return "Belum";
  };

  return (
    <div className="w-full px-2 md:px-4 overflow-x-auto py-6">
      <div className="flex min-w-[768px] md:min-w-0">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center flex-1 relative"
          >
            {/* Garis */}
            {index < steps.length - 1 && (
              <motion.div
                className="absolute h-[2px] left-[50%] right-[-50%] top-4 md:top-5"
                initial={{ backgroundColor: "rgb(229, 231, 235)" }}
                animate={getLineAnimation(index)}
              />
            )}

            {/* Lingkaran */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center 
                ${getCircleColor(index)}
                z-10 font-medium text-sm md:text-base`}
            >
              {/* Animasi Lingkaran */}
              {index === activeStep && (
                <motion.div
                  className="absolute w-12 h-12 rounded-full bg-green-400 opacity-50"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}

              {/* Menampilkan Centang jika tervalidasi, Angka jika belum */}
              {index < activeStep ? (
                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
              ) : (
                step.number
              )}
            </motion.div>

            {/* Title dan Subtitle  */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
              className="mt-2 md:mt-3 text-center max-w-[120px] md:max-w-full mx-auto"
            >
              <p className="text-[10px] md:text-xs text-muted-foreground truncate">
                {step.subtitle}
              </p>
              <p className="font-medium text-[10px] md:text-xs text-foreground truncate">
                {step.title}
              </p>
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                className={`text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-[1px] rounded-full mt-1 inline-block ${getStatusColor(
                  index
                )}`}
              >
                {getStepStatusText(index)}
              </motion.span>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
