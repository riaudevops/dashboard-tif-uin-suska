import { Link } from "react-router";
import ProgressBar from "@/components/mahasiswa/daftar-kp/ProgressBar";
import { FormEvent, useState } from "react";
import RiwayatCard from "@/components/mahasiswa/daftar-kp/RiwayatCard";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	Card,
	CardHeader,
	CardContent,
	CardTitle,
	CardDescription,
	CardFooter,
} from "@/components/ui/card";
import APIDaftarKP from "@/services/api/mahasiswa/daftar-kp.service";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IsPendaftaranKPClosedSync } from "@/helpers/batas-waktu-pendaftaran..validator";
import { toast } from "sonner";
import { UpdatePendaftaranMahasiswaInterface } from "@/interfaces/pages/mahasiswa/kerja-praktik/daftar-kp/pendaftaran.interface";
import { ErrorInterface } from "@/interfaces/pages/error.type";

interface KPInterface {
	id: string;
	status: string;
	tanggal_mulai: string;
	level_akses: number;
	instansi: {
		nama: string;
	};
}

export default function MahasiswaKerjapraktikDaftarKpPermohonanPage() {
	const [idLog, setIdLog] = useState<string | null>(null);
	const [isPenolakanInstansiModalOpen, setIsPenolakanInstansiModalOpen] =
		useState<boolean>(false);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

	// KPInterface = aktif
	// null = data gagal didapatkan
	// undefined = sudah lulus
	// false = tidak sedang mendaftar dan belum lulus

	const { data: riwayatKP, isLoading } = useQuery({
		queryKey: ["riwayat-kp-mahasiswa"],
		queryFn: () =>
			APIDaftarKP.getRiwayatKP()
				.then((res) => res.data)
				.catch((error) => console.log(error)),
	});

	const { data: tanggalKP } = useQuery({
		queryKey: ["tanggal-kp-mahasiswa"],
		queryFn: () =>
			APIDaftarKP.getTanggalDaftarKP()
				.then((res) => res.data)
				.catch((error) =>
					console.log(`Gagal mendapatkan tanggal KP, Error = ${error}`)
				),
	});

	const { data: activeKP } = useQuery({
		queryKey: ["kp-terbaru-mahasiswa"],
		queryFn: () => {
			return APIDaftarKP.getKPAktifMahasiswa()
				.then((res) => res.data)
				.catch((error) =>
					console.log(`Gagal mendapatkan tanggal KP, Error = ${error}`)
				);
		},
	});

	const { data: log } = useQuery({
		queryKey: ["log-kp-terbaru-mahasiswa"],
		queryFn: () => APIDaftarKP.getLOGMahasiswa(idLog!).then((res) => res.data),
		enabled: idLog !== null,
	});

	let isTanggalPendaftaranOpen = false;
	if (tanggalKP) {
		isTanggalPendaftaranOpen = !IsPendaftaranKPClosedSync(tanggalKP);
	}

	let StepComponent = <div></div>;

	if (!activeKP || activeKP.level_akses === 0) {
		StepComponent = (
			<Card className="rounded-md border-green-500 border-2">
				<CardHeader>
					<CardTitle className="font-semibold text-lg">
						Permohonan Pendaftaran Kerja praktik
					</CardTitle>
					<CardDescription className="text-stone-500 my-2">
						Silakan Lakukan Pendaftaran Kerja praktik Pada Tombol di Bawah ini
						Jika Sudah Memenuhi Syarat:
					</CardDescription>
				</CardHeader>
				<CardContent className="grid grid-cols-1 gap-2">
					<CardDescription className="rounded-md py-3 px-2">
						<CardDescription>{"tif kerja-praktik@latest"}</CardDescription>
						<CardDescription className="text-cyan-700">
							✔ Setoran Hafalan 1-8
						</CardDescription>
						<CardDescription className="text-cyan-700">
							✔ 80 SKS yang telah Diambil
						</CardDescription>
						<CardDescription className="text-cyan-700">
							✔ Matakuliah Rekayasa Perangkat Lunak Berorientasi Objek Min. D
						</CardDescription>
						<CardDescription className="text-cyan-700">
							✔ Matakuliah Sistem Informasi Min. D
						</CardDescription>
						<CardDescription className="text-cyan-700">
							✔ Matakuliah Jaringan Komputer Min. D
						</CardDescription>
						<CardDescription className="text-cyan-700">
							✔ Menyiapkan Sistem
						</CardDescription>
						<CardDescription className="text-blue-800">
							ℹ Updated 1 file:
						</CardDescription>
						<CardDescription className="text-blue-800">
							- lib/kerja-praktik.ts
						</CardDescription>
						<CardDescription className="text-green-400">
							Success! Sistem siap digunakan.
						</CardDescription>
						<CardDescription>
							Silakan mulai pendaftaran kerja praktik Anda.
						</CardDescription>
					</CardDescription>
				</CardContent>
				<CardFooter>
					<Link
						to={{
							pathname:
								"/mahasiswa/kerja-praktik/daftar-kp/permohonan/form-pendaftaran",
						}}
						className="block text-center w-full hover:cursor-pointer hover:bg-green-400 bg-green-500 py-[4px] rounded-md text-white text-sm font-bold mt-2"
					>
						Buat Permohonan ➡
					</Link>
				</CardFooter>
			</Card>
		);
	} else if (activeKP && activeKP.level_akses > 0) {
		StepComponent = (
			<Card className="rounded-md border-green-500 border-2 py-2 px-4 bg-green-100 dark:bg-black">
				<CardHeader>
					<CardTitle className="font-semibold text-lg">
						Permohonan Pendaftaran Kerja praktik
					</CardTitle>
					<CardDescription className="text-stone-500 my-2">
						Silakan Lakukan Pendaftaran Kerja praktik Pada Tombol di Bawah ini
						Jika Sudah Memenuhi Syarat:
					</CardDescription>
				</CardHeader>
				<CardContent className="rounded-lg pt-4 flex justify-center gap-12 items-center">
					<div>
						<CardDescription className="text-lg font-bold">
							Progress Terkini Pendaftaran Kerja praktik :
						</CardDescription>
						<ProgressBar currentStep={activeKP.level_akses} />
					</div>
					<Card className="shadow-xl py-3 pl-3 pr-20 rounded-lg">
						<CardHeader>
							<CardTitle className="font-bold">
								PENGAJUAN INSTANSI KP :
							</CardTitle>
							<CardDescription>
								{(activeKP as KPInterface).instansi?.nama || ""}
							</CardDescription>
						</CardHeader>
					</Card>
				</CardContent>
				<CardFooter className="md:mx-auto md:w-[500px] flex items-center justify-between rounded-full border-[1px] border-black dark:border-white p-2 mt-3">
					<CardDescription className="text-sm">
						Silakan lanjut untuk validasi kelengkapan berkas!
					</CardDescription>
					<Link
						to={{
							pathname: "/mahasiswa/kerja-praktik/daftar-kp/kelengkapan-berkas",
						}}
						className="rounded-full p-2 bg-green-600 text-white text-sm font-semibold"
					>
						LANJUT {">"}
					</Link>
				</CardFooter>
			</Card>
		);
	}
	

	return (
		<DashboardLayout>
			{isPenolakanInstansiModalOpen && (
				<PenolakanInstansiDialog
					catatan={activeKP.dokumen_pendaftaran_kp[0]?.catatan}
					status={activeKP.dokumen_pendaftaran_kp[0]?.status}
					setIsPenolakanInstansiModalOpen={() =>
						setIsPenolakanInstansiModalOpen((prev) => !prev)
					}
				/>
			)}
			{isDetailModalOpen && (
				<DetailDialog
					activeKP={activeKP}
					setIsDetailModalOpen={() => setIsDetailModalOpen((prev) => !prev)}
				/>
			)}
			{isLoading && (
				<Card>
					<CardHeader>
						<CardTitle>Loading...</CardTitle>
					</CardHeader>
				</Card>
			)}
			{!isTanggalPendaftaranOpen && (
				<>
					<Card>
						<CardHeader className="text-center font-bold">
							Saat ini Pendaftaran Kerja praktik telah Ditutup
						</CardHeader>
					</Card>
					<Card>
						<CardContent className="rounded-lg p-2 mt-3 shadow-lg">
							<CardTitle className="font-semibold tracking-wide">
								Detail Riwayat
							</CardTitle>
							<h4 className="mt-2 font-medium text-[14px] mb-2">Aktif</h4>
							{(!riwayatKP || riwayatKP.length === 0) && (
								<Card className="p-2 text-center">
									Tidak ada data riwayat KP yang tersedia saat ini.
								</Card>
							)}
							{activeKP && (
								<RiwayatCard
									count={riwayatKP.length}
									setIsPenolakanInstansiModalOpen={() =>
										setIsPenolakanInstansiModalOpen((prev) => !prev)
									}
									setIsDetailModalOpen={() =>
										setIsDetailModalOpen((prev) => !prev)
									}
									setIdLog={() => setIdLog(activeKP.id)}
									key={activeKP.id}
									status={activeKP.status}
									tanggalMulai={new Date(activeKP.tanggal_mulai).toDateString()}
									namaInstansi={activeKP.instansi.nama || ""}
								/>
							)}
							{riwayatKP &&
								riwayatKP.length > 0 &&
								riwayatKP
									.filter((e: any) => e.status === "Gagal")
									.map(
										(
											{ id, status, tanggal_mulai, instansi: { nama } }: any,
											i: number
										) => (
											<RiwayatCard
												count={i}
												setIdLog={() => setIdLog(id)}
												key={i}
												status={status}
												tanggalMulai={tanggal_mulai
													.slice(0, 10)
													.replaceAll("-", "/")}
												namaInstansi={nama || ""}
											/>
										)
									)}
							{idLog && (
								<LogComponent data={log?.data} setIdLog={() => setIdLog("")} />
							)}
						</CardContent>
					</Card>
				</>
			)}
			{!isLoading && isTanggalPendaftaranOpen && (
				<>
					<Card className="mb-4">
						<CardHeader>
							<CardTitle className="font-bold text-xl">
								Pendaftaran Kerja praktik
							</CardTitle>
							<CardDescription>
								Berikut detail Progres Pendaftaran Kerja praktik Anda, semangat
								terus ya...
							</CardDescription>
						</CardHeader>
					</Card>
					{StepComponent}
					<Card className="mt-4">
						<CardContent className="rounded-lg p-2 mt-3 shadow-lg">
							<CardTitle className="font-semibold tracking-wide">
								Detail Riwayat
							</CardTitle>
							<h4 className="mt-2 font-medium text-[14px] mb-2">Aktif</h4>
							{(!riwayatKP || riwayatKP.length === 0) && (
								<Card className="p-2 text-center">
									Tidak ada data riwayat KP yang tersedia saat ini.
								</Card>
							)}
							{activeKP && (
								<RiwayatCard
									count={riwayatKP.length}
									setIsPenolakanInstansiModalOpen={() =>
										setIsPenolakanInstansiModalOpen((prev) => !prev)
									}
									setIsDetailModalOpen={() =>
										setIsDetailModalOpen((prev) => !prev)
									}
									setIdLog={() => setIdLog(activeKP.id)}
									key={activeKP.id}
									status={activeKP.status}
									tanggalMulai={new Date(activeKP.tanggal_mulai).toDateString()}
									namaInstansi={activeKP.instansi.nama || ""}
								/>
							)}
							{riwayatKP &&
								riwayatKP.length > 0 &&
								riwayatKP
									.filter((e: any) => e.status === "Gagal")
									.map(
										(
											{ id, status, tanggal_mulai, instansi: { nama } }: any,
											i: number
										) => (
											<RiwayatCard
												count={i}
												setIdLog={() => setIdLog(id)}
												key={i}
												status={status}
												tanggalMulai={tanggal_mulai
													.slice(0, 10)
													.replaceAll("-", "/")}
												namaInstansi={nama || ""}
											/>
										)
									)}
							{idLog && (
								<LogComponent data={log} setIdLog={() => setIdLog("")} />
							)}
						</CardContent>
					</Card>
				</>
			)}
		</DashboardLayout>
	);
}

