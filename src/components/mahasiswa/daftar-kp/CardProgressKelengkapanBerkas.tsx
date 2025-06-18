import { Card } from "@/components/ui/card";

interface CardProgressKelengkapanBerkasProps {
  status?: boolean;
  text: string;
  number: number;
  onClick: () => void;
}

export default function CardProgressKelengkapanBerkas({
  onClick,
  status,
  text,
  number,
}: CardProgressKelengkapanBerkasProps) {
  let style = "opacity-50";
  if (status || status === undefined) {
    style = "opacity-100";
  }
  return (
    <Card
      onClick={onClick}
      className={`flex flex-col items-start w-[175px] rounded-lg p-1 border-none shadow-none ${style} ${
        status ? "hover:bg-stone-500 hover:cursor-pointer" : ""
      }`}
    >
      <div className="flex justify-between w-full h-[75px] items-center">
        <div className="rounded-full size-[30px] flex justify-center items-center bg-green-600 text-white font-bold text-lg">
          {number}
        </div>
        <div className="w-[50%] h-[3px] bg-green-600"></div>
      </div>
      <div>
        <p className="text-xs text-stone-400">Input Link</p>
        <p className="text-sm whitespace-normal">{text}</p>
      </div>
      <div className="mt-2 bg-blue-100 text-blue-600 p-1 rounded-lg text-xs">
        Not Action
      </div>
    </Card>
  );
}
