import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import BarChartSetoran from "@/components/mahasiswa/setoran-hafalan/statistik/BarChartSetoranHafalan";
import APISetoran from "@/services/api/mahasiswa/setoran-hafalan.service";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {MahasiswaSetoranHafalanStatistikPageProps} from "@/interfaces/pages/mahasiswa/setoran-hafalan/statistik/statistik.interface";

export default function MahasiswaSetoranHafalanStatistikPage() {

  const { data: dataRingkasan, isLoading } = useQuery({
    queryKey: ["setoran-saya"],
    queryFn: () =>
      APISetoran.getDataMysetoran().then((data) => data.data.setoran.ringkasan),
    staleTime: Infinity,
  });
  
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-1.5">
        <div className="text-lg md:text-3xl font-bold select-none -ml-1">
          🔥 Progress Muroja'ah-mu...
        </div>
        <div className="flex flex-col gap-4">
          <div className="select-none ml-1 md:text-base text-sm">
            Berikut stastistik dari muroja'ah kamu untuk persyaratan
            akademik di UIN Suska Riau, semangat terus ya... 💙❤️
          </div>
          <div className="flex flex-col gap-4">
            {isLoading && (
              <>
                <Skeleton className="rounded-xl px-5 py-[2.9rem] lg:py-[2.53rem]" />
                <Skeleton className="rounded-xl px-5 py-[2.9rem] lg:py-[2.53rem]" />
                <Skeleton className="rounded-xl px-5 py-[2.9rem] lg:py-[2.53rem]" />
                <Skeleton className="rounded-xl px-5 py-[2.9rem] lg:py-[2.53rem]" />
                <Skeleton className="rounded-xl px-5 py-[2.9rem] lg:py-[2.53rem]" />
              </>
            )}
            {dataRingkasan?.map(
              (item: MahasiswaSetoranHafalanStatistikPageProps) => (
                <BarChartSetoran
                  key={item.label}
                  label={item.label}
                  persentase={item.persentase_progres_setor}
                  wajib_setor={item.total_wajib_setor}
                  telah_setor={item.total_sudah_setor}
                />
              )
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
