import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { useEffect, useMemo, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { colourLabelingCategory } from "@/helpers/colour-labeling-category";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import APISetoran from "@/services/api/dosen/setoran-hafalan.service";
import { Skeleton } from "@/components/ui/skeleton";
import ModalBoxStatistik from "@/components/dosen/setoran-hafalan/ModalBoxStatistik";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFilteringSetoranSurat } from "@/hooks/use-filtering-setor-surat";
import {
	ArrowLeft,
	BackpackIcon,
	BookOpenIcon,
	Calendar,
	ChartSpline,
	Clock,
	Download,
	DownloadIcon,
	GraduationCap,
	Hash,
	History,
	Loader2,
	PrinterIcon,
	Rocket,
	X,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import ModalBoxLogs from "@/components/dosen/setoran-hafalan/ModalBoxLogs";
import ModalBoxValidasiSetoran from "@/components/dosen/setoran-hafalan/ModalBoxValidasiSetoran";
import ModalBoxBatalSetoran from "@/components/dosen/setoran-hafalan/ModalBoxBatalSetoran";
import {
	CheckedData,
	MahasiswaSetoran,
} from "@/interfaces/pages/dosen/setoran-hafalan/mahasiswa-pa/detail-mahasiswa-setoran.interface";
import { useParams } from "react-router-dom";
import TableLoadingSkeleton from "@/components/globals/table-loading-skeleton";
import {
	ModalBoxQuran,
	SurahData,
} from "@/components/dosen/setoran-hafalan/ModalBoxQuran";
import { toast } from "sonner";
import HoverPreviewCard from "@/components/dosen/setoran-hafalan/HoverPreviewProgress";

function DetailMahasiswaSetoran() {
	const { nim } = useParams<{ nim: string }>();
	const queryclient = useQueryClient();

	// Connect to External e-Quran API
	const [nomorSurah, setNomorSurah] = useState<string | undefined>();
	const [namaSurah, setNamaSurah] = useState<string | undefined>();
	const [dataSurah, setDataSurah] = useState<SurahData | undefined>();
	const [openModalQuran, setOpenModalQuran] = useState(false);
	const [openModalQuranIsLoading, setOpenModalQuranIsLoading] = useState<{
		[key: string]: boolean;
	}>({});
	const [modalQuranRefresh, setModalQuranRefresh] = useState(false);
	useEffect(() => {
		if (!nomorSurah) return;
		setOpenModalQuranIsLoading((prevState) => ({
			...prevState,
			[nomorSurah]: true,
		}));
		fetch(`https://equran.id/api/v2/surat/${nomorSurah}`)
			.then((res) => res.json())
			.then((data) => {
				setOpenModalQuranIsLoading((prevState) => ({
					...prevState,
					[nomorSurah]: false,
				}));
				setDataSurah({ ...data.data, namaLatin: namaSurah });
				setOpenModalQuran(true);
			});
	}, [nomorSurah, modalQuranRefresh]);
	const handleNomorSurahChange = (nomorSurah: string, namaSurah: string) => {
		setNomorSurah(nomorSurah);
		setNamaSurah(namaSurah);
		setModalQuranRefresh((prev) => !prev);
	};

	const {
		data: dataInfoSetoran,
		isLoading,
		isFetching,
	} = useQuery({
		queryKey: ["info-mahasiswa-by-nim"],
		queryFn: () =>
			APISetoran.getDataMahasiswaByNIM(nim!).then((res) => res.data),
	});

  const formattedDate = useMemo(() => {
    return new Date(dataInfoSetoran?.setoran.info_dasar?.tgl_terakhir_setor).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [dataInfoSetoran?.setoran.info_dasar?.tgl_terakhir_setor]);

	useEffect(() => {
		return () => {
			queryclient.removeQueries({ queryKey: ["info-mahasiswa-by-nim"] });
		};
	}, []);
	const { dataCurrent, setTabState, tabState, setSearch, search } =
		useFilteringSetoranSurat(dataInfoSetoran?.setoran.detail, "default");

	const mutationAccept = useMutation({
		mutationFn: APISetoran.postSetoranSurah,
	});

	const mutationDelete = useMutation({
		mutationFn: APISetoran.pembatalanSetoranSurah,
	});

	const [tempDataCheck, setTempDataCheck] = useState<CheckedData[]>([]);
	const [buttonLoading, setButtonLoading] = useState(false);
	const [selectAll, setSelectAll] = useState(false);
	const [loading, setLoading] = useState(false);
	const [openModalValidasiSetoran, setModalValidasiSetoran] = useState(false);
	const [openModalBatalkanSetoran, setModalBatalkanSetoran] = useState(false);
	const [openModalStatistik, setModalStatistik] = useState(false);
	const [openModalLogs, setModalLogs] = useState(false);

	const handleSelectAll = (checked: boolean) => {
		setSelectAll(checked);

		if (checked) {
			// Jika dicentang, tambahkan semua data ke tempDataCheck
			const allData =
				dataCurrent?.map((surah) => ({
					nama_komponen_setoran: surah.nama,
					id_komponen_setoran: surah.id,
					id: surah.info_setoran?.id || "",
				})) || [];

			setTempDataCheck(allData);
		} else {
			// Jika tidak dicentang, kosongkan array
			setTempDataCheck([]);
		}
	};
	const tempDataToString = (aksi: string) => {
		if (aksi === "validasi") {
			const tempData = tempDataCheck
				.filter((item) => item.id === "")
				.map((item) => item.nama_komponen_setoran);
			return tempData.join(", ");
		} else {
			const tempData = tempDataCheck
				.filter((item) => item.id !== "")
				.map((item) => item.nama_komponen_setoran);
			return tempData.join(", ");
		}
	};
	const handleCheckBoxToTempData = (
		checked: boolean,
		nama_komponen_setoran: string,
		id_komponen_setoran: string,
		id?: string
	) => {
		if (checked) {
			// Tambahkan data baru ke array
			setTempDataCheck((prevData) => [
				...prevData,
				{
					nama_komponen_setoran: nama_komponen_setoran,
					id_komponen_setoran: id_komponen_setoran,
					id: id,
				},
			]);
		} else {
			// Hapus data yang sesuai dari array
			setTempDataCheck((prevData) =>
				prevData.filter(
					(item) =>
						item.nama_komponen_setoran !== nama_komponen_setoran ||
						item.id_komponen_setoran !== id_komponen_setoran
				)
			);
		}
	};
	const [isLoadingCetakKartuMurojaah, setIsLoadingCetakKartuMurojaah] =
		useState(false);
	const handleCetakKartuMurojaahMobile = async () => {
		setIsLoadingCetakKartuMurojaah(true);
		const response = await APISetoran.getKartuMurojaahMahasiswaByNIM(nim!);

		const pdfName = response.headers["content-disposition"]
			.split("filename=")[1]
			.replaceAll('"', "");
		const blob = new Blob([response.data], { type: "application/pdf" });
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url || "";
		link.download = pdfName || "";
		link.click();
		link.remove();
		URL.revokeObjectURL(link.href);
		setIsLoadingCetakKartuMurojaah(false);
	};
	const handleGoBack = () => {
		return window.history.back();
	};

	const [pdfUrl, setPdfUrl] = useState<string | null>(null);
	const [pdfName, setPdfName] = useState<string | null>(null);
	const [showModal, setShowModal] = useState(false);
	const handleCetakKartuMurojaah = async () => {
		setIsLoadingCetakKartuMurojaah(true);
		const response = await APISetoran.getKartuMurojaahMahasiswaByNIM(nim!);
		setIsLoadingCetakKartuMurojaah(false);

		const pdfName = response.headers["content-disposition"]
			.split("filename=")[1]
			.replaceAll('"', "");
		const blob = new Blob([response.data], { type: "application/pdf" });
		const url = URL.createObjectURL(blob);

		setPdfUrl(url);
		setPdfName(pdfName);
		setShowModal(true);
	};
	const handeDownloadPDF = async () => {
		const link = document.createElement("a");
		link.href = pdfUrl || "";
		link.download = pdfName || "";
		link.click();
		link.remove();
		URL.revokeObjectURL(link.href);

		setShowModal(false);
		setPdfUrl(null);
		setPdfName(null);
	};
	return (
		<>
			{showModal && pdfUrl && (
				<div className="fixed z-[999] w-screen h-screen flex items-center justify-center bg-black bg-opacity-70">
					<div className="w-[80%] h-[90%] flex flex-col justify-center items-end gap-1">
						<div className="flex gap-1 h-10 w-full">
							<div className="w-full h-full rounded-md bg-green-800 flex justify-start items-center px-4">
								<p className="text-white text-center font-medium">{pdfName}</p>
							</div>
							<Button
								variant={"default"}
								className="bg-yellow-700 active:bg-yellow-700 hover:bg-yellow-800 justify-center flex h-full hover:scale-95 active:scale-100"
								onClick={handeDownloadPDF}
							>
								<DownloadIcon width={50} height={50} color="white" />
							</Button>
							<Button
								variant={"destructive"}
								className="justify-center flex h-full hover:scale-95 active:scale-100"
								onClick={() => {
									setShowModal(false);
									setPdfUrl(null);
								}}
							>
								<X width={50} height={50} color="white" />
							</Button>
						</div>
						<iframe
							src={pdfUrl}
							title={pdfName || ""}
							className="border rounded w-full h-full"
						></iframe>
					</div>
				</div>
			)}
			<DashboardLayout>
				{openModalQuran && (
					<ModalBoxQuran
						isOpen={openModalQuran}
						setIsOpen={setOpenModalQuran}
						dataSurah={dataSurah}
					/>
				)}
				<ModalBoxStatistik
					isFetching={isFetching}
					isOpen={openModalStatistik}
					dataRingkasan={dataInfoSetoran?.setoran.ringkasan}
					setIsOpen={setModalStatistik}
				/>
				<ModalBoxLogs
					isOpen={openModalLogs}
					setIsOpen={setModalLogs}
					dataLogs={dataInfoSetoran?.setoran.log}
				/>
				<ModalBoxBatalSetoran
					openDialog={openModalBatalkanSetoran}
					buttonLoading={buttonLoading}
					deleteSetoran={() => {
						setButtonLoading(true);
						try {
							const dataBatalkan = tempDataCheck
								.filter((item) => item.id !== "")
								.map((item) => ({
									id: item.id,
									id_komponen_setoran: item.id_komponen_setoran,
									nama_komponen_setoran: item.nama_komponen_setoran,
								}));
							if (dataBatalkan.length === 0) {
								setLoading(false);
								return toast.info("Tidak ada surah yang dibatalkan");
							}

							mutationDelete
								.mutateAsync({
									nim: dataInfoSetoran?.info.nim,
									data_setoran: dataBatalkan,
								})
								.then((data) => {
									if (data.response) {
										queryclient.invalidateQueries({
											queryKey: ["info-mahasiswa-by-nim"],
										});

										setTempDataCheck([]);
										setSelectAll(false);
										setModalBatalkanSetoran(false);
										setButtonLoading(false);
										toast.success(data.message);
										setLoading(false);
									}
								});
						} catch (error) {
							toast.error("Pembatalan Muroja'ah Gagal!", {
								action: {
									label: "Refresh",
									onClick: () => window.location.reload(),
								},
							});
							console.log(error);
						}
					}}
					info={dataInfoSetoran?.info}
					nama_komponen_setoran={tempDataToString("batalkan")}
					onClose={() => {
						setModalBatalkanSetoran(false);
					}}
				/>
				<ModalBoxValidasiSetoran
					openDialog={openModalValidasiSetoran}
					buttonLoading={buttonLoading}
					validasiSetoran={(dateSetoran: string) => {
						if (dateSetoran === "") {
							return toast.warning("Tanggal muroja'ah tidak boleh kosong!");
						}
						setButtonLoading(true);
						try {
							const dataAcc = tempDataCheck
								.filter((item) => item.id === "")
								.map((item) => ({
									nama_komponen_setoran: item.nama_komponen_setoran,
									id_komponen_setoran: item.id_komponen_setoran,
								}));

							mutationAccept
								.mutateAsync({
									nim: dataInfoSetoran?.info.nim,
									data_setoran: dataAcc,
									tgl_setoran: dateSetoran,
								})
								.then((data) => {
									if (data.response) {
										queryclient.invalidateQueries({
											queryKey: ["info-mahasiswa-by-nim"],
										});

										setTempDataCheck([]);
										setSelectAll(false);
										setModalValidasiSetoran(false);
										setButtonLoading(false);
										toast.success(data.message);

										setLoading(false);
									} else {
										return toast.error(data.message, {
											action: {
												label: "Refresh",
												onClick: () => window.location.reload(),
											},
										});
									}
								});
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
						} catch (error) {
							toast.error("Validasi Muroja'ah Gagal!", {
								action: {
									label: "Refresh",
									onClick: () => window.location.reload(),
								},
							});
						}
					}}
					info={dataInfoSetoran?.info}
					nama_komponen_setoran={tempDataToString("validasi")}
					onClose={(bool) => {
						setModalValidasiSetoran(bool);
					}}
				/>

				<div className="flex flex-col gap-4">
					{/* judul */}
					<div className="flex flex-col gap-1.5 mb-1.5">
						<div className="flex gap-3.5">
							<button
								onClick={handleGoBack}
								className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
							>
								<ArrowLeft size={20} className="mr-1" />
								<span className="text-sm font-medium">Kembali</span>
							</button>

							<div className="flex">
								<span className="bg-white flex justify-center items-center shadow-sm text-gray-800 dark:text-gray-200 dark:bg-gray-900 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 text-md font-medium tracking-tight">
									<span
										className={`inline-block animate-pulse w-3 h-3 rounded-full mr-2 bg-yellow-400`}
									/>
									<BackpackIcon className="w-4 h-4 mr-1.5" />
									<span className="hidden md:block">
										Detail Muroja'ah Juz 30 Mahasiswa
									</span>
									<span className="md:hidden">Detail Muroja'ah Juz 30</span>
								</span>
							</div>
						</div>
					</div>

					{/* statistik && user info desktop */}
					<div className="md:flex hidden gap-6 rounded-2xl -mt-1.5 -mb-2.5">
						<div className="w-full flex gap-6 bg-transparent dark:bg-gradient-to-br dark:from-violet-800/10 dark:to-slate-900/5 border border-slate-300 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/80 transition-colors duration-300 rounded-2xl my-auto mx-auto p-6">
							<div className="flex justify-center items-center border-r-2 pr-3 -ml-1.5">
                <div>
                  <HoverPreviewCard isFetching={isFetching} data={{
                    info_dasar: dataInfoSetoran?.setoran.info_dasar,
                    ringkasan: dataInfoSetoran?.setoran.ringkasan
                  }} />
                </div>
							</div>

							<div className="w-full">
								<div className="w-full z-10 flex items-start gap-3 mb-6">
									<div className="w-24">
										{isLoading ? (
											<Skeleton className="w-20 h-20 rounded-2xl" />
										) : (
											<img
												src={`https://api.dicebear.com/8.x/micah/svg?seed=${encodeURIComponent(
													dataInfoSetoran?.info.nama || "default"
												)}&radius=15&backgroundType=gradientLinear&backgroundColor=b6e3f4,c0aede,d1d4f9`}
												alt={`Avatar of ${dataInfoSetoran?.info.nama}`}
												className="w-20 h-20 rounded-2xl object-cover shadow-lg"
											/>
										)}
									</div>
									<div className="w-full">
										{isLoading ? (
											<div className="space-y-2.5">
												<Skeleton className="h-7 w-64" />
												<Skeleton className="h-5 w-48" />
												<div className="flex gap-2 mt-2">
													<Skeleton className="h-4 w-24 rounded-full" />
													<Skeleton className="h-4 w-28 rounded-full" />
												</div>
											</div>
										) : (
											<div className="w-full flex justify-between">
												<div>
													<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
														{dataInfoSetoran?.info.nama}
													</h2>
													<p className="text-gray-600 dark:text-gray-300 text-md font-mono -mt-0.5 mb-1">
														{dataInfoSetoran?.info.nim}
													</p>
													<div className="flex items-center gap-2">
														<span className="px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium flex items-center gap-1.5">
															<Rocket size={14} />
															Semester {dataInfoSetoran?.info.semester}
														</span>
														<span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium flex items-center gap-1.5">
															<Hash size={14} />
															Angkatan {dataInfoSetoran?.info.angkatan}
														</span>
													</div>
												</div>
												<div>
													<Button
														onClick={handleCetakKartuMurojaah}
														disabled={isLoadingCetakKartuMurojaah}
														title="Cetak Kartu Muroja'ah"
														className=" bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-blue-200 dark:border-blue-700/50 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 !p-2.5"
													>
														{
															<>
																{isLoadingCetakKartuMurojaah && (
																	<Loader2 className="animate-spin" size={18} />
																)}
																<Download size={18} />
																<span>Cetak Kartu Muroja'ah</span>
															</>
														}
													</Button>
												</div>
											</div>
										)}
									</div>
								</div>
								<div className="relative z-10 flex gap-4">
									<div className="group p-4 pr-6 bg-gradient-to-tr from-emerald-400/10 to-blue-400/10 dark:from-emerald-700/5 dark:to-blue-700/5 backdrop-blur-sm rounded-xl border transition-all duration-300">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-md">
												<GraduationCap className="w-5 h-5 text-white" />
											</div>
											<div>
												<p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
													Dosen Penasehat Akademik
												</p>
												{isLoading ? (
													<Skeleton className="h-5 w-40 mt-1" />
												) : (
													<div className="flex items-center text-sm divide-x-2 divide-gray-300 dark:divide-gray-600">
														{/* Nama Dosen */}
														<p
															className="pr-2.5 font-semibold text-gray-900 dark:text-white truncate"
															title={dataInfoSetoran?.info.dosen_pa?.nama}
														>
															{dataInfoSetoran?.info.dosen_pa.nama || "N/A"}
														</p>

														{/* NIP Dosen */}
														<p
															className="hidden 2xl:flex px-2.5 text-gray-600 dark:text-gray-400 truncate"
															title={dataInfoSetoran?.info.dosen_pa.nip}
														>
															{dataInfoSetoran?.info.dosen_pa.nip || "N/A"}
														</p>

														{/* Email Dosen */}
														<p
															className="hidden xl:flex pl-2.5 text-gray-500 dark:text-gray-400 truncate"
															title={dataInfoSetoran?.info.dosen_pa.email}
														>
															<a
																href={`mailto:${dataInfoSetoran?.info.dosen_pa.email}`}
																className="hover:underline hover:text-blue-600"
															>
																{dataInfoSetoran?.info.dosen_pa.email || "N/A"}
															</a>
														</p>
													</div>
												)}
											</div>
										</div>
									</div>
									<div className="group flex-1 p-4 bg-gradient-to-tr from-orange-400/15 to-pink-400/10 dark:from-orange-800/5 dark:to-violet-800/10 backdrop-blur-sm rounded-xl border transition-all duration-300">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-md">
												<Calendar className="w-5 h-5 text-white" />
											</div>
											<div>
												<p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
													Terakhir Muroja'ah
												</p>
												{isLoading ? (
													<Skeleton className="h-5 w-32 mt-1" />
												) : (
													<p className="text-sm font-semibold text-gray-900 dark:text-white">
														{dataInfoSetoran?.setoran.info_dasar.terakhir_setor}&nbsp;&nbsp;{dataInfoSetoran?.setoran.info_dasar.tgl_terakhir_setor && <span className="font-normal">({formattedDate})</span>}
													</p>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* For Mobile View User Info */}
					<div className="-mt-1.5 -mb-2 md:hidden w-full h-full flex flex-col bg-transparent dark:bg-gradient-to-br dark:from-violet-800/10 dark:to-slate-900/5 border border-slate-300 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/80 transition-colors duration-300 py-3 px-4 rounded-xl items-center">
						<div className="flex items-center gap-[0.9rem] w-full rounded-xl">
							{/* AREA KIRI: AVATAR */}
							{isLoading ? (
								<Skeleton className="w-[4.5rem] h-[4.5rem] rounded-full flex-shrink-0" />
							) : (
								<div
									className="flex-shrink-0 h-[4.5rem] w-[4.5rem] rounded-full overflow-hidden"
									title={dataInfoSetoran?.info.nama}
								>
									<img
										src={`https://api.dicebear.com/8.x/micah/svg?seed=${encodeURIComponent(
											dataInfoSetoran?.info.nama || "default"
										)}&radius=50&backgroundType=gradientLinear&backgroundColor=b6e3f4,c0aede,d1d4f9`}
										alt={`Avatar of ${dataInfoSetoran?.info.nama}`}
										className="w-full h-full object-cover"
									/>
								</div>
							)}

							{/* AREA KANAN: IDENTITAS UTAMA (Layout Simetris) */}
							<div className="flex flex-col justify-center h-full w-full">
								{isLoading ? (
									<div className="space-y-1">
										<Skeleton className="h-4 w-4/5" />
										<Skeleton className="h-3 w-3/5 mt-1.5" />
										<div className="flex gap-1.5 pt-2">
											<Skeleton className="h-8 w-4/5 rounded-lg" />
											<Skeleton className="h-8 w-4/5 rounded-lg" />
										</div>
									</div>
								) : (
									<>
										{/* Baris Atas: Nama dan NIM */}
										<div className="overflow-hidden max-w-[13.5rem]">
											<h2 className="text-lg font-semibold tracking-tight text-gray-800 dark:text-white text-ellipsis whitespace-nowrap overflow-hidden">
												{dataInfoSetoran?.info.nama}
											</h2>
											<p className="text-sm text-gray-500 font-mono -mt-1">
												{dataInfoSetoran?.info.nim}
											</p>
										</div>

										{/* Baris Bawah: Tag/Pill */}
										<div className="flex items-center gap-[0.32rem] mt-2">
											<div className="flex items-center gap-1 border bg-indigo-700/15 dark:bg-indigo-700/30 dark:text-indigo-200 text-indigo-700 text-xs px-1.5 py-0 rounded-lg">
												<Rocket size={10} />
												<span>Semester {dataInfoSetoran?.info.semester}</span>
											</div>
											<div className="flex items-center gap-1 border bg-teal-700/15 dark:bg-teal-700/30 dark:text-teal-200 text-teal-700 text-xs px-2 py-0 rounded-lg">
												<Hash size={10} />
												<span>Akt. {dataInfoSetoran?.info.angkatan}</span>
											</div>
										</div>
									</>
								)}
							</div>
						</div>
						<div className="w-full mt-4 pt-3 border-t flex justify-between border-slate-300 dark:border-slate-700/50">
							<div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
								<Clock className="w-3 h-3" />
								<span>
									Terakhir Muroja'ah{" "}
									{isFetching
										? "-"
										: dataInfoSetoran?.setoran.info_dasar.terakhir_setor}
								</span>
							</div>
						</div>
					</div>

					<div className="flex flex-col gap-1.5 sticky top-[51.3px] bg-background pt-2.5 -mb-4 pb-3.5 z-50">
						{/* For Mobile */}

						<div className="md:hidden overflow-x-auto max-w-full mb-2 flex gap-1.5">
							<Tabs defaultValue="tab1" className="w-full">
								<TabsList className="gap-1.5 w-full">
									<TabsTrigger
										value="tab1"
										onClick={() => setTabState("default")}
										className={`w-full data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:font-semibold ${
											tabState !== "default" &&
											"hover:bg-blue-100 dark:hover:bg-background/20"
										}`}
									>
										Semua                    
									</TabsTrigger>
									<TabsTrigger
										value="tab2"
										onClick={() => setTabState("sudah_setor")}
										className={`w-full data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:font-semibold ${
											tabState !== "sudah_setor" &&
											"hover:bg-blue-100 dark:hover:bg-background/20"
										}`}
									>
										Selesai                    
									</TabsTrigger>
									<TabsTrigger
										value="tab3"
										onClick={() => setTabState("belum_setor")}
										className={`w-full data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:font-semibold ${
											tabState !== "belum_setor" &&
											"hover:bg-blue-100 dark:hover:bg-background/20"
										}`}
									>
										Belum                    
									</TabsTrigger>
								</TabsList>
							</Tabs>
							<Button
								variant="outline"
								onClick={handleCetakKartuMurojaahMobile}
								className="md:hidden bg-blue-500 text-white hover:bg-blue-600 active:scale-95 flex justify-center items-center gap-1.5"
							>
								{isLoadingCetakKartuMurojaah && (
									<Loader2 className="mr-1 animate-spin" />
								)}
								<PrinterIcon size={20} />
								{/* <span className="">Unduh Kartu Muroja'ah</span> */}
							</Button>
						</div>

						<div className="flex justify-between gap-2.5">
							{/* Hide at Mobile */}
							<div className="hidden md:block overflow-x-auto max-w-28 md:max-w-full">
								<Tabs defaultValue="tab1" className="w-full">
									<TabsList className="gap-1.5">
										<TabsTrigger
											value="tab1"
											onClick={() => setTabState("default")}
											className={`data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:font-semibold ${
												tabState !== "default" &&
												"hover:bg-blue-100 dark:hover:bg-background/20"
											}`}
										>
											Semua riwayat muroja'ah
                      <span className="flex justify-center items-center min-w-6 ml-2 px-[0.190rem] py-[0.110rem] text-xs rounded-full bg-yellow-600 text-white">
                        {dataInfoSetoran?.setoran.info_dasar.total_wajib_setor || 0}
                      </span>
										</TabsTrigger>
										<TabsTrigger
											value="tab2"
											onClick={() => setTabState("sudah_setor")}
											className={`data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:font-semibold ${
												tabState !== "sudah_setor" &&
												"hover:bg-blue-100 dark:hover:bg-background/20"
											}`}
										>
											Selesai di-muroja'ah
                      <span className="flex justify-center items-center min-w-6 ml-2 px-[0.190rem] py-[0.110rem] text-xs rounded-full bg-green-600 text-white">
                        {dataInfoSetoran?.setoran.info_dasar.total_sudah_setor || 0}
                      </span>
										</TabsTrigger>
										<TabsTrigger
											value="tab3"
											onClick={() => setTabState("belum_setor")}
											className={`data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:font-semibold ${
												tabState !== "belum_setor" &&
												"hover:bg-blue-100 dark:hover:bg-background/20"
											}`}
										>
											Belum di-muroja'ah
                      <span className="flex justify-center items-center min-w-6 ml-2 px-[0.190rem] py-[0.110rem] text-xs rounded-full bg-red-600 text-white">
                        {dataInfoSetoran?.setoran.info_dasar.total_belum_setor || 0}
                      </span>
										</TabsTrigger>
									</TabsList>
								</Tabs>
							</div>

							{/* Display at Mobile */}
							<Input
								placeholder="Cari surah..."
								onChange={(e) => {
									setSearch(e.target.value);
								}}
								className="w-full md:hidden"
							/>

							<div className="flex gap-1.5 justify-center items-center">
								<Button
									variant={"default"}
									className="md:hidden bg-purple-500 text-white hover:bg-purple-700 active:scale-95 flex justify-center items-center gap-1.5"
									onClick={() => {
										setModalStatistik(true);
									}}
								>
									<ChartSpline size={20} />
								</Button>
								<Button
									variant={"default"}
									className="bg-orange-500 text-white hover:bg-orange-600 active:scale-95 flex justify-center items-center gap-1.5"
									onClick={() => {
										setModalLogs(true);
									}}
								>
									<History size={20} />
									<span className="hidden md:block">Lihat Aktivitas</span>
								</Button>
								<div className="w-[2px] rounded-full h-full mx-1 py-0.5">
									<div className="w-full h-full bg-foreground/20" />
								</div>
								<Button
									variant={"outline"}
									className="border-2 border-solid border-red-400 active:scale-95"
									disabled={tempDataCheck.length === 0 || isLoading}
									onClick={() => {
										const dataBatalkan = tempDataCheck
											.filter((item) => item.id !== "")
											.map((item) => ({
												id: item.id,
												id_komponen_setoran: item.id_komponen_setoran,
												nama_komponen_setoran: item.nama_komponen_setoran,
											}));
										if (dataBatalkan.length === 0) {
											setModalBatalkanSetoran(false);
											return toast.warning(
												"Surah yang anda pilih belum di-muroja'ah sebelumnya!"
											);
										}

										setModalBatalkanSetoran(true);
									}}
								>
									❌
								</Button>

								<Button
									variant={"outline"}
									className="border-2 border-solid border-green-400 active:scale-95"
									disabled={tempDataCheck.length === 0 || isLoading}
									onClick={() => {
										const dataAcc = tempDataCheck
											.filter((item) => item.id === "")
											.map((item) => ({
												nama_komponen_setoran: item.nama_komponen_setoran,
												id_komponen_setoran: item.id_komponen_setoran,
											}));

										if (dataAcc.length === 0) {
											setLoading(false);
											setModalValidasiSetoran(false);
											return toast.warning(
												"Surah yang anda pilih sudah di-muroja'ah sebelumnya!"
											);
										}

										setModalValidasiSetoran(true);
									}}
								>
									<span className="font-bold text-green-500 text-lg">✓</span>{" "}
								</Button>
							</div>
						</div>

						<div className="mt-1 md:block hidden">
							<Input
								placeholder="Cari surah yang mau di-muroja'ah berdasarkan nama surah-nya..."
								onChange={(e) => {
									setSearch(e.target.value);
								}}
								className="w-full"
							/>
						</div>
					</div>

					<div className="w-0 min-w-full">
						<div className="w-full overflow-x-auto md:max-w-full">
							<Table>
								<TableHeader className="sticky top-0">
									<TableRow className="border border-solid border-secondary bg-muted">
										<TableHead className="text-center">No</TableHead>
										<TableHead className="text-center whitespace-nowrap">
											Nama Surah
										</TableHead>
										<TableHead className="text-center whitespace-nowrap">
											Tanggal Muroja'ah
										</TableHead>
										<TableHead className="text-center whitespace-nowrap">
											Persyaratan Muroja'ah
										</TableHead>
										<TableHead className="text-center whitespace-nowrap">
											Dosen Yang Mengesahkan
										</TableHead>
										<TableHead className="text-center whitespace-nowrap">
											Status Muroja'ah
										</TableHead>
										<TableHead className="w-24 text-center whitespace-nowrap">
											<Checkbox
												className="data-[state=checked]:bg-green-500 mr-2 md:mr-0"
												checked={selectAll}
												onCheckedChange={handleSelectAll}
												disabled={dataCurrent?.length === 0 || isLoading}
											/>
										</TableHead>
									</TableRow>
								</TableHeader>

								<TableBody className="border border-solid border-secondary">
									{dataCurrent?.length === 0 && (
										<TableRow>
											<TableCell colSpan={7} className="text-center">
												{search
													? "❌ Maaf, surah yang anda cari tidak ditemukan nih!"
													: tabState === "sudah_setor"
													? "❌ Mahasiswa ini Belum Menyetor Satu pun Hafalan Surah"
													: "✔️ Mahasiswa ini Sudah Menyetor semua Hafalan Surah"}
											</TableCell>
										</TableRow>
									)}
									{isLoading && <TableLoadingSkeleton columns={7} rows={7} />}
									{loading ? (
										<TableLoadingSkeleton columns={7} rows={7} />
									) : (
										dataCurrent?.map(
											(surah: MahasiswaSetoran, index: number) => (
												<TableRow
													key={surah.id}
													className={
														index % 2 !== 0
															? "bg-secondary hover:bg-secondary"
															: "bg-background hover:bg-background"
													}
												>
													<TableCell className="text-center">
														{index + 1}.
													</TableCell>
													<TableCell className="whitespace-nowrap flex gap-2 justify-center items-center text-center">
														<span>
															{surah.nama}{" "}
															<span className="font-amiri">
																{surah.nama_arab && ` - ${surah.nama_arab}`}
															</span>
														</span>
														<div
															onClick={() =>
																handleNomorSurahChange(
																	surah.external_id,
																	surah.nama
																)
															}
															className="rounded-full hover:scale-110 active:scale-100 hover:bg-orange-400/25 flex justify-center items-center duration-300 cursor-pointer p-1 bg-orange-400/20 text-orange-600"
														>
															{openModalQuranIsLoading[surah.external_id] && (
																<Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
															)}
															<BookOpenIcon className="w-3.5 h-3.5" />
														</div>
													</TableCell>
													<TableCell className="text-center whitespace-nowrap">
														{surah.sudah_setor ? (
															<div>
																<p>
																	{new Date(surah.info_setoran.tgl_setoran)
																		.toLocaleDateString("id-ID", {
																			day: "2-digit",
																			month: "long",
																			year: "numeric",
																		})
																		.replace(
																			/^(\d+)\s(\w+)\s(\d+)$/,
																			"$1 $2, $3"
																		)}
																</p>
															</div>
														) : (
															<p>-</p>
														)}
													</TableCell>
													<TableCell className="text-center whitespace-nowrap">
														<div
															className={`py-1 px-3 rounded-2xl text-center text-white inline-block ${
																colourLabelingCategory(surah.label)[1]
															}`}
														>
															{colourLabelingCategory(surah.label)[0]}
														</div>
													</TableCell>
													<TableCell className="text-center whitespace-nowrap">
														{surah.sudah_setor
															? surah.info_setoran.dosen_yang_mengesahkan.nama
															: "-"}
													</TableCell>

													<TableCell className="text-center">
														{surah.sudah_setor ? (
															<div className="bg-green-600 px-3 py-1 text-white rounded-2xl inline-block">
																Selesai
															</div>
														) : (
															<div>-</div>
														)}
													</TableCell>
													<TableCell className="w-24 text-center">
														<Checkbox
															className="data-[state=checked]:bg-green-500 mr-2 md:mr-0"
															checked={
																selectAll ||
																tempDataCheck.some(
																	(item) =>
																		item.id_komponen_setoran === surah.id
																)
															}
															onCheckedChange={(checked) =>
																handleCheckBoxToTempData(
																	Boolean(checked),
																	surah.nama,
																	surah.id,
																	surah.info_setoran?.id || ""
																)
															}
														/>
													</TableCell>
												</TableRow>
											)
										)
									)}
								</TableBody>
							</Table>
						</div>
					</div>
				</div>
			</DashboardLayout>
		</>
	);
}

export default DetailMahasiswaSetoran;
