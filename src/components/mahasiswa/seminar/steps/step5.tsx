import { FC, useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Stepper from "@/components/mahasiswa/seminar/stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import Status from "../status";
import { Textarea } from "@/components/ui/textarea";
import DocumentCard from "../formulir-dokumen";
import { toast } from "@/hooks/use-toast";
import APISeminarKP from "@/services/api/mahasiswa/seminar-kp.service";
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

// Types and interfaces
type DocumentStatus = "default" | "Terkirim" | "Divalidasi" | "Ditolak";
type StepStatus = "belum" | "validasi" | "ditolak" | "diterima";

interface Step5Props {
  activeStep: number;
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
  status: DocumentStatus;
  notes?: string;
  link?: string;
}

interface FormActionsProps {
  onReset?: () => void;
  onSubmit?: () => void;
  disabledReset?: boolean;
}

// Constants
const DOCUMENTS = [
  "Berita Acara Seminar KP",
  "Lembar Pengesahan KP",
  "Daftar Hadir Seminar KP",
  "(Jika Ada) Revisi Laporan Tambahan",
  "(Jika Ada) Sistem KP Final",
];

// Dokumen wajib untuk Step 5
const MANDATORY_DOCUMENTS = [
  "Berita Acara Seminar KP",
  "Lembar Pengesahan KP",
  "Daftar Hadir Seminar KP",
];

// Pemetaan title ke jenis_dokumen API
const DOCUMENT_TYPE_MAP: Record<string, string> = {
  "Berita Acara Seminar KP": "BERITA_ACARA_SEMINAR",
  "Lembar Pengesahan KP": "LEMBAR_PENGESAHAN_KP",
  "Daftar Hadir Seminar KP": "DAFTAR_HADIR_SEMINAR",
  "(Jika Ada) Revisi Laporan Tambahan": "REVISI_LAPORAN_TAMBAHAN",
  "(Jika Ada) Sistem KP Final": "SISTEM_KP_FINAL",
};

// Pemetaan title dokumen ke URL
const DOCUMENT_URLS: Record<string, string> = {
  "Berita Acara Seminar KP": "/seminar-kp/dokumen/berita-acara-seminar",
  "Lembar Pengesahan KP": "/seminar-kp/dokumen/lembar-pengesahan-kp",
  "Daftar Hadir Seminar KP": "/seminar-kp/dokumen/daftar-hadir-seminar",
  "(Jika Ada) Revisi Laporan Tambahan":
    "/seminar-kp/dokumen/revisi-laporan-tambahan",
  "(Jika Ada) Sistem KP Final": "/seminar-kp/dokumen/sistem-kp-final",
};

// Reusable components
const CardHeaderGradient: FC<CardHeaderProps> = ({ title }) => (
  <div className="bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-4">
    <CardTitle className="text-white text-lg font-medium">{title}</CardTitle>
  </div>
);

const FormActions: FC<FormActionsProps> = ({
  onReset,
  onSubmit,
  disabledReset,
}) => (
  <div className="flex justify-end mt-5">
    <div className="flex gap-3">
      <Button
        variant="outline"
        className="border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2"
        onClick={onReset}
        disabled={disabledReset}
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
        defaultValue={placeholder}
        readOnly
      />
    </CardContent>
  </Card>
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
            key={doc.title}
            judulDokumen={doc.title}
            status={doc.status}
            catatan={doc.notes}
            link={doc.link}
            onLinkChange={(value) => onLinkChange && onLinkChange(index, value)}
          />
        ))}
      </CardContent>
    </Card>
    {showActions && (
      <FormActions
        onReset={onReset}
        onSubmit={onSubmit}
        disabledReset={documents.every(
          (doc) => doc.status !== "default" && doc.status !== "Ditolak"
        )}
      />
    )}
  </>
);

const EvaluationSection: FC<{
  evaluasiPembimbing: string;
  evaluasiPenguji: string;
}> = ({ evaluasiPembimbing, evaluasiPenguji }) => (
  <div className="px-4 py-6">
    <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
      <EvaluationCard
        title="Catatan/Evaluasi Dosen Pembimbing"
        placeholder={evaluasiPembimbing || "Belum ada catatan"}
        rotate={-1}
      />
      <EvaluationCard
        title="Catatan/Evaluasi Dosen Penguji"
        placeholder={evaluasiPenguji || "Belum ada catatan"}
        rotate={1}
      />
    </div>
  </div>
);

