import { Bell, ChevronsUpDown, Edit, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { UserProfileProps } from "@/interfaces/components/globals/sidebars/app-sidebar.interface";
import { useAuth } from "react-oidc-context";
import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function SideBarFooter({ name, email, avatar }: UserProfileProps) {
	const auth = useAuth();
	const { isMobile } = useSidebar();
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage src={avatar} alt={name} />
								{/* GET USER 2 WORD FALLBACK NAME BY NAME */}
								<AvatarFallback className="rounded-lg">
									{name
										.split(" ")
										.slice(0, 2)
										.map((word) => word.charAt(0))
										.join("")}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">{name}</span>
								<span className="truncate text-xs">{email}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg ml-3"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage src={avatar} alt={name} />
									{/* GET USER 2 WORD FALLBACK NAME BY NAME */}
									<AvatarFallback className="rounded-lg">
										{name
											.split(" ")
											.slice(0, 2)
											.map((word) => word.charAt(0))
											.join("")}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{name}</span>
									<span className="truncate text-xs">{email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{/* FOR EDIT PROFILE */}
						<DropdownMenuItem className="cursor-pointer">
							<Bell />
							Notifikasi
						</DropdownMenuItem>
						<DropdownMenuItem className="cursor-pointer">
							<Edit />
							Perbarui Profil
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<AlertDialogTrigger className="cursor-pointer hover:bg-muted w-full relative flex select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0">
							<LogOut color="#dc2626" />
							<span className="text-red-600 font-semibold">Keluar</span>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Apakah kamu yakin mau keluar?
								</AlertDialogTitle>
								<AlertDialogDescription>
									Jika Anda yakin ingin keluar, sesi anda untuk akun ini akan
									terhapus dan anda akan diarahkan kembali ke halaman awal.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Gajadi deh</AlertDialogCancel>
								<AlertDialogAction
									className="bg-destructive text-destructive-foreground hover:bg-destructive/85"
									onClick={() => auth.signoutRedirect()}
								>
									Iya, saya yakin
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
