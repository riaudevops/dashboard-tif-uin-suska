import React from "react";
import {
  Map,
  UserRound,
  Book,
  User,
  Clock,
  Phone,
  Info,
  CalendarDays,
  DoorOpen,
  Award,
} from "lucide-react";

// Define the data structure
interface InfoData {
  judul?: string;
  lokasi?: string;
  dosenPembimbing?: string;
  dosenPenguji?: string;
  lamaKerjaPraktik?: string;
  kontakPembimbing?: string;
  kontakPenguji?: string;
  jadwal?: string;
  ruangan?: string;
  nilai?: string;
  [key: string]: string | undefined;
}

// Define the props type for the component
interface InfoCardProps {
  data: InfoData;
  displayItems?: string[];
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = React.memo(
  ({ data, displayItems = [], className = "" }) => {
    const iconMap: Record<string, React.ReactNode> = {
      judul: <Book className="size-4 text-emerald-500 dark:text-emerald-400" />,
      lokasi: <Map className="size-4 text-emerald-500 dark:text-emerald-400" />,
      lamaKerjaPraktik: (
        <Clock className="size-4 text-emerald-500 dark:text-emerald-400" />
      ),
      dosenPembimbing: (
        <UserRound className="size-4 text-emerald-500 dark:text-emerald-400" />
      ),
      kontakPembimbing: (
        <Phone className="size-4 text-emerald-500 dark:text-emerald-400" />
      ),
      dosenPenguji: (
        <User className="size-4 text-emerald-500 dark:text-emerald-400" />
      ),
      kontakPenguji: (
        <Phone className="size-4 text-emerald-500 dark:text-emerald-400" />
      ),
      jadwal: (
        <CalendarDays className="size-4 text-emerald-500 dark:text-emerald-400" />
      ),
      ruangan: (
        <DoorOpen className="size-4 text-emerald-500 dark:text-emerald-400" />
      ),
      nilai: (
        <Award className="size-4 text-emerald-500 dark:text-emerald-400" />
      ),
    };

    // Map of titles for each info item
    const titleMap: Record<string, string> = {
      judul: "Judul Laporan",
      lokasi: "Instansi Kerja Praktik",
      lamaKerjaPraktik: "Lama Kerja Praktik",
      dosenPembimbing: "Dosen Pembimbing",
      kontakPembimbing: "Kontak Pembimbing",
      dosenPenguji: "Dosen Penguji",
      kontakPenguji: "Kontak Penguji",
      jadwal: "Jadwal",
      ruangan: "Ruangan",
      nilai: "Nilai Mata Kuliah KP Anda",
    };

    // Separate judul and nilai from other display items
    const judulItem = displayItems.includes("judul") ? "judul" : null;
    const nilaiItem = displayItems.includes("nilai") ? "nilai" : null;
    const otherItems = displayItems.filter(
      (item) => item !== "judul" && item !== "nilai"
    );

    // Jika data kosong, tampilkan placeholder
    if (!data || Object.keys(data).length === 0) {
      return <div>Data tidak tersedia</div>;
    }

    return (
      <div
        className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-none rounded-lg p-4 ${className}`}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Nilai section - 1/5 of container width */}
          {nilaiItem && (
            <div className="md:w-1/5 w-full">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-md p-4 h-full flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-300 text-center mb-2">
                    Nilai Mata Kuliah KP Anda
                  </h3>
                  <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                    {typeof data[nilaiItem] === "string"
                      ? data[nilaiItem]
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Right side content - 4/5 of container width */}
          <div className="flex-1 md:w-4/5">
            {/* Judul Laporan - Full Row */}
            {judulItem && (
              <div className="mb-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-md p-3 w-full">
                <div className="flex items-center">
                  {iconMap[judulItem]}
                  <h3 className="ml-2 text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                    {titleMap[judulItem]}
                  </h3>
                </div>
                <p className="pl-6 text-sm font-medium text-gray-800 dark:text-gray-200 break-words mt-1">
                  {typeof data[judulItem] === "string"
                    ? data[judulItem]
                    : "Belum diisi"}
                </p>
              </div>
            )}

            {/* Other items in a single row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {otherItems.map((key) => {
                const icon = iconMap[key] || (
                  <Info className="size-4 text-emerald-500 dark:text-emerald-400" />
                );
                const title = titleMap[key] || key;

                return (
                  <div
                    key={key}
                    className="bg-gray-50 dark:bg-gray-800/50 rounded-md p-3"
                  >
                    <div className="flex items-center">
                      {icon}
                      <h3 className="ml-2 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                        {title}
                      </h3>
                    </div>
                    <p className="pl-6 text-xs text-gray-700 dark:text-gray-300 break-words mt-1">
                      {typeof data[key] === "string"
                        ? data[key]
                        : "Belum diisi"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.data === nextProps.data &&
      prevProps.displayItems === nextProps.displayItems &&
      prevProps.className === nextProps.className
    );
  }
);

export default InfoCard;
