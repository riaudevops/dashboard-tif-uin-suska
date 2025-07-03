import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UbahTanggalPendaftaranKPInterface } from "@/interfaces/service/api/daftar-kp/koordinator-kp-service.interface";
import APIDaftarKP from "@/services/api/koordinator-kp/daftar-kp.service";
import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";

function OptionPage() {
	const [tanggalMulaiPendaftaran, setTanggalMulaiPendaftaran] =
		useState<string>("");
	const [tanggalAkhirPendaftaran, setTanggalAkhirPendaftaran] =
		useState<string>("");
	const [tanggalMulaiPendaftaranLanjut, setTanggalMulaiPendaftaranLanjut] =
		useState<string>("");
	const [tanggalAkhirPendaftaranLanjut, setTanggalAkhirPendaftaranLanjut] =
		useState<string>("");

	const tanggalKPMutation = useMutation({
		mutationFn: (data: UbahTanggalPendaftaranKPInterface) =>
			APIDaftarKP.ubahTanggalPendaftaranKP(data).then((res) => res.data),
		onSuccess: () => {
			toast.success("Berhasil mengirim tanggal daftar kerja praktik");
		},
		onError: () => {
			toast.error("Gagal mengirim tanggal daftar kerja praktik");
		},
	});

	async function handleOnSubmitTanggalPendaftaranKP(
		e: FormEvent<HTMLFormElement>,
		type: "Regular" | "Lanjut"
	) {
		e.preventDefault();
		const object = new FormData(e.currentTarget);
		const data = Object.fromEntries(object.entries());
		const tanggalMulaiPendaftaranKp = new Date(
			type === "Regular"
				? (data.tanggalMulaiPendaftaranKp as string)
				: (data.tanggalMulaiPendaftaranLanjutKp as string)
		).toISOString();
		const tanggalTerakhirPendaftaranKp = new Date(
			type === "Regular"
				? (data.tanggalTerakhirPendaftaranKp as string)
				: (data.tanggalTerakhirPendaftaranLanjutKp as string)
		).toISOString();
		tanggalKPMutation.mutate({
			tanggalMulai: tanggalMulaiPendaftaranKp,
			tanggalTerakhir: tanggalTerakhirPendaftaranKp,
			type,
		});
	}

	return (
		<DashboardLayout>
			<Card className="shadow-lg p-2">
				<CardHeader>
					<CardTitle className="font-bold text-lg tracking-wide">
						Pendaftaran Kerja praktik
					</CardTitle>
				</CardHeader>
				<CardContent>
					<h3 className="mt-1 mb-3 font-bold tracking-wide">
						Tanggal Pendaftaran Kerja praktik Reguler
					</h3>
					<form
						className="flex flex-col gap-2 mb-4"
						onSubmit={(e) => handleOnSubmitTanggalPendaftaranKP(e, "Regular")}
					>
						<Label htmlFor="tanggal-mulai-pendaftaran-kp">
							Tanggal Mulai :{" "}
						</Label>
						<Input
							className="border[1px] border-gray-300 rounded-lg p-1"
							value={tanggalMulaiPendaftaran}
							onChange={(e) =>
								setTanggalMulaiPendaftaran(e.currentTarget.value.toString())
							}
							type="date"
							id="tanggal-mulai-pendaftaran-kp"
							name="tanggalMulaiPendaftaranKp"
						/>
						<Label htmlFor="tanggal-terakhir-pendaftaran-kp">
							Tanggal Terakhir :{" "}
						</Label>
						<Input
							className="border[1px] border-gray-300 rounded-lg p-1"
							value={tanggalAkhirPendaftaran}
							onChange={(e) =>
								setTanggalAkhirPendaftaran(e.currentTarget.value.toString())
							}
							type="date"
							id="tanggal-terakhir-pendaftaran-kp"
							name="tanggalTerakhirPendaftaranKp"
						/>
						<Button className="rounded-lg border-[1px] border-gray-300 p-2">
							Submit
						</Button>
					</form>
					<h3 className="mt-1 mb-3 font-bold tracking-wide">
						Tanggal Pendaftaran Kerja praktik Lanjut
					</h3>
					<form
						className="flex flex-col gap-2"
						onSubmit={(e) => handleOnSubmitTanggalPendaftaranKP(e, "Lanjut")}
					>
						<Label htmlFor="tanggal-mulai-pendaftaran-lanjut-kp">
							Tanggal Mulai :{" "}
						</Label>
						<Input
							className="border[1px] border-gray-300 rounded-lg p-1"
							value={tanggalMulaiPendaftaranLanjut}
							onChange={(e) =>
								setTanggalMulaiPendaftaranLanjut(
									e.currentTarget.value.toString()
								)
							}
							type="date"
							id="tanggal-mulai-pendaftaran-lanjut-kp"
							name="tanggalMulaiPendaftaranLanjutKp"
						/>
						<Label htmlFor="tanggal-akhir-pendaftaran-lanjut-kp">
							Tanggal Terakhir :{" "}
						</Label>
						<Input
							className="border[1px] border-gray-300 rounded-lg p-1"
							value={tanggalAkhirPendaftaranLanjut}
							onChange={(e) =>
								setTanggalAkhirPendaftaranLanjut(
									e.currentTarget.value.toString()
								)
							}
							type="date"
							id="tanggal-akhir-pendaftaran-lanjut-kp"
							name="tanggalTerakhirPendaftaranLanjutKp"
						/>
						<Button className="rounded-lg border-[1px] border-gray-300 p-2">
							Submit
						</Button>
					</form>
				</CardContent>
			</Card>
		</DashboardLayout>
	);
}

export default OptionPage;