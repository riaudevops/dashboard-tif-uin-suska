// src/components/Status.tsx
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface StatusProps {
  status: "validasi" | "ditolak" | "belum";
  title: string;
  subtitle?: string;
}

const Status: React.FC<StatusProps> = ({ status, title, subtitle }) => {
  if (status === "belum") {
    return (
      <Alert className="border-blue-100 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/50 transition-colors">
        <InfoIcon className="size-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle className="text-base font-semibold text-blue-800 dark:text-blue-200">
          {title}
        </AlertTitle>
        <AlertDescription className="text-blue-600 dark:text-blue-400">
          {subtitle}
        </AlertDescription>
      </Alert>
    );
  }

  if (status === "ditolak") {
    return (
      <Alert className="border-red-100 bg-red-50 dark:border-red-900 dark:bg-red-900/50 transition-colors">
        <InfoIcon className="size-4 text-red-600 dark:text-red-400" />
        <AlertTitle className="text-base font-semibold text-red-800 dark:text-red-200">
          {title}
        </AlertTitle>
        <AlertDescription className="text-red-600 dark:text-red-400">
          {subtitle}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-yellow-100 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/50 transition-colors">
      <InfoIcon className="size-4 text-yellow-600 dark:text-yellow-400" />
      <AlertTitle className="text-base font-semibold text-yellow-800 dark:text-yellow-200">
        {title}
      </AlertTitle>
      <AlertDescription className="text-yellow-600 dark:text-yellow-400">
        {subtitle}
      </AlertDescription>
    </Alert>
  );
};

export default Status;
