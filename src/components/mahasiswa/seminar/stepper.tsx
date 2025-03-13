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

const Stepper: React.FC<StepperProps> = ({
  steps = defaultSteps,
  activeStep,
}) => {
  const getStatusColor = (stepIndex: number) => {
    if (stepIndex < activeStep) return "bg-primary-foreground text-primary"; // Completed
    if (stepIndex === activeStep)
      return "bg-blue-50 dark:bg-blue-900 text-blue-500 dark:text-blue-400"; // Active
    return "bg-muted text-muted-foreground"; // Pending
  };

  const getCircleColor = (stepIndex: number) => {
    if (stepIndex < activeStep) return "bg-primary text-primary-foreground"; // Completed
    if (stepIndex === activeStep) return "bg-purple-800 text-white"; // Active
    return "bg-muted text-muted-foreground"; // Pending
  };

  return (
    <div className="w-full px-2 md:px-4 overflow-x-auto">
      <div className="flex min-w-[768px] md:min-w-0">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center flex-1 relative"
          >
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="absolute h-[2px] bg-border left-[50%] right-[-50%] top-4 md:top-5" />
            )}

            {/* Circle with Number */}
            <div
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center 
              ${getCircleColor(index)}
              z-10 font-medium text-sm md:text-base`}
            >
              {step.number}
            </div>

            {/* Title and Subtitle Container */}
            <div className="mt-2 md:mt-3 text-center max-w-[120px] md:max-w-full mx-auto">
              <p className="text-[10px] md:text-xs text-muted-foreground truncate">
                {step.subtitle}
              </p>
              <p className="font-medium text-[10px] md:text-xs text-foreground truncate">
                {step.title}
              </p>
              <span
                className={`text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-[1px] rounded-full mt-1 inline-block ${getStatusColor(
                  index
                )}`}
              >
                {index < activeStep
                  ? "Tervalidasi"
                  : index === activeStep
                  ? "Sekarang"
                  : "Belum"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Default steps if none provided
const defaultSteps: Step[] = [
  {
    number: 1,
    title: "Pendaftaran Diseminasi",
    subtitle: "Upload Berkas",
    status: "not-action",
  },
  {
    number: 2,
    title: "Id Pengajuan Surat Undangan",
    subtitle: "Input",
    status: "pending",
  },
  {
    number: 3,
    title: "Dokumen Surat Undangan",
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

export default Stepper;
