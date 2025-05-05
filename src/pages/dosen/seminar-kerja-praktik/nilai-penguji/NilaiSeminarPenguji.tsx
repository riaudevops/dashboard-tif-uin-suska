import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import React, { useState, useEffect, useRef } from "react";
import {
  Check,
  Save,
  MessageSquare,
  Award,
  ArrowLeft,
  FileText,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useNavigate, useLocation } from "react-router-dom";

// Updated Student interface
interface Student {
  id: number;
  nim: string;
  name: string;
  semester: number;
  judul: string;
  lokasi: string;
  dosenPembimbing: string;
  pembimbingInstansi: string;
  ruangan: string;
  jam: string;
  tanggalSeminar: string;
  status: "belum dinilai" | "selesai";
  tanggalDinilai?: string;
}

// Updated Scores interface to use number values instead of strings
interface Scores {
  penguasaan: number;
  presentasi: number;
  kesesuaian: number;
}

// Interface for criteria definition
interface CriteriaDefinition {
  id: keyof Scores;
  title: string;
  percentage: number;
  description: string;
}

interface CriteriaSectionProps {
  criteria: CriteriaDefinition;
  value: number;
  onChange: (id: keyof Scores, value: number) => void;
}

const NilaiSeminarPenguji: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get student data from state, use default if not provided
  const studentFromState = (location.state?.student as Student) || {
    id: 0,
    nim: "",
    name: "",
    semester: 0,
    judul: "",
    lokasi: "",
    dosenPembimbing: "",
    pembimbingInstansi: "",
    ruangan: "",
    jam: "",
    tanggalSeminar: "",
    status: "belum dinilai" as const,
  };

  const [student] = useState<Student>(studentFromState);

  // Initialize scores with numerical values
  const [scores, setScores] = useState<Scores>({
    penguasaan: 0,
    presentasi: 0,
    kesesuaian: 0,
  });

  const [totalScore, setTotalScore] = useState<number>(0);
  const [notes, setNotes] = useState("");

  // Criteria definitions with weights
  const criteriaDefinitions: CriteriaDefinition[] = [
    {
      id: "penguasaan",
      title: "Penguasaan Materi",
      percentage: 25,
      description:
        "Penilaian terhadap pemahaman dan penguasaan mahasiswa terhadap materi kerja praktik yang telah dilakukan.",
    },
    {
      id: "presentasi",
      title: "Teknik Presentasi",
      percentage: 40,
      description:
        "Penilaian terhadap kemampuan mahasiswa dalam menyampaikan materi presentasi dengan baik dan jelas.",
    },
    {
      id: "kesesuaian",
      title: "Kesesuaian Laporan dan Presentasi",
      percentage: 35,
      description:
        "Penilaian terhadap kesesuaian antara isi laporan dengan materi yang dipresentasikan.",
    },
  ];

  // Calculate total score whenever scores change
  useEffect(() => {
    const total =
      scores.penguasaan * 0.25 +
      scores.presentasi * 0.4 +
      scores.kesesuaian * 0.35;

    setTotalScore(parseFloat(total.toFixed(1)));
  }, [scores]);

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  const handleScoreChange = (category: keyof Scores, value: number): void => {
    setScores((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 90) return "Sangat Baik";
    if (score >= 80) return "Baik";
    if (score >= 70) return "Cukup";
    if (score < 70) return "Kurang";
    return "";
  };

  const handleSubmit = (): void => {
    // Check if any score is 0 (unset)
    const isScoreComplete = Object.values(scores).every((score) => score > 0);

    if (!isScoreComplete) {
      toast({
        title: "⚠️ Peringatan",
        description: "Mohon lengkapi semua kriteria penilaian",
        action: <ToastAction altText="Tutup">Tutup</ToastAction>,
        duration: 3000,
      });
      return;
    }

    toast({
      title: "👌 Berhasil",
      description: "Penilaian berhasil disimpan!",
      action: <ToastAction altText="Tutup">Tutup</ToastAction>,
      duration: 3000,
    });

    console.log("Submitted scores:", scores);
    console.log("Total score:", totalScore);
    console.log("Notes:", notes);
    console.log("Student:", student);
  };

  // Custom circular progress indicator for the total score
  const CircularProgress = ({ value }: { value: number }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <div className="relative w-44 h-44">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={value >= 70 ? "#10b981" : "#ef4444"}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {value}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              TOTAL NILAI
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Component for individual criteria with slider
  const CriteriaSection: React.FC<CriteriaSectionProps> = ({
    criteria,
    value,
    onChange,
  }) => {
    // Use a ref to track the current slider value without causing re-renders
    const sliderValueRef = useRef(value);
    const [displayValue, setDisplayValue] = useState(value);

    // Debounce timer ref
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Update the displayed value immediately for smooth UI
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value);
      sliderValueRef.current = newValue;
      setDisplayValue(newValue);

      // Clear any existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce the actual state update to reduce re-renders
      debounceTimerRef.current = setTimeout(() => {
        onChange(criteria.id, newValue);
      }, 50);
    };

    // Handle direct input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value) || 0;
      // Clamp the value between 0 and 100
      const clampedValue = Math.min(100, Math.max(0, newValue));
      setDisplayValue(clampedValue);
      sliderValueRef.current = clampedValue;

      // Update the parent component's state
      onChange(criteria.id, clampedValue);
    };

    // Ensure we update our local state if the value prop changes
    useEffect(() => {
      setDisplayValue(value);
      sliderValueRef.current = value;
    }, [value]);

    return (
      <div className="mb-6 p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30">
            <span className="text-teal-600 dark:text-teal-400 text-sm font-bold">
              %
            </span>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100">
              {criteria.title}{" "}
              <span className="text-teal-600 dark:text-teal-400">
                ({criteria.percentage}%)
              </span>
            </h3>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 ml-11">
          {criteria.description}
        </p>

        <div className="flex justify-between items-center mb-2">
          <div>
            {displayValue > 0 && (
              <div className="flex items-center text-sm">
                <Check
                  size={16}
                  className="text-green-500 dark:text-green-400 mr-1"
                />
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  Nilai: {displayValue} - {getScoreLabel(displayValue)}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 text-sm rounded-md ${
                displayValue >= 80
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : displayValue >= 70
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                  : displayValue > 0
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              {displayValue > 0 ? getScoreLabel(displayValue) : "Belum dinilai"}
            </span>
            <input
              type="number"
              value={displayValue || ""}
              onChange={handleInputChange}
              min="0"
              max="100"
              className="w-16 text-center border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={displayValue}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
            style={{
              WebkitAppearance: "none",
              transition: "all 0.1s ease",
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-5">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={handleGoBack}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={20} className="mr-1" />
            <span className="text-sm font-medium">Kembali</span>
          </button>
        </div>

        <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Penilaian Seminar Kerja Praktik
        </h2>

        {/* Student Info Section  */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-5 border border-gray-200 dark:border-gray-800 mb-6 shadow-sm">
          {/* Student's Basic Info */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
                {student.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                NIM: {student.nim} • Semester {student.semester}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Award size={24} className="text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Judul Section with Background */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-100 dark:border-green-800">
            <div className="flex items-start gap-3">
              <div>
                <FileText
                  size={20}
                  className="text-green-600 dark:text-green-400 mt-1"
                />
              </div>
              <div>
                <div className="text-sm font-medium text-green-600 dark:text-green-400">
                  Judul Laporan
                </div>
                <div className="text-gray-800 dark:text-gray-200 font-medium">
                  {student.judul}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>
          {`
            /* Custom styling for the range slider */
            input[type="range"] {
              -webkit-appearance: none;
              appearance: none;
              height: 6px;
              background: #e5e7eb;
              border-radius: 5px;
              background-image: linear-gradient(#10b981, #10b981);
              background-repeat: no-repeat;
            }
            
            /* Thumb styles for different browsers */
            input[type="range"]::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              height: 18px;
              width: 18px;
              border-radius: 50%;
              background: #10b981;
              cursor: pointer;
              border: none;
              box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
              transition: all 0.1s ease;
            }
            
            input[type="range"]::-moz-range-thumb {
              height: 18px;
              width: 18px;
              border-radius: 50%;
              background: #10b981;
              cursor: pointer;
              border: none;
              box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
              transition: all 0.1s ease;
            }
            
            input[type="range"]::-ms-thumb {
              height: 18px;
              width: 18px;
              border-radius: 50%;
              background: #10b981;
              cursor: pointer;
              border: none;
              box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
              transition: all 0.1s ease;
            }
            
            /* Active state */
            input[type="range"]:active::-webkit-slider-thumb {
              transform: scale(1.2);
              box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
            }
            
            input[type="range"]:active::-moz-range-thumb {
              transform: scale(1.2);
              box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
            }
            
            /* Focus state */
            input[type="range"]:focus {
              outline: none;
            }
            
            /* Dark mode adjustments */
            .dark input[type="range"] {
              background: #374151;
              background-image: linear-gradient(#059669, #059669);
              background-repeat: no-repeat;
            }
            
            .dark input[type="range"]::-webkit-slider-thumb {
              background: #10b981;
            }
            
            .dark input[type="range"]::-moz-range-thumb {
              background: #10b981;
            }
          `}
        </style>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Criteria Assessment */}
          <div className="flex flex-col">
            <div className="bg-teal-800 dark:bg-teal-900 text-white p-4 rounded-t-lg shadow-sm">
              <h3 className="font-bold">Kriteria Penilaian</h3>
              <p className="text-sm text-teal-100">
                Beri nilai pada skala 0-100 untuk setiap kriteria
              </p>
            </div>

            <div className="space-y-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-b-lg border border-gray-200 dark:border-gray-700 border-t-0 shadow-sm flex-1">
              {criteriaDefinitions.map((criteria) => (
                <CriteriaSection
                  key={criteria.id}
                  criteria={criteria}
                  value={scores[criteria.id]}
                  onChange={handleScoreChange}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="flex flex-col">
            <div className="bg-teal-800 dark:bg-teal-900 text-white p-4 rounded-t-lg shadow-sm">
              <h3 className="font-bold">Ringkasan Penilaian</h3>
              <p className="text-sm text-teal-100">
                Hasil kalkulasi dari nilai yang diinputkan berdasarkan
                persentase
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-b-lg border border-gray-200 dark:border-gray-700 border-t-0 shadow-sm flex-1">
              <div className="space-y-4">
                {criteriaDefinitions.map((criteria) => (
                  <div
                    key={criteria.id}
                    className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2"
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                      {criteria.title} ({criteria.percentage}%)
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {(
                        scores[criteria.id] *
                        (criteria.percentage / 100)
                      ).toFixed(1)}
                    </span>
                  </div>
                ))}

                <div className="flex justify-between pt-2">
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    Total Nilai
                  </span>
                  <span
                    className={`font-bold text-lg ${
                      totalScore >= 80
                        ? "text-green-600 dark:text-green-400"
                        : totalScore >= 70
                        ? "text-blue-600 dark:text-blue-400"
                        : totalScore > 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {totalScore}
                  </span>
                </div>

                <div className="flex justify-center pt-4 pb-4">
                  <CircularProgress value={totalScore} />
                </div>

                {/* Notes Section - Moved to be below the total score */}
                <div className="pt-2 pb-4">
                  <div className="flex items-center gap-2 mb-2 text-teal-700 dark:text-teal-400">
                    <MessageSquare size={18} />
                    <h3 className="font-bold text-sm uppercase">
                      Catatan Penguji
                    </h3>
                  </div>
                  <textarea
                    className="w-full h-40 p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-teal-500 focus:border-teal-500 text-sm"
                    placeholder="Masukkan catatan, komentar, atau saran untuk mahasiswa..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button
                    onClick={handleGoBack}
                    className="py-2.5 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md font-medium transition-colors text-sm flex items-center justify-center"
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    Batal
                  </button>
                  <button
                    onClick={handleSubmit}
                    className={`py-2.5 px-4 rounded-md font-medium transition-colors text-sm flex items-center justify-center ${
                      Object.values(scores).some((score) => score === 0)
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-teal-700 hover:bg-teal-800 text-white"
                    }`}
                    disabled={Object.values(scores).some(
                      (score) => score === 0
                    )}
                  >
                    <Save size={16} className="mr-1" />
                    Simpan Nilai
                  </button>
                </div>

                {/* Validation Message */}
                {Object.values(scores).some((score) => score === 0) && (
                  <p className="text-center text-xs text-red-500 dark:text-red-400 mt-2">
                    Mohon lengkapi semua kriteria penilaian
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button (only for mobile view) */}
        <div className="mt-6 flex justify-center md:hidden">
          <button
            onClick={handleSubmit}
            disabled={Object.values(scores).some((score) => score === 0)}
            className={`flex items-center px-6 py-3 rounded-lg font-medium text-white transition-all ${
              Object.values(scores).some((score) => score === 0)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-md hover:shadow-lg"
            }`}
          >
            <Save size={20} className="mr-2" />
            Simpan Penilaian
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NilaiSeminarPenguji;
