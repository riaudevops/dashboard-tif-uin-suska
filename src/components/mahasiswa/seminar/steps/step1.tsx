import { FC, useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Stepper from "@/components/mahasiswa/seminar/stepper";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutGridIcon, RefreshCw } from "lucide-react";
import Status from "@/components/mahasiswa/seminar/status";
import InfoCard from "../informasi-seminar";
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

type StepStatus = "belum" | "validasi" | "ditolak" | "diterima";
type DocumentStatus = "default" | "Terkirim" | "Divalidasi" | "Ditolak";

interface FormActionsProps {
  onReset?: () => void;
  onSubmit?: () => void;
  disabledReset?: boolean;
}

interface CardHeaderProps {
  title: string;
}

interface Step1Props {
  activeStep: number;
}

interface ApiDoc {
  jenis_dokumen?: string;
  status?: DocumentStatus;
  komentar?: string;
  link_path?: string;
}

interface DocumentInfo {
  title: string;
  status: DocumentStatus;
  notes: string;
  link: string;
}

interface SeminarData {
  nim: string;
  pendaftaran_kp: Array<{
    id: string;
    judul_kp: string;
    instansi: { nama: string };
    dosen_pembimbing: { nama: string; no_hp: string };
    tanggal_mulai: string;
    tanggal_selesai: string | null;
  }>;
  dokumen_seminar_kp: {
    step1: Array<{
      jenis_dokumen: string;
      status: DocumentStatus;
      komentar?: string;
      link_path?: string;
    }>;
  };
  steps_info: {
    step1_accessible: boolean;
  };
}

const DOCUMENTS = [
  "Dokumen Surat Keterangan Selesai Kerja Praktik Dari Instansi",
  "Menghadiri Seminar Kerja Praktik Mahasiswa Lain Minimal 5 Kali",
  "Laporan Tambahan Tugas Kerja Praktik",
];

const DOCUMENT_TYPE_MAP: Record<string, string> = {
  "Dokumen Surat Keterangan Selesai Kerja Praktik Dari Instansi":
    "SURAT_KETERANGAN_SELESAI_KP",
  "Menghadiri Seminar Kerja Praktik Mahasiswa Lain Minimal 5 Kali":
    "FORM_KEHADIRAN_SEMINAR",
  "Laporan Tambahan Tugas Kerja Praktik": "LAPORAN_TAMBAHAN_KP",
};

const DOCUMENT_URLS: Record<string, string> = {
  "Dokumen Surat Keterangan Selesai Kerja Praktik Dari Instansi":
    "/seminar-kp/dokumen/surat-keterangan-selesai-kp",
  "Menghadiri Seminar Kerja Praktik Mahasiswa Lain Minimal 5 Kali":
    "/seminar-kp/dokumen/form-kehadiran-seminar",
  "Laporan Tambahan Tugas Kerja Praktik":
    "/seminar-kp/dokumen/laporan-tambahan-kp",
};

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