// Main component
const Step5: FC<Step5Props> = ({ activeStep }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formDocuments, setFormDocuments] = useState<DocumentInfo[]>([]);

  // Fetch data menggunakan TanStack Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["seminar-kp-step5"],
    queryFn: APISeminarKP.getDataMydokumen,
    staleTime: Infinity,
  });

  // Mutation untuk POST link dokumen
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: APISeminarKP.postLinkDokumen,
    onSuccess: (response) => {
      toast({
        title: "👌 Berhasil",
        description: `Dokumen berhasil dikirim dengan ID: ${response.id}`,
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["seminar-kp-step5"] });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Gagal",
        description: `Gagal mengirim dokumen: ${error.message}`,
        duration: 3000,
      });
    },
  });

  // Inisialisasi formDocuments berdasarkan data API
  useEffect(() => {
    if (data?.data) {
      const step5Docs = data.data.dokumen_seminar_kp.step5 || [];
      const step5Accessible = data.data.steps_info.step5_accessible;

      const initialDocs = DOCUMENTS.map((title) => {
        const apiDoc =
          step5Docs.find(
            (doc: any) => DOCUMENT_TYPE_MAP[title] === doc.jenis_dokumen
          ) || {};
        return {
          title,
          status:
            (apiDoc.status as DocumentStatus) ||
            (step5Accessible ? "default" : "Terkirim"),
          notes: apiDoc.komentar || "",
          link: apiDoc.link_path || "",
        };
      });
      setFormDocuments(initialDocs);
    }
  }, [data]);

  // Tentukan status berdasarkan data API dengan logika yang lebih akurat
  const status: StepStatus = useMemo(() => {
    if (!data?.data) return "belum";

    const step5Docs = data.data.dokumen_seminar_kp.step5 || [];
    const step5Accessible = data.data.steps_info.step5_accessible;

    // Jika step5_accessible true dan belum ada dokumen yang dikirim, status adalah "belum"
    if (step5Accessible && step5Docs.length === 0) {
      return "belum";
    }

    // Jika ada dokumen yang ditolak, status adalah "ditolak"
    if (step5Docs.some((doc: any) => doc.status === "Ditolak")) {
      return "ditolak";
    }

    // Filter dokumen wajib dari step5Docs
    const mandatoryDocs = step5Docs.filter((doc: any) =>
      MANDATORY_DOCUMENTS.some(
        (title) => DOCUMENT_TYPE_MAP[title] === doc.jenis_dokumen
      )
    );

    // Jika semua dokumen wajib sudah divalidasi, status adalah "diterima"
    if (
      mandatoryDocs.length === MANDATORY_DOCUMENTS.length &&
      mandatoryDocs.every((doc: any) => doc.status === "Divalidasi")
    ) {
      return "diterima";
    }

    // Jika ada dokumen yang dikirim tetapi belum divalidasi, status adalah "validasi"
    if (step5Docs.length > 0) {
      return "validasi";
    }

    // Default status jika tidak ada kondisi di atas
    return "belum";
  }, [data]);

  // Handler for link changes
  const handleLinkChange = (index: number, value: string) => {
    const updatedDocs = [...formDocuments];
    updatedDocs[index] = { ...updatedDocs[index], link: value };
    setFormDocuments(updatedDocs);
  };

  const handleReset = () => {
    const resetDocs = formDocuments.map((doc) => {
      if (doc.status === "default" || doc.status === "Ditolak") {
        return { ...doc, link: "" };
      }
      return doc;
    });
    setFormDocuments(resetDocs);
    toast({
      title: "✅ Berhasil",
      description: "Formulir berhasil dikosongkan untuk status default/ditolak",
      duration: 3000,
    });
  };

  const handleOpenDialog = () => {
    const documentsToSubmit = formDocuments.filter(
      (doc) =>
        doc.link && (doc.status === "default" || doc.status === "Ditolak")
    );
    if (documentsToSubmit.length === 0) {
      toast({
        title: "⚠️ Peringatan",
        description:
          "Harap isi setidaknya satu link dokumen untuk status default/ditolak!",
        duration: 3000,
      });
      return;
    }
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    setIsDialogOpen(false);
    const nim = data?.data.nim;
    const id_pendaftaran_kp = data?.data.pendaftaran_kp[0]?.id;

    // Kirim hanya dokumen dengan status "default" atau "Ditolak" yang memiliki link
    const documentsToSubmit = formDocuments.filter(
      (doc) =>
        doc.link && (doc.status === "default" || doc.status === "Ditolak")
    );
    if (documentsToSubmit.length > 0) {
      documentsToSubmit.forEach((doc, index) => {
        const url = DOCUMENT_URLS[doc.title];
        if (!url) {
          toast({
            title: "⚠️ Peringatan",
            description: `URL untuk dokumen "${doc.title}" tidak ditemukan!`,
            duration: 3000,
          });
          return;
        }

        mutation.mutate({
          nim,
          link_path: doc.link!,
          id_pendaftaran_kp,
          url,
        });
      });
    }
  };

  // Render status notification
  const renderStatusNotification = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    if (isError) {
      toast({
        title: "❌ Gagal",
        description: `Gagal mengambil data: ${error.message}`,
        duration: 3000,
      });
      return <div>Error: {error.message}</div>;
    }
    switch (status) {
      case "belum":
        return (
          <Status
            status="belum"
            title="Anda Belum Mengupload Dokumen-dokumen Pasca Seminar KP"
            subtitle="Silakan lengkapi dokumen terlebih dahulu."
          />
        );
      case "validasi":
        return (
          <Status
            status="validasi"
            title="Dokumen Pasca Seminar KP Anda dalam Proses Validasi"
          />
        );
      case "ditolak":
        return (
          <Status
            status="ditolak"
            title="Validasi Dokumen Pasca Seminar KP Anda Ditolak"
            subtitle="Silakan isi kembali Form sesuai perintah dengan benar!"
          />
        );
      case "diterima":
        return (
          <Status
            status="validasi"
            title="Dokumen Pasca Seminar KP Anda Telah Divalidasi"
          />
        );
      default:
        return null;
    }
  };

  // Dummy data for evaluation
  const evaluasiPembimbing = "Belum ada catatan";
  const evaluasiPenguji = "Belum ada catatan";

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-8">
        Validasi Kelengkapan Berkas Seminar Kerja Praktik
      </h1>
      <Stepper activeStep={activeStep} />

      {renderStatusNotification()}

      <div className={`${status === "ditolak" ? "flex flex-col gap-4" : ""}`}>
        <EvaluationSection
          evaluasiPembimbing={evaluasiPembimbing}
          evaluasiPenguji={evaluasiPenguji}
        />

        <DocumentForm
          documents={formDocuments}
          showHeader={status !== "validasi" && status !== "diterima"}
          showActions={status !== "validasi" && status !== "diterima"}
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
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Mengirim..." : "Yakin"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Step5;
