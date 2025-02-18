export default function colourfulProgress(persentase: number) {
  switch (true) {
    case persentase < 0 || persentase > 100:
      return "bg-gray-200"; // Default untuk nilai invalid
    case persentase > 90:
      return "bg-gradient-to-r from-green-400 to-green-600"; // >90 hingga 100 (kecuali 100)
    case persentase > 80:
      return "bg-gradient-to-r from-teal-400 to-teal-600"; // 80-90
    case persentase > 60:
      return "bg-gradient-to-r from-purple-400 to-purple-600";
    case persentase > 30:
      return "bg-gradient-to-r from-blue-400 to-blue-600";
    case persentase > 10:
      return "bg-gradient-to-r from-yellow-400 to-yellow-600";
    case persentase > 0:
      return "bg-gradient-to-r from-red-400 to-red-600";
    default:
      return "bg-gray-200"; // Default untuk nilai 0
  }
}
