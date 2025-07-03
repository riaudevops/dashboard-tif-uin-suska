import { FC, useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Stepper from "@/components/mahasiswa/seminar/stepper";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ExternalLink, LayoutGridIcon } from "lucide-react";
import Status from "../status";
import { Label } from "@/components/ui/label";
import InfoCard from "../informasi-seminar";
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

// Type definitions
type StatusType = "belum" | "validasi" | "ditolak";
type DocumentStatus = "default" | "Terkirim" | "Divalidasi" | "Ditolak";

interface Step2Props {
  activeStep: number;
}

interface CardHeaderProps {
  title: string;
  status?: DocumentStatus;
}

interface IDInputCardProps {
  status: DocumentStatus;
  readOnly?: boolean;
  defaultValue?: string;
  onSubmit?: (idPengajuan: string) => void;
  onChange?: (value: string) => void;
}

// Komponen CardHeaderGradient
const CardHeaderGradient: FC<CardHeaderProps> = ({ title, status }) => (
  <div
    className={`bg-gradient-to-r ${
      status === "Ditolak"
        ? "from-red-600 to-rose-500"
        : "from-emerald-600 to-green-500"
    } px-6 py-4`}
  >
    <CardTitle className="text-white text-lg font-medium">{title}</CardTitle>
  </div>
);

// Komponen InstructionCard
const InstructionCard: FC = () => (
  <Card className="h-full overflow-hidden rounded-xl border dark:bg-gray-900 shadow-none dark:border-none">
    <CardHeaderGradient title="Silakan Lakukan Pengajuan Pembuatan Surat Undangan" />
    <CardContent className="flex flex-col gap-4 p-6">
      <div>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          Kunjungi link di bawah ini:
        </p>
        <a
          href="https://seminar-fst.uin-suska.ac.id/akademik/prosedur/seminar"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer inline-flex items-center font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline transition-colors duration-200"
        >
          https://seminar-fst.uin-suska.ac.id/akademik/prosedur/seminar
          <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </div>
      <div className="p-3 mt-auto border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-900/20 rounded-md">
        <p className="text-sm text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
          <span>
            Setelah mengajukan, Anda akan mendapatkan ID pengajuan yang harus
            diinput pada form di samping.
          </span>
        </p>
      </div>
    </CardContent>
  </Card>
);

