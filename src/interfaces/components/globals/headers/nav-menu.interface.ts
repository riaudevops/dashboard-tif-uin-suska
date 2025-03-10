export interface NavMenuProps {
  [key: string]: NavMenuItemsProps[];
}

export interface NavMenuItemsProps {
  label: string;
  location_target: string;
}
