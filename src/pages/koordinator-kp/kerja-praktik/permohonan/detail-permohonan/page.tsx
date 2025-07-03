import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	User,
	Building,
	GraduationCap,
	ContactRound,
	Calendar,
	Building2,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import APIDaftarKP from "@/services/api/koordinator-kp/daftar-kp.service";
import { toast } from "sonner";
import {
	AccTolakBerkasMahasiswaInterface,
	PutMahasiswaParamsInterface,
} from "@/interfaces/service/api/daftar-kp/koordinator-kp-service.interface";

import { Calendar as Calendar1 } from "@/components/ui/calendar";
import { ErrorInterface } from "@/interfaces/pages/error.type";

const KoordinatorKerjaPraktikPermohonanDetailPage = () => {
	const [isRejectButtonClicked, setIsRejectButtonClicked] = useState<number>(0);
	const [rejectMessage, setRejectMessage] = useState<string>("");
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [
		is_status_link_surat_penolakan_instansi_ditolak,
		set_is_status_link_surat_penolakan_instansi_ditolak,
	] = useState<boolean>(false);
	const [
		is_status_link_surat_pengantar_ditolak,
		set_is_status_link_surat_pengantar_ditolak,
	] = useState<boolean>(false);
	const [
		is_status_link_surat_balasan_ditolak,
		set_is_status_link_surat_balasan_ditolak,
	] = useState<boolean>(false);
	const [
		is_status_id_surat_pengajuan_dospem_ditolak,
		set_is_status_id_surat_pengajuan_dospem_ditolak,
	] = useState<boolean>(false);
	const [
		is_status_link_surat_penunjukkan_dospem_ditolak,
		set_is_status_link_surat_penunjukkan_dospem_ditolak,
	] = useState<boolean>(false);
	const [
		is_status_link_surat_perpanjangan_kp_ditolak,
		set_is_status_link_surat_perpanjangan_kp_ditolak,
	] = useState<boolean>(false);
	const [nipDospem, setNipDospem] = useState<string | null>(null);
	const [dateEnd, setDateEnd] = useState<Date | null | undefined>(null);
	const { id = "" } = useParams();

	const queryClient = useQueryClient();

	const { data: dataInstansi } = useQuery({
		queryKey: ["halaman-detail-permohonan-data-instansi-mahasiswa"],
		queryFn: () => APIDaftarKP.getAllDataInstansi().then((res) => res.data),
	});

	const { data: biodataMahasiswa, isError } = useQuery({
		queryKey: ["halaman-detail-permohonan-data-detail-mahasiswa"],
		queryFn: () => APIDaftarKP.getDataKPMahasiswa(id).then((res) => res.data),
	});

	const accTolakMutation = useMutation({
		mutationFn: (data: AccTolakBerkasMahasiswaInterface) =>
			APIDaftarKP.accTolakBerkasMahasiswa(data).then((res) => res.data),
		onSuccess: () => {
			toast.success("Berhasil mengubah data mahasiswa");
			queryClient.invalidateQueries({
				queryKey: ["halaman-detail-permohonan-data-detail-mahasiswa"],
				exact: true,
			});
			setIsRejectButtonClicked(0);
		},
		onError: (data: ErrorInterface) => {
			toast.error(
				data?.response?.data?.message || "Gagal mengubah data mahasiswa"
			);
		},
	});

	const editMutation = useMutation({
		mutationFn: (data: PutMahasiswaParamsInterface) =>
			APIDaftarKP.editDataMahasiswa(data),
		onSuccess: () => {
			toast.success("Berhasil mengubah data mahasiswa");
			queryClient.invalidateQueries({
				queryKey: ["halaman-detail-permohonan-data-detail-mahasiswa"],
				exact: true,
			});
			setIsEditing(false);
			setIsRejectButtonClicked(0);
			set_is_status_link_surat_penolakan_instansi_ditolak(false);
			set_is_status_link_surat_pengantar_ditolak(false);
			set_is_status_link_surat_balasan_ditolak(false);
			set_is_status_id_surat_pengajuan_dospem_ditolak(false);
			set_is_status_link_surat_penunjukkan_dospem_ditolak(false);
			set_is_status_link_surat_perpanjangan_kp_ditolak(false);
		},
		onError: (data: ErrorInterface) => {
			toast.error(
				data?.response?.data?.message || "Gagal mengubah data mahasiswa"
			);
		},
	});

	function handleOnAccept(i: number) {
		if (i === 6) {
			accTolakMutation.mutate({
				id,
				nomorBerkas: 0,
				status: "Divalidasi",
			});
		} else if (i === 1) {
			accTolakMutation.mutate({
				id,
				nomorBerkas: i,
				status: "Divalidasi",
			});
		} else if (i === 2) {
			accTolakMutation.mutate({
				id,
				nomorBerkas: i,
				status: "Divalidasi",
				nipDospem,
			});
		} else if (i === 3) {
			accTolakMutation.mutate({
				id,
				nomorBerkas: i,
				status: "Divalidasi",
			});
		} else if (i === 4) {
			accTolakMutation.mutate({
				id,
				nomorBerkas: i,
				status: "Divalidasi",
			});
		} else if (i === 5) {
			accTolakMutation.mutate({
				id,
				nomorBerkas: i,
				status: "Divalidasi",
			});
		}
	}

	function handleOnReject(i: number) {
		if (i === 6) {
			accTolakMutation.mutate({
				id,
				nomorBerkas: 0,
				catatan: rejectMessage,
				status: "Ditolak",
			});
		} else if (i === 1) {
			accTolakMutation.mutate({
				id,
				nomorBerkas: i,
				catatan: rejectMessage,
				status: "Ditolak",
			});
		} else if (i === 2) {
			accTolakMutation.mutate({
				id,
				nomorBerkas: i,
				catatan: rejectMessage,
				status: "Ditolak",
			});
		} else if (i === 3) {
			accTolakMutation.mutate({
				id,
				nomorBerkas: i,
				catatan: rejectMessage,
				status: "Ditolak",
			});
		} else if (i === 4) {
			accTolakMutation.mutate({
				id,
				nomorBerkas: i,
				catatan: rejectMessage,
				status: "Ditolak",
			});
		} else if (i === 5) {
			accTolakMutation.mutate({
				id,
				nomorBerkas: i,
				catatan: rejectMessage,
				status: "Ditolak",
			});
		}
	}

	console.log(nipDospem);

	function handleOnSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const data = Object.fromEntries(
			formData.entries()
		) as unknown as PutMahasiswaParamsInterface;
		data.level_akses =
			(data.level_akses as unknown as string) === "-10"
				? null
				: parseInt(data.level_akses as unknown as string);
		data.status = data.status === "Pilih Status" ? null : data.status;
		data.status_link_surat_penolakan_instansi =
			data.status_link_surat_penolakan_instansi === "Pilih Status"
				? null
				: data.status_link_surat_penolakan_instansi;
		data.status_link_surat_pengantar =
			data.status_link_surat_pengantar === "Pilih Status"
				? null
				: data.status_link_surat_pengantar;
		data.status_link_surat_balasan =
			data.status_link_surat_balasan === "Pilih Status"
				? null
				: data.status_link_surat_balasan;
		data.status_id_surat_pengajuan_dospem =
			data.status_id_surat_pengajuan_dospem === "Pilih Status"
				? null
				: data.status_id_surat_pengajuan_dospem;
		data.status_link_surat_penunjukkan_dospem =
			data.status_link_surat_penunjukkan_dospem === "Pilih Status"
				? null
				: data.status_link_surat_penunjukkan_dospem;
		data.status_link_surat_perpanjangan_kp =
			data.status_link_surat_perpanjangan_kp === "Pilih Status"
				? null
				: data.status_link_surat_perpanjangan_kp;
		editMutation.mutate({
			...data,
			id,
		});
	}

	function handleOnBatal() {
		setIsEditing(false);
		set_is_status_link_surat_penolakan_instansi_ditolak(false);
		set_is_status_link_surat_pengantar_ditolak(false);
		set_is_status_link_surat_balasan_ditolak(false);
		set_is_status_id_surat_pengajuan_dospem_ditolak(false);
		set_is_status_link_surat_penunjukkan_dospem_ditolak(false);
		set_is_status_link_surat_perpanjangan_kp_ditolak(false);
	}

	if (!biodataMahasiswa && isError) {
		return (
			<Card className="p-2 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
				Data Tidak Ditemukan
			</Card>
		);
	}

	if (!biodataMahasiswa) {
		return (
			<Card className="p-2 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
				Loading...
			</Card>
		);
	}

	const renderStatusContent = (
		<>
			{/* Riwayat Permohonan Kerja Praktik Section */}
			<Card className="mt-6 rounded-lg  border border-gray-100 dark:border-gray-700 shadow-md overflow-hidden">
				<div className="p-6">
					<CardHeader>
						<CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
							Riwayat Permohonan Kerja Praktik
						</CardTitle>
					</CardHeader>

					{/* Periode Kerja Praktik */}
					<Card className="mb-6 bg-white dark:border-gray-700 dark:bg-gray-800/50 rounded-lg p-5 border border-gray-100 shadow-sm">
						<CardHeader>
							<CardTitle className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
								<Calendar className="h-5 w-5 mr-2" />
								Periode Kerja Praktik
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="mb-4 flex">
								<Label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
									Tanggal Mulai
								</Label>
							</div>
							<p>{new Date(biodataMahasiswa.tanggal_mulai).toDateString()}</p>
						</CardContent>
						<CardContent>
							<div className="mb-4 flex">
								<Label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
									Tanggal Selesai
								</Label>
							</div>
							{isEditing ? (
								<Calendar1
									onDayClick={(e) => setDateEnd(e)}
									selected={dateEnd || new Date()}
								/>
							) : (
								<p>
									{(biodataMahasiswa.tanggal_selesai &&
										new Date(
											biodataMahasiswa.tanggal_selesai
										).toDateString()) ||
										"Tanggal Selesai Belum Tersedia"}
								</p>
							)}
						</CardContent>
					</Card>

					{/* Instansi/Perusahaan */}
					<Card className="mb-6 bg-white dark:border-gray-700 dark:bg-gray-800/50 rounded-lg p-5 border shadow-sm">
						<CardHeader>
							<CardTitle className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
								<Building2 className="h-5 w-5 mr-2" />
								Instansi/Perusahaan
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="mb-4">
								<Label
									htmlFor="nama-instansi"
									className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
								>
									Nama Instansi / Perusahaan
								</Label>
								{isEditing ? (
									<select
										className="bg-white dark:bg-gray-800/50 dark:border-gray-700 block w-[100%] p-2 border rounded-lg"
										name="id_instansi"
										id="instansi"
										defaultValue={biodataMahasiswa?.instansi?.id}
									>
										<option value="">Pilih Instansi</option>
										{dataInstansi?.map(({ id, nama }: any) => (
											<option key={id} value={id}>
												{nama}
											</option>
										))}
									</select>
								) : (
									<div className="mt-2 py-1 px-2 border border-gray-300 rounded-lg dark:bg-gray-800/50 dark:border-gray-700  flex items-center justify-between">
										<p>
											{biodataMahasiswa.instansi?.nama ||
												"Instansi Belum Tersedia"}
										</p>
										<Button
											variant="secondary"
											size="sm"
											className="bg-white text-black dark:bg-gray-800/50 dark:text-white"
											onClick={() =>
												copyTextFn(biodataMahasiswa.instansi?.nama)
											}
										>
											Copy 📝
										</Button>
									</div>
								)}
							</div>

							<div>
								<Label
									htmlFor="tujuan-surat-instansi"
									className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
								>
									Tujuan Surat Instansi/ Perusahaan
								</Label>
								{isEditing ? (
									<Textarea
										id="tujuan-surat-instansi"
										key="tujuan_surat_instansi"
										className="bg-white border border-gray-200 text-gray-700 text-sm rounded-md block w-full p-2.5 
                      dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:placeholder-gray-400 
                      focus:ring-primary focus:border-primary focus:outline-none min-h-24 resize-none"
										placeholder="Masukkan tujuan surat"
										name="tujuan_surat_instansi"
									></Textarea>
								) : (
									<div className="mt-2 py-1 px-2 border border-gray-300 dark:bg-gray-800/50 dark:border-gray-700 rounded-lg  flex items-center justify-between">
										<p>
											{biodataMahasiswa.tujuan_surat_instansi ||
												"Data belum tersedia"}
										</p>
										<Button
											variant="secondary"
											size="sm"
											className="bg-white text-black dark:bg-gray-800/50 dark:text-white"
											onClick={() =>
												copyTextFn(biodataMahasiswa.tujuan_surat_instansi)
											}
										>
											Copy 📝
										</Button>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					<Card className="p-4 mb-6 dark:border-gray-700 dark:bg-gray-800/50">
						<CardHeader>
							<CardTitle className="text-gray-600">
								📓 Judul dan Kelas Kerja praktik
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className={`mb-3 p-2 rounded-lg flex flex-col`}>
								<Label htmlFor="judul_kp">Judul Laporan Kerja praktik : </Label>
								{isEditing ? (
									<Input
										className="mt-2 p-2 border border-gray-300 dark:bg-gray-800/50 dark:border-gray-700 rounded-lg bg-white"
										type="text"
										id="judul-kp"
										name="judul_kp"
										defaultValue={biodataMahasiswa.judul_kp}
									/>
								) : (
									<div className="mt-2 py-1 px-2 border border-gray-300 rounded-lg  flex items-center justify-between">
										<p>{biodataMahasiswa.judul_kp}</p>
										<Button
											variant="secondary"
											size="sm"
											className="bg-white text-black dark:bg-gray-800/50 dark:text-white"
											onClick={() => copyTextFn(biodataMahasiswa.judul_kp)}
										>
											Copy 📝
										</Button>
									</div>
								)}
							</div>
							<div className={`mb-3 p-2 rounded-lg flex flex-col`}>
								<Label htmlFor="surat-pengantar">Kelas Kerja praktik : </Label>
								{isEditing ? (
									<Input
										className="mt-2 p-2 border dark:bg-gray-800/50 dark:border-gray-700 border-gray-300 rounded-lg bg-white"
										type="text"
										id="kelas-kp"
										name="kelas_kp"
										defaultValue={biodataMahasiswa.kelas_kp}
									/>
								) : (
									<div className="mt-2 py-1 px-2 border border-gray-300 rounded-lg  flex items-center justify-between">
										<p>{biodataMahasiswa.kelas_kp}</p>
										<Button
											variant="secondary"
											size="sm"
											className="bg-white text-black dark:bg-gray-800/50 dark:text-white"
											onClick={() => copyTextFn(biodataMahasiswa.kelas_kp)}
										>
											Copy 📝
										</Button>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					<Card className="rounded-lg border border-gray-100 shadow-sm p-4 mb-6 dark:bg-gray-800/50">
						<CardHeader>
							<CardTitle className="font-bold tracking-wide text-md text-gray-600">
								📝 Berkas Mahasiswa
							</CardTitle>
						</CardHeader>
						<CardContent>
							<InputField
								statusBerkas={
									biodataMahasiswa.dokumen_pendaftaran_kp[0]?.status
								}
								handleOnReject={() => setIsRejectButtonClicked(6)}
								key="surat-penolakan-instansi"
								labelName="Surat Penolakan Instansi"
								document={biodataMahasiswa.dokumen_pendaftaran_kp[0]?.data}
								isEditing={isEditing}
								handleOnAccept={() => handleOnAccept(6)}
								isBerkasSended={
									biodataMahasiswa.dokumen_pendaftaran_kp[0]?.status ===
									"Terkirim"
								}
								idCatatanStatus="catatan-link-surat-penolakan-instansi"
								nameCatatanStatus="catatan_link_surat_penolakan_instansi"
								idInput="link-surat-penolakan-instansi"
								nameInput="link_surat_penolakan_instansi"
								idStatus="status-link-surat-penolakan-instansi"
								nameStatus="status_link_surat_penolakan_instansi"
								status={is_status_link_surat_penolakan_instansi_ditolak}
								setStatus={set_is_status_link_surat_penolakan_instansi_ditolak}
								setNipDospem={setNipDospem}
							/>
							<InputField
								statusBerkas={
									biodataMahasiswa.dokumen_pendaftaran_kp[1]?.status
								}
								handleOnReject={() => setIsRejectButtonClicked(1)}
								key="surat-pengantar"
								labelName="Surat Pengantar"
								document={biodataMahasiswa.dokumen_pendaftaran_kp[1]?.data}
								isEditing={isEditing}
								handleOnAccept={() => handleOnAccept(1)}
								isBerkasSended={
									biodataMahasiswa.dokumen_pendaftaran_kp[1]?.status ===
									"Terkirim"
								}
								idCatatanStatus="catatan-link-surat-pengantar"
								nameCatatanStatus="catatan_link_surat_pengantar"
								idInput="link-surat-pengantar"
								nameInput="link_surat_pengantar"
								idStatus="status-link-surat-pengantar"
								nameStatus="status_link_surat_pengantar"
								status={is_status_link_surat_pengantar_ditolak}
								setStatus={set_is_status_link_surat_pengantar_ditolak}
								setNipDospem={setNipDospem}
							/>

							<InputField
								statusBerkas={
									biodataMahasiswa.dokumen_pendaftaran_kp[2]?.status
								}
								handleOnReject={() => setIsRejectButtonClicked(2)}
								key="surat-balasan"
								labelName="Surat Balasan"
								document={biodataMahasiswa.dokumen_pendaftaran_kp[2]?.data}
								isEditing={isEditing}
								handleOnAccept={() => handleOnAccept(2)}
								isBerkasSended={
									biodataMahasiswa.dokumen_pendaftaran_kp[2]?.status ===
									"Terkirim"
								}
								idCatatanStatus="catatan-link-surat-balasan"
								nameCatatanStatus="catatan_link_surat_balasan"
								idInput="link-surat-balasan"
								nameInput="link_surat_balasan"
								idStatus="status-link-surat-balasan"
								nameStatus="status_link_surat_balasan"
								status={is_status_link_surat_balasan_ditolak}
								setStatus={set_is_status_link_surat_balasan_ditolak}
								setNipDospem={setNipDospem}
							/>
							<InputField
								statusBerkas={
									biodataMahasiswa.dokumen_pendaftaran_kp[3]?.status
								}
								handleOnReject={() => setIsRejectButtonClicked(3)}
								key="id-pengajuan-dospem"
								labelName="ID Pengajuan Dosen Pembimbing"
								document={biodataMahasiswa.dokumen_pendaftaran_kp[3]?.data}
								isEditing={isEditing}
								handleOnAccept={() => handleOnAccept(3)}
								isBerkasSended={
									biodataMahasiswa.dokumen_pendaftaran_kp[3]?.status ===
									"Terkirim"
								}
								idCatatanStatus="catatan-id-surat-pengajuan-dospem"
								nameCatatanStatus="catatan_id_surat_pengajuan_dospem"
								idInput="id-surat-pengajuan-dospem"
								nameInput="id_surat_pengajuan_dospem"
								idStatus="status-id-surat-pengajuan-dospem"
								nameStatus="status_id_surat_pengajuan_dospem"
								status={is_status_id_surat_pengajuan_dospem_ditolak}
								setStatus={set_is_status_id_surat_pengajuan_dospem_ditolak}
								setNipDospem={setNipDospem}
							/>
							<InputField
								statusBerkas={
									biodataMahasiswa.dokumen_pendaftaran_kp[4]?.status
								}
								setNipDospem={setNipDospem}
								handleOnReject={() => setIsRejectButtonClicked(4)}
								key="surat-penunjukkan-dospem"
								labelName="Surat Penunjukkan Dosen Pembimbing"
								document={biodataMahasiswa.dokumen_pendaftaran_kp[4]?.data}
								isEditing={isEditing}
								handleOnAccept={() => handleOnAccept(4)}
								isBerkasSended={
									biodataMahasiswa.dokumen_pendaftaran_kp[4]?.status ===
									"Terkirim"
								}
								idCatatanStatus="catatan-link-surat-penunjukkan-dospem"
								nameCatatanStatus="catatan_link_surat_penunjukkan_dospem"
								idInput="link-surat-penunjukkan-dospem"
								nameInput="link_surat_penunjukkan_dospem"
								idStatus="status-link-surat-penunjukkan-dospem"
								nameStatus="status_link_surat_penunjukkan_dospem"
								status={is_status_link_surat_penunjukkan_dospem_ditolak}
								setStatus={set_is_status_link_surat_penunjukkan_dospem_ditolak}
							/>
							<div
								className={`mb-3 rounded-lg flex flex-col ${
									biodataMahasiswa?.dokumen_pendaftaran_kp[5]?.status ===
									"Terkirim"
										? "bg-yellow-500"
										: ""
								}`}
							>
								<InputField
									statusBerkas={
										biodataMahasiswa.dokumen_pendaftaran_kp[5]?.status
									}
									handleOnReject={() => setIsRejectButtonClicked(5)}
									key="surat-perpanjangan-kp"
									labelName="Surat Perpanjangan Kerja praktik"
									document={biodataMahasiswa.dokumen_pendaftaran_kp[5]?.data}
									isEditing={isEditing}
									handleOnAccept={() => handleOnAccept(5)}
									isBerkasSended={
										biodataMahasiswa.dokumen_pendaftaran_kp[5]?.status ===
										"Terkirim"
									}
									idCatatanStatus="catatan-link-surat-perpanjangan-kp"
									nameCatatanStatus="catatan_link_surat_perpanjangan_kp"
									idInput="link-surat-perpanjangan-kp"
									nameInput="link_surat_perpanjangan_kp"
									idStatus="status-link-surat-perpanjangan-kp"
									nameStatus="status_link_surat_perpanjangan_kp"
									status={is_status_link_surat_perpanjangan_kp_ditolak}
									setStatus={set_is_status_link_surat_perpanjangan_kp_ditolak}
									alasan_lanjut_kp={biodataMahasiswa.alasan_lanjut_kp}
									setNipDospem={setNipDospem}
								/>
							</div>
						</CardContent>
					</Card>

					<Card className="p-4 mb-6 dark:border-gray-700 dark:bg-gray-800/50">
						<CardHeader>
							<CardTitle className="text-gray-600">
								📓 Status Pendaftaran Kerja praktik & Level Akses
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className={`mb-3 p-2 rounded-lg flex flex-col`}>
								<Label htmlFor="status-pendaftaran-kerja-praktik">
									Status Pendaftaran Kerja praktik
								</Label>
								{isEditing ? (
									<select
										name="status"
										id="status-pendaftaran-kerja-praktik"
										className="p-2 rounded-lg dark:bg-gray-800/50 dark:border-gray-700 border-[1px] mt-1 mb-2"
									>
										<option value={undefined}>Pilih Status</option>
										<option value="Lanjut">Lanjut</option>
										<option value="Baru">Baru</option>
										<option value="Gagal">Gagal</option>
									</select>
								) : (
									<div className="mt-2 py-1 px-2 border border-gray-300 rounded-lg  flex items-center justify-between">
										<p>{biodataMahasiswa?.status}</p>
									</div>
								)}
							</div>
							<div className={`mb-3 p-2 rounded-lg flex flex-col`}>
								<Label htmlFor="level-akses">
									Level Akses Pendaftaran Kerja praktik :{" "}
								</Label>
								{isEditing ? (
									<select
										name="level_akses"
										id="level-akses"
										className="p-2 rounded-lg dark:bg-gray-800/50 dark:border-gray-700 border-[1px] mt-1 mb-2"
									>
										<option value={-10}>Tidak berubah</option>
										<option value={0}>Reset Instansi</option>
										<option value={1}>1 - Akses Unggah Surat Pengantar </option>
										<option value={3}>2 - Akses Unggah Surat Balasan</option>
										<option value={5}>
											3 - Akses Unggah ID Pengajuan Dosen Pembimbing
										</option>
										<option value={7}>
											4 - Akses Unggah Surat Penunjukkan Dosen Pembimbing
										</option>
										<option value={9}>
											5 - Akses Daily Report & Unggah Surat Perpanjangan Kerja
											praktik
										</option>
									</select>
								) : (
									<div className="mt-2 py-1 px-2 border border-gray-300 rounded-lg  flex items-center justify-between">
										<p>{biodataMahasiswa.level_akses}</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
					{/* Action Buttons */}

					{isEditing && (
						<div className="flex justify-end gap-3 mt-6">
							<Button
								type="reset"
								onClick={handleOnBatal}
								disabled={editMutation.isPending}
								className={
									"px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
								}
							>
								Batal
							</Button>
							<Button
								disabled={editMutation.isPending}
								className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
							>
								Perbarui
							</Button>
						</div>
					)}
					{!isEditing && (
						<div className="flex justify-end">
							<Button onClick={() => setIsEditing(true)}>Edit</Button>
						</div>
					)}
				</div>
			</Card>
		</>
	);
	return (
		<>
			<DashboardLayout>
				<div
					className={`${isRejectButtonClicked ? "z-[49]" : ""}`}
					onClick={() =>
						isRejectButtonClicked ? setIsRejectButtonClicked(0) : ""
					}
				>
					{isRejectButtonClicked !== 0 && (
						<Card
							onClick={(e) => e.stopPropagation()}
							className="fixed justify-around h-[30%] gap-2 z-50 p-2 border-[1px] darkborder-gray-700 dark:bg-gray-800 rounded-lg left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]"
						>
							<CardHeader>
								<CardTitle className="font-bold tracking-wide text-lg">
									Penolakan Berkas Mahasiswa
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex flex-col gap-4 justify-start">
									<Label htmlFor="alasan-penolakan">
										Alasan Penolakan Berkas :{" "}
									</Label>
									<Input
										value={rejectMessage}
										onChange={(e) => setRejectMessage(e.currentTarget.value)}
										type="text"
										id="alasan-penolakan"
										className="rounded-lg border-[1px] border-slate-300 p-2"
									/>
									<div className="flex gap-2">
										<Button
											type="button"
											onClick={() => setIsRejectButtonClicked(0)}
										>
											Cancel
										</Button>
										<Button
											type="button"
											variant="destructive"
											onClick={() => handleOnReject(isRejectButtonClicked)}
										>
											Reject
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					)}
					{/* Biodata Section */}
					<Card className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800/40 dark:to-gray-800/20 rounded-lg border border-gray-100 dark:border-gray-700 shadow-md overflow-hidden">
						{/* Header Section with Avatar */}
						<div className="bg-emerald-500  p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="bg-white dark:bg-gray-800 rounded-full h-12 w-12 flex items-center justify-center shadow-inner border border-primary/20">
									<User className="h-7 w-7 text-primary" />
								</div>
								<div>
									<CardTitle className="text-lg font-bold text-gray-50 dark:text-gray-100">
										{biodataMahasiswa?.mahasiswa?.nama || "Loading..."}
									</CardTitle>
									<div className="flex items-center  text-sm text-gray-500 dark:text-gray-400">
										<span className="flex items-center text-white">
											<CardTitle>{biodataMahasiswa?.status}</CardTitle>
										</span>
									</div>
								</div>
							</div>
							<div className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
								<CardTitle className="text-xs font-medium text-gray-600 dark:text-gray-300">
									{biodataMahasiswa?.mahasiswa?.nama || "Loading..."}
								</CardTitle>
							</div>
						</div>

						{/* Info Cards */}
						<Card>
							<div className="p-4 bg-emerald-100">
								<div className=" grid grid-cols-1 md:grid-cols-3 gap-3">
									{/* NIM Card */}
									<Card className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
										<div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-bl-full -translate-y-6 translate-x-6 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-300"></div>
										<div className="flex items-center gap-3 relative z-10">
											<div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2.5">
												<Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
											</div>
											<div>
												<CardTitle className="text-xs font-medium text-gray-800 dark:text-gray-400 uppercase tracking-wider">
													Instansi
												</CardTitle>
												<CardDescription className="text-base  text-gray-500 dark:text-gray-200">
													{biodataMahasiswa?.instansi?.nama ||
														"Belum Ada Instansi"}
												</CardDescription>
											</div>
										</div>
									</Card>

									{/* Instansi Card */}
									<Card className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
										<div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 dark:bg-emerald-900/20 rounded-bl-full -translate-y-6 translate-x-6 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-300"></div>

										<div className="flex items-center gap-3 relative z-10">
											<div className="bg-blue-100 dark:bg-emerald-900/30 rounded-lg p-2.5">
												<ContactRound className="h-5 w-5 text-blue-600 dark:text-blue-400" />
											</div>
											<div>
												<CardTitle className="text-xs font-medium text-gray-800 dark:text-gray-400 uppercase tracking-wider">
													Pembimbing Instansi
												</CardTitle>
												<CardDescription className="text-base font-bold text-gray-800 dark:text-gray-200">
													{biodataMahasiswa?.instansi?.pembimbing_instansi[0]
														?.nama || "Belum Ada Pembimbing Instansi"}
												</CardDescription>
											</div>
										</div>
									</Card>

									{/* Dosen Card */}
									<Card className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
										<div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 dark:bg-purple-900/20 rounded-bl-full -translate-y-6 translate-x-6 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-300"></div>

										<div className="flex items-center gap-3 relative z-10">
											<div className="bg-blue-100 dark:bg-purple-900/30 rounded-lg p-2.5">
												<GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
											</div>
											<div>
												<CardTitle className="text-xs font-medium text-gray-800 dark:text-gray-400 uppercase tracking-wider">
													Dosen Pembimbing
												</CardTitle>
												<CardDescription className="text-base font-bold text-gray-800 dark:text-gray-200">
													{biodataMahasiswa?.dosen_pembimbing?.nama ||
														"Belum Ada Dosen Pembimbing"}
												</CardDescription>
											</div>
										</div>
									</Card>
								</div>
							</div>
						</Card>
					</Card>
					<form onSubmit={handleOnSubmit}>{renderStatusContent}</form>
				</div>
			</DashboardLayout>
		</>
	);
};

export default KoordinatorKerjaPraktikPermohonanDetailPage;

function copyTextFn(data: string = "") {
	navigator.clipboard.writeText(data);

	toast.success("Text Copied Successfully");
}

interface InputFieldInterface {
	isEditing: boolean;
	handleOnAccept: () => void;
	handleOnReject: () => void;
	document: string;
	status: boolean;
	setStatus: React.Dispatch<React.SetStateAction<boolean>>;
	setNipDospem: React.Dispatch<React.SetStateAction<string | null>>;
	nameStatus: string;
	idStatus: string;
	nameCatatanStatus: string;
	idCatatanStatus: string;
	nameInput: string;
	idInput: string;
	isBerkasSended: boolean;
	labelName: string;
	alasan_lanjut_kp?: string;
	statusBerkas?: string;
}

function InputField({
	isEditing,
	handleOnAccept,
	handleOnReject,
	document,
	status,
	statusBerkas,
	setStatus,
	nameStatus,
	idStatus,
	nameCatatanStatus,
	idCatatanStatus,
	nameInput,
	idInput,
	isBerkasSended,
	labelName,
	alasan_lanjut_kp,
	setNipDospem,
}: InputFieldInterface) {
	const { data: dataDosen } = useQuery({
		queryKey: ["halaman-kelengkapan-berkas-data-dosen"],
		queryFn: () => APIDaftarKP.getDataDosen().then((res) => res.data),
	});
	return (
		<div
			className={`mb-3 p-2 rounded-lg flex flex-col ${
				isBerkasSended ? "bg-yellow-500" : ""
			}`}
		>
			<Label htmlFor={idInput}>{labelName} : </Label>
			{isEditing ? (
				<>
					<Input
						className="mt-2 p-2 border border-gray-300 rounded-lg "
						type="text"
						id={idInput}
						name={nameInput}
						defaultValue={document}
					/>
					{labelName === "Surat Balasan" && (
						<>
							<Label
								className="font-bold text-sm mt-1"
								htmlFor="dosen-pembimbing"
							>
								Dosen Pembimbing Kerja Praktik :{" "}
							</Label>
							<select
								onChange={(e) => setNipDospem(e.currentTarget.value)}
								className="dark:bg-black dark:border-white dark:border-[1px] rounded-lg block w-[100%] p-2"
								name="nip_pembimbing"
								id="dosen-pembimbing"
							>
								<option selected value="">Pilih Dosen Pembimbing</option>
								{dataDosen &&
									dataDosen.map((item: any) => (
										<option value={item.nip}>
											{item.nip} - {item.nama}
										</option>
									))}
							</select>
						</>
					)}
					{alasan_lanjut_kp && (
						<>
							<Label htmlFor="alasan-lanjut-kp" className="mt-2">
								Alasan Lanjut Kerja praktik :
							</Label>
							<Textarea
								placeholder="Masukkan alasan lanjut kerja praktik..."
								className="mt-2 p-2 border border-gray-300 rounded-lg "
								id="alasan-lanjut-kp"
								name="alasan_lanjut_kp"
							/>
						</>
					)}
					<Label htmlFor={idStatus} className="text-sm my-1">
						Status :{" "}
					</Label>
					<select
						onClick={(e) => {
							if (e.currentTarget.value === "Ditolak") {
								setStatus(true);
							} else {
								setStatus(false);
							}
						}}
						name={nameStatus}
						id={idStatus}
						className="p-2 rounded-lg dark:bg-gray-800/50 dark:border-gray-700 border-[1px] mt-1 mb-2"
					>
						<option value={undefined}>Pilih Status</option>
						<option value="Divalidasi">Divalidasi</option>
						<option value="Ditolak">Ditolak</option>
					</select>
					{status && (
						<>
							<Label htmlFor={idCatatanStatus} className="text-sm my-1">
								Catatan Penolakan :{" "}
							</Label>
							<Textarea
								className="p-2 border border-gray-300 rounded-lg dark:bg-gray-800/50"
								id={idCatatanStatus}
								name={nameCatatanStatus}
								placeholder={`Alasan Penolakan ${labelName} ... (Optional)`}
							></Textarea>
						</>
					)}
				</>
			) : (
				<>
					<div className="mt-2 py-1 px-2 border border-gray-300 rounded-lg dark:bg-gray-800/50 flex items-center justify-between">
						<p>{document}</p>
						<Button
							variant="secondary"
							size="sm"
							type="button"
							className="bg-white text-black dark:bg-gray-800/50 dark:text-white"
							onClick={() => copyTextFn(document)}
						>
							Copy 📝
						</Button>
					</div>
					{labelName === "Surat Balasan" && isBerkasSended && (
						<>
							<Label
								className="font-bold text-sm mt-1"
								htmlFor="dosen-pembimbing"
							>
								Dosen Pembimbing Kerja Praktik :{" "}
							</Label>
							<select
								required
								onChange={(e) => setNipDospem(e.currentTarget.value)}
								className="dark:bg-black dark:border-white dark:border-[1px] rounded-lg block w-[100%] p-2"
								name="nipDospem"
								id="dosen-pembimbing"
							>
								<option selected value="">Pilih Dosen Pembimbing</option>
								{dataDosen &&
									dataDosen.map((item: any) => (
										<option value={item.nip}>
											{item.nip} - {item.nama}
										</option>
									))}
							</select>
						</>
					)}
					<span
						className={`my-1 p-1 rounded-lg ${
							statusBerkas === "Divalidasi"
								? "bg-green-300 text-green-600"
								: statusBerkas === "Ditolak"
								? "bg-red-300 text-red-600"
								: ""
						}`}
					>
						{statusBerkas || "Belum Dikirim"}
					</span>
					{alasan_lanjut_kp && (
						<>
							<Label htmlFor="alasan-lanjut-kp" className="mt-3">
								Alasan Lanjut Kerja praktik :
							</Label>
							<div className="mt-2 py-1 px-2 border border-gray-300 rounded-lg dark:bg-gray-800/50 flex items-center justify-between">
								<p>{alasan_lanjut_kp}</p>
								<Button
									variant="secondary"
									size="sm"
									type="button"
									className="bg-white text-black dark:bg-gray-800/50 dark:text-white"
									onClick={() => copyTextFn(alasan_lanjut_kp)}
								>
									Copy 📝
								</Button>
							</div>
						</>
					)}
				</>
			)}
			{!isEditing && isBerkasSended && (
				<div className="flex gap-2 p-2">
					<Button
						type="button"
						variant="destructive"
						size="sm"
						onClick={() => handleOnReject()}
					>
						Reject
					</Button>
					<Button
						type="button"
						variant="secondary"
						size="sm"
						onClick={() => handleOnAccept()}
					>
						Accept
					</Button>
				</div>
			)}
		</div>
	);
}