interface LogInterface {
	setIdLog: () => void;
	data: {
		message: string;
		tanggal: string;
		status: number;
	}[];
}

interface DetailModalInterface {
	setIsDetailModalOpen: () => void;
	activeKP: any;
}

function DetailDialog({
	activeKP,
	setIsDetailModalOpen,
}: DetailModalInterface) {
	const queryClient = useQueryClient();
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const mutation = useMutation({
		mutationFn: (data: UpdatePendaftaranMahasiswaInterface) =>
			APIDaftarKP.updatePendaftaranMahasiswa(data),
		onSuccess: (data) => {
			toast.success(
				data.message || "Berhasil mengubah judul laporan / kelas kerja praktik"
			);
			setIsEditing((prev) => !prev);
			queryClient.invalidateQueries({
				queryKey: ["kp-terbaru-mahasiswa"],
				exact: true,
			});
		},
		onError: (data: ErrorInterface) => {
			toast.error(
				data?.response?.data?.message ||
					"Gagal mengubah judul laporan / kelas kerja praktik"
			);
		},
	});

	async function handleOnSubmitUpdateDetailKP(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const data = Object.fromEntries(formData.entries());
		mutation.mutate(data);
	}
	return (
		<Card className="flex flex-col gap-4 absolute left-[50%] -translate-x-1/2 top-[50%] -translate-y-1/2 min-w-[50%] h-[80%] overflow-scroll p-2">
			<CardHeader>
				<CardTitle className="text-center text-lg font-bold tracking-wide">
					Informasi Kerja praktik
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Card className="p-4 mb-4">
					<CardTitle>Instansi</CardTitle>
					<Label>Nama Instansi:</Label>
					<p>{activeKP.instansi.nama}</p>
					<Label>Jenis :</Label>
					<p>{activeKP.instansi.jenis}</p>
					<Label>Nama Penanggung Jawab :</Label>
					<p>{activeKP.instansi.nama_pj}</p>
					<Label>No HP Penanggung Jawab : :</Label>
					<p>{activeKP.instansi.no_hp_pj}</p>
					<Label>Profil Singkat :</Label>
					<p>{activeKP.instansi.profil_singkat}</p>
					<br />
					<Label>Alamat :</Label>
					<p>{activeKP.instansi.alamat}</p>
					<Label>Longitude :</Label>
					<p>{activeKP.instansi.longitude}</p>
					<Label>Latitude :</Label>
					<p>{activeKP.instansi.latitude}</p>
					<Label>Radius :</Label>
					<p>{activeKP.instansi.radius}</p>
				</Card>

				<Card className="p-4">
					<form onSubmit={handleOnSubmitUpdateDetailKP}>
						<CardTitle className="mb-2">Informasi Kerja praktik</CardTitle>
						<Label>Tujuan Surat Instansi :</Label>
						<p>{activeKP.tujuan_surat_instansi}</p>
						<Label>Tanggal Mulai :</Label>
						<p>{new Date(activeKP.tanggal_mulai).toDateString()}</p>
						<Label>Tanggal Pengajuan :</Label>
						<p>{new Date(activeKP.tanggal_pengajuan).toDateString()}</p>
						<Label htmlFor="kelas-kerja-praktik">Kelas Kerja praktik :</Label>
						{isEditing ? (
							<CardContent className="text-black bg-white p-0 rounded-md border-black border-[1px]">
								<select
									name="kelas_kp"
									id="kelas-kerja-praktik"
									className="bg-white block w-[100%] p-2 dark:bg-black dark:text-white dark:border-white"
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
						) : (
							<p>{activeKP.kelas_kp || "Kelas Kerja praktik belum Tersedia"}</p>
						)}
						<Label htmlFor="laporan-kerja-praktik">
							Judul Laporan Kerja praktik :
						</Label>
						{isEditing ? (
							<Input id="laporan-kerja-praktik" name="judul_kp" />
						) : (
							<p>{activeKP.judul_kp || "Judul belum tersedia"} </p>
						)}
						<div className="mt-2 flex flex-col gap-2">
							{isEditing && (
								<>
									<Button disabled={mutation.isPending} type="submit">
										Kirim
									</Button>
									<Button
										disabled={mutation.isPending}
										type="reset"
										onClick={() => setIsEditing((prev) => !prev)}
									>
										Cancel
									</Button>
								</>
							)}
						</div>
					</form>
					{!isEditing && (
						<div className="mt-2 flex flex-col gap-2">
							<Button onClick={() => setIsEditing((prev) => !prev)}>
								Edit
							</Button>
							<Button
								disabled={mutation.isPending}
								type="button"
								onClick={setIsDetailModalOpen}
							>
								Tutup
							</Button>
						</div>
					)}
				</Card>
			</CardContent>
		</Card>
	);
}

