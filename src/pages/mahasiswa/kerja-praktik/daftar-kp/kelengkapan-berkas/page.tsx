  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";

const MahasiswaKerjaPraktekDaftarKPKelengkapanBerkasPage = () => {
  const steps = [
    {
      number: 0,
      title: "Surat Pengantar & Jawaban",
      status: "Upload Berkas",
      action: "Not Action"
    },
    {
      number: 1,
      title: "ID Pengajuan Dosen Pembimbing",
      status: "Input",
      action: "Not Action"
    },
    {
      number: 2,
      title: "Dokumen Penunjukan Pembimbing",
      status: "Upload Berkas",
      action: "Not Action"
    },
    {
      number: 3,
      title: "Selesai",
      status: "Status Kelengkapan KP",
      action: "Not Action"
    }
  ];

  return (
    <>
      <DashboardLayout>
        <div>
          <div className="p-6 space-y-6">
            {/* Progress Steps */}
            <div className="flex justify-between items-center mb-8">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white mb-2 
                    ${index === 0 ? 'bg-purple-600' : 'bg-emerald-400'}`}>
                    {step.number}
                  </div>
                  <div className="h-1 w-full bg-emerald-200" />
                  <div className="text-sm text-gray-600 mt-2">{step.title}</div>
                  <div className="text-xs text-gray-400">{step.status}</div>
                  <div className="text-xs text-emerald-400 bg-emerald-50 px-2 py-1 rounded mt-1">
                    {step.action}
                  </div>
                </div>
              ))}
            </div>

            {/* Periode Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Periode Kerja Praktik
              </h2>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Tanggal Selesai</label>
                <Input type="text" placeholder="dd/mm/yyy" className="max-w-xs" />
              </div>
            </div>

            {/* Upload Cards */}
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Upload Dokumen Surat Pengatar Dari Dekan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Deploy your new project in one-click
                  </p>
                  <div className="border-2 border-dashed border-purple-200 rounded-lg p-8 text-center">
                    <span className="text-purple-400">Slot</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Upload Dokumen Surat Diterima Pada Instansi Terkait
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Deploy your new project in one-click
                  </p>
                  <div className="border-2 border-dashed border-purple-200 rounded-lg p-8 text-center">
                    <span className="text-purple-400">Slot</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default MahasiswaKerjaPraktekDaftarKPKelengkapanBerkasPage;