import { FC, useState } from "react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import Stepper from "@/components/mahasiswa/seminar/stepper";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import Status from "@/components/mahasiswa/seminar/status";
import InfoCard from "../informasi-seminar";
import DocumentCard from "../formulir-dokumen";
import { toast } from "@/hooks/use-toast";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Type definitions
type StepStatus = "belum" | "validasi" | "ditolak" | "diterima";
type DocumentStatus = "default" | "validasi" | "revisi" | "diterima";

interface FormActionsProps {
  onReset?: () => void;
  onSubmit?: () => void;
}

interface CardHeaderProps {
  title: string;
}

interface Step1Props {
  activeStep: number;
  status: StepStatus;
}

interface DocumentInfo {
  title: string;
  status: DocumentStatus;
  notes?: string;
  link?: string;
}

// Constants
const DOCUMENTS = [
  "Dokumen Surat Keterangan Selesai Kerja Praktik Dari Instansi",
  "Menghadiri Seminar Kerja Praktik Mahasiswa Lain Minimal 5 Kali",
  "Laporan Tambahan Tugas Kerja Praktik",
];

// Component for gradient card header
const CardHeaderGradient: FC<CardHeaderProps> = ({ title }) => (
  <div className="bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-4">
    <CardTitle className="text-white text-lg font-medium">{title}</CardTitle>
  </div>
);

// Form actions component for reuse
const FormActions: FC<FormActionsProps> = ({ onReset, onSubmit }) => (
  <div className="flex justify-end mt-5">
    <div className="flex gap-3">
      <Button
        variant="outline"
        className="border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2"
        onClick={onReset}
      >
        <RefreshCw className="h-4 w-4" />
        Kosongkan Formulir
      </Button>
      <Button
        className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-white border-none shadow-sm hover:shadow"
        onClick={onSubmit}
      >
        Kirim
      </Button>
    </div>
  </div>
);

// Document list component
interface DocumentFormProps {
  documents: DocumentInfo[];
  showHeader?: boolean;
  showActions?: boolean;
  onReset?: () => void;
  onSubmit?: () => void;
  onLinkChange?: (index: number, value: string) => void;
}

const DocumentForm: FC<DocumentFormProps> = ({
  documents,
  showHeader = true,
  showActions = true,
  onReset,
  onSubmit,
  onLinkChange,
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
            link={doc.link}
            onLinkChange={(value) => onLinkChange && onLinkChange(index, value)}
          />
        ))}
      </CardContent>
    </Card>
    {showActions && <FormActions onReset={onReset} onSubmit={onSubmit} />}
  </>
);

// Main component
const Step1: FC<Step1Props> = ({ activeStep, status }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Add state to track form data
  const [formDocuments, setFormDocuments] = useState<DocumentInfo[]>(() =>
    getInitialDocumentConfig(status)
  );

  const informasiSeminarFields = [
    "lokasi",
    "lamaKerjaPraktek",
    "dosenPembimbing",
    "kontakPembimbing",
    "judul",
  ];

  // Handler for link changes
  const handleLinkChange = (index: number, value: string) => {
    const updatedDocs = [...formDocuments];
    updatedDocs[index] = { ...updatedDocs[index], link: value };
    setFormDocuments(updatedDocs);
  };

  const handleReset = () => {
    // Reset the form data by clearing all links
    const resetDocs = formDocuments.map((doc) => ({
      ...doc,
      link: "", // Clear the link value
    }));
    setFormDocuments(resetDocs);

    // Show toast notification for reset confirmation
    toast({
      title: "✅ Berhasil",
      description: "Formulir berhasil dikosongkan",
      duration: 3000,
    });

    console.log("Form reset");
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    setIsDialogOpen(false);
    // Show success toast
    toast({
      title: "👌 Berhasil",
      description: "Dokumen berhasil dikirim untuk divalidasi",
      duration: 3000,
    });
    console.log("Form submitted with documents:", formDocuments);
  };

  // Get initial document configuration based on status
  function getInitialDocumentConfig(currentStatus: StepStatus): DocumentInfo[] {
    switch (currentStatus) {
      case "belum":
        return DOCUMENTS.map((title) => ({
          title,
          status: "default",
          link: "", // Initialize with empty link
        }));

      case "validasi":
        return DOCUMENTS.map((title) => ({
          title,
          status: "validasi",
          link: "", // Initialize with empty link
        }));

      case "ditolak":
        return [
          {
            title: DOCUMENTS[0],
            status: "diterima",
            link: "",
          },
          {
            title: DOCUMENTS[1],
            status: "diterima",
            link: "",
          },
          {
            title: DOCUMENTS[2],
            status: "revisi",
            notes:
              "Format laporan tidak sesuai dengan template yang diberikan. Mohon untuk menyusun ulang sesuai dengan panduan.",
            link: "",
          },
        ];

      default:
        return [];
    }
  }

  // Render status notification if needed
  const renderStatusNotification = () => {
    if (status === "belum") {
      return (
        <Status
          status="belum"
          title="Anda Belum Mengupload Dokumen Form Pendaftaran Diseminasi KP"
          subtitle="Silakan lengkapi dokumen terlebih dahulu."
        />
      );
    }

    if (status === "validasi") {
      return (
        <Status
          status="validasi"
          title="Dokumen Anda Sedang dalam Proses Validasi"
        />
      );
    }

    if (status === "ditolak") {
      return (
        <Status
          status="ditolak"
          title="Validasi Dokumen Anda Ditolak"
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

      <InfoCard displayItems={informasiSeminarFields} />

      <div className={`${status === "ditolak" ? "flex flex-col gap-4" : ""}`}>
        <DocumentForm
          documents={formDocuments}
          showHeader={status !== "validasi"}
          showActions={status !== "validasi"}
          onReset={handleReset}
          onSubmit={handleOpenDialog}
          onLinkChange={handleLinkChange}
        />
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Pengiriman</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin mengirim dokumen ini untuk divalidasi?
              Dokumen yang telah dikirim tidak dapat diubah sampai proses
              validasi selesai.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-white"
            >
              Yakin
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Step1;