const Step1: FC<Step1Props> = ({ activeStep }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formDocuments, setFormDocuments] = useState<DocumentInfo[]>([]);

  const { data, isLoading, isError, error } = useQuery<{
    data: SeminarData;
  }>({
    queryKey: ["seminar-kp-dokumen"],
    queryFn: APISeminarKP.getDataMydokumen,
    staleTime: Infinity,
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: APISeminarKP.postLinkDokumen,
    onError: (error: any, variables) => {
      toast.error(
        `Gagal mengirim link dokumen "${
          variables?.url
            ? Object.keys(DOCUMENT_URLS).find(
                (key) => DOCUMENT_URLS[key] === variables.url
              )
            : ""
        }". ${error.response.data.message}`,
        {
          duration: 3000,
        }
      );
    },
  });

  useEffect(() => {
    if (data?.data) {
      const step1Docs = data.data.dokumen_seminar_kp.step1 || [];
      const step1Accessible = data.data.steps_info.step1_accessible;

      const initialDocs = DOCUMENTS.map((title) => {
        const apiDoc: ApiDoc =
          step1Docs.find(
            (doc) => DOCUMENT_TYPE_MAP[title] === doc.jenis_dokumen
          ) || {};
        return {
          title,
          status: apiDoc.status || (step1Accessible ? "default" : "Terkirim"),
          notes: apiDoc.komentar ?? "",
          link: apiDoc.link_path ?? "",
        };
      });
      setFormDocuments(initialDocs);
    }
  }, [data]);

  const infoData = useMemo(() => {
    return data?.data
      ? {
          judul: data.data.pendaftaran_kp[0]?.judul_kp || "Belum diisi",
          lokasi: data.data.pendaftaran_kp[0]?.instansi?.nama || "Belum diisi",
          dosenPembimbing:
            data.data.pendaftaran_kp[0]?.dosen_pembimbing?.nama ||
            "Belum diisi",
          kontakPembimbing:
            data.data.pendaftaran_kp[0]?.dosen_pembimbing?.no_hp ||
            "Belum diisi",
          lamaKerjaPraktik: `${
            data.data.pendaftaran_kp[0]?.tanggal_mulai
              ? new Date(
                  data.data.pendaftaran_kp[0].tanggal_mulai
                ).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "Belum diisi"
          } - ${
            data.data.pendaftaran_kp[0]?.tanggal_selesai
              ? new Date(
                  data.data.pendaftaran_kp[0].tanggal_selesai
                ).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "Belum diisi"
          }`,
        }
      : {};
  }, [data]);

  const informasiSeminarFields = [
    "judul",
    "lokasi",
    "dosenPembimbing",
    "kontakPembimbing",
    "lamaKerjaPraktik",
  ];

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
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    setIsDialogOpen(false);
    const nim = data?.data.nim;
    const id_pendaftaran_kp = data?.data.pendaftaran_kp[0]?.id;

    if (!nim || !id_pendaftaran_kp) {
      toast.error("Data mahasiswa atau pendaftaran tidak lengkap", {
        duration: 3000,
      });
      return;
    }

    const documentsToSubmit = formDocuments.filter(
      (doc): doc is DocumentInfo & { link: string } =>
        doc.link !== "" &&
        (doc.status === "default" || doc.status === "Ditolak")
    );

    if (documentsToSubmit.length === 0) {
      toast.error("Formulir belum diisi", {
        duration: 3000,
      });
      return;
    }

    const successfullySubmittedDocs: string[] = [];

    const submissionPromises = documentsToSubmit.map((doc) => {
      const url = DOCUMENT_URLS[doc.title];

      console.log(`Mengirim link untuk "${doc.title}": ${doc.link}`);
      return mutation
        .mutateAsync({
          nim,
          link_path: doc.link,
          id_pendaftaran_kp,
          url,
        })
        .then(() => {
          successfullySubmittedDocs.push(doc.title);
        })
        .catch((error) => {
          console.error(`Gagal mengirim dokumen "${doc.title}":`, error);
          return null;
        });
    });

    await Promise.all(submissionPromises);

    if (successfullySubmittedDocs.length > 0) {
      const docList = successfullySubmittedDocs.join(", ");

      toast.success(`Berhasil mengirim link dokumen: ${docList}`, {
        duration: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["seminar-kp-dokumen"] });
    }
  };

  const status: StepStatus = useMemo(() => {
    if (!data?.data) return "belum";

    const step1Docs = data.data.dokumen_seminar_kp.step1 || [];
    const step1Accessible = data.data.steps_info.step1_accessible;

    if (step1Accessible && step1Docs.length === 0) {
      return "belum";
    }

    if (step1Docs.some((doc) => doc.status === "Ditolak")) {
      return "ditolak";
    }

    if (
      step1Docs.length === DOCUMENTS.length &&
      step1Docs.every((doc) => doc.status === "Divalidasi")
    ) {
      return "diterima";
    }

    if (step1Docs.length > 0) {
      return "validasi";
    }

    return "belum";
  }, [data]);

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
            title="Anda Belum Mengupload Dokumen Form Pendaftaran di-seminasi KP"
            subtitle="Silakan lengkapi dokumen terlebih dahulu."
          />
        );
      case "validasi":
        return (
          <Status
            status="validasi"
            title="Dokumen Anda Sedang dalam Proses Validasi"
          />
        );
      case "ditolak":
        return (
          <Status
            status="ditolak"
            title="Validasi Dokumen Anda Ditolak"
            subtitle="Silakan isi kembali Form sesuai perintah dengan benar!"
          />
        );
      case "diterima":
        return (
          <Status
            status="validasi"
            title="Dokumen Anda Telah Divalidasi"
            subtitle="Semua dokumen Anda telah diterima. Silakan lanjutkan ke langkah berikutnya."
          />
        );
      default:
        return null;
    }
  };

  const shouldShowActions = useMemo(() => {
    return formDocuments.some(
      (doc) => doc.status === "default" || doc.status === "Ditolak"
    );
  }, [formDocuments]);

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

      {isLoading ? (
        <div>Loading InfoCard...</div>
      ) : (
        <InfoCard displayItems={informasiSeminarFields} data={infoData} />
      )}

      <div className={`${status === "ditolak" ? "flex flex-col gap-4" : ""}`}>
        <DocumentForm
          documents={formDocuments}
          showHeader={status !== "validasi" && status !== "diterima"}
          showActions={shouldShowActions}
          onReset={handleReset}
          onSubmit={handleOpenDialog}
          onLinkChange={handleLinkChange}
        />
      </div>

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

export default Step1;
