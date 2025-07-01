import * as React from "react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { SideBarHeader } from "./side-bar-header";
import { SideBarFooter } from "./side-bar-footer";
import { SideBarNavMenu } from "./side-bar-nav-menu";
import { SideBarNavMenuItems } from "@/constants/components/globals/sidebars/side-bar-nav-menu-item.constant";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "react-oidc-context";
import { getRoles } from "@/helpers/auth.helper";
import { capitalizeFirstLetter } from "@/helpers/global.helper";
import { UserProfileProps } from "@/interfaces/components/globals/sidebars/app-sidebar.interface";
import { SideBarNavMenuGroupProps } from "@/interfaces/components/globals/sidebars/side-bar-nav-menu.interface";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const [user, setUser] = React.useState<UserProfileProps>({
		name: "Anonymous User",
		email: "unknown@unknown.com",
		avatar: "/avatars/shadcn.jpg",
	});
	const [roles, setRoles] = React.useState<string[]>([]);
	const auth = useAuth();

	React.useEffect(() => {
		setUser({
			name: auth.user?.profile.name || "Anonymous User",
			email: auth.user?.profile.email || "unknown@unknown.com",
			avatar: auth.user?.profile.picture || "/avatars/shadcn.jpg",
		});
		const token = auth.user?.access_token;
		const userRole = getRoles({ token });
		let rolesToRemove = ["offline_access", "uma_authorization", "default-roles-tif"];
		let updatedRoles = userRole.filter(role => !rolesToRemove.includes(role));		
		if (token) setRoles(updatedRoles);
	}, []);

	const [roleBasedSideBarNavMenuItems, setRoleBasedSideBarNavMenuItems] =
		React.useState<SideBarNavMenuGroupProps[]>([]);
	React.useEffect(() => {
		const combined = roles.reduce((acc: SideBarNavMenuGroupProps[], role) => {
			if (SideBarNavMenuItems[role]) {
				return acc.concat(SideBarNavMenuItems[role]);
			}
			return acc;
		}, []);
		setRoleBasedSideBarNavMenuItems(combined);
	}, [roles]);

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader className="mt-1.5">
				<SideBarHeader
					role={capitalizeFirstLetter(
						roles.join(" & ") || "No Role Specified"
					)}
				/>
			</SidebarHeader>
			<Separator orientation="horizontal" className="px-4" />
			<SidebarContent className="gap-0">
				<SideBarNavMenu sideBarNavMenuItems={roleBasedSideBarNavMenuItems} />
			</SidebarContent>
			<SidebarFooter>
				<SideBarFooter {...user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}