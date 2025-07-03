import { FC, useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Stepper from "@/components/mahasiswa/seminar/stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutGridIcon, RefreshCw } from "lucide-react";
import Status from "../status";
import { Textarea } from "@/components/ui/textarea";
import DocumentCard from "../formulir-dokumen";
import { toast } from "sonner";
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
  value: string;
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
  value,
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
        value={value}
        className="w-full text-gray-800 bg-yellow-200 border-none shadow-inner min-h-32 resize-none"
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
        value={evaluasiPembimbing}
        rotate={-1}
      />
      <EvaluationCard
        title="Catatan/Evaluasi Dosen Penguji"
        value={evaluasiPenguji}
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
    onSuccess: (response, variables) => {
      // variables contains the data sent to mutate, including doc info
      console.log("Response from API:", response);
      toast.success(
        `Berhasil mengirim link dokumen "${
          variables?.url
            ? Object.keys(DOCUMENT_URLS).find(
                (key) => DOCUMENT_URLS[key] === variables.url
              )
            : ""
        }"`,
        {
          duration: 3000,
        }
      );
      queryClient.invalidateQueries({ queryKey: ["seminar-kp-step5"] });
    },
    onError: (error: any, variables) => {
      toast.error(
        `Gagal mengirim link dokumen "${
          variables?.url
            ? Object.keys(DOCUMENT_URLS).find(
                (key) => DOCUMENT_URLS[key] === variables.url
              )
            : ""
        }" ${error.response.data.message}`,
        {
          duration: 3000,
        }
      );
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

    // Jika step5_accessible true dan belum ada dokumen yang dikirim
    if (step5Accessible && step5Docs.length === 0) {
      return "belum";
    }

    // Jika ada dokumen yang ditolak
    if (step5Docs.some((doc: any) => doc.status === "Ditolak")) {
      return "ditolak";
    }

    // Filter dokumen wajib
    const mandatoryDocs = step5Docs.filter((doc: any) =>
      MANDATORY_DOCUMENTS.some(
        (title) => DOCUMENT_TYPE_MAP[title] === doc.jenis_dokumen
      )
    );

    // Jika semua dokumen wajib sudah divalidasi
    if (
      mandatoryDocs.length === MANDATORY_DOCUMENTS.length &&
      mandatoryDocs.every((doc: any) => doc.status === "Divalidasi")
    ) {
      return "diterima";
    }

    // Jika semua dokumen wajib sudah dikirim (termasuk yang masih menunggu validasi)
    if (
      MANDATORY_DOCUMENTS.every((title) =>
        step5Docs.some(
          (doc: any) =>
            DOCUMENT_TYPE_MAP[title] === doc.jenis_dokumen &&
            doc.status !== "default"
        )
      )
    ) {
      return "validasi";
    }

    // Default: belum, jika dokumen wajib belum lengkap
    return "belum";
  }, [data]);

  // Cek apakah semua dokumen wajib telah dikirim
  const allMandatorySubmitted = useMemo(() => {
    const step5Docs = data?.data?.dokumen_seminar_kp?.step5 || [];
    return MANDATORY_DOCUMENTS.every((title) =>
      step5Docs.some(
        (doc: any) =>
          DOCUMENT_TYPE_MAP[title] === doc.jenis_dokumen &&
          doc.status !== "default"
      )
    );
  }, [data]);

  // Ambil catatan dari API dengan penanganan null
  const evaluasiPembimbing = useMemo(() => {
    const catatan =
      data?.data?.nilai?.[0]?.komponen_penilaian_pembimbing?.catatan;
    return catatan !== null && catatan !== undefined
      ? catatan
      : "Belum ada catatan";
  }, [data]);

  const evaluasiPenguji = useMemo(() => {
    const catatan = data?.data?.nilai?.[0]?.komponen_penilaian_penguji?.catatan;
    return catatan !== null && catatan !== undefined
      ? catatan
      : "Belum ada catatan";
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
    toast.success("Formulir berhasil dikosongkan", {
      duration: 3000,
    });
  };

  const handleOpenDialog = () => {
    const documentsToSubmit = formDocuments.filter(
      (doc) =>
        doc.link && (doc.status === "default" || doc.status === "Ditolak")
    );

    // Periksa apakah semua dokumen wajib memiliki link
    const missingMandatory = MANDATORY_DOCUMENTS.filter(
      (title) =>
        !formDocuments.find(
          (doc) =>
            doc.title === title &&
            (doc.link ||
              doc.status === "Divalidasi" ||
              doc.status === "Terkirim")
        )
    );

    if (missingMandatory.length > 0) {
      toast.error(
        `Harap lengkapi dokumen wajib berikut: ${missingMandatory.join(", ")}`,
        {
          duration: 3000,
        }
      );
      return;
    }

    if (documentsToSubmit.length === 0) {
      toast.error(`Formulir belum diisi`, {
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
      documentsToSubmit.forEach((doc) => {
        const url = DOCUMENT_URLS[doc.title];
        if (!url) {
          toast.error(`URL untuk dokumen "${doc.title}" tidak ditemukan!`, {
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
      toast.error(`Gagal mengambil data: ${error.message}`, {
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

  return (
    <div className="space-y-4">
      <div className="flex mb-5">
        <span className="bg-white flex justify-center items-center shadow-sm text-gray-800 dark:text-gray-200 dark:bg-gray-900 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 text-md font-medium tracking-tight">
          <span
            className={`inline-block animate-pulse w-3 h-3 rounded-full mr-2 bg-yellow-400`}
          />
          <LayoutGridIcon className="w-4 h-4 mr-1.5" />
          Validasi Kelengkapan Berkas Seminar Kerja Praktik Mahasiswa
        </span>
      </div>
      <Stepper activeStep={activeStep} />

      {renderStatusNotification()}

      <div className={`${status === "ditolak" ? "flex flex-col gap-4" : ""}`}>
        <EvaluationSection
          evaluasiPembimbing={evaluasiPembimbing}
          evaluasiPenguji={evaluasiPenguji}
        />

        <DocumentForm
          documents={formDocuments}
          showHeader={status !== "diterima"}
          showActions={
            status === "belum" ||
            status === "ditolak" ||
            (status === "validasi" && !allMandatorySubmitted)
          }
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
