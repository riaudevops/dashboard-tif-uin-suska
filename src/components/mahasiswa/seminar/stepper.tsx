import { motion } from "framer-motion";
import { CheckCircle2, Info } from "lucide-react";
import React from "react";

// Original Stepper Types
interface Step {
  number: number;
  title: string;
  subtitle: string;
  status: "not-action" | "pending" | "tervalidasi";
}

interface StepperProps {
  steps?: Step[];
  activeStep: number;
  variant?: "default" | "section";
}

// Default steps for the original stepper variant
const defaultSteps: Step[] = [
  {
    number: 1,
    title: "Pendaftaran",
    subtitle: "Upload Berkas",
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
    subtitle: "Upload Berkas",
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

// New section-based stepper types
interface StepSection {
  title: string;
  stepRange: number[];
  isActive: boolean;
  isCompleted: boolean;
}

// Combined Stepper component
const Stepper: React.FC<StepperProps> = ({
  steps = defaultSteps,
  activeStep,
  variant = "default",
}) => {
  // Use the appropriate stepper variant based on the prop
  if (variant === "section") {
    return <SectionStepper activeStep={activeStep} />;
  }

  return <DefaultStepper steps={steps} activeStep={activeStep} />;
};

// The original stepper implementation
const DefaultStepper: React.FC<{ steps: Step[]; activeStep: number }> = ({
  steps,
  activeStep,
}) => {
  const getStatusColor = (stepIndex: number) => {
    if (stepIndex < activeStep) return "bg-primary-foreground text-primary"; // Completed
    if (stepIndex === activeStep)
      return "bg-blue-50 dark:bg-blue-900 text-blue-500 dark:text-blue-400"; // Active
    return "bg-muted text-muted-foreground"; // Pending
  };

  const getCircleColor = (stepIndex: number) => {
    if (stepIndex < activeStep)
      return "bg-green-600 dark:bg-emerald-400 text-white"; // Completed
    if (stepIndex === activeStep)
      return "bg-green-600 dark:bg-emerald-400 text-white"; // Active
    return "bg-green-200 text-green-500"; // Pending
  };

  // Custom animation for the connector line
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

  return (
    <div className="w-full px-2 md:px-4 overflow-x-auto py-6">
      <div className="flex min-w-[768px] md:min-w-0">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center flex-1 relative"
          >
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <motion.div
                className="absolute h-[2px] left-[50%] right-[-50%] top-4 md:top-5"
                initial={{ backgroundColor: "bg-green-500" }}
                animate={getLineAnimation(index)}
              />
            )}

            {/* Circle with Number or Check Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center 
              ${getCircleColor(index)}
              z-10 font-medium text-sm md:text-base`}
            >
              {/* Pulsing effect for active step */}
              {index === activeStep && (
                <motion.div
                  className="absolute w-12 h-12 rounded-full bg-green-400 opacity-50"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
              {/* Show check icon for validated steps, number for others */}
              {index < activeStep ? (
                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
              ) : (
                step.number
              )}
            </motion.div>

            {/* Title and Subtitle Container */}
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
                {index < activeStep
                  ? "Tervalidasi"
                  : index === activeStep
                  ? "Sekarang"
                  : "Belum"}
              </motion.span>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

// The new section-based stepper implementation
const SectionStepper: React.FC<{ activeStep: number }> = ({ activeStep }) => {
  // Define the sections based on the step ranges
  const sections: StepSection[] = [
    {
      title: "Pra-seminar",
      stepRange: [0, 1, 2],
      isActive: [0, 1, 2].includes(activeStep),
      isCompleted: activeStep > 2,
    },
    {
      title: "Seminar",
      stepRange: [3],
      isActive: activeStep === 3,
      isCompleted: activeStep > 3,
    },
    {
      title: "Pasca-Seminar",
      stepRange: [4],
      isActive: activeStep === 4,
      isCompleted: activeStep > 4,
    },
    {
      title: "Selesai",
      stepRange: [5],
      isActive: activeStep === 5,
      isCompleted: activeStep > 5,
    },
  ];

  const getProgressPercentage = () => {
    if (activeStep <= 2) return 0;
    if (activeStep === 3) return 25;
    if (activeStep === 4) return 52;
    if (activeStep === 5) return 80;

    return 0;
  };

  return (
    <div className="w-full flex justify-center">
      <div className="flex items-center justify-center relative py-4">
        {/* Background Progress Line */}
        <div
          className="absolute h-1 bg-gray-200 rounded-full"
          style={{ top: "36%", left: "10%", width: "80%" }}
        />

        {/* Animated Progress Line */}
        <motion.div
          className="absolute h-1 bg-green-600 dark:bg-emerald-400 rounded-full"
          style={{
            top: "36%",
            left: "10%",
            width: `${getProgressPercentage()}%`,
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${getProgressPercentage()}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Steps */}
        {sections.map((section, index) => (
          <div
            key={index}
            className="relative flex flex-col items-center z-10 mx-8"
          >
            {/* Pulsing effect for active step */}
            {section.isActive && !section.isCompleted && (
              <motion.div
                className="absolute w-12 h-12 bg-emerald-300 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            )}

            {/* Step circle */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.3 }}
              className={`relative w-12 h-12 flex items-center justify-center rounded-full shadow-none transition-colors  ${
                section.isCompleted || section.isActive
                  ? "bg-green-600 dark:bg-emerald-400"
                  : "bg-green-200"
              }`}
            >
              {section.isCompleted || section.isActive ? (
                <CheckCircle2 className="w-7 h-7 text-white" />
              ) : (
                <Info className="w-7 h-7 text-green-500" />
              )}
            </motion.div>

            {/* Step title */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.5 }}
              className={`mt-3 text-xs font-medium text-center  ${
                section.isCompleted || section.isActive
                  ? "text-black dark:text-white"
                  : "text-gray-500 dark:text-gray-300"
              }`}
            >
              {section.title}
            </motion.span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
