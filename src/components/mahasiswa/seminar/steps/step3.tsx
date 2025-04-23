import { FC, useState } from "react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import Stepper from "@/components/mahasiswa/seminar/stepper";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import DocumentCard from "../formulir-dokumen";
import InfoCard from "../informasi-seminar";
import Status from "../status";
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

// Define types for props and data
type StepStatus = "belum" | "validasi" | "ditolak";
type DocumentStatus = "default" | "validasi" | "revisi";

interface Step3Props {
  activeStep: number;
  status: StepStatus;
}

interface CardHeaderProps {
  title: string;
}

interface FormActionsProps {
  onReset?: () => void;
  onSubmit?: () => void;
}

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

// Document form container component
interface DocumentFormProps {
  showHeader?: boolean;
  status: DocumentStatus;
  catatan?: string;
  dokumentLink?: string;
  showActions?: boolean;
  onReset?: () => void;
  onSubmit?: () => void;
  onLinkChange?: (value: string) => void;
}

const DocumentForm: FC<DocumentFormProps> = ({
  showHeader = true,
  status,
  catatan = "",
  dokumentLink = "",
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
        <DocumentCard
          judulDokumen="Dokumen Surat Undangan Seminar Kerja Praktik"
          status={status}
          catatan={catatan}
          link={dokumentLink}
          onLinkChange={onLinkChange}
        />
      </CardContent>
    </Card>
    {showActions && <FormActions onReset={onReset} onSubmit={onSubmit} />}
  </>
);

// Main component
const Step3: FC<Step3Props> = ({ activeStep, status }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dokumentLink, setDokumentLink] = useState("");

  // Info fields to display
  const informasiSeminarFields = [
    "lokasi",
    "dosenPembimbing",
    "dosenPenguji",
    "kontakPembimbing",
    "kontakPenguji",
    "judul",
  ];

  const handleReset = () => {
    // Reset the form data
    setDokumentLink("");

    // Show toast notification for reset confirmation
    toast({
      title: "✅ Berhasil",
      description: "Formulir berhasil dikosongkan",
      duration: 3000,
    });
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
    console.log("Form submitted with document link:", dokumentLink);
  };

  const handleLinkChange = (value: string) => {
    setDokumentLink(value);
  };

  // Render content based on status
  const renderContent = () => {
    switch (status) {
      case "belum":
        return (
          <DocumentForm
            status="default"
            dokumentLink={dokumentLink}
            onLinkChange={handleLinkChange}
            onReset={handleReset}
            onSubmit={handleOpenDialog}
          />
        );
      case "validasi":
        return (
          <DocumentForm
            showHeader={false}
            status="validasi"
            dokumentLink={dokumentLink}
            showActions={false}
          />
        );
      case "ditolak":
        return (
          <DocumentForm
            status="revisi"
            catatan="Format surat undangan tidak sesuai dengan template yang diberikan. Mohon untuk menyusun ulang sesuai dengan panduan."
            dokumentLink={dokumentLink}
            onLinkChange={handleLinkChange}
            onReset={handleReset}
            onSubmit={handleOpenDialog}
          />
        );
      default:
        return null;
    }
  };

  // Render status notification if needed
  const renderStatusNotification = () => {
    if (status === "belum") {
      return (
        <Status
          status="belum"
          title="Anda Belum Mengupload Dokumen Surat Undangan Seminar Kerja Praktik"
          subtitle="Silakan lengkapi dokumen terlebih dahulu."
        />
      );
    }

    if (status === "validasi") {
      return (
        <Status
          status="validasi"
          title="Dokumen Surat Undangan Seminar Kerja Praktik Anda dalam proses validasi"
        />
      );
    }

    if (status === "ditolak") {
      return (
        <Status
          status="ditolak"
          title="Dokumen Surat Undangan Seminar Kerja Praktik Anda Ditolak"
          subtitle="Silakan Isi kembali Form sesuai perintah!"
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

      {/* Information card is shown for all statuses */}
      <InfoCard displayItems={informasiSeminarFields} />

      {/* Render content based on status */}
      {renderContent()}

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

export default Step3;
