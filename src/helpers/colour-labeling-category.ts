export function colourLabelingCategory(label: string) {
  switch (label) {
    case "KP":
      return ["Kerja Praktik", "bg-pink-600"];
    case "SEMKP":
      return ["Seminar Kerja Praktik", "bg-chart-1"];
    case "DAFTAR_TA":
      return ["Tugas Akhir", "bg-chart-2"];
    case "SEMPRO":
      return ["Seminar Proposal", "bg-yellow-600"];
    case "SIDANG_TA":
      return ["Sidang Tugas Akhir", "bg-orange-700"];
    default:
      return ["Default", "bg-chart-1"];
  }
}
