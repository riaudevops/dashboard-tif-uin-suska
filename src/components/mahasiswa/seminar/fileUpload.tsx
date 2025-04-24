import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, FileText } from "lucide-react";

interface FileUploadProps {
  label?: string;
  buttonText?: string;
  defaultFileName?: string;
  onChange?: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label = "",
  buttonText = "Choose File",
  defaultFileName = "",
  onChange,
}) => {
  const [fileName, setFileName] = useState(defaultFileName);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        alert("Only PDF files are allowed.");
        return;
      }
      setFileName(selectedFile.name);
      setFile(selectedFile);
      console.log(file)
      if (onChange) {
        onChange(selectedFile);
      }
    }
  };

  const handleClearFile = () => {
    setFileName("");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onChange) {
      onChange(null);
    }
  };

  return (
    <div className="w-full">
      <div className="text-xs font-medium mb-1">{label}</div>
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          {fileName && (
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
              <FileText size={16} />
            </div>
          )}
          <Input
            type="text"
            value={fileName}
            readOnly
            className={`${fileName ? "pl-8 pr-8" : "pr-8"}`}
          />
          {fileName && (
            <button
              onClick={handleClearFile}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Clear file"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <Button
          onClick={handleFileButtonClick}
          className="bg-gray-800 text-white hover:bg-gray-700"
        >
          {buttonText}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf" // Hanya file PDF yang dapat dipilih
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default FileUpload;
