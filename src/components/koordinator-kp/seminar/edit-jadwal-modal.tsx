import { type FC, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  Building,
  User,
  GraduationCap,
  MapPin,
  FileText,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import APISeminarKP from "@/services/api/koordinator-kp/mahasiswa.service";

const ConvertToStringDateFormat = (dateStr: string) => {
  const date = new Date(dateStr);
  // Opsi untuk Intl.DateTimeFormat
  const options: any = {
    weekday: 'long', // "Jumat"
    day: 'numeric',  // "13"
    month: 'long',   // "Juni"
    year: 'numeric'  // "2025"
  };

  // Membuat formatter untuk lokal "id-ID" (Indonesia)
  const formatter = new Intl.DateTimeFormat('id-ID', options);

  // Menggunakan formatter untuk mengubah tanggal dan mengganti "pukul" jika ada
  return formatter.format(date).replace(/pukul.*/, '').trim();
}

const ConvertToStringTimeFormat = (dateTimeStr: string) => {
  if (!dateTimeStr.includes("T")) return dateTimeStr;
  const dateTime = new Date(dateTimeStr);
  return dateTime
    ? dateTime.toLocaleTimeString(
        "id-ID",
        {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Jakarta",
        }
      ).replace(".", ":")
    : "Waktu belum ditentukan";
}

interface Mahasiswa {
  nama: string;
  nim: string;
  semester: number;
}

interface JadwalSeminar {
  id: string;
  mahasiswa: Mahasiswa;
  status_kp: "Baru" | "Lanjut";
  ruangan: string;
  waktu_mulai: string;
  waktu_selesai: string;
  tanggal: string;
  dosen_penguji: string;
  dosen_pembimbing: string;
  instansi: string;
  pembimbing_instansi: string;
  status: "Menunggu" | "Selesai" | "Jadwal_Ulang";
}

interface Dosen {
  nip: string;
  nama: string;
}

interface Ruangan {
  nama: string;
}

interface EditJadwalSeminarModalProps {
  isOpen: boolean;
  onClose: () => void;
  seminar: JadwalSeminar | null;
  onSave: (updatedSeminar: JadwalSeminar) => void;
}

interface UpdateJadwalPayload {
  id: string;
  tanggal?: string;
  waktu_mulai?: string;
  waktu_selesai?: string;
  nama_ruangan?: string;
  nip_penguji?: string;
}

const EditJadwalSeminarModal: FC<EditJadwalSeminarModalProps> = ({
  isOpen,
  onClose,
  seminar,
  onSave,
}) => {
  if (!seminar) return null;

  const queryClient = useQueryClient();

  const convertToISODate = (displayDate: string): string => {
    try {
      if (displayDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return displayDate;
      }
      if (displayDate.includes(",")) {
        const dateParts = displayDate.split(", ")[1].split(" ");
        const day = dateParts[0].padStart(2, "0");
        const monthMap: { [key: string]: string } = {
          Januari: "01",
          Februari: "02",
          Maret: "03",
          April: "04",
          Mei: "05",
          Juni: "06",
          Juli: "07",
          Agustus: "08",
          September: "09",
          Oktober: "10",
          November: "11",
          Desember: "12",
        };
        const month = monthMap[dateParts[1]];
        const year = dateParts[2];
        return `${year}-${month}-${day}`;
      }
      return displayDate;
    } catch (error) {
      console.error("Error converting date:", error);
      return displayDate;
    }
  };

  const formatDateForDisplay = (isoDate: string): string => {
    try {
      if (!isoDate) return "";
      if (isoDate.includes(",")) {
        return isoDate;
      }
      const date = new Date(isoDate);
      const days = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
      ];
      const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];
      const dayName = days[date.getDay()];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${dayName}, ${day} ${month} ${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return isoDate;
    }
  };

  const [editSeminar, setEditSeminar] = useState<JadwalSeminar>({ ...seminar });

  const [isoDate, setIsoDate] = useState<string>(() => {
    return convertToISODate(ConvertToStringDateFormat(seminar.tanggal));
  });

  const { data: dosenData, isLoading: isLoadingDosen } = useQuery<Dosen[]>({
    queryKey: ["dosen-list"],
    queryFn: APISeminarKP.getAllDosen,
  });

  const { data: ruanganData, isLoading: isLoadingRuangan } = useQuery<
    Ruangan[]
  >({
    queryKey: ["ruangan-list"],
    queryFn: APISeminarKP.getAllRuangan,
  });

  const mutation = useMutation({
    mutationFn: (payload: UpdateJadwalPayload) =>
      APISeminarKP.putJadwal(payload),
    onSuccess: (data) => {
      const updatedSeminar = {
        ...editSeminar,
        tanggal: ConvertToStringDateFormat(data.tanggal)
          ? formatDateForDisplay(ConvertToStringDateFormat(data.tanggal))
          : ConvertToStringDateFormat(editSeminar.tanggal),
        waktu_mulai: ConvertToStringTimeFormat(data.waktu_mulai) || ConvertToStringTimeFormat(editSeminar.waktu_mulai),
        waktu_selesai: ConvertToStringTimeFormat(data.waktu_selesai) || ConvertToStringTimeFormat(editSeminar.waktu_selesai),
        ruangan: data.nama_ruangan || editSeminar.ruangan,
        dosen_penguji: data.nip_penguji
          ? dosenData?.find((d) => d.nip === data.nip_penguji)?.nama ||
            editSeminar.dosen_penguji
          : editSeminar.dosen_penguji,
      };

      setEditSeminar(updatedSeminar);
      onSave(updatedSeminar);

      queryClient.invalidateQueries({
        queryKey: ["koordinator-jadwal-seminar"],
      });

      toast.success("Jadwal berhasil diperbarui!", {
        duration: 3000,
      });
      onClose();
    },
    onError: (error: any) => {
      console.error("Gagal memperbarui jadwal:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message, {
          duration: 5000,
        });
      }
    },
  });

  const handleInputChange = (field: keyof JadwalSeminar, value: string) => {
    setEditSeminar((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (dateValue: string) => {
    setIsoDate(dateValue);
    const displayDate = formatDateForDisplay(dateValue);
    setEditSeminar((prev) => ({
      ...prev,
      tanggal: displayDate,
    }));
  };

  const handleSave = () => {
    const payload: UpdateJadwalPayload = {
      id: editSeminar.id,
    };

    const originalIsoDate = convertToISODate(ConvertToStringDateFormat(seminar.tanggal));
    if (isoDate !== originalIsoDate) {
      payload.tanggal = isoDate;
      // Sertakan waktu_mulai dan waktu_selesai saat tanggal diubah
      payload.waktu_mulai = ConvertToStringTimeFormat(editSeminar.waktu_mulai);
      payload.waktu_selesai = ConvertToStringTimeFormat(editSeminar.waktu_selesai);
    }

    if (ConvertToStringTimeFormat(editSeminar.waktu_mulai) !== ConvertToStringTimeFormat(seminar.waktu_mulai)) {
      payload.waktu_mulai = ConvertToStringTimeFormat(editSeminar.waktu_mulai);
    }

    if (ConvertToStringTimeFormat(editSeminar.waktu_selesai) !== ConvertToStringTimeFormat(seminar.waktu_selesai)) {
      payload.waktu_selesai = ConvertToStringTimeFormat(editSeminar.waktu_selesai);
    }

    if (editSeminar.ruangan !== seminar.ruangan) {
      payload.nama_ruangan = editSeminar.ruangan;
    }

    if (editSeminar.dosen_penguji !== seminar.dosen_penguji) {
      const selectedDosen = dosenData?.find(
        (d) => d.nama === editSeminar.dosen_penguji
      );
      if (selectedDosen) {
        payload.nip_penguji = selectedDosen.nip;
      }
    }

    mutation.mutate(payload);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-xl bg-white dark:bg-gray-900">
          <div className="px-4 pt-8">
            <DialogHeader>
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-emerald-600 dark:to-teal-500 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-2 w-12 h-12 flex items-center justify-center shadow-sm">
                        <User className="text-emerald-600 dark:text-emerald-400 w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {editSeminar.mahasiswa.nama}
                        </h3>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="bg-white/90 dark:bg-gray-800/90 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full shadow-sm text-center">
                            Semester {editSeminar.mahasiswa.semester}
                          </span>
                          <span className="flex items-center bg-emerald-600/40 dark:bg-emerald-700/40 px-2 py-0.5 rounded-full">
                            <span className="bg-white dark:bg-gray-200 w-1.5 h-1.5 rounded-full mr-1"></span>
                            {editSeminar.status_kp.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/90 dark:bg-gray-800/90 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-md text-xs font-medium shadow-sm">
                      {editSeminar.mahasiswa.nim}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-0 border-t border-gray-100 dark:border-gray-700">
                  <div className="p-3 flex items-center gap-2 border-r border-gray-100 dark:border-gray-700">
                    <Building className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                    <div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        INSTANSI
                      </div>
                      <div className="font-medium text-xs text-gray-800 dark:text-gray-200">
                        {editSeminar.instansi}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 flex items-center gap-2 border-r border-gray-100 dark:border-gray-700">
                    <User className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                    <div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        PEMBIMBING INSTANSI
                      </div>
                      <div className="font-medium text-xs text-gray-800 dark:text-gray-200">
                        {editSeminar.pembimbing_instansi}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 flex items-center gap-2 border-r border-gray-100 dark:border-gray-700">
                    <GraduationCap className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                    <div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        DOSEN PEMBIMBING
                      </div>
                      <div className="font-medium text-xs text-gray-800 dark:text-gray-200">
                        {editSeminar.dosen_pembimbing}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                    <div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        DOSEN PENGUJI
                      </div>
                      <div className="font-medium text-xs text-gray-800 dark:text-gray-200">
                        {editSeminar.dosen_penguji}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="overflow-y-auto flex-1 px-5 py-4 bg-gray-50 dark:bg-gray-900">
            <div className="my-4">
              <h3 className="text-base font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                PENGATURAN ULANG JADWAL DAN DOSEN PENGUJI
              </h3>

              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                  <div className="p-4">
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="ruangan"
                          className="text-xs text-gray-500 dark:text-gray-400 mb-1 block"
                        >
                          Ruangan Seminar
                        </Label>
                        <div className="relative">
                          <MapPin className="h-4 w-4 absolute left-3 top-3 text-gray-400 z-10" />
                          <Select
                            value={editSeminar.ruangan}
                            onValueChange={(value) =>
                              handleInputChange("ruangan", value)
                            }
                          >
                            <SelectTrigger
                              id="ruangan"
                              className="bg-white dark:bg-gray-800 pl-9"
                            >
                              <SelectValue placeholder="Pilih Ruangan Seminar" />
                            </SelectTrigger>
                            <SelectContent>
                              {isLoadingRuangan ? (
                                <SelectItem value="loading" disabled>
                                  Memuat ruangan...
                                </SelectItem>
                              ) : (
                                ruanganData?.map((room) => (
                                  <SelectItem key={room.nama} value={room.nama}>
                                    {room.nama}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="tanggalSeminar"
                            className="text-xs text-gray-500 dark:text-gray-400 mb-1 block"
                          >
                            Tanggal Seminar
                          </Label>
                          <div className="relative">
                            <Calendar className="h-4 w-4 absolute left-3 top-2.5 text-gray-400 z-10" />
                            <Input
                              id="tanggalSeminar"
                              type="date"
                              value={isoDate}
                              onChange={(e) => handleDateChange(e.target.value)}
                              className="pl-9 bg-white dark:bg-gray-800"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor="waktuMulai"
                              className="text-xs text-gray-500 dark:text-gray-400 mb-1 block"
                            >
                              Waktu Mulai
                            </Label>
                            <div className="relative">
                              <Clock className="h-4 w-4 absolute left-3 top-2.5 text-gray-400" />
                              <Input
                                id="waktuMulai"
                                type="time"
                                value={ConvertToStringTimeFormat(editSeminar.waktu_mulai)}
                                onChange={(e) =>
                                  handleInputChange(
                                    "waktu_mulai",
                                    e.target.value
                                  )
                                }
                                className="pl-9 bg-white dark:bg-gray-800"
                              />
                            </div>
                          </div>
                          <div>
                            <Label
                              htmlFor="waktuSelesai"
                              className="text-xs text-gray-500 dark:text-gray-400 mb-1 block"
                            >
                              Waktu Selesai
                            </Label>
                            <div className="relative">
                              <Clock className="h-4 w-4 absolute left-3 top-2.5 text-gray-400" />
                              <Input
                                id="waktuSelesai"
                                type="time"
                                value={ConvertToStringTimeFormat(editSeminar.waktu_selesai)}
                                onChange={(e) =>
                                  handleInputChange(
                                    "waktu_selesai",
                                    e.target.value
                                  )
                                }
                                className="pl-9 bg-white dark:bg-gray-800"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                  <div className="p-4">
                    <div>
                      <Label
                        htmlFor="pemilihanDosenPenguji"
                        className="text-xs text-gray-500 dark:text-gray-400 mb-1 block"
                      >
                        Pemilihan Dosen Penguji
                      </Label>
                      <p className="text-xs text-gray-400 mb-2">
                        Pilih nama dosen penguji dari daftar
                      </p>
                      <div className="relative">
                        <GraduationCap className="h-4 w-4 absolute left-3 top-3 text-gray-400 z-10" />
                        <Select
                          value={editSeminar.dosen_penguji}
                          onValueChange={(value) =>
                            handleInputChange("dosen_penguji", value)
                          }
                        >
                          <SelectTrigger
                            id="pemilihanDosenPenguji"
                            className="bg-white dark:bg-gray-800 pl-9"
                          >
                            <SelectValue placeholder="Pilih dosen penguji" />
                          </SelectTrigger>
                          <SelectContent>
                            {isLoadingDosen ? (
                              <SelectItem value="loading" disabled>
                                Memuat dosen...
                              </SelectItem>
                            ) : (
                              dosenData?.map((dosen) => (
                                <SelectItem key={dosen.nip} value={dosen.nama}>
                                  {dosen.nama}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 rounded-b-xl">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              disabled={mutation.isPending}
            >
              Kembali
            </Button>
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Menyimpan..." : "Validasi Perubahan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditJadwalSeminarModal;
