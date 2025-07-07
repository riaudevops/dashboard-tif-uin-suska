import { MagicCard } from "@/components/magicui/magic-card";
import { Progress } from "@/components/ui/progress";
import colourfulProgress from "@/helpers/colourful-progress";

interface BarChartSetoranProps {
  label: string;
  persentase: number;
  wajib_setor: number;
  telah_setor: number;
}
export default function BarChartSetoran({
  label,
  persentase,
  wajib_setor,
  telah_setor,
}: BarChartSetoranProps) {
  const labelBerdasarkanKategori = () => {
    switch (label) {
      case "KP":
        return (
          <span>
            Kerja praktik{" "}
            <span className="italic font-semibold">
              {" "}
              ~ {persentase}
              <span className="">%</span>
            </span>
          </span>
        );
      case "SEMKP":
        return (
          <span>
            Seminar Kerja praktik{" "}
            <span className="italic font-semibold">
              {" "}
              ~ {persentase}
              <span className="">%</span>
            </span>
          </span>
        );
      case "DAFTAR_TA":
        return (
          <span>
            Pendaftaran Judul TA{" "}
            <span className="italic font-semibold">
              {" "}
              ~ {persentase}
              <span className="">%</span>
            </span>
          </span>
        );
      case "SEMPRO":
        return (
          <span>
            Seminar Proposal{" "}
            <span className="italic font-semibold">
              {" "}
              ~ {persentase}
              <span className="">%</span>
            </span>
          </span>
        );
      case "SIDANG_TA":
        return (
          <span>
            Sidang Tugas Akhir{" "}
            <span className="italic font-semibold">
              {" "}
              ~ {persentase}
              <span className="">%</span>
            </span>
          </span>
        );
    }
  };
  return (
    <div className="bg-secondary whitespace-nowrap w-full h-full shadow-md rounded-xl">
      <MagicCard
        gradientColor="dark:#262626 #D9D9D955"
        className="bg-secondary flex flex-col p-4 2xl:p-[1.4rem] w-full h-full justify-center"
      >
        <div className="flex justify-start text-primary">
          {labelBerdasarkanKategori()}
        </div>
        <div className="flex w-full gap-1 items-center">
          <Progress
            value={persentase}
            className={`h-4 w-full`}
            color={colourfulProgress(persentase)}
          />
          <div>{`${telah_setor}/${wajib_setor}`}</div>{" "}
        </div>
      </MagicCard>
    </div>
  );
}
