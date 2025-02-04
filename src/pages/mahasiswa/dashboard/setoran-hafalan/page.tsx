import HeaderComponent from "@/components/globals/headers/header";
import { AppSidebar } from "@/components/globals/sidebar/app-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

export default function MahasiswaDashboardPage() {
	const location = useLocation();
	const [breadcrumbs, setBreadcrumbs] = useState<
		{ name: string; link: string }[]
	>([]);

	useEffect(() => {
		const pathParts = location.pathname
			.split("/")
			.filter((part) => part !== "");

		// hanya ambil data ke index ke 2 dst
		const newPathParts = pathParts.splice(2);


		setBreadcrumbs(
			newPathParts.map((part, index) => ({
				name: part.replace("-", " "),
				link: `/${pathParts.slice(0, index + 1).join("/")}`,
			}))
		);
	}, []);

	return (
		<>
			<HeaderComponent />
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
						<div className="flex items-center gap-2 px-4">
							<SidebarTrigger className="-ml-1" />
							<Separator orientation="vertical" className="mr-2 h-4" />
							<Breadcrumb>
								<BreadcrumbList>
									{breadcrumbs.map((breadcrumb, index) => (
										<BreadcrumbItem key={index}>
											{index === breadcrumbs.length - 1 ? (
												<BreadcrumbPage>
													{breadcrumb.name.charAt(0).toUpperCase() +
														breadcrumb.name.slice(1)}
												</BreadcrumbPage>
											) : (
												<BreadcrumbLink href={breadcrumb.link}>
													{breadcrumb.name.charAt(0).toUpperCase() +
														breadcrumb.name.slice(1)}
												</BreadcrumbLink>
											)}
											{index < breadcrumbs.length - 1 && (
												<BreadcrumbSeparator className="hidden md:block" />
											)}
										</BreadcrumbItem>
									))}
								</BreadcrumbList>
							</Breadcrumb>
						</div>
					</header>
					<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
						<div className="grid auto-rows-min gap-4 md:grid-cols-3">
							<div className="aspect-video rounded-xl bg-muted/50" />
							<div className="aspect-video rounded-xl bg-muted/50" />
							<div className="aspect-video rounded-xl bg-muted/50" />
						</div>
						<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
					</div>
				</SidebarInset>
			</SidebarProvider>
		</>
	);
}
