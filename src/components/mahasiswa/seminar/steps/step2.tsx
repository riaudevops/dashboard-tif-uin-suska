import { FC } from "react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import Stepper from "@/components/mahasiswa/seminar/stepper";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ExternalLink } from "lucide-react";
import Status from "../status";
import { Label } from "@/components/ui/label";
import InfoCard from "../informasi-seminar";

type StatusType = "belum" | "validasi" | "ditolak";

interface Step2Props {
  activeStep: number;
  status: StatusType;
}

interface CardHeaderProps {
  title: string;
}

const CardHeaderGradient: FC<CardHeaderProps> = ({ title }) => (
  <div className="bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-4">
    <CardTitle className="text-white text-lg font-medium">{title}</CardTitle>
  </div>
);

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

interface IDInputCardProps {
  status: StatusType;
  readOnly?: boolean;
  defaultValue?: string;
}

const IDInputCard: FC<IDInputCardProps> = ({
  status,
  readOnly = false,
  defaultValue,
}) => {
  const isEditable = status !== "validasi";

  return (
    <Card className="h-full overflow-hidden rounded-xl border shadow-none dark:border-none dark:bg-gray-900">
      <CardHeaderGradient title="Silakan Masukkan ID Pengajuan" />
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
              placeholder={defaultValue || "Masukkan ID Pengajuan"}
              defaultValue={defaultValue}
              className="border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400 pl-3 pr-3 py-2"
              readOnly={readOnly}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Format: Kombinasi huruf dan angka yang Anda terima dari portal
          </p>
        </div>
        {isEditable && (
          <div className="flex justify-end gap-3 mt-auto">
            <Button className="bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white border-none">
              Kirim
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const getStatusConfig = (status: StatusType) => {
  const configs = {
    belum: {
      title: "Anda belum memasukkan ID Pengajuan Surat Undangan Seminar KP",
      subtitle: "Silakan masukkan ID Pengajuan Surat Undangan Seminar KP!",
      readonly: false,
      defaultValue: undefined,
    },
    validasi: {
      title: "Input ID Pengajuan Surat Undangan anda dalam proses validasi",
      subtitle: "Silakan menunggu konfirmasi berikutnya!",
      readonly: true,
      defaultValue: "12JDUAHAHIOH",
    },
    ditolak: {
      title: "Input ID Pengajuan Surat Undangan Anda Ditolak",
      subtitle: "Silakan masukkan kode yang benar!",
      readonly: false,
      defaultValue: undefined,
    },
  };

  return configs[status];
};

const Step2: FC<Step2Props> = ({ activeStep, status }) => {
  const statusConfig = getStatusConfig(status);

  const informasiSeminarFields = [
    "lokasi",
    "lamaKerjaPraktek",
    "dosenPembimbing",
    "kontakPembimbing",
    "judul",
  ];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-8">
        Validasi Kelengkapan Berkas Seminar Kerja Praktik
      </h1>
      <Stepper activeStep={activeStep} />

      <Status
        status={status}
        title={statusConfig.title}
        subtitle={statusConfig.subtitle}
      />

      <InfoCard displayItems={informasiSeminarFields} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <InstructionCard />
        <IDInputCard
          status={status}
          readOnly={statusConfig.readonly}
          defaultValue={statusConfig.defaultValue}
        />
      </div>
    </DashboardLayout>
  );
};

export default Step2;
