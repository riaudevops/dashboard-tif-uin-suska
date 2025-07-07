import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const MANDATORY_DOCUMENTS = [
  "Dokumen Surat Keterangan Selesai Kerja Praktik Dari Instansi",
  "Menghadiri Seminar Kerja Praktik Mahasiswa Lain Minimal 5 Kali",
  "Laporan Tambahan Tugas Kerja Praktik",
  "Dokumen Surat Undangan Seminar Kerja Praktik",

  "Berita Acara Seminar KP",
  "Lembar Pengesahan KP",
  "Daftar Hadir Seminar KP",
];

const DocumentCard = ({
  judulDokumen,
  status,
  catatan,
  link,
  onLinkChange,
}: {
  judulDokumen: string;
  status: "default" | "Terkirim" | "Divalidasi" | "Ditolak";
  catatan?: string;
  link?: string;
  onLinkChange?: (value: string) => void;
}) => {
  const [inputValue, setInputValue] = useState(link || "");

  useEffect(() => {
    setInputValue(link || "");
  }, [link]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      if (onLinkChange) {
        onLinkChange(value);
      }
    },
    [onLinkChange]
  );

  const isReadOnly = status === "Terkirim" || status === "Divalidasi";

  // Cek apakah dokumen wajib
  const isMandatory = MANDATORY_DOCUMENTS.includes(judulDokumen);

  const renderCard = () => {
    // Status "Divalidasi" → Badge "Diterima"
    if (status === "Divalidasi") {
      return (
        <Card className="border dark:border-none bg-white dark:bg-gray-800/80 shadow-sm relative hover:shadow-md dark:hover:shadow-sm dark:hover:shadow-green-600 transition-all duration-200">
          <div className="absolute top-8 right-6">
            <p className="font-medium text-xs text-green-600 dark:text-green-400 flex items-center bg-green-50 dark:bg-green-900/20 py-1 px-2 rounded">
              <CheckCircle className="h-3 w-3 mr-1" /> Diterima
            </p>
          </div>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="mt-1 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-base font-medium text-gray-800 dark:text-gray-100">
                  {judulDokumen}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label
                htmlFor={`link-${judulDokumen
                  .replace(/\s+/g, "-")
                  .toLowerCase()}`}
                className="font-medium text-xs text-gray-700 dark:text-gray-300"
              >
                Link GDrive{" "}
                {isMandatory && <span className="text-red-500">*</span>}
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  id={`link-${judulDokumen.replace(/\s+/g, "-").toLowerCase()}`}
                  value={inputValue}
                  readOnly={isReadOnly}
                  className="pl-9 bg-gray-50 dark:bg-gray-800 cursor-text select-all border-green-200 dark:border-green-800/40"
                />
                <Upload className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Status "Terkirim" → Badge "Menunggu"
    if (status === "Terkirim") {
      return (
        <Card className="border dark:border-none bg-white dark:bg-gray-800/80 shadow-sm relative hover:shadow-md dark:hover:shadow-sm dark:hover:shadow-yellow-600 transition-all duration-200">
          <div className="absolute top-8 right-6">
            <p className="font-medium text-xs text-yellow-600 dark:text-yellow-400 flex items-center bg-yellow-50 dark:bg-yellow-900/20 py-1 px-2 rounded">
              <Clock className="h-3 w-3 mr-1" /> Menunggu
            </p>
          </div>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                <FileText className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <CardTitle className="text-base font-medium text-gray-800 dark:text-gray-100">
                  {judulDokumen}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label
                htmlFor={`link-${judulDokumen
                  .replace(/\s+/g, "-")
                  .toLowerCase()}`}
                className="font-medium text-xs text-gray-700 dark:text-gray-300"
              >
                Link GDrive{" "}
                {isMandatory && <span className="text-red-500">*</span>}
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  id={`link-${judulDokumen.replace(/\s+/g, "-").toLowerCase()}`}
                  value={inputValue}
                  readOnly={isReadOnly}
                  className="pl-9 bg-gray-50 dark:bg-gray-800 cursor-text select-all"
                />
                <Upload className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Status "Ditolak" → Badge "Revisi" dan tampilkan catatan
    if (status === "Ditolak") {
      return (
        <Card className="border dark:border-none bg-white dark:bg-gray-800/80 shadow-sm relative hover:shadow-md dark:hover:shadow-sm dark:hover:shadow-red-600 transition-all duration-200">
          <div className="absolute top-8 right-6">
            <p className="font-medium text-xs text-red-600 dark:text-red-400 flex items-center bg-red-50 dark:bg-red-900/20 py-1 px-2 rounded">
              <AlertCircle className="h-3 w-3 mr-1" /> Revisi
            </p>
          </div>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="mt-1 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <CardTitle className="text-base font-medium text-gray-800 dark:text-gray-100">
                  {judulDokumen}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor={`link-${judulDokumen
                  .replace(/\s+/g, "-")
                  .toLowerCase()}`}
                className="flex items-center gap-1 font-medium text-xs text-gray-700 dark:text-gray-300"
              >
                Link GDrive{" "}
                {isMandatory && <span className="text-red-500">*</span>}
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  id={`link-${judulDokumen.replace(/\s+/g, "-").toLowerCase()}`}
                  placeholder="https://drive.google.com/file/d/zzz/view?usp=sharing"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="pl-9 border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 dark:focus:border-red-500 dark:focus:ring-red-500/50"
                />
                <Upload className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            {catatan && (
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-100 dark:border-red-800/40">
                <h4 className="text-xs font-semibold text-red-800 dark:text-red-300 mb-1">
                  Catatan:
                </h4>
                <p className="text-xs text-red-700 dark:text-red-200">
                  {catatan}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

    // Status "default" → Form input
    return (
      <Card className="border dark:border-none bg-white dark:bg-gray-800/80 shadow-sm hover:shadow-md dark:hover:shadow-xl transition-all duration-200">
        <CardHeader className="pb-2">
          <div className="flex items-start gap-3">
            <div className="mt-1 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
              <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle className="text-base font-medium text-gray-800 dark:text-gray-100">
                {judulDokumen}
              </CardTitle>
              <p className="font-normal text-sm text-gray-600 dark:text-gray-400 mt-1">
                Silakan inputkan Link GDrive dengan file harus berformat pdf.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label
              htmlFor={`link-${judulDokumen
                .replace(/\s+/g, "-")
                .toLowerCase()}`}
              className="flex items-center gap-1 font-medium text-xs text-gray-700 dark:text-gray-300"
            >
              Link GDrive{" "}
              {isMandatory && <span className="text-red-500">*</span>}
            </Label>
            <div className="relative">
              <Input
                type="text"
                id={`link-${judulDokumen.replace(/\s+/g, "-").toLowerCase()}`}
                placeholder="https://drive.google.com/file/d/zzz/view?usp=sharing"
                value={inputValue}
                onChange={handleInputChange}
                readOnly={isReadOnly}
                className="pl-9 border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:focus:border-green-500 dark:focus:ring-green-500/50"
              />
              <Upload className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return <div key={`card-${status}-${judulDokumen}`}>{renderCard()}</div>;
};

export default DocumentCard;
