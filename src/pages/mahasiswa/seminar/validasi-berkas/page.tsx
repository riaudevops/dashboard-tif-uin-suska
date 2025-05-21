import { useState, useEffect } from "react";
import Step1 from "@/components/mahasiswa/seminar/steps/step1";
import Step2 from "@/components/mahasiswa/seminar/steps/step2";
import Step3 from "@/components/mahasiswa/seminar/steps/step3";
import Step4 from "@/components/mahasiswa/seminar/steps/step4";
import Step5 from "@/components/mahasiswa/seminar/steps/step5";
import Step6 from "@/components/mahasiswa/seminar/steps/step6";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import APISeminarKP from "@/services/api/mahasiswa/seminar-kp.service";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";

const stepComponents = [Step1, Step2, Step3, Step4, Step5, Step6];
const statuses: ("belum" | "validasi" | "ditolak")[] = [
  "belum",
  "validasi",
  "ditolak",
];

export default function MahasiswaSeminarValidasiBerkasPage() {
  const [step, setStep] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["seminar-kp-data"],
    queryFn: APISeminarKP.getDataMydokumen,
  });

  useEffect(() => {
    if (data?.data?.steps_info) {
      const accessibleSteps = Object.entries(data.data.steps_info)
        .filter(([key, value]) => key.endsWith("_accessible") && value)
        .map(
          ([key]) =>
            parseInt(key.replace("step", "").replace("_accessible", "")) - 1
        );
      const highestAccessibleStep = Math.max(...accessibleSteps, -1);
      setStep(highestAccessibleStep >= 0 ? highestAccessibleStep : 0);
    }
  }, [data]);

  const StepComponent = stepComponents[step];

  const getStepStatus = () => {
    if (
      !data?.data?.dokumen_seminar_kp ||
      !data.data.dokumen_seminar_kp[`step${step + 1}`]
    )
      return "belum";
    return data.data.dokumen_seminar_kp[`step${step + 1}`].some(
      (doc: any) => doc.status === "Ditolak"
    )
      ? "ditolak"
      : "validasi";
  };

  return (
    <DashboardLayout>
      <div className="">
        <StepComponent activeStep={step} status={getStepStatus()} />

        {/* No manual step navigation buttons */}
      </div>
    </DashboardLayout>
  );
}

// import { useState } from "react";
// import Step1 from "@/components/mahasiswa/seminar/steps/step1";
// import Step2 from "@/components/mahasiswa/seminar/steps/step2";
// import Step3 from "@/components/mahasiswa/seminar/steps/step3";
// import Step4 from "@/components/mahasiswa/seminar/steps/step4";
// import Step5 from "@/components/mahasiswa/seminar/steps/step5";
// import Step6 from "@/components/mahasiswa/seminar/steps/step6";
// import { Button } from "@/components/ui/button";

// const stepComponents = [Step1, Step2, Step3, Step4, Step5, Step6];
// const statuses: ("belum" | "validasi" | "ditolak")[] = ["belum", "validasi", "ditolak"];

// export default function MahasiswaSeminarValidasiBerkasPage() {
//   const [step, setStep] = useState(0);
//   const [statusIndex, setStatusIndex] = useState(0);

//   // Added countdown state for testing
//   const [countdownDays, setCountdownDays] = useState(5);

//   // Create a key that changes whenever step or status changes
//   const componentKey = `step-${step}-status-${statuses[statusIndex]}-countdown-${countdownDays}`;

//   const StepComponent = stepComponents[step];

//   return (
//     <div className="flex flex-col items-center gap-4">
//       {/* Use key prop to force re-render when step or status changes */}
//       <StepComponent
//         key={componentKey}
//         activeStep={step}
//         status={statuses[statusIndex]}
//         countdownDays={countdownDays} // Pass countdown days to Step4
//       />

//       <div className="flex gap-2">
//         {stepComponents.map((_, index) => (
//           <Button
//             key={index}
//             onClick={() => setStep(index)}
//             className={
//               step === index
//                 ? "bg-blue-500 text-white"
//                 : "bg-gray-300 text-black"
//             }
//           >
//             Step {index + 1}
//           </Button>
//         ))}
//       </div>

//       <div className="flex gap-2">
//         <Button
//           onClick={() => setStep((prev) => Math.max(0, prev - 1))}
//           disabled={step === 0}
//         >
//           Previous Step
//         </Button>
//         <Button
//           onClick={() =>
//             setStep((prev) => Math.min(stepComponents.length - 1, prev + 1))
//           }
//           disabled={step === stepComponents.length - 1}
//         >
//           Next Step
//         </Button>
//       </div>

//       <div className="flex gap-2">
//         {statuses.map((status, index) => (
//           <Button
//             key={index}
//             onClick={() => setStatusIndex(index)}
//             className={
//               statusIndex === index
//                 ? "bg-green-500 text-white"
//                 : "bg-gray-300 text-black"
//             }
//           >
//             {status.charAt(0).toUpperCase() + status.slice(1)}
//           </Button>
//         ))}
//       </div>

//       {/* Added countdown control for testing */}
//       <div className="flex gap-2 mt-4">
//         <Button
//           onClick={() => setCountdownDays(0)}
//           className={
//             countdownDays === 0
//               ? "bg-purple-500 text-white"
//               : "bg-gray-300 text-black"
//           }
//         >
//           Hari Ini
//         </Button>
//         <Button
//           onClick={() => setCountdownDays(5)}
//           className={
//             countdownDays === 5
//               ? "bg-teal-500 text-white"
//               : "bg-gray-300 text-black"
//           }
//         >
//           H-5
//         </Button>
//       </div>
//     </div>
//   );
// }
