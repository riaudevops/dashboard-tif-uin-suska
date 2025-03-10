import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

// Add interface for props
interface TambahAgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TambahAgendaModal = ({ isOpen, onClose }: TambahAgendaModalProps) => {
  const [formData, setFormData] = useState({
    jamMasuk: "",
    jamSelesai: "",
    judulAgenda: "",
    deskripsi: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    onClose();
  };

  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      {/* Modal Content */}
      <div className="bg-white rounded-xl py-4 px-6 w-[90%] md:max-w-[900px] max-h-[90vh] overflow-y-auto flex flex-col">
        <button
          onClick={onClose}
          className="w-full text-gray-500 hover:text-red-500 text-end"
        >
          ✕
        </button>
        {/* Modal Header */}
        <h2 className="text-xl font-bold text-center mb-6">Tambah agenda</h2>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label
                className="text-xs font-medium text-gray-600"
                htmlFor="jamMasuk"
              >
                Jam Masuk
              </label>
              <input
                id="jamMasuk"
                name="jamMasuk"
                type="time"
                value={formData.jamMasuk}
                onChange={handleChange}
                className="w-full border rounded-md p-2 text-sm focus:ring-2 hover:bg-gray-50 focus:ring-blue-200 focus:border-blue-400 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label
                className="text-xs font-medium text-gray-600"
                htmlFor="jamSelesai"
              >
                Jam Keluar
              </label>
              <input
                id="jamSelesai"
                name="jamSelesai"
                type="time"
                value={formData.jamSelesai}
                onChange={handleChange}
                className="w-full border rounded-md p-2 text-sm focus:ring-2 hover:bg-gray-50 focus:ring-blue-200 focus:border-blue-400 outline-none"
              />
            </div>
          </div>

          {/* Upload Button */}
          <div className="pt-4 flex flex-col items-center">
            <button type="button" className="flex gap-2 justify-center items-center bg-gray-200 px-4 py-2 rounded-md">
              <Upload size={18} />
              Upload Dokumentasi
            </button>
          </div>

          {/* Judul Agenda */}
          <div className="mt-4 mb-4">
            <label className="block text-sm font-medium mb-2">
              Judul Agenda <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="judulAgenda"
              value={formData.judulAgenda}
              onChange={handleChange}
              placeholder="Masukkan Judul Agenda"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Deskripsi */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              placeholder="Masukkan Deskripsi Agenda"
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            ></textarea>
          </div>

          {/* Buttons - moved to the bottom with auto margin top */}
          <div className="flex justify-between mt-auto pt-4">
            <Button
              type="button"
              className="bg-gray-900 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4V20M4 12H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Tambah Agenda
            </Button>
            <Button
              type="submit"
              className="bg-gray-900 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 12L9 17L20 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahAgendaModal;