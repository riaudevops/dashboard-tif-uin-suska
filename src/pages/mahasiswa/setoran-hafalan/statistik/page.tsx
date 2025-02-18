import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import BarChartSetoran from "@/components/mahasiswa/setoran-hafalan/statistik/BarChartSetoranHafalan";
import apiSetoran from "@/services/api/setoran-hafalan/mahasiswa.service";
import { useQuery } from "@tanstack/react-query";
import LoadingComponent from "@/components/globals/loading.tsx";

interface MahasiswaSetoranHafalanStatistikPageProps {
  label: string;
  persentase: number;
  total_wajib_setor: number;
  total_belum_setor: number;
  total_sudah_setor: number;
}
export default function MahasiswaSetoranHafalanStatistikPage() {
  const { data: dataRingkasan, isLoading } = useQuery({
    queryKey: ["setoran-saya"],
    queryFn: () => apiSetoran.getDataMysetoran().then((data) => data.data.setoran.ringkasan),
    staleTime: Infinity,
  });
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-1.5">
        <div className="text-lg md:text-3xl font-bold select-none -ml-1">
          🔥 Progress Setoran Hafalanmu...
        </div>
        <div className="flex flex-col gap-4">
          <div className="select-none ml-1 md:text-base text-sm">
            Berikut stastistik dari setoran hafalan kamu untuk persyaratan
            akademik di UIN Suska Riau, Semangat terus ya... 💙❤️
          </div>
          <div className="flex flex-col gap-4">
            {isLoading && <LoadingComponent />}
            {dataRingkasan?.map(
              (item: MahasiswaSetoranHafalanStatistikPageProps) => (
                <BarChartSetoran
                  key={item.label}
                  label={item.label}
                  persentase={item.persentase}
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
