import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
	Circle,
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	useMapEvents,
} from "react-leaflet";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation } from "@tanstack/react-query";
import APIDaftarKP from "@/services/api/koordinator-kp/daftar-kp.service";
import { toast } from "sonner";
import {
	ACCTolakInstansiPropsInterface,
	DataInstansiInterface,
} from "@/interfaces/service/api/daftar-kp/koordinator-kp-service.interface";
import { useQueryClient } from "@tanstack/react-query";
import { ErrorInterface } from "@/interfaces/pages/error.type";

function KoordinatorKerjaPraktikDetailInstansiPage() {
	const [isDeleteButtonClicked, setIsDeleteButtonClicked] =
		useState<boolean>(false);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [namaInput, setNamaInput] = useState<string>("");
	const [jenisInput, setJenisInput] = useState<string>("");
	const [statusInput, setStatusInput] = useState<string>("");
	const [nama_pjInput, setNama_PjInput] = useState<string>("");
	const [no_hp_pjInput, setNo_Hp_PjInput] = useState<string>("");
	const [profil_singkatInput, setProfil_SingkatInput] = useState<string>("");
	const [alamatInput, setAlamatInput] = useState<string>("");
	const [latitudeInput, setLatitudeInput] = useState<number>(0);
	const [longitudeInput, setLongitudeInput] = useState<number>(0);

	const [radiusInput, setRadiusInput] = useState<number>(500);
	const { id = "" } = useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { data, isLoading } = useQuery({
		queryKey: ["detail-instansi-koordinator-kp"],
		queryFn: () =>
			APIDaftarKP.getDetailDataInstansi(id).then((res) => {
				setNamaInput(res.data.nama);
				setJenisInput(res.data.jenis);
				if (res.data.status === "Pending") {
					setStatusInput("Aktif");
				} else {
					setStatusInput(res.data.status);
				}
				setNama_PjInput(res.data.nama_pj);
				setNo_Hp_PjInput(res.data.no_hp_pj);
				setProfil_SingkatInput(res.data.profil_singkat);
				setAlamatInput(res.data.alamat);
				setLatitudeInput(res.data.latitude);
				setLongitudeInput(res.data.longitude);
				if (res.data.status === "Pending") {
					setIsEditing(true);
				}
				return res;
			}),
	});

	const deleteMutation = useMutation({
		mutationFn: () => APIDaftarKP.deleteDataInstansi(id),
		onSuccess: (data) => {
			toast.success(data.message || "Berhasil menghapus data instansi");
			setIsDeleteButtonClicked(false);
			const pointer = setTimeout(function () {
				queryClient.invalidateQueries({
					queryKey: ["data-instansi"],
					exact: true,
				});
				navigate("/koordinator-kp/kerja-praktik/instansi");
				clearTimeout(pointer);
			}, 3000);
		},
		onError: (data: ErrorInterface) => {
			toast.error(
				data?.response?.data?.message || "Gagal menghapus data instansi"
			);
		},
	});

	const accMutation = useMutation({
		mutationFn: (data: ACCTolakInstansiPropsInterface) =>
			APIDaftarKP.accTolakInstansi(data).then((res) => res.data),
		onSuccess: (data) => {
			toast.success(data.message || "Berhasil mengubah data instansi");
			queryClient.invalidateQueries({
				queryKey: ["detail-instansi-koordinator-kp"],
				exact: true,
			});
			setIsEditing(false);
		},
		onError: (data: ErrorInterface) => {
			toast.error(
				data?.response?.data?.message || "Gagal mengubah data instansi"
			);
		},
	});

	const editMutation = useMutation({
		mutationFn: (data: DataInstansiInterface) =>
			APIDaftarKP.editDataInstansi(data),
		onSuccess: (data) => {
			toast.success(data.message || "Berhasil mengubah data instansi");
			queryClient.invalidateQueries({
				queryKey: ["detail-instansi-koordinator-kp"],
				exact: true,
			});
			setIsEditing((prev) => !prev);
		},
		onError: (data: ErrorInterface) => {
			toast.error(
				data?.response?.data?.message || "Gagal mengubah data instansi"
			);
			setIsEditing((prev) => !prev);
		},
	});

	async function handleOnRejectOrDelete() {
		deleteMutation.mutate();
	}

	async function handleOnACC() {
		accMutation.mutate({
			id,
			status: "Aktif",
		});
	}

	async function handleOnEdit() {
		if (
			statusInput !== "Aktif" &&
			statusInput !== "Pending" &&
			statusInput !== "Tidak_Aktif"
		) {
			console.error("Status instansi tidak valid");
			return;
		} else if (
			jenisInput !== "Pemerintahan" &&
			jenisInput !== "Swasta" &&
			jenisInput !== "Pendidikan" &&
			jenisInput !== "UMKM"
		) {
			console.error("Jenis instansi tidak valid");
			return;
		}
		editMutation.mutate({
			id: id,
			status: statusInput,
			profil_singkat: profil_singkatInput,
			nama: namaInput,
			jenis: jenisInput,
			nama_pj: nama_pjInput,
			no_hp_pj: no_hp_pjInput,
			alamat: alamatInput,
			longitude: longitudeInput,
			latitude: latitudeInput,
			radius: radiusInput,
		});
	}

	function LocationMarker() {
		useMapEvents({
			click(e) {
				setLatitudeInput(e.latlng.lat);
				setLongitudeInput(e.latlng.lng);
			},
		});

		return (
			<Marker position={{ lat: latitudeInput, lng: longitudeInput }}>
				<Popup>You are here</Popup>
			</Marker>
		);
	}
	return (
		<DashboardLayout>
			{isLoading && <p className="text-center">Loading...</p>}
			{isDeleteButtonClicked && (
				<Card>
					<CardHeader className="absolute z-50 bg-white dark:bg-black left-[50%] -translate-x-[50%] -translate-y-[50%] top-[50%] border-[1px] border-black shadow-md rounded-lg p-4">
						<CardTitle>Apakah anda yakin?</CardTitle>
						<div className="flex gap-4 justify-end mt-4">
							<Button
								disabled={deleteMutation.isPending || editMutation.isPending}
								onClick={() => setIsDeleteButtonClicked((prev) => !prev)}
								className="font-semibold"
							>
								Tidak
							</Button>
							<Button
								disabled={deleteMutation.isPending || editMutation.isPending}
								onClick={handleOnRejectOrDelete}
								className="rounded-lg bg-red-600 p-2 text-white tracking-wide font-semibold w-20"
							>
								Ya
							</Button>
						</div>
					</CardHeader>
					<div
						onClick={() => setIsDeleteButtonClicked((prev) => !prev)}
						className="absolute z-40 w-screen h-screen"
					></div>
				</Card>
			)}
			{data?.data !== null ? (
				<Card>
					<div className="flex gap-2">
						<div className="w-[50%]">
							<Card>
								<Card>
									<CardContent>
										<MapContainer
											key={longitudeInput + latitudeInput}
											className="z-0 mt-6 rounded-lg"
											center={[latitudeInput, longitudeInput]}
											zoom={13}
											scrollWheelZoom={true}
											style={{ height: 600 }}
										>
											<TileLayer
												attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
												url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
											/>

											<Circle
												radius={radiusInput}
												center={{ lat: latitudeInput, lng: longitudeInput }}
											/>
											<LocationMarker />
										</MapContainer>
										<Label className="text-sm font-bold" htmlFor="longitude">
											Longitude
										</Label>
										<Input
											className="block w-full border-[1px] border-slate-300 rounded-md p-1 mb-4"
											type="number"
											id="longitude"
											name="longitude"
											value={longitudeInput}
											onChange={(e) => inputValidator(e, setLongitudeInput)}
											key="longitude-non-write"
										/>

										<Label className="text-sm font-bold" htmlFor="latitude">
											Latitude
										</Label>
										<Input
											className="block w-full border-[1px] border-slate-300 rounded-md p-1 mb-4"
											type="number"
											id="latitude"
											name="latitude"
											value={latitudeInput}
											onChange={(e) => inputValidator(e, setLatitudeInput)}
											key="latitude-non-write"
										/>
										<Label className="text-sm font-bold" htmlFor="radius">
											Radius
										</Label>
										<Input
											className="block w-full border-[1px] border-slate-300 rounded-md p-1 mb-4"
											type="number"
											id="radius"
											name="radius"
											key="radius"
											value={radiusInput}
											onChange={(e) => inputValidator(e, setRadiusInput)}
										/>
									</CardContent>
								</Card>
								<Card className="mt-4 px-4 py-2">
									<CardContent className="p-2">
										<Label htmlFor="profil-singkat">Profil Singkat : </Label>
										{isEditing ? (
											<Textarea
												key="profil-singkat-write"
												id="profil-singkat"
												className="w-full p-2 rounded-lg border-[1px] border-gray-300"
												onChange={(e) =>
													setProfil_SingkatInput(e.currentTarget.value)
												}
												value={
													isEditing
														? profil_singkatInput || ""
														: data?.data?.profil_singkat || ""
												}
											/>
										) : (
											<Textarea
												readOnly
												value={data?.data?.profil_singkat || ""}
												key="profil-singkat-read"
											/>
										)}
									</CardContent>
								</Card>
							</Card>
						</div>
						<div className="flex-grow">
							<Card className="rounded-lg p-2 border-[1px] border-gray-200 shadow-md mb-6">
								<CardHeader>
									<CardTitle className="tracking-wide font-bold text-lg">
										{data?.data?.nama}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<CardTitle>Jenis Instansi: </CardTitle>
									{isEditing ? (
										<select
											className="my-2 dark:bg-gray-800/50 dark:border-gray-700 border-[1px] p-2 border-gray-300 outline-none rounded-md"
											name="jenis-instansi"
											id="jenis-instansi"
											value={jenisInput}
											onChange={(e) => setJenisInput(e.target.value)}
										>
											<option value="">Pilih Jenis</option>
											<option value="UMKM">UMKM</option>
											<option value="Pemerintahan">Pemerintahan</option>
											<option value="Pendidikan">Pendidikan</option>
											<option value="Swasta">Swasta</option>
										</select>
									) : (
										<CardDescription>{data?.data?.jenis}</CardDescription>
									)}
									<CardTitle>Status : </CardTitle>
									{isEditing ? (
										<select
											className="my-2 border-[1px] dark:bg-gray-800/50 dark:border-gray-700 p-2 border-gray-300 outline-none rounded-md"
											name="status-instansi"
											id="status-instansi"
											value={statusInput}
											onChange={(e) => setStatusInput(e.target.value)}
										>
											<option value="">Pilih Status</option>
											<option value="Aktif">Aktif</option>
											<option value="Pending">Pending</option>
											<option value="Tidak_Aktif">Tidak Aktif</option>
										</select>
									) : (
										<p>{data?.data && data?.data.status.replace("_", " ")}</p>
									)}
								</CardContent>
							</Card>
							<Card className="rounded-lg p-2 border-[1px] border-gray-200 shadow-md mb-6">
								<CardHeader>
									<CardTitle className="tracking-wide font-bold text-lg">
										Lokasi
									</CardTitle>
								</CardHeader>
								<CardContent>
									<CardTitle>Longitude : </CardTitle>
									{isEditing ? (
										<Input
											className="rounded-lg border-[1px] border-gray-300 p-2 my-2"
											onChange={(e) => inputValidator(e, setLongitudeInput)}
											type="number"
											value={isEditing ? longitudeInput : data?.data.longitude}
											key="longitude"
										/>
									) : (
										<CardDescription>{data?.data.longitude}</CardDescription>
									)}
									<CardTitle>Latitude : </CardTitle>
									{isEditing ? (
										<Input
											className="rounded-lg border-[1px] border-gray-300 p-2 my-2"
											onChange={(e) => inputValidator(e, setLatitudeInput)}
											type="number"
											value={isEditing ? latitudeInput : data?.data.latitude}
											key="latitude"
										/>
									) : (
										<CardDescription>{data?.data.latitude}</CardDescription>
									)}
									<CardTitle>Alamat : </CardTitle>
									{isEditing ? (
										<Input
											className="rounded-lg border-[1px] border-gray-300 p-2 my-2"
											onChange={(e) => setAlamatInput(e.currentTarget.value)}
											type="text"
											value={isEditing ? alamatInput : data?.data.alamat}
											key="alamat"
										/>
									) : (
										<CardDescription>{data?.data.alamat}</CardDescription>
									)}
								</CardContent>
							</Card>
							<Card className="rounded-lg p-2 border-[1px] border-gray-200 shadow-md">
								<CardHeader>
									<CardTitle className="tracking-wide font-bold text-lg">
										Penanggung Jawab
									</CardTitle>
								</CardHeader>
								<CardContent>
									<CardTitle>Nama Penanggung Jawab : </CardTitle>
									{isEditing ? (
										<Input
											className="rounded-lg border-[1px] border-gray-300 p-2 my-2"
											onChange={(e) => setNama_PjInput(e.currentTarget.value)}
											type="text"
											value={isEditing ? nama_pjInput : data?.data.nama_pj}
											key="pj"
										/>
									) : (
										<CardDescription>{data?.data?.nama_pj}</CardDescription>
									)}
									<CardTitle>Nomor Penanggung Jawab : </CardTitle>
									{isEditing ? (
										<Input
											className="rounded-lg border-[1px] border-gray-300 p-2 my-2"
											onChange={(e) => setNo_Hp_PjInput(e.currentTarget.value)}
											type="text"
											value={isEditing ? no_hp_pjInput : data?.data.no_hp_pj}
											key="no_pj"
										/>
									) : (
										<CardDescription>{data?.data?.no_hp_pj}</CardDescription>
									)}
								</CardContent>
							</Card>
							<p></p>
						</div>
					</div>
					<CardFooter className="fixed left-0 right-0 py-3 pr-10 bottom-0 flex justify-end gap-4">
						{data?.data?.status === "Pending" && isEditing && (
							<>
								<Button
									disabled={editMutation.isPending || deleteMutation.isPending}
									onClick={() => setIsDeleteButtonClicked((prev) => !prev)}
									className="bg-red-600 p-2 rounded-lg text-white font-semibold tracking-wide"
								>
									Tolak Pengajuan
								</Button>
								<Button
									disabled={editMutation.isPending || deleteMutation.isPending}
									onClick={handleOnACC}
									className="bg-green-600 p-2 rounded-lg text-white font-semibold tracking-wide"
								>
									Terima Pengajuan
								</Button>
							</>
						)}
						{!isEditing && (
							<>
								<Button
									disabled={editMutation.isPending}
									onClick={() => setIsDeleteButtonClicked((prev) => !prev)}
									variant="destructive"
									className="bg-red-600 p-2 rounded-lg text-white font-semibold tracking-wide"
								>
									Hapus Instansi
								</Button>
								<Button
									disabled={editMutation.isPending}
									onClick={() => setIsEditing((prev) => !prev)}
									className="bg-green-600 p-2 rounded-lg text-white font-semibold tracking-wide"
								>
									Edit Instansi
								</Button>
							</>
						)}
						{isEditing && data?.data?.status !== "Pending" && (
							<>
								<Button
									disabled={editMutation.isPending}
									onClick={() => setIsEditing((prev) => !prev)}
									className="bg-red-600 p-2 rounded-lg text-white font-semibold tracking-wide"
								>
									Batalkan
								</Button>
								<Button
									disabled={editMutation.isPending}
									onClick={handleOnEdit}
									className="bg-green-600 p-2 rounded-lg text-white font-semibold tracking-wide"
								>
									Perbarui
								</Button>
							</>
						)}
					</CardFooter>
				</Card>
			) : (
				<CardDescription>Data Instansi Tidak Ditemukan.</CardDescription>
			)}
		</DashboardLayout>
	);
}

export default KoordinatorKerjaPraktikDetailInstansiPage;

function inputValidator(
	e: any,
	setState: React.Dispatch<React.SetStateAction<number>>
) {
	try {
		const temp = parseFloat(e.currentTarget.value);
		console.log(e.currentTarget.value === "");
		if (e.currentTarget.value === "") {
			setState(0);
		} else {
			setState(temp);
		}
	} catch (e) {
		console.error("Input tidak valid");
	}
}