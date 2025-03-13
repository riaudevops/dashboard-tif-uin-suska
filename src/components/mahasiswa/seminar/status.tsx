// src/components/Status.tsx
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface StatusProps {
  status: "validasi" | "ditolak" | "belum"; // Menambahkan status "pending"
  catatan?: string; // Alasan penolakan jika ada
  title: string;
  subtitle?: string;
}

const Status: React.FC<StatusProps> = ({
  status,
  catatan,
  title,
  subtitle,
}) => {
  if (status === "validasi") {
    return (
      <Alert className="border-purple-100 bg-purple-50 dark:border-purple-900 dark:bg-purple-950/50 transition-colors">
        <InfoIcon className="size-4 text-purple-600 dark:text-purple-400" />
        <AlertTitle className="text-base font-semibold text-purple-800 dark:text-purple-200">
          {title}
        </AlertTitle>
        <AlertDescription className="text-purple-600 dark:text-purple-400">
          Silakan menunggu konfirmasi berikutnya!
        </AlertDescription>
      </Alert>
    );
  }

  if (status === "belum") {
    return (
      <Alert className="border-yellow-100 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/50 transition-colors">
        <InfoIcon className="size-4 text-yellow-600 dark:text-yellow-400" />
        <AlertTitle className="text-base font-semibold text-yellow-800 dark:text-yellow-200">
          {title}
        </AlertTitle>
        <AlertDescription className="text-yellow-600 dark:text-yellow-400">
          {subtitle}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <Alert className="border-red-100 bg-red-50 dark:border-red-900 dark:bg-red-950/50 transition-colors">
        <InfoIcon className="size-4 text-red-600 dark:text-red-400" />
        <AlertTitle className="text-base font-semibold text-red-800 dark:text-red-200">
          {title}
        </AlertTitle>
        <AlertDescription className="text-red-600 dark:text-red-400">
          {subtitle}
        </AlertDescription>
      </Alert>
      <div className="w-full mt-4">
        <h2 className="text-red-700 font-semibold">catatan:</h2>
        <Textarea
          placeholder="Type your message here."
          className="w-full text-black dark:text-white border border-red-900"
          readOnly
          value={catatan}
        />
      </div>
    </div>
  );
};

export default Status;
