import { type FC, useState, useEffect } from "react";
import {
	Check,
	X,
	Eye,
	User,
	Award,
	Building,
	GraduationCap,
	FileText,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import APISeminarKP from "@/services/api/koordinator-kp/mahasiswa.service";

interface Dokumen {
	id: string;
	jenis_dokumen: string;
	link_path: string;
	tanggal_upload: string;
	status: string;
	komentar: string | null;
	id_pendaftaran_kp: string;
}

interface DokumenStep {
	step1: Dokumen[];
	step2: Dokumen[];
	step3: Dokumen[];
	step5: Dokumen[];
}

interface ValidasiPascaSeminarModalProps {
	isOpen: boolean;
	onClose: () => void;
	student: {
		id: number;
		nim: string;
		name: string;
		semester: number;
		status: string;
		dosenPembimbing: string;
		pembimbingInstansi: string;
		nilaiInstansi: string;
		dokumen?: DokumenStep;
	} | null;
}

interface DocumentState {
	id: string;
	isRejected: boolean;
	isAccepted: boolean;
	rejectionReason: string;
}

const ValidasiPascaSeminarModal: FC<ValidasiPascaSeminarModalProps> = ({
	isOpen,
	onClose,
	student,
}) => {
	const [documents, setDocuments] = useState<DocumentState[]>([]);
	const queryClient = useQueryClient();

	// Mutasi untuk validasi dokumen
	const validateMutation = useMutation({
		mutationFn: (id: string) => APISeminarKP.postValidasiDokumen({ id }),
		onError: (error) => {
			toast.error(`Gagal memvalidasi dokumen: ${(error as Error).message}`, {
				duration: 3000,
			});
		},
	});

	// Mutasi untuk menolak dokumen
	const rejectMutation = useMutation({
		mutationFn: ({ id, komentar }: { id: string; komentar: string }) =>
			APISeminarKP.postTolakDokumen({ id, komentar }),
		onError: (error) => {
			toast.error(`Gagal menolak dokumen: ${(error as Error).message}`, {
				duration: 3000,
			});
		},
	});

	useEffect(() => {
		if (student && isOpen) {
			console.log("Student data:", student);
			console.log("Dokumen step5:", student?.dokumen?.step5);

			const initialDocs =
				student?.dokumen?.step5?.map((doc) => {
					let isAccepted = false;
					let isRejected = false;
					let rejectionReason = "";

					// Tentukan status berdasarkan data dari API
					if (doc.status === "Divalidasi") {
						isAccepted = true;
					} else if (doc.status === "Ditolak" && doc.komentar) {
						isRejected = true;
						rejectionReason = doc.komentar || "";
					}

					return {
						id: doc.id,
						isRejected,
						isAccepted,
						rejectionReason,
					};
				}) || [];
			setDocuments(initialDocs);
		}
	}, [student, isOpen]);

	const handleReject = (docId: string) => {
		setDocuments((prev) =>
			prev.map((doc) =>
				doc.id === docId
					? {
							...doc,
							isRejected: !doc.isRejected,
							isAccepted: false,
							rejectionReason: doc.isRejected ? "" : doc.rejectionReason,
					  }
					: doc
			)
		);
	};

	const handleAccept = (docId: string) => {
		setDocuments((prev) =>
			prev.map((doc) =>
				doc.id === docId
					? {
							...doc,
							isAccepted: !doc.isAccepted,
							isRejected: false,
							rejectionReason: "",
					  }
					: doc
			)
		);
	};

	const handleReasonChange = (docId: string, reason: string) => {
		setDocuments((prev) =>
			prev.map((doc) =>
				doc.id === docId ? { ...doc, rejectionReason: reason } : doc
			)
		);
	};

	const handleViewDocument = (link: string) => {
		window.open(link, "_blank"); // Buka link di tab baru
	};

	const handleConfirm = async () => {
		const validationPromises = documents
			.filter((doc) => doc.isAccepted)
			.map((doc) => validateMutation.mutateAsync(doc.id));

		const rejectionPromises = documents
			.filter((doc) => doc.isRejected && doc.rejectionReason)
			.map((doc) =>
				rejectMutation.mutateAsync({
					id: doc.id,
					komentar: doc.rejectionReason,
				})
			);

		try {
			await Promise.all([...validationPromises, ...rejectionPromises]);

			toast.success(`Permohonan ${student?.name} berhasil dikonfirmasi`);

			queryClient.invalidateQueries({
				queryKey: ["koordinator-seminar-kp-detail", student?.nim],
			});
			queryClient.invalidateQueries({
				queryKey: ["koordinator-seminar-kp-dokumen"],
			});
			onClose(); // Tutup modal setelah berhasil
		} catch (error) {
			toast.error(`Terjadi kesalahan: ${(error as Error).message}`, {
				duration: 3000,
			});
		}
	};

	if (!student) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col p-0 rounded-xl bg-white dark:bg-gray-900">
				<div className="px-4 pt-12">
					<DialogHeader>
						<div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
							<div className="bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-emerald-600 dark:to-teal-500 p-3 text-white">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-1 w-10 h-10 flex items-center justify-center shadow-sm">
											<User className="text-emerald-600 dark:text-emerald-400 w-6 h-6" />
										</div>
										<div>
											<h3 className="font-semibold text-lg">{student.name}</h3>
											<div className="flex items-center gap-2 text-xs">
												<span className="bg-white/90 dark:bg-gray-800/90 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full shadow-sm text-center">
													Semester {student.semester}
												</span>
												<span className="flex items-center bg-emerald-600/40 dark:bg-emerald-700/40 px-2 py-0.5 rounded-full">
													<span className="bg-white dark:bg-gray-200 w-1.5 h-1.5 rounded-full mr-1"></span>
													{student.status}
												</span>
											</div>
										</div>
									</div>
									<div className="bg-white/90 dark:bg-gray-800/90 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-md text-xs font-medium shadow-sm">
										{student.nim}
									</div>
								</div>
							</div>

							<div className="grid grid-cols-3 gap-0 border-t border-gray-100 dark:border-gray-700">
								<div className="p-3 flex items-center gap-2 border-r border-gray-100 dark:border-gray-700">
									<Award className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
									<div>
										<div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
											Nilai Instansi
										</div>
										<div className="font-medium text-sm text-gray-800 dark:text-gray-200">
											{student.nilaiInstansi}
										</div>
									</div>
								</div>
								<div className="p-3 flex items-center gap-2 border-r border-gray-100 dark:border-gray-700">
									<Building className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
									<div>
										<div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
											Pembimbing Instansi
										</div>
										<div className="font-medium text-sm text-gray-800 dark:text-gray-200">
											{student.pembimbingInstansi}
										</div>
									</div>
								</div>
								<div className="p-3 flex items-center gap-2">
									<GraduationCap className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
									<div>
										<div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
											Dosen Pembimbing
										</div>
										<div className="font-medium text-sm text-gray-800 dark:text-gray-200">
											{student.dosenPembimbing}
										</div>
									</div>
								</div>
							</div>
						</div>
					</DialogHeader>
				</div>

				<div className="overflow-y-auto flex-1 px-3 bg-gray-50 dark:bg-gray-900">
					<div className="py-4">
						<h3 className="text-sm font-medium flex items-center mb-3 text-gray-600 dark:text-gray-300">
							<FileText className="w-4 h-4 mr-2 text-emerald-500 dark:text-emerald-400" />
							Validasi Berkas Pendaftaran Seminar KP Mahasiswa
						</h3>

						<div className="space-y-2">
							{student.dokumen?.step5 && student.dokumen.step5.length > 0 ? (
								student.dokumen.step5.map((doc) => {
									const docState = documents.find((d) => d.id === doc.id);
									return (
										<div
											key={doc.id}
											className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
										>
											<div className="border-b border-gray-100 dark:border-gray-700 p-2.5 bg-gray-50 dark:bg-gray-800/80">
												<p className="font-medium text-xs text-gray-600 dark:text-gray-300 flex items-center">
													<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-2"></span>
													{getNamaDokumen(doc.jenis_dokumen)}
												</p>
												<p className="text-xs text-gray-500 dark:text-gray-400">
													Status: {doc.status || "Belum Diproses"}
												</p>
											</div>
											<div className="p-2.5">
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 truncate max-w-lg">
														<FileText className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
														<span className="truncate">{doc.link_path}</span>
													</div>
													<div className="flex gap-1">
														<Button
															size="sm"
															variant="ghost"
															className="h-6 w-6 rounded-full p-0 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
															onClick={() => handleViewDocument(doc.link_path)}
														>
															<Eye className="h-3.5 w-3.5" />
														</Button>
														<Button
															size="sm"
															variant="ghost"
															className={`h-6 w-6 rounded-full p-0 ${
																docState?.isRejected
																	? "text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/50"
																	: "text-gray-500 dark:text-gray-400"
															} hover:text-red-500 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 ${
																doc.status === "Divalidasi"
																	? "opacity-50 cursor-not-allowed"
																	: ""
															}`}
															onClick={() =>
																doc.status !== "Divalidasi" &&
																handleReject(doc.id)
															}
															disabled={doc.status === "Divalidasi"}
														>
															<X className="h-3.5 w-3.5" />
														</Button>
														<Button
															size="sm"
															variant="ghost"
															className={`h-6 w-6 rounded-full p-0 ${
																docState?.isAccepted
																	? "text-emerald-500 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50"
																	: "text-gray-500 dark:text-gray-400"
															} hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50`}
															onClick={() => handleAccept(doc.id)}
														>
															<Check className="h-3.5 w-3.5" />
														</Button>
													</div>
												</div>
												<div
													className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out ${
														docState?.isRejected
															? "max-h-32 opacity-100"
															: "max-h-0 opacity-0"
													}`}
												>
													<Textarea
														placeholder="Masukkan alasan penolakan..."
														value={docState?.rejectionReason || ""}
														onChange={(e) =>
															handleReasonChange(doc.id, e.target.value)
														}
														className="w-full text-sm border-gray-200 dark:border-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
													/>
												</div>
											</div>
										</div>
									);
								})
							) : (
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Tidak ada dokumen yang tersedia untuk divalidasi.
								</p>
							)}
						</div>
					</div>
				</div>

				<div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800 p-3 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2 rounded-b-xl">
					<Button
						className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 hover:from-emerald-600 hover:to-teal-600 dark:hover:from-emerald-500 dark:hover:to-teal-500 border-0 h-8 text-xs px-4 rounded-sm shadow-sm flex items-center"
						onClick={handleConfirm}
					>
						Konfirmasi
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

const getNamaDokumen = (jenis: string): string => {
	const names: Record<string, string> = {
		BERITA_ACARA_SEMINAR: "Berita Acara Seminar KP",
		LEMBAR_PENGESAHAN_KP: "Lembar Pengesahan KP",
		DAFTAR_HADIR_SEMINAR: "Daftar Hadir Seminar KP",
		REVISI_LAPORAN_TAMBAHAN: "Revisi Laporan Tambahan",
		SISTEM_KP_FINAL: "Sistem KP Final",
	};
	return names[jenis] || "Dokumen Tidak Diketahui";
};

export default ValidasiPascaSeminarModal;
