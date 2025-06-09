import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowRight,
  Calendar,
  MapPin,
  User,
  History,
  Plus,
  RefreshCcw,
} from "lucide-react";

interface LogEntry {
  id: string;
  action: "create" | "update";
  timestamp: string;
  changes: {
    field: string;
    oldValue?: string;
    newValue?: string;
  }[];
  keterangan?: string;
}

interface LogJadwalModalProps {
  isOpen: boolean;
  onClose: () => void;
  seminarId: string | null;
  logs: LogEntry[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
}

const LogJadwalModal: React.FC<LogJadwalModalProps> = ({
  isOpen,
  onClose,
  seminarId,
  logs,
  isLoading,
  isError,
  error,
}) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getIconForField = (field: string) => {
    switch (field) {
      case "tanggal":
        return <Calendar className="h-4 w-4" />;
      case "ruangan":
        return <MapPin className="h-4 w-4" />;
      case "dosen_penguji":
        return <User className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getActionIcon = (action: "create" | "update") => {
    return action === "create" ? (
      <Plus className="h-5 w-5 text-white" />
    ) : (
      <RefreshCcw className="h-5 w-5 text-white" />
    );
  };

  const getActionColor = (action: "create" | "update") => {
    return action === "create"
      ? "bg-emerald-500 text-white"
      : "bg-blue-500 text-white";
  };

  const getLogMessage = (log: LogEntry) => {
    return log.keterangan || "Log tidak dikenali";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <History className="mr-2 h-5 w-5 text-blue-500" />
            Log Jadwal Seminar
          </DialogTitle>
        </DialogHeader>
        <div className="">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6 relative">
              {isLoading ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                  Memuat log jadwal...
                </div>
              ) : isError ? (
                <div className="text-center text-red-600 dark:text-red-300 py-10">
                  Gagal mengambil log: {error?.message || "Unknown error"}
                </div>
              ) : logs.length > 0 ? (
                <>
                  {/* Timeline line */}
                  <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                  {logs.map((log) => (
                    <div key={log.id} className="relative">
                      {/* Action icon with color */}
                      <div
                        className={`absolute left-0 top-0 h-12 w-12 rounded-full flex items-center justify-center z-10 ${getActionColor(
                          log.action
                        )}`}
                      >
                        {getActionIcon(log.action)}
                      </div>

                      {/* Log card */}
                      <div className="ml-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                        {/* Header */}
                        <div
                          className={`px-4 py-3 ${
                            log.action === "create"
                              ? "bg-emerald-50 dark:bg-emerald-900/30"
                              : "bg-blue-50 dark:bg-blue-900/30"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-xs text-gray-900 dark:text-gray-100">
                              {getLogMessage(log)}
                            </h4>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {formatTimestamp(log.timestamp)}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          {log.changes.length === 0 &&
                          log.action === "create" ? (
                            <p className="text-gray-600 text-xs dark:text-gray-400">
                              Jadwal baru berhasil dibuat.
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {log.changes.map((change, index) => (
                                <div
                                  key={index}
                                  className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3"
                                >
                                  <div className="flex items-center gap-2 text-sm mb-2">
                                    <div
                                      className={`p-1.5 rounded-full ${
                                        log.action === "create"
                                          ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300"
                                          : "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300"
                                      }`}
                                    >
                                      {getIconForField(change.field)}
                                    </div>
                                    <span className="font-medium text-gray-800 dark:text-gray-200 capitalize">
                                      {change.field.replace(/_/g, " ")}
                                    </span>
                                  </div>

                                  {change.oldValue && change.newValue ? (
                                    <div className="flex items-center gap-3 ml-9 mt-1 text-gray-600 dark:text-gray-400">
                                      <span className="line-through text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                                        {change.oldValue}
                                      </span>
                                      <ArrowRight className="h-5 w-5 text-gray-400" />
                                      <span className="text-green-600 text-xs dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                                        {change.newValue}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="ml-9 text-gray-800 text-xs dark:text-gray-200">
                                      {change.newValue}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                  Tidak ada log yang tersedia untuk seminar ini (ID:{" "}
                  {seminarId || "Tidak dipilih"}).
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogJadwalModal;
