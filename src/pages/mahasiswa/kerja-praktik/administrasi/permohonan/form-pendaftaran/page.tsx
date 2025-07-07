import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FormEvent } from "react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation } from "@tanstack/react-query";
import APIDaftarKP from "@/services/api/mahasiswa/daftar-kp.service";
import {
	CreatePendaftaranMahasiswaInterface,
	UpdatePendaftaranMahasiswaInterface,
} from "@/interfaces/pages/mahasiswa/kerja-praktik/daftar-kp/pendaftaran.interface";
import { toast } from "sonner";
import { ErrorInterface } from "@/interfaces/pages/error.type";

function MahasiswaKerjapraktikDaftarKpPermohonanFromPendaftaranPage() {
	const navigate = useNavigate();

	const { data: dataInstansi } = useQuery({
		queryKey: ["instansi-aktif"],
		queryFn: () => APIDaftarKP.getDataInstansiAktif().then((res) => res.data),
	});

	const { data: dataKPTerbaru } = useQuery({
		queryKey: ["halaman-permohonan-kp-terbaru-mahasiswa"],
		queryFn: () => APIDaftarKP.getKPAktifMahasiswa().then((res) => res.data),
	});

	const updateMutation = useMutation({
		mutationFn: (data: UpdatePendaftaranMahasiswaInterface) =>
			APIDaftarKP.updatePendaftaranMahasiswa(data).then((res) => res.data),
		onSuccess: (data) => {
			toast.success(
				data.message || "Berhasil melakukan pendaftaran kerja praktik"
			);
			const pointer = setTimeout(function () {
				navigate("/mahasiswa/kerja-praktik/daftar-kp/permohonan");
				clearTimeout(pointer);
			}, 1000);
		},
		onError: (data: ErrorInterface) => {
			toast.error(
				data?.response?.data?.message ||
					"Gagal melakukan pendaftaran kerja praktik"
			);
		},
	});

	const createMutation = useMutation({
		mutationFn: (data: CreatePendaftaranMahasiswaInterface) =>
			APIDaftarKP.createPendaftaranMahasiswa(data),
		onSuccess: (data) => {
			toast.success(
				data.message || "Berhasil melakukan pendaftaran kerja praktik"
			);
			const pointer = setTimeout(function () {
				navigate("/mahasiswa/kerja-praktik/daftar-kp/permohonan");
				clearTimeout(pointer);
			}, 1000);
		},
		onError: (data: ErrorInterface) => {
			toast.error(
				data?.response?.data?.message ||
					"Gagal melakukan pendaftaran kerja praktik"
			);
		},
	});

	let mutation: any = createMutation;

	if (dataKPTerbaru) {
		mutation = updateMutation;
	}

	async function handleOnSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const objectFormData = Object.fromEntries(formData.entries());
		console.log(objectFormData);
		mutation.mutate({
			tanggalMulai: new Date().toISOString(),
			tujuanSuratInstansi: objectFormData.tujuanSuratInstansi as string,
			idInstansi: objectFormData.idInstansi as string,
			kelas_kp: objectFormData.kelas_kp as string,
			judul_kp: objectFormData.judul_kp as string,
		});
	}

	async function handleOnCancel() {
		navigate("/mahasiswa/kerja-praktik/daftar-kp/permohonan");
	}

	return (
		<DashboardLayout>
			<Card>
				<form onSubmit={handleOnSubmit}>
					<CardHeader>
						<CardTitle className="text-center font-bold text-2xl">
							Form Pendaftaran Kerja praktik
						</CardTitle>
					</CardHeader>
					<CardContent>
						<CardTitle className="font-bold text-lg">
							🏢 Instansi/Perusahaan
						</CardTitle>
						<Label className="text-sm font-bold mt-6" htmlFor="instansi">
							Nama Instansi / Perusahaan
						</Label>
						<CardContent className="p-0 rounded-md border-black border-[1px]">
							<select
								required
								name="idInstansi"
								id="instansi"
								className="dark:bg-black dark:border-white dark:border-[1px] rounded-lg block w-[100%] p-2"
							>
								<option value="">Pilih Instansi</option>
								{dataInstansi?.map(({ id, nama }: any) => (
									<option key={id} value={id}>
										{nama}
									</option>
								))}
							</select>
						</CardContent>

						<CardDescription className="text-sm text-slate-500">
							Instansi belum terdaftar? Daftarkan segera{" "}
							<Link
								className="text-blue-500"
								to={{
									pathname:
										"/mahasiswa/kerja-praktik/daftar-kp/permohonan/form-daftar-instansi",
								}}
							>
								Disini
							</Link>
						</CardDescription>
					</CardContent>

					<CardContent>
						<Label className="text-sm font-bold" htmlFor="tujuan-surat">
							Tujuan Surat Instansi/Perusahaan
						</Label>
						<Textarea
							required
							className="block w-full p-2 border-slate-300 border-[1px] h-42"
							name="tujuanSuratInstansi"
							id="tujuan-surat"
							placeholder="Masukkan tujuan instansi disini..."
						></Textarea>
					</CardContent>

					<CardContent>
						<CardTitle className="font-bold text-lg">
							🪪 Informasi Kerja praktik
						</CardTitle>
						<Label className="text-sm font-bold mt-6" htmlFor="kelas">
							Kelas
						</Label>
						<CardContent className="p-0 rounded-md border-black border-[1px]">
							<select
								name="kelas_kp"
								id="kelas"
								className="dark:bg-black dark:border-white dark:border-[1px] rounded-lg block w-[100%] p-2"
							>
								<option value="">Pilih Kelas</option>
								<option value="A">A</option>
								<option value="B">B</option>
								<option value="C">C</option>
								<option value="D">D</option>
								<option value="E">E</option>
								<option value="F">F</option>
								<option value="G">G</option>
							</select>
						</CardContent>
					</CardContent>

					<CardContent>
						<Label className="text-sm font-bold" htmlFor="judul">
							Judul Laporan Kerja praktik
						</Label>
						<Textarea
							className="block w-full p-2 border-slate-300 border-[1px] h-42"
							name="judul_kp"
							id="judul"
							placeholder="Masukkan judul laporan kerja praktik disini..."
						></Textarea>
					</CardContent>

					<CardFooter className="text-end mt-4 sm:flex sm:flex-col sm:gap-2 md:block">
						<Button
							onClick={handleOnCancel}
							type="button"
							disabled={mutation.isPending}
							className="md:mr-4  py-1 md:w-[198px] font-bold border-black border-[1px] hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
						>
							Batal
						</Button>
						<Button
							type="submit"
							disabled={mutation.isPending}
							className="bg-green-600 py-1 md:w-[198px] font-bold text-white hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
						>
							Ajukan Permohonan
						</Button>
					</CardFooter>
				</form>
			</Card>
		</DashboardLayout>
	);
}

export default MahasiswaKerjapraktikDaftarKpPermohonanFromPendaftaranPage;