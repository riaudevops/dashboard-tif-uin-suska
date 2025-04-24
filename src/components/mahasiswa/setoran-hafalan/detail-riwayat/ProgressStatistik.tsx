// import { useTheme } from "@/components/themes/theme-provider";
import { PieChart, Pie, Label, ResponsiveContainer, Cell } from "recharts";
import {DocumentProgressChartsProps} from "@/interfaces/components/mahasiswa/setoran-hafalan/progres-statistik.interface";

export default function ProgressStatistik({
  uploadedDocs,
  totalDocs,
}: DocumentProgressChartsProps) {
  const percentage = Math.round((uploadedDocs / totalDocs) * 100);

  const data = [
    { name: "Uploaded", value: uploadedDocs },
    { name: "Remaining", value: totalDocs - uploadedDocs },
  ];
  return (
    <ResponsiveContainer width="40%" className={'-ml-14 hidden md:block'} height="100%">
      <PieChart>
      <defs>
          {/* Gradient untuk bagian Uploaded */}
          <linearGradient id="gradient-multicolor-primary" x1="0" y1="0" x2="2" y2="2">
            <stop offset="0%" stopColor="#FF0000" /> {/* Merah */}
            <stop offset="40%" stopColor="#FFFF00" /> {/* Kuning */}
            <stop offset="60%" stopColor="#00FF00" /> {/* Hijau */}
            <stop offset="100%" stopColor="#8B00FF" /> {/* Ungu */}
          </linearGradient>

          {/* Gradient untuk bagian Remaining */}
          <linearGradient id="gradient-multicolor-secondary" x1="0" y1="0" x2="1" y2="1">
            <stop offset="100%" stopColor="#D9D9D9" /> {/* Ungu Pastel */}
          </linearGradient>
        </defs>
        <Pie
          data={data}
          cx="40%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
        >
           {data.map((_entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={`url(#${
                index === 0
                  ? "gradient-multicolor-primary"
                  : "gradient-multicolor-secondary"
              })`}
            />
          ))}
          <Label
            value={`${percentage}%`}
            position="center"
            className="text-2xl font-bold"
            fill="currentColor"
          />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
