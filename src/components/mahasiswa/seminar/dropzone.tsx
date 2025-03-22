import React, { useCallback } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { FileIcon, X, UploadCloud } from "lucide-react";

interface DropzoneProps {
  onFilesChange?: (files: FileWithPath[]) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFilesChange }) => {
  const [files, setFiles] = React.useState<FileWithPath[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFiles(acceptedFiles);
      onFilesChange?.(acceptedFiles);
    },
    [onFilesChange]
  );

  const removeFile = (fileToRemove: FileWithPath) => {
    const updatedFiles = files.filter((file) => file !== fileToRemove);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <>
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-lg flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
      >
        <input {...getInputProps()} />
        <UploadCloud className="h-10 w-10 mb-2" />
        <p className="font-medium">Drag & drop file here</p>
        <p className="text-sm">or click to select files</p>
      </div>

      {files.length > 0 && (
        <div className="border rounded-md divide-y dark:divide-border">
          {files.map((file, index) => (
            <div
              key={file.path || index}
              className="flex items-center justify-between p-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <FileIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{file.path}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Dropzone;
