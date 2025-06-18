import React from "react";
import { useState, useEffect } from "react";
import {
  Lock,
  CheckCircle2,
  Circle,
  ChevronRight,
  BookOpen,
  Building2,
  GraduationCap,
  FileText,
  Star,
  Info,
  XCircleIcon,
} from "lucide-react";

interface CheckItems {
  hapalan: boolean;
  kerja_praktik: boolean;
  bimbingan: boolean;
  nilaiInstansi: boolean;
  dailyReport: boolean;
}

interface PendaftaranCardProps {
  infoPengajuanSeminar: {
    step: number;
    checkItems?: CheckItems;
  };
  navigateFunction?: () => void;
  step1Accessible: boolean;
  semuaSyaratTerpenuhi: boolean;
}

const PendaftaranCard: React.FC<PendaftaranCardProps> = ({
  infoPengajuanSeminar,
  navigateFunction,
  step1Accessible,
  semuaSyaratTerpenuhi,
}) => {
  const defaultCheckmarks: CheckItems = {
    hapalan: true,
    kerja_praktik: false,
    bimbingan: false,
    nilaiInstansi: false,
    dailyReport: false,
  };

  const [checkmarks, setCheckmarks] = useState<CheckItems>(defaultCheckmarks);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (infoPengajuanSeminar.checkItems) {
      setCheckmarks((prevState) => ({
        ...prevState,
        ...infoPengajuanSeminar.checkItems,
      }));
    }
  }, [infoPengajuanSeminar.checkItems]);

  const handleButtonClick = (): void => {
    if (semuaSyaratTerpenuhi && step1Accessible && navigateFunction) {
      setIsAnimating(true);
      setTimeout(() => {
        navigateFunction();
        setIsAnimating(false);
      }, 300);
    }
  };

  const getIconForRequirement = (key: string) => {
    const iconMap = {
      hapalan: BookOpen,
      kerja_praktik: Building2,
      bimbingan: GraduationCap,
      dailyReport: FileText,
      nilaiInstansi: Star,
    };
    return iconMap[key as keyof typeof iconMap] || Circle;
  };

  const renderCheckItem = (isComplete: boolean, text: string, key: string) => {
    const IconComponent = getIconForRequirement(key);

    return (
      <div
        key={key}
        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
          isComplete
            ? "bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800"
            : "bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800"
        }`}
      >
        <div
          className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
            isComplete ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {isComplete ? (
            <CheckCircle2 className="w-3 h-3" />
          ) : (
            <XCircleIcon className="w-3 h-3" />
          )}
        </div>
        <IconComponent
          className={`w-4 h-4 ${
            isComplete
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          }`}
        />
        <span
          className={`text-sm font-medium flex-1 leading-tight ${
            isComplete
              ? "text-emerald-700 dark:text-emerald-300"
              : "text-red-700 dark:text-red-300"
          }`}
        >
          {text}
        </span>
      </div>
    );
  };

  // Stepper data
  const steps = [
    {
      label: "Pendaftaran Seminar",
      step: 0,
      description: "Upload link dokumen pendaftaran seminar kerja praktik",
    },
    {
      label: "ID Surat Undangan",
      step: 1,
      description: "Upload ID surat undangan seminar",
    },
    {
      label: "Surat Undangan",
      step: 2,
      description: "Upload link surat undangan seminar",
    },
    {
      label: "Seminar KP",
      step: 3,
      description: "Pelaksanaan seminar kerja praktik",
    },
    {
      label: "Pasca Seminar",
      step: 4,
      description: "Upload link dokumen pasca seminar",
    },
    {
      label: "Nilai KP",
      step: 5,
      description: "Nilai akhir kerja praktik",
    },
  ];

  // Get current active step
  const currentStep = steps.find((s) => s.step === infoPengajuanSeminar.step);

  return (
    <div className="w-full mx-auto">
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg overflow-hidden">
        {/* Main Content */}
        <div className="p-4">
          {/* Current Step Section - Show at top when requirements are met */}
          {semuaSyaratTerpenuhi && currentStep && (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg p-4 mb-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-lg font-bold">
                      {currentStep.step + 1}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-lg">{currentStep.label}</h4>
                      <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                        {currentStep.step + 1} dari {steps.length}
                      </span>
                    </div>
                    <p className="text-white/90 text-sm">
                      {currentStep.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Requirements Section */}
          <div className="bg-white dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 mb-4">
            <h3 className="font-semibold text-base mb-3 text-slate-700 dark:text-slate-300">
              Daftar Persyaratan
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {renderCheckItem(checkmarks.hapalan, "Telah Muroja'ah Juz 30 (dari An-Naba' sampai Adh-Dhuha)", "hapalan")}
              {renderCheckItem(
                checkmarks.kerja_praktik,
                "Terdaftar Melaksanakan Kerja Praktik",
                "kerja_praktik"
              )}
              {renderCheckItem(
                checkmarks.bimbingan,
                "Minimal 5x Bimbingan dengan Dosen Pembimbing KP",
                "bimbingan"
              )}
              {renderCheckItem(
                checkmarks.dailyReport,
                "Daily Report KP Telah di-Approve",
                "dailyReport"
              )}
              {renderCheckItem(
                checkmarks.nilaiInstansi,
                "Telah Mendapatkan Nilai dari Pembimbing Instansi",
                "nilaiInstansi"
              )}
            </div>
          </div>

          {/* Status Section - Only show when requirements are not met */}
          {!semuaSyaratTerpenuhi && (
            <div className="rounded-xl p-4 border-2 shadow-md transform transition-all duration-300 bg-gradient-to-r from-yellow-600/80 via-orange-600/80 to-pink-600/80 dark:from-yellow-600/30 dark:via-orange-400/30 dark:to-pink-500/30 dark:border-amber-400/20 border-amber-400/40 text-white shadow-amber-200 dark:shadow-amber-900/50">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-lg mb-1">
                    ⚠️ Persyaratan Belum Lengkap
                  </h4>
                  <p className="text-white/90 text-sm">
                    Silakan lengkapi semua persyaratan yang diperlukan sebelum
                    melanjutkan.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/30">
          <button
            className={`w-full h-12 text-sm font-semibold transition-all duration-300 rounded-lg ${
              semuaSyaratTerpenuhi && step1Accessible
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                : "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
            } ${
              isAnimating ? "animate-pulse" : ""
            } flex items-center justify-center gap-2`}
            disabled={!semuaSyaratTerpenuhi || !step1Accessible}
            onClick={handleButtonClick}
          >
            {semuaSyaratTerpenuhi && step1Accessible ? (
              <>
                <span>Lanjut</span>
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Lengkapi Persyaratan Terlebih Dahulu</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendaftaranCard;
