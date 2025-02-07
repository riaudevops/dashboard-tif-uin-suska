import { LucideProps } from "lucide-react";

export interface SideBarNavMenuItemsProps {
	[key: string]: SideBarNavMenuGroupProps[];
}

export interface SideBarNavMenuGroupProps {
	label: string;
	menus: SideBarNavMenuEachItemProps[];
}

export interface SideBarNavMenuEachItemProps {
	title: string;
	url: string;
	icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
	isActive?: boolean;
	items?: SideBarNavMenuEachItemProps[];
}