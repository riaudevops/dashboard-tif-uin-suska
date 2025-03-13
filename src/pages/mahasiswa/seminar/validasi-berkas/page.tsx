import Step1 from "@/components/mahasiswa/seminar/steps/step1";
import Step2 from "@/components/mahasiswa/seminar/steps/step2";
import Step3 from "@/components/mahasiswa/seminar/steps/step3";
import Step4 from "@/components/mahasiswa/seminar/steps/step4";
import Step5 from "@/components/mahasiswa/seminar/steps/step5";
import Step6 from "@/components/mahasiswa/seminar/steps/step6";

export const infoPengajuanSeminar = {
  lokasi: "PT RAPP",
  dosenPembimbing: "Pizaini, ST., M.Kom",
  dosenPenguji: "Iwan Iskandar,M.T",
  judul: "Analisis Sistem Keamanan Sistem Perencanaan Divisi Sdm PT RAPP",
  step: 5, // 0 - 5
};

const stepComponents = [Step1, Step2, Step3, Step4, Step5, Step6];

export default function MahasiswaSeminarValidasiBerkasPage() {
  const StepComponent = stepComponents[infoPengajuanSeminar.step];

  return (
    <StepComponent activeStep={infoPengajuanSeminar.step} status="belum" /> //belum | validasi | ditolak
  );
}
