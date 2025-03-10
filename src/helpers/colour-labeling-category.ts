export function colourLabelingCategory(label: string) {
  switch (label) {
    case "KP":
      return ["Kerja Praktek", "bg-chart-1"];
    case "SEMKP":
      return ["Seminar Kerja Praktek", "bg-chart-2"];
    case "DAFTAR_TA":
      return ["Tugas Akhir", "bg-chart-3"];
    case "SEMPRO":
      return ["Seminar Proposal", "bg-chart-4"];
    case "SIDANG_TA":
      return ["Sidang Tugas Akhir", "bg-chart-5"];
    default:
      return ["Default", "bg-chart-1"];
  }
}