interface PenolakanInstansiDialogInterface {
	status: string;
	catatan?: string;
	setIsPenolakanInstansiModalOpen: () => void;
}

function PenolakanInstansiDialog({
	status = "Tidak dikirim",
	catatan,
	setIsPenolakanInstansiModalOpen,
}: PenolakanInstansiDialogInterface) {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (data: any) => APIDaftarKP.unggahBerkasPendafataranKP(data),
		onSuccess: (data) => {
			toast.success(
				data.message || "Berhasil mengajukan surat penolakan instansi"
			);
			queryClient.invalidateQueries({
				queryKey: ["kp-terbaru-mahasiswa"],
				exact: true,
			});
			setIsPenolakanInstansiModalOpen();
		},
		onError: (data: ErrorInterface) => {
			toast(
				data?.response?.data?.message ||
					"Gagal mengajukan surat penolakan instansi"
			);
		},
	});

	async function handleOnSubmitPenolakanInstansi(
		e: FormEvent<HTMLFormElement>
	) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const data = Object.fromEntries(formData.entries());
		mutation.mutate(data);
	}
	return (
		<Card className="flex flex-col gap-4 absolute left-[50%] -translate-x-1/2 top-[50%] -translate-y-1/2 w-[50%] p-2">
			<CardHeader>
				<CardTitle className="text-center text-lg font-bold tracking-wide">
					Pengajuan Penolakan Instansi
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="rounded-md mb-2">Status : {status}</p>
				<p>catatan : {catatan}</p>
				<form onSubmit={handleOnSubmitPenolakanInstansi}>
					<Label htmlFor="link-surat-penolakan-instansi">
						Masukkan Link Surat Penolakan Instansi
					</Label>
					<Input id="link-surat-penolakan-instansi" name="data" required />
					<Input className="hidden" name="nomorBerkas" readOnly value={0} />
					<div className="mt-2 flex flex-col gap-2">
						<Button disabled={mutation.isPending} type="submit">
							Kirim
						</Button>
						<Button
							disabled={mutation.isPending}
							type="button"
							onClick={setIsPenolakanInstansiModalOpen}
						>
							Tutup
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}

