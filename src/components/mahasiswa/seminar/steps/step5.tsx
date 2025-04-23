import { FC } from "react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import Stepper from "@/components/mahasiswa/seminar/stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Status from "../status";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw } from "lucide-react";
import DocumentCard from "../formulir-dokumen";

// Types and interfaces
interface Step5Props {
  activeStep: number;
  status: "belum" | "validasi" | "ditolak";
}

interface CardHeaderProps {
  title: string;
}

interface EvaluationCardProps {
  title: string;
  placeholder: string;
  rotate?: number;
}

interface DocumentInfo {
  title: string;
  status: "default" | "validasi" | "diterima" | "revisi";
  notes?: string;
}

interface DocumentFormProps {
  documents: DocumentInfo[];
  showHeader?: boolean;
  showActions?: boolean;
}

// Constants
const DOCUMENTS = [
  "Berita Acara Seminar KP",
  "Lembar Pengesahan KP",
  "Daftar Hadir Seminar KP",
  "(Jika Ada) Revisi Laporan Tambahan",
  "(Jika Ada) Upload Sistem KP Final",
];

// Reusable components
const CardHeaderGradient: FC<CardHeaderProps> = ({ title }) => (
  <div className="bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-4">
    <CardTitle className="text-white text-lg font-medium">{title}</CardTitle>
  </div>
);

const EvaluationCard: FC<EvaluationCardProps> = ({
  title,
  placeholder,
  rotate = 0,
}) => (
  <Card
    className={`flex-1 flex flex-col rounded-lg overflow-visible relative bg-yellow-300 shadow-lg transform ${
      rotate !== 0 ? (rotate > 0 ? "rotate-1" : "-rotate-1") : ""
    }`}
  >
    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-500 rounded-full shadow-md z-10 flex items-center justify-center">
      <div className="w-2 h-2 bg-yellow-800 rounded-full"></div>
    </div>

    <div className="absolute inset-0 shadow-inner"></div>

    <CardHeader className="pb-0 pt-6">
      <CardTitle className="text-base font-semibold text-yellow-900">
        # {title}
      </CardTitle>
    </CardHeader>

    <CardContent className="flex flex-col gap-4 flex-grow p-4">
      <Textarea
        placeholder={placeholder}
        className="w-full text-gray-800 bg-yellow-200 border-none shadow-inner min-h-32 resize-none"
      />
    </CardContent>
  </Card>
);

const FormActions: FC = () => (
  <div className="flex justify-end mt-5">
    <div className="flex gap-3">
      <Button
        variant="outline"
        className="border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Kosongkan Formulir
      </Button>
      <Button className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-white border-none shadow-sm hover:shadow">
        Kirim
      </Button>
    </div>
  </div>
);

const DocumentForm: FC<DocumentFormProps> = ({
  documents,
  showHeader = true,
  showActions = true,
}) => (
  <>
    <Card className="border dark:border-none shadow-sm rounded-lg overflow-hidden dark:bg-gray-900">
      {showHeader && (
        <CardHeaderGradient title="Silakan isi formulir di bawah ini untuk divalidasi!" />
      )}
      <CardContent className="p-5 flex flex-col gap-5">
        {documents.map((doc, index) => (
          <DocumentCard
            key={index}
            judulDokumen={doc.title}
            status={doc.status}
            catatan={doc.notes}
          />
        ))}
      </CardContent>
    </Card>
    {showActions && <FormActions />}
  </>
);

const EvaluationSection: FC = () => (
  <div className="px-4 py-6">
    <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
      <EvaluationCard
        title="Catatan/Evaluasi Dosen Pembimbing"
        placeholder="Silakan untuk laporannya diperbaiki daftar pustaka dan footnote-nya"
        rotate={-1}
      />
      <EvaluationCard
        title="Catatan/Evaluasi Dosen Penguji"
        placeholder="Evaluasi daftar isi, urutannya salah"
        rotate={1}
      />
    </div>
  </div>
);

// Main component
const Step5: FC<Step5Props> = ({ activeStep, status }) => {
  // Function to generate document configuration based on status
  const getDocumentConfig = (): DocumentInfo[] => {
    if (status === "ditolak") {
      return [
        { title: "Upload Berita Acara Seminar KP", status: "diterima" },
        { title: "Upload Lembar Pengesahan KP", status: "diterima" },
        { title: "Upload Daftar Hadir Seminar KP", status: "diterima" },
        {
          title: "Upload Revisi Daily Report (jika ada)",
          status: "revisi",
          notes: "",
        },
        {
          title: "Upload Revisi Laporan Tambahan (jika ada)",
          status: "diterima",
        },
        {
          title: "Upload Sistem KP Final (jika ada)",
          status: "revisi",
          notes: "",
        },
      ];
    } else {
      return DOCUMENTS.map((title) => ({
        title,
        status: status === "validasi" ? "validasi" : "default",
      }));
    }
  };

  const renderStatusNotification = () => {
    if (status === "belum") {
      return (
        <Status
          status="belum"
          title="Anda Belum Mengupload Dokumen-dokumen Pasca Seminar KP"
          subtitle="Silakan lengkapi dokumen terlebih dahulu."
        />
      );
    }

    if (status === "validasi") {
      return (
        <Status
          status="validasi"
          title="Dokumen Pasca Seminar KP Anda dalam proses Validasi"
        />
      );
    }

    if (status === "ditolak") {
      return (
        <Status
          status="ditolak"
          title="Validasi Dokumen Pasca Seminar KP Anda Ditolak"
          subtitle="Silakan isi kembali Form sesuai perintah dengan benar!"
        />
      );
    }

    return null;
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-8">
        Validasi Kelengkapan Berkas Seminar Kerja Praktik
      </h1>
      <Stepper activeStep={activeStep} />

      {renderStatusNotification()}

      <div className="flex flex-col">
        <EvaluationSection />
        <DocumentForm
          documents={getDocumentConfig()}
          showHeader={status !== "validasi"}
          showActions={status !== "validasi"}
        />
      </div>
    </DashboardLayout>
  );
};

export default Step5;
