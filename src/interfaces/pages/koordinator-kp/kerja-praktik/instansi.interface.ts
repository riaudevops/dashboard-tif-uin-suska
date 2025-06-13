export interface DataInstansi {
  id: string;
  status: "Aktif" | "Pending" | "Tidak_Aktif";
  profil_singkat: string;
  nama: string;
  jenis: "Pemerintahan" | "Swasta" | "Pendidikan" | "UMKM";
  nama_pj: string;
  no_hp_pj: string;
  alamat: string;
  longitude: number;
  latitude: number;
  radius: number;
}