function LogComponent({ data, setIdLog }: LogInterface) {
	// const [currentTab, setCurrentTab] = useState("All New");
	return (
		<Card className="flex flex-col gap-4 absolute left-[50%] -translate-x-1/2 top-[50%] -translate-y-1/2 min-w-[50%] h-[50%] p-2 overflow-y-scroll">
			<CardHeader>
				<CardTitle className="text-center text-lg font-bold tracking-wide">
					Logs Kerja praktik #1
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="w-[75%] m-auto flex rounded-lg bg-gray-300">					
					<Button
						className={`flex-grow text-black font-bold hover:text-white bg-gray-300 rounded-lg p-2`}
					>
						Pendaftaran Kp
					</Button>
				</div>
			</CardContent>
			{!data && (
				<Card className="text-center">
					Tidak ada log yang dapat ditampilkan
				</Card>
			)}
			{data &&
				data.map((item, i) => (
					<LogCard
						key={i}
						info={item.message}
						date={item.tanggal}
						status={item.status}
					/>
				))}

			<Button onClick={setIdLog}>Tutup</Button>
		</Card>
	);
}

interface LogCardInterface {
	info: string;
	date: string;
	status: number;
}

function LogCard({ info, date, status }: LogCardInterface) {
	let style = "bg-gray-400";
	if (status === 1) {
		style = "bg-green-400";
	} else if (status === 2) {
		style = "bg-red-400";
	}
	return (
		<Card className={`flex flex-col gap-2 rounded-lg p-2 ${style}`}>
			<p>{info}</p>
			<p>{new Date(date).toDateString()}</p>
		</Card>
	);
}