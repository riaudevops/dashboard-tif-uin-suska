import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClipboardList } from "lucide-react";
import React, { useMemo, useState } from "react";

export default function ModalBoxRekap({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  const months = [
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let i = 0; i < 5; i++) {
      yearOptions.push(String(currentYear - i));
    }
    return yearOptions;
  }, []);

  const handleNext = () => {
    if (!selectedMonth || !selectedYear) {
      // Menggunakan console.error agar lebih terlihat saat debugging
      console.error("Bulan dan tahun wajib dipilih.");
      return;
    }
    console.log("Mencari rekapan untuk:", {
      bulan: selectedMonth,
      tahun: selectedYear,
    });
    setIsOpen(false);
  };
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setSelectedMonth("");
          setSelectedYear("");
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center gap-2">
              <ClipboardList className="h-5 w-5" />
              <span className="text-lg font-semibold">
                Rekap Setoran Bulanan
              </span>
            </div>
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Pilih periode untuk melihat kartu rekapan muroja'ah.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {/* Grid responsif: 1 kolom di mobile, 2 kolom di layar lebih besar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select onValueChange={setSelectedMonth} value={selectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Bulan" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Bulan</SelectLabel>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectedYear} value={selectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tahun</SelectLabel>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleNext}
            disabled={!selectedMonth || !selectedYear}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Selanjutnya
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
