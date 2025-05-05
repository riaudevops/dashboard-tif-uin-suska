import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import React, { useState } from "react";
import { Check, Save, MessageSquare, Award, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useNavigate } from "react-router-dom";

// Define type interfaces
interface StudentData {
  name: string;
  nim: string;
  title: string;
  major: string;
}

interface Scores {
  penguasaan: string | null;
  presentasi: string | null;
  kesesuaian: string | null;
}

interface Grade {
  label: string;
  description: string;
}

interface CriteriaSectionProps {
  title: string;
  description: string;
  category: "penguasaan" | "presentasi" | "kesesuaian";
  scores: Scores;
  onScoreSelect: (category: keyof Scores, value: string) => void;
  grades: Grade[];
}

const NilaiSeminarPenguji: React.FC = () => {
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState<StudentData>({
    name: "Ahmad Farhan",
    nim: "12345678",
    title: "Implementasi Teknologi Blockchain untuk Keamanan Data Kesehatan",
    major: "Informatika",
  });

  const [scores, setScores] = useState<Scores>({
    penguasaan: null,
    presentasi: null,
    kesesuaian: null,
  });

  const [notes, setNotes] = useState("");

  const handleGoBack = () => {
    navigate(-1); // This will navigate to the previous page
  };

  const handleScoreSelect = (
    category: keyof Scores,
    value: string | null
  ): void => {
    setScores((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const grades: Grade[] = [
    { label: "A", description: "Sangat Baik" },
    { label: "A-", description: "Baik Sekali" },
    { label: "B+", description: "Lebih Dari Baik" },
    { label: "B", description: "Baik" },
    { label: "B-", description: "Cukup Baik" },
    { label: "C+", description: "Lebih Dari Cukup" },
    { label: "C", description: "Cukup" },
    { label: "D", description: "Kurang" },
  ];

  const handleSubmit = (): void => {
    toast({
      title: "👌 Berhasil",
      description: "Penilaian berhasil disimpan!",
      action: <ToastAction altText="Tutup">Tutup</ToastAction>,
      duration: 3000,
    });

    console.log("Submitted scores:", scores);
    console.log("Notes:", notes);
  };

  const getGradeDescription = (value: string): string => {
    const grade = grades.find((g) => g.label === value);
    return grade ? grade.description : "";
  };

  const CriteriaSection: React.FC<CriteriaSectionProps> = ({
    title,
    description,
    category,
    scores,
    onScoreSelect,
    grades,
  }) => (
    <div className="mb-6 p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
      <h3 className="font-bold text-gray-800 dark:text-gray-100 uppercase mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {description}
      </p>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {grades.map((grade) => (
          <button
            key={grade.label}
            onClick={() =>
              handleScoreSelect(
                category,
                scores[category] === grade.label ? null : grade.label
              )
            }
            className={`flex items-center justify-center rounded-lg py-2 border transition-all ${
              scores[category] === grade.label
                ? "bg-green-500 text-white border-green-600 dark:bg-green-600 dark:border-green-500"
                : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600"
            }`}
          >
            {grade.label}
          </button>
        ))}
      </div>

      {scores[category] && (
        <div className="mt-3 flex items-center text-sm">
          <Check
            size={16}
            className="text-green-500 dark:text-green-400 mr-1"
          />
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {scores[category]}:{" "}
            {getGradeDescription(scores[category] as string)}
          </span>
        </div>
      )}
    </div>
  );

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

        {/* Student Info Section - Uncomment if needed */}
        {/* <div className="mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
            <div className="flex items-start">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
                  {studentData.name}
                </h3>
                <div className="text-gray-600 dark:text-gray-400 text-sm">
                  <span>NIM: {studentData.nim}</span>
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  <span>Program Studi: {studentData.major}</span>
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  <span>Judul: {studentData.title}</span>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Assessment Criteria */}
        <CriteriaSection
          title="PENGUASAAN KEILMUAN"
          description="Mahasiswa dapat mengimplementasikan ilmu dan pengetahuan yang didapat semasa kuliah ke dalam dunia kerja untuk menyelesaikan permasalahan yang berkaitan dengan bidang ilmu keinformatikaan atau juga dapat memiliki multidisiplin ilmu yang penyelesaian permasalahan/kebutuhan solusinya berkaitan dengan keinformatikaan."
          category="penguasaan"
          scores={scores}
          onScoreSelect={handleScoreSelect}
          grades={grades}
        />

        <CriteriaSection
          title="KEMAMPUAN PRESENTASI"
          description="Mahasiswa dapat mempresentasikan kegiatan yang dilaksanakannya selama kegiatan Kerja Praktik seperti yang tertulis pada Daily Report dan juga dapat menyampaikan Projek/Tugas KP nya seperti yang tertulis pada Laporan Tambahan dengan baik."
          category="presentasi"
          scores={scores}
          onScoreSelect={handleScoreSelect}
          grades={grades}
        />

        <CriteriaSection
          title="KESESUAIAN & URGENSI"
          description="Kesesuaian kerja praktik dengan bidang studi dan juga urgensi dari projek/tugas yang dilaksanakan oleh mahasiswa selama kegiatan kerja praktik berlangsung."
          category="kesesuaian"
          scores={scores}
          onScoreSelect={handleScoreSelect}
          grades={grades}
        />

        {/* Notes Section */}
        <div className="mb-6 p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 uppercase mb-2 flex items-center">
            <MessageSquare
              size={18}
              className="mr-2 text-gray-600 dark:text-gray-400"
            />
            CATATAN PENGUJI
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Berikan catatan, saran, atau komentar tambahan terkait presentasi
            dan projek mahasiswa.
          </p>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tulis catatan untuk mahasiswa di sini..."
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 min-h-24 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 outline-none text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        {/* Summary */}
        {(scores.penguasaan || scores.presentasi || scores.kesesuaian) && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center">
              <Award
                size={18}
                className="mr-2 text-yellow-500 dark:text-yellow-400"
              />
              Ringkasan Penilaian
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {scores.penguasaan && (
                <div className="p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Penguasaan Keilmuan
                  </div>
                  <div className="font-bold text-lg flex items-center">
                    <span className="mr-2 text-gray-800 dark:text-gray-200">
                      {scores.penguasaan}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {getGradeDescription(scores.penguasaan)}
                    </span>
                  </div>
                </div>
              )}

              {scores.presentasi && (
                <div className="p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Kemampuan Presentasi
                  </div>
                  <div className="font-bold text-lg flex items-center">
                    <span className="mr-2 text-gray-800 dark:text-gray-200">
                      {scores.presentasi}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {getGradeDescription(scores.presentasi)}
                    </span>
                  </div>
                </div>
              )}

              {scores.kesesuaian && (
                <div className="p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Kesesuaian & Urgensi
                  </div>
                  <div className="font-bold text-lg flex items-center">
                    <span className="mr-2 text-gray-800 dark:text-gray-200">
                      {scores.kesesuaian}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {getGradeDescription(scores.kesesuaian)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            disabled={
              !scores.penguasaan || !scores.presentasi || !scores.kesesuaian
            }
            className={`flex items-center px-6 py-2 rounded-lg font-medium text-white text-sm ${
              !scores.penguasaan || !scores.presentasi || !scores.kesesuaian
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
            }`}
          >
            <Save size={16} className="mr-2" />
            Simpan Penilaian
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NilaiSeminarPenguji;