// Komponen IDInputCard
const IDInputCard: FC<IDInputCardProps> = ({
  status,
  readOnly = false,
  defaultValue,
  onSubmit,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState(defaultValue || "");

  useEffect(() => {
    setInputValue(defaultValue || "");
  }, [defaultValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(inputValue);
    }
  };

  const isEditable = status === "default" || status === "Ditolak";

  return (
    <Card className="h-full overflow-hidden rounded-xl border shadow-none dark:border-none dark:bg-gray-900">
      <CardHeaderGradient
        status={status}
        title="Silahkan Masukkan ID Pengajuan"
      />
      <CardContent className="flex flex-col h-[calc(100%-4rem)] gap-4 p-6">
        <div className="space-y-2">
          <Label
            htmlFor="id-input"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            ID Pengajuan <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="id-input"
              placeholder={
                status === "Terkirim"
                  ? defaultValue || "Masukkan ID Pengajuan"
                  : defaultValue || "Masukkan ID Pengajuan"
              }
              value={inputValue}
              onChange={handleInputChange}
              className={`border-gray-200 dark:border-gray-700 ${
                status == "Terkirim"
                  ? "focus:border-yellow-500 focus:ring-yellow-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400"
                  : status == "Ditolak"
                  ? "focus:border-red-500 focus:ring-red-500 dark:focus:border-red-400 dark:focus:ring-red-400"
                  : "focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
              } pl-3 pr-3 py-2`}
              readOnly={readOnly}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Format: Kombinasi huruf dan angka yang Anda terima dari portal
          </p>
        </div>
        {isEditable && (
          <div className="flex justify-end gap-3 mt-auto">
            <Button
              className="bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white border-none"
              onClick={handleSubmit}
            >
              Kirim
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main Component
const Step2: FC<Step2Props> = ({ activeStep }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [idPengajuan, setIdPengajuan] = useState<string>("");
  const [lastSubmittedId, setLastSubmittedId] = useState<string>(""); // Simpan ID yang terakhir dikirim
  const [step2Status, setStep2Status] = useState<DocumentStatus>("default");
  const [komentar, setKomentar] = useState<string | undefined>(undefined);

  // Fetch data menggunakan TanStack Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["seminar-kp-step2"],
    queryFn: APISeminarKP.getDataMydokumen,
    staleTime: Infinity,
  });

  // Mutation untuk POST ID Pengajuan
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newIdPengajuan: string) => {
      const nim = data?.data.nim;
      const id_pendaftaran_kp = data?.data.pendaftaran_kp[0]?.id;
      const url = "/seminar-kp/dokumen/id-surat-undangan";
      return APISeminarKP.postLinkDokumen({
        nim,
        link_path: newIdPengajuan,
        id_pendaftaran_kp,
        url,
      });
    },
    onSuccess: (response, newIdPengajuan) => {
      console.log("ID Pengajuan berhasil dikirim:", response);
      toast.success("ID Pengajuan berhasil dikirim", {
        duration: 3000,
      });
      setLastSubmittedId(newIdPengajuan); // Simpan ID yang dikirim
      setIdPengajuan(newIdPengajuan); // Perbarui idPengajuan
      queryClient.invalidateQueries({ queryKey: ["seminar-kp-step2"] });
    },
    onError: (error: any) => {
      toast.error(`${error.response.data.message}`, {
        duration: 3000,
      });
    },
  });

  // Inisialisasi data berdasarkan API
  useEffect(() => {
    if (data?.data) {
      const step2Docs = data.data.dokumen_seminar_kp.step2 || [];
      const step2Accessible = data.data.steps_info.step2_accessible;

      if (step2Docs.length > 0) {
        const apiIdPengajuan = step2Docs[0].link_path || "";
        // Prioritaskan lastSubmittedId jika ada, jika tidak gunakan dari API
        setIdPengajuan(lastSubmittedId || apiIdPengajuan);
        setStep2Status(step2Docs[0].status as DocumentStatus);
        setKomentar(step2Docs[0].komentar || undefined);
      } else {
        // Jika tidak ada data dokumen, gunakan lastSubmittedId jika ada
        if (lastSubmittedId) {
          setIdPengajuan(lastSubmittedId);
          setStep2Status("Terkirim");
        } else {
          setIdPengajuan("");
          setStep2Status(step2Accessible ? "default" : "Terkirim");
        }
      }
    }
  }, [data, lastSubmittedId]);

  // Hitung infoData untuk InfoCard
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
    "lokasi",
    "lamaKerjaPraktik",
    "dosenPembimbing",
    "kontakPembimbing",
    "judul",
  ];

  // Tentukan status untuk Status component berdasarkan API
  const status: StatusType = useMemo(() => {
    if (!data?.data) return "belum"; // Default jika data belum dimuat
    const step2Docs = data.data.dokumen_seminar_kp.step2 || [];
    const step2Accessible = data.data.steps_info.step2_accessible;

    if (step2Docs.length === 0 && step2Accessible) {
      return "belum";
    } else if (step2Docs.some((doc: any) => doc.status === "Ditolak")) {
      return "ditolak";
    } else if (
      step2Docs.some(
        (doc: any) => doc.status === "Terkirim" || doc.status === "Divalidasi"
      )
    ) {
      return "validasi";
    }
    return "belum"; // Fallback
  }, [data]);

  const getStatusConfig = (apiStatus: DocumentStatus) => {
    switch (apiStatus) {
      case "Terkirim":
        return {
          title: "Input ID Pengajuan Surat Undangan anda dalam proses validasi",
          subtitle: "Silakan menunggu konfirmasi berikutnya!",
          readonly: true,
          defaultValue: idPengajuan || lastSubmittedId || "",
        };
      case "Divalidasi":
        return {
          title: "Input ID Pengajuan Surat Undangan anda dalam proses validasi",
          subtitle: "Silakan menunggu konfirmasi berikutnya!",
          readonly: true,
          defaultValue: idPengajuan || lastSubmittedId || "",
        };
      case "Ditolak":
        return {
          title: "Input ID Pengajuan Surat Undangan Anda Ditolak",
          subtitle: komentar || "Silahkan masukkan kode yang benar!",
          readonly: false,
          defaultValue: idPengajuan || lastSubmittedId || "",
        };
      case "default":
      default:
        return {
          title: "Anda belum memasukkan ID Pengajuan Surat Undangan Seminar KP",
          subtitle: "Silahkan masukkan ID Pengajuan Surat Undangan Seminar KP!",
          readonly: false,
          defaultValue: undefined,
        };
    }
  };

  const statusConfig = getStatusConfig(step2Status);

  const handleSubmit = (idPengajuan: string) => {
    setIsDialogOpen(true);
    setIdPengajuan(idPengajuan);
  };

  const handleConfirm = () => {
    setIsDialogOpen(false);
    if (idPengajuan) {
      console.log(`Sending ID Pengajuan: ${idPengajuan}`);
      mutation.mutate(idPengajuan);
    } else {
      toast.error("Harap masukkan ID Pengajuan terlebih dahulu!", {
        duration: 3000,
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
    return (
      <Status
        status={status}
        title={statusConfig.title}
        subtitle={statusConfig.subtitle}
      />
    );
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

      {isLoading ? (
        <div>Loading InfoCard...</div>
      ) : (
        <InfoCard displayItems={informasiSeminarFields} data={infoData} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <InstructionCard />
        <div>
          <IDInputCard
            status={step2Status}
            readOnly={statusConfig.readonly}
            defaultValue={statusConfig.defaultValue}
            onSubmit={handleSubmit}
            onChange={setIdPengajuan}
          />
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Pengiriman</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin mengirim ID Pengajuan ini untuk
              divalidasi? ID yang telah dikirim tidak dapat diubah sampai proses
              validasi selesai.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className="bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white"
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

export default Step2;
