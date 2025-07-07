export function tahunAjaranToStringInterface(tahunAjaran: number): string {
  const rightYear = Math.floor((tahunAjaran % 100000) / 10);
  const isGanjil = tahunAjaran % 2 === 1;

  let leftYear = isGanjil
    ? Math.floor((tahunAjaran - rightYear * 10 + 1) / 100000)
    : Math.floor((tahunAjaran - rightYear * 10 + 2) / 100000);

  return `${leftYear}/${rightYear} ${isGanjil ? "Ganjil" : "Genap"}`;
}
