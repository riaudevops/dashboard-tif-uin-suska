import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import {
  Terminal,
  TypingAnimation,
  AnimatedSpan,
} from "@/components/magic-ui/terminal";

// Define interfaces clearly with proper documentation
interface CheckItems {
  hapalan: boolean;
  kerja_praktik: boolean;
  bimbingan: boolean;
  nilaiInstansi: boolean;
  dailyReport: boolean;
}

interface PendaftaranCardProps {
  /**
   * Information about the seminar application status
   */
  infoPengajuanSeminar: {
    step: number;
    checkItems?: CheckItems;
  };
  /** Navigation function to call when button is clicked */
  navigateFunction?: () => void;
  /** Indicates if step 1 is accessible */
  step1Accessible: boolean;
}

/**
 * Component to display Kerja Praktik seminar registration card with requirement verification
 */
const PendaftaranCard: React.FC<PendaftaranCardProps> = ({
  infoPengajuanSeminar,
  navigateFunction,
  step1Accessible,
}) => {
  // Default checkmark values
  const defaultCheckmarks: CheckItems = {
    hapalan: true,
    kerja_praktik: true,
    bimbingan: true,
    nilaiInstansi: false,
    dailyReport: true,
  };

  // State to track requirement status
  const [checkmarks, setCheckmarks] = useState<CheckItems>(defaultCheckmarks);
  const [allRequirementsMet, setAllRequirementsMet] = useState<boolean>(false);

  // Update checkmarks when props change
  useEffect(() => {
    if (infoPengajuanSeminar.checkItems) {
      setCheckmarks((prevState) => ({
        ...prevState,
        ...infoPengajuanSeminar.checkItems,
      }));
    }
  }, [infoPengajuanSeminar.checkItems]);

  // Update overall status when individual checkmarks change
  useEffect(() => {
    const areAllMet = Object.values(checkmarks).every(
      (value) => value === true
    );
    setAllRequirementsMet(areAllMet);
  }, [checkmarks]);

  /**
   * Get array of requirement names that are not yet met
   */
  const getUnmetRequirements = (): string[] => {
    const requirementMapping = {
      hapalan: "Muroja'ah",
      kerja_praktik: "Verifikasi Kerja Praktik",
      bimbingan: "Bimbingan Dosen",
      nilaiInstansi: "Nilai Pembimbing Instansi",
      dailyReport: "Daily Report",
    };

    return Object.entries(checkmarks)
      .filter(([_, isComplete]) => !isComplete)
      .map(([key]) => requirementMapping[key as keyof CheckItems]);
  };

  /**
   * Handle button click
   */
  const handleButtonClick = (): void => {
    if (allRequirementsMet && navigateFunction) {
      navigateFunction();
    }
  };

  // Common class for check indicators
  const renderCheckItem = (
    isComplete: boolean,
    text: string,
    delay: number
  ): JSX.Element => (
    <AnimatedSpan delay={delay} className="flex items-start gap-2">
      <span className={isComplete ? "text-green-600" : "text-red-600"}>
        {isComplete ? "✓" : "✗"}
      </span>
      <span>{text}</span>
    </AnimatedSpan>
  );

  return (
    <Card className="bg-[#F5F9F4] dark:bg-slate-700 border border-green-400 dark:border-green-500 shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-bold dark:text-white">
          Permohonan Pendaftaran Seminar Kerja Praktik
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Terminal className="shadow-none border-none dark:bg-slate-800 flex-1 h-full flex flex-col min-h-64">
          <TypingAnimation> tif kerja-praktik@latest</TypingAnimation>

          {renderCheckItem(checkmarks.hapalan, "Muroja'ah 1-16.", 500)}
          {renderCheckItem(
            checkmarks.kerja_praktik,
            "Masih Terdaftar Melaksanakan Kerja Praktik.",
            1000
          )}
          {renderCheckItem(
            checkmarks.bimbingan,
            "Sudah melakukan minimal 5 kali bimbingan dosen pa.",
            1500
          )}
          {renderCheckItem(
            checkmarks.dailyReport,
            "Daily report sudah di approve Pembimbing.",
            2000
          )}
          {renderCheckItem(
            checkmarks.nilaiInstansi,
            "Sudah mendapatkan nilai dari pembimbing instansi.",
            2500
          )}

          <AnimatedSpan delay={3000} className="py-2 text-blue-600">
            <span>📦 Updated 1 file:</span>
          </AnimatedSpan>
          <AnimatedSpan delay={3200} className="pl-4 text-blue-600">
            <span>- lib/seminar-kerja-praktik.ts</span>
          </AnimatedSpan>

          {allRequirementsMet ? (
            <>
              <AnimatedSpan delay={3500} className="text-green-500">
                <span>✅ Success! Sistem siap digunakan.</span>
              </AnimatedSpan>
              <AnimatedSpan
                delay={4000}
                className="text-gray-600 dark:text-gray-400"
              >
                <span>
                  Silakan mulai pendaftaran Seminar kerja praktik Anda.
                </span>
              </AnimatedSpan>
            </>
          ) : (
            <>
              <AnimatedSpan delay={3500} className="text-yellow-500">
                <span>
                  ⚠️ Warning! Terdapat persyaratan yang belum terpenuhi.
                </span>
              </AnimatedSpan>
              <AnimatedSpan
                delay={4000}
                className="text-red-500 dark:text-red-400"
              >
                <span>
                  Anda perlu memenuhi persyaratan:{" "}
                  {getUnmetRequirements().join(", ")}.
                </span>
              </AnimatedSpan>
            </>
          )}
        </Terminal>
      </CardContent>

      <CardFooter>
        <Button
          className={`w-full ${
            allRequirementsMet && step1Accessible
              ? "bg-green-600 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-500"
              : "bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 cursor-not-allowed"
          }`}
          disabled={!allRequirementsMet || !step1Accessible}
          onClick={handleButtonClick}
        >
          Buat Permohonan
          {(!allRequirementsMet || !step1Accessible) && (
            <Lock className="ml-2" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PendaftaranCard;
